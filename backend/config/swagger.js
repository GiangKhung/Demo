const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DocShare API',
      version: '1.0.0',
      description: 'API documentation for DocShare - Document Sharing Platform',
      contact: {
        name: 'DocShare Team',
        email: 'support@docshare.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.docshare.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (min 6 characters)'
            },
            createdat: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            },
            updatedat: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        Document: {
          type: 'object',
          required: ['title', 'file'],
          properties: {
            id: {
              type: 'string',
              description: 'Document ID'
            },
            title: {
              type: 'string',
              description: 'Document title'
            },
            description: {
              type: 'string',
              description: 'Document description'
            },
            subject: {
              type: 'string',
              description: 'Document subject/category'
            },
            ispublic: {
              type: 'boolean',
              description: 'Whether document is public'
            },
            fileurl: {
              type: 'string',
              description: 'File URL'
            },
            filetype: {
              type: 'string',
              description: 'File type/extension'
            },
            filesize: {
              type: 'integer',
              description: 'File size in bytes'
            },
            userid: {
              type: 'string',
              description: 'Owner user ID'
            },
            createdat: {
              type: 'string',
              format: 'date-time',
              description: 'Upload date'
            },
            updatedat: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        Bookmark: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Bookmark ID'
            },
            userid: {
              type: 'string',
              description: 'User ID'
            },
            documentid: {
              type: 'string',
              description: 'Document ID'
            },
            document: {
              $ref: '#/components/schemas/Document'
            },
            createdat: {
              type: 'string',
              format: 'date-time',
              description: 'Bookmark creation date'
            }
          }
        },
        UserActivity: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Activity ID'
            },
            userid: {
              type: 'string',
              description: 'User ID'
            },
            action: {
              type: 'string',
              enum: ['register', 'login', 'upload', 'view', 'download', 'save', 'delete'],
              description: 'Activity type'
            },
            details: {
              type: 'string',
              description: 'Activity details'
            },
            createdat: {
              type: 'string',
              format: 'date-time',
              description: 'Activity timestamp'
            }
          }
        },
        UserStats: {
          type: 'object',
          properties: {
            totalDocuments: {
              type: 'integer',
              description: 'Total documents uploaded'
            },
            totalBookmarks: {
              type: 'integer',
              description: 'Total bookmarks saved'
            },
            totalViews: {
              type: 'integer',
              description: 'Total document views'
            },
            totalDownloads: {
              type: 'integer',
              description: 'Total downloads'
            },
            storageUsed: {
              type: 'integer',
              description: 'Storage used in bytes'
            },
            documentsByType: {
              type: 'object',
              description: 'Documents grouped by file type'
            },
            recentActivities: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/UserActivity'
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'] // Paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions: {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'DocShare API Documentation'
  }
};
