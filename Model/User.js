const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true,
        default: "avt2.jpg"
    },
    online: {
        type: Boolean,
        required: true,
        default: false
    }
});
const User = mongoose.model("User", userSchema)
module.exports = User;