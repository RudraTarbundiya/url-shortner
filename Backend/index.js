const express = require('express');
const app = express();
const cors = require('cors');
const urlrouter = require('./routes/url.route')
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/urls").then(()=>console.log("connection sucess"))

app.use(cors());

app.use(express.json());

app.use('/',urlrouter);

app.get('/',(req,res)=>{
    res.send("hello world")
})

app.listen(3000,()=>{
    console.log('server is running on port 3000');
})