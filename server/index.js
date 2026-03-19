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
  "https://gig-bima-b5qc.vercel.app/"
];

App.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

App.use("/worker", WorkerAuth);

DataBase().then(() => {
  console.log("DB connected");
});

module.exports = App;