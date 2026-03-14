/**
 * Standardized response handler for API responses
 */
const sendResponse = (res, statusCode, success, data = null, error = null) => {
  const response = {
    success,
  };

  if (data !== null) {
    response.data = data;
  }

  if (error !== null) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

const successResponse = (res, data, statusCode = 200) => {
  return sendResponse(res, statusCode, true, data);
};

const errorResponse = (res, message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details = null) => {
  return sendResponse(res, statusCode, false, null, {
    code,
    message,
    details
  });
};

module.exports = {
  successResponse,
  errorResponse
};
