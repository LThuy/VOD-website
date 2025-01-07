const express = require('express');
const router = express.Router();

const userControllers = require('../app/controllers/UserControllers');

router.get('/users', userControllers.getUsers);
router.post('/users/:id/lock', userControllers.handleLockUnlock);
// 

module.exports = router;