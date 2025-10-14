const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, unique: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  gmeetLink: { type: String, default: '' } // recruiter can add this
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
