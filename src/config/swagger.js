require('dotenv').config();  // Load .env file
const basicAuth = require('express-basic-auth');

// src/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


// Now you can access these variables
const swaggerUser = process.env.SWAGGER_USER;
const swaggerPassword = process.env.SWAGGER_PASSWORD;

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Bank Service API',
        version: '1.0.0',
        description: 'API documentation for the Bank Service dashboard',
        contact: {
            name: 'Your Name',
            email: 'your-email@example.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000/api', // Your API base URL
        },
    ],
};

// Options for the swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'], // Path to the API routes (for reading JSDoc comments)
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Swagger UI setup (with basic auth)
const setupSwagger = (app) => {
    if (process.env.NODE_ENV !== 'production') {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    } else {
        // Protect Swagger UI with basic authentication
        app.use(
            '/api-docs',
            basicAuth({
                users: { [swaggerUser]: swaggerPassword },  // Use your credentials here
                challenge: true,
                unauthorizedResponse: 'Access Denied',
            }),
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec)
        );
        console.log("Swagger documentation is protected in production.");
    }
};

module.exports = setupSwagger;
