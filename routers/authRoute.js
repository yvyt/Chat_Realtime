var express = require('express');
var authController = require("../Controller/authController")
var router = express.Router();
router.post("/login", authController.login)
router.post("/register", authController.register)

module.exports = router;