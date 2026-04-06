const KEY = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://root_anh:22062004@cluster0.oivpk7n.mongodb.net/backend_cap1',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
    JWT_EXPRIES_IN: '7d',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dwfzptm5v',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '134838427692594',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'ZLQkvDyyA_bI8kazbqUvQp_fcnU',
    STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || '',
};

module.exports = KEY;
