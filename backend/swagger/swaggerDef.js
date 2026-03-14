const swaggerJsdoc = require('swagger-jsdoc');
const { version } = require('../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🚀 PrimeTask: Premium Backend API',
      version,
      description: `
Welcome to the **PrimeTask API** documentation. 

This API provides a secure, scalable foundation for the PrimeTask management system, featuring:
- **JWT & RBAC:** Secure authentication with role-based access control.
- **RESTful Design:** Versioned endpoints following industry standards.
- **Data Protection:** Built-in rate limiting, helmet security, and validation.

*Built for excellence by Sohan Mandal.*
      `,
    },
    tags: [
      { name: 'Auth', description: 'Authentication & Session Management' },
      { name: 'Users', description: 'User Profile & Identity' },
      { name: 'Tasks', description: 'Task Lifecycle & Management' },
    ],
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        Unauthorized: {
          description: 'Missing or invalid token',
          content: {
             'application/json': {
               schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                      type: 'object',
                      properties: {
                         code: { type: 'string', example: 'UNAUTHORIZED' },
                         message: { type: 'string', example: 'Invalid token. Please log in again.' }
                      }
                    }
                  }
               }
             }
          }
        },
        ValidationFailed: {
          description: 'Validation failed',
          content: {
             'application/json': {
               schema: {
                 type: 'object',
                 properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                      type: 'object',
                      properties: {
                         code: { type: 'string', example: 'VALIDATION_ERROR' },
                         message: { type: 'string', example: 'Validation Error' },
                         details: { type: 'array', items: { type: 'object' }}
                      }
                    }
                 }
               }
             }
          }
        }
      }
    },
  },
  apis: ['./src/routes/v1/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
