const express = require('express');
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const {
  S3Client
} = require('@aws-sdk/client-s3');
require("dotenv").config();
const router = express.Router();
const fs = require("fs");
const path = require("path");
const {
  Queue
} = require("bullmq");
const IORedis = require("ioredis");

const uploadControllers = require('../app/controllers/UploadController');

// S3 Client Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_INPUT,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_INPUT,
  },
});


// Multer-S3 Configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_INPUT,
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: (req, file, cb) => {
      // Check if the folder name has already been generated for this request
      if (!req.folderName) {
        // Generate a random 4-digit integer
        const randomInt = Math.floor(1000 + Math.random() * 9000);

        // Extract the video file name from the `video` field in `req.files` if it exists
        if (file.fieldname === 'video') {
          const ext = path.extname(file.originalname); // File extension
          const originalName = path.basename(file.originalname, ext); // File name without extension
          const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9_-]/g, '_'); // Sanitize name

          // Create a unique folder name based on the video file
          req.folderName = `${randomInt}_${sanitizedOriginalName}`;
        }
      }

      // If folderName is still not defined (video field not processed first)
      if (!req.folderName) {
        cb(new Error('Folder name could not be generated because video file is missing.'));
        return;
      }

      // Construct the S3 key (path inside the bucket) for this file
      const ext = path.extname(file.originalname); // File extension
      const originalName = path.basename(file.originalname, ext); // File name without extension
      const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9_-]/g, '_'); // Sanitize name
      const s3Key = `videos/${req.folderName}/${Date.now()}-${sanitizedOriginalName}${ext}`;

      cb(null, s3Key);
    },
    limits: {
      fileSize: 2 * 1024 * 1024 * 1024
    }, // ✅ Set limit to 2GB
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ["video/mp4", "video/x-matroska", "video/webm", "image/jpeg", "image/png"];
      allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid file type"), false);
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 1024
  }, // Limit to 1GB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "video/mp4",
      "video/x-matroska",
      "video/avi",
      "video/quicktime",
      "video/x-flv",
      "video/webm",
      "video/x-ms-wmv",
      "video/3gpp",
      "video/m4v",
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/tiff",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only videos and images are allowed."), false);
    }
  },
});

// const uploadDir = "../uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Configure multer storage and file filter
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // Check if the randomDigits property exists on the request object
//     if (!req.randomDigits) {
//       req.randomDigits = Math.floor(100 + Math.random() * 900); // Generate random 3 digits once per request
//     }

//     const ext = path.extname(file.originalname); // Extract file extension
//     const name = path.basename(file.originalname, ext); // Extract file name without extension
//     cb(null, `${name}_${req.randomDigits}${ext}`);
//   },
// });


// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = [
//     "video/mp4",
//     "video/x-matroska", // MKV
//     "video/avi", // AVI
//     "video/quicktime", // MOV
//     "video/x-flv", // FLV
//     "video/webm", // WebM
//     "video/x-ms-wmv", // WMV
//     "video/3gpp", // 3GP
//     "video/m4v", // M4V
//     "image/jpg",  // JPG
//     "image/jpeg", // JPEG
//     "image/png",  // PNG
//     "image/webp", // WebP
//     "image/svg+xml", // SVG
//     "image/tiff", // TIFF
//   ];

//   // Check if the file's MIME type is allowed
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true); // Accept file
//   } else {
//     cb(
//       new Error(
//         "Invalid file type. Supported formats are: MP4, MKV, AVI, MOV, FLV, WebM, WMV, 3GP, M4V."
//       ),
//       false
//     );
//   }
// };

// Set the file size limit to 1GB (1GB = 1,073,741,824 bytes)
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 1024 * 1024 * 1024 },
// });

// upload section routes
router.post('/', upload.fields([{
    name: 'video',
    maxCount: 1
  },
  // { name: 'name', maxCount: 1 },
  // { name: 'slug', maxCount: 1 },
  // { name: 'origin_name', maxCount: 1 },
  // { name: 'content', maxCount: 1 },
  // { name: 'type', maxCount: 1 },
  // { name: 'status', maxCount: 1 },
  {
    name: 'poster_url',
    maxCount: 1
  },
  {
    name: 'thumb_url',
    maxCount: 1
  },
  // { name: 'trailer_url', maxCount: 1 },
  // { name: 'time', maxCount: 1 },
  // { name: 'episode_current', maxCount: 1 },
  // { name: 'episode_total', maxCount: 1 },
  // { name: 'quality', maxCount: 1 },
  // { name: 'lang', maxCount: 1 },
  // { name: 'notify', maxCount: 1 },
  // { name: 'showtimes', maxCount: 1 },
  // { name: 'year', maxCount: 1 },
  // { name: 'actor', maxCount: 10 },  // You can have multiple actors, so maxCount is 10 (or whatever you prefer)
  // { name: 'director', maxCount: 10 },
  // { name: 'category', maxCount: 10 },
  // { name: 'country', maxCount: 10 },
  // Add more fields if you have additional files, e.g., poster images
]), uploadControllers.uploadVideos)

module.exports = router;