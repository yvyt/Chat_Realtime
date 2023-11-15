const { verify } = require('jsonwebtoken');
var User = require('../Model/User');

const verifyToken = async(token, secretKey) => {
    try {
        return await verify(token, secretKey);
    } catch (error) {
        console.log(`Error in verify access token:  + ${error}`);
        return null;
    }
};

exports.jwtTokenValidator = async(req, res, next) => {
    console.log(req.cookies.jwt);

    const accessTokenFromHeader = req.cookies.jwt;
    if (!accessTokenFromHeader) {
        res.redirect("/login")
        return;
    }

    const signingKey = "secrectkey";

    const verified = await verifyToken(
        accessTokenFromHeader,
        signingKey,
    );

    if (!verified) {
        res.redirect("/login")
        return;
    }
    return next();
};