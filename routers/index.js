var express = require('express');
var mainController = require("../Controller/mainController")
const { jwtTokenValidator } = require('../middlewares/jwtValidation');
var router = express.Router();

/* GET home page. */
router.get('/', jwtTokenValidator, mainController.getIndex);
router.get('/login', mainController.getLogin);
router.get('/changePass', mainController.changePass);
router.get("/logout", mainController.logout)
router.get("/profile", mainController.profile)
router.get("/profile/:id", mainController.getProfile)

module.exports = router;