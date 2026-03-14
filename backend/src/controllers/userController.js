const prisma = require('../config/prisma');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404, 'NOT_FOUND');
    }

    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return successResponse(res, users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  getAllUsers,
};
