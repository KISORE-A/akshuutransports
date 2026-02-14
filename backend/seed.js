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
        const password = await bcrypt.hash('123456', saltRounds);

        const usersData = [
            { name: 'Admin User', email: 'admin@bit.edu', role: 'admin', password },
            { name: 'Student User', email: 'student@bit.edu', role: 'student', password },
            { name: 'Kisor Kumar', email: 'kisor@bit.edu', role: 'student', password }, // Adding another student
            { name: 'Driver User', email: 'driver@bit.edu', role: 'driver', password },
            { name: 'Teacher User', email: 'teacher@bit.edu', role: 'teacher', password }
        ];

        const createdUsers = await User.insertMany(usersData);

        // Find students
        const students = createdUsers.filter(u => u.role === 'student');

        // Generate sample attendance for last 7 days
        const attendanceRecords = [];
        const statuses = ['Present', 'Present', 'Present', 'Absent', 'Present'];

        students.forEach(student => {
            for (let i = 0; i < 7; i++) {
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

        console.log("Database seeded successfully with users and attendance");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
