const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Film = require('../../models/Film');
const Account = require('../../models/Account');
const Comment = require('../../models/Comment');


class CommentController {

  //[POST] add comment
  async addNewComment(req, res) {
    const {
      filmId,
      userId,
      content
    } = req.body;
    console.log(filmId)

    try {
      const film = await Film.findById(filmId);
      if (!film) return res.status(404).json({
        message: 'Film not found'
      });

      const user = await Account.findById(userId);
      if (!user) return res.status(404).json({
        message: 'User not found'
      });

      const comment = {
        content,
        user: {
          id: user._id,
          username: user.username
        },
        createdAt: new Date(),
      };
      film.comments.push(comment);
      await film.save();

      res.status(201).json({
        message: 'Comment added successfully',
        comment
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Failed to add comment'
      });
    }
  }
  async getComments(req, res) {
    const {
      filmId
    } = req.params;
    // console.log(filmId)

    try {
      // Find the film by ID
      const film = await Film.findById(filmId); // Ensure Film is properly imported
      if (!film) {
        return res.status(404).json({
          message: "Film not found"
        });
      }

      // Send the comments as a response
      res.status(200).json({
        comments: film.comments
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({
        message: "Error fetching comments"
      });
    }
  }
}

module.exports = new CommentController();