"use strict";
var config = require('./config');
var router = config.router;
var path = require("path");
var Wallet = require("./wallet");

function placementRoute(model,sms,io,nodemailer){

	//user sends help and the new help object is instantiated and saved to the data base.
	router.post("/user/help",function(req,res){
		if(req.user){		
			model.user.findOne({user_id: req.body.userId},{age:1,gender:1,city:1,country:1,email:1,phone:1,title:1,lastname:1},function(err,user){
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
		      isview: false,
		      deleted: false,
		      phone: user.phone,
		      email: user.email,
		      name: user.title + " " + user.lastname
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


		    model.user.findOne({email: "info@applinic.com"})
		    .exec(function(err,applinicDoctor){
			    sms.calls 
		        .create({
		          url: "https://applinic.com/pwrcall?",
		          to: "+2349092469137" || "",
		          from: '+16467985692',
		        })
		        .then(
		          function(call){
		            console.log(call.sid);
		          },
		          function(err) {
		            console.log(err)
		          }
		        );

		        //send sms to the firstline doctor
		        var msgBody = "A patient just submitted a complaint in PWR on applinic\n" + req.user.firstname + "-" + req.user.phone;      
		        sms.messages.create(
		          {
		            to: "+2348086675053",//applinicDoctor.phone,
		            from: '+16467985692',
		            body: msgBody,
		          },
		          callBack
		        );

		        function callBack(err,response){              
		          console.log(response)
		        }  


		         

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