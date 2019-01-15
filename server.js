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
  moment = require('moment'),
  
  //infobip = require('infobip-node'),


  //infobip = require('infobip'),

  //client = new infobip.Infobip('Farelands', 'icui4cuok'),
  
  /*Nexmo = require("nexmo"), 
  sms = new Nexmo({
  	apiKey: process.env.NEXMO_API_KEY || "1c9ae030",
		apiSecret: process.env.NEXMO_API_SECRET || "ddb306aa9194c137"
  }),*/
  sms = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN),
 

  placement = require("./placement"),
  mySocket = require("./socket"),
  streams = require("./streams")(),
  port = process.env.PORT || 3001;

  /*var ExpressPeerServer = require('peer').ExpressPeerServer;
  var Geonames = require("geonames.js");
  var geonames = new Geonames({username: 'gcamon29', lan: 'en', encoding: 'JSON'});*/
  var geonames = {};

  var client; //= new infobip('Farelands', 'icui4cuok');

  //client.sender.source = ""; //use numbers only for voice
  //client.sender.destinaton.push('+2348096461927');

 // client.sender.message = "I believe i can fly bro"; //text message content
  //client.sender.text = "i can beat the train"; 
 
  //client.send('sms', function(response){
    //@response dumps you response from infobip
    //console.log(response);
  //});


  //client.send('voice', function(response){
  //@response dumps you response from infobip 
  //console.log(response);
  //});


  //Initialize the client
/*var client = new infobip.Infobip('Farelands', 'icui4cuok');

 
//Set the message
var message = {from: "InfoSMS", to : "+2348096461927", text : "Testing Infobip SMS for applinic"};
 
//Send an SMS
client.SMS.send(message,function(err, response){
   console.log(err)
   console.log(response);
});*/

 
 // add geonames to the database once.
 /* model.geonames.find({},function(err,data){
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
  }*/

 
var options = {
  debug: true
}

//app.use('/call',ExpressPeerServer(http,options));


http.listen(port,function(){
    console.log('listening on *: ' + port);
});

var startDate = moment().startOf('week');//day week month
var endDate = startDate.clone().endOf('week');
console.log(startDate, "" , endDate)



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
signupRoute(model,sms,geonames,paystack,io);
loginRoute(model,sms);
route(model,sms,io,streams,client); 
payments(model,sms,io,paystack,client);
placement(model,sms,io);
mySocket(model,io,streams);



var a = "ede".replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
var b = "ede".replace(/\s+/g, '');

console.log("obinna".substring(0,2))


var nodemailer = require('nodemailer');
/*
var transporter = nodemailer.createTransport({
  service: "gmail",
  //port: 465,
  auth: {
    user: "ede.obinna27@gmail.com",
    pass: "icui4cuok"
  }
});
*/

/*var transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  auth: {
    user: "info@applinic.com",
    pass: "b2bisawesome"
  }
});

var mailOptions = {
  from: 'Applinic info@applinic.com',
  to: 'ede.obinna27@gmail.com',
  subject: 'Thank you for creating an account with us',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});*/


//var phone_number = '******' . substr( phone_number, - 4);

//var cardnumber = '+2348064245256';
//var first4 = cardnumber.substring(0, 7);
//var last5 = cardnumber.substring(cardnumber.length - 2);

//var mask = cardnumber.substring(7, cardnumber.length - 2).replace(/\d/g,"*");
//console.log(first4 + mask + last5);

/*var https = require("https");
var options = {
      host: "global.xirsys.net",
      path: "/_turn/www.applinic.com",
      method: "PUT",
      headers: {
          "Authorization": "Basic " + new Buffer("gcamon:406b470c-2ddf-11e8-9c83-538c56484774").toString("base64")
      }
};
var httpreq = https.request(options, function(httpres) {
      var str = "";
      httpres.on("data", function(data){ str += data; });
      httpres.on("error", function(e){ console.log("error: ",e); });
      httpres.on("end", function(){ 
          console.log("ICE List: ", str);
      });
});
httpreq.end();*/

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







