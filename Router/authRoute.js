const authRouter = require("express").Router();
const {
    signupController,
    loginController,
    logoutUserController,
} = require("../controllers/authController");
const { verifySignupDetails } = require("../middleware/validateDetails");
const {
    regenerateAccessToken,
    validateAccessUserToken,
} = require("../middleware/verifyCredentials");

authRouter.post("/signup", verifySignupDetails, signupController);
authRouter.post("/login", loginController);
authRouter.get("/refresh", regenerateAccessToken);
authRouter.get("/logout", validateAccessUserToken, logoutUserController);

module.exports = authRouter;
