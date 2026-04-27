
import Joi from "joi";

export const sendAlertSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "any.required": "Name is required",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone is required",
      "string.pattern.base": "Phone must be a valid 10 digit number",
      "any.required": "Phone is required",
    }),
  location: Joi.string().max(100).optional(),
  message: Joi.string().min(3).max(500).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message must be at least 3 characters",
    "any.required": "Message is required",
  }),
});

export const chatSchema = Joi.object({
  message: Joi.string().min(2).max(500).required().messages({
    "string.empty": "Message is required",
    "any.required": "Message is required",
  }),
});