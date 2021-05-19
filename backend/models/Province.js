const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const provinces = require('../util/provinces');

const provinceSchema = mongoose.Schema({
  province: {
    type: String,
    enum: provinces,
    required: true,
    unique: true,
  },
  subarea: {
    type: String,
    required: true,
    enum: ["Pohjois- ja Itä-Suomi", "Länsi-Suomi", "Etelä-Suomi", "Helsinki-Uusimaa"],
  },
});

provinceSchema.plugin(uniqueValidator);

const Province = mongoose.model('Province', provinceSchema);

module.exports = Province;
