var Url = require('../models/url');
var config = require('../config/config');

exports.postUrl = function (req, res) {

    if (!validateUrl(req.query.url)) {
        res.send('{ "error": "Invalid URL" }');
    } else {
        var data = new Url({
            originalUrl: req.query.url            
        });

        Url.create(data, function (err, record) {
            if (err) {
                res.send('error saving document');
            } else {
                var shortUrl = generateShortUrl(record.sid);
                var output = '{' + '"originalUrl":"' + record.originalUrl + '",' + '"shortUrl":' + config.baseUrl + shortUrl + '}';                
                res.send(output); //success
            }
        });
    }
};

// convert sid to base36 string
var generateShortUrl = function (sid) {    
    var id = Number(sid);
    return id.toString(36);
};

var generateSid = function (base36) {
    return parseInt(base36, 36).toString();
}

var validateUrl = function (url) {
    var re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return re.test(url);
};
