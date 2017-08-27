var mongoose = require('mongoose');
//var autoNumber = require('mongoose-auto-number');
var Schema = mongoose.Schema;
var sequenceGenerator = require('mongoose-sequence-plugin');

// Mongoose promises are depricated use global
mongoose.Promise = global.Promise;

var connection = mongoose.createConnection("mongodb://localhost:27017/url-shortener", function(err) {
    if (err) throw err;
});

//autoNumber.init(connection);

var UrlSchema = new Schema({
    /*uid: {
        type: Number,        
    },*/
    originalUrl: {
        type: String,
        required: [true, 'Url is required']
    }
    /*shortUrl: {
        type: String
    }*/
});

//UrlSchema.plugin(autoNumber.plugin, 'uid');
//UrlSchema.plugin(sequenceGenerator, {
//    field: 'uid',
//    startAt: '0',    
//    maxSaveRetries: 2
//});

var Url = mongoose.model('url', UrlSchema);
module.exports = Url;
