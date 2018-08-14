"use strict";
var config = require('./config');
var salt = require('./salt');
var router = config.router;
var http = require("http");
var path = require("path");
var Wallet = require("./wallet");
var randos = require("./randos");


var basicPaymentRoute = function(model,sms,io,paystack){

	//this route creates the token for use ie creating vouchers
	router.post("/user/token",function(req,res){
		if(req.user && req.user.admin !== true){
			model.pins.findOne({}).exec(function(err,data){
				if(err) throw err;
				if(!data){
					var Pins = new model.pins({
						voucher: []
					});
					Pins.save(function(err,info){
						console.log("pins initialized");
						res.send('Vouchers initilized! Please resend to print vouchers.');
					});

				} else {

					switch(req.body.grade){
						case 100000:
							printPins("11");
						break;
						case 50000:
							printPins("05");
						break;
						case 20000:
							printPins("02");
						break;
						case 10000:
							printPins("01");
						break;
						case 5000:
							printPins("50");
						break;
						case 1000:
							printPins("10");
						break;
						default:
						break;
					}

					data.save(function(err,info){
						if(err) throw err;
						console.log("vouchers printed!");
						console.log(info)
						var detail = req.body.quantity + " new vouchers printed! \ntotal vouchers  printed so far is " + info.length;
						res.send(detail)
					});
				}

				function printPins(grade) {
					var quantity = 0;
					while(req.body.quantity > quantity) {
						var random1 = randos.genRef(2);
						var random2 = randos.genRef(4);
						var random3 = randos.genRef(4);
						var random4 = randos.genRef(4);
						var valObj = {};
						valObj.din = req.body.grade;
						valObj.pin = grade + check(random1,false) + " " + check(random2) + " " + check(random3) + " " + check(random4);
						data.voucher.push(valObj);
						quantity++;
					}
					 console.log(data.voucher)
				}

				//completes number to four digits if is less.
				function check(num,param) {
					var toStr = num.toString();  
				  if(toStr.length < 4 && param === undefined) {
				    for( var i = toStr.length - 1; i < 3; i++){
				      toStr+= 0;
				    }
				  } else {
				  	if(toStr.length < 2 && param === false) {
					    for( var i = toStr.length - 1; i < 1; i++){
					      toStr+= 0;
					    }
					  }
				  }
				  return toStr;
				}
				
			});

		} else {
			res.end("unathorized access!!!");
		}
	});
	
	router.post("/user/admin/view-vouchers",function(req,res){
		if(req.user && req.user.admin === true){
			model.user.findOne({username: req.query.userId,password: req.query.password},function(err,user){
				if(err) throw err;
				if(!user){
					res.end("You have no permission to view this page.");
				} else {
					model.pins.findOne({},function(err,data){
						if(err) throw err;
						res.render("vouchers",{pin: data.voucher})
					});
				}
			});

		} else {
			res.send("Unauthorized access!!")
		}
	});


	//this route takes care of account top up from users using voucher or pin numbers 
	//nite req will carry date, message, pin number
	router.put("/user/account/pin-top-up",function(req,res){
		console.log(req.body)
		if(req.user) {
			model.pins.update({"voucher.pin": req.body.pin}, {$unset: {"voucher.$": 1}},function(err,info){
				if(err) throw err;
				if(info.nModified === 1 && info.n === 1) {
					creditUser()
				} else {
					res.send({error: "Sorry! This pin does not exist or has already been used!"})
				}
			});

			function creditUser() {
				model.user.findOne({user_id:req.user.user_id},{firstname:1,lastname:1,user_id:1,ewallet:1},function(err,data){
						if(err) throw err;
						var amount;
						var grade = req.body.pin.slice(0,2);
						switch(grade){
							case "11":
								amount = 100000;
							break;
							case "05":
								amount = 50000;
							break;
							case "02":
								amount = 20000;
							break;
							case "01":
								amount = 10000;
							break;
							case "50":
								amount = 5000;
							break;
							case "10":
								amount = 1000;
							break;
							default:
							break;
						}
						data.ewallet.available_amount += amount;
						var name = data.firstname + " " + data.lastname;		
						var transacObj = {
							date: req.body.date,
							source: name,
							activity: "Account funding",
							message: req.body.message,
							body: {
								amount: amount,
								beneficiary: "You"
							}
						}

						data.ewallet.transaction.push(transacObj);
						data.save(function(err,info){
							if(err) throw err;
							console.log("saved");
							
						});
						res.send({success:"Account credited successfully!",balance: data.ewallet.available_amount});
					});

			}
		} else {
			res.render("success");
		}

	});

	//this route takes care of admin crediting user after payment deposit is confirmed. 
	router.put("/user/account/top-up",function(req,res){
		if(req.user && req.user.admin === true){
			model.user.findOne({user_id:req.user.user_id},{firstname:1,lastname:1,user_id:1},function(err,data){				
				if(err){
					res.send("Error occured! account not credited!");
				} else {
					var reciever = (req.body.phone !== undefined || req.body.user_id !== undefined) ? checkReceiver() : {user_id: data.user_id};
					var pay = new Wallet(req.body.date,data.firstname,data.lastname,req.body.message);
					pay.credit(model,reciever,req.body.amount);
					
					function checkReceiver(){
						return (req.body.phone !== undefined) ? {phone: req.body.phone} : {user_id: req.body.user_id};
					}
					res.send("Account credited successfully!!");
				}				
			});		
		} else {
			res.end("unathorized access!");
		}
	});

	/** this route takes care for crediting user when paid through payment gate way for paystack ***/
	router.post("/user/paystack/payment-verify",function(req,res){
		console.log(req.body);

		if(req.user){
			paystack.transaction.verify(req.body.reference, function(err, body) {
				console.log(body);
				if(body) {
				  creditUser(body.data.amount)
				} else {
				 res.send({error:true, message: "Oops! Something went wrong while updating you wallet. Please contact admin of this site."})
				}
			});

			function creditUser(amount) {
				model.user.findOne({user_id:req.user.user_id},{firstname:1,lastname:1,user_id:1},function(err,data){				
					if(err){
						res.send("Error occured! account not credited!");
					} else {
						var date = + new Date();
						var reciever = {user_id: data.user_id};
						var pay = new Wallet(date,data.firstname,data.lastname,"Account top-up (Paystack)");
						pay.credit(model,reciever,amount,io,function(currBalnce){
							res.send({message:"You wallet has been credited successfully!",balance:currBalnce});
						});				
						
						
					}				
				});	
			}	
		} else {
			res.end("unathorized access!");
		}
	});

	router.get("/user/verify",function(req,res){
		if(req.user && req.query.phone || req.query.userId){
			var obj;
			if(req.query.phone){
				obj = {phone: req.query.phone}
			} else if(req.query.userId){
				obj = {user_id: req.query.userId}
			}

			model.user.findOne(obj,{user_id:1,firstname:1,lastname:1,name:1,_id:0},function(err,user){
				if(err) throw err;
				if(!user){
					var person = req.query.phone || req.query.userId;
					var msg = "User with this " + person + " does not exist";
					res.json({error: msg})
				} else {
					res.json(user);
				}
				
			})
		} else {
			res.send({error: "Incomplete transaction!"});
		}
	});

	router.post("/user/payment/verification",function(req,res){

		if(req.user && req.body.userId !== req.user.user_id){
			//generate otp for confirmation. the debitor's id is sent from the request including the amount.
			//request is obj of the debitor's id, amount to debit ie the person paying for the service.
			//note for payment req.body must have userId of who is to be debited is required while for transfer req.body do not have userId
			//because is assumed the user at that moment is making the request which means his req.user.user_id will be used.
			var personId = req.body.userId || req.user.user_id;
			model.user.findOne({user_id: personId},{phone:1,ewallet:1,user_id:1},function(err,user){
				if(err) throw err;
				if(!user){
					res.send({message: "User does not exist!"});
				} else {
					var amount = (typeof req.body.amount === "string") ? parseInt(req.body.amount) : req.body.amount;
					if(user.ewallet.available_amount >= amount){
						//var random1 = Math.floor(Math.random() * 999);
						//var random2 = Math.floor(Math.random() * 999);
						var password = genId() + " " + genId() //check(random1) + " " + check(random2);

						if(req.body.old_time){ //checks if otp was resend therefore removes the old otp which will not be in use anymore.
							model.otpSchema.findOne({time:req.body.old_time},function(err,data){
								if(data) {
									data.remove(function(){});
									createNew();
								}  else {
									res.send({message: "This OTP session has been used and expired! Transaction canceled."})
								}
							})
							/*model.otpSchema.remove({time:req.body.old_time},function(err){
								if(err) throw err;
							});*/
						} else {
							createNew();
						}						
						
						function createNew() {
				      var otp = new model.otpSchema({
				        user_id: user.user_id,//this id refers to the debitors id. the person whose account will be debited.
				        time: req.body.time,
				        otp: password,
				        amount: req.body.amount,
				        senderId: req.user.user_id 
				      });			      

				      //sets the expiration time for each otp sent.
				      var date = new Date();
				      otp.expirationDate = new Date(date.getTime() + 300000);
				      otp.expirationDate.expires = 300;			     

				      otp.save(function(err,info){
				        if(err) throw err;
				        console.log("otp saved");
				      }); 

				      console.log(otp)
				      var callBack = function(err,responseData){
				      	console.log(responseData);
								if(err) {
									console.log(err);
									res.send({message:"Oops! Error occured while sending OTP.Please resend",success:true,time_stamp:req.body.time}) 
								} else {								
									res.send({message:"One time pin sent to this patient vis SMS. The pin is needed for payment confirmation",success:true,time_stamp:req.body.time}) 
								}
								
							}

							var msgBody = "Your payment OTP for applinic.com is " + password + " \nThe amount billed is " + req.body.amount;
							var phoneNunber = user.phone;
							sms.messages.create(
	              {
	                to: phoneNunber,
	                from: '+16467985692',
	                body: msgBody,
	              },
	              callBack
	            )

						}

						//res.send({message:"One time pin has been sent this patient vis SMS. The pin is needed for payment confirmation",success:true,time_stamp:req.body.time}) 

					} else {
						res.send({message: 'Transaction failed! Reason: The person to debit has insufficient fund for the service!',success:false});
					}   

					/*function check(num) {
						var toStr = num.toString();  
					  if(toStr.length < 3) {
					    for( var i = toStr.length - 1; i < 2; i++){
					      toStr+= 0;
					    }
					  } 
					  return toStr; 
				  }*/

				  function genId() {
						var text = "";
						var possible = "000111222333444555666777888999";

					    for( var i=0; i < 3; i++ )
					        text += possible.charAt(Math.floor(Math.random() * possible.length));
					    return text;
					}
				 }

				})

		} else {
			res.send({message: "Unathorized transaction"});
		}

	});

	//this route debits and credits both parties.
	//@params object. properties otp,date,message,userId
	//this route will be used by diagnostic centers, special centers, hospitals, pharmcy for payment confirmation.
	router.post("/user/payment/confirmation",function(req,res){
		if(req.user && req.body && req.body.userId !== req.user.user_id && req.body.otp){
			model.otpSchema.findOne({otp:req.body.otp}).exec(function(err,data){
				if(err) throw err;
				
				if(!data){
					res.send({message:"Confirmation failed! Transaction canceled."})
					
				} else {						
					//check is is the right otp for a user
					if(data.user_id === req.body.userId && data.senderId === req.user.user_id) {
						
						//do the actual transaction. success!
						model.user.findOne({user_id: req.body.userId},{ewallet:1,firstname:1,lastname:1,name:1}).exec(function(err,debitor){
							var name = req.user.firstname || req.user.name;
							var pay = new Wallet(req.body.date,name,req.user.lastname,req.body.message);
							pay.payment(model,data.amount,debitor,req.user.user_id,io);
							res.send({message: "Transaction successful! Your account is credited."});
						});						
						data.remove(function(){});
					} else {
						res.send({message: "This OTP is not for this user"});
					}
				}
			})
		} else {
			res.send({message: "Unathorized transaction"});
		}
	});

	//@params object. properties otp,date,message,userId or phone
	router.post("/user/tranfer/confirmation",function(req,res){
		if(req.user && req.body && req.body.userId !== req.user.user_id && req.body.otp && req.body.phone !== req.user.phone){
			console.log(req.body)
			model.otpSchema.findOne({otp:req.body.otp}).exec(function(err,data){
				if(err) throw err;
				if(!data){
					res.send({message:"Confirmation failed! Transaction canceled."});
				} else {					
					//check is the right otp for a user
					if(data.user_id === req.user.user_id) {
						data.remove(function(){});
						//do the actual transaction. success!
						var receiver;	
						if(req.body.phone){
							receiver = {phone: req.body.phone}
						} else if(req.body.userId){
							receiver = {user_id: req.body.userId}
						}

						model.user.findOne(receiver,{firstname:1,lastname:1,name:1,user_id:1},function(err,creditor){
							if(err) throw err;
							if(creditor) {
								transact(creditor,function(){
									var name = req.user.firstname || req.user.name;
									io.sockets.to(creditor.user_id).emit("fund received",{
										message: data.amount + " was transfered to you by " + name,
										status: true
									});
								});

							} else {
								res.send({message: "Transaction canceled! Reason: User does not exist."});
							}
						});

						function transact(person,cb){
							model.user.findOne({user_id: req.user.user_id},{ewallet:1,firstname:1,lastname:1,name:1}).exec(function(err,debitor){
								if (err) {
			            return res.status(400).send({
			                message: errorHandler.getErrorMessage(err)
			            });
				        } else {
				        	if(debitor.ewallet.available_amount >= data.amount) {
										var name = req.user.firstname || req.user.name;
										var pay = new Wallet(req.body.date,name,debitor.lastname,req.body.message);
										//note firstname or lastname of patient may change.							
										pay.transfer(model,data.amount,debitor,receiver,person,io);
										res.json({message: "Transaction successful! Your account is debited.",balance:debitor.ewallet.available_amount});
										cb();
									} else {
										res.json({message: "Transaction canceled! Reason: You have insufficient fund for this transaction."})
									}
								}
							});
						}	

					} else {
						res.send({message: "This OTP is not for this user"});
						data.save(function(err,info){
							if(err) throw err;
						});
					}
				}
			})
		} else {
			res.send({message: "Error: Incomplete transaction"});
		}
	});

	/*this route handles the patient accepting consultation fee. the patient wallet will be debited and doctor's wallet credited slightly*/
	
	router.post("/user/patient/consultation-acceptance/confirmation",function(req,res){

		if(req.user && req.body && req.body.userId !== req.user.user_id && req.body.otp && req.user.type === "Patient"){
			model.otpSchema.findOne({otp:req.body.otp}).exec(function(err,data){
				if(err) throw err;
				
				if(!data){
					res.send({message:"Confirmation failed! Transaction canceled.",success: true})
				} else {			
				console.log(data)		
					//check is is the right otp for a user
					if(data.user_id === req.user.user_id) {
						//do the actual transaction. success!
						model.user.findOne({user_id: req.user.user_id},{ewallet:1,firstname:1,lastname:1,name:1}).exec(function(err,debitor){
							var name = req.user.firstname || req.user.name;
							var msg = req.body.message || "Consultation fee";
							var pay = new Wallet(req.body.date,name,req.user.lastname,req.body.message);
							//note firstname or lastname of patient may change.
							pay.consultation(model,data.amount,debitor,req.body.userId,io);
							createConnection(debitor);
						});	
						data.remove(function(){});			
					} else {
						res.send({message: "This OTP is not for this user"});
					}
				}
			})
		
			function createConnection(debitor){
				var DocObj = {					
					doctor_id: req.body.sendObj.user_id,
					date_of_acceptance: req.body.sendObj.date_of_acceptance,
					doctor_firstname: req.body.sendObj.firstname || req.body.sendObj.doctor_firstname,
					doctor_lastname:  req.body.sendObj.lastname || req.body.sendObj.doctor_lastname,
					doctor_name: req.body.sendObj.name || req.body.sendObj.doctor_name,
					doctor_profile_pic_url: req.body.sendObj.profile_pic_url || req.body.sendObj.doctor_profile_pic_url,
					service_access: true,
					doctor_specialty: req.body.sendObj.specialty || req.body.sendObj.doctor_specialty,
				}

          model.user.findOne(
            {
              user_id: req.user.user_id
            },
            {
              accepted_doctors : 1,
              patient_mail: 1,
              firstname:1,
              lastname:1,
              profile_pic_url:1                
            }
          )
          .exec(
             function(err, result){                    
                for (var i = 0; i < result.patient_mail.length; i++) {
                	if(!req.body.sendObj.compaintId){
                    if (result.patient_mail[i].user_id === DocObj.doctor_id) {
                      result.accepted_doctors.push(DocObj);
                      deleteFromPatientNotification(i);
                      updateDoctorPatientList();
                      break;
                    }	                        
                  } else {	                      	
                  	if (result.patient_mail[i].complaint_id === req.body.sendObj.compaintId) {
                      result.accepted_doctors.push(DocObj);
                      deleteFromPatientNotification(i);
                      updateDoctorPatientList();
                      break;
                    }
                  }
                }

                function deleteFromPatientNotification(index) {
                	console.log(index)
                  result.patient_mail.splice(index,1);                                  
                }

                var msgInfo;

                  function updateDoctorPatientList() {
                    model.user.findOne(
                      {
                        user_id: req.body.sendObj.user_id
                      },
                      {
                        doctor_patients_list:1,
                        phone: 1,
                        firstname:1,
                        lastname:1,
                        phone:1,
                        user_id:1,
                        presence:1
                      }
                    )
                    .exec(function(err,data){
                    	if(data) {
                        data.doctor_patients_list.unshift({
                          patient_firstname: result.firstname,
                          patient_lastname: result.lastname,
                          patient_id: req.user.user_id,
                          patient_profile_pic_url: result.profile_pic_url,
                          initial_complaint: {
                          	complaint: req.body.sendObj.original_complaint,
                          	complaint_date: req.body.sendObj.original_complaint_date,
                          	date_received: req.body.date
                          }
                        });

                        if(data.presence === true){
				                  io.sockets.to(data.user_id).emit("acceptance notification",{status:true});
				                } else {
				                  var msgBody = "Success! " +  result.firstname + " " + result.lastname + " is now your patient. Visit http://applinic.com/login"
				                  var phoneNunber =  data.phone;
			                    sms.messages.create(
							              {
							                to: phoneNunber,
							                from: '+16467985692',
							                body: msgBody,
							              }
							            ) 
				                }

                        msgInfo = "Transaction successful! Your account is debited. " + data.firstname + " " + data.lastname + " is now your doctor." 
                        data.save(function(err,info){
                          if(err) throw err;	                           	                          
                        });
                    	}

                      result.save(function(err,info){
                        if(err) throw err;                       
                    		removeFromWaitingRoom();
                    	});

                    })

                  }
                  //remove from patient waiting list
                  function removeFromWaitingRoom(){
                  	model.help.remove({complaint_id:req.body.sendObj.compaintId},function(err,info){
                  	});
                  	res.send({message: msgInfo,balance:debitor.ewallet.available_amount});
                    console.log("note deleted");                        		                   
                  }

              }
        	)
					           
    	} 


		} else {
			if(!req.user){
				res.send({message: "Oops!Seems you session has expired because you have been idle for a while.Please refresh and log in"})
			} else {
				res.end("Error 403: You are not unathorized");
			}
		}
	});

	//this route takes care of patient billing ie making payments for services and drugs purchased.
	//the cost will be split into percentage.
	// the percentage will be contoled by a percentage setter controlled by the admin.
	router.post("/user/payment/patient-billing",function(req,res){
		if(req.user){
			console.log(req.body);
			model.otpSchema.findOne({otp:req.body.otp},function(err,data){
				if(err) throw err;
				if(!data){
					res.send({message:"Confirmation failed! Transaction canceled."});					
				} else {			
						if(data.user_id === req.body.patientId && data.senderId === req.user.user_id) {					
							model.user.findOne({user_id:req.user.user_id},{ewallet:1,user_id:1,city_grade:1,type:1,email:1,referral:1,service_details:1,name:1}).exec(function(err,center){				
								if(err) throw err;

								if(!center){
									res.send({message: 'Oops! Something went wrong.Center does not exist or have been deleted.==> finance.js: 666'});
									return;
								}

								var elementPos = center.referral.map(function(x){return x.ref_id}).indexOf(req.body.refId);
								var found = center.referral[elementPos];

								if(found) {
									found.pharmacy.is_paid = true;
									found.pharmacy.detail.amount = req.body.total;
									found.pharmacy.detail.date = req.body.date;								

									center.service_details.unshift({
										type: "pharmacy",
										prescriptionDate_date: found.pharmacy.date,
										provisional_diagnosis: found.pharmacy.provisional_diagnosis,
										patient_names: found.pharmacy.patient_firstname + " " + found.pharmacy.patient_lastname,
										patient_phone: found.pharmacy.patient_phone,
										patient_age: found.pharmacy.patient_age,
										patient_gender: found.pharmacy.patient_gender,
										patient_profile_pic_url: found.pharmacy.patient_profile_pic_url,
										amount: req.body.total,
										date: req.body.date,
										prescriptionBody: req.body.prescriptionBody,
										doctor_names: (found.pharmacy.doctor_firstname) ? found.pharmacy.title + " " + found.pharmacy.doctor_firstname + " " + found.pharmacy.doctor_lastname : 'This prescriptions was not prescribed by a doctor',
										ref_id: found.ref_id,
										doctor_work_place: found.pharmacy.doctor_work_place,
										doctor_specialty: found.pharmacy.doctor_specialty,
										doctor_city: found.pharmacy.doctor_city,
										doctor_country: found.pharmacy.doctor_country,
										doctor_profile_url: found.pharmacy.doctor_profile_url,
										doctor_address: found.pharmacy.doctor_address
									});
								}
							
								center.save(function(err,info){
									if(err) throw err;
									console.log(err);
									console.log("billing is paid and saved!");
								});

								var pay = new Wallet(req.body.date,req.body.patient_firstname,req.body.patient_lastname,"billing");
								pay.billing(model,req.body,center,sms,io);

								
								model.otpSchema.remove({otp:req.body.otp},function(err,info){});

								res.send({message: "Transaction successful! Your account is credited.",balance:center.ewallet.available_amount,status:true});	
								if(req.body.prescriptionBody) {
									updatePatient();
								}				
							});

							function updatePatient() {
								model.user.findOne({user_id: req.body.patientId},{medications:1}).exec(function(err,patient){
									if(err) throw err;
									if(patient){
										var elementPos = patient.medications.map(function(x){return x.prescriptionId}).indexOf(req.body.prescriptionId);
										var found = patient.medications[elementPos];
										if(found){
											found.prescription_body = req.body.prescriptionBody;
										}
									}
									patient.save(function(err,info){
										if(err) throw err;
										console.log("Patient prescription body updated.")
									})
								})
							}
 							
						} else {
							res.send({message: 'Transaction cancelled! Reason: This OTP is not for the right user.'});						
						}					
					
				}				
			})
		} else {
			res.send("Unauthorized access!!!");
		}
	});


  //this route handles test result sent by a laboratory to update existing doctor/patient session that initiated such test request.
  router.put("/user/laboratory/test-result/session-update",function(req,res){
    //note that sms will be sent to patient and doctor when a lab test result is available.
    if(req.user) {

    updateSession();   

      function updateSession() {       
        model.user.findOne({"doctor_patient_session.session_id": req.body.laboratory.session_id},{doctor_patient_session:1,title:1,firstname:1,lastname:1}).exec(function(err,data){
          if(err) throw err;
          var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id }).indexOf(req.body.laboratory.session_id);
  
          if(elementPos !== -1) {
	          var	objectFound = data.doctor_patient_session[elementPos];       
	 
	          var pos = objectFound.diagnosis.laboratory_test_results.map(function(x) { return x.test_id;}).indexOf(req.body.laboratory.test_id);
	          var theObj = objectFound.diagnosis.laboratory_test_results[pos];         
	          theObj.receive_date = req.body.laboratory.date;
	          theObj.test_to_run = req.body.laboratory.test_to_run;
	          theObj.report = req.body.laboratory.report;
	          theObj.conclusion = req.body.laboratory.conclusion;
	          theObj.sent_date = req.body.date;
	          theObj.test_ran_by = req.user.name;
	          theObj.center_address = req.user.address;
	          theObj.center_city = req.user.city;
	          theObj.center_country = req.user.country;
	          theObj.center_phone = req.user.phone;
	          theObj.center_profile_pic_url =  req.user.profile_pic_url;
       	 }
           
          
          //the doctors session for a patient is updated, and patient dashboard is called for update.
          //objectFound.diagnosis.laboratory_test_results.unshift(testResult);          
          data.save(function(err,info){
            if(err) {
              res.send({status: "error"});
            } else {  
            	updatePatient(); 
              //updateTheCenter();  
              updateCenter(data)  
                       
            }
          });        

        });
      }

      function updatePatient() {
        //here patient test result is updated.
        model.user.findOne({user_id: req.body.laboratory.patient_id},{medical_records: 1,patient_notification:1,user_id:1,presence:1,phone:1})
        .exec(function(err,data){

          if(err) throw err;

          var elementPos = data.medical_records.laboratory_test.map(function(x) {return x.ref_id }).indexOf(req.body.ref_id);
          if(elementPos !== -1) {
	          var objectFound = data.medical_records.laboratory_test[elementPos];           
	          objectFound.report = req.body.laboratory.report || objectFound.report;
	          objectFound.conclusion = req.body.laboratory.conclusion || objectFound.conclusion;
	          objectFound.test_to_run = req.body.laboratory.test_to_run || objectFound.test_to_run;
	          objectFound.sent_date = req.body.date || objectFound.sent_date;
	          objectFound.test_ran_by = req.user.name;
	          objectFound.receive_date = req.body.laboratory.date;
	          objectFound.payment_acknowledgement = true;
        	


	          //var random = Math.floor(Math.random() * 999999);

	          data.patient_notification.unshift({
	            type:"laboratory",
	            date: req.body.laboratory.date,
	            note_id: req.body.laboratory.test_id,
	            ref_id: req.body.ref_id,
	            session_id: req.body.laboratory.session_id,
	            message: "Laboratory test result received."
	          })

	         
	          if(data.presence === true){
	            io.sockets.to(data.user_id).emit("notification",{status:true})
	          } else {
	            var msgBody = "New laboratory test result received! Visit http://applinic.com/login";
	            var phoneNunber =  data.phone;
	             sms.messages.create(
	              {
	                to: phoneNunber,
	                from: '+16467985692',
	                body: msgBody
	              }
	            ) 
	          }

	          data.save(function(err,info){
	            if(err) { 
	            	console.log(err)
	            	res.send({status: "error"}); 
	            } else {
	            	res.send({status: "success"}); 
	            }         
	          });
        	} else {
        		res.end("error: 404")
        	}
        });
      }

       function updateCenter(receiver) {
      	model.user.findOne({user_id: req.user.user_id},{service_details:1}).exec(function(err,center){
      		if(err) {
        		throw err;
	        	res.end("server error");
	        }
      		if(center) {
      		
      			req.body.service_date = + new Date();
      			req.body.receiver = receiver.title + " " + receiver.firstname + " " + receiver.lastname;
      			req.body.receiver_phone = receiver.phone;
      			center.service_details.unshift(req.body);
      			center.save(function(err,info){
      				if(err) throw err;
      				console.log("service details saved!");
      			})
      		} else {
      			res.end("something went wrong!");
      		}
      	})
      }


      

      /*function updateTheCenter() {
        model.user.findOne({user_id: req.user.user_id},{referral:1,ewallet:1,user_id:1,city_grade:1,type:1,email:1}).exec(function(err,center){
          if(err) throw err;            
          var elementPos = center.referral.map(function(x) {          	
          	return x.ref_id
          }).indexOf(req.body.ref_id);
          
          var objectFound = center.referral[elementPos];
          objectFound.laboratory.attended = true; // this makes a lab that has been sent to a doctor and no longer on the pending list of front end

          var pay = new Wallet(req.body.date,req.body.laboratory.patient_firstname,req.body.laboratory.patient_lastname,"billing");
          pay.billing(model,req.body.payObj,center,sms,io);
          model.otpSchema.remove({otp:req.body.otp},function(err,info){});              
          res.send({message: "Transaction successful! Your account is credited.",balance:center.ewallet.available_amount,status: "success"});
          center.save(function(err,info){})
        });
      }*/
    } else {
      res.end("Unauthorized access");
    }
  });


	//this route is like above only it only updates the patient lab test on the patient dashboard. this is used for patient on em profile and 
  //patient who requested test without doctors approval.
  router.put("/user/laboratory/test-result/patient-test-update",function(req,res){
    if(req.user) {
     
     updatePatient();

      function updatePatient() {
        model.user.findOne({user_id: req.body.laboratory.patient_id},{medical_records:1,patient_notification:1,user_id:1,presence:1,phone:1,firstname:1,lastname:1,title:1})
        .exec(function(err,data){
          if(err) throw err;
         
          var elementPos = data.medical_records.laboratory_test.map(function(x) {return x.ref_id; }).indexOf(req.body.ref_id);
          var objectFound = data.medical_records.laboratory_test[elementPos];         
          objectFound.report = req.body.laboratory.report || objectFound.report;
          objectFound.conclusion = req.body.laboratory.conclusion || objectFound.conclusion;
          objectFound.test_to_run = req.body.laboratory.test_ran || objectFound.test_to_run;
          objectFound.sent_date = req.body.date || objectFound.sent_date;
          objectFound.receive_date = req.body.laboratory.date;
          objectFound.payment_acknowledgement = true;
          objectFound.history = req.body.history;


          var random = randos.genRef(8);
          data.patient_notification.unshift({
            type:"laboratory",
            date: req.body.laboratory.date,
            note_id: random,
            ref_id: req.body.ref_id,
            session_id:req.body.session_id,
            message: "Laboratory test result received."
          });

          if(data.presence === true){
            io.sockets.to(data.user_id).emit("notification",{status:true});
          } else {
            var msgBody = "New laboratory test result received! Visit http://applinic.com/login"
            var phoneNunber =  data.phone;
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            ) 
          }

          data.save(function(err,info){
            if(err) res.send({status: "error"}); 
            updateCenter(data);        
          });
        
        });
      }

      function updateCenter(receiver) {
      	model.user.findOne({user_id: req.user.user_id},{service_details:1}).exec(function(err,center){
      		if(err) {
        		throw err;
	        	res.end("server error");
	        }
      		if(center) {
      			req.body.service_date = + new Date();
      			req.body.receiver = receiver.title + " " + receiver.firstname + " " + receiver.lastname;
      			req.body.receiver_phone = receiver.phone;
      			center.service_details.unshift(req.body);
      			center.save(function(err,info){
      				if(err) throw err;
      				console.log("service details saved!");
      				res.send({status: "success"});
      			})
      		} else {
      			res.end("something went wrong!");
      		}
      	})
      }


      /*function transact() {
        model.user.findOne({user_id:req.user.user_id},{ewallet:1,user_id:1,city_grade:1,type:1,email:1}).exec(function(err,center){
        console.log(req.body)       
          if(err) throw err;
          var pay = new Wallet(req.body.date,req.body.laboratory.patient_firstname,req.body.laboratory.patient_lastname,"billing");
          pay.billing(model,req.body.payObj,center,sms,io);
          model.otpSchema.remove({otp:req.body.otp},function(err,info){});              
          res.send({message: "Transaction successful! Your account is credited.",balance:center.ewallet.available_amount,status: "success"});
          center.save(function(err,info){})             
        });
      }*/

    } else {
      res.end("Unauthorized access!");
    }

  });

  router.get("/user/center/billing-verification",function(req,res){
  	if(req.user){
  		var center = req.user; //uuuu
  		var refId = (typeof req.query.refId === "string") ? parseInt(req.query.refId) : req.query.refId;	
			var elementPos = center.referral.map(function(x){return x.ref_id.toString()}).indexOf(refId.toString());
      var objectFound = center.referral[elementPos];
      if(objectFound) {
      	if(req.user.type === "Radiology") {
      		res.send({payment: objectFound.radiology.is_paid,detail:objectFound.radiology.detail});
      	} else if(req.user.type === "Laboratory"){
      		res.send({payment: objectFound.laboratory.is_paid,detail:objectFound.laboratory.detail});
      	} else if(req.user.type === "Pharmacy"){ 
      		res.send({payment: objectFound.pharmacy.is_paid,detail:objectFound.pharmacy.detail});
      	}
      } else {
      	res.send({payment: false});
      }
  	} else {
  		res.end("Unauthorized access");
  	}

  });

  router.put("/user/center/billing-verification",function(req,res){
  	if(req.user){
  		var type = (req.user.type === "Radiology") ? req.body.radiology : req.body.laboratory;
  		if(type) {
        model.otpSchema.findOne({otp:type.v_pin},function(err,data){
          if(err) throw err;

          if(!data) {
            res.send({message: "Error! Wrong OTP or OTP does not exist!"});
          } else {                          
            if(data.user_id === type.patient_id && data.senderId === req.user.user_id) {         
              //updateSession();
              model.user.findOne({user_id: req.user.user_id},{referral:1,ewallet:1,user_id:1,city_grade:1,type:1,email:1}).exec(function(err,center){
              	if(err) {
              		res.send({message: "Error occured"})
              	} else {
              		var elementPos = center.referral.map(function(x){return x.ref_id}).indexOf(req.body.ref_id)
              		var objectFound = center.referral[elementPos];
				          //objectFound.radiology.attended = true; // this makes a lab that has been sent to a doctor and no longer on the pending list of front end
				          
				          if(objectFound) {
					          if(req.user.type === "Radiology") {
					          	objectFound.radiology.is_paid = true;
					          	objectFound.radiology.detail.amount = type.strAmount;
					          	objectFound.radiology.detail.date = + new Date();

					          } else if(req.user.type === "Laboratory") {
					          	objectFound.laboratory.is_paid = true;
					          	objectFound.laboratory.detail.amount = type.strAmount;
					          	objectFound.laboratory.detail.date = + new Date();
					          }
					         
					          var pay = new Wallet(req.body.date,type.patient_firstname,type.patient_lastname,"billing");
					          pay.billing(model,req.body.payObj,center,sms,io);
					          model.otpSchema.remove({otp:type.v_pin},function(err,info){});              
	              		center.save(function(err,info){
	              			if(err) {
	              				res.send({message: "Transaction Incomplete",status: false})
	              			} else {
	              				var detail = (req.user.type === 'Radiology') ? objectFound.radiology.detail : objectFound.laboratory.detail;
	              				res.send({message: "Transaction successful! Your account is credited.",balance:center.ewallet.available_amount,status: "success",payment:true,detail:detail});
	              			}

	              		})
	              	} else {
	              		res.end("unexpected error occured!");
	              	}
              	}
              })
            }
          }

        });
      } else {
        res.send({message: "Payment verification failed"});
      }
  	} else {
  		res.send({message: "Unauthorized access"})
  	}
  })



	//updating radiology result in doctor's treatment page with patient.
  router.put("/user/radiology/test-result/session-update",function(req,res){      
    if(req.user) {  	
      
      updateSession();

      function updateSession() { 
        model.user.findOne({"doctor_patient_session.session_id": req.body.radiology.session_id},{doctor_patient_session:1,firstname:1,lastname:1,title:1,phone:1})
       .exec(function(err,data){
          if(err) throw err;
          if(data) {
	          var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(req.body.radiology.session_id);
	          var objectFound = data.doctor_patient_session[elementPos];     

	          //the doctors session for a patient is updated, and patient dashboard is called for update.
	          var pos = objectFound.diagnosis.radiology_test_results.map(function(x) { return x.test_id;}).indexOf(req.body.radiology.test_id)
	          var theObj = objectFound.diagnosis.radiology_test_results[pos];         
	          theObj.receive_date = req.body.radiology.date;
	          theObj.test_to_run = req.body.radiology.test_to_run;
	          theObj.report = req.body.radiology.report;
	          theObj.conclusion = req.body.radiology.conclusion;
	          theObj.sent_date = req.body.date;
	          theObj.test_ran_by = req.user.name;
	          theObj.center_address = req.user.address;
	          theObj.center_city = req.user.city;
	          theObj.center_country = req.user.country;
	          theObj.center_phone = req.user.phone;
	          theObj.center_profile_pic_url =  req.user.profile_pic_url;
	          theObj.files = req.body.radiology.filesUrl;


	          data.save(function(err,info){
	            if(err) res.send({status: "error"});         
	            updatePatient();
	            //updateTheCenter();
	            updateCenter(data)
	          });

      	   } else {
      	   	 res.send({status:"error"})
      	   }
        });
	  }

      function updatePatient() {         
        //here patient test result is updated.
        model.user.findOne({user_id: req.body.radiology.patient_id},{medical_records: 1,patient_notification:1,user_id:1,presence:1,phone:1})
        .exec(function(err,data){
          if(err) throw err;
          var elementPos = data.medical_records.radiology_test.map(function(x) {return x.session_id; }).indexOf(req.body.radiology.session_id);
          var objectFound = data.medical_records.radiology_test[elementPos]; 

          if(objectFound) {         
	          objectFound.report = req.body.radiology.report || objectFound.report;
	          objectFound.conclusion = req.body.radiology.conclusion || objectFound.conclusion;
	          objectFound.test_to_run = req.body.radiology.test_to_run || objectFound.test_to_run;
	          objectFound.sent_date = req.body.date || objectFound.sent_date;
	          objectFound.receive_date = req.body.radiology.date;
	          objectFound.payment_acknowledgement = true;
	          objectFound.files = req.body.radiology.filesUrl;

	          //var random = Math.floor(Math.random() * 999999);
	          data.patient_notification.unshift({
	            type:"radiology",
	            date: req.body.radiology.date,
	            note_id: req.body.radiology.test_id,
	            ref_id: req.body.ref_id,
	            session_id:req.body.radiology.session_id,
	            message: "Radiology test result received."
	          });

	          if(data.presence === true){
	            io.sockets.to(data.user_id).emit("notification",{status:true});
	          } else {
	            var msgBody = "New radiology test result received! Visit http://applinic.com/login"
	            var phoneNunber =  data.phone;
	            sms.messages.create(
	              {
	                to: phoneNunber,
	                from: '+16467985692',
	                body: msgBody,
	              }
	            ) 
	          }

	          data.save(function(err,info){
	            if(err) res.send({status: "error"});           
	            res.send({status: "success"});
	          });

        	} else {
        		res.end("error: 404")
        	}
        });
      }


     function updateCenter(receiver) {
      	model.user.findOne({user_id: req.user.user_id},{service_details:1}).exec(function(err,center){
      		if(err) {
        		throw err;
	        	res.end("server error");
	        }
      		if(center) {
      			req.body.service_date = + new Date();
      			req.body.receiver = receiver.title + " " + receiver.firstname + " " + receiver.lastname;
      			req.body.receiver_phone = receiver.phone;
      			center.service_details.unshift(req.body);
      			center.save(function(err,info){
      				if(err) throw err;
      				console.log("service details saved!");
      			})
      		} else {
      			res.end("something went wrong!");
      		}
      	})
      }

      /*function updateTheCenter() {
        model.user.findOne({user_id: req.user.user_id},{referral:1,ewallet:1,user_id:1,city_grade:1,type:1,email:1}).exec(function(err,center){
          if(err) throw err;            
          var elementPos = center.referral.map(function(x) {          	
          	return x.ref_id
          }).indexOf(req.body.ref_id);
          
          var objectFound = center.referral[elementPos];
          objectFound.radiology.attended = true; // this makes a lab that has been sent to a doctor and no longer on the pending list of front end

          var pay = new Wallet(req.body.date,req.body.radiology.patient_firstname,req.body.radiology.patient_lastname,"billing");
          pay.billing(model,req.body.payObj,center,sms,io);
          model.otpSchema.remove({otp:req.body.otp},function(err,info){});              
          res.send({message: "Transaction successful! Your account is credited.",balance:center.ewallet.available_amount,status: "success"});
          center.save(function(err,info){})
        });
      }*/

    } else {
      res.end("Unauthorized access");
    }

  });
  
    //this route is like above only it only updates the patient scan test on the patient dashboard. this is used for patient on em profile and 
    //patient who requested test without doctors approval.
    router.put("/user/radiology/test-result/patient-scan-update",function(req,res){
    	console.log(req.body);
	    if(req.user) {

	      updatePatient();

	      function updatePatient() {
		      model.user.findOne({user_id: req.body.radiology.patient_id},
		      	{medical_records: 1,patient_notification:1,user_id:1,presence:1,phone:1,firstname:1,lastname:1,title:1})
		   		.exec(function(err,data){
		        if(err) {
		        	throw err;
		        	res.end("server error");
		        }

		        var elementPos = data.medical_records.radiology_test.map(function(x) {return x.ref_id}).indexOf(req.body.ref_id);
		        var objectFound = data.medical_records.radiology_test[elementPos];
		        if(objectFound) {    
			        objectFound.report = req.body.radiology.report || objectFound.report;
			        objectFound.conclusion = req.body.radiology.conclusion || objectFound.conclusion;
			        objectFound.test_to_run = req.body.radiology.test_ran || objectFound.test_to_run;
			        objectFound.sent_date = req.body.date || objectFound.sent_date;
			        objectFound.receive_date = req.body.radiology.date;
			        objectFound.payment_acknowledgement = true;
			        objectFound.files = req.body.radiology.filesUrl;
		    		}

		        var random = randos.genRef(8);
		        data.patient_notification.unshift({
		          type:"radiology",
		          date: req.body.radiology.date,
		          note_id: random,
		          ref_id: req.body.ref_id,
		          session_id:req.body.radiology.session_id,
		          message: "Radiology test result received."
		        });

		        if(data.presence === true){
		          io.sockets.to(data.user_id).emit("notification",{status:true})
		        } else {
		          var msgBody = "Your radiology test result received! Visit http://applinic.com/login";
		          var phoneNunber =  data.phone;
		          sms.messages.create(
	              {
	                to: phoneNunber,
	                from: '+16467985692',
	                body: msgBody,
	              }
            	  ) 
		        }

		        data.save(function(err,info){
		          if(err) res.send({status: "error"});           
		          updateCenter(data)
		        });

		      });

		      function updateCenter(receiver) {
		      	model.user.findOne({user_id: req.user.user_id},{service_details:1}).exec(function(err,center){
		      		if(err) {
		        		throw err;
			        	res.end("server error");
			        }
		      		if(center) {
		      			req.body.service_date = + new Date();
		      			req.body.receiver = receiver.title + " " + receiver.firstname + " " + receiver.lastname;
		      			req.body.receiver_phone = receiver.phone;
		      			center.service_details.unshift(req.body);
		      			center.save(function(err,info){
		      				if(err) throw err;
		      				res.send({status: "success"});
		      				console.log("service details saved!");
		      			});
		      		} else {
		      			res.end("something went wrong!");
		      		}
		      	})
		      }
		   }

			} else {
				res.redirect("/login");
			}

    });


	router.get("/user/:userId/transactions",function(req,res){
		if(req.user){
			model.user.findOne({user_id:req.params.userId},{ewallet:1},function(err,data){
				if(err) throw err;				
				var foundList = data.ewallet.transaction.map(function(x){
					if(x.date >= parseInt(req.query.from) && x.date <= parseInt(req.query.to)) {						
						return x;
					}						
				});				
				var newList = [];
				for(var i = 0; i < foundList.length; i++){
					if(foundList[i] !== undefined){
						newList.push(foundList[i]);
					}
				}
				res.send(newList);
			});
		} else {
			res.send({errMsg:"Unauthorized access!"});
		}
	});

	//user cashing out some money from wallet.
	router.put("/user/cashout",function(req,res){
		if(req.user){
			console.log(req.body)
			var userId = (req.body.userId === undefined) ? req.user.user_id : req.body.userId;
			model.user.findOne({user_id:userId},{ewallet:1}).exec(function(err,wallet){
				if(err) throw err;
				if(wallet.ewallet.available_amount >= req.body.amount) {
					wallet.ewallet.available_amount -= req.body.amount;
					allClear(wallet.ewallet.available_amount);
					wallet.save(function(err,info){
						if(err) throw err;
					});				
				} else {
					res.send({message: "Request rejected!! Reason; amount for cash out is more than available balance."});
				}
			});

			function allClear(wallet) {
				var random = randos.genRef(8);
				var date = + new Date();
				var CashObj = new model.cashout({
					date: date,
					id: random,
					bank: req.body.bank_name,
					amount: req.body.amount,
					firstname: req.user.firstname,
					lastname: req.user.lastname,
					name: req.user.name,
					user_id: req.user.user_id,
					account_number: req.body.account_number,
					phone: req.user.phone
				});

				io.sockets.to(process.env.ADMIN_ID).emit("cash out",{
					firstname:req.user.firstname,
					lastname:req.user.lastname,
					id: random,
					name: req.user.name,
					user_id: req.user.user_id,
					amount: req.body.amount,
					account_number: req.body.account_number,
					date: date,
					bank: req.body.bank_name,
					phone: req.user.phone
				})

				CashObj.save(function(err,info){
					
				});

				res.send({message: "Request accepted! Transaction may take up to 48hrs to complete.",balance:wallet});
			}

		} else {
			res.send("Unauthorized access!");
		}
	});

	router.get("/user/cashout",function(req,res){
		if(req.user && req.user.user_id === process.env.ADMIN_ID){
			model.cashout.find({},function(err,list){
				if(err) throw err;
				res.send(list)
			})
		} else {
			res.send("Unauthorized access!")
		}
	});


