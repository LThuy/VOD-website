const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");
require("dotenv").config();

// Initialize S3 Clients (one for input, one for output)
const inputS3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_INPUT,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_INPUT,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const outputS3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const redisCloudConfig = {
        host: process.env.HOST_REDIS, // Redis Cloud host
        port: process.env.PORT_REDIS, // Redis Cloud port
        password: process.env.PASSWORD_REDIS, // Redis Cloud password
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      };

// Redis connection setup
const connection = new IORedis(redisCloudConfig);

let isProcessing = false; // Global flag to prevent duplicate processing

const worker = new Worker(
  "encode-video",
  async (job) => {
    const jobId = job.id;
    console.log(`[${new Date().toISOString()}] Received job: ${jobId}`);
    
    if (isProcessing) {
      console.log(`[${new Date().toISOString()}] Job ${jobId}: Processing already in progress, skipping`);
      return;
    }
    
    isProcessing = true;
    console.log(`[${new Date().toISOString()}] Job ${jobId}: Starting processing`);
    
    try {
      await handleJob(job);
      console.log(`[${new Date().toISOString()}] Job ${jobId}: Processing completed successfully`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Job ${jobId}: Processing failed:`, error);
      throw error;
    } finally {
      isProcessing = false;
      console.log(`[${new Date().toISOString()}] Job ${jobId}: Released processing lock`);
      console.log(`[${new Date().toISOString()}] FFmpeg worker is ready.`);
    }
  },
  { 
    connection,
    concurrency: 1,
    lockDuration: 60000
  }
);

worker.on("failed", (job, err) => {
  console.error(`[${new Date().toISOString()}] Job ${job.id} failed:`, err);
});

async function handleJob(job) {
  const { files = [] } = job.data;
  const videoData = files.find((file) => file.type === "video") || {};
  const thumbData = files.find((file) => file.type === "thumbnail") || {};
  const posterData = files.find((file) => file.type === "poster") || {};
  const slugData = files.find((file) => file.type === "slug") || {};

  const fileName = videoData.fileName;
  const baseName = path.basename(fileName, path.extname(fileName));
  const outputS3KeyPrefix = `videos/${baseName}`;

  console.log(`[${new Date().toISOString()}] Job ${job.id}: Processing video ${fileName}`);

  // Define video qualities
  const qualities = [
    { name: "360p", resolution: "640x360", bitrate: "800k" },
    { name: "480p", resolution: "854x480", bitrate: "1400k" },
    // { name: "720p", resolution: "1280x720", bitrate: "2800k" },
  ];

  try {
    // Process videos sequentially
    for (const quality of qualities) {
      console.log(`[${new Date().toISOString()}] Job ${job.id}: Processing ${quality.name}`);
      await processVideoFromS3(
        fileName,
        `${outputS3KeyPrefix}/${quality.name}`,
        quality,
        job.id
      );
    }

    // Generate master playlist
    console.log(`[${new Date().toISOString()}] Job ${job.id}: Generating master playlist`);
    const masterPlaylistContent = generateMasterPlaylistContent(qualities);
    await uploadBufferToS3(
      Buffer.from(masterPlaylistContent),
      `${outputS3KeyPrefix}/master.m3u8`
    );

    // Handle additional files
    if (thumbData.fileName) {
      console.log(`[${new Date().toISOString()}] Job ${job.id}: Processing thumbnail`);
      await uploadFileToS3(
        thumbData.s3Key,
        `${outputS3KeyPrefix}/thumb/${thumbData.fileName}`
      );
    }

    if (posterData.fileName) {
      console.log(`[${new Date().toISOString()}] Job ${job.id}: Processing poster`);
      await uploadFileToS3(
        posterData.s3Key,
        `${outputS3KeyPrefix}/poster/${posterData.fileName}`
      );
    }

    if (slugData?.value) {
      console.log(`[${new Date().toISOString()}] Job ${job.id}: Processing slug`);
      await sendSlugDataToLocalServer(slugData.value);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Job ${job.id}: Error in handleJob:`, error);
    throw error;
  }
}

async function processVideoFromS3(inputS3Key, outputS3Key, quality, jobId) {
  const tempDir = path.join(process.env.TEMP_DIR || '/tmp', `hls-${Date.now()}-${quality.name}`);
  console.log(`[${new Date().toISOString()}] Job ${jobId}: Created temp dir for ${quality.name}: ${tempDir}`);

  try {
    await fs.promises.mkdir(tempDir, { recursive: true });
    const inputStream = await getS3FileStream(inputS3Key);

    await new Promise((resolve, reject) => {
      ffmpeg(inputStream)
        .size(quality.resolution)
        .videoBitrate(quality.bitrate)
        .addOption('-c:v', 'libx264')
        .addOption('-preset', 'fast')
        .addOption('-c:a', 'aac')
        .addOption('-ar', '48000')
        .addOption('-b:a', '128k')
        .addOption('-hls_time', '5')
        .addOption('-hls_list_size', '0')
        .addOption('-hls_segment_filename', path.join(tempDir, 'segment%03d.ts'))
        .output(path.join(tempDir, 'playlist.m3u8'))
        .on('start', cmd => {
          console.log(`[${new Date().toISOString()}] Job ${jobId}: FFmpeg started for ${quality.name}`);
        })
        .on('progress', progress => {
          console.log(`[${new Date().toISOString()}] Job ${jobId}: ${quality.name} at ${progress.percent}%`);
        })
        .on('end', () => {
          console.log(`[${new Date().toISOString()}] Job ${jobId}: FFmpeg completed for ${quality.name}`);
          resolve();
        })
        .on('error', err => {
          console.error(`[${new Date().toISOString()}] Job ${jobId}: FFmpeg error for ${quality.name}:`, err);
          reject(err);
        })
        .run();
    });

    // Upload generated files to S3
    const files = await fs.promises.readdir(tempDir);
    for (const file of files) {
      const fileContent = await fs.promises.readFile(path.join(tempDir, file));
      await uploadBufferToS3(fileContent, `${outputS3Key}/${file}`);
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Job ${jobId}: Error processing ${quality.name}:`, error);
    throw error;
  } finally {
    try {
      await fs.promises.rm(tempDir, { recursive: true });
      console.log(`[${new Date().toISOString()}] Job ${jobId}: Cleaned up temp dir for ${quality.name}`);
    } catch (cleanupErr) {
      console.error(`[${new Date().toISOString()}] Job ${jobId}: Error cleaning temp dir for ${quality.name}:`, cleanupErr);
    }
  }
}

function generateMasterPlaylistContent(qualities) {
  return "#EXTM3U\n#EXT-X-VERSION:3\n" + 
    qualities
      .map(({ name, resolution, bitrate }) => {
        const bandwidth = parseInt(bitrate.replace('k', '000'));
        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${name}/playlist.m3u8`;
      })
      .join("\n");
}

async function uploadBufferToS3(buffer, key) {
  const uploadParams = {
    Bucket: process.env.BUCKET_OUTPUT,
    Key: key,
    Body: buffer,
    ContentType: key.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/MP2T'
  };
  
  await outputS3Client.send(new PutObjectCommand(uploadParams));
  console.log(`[${new Date().toISOString()}] Uploaded ${key} to S3`);
}

async function uploadFileToS3(inputS3Key, outputS3Key) {
  try {
    // Get file from input S3
    const getCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET_INPUT,
      Key: inputS3Key
    });

    const response = await inputS3Client.send(getCommand);
    const fileBuffer = await response.Body.transformToByteArray();

    // Upload buffer to output S3
    const uploadParams = {
      Bucket: process.env.BUCKET_OUTPUT,
      Key: outputS3Key,
      Body: fileBuffer
    };

    await outputS3Client.send(new PutObjectCommand(uploadParams));
    console.log(`[${new Date().toISOString()}] Uploaded ${inputS3Key} to ${outputS3Key}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error uploading ${inputS3Key}:`, error);
    throw error;
  }
}

async function getS3FileStream(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_INPUT,
    Key: key
  });

  const response = await inputS3Client.send(command);
  return response.Body;
}

async function sendSlugDataToLocalServer(slug) {
  try {
    await axios.post("http://localhost:5000/film/setActive", { slug });
    console.log(`[${new Date().toISOString()}] Sent slug data: ${slug}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error sending slug data:`, error.response?.data || error.message);
    throw error;
  }
}

console.log(`[${new Date().toISOString()}] FFmpeg worker is ready.`);