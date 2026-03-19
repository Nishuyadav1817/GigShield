 const express=require("express");
const App=express();
App.use(express.json());
const DataBase=require("./Main/DB");
const WorkerAuth=require("./Register/Reg")
const cookiparcer=require('cookie-parser')
App.use(cookiparcer());
require("dotenv").config();
const cors = require("cors");

App.use("/worker",WorkerAuth);
const allowedOrigins = [
  "https://gig-bima.vercel.app/"
  
];

App.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));




const BuildConnection=async () => {
      try{
          await Promise.all([DataBase()])
            console.log("DB conneacted")

           App.listen(process.env.PORT,()=>{
           console.log("App Listen on given port number 16016")
           })

      }catch(err){
        console.log(err);
      }
}

BuildConnection();