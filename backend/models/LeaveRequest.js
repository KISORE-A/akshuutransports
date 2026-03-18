const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requesterName: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'driver'], required: true },
    reason: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    fromTime: { type: String, default: "" },
    toTime: { type: String, default: "" },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approverRole: { type: String, enum: ['teacher', 'admin'] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
