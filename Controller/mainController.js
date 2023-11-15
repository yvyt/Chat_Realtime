var service = require("../Service/authService")
var cookieParser = require('cookie-parser')
const User = require("../Model/User")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const { ObjectId } = require("mongodb");
const Chat = require("../Model/Chat");
const multiparty = require("multiparty");
const fs = require("fs")
const path = require("path")

async function getIndex(req, res, next) {
    const token = req.cookies.jwt
    const decode = jwt.decode(token)
    const id = decode['userId']
    const us = await User.findOne({ _id: id })

    if (us) {
        const updateOnline = await User.updateMany({ _id: id }, {
            $set: {
                online: true
            }
        })
        res.cookie("userId", id)
        res.render("index", { title: "Chat", user: us })

    } else {
        res.render("error")
    }
}

function getLogin(req, res, next) {
    const jwt = req.cookies.jwt
    if (jwt) {
        res.redirect("/")
    }
    res.render("login", { title: "Login Page" })
}

function changePass(req, res, next) {

    res.render("forgotPass", { title: "Forget Password" })
}
async function getOnline(req, res, next) {
    var users = await User.find({
        online: true
    })
    var unseen = await Chat.find({
        $or: [
            { userSend: req.cookies.userId },
            { userReceive: req.cookies.userId }
        ],
        seen: false
    })
    res.send({
        users: users,
        unseen: unseen
    })
}
async function logout(req, res, next) {
    const updateOnline = await User.updateMany({ _id: req.cookies.userId }, {
        $set: {
            online: false
        }
    })
    res.clearCookie("jwt");
    res.clearCookie("userId");
    res.redirect("/login");
}
async function profile(req, res, next) {
    const id = req.cookies.userId
    var user = await User.findOne({
        _id: id
    })
    res.render("userInfo", { user: user })
}
async function updateAvatar(req, res, next) {
    const id = req.cookies.userId
    var user = await User.findOne({
        _id: id
    })
    const form = new multiparty.Form();
    const allowExtension = [
        ".png",
        ".jpeg",
        ".jpg",
        ".webp",
        ".avif",
    ];
    const maxSize = 5242880;
    var dir = ".\\public\\images\\";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    form.parse(req, async(err, fields, files) => {
        if (err) return res.send(500, err.message);
        var file = files.upload[0];
        var newPath = dir + "\\" + file.originalFilename;
        console.log(newPath);
        var oldPath = file.path;
        const ext = path.extname(file.originalFilename).toLowerCase();
        if (allowExtension.includes(ext) && file.size <= maxSize) {
            const writeStream = fs.createWriteStream(newPath);
            fs.createReadStream(oldPath).pipe(writeStream);
            writeStream.on("finish", () => {
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            });
            const upd = await User.updateOne({
                _id: id,
            }, {
                $set: {
                    avatar: file.originalFilename,
                },
            });
            res.redirect("/profile")
        } else {
            res.render("userInfo", { user: user, msg: "Error when update avatar." })

            return;
        }

    });
}
async function getProfile(req, res, next) {
    const id = req.params.id
    const user = await User.findOne({
        _id: id
    })
    res.render("userInfo", { user: user, visit: req.cookies.userId })

}
async function password(req, res, next) {
    var old = req.body.oldPass
    var newPass = req.body.newPass
    var confirm = req.body.confirm
    var id = req.cookies.userId
    let msg;
    const user = await User.findOne({ _id: id })
    if (user) {
        const isMatch = await bcrypt.compare(old, user.password)
        if (isMatch) {
            if (newPass.length < 6) {
                msg = {
                    code: 0,
                    message: "Passwords must be at least 6 characters",
                }
                res.send(msg)
                return;

            } else {
                if (newPass !== confirm) {
                    msg = {
                        code: 0,
                        message: "Passwords and confirm password is not correct",
                    }
                    res.send(msg)
                    return;
                }
                if (newPass === old) {
                    msg = {
                        code: 0,
                        message: "Passwords and old password is same",
                    }
                    res.send(msg)
                    return;
                }
            }
            const hash = await bcrypt.hash(newPass, 12)
            const update = await User.updateOne({
                _id: id
            }, {
                $set: {
                    password: hash
                }
            })
            if (update) {
                msg = {
                    code: 1,
                    message: "Change password is success",
                }
                res.send(msg)
                return;
            }
        } else {
            msg = {
                code: 0,
                message: "Old password is not correct",
            }
            res.send(msg)
            return;

        }
    } else {
        msg = {
            code: 0,
            message: "Something were wrong",
        }
        res.send(msg)
        return;
    }
}
// export the router and the server
module.exports = {
    getIndex,
    getLogin,
    changePass,
    getOnline,
    logout,
    profile,
    updateAvatar,
    getProfile,
    password
}