const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Type in your username"],
        },
    email:{
        type: String,
        required: [true, "Type in your email"],
        unique:true
    },
    password:{
        type:String,
        required: [true,"Type in your password"]
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        enum: ['Male','Female'],
        required:true
    },
    role:{
        type:String,
        enum:["User", "Admin"],
        default: "User"
    },
    location:{
        type:String,
        enum:["Egypt","United States","Spain","Italy","France","Canada","Other"],
        required:true
    }
},{timestamps:true});
module.exports = mongoose.model("User", userSchema);