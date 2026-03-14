const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger/swaggerDef');
const { errorHandler } = require('./middlewares/errorHandler');
const fs = require('fs');
const path = require('path');

// Route imports
const authRoutes = require('./routes/v1/auth');
const userRoutes = require('./routes/v1/users');
const taskRoutes = require('./routes/v1/tasks');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // Required for Swagger UI to load custom CSS/JS
}));
app.use(express.json());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Root landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Swagger documentation
const customCss = fs.readFileSync(path.join(__dirname, '../swagger/custom.css'), 'utf8');

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss,
  customSiteTitle: "PrimeTask API | Premium Architecture",
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
