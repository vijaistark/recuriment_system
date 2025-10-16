const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'recruiter', 'candidate'], required: true },
    isPresent: { type: Boolean, default: false },
    meetingLink: { type: String }, // used for recruiters
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);


