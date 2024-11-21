const express = require('express');
const router = express.Router();

const filmControllers = require('../app/controllers/FilmControllers');

// account section routes
router.post('/add-favorite', filmControllers.addFavorite)
router.post('/is-favorite', filmControllers.checkFavorite)
router.get('/getfavorites/:userId', filmControllers.getFavorties)
router.delete('/remove-favorite', filmControllers.deleteFavorFilm)
// get history
router.post('/addToHistory', filmControllers.addHistory)
router.get('/gethistory/:userId', filmControllers.getHistoryFilm)


module.exports = router;