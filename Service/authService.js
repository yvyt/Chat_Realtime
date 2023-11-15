const User = require("../Model/User")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

async function register(username, email, password, confirm) {
    if (password.length < 6) {
        return {
            code: 0,
            msg: "Passwords must be at least 6 characters"
        }
    } else {
        if (password !== confirm) {
            return {
                code: 0,
                msg: "Password confirm is not correct"
            }
        } else {
            var users = await User.findOne({
                email: email
            })
            if (users) {
                return {
                    code: 0,
                    msg: "Email is exist"
                }
            } else {
                try {
                    const hash = await bcrypt.hash(password, 12)
                    const newUser = await User.create({
                        username: username,
                        email: email,
                        password: hash
                    })
                    if (newUser) {
                        return {
                            code: 1,
                            msg: "Sign Up Success"
                        }
                    } else {
                        return {
                            code: 0,
                            msg: "Sorry, can't create a new account"
                        }
                    }
                } catch (err) {
                    return {
                        code: 0,
                        msg: err.message
                    }
                }
            }
        }
    }

}
async function login(email, password) {
    const user = await User.findOne({ email: email })
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ userId: user._id }, 'secrectkey');
            return {
                code: 1,
                message: "Login success",
                token: token
            }
        } else {
            return {
                code: 0,
                message: "Password is not correct",
            }
        }
    } else {
        return {
            code: 0,
            msg: "Not found account with " + email + "."
        }
    }
}
module.exports = {
    register,
    login
}