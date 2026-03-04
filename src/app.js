const express = require('express');
const morgan = require('morgan');

//import routes
const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const categoryRoutes = require('./routes/category.routes');
//middleware for handling errors

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

app.use('/api/uploads', uploadRoutes);

app.use('/api/categories', categoryRoutes);

app.use(errorHandler);

module.exports = app;
