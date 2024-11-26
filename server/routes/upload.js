const express = require('express');
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const { S3Client } = require('@aws-sdk/client-s3');
require("dotenv").config();
const router = express.Router();

const uploadControllers = require('../app/controllers/UploadController');

const s3 = new S3Client({
    region:  process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  });


const upload = multer({
    storage: multerS3({
      s3,
      bucket: process.env.BUCKET_INPUT,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        cb(null, `videos/${Date.now()}-${file.originalname}`);
      },
    }),
    limits: { fileSize: 100 * 1024 * 1024 }, // Limit to 100 MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("video/")) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type, only videos are allowed!"), false);
      }
    },
  });

// account section routes
router.post('/', upload.single("video"), uploadControllers.uploadVideos)

module.exports = router; 