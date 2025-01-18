const express = require('express');
const router = express.Router();

const userControllers = require('../app/controllers/UserControllers');

router.get('/users', userControllers.getUsers);
router.post('/users/online-time/:userId', userControllers.trackingTimeUsers);
router.get('/users/online-time/:userId', userControllers.getOnlineTimeUsers);
router.post('/users/:id/lock', userControllers.handleLockUnlock);
// 

module.exports = router;