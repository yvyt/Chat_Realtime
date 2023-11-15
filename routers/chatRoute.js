var express = require('express');
var chatController = require("../Controller/chatController")
var router = express.Router();
router.post("/getDetail", chatController.getDetail)
router.post("/send", chatController.send)
router.post("/readMessenger", chatController.read)
router.post("/unreadMessager", chatController.unread)
router.post("/remove", chatController.remove)
module.exports = router;