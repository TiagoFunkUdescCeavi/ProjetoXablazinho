const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/geraldo', {useNewUrlParser: true});
mongoose.Promise = global.Promise;

module.exports = mongoose; 