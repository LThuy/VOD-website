const AWS = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const {
  Queue
} = require("bullmq");
const IORedis = require("ioredis");
require('dotenv').config();
const Film = require('../../models/Film');
const path = require('path')
const mongoose = require('mongoose');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEYIN,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


class UploadController {

  //[POST] upload content
  async uploadVideos(req, res) {
    //   
    const redisCloudConfig = {
      host: process.env.HOST_REDIS, // Redis Cloud host
      port: process.env.PORT_REDIS, // Redis Cloud port
      password: process.env.PASSWORD_REDIS, // Redis Cloud password
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };

    // Redis connection setup
    const connection = new IORedis(redisCloudConfig);

    const fileQueue = new Queue("encode-video", {
      connection
    });

    try {
      const {
        slug,
        name
      } = req.body;
      const filmData = req.body;
      // console.log(req.files);

      // Extract files from request
      const videoFile = req.files['video'] ? req.files['video'][0] : null;
      const thumbFile = req.files['thumb_url'] ? req.files['thumb_url'][0] : null;
      const posterFile = req.files['poster_url'] ? req.files['poster_url'][0] : null;

      // Ensure video file exists
      if (!videoFile) {
        return res.status(400).json({
          error: 'Video file is required.'
        });
      }

      // console.log(videoFile.key); // Use key for S3 file reference, not filename

      // Generate base name from the video file
      const baseName = path.basename(videoFile.key, path.extname(videoFile.key)); // Use key to get base name

      // Log files for debugging
      // console.log('Video File:', videoFile);
      // console.log('Thumbnail File:', thumbFile);
      // console.log('Poster File:', posterFile);

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
      // console.log('All Files:', allFiles);

      // Film object to be saved to database
      const newFilm = new Film({
        name: name,
        origin_name: name,
        content: filmData.content,
        slug: slug,
        created: {
          time: new Date()
        },
        modified: {
          time: new Date()
        },
        _id: new mongoose.Types.ObjectId().toString(),
        status: 'inactive',
        type: filmData.type,
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
        year: filmData.year,
        quality: filmData.quality,
        lang: filmData.lang,
        category: Array.isArray(filmData.category) ?
          filmData.category.map(cat => (typeof cat === 'string' ? {
            id: "",
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, "-")
          } : cat)) :
          [{
            id: "",
            name: filmData.category,
            slug: filmData.category
              .toLowerCase()
              .normalize("NFD") // Decomposes characters (e.g., "á" → "á")
              .replace(/[\u0300-\u036f]/g, "") // Removes diacritical marks
              .replace(/\s+/g, "-")
          }],
        country: Array.isArray(filmData.country) ?
          filmData.country.map(cty => (typeof cty === 'string' ? {
            id: "",
            name: cty,
            slug: cty.toLowerCase().replace(/\s+/g, "-")
          } : cty)) :
          [{
            id: "",
            name: filmData.country,
            slug: filmData.country.toLowerCase().replace(/\s+/g, "-")
          }],
        actor: filmData.actor,
        director: filmData.director,
        episode_current: filmData.episode_current,
        episode_total: filmData.episode_total,
        trailer_url: filmData.trailer_url,
        time: filmData.time + ' minutes',
        view: 0,
        showtimes: "2025-12-01",
        episodes: [{
          server_name: "Server Top",
          server_data: [{
            name: name,
            slug: slug,
            filename: videoFile.key,
            link_embed: `https://player.phimapi.com/player/?url=https://d1m1whfx9njb6a.cloudfront.net/videos/${baseName}/master.m3u8`,
            link_m3u8: `https://d1m1whfx9njb6a.cloudfront.net/videos/${baseName}/master.m3u8`,
          }, ],
        }, ],
        comments: [],
      });

      // Add the job to the Redis queue
      await fileQueue.add("encode-video", {
        files: allFiles
      }, {
        attempts: 2,
        backoff: {
          type: "fixed",
          delay: 10000, // Retry after 10 seconds
        },
      });

      // Save the new film object
      const savedFilm = await newFilm.save();
      // console.log("Film saved successfully:", savedFilm);

      // Respond back to client
      res.status(200).json({
        message: "Files uploaded and job added for processing.",
        files: allFiles,
        film: savedFilm,
      });
    } catch (err) {
      console.error("Error uploading files:", err);
      res.status(500).json({
        error: "Error uploading files"
      });
    }


  };
}

module.exports = new UploadController();