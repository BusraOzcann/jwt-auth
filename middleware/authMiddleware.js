const jwt = require("jsonwebtoken");
const User = require("../models/User")

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exist
    if(token){
        jwt.verify(token, "busra key", (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect("/login");
            }else{
                console.log("decoded token : ", decodedToken);
                next();
            }
        });
    }
    else{
        res.redirect("/login");
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, "busra key", async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log("decoded token : ", decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkUser};