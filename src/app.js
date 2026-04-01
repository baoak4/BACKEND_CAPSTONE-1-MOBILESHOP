const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//import routes
const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const reviewRoutes = require('./routes/review.routes');
const cartRoutes = require('./routes/cart.routes');
const contentRoutes = require('./routes/content.routes');
const orderRoutes = require('./routes/order.routes');
const configRoutes = require('./routes/config.routes');

//middleware for handling errors

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

app.use('/api/uploads', uploadRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/products', productRoutes);

app.use('/api/reviews', reviewRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/contents', contentRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/config', configRoutes);

app.use(errorHandler);

module.exports = app;
