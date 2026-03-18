const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    category: {
        type: String,
        enum: ['general', 'emergency', 'route_change', 'delay', 'holiday', 'fee_reminder'],
        default: 'general'
    },
    targetAudience: {
        type: String,
        enum: ['all', 'students', 'teachers', 'drivers'],
        default: 'all'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String, default: 'Admin' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);

