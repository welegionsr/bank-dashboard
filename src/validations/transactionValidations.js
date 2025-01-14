const Joi = require('joi');

const transactionCreateSchema = Joi.object({
    sender: Joi.string().email().required(),
    receiver: Joi.string().email().required(), 
    amount: Joi.number().min(1).required(), 
    date: Joi.date().optional(), // optional (default handled in DB)
});

module.exports = { transactionCreateSchema };