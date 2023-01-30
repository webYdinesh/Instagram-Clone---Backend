const jwt = require("jsonwebtoken");
//generating access token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.SCREAT_ACCESS_TOKEN_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
    });
};
//generating refresh token

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.SCREAT_REFRESH_TOKEN_KEY, {
        expiresIn: process.env.COOKIE_TOKEN_EXPIRY_TIME,
    });
};

module.exports = { generateAccessToken, generateRefreshToken };
