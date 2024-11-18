const express = require('express');
const router = express.Router();

const filmControllers = require('../app/controllers/FilmControllers');
const { route } = require('./site');

// account section routes
router.post('/add-favorite', filmControllers.addFavorite)
router.get('/favorites/:userId', filmControllers.getFavorties)
router.delete('/remove-favorite', filmControllers.deleteFavorFilm)

module.exports = router;