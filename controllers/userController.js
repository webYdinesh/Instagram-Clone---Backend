const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const { error, success } = require("../utils/customResponse");
const cloudnary = require("cloudinary").v2;
//Follow & Unfollow User
exports.followUnfollowUserController = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const curUser = req.user;
        const findTargetUser = await userModel.findById(targetUserId);
        if (!findTargetUser) {
            return res.send(error(404, "user not found"));
        }

        //if already followed => Unfollow Logic
        if (curUser.followings.includes(findTargetUser._id)) {
            const findIndexOfFollowedUser = curUser.followings.indexOf(
                findTargetUser._id
            );
            const findIndexOfFollowingUser = findTargetUser.followers.indexOf(
                curUser._id
            );
            curUser.followings.splice(findIndexOfFollowedUser, 1);
            findTargetUser.followers.splice(findIndexOfFollowingUser, 1);
            await curUser.save();
            await findTargetUser.save();
            return res.send(
                success(200, "user unfollowed successfully", {
                    unfollowedId: findTargetUser._id,
                })
            );
        }
        //if NOT followed => Follow Logic
        curUser.followings.push(findTargetUser._id);
        findTargetUser.followers.push(curUser._id);
        await curUser.save();
        await findTargetUser.save();
        return res.send(
            success(200, "user followed successfully", {
                followedId: findTargetUser._id,
            })
        );
    } catch (e) {
        return res.send(error(400, e.message));
    }
};

//Save Post In Wishlist
exports.SavePostController = async (req, res) => {
    const { targetPostId } = req.body;
    const curUser = req.user;
    const findTargetPost = await postModel.findById(targetPostId);
    if (!findTargetPost) {
        return res.send(error(404, "post not found"));
    }

    //if already followed => Unfollow Logic
    if (curUser.savedPost.includes(findTargetPost._id)) {
        const findIndexOfTargetPost = curUser.savedPost.indexOf(
            findTargetPost._id
        );

        curUser.savedPost.splice(findIndexOfTargetPost, 1);

        await curUser.save();
        return res.send(success(200, "post unsaved successfully"));
    }
    curUser.savedPost.push(findTargetPost._id);
    await curUser.save();
    return res.send(success(200, "post saved"));
};

//Get My profile
exports.getMyProfileController = async (req, res) => {
    try {
        const curUserId = req.user._id;
        const curUser = await userModel
            .findById(curUserId)
            .populate(["post"])
            .populate("followings followers savedPost reel");

        return res.send(success(200, "User profile", { user: curUser }));
    } catch (e) {
        return res.send(error(400, e.message));
    }
};

//Get Others profile

exports.getUserProfileController = async (req, res) => {
    try {
        const userId = req.params.profileid;
        if (!userId) {
            return res.send(error(400, "user profile id not matched"));
        }
        const user = await userModel
            .findById(userId)
            .populate("post followers followings");

        if (!user) {
            return res.send(error(404, "user not found"));
        }
        return res.send(success(200, "User profile", { user }));
    } catch (e) {
        return res.send(error(400, e.message));
    }
};
exports.getUserBySearchController = async (req, res) => {
    try {
        const { searchQuery } = req.body;
        if (!searchQuery) {
            console.log(searchQuery);
            return res.send(error(404, "query missing."));
        }

        const user = await userModel.find({
            username: { $regex: searchQuery, $options: "i" },
        });

        return res.send(success(200, "User profile", { user }));
    } catch (e) {
        console.log(e);
        return res.send(error(400, e.message));
    }
};

//to update profile
exports.updateProfileController = async (req, res) => {
    try {
        const curUserId = req.user._id;
        const curUser = await userModel.findById(curUserId).populate("post");
        const { updatedName, updatedBio, updatedImage } = req.body;

        if (updatedName) {
            curUser.fullName = updatedName;
        }
        if (updatedBio) {
            curUser.bio = updatedBio;
        }
        if (updatedImage) {
            const { public_id, secure_url } = await cloudnary.uploader.upload(
                updatedImage,
                {
                    folder: "profileimage",
                }
            );
            curUser.avatar = {
                publicid: public_id,
                url: secure_url,
            };
        }
        await curUser.save();
        res.send(
            success(200, "profile updated successfully", { user: curUser })
        );
    } catch (e) {
        console.log(e);
        res.send(error(400, e.message));
    }
};

// to get all users
exports.getAllUser = async (req, res) => {
    try {
        const curUserId = req.user._id;
        const users = await userModel.find({
            _id: {
                $nin: curUserId,
            },
            followers: {
                $nin: curUserId,
            },
        });
        return res.send(success(200, "success", { users }));
    } catch (e) {
        return res.send(error(400, e.message));
    }
};
