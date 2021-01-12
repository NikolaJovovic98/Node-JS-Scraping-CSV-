const { json } = require("body-parser");
const express=require("express");
const { url } = require("inspector");
const scrapNekretnine = require("./scraper")
const app = express();



app.listen(3000,()=>{console.log("Server is running...");});

