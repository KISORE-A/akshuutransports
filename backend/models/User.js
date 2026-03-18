const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'driver', 'admin', 'teacher'], default: 'student' },
    phone: { type: String },
    department: { type: String },
    year: { type: String },
    studentId: { type: String },
    // Driver-only profile fields
    licenseNo: { type: String },
    licenseCardImage: { type: String }, // data URL or hosted URL
    assignedBusNo: { type: String }, // optional fallback if bus.driverId isn't set
    isTwoFactorEnabled: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
