const mongoose = require('../database');

const ClientSchema = mongoose.Schema({
    name:{
        type: String,
    },
    password:{
        type: String,
    },
    isAdmin:{
        type: Boolean,
    }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;