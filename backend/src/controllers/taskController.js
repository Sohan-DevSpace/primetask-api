const prisma = require('../config/prisma');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'pending',
        user_id: req.user.id,
      },
    });

    return successResponse(res, task, 201);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    let where = {};
    
    // If user is not admin, they only see their own tasks
    if (req.user.role !== 'admin') {
      where.user_id = req.user.id;
    }

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    // Filter by search if provided
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } }
      }),
      prisma.task.count({ where }),
    ]);

    return successResponse(res, {
      tasks,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } }
    });

    if (!task) {
      return errorResponse(res, 'Task not found', 404, 'NOT_FOUND');
    }

    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return errorResponse(res, 'Not authorized to view this task', 403, 'FORBIDDEN');
    }

    return successResponse(res, task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return errorResponse(res, 'Task not found', 404, 'NOT_FOUND');
    }

    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return errorResponse(res, 'Not authorized to edit this task', 403, 'FORBIDDEN');
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status },
    });

    return successResponse(res, updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return errorResponse(res, 'Task not found', 404, 'NOT_FOUND');
    }

    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return errorResponse(res, 'Not authorized to delete this task', 403, 'FORBIDDEN');
    }

    await prisma.task.delete({ where: { id } });

    return successResponse(res, { message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
