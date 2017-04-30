const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

var userSchema = mongoose.Schema({
  name : {
    type:String,
    required:true
  },
  username : {
    type : String,
    index:true,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required: true
  }
});

var User = module.exports = mongoose.model("User",userSchema);

module.exports.createUser = function(newUser, callback) {


  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
        // Store hash in your password DB.
        newUser.password = hash;
        newUser.save(callback);
    });
});

}

module.exports.getUserByUserName = function(username,callback) {
  //console.log("Inside getUserByUserName : "+username);
  var queryString = {username:username};
  User.findOne(queryString,callback);

}

module.exports.getUserById = function(id,callback) {
  User.findOne(id,callback);

}

module.exports.comparePasswords = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err)  {
        throw err;
      }
    	callback(null, isMatch);
	});
}
