var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AutoIncrement = require('mongoose-sequence')(mongoose);

// Mongoose promises are depricated use global
mongoose.Promise = global.Promise;

var UrlSchema = new Schema({    
    originalUrl: String      
}, {
    versionKey: false
});

UrlSchema.plugin(AutoIncrement, {inc_field: 'sid'});
module.exports = mongoose.model('Url', UrlSchema);