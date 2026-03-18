const mongoose = require('mongoose');

const WeatherUpdateSchema = new mongoose.Schema({
    condition: {
        type: String,
        enum: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Foggy', 'Storm'],
        default: 'Sunny'
    },
    note: { type: String, default: '' },
    etaMinutes: { type: Number, default: 0 },
    updatedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedByName: { type: String, default: 'Driver' },
    updatedByRole: { type: String, default: 'driver' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeatherUpdate', WeatherUpdateSchema);

