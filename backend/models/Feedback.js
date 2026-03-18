const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        userName: { type: String, required: true, trim: true },
        userRole: { type: String, required: true, enum: ['student', 'teacher', 'driver', 'admin'] },
        type: { type: String, required: true, enum: ['good', 'bad', 'complaint', 'suggestion'] },
        title: { type: String, required: true, trim: true, maxlength: 120 },
        message: { type: String, required: true, trim: true, maxlength: 2000 },
        status: { type: String, enum: ['open', 'reviewed', 'resolved'], default: 'open' },
        adminReply: { type: String, default: '', maxlength: 2000, trim: true },
        repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        repliedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Feedback', FeedbackSchema);
