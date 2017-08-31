var Url = require('../models/url');

exports.postUrl = function (req, res) {

    if (!validateUrl(req.query.url)) {
        res.send('{ "error": "Invalid URL" }');
    } else {
        var data = new Url({
            originalUrl: req.query.url,
            shortUrl: "test"
        });

        Url.create(data, function (err, record) {
            if (err) {
                res.send('error saving book');
            } else {
                //console.log(record);
                res.send(record); //success
            }
        });
    }
}

var validateUrl = function (url) {
    var re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return re.test(url);
};
