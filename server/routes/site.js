const express = require('express');
const router = express.Router();

const siteControllers = require('../app/controllers/SiteControllers');

router.post('/login',siteControllers.checkLogin);
router.post('/register',siteControllers.createAccount);
router.get('/verify-email', siteControllers.verifyEmail); 
//movie
const movieControllers = require('../app/controllers/MovieControllers');
router.get('/api/danh-sach/phim-le',movieControllers.getMovies);
//

module.exports = router;