const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    resumePath: { type: String },
    assignedRecruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // recruiter user id
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);


