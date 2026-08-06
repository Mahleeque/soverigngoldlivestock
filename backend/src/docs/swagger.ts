import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Sovereign Gold Livestock API',
      version: '1.0.0',
      description: 'REST API for livestock commerce, reservations, payments, delivery and dashboards.'
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Request successful' },
            data: { type: 'object' },
            meta: { type: 'object' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          responses: { '200': { description: 'API is healthy' } }
        }
      },
      '/auth/register': {
        post: {
          summary: 'Register customer',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                example: {
                  firstName: 'Amina',
                  lastName: 'Okafor',
                  email: 'amina@example.com',
                  phone: '+2348012345678',
                  password: 'StrongPass123'
                }
              }
            }
          },
          responses: { '201': { description: 'Registered' }, '422': { description: 'Validation failed' } }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Login',
          requestBody: {
            content: {
              'application/json': {
                example: { email: 'amina@example.com', password: 'StrongPass123' }
              }
            }
          },
          responses: { '200': { description: 'Logged in' }, '401': { description: 'Invalid credentials' } }
        }
      },
      '/animals': {
        get: {
          summary: 'List animals with search, filtering, sorting and pagination',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } }
          ],
          responses: { '200': { description: 'Animals retrieved' } }
        },
        post: {
          security: [{ bearerAuth: [] }],
          summary: 'Create animal',
          responses: { '201': { description: 'Animal created' }, '403': { description: 'Forbidden' } }
        }
      },
      '/checkout/delivery-zones': {
        get: {
          summary: 'List active delivery zones',
          responses: { '200': { description: 'Delivery zones retrieved' } }
        }
      },
      '/checkout/coupons/validate': {
        post: {
          summary: 'Validate a checkout coupon',
          requestBody: {
            content: {
              'application/json': {
                example: { code: 'SALLAH10', subtotal: 250000 }
              }
            }
          },
          responses: { '200': { description: 'Coupon validated' }, '404': { description: 'Invalid coupon' } }
        }
      },
      '/animals/{slug}': {
        get: {
          summary: 'Get animal details by slug',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Animal retrieved' }, '404': { description: 'Not found' } }
        }
      },
      '/orders': {
        post: {
          security: [{ bearerAuth: [] }],
          summary: 'Create website order',
          responses: { '201': { description: 'Order created' } }
        }
      },
      '/orders/mine': {
        get: {
          security: [{ bearerAuth: [] }],
          summary: 'List authenticated customer orders',
          responses: { '200': { description: 'Orders retrieved' } }
        }
      },
      '/orders/reservations': {
        post: {
          security: [{ bearerAuth: [] }],
          summary: 'Reserve an animal for the authenticated customer',
          requestBody: {
            content: {
              'application/json': {
                example: { animalId: '64f000000000000000000001' }
              }
            }
          },
          responses: { '201': { description: 'Reservation created' } }
        }
      },
      '/payments/paystack/initialize': {
        post: {
          security: [{ bearerAuth: [] }],
          summary: 'Initialize Paystack payment',
          responses: { '201': { description: 'Payment initialized' } }
        }
      },
      '/payments/flutterwave/initialize': {
        post: {
          security: [{ bearerAuth: [] }],
          summary: 'Initialize Flutterwave payment',
          responses: { '201': { description: 'Payment initialized' } }
        }
      },
      '/whatsapp/webhook': {
        post: {
          summary: 'Termii WhatsApp webhook receiver',
          responses: { '201': { description: 'Message recorded' } }
        }
      },
      '/users/me': {
        get: {
          security: [{ bearerAuth: [] }],
          summary: 'Get authenticated customer profile',
          responses: { '200': { description: 'Profile retrieved' } }
        },
        patch: {
          security: [{ bearerAuth: [] }],
          summary: 'Update authenticated customer profile',
          responses: { '200': { description: 'Profile updated' } }
        }
      },
      '/reviews': {
        post: {
          security: [{ bearerAuth: [] }],
          summary: 'Create verified-buyer review',
          responses: { '201': { description: 'Review submitted' } }
        }
      },
      '/reports/sales-summary': {
        get: {
          security: [{ bearerAuth: [] }],
          summary: 'Sales dashboard summary',
          responses: { '200': { description: 'Summary retrieved' } }
        }
      },
      '/admin/dashboard/overview': {
        get: {
          security: [{ bearerAuth: [] }],
          summary: 'Admin dashboard overview',
          responses: { '200': { description: 'Dashboard overview retrieved' } }
        }
      }
    }
  },
  apis: []
});
