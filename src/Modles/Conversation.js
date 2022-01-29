const mongoose = require('mongoose');
const { Schema } = mongoose;

const Conversation = new Schema({
    member: {
        type: Array,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', Conversation);