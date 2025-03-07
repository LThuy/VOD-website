const path = require("path");
const fs = require("fs").promises;
const { Readable } = require('stream');
const { spawn } = require("child_process");
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");
require("@aws-sdk/crc64-nvme-crt");
require("dotenv").config();

// S3 Client Configuration
const createS3Client = (accessKeyId, secretAccessKey) => new S3Client({
  region: process.env.AWS_REGION,
  credentials: { accessKeyId, secretAccessKey },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const inputS3Client = createS3Client(
  process.env.AWS_ACCESS_KEY_INPUT, 
  process.env.AWS_SECRET_ACCESS_KEY_INPUT
);

const outputS3Client = createS3Client(
  process.env.AWS_ACCESS_KEYIN, 
  process.env.AWS_SECRET_ACCESS_KEY
);

// Redis Connection Configuration
const redisConfig = {
  host: process.env.HOST_REDIS,
  port: process.env.PORT_REDIS,
  password: process.env.PASSWORD_REDIS,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};
const redisConnection = new IORedis(redisConfig);

// Video Processing Configuration
const VIDEO_QUALITIES = [
  { name: "480p", resolution: "854x480", bitrate: "1400k" },
  { name: "720p", resolution: "1280x720", bitrate: "2800k" },
  { name: "1080p", resolution: "1920x1080", bitrate: "5000k" },
];
class VideoProcessor {
  constructor() {
    this.isProcessing = false;
  }

  async processJob(job) {
    if (this.isProcessing) {
      console.log(`Job ${job.id}: Processing already in progress, skipping`);
      return;
    }

    this.isProcessing = true;
    console.log(`Job ${job.id}: Starting video processing`);

    try {
      const { files = [] } = job.data;
      const videoFile = files.find(f => f.type === "video") || {};
      const slugData = files.find(f => f.type === 'slug');

      if (slugData?.value) {
        await this.updateStatusVideo(slugData.value, "On processing");
      }
      
      if (!videoFile.fileName) {
        throw new Error('No video file found in job data');
      }

      const baseName = path.basename(videoFile.fileName, path.extname(videoFile.fileName));
      const outputPrefix = `videos/${baseName}`;

      await this.processVideoQualities(videoFile.fileName, outputPrefix, job.id, slugData.value);
      await this.generateMasterPlaylist(outputPrefix, slugData.value);
      await this.processAdditionalFiles(files, outputPrefix, job.id, slugData.value);
    } catch (error) {
      console.error(`Job ${job.id}: Processing failed:`, error);
      throw error;
    } finally {
      this.isProcessing = false;
      console.log(`Job ${job.id}: Processing completed`);
    }
  }

  async processVideoQualities(inputFileName, outputPrefix, jobId, slug) {
    for (const quality of VIDEO_QUALITIES) {
      await this.updateStatusVideo(slug, `${quality.name} on processing`);
      const tempDir = await this.createTempDirectory(quality.name);
      try {
        await this.runFFmpegConversion(
          inputFileName, 
          tempDir, 
          quality, 
          jobId
        );
        await this.uploadProcessedFiles(tempDir, `${outputPrefix}/${quality.name}`, jobId);
      } catch (error) {
        console.error(`Quality ${quality.name} processing failed:`, error);
        throw error;
      } finally {
        await this.cleanupTempDirectory(tempDir, quality.name, slug);
      }
    }
  }

  async createTempDirectory(qualityName) {
    const tempDir = path.join(
      process.env.TEMP_DIR || '/tmp', 
      `hls-${Date.now()}-${qualityName}`
    );
    await fs.mkdir(tempDir, { recursive: true });
    return tempDir;
  }

  async runFFmpegConversion(inputFileName, tempDir, quality, jobId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Get S3 object
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_INPUT,
          Key: inputFileName
        });
        const response = await inputS3Client.send(command);

        // Convert response body to buffer
        const inputBuffer = await response.Body.transformToByteArray();

        // Write buffer to a temporary input file
        const tempInputFile = path.join(tempDir, 'input_video');
        await fs.writeFile(tempInputFile, inputBuffer);

        const ffmpegProcess = spawn('ffmpeg', [
          '-i', tempInputFile,
          '-vf', `scale=${quality.resolution}`,
          '-b:v', quality.bitrate,
          '-c:v', 'libx264',
          '-preset', 'fast',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-hls_time', '5',
          '-hls_list_size', '0',
          `-hls_segment_filename`, path.join(tempDir, 'segment%03d.ts'),
          path.join(tempDir, 'playlist.m3u8')
        ]);

        let errorOutput = '';
        ffmpegProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        ffmpegProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`FFmpeg conversion for ${quality.name} completed`);
            resolve();
          } else {
            console.error(`FFmpeg conversion failed with code ${code}`);
            console.error('Error output:', errorOutput);
            reject(new Error(`FFmpeg conversion failed: ${errorOutput}`));
          }
        });

        ffmpegProcess.on('error', (err) => {
          console.error('FFmpeg process error:', err);
          reject(err);
        });
      } catch (error) {
        console.error('Error preparing S3 input:', error);
        reject(error);
      }
    });
  }

  async uploadProcessedFiles(tempDir, outputS3Key, jobId) {
    const files = await fs.readdir(tempDir);
    for (const file of files) {
      // Skip the temporary input video file
      if (file === 'input_video') continue;

      const fileContent = await fs.readFile(path.join(tempDir, file));
      await this.uploadBufferToS3(
        fileContent, 
        `${outputS3Key}/${file}`,
        file.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/MP2T'
      );
    }
  }

  async generateMasterPlaylist(outputPrefix, slug) {
    const masterPlaylistContent = this.createMasterPlaylistContent();
    await this.uploadBufferToS3(
      Buffer.from(masterPlaylistContent),
      `${outputPrefix}/master.m3u8`,
      'application/vnd.apple.mpegurl'
    );
  }

  createMasterPlaylistContent() {
    return "#EXTM3U\n#EXT-X-VERSION:3\n" + 
      VIDEO_QUALITIES
        .map(({ name, resolution, bitrate }) => {
          const bandwidth = parseInt(bitrate.replace('k', '000'));
          return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${name}/playlist.m3u8`;
        })
        .join("\n");
  }

  async processAdditionalFiles(files, outputPrefix, jobId, slug) {
    const additionalFileTypes = [
      { type: 'thumbnail', subDir: 'thumb' },
      { type: 'poster', subDir: 'poster' }
    ];

    for (const { type, subDir } of additionalFileTypes) {
      const fileData = files.find(f => f.type === type);
      if (fileData?.fileName) {
        await this.uploadS3File(
          fileData.s3Key, 
          `${outputPrefix}/${subDir}/${fileData.fileName}`
        );
      }
    }

    const slugData = files.find(f => f.type === 'slug');
    if (slugData?.value) {
      await this.sendSlugToServer(slugData.value);
    }
  }

  async uploadS3File(inputS3Key, outputS3Key) {
    try {
      const response = await inputS3Client.send(
        new GetObjectCommand({
          Bucket: process.env.BUCKET_INPUT,
          Key: inputS3Key
        })
      );
      
      const fileBuffer = await response.Body.transformToByteArray();
      
      await outputS3Client.send(
        new PutObjectCommand({
          Bucket: process.env.BUCKET_OUTPUT,
          Key: outputS3Key,
          Body: fileBuffer
        })
      );
      
      console.log(`Uploaded ${inputS3Key} to ${outputS3Key}`);
    } catch (error) {
      console.error(`Error uploading ${inputS3Key}:`, error);
      throw error;
    }
  }

  async uploadBufferToS3(buffer, key, contentType) {
    await outputS3Client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_OUTPUT,
        Key: key,
        Body: buffer,
        ContentType: contentType
      })
    );
    console.log(`Uploaded ${key} to S3`);
  }

  async cleanupTempDirectory(tempDir, quality, slug) {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
      console.log(`Cleaned up temp directory: ${tempDir}`);
      await this.updateStatusVideo(slug, `${quality} done`);
    } catch (error) {
      console.error(`Error cleaning temp directory ${tempDir}:`, error);
    }
  }

  async sendSlugToServer(slug) {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/film/setActive`, 
        { slug }
      );
      console.log(`Sent slug data: ${slug}`);
    } catch (error) {
      console.error('Error sending slug data:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateStatusVideo(slug, status) {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/film/setStatus`, 
        { slug, status }
      );
      console.log(`Sent slug data: ${slug}`);
    } catch (error) {
      console.error('Error sending slug data:', error.response?.data || error.message);
      throw error;
    }
  }

}

// Worker Setup
const videoProcessor = new VideoProcessor();
const worker = new Worker(
  "encode-video",
  async (job) => await videoProcessor.processJob(job),
  { 
    connection: redisConnection,
    concurrency: 1,
    lockDuration: 60000
  }
);

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

console.log('FFmpeg worker is ready.');