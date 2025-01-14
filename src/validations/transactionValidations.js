const Joi = require('joi');

const transactionCreateSchema = Joi.object({
    sender: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('Invalid sender ID');
        }
        return value;
    }).required(),
    receiver: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('Invalid receiver ID');
        }
        return value;
    }).required(),
    amount: Joi.number().min(1).required(),  // in cents, so positive values only
    date: Joi.date().optional(), // optional if not provided (db can take current date)
});

module.exports = { transactionCreateSchema };