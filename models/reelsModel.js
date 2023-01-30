const mongoose = require("mongoose");
const reelsModel = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        video: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        caption: {
            type: String,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],

        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user",
                },
                comment: {
                    type: String,
                    trim: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("reel", reelsModel);
