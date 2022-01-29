const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
    email: {
        type: String,
        required: true,
        max: 25
    },
    name: {
        type: String,
        required: true
    },
    pasword: {
        type: String,
        required: true,
        min: 5
    }
}, { timestamps: true });

module.exports = mongoose.model('User', User);
