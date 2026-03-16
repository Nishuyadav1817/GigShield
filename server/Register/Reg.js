const mongoose=require("mongoose");
const express=require("express")
const Worker=require('./Schema');
const WorkerAuth=express.Router();
const bcrypt=require('bcrypt');
const Jwt=require('jsonwebtoken')

//Register of worker
WorkerAuth.post("/register",async(req,res) =>{

     try{
  const password = req.body.password; 
     
    req.body.password= await bcrypt.hash(password,10);

        

        const NewWorker=await Worker.create(req.body);
       
        res.send("User created")
         
     }catch(err){
        console.log(err)
     }

})



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
            role:user.role
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

module.exports=WorkerAuth;
