var service = require("../Service/chatService")
var cookieParser = require('cookie-parser')
const User = require("../Model/User")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const { ObjectId } = require("mongodb");
const Chat = require("../Model/Chat")

async function getDetail(req, res, next) {
    const userSend = req.cookies.userId
    const userReceive = req.body.id
    const data = await service.getDetail(userSend, userReceive)
    res.send(data)
}
async function send(req, res, next) {
    const userSend = req.cookies.userId
    const userReceive = req.body.userReceive
    const content = req.body.content
    var data = await service.send(userSend, userReceive, content)
    res.send(data)
}
async function read(req, res, next) {
    const user = req.body.id
    const current = req.cookies.userId
    const data = await service.read(current, user);
    res.send(data)
}
async function unread(req, res, next) {
    const current = req.cookies.userId
    const id = req.body.id;
    const unread = await service.unread(current, id)
    res.send(unread)
}

async function remove(req, res, next) {
    const idChat = req.body.idChat
    const remove = await service.remove(idChat)
    res.send(remove)
}
module.exports = {
    getDetail,
    send,
    read,
    unread,
    remove
}