const mongoose=require("mongoose");
const express=require("express")
const Worker=require('./Schema');
const WorkerAuth=express.Router();
const bcrypt=require('bcrypt');
const Jwt=require('jsonwebtoken')
const Redis=require('../Main/Radis');
const UserVerify=require("../Middlewere/usermidlewere")
//Register of worker
WorkerAuth.post("/register",async(req,res) =>{

     try{
  const password = req.body.password; 
     
    req.body.password= await bcrypt.hash(password,10);

        

        const NewWorker=await Worker.create(req.body);
       
     const Token=Jwt.sign({_id:NewWorker._id,EmailId:NewWorker.EmailId},process.env.JWT_KEY,{expiresIn:60*60});
     res.cookie('Token',Token,{maxAge: 60*60*1000})
   const reply = {
            firstName: NewWorker.FirstName,
            emailId:NewWorker.EmailId,
            
        }
   
  res.status(200).json({ 
        user: reply, 
          Token,
        message: "User registered successfully" });

         
     }catch(err){
        console.log(err)
     }

})


//login
WorkerAuth.post("/login" ,async(req,res) =>{
    try{

    
    const{EmailId,password}=req.body;
    
    if(!EmailId){
    return res.status(400).json({ message: "Email is required" });
    }
    if(!password){
        return res.status(400).json({ message: "password is required" });
        }
     const user=await Worker.findOne({EmailId});
     if(!user){
     return res.status(404).json({ message: "User not found" });
     }
       console.log("hit1")
      const match=await bcrypt.compare(password,user.password);

      if(!match){
    return res.status(401).json({ message: "Invalid password" });
        }
    const Token=Jwt.sign({_id:user._id,EmailId:user.EmailId},process.env.JWT_KEY,{expiresIn:60*60});
     res.cookie('Token',Token,{maxAge: 60*60*1000})

         const reply = {
            firstName: user.FirstName,
            emailId: user.EmailId,
            _id: user._id,
           
        }
     console.log(reply)
     res.status(200).json({ 
        user: reply, 
        Token,
        message: "User Logined successfully" });

    }catch(err){
    res.send("Invalid Error : " +err)
    
    return res.status(500).json({ message: err.message || "Server error" });
    }

})

//logout
WorkerAuth.post("/logout",UserVerify,async(req,res) =>{
     
    try{
       
    const {Token}=req.cookies;

    const payload=Jwt.decode(Token);

        await Redis.set(`token:${Token}`,'Blocked');
        await Redis.expireAt(`token:${Token}`,payload.exp);
    

    res.cookie("token",null,{expires: new Date(Date.now())});
 
    }
    catch(err){
        res.send("invalid error" +err)
    }
})
module.exports=WorkerAuth;
