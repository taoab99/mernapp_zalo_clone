const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.URI_MONGODB;

async function connect() {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false
        });
        console.log('connect successfully');
    } catch (error) {
        console.log('lỗi')
    }

}

module.exports = { connect };
