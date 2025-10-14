const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: String,
  resumeUrl: String,
  // allow recruiter link to be stored in assignment -> see Assignment model
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
