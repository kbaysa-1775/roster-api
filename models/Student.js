const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Enrolled'
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);