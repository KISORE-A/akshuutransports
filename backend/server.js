const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./db');

// Models
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const DriverLocation = require('./models/DriverLocation');
const Bus = require('./models/Bus');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'akshuu_secret_key_fallback_2026';

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Middleware to verify Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: "No token provided" });

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err.message);
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// Health Check
app.get('/', (req, res) => {
    res.json({ status: "Backend is running", time: new Date() });
});

// ================= AUTHENTICATION =================
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role || 'student' });
        await newUser.save();
        res.json({ id: newUser._id, message: "User created" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ================= USERS & ADMIN =================
app.get('/api/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        // Transform _id to id for frontend compatibility
        const formattedUsers = users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role }));
        res.json(formattedUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/user/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/user/profile', verifyToken, async (req, res) => {
    const { name, phone, department, year, studentId, isTwoFactorEnabled } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, phone, department, year, studentId, isTwoFactorEnabled },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= ATTENDANCE =================
app.post('/api/attendance/mark', verifyToken, async (req, res) => {
    const { studentId, status } = req.body;
    try {
        const newAttendance = new Attendance({ student_id: studentId, status });
        await newAttendance.save();
        res.json({ message: "Attendance marked", id: newAttendance._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/attendance/:studentId', verifyToken, async (req, res) => {
    const { studentId } = req.params;
    try {
        const records = await Attendance.find({ student_id: studentId }).sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/attendance', verifyToken, async (req, res) => {
    if (req.userRole === 'student') return res.status(403).json({ error: "Access denied" });
    try {
        // Populate student info
        const records = await Attendance.find().populate('student_id', 'name email').sort({ date: -1 });

        // Flatten for frontend consistency
        const flattened = records.map(r => ({
            _id: r._id,
            date: r.date,
            status: r.status,
            student_id: r.student_id?._id,
            student_name: r.student_id?.name,
            student_email: r.student_id?.email
        }));

        res.json(flattened);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= BUS MANAGEMENT =================
app.get('/api/buses', verifyToken, async (req, res) => {
    try {
        const buses = await Bus.find();
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/buses', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ error: "Access denied" });

    const { busNo, type, status, capacity } = req.body;
    try {
        const newBus = new Bus({ busNo, type, status, capacity });
        await newBus.save();
        res.json(newBus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/buses/:id', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ error: "Access denied" });

    try {
        await Bus.findByIdAndDelete(req.params.id);
        res.json({ message: "Bus deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= DRIVER LOCATION =================
app.post('/api/driver/location', verifyToken, async (req, res) => {
    const { lat, lng } = req.body;
    const driverId = req.userId;

    if (req.userRole !== 'driver') return res.status(403).json({ error: "Only drivers can update location" });

    try {
        const newLocation = new DriverLocation({ driver_id: driverId, lat, lng });
        await newLocation.save();
        res.json({ message: "Location updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/driver/location/:driverId', verifyToken, async (req, res) => {
    const { driverId } = req.params;
    try {
        const location = await DriverLocation.findOne({ driver_id: driverId }).sort({ timestamp: -1 });
        res.json(location || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
