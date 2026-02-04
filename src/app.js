const express = require('express');
//import routes
const authRoutes = require('./routes/auth.routes');

//middleware for handling errors

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
