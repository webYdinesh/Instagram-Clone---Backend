const {
    followUnfollowUserController,
    getMyProfileController,
    getUserProfileController,
    SavePostController,
    updateProfileController,
    getAllUser,
    getUserBySearchController,
} = require("../controllers/userController");
const { validateAccessUserToken } = require("../middleware/verifyCredentials");

const userRouter = require("express").Router();

userRouter.post(
    "/followunfollow",
    validateAccessUserToken,
    followUnfollowUserController
);

userRouter.get("/profile/me", validateAccessUserToken, getMyProfileController);
userRouter.get(
    "/profile/:profileid",
    validateAccessUserToken,
    getUserProfileController
);
userRouter.post("/savedpost", validateAccessUserToken, SavePostController);
userRouter.put(
    "/updateprofile",
    validateAccessUserToken,
    updateProfileController
);
userRouter.get("/alluser", validateAccessUserToken, getAllUser);
userRouter.post(
    "/searchbyquery",
    validateAccessUserToken,
    getUserBySearchController
);

module.exports = userRouter;
