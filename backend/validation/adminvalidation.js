const Joi = require('joi');

const adminValidationSchema = Joi.object({
    FirstName: Joi.string()
        .min(2)
        .max(50)
        .required(),

    LastName: Joi.string()
        .min(1)
        .max(50)
        .required(),

    Email: Joi.string()
        .email()
        .required(),

    Password: Joi.string()
        .required(),

    Role: Joi.string()
        .valid('admin')  // Adjust if you have more roles
        .default('admin'),

});

module.exports = {
    adminValidationSchema
};