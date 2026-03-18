const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./db');
const User = require('./models/User');
const Attendance = require('./models/Attendance');

require('dotenv').config();

const seed = async () => {
    await connectDB();

    try {
        await User.deleteMany({}); // Clear existing users
        await Attendance.deleteMany({}); // Clear existing attendance

        const saltRounds = 10;
        const pass123456 = await bcrypt.hash('123456', saltRounds);
        const pass789456 = await bcrypt.hash('789456', saltRounds);

        const usersData = [
            // Generic accounts (localhost:3000)
            { name: 'Admin User',         email: 'admin@bit.edu',                  role: 'admin',   password: pass123456 },
            { name: 'Student User',       email: 'student@bit.edu',                role: 'student', password: pass123456 },
            { name: 'Driver User',        email: 'driver@bit.edu',                 role: 'driver',  password: pass123456 },
            { name: 'Teacher User',       email: 'teacher@bit.edu',                role: 'teacher', password: pass123456 },

            // Bitsathy accounts from saved passwords (localhost:3000)
            { name: 'Akshayaa',          email: 'akshayaa@bitsathy.ac.in',        role: 'student', password: pass123456 },
            { name: 'Chitradevi',        email: 'chitradevi@bitsathy.ac.in',      role: 'teacher', password: pass789456 },
            { name: 'Divya A',           email: 'divya@bitsathy.ac.in',           role: 'admin',   password: pass123456 },
            { name: 'Kisor Kumar',       email: 'kisore.me23@bitsathy.ac.in',     role: 'student', password: pass123456 },
            { name: 'Saranya',           email: 'saranya@bitsathy.ac.in',         role: 'student', password: pass789456 },
            { name: 'Siva',              email: 'siva@driverbitsathy.ac.in',      role: 'driver',  password: pass123456 },
            { name: 'Vasudev',           email: 'vasudev.ee23@bitsathy.ac.in',    role: 'student', password: pass789456 },
        ];

        const createdUsers = await User.insertMany(usersData);

        // Find students
        const students = createdUsers.filter(u => u.role === 'student');

        // Generate sample attendance for last 10 days
        const attendanceRecords = [];
        const statuses = ['Present', 'Present', 'Present', 'Absent', 'Present'];

        students.forEach(student => {
            for (let i = 0; i < 10; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                attendanceRecords.push({
                    student_id: student._id,
                    date: date,
                    status: statuses[Math.floor(Math.random() * statuses.length)]
                });
            }
        });

        await Attendance.insertMany(attendanceRecords);

        console.log("✅ Database seeded successfully!");
        console.log("📋 Users created:");
        usersData.forEach(u => console.log(`   ${u.role.toUpperCase()}: ${u.email}`));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
