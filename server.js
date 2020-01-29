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
  nodemailer = require('nodemailer'),
  topdf = require("./topdf"),
 
  
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

  var client = {}; //= new infobip('Farelands', 'icui4cuok');

 
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

//var startDate = moment().startOf('week');//day week month
//var endDate = startDate.clone().endOf('week');


var gee = "gcamoemaster";


//var html = "<div style='padding:20px;background-color:green'><img src='https://applinic.com/assets/images/applinic1.png'><h1 style='text-align:center;color:blue'>Heloo PDF are you working alone?</h1></div>";
//var pdfPath = topdf(html);
//console.log(pdfPath);


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

/*var transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  auth: {
    user: "info@applinic.com",
    pass: process.env.EMAIL_PASSWORD
  }
});

var mailOptions = {
  from: 'Applinic info@applinic.com',
  to:'ede.obinna27@gmail.com',//data.email
  subject: 'Consultation Request from a Patient',
  html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b> Dear ' 
  + "dr" + " " + "okofor" + 
  ",</b><br><br> You received a consultation request from a patient.<br><br>" 
  + "mr" + " " + "obinna" + " " + "emeka"
  + " has just submitted a consultation request to you on Applinic<br><br>"
  + "Please click the link below to sign in to respond to her request.<br><br>"
  + "URL: https://applinic.com/user/doctor <br><br>"
  + "When you log in, click the notification message icon on top of your dashboard to see the request.<br>" 
  + "Select the message to open, review and respond to the request.<br><br>"
  + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone." 
  + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
  + "For inquiries please call customer support on +2349080045678<br><br>"
  + "Thank you for using Applinic<br><br>"
  + "<b>Applinic Team</b></td></tr></table>"

};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});*/

/*model.user.find({type: "Doctor"},function(err,data){
  console.log(data)
  data.forEach(function(item){
   
    paystack.customer.create({
      first_name: item.firstname || item.name,
      last_name: item.lastname || "applinic_user",
      email: item.email,
      phone: item.phone,
      metadata: {
        user_id: item.user_id,
        createdAt: new Date()
      }
    });
  })
})*/



config.configuration(app,model);
signupRoute(model,sms,geonames,paystack,io,nodemailer);
loginRoute(model,sms);
route(model,sms,io,streams,client,nodemailer); 
payments(model,sms,io,paystack,client,nodemailer);
placement(model,sms,io,nodemailer);
mySocket(model,io,streams,sms);



var a = "ede".replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
var b = "ede".replace(/\s+/g, '');




/*
var transporter = nodemailer.createTransport({
  service: "gmail",
  //port: 465,
  auth: {
    user: "ede.obinna27@gmail.com",
    pass: "myGmailPassword"
  }
});
*/

/*var transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  auth: {
    user: "info@applinic.com",
    pass: process.env.EMAIL_PASSWORD
  }
});

var mailOptions = {
  from: 'Applinic info@applinic.com',
  to: 'ede.obinna27@gmail.com',
  subject: 'Thank you for creating an account with us',
  html: '<b>welcome onboard!</b>'
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







