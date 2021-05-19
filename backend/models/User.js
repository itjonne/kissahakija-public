const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validators = require('../util/validators');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: {
      validator: validators.validateEmail,
      message: 'virheellinen sähköpostiosoite',
    },
  },
  name: {
    type: String,
    trim: true,
    min: [3, 'liian lyhyt käyttäjänimi'],
    max: [32, 'liian pitkä käyttäjänimi'],
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  sites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    default: [],
  }],
});

userSchema.plugin(uniqueValidator);

/* eslint-disable */
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.passwordHash;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
