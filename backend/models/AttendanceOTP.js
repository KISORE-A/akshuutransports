const mongoose = require('mongoose');

const AttendanceOTPSchema = new mongoose.Schema({
    code: { type: String, required: true, index: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('AttendanceOTP', AttendanceOTPSchema);
