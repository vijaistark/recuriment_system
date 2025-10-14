const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('Recruiter', recruiterSchema);
