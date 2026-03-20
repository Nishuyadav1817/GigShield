const mongoose=require("mongoose");
const express=require("express")
const Worker=require('./Schema');
const WorkerAuth=express.Router();
const bcrypt=require('bcrypt');
const Razorpay = require("razorpay");
const Jwt=require('jsonwebtoken')
const Redis=require('../Main/Radis');
const UserVerify=require("../Middlewere/usermidlewere")
require("dotenv").config();
//Register of worker
WorkerAuth.post("/register",async(req,res) =>{
console.log("here1");
     try{
  const password = req.body.password; 
     
    req.body.password= await bcrypt.hash(password,10);

        

        const NewWorker=await Worker.create(req.body);
       
     const Token=Jwt.sign({_id:NewWorker._id,EmailId:NewWorker.EmailId},process.env.JWT_KEY,{expiresIn:60*60});
     res.cookie('Token',Token,{maxAge: 60*60*1000})
   const reply = {
            firstName: NewWorker.FullName,
            emailId:NewWorker.EmailId,
            _id: NewWorker._id,
        }
   
  res.status(200).json({ 
        user: reply, 
        Token,
        message: "User registered successfully" });

         
     }catch(err){
         console.log(err);
 res.status(500).json({message:"Server Error"});
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
            firstName: user.FullName,
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
WorkerAuth.post("/logout",async(req,res) =>{
     
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
console.log(process.env.RAZORPAY_KEY_ID);
const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
});

WorkerAuth.post("/base",  async (req, res) => {
  const { action, userId } = req.body;

  if (!userId) return res.status(400).json({ message: "userId is required" });

  // ── CREATE ORDER ──────────────────────────────────────────
  if (action === "create-order") {
    try {
      const user = await Worker.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.plan !== "none") {
        return res.status(400).json({ message: `User already has an active plan: ${user.plan}` });
      }

      const order = await razorpay.orders.create({
        amount: PLAN_AMOUNT,
        currency: CURRENCY,
        receipt: `rcpt_${userId}_${Date.now()}`,
        notes: { userId, planName: "basic" },
      });

      return res.status(200).json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        userName: user.FullName,
        userEmail: user.EmailId,
        userPhone: user.Phonenumber,
      });
    } catch (err) {
      console.log("create-order error:", err);
      return res.status(500).json({ message: "Failed to create order", error: err.message });
    }
  }

  // ── VERIFY PAYMENT ────────────────────────────────────────
  if (action === "verify") {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    try {
      // HMAC signature check
      const generated = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      // Upgrade plan to basic
      const updated = await Worker.findByIdAndUpdate(
        userId,
        { plan: "basic" },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "User not found" });

      console.log(`✅ Plan upgraded → basic | user: ${userId} | payment: ${razorpay_payment_id}`);

      return res.status(200).json({
        message: "Payment verified. Plan upgraded to basic.",
        plan: updated.plan,
        userId: updated._id,
      });
    } catch (err) {
      console.log("verify error:", err);
      return res.status(500).json({ message: "Verification failed", error: err.message });
    }
  }

  return res.status(400).json({ message: "Invalid action. Use 'create-order' or 'verify'." });
});


module.exports=WorkerAuth;
