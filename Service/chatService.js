const Chat = require("../Model/Chat");
const User = require("../Model/User");
async function send(userSend, userReceive, content) {
    var send = await Chat.create({
        userSend: userSend,
        userReceive: userReceive,
        content: content
    })
    if (send) {
        return {
            code: send._id
        }
    }
}
async function getDetail(userSend, userReceive) {
    const send = await Chat.find({
        $and: [{
                $or: [
                    { userSend: userSend },
                    { userReceive: userSend }
                ]
            },
            {
                $or: [
                    { userSend: userReceive },
                    { userReceive: userReceive }
                ]
            }
        ]
    }).sort({ time: 1 });
    const userContact = await User.findOne({
        _id: userReceive
    })


    return {
        message: send,
        users: userContact
    }

}
async function read(current, user) {
    var update = await Chat.updateMany({
        $and: [{
                $or: [
                    { userSend: current },
                    { userReceive: current }
                ]
            },
            {
                $or: [
                    { userSend: user },
                    { userReceive: user }
                ]
            }
        ]
    }, {
        $set: {
            seen: true
        }
    })
    if (update) {
        return {
            code: 1
        }
    }
    return {
        code: 0
    }
}
async function unread(current, id) {
    var unseen = await Chat.find({
        userSend: current,
        seen: false
    })
    return unseen
}
async function remove(idChat) {
    var chat = await Chat.findOne({
        _id: idChat
    })
    var rem = await Chat.deleteOne({
        _id: idChat
    })
    return {

        msg: "Remove message success"
    }


}
module.exports = {
    send,
    getDetail,
    read,
    unread,
    remove
}