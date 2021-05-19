const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const verificationSchema = mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
});

verificationSchema.plugin(uniqueValidator);

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
