const express = require('express');
const router = express.Router();

const siteControllers = require('../app/controllers/SiteControllers');


router.post('/login',siteControllers.checkLogin);
router.post('/register',siteControllers.createAccount);

module.exports = router;