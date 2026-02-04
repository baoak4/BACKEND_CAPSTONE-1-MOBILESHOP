const mongoose = require('mongoose');
const KEY = require('./key');

const connectDB = async () => {
    try {
        await mongoose.connect(KEY.MONGO_URI);
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
};

module.exports = connectDB;
