const express = require('express');
const router = express.Router();
var verifyToken = require("../midleware/auth")


const { 
    Signup,
    userlogin,
    userDetails,
    userList,
    userRecord,
    logout
   
}
=require('../controller/user');
router.post("/signup",Signup);
router.post("/userlogin",userlogin);
router.get("/userDetails",verifyToken,userDetails);
router.get("/userList",userList);
router.post("/userRecord",verifyToken,userRecord)
router.post("/logout",logout)


module.exports = router;
