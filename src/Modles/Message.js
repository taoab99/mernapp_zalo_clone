const mongoose = require('mongoose');
const { Schema } = mongoose;

const Message = new Schema({
    conversationId: {
        type: String,
        require: true
    },
    senderId: {
        type: String,
        require: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", Message);