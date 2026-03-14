const { errorResponse } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'Server Error';
  let details = null;

  // Log to console for dev
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    message = 'Duplicate field value entered';
    statusCode = 409;
    code = 'CONFLICT_ERROR';
  }

  // Prisma record not found error
  if (err.code === 'P2025') {
    message = 'Resource not found';
    statusCode = 404;
    code = 'NOT_FOUND';
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    message = 'Validation Error';
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please log in again.';
    statusCode = 401;
    code = 'UNAUTHORIZED';
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Your token has expired. Please log in again.';
    statusCode = 401;
    code = 'UNAUTHORIZED';
  }

  return errorResponse(res, message, statusCode, code, details);
};

module.exports = { errorHandler };
