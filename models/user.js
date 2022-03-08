const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
    username:{
        type: String,
        required : true,
    },
    password:{
        type: String,
        required : true,
    },
    qualification:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    Phone:{
        type: Number,
        required:true,
    },
    role:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model('Register', UserSchema);