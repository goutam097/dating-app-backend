const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    first_name: Joi.string().required().trim().label("First Name"),
    last_name: Joi.string().optional().trim().label("Last Name"),
    email: Joi.string().required().trim().label("Email Id"),
    phone: Joi.string().optional().trim().label("Phone Number"),
    dob: Joi.string().optional().trim().label("Date of Birth"),
    password: Joi.string().required().custom(password).trim().label("Password"),
    gender: Joi.string().optional().valid('male', 'female').label("Gender"),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().trim().label("Email Id"),
    password: Joi.string().required().trim().label("Password"),
  }),
};

module.exports = {
  register,
  login
};
