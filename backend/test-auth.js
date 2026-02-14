const mongoose = require('mongoose');

const uri = "mongodb+srv://kisoreme23_db_user:cG8lybkicKKk1Iyp@cluster0.zkz0kct.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority";

console.log("Connecting to:", uri.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(uri)
    .then(() => {
        console.log("SUCCESS: Connected!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("FAILED:", err.message);
        process.exit(1);
    });
