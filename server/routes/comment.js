const express = require('express');
const router = express.Router();

const commentControllers = require('../app/controllers/CommentController');

// account section routes
router.post('/', commentControllers.addNewComment)
router.get('/:filmId', commentControllers.getComments)

module.exports = router;