router.put("/user/field-agent",function(req,res){ 
  var str = "";
  if(req.body.otp) {
    
    for(var i = 0; i < req.body.otp.length; i++) {
      str += req.body.otp[i];
      if(i == 2)
          str += " ";
    }

  } else {
  	res.send({message: "Wrong or invalid OTP"});
  	return;
  }
  
  console.log(req.body);

   model.courier.findOne({verified: true,otp: str,verified: true, attended: true,center_id: req.body.center_id,_id:req.body._id}).exec(function(err,data){
     if(err) throw err;
     if(data){
      var toNum = parseInt(data.total_cost);
      model.user.findOne({user_id: req.body.user_id},{ewallet:1,medications:1},function(err,patient){
        if(err) throw err;
        if(patient) {   
	        if(patient.ewallet.available_amount >= toNum) {        	
	          transect();
	          var elemPos = patient.medications.map(function(x){return x.prescriptionId}).indexOf(req.body.prescriptionId);
	          if(elemPos != -1){
	            var found = patient.medications[elemPos];            
	            model.user.findOne({user_id: req.body.center_id},{service_details:1})
	            .exec(function(err,center){
	              if(err) throw err;
	              center.service_details.push({
	                type: "pharmacy",
	                prescriptionDate_date: found.date,
	                provisional_diagnosis: found.provisional_diagnosis,
	                patient_names: found.patient_firstname + " " + found.patient_lastname,
	                patient_phone: found.patient_phone,
	                patient_age: found.patient_age,
	                patient_gender: found.patient_gender,
	                patient_profile_pic_url: found.patient_profile_pic_url,
	                amount: req.body.total_cost,
	                date: req.body.verification_date,
	                prescriptionBody: req.body.prescription_body,
	                doctor_names: found.title + " " + found.doctor_firstname + " " + found.doctor_lastname,
	                ref_id: found.ref_id,
	                doctor_work_place: found.doctor_work_place,
	                doctor_specialty: found.doctor_specialty,
	                doctor_city: found.doctor_city,
	                doctor_country: found.doctor_country,
	                doctor_profile_url: found.doctor_profile_url,
	                doctor_address: found.doctor_address
	              });

		            center.save(function(err,info){
			            console.log("service details saved!");
			          });

	            });

	           

	          }
	        } else {
	          res.send({message: 'Transaction canceled! Reason: Patient has insufficient fund to pay for this service.'})
	        }
	    } else {
	    	res.send({message: "Oops! Patient not found. Transaction canceled!"});
	    }
      });

      function transect() {
        var receiveDate = + new Date();
        data.receipt_date = receiveDate;
        data.completed = true;
        data.otp = genId();
        var pay = new Wallet(receiveDate,req.body.firstname,req.body.lastname,"courier billing");
        pay.courier(model,req.body.center_id,req.body.user_id,toNum,io,data.delivery_charge,req.body.city_grade,sms) //user_id refers to the patient,center_id refers to the center,toNum refrs to amount
        var per = toNum * (req.body.city_grade / 100);
        var receivable = toNum - per;
        io.sockets.to(data.center_id).emit("completed courier",{receipt_date:receiveDate,city:data.city,date:data.date})
        io.sockets.to(data.center_id).emit("fund received",{message: "Your MediPay account was credited! Payment made through courier service.",status:true})
        data.save(function(){});
        res.send({receipt_date: receiveDate,message: "Transactions successful!"});
      }

     } else {
       res.send({message: "Wrong or invalid OTP"});
     }
   });

    function genId() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrs!$%&_-tuvwxyz01234567899966600555777222";

	    for( var i=0; i < 16; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    return text;
	 }
	  
});

