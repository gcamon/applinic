"use strict";
var LocalStrategy = require("passport-local").Strategy;
var path = require('path');
var config = require('./config');
var salt = require('./salt');
var router = config.router;
var passport = config.passport;

var loginRoute = function(model) {    
   passport.use('user-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) {           

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      model.user.findOne({ email :  username }, function(err, user) {
          
          // if there are any errors, return the error before anything else
          if (err) {
              return done(err);
          }
          // if no user is found, return the message
          if (!user) {
              return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
          }
          // if the user is found but the password is wrong
          if (!salt.isValidPassword(user,password)) {
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
          }
          
          //req.session.user = user;
          // all is well, return successful user
          return done(null, user);
      });

    }));

router.post('/user/login', passport.authenticate('user-login', {
  successRedirect : '/user/dashboard', // redirect to the secure profile section
  failureRedirect : '/failed', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

router.get('/user/dashboard',function(req,res){
  if(req.user){ 
    model.user.findOne({user_id: req.user.user_id},{presence:1,set_presence:1,admin:1}).exec(function(err,data){
      if(err) throw err;
    
      if(data.admin === true && req.user.user_id === process.env.ADMIN_ID){
        res.json({typeOfUser:"admin",isLoggedIn: true,balance: req.user.ewallet.available_amount,user_id:req.user.user_id});
      } else {
        data.presence = true;
        data.set_presence.general = true;
        data.save(function(err,info){
          console.log("presence is true");
        });
        normalUser()
      }
    });

    function normalUser() {          
      res.json({
        isLoggedIn: true,
        typeOfUser: req.user.type,
        firstname: req.user.firstname,
        lastname:req.user.lastname,
        phone: req.user.phone,
        email: req.user.email,
        title: req.user.title,
        user_id: req.user.user_id,
        balance: req.user.ewallet.available_amount,
        profile_pic_url: req.user.profile_pic_url,
        city: req.user.city,
        work_place: req.user.work_place,
        address:req.user.address,
        experience: req.user.experience,
        courier_access: req.user.courier_access
      });
    }
  } else {
    res.redirect("/login");
  }  
});

//for admin loggin

router.get("/user/admin",function(req,res){
  if(req.user && req.user.user_id === process.env.ADMIN_ID && req.user.admin === true){
    res.render("admin")
  } else {
    res.redirect("/login");
  }
});

router.get('/failed',function(req,res){        
    res.send(false);
})


}

module.exports = loginRoute;