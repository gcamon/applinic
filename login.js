"use strict";
var LocalStrategy = require("passport-local").Strategy;
var path = require('path');
var config = require('./config');
var salt = require('./salt');
var router = config.router;
var passport = config.passport;

var loginRoute = function(model,sms) {    
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
        name: req.user.name,
        specialty: req.user.specialty,
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
        courier_access: req.user.courier_access,
        courier_access_password: req.user.courier_access_password,
        family_accounts: req.user.family_accounts,
        city_grade: req.user.city_grade,
        currencyCode: req.user.currencyCode,
        mrak: req.user.mrak
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

// Change password routes

router.get('/user/change-password',function(req,res){
  console.log(req.query);
  model.user.findOne({email: req.query.email},{phone:1,email:1,user_id:1},function(err,user){
    if(err) {
      res.send({error:"error : 500"});
      return;
    }

    if(user) {
      var random1 = Math.floor(Math.random() * 9999);
      var random2 = Math.floor(Math.random() * 9999);
      var password = check(random1) + " " + check(random2);

      var otp = new model.otpSchema({
        user_id: user.user_id,//this id refers to the debitors id. the person whose account will be debited.
        otp: password,
        amount: 0,
        senderId: user.user_id 
      });           

      //sets the expiration time for each otp sent.
      var date = new Date();
      otp.expirationDate = new Date(date.getTime() + 300000);
      otp.expirationDate.expires = 300;          

      otp.save(function(err,info){
        if(err) throw err;
        console.log("otp saved!");
      }); 


      console.log(password);

      var msgBody = "Your pin for applinic.com change password is " + password;
      var phoneNumber = user.phone;
      sms.messages.create(
        {
          to: phoneNumber,
          from: '+16467985692',
          body: msgBody,
        },
        callBack
      )

      function callBack(err,responseData) {
        console.log(err);
        console.log(responseData);
      }

      function check(num) {
        var toStr = num.toString();  
        if(toStr.length < 4) {
          for( var i = toStr.length - 1; i < 2; i++){
            toStr+= 0;
          }
        } 
        return toStr; 
      }
      


      res.json({status: true, message: "Verifications pin sent to <b> " + user.phone + " </b> via SMS",userId:user.user_id,id:user.user_id});
    } else {
      res.send({status: false, message: "User with <b> &nbsp;" + req.query.email + " &nbsp;</b> not found!"});
    }
    
  })
});

router.post("/user/change-password",function(req,res){
  console.log(req.body);
  model.otpSchema.findOne({otp: req.body.pin,user_id: req.body.id},function(err,data){
    if(err) throw err;
    if(data) {
      res.json({isVerified: true,userId: data.user_id});
      data.remove(function(err,info){});      
    } else {
      res.json({isVerified: false});
    }

  });
  
});

router.put("/user/change-password/:id",function(req,res){
  console.log(req.body);
  if(req.body.newPassword && req.body.isVerified) {
    var password = salt.createHash(req.body.newPassword);
    model.user.findOne({user_id: req.body.userId},{password: 1}).exec(function(err,user){
      if(err) throw err;
      if(user){       
        user.password = password;
        user.save(function(err,info){})
        res.json({isPasswordChanged: true});
      } else {
        res.json({isPasswordChanged: false})
      }
    })
    
  } else {
    res.send({isPasswordChanged: false})
  }
})


}

module.exports = loginRoute;