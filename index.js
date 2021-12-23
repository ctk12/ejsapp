const PORT = process.env.PORT || 3000;
const express = require("express");

const app = express();



app.get("/", function(req, res){
  res.send("Hi Hello World!"); 
});



app.listen(PORT, function(){
    console.log("Connected Server");
});
