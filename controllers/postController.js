const postModel = require("../models/postModel");
const { success, error } = require("../utils/customResponse");
const cloudinary = require("cloudinary").v2;
//to create post
exports.createPostController = async (req, res) => {
    try {
        const curUser = req.user;
        const { caption, image } = req.body;
        if (!image) {
            return res.send(error(404, "image not found"));
        }
        const createdPost = await postModel.create({
            caption,
        });
        const { public_id, secure_url } = await cloudinary.uploader.upload(
            image,
            {
                folder: "postimages",
            }
        );
        createdPost.image = {
            public_id,
            url: secure_url,
        };
        createdPost.owner = curUser._id;
        curUser.post.push(createdPost._id);
        await createdPost.save();
        await curUser.save();
        return res.send(
            success("201", "post created successfully", createdPost)
        );
    } catch (e) {
        console.log(e);
        return res.send(error("400", e.message));
    }
};

//get all post
exports.getAllPostController = async (req, res) => {
    try {
        const allPosts = await postModel
            .find()
            .populate("owner")
            .populate("likes")
            .sort("-createdAt");
        return res.send(success(200, "success", { posts: allPosts }));
    } catch (e) {
        return res.send(error(400, e.message));
    }
};
//to update post
exports.updatePostController = async (req, res) => {
    try {
        const { targetPostId, updatedCaption } = req.body;
        if (!targetPostId) {
            return res.send(error(404, "post id invalid"));
        }
        const curUser = req.user;
        const findTargetPost = await postModel.findById(targetPostId);
        if (!findTargetPost) {
            return res.send(error(404, "post not found"));
        }
        if (findTargetPost.owner.toString() !== curUser._id.toString()) {
            return res.send(error(400, "Only owner can update post."));
        }
        findTargetPost.caption = updatedCaption;
        await findTargetPost.save();
        return res.send(
            success(202, "Post updated successfully", findTargetPost)
        );
    } catch (e) {
        return res.send(error("400", e.message));
    }
};

//to delete Post
exports.deletePostController = async (req, res) => {
    try {
        const { targetPostId } = req.body;
        console.log(targetPostId);
        if (!targetPostId) {
            return res.send(error(404, "post id invalid"));
        }
        const curUser = req.user;
        const findTargetPost = await postModel.findById(targetPostId);
        if (!findTargetPost) {
            return res.send(error(404, "post not found"));
        }
        if (findTargetPost.owner.toString() !== curUser._id.toString()) {
            return res.send(error(400, "Only owner can delete their post."));
        }

        await cloudinary.uploader.destroy(findTargetPost.image.public_id);
        const findPostIndexIncurUserData = curUser.post.indexOf(
            findTargetPost._id
        );
        curUser.post.splice(findPostIndexIncurUserData, 1);
        await curUser.save();
        await findTargetPost.delete();
        return res.send(
            success(200, "Post delete successfully", findTargetPost)
        );
    } catch (e) {
        return res.send(error("400", e.message));
    }
};

//to like & dislike post
exports.likeDislikePost = async (req, res) => {
    try {
        const { targetPostId } = req.body;

        const curUser = req.user;

        if (!targetPostId) {
            return res.send(error(404, "post id invalid"));
        }
        const findTargetPost = await postModel.findById(targetPostId);
        if (!findTargetPost) {
            return res.send(error(404, "post not found"));
        }
        //if already post Likes => Dislike Logic
        if (findTargetPost.likes.includes(curUser._id)) {
            const findIndexOfLike = findTargetPost.likes.indexOf(curUser._id);
            findTargetPost.likes.splice(findIndexOfLike, 1);
            await findTargetPost.save();
            return res.send(success(200, "unliked"));
        }
        //if NOT Likes => Like Logic
        findTargetPost.likes.push(curUser._id);
        await findTargetPost.save();
        return res.send(success(200, "liked", { postid: findTargetPost._id }));
    } catch (e) {
        return res.send(error(404, e.message));
    }
};

//to comment on post
exports.postComment = async (req, res) => {
    try {
        const { targetPostId, comment } = req.body;
        const curUser = req.user;
        if (!comment) {
            return res.send(error(404, "comment is missing"));
        }
        if (!targetPostId) {
            return res.send(error(404, "post id invalid"));
        }
        const findTargetPost = await postModel.findById(targetPostId);
        if (!findTargetPost) {
            return res.send(error(404, "post not found"));
        }
        //user id on comments
        findTargetPost.comments.push({ user: curUser._id, comment: comment });

        await findTargetPost.save();
        return res.send(
            success(200, "commented succesfuuly", {
                comment: findTargetPost.comments,
            })
        );
    } catch (e) {
        return res.send(error(404, e.message));
    }
};

//to delete comment
exports.deleteCommentController = async (req, res) => {
    try {
        const { targetPostId, targetCommentId } = req.body;
        if (!targetPostId || !targetCommentId) {
            return res.send(error(404, "invalid action"));
        }
        const curUser = req.user;
        const findTargetPost = await postModel.findById(targetPostId);
        if (!findTargetPost) {
            return res.send(error(404, "post not found"));
        }
        // filter comment by comment ID
        const filteredComment = findTargetPost.comments.filter(
            (ele) => ele._id.toString() === targetCommentId.toString()
        );

        const [comment] = filteredComment;
        //check wheather comment is present or not
        if (!comment) {
            return res.send(error(404, "comment not found"));
        }
        if (
            !comment.user.toString() === curUser._id.toString() ||
            !findTargetPost.owner.toString() === curUser._id.toString()
        ) {
            return res.send(
                error(
                    400,
                    "Only owner of post or commented user can delete their comment."
                )
            );
        }
        comment.remove();
        await findTargetPost.save();
        return res.send(
            success(200, "Post delete successfully", findTargetPost)
        );
    } catch (e) {
        return res.send(error("400", e.message));
    }
};

//to get following post
exports.followingPostController = async (req, res) => {
    try {
        const user = req.user;
        const followingPost = await postModel.find({
            owner: {
                $in: user.followings,
            },
        });
        return res.send(success(200, "Following post", followingPost));
    } catch (e) {
        return res.send(error(404, e.message));
    }
};

//to get post by Id
exports.getPostByIdController = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postModel
            .findById(postId)
            .populate("owner")
            .populate("likes")
            .populate("comments.user");
        if (!post) {
            return res.send(error(404, "Post not found"));
        }
        return res.send(success(200, "success", { post }));
    } catch (e) {
        return res.send(error(400, e.message));
    }
};
