const AWS = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { Queue } = require("bullmq");
const IORedis = require("ioredis");
require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });


class UploadController {

  //[POST] upload content
  async uploadVideos(req, res) {
//     console.log("AWS Credentials:", AWS.config.credentials);
//     const { test } = req.body;
//     try {
//       const response = await s3
//         .putObject({
//           Bucket: process.env.BUCKET_INPUT,
//           Body: "HELLO",
//           Key: "my-file.txt",
//         }) 
//         .promise();
        
//       console.log("Upload succeeded - ", response);
//       res.status(200).send("File uploaded successfully.");
//     } catch (err) {
//       console.error("Upload failed:", err);
//       res.status(500).send("Failed to upload file.");
//     }
//   }
      // Initialize Redis connection with required options
      const connection = new IORedis({
        maxRetriesPerRequest: null, // Set this explicitly to null
        enableReadyCheck: false, // Optional: Prevent ready checks for faster setup
      });
      const fileQueue = new Queue("encode-video", { connection });

      const videoFile = req.files['video'] ? req.files['video'][0] : null;

      // console.log('File:', video); // The uploaded file
      console.log('Body:', videoFile); 

      // If the file is successfully uploaded
      const uploadedFileName = videoFile.filename; 

      await fileQueue.add(
        "encode-video",
        { fileName: uploadedFileName, folderPath: videoFile.destination },
        {
          attempts: 2,
          backoff: {
            type: "fixed",
            delay: 10000, // thử lại sau 10
          },
        }
      );

      try {
          console.log("File uploaded successfully:", req.file);

          res.status(200).json({
          message: "File uploaded successfully",
          file: req.file,
          });
      } catch (error) {
          console.error("Error uploading file:", error);
          res.status(500).json({ error: "Error uploading file" });
      }
    
    }
}

module.exports = new UploadController();