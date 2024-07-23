const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        const mongodbUrl = process.env.MONGO_URI;
        await mongoose.connect(mongodbUrl)
            .then(() => {
                console.log("Connected to database successfully");
            });
    } catch (error) {
        console.log("Error connecting to database");
        console.log(error);
    }
};

module.exports = connectDatabase;