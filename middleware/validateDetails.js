const { error } = require("../utils/customResponse");

exports.verifySignupDetails = async (req, res, next) => {
    try {
        const { fullName, username, password, email } = req.body;
        //validate details in backend
        if (!fullName || !username || !password || !email) {
            return res.send(error(406, "input fields empty."));
        }
        if (
            !email.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            )
        ) {
            return res.send(error(406, "email is invalid."));
        }
        if (!password.length >= 8) {
            return res.send(
                error(406, "password should be minimum 8 characters.")
            );
        }
        next();
    } catch (e) {
        res.send(error(406, e.message));
    }
};

exports.verifyLoginDetails = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.send(error(406, "email or password is invalid"));
        }
        if (
            !email.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            )
        ) {
            return res.send(error(406, "email is invalid."));
        }
        if (!password.length >= 8) {
            return res.send(error(406, "email or password is invalid"));
        }
        next();
    } catch (e) {
        res.send(error(400, e.message));
    }
};
