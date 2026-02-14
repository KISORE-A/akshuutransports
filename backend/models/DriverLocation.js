const mongoose = require('mongoose');

const DriverLocationSchema = new mongoose.Schema({
    driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DriverLocation', DriverLocationSchema);
