'use strict';
require('dotenv').config();
var express = require('express');
var pathExp = require("path");
var multer = require('multer');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require("cookie-parser");
var MongoDBStore = require('connect-mongodb-session')(session);
var ExpressPeerServer = require('peer').ExpressPeerServer;

function genHash(count) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

    for( var i=0; i < count; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
 

var configuration = function (app,model) {
  //config
  

  var storeDB = "mongodb://127.0.0.1:27017/medicalmull";
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
	  	maxAge: 3600000 * 24, // 24 hours
	  	path: "/user"
	  } //secure: true will be set on the cookie when i this site is on https
	}));
	
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());		
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	//app.use(multer({dest: './uploads'}).any());

	//var multer = require('multer');

	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './uploads')
	  },
	  filename: function (req, file, cb) {
	    cb(null, "nopic" + pathExp.extname(file.originalname)) //Appending .jpg
	  }
	})

	var upload = multer({ storage: storage });

	app.use(upload.any())
	
	var path = "";
	var list;
	var switchUrl;
	

	app.use(function(req,res,next){
	 	path = req.url
	  console.log("https://" + req.headers.host + req.url);		
	  next();		
	});

	passport.serializeUser(function(user, done) {   
    	done(null, user._id);
	});

	//original implemention
	/*passport.deserializeUser(function(id, done) {
		model.user.findById(id, function(err, user) {		
			done(err, user);				
		});
	})*/

	

	
	passport.deserializeUser(function(id, done) {
		/*
			Takes care of user switch and family account logic
		*/
		
		list =	path.split("/");
		switchUrl = path.substr(0,20);
		

		if(switchUrl === "/user/family-switch/") {
			switchUser();						
		} else if(switchUrl === "/user/family-normal/"){
			mainUser();
		}  else if(list[list.length - 1] === "login")  {
			model.user.findById(id, function(err, user) {		
				//user.family_flag = false;
				//user.save(function(){})		
			  done(err, user);	
			});
	 	} else if(path === "/user/family/create-account") {
	 		model.user.findById(id, function(err, user) {	
			  done(err, user);	
			});
	 	} else {				
			model.user.findById(id, function(err, user) {	
				//user.family_flag = false;
				//user.save(function(){})	
				//console.log(user)
				console.log(user.family_accounts)
				if(user.family_flag && user.type === "Patient") {
				  //var elePos = user.family_accounts.map(function(x){return x.status}).indexOf(true);
				  for(var j = 0; j < user.family_accounts.length; j++) {
				  	if(user.family_accounts[j].status === true) {
				  		activeMember(user.family_accounts[j],user);
				  		break;
				  	}
				  }				 

				} else {		
				  done(err, user);
				}	
			});
		}

		



		function mainUser() {
			//var list =	path.getUrl.split("/");
			var memberId = list[list.length - 1];

			model.user.findById(id)
			.exec(function(err, user) {	
				if(err) throw err;
				//var elemPos = user.family_accounts.map(function(x){return x.memberId}).indexOf(memberId);
				for(var k = 0; k < user.family_accounts.length; k++) {					
					if(user.family_accounts[k].main) {
						user.family_accounts[k].status = true;
						user.attach = { // this will not be saved in db
							firstname: user.family_accounts[k].name,
							userId: user.family_accounts[k].memberId,
							title: user.family_accounts[k].title
						}	
					} else {
						user.family_accounts[k].status = false;
					}
				}

				user.family_flag = true;
				user.switchSuccess = true; // use to know when switch was successful.
				user.family_accounts.push({});
				user.family_accounts.pop();
				user.save(function(err,info){
					if(err) throw err;
					updatewallet();
					done(err, user);
				});					
							
			})

		}

		
		function switchUser() {		
			var memberId = list[list.length - 1];
			model.user.findById(id)
			.exec(function(err, user) {	
				if(err) throw err;				
				//var elemPos = user.family_accounts.map(function(x){return x.memberId}).indexOf(memberId);
				for(var k = 0; k < user.family_accounts.length; k++) {
					if(user.family_accounts[k].memberId === memberId) {
						user.family_accounts[k].status = true;
						user.attach = {
							firstname: user.family_accounts[k].name,
							userId: user.family_accounts[k].memberId,
							title: user.family_accounts[k].title
						}	
					} else {
						user.family_accounts[k].status = false;
					}
				}	

				user.family_flag = true;
				user.switchSuccess = true; // use to know when switch was successful.
				user.family_accounts.push({});
				user.family_accounts.pop();
				user.save(function(er,info){
					if(er) throw er;
					updatewallet();
					done(err, user);
				});					

			})
		}


		function updatewallet() {
			//base on route params of the request we get the value of prevUser and newUser
			var prevUser = list[list.length - 2];
			var newUser = list[list.length - 1];

			model.user.findOne({user_id: prevUser},{ewallet:1},function(err,prevWallet){
				model.user.findOne({user_id: newUser},{ewallet:1}).exec(function(err,newWallet){
					newWallet.ewallet = prevWallet.ewallet;
					newWallet.save(function(){});
				})
			})
		}

		function activeMember(activeMember,user) {	
			user.user_id = activeMember.memberId;
			model.user.findOne({user_id: activeMember.memberId})
			.exec(function(err,member){				
				user.firstname = member.firstname;
				user.lastname = member.lastname;
				user.title = member.title;
				user.age = member.age;
				user.gender = member.gender;
				user.profile_pic_url = member.profile_pic_url;
				user.ewallet = member.ewallet;
				done(err, user);
			})
		}
		


	    
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