const userModel = require("../models/userModel");
const { success, error } = require("../utils/customResponse");
const bcrypt = require("bcryptjs");
const {
    generateRefreshToken,
    generateAccessToken,
} = require("../utils/generateToken");
//signup controller
exports.signupController = async (req, res) => {
    try {
        const { fullName, username, password, email } = req.body;
        const user = await userModel.create({
            fullName,
            username,
            password,
            email,
        });
        return res.send(success(201, "user signup successfully", user));
    } catch (e) {
        if (e.code === 11000) {
            return res.send(error(400, "user alreay exist"));
        }
        return res.send(error(500, e.message));
    }
};

//login controller
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const verifyEmail = await userModel
            .findOne({ email })
            .select("+password");
        if (!verifyEmail) {
            return res.send(error(404, "email or password is invalid"));
        }
        //verify password
        const verifyPassword = await bcrypt.compare(
            password,
            verifyEmail.password
        );
        if (!verifyPassword) {
            return res.send(error(404, "email or password is invalid"));
        }
        //generate token
        const accessToken = generateAccessToken(verifyEmail._id);
        //generate cookie
        const refreshToken = generateRefreshToken(verifyEmail._id);

        res.cookie("logincookie", refreshToken, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            samesite: "lax",
        });
        res.send(
            success(200, "login successfully", {
                verifyEmail,
                accessToken,
                refreshToken,
            })
        );
    } catch (e) {
        console.log(e);
        res.send(error(400, e.message));
    }
};

exports.logoutUserController = (req, res) => {
    try {
        res.cookie("logincookie", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        return res.send(success(200, "logout successfully"));
    } catch (e) {
        return res.send(error(400, e.message));
    }
};
