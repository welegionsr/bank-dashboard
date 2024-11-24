require('dotenv').config();  // Load .env file
const basicAuth = require('express-basic-auth');

// src/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./swaggerDefinition');


// Now you can access these variables
const swaggerUser = process.env.SWAGGER_USER;
const swaggerPassword = process.env.SWAGGER_PASSWORD;


// Options for the swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: [],
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
