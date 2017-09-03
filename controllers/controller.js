var Url = require('../models/url');
var config = require('../config/config');

exports.postUrl = function (req, res) {
    if (!validateUrl(req.query.url)) {
        res.send('{ "error": "Invalid URL" }');
    } else {
        var url = urlPrepare(req.query.url);
        // Find url if exist
        Url.findOne({
            'originalUrl': url
        }, function (err, record) {
            if (err) {
                res.send(err);
            }
            if (record) {
                var shortUrl = generateShortUrl(record.sid);
                var output = '{' + '"originalUrl":"' + record.originalUrl + '",' + '"shortUrl":"' + config.baseUrl + shortUrl + '"}';
                res.send(output);
            } else { // If url not exist in DB -> save url
                var data = new Url({
                    originalUrl: url
                });

                Url.create(data, function (err, record) {
                    if (err) {
                        res.send('error saving document');
                    } else {
                        var shortUrl = generateShortUrl(record.sid);
                        var output = '{' + '"originalUrl":"' + record.originalUrl + '",' + '"shortUrl":"' + config.baseUrl + shortUrl + '"}';
                        res.send(output); //success
                    }
                });
            }
        });
    }
};

exports.getUrl = function (req, res) {
    // Trim slash symbol before and after
    var link = urlPrepare(req.url.substring(1));
    var sid = generateSid(link);

    Url.findOne({
            'sid': sid
        }, function (err, record) {
            if (err) {
                console.log(err);
            }
            if (record) {               
               res.redirect(record.originalUrl);
            } else {
                res.status(404).send('Error: 404. Page not found !');
            }
        });    
};

// convert sid to base36 string
var generateShortUrl = function (sid) {
    var id = Number(sid);
    return id.toString(36);
};

var generateSid = function (base36) {
    return parseInt(base36, 36).toString();
}

// remove trailing slashes from url
var urlPrepare = function (url) {
    if (url.charAt(url.length - 1) == '/') {
        url = url.replace(/\/+$/, '')
    }
    return url;
}

var validateUrl = function (url) {
    var re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return re.test(url);
};