const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: [true, "Full Name is Required"],
        },
        username: {
            type: String,
            trim: true,
            required: [true, "Username is Required"],
        },

        email: {
            type: String,
            unique: true,
            required: [true, "Email is Invalid"],
        },
        password: {
            type: String,
            minLength: [8, "password must have minimum 8 Character"],
            required: [true, "Password is Required"],
            select: false,
        },
        bio: {
            type: String,
            maxLength: [120, "max length exceeds"],
        },
        avatar: {
            publicid: {
                type: String,
            },
            url: {
                type: String,
                default:
                    "https://res.cloudinary.com/dedxq7y0y/image/upload/v1674654148/profileimage/user_h99blo.png",
            },
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        followings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        post: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "post",
            },
        ],
        reel: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "reel",
            },
        ],
        savedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model("user", userSchema);
