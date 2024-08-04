// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database Schema
const studentSchema = new mongoose.Schema({
  name: String,
  code: String,
  grades: [{
    subject: String,
    grade: String,
  }],
});

const Student = mongoose.model('Student', studentSchema);

// Routes

// Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle Login
app.post('/login', async (req, res) => {
  const { name, code } = req.body;

  try {
    const student = await Student.findOne({ name, code });

    if (!student) {
      res.send('Invalid name or access code. Please try again.');
    } else {
      res.sendFile(path.join(__dirname, 'public', 'grades.html'));
    }
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// API to Get Grades (To be used by the frontend)
app.get('/api/grades', async (req, res) => {
  const { name, code } = req.query;

  try {
    const student = await Student.findOne({ name, code });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(student.grades);
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
