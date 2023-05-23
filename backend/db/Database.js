const mongoose = require("mongoose");

const connectDatabase = () => {
    try {
        mongoose.connect(process.env.DB_URL);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database error");
    }
}

module.exports = connectDatabase;