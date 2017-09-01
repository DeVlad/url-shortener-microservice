//TODO: change generator with simple incremental plugin
var mongoose = require('mongoose');
var sequenceGenerator = require('mongoose-sequence-plugin');
var Schema = mongoose.Schema;

// Mongoose promises are depricated use global
mongoose.Promise = global.Promise;

var UrlSchema = new Schema({    
    originalUrl: String,
    //shortUrl: String    
}, {
    versionKey: false
});

// TIP: This plugin require to start from the first record. If you have old records drop database and start over.
UrlSchema.plugin(sequenceGenerator, {
    field: 'sid',
    startAt: '100',    
    maxSaveRetries: 3
});

module.exports = mongoose.model('Url', UrlSchema);