router.get("/user/outpatient-billing",function(req,res){
	if(req.user){
	  model.outPatientBilling.findOne({bill_id: req.query.billId},function(err,bill){
	  	if(err) throw err;
	  	if(bill) {
	  		res.json(bill);
	  	} else {
	  		res.send({});
	  	}
	  })
	} else {
		res.end("Unauthorized access!!");
	}
});

router.post("/user/outpatient-billing",function(req,res){
	console.log(req.body);

	if(req.user) {
		var id = genId();

		var bill = new model.outPatientBilling({
			date: + new Date(),
			sender_names: req.user.name,
			sender_address: req.user.address,
			sender_id: req.user.user_id,
			sender_city: req.user.city,
			sender_specialty: req.user.specialty,
			sender_country: req.user.country,
			sender_profile_pic_url: req.user.profile_pic_url,
			patient_names: req.body.patientName,
			patient_id: req.body.patientId,
			total: req.body.total,
			bill_id: id,
			payment_acknowledgement: {
				status: false,
				date: null
			},
			bill_list: req.body.billList
		});

		bill.save(function(err,info){
			if(err) {
				throw err;
				res.send({status: false});
			} else {
				res.json({status: true});
			}

		});

	  

	  model.user.findOne({user_id: req.body.patientId},{patient_mail:1,presence:1}).exec(function(err,patient){
	  	if(err) throw err;
	  	if(patient) {
	  		var mailData = {
		  		firstname: req.user.name,
					message_id: id,
					title: req.user.title,
					lastname: null,
					specialty: req.user.specialty,
					user_id: req.user.user_id,
					date: + new Date(),
					//consultation_fee: Number,
			    //service_access: String,
			    profile_pic_url: req.user.profile_pic_url,
			    profile_url: req.user.profile_url,
					message: "Cost of treatment bill received.",
					category: "outPatientBilling",//note categories are admin, decline, redirect,need_doctor.
					//reason: String,
					//complaint_id: String,
				}
				patient.patient_mail.push(mailData);
	  	}

	  	if(patient.presence) {
	  		io.sockets.to(req.body.patientId).emit("message notification",{status: true});
	  	}

	  	patient.save(function(err,info){
	  		if(err) throw err;
	  		console.log("patient's mail saved!");
	  	});
	  })

	  function genId() {
			var text = "";
			var possible = "000111222333444555666777888999ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		    for( var i=0; i < 8; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    return text;
		}

	} else {
		res.end("Unauthorized access");
	}
});

