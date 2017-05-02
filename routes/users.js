const express = require("express");
const routes = express();
const User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
  User.getUserByUserName(username,function(err,user) {
    console.log("User : "+user);
    if(err)
    throw err;
    if(!user) {
      done(null,false,"User is not registered");
    }
    User.comparePasswords(password,user.password,function(err,isMatch) {
      //console.log("Calling comparePasswords");
      if(err) {
        throw err;
      }
      console.log('isMatch : '+isMatch);
      if(isMatch) {

        return done(null,user);
      }
      else {
        //console.log("inside false isMatch");
      return  done(false,null,"Invalid password");
      }
    });

  });
  }
));


passport.serializeUser(function(user, done) {
  console.log("serializing user with user: "+user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserializing user with id: "+id);
  User.getUserById(id, function(err, user) {
    console.log("getUserById user : "+user);
    done(err, user);
  });
});

//register route
routes.get("/register",function(req,res){
  res.render('register');
})

//login routes
routes.get("/login",function(req,res){
  res.render('login');
})

//register
routes.post('/register',function(req,res){
 var name = req.body.name;
 var username = req.body.username;
 var email = req.body.email;
 var password = req.body.password;
 var password2 = req.body.password2;

 req.checkBody('name','name is required').notEmpty();
 req.checkBody('email','email is required').notEmpty();
 req.checkBody('email','email is not correct').isEmail();
 req.checkBody('username','username is required').notEmpty();
 req.checkBody('password','passowrd is required').notEmpty();
 req.checkBody('password2','passwords does not match').equals(req.body.password);


 var errors = req.validationErrors();
 if(errors) {
   res.render('register',{
     errors:errors
   });
 }
 else{
   var newUser = new User({
     name: req.body.name,
     username : req.body.username,
     password : req.body.password,
     email : req.body.email
   });
   User.createUser(newUser,function(err,user){
     if(err) {
       throw err;
     }
    // console.log("user added "+user);

   });
   req.flash('success_msg','you are registered, now you can login');
   res.redirect('/users/login');

 }
})

//Login
routes.post('/login',passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
function(req, res) {
   console.log('serving post request');
    res.redirect('/');
  });

routes.get('/logout',function(req,res) {
  req.logout();

  req.flash("success_msg","You have successfully logged out of the application");
  res.redirect('/users/login');
});



module.exports = routes;
