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

router.get('*', controller.getUrl);
// Return 404 on missing pages or redirect if url is shortened
/*
router.get('*', function (req, res) {
    // TODO check database if url is shortened
    console.log('GET all HIT');
    console.log(req.url);
    
    // Trim slash symbol before url
    //var link = req.url.substring(1);
    
    console.log(link);
    //found in db
    if (true) {
        //TODO: call get controller
        controller.postUrl;
        res.send('Valid url: check db if found redirect');
    } else {
        res.status(404).send('Error: 404. Page not found !');
    }
});
*/

module.exports = router;
