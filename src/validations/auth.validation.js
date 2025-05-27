const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getOtp = {
  body: Joi.object().keys({
    phone: Joi.string().required().trim().label("Phone Number"),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    phone: Joi.string().required().trim().label("Phone Number"),
    otp: Joi.number().required().label("OTP"),
  }),
};

module.exports = {
  getOtp,
  verifyOtp
};
