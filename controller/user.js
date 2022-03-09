const User = require("../models/user")
var express = require("express");
var app = express();

var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))

const multer = require("multer");
const mime = require('mime-types')




async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

//signup api
exports.Signup = async(req, res)=>{

    try{
        const {
            username,
            password,
            qualification,
            city,
            phone,
            role

        } = req.body 
        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            username:  username,
            password:  hashedPassword,
            qualification:  qualification,
            city: city,
            Phone: phone,
            role:role
            
        });
        var userData = await User.find({ Phone:phone})
        if (userData.length > 0) {
            return res.json({ statusCode: 400, message: " alerady exist" })
        }
        let response = new User(newUser)
        response.save()
        .then((result) => {
            return res.json({ statusCode: "200", statusMsj: "Successfuly Register", data: result })
        }).catch((err) => {
            console.log(err)
            return res.send(err)
        })
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

//login api
exports.userlogin = async (req, res, next) => {
    try {
        var username = req.body.username;
        var password = req.body.password;
        const user = await User.findOne({ username: username}); 


        if (!user) {
            return res.json({ statusCode: 401, statusMsj: "Enter valid Email" })
        }
        else {
            const validPassword = await validatePassword(password, user.password);
            if (!validPassword) {
                return res.json({ statusCode: 402, statusMsj: "Password mismatch" })
    
            }
            else {
                const accessToken = jwt.sign({
                    userId: user._id
                }, 'SANDIL', {
                        expiresIn: "1d"
                    });
                console.log(accessToken)
                return res.json({ statusCode: 200, statusMsj: "login sussessfully", access: accessToken })
            }
        }
    } catch (error) {
        console.log(error);
        return res.json({ statusCode: 400, message: "login failed" })
    }
}

exports.userDetails = async(req, res)=>{
    var userDetails = await User.findOne({_id:req.query.id})
    if(!userDetails){
        return res.json({status:400, message:"User Not Found"})
    }
    return res.json({status:200, message:"User Details", data:userDetails})
}

exports.userList=async(req, res)=>{
    var userlist = await User.findOne()
    if(userlist.length == 0){
        return res.json({status:400, message:"No USers", data:[]})
    }
    return res.json({status:200, message:"User List", data:userlist})
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images");
    },
    filename: (req, file, cb) => {
        console.log("1");
        cb(   
            null, file.fieldname + '_' + Date.now() + '.' + mime.extension(file.mimetype)
        )
    }
});
const upload = multer({storage: storage}).single('image');

exports.userRecord = async(req, res)=>{
    upload(req, res,async function (err) {
        if (err) {
            console.log("There was an error uploading the image.");
        }
        console.log("user", req.user)
        var userdata = await  User.findOne({_id:req.user.userId})
        console.log("userdata",userdata)
        
        if(userdata.role == 0){
            return res.json({status:403, message:"you are guest User You can not upload image"})
        }
        console.log("image created",req.file.filename)
        await User.updateOne({_id:req.user.userId}, {$set:{pic:req.file.filename}}) 
        return res.json({statusCode:200, statusMsj: "image uploaded", user:userdata})
    })
}
