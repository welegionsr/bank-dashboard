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
            url: 'http://localhost:3003/api', // Your API base URL
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
                    balance: {
                        type: 'number',
                        description: 'The current balance of the user'
                    },
                    name: {
                        type: 'string',
                        description: 'The full name of the user'
                    }
                },
            },
            Transaction: {
                type: 'object',
                properties: {
                    sender: {
                        type: 'string',
                        description: 'Unique identifier for the sender',
                    },
                    receiver: {
                        type: 'string',
                        description: 'Unique identifier for the receiver',
                    },
                    amount: {
                        type: 'number',
                        description: 'The amount of money that is asked to send',
                    }
                },
            },
        },
    },
    paths: {
        '/users': {
            get: {
                summary: 'Retrieve all users',
                description: 'Get a list of all users in the system. Requires authentication and admin role.',
                tags: ['Users'],
                security: [
                    {
                        bearerAuth: [],
                        role: 'admin'
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
                    403: {
                        description: 'Forbidden: Admin role required',
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
        '/users/me': {
            get: {
                summary: 'Retrieve user details of current user',
                description: 'Get user details of the currently authenticated user. Requires authentication.',
                tags: ['Users'],
                security: [
                    {
                        bearerAuth: [],
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
                description: 'Registers a new user by providing the required fields.',
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
                                    name: {
                                        type: 'string'
                                    },
                                    balance: {
                                        type: 'number'
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Verification email sent to user',
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
                                        userId: {
                                            type: 'string'
                                        }
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid credentials',
                    },
                    403: {
                        description: 'Account not verified'
                    },
                    500: {
                        description: 'Server error',
                    },
                },
            },
        },
        '/auth/token': {
            post: {
                summary: 'Verify token',
                description: 'Checks if a given token is valid.',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: {
                                        type: 'string',
                                    }
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Token is valid',
                    },
                    403: {
                        description: 'Invalid token',
                    },
                    500: {
                        description: 'Server error',
                    },
                },
            },
        },
        '/auth/verify': {
            post: {
                summary: 'Verify user after registration',
                description: 'Verify the code sent to the user by email to complete the registration process.',
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
                                    verificationCode: {
                                        type: 'string'
                                    }
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Code is valid',
                    },
                    400: {
                        description: 'Code and/or email missing'
                    },
                    401: {
                        description: 'Verification code has expired'
                    },
                    403: {
                        description: 'Invalid code',
                    },
                    404: {
                        description: 'Email not found'
                    },
                    500: {
                        description: 'Server error',
                    },
                },
            },
        },
        '/auth/resend': {
            post: {
                summary: 'Resend verification code by email',
                description: 'Resend verification code to the given email address, to be used in cases where the previously send code was invalid or did not arrive.',
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
                                    }
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Resent successfully',
                    },
                    400: {
                        description: 'Email not valid, or user already verified!'
                    },
                    404: {
                        description: 'Email not found'
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
                        description: 'Bad request (either tried to send to themselves, or amount was 0, or tried to send amount larger than their balance)',
                    },
                    404: {
                        description: 'Either sender or receiver do not exist',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/transactions/me': {
            get: {
                summary: 'Retrieve all transactions of logged-in user',
                description: 'Get a list of all transactions of current user. Requires authentication.',
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
                    400: {
                        description: 'Bad Request: Invalid user ID format',
                    },
                    500: {
                        description: 'Server error',
                    },
                },
            },
        },
        '/transactions/user/{userEmail}': {
            get: {
                summary: 'Retrieve all transitions of a specified user',
                description: 'Fetch details of all transactions of a specific user. Requires authentication and admin role.',
                tags: ['Transactions'],
                security: [
                    {
                        bearerAuth: [],
                        role: 'admin'
                    },
                ],
                parameters: [
                    {
                        name: 'userEmail',
                        in: 'path',
                        required: true,
                        description: 'email of the user to get transactions for',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Successfully retrieved user transactions',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Transaction',
                                    }
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    403: {
                        description: 'Forbidden: Admin role required',
                    },
                    404: {
                        description: 'User or transactions not found',
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
