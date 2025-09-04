const User = require("../Models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const registerUser = async(req,res) =>{
    const {username,email,password,age,gender,location} = req.body;
    if(!email || !username || !password){ 
        return res.status(400).json({message:"all fields required"});
    }
    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(400).json({message:"Email already exists"});
    }
    const hashedpassword = await bcrypt.hash(password,10);
    const newUser = await User.create({
        username,
        email,
        password: hashedpassword,
        role: "User",
        age,
        gender,
        location
    });
    res.status(200).json({
        message:"User Created Successfully!", 
        newUser
    });
};
const loginUser = async(req,res) =>{
    const {email,password} = req.body;
    const correctCredentials = await User.findOne({email});
    if(!correctCredentials){
        return res.status(400).json({message:"Invalid credentials"});
    }
    const isMatched = await bcrypt.compare(password,correctCredentials.password);
    if(!isMatched) {
        return res.status(400).json({message:"Invalid Password"});
    }
    const token = jwt.sign(
        {id:correctCredentials._id, role:correctCredentials.role},
        process.env.SECRET_TOKEN,
        {expiresIn:"1h"}
    );
    const trueUser = {
        id:correctCredentials._id,
        email: correctCredentials.email,
        username : correctCredentials.username,
        role: correctCredentials.role
    }

    res.status(200).json({message:"Login successful", token,trueUser});
};
module.exports = {registerUser, loginUser};