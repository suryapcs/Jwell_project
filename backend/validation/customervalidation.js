const Joi = require('joi');

// Define Joi schema for user validation
const userValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    phone_number: Joi.string().pattern(/^[789]\d{9}$/)  // Matches numbers starting with 7, 8, or 9 followed by 9 digits
    .required()
    .messages({
      
      'any.required': '"phone_number" is required',
    }),
  
     // Example pattern for phone number format
    address: Joi.string().min(5).max(200).required(),
});

module.exports = userValidationSchema;