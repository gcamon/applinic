"use strict";
var config = require('./config');
var passport = config.passport;
var LocalStrategy = require("passport-local").Strategy;
var path = require('path');
var chance = require("chance").Chance();
var salt = require('./salt');
var router = config.router;
var http = require("http");
var uuid = require('uuid');
var randos = require("./randos");
var sendSMS = require('./smartSMS');

function genId(username) {
	var getFirstLetter;
	var toStr;
	if(username) {
		var getRandomNumber = randos.genRef(7);
		toStr = username + getRandomNumber;
	} else {
		var getRandomNumber = randos.genRef(10);
		toStr = getRandomNumber.toString();
	}			
	return toStr;					
}

var signupRoute = function(model,sms,geonames,paystack,io,transporter) {
	passport.use('signup', new LocalStrategy({
		usernameField : 'phone',
		passwordField : 'password',
		passReqToCallback : true 
	},
	function(req,phone,password,done){
		process.nextTick(function(){	
			model.user.findOne({ phone : phone},function(err,user){ //sign up was modified on 7/19/20 email criteria in $or was removed
			if(err) return done(err);
			if(user){
				if(user.email){
					return done(null, false, req.flash('signupMessage', 'Email has already been used please find another one'));	
				} else {
					var userphone = {};
					model.verifyPhone.findOne({phone:req.body.phone,pin:req.body.v_pin},function(err,data){					
						if(err) throw err;
						if(data){
							userphone.testuserPhone = true;
							updateUser();
						} else {
							return done(null, false, req.flash('signupMessage', 'Please you have to agree to our terms and conditions'));
						}
					});
				}
			} else {
				var userphone = {};
				model.verifyPhone.findOne({phone:req.body.phone,pin:req.body.v_pin},function(err,data){					
					if(err) throw err;
					if(data){
						userphone.testuserPhone = true;
						createUser();
					} else {
						return done(null, false, req.flash('signupMessage', 'Please you have to agree to our terms and conditions'));
					}
				});

			}


			function updateUser() {
				user.email = req.body.email || "hjdsd@gmail.com";
				user.password = salt.createHash(password);
				user.username = req.body.username;
				user.address = req.body.address;
				user.country = req.body.countryName;
				user.city = req.body.city;
				user.ewallet = {
					transaction: [],
					available_amount: 0
				}

				user.save(function(err,info){
					if(err) throw err;
					

					io.sockets.to(process.env.ADMIN_ID).emit("new user",
						{city:user.city,phone: user.phone, date:user.date,firstname:user.firstname,name:user.name,title:user.title})

				
					var enames = (req.body.title && req.body.title !== "SC") ? (req.body.title + " " + req.body.lastname) : req.body.name;
					var emsg = '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Dear ' + enames 
					+ "</b><br><br><b>Congratulations and welcome to Applinic Healthcare.</b><br><br>" 
					+ "Your registration as an Applinic " + req.body.typeOfUser + " was successful.<br><br>"
					+ "Your login details are as follows:<br><br>"
					+ "Email: " + req.body.email + "<br><br>"
					+ "Password: " + password + "<br><br>"
					+ "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone." 
					+ "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
					+ "To learn how to use Applinic, please read the information palettes on your dashboard after logging in and or " 
					+ "<a href='https://youtu.be/CctDIyN_QA0'> click here</a> to watch Applinic videos for " +  req.body.typeOfUser + "<br><br>"
					+ "We will occasionally send you information updates on our services and new packages through this mail and your registered phone no.<br><br>" 
					+ "For further inquiries please call customer support on +2349080045678 <br><br>"
					+ "You may log in to your account now by <a href='https://applinic.com/login'>clicking here.</a> <br><br>"
					+ "Thank you for choosing Applinic.<br><br>"
					+ "Sincerely,<br><br>"
					+ "Applinic Team</td></tr></table>"


					var mailOptions = {
					  from: 'Applinic info@applinic.com',
					  to: req.body.email,//req.body.email || 'ede.obinna27@gmail.com',
					  subject: 'Your registration as an Applinic ' + req.body.typeOfUser + ' was successful',
					  html: emsg
					};

					if(req.body.email)
						transporter.sendMail(mailOptions, function(error, info){
						  if (error) {
							console.log(error);
						  } else {
							console.log('Email sent: ' + info.response);
						  }
						});

					return done(null,user);
								
				})
			}

			function createUser() {
					
					if(req.body.agree === true && userphone.testuserPhone) {

						var uid = (user) ? user.user_id : genId(req.body.username);

						var referral_link = "/referral/" + uid + "/signup";

						var phone = (user) ? user.phone : req.body.phone;

						var date = (user) ? user.date : new Date();
						
						var User = new model.user({
							email: req.body.email,
							user_id: uid,
				  password: salt.createHash(password),
				  phone: phone,
				  admin: false,
				  date: date,
				  dob: req.body.dob || new Date(),
				  country: req.body.countryName,
				  type: (req.body.typeOfUser === "Special Center") ? "Doctor" : req.body.typeOfUser,
				  city: req.body.city,
				  firstname: req.body.firstname,
				  lastname: req.body.lastname,
				  username: req.body.username,
							address: req.body.address,
							gender: req.body.gender,
							title: (req.body.typeOfUser === "Special Center") ? "SC" : req.body.title,
							age: req.body.age,
							state: req.body.state,
							region: req.body.region,
							currencyCode: req.body.currencyCode,
							specialty: req.body.specialty,
							profile_url: "/user/profile/view/" + uid,
							profile_pic_url: "/download/profile_pic/nopic",
							work_place: req.body.work_place,
							name: (req.body.typeOfUser === "Special Center") ? req.body.firstname : req.body.name,
							verified: false,
							rating: {
								votes:20,
								current: 1,
								max: 5
							},
							ref_link: referral_link					
					});

					User.ewallet = {
						available_amount: 0,
						transaction: []
					}

					/****create user paystack account****/
					paystack.customer.create({
					  first_name: req.body.firstname,
					  last_name: req.body.lastname,
					  email: req.body.email,
					  phone: req.body.phone,
					  metadata: {
						user_id: uid,
						createdAt: new Date()
					  }
					});

					if(req.body.typeOfUser === "Patient"){
						//family account
						User.family_accounts.unshift({
							status: true,
				memberId: uid,
				name: req.body.firstname,
				main: true
						});
						//medical record access key
						User.mrak = uuid.v1();
					}

					
					if(req.body.invitationId){
						model.invite.findOne({id: req.body.invitationId})
						.exec(function(err,invite){
							if(err) throw err;
							
							if(invite){
								model.user.findOne({user_id: invite.referral_id})
								.exec(function(err,referral){
									if(err) throw err;
									
									if(referral){
										if(req.body.typeOfUser === "Patient")
										var elemIdexP = referral.doctor_patients_list.map(function(x){return x.patient_phone}).indexOf(User.phone)
									
									 	if(req.body.typeOfUser === "Doctor")
										var elemIdexD = referral.accepted_doctors.map(function(x){return x.doctor_email}).indexOf(User.email)

										if(req.body.typeOfUser === "Patient" && invite.type === req.body.typeOfUser && elemIdexP === -1) {
											User.accepted_doctors.unshift({
												doctor_id: referral.user_id,
												date_of_acceptance: + new Date(),
												doctor_firstname: referral.name,
												doctor_lastname:  referral.lastname,
												doctor_profile_pic_url: referral.profile_pic_url,
												service_access: true,
												doctor_email: referral.email,
												doctor_specialty: referral.specialty					
											});



											referral.doctor_patients_list.unshift({
												patient_firstname: User.firstname,
												date: + new Date(),
												patient_lastname: User.lastname,
												patient_id: User.user_id,
												patient_profile_pic_url: User.profile_pic_url,
												patient_address: User.address,
												patient_city: User.city,
												Patient_country: User.country,
												patient_gender: User.gender,
												patient_age: User.age,
												patient_phone: User.phone,
												presence: false,
												initial_complaint: {
												complaint: "This patient was added through invitation. No complaint was recorded.",
												complaint_date: + new Date(),
												date_received: + new Date(),
												}
											});

											/*var transporter = nodemailer.createTransport({
											  host: "mail.privateemail.com",
											  port: 465,
											  auth: {
												user: "info@applinic.com",
												pass: process.env.EMAIL_PASSWORD
											  }
											});*/

											var mailOptions = {
											  from: 'Applinic info@applinic.com',
											  to: referral.email,//referral.email,
											  subject: 'New Patient Added to Your Account',
											  html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif;"><b>Dear ' 
											  + referral.title + " " + referral.lastname 
											  + ",<br><br>" + User.title + " " + User.lastname + " " + User.firstname + ", a Patient was added to your account in response to your invitation."
											  + "<br><br> Please <a href='https://applinic.com/login'>log in </a> to manage your patient."
											  + "<br><br> <b>Applinic Team</b></td></tr></table>"
											};
					 
											transporter.sendMail(mailOptions, function(error, info){
											  if (error) {
												console.log(error);
											  } else {
												console.log('Email sent: ' + info.response);
											  }
											});

											invite.remove(function(err,info){
												console.log(err)
												
											});
											referral.save(function(err,info){
												if(err) throw err;
											});
											saveUser();

										} else if(req.body.typeOfUser === "Doctor" && invite.type === req.body.typeOfUser && elemIdexD === -1){

											referral.accepted_doctors.unshift({
												doctor_id: User.user_id,
												date_of_acceptance: + new Date(),
												doctor_firstname: User.firstname,
												doctor_lastname:  User.lastname,
												doctor_name: User.name,
												doctor_profile_pic_url: User.profile_pic_url,
												service_access: true,
												doctor_email: User.email,
												doctor_specialty: User.specialty					
											});

											referral.doctor_patients_list.unshift({
												patient_firstname: referral.firstname,
												date: + new Date(),
												patient_lastname: referral.lastname,
												patient_id: referral.user_id,
												patient_profile_pic_url: referral.profile_pic_url,
												patient_address: referral.address,
												patient_city: referral.city,
												Patient_country: referral.country,
												patient_gender: referral.gender,
												patient_age: referral.age,
												presence: false,
												initial_complaint: {
												complaint: "This patient was added through invitation. No complaint was recorded.",
												complaint_date: + new Date(),
												date_received: + new Date(),
											}
											});

											/*var transporter = nodemailer.createTransport({
											  host: "mail.privateemail.com",
											  port: 465,
											  auth: {
												user: "info@applinic.com",
												pass: process.env.EMAIL_PASSWORD
											  }
											});*/

											var mailOptions = {
											  from: 'Applinic info@applinic.com',
											  to: referral.email,//req.body.email || 'ede.obinna27@gmail.com',
											  subject: 'New Doctor Added to Your Account',
											  html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif;"><b>Dear '
											  + referral.title + " " + referral.lastname  
											  + ",<br><br>" + User.title + " " + User.lastname + " " + User.firstname + " was added to your account in response to your invitation."
											  + "<br><br> Please <a href='https://applinic.com/login'>log in </a> for more details."
											  + "<br><br> <b>Applinic Team</b></td></tr></table>"
											};

											transporter.sendMail(mailOptions, function(error, info){
											  if (error) {
												console.log(error);
											  } else {
												console.log('Email sent: ' + info.response);
											  }
											});

											invite.remove(function(){});
											referral.save(function(){});
											saveUser();

										} else {
											saveUser()
										}								
									}
								}) //end of find with user invite.referral_id 
							} else {
								saveUser()
							}
						}); //end of invite find method

					} else {
						saveUser()
					} //end of if req.body.invitationId


					
						if(req.body.typeOfUser === "Doctor"){
							User.name = (req.body.lastname) ? req.body.title + " " + req.body.lastname + " " + req.body.firstname.slice(0,1).toUpperCase() : req.body.title + " " + req.body.firstname;
							User.city_grade = 10;
						}			
					
						if(req.body.typeOfUser === "Pharmacy" || req.body.typeOfUser === "Laboratory" || req.body.typeOfUser === "Radiology"){
							var city = (req.body.city === "Lagos" || req.body.city === "Abuja" || req.body.city === "Port-Harcourt" ) ? true : false;
							if(city){
								User.city_grade = 10;
							} else {
								User.city_grade = 10;
							}	

							User.stock_update = {
								type: req.body.typeOfUser,
								status: false
							}

						}		

						if(req.body.typeOfUser === "Pharmacy") {
							User.courier_charge = 500;		
							User.courier_access_password = uuid.v1();			
						}


						if(req.body.typeOfUser === "Patient"){
							

			 				model.study.find({patient_phone: User.phone})
          		.exec(function(err,studies){ 

              var elemPos;
              var random;
                         
           
              studies.forEach(function(study){                      
               
                elemPos = User.medical_records.radiology_test
                  .map(function(x){return x.patient_id_of_study}).indexOf(study.study_id)

                 if(elemPos === -1) {
                  
                  random = Math.floor(Math.random() * 9999999); 

                  var testToRun = [];
                  testToRun.push({
                    sn: 1,
                    name: study.study_name
                  })

                  User.medical_records.radiology_test.push({
                    acc_no: random,
                    advise: study.advise || "",
                    center_address: study.center_address || "",
                    center_city: study.center_city || "",
                    center_country: study.center_country || "",
                    center_id: study.center_id || "",
                    center_name: study.center_name || "",
                    center_phone: study.center_phone || "",
                    conclusion: study.conclusion || "",
                    files: [],
                    findings: study.findings || "",
                    indication: study.indication || "",
                    lab_pdf_report: [],
                    mobile_viewer_path: study.study_link_mobile || "",
                    patient_id: User.user_id,
                    patient_id_of_study: study.study_id || study.study_uid,
                    payment_acknowledgement: true,
                    pdf_report: study.pdf_report,
                    receive_date: + new Date(study.study_date) || "",
                    ref_id: study.ref_id || "",
                    referral_firstname: study.referring_physician || "",
                    referral_title: "",
                    report: [],
                    sent_date: study.created,
                    session_id: study.session_id || "",
                    study_id: study._id.toString(),
                    test_to_run: testToRun,
                    web_viewer_path: study.study_link2 || ""
                  })
                }
                
              }) 

              User.save(function(err,info){})
						})

          	}

						function saveUser() {
							//console.log(User)
							User.save(function(err){
								console.log("user saved");
								if(err) throw err;	
								io.sockets.to(process.env.ADMIN_ID).emit("new user",
									{city:User.city,phone: User.phone, date:User.date,firstname:User.firstname,name:User.name,title:User.title})

								/*var transporter = nodemailer.createTransport({
								  host: "mail.privateemail.com",
								  port: 465,
								  auth: {
									user: "info@applinic.com",
									pass: process.env.EMAIL_PASSWORD
								  }
								});*/
								var enames = (req.body.title && req.body.title !== "SC") ? (req.body.title + " " + req.body.lastname) : req.body.name;
								var emsg = '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Dear ' + enames 
								+ "</b><br><br><b>Congratulations and welcome to Applinic Healthcare.</b><br><br>" 
								+ "Your registration as an Applinic " + req.body.typeOfUser + " was successful.<br><br>"
								+ "Your login details are as follows:<br><br>"
								+ "Email: " + req.body.email + "<br><br>"
								+ "Password: " + password + "<br><br>"
								+ "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone." 
								+ "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
								+ "To learn how to use Applinic, please read the information palettes on your dashboard after logging in and or " 
								+ "<a href='https://youtu.be/CctDIyN_QA0'> click here</a> to watch Applinic videos for " +  req.body.typeOfUser + "<br><br>"
								+ "We will occasionally send you information updates on our services and new packages through this mail and your registered phone no.<br><br>" 
								+ "For further inquiries please call customer support on +2349080045678 <br><br>"
								+ "You may log in to your account now by <a href='https://applinic.com/login'>clicking here.</a> <br><br>"
								+ "Thank you for choosing Applinic.<br><br>"
								+ "Sincerely,<br><br>"
								+ "Applinic Team</td></tr></table>"


								var mailOptions = {
								  from: 'Applinic info@applinic.com',
								  to: req.body.email,//req.body.email || 'ede.obinna27@gmail.com',
								  subject: 'Your registration as an Applinic ' + req.body.typeOfUser + ' was successful',
								  html: emsg
								};

								if(req.body.email)
									transporter.sendMail(mailOptions, function(error, info){
									  if (error) {
										console.log(error);
									  } else {
										console.log('Email sent: ' + info.response);
									  }
									});

								return done(null,User);
							});		

						}	//user saves

						} else {
							res.send({error: "Email already in use. Please find another one"});
						}
					
				}//end of function creatuser

				
			})			
		})
	}));

	
	

	router.post('/user/signup', function(req, res, next) {	
	  passport.authenticate('signup', function(err, user, info) {   
		if (err) {
		  return next(err); // will generate a 500 error
		}
		// Generate a JSON response reflecting signup
		if (!user) {	
			res.send({error:true,message: "User phone number not active or wrong verification pin!"});
		} else {
			var msgBody = "Applinic login details Email " + req.body.email + " Password " + req.body.password;
				var phoneNunber = (req.body.phone[0] !== "+") ? "+" + req.body.phone : req.body.phone;
			
				function callBack(err,info){
					console.log(err)
					console.log(info)
				}

				//sms.message.sendSms('Applinic',phoneNunber,msgBody,callBack); //"2348096461927"	    	
			// sms.messages.create(
			// 	  {
			// 		to: phoneNunber,
			// 		from: '+16467985692',
			// 		body: msgBody
			// 	  }
			// 	) 
			sendSMS(phoneNunber,msgBody)
				res.send({error: false,message: "Success! Account created."}); 	
		}
	  })(req, res, next)
	});

	router.put("/user/verify-phone-number",function(req,res){
		var genPin = randos.genRef(6);	
		if(req.body.isCovid19){
			model.user.findOne({phone: req.body.phone})
			.exec(function(err,user){
				if(err) throw err;
				if(!user){
					req.body.isNewUser = true;
				} else {
					req.body.isNewUser = false;
				}
			})
		}		

		var testPhone = new model.verifyPhone({
			phone: req.body.phone,
			pin: genPin
		});

		var date = new Date()
		testPhone.expirationDate = new Date(date.getTime() + 300000);
		testPhone.expirationDate.expires  = 60 * 60; // 1 hour before deleted from database.

		testPhone.save(function(err,info){});
		var msgBody = "Your Phone Verification Pin for Applinic is: " + genPin;
		var phoneNunber = (req.body.phone[0] !== "+") ? "+" + req.body.phone : req.body.phone;
		console.log(genPin)
		if(!req.body.isPhoneCall) {
			// sms.messages.create(
			//   {
			// 	to: phoneNunber,
			// 	from: '+16467985692',
			// 	body: msgBody,
			//   },
			//   callBack
			// )	  
			
			
			function callBack(err,response){
				//res.send({message:"Phone Verification Pin sent to " + req.body.phone + " (use " + genPin + " to complete registration)"});
				if(!err) {
					//res.send({message:"Phone Verification Pin sent to " + req.body.phone + " (use " + genPin + " to complete registration)"});
					res.send({message:"Phone Verification Pin sent to " 
						+ req.body.phone 
						+ ". Enter pin below  to complete registration.",isNewUser: req.body.isNewUser, status: true})
				} else {
					res.send({message:err.message,error: true});
				}
				
			}
			
			sendSMS(phoneNunber,msgBody,callBack)
		} else {
			sms.calls 
		  .create({
			url: "https://applinic.com/twiliovoicemsg?pin=" + genPin,
			to: req.body.phone,
			from: '+16467985692',
		  })
		  .then(
			function(call){
			  //console.log(call.sid)
			},
			function(err) {
			  console.log(err)
			}
		  );
		}	

	})

	
	router.get('/user/signup',function(req,res){

		if(req.query.phone){			
			model.user.findOne({phone:req.query.phone},function(err,userData){
				if(err) throw err;
				if(!userData){		
					res.send({error: false,errorMsg: ""});
				} else if(!userData.password && !userData.email) {
					res.send({error: false,errorMsg: ""});
			  } else {
					res.send({error: true,errorMsg: "User with this phone number already exist!"});
				}
			});
			return;
		}

		if(req.query.username){
			model.user.findOne({username:req.query.username},function(err,username){
				if(err) throw err;				
				if(!username){	
					res.send({error: false,errorMsg: ""});
				} else {
					res.send({error: true,errorMsg: "username already taken!"});
				}
			});
			return;
		}

		if(req.query.email) {
			model.user.findOne({email:req.query.email},function(err,data){
				if(err) throw err;
				if(!data){
					res.send({success: true});
				} else {
					res.send({success: false});
				}
			})
		}
	
		
	});


	//this route takes care of patient that came to diagnostic center to run a test without a referral by a doctor.
	//the center can find run and send test report to patient by simply find the user with the user phone number.
	router.get("/user/existing-user",function(req,res){
		var phone = "+" + req.query.phone;
		var type = (req.query.type === "laboratory") ? "laboratory" : "radiology";
		var str = (type == "laboratory") ? "laboratory.patient_phone" : "radiology.patient_phone";
		var criteria = {};
		criteria[str] = phone;
		criteria["center_id"] = req.user.user_id;

		/*model.user.findOne({user_id: req.user.user_id},{referral:1}).exec(function(err,result){
			if(err) throw err;
			if(result){
				var elemPos = result.referral.map(function(x){return x[type].patient_phone}).indexOf(phone);
				//var found = result.referral[elemPos]; 
				//console.log(found);
				if(elemPos !== -1){
					res.json({error:"Person to add is already your patient!"});
				} else {
					createPatient(result);
				}
			} else {
				res.end({error:"Something went wrong"});
			}				
		});*/

		model.referral.findOne(criteria)
		.exec(function(err,result){
			if(err) throw err;
			if(result){
				res.json({error:"Person to add is already your patient!"});
			} else {
				createPatient(result);
			}
		})

		function createPatient(result) {

			model.user.findOne({phone:phone,type:"Patient"},{firstname:1,lastname:1,user_id:1,profile_pic_url:1,title:1,gender:1,age:1,phone:1,medical_records:1})
			.exec(function(err,data){
				if(err) throw err;
				if(data){
					var refId = randos.genRef(6);
					var date = + new Date();
					var date2 = new Date();

					
					var sendObj = {
						firstname: data.firstname,
						lastname: data.lastname,
						profile_pic_url: data.profile_pic_url,
						user_id: data.user_id,
						title: data.title,
						gender: data.gender,
						age: data.age,
						phone: data.phone,
						ref_id: refId
					}

				 var recordObj = {
			  center_name: req.user.name,
			  test_to_run: [],
			  center_address: req.user.address,
			  center_city: req.user.city,
			  center_country: req.user.country,
			  center_phone: req.user.phone,
			  center_id: req.user.user_id,
			  patient_id: data.user_id,
			  ref_id: refId,
			  referral_firstname: req.user.name,
			  referral_lastname: req.user.lastname,
			  referral_title: req.user.title,
			  sent_date: date,
			  report: "Pending",
			  conclusion: "Pending"
			}

					var refObj = {};
					refObj.ref_id = refId;
			  refObj.referral_firstname = req.user.name;
			  refObj.referral_id = req.user.user_id;  
					refObj.referral_email = req.user.email;
					refObj.referral_phone = req.user.phone;
			  refObj.date = date2;
			  refObj.center_id = req.user.user_id
					refObj.deleted = false
					

			  if(req.query.type === "laboratory") {
				  refObj.laboratory = {
					test_to_run : [],
					patient_firstname: data.firstname,
					patient_lastname: data.lastname,
					patient_profile_pic_url: data.profile_pic_url,
					patient_title: data.title,
					patient_gender: data.gender,
					patient_age: data.age,
					patient_phone: data.phone,
					patient_id: data.user_id,
					test_id: ref_id,
					attended: false,
				  }	     

			  data.medical_records.laboratory_test.unshift(recordObj);
		 
				} else if(req.query.type === "radiology"){
					refObj.radiology = {
					test_to_run : [],
					patient_firstname: data.firstname,
					patient_lastname: data.lastname,
					patient_profile_pic_url: data.profile_pic_url,
					patient_title: data.title,
					patient_gender: data.gender,
					patient_age: data.age,
					patient_phone: data.phone,
					patient_id: data.user_id,
					attended: false,
				  }
				  
				  data.medical_records.radiology_test.unshift(recordObj);
				}


				
					var ref = new referral(refObj); 

					ref.save(function(err,info){
				if(err) throw err;
			  });

				
					data.save(function(err,info){});

					res.send({patient: sendObj});
				} else {
					res.send({error:"Patient not found!"});
				}
			});
		}
	})


	router.post("/referral/:id/signup",function(req,res){
		passport.authenticate('signup', function(err, user, info) {
		if (err) {
		  return next(err); // will generate a 500 error
		}
		// Generate a JSON response reflecting signup
		if (!user) {	
			res.send({error:true,errorMsg: "User with that email already exist!"});
		} else {
			model.user.findOne({user_id: req.params.id},{ewallet:1}).exec(function(err,data){
				if (err) throw err;
				var date = + new Date();	    		
				var transacObj = {
						date: date,
						source: "Admin",
						actiivity: "Credit",
						message: "referral commission",
						body: {
							amount: 100,
							beneficiary: "You"
						}
					}
					data.ewallet.available_amount += 100;
					data.ewallet.transaction.push(transacObj);
				data.save(function(err,info){
					if(err) throw err;
				
				});
			})	    	
			res.send({error: false});
		}

	  })(req, res, next);
	});

	router.post("/user/emergency-signup",function(req, res, next) {
	
		model.user.findOne({phone:req.body.phone},function(err,user){			
			if(err) throw err;
			if(user){
				res.json({message: "User with this phone number " + "'" + req.body.phone + "'" + " already exist"})
			} else {
				var ref = randos.genRef(8);
				var uid = genId();
				var profileUrl = "/patient/EM/profile/" + uid;				
				var User = new model.user({
					email: req.body.email,
					user_id: uid,
				phone: req.body.phone,	                    
				type: req.body.typeOfUser,
				city: req.body.city,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				username: req.body.username,
					address: req.body.address,		
					profile_pic_url: "/download/profile_pic/nopic",						
					country: req.body.country,
					emergency_ref_url: profileUrl									
				});

				User.ewallet = {
					available_amount: 0,
					transaction: []
				}
				
				var patient = {
					patient_firstname:req.body.firstname,
					patient_lastname:req.body.lastname,
					patient_id: uid,
					patient_profile_pic_url:User.profile_pic_url,
					date: req.body.date
				}
			  
			  User.save(function(err,info){			  	
				if(err) throw err;  	
				sendSMSFn(req.body.phone,profileUrl);
				if(req.body.email)
					sendEMAIL(req.body.email)	

				switch(req.body.type){
					case "doctor":
						tellDoctor(patient);
					break;

					case "laboratory":
						patient.ref = ref;
						patient.status = "em";
						tellCenter(patient);
					break;

					case "radiology":
						patient.ref = ref;
						patient.status = "em";
						tellCenter(patient);
					break;

					default:
					break;
				}

			  
				
			  })

			  
			}
		})

		//importantly, sms or email if available will be sent to patient including the referrral link for the patiento view his profile.
		function sendSMSFn(mobile,profileUrl){
			function callBack(err,response){
				console.log(err);
			}
		
			var msgBody = "Your emergency profile link is \n" + profileUrl;
			var phoneNunber =  mobile;
			//sms.message.sendSms('Appclinic',phoneNunber,msgBody,callBack); //"2348096461927"

			sendSMS(phoneNunber,msgBody)
			
		}

		function sendEMAIL(email){
			
		}
		
		function tellDoctor(patientObj) {
			model.user.findOne({user_id: req.user.user_id},{doctor_patients_list:1}).exec(function(err,data){
				if(err) throw err;
				data.doctor_patients_list.unshift(patientObj);
				data.save(function(err,info){
					if(err) throw err;
					res.send(patientObj)
				})
			})		
		}

		function tellCenter(patientObj) {
			model.user.findOne({user_id: req.user.user_id},{referral:1}).exec(function(err,result){
				if(err) throw err;
				try{
				var centerObj = {
			name: req.user.name,
			address: req.user.address,
			city: req.user.city,
			country: req.user.country,
			phone: req.user.phone,
			id: req.user.user_id
		}

				var refObj = {};
				refObj.ref_id = patientObj.ref,
		  refObj.referral_firstname = req.user.name;
		  refObj.referral_lastname = req.user.lastname;
		  refObj.referral_title = req.user.title;
		  refObj.referral_id = req.user.user_id;  
		  refObj.date = req.body.date;

		  if(req.body.type === "laboratory") {
			  refObj.laboratory = {
				test_to_run : [],
				patient_firstname: req.body.firstname,
				patient_lastname: req.body.lastname,
				patient_profile_pic_url: patientObj.patient_profile_pic_url,
				patient_title: req.body.title,
				patient_gender: req.body.gender,
				patient_age: req.body.age,
				patient_phone: req.body.phone,
				patient_id: patientObj.patient_id,
				attended: false,

			  }
			} else if(req.body.type === "radiology"){
				refObj.radiology = {
				test_to_run : [],
				patient_firstname: req.body.firstname,
				patient_lastname: req.body.lastname,
				patient_profile_pic_url: patientObj.patient_profile_pic_url,
				patient_title: req.body.title,
				patient_gender: req.body.gender,
				patient_age: req.body.age,
				patient_phone: req.body.phone,
				patient_id: patientObj.patient_id,
				attended: false,
			  }
			}
			

		  result.referral.push(refObj);          

		result.save(function(err,info){
		  if(err) throw err;
		  res.send(patientObj)
		});

		tellPatient(centerObj,patientObj.patient_id,patientObj.ref);
	  } catch(e){
		console.log(e.message)
	  }

			})
			
			var tellPatient = function(centerInfo,patient_id,ref){
		//remember sms will be sent to the patient
		model.user.findOne({user_id: patient_id},{medical_records: 1,user_id:1}).exec(function(err,record){            
		  if(err) throw err;     
		  var recordObj = {
			center_name: centerInfo.name,
			test_to_run: [],
			center_address: centerInfo.address,
			center_city: centerInfo.city,
			center_country: centerInfo.country,
			center_phone: centerInfo.phone,
			center_id: centerInfo.id,
			patient_id: record.user_id,
			ref_id: ref,
			referral_firstname: centerInfo.name,
			referral_lastname: req.user.lastname,
			referral_title: req.user.title,
			sent_date: req.body.date,
			report: "Pending",
			conclusion: "Pending"
		  }

		  switch(req.body.type){
			case "laboratory":
				record.medical_records.laboratory_test.unshift(recordObj);
			break;
			case "radiology":
				record.medical_records.radiology_test.unshift(recordObj);
			break;
			default:
			break;
		  }
		  
		  record.save(function(err,info){
			if(err) {
			  throw err;
			}
			console.log(recordObj)   
		  });

		});
	  }//end of tellpatient function
		} //end of tellcenter function
		
	  function genId() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

		for( var i=0; i < 12; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	 }
	  
	});

	router.get("/user/getCountries",function(req,res){
	  model.geonames.find({},{_id:0,_v:0},function(err,countries){
		if(err) throw err;
		
		res.send(countries);
	  }).sort({countryName:1})
	});

	router.get("/user/remote/geo-data",function(req,res){
	  geonames.countryInfo({}) 
	  .then(function(countries){
		return geonames.children({geonameId: req.query.geonameId})
	  })
	  .then(function(states){
		if(!req.query.stateGeonameId) {
			res.send(states.geonames);
		} else {
			return geonames.children({geonameId: req.query.stateGeonameId});
		}
	  })
	  .then(function(regions){
		if(!req.query.regionGeonameId) {
			console.log("did")
			res.send(regions.geonames)
		} else {
			return geonames.children({geonameId: req.query.regionGeonameId});
		}
	  })
	  .then(function(cities){		  		
		res.send(cities.geonames);
	  })
	  .catch(function(err){
	  })
	});

	router.get("/user/out/get-patients",function(req,res){
		if(req.user){
			var criteria = (req.query.phone) ? {phone: req.query.phone} : {user_id: req.query.patientId};
			model.user.findOne(criteria,
				{user_id:1,firstname:1,lastname:1,title:1,age:1,gender:1,city:1,type:1,profile_pic_url:1,address:1,phone:1})
			.exec(function(err,result){
				if(err) throw err;
				if(result){
					if(result.type == "Patient"){
						res.json(result);
					} else {
						res.json({error:true, message: "Phone number belongs to a existing user who is not a patient."})
					}
				}
				else {
					res.json({});
				}
			})
		} else {
			res.end("unauthorized access");
		}
	})

	router.post("/user/out/create-patients",function(req,res){
		if(req.user){
			model.user.findOne({phone:req.body.patient_phone,type: "Patient"})
			.exec(function(err,result){
				if(err) throw err;
				if(!result){
					if(req.body.patient_firstname){
						var str = req.body.patient_firstname.replace(/\s/g, "");
						var uid = genId(str);
						var date = + new Date();
						// check to see if user_id already existed.
						model.user.findOne({user_id: uid})
						.exec(function(err,user){
							if(err) throw err;
							if(!user){
								var newPatient = {
									firstname: req.body.patient_firstname,
									lastname: req.body.patient_lastname,
									title: req.body.patient_title,
									gender: req.body.patient_gender,
									age: req.body.patient_age,
									user_id: uid,
									city: req.body.patient_city,
									phone: req.body.patient_phone,
									date: new Date(),
									type: "Patient",
									profile_pic_url: "/download/profile_pic/nopic"
								}

								var outPatient = new model.user(newPatient);
								outPatient.save(function(err,info){
									if(err) throw err;
									res.json({success: true,patient: newPatient});
								})

								if(req.body.isOutPatientForChart){
									req.user.doctor_patients_list.unshift({
						              date: date,
						              patient_lastname: req.body.patient_lastname,
						              patient_firstname: req.body.patient_firstname,
						              patient_id: uid,
						              patient_profile_pic_url: "/download/profile_pic/nopic",
						              patient_address: req.body.patient_address || "N/A",
						              patient_city: req.body.patient_city || "Enugu",
						              patient_country: "N/A",
						              patient_gender: req.body.patient_gender,
						              patient_age: req.body.patient_age,
						              patient_phone: req.body.patient_phone
						            })

						            req.user.save(function(err,info){});
								}

							} else {
								// if user_id already existed client should resend the request.
								res.json({retry: true});
							}
						})
					} else {
						res.json({error: true,message: "Oops! Something went wrong while creating patient\"s account"});
					}			
				}	else{
					res.json({error: true,message: "User with this patient\'s phone number already exist."});
				}
			});

		} else if(req.body.isCovid19) {
			model.user.findOne({phone:req.body.patient_phone})
			.exec(function(err,result){
				if(err) throw err;
				if(!result){
					if(req.body.patient_firstname){

						var str = req.body.patient_firstname.replace(/\s/g, "");
						var uid = genId(str);
						// check to see if user_id already existed.
						model.user.findOne({user_id: uid})
						.exec(function(err,user){
							if(err) throw err;
							if(!user){
								var newPatient = {
									firstname: req.body.patient_firstname,
									lastname: req.body.patient_lastname,
									title: req.body.patient_title,
									gender: req.body.patient_gender,
									age: req.body.patient_age,
									user_id: uid,
									phone: req.body.patient_phone,
									date: new Date(),
									type: "Patient",
									profile_pic_url: "/download/profile_pic/nopic"
								}

								var outPatient = new model.user(newPatient);
								outPatient.save(function(err,info){
									if(err) throw err;
									res.json({success: true,patient: newPatient});
								})

							} else {
								// if user_id already existed client should resend the request.
								res.json({retry: true});
							}
						})
					} else {
						res.json({error: true,message: "Oops! Something went wrong while creating patient\"s account"});
					}			
				}	else{
					res.json({error: true,message: "User with this patient\'s phone number already exist."});
				}
			});

		} else {
			res.end("unauthorized access")
		}
	});

 
}

module.exports = signupRoute;