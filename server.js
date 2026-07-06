const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // New import
const Student = require('./models/Student');
const app = express();
const PORT = 5000;

// Middleware to parse incoming JSON data from POST requests
app.use(express.json());

app.get('/api/students', async (req, res) => {
try {
const students = await Student.find();
res.status(200).json(students);
} catch (error) {
res.status(500).json({ message: "Server encountered an error retrieving the roster." });
}
});

app.post('/api/students', async (req, res) => {
try {
// Mongoose automatically validates against the schema
const newStudent = await Student.create(req.body);

res.status(201).json(newStudent);
} catch (error) {
// If validation fails (e.g., missing name), catch the error safely
res.status(400).json({ message: "Invalid student data provided." });
}
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/universityRoster')
.then(() => console.log('Connected to University MongoDB'))
.catch((err) => console.error('Database connection error:', err));

app.listen(PORT, () => {
console.log(`Roster API is live on port ${PORT}`);
});