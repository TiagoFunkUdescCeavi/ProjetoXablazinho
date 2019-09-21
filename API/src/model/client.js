const mongoose = require('../database');

const ClientSchema = mongoose.Schema({
    name:{
        type: String,
    },
    password:{
        type: String,
    }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;