const AWS = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
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