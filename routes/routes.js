var express = require('express');
var router = express.Router();
var Url = require('../models/url');
var controller = require('../controllers/controller');

router.get('/', function (req, res) {
    res.sendFile('index.html');
});

router.post('/api/:url?', controller.postUrl);

// Redirect to main page
router.get('/api', function (req, res) {
    res.redirect('/');
});

// Handle missing favicon
router.get('/favicon.ico', function (req, res) {
    res.status(204);
});

// Return 404 on missing pages or redirect if url is shortened
router.get('*', controller.getUrl);

module.exports = router;