const express = require('express');
const router = express.Router();
const verifyAuthToken = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');
const { getMe, getAllUsers } = require('../../controllers/userController');

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/me', verifyAuthToken, getMe);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Insufficient permissions
 */
router.get('/', verifyAuthToken, checkRole(['admin']), getAllUsers);

module.exports = router;
