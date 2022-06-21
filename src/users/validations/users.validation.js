const Joi = require("joi");

const emailRule = {
  email: Joi.string().email().min(5).max(255).trim().required(),
};

const passwordRule = {
  password: Joi.string()
    .regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$"))
    .required(),
};

const firstnameRule = {
  firstName: Joi.string()
    .min(2)
    .max(127)
    .alphanum()
    .trim()
    .regex(new RegExp("^[A-Z][a-zA-Z0-9]+$"))
    .required(),
};

const lastnameRule = {
  lastName: Joi.string()
    .min(2)
    .max(127)
    .alphanum()
    .trim()
    .regex(new RegExp("^[A-Z][a-zA-Z0-9]+$"))
    .required(),
};

const userNameRule = {
  userName: Joi.string().min(2).max(127).required(),
};

const creatorAccountRule = {
  creatorAccount: Joi.boolean().required(),
};

const recoveryNumberRule = {
  recoveryNumber: Joi.number().min(100000).max(999999).required(),
};

const registerSchema = Joi.object({
  ...firstnameRule,
  ...lastnameRule,
  ...userNameRule,
  ...emailRule,
  ...passwordRule,
  ...creatorAccountRule,
});

const loginSchema = Joi.object({ ...emailRule, ...passwordRule });

const forgetPasswordSchema = Joi.object({ ...emailRule });

const recoverPasswordSchema = Joi.object({
  ...emailRule,
  ...recoveryNumberRule,
  ...passwordRule,
});

const validateEmailSchema = Joi.object({ ...emailRule });

module.exports = {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  recoverPasswordSchema,
  validateEmailSchema,
};
