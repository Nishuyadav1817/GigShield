const express=require("express");
const App=express();
App.use(express.json());
const DataBase=require("./DB");
const WorkerAuth=require("../Register/Reg")
const cookiparcer=require('cookie-parser')
App.use(cookiparcer());
require("dotenv").config();

App.use("/worker",WorkerAuth);





const BuildConnection=async () => {
      try{
          await Promise.all([DataBase()])
            console.log("DB conneacted")

           App.listen(16016,()=>{
           console.log("App Listen on given port number 16016")
           })

      }catch(err){
        console.log(err);
      }
}

BuildConnection();

