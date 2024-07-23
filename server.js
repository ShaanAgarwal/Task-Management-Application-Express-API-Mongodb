const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');

dotenv.config();

connectDatabase();

const app = express();

const port = process.env.PORT;

app.get("/", (req, res) => {
    try {
        return res.status(200).json({ message: "Server is running successfully.", success: false });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", success: false });
    };
});

app.listen(port, () => {
    console.log(`Server is successfully running on port ${port}`);
});