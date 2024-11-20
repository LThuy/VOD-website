const express = require('express');
const router = express.Router();

const adminControllers = require('../app/controllers/AdminControllers');

router.post('/login',adminControllers.checkLoginAdmin);
router.post('/register',adminControllers.createAccount);
router.post('/resend-verification',adminControllers.resentEmail);
router.get('/verify-email', adminControllers.verifyEmail); 
router.post('/change-password', adminControllers.changePassword); 

module.exports = router;