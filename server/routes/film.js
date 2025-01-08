const express = require('express');
const router = express.Router();

const filmControllers = require('../app/controllers/FilmControllers');

// get all film
router.get('/get-film', filmControllers.getFilms)
router.get('/get-film/:filmId', filmControllers.getFilmById)
router.delete('/delete-film/:filmId', filmControllers.deleteFilm);
router.put('/update-film/:filmId', filmControllers.editFilm);

// account section routes
router.post('/add-favorite', filmControllers.addFavorite)
router.post('/is-favorite', filmControllers.checkFavorite)
router.get('/getfavorites/:userId', filmControllers.getFavorties)
router.delete('/remove-favorite', filmControllers.deleteFavorFilm)
// get history
router.post('/addToHistory', filmControllers.addHistory)
router.get('/gethistory/:userId', filmControllers.getHistoryFilm)
// get new-film
router.get('/list/new', filmControllers.getNewestFilm)
// get film-detail
router.get('/:slug', filmControllers.getFilmDetails)


module.exports = router;