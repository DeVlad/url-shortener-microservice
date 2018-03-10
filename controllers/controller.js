var Url = require('../models/url');
var config = require('../config/config');

var validateUrl = function (url) {
    var re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return re.test(url);
};

// Add http prefix if not provided
var urlPrefixer = function (url) {
    var re = /^(?:f|ht)tps?:///g;
    url = url.trim();
    if (!re.test(url)) {
        url = "http://" + url;
    }
    return url;
};

// Remove trailing slashes from url
var urlPrepare = function (url) {
    if (url.charAt(url.length - 1) === '/') {
        url = url.replace(/\/+$/, '');
    }
    return url;
};

// Convert sid to base36 string
var generateShortUrl = function (sid) {
    var id = Number(sid);
    return id.toString(36);
};

var generateSid = function (base36) {
    return parseInt(base36, 36).toString();
};

exports.postUrl = function (req, res) {
    //console.log('POST url', req);
    var url = '';
    var jsonResponse = {
        error: "Invalid Url"
    }

    if (req.query.url) { // Rebuild posted url with params. TODO: trim ?
        url = req.query.url;
        console.log("POST: req.query", url);
        urlObject = req.query;
        if (Object.keys(urlObject).length > 1) {
            var rebuildedUrl = '';
            for (var i in urlObject) {
                rebuildedUrl += '&' + i + '=' + urlObject[i];
            }
            var url = rebuildedUrl.replace(/\s/g, '+').slice(5);
        }
    } else if (Object.keys(req.body).length !== 0) { // POST via browser without ajax
        console.log("POST: req.body", req.body);
        if (!req.body.url || req.body.url < 4) { // Pre validation filter         
            return res.send(jsonResponse);
        }
        url = req.body.url;
    } else {
        return res.send(jsonResponse);
    }

    url = urlPrefixer(url); // Just in case if user tamper request
    
    if (!validateUrl(url)) {
        res.send(jsonResponse);
    } else {
        url = urlPrepare(url);
        // Find if url exist in database
        Url.findOne({
            'originalUrl': url
        }, function (err, record) {
            if (err) {
                res.send(err);
            }            
            if (record) {
                var shortUrl = config.baseUrl + generateShortUrl(record.sid);
                jsonResponse = {
                            originalUrl: record.originalUrl,
                            shortUrl: shortUrl
                }                
                res.send(jsonResponse);
            } else { // If url not exist in DB -> save url
                var data = new Url({
                    originalUrl: url
                });

                Url.create(data, function (err, record) {
                    if (err) {
                        jsonResponse.error = 'Error saving document !';
                        res.send(jsonResponse);
                    } else {
                        var shortUrl = config.baseUrl + generateShortUrl(record.sid);                        
                        jsonResponse = {
                            originalUrl: record.originalUrl,
                            shortUrl: shortUrl
                        }                        
                        console.log("JSON", jsonResponse);
                       // var output = '{' + '"originalUrl":"' + record.originalUrl + '",' + '"shortUrl":"' + config.baseUrl + shortUrl + '"}';
                        res.send(jsonResponse); //success
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
