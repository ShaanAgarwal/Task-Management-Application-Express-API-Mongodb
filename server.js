const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDatabase = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

connectDatabase();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/user', userRoutes);

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