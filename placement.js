"use strict";
var config = require('./config');
var router = config.router;
var path = require("path");
var Wallet = require("./wallet");

function placementRoute(model,sms,io){

	//user sends help and the new help object is instantiated and saved to the data base.
	router.post("/user/help",function(req,res){
		console.log(req.body, req.files)
		if(req.user){		
			model.user.findOne({user_id: req.body.userId},{age:1,gender:1,city:1,country:1},function(err,user){
				var random = parseInt(Math.floor(Math.random() * 999999) + " " + Math.floor(Math.random() * 999999));
		  	var complain_id = "#" + random;
		    var preferredCity = req.body.city || user.city;
	      	var newHelp = new model.help({       
	        helpType: req.body.helpType,	        
		      description: req.body.description,
		      sent_date: req.body.date,
		      patient_id: req.body.userId,
		      complaint_id: complain_id,
		      age: user.age,
		      patient_city: user.city,
		      patient_country: user.country,
	        gender: user.gender,
	        preferred_city: preferredCity,
		      isview: false
      	});

	      

	      if(req.files.length > 0){
	      	var fileUrl;	      	
	      	for(var i = 0; i < req.files.length; i++){
	      		fileUrl = req.files[i].location || "/download/sick-file/" + req.files[i].filename;
	      		if(req.files[i].mimetype === "video/mp4" || req.files[i].mimetype === "video/ogg" || req.files[i].mimetype === "video/ogm" ||
	      		  req.files[i].mimetype === "video/ogv"){
	      			var fileObj = {};
	      			fileObj.type = "video";
	      			fileObj.url = fileUrl;
	      			newHelp.files.push(fileObj);
	      		} else if(req.files[i].mimetype === "image/jpeg" || req.files[i].mimetype === "image/jpg" || req.files[i].mimetype === "image/png") {
	      			var fileObj = {};
	      			fileObj.type = "image";
	      			fileObj.url = fileUrl;
	      			newHelp.files.push(fileObj);
	      		} else if(req.files[i].mimetype === "video/mp3"){
	      			var fileObj = {};
	      			fileObj.type = "audio";
	      			fileObj.url = fileUrl;
	      			newHelp.files.push(fileObj);
	      		}
	      		
	      	}
	      }

	      newHelp.symptoms = req.body.symptoms;
	      	
  	  

  		  io.sockets.to('pwr').emit("receive help",newHelp);


		    newHelp.save(function(err,info){
		      if(err) throw err;
		      console.log("saved")
		    });

		    //note sms will always be sent to premium users when ever a patient tables a complaint.
		    res.send({status:true});
			});		  
	  } else {
	  	res.send("Unauthorized access!!")
	  }
	});
	
}

module.exports = placementRoute;