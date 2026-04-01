const jwt = require('jsonwebtoken');
const KEY = require('../config/key');

const signAccessToken = (payload) => {
    return jwt.sign(payload, KEY.JWT_SECRET, {
        expiresIn: KEY.JWT_EXPRIES_IN || "7d"
    });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, KEY.JWT_SECRET);
};

module.exports = { signAccessToken, verifyAccessToken };
