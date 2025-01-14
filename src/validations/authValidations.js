const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long and contain at least 1 letter, 1 number, and 1 special character',
        }),
    phone: Joi.string().pattern(/^\d+$/).required(),
    name: Joi.string().min(2).required(),
    balance: Joi.number().integer().min(0).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
});


module.exports = { registerSchema, loginSchema };