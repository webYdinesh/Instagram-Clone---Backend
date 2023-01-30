const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { error, success } = require("../utils/customResponse");
const { generateAccessToken } = require("../utils/generateToken");

//validate user token
exports.validateAccessUserToken = async (req, res, next) => {
    try {
        if (!req?.headers?.authorization?.startsWith("Bearer")) {
            return res.send(error(400, "Access token not found"));
        }
        if (req?.headers?.authorization?.startsWith("Bearer")) {
            const userToken = req?.headers?.authorization.split(" ")[1];
            const validateToken = jwt.verify(
                String(userToken),
                process.env.SCREAT_ACCESS_TOKEN_KEY
            );
            if (!validateToken) {
                return res.send(error(401, "Invalid access token"));
            }
            //find user in DB - for secure
            const user = await userModel.findById(validateToken.id);
            if (!user) {
                return res.send(error(401, "user not valid"));
            }
            req.user = user;
            next();
        }
    } catch (e) {
        return res.send(error(401, e.message));
    }
};

//generate refresh token
exports.regenerateAccessToken = async (req, res) => {
    try {
        const userCookie = req?.cookies?.logincookie;

        if (!userCookie) {
            return res.send(error(401, "Cookie not found"));
        }
        const validateToken = jwt.verify(
            String(userCookie),
            process.env.SCREAT_REFRESH_TOKEN_KEY
        );
        if (!validateToken) {
            return res.send(error(401, "Invalid cookie"));
        }
        const regeneratedAccessToken = generateAccessToken(validateToken.id);
        return res.send(
            success(200, "New token generated", { regeneratedAccessToken })
        );
        next();
    } catch (e) {
        return res.send(error(401, e.message));
    }
};
