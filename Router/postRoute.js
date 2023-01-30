const postRouter = require("express").Router();
const {
    createPostController,
    updatePostController,
    likeDislikePost,
    deletePostController,
    postComment,
    deleteCommentController,
    followingPostController,
    getAllPostController,
    getPostByIdController,
} = require("../controllers/postController");
const { validateAccessUserToken } = require("../middleware/verifyCredentials");

postRouter.post("/createpost", validateAccessUserToken, createPostController);
postRouter.get("/all", validateAccessUserToken, getAllPostController);
postRouter.post("/updatepost", validateAccessUserToken, updatePostController);
postRouter.post("/likedislikepost", validateAccessUserToken, likeDislikePost);
postRouter.post("/deletepost", validateAccessUserToken, deletePostController);
postRouter.post("/comment", validateAccessUserToken, postComment);
postRouter.post(
    "/deletecomment",
    validateAccessUserToken,
    deleteCommentController
);
postRouter.get(
    "/followingpost",
    validateAccessUserToken,
    followingPostController
);
postRouter.get("/:postId", validateAccessUserToken, getPostByIdController);

module.exports = postRouter;
