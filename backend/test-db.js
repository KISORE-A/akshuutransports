const mongoose = require('mongoose');
require('dotenv').config();

console.log("Attempting to connect with URI:", process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB");
        process.exit(0);
    })
    .catch((err) => {
        console.error("ERROR: Connection failed");
        console.error("Name:", err.name);
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("CodeName:", err.codeName);
        if (err.cause) console.error("Cause:", err.cause);
        process.exit(1);
    });
