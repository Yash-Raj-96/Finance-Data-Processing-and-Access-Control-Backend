const errorHandler = (err, req, res, next) => {
  console.error('🔥 ERROR:', err);

  let statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: statusCode
    }
  });
};

module.exports = errorHandler;
