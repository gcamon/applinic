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
  sms = new Nexmo({
  	apiKey: process.env.NEXMO_API_KEY || "1c9ae030",
		apiSecret: process.env.NEXMO_API_SECRET || "ddb306aa9194c137"
  }), 
  placement = require("./placement"),
  mySocket = require("./socket"),
  port = process.env.PORT || 3000;

  var ExpressPeerServer = require('peer').ExpressPeerServer;

    
var options = {
  debug: true
}

app.use('/call',ExpressPeerServer(http,options));


http.listen(port,function(){
    console.log('listening on *:8080');
});


config.configuration(app,model);
signupRoute(model,sms);
loginRoute(model);
route(model,sms,io); 
payments(model,sms,io);
placement(model,sms);
mySocket(model,io);


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





