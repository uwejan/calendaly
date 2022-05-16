const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    code: {
        type: String,
        required: false
    },
    token: {
        type: Object,
        required: false
    },
    busy: {
        type: Array,
        required: false
    },
    available: {
        type: Array,
        required: false
    },

    // Add more fields here
    
})

module.exports = mongoose.model('User', UserSchema);