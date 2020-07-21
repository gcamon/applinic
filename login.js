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
    // we are checking to see if the user trying to login already exists;

    var criteria = (req.body.isPhoneNumber) ? {phone: username} : {email: username};

    model.user.findOne(criteria, function(err, user) {
        
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
    
      if(data.admin && req.user.user_id === process.env.ADMIN_ID && req.user.type == "admin"){
        res.json({typeOfUser:"admin",isLoggedIn: true,balance: req.user.ewallet.available_amount,user_id:req.user.user_id});
      } else {
        data.presence = true;
        data.set_presence.general = true;
        data.save(function(err,info){
          console.log("presence is true");
        });
        normalUser();
      }
    });

    function normalUser() {  
      //console.log(req.user.stock_update)        
      res.json({
        isLoggedIn: true,
        name: req.user.name,
        age: req.user.age,
        gender: req.user.gender,
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
        mrak: req.user.mrak,
        courier_charge: req.user.courier_charge,
        field_agents: req.user.field_agents,
        stock_update: req.user.stock_update
      });
    }
  } else {
    res.redirect("/login");
  }  
});

//for admin loggin

router.get("/user/admin",function(req,res){
  if(req.user) {
    if(req.user.user_id === process.env.ADMIN_ID && req.user.admin === true,req.user.type == 'admin'){
      res.render("admin");
    } else {
      res.end("You are not authorized to view this page.");
    }
  } else {
    res.redirect("/login");
  }
});

router.get('/failed',function(req,res){        
    res.json({status: false,message: "Authentication failed."});
})

// Change password routes

router.get('/user/change-password',function(req,res){
  
  if(req.query.isPhoneCall) {
    var num = req.query.val.slice(1);
    req.query.val = "+" + num;
  }
 
  var criteria = { $or: [{ email : req.query.val},{phone: req.query.val}]};
  model.user.findOne(criteria,{phone:1,email:1,user_id:1},function(err,user){
    if(err) {
      res.send({error:"error : 500"});
      return;
    }

    console.log(user)


    if(user) {
      

      if(req.query.isPhoneCall) {
        model.otpSchema.remove({user_id: user.user_id,amount:0})
      }

     
      var password = genId() + " " + genId();

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


      console.log(password,user.phone);


      if(req.query.isPhoneCall) {
        var str = password.replace(/ +/g, "");
        sms.calls 
        .create({
          url: "https://applinic.com/twiliovoicemsg?pin=" + str,
          to: user.phone,
          from: '+16467985692',
        })
        .then(
          function(call){
            console.log(call.sid)
          },
          function(err) {
            console.log(err)
          }
        );
      } else {

        var msgBody = "Applinic change password pin is  " + password;
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

      }

      /*function check(num) {
        var toStr = num.toString();  
        if(toStr.length < 4) {
          for( var i = toStr.length - 1; i < 2; i++){
            toStr+= 0;
          }
        } 
        return toStr; 
      }*/
      //+234806 4245256

      function genId() {
        var text = "";
        var possible = "000111222333444555666777888999";
          for( var i=0; i < 4; i++ )
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
      }      

      var phone = hashPart(user.phone);

      res.json({status: true, message: "Verification pin sent to <b> " + phone + " </b> via SMS",userId:user.user_id,id:user.user_id,phone:user.phone});
    } else {
      res.send({status: false, message: "User with <b> &nbsp;" + req.query.val + " &nbsp;</b> not found!"});
    }

    function hashPart(val) {  
      var cardnumber = val;
      var getLen = val.length / 2;
      var len = (getLen >= 7) ? 8 : 6;
      var first4 = cardnumber.substring(0, len);
      var last5 = cardnumber.substring(cardnumber.length - 2);

      var mask = cardnumber.substring(len, cardnumber.length - 2).replace(/\d/g,"*");
      return first4 + mask + last5
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