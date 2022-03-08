const express = require('express');
const router = express.Router();

const {
   
    Signup,
    userlogin
   
}
=require('../controller/user');
router.post("/signup",Signup);
router.post("/userlogin",userlogin)



module.exports = router;
