const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(2, 'Name must be at least 2 characters long'),
    email: z.string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
    password: z.string({
      required_error: 'Password is required',
    }).min(8, 'Password must be at least 8 characters long'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
    password: z.string({
      required_error: 'Password is required',
    }).min(8, 'Password must be at least 8 characters'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
