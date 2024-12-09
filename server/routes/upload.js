const express = require('express');
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const { S3Client } = require('@aws-sdk/client-s3');
require("dotenv").config();
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const uploadControllers = require('../app/controllers/UploadController');

// const s3 = new S3Client({
//     region:  process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//     sslEnabled: false,
//     s3ForcePathStyle: true,
//     signatureVersion: 'v4',
//   });


// const upload = multer({
//     storage: multerS3({
//       s3,
//       bucket: process.env.BUCKET_INPUT,
//       metadata: (req, file, cb) => {
//         cb(null, { fieldName: file.fieldname });
//       },
//       key: (req, file, cb) => {
//         cb(null, `videos/${Date.now()}-${file.originalname}`);
//       },
//     }),
//     limits: { fileSize: 100 * 1024 * 1024 }, // Limit to 100 MB
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype.startsWith("video/")) {
//         cb(null, true);
//       } else {
//         cb(new Error("Invalid file type, only videos are allowed!"), false);
//       }
//     },
//   });

const uploadDir = "../uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extract file extension
    const name = path.basename(file.originalname, ext); // Extract file name without extension
    const randomDigits = Math.floor(100 + Math.random() * 900); // Generate random 3 digits
    cb(null, `${name}_${randomDigits}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "video/mp4",
    "video/x-matroska", // MKV
    "video/avi", // AVI
    "video/quicktime", // MOV
    "video/x-flv", // FLV
    "video/webm", // WebM
    "video/x-ms-wmv", // WMV
    "video/3gpp", // 3GP
    "video/m4v", // M4V
  ];

  // Check if the file's MIME type is allowed
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error(
        "Invalid file type. Supported formats are: MP4, MKV, AVI, MOV, FLV, WebM, WMV, 3GP, M4V."
      ),
      false
    );
  }
};

// Set the file size limit to 1GB (1GB = 1,073,741,824 bytes)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 1024 },
});

// upload section routes
router.post('/', upload.fields([
  { name: 'video', maxCount: 1 },  // Expect a single video file
  { name: 'name', maxCount: 1 },
  { name: 'slug', maxCount: 1 },
  { name: 'origin_name', maxCount: 1 },
  { name: 'content', maxCount: 1 },
  { name: 'type', maxCount: 1 },
  { name: 'status', maxCount: 1 },
  { name: 'poster_url', maxCount: 1 },
  { name: 'thumb_url', maxCount: 1 },
  { name: 'trailer_url', maxCount: 1 },
  { name: 'time', maxCount: 1 },
  { name: 'episode_current', maxCount: 1 },
  { name: 'episode_total', maxCount: 1 },
  { name: 'quality', maxCount: 1 },
  { name: 'lang', maxCount: 1 },
  { name: 'notify', maxCount: 1 },
  { name: 'showtimes', maxCount: 1 },
  { name: 'year', maxCount: 1 },
  { name: 'actor', maxCount: 10 },  // You can have multiple actors, so maxCount is 10 (or whatever you prefer)
  { name: 'director', maxCount: 10 },
  { name: 'category', maxCount: 10 },
  { name: 'country', maxCount: 10 },
  // Add more fields if you have additional files, e.g., poster images
]), uploadControllers.uploadVideos)

module.exports = router; 