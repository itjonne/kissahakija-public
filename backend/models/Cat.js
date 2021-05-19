const mongoose = require('mongoose');

const catSchema = mongoose.Schema({
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

/* eslint-disable */
catSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
