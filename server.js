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
  paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY),   
  
  /*Nexmo = require("nexmo"), 
  sms = new Nexmo({
  	apiKey: process.env.NEXMO_API_KEY || "1c9ae030",
		apiSecret: process.env.NEXMO_API_SECRET || "ddb306aa9194c137"
  }),*/
  sms = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN),

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

/*sms.messages.create(
  {
    to: '+2348096461',
    from: '67985692',
    body: 'Applinic Oluchi my baby i love you!! from Obinna.',
  },
  function(err,msg) {
    console.log(err)
    console.log(msg)
  }
)*/



config.configuration(app,model);
signupRoute(model,sms,geonames,paystack);
loginRoute(model);
route(model,sms,io,streams); 
payments(model,sms,io,paystack);
placement(model,sms,io);
mySocket(model,io,streams);




var a = "ede obinna".replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
var a = "djdshj"
console.log(a[0])

/*const accountSid = 'AC79f290154f4c4236a3811054e2c5e2b7';
const authToken = 'your_auth_token';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

client.messages.create(
  {
    to: '+15558675310',
    from: '+15017122661',
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
  },
  (err, message) => {
    console.log(message.sid);
  }
);*/

//sms.message.sendSms('Appclinic',phoneNunber,msgBody,callBack); //"2348096461927" "2349092469137"


              //sms.message.sendSms('Appclinic',phoneNunber,msgBody,callBack); //"2348096461927"        







