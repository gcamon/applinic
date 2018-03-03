'use strict';
require('dotenv').config();
var express = require('express');
var path = require("path");
var multer = require('multer');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require("cookie-parser");
var MongoDBStore = require('connect-mongodb-session')(session);
var ExpressPeerServer = require('peer').ExpressPeerServer;
 


var configuration = function (app,model) {
  //config
  var storeDB = process.env.MONGODB_ADDON_URI || "mongodb://127.0.0.1:27017/medicalmull";
  var store = new MongoDBStore(
    {
      uri: storeDB,
      collection: 'mySessions'
  });

 	store.on('error', function(error) {
	  assert.ifError(error);
	  assert.ok(false);
	});

	app.use('/assets',express.static(__dirname + '/public'));
	//middleware
	app.use(session({
	  secret: 'keyboard cat',
	  store: store,
	  resave: true,	  
	  saveUninitialized: true,
	  cookie: {
	  	httpOnly: true, 
	  	maxAge: 3600000 * 24,
	  	path: "/user"
	  } //secure: true will be set on the cookie when i this site is on https
	}));
	
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());		
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(multer({dest: './uploads'}).any());
	
	
	app.use(function(req,res,next){
		
		  console.log("https://" + req.headers.host + req.url)
		
		  next();
		
	});

	passport.serializeUser(function(user, done) {    
    	done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {			
		model.user.findById(id, function(err, user) {
			done(err, user);
		});
	});

	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/views');

	app.use('/',router);

}

module.exports = {
  configuration: configuration,
  router: router,
  passport: passport	
}