var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UrlSchema = new Schema({
    originalUrl: {
        type: String,
        required: [true, 'Url is required']
    },
    shortUrl: {
        type: String
    }    
});

var Url = mongoose.model('url', UrlSchema);
module.exports = Url;