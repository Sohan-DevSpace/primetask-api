const { z } = require('zod');

const createTaskSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }).min(1, 'Title cannot be empty').max(200, 'Title is too long'),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'done']).optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').max(200, 'Title is too long').optional(),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'done']).optional(),
  }),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
