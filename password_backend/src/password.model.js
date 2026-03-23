const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  currentPassword: {
    type: String,
    required: true
  },
  newPassword: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Password', passwordSchema);
