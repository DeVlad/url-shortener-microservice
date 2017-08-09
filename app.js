// TODO: check if shortened url is longer then original

var express = require('express'),
    app = express(),
    port = process.env.PORT || 8000;

// Handle static files
// TIP: Handle static files before routes
app.use(express.static(__dirname + '/public'));

// Initialize routes
app.use('/', require('./routes/routes'));

// MongoDB
var MongoClient = require('mongodb').MongoClient;
var database;
var url = 'mongodb://localhost:27017/url-shortener';
// Use connect method to connect to the Server 
MongoClient.connect(url, function (err, db) {
    if (!err) {
        console.log('Database connection established');
        database = db;
    }
});

// Error handler
app.use(function (err, req, res, next) {
    // if URIError occurs
    if (err instanceof URIError) {
        err.message = 'Failed to decode param at: ' + req.url;
        err.status = err.statusCode = 400;
        return res.send('Error: ' + err.status + '<br>' + err.message);
    } else {
        // More errors...
    }
    next();
});

app.listen(port, console.log('Listening on port:', port));
