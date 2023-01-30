const router = require("express").Router();
const authRouter = require("./authRoute");
const postRouter = require("./postRoute");
const reelRouter = require("./reelRoute");
const userRouter = require("./userRoute");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/reel", reelRouter);

module.exports = router;
