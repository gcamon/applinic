"use strict";
var express = require('express'),      
  db = require('./model'),
  config = require('./config'),    
  route = require('./route'),
  signupRoute = require('./signup'),
  loginRoute = require('./login'),  
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  model = db(),
  payments = require("./finance"),
  Nexmo = require("nexmo"), 
  paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY),   
  sms = new Nexmo({
  	apiKey: process.env.NEXMO_API_KEY || "1c9ae030",
		apiSecret: process.env.NEXMO_API_SECRET || "ddb306aa9194c137"
  }), 
  placement = require("./placement"),
  mySocket = require("./socket"),
  streams = require("./streams")(),//this will be moved to another server later

  port = process.env.PORT || 3000;

  var ExpressPeerServer = require('peer').ExpressPeerServer;
  var Geonames = require("geonames.js");
  var geonames = new Geonames({username: 'gcamon29', lan: 'en', encoding: 'JSON'});

 
 // add geonames to the database once.
  model.geonames.find({},function(err,data){
    if(err) throw err;
    if(data.length === 0){ 
      addCountriesToDatabase();
    } else {
      console.log("Countries name already added to the database!")
    }
  });

  function addCountriesToDatabase() {
   geonames.countryInfo({})
    .then(function(countries){
      var name;
      for(var i in countries.geonames){
        if(countries.geonames.hasOwnProperty(i)) {
          name = new model.geonames(countries.geonames[i]);
        }

        name.save(function(err,info){
          if(err) throw err;
          console.log("Geonames saved")
        })
      }
      //console.log(countries.geonames)
    })
  }

 
var options = {
  debug: true
}

app.use('/call',ExpressPeerServer(http,options));


http.listen(port,function(){
    console.log('listening on *:3000');
});


config.configuration(app,model);
signupRoute(model,sms,geonames,paystack);
loginRoute(model);
route(model,sms,io,streams); 
payments(model,sms,io,paystack);
placement(model,sms);
mySocket(model,io,streams);




var a = "ede obinna".replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
console.log(a)

var date = new Date();
console.log(date.getTime() + 300000);


var a = [];
var elemPos = a.map(function(x){return x.id}).indexOf("h");
  
/*paystack.customer.create({
  first_name: "Obinna",
  last_name: "Ede",
  email: "bobby@gmail.com",
  phone: "23445673563",
  metadata: {
    user_id: "hdjijjfjffd",
    createdAt: new Date()
  }
})*/
/*paystack.customer.list()
  .then(function(body) {
      console.log(body);
  })
  .catch(function(error) {
    console.log(error);
  });*/

/*
 //checking to see if ref_id already exist.
      var random1 = Math.floor(Math.random() * 999);
      var random2 = Math.floor(Math.random() * 999);
      var ref = check(random1) + "" + check(random2);
      var num = parseInt(ref);
      var ref_id;
      var available;
      var count = 0;
      while(!available) {
        var elementPos = pharmacy.referral.map(function(x){return x.ref_id}).indexOf(num);
        if(elementPos === -1) {
          available = true;
          ref_id = num;
        }
        count++;

        if(count > 1000) {
          res.send("ref id could not be genenrated.Count is " + count + " Which means ref ids ran out of stock! Please redefine logic")
          break;
        }
      }
    }


    function check(num) {
    var toStr = num.toString();  
    if(toStr.length < 3) {
      for( var i = toStr.length - 1; i < 2; i++){
        toStr+= 0;
      }
    } 
    return toStr; 
    }


*/





