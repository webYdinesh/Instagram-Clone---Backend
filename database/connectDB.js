const mongoose = require("mongoose");
exports.connectDB = async () => {
    const mongoURI = process.env.MONGODBURI;
    await mongoose.connect(
        mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        () => {
            console.log("MongoDB Connected Successfully");
        }
    );
};
