const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { connectDB } = require("./database/connectDB");
const router = require("./Router/MainRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudnary = require("cloudinary").v2;
//cconnecting to environment variables
dotenv.config({ path: "./configs/.env" });

//connect DB
connectDB();
//cors setup
app.use(cors({ origin: true, credentials: true }));
//cookie-parser
app.use(cookieParser());
//body-parser
app.use(
    express.json({
        limit: "15mb",
    })
);

//config Cloudnary
cloudnary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET,
});
//specifing PORT
const PORT = process.env.PORT || 4001;

//entry point
app.get("/", (req, res) => {
    return res.send("Server Is Running");
});

//api router
app.use("/api/v1", router);
//server listern
app.listen(PORT, () => {
    console.log(`server is running on PROT ${PORT}`);
});
