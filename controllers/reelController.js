const reelsModel = require("../models/reelsModel");
const { success, error } = require("../utils/customResponse");
const cloudinary = require("cloudinary").v2;

//to create reel
exports.createReelController = async (req, res) => {
    try {
        const { video, caption } = req.body;

        const curUser = req.user;
        const createReel = await reelsModel.create({
            caption,
        });
        if (video) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(
                video,
                {
                    resource_type: "video",
                    folder: "reels",
                }
            );
            createReel.video = {
                public_id,
                url: secure_url,
            };
        }

        createReel.owner = curUser._id;
        curUser.reel.push(createReel._id);
        await createReel.save();
        await curUser.save();
        return res.send(
            success("201", "reel created successfully", createReel)
        );
    } catch (e) {
        console.log(e);
        return res.send(error("400", e.message));
    }
};

//get all post
exports.getAllReelController = async (req, res) => {
    try {
        const allReels = await reelsModel
            .find()
            .populate("owner likes comments.user")
            .sort("-createdAt");

        return res.send(success(200, "success", { reels: allReels }));
    } catch (e) {
        return res.send(error(400, e.message));
    }
};

//to like & dislike reel
exports.likeDislikeReel = async (req, res) => {
    try {
        const { targetReelId } = req.body;

        const curUser = req.user;

        if (!targetReelId) {
            return res.send(error(404, "post id invalid"));
        }
        const findTargetReel = await reelsModel.findById(targetReelId);
        if (!findTargetReel) {
            return res.send(error(404, "post not found"));
        }
        //if already post Likes => Dislike Logic
        if (findTargetReel.likes.includes(curUser._id)) {
            const findIndexOfLike = findTargetReel.likes.indexOf(curUser._id);
            findTargetReel.likes.splice(findIndexOfLike, 1);
            await findTargetReel.save();
            return res.send(success(200, "unliked"));
        }
        //if NOT Likes => Like Logic
        findTargetReel.likes.push(curUser._id);
        await findTargetReel.save();
        return res.send(success(200, "liked"));
    } catch (e) {
        return res.send(error(404, e.message));
    }
};

//to comment on post
exports.postCommentOnReel = async (req, res) => {
    try {
        const { targetReelId, comment } = req.body;
        const curUser = req.user;
        if (!comment) {
            return res.send(error(404, "comment is missing"));
        }
        if (!targetReelId) {
            return res.send(error(404, "post id invalid"));
        }
        const findTargetReel = await reelsModel.findById(targetReelId);
        if (!findTargetReel) {
            return res.send(error(404, "post not found"));
        }
        //user id on comments
        findTargetReel.comments.push({ user: curUser._id, comment: comment });

        await findTargetReel.save();
        return res.send(
            success(200, "commented succesfuuly", {
                comment: findTargetReel.comments,
            })
        );
    } catch (e) {
        return res.send(error(404, e.message));
    }
};
