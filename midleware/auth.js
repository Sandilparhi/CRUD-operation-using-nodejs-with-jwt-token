const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token){
        return res.status(403).send("token  must requried for authentication");
    }
    try{
        const decode = jwt.verify(token,'SANDIL');
        req.user = decode;
        

        // req.user = await User.findById(decoded.userId)
        console.log(" req.user", req.user);
        // next();
        // console.log("user", req.user)
    }
    catch(err){
        return res.status(401).send("Invalid Token");
    }
    return next();
}

module.exports = verifyToken;