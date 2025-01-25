const AWS = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { Queue } = require("bullmq");
const IORedis = require("ioredis");
require('dotenv').config();
const Film = require('../../models/Film');
const path = require('path')
const mongoose = require('mongoose');

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
      // const connection = new IORedis({
      //   maxRetriesPerRequest: null, // Set this explicitly to null
      //   enableReadyCheck: false, // Optional: Prevent ready checks for faster setup
      // });
      // const fileQueue = new Queue("encode-video", { connection });

      // const videoFile = req.files['video'] ? req.files['video'][0] : null;

      // // console.log('File:', video); // The uploaded file
      // console.log('Body:', videoFile); 

      // // If the file is successfully uploaded
      // const uploadedFileName = videoFile.filename; 

      // await fileQueue.add(
      //   "encode-video",
      //   { fileName: uploadedFileName, folderPath: videoFile.destination },
      //   {
      //     attempts: 2,
      //     backoff: {
      //       type: "fixed",
      //       delay: 10000, // thử lại sau 10
      //     },
      //   }
      // );

      // try {
      //     console.log("File uploaded successfully:", req.file);

      //     res.status(200).json({
      //     message: "File uploaded successfully",
      //     file: req.file,
      //     });
      // } catch (error) {
      //     console.error("Error uploading file:", error);
      //     res.status(500).json({ error: "Error uploading file" });
      // }

      // Redis connection setup
      const connection = new IORedis({
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      });

      const fileQueue = new Queue("encode-video", { connection });

      try {
        const { slug, name } = req.body;
        console.log(req.files);
    
        // Extract files from request
        const videoFile = req.files['video'] ? req.files['video'][0] : null;
        const thumbFile = req.files['thumb_url'] ? req.files['thumb_url'][0] : null;
        const posterFile = req.files['poster_url'] ? req.files['poster_url'][0] : null;
    
        // Ensure video file exists
        if (!videoFile) {
          return res.status(400).json({ error: 'Video file is required.' });
        }
    
        console.log(videoFile.key); // Use key for S3 file reference, not filename
    
        // Generate base name from the video file
        const baseName = path.basename(videoFile.key, path.extname(videoFile.key)); // Use key to get base name
    
        // Log files for debugging
        console.log('Video File:', videoFile);
        console.log('Thumbnail File:', thumbFile);
        console.log('Poster File:', posterFile);
    
        // Prepare the files array for the Redis queue
        const allFiles = [];
    
        // Add files to array (video, thumbnail, poster)
        if (videoFile) {
          allFiles.push({
            type: "video",
            fileName: videoFile.key, // S3 key for video file
            s3Key: videoFile.key, // S3 key for video file
          });
        }
    
        if (thumbFile) {
          allFiles.push({
            type: "thumbnail",
            fileName: thumbFile.originalname, // S3 key for thumbnail file
            s3Key: thumbFile.key, // S3 key for thumbnail
          });
        }

        if (slug) {
          allFiles.push({
            type: "slug",
            value: slug,
          });
        }
    
        if (posterFile) {
          allFiles.push({
            type: "poster",
            fileName: posterFile.originalname, // S3 key for poster file
            s3Key: posterFile.key, // S3 key for poster
          });
        }
    
        // Log all files for debugging
        console.log('All Files:', allFiles);
    
        // Film object to be saved to database
        const newFilm = new Film({
          name: name,
          origin_name: name,
          content: slug,
          slug: slug,
          created: { time: new Date() },
          modified: { time: new Date() },
          _id: new mongoose.Types.ObjectId().toString(),
          status: 'inactive',
          type: 'Drama',
          poster_url: `https://d1m1whfx9njb6a.cloudfront.net/videos/${baseName}/poster/${posterFile.originalname}`,
          thumb_url: `https://d1m1whfx9njb6a.cloudfront.net/videos/${baseName}/thumb/${thumbFile.originalname}`,
          tmdb: {
            type: 'movie',
            id: '12345',
            season: '1',
            vote_average: 8.5,
            vote_count: 2000,
          },
          imdb: {
            id: 'tt1234567',
          },
          year: 2025,
          quality: "HD",
          lang: "English",
          category: [{ id: "1", name: "Action", slug: "action" }],
          country: [{ id: "US", name: "United States", slug: "us" }],
          actor: ["John Doe", "Jane Smith"],
          director: ["Director Name"],
          episode_current: "1",
          episode_total: "10",
          trailer_url: "http://example.com/trailer.mp4",
          time: "120 mins",
          view: 1000,
          showtimes: "2025-12-01",
          episodes: [
            {
              server_name: "Server Top",
              server_data: [
                {
                  name: name,
                  slug: slug,
                  filename: videoFile.key,
                  link_embed: `https://player.phimapi.com/player/?url=https://d1m1whfx9njb6a.cloudfront.net/videos/${baseName}/master.m3u8`,
                  link_m3u8: `https://d1m1whfx9njb6a.cloudfront.net/videos/${baseName}/master.m3u8`,
                },
              ],
            },
          ],
          comments: [],
        });
    
        // Add the job to the Redis queue
        await fileQueue.add("encode-video", { files: allFiles }, {
          attempts: 2,
          backoff: {
            type: "fixed",
            delay: 10000, // Retry after 10 seconds
          },
        });
    
        // Save the new film object
        const savedFilm = await newFilm.save();
        console.log("Film saved successfully:", savedFilm);
    
        // Respond back to client
        res.status(200).json({
          message: "Files uploaded and job added for processing.",
          files: allFiles,
          film: savedFilm,
        });
      } catch (err) {
        console.error("Error uploading files:", err);
        res.status(500).json({ error: "Error uploading files" });
      }
    
    
    };
}

module.exports = new UploadController();