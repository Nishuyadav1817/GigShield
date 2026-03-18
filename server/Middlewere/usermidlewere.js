const express=require('express');
const Redis=require("../Main/Radis");
const jwt=require("jsonwebtoken");
const Worker =require('../Register/Schema');
require("dotenv").config();



const UserVerify = async (req, res, next) => {
  try {
    console.log("here1")
    // Read token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Invalid user Token not found" });
    }
console.log("here2")
    const Token = authHeader.split(' ')[1];

    const payload = jwt.verify(Token, process.env.JWT_KEY);
    const { _id } = payload;

    if (!_id) {
      return res.status(401).json({ message: "Token not valid" });
    }
console.log("here3")
    const user = await Worker.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
console.log("here4")
    const isBlocked = await Redis.exists(`token:${Token}`);
    if (isBlocked) {
      return res.status(401).json({ message: "Token is blocked" });
    }
console.log("here5")
    req.user = user;
    next();
console.log("here6")
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid user Token" });
  }
};


module.exports=UserVerify;