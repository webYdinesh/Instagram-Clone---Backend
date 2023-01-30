const {
    createReelController,
    getAllReelController,
    likeDislikeReel,
    postCommentOnReel,
} = require("../controllers/reelController");
const { validateAccessUserToken } = require("../middleware/verifyCredentials");

const reelRouter = require("express").Router();

reelRouter.post("/create", validateAccessUserToken, createReelController);
reelRouter.post("/allreels", validateAccessUserToken, getAllReelController);
reelRouter.post("/likedislikereel", validateAccessUserToken, likeDislikeReel);
reelRouter.post("/commentreel", validateAccessUserToken, postCommentOnReel);
module.exports = reelRouter;
