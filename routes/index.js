const express = require("express");
const routes = express();

//console.log("Testing");
routes.get("/",ensureAuthentication,function(req,res){
  res.render('index');
});

function ensureAuthentication(req,res,next) {
  if(req.isAuthenticated()){
    next();
  }
  else {
    //req.flash("error_msg","You're not logged in");
    res.redirect('/users/login');

  }

}
module.exports = routes;
