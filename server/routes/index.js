const express = require('express');
const siteRoute = require('./site')
const filmRoute = require('./film')
const router = express.Router();
const Item = require('../models/Item');
const Account = require('../models/Account');

function route(app) {
    app.use('/film', filmRoute);
    app.use('/', siteRoute);
    
}

module.exports = route;