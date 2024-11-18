const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bank Service API',
            version: '1.0.0',
            description: 'API for a bank service dashboard',
        },
        servers: [
            {
                url: 'http://localhost:3000/api', // Adjust this if your base URL changes
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Tells Swagger where to find route definitions
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;