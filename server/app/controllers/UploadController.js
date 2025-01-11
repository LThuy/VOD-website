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

      const connection = new IORedis({
        maxRetriesPerRequest: null, // Set this explicitly to null
        enableReadyCheck: false, // Optional: Prevent ready checks for faster setup
      });
      const fileQueue = new Queue("encode-video", { connection });

      const { slug, name } = req.body
      
      // Extract the uploaded files from the request
      const videoFile = req.files['video'] ? req.files['video'][0] : null; // Video file
      const thumbFile = req.files['thumb_url'] ? req.files['thumb_url'][0] : null; // Thumbnail file
      const posterFile = req.files['poster_url'] ? req.files['poster_url'][0] : null; // Poster file

      const baseName = path.basename(videoFile.filename, path.extname(videoFile.filename));
      
      // Log the files for debugging
      console.log('Video File:', videoFile);
      console.log('Thumbnail File:', thumbFile);
      console.log('Poster File:', posterFile);
      
      // Ensure all files are structured into an array
      const allFiles = [];

      if (slug) {
        allFiles.push({
          type: "slug",
          value: slug,
        });
      }
      
      // Add each file to the array if it exists
      if (videoFile) {
        allFiles.push({
          type: "video",
          fileName: videoFile.filename,
          folderPath: videoFile.destination,
        });
      }
      
      if (thumbFile) {
        allFiles.push({
          type: "thumbnail",
          fileName: thumbFile.filename,
          folderPath: thumbFile.destination,
        });
      }
      
      if (posterFile) {
        allFiles.push({
          type: "poster",
          fileName: posterFile.filename,
          folderPath: posterFile.destination,
        });
      }
      
      // Log the complete array for debugging
      console.log('All Files:', allFiles);

      // Create the film object to be saved to the database
      const newFilm = new Film({
        name: name,
        slug: slug,
        created: { time: new Date() },
        modified: { time: new Date() },
        _id: new mongoose.Types.ObjectId().toString(),  // Unique identifier for the film
        status: 'inactive',
        type: 'Drama',
        poster_url: `https://d104go8mhut32c.cloudfront.net/videos/${baseName}/poster/${posterFile.filename}`,
        thumb_url: `https://d104go8mhut32c.cloudfront.net/videos/${baseName}/thumb/${thumbFile.filename}`,
        tmdb: {
          type: 'movie',
          id: '12345',
          season: '1',
          vote_average: 8.5,
          vote_count: 2000
        },
        imdb: {
          id: 'tt1234567'
        },
        // Other fields with fake data for testing
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
            server_name: "Server Top",  // Example server name
            server_data: [
              {
                name: name,        // Episode name
                slug: slug,       // Episode slug for URL routing
                filename: videoFile.filename, // Filename for the episode
                link_embed: `https://player.phimapi.com/player/?url=https://d104go8mhut32c.cloudfront.net/videos/${baseName}/master.m3u8`,  // Embed link for player
                link_m3u8: `https://d104go8mhut32c.cloudfront.net/videos/${baseName}/master.m3u8`    // M3U8 link for streaming
              }
            ]
          }
        ],
        comments: [],
      });

      
      // Add the array of files to the Redis queue
      await fileQueue.add(
        "encode-video",
        { files: allFiles }, // Add all files as an array
        {
          attempts: 2,
          backoff: {
            type: "fixed",
            delay: 10000, // Retry after 10 seconds
          },
        }
      );
      
      try {
        console.log("Files uploaded successfully:", allFiles);
        const savedFilm = await newFilm.save();
        console.log("Film saved successfully:", savedFilm);
      
        res.status(200).json({
          message: "Files uploaded successfully",
          files: allFiles,
        });
      } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ error: "Error uploading files" });
      }
    
    }
}

module.exports = new UploadController();