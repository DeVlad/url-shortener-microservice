var express = require('express'), app = express();
var path = require('path');
var bodyParser = require('body-parser');
var Url = require('../models/url');
var controller = require('../controllers/controller');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.post('/api/:url?', controller.postUrl);
app.post('/api/link/:url', controller.postUrl);

app.get('/api', function (req, res) {
    res.sendFile(path.join(__dirname, '../public', 'api.html'));
});

// Handle missing favicon
app.get('/favicon.ico', function (req, res) {
    res.status(204);
});

// Return 404 on missing pages or redirect if url is shortened
app.get('*', controller.getUrl);

module.exports = app;