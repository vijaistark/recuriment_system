require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI);

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/recruiter', require('./routes/recruiterRoutes'));
app.use('/api/candidate', require('./routes/candidateRoutes'));

// static resumes
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads', 'resumes')));

app.get('/', (req, res) => res.send('Recruiting backend running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