router.put("/user/outpatient-billing",function(req,res){
	if(req.user) {
		console.log(req.body);		
		model.otpSchema.findOne({user_id: req.user.user_id,otp: req.body.otp},function(err,data){
			if(err) throw err;
			if(data) {
				console.log(data)
				model.outPatientBilling.findOne({_id:req.body._id}).exec(function(err,bill){
					if(err) throw err;
					if(bill){
						if(!bill.payment_acknowledgement.status){
							if(req.user.ewallet.available_amount >= bill.total) {
								var date = + new Date();
								bill.payment_acknowledgement.status = true;
								bill.payment_acknowledgement.date = date;

								var pay = new Wallet(date,req.user.firstname,req.user.lastname,"hospitality bill");
								pay.hospitalityBill(model,bill.total,req.user.user_id,bill.sender_id,sms,io);
								bill.save(function(err,info){});
								res.send({status: true});
							} else {
								res.send({status: false,message: "You have insufficient fund for this transaction."});
							}
						} else {
							res.send({status: false,message: "This OTP is not for this transaction."});
						}
					}
				});
				data.remove(function(err,info){});
			} else {
				res.send({status: false,message: "Oops, Wrong or invalid OTP!"});
			}
			
		})
	} else {
		res.end("Unauthorized access!");
	}
})

/*
	 user_id: user.user_id,//this id refers to the debitors id. the person whose account will be debited.
				        time: req.body.time,
				        otp: password,
				        amount: req.body.amount,
				        senderId: req.user.user_id 
*/


}

module.exports = basicPaymentRoute;




//note to save transaction of previously registered people will error because the model of the date field in the transaction
//object has been changed to "Number" from "string" user for test are naza@gmail.com and cy@gmail.co. this two users don't error during
//saving of transaction because they registered after the field has changed to "number"