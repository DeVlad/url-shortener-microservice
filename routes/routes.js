var express = require('express');
var router = express.Router();
var Url = require('../models/url');
var controller = require('../controllers/controller');
var bodyParser = require('body-parser');

router.get('/', function (req, res) {
    res.sendFile('index.html');
});

router.post('/api/:url?', function (req, res, next) {
    // TODO check if original url exist in db
    
    if (!controller.validateUrl(req.query.url)) {        
        res.send('{ "error": "Invalid URL" }');
    }
    //var urlExist = false;
    // TODO: if url exist return existing shortened url

    /*var url = new Url({
        originalUrl: "${req.query.url}"
    });

    url.save(function (err) {
        if (err) return handleError(err);
        // saved!
    });*/

   /* Url.create(url).then(function (url) {
        console.log('db record');
        res.send('done');
    }).catch(next);*/

    res.send('Url post test success');
});
// Redirect to main page
router.get('/api', function (req, res) {
    res.redirect('/');
});

// Handle missing favicon
router.get('/favicon.ico', function (req, res) {
    res.status(204);
});

// Return 404 on missing pages or redirect if url is shortened
router.get('*', function (req, res) {
    // TODO check database if url is shortened

    // Trim slash symbol before url
    var link = req.url.substring(1);

    if (controller.validateUrl(link)) {
        res.send('Valid url: check db if found redirect');
    } else {
        res.status(404).send('Error: 404. Page not found !');
    }
});

module.exports = router;
