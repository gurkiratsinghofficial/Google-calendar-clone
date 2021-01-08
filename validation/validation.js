const Joi = require("@hapi/joi");

/**
 * request Validations
 */
exports.validation = {
  /**Signup validator */
  signupValidation: (data) => {
    const schema = {
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().min(6).required().email(),
      password: Joi.string().min(8).required(),
      gender: Joi.string().required(),
      address: Joi.string().required(),
      phone: Joi.string().min(10).required(),
      profilePhoto: Joi.string().allow(),
    };
    return Joi.validate(data, schema);
  },
  /**update user details validator */
  updateValidation: (data) => {
    const schema = {
      firstname: Joi.string().allow(null, ""),
      lastname: Joi.string().allow(null, ""),
      address: Joi.string().allow(null, ""),
      phone: Joi.string().min(10).allow(null, ""),
    };
    return Joi.validate(data, schema);
  },
  /**login validator */
  loginValidation: (data) => {
    const schema = {
      email: Joi.string().min(6).required().email(),
      password: Joi.string().min(8).required(),
    };
    return Joi.validate(data, schema);
  },
  /**Add event validator */
  eventValidation: (data) => {
    const schema = {
      eventDate: Joi.string().required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
      title: Joi.string().required(),
      guests: Joi.array().allow(null, ""),
      description: Joi.string().required(),
      event_id: Joi.string().required().allow(null, "").optional(),
      participant: Joi.boolean().allow(null, ""),
      organizer: Joi.string().min(10).allow(null, ""),
      organizerEmail: Joi.string().min(10).allow(null, ""),
    };
    return Joi.validate(data, schema);
  },
  /**delete event validator */
  eventDeleteValidation: (data) => {
    const schema = {
      start: Joi.string().required(),
      end: Joi.string().required(),
      title: Joi.string().required(),
      guests: Joi.array().allow(null, ""),
      event_id: Joi.string().required().allow(null, "").optional(),
    };
    return Joi.validate(data, schema);
  },
};
