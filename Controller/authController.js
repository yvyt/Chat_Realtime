var service = require("../Service/authService")
var cookieParser = require('cookie-parser')



async function login(req, res, next) {
    const { email, password } = req.body
    var result = await service.login(email, password)
    if (result.code === 1) {
        const token = result.token
        res.cookie('jwt', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    }
    res.send(result)

}
async function register(req, res, next) {
    const { username, email, password, confirm } = req.body
    var result = await service.register(username, email, password, confirm)
    res.send(result)
}
module.exports = {
    login,
    register
}