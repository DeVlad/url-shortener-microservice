var mongoose = require('mongoose');
//var autoNumber = require('mongoose-auto-number');
var Schema = mongoose.Schema;
var sequenceGenerator = require('mongoose-sequence-plugin');

// Mongoose promises are depricated use global
mongoose.Promise = global.Promise;

var UrlSchema = new Schema({
    originalUrl: String,
    shortUrl: String
}, {
    versionKey: false
});

module.exports = mongoose.model('Url', UrlSchema);

//autoNumber.init(connection);


//UrlSchema.plugin(autoNumber.plugin, 'uid');
//UrlSchema.plugin(sequenceGenerator, {
//    field: 'uid',
//    startAt: '0',    
//    maxSaveRetries: 2
//});

//var Url = mongoose.model('url', UrlSchema);
//module.exports = Url;
