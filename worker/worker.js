const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { Worker } = require("bullmq");
const IORedis = require("ioredis");

const ffmpegLog = false;

// Initialize Redis connection with required options
const connection = new IORedis({
  maxRetriesPerRequest: null, // Set this explicitly to null
  enableReadyCheck: false, // Optional: Prevent ready checks for faster setup
});

// Create a worker instance
const worker = new Worker("encode-video", handleJob, { connection });

worker.on("failed", (job, err) => {
  console.error(`\tThất bại`);
});

worker.on("completed", (job) => {
  console.log(`\tThành công`);
});

async function handleJob(job) {
  const { fileName, folderPath } = job.data;
  console.log(`\tBắt đầu chuyển đổi video: ${fileName}`);
  let dir =
    "../uploads/" + path.basename(fileName, path.extname(fileName));
  const fullPath = path.join(folderPath, fileName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  await new Promise((resolve, reject) => {
    ffmpeg(fullPath) // cần đảm bảo là máy đã cài đặt ffmpeg trước
      .addOption("-hls_time", "5")
      .addOption("-hls_list_size", "0")
      .addOption("-hls_segment_filename", `${dir}/output%03d.ts`)
      .output(`${dir}/output.m3u8`)
      .on("stderr", (d) => ffmpegLog && console.log(`\t${d}`)) // hiển thị log ra console khi ffmpeg hoạt động
      .on("error", (err) => {
        console.error(`\tFFmpeg error for ${fileName}:`, err);
        reject(err);
      })
      .on("end", () => {
        // console.log(`\tFinished converting video: ${fileName}`);
        resolve();
      })
      .run();
  });
}

console.log("ffmpeg worker đã sẵn sàng");
