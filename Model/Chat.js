const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const chatSchema = mongoose.Schema({
    userSend: {
        type: Schema.Types.ObjectId,
        ref: "users",
        require: true,
    },
    userReceive: {
        type: Schema.Types.ObjectId,
        ref: "users",
        require: true,
    },

    content: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false
    },
    time: {
        type: Date,
        default: new Date()
    },
});
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;