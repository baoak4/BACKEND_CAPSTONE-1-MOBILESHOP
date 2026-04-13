const mongoose = require('mongoose');
const KEY = require('./key');

const connectDB = async () => {
    try {
        await mongoose.connect(KEY.MONGO_URI, {
            dbName: KEY.MONGO_DB_NAME,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
};

module.exports = connectDB;
