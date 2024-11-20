const express = require('express');
const siteRoute = require('./site')
const filmRoute = require('./film')
const AdminRoute = require('./admin')
const cmtRoute = require('./comment')
const router = express.Router();
const Item = require('../models/Item');
const Account = require('../models/Account');

function route(app) {
    app.use('/comments', cmtRoute);
    app.use('/admin', AdminRoute);
    app.use('/film', filmRoute);
    app.use('/', siteRoute);
    
}

module.exports = route;