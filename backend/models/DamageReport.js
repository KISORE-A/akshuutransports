const mongoose = require('mongoose');

const DamageReportSchema = new mongoose.Schema({
    busNo: { type: String, required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverName: { type: String, required: true },
    issueTitle: { type: String, required: true },
    description: { type: String, required: true },
    replacementRequired: { type: String, default: '' },
    images: { type: [String], default: [] }, // data URLs or hosted URLs
    amount: { type: Number, default: 0 },
    // Admin updates payment method after reimbursement to driver.
    paymentMethod: { type: String, default: '' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNote: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DamageReport', DamageReportSchema);
