const { verifyToken } = require('../utils/jwt');

const verifyAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid token',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    next(error); // Passes to errorHandler which checks JsonWebTokenError
  }
};

module.exports = verifyAuthToken;
