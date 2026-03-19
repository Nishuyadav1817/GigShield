const express = require("express");
const App = express();
App.use(express.json());

const DataBase = require("./Main/DB");
const WorkerAuth = require("./Register/Reg");

const cookieParser = require("cookie-parser");
App.use(cookieParser());

require("dotenv").config();
const cors = require("cors");


const allowedOrigins = [
  "https://gig-bima.vercel.app",
  "http://localhost:1234"
];



App.use(cors({
  origin: true,
  credentials: true

}));

App.use("/worker", WorkerAuth);

DataBase().then(() => {
  console.log("DB connected");
});

module.exports = App;