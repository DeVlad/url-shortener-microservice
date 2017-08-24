var express = require('express');
var router = express.Router();
var Url = require('../models/url');
var validateUrl = require('../helpers/url-validator');
var bodyParser = require('body-parser');
//p.use(bodyParser.json()); // support json encoded bodies
//p.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.get('/', function (req, res) {
    res.sendFile('index.html');    
});

router.post('/api/:url?', function(req, res, next){
    // TODO check if original url exist in db
    if(!validateUrl.validateUrl(req.query.url)) {
        res.send('{ "unix": "Invalid URL" }');
    }
   
   /*
    Url.create(req.body).then(function(url){
        res.send('done');
    }).catch(next);
    */
   
   res.send('Url post test success');
});
// Redirect to main page
router.get('/api', function (req, res) {
   res.redirect('/');
});

// Handle missing favicon
router.get('/favicon.ico', function(req, res) {
    res.status(204);
});

// Return 404 on missing pages or redirect if url is shortened
router.get('*', function (req, res) {
    // TODO check database if url is shortened
    
    // Trim slash symbol before url
    var link = req.url.substring(1); 
   
    if(validateUrl.validateUrl(link)) {        
        res.send('Valid url: check db if found redirect');
    } else {
        res.status(404).send('Error: 404. Page not found !');
    }
});

module.exports = router;