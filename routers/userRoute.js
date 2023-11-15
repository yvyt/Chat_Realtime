var express = require('express');
var mainController = require("../Controller/mainController")
var router = express.Router();
router.get("/getOnline", mainController.getOnline)
router.post("/updateAvt", mainController.updateAvatar)
router.post("/changePass", mainController.password)
module.exports = router;