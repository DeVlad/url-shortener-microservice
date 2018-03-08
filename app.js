// TODO: check if shortened url is longer then original
var express = require('express'),
    app = express(),
    port = process.env.PORT || 8000;
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config/config');

// Handle static files
// TIP: Handle static files before routes
//app.use(express.static(__dirname + '/public'));
//app.use('/public', express.static(__dirname + '/public'))
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
//app.use('/public', express.static(path.join(__dirname + '/public')));
// Initialize routes
app.use('/', require('./routes/routes'));


// Database
var db = mongoose.connection;
var uri = config.database;
var options = {
    autoReconnect: true,
    keepAlive: 1,
    connectTimeoutMS: 30000
};
var dbName = uri.slice(uri.lastIndexOf('/') + 1); // Do not expose db password to console

db.on('connecting', function () {
    console.log('Connecting to database:', dbName);
});

db.on('connected', function () {
    console.log('Database connection established.');
});

db.on('error', function () {
    console.log('Database connection failed!');
    mongoose.disconnect();
});

db.on('disconnected', function () {
    console.log('Disconnected from:', uri);
    mongoose.connect(uri, options).catch(function () {
        console.error('Error establishing a database connection! \nPlease check your database service.');
    });
});

db.on('reconnected', function () {
    console.log('Reconnected to database.');
});

mongoose.connect(uri, options).catch(function () {
    console.error('Error starting application!');
    process.exit(1);
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
});

// Turn off Express header
app.disable('x-powered-by');

app.listen(port, console.log('Listening on port:', port));