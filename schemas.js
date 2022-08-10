const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.patientSchema = Joi.object({
  patient: Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).required().escapeHTML(),
    lastname: Joi.string().alphanum().min(3).max(30).required().escapeHTML(),
    father: Joi.string().alphanum().min(3).max(30).required().escapeHTML(),
    birthdate: Joi.date().max("now"),
    phone: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
      .required(),
  }).required(),
});

module.exports.consultation = Joi.object({
  consultatio: Joi.object({
    
  }).required(),
});
