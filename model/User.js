const mongoose = require("mongoose");
const { modelConstants } = require("../constants/modelConstants");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  activation: {
    type: Boolean,
    default:false,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    required: true,
  },
  events: {
    type: Array,
  },
});

module.exports = mongoose.model(modelConstants.USER, userSchema);
