const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;
// Middleware to parse incoming JSON data from POST requests
app.use(express.json());

// Mock Application State
const roster = [
{ id: 1, name: "Kyle", status: "Enrolled" },
{ id: 2, name: "Casey", status: "Enrolled" },
{ id: 3, name: "Elijah", status: "Waitlisted" }
];

app.get('/api/students', (req, res) => {
res.status(200).json(roster);
});

app.post('/api/students', (req, res) => {
// 1. Extract the data sent by the client
const newStudent = req.body;
// 2. Generate a rudimentary ID (since we don't have a database doing it for us)
newStudent.id = roster.length + 1;
// 3. Push the new student into our mock array
roster.push(newStudent);
// 4. Return a 201 Created status and the newly added student
res.status(201).json(newStudent);
});

app.listen(PORT, () => {
console.log(`Roster API is live on port ${PORT}`);
});

app.listen(PORT, () => {
console.log(`Roster API is live on port ${PORT}`);
});