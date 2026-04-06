module.exports = (err, req, res, next) => {
    const code = err.status || err.statusCode || 500;
    res.status(code).json({ message: err.message || 'Internal Server Error' });
};
