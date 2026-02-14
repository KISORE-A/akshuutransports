const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    busNo: { type: String, required: true, unique: true },
    type: { type: String, default: 'Transport' },
    status: { type: String, default: 'Running' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    capacity: { type: Number, default: 40 }
});

module.exports = mongoose.model('Bus', BusSchema);
