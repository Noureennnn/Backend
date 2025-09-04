const jwt = require("jsonwebtoken");
const express = require("express");

const protect = (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Invalid Token..Access Denied"})
    }
    const webtokin = authHeader.split(" ")[1];
    console.log(webtokin)
    try{
    const decoded = jwt.verify(webtokin,process.env.SECRET_TOKEN);
    req.user = decoded;
    } catch(err) {
        console.error("Token verification error:", err);
        return res.status(401).json({message:"Unauthorized"})
    }
    next();
}
const adminOnly = (req,res,next) =>{
    if(req.user.role !=="Admin"){ return res.status(403).json({message:"You are NOT an Admin"})}
    else
    next();
}
module.exports = {adminOnly,protect};