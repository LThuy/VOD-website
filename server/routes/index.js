const express = require('express');
const siteRoute = require('./site')
const router = express.Router();
const Item = require('../models/Item');
const Account = require('../models/Account');

function route(app) {
    app.use('/', siteRoute);
    
}

module.exports = route;