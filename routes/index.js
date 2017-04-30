const express = require("express");
const routes = express();

//console.log("Testing");
routes.get("/",function(req,res){
  res.render('index');
});

module.exports = routes;
