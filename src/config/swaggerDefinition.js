const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Bank Service API',
        version: '0.0.1',
        description: 'API documentation for the GoldFront Bank backend',
        contact: {
            name: 'Admin',
            email: 'not-a-real-email@example.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000/api', // Your API base URL
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
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique identifier for the user',
                    },
                    email: {
                        type: 'string',
                        description: 'The user\'s email address',
                    },
                    phone: {
                        type: 'string',
                        description: 'The user\'s phone number',
                    },
                    isVerified: {
                        type: 'boolean',
                        description: 'Indicates if the user has completed email verification',
                    },
                },
            },
        },
    },
    paths: {
        '/users': {
            get: {
                summary: 'Retrieve all users',
                description: 'Get a list of all users in the system. Requires authentication.',
                tags: ['Users'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    200: {
                        description: 'Successfully retrieved list of users',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/User',
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                },
            },
            post: {
                summary: 'Create a new user',
                description: 'Create a new user in the system.',
                tags: ['Users'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User created successfully',
                    },
                    400: {
                        description: 'Bad request',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/users/{id}': {
            get: {
                summary: 'Retrieve a specific user',
                description: 'Fetch details of a specific user by ID. Requires authentication.',
                tags: ['Users'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID of the user to retrieve',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Successfully retrieved user details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'User not found',
                    },
                },
            },
            put: {
                summary: 'Update an existing user',
                description: 'Update a specific user\'s details by ID. Requires authentication.',
                tags: ['Users'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID of the user to update',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User updated successfully',
                    },
                    400: {
                        description: 'Bad request',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'User not found',
                    },
                },
            },
            delete: {
                summary: 'Delete a user',
                description: 'Remove a specific user from the system by ID. Requires authentication.',
                tags: ['Users'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID of the user to delete',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'User deleted successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'User not found',
                    },
                },
            },
        },
        '/auth/register': {
            post: {
                summary: 'Register a new user',
                description: 'Registers a new user by providing email, password, and phone number.',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                    },
                                    password: {
                                        type: 'string',
                                    },
                                    phone: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User successfully registered',
                    },
                    400: {
                        description: 'Invalid data',
                    },
                    500: {
                        description: 'Server error',
                    },
                },
            },
        },
        '/auth/login': {
            post: {
                summary: 'Log in a user',
                description: 'Logs in a user by providing email and password.',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                    },
                                    password: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'JWT token generated',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid credentials',
                    },
                    500: {
                        description: 'Server error',
                    },
                },
            },
        },
        '/transactions': {
            get: {
                summary: 'Retrieve all transactions',
                description: 'Get a list of all transactions. Requires authentication.',
                tags: ['Transactions'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    200: {
                        description: 'Successfully retrieved list of transactions',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Transaction',
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                },
            },
            post: {
                summary: 'Create a new transaction',
                description: 'Create a new transaction between two users. Requires authentication.',
                tags: ['Transactions'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Transaction',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Transaction created successfully',
                    },
                    400: {
                        description: 'Bad request',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/transactions/{id}': {
            get: {
                summary: 'Retrieve a specific transaction',
                description: 'Fetch details of a specific transaction by ID. Requires authentication.',
                tags: ['Transactions'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID of the transaction to retrieve',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Successfully retrieved transaction details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Transaction',
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Transaction not found',
                    },
                },
            },
            put: {
                summary: 'Update an existing transaction',
                description: 'Update a specific transaction by ID. Requires authentication.',
                tags: ['Transactions'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID of the transaction to update',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Transaction',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Transaction updated successfully',
                    },
                    400: {
                        description: 'Bad request',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Transaction not found',
                    },
                },
            },
            delete: {
                summary: 'Delete a transaction',
                description: 'Remove a specific transaction by ID. Requires authentication.',
                tags: ['Transactions'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID of the transaction to delete',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Transaction deleted successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Transaction not found',
                    },
                },
            },
        },
    },
};

module.exports = swaggerDefinition;
