const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, required: true },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
