const Joi = require("joi");

const quoteRule = { quote: Joi.string().min(2).max(1023).required() };
const keyedByRule = { keyedBy: Joi.string().min(1).max(255).required() };
const languageRule = { language: Joi.string().min(2).max(127) };
const sourceRule = { source: Joi.string().min(2).max(255).required() };
const linkRule = { link: Joi.string().min(2).max(2047) };
const mediaTypeRule = { mediaType: Joi.string().min(2).max(63) };
const createdByRule = {createdBy: Joi.string().min(2).max(127)};
const likesRule = { likes: Joi.array().items(Joi.string().min(2).max(127)) };

const quoteSchema = Joi.object({
  ...quoteRule,
  ...keyedByRule,
  ...languageRule,
  ...sourceRule,
  ...linkRule,
  ...mediaTypeRule,
  ...createdByRule,
  ...likesRule,
});



module.exports = { quoteSchema };
