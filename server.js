require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
const protect = require('./middleware/protect');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to University MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// POST /api/staff/register
app.post('/api/staff/register', async (req, res) => {
try {
const { name, email, password } = req.body;

// 1. Hash the password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// 2. Create the staff member
const staff = await Staff.create({
name,
email,
password: hashedPassword
});

res.status(201).json({ message: "Staff registered successfully" });
} catch (error) {
res.status(400).json({ message: "Invalid data or user already exists." });
}
});

// POST /api/staff/login
app.post('/api/staff/login', async (req, res) => {
try {
const { email, password } = req.body;

// 1. Find the staff member
const staff = await Staff.findOne({ email });
if (!staff) return res.status(401).json({ message: "Invalid credentials" });

// 2. Compare passwords
const isMatch = await bcrypt.compare(password, staff.password);
if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

// 3. Generate JWT
const token = jwt.sign(
{ id: staff._id },
process.env.JWT_SECRET,
{ expiresIn: '30d' }
);

res.status(200).json({ token });
} catch (error) {
res.status(500).json({ message: "Server error during login" });
}
});

app.get('/api/students', protect, async (req, res) => {
try {
const students = await Student.find();
res.status(200).json(students);
} catch (error) {
res.status(500).json({ message: "Server encountered an error retrieving the roster." });
}
});

app.post('/api/students', protect, async (req, res) => {
try {
// Mongoose automatically validates against the schema
const newStudent = await Student.create(req.body);

res.status(201).json(newStudent);
} catch (error) {
// If validation fails (e.g., missing name), catch the error safely
res.status(400).json({ message: "Invalid student data provided." });
}
});

app.listen(PORT, () => {
console.log(`Roster API is live on port ${PORT}`);
});