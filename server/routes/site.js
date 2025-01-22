const express = require('express');
const router = express.Router();
const trackLogin = require('../middleware/AccountTracktime');
const siteControllers = require('../app/controllers/SiteControllers');

// account section routes
router.post('/login',siteControllers.checkLogin);
router.post('/logout',siteControllers.logout);
router.post('/register',siteControllers.createAccount);
router.post('/resend-verification',siteControllers.resentEmail);
router.get('/verify-email', siteControllers.verifyEmail); 
router.post('/change-password', siteControllers.changePassword); 
router.post('/forget-password', siteControllers.forgetPassword); 
router.post('/reset-password', siteControllers.resetPassword); 
router.post('/dashboard', siteControllers.getDashboard); 
//movie
const movieControllers = require('../app/controllers/MovieControllers');
router.get('/api/danh-sach/phim-le',movieControllers.getMovies);
// 

module.exports = router;