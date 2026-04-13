const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//import routes
const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const categoryRoutes = require('./routes/category.routes');//danh mục
const productRoutes = require('./routes/product.routes');
const reviewRoutes = require('./routes/review.routes');
const cartRoutes = require('./routes/cart.routes');
const contentRoutes = require('./routes/content.routes');
const orderRoutes = require('./routes/order.routes');
const configRoutes = require('./routes/config.routes');
const statsRoutes = require('./routes/stats.routes');
const chatBotRoutes = require('./routes/chatBot.routes');

//middleware for handling errors

const errorHandler = require('./middlewares/errorHandler');
const orderController = require('./controllers/order.controller');

const app = express();

app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
));

// Stripe webhook: body phải là raw Buffer để verify chữ ký (constructEvent)
app.post(
    '/api/orders/webhook',
    express.raw({ type: 'application/json' }),
    (req, res, next) => orderController.stripeWebhook(req, res, next)
);

app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRoutes);

app.use('/api/uploads', uploadRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/products', productRoutes);

app.use('/api/reviews', reviewRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/contents', contentRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/stats', statsRoutes); // thống kê

app.use('/api/chatbot', chatBotRoutes);

app.use('/api/config', configRoutes);

app.use(errorHandler);

module.exports = app;
