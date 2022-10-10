const Joi = require('joi')
// const {CONSTANT} = require('../constants');

const userSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  // username: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().optional().allow(''),
  // gender: Joi.string().valid(CONSTANT.GENDER.FEMALE, CONSTANT.GENDER.MALE),
  cover: Joi.string().optional().allow(''),
  // dateOfBirth: Joi.date(),
  password: Joi.string().required(),
  role: Joi.string().optional().allow('')
  // role: Joi.string().valid(CONSTANT.ROLE.DOCTOR, CONSTANT.ROLE.PATIENT, CONSTANT.ROLE.STAFF),
});

const updatePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
})

const updateUserSchema = Joi.object().keys({
  id: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().optional().allow(''),
  cover: Joi.any().optional(),
  password: Joi.any().optional().allow(''),
  role: Joi.string().optional().allow(''),
  experiences: Joi.string().optional().allow(''),
  specialist: Joi.string().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  certificates: Joi.string().optional().allow(''),
  stars: Joi.number().optional().allow(''),

  

  // gender: Joi.string().valid(CONSTANT.GENDER.MALE, CONSTANT.GENDER.FEMALE),
  // dateOfBirth: Joi.date(),
  // cover: Joi.string().optional().allow('')
  
});
const userGetDetails = Joi.object().keys({
  userID: Joi.string().required()
})

const userLoginSchema = Joi.object().keys({
  // password: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required()
});

const userUpdateSchema = Joi.object().keys({
  // password: Joi.string().required(),
  id: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  address: Joi.string().required(),
});


// const interactionSchema = Joi.object().keys({
//   postID: Joi.string().required(),
//   type: Joi.string().required().valid(CONSTANT.INTERACTION_TYPE.LIKE, CONSTANT.INTERACTION_TYPE.DISLIKE),
  
// });

const userDeleteSchema = Joi.object().keys({
  userID: Joi.string().required()
});

const deleteUsersSchema = Joi.object().keys({
  userIDs: Joi.array()
});

const loadInteractionSchema = Joi.object().keys({
  postID: Joi.string().required()
})

const updateDoctorRateSchema = Joi.object().keys({
  doctorID: Joi.string().required(),
  rate: Joi.number().required()
});

module.exports = {
  userSchema,
  // updateUserSchema,
  userLoginSchema,
  userUpdateSchema
  // userGetDetails,
  // interactionSchema,
  // updatePasswordSchema,
  // userDeleteSchema,
  // deleteUsersSchema,
  // updateDoctorRateSchema,
  // loadInteractionSchema
};
