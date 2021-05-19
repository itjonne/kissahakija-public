const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { provinces, subAreaOf } = require('../util/provinces');

const Cat = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  info: {
    type: String,
    trim: true,
    max: [280, 'liian pitkä info-tietue'],
    default: "",
  },
  url: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: String,
    trim: true,
    default: "2021-01-01",
  },
});

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    trim: true,
    required: true,
  },
  province: {
    type: String,
    enum: provinces,
    required: true,
  },
  info: {
    type: String,
    trim: true,
    max: [280, 'liian pitkä info-tietue'],
    default: "",
  },
  url: {
    type: String,
    unique: true,
    required: true,
  },
  objects: {
    all: [{
      type: Cat,
      default: [], // Tää saattaa olla jo defaulttina muutenki jos oikein ymmärsin.
      }], 
    day: [{
      type: Cat,
      default: [],
    }],
    week: [{
      type: Cat,
      default: [],
    }],
  },
});

siteSchema.plugin(uniqueValidator);

siteSchema.virtual('subarea').get(() => {
  return subAreaOf(this.province);
})

/* eslint-disable */
siteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Site = mongoose.model('Site', siteSchema);

module.exports = Site;