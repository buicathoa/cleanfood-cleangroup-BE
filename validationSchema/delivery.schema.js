const Joi = require('joi')
// const {CONSTANT} = require('../constants');

const deliverySchema = Joi.object().keys({
  full_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  delivery_time: Joi.array().items(Date),
  province_id: Joi.string().required(),
  district_id: Joi.string().required(),
  ward_id: Joi.string().required(),
  address_detail: Joi.string().required(),
  full_address: Joi.string().optional(),
  default_address: Joi.boolean().required(),
});

module.exports = {deliverySchema}