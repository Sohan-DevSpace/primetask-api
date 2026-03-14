const express = require('express');
const router = express.Router();
const { register, login } = require('../../controllers/authController');
const validateRequest = require('../../middlewares/validateRequest');
const { registerSchema, loginSchema } = require('../../validators/authValidator');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         $ref: '#/components/responses/ValidationFailed'
 *       409:
 *         description: Email already exists
 */
router.post('/register', validateRequest(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         $ref: '#/components/responses/ValidationFailed'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest(loginSchema), login);

module.exports = router;
