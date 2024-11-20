const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../../models/Account')
const Favfilm = require('../../models/FavorFilm');
const Comment = require('../../models/Comment');


class CommentController {

  //[POST] add comment
  async addNewComment(req, res) {
    const {
      userId,
      filmId,
      content
    } = req.body;
    console.log(content);

    try {
      if (!content || !filmId || !userId) {
        return res.status(400).json({
          message: "Content, filmId, and userId are required"
        });
      }

      // Fetch the user from the Account model
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      // Create a new comment
      const newComment = new Comment({
        content,
        user: user._id, // Use the actual user ID from the Account model
        filmId,
      });

      await newComment.save();

      res.status(201).json({
        message: 'Comment added successfully',
        comment: newComment,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({
        message: 'Server error while adding comment'
      });
    }
  }
  async getComments(req, res) {
    const { filmId } = req.query; // or req.body, depending on your implementation

    try {
        console.log("Received filmId:", filmId);

        if (!filmId) {
            return res.status(400).json({ message: "Missing filmId parameter" });
        }

        // Verify that filmId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(filmId)) {
            return res.status(400).json({ message: "Invalid filmId format" });
        }

        // Proceed with the query
        const comments = await Comment.find({ filmId });
        res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new CommentController();