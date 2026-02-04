require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const KEY = require('./src/config/key');

const PORT = KEY.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
