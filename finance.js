"use strict";
var config = require('./config');
var salt = require('./salt');
var router = config.router;
var http = require("http");
var path = require("path");
var Wallet = require("./wallet");
var randos = require("./randos");
var topdf = require("./topdf");
var fs = require('fs');
var pdf = require('html-pdf');
var uuid = require("uuid");


 


var basicPaymentRoute = function(model,sms,io,paystack,client,transporter){

	
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
				if(err){
				  res.send({error:true, message: "Oops! while verifying your payment through paystack. Please contact us for help."});
				  return;
				}

				if(body) {
				  console.log(body.data.amount);
				  body.data.amount /= 100;
				  console.log(body.data.amount);
				  if(body.status) {
				   creditUser(body.data.amount);
				  } else {
				  	res.send({message:"Oops! Something went wrong and payment was not successful.",error:true});
				  }
				} else {
				 res.send({error:true, message: "Oops! Something went wrong while updating you wallet. Please contact admin of this site."})
				}
			});

			function creditUser(amount) {
				model.user.findOne({user_id:req.user.user_id},{firstname:1,lastname:1,user_id:1,name:1},function(err,data){				
					if(err){
						res.send("Error occured! account not credited!");
					} else {
						var date = + new Date();
						var reciever = {user_id: data.user_id};
						data.firstname = (data.lastname) ? data.firstname : data.name;
						data.lastname = (data.lastname) ? data.lastname : "";
						var pay = new Wallet(date,data.firstname,data.lastname,"Account top-up (Paystack)",req.body.reference);
						pay.credit(model,reciever,amount,io,function(currBalnce){
							res.send({message:"Your account has been credited successfully!",balance:currBalnce});
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
		if(req.user) {
			
			if(req.body.userId !== req.user.user_id || req.body.isCashOutVerify){
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
										//createNew();
									}  //else {
										//res.send({message: "This OTP session has been used and expired! Please refresh the page and continue."})
									//}
									createNew();
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
					       
					      }); 

					      console.log(otp)
					      var callBack = function(err,responseData){
									if(err) {
										res.send({message:"Oops! Error occured while sending OTP.Please resend",success:true,time_stamp:req.body.time}) 
									} else {								
										res.send({message:"One time pin was sent to this patient via SMS. Enter the pin to confirm payment",success:true,time_stamp:req.body.time}) 
									}
									
								}

								if(req.body.isPhoneCall) {
									var str = password.replace(/ +/g, "");
									sms.calls 
								  .create({
								    url: "https://applinic.com/twiliovoicemsg?pin=" + str,
								    to: user.phone,
								    from: '+16467985692',
								  })
								  .then(
								    function(call){
								      
								      res.send({message:"Phone call initiated",success:true,time_stamp:req.body.time}) 
								    },
								    function(err) {
								      
								      res.send({error: true, message:"Error occured while trying to call the destination. Please try again"})
								    }
								  );
								} else {
									var msgBody = "Your payment OTP for applinic.com is " + password + " \nThe amount billed is " + req.user.currencyCode + "" + req.body.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
									var phoneNunber = user.phone;
									sms.messages.create(
			              {
			                to: phoneNunber,
			                from: '+16467985692',
			                body: msgBody,
			              },
			              callBack
			            );
								}
		            //Set the message
								/*var message = {from: "InfoSMS", to : phoneNunber, text : "Your payment OTP for applinic.com is " +
								 password + " \nThe amount billed is " + req.user.currencyCode + "" + req.body.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")};
								 
								//Send an SMS
								client.SMS.send(message,callBack);*/
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
							res.send({message: "Transaction successful!"});
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

	/*this route handles the patient accepting consultation fee. 
	the patient wallet will be debited and doctor's wallet credited slightly*/
	
	router.put("/user/patient/consultation-fee",function(req,res){

		if(!req.user) {
			res.send({message: "Session has expired!, refresh and log in"});
			return;
		}

		if(req.user.type === "Patient" && req.body.patientId === req.user.user_id){		
			if(req.body.amount <= req.user.ewallet.available_amount) {
				model.consultationFee.findById(req.body.consultationFeeId)
				.exec(function(err,consult){
					if(err) throw err;
					if(consult){
						req.body.message = "Consultation fee";
						req.body.date = + new Date();
						var name = req.user.firstname || req.user.name;
						var pay = new Wallet(req.body.date,name,req.user.lastname,req.body.message);
						pay.consultation(model,req.body.amount,req.user,req.body.receiver,io,function(balance){						
							consult.payment_date = new Date();
							consult.is_paid = true;
							consult.status = "Paid";
							consult.save(function(err,info){
								if(err) throw err;
								console.log('consultation paid and updated!');
							});

							res.json({status: true,message: "Payment made successfully!",date:consult.payment_date});

							model.user.findOne({user_id: consult.doctor_id},{doctor_patients_list:1,doctor_notification:1})
							.exec(function(err,person){
								var elemPos = person.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(consult.patient_id);
						    var patient;

						    if(elemPos !== -1){

						      patient = person.doctor_patients_list[elemPos];
						      patient.fee_history.unshift(req.body.paymentMessage);

						      var names = req.user.title + " " + req.user.firstname + " " + req.user.lastname;

						      person.doctor_notification.unshift({
						      	sender_id: req.user.user_id,
										message_id: parseInt(randos.genRef(6)),
										type: "Consultation fee",
										date: + new Date(),
										message: "Payment for consultation fee was successful.",
										sender_firstname: req.user.firstname,
										sender_lastname: req.user.lastname,
										sender_age: "",
										sender_gender: "",
										sender_location: "",	
										sender_profile_pic_url: req.user.profile_pic_url
						      });

						      person.save(function(err,info){
						        if(err) throw err;
						        console.log("fee history saved on doc patients' list");
						      })

						      io.sockets.to(req.body.receiver).emit("new consultation fee",{status: true,sender: names});
						    }
							});

						});
					} else {
						res.json({status: false, message: "Consultation Fee Transaction not found!"});
					}
				});
			} else {
				res.json({success: false, message: 'You have insufficient balance to complete this transaction. Please fund your wallet.',isFund:true})
			}

		} else {
			res.send({status:false,message: "Transaction not authorized"});
		}

	})

	router.post("/user/patient/consultation-acceptance/confirmation",function(req,res){
		if(!req.user) {
			res.send({message: "Session has expired!, refresh and log in"});
			return;
		}
		
		if(req.body.userId !== req.user.user_id && req.user.type === "Patient"){
			if(!req.body.otp && req.body.amount == 0){
					model.user.findOne({user_id: req.user.user_id},{ewallet:1,firstname:1,lastname:1,name:1})
					.exec(function(err,debitor){
						createConnection(debitor,req.body.amount);
					});	
			} else {
				model.otpSchema.findOne({otp:req.body.otp}).exec(function(err,data){
					if(err) throw err;
					
					if(!data){
						res.send({message:"Confirmation failed! Transaction canceled.",success: true})
					} else {			
					
						//check is is the right otp for a user
						if(data.user_id === req.user.user_id) {
							//do the actual transaction. success!
							model.user.findOne({user_id: req.user.user_id},{ewallet:1,firstname:1,lastname:1,name:1})
							.exec(function(err,debitor){
								var name = req.user.firstname || req.user.name;
								var msg = req.body.message || "Consultation fee";
								var pay = new Wallet(req.body.date,name,req.user.lastname,msg);
								//note firstname or lastname of patient may change.
								pay.consultation(model,data.amount,debitor,req.body.userId,io);
								createConnection(debitor,data.amount);
							});	
							data.remove(function(){});			
						} else {
							res.send({message: "This OTP is not for this user"});
						}
					}
				})

			}
		
			function createConnection(debitor,amount){
				var DocObj = {					
					doctor_id: req.body.sendObj.user_id,
					date_of_acceptance: req.body.sendObj.date_of_acceptance,
					doctor_firstname: req.body.sendObj.firstname || req.body.sendObj.doctor_firstname,
					doctor_lastname:  req.body.sendObj.lastname || req.body.sendObj.doctor_lastname,
					doctor_name: req.body.sendObj.name || req.body.sendObj.doctor_name,
					doctor_profile_pic_url: req.body.sendObj.profile_pic_url || req.body.sendObj.doctor_profile_pic_url,
					service_access: true,
					doctor_email: req.body.sendObj.email || req.body.sendObj.doctor_email,
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
              profile_pic_url:1,
              gender: 1,
              city: 1,
              phone: 1,
              age:1             
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
                        presence:1,
                        doctor_notification:1,
                        email:1
                      }
                    )
                    .exec(function(err,data){
                    	if(data) {
                        data.doctor_patients_list.unshift({
                          patient_firstname: result.firstname,
                          patient_lastname: result.lastname,
                          patient_id: req.user.user_id,
                          patient_profile_pic_url: result.profile_pic_url,
                          patient_gender: result.gender,
                          patient_city: result.city,
                          patient_age: result.age,
                          initial_complaint: {
                          	complaint: req.body.sendObj.original_complaint,
                          	complaint_date: req.body.sendObj.original_complaint_date,
                          	date_received: req.body.date,
                          	files: req.body.sendObj.files
                          },
                          date: + new Date()
                        });

                        var consultId = (req.body.sendObj) ? parseInt(req.body.sendObj.message_id) : undefined;
                        if(consultId) {
	                        model.consult.remove({id: consultId},function(err,info){
	                        	if(err) throw err;
	                        	if(info){
	                        		console.log("consultation record deleted!");
	                        	}
	                        });
	                      }


                        data.doctor_notification.unshift({
                        	sender_id: req.user.user_id,
													message_id: parseInt(randos.genRef(6)),
													type: "acceptance",
													date: + new Date(),
													message: "Congratulations! New patient was added to your account.",
													sender_firstname: result.firstname,
													sender_lastname: result.lastname,
													sender_age: "",
													sender_gender: "",
													sender_location: "",
													sender_profile_pic_url: result.profile_pic_url
                        });

                        if(data.presence === true){
				                  io.sockets.to(data.user_id).emit("acceptance notification",{status:true});
				                } //else {

			                  var msgBody = "Success! " +  result.firstname + " " + result.lastname + " is now your patient. Visit https://applinic.com/login"
			                  var phoneNunber =  data.phone;
		                    sms.messages.create(
						              {
						                to: phoneNunber,
						                from: '+16467985692',
						                body: msgBody,
						              }
						            ) 

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
				                  to: data.email,
				                  subject: 'Consultation Fee Paid',
				                  html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Dear ' + data.lastname + ",</b><br><br>"
				                  + req.user.title + " " + req.user.lastname 
				                  + " has paid your consultation fee and now added to the list of your patients.<br><br>" 
				                  + "Details of Payment:<br><br>"
				                  + "Amount paid: " + req.user.currencyCode + " " + amount + "<br>"
				                  + "Date: " + new Date() + "<br>"
				                  + "Click the link below to log in and attend to your patient(s).<br><br>"
				                  + "URL: https://applinic.com/user/doctor<br><br>"
				                  + "Thank you for using Applinic.<br><br>"
				                  + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
				                  + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
				                  + "For inquiries please call customer support on +2349080045678<br><br>"
				                  + "Thank you for using Applinic.<br></br><br>"
				                  + "<b>Applinic Team</b></td></tr></table>"
				                };

				                transporter.sendMail(mailOptions, function(error, info){
				                  if (error) {
				                   // console.log(error);
				                  } else {
				                    //console.log('Email sent: ' + info.response);
				                  }
				                });
				                //}

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
                  	res.send({message: msgInfo,balance:debitor.ewallet.available_amount,status:true});
                    //console.log("note deleted");                        		                   
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
			model.otpSchema.findOne({otp:req.body.otp},function(err,data){
				if(err) throw err;
				if(!data){
					res.send({message:"Confirmation failed! Transaction canceled."});					
				} else {			
						if(data.user_id === req.body.patientId && data.senderId === req.user.user_id) {					
							model.user.findOne({user_id:req.user.user_id},{ewallet:1,user_id:1,city_grade:1,type:1,email:1,referral:1,service_details:1,name:1})
							.exec(function(err,center){				
								if(err) throw err;

								if(!center){
									res.send({message: 'Oops! Something went wrong.Center does not exist or have been deleted.==> finance.js: 666'});
									return;
								}

								//var elementPos = center.referral.map(function(x){return x.ref_id}).indexOf(req.body.refId);
								//var found = center.referral[elementPos];
								model.referral.findOne({ref_id: req.body.refId,center_id: center.user_id})
								.exec(function(err,found){
									if(err) throw err;

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
										//console.log(err);
										//console.log("billing is paid and saved!");
									});

									var pay = new Wallet(req.body.date,req.body.patient_firstname,req.body.patient_lastname,"billing");
									pay.billing(model,req.body,center,sms,io);

									
									model.otpSchema.remove({otp:req.body.otp},function(err,info){});
									var roundNum = Math.round(center.ewallet.available_amount)
									res.send({message: "Transaction successful!",balance:roundNum,status:true});	
									if(req.body.prescriptionBody) {
										updatePatient();
									}	
								})			
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
										//console.log("Patient prescription body updated.")
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

 
router.post("/user/laboratory/test-result/preview",function(req,res){
	if(req.user){	
		model.template.findOne({center_id: req.user.user_id,type: "Laboratory"})
		.exec(function(err,data){
			if(err) throw err;
			var tempLink;
			var date = new Date();
			if(!data){
				tempLink = req.headers.origin + "/lab-template/default";
			} else {
				tempLink = req.headers.origin + "/lab-template/" + data.center_id;
			}
			model.lab_store.findOne({id_by: req.body.laboratory._id})
			.exec(function(err,result){
				if(err) throw err;
				if(result){

					tempLink += "/" + result._id + "/" + req.body.count;
					result.report_date =  date;
					result.lab_data.unshift(req.body)
					result.save(function(err,info){});

				} else {
					
					var newTemp = new model.lab_store({
						center_id: req.user.user_id,
						ref_id: req.body.ref_id,
						center_pic: req.user.profile_pic_url,
				    center_name: req.user.name,
				    center_address: req.user.address,
				    center_email: req.user.email,
				    center_phone: req.user.phone,
				    center_city: req.user.city,
				    center_country: req.user.country,
				    id_by: req.body.laboratory._id,
				    report_date:  date
					})

					tempLink += "/" + newTemp._id + "/" + req.body.count;

					newTemp.lab_data.push(req.body)
					newTemp.save(function(err,info){
						if(err) throw err;
					});

				}

				res.json({status: "success",reportTemp: tempLink});
			})
		})
	} else {
		res.end("Unauthorized access.");
	}
});


//this route handles test result sent by a laboratory to update existing doctor/patient session that initiated such test request.
router.put("/user/laboratory/test-result/session-update",function(req,res){
    //note that sms will be sent to patient and doctor when a lab test result is available.
   
    if(req.user) {
      var dt = + new Date();
      var pdfName = dt + "-" + uuid.v1() + '.pdf';
      var filePath = './pdf/' + pdfName;
      var pdfPath;
      var emailPDFPath;
      var FILE_CONTENT;
      var buf;

      pdf.create(req.body.htm).toFile(filePath, function(err, file) { //start of toFile
      	if (err) return console.log(err);  
        pdfPath = '/report/' + pdfName;
      	emailPDFPath = "https://applinic.com" + pdfPath;
      	FILE_CONTENT = fs.readFileSync(file.filename, 'base64');
        buf = Buffer.from(FILE_CONTENT, 'base64')                   
    		updateSession();   
    	})

      function updateSession() {     
        model.session.findOne({session_id: req.body.laboratory.session_id})
        .exec(function(err,data){
          if(err) throw err;
          //var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id }).indexOf(req.body.laboratory.session_id);
  
          if(data) {
	          var objectFound = data;    
	          var pos = objectFound.diagnosis.laboratory_test_results.map(function(x) { return x.test_id;}).indexOf(req.body.laboratory.test_id);
	          var theObj = objectFound.diagnosis.laboratory_test_results[pos];   
	          if(theObj) {      
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
		          theObj.indication = req.body.laboratory.indication;
		          theObj.center_profile_pic_url =  req.user.profile_pic_url;
		          theObj.lab_pdf_report.unshift({date: dt,pdf_report:pdfPath});
	      	  }
       	  

	          var mailOptions = {
	            from: 'Applinic info@applinic.com',
	            to: req.body.laboratory.doctor_email || "info@applinic.com",
	            subject: 'Laboratory Result Received',
	            html: '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' 
	            + data.title + " " + data.lastname + ",</b><br><br>"
	 						+ "<b>" + req.user.name + "</b>" + "have sent the result of laboratory investigations you requested for the patient:<br><br>"
	 						+ "<b>Name:</b> " + objectFound.patient_firstname + " " + objectFound.patient_lastname + "<br>"
	            + "<b>Session ID:</b> " + objectFound.session_id  + "<br><br>" 
	          	+ "Please <a href='https://applinic.com/login'>log in to your account</a> and continue treatment with the patient<br><br>"
	          	+ "You can find the treament session in which these tests was referred through the following steps:<br><br>"
	          	+ " - Inside your account look for the patient by name in 'My Patients' menu.<br>"
	          	+ " - Click on the patient and select 'Treatment Session' under management then choose session or filter by session ID you wish to continue with.<br><br>"
	            + "Thank you for using Applinic.<br><br>"
	            + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
	            + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
	            + "For inquiries please call customer support on +2349080045678 or email us at info@applinic.com<br><br>"
	            + "Thank you for using Applinic.<br></br><br>"
	            + "<b>Applinic Team</b></td></tr></table>",
	            attachments:[{
	              filename: pdfName,
	              content: buf,
	              contentType: 'application/pdf'
	            }]
	          };

	          transporter.sendMail(mailOptions, function(error, info){
	            if (error) {
	              //console.log(error);
	            } else {
	              //console.log('Email sent: ' + info.response);
	            }
	          });


	          model.user.findOne({user_id: req.body.laboratory.doctor_id})
	          .exec(function(err,doctor){
	          	var names = objectFound.patient_firstname + " " 
	          	+ objectFound.patient_lastname 

	          	doctor.doctor_notification.unshift({
	            	sender_id: objectFound.patient_id,
								message_id: parseInt(randos.genRef(6)),
								type: "laboratory",
								date: + new Date(),
								message: "Laboratory test result received!",
								sender_firstname: objectFound.patient_firstname,
								sender_lastname: objectFound.patient_lastname,
								sender_age: "",
								sender_gender: "",
								sender_location: "",
								sender_profile_pic_url: "",
								center_id: req.user.user_id
	            });

	            doctor.save(function(err,info){
	            	io.sockets.to(doctor.user_id).emit("get notification",{status:true});
	            })
	          })

	         

	           
	          
	          //the doctors session for a patient is updated, and patient dashboard is called for update.
	          //objectFound.diagnosis.laboratory_test_results.unshift(testResult);          
	          data.save(function(err,info){
	            if(err) {
	              res.send({status: "error"});
	            } else {  
	            	updatePatient(); 
	              //updateTheCenter();  
	              updateCenter(data);  
	                       
	            }
	          });  

          } else {
          	updatePatient(); 
            //updateTheCenter();  
            updateCenter({phone: req.req.body.laboratory.patient_phone,
            	firstname: req.body.laboratory.patient_firstname,lastname: req.body.laboratory.patient_lastname,
            	title: req.body.laboratory.patient_title});  
          }    

        });
      }

      function updatePatient() {
        //here patient test result is updated.
        model.user.findOne({user_id: req.body.laboratory.patient_id},
        {medical_records: 1,patient_notification:1,user_id:1,presence:1,
        	phone:1,email:1,title:1,firstname:1,lastname:1,laboratory_new_indicator:1})
        .exec(function(err,data){

          if(err) throw err;

          /* Please note that req.body.laboratory.conclusion and req.body.laboratory.conclusion 
          property were not present due to modification in UI.*/

          var elementPos = data.medical_records.laboratory_test.map(function(x) {return x.ref_id }).indexOf(req.body.ref_id);
          if(elementPos !== -1) {
	          var objectFound = data.medical_records.laboratory_test[elementPos];           
	          objectFound.report = req.body.laboratory.report || "Not specified";
	          objectFound.conclusion = req.body.laboratory.conclusion || "Not specified";
	          objectFound.test_to_run = req.body.laboratory.test_to_run || objectFound.test_to_run;
	          objectFound.sent_date = req.body.date || objectFound.sent_date;
	          objectFound.test_ran_by = req.user.name;
	          objectFound.receive_date = req.body.laboratory.date;
	          objectFound.indication = req.body.laboratory.indication;
	          objectFound.summary = req.body.laboratory.clinical_summary || "";
	          objectFound.lab_pdf_report.unshift({date:dt,pdf_report: pdfPath});
	          objectFound.payment_acknowledgement = true;

	          data.patient_notification.unshift({
	            type:"laboratory",
	            date: req.body.laboratory.date,
	            note_id: req.body.laboratory.test_id,
	            ref_id: req.body.ref_id,
	            session_id: req.body.laboratory.session_id,
	            message: "Laboratory test result received."
	          });

	          var usr = (req.body.laboratory.doctor_id) ? req.body.laboratory.doctor_id : req.user.user_id;

	          var elm = data.laboratory_new_indicator.map(function(x){return x}).indexOf(usr);
            if(elm == -1){
              data.laboratory_new_indicator.push(usr)
            }
	         
            io.sockets.to(data.user_id).emit("notification",{status:true});
        
            var msgBody = "Laboratory test result received! visit http://applinic.com/user/patient";
            var phoneNunber =  data.phone;
             sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody
              }
            ) 
	         

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
	            to: data.email,
	            subject: 'Laboratory Result Received',
	            html: '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' + data.title + " " + data.lastname + ",</b><br><br>"
	 						+ "<b>" + req.user.name + "</b>" + " have sent the result of investigations requested by your doctor:<br><br>"
	 						+ "<b>Name:</b> " + data.firstname + " " + data.lastname + "<br><br>"
	          	+ "<a href='https://applinic.com/login'>log in to your account</a> to view the result. Check in notification bell icon for latest updates<br><br>"
	            + "Thank you for using Applinic.<br><br>"
	            + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
	            + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
	            + "For inquiries please call customer support on +2349080045678 or email us at support@applinic.com<br><br>"
	            + "Thank you for using Applinic.<br></br><br>"
	            + "<b>Applinic Team</b></td></tr></table>",
	            attachments:[{
	              filename: pdfName,
	              content: buf,
	              contentType: 'application/pdf'
	            }]
          	};

	          transporter.sendMail(mailOptions, function(error, info){
	            if (error) {
	              //console.log(error);
	            } else {
	              //console.log('Email sent: ' + info.response);
	            }
	          });

	          data.save(function(err,info){
	            if(err) { 
	            	//console.log(err)
	            	res.send({status: "error"}); 
	            } else {
	            	res.send({status: "success"}); 
	            }         
	          });

        	} else {
        		res.end("error: 404");
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
      			req.body.lab_pdf_report = pdfPath;
      			center.service_details.unshift(req.body);
      			center.save(function(err,info){
      				if(err) throw err;
      				//console.log("service details saved!");
      			});

      			model.referral.findOne({ref_id: req.body.ref_id,center_id: req.user.user_id})
      			.exec(function(err,ref){
      				if(err) throw err;
      				if(ref){
	      				ref.laboratory.lab_pdf_report.unshift({date:dt,pdf_report: pdfPath});
	      				ref.save(function(err,info){})
      				}
      			})

      		} else {
      			res.end("something went wrong!");
      		}
      	})
      }
      
    } else {
      res.end("Unauthorized access");
    }
  });


	//this route is like above only it only updates the patient lab test on the patient dashboard. this is used for patient on em profile and 
  //patient who requested test without doctors approval.
  router.put("/user/laboratory/test-result/patient-test-update",function(req,res){
    if(req.user) {

   

    	var dt = + new Date();
      var pdfName = dt + "-" + uuid.v1() + '.pdf';
      var filePath = './pdf/' + pdfName;
      var pdfPath;
      var emailPDFPath;
      var FILE_CONTENT;
      var buf;

    

      pdf.create(req.body.htm).toFile(filePath, function(err, file) { //start of toFile
      	if (err) return console.log(err);  
        pdfPath = '/report/' + pdfName;
      	emailPDFPath = "https://applinic.com" + pdfPath;
      	FILE_CONTENT = fs.readFileSync(file.filename, 'base64');
        buf = Buffer.from(FILE_CONTENT, 'base64')                   
    		updatePatient(); 
    	})
     
     

      function updatePatient() {
        model.user.findOne({user_id: req.body.laboratory.patient_id},
        	{medical_records:1,patient_notification:1,user_id:1,presence:1,phone:1,
        		firstname:1,lastname:1,title:1,email:1,laboratory_new_indicator:1})
        .exec(function(err,data){
          if(err) throw err;
         
          var elementPos = data.medical_records.laboratory_test.map(function(x) {return x.ref_id }).indexOf(req.body.ref_id);
          var objectFound = data.medical_records.laboratory_test[elementPos];         
          objectFound.report = req.body.laboratory.report || objectFound.report;
          objectFound.conclusion = req.body.laboratory.conclusion || objectFound.conclusion;
          objectFound.test_to_run = req.body.laboratory.test_ran || objectFound.test_to_run;
          objectFound.sent_date = req.body.date || objectFound.sent_date;
          objectFound.receive_date = req.body.laboratory.date;
          objectFound.payment_acknowledgement = true;
          objectFound.history = req.body.history;
          objectFound.indication = req.body.laboratory.indication;
          objectFound.lab_pdf_report.unshift({date:dt,pdf_report: pdfPath});



          var random = randos.genRef(8);
          data.patient_notification.unshift({
            type:"laboratory",
            date: req.body.laboratory.date,
            note_id: random,
            ref_id: req.body.ref_id,
            session_id:req.body.session_id,
            message: "Laboratory test result received."
          });


          var elm = data.laboratory_new_indicator.map(function(x){return x}).indexOf(req.user.user_id);
          if(elm == -1){
            data.laboratory_new_indicator.push(req.user.user_id)
          }

         
          io.sockets.to(data.user_id).emit("notification",{status:true});
      
          var msgBody = "Laboratory test result received! login http://applinic.com/login"
          var phoneNunber =  data.phone;
          sms.messages.create(
            {
              to: phoneNunber,
              from: '+16467985692',
              body: msgBody,
            }
          ) 
          

          /*var transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            auth: {
              user: "info@applinic.com",
              pass: process.env.EMAIL_PASSWORD
            }
      	  });*/

           /*transporter = nodemailer.createTransport({
	            host: "mail.privateemail.com",
	            port: 465,
	            auth: {
	              user: "info@applinic.com",
	              pass: process.env.EMAIL_PASSWORD
	            }
          	});*/

          	if(data.email) {
		          var mailOptions = {
		            from: 'Applinic info@applinic.com',
		            to: data.email,
		            subject: 'Laboratory Result Received',
		            html: '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' + data.title + " " + data.lastname + ",</b><br><br>"
		 						+ "<b>" + req.user.name + "</b>" + " have sent the result of investigations you requested:<br><br>"
		 						+ "<b>Name:</b> " + data.firstname + " " + data.lastname + "<br><br>"
		          	+ "<a href='https://applinic.com/login'>log in to your account</a> to view the result. Check in notification bell icon for latest updates<br><br>"
		            + "Thank you for using Applinic.<br><br>"
		            + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
		            + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
		            + "For inquiries please call customer support on +2349080045678 or email us at support@applinic.com<br><br>"
		            + "Thank you for using Applinic.<br></br><br>"
		            + "<b>Applinic Team</b></td></tr></table>"
	          	};
          	} else {
          		 var mailOptions = {
		            from: 'Applinic info@applinic.com',
		            to: 'info@applinic.com',
		            subject: 'Laboratory Result Received',
		            html: '<table><tr><td>' + "A dummy account created by " + req.user.name 
		            + " for a patient - <b>" + data.title + " " + data.lastname + data.firstname 
		            + " with number " + data.phone + "</b> has received a laboratory report from <b>" + req.user.name 
		            + " @ " + req.user.address + " " + req.user.city + " " + req.user.phone
		            + "</b><br><br>Please contact the patient and guide him on how to register properly to enable him view the report."
		            + "<br><br>"		           
		            + "</td></tr></table>"
	          	};
          	}

	          transporter.sendMail(mailOptions, function(error, info){
	            if (error) {
	              console.log(error);
	            } else {
	              console.log('Email sent: ' + info.response);
	            }
	          });

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
      			req.body.lab_pdf_report = pdfPath;
      			center.service_details.unshift(req.body);
      			center.save(function(err,info){
      				if(err) throw err;
      				console.log("service details saved!");
      				res.send({status: "success"});
      			})

      			model.referral.findOne({ref_id: req.body.ref_id,center_id: req.user.user_id})
      			.exec(function(err,ref){
      				if(err) throw err;
      				if(ref){
	      				ref.laboratory.lab_pdf_report.unshift({date:dt,pdf_report: pdfPath});
	      				ref.save(function(err,info){})
      				}
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
  		model.referral.findOne({ref_id: refId,center_id: center.user_id})	
  		.exec(function(err,objectFound){			
				//var elementPos = center.referral.map(function(x){return x.ref_id.toString()}).indexOf(refId.toString());
	      //var objectFound = center.referral[elementPos];
	      if(err) throw err;
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
      })
  	} else {
  		res.end("Unauthorized access");
  	}

  });



  // this route takes care of the referral paying for the bill to claim discount
  router.post("/user/referral/billing-verification",function(req,res){
  	if(req.user) {
  		if(req.user.type !== 'Patient'){
  			req.body.date = new Date();

  			model.user.findOne({user_id: req.body.referral_id})
        .exec(function(err,oga){	
        	if(err) throw err;
        	if(oga){
        		var type = req.body.type;
        		if(req.body.payObj.total <= oga.ewallet.available_amount) {
	        		model.referral.findOne({ref_id: req.body.ref_id,center_id: req.user.user_id})
			        .exec(function(err,objectFound){
			          if(err) throw err;

			          if(objectFound) {
			          	var details;
				          if(req.user.type === "Radiology") {
				          	objectFound.radiology.is_paid = true;
				          	objectFound.radiology.detail.amount = req.body.radiology.strAmount;;
				          	objectFound.radiology.detail.date = + new Date();
				          	details = objectFound.radiology.detail;

				          } else if(req.user.type === "Laboratory") {
				          	objectFound.laboratory.is_paid = true;
				          	objectFound.laboratory.detail.amount = req.body.laboratory.strAmount;
				          	objectFound.laboratory.detail.date = + new Date();
				          	details = objectFound.laboratory.detail;

				          } else if(req.user.type === "Pharmacy"){
				          	objectFound.pharmacy.is_paid = true;
				          	objectFound.pharmacy.detail.amount = req.body.pharmacy.strAmount;;
				          	objectFound.pharmacy.detail.date = + new Date();
				          	details = objectFound.pharmacy.detail;
				          }
				         	

				          var pay = new Wallet(req.body.date,oga.name,oga.lastname,"billing");
				          //pay.billing(model,req.body.payObj,center,sms,io);
				          //model.otpSchema.remove({otp:type.v_pin},function(err,info){});
				          
				          pay.billPaymentByReferral(model,req.body.payObj.total,req.user,oga,io,function(balance){
				          	//if(balance){
				          	res.json({message: "Transaction successful!",
				          	status: "success",payment:true, detail: details});
				          	//} else {
				          		//res.send({message: "Transaction Incomplete",error: true})
				          	//}
			          	  oga.save(function(err,info){
					          	if(err) throw err;						          	
					          });

					        	objectFound.save(function(err,info){
				          		if(err) throw err;
				          		console.log("Payment details saved!");
				         		});
				          });



				          /*if(confirmPay){

				        		center.save(function(err,info){
				        			if(err) {
				        				res.send({message: "Transaction Incomplete",error: true})
				        			} else {
				        				var detail = (req.user.type === 'Radiology') ? objectFound.radiology.detail : objectFound.laboratory.detail;
				        				res.json({message: "Transaction successful! Your account is credited.",balance:center.ewallet.available_amount,status: "success",payment:true,detail:detail});
				        			}

				        		});

				        		objectFound.save(function(err,info){
					          	if(err) throw err;
					          	console.log("payment details saved")
					          });

			        		} else {
			        			res.json({error: true, message: "Oops! It seems you have insufficient fund to continue with this payment. Please add money to your wallet."})
			        		}*/
				         
			        	} else {
			        		res.end({message:"unexpected error occured!",error: true});
			        	}
			        })
		      	} else {
		      		res.json({error: true, 
		      			message: "The referrer chose to pay from his/her wallet but currently have insufficient fund"
		      			+ " to continue with this transaction. Please contact the referral" +
		      			 " about this issue or demand him or her funds their wallet. " + oga.phone})
		      	}
        	} else {
        		res.json({error: true, message: "Center not found!."})
        	}
        });

  		} else {
  			res.json({error: true, message: "This user not allowed for this service."})
  		}
  	} else {
  		res.end("unathorized access!")
  	}
  })

  //this route takes care of center paying for patient billing from their own ewallet
  router.post("/user/center/billing-verification",function(req,res){
  	
  	if(req.user){
  		if(req.user.type  !== "Patient"){
  			req.body.date = new Date();
  			model.user.findOne({user_id: req.user.user_id},{ewallet:1,user_id:1,city_grade:1,type:1,email:1,name:1})
        .exec(function(err,center){	
        	if(err) throw err;
        	if(center){
        		var type = (req.user.type === "Radiology") ? req.body.radiology : ( req.body.laboratory || req.body.pharmacy);
        		if(req.body.payObj.total <= center.ewallet.available_amount) {
	        		model.referral.findOne({ref_id: req.body.ref_id,center_id: center.user_id})
			        .exec(function(err,objectFound){
			          if(err) throw err;

			          if(objectFound) {

			          	var details;

				          if(req.user.type === "Radiology") {
				          	objectFound.radiology.is_paid = true;
				          	objectFound.radiology.detail.amount = type.strAmount;
				          	objectFound.radiology.detail.date = + new Date();
				          	details = objectFound.radiology.detail;

				          } else if(req.user.type === "Laboratory") {
				          	objectFound.laboratory.is_paid = true;
				          	objectFound.laboratory.detail.amount = type.strAmount;
				          	objectFound.laboratory.detail.date = + new Date();
				          	details = objectFound.laboratory.detail;

				          } else if(req.user.type === "Pharmacy"){
				          	objectFound.pharmacy.is_paid = true;
				          	objectFound.pharmacy.detail.amount = type.strAmount;
				          	objectFound.pharmacy.detail.date = + new Date();
				          	details = objectFound.pharmacy.detail;
				          }
				         
				          var pay = new Wallet(req.body.date,req.user.name,req.user.lastname,"billing");
				          //pay.billing(model,req.body.payObj,center,sms,io);
				          //model.otpSchema.remove({otp:type.v_pin},function(err,info){});
				          var confirmPay = pay.billPaymentByCenter(model,req.body.payObj.total,center,io);

				          if(confirmPay){

				        		center.save(function(err,info){
				        			if(err) throw err;
				        		});

				        		objectFound.save(function(err,info){
					          	if(err) {
					          		res.send({message: "Transaction Incomplete",error: true});
					          		return;
					          	}
					          	
					          	res.json({message: "Transaction successful!",
				        			balance:center.ewallet.available_amount,status: "success",payment:true,detail:details});
					          });

			        		} else {
			        			res.json({error: true, message: "Oops! It seems you have insufficient fund to continue with this payment. Please add money to your wallet."})
			        		}
				         
			        	} else {
			        		res.end("unexpected error occured!");
			        	}
			        })
		      	} else {
		      		res.json({error: true, message: "You have insufficient fund to complete this transaction. Please ADD money to your wallet."})
		      	}
        	} else {
        		res.json({error: true, message: "Center not found!."})
        	}
        });

  		} else {
  			res.json({error: true, message: "This user not allowed for this service."})
  		}
  	} else {
  		res.json({error: true, message: "User out of session."})
  	}
  })

  //this route takes care of patients paying for their billing themselves.
  router.put("/user/center/billing-verification",function(req,res){
  	if(req.user){
  		var type = (req.user.type === "Radiology") ? req.body.radiology : req.body.laboratory;
  		req.body.date = new Date();
  		if(type) {
        model.otpSchema.findOne({otp:type.v_pin},function(err,data){
          if(err) throw err;

          if(!data) {
            res.send({message: "Error! Wrong OTP or OTP does not exist!"});
          } else {                          
            if(data.user_id === type.patient_id && data.senderId === req.user.user_id) {         
              //updateSession();
              model.user.findOne({user_id: req.user.user_id},{referral:1,ewallet:1,user_id:1,city_grade:1,type:1,email:1})
              .exec(function(err,center){
              	if(err) {
              		res.send({message: "Error occured"})
              	} else {
              		//var elementPos = center.referral.map(function(x){return x.ref_id}).indexOf(req.body.ref_id)
              		//var objectFound = center.referral[elementPos];
				          //objectFound.radiology.attended = true; // this makes a lab that has been sent to a doctor and no longer on the pending list of front end
				          model.referral.findOne({ref_id: req.body.ref_id,center_id: center.user_id})
				          .exec(function(err,objectFound){
					          if(err) throw err;
					        
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
		              				res.send({message: "Transaction successful!",balance:center.ewallet.available_amount,status: "success",payment:true,detail:detail});
		              			}

		              		})

		              		objectFound.save(function(err,info){
						          	if(err) throw err;
						          	console.log("payment details saved")
						          });
						         
		              	} else {
		              		res.end("unexpected error occured!");
		              	}
	                })
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
  
      //create a dicom Study for viewing.
      var locate = ('patientID=' + req.body.radiology.studyId);
      var ovyWeb = "https://" + req.body.onlinePacs.dns + "/web/viewer.html?" + locate;

			var ovyMob = "http://" + req.body.onlinePacs.ip_address + ":8080/applinic-dicom/home.html?" + locate;
			var centerUser = req.body.onlinePacs.username;
			var centerPassword = req.body.onlinePacs.password;
      var dcm = new model.study({
      	patient_name: req.body.radiology.patient_firstname + " " + req.body.radiology.lastname,
		    patient_id: req.body.radiology.studyId,
		    study_id: req.body.radiology.studyId,
		    center_id: req.user.user_id,
		    center_name: req.user.name,
		    center_address: req.user.address,
		    center_city: req.user.city,
		    center_country: req.user.country,
		    center_phone: req.user.phone,
		    center_email: req.user.email,
		    patient_phone: req.body.radiology.patient_phone,
		    email: req.body.radiology.patient_email,
		    ip_address: req.body.onlinePacs.ip_address,
		    port: req.body.onlinePacs.port,
		    aetitle: req.body.onlinePacs.aetitle,
		    study_link: req.body.onlinePacs.ip_address + ":8080/weasis-pacs-connector/viewer?" + locate,
		    study_link2: ovyWeb,
		    study_link_mobile: ovyMob,
		    deleted: false,
		    created: new Date()
      });

      updateSession();

      function updateSession() { 
        model.user.findOne({"doctor_patient_session.session_id": req.body.radiology.session_id},{doctor_patient_session:1,firstname:1,lastname:1,title:1,phone:1,email:1})
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
	          theObj.indication = req.body.radiology.indication;
	          theObj.center_phone = req.user.phone;
	          //theObj.center_phone = req.body.radiology.indication;
	          theObj.acc = req.body.radiology.acc; //refers to the Patient ID of the dicom image e.g "APP/3623662"
	          theObj.center_profile_pic_url =  req.user.profile_pic_url;
	          theObj.files = req.body.radiology.filesUrl;
	          theObj.study_id = dcm._id; // _id of the dicom study

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
	            to: data.email,
	            subject: 'Radiology Result Received',
	            html: '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' 
	            + data.title + " " + data.lastname + ",</b><br><br>"
	 						+ "<b>" + req.user.name + "</b>" + " have sent the result of radiology investigations you requested for the patient:<br><br>"
	 						+ "<b>Name:</b> " + objectFound.patient_firstname + " " + objectFound.patient_lastname + "<br>"
              + "<b>Session ID:</b> " + objectFound.session_id  + "<br><br>" 
              + "Patient ID of study: " + req.body.radiology.studyId + "<br><br>"
              + "Study Link: " + ovyWeb + "<br><br>"
              + "Study Link Mobile: " + "https://applinic.com/dicom-mobile?id=" + dcm._id + "<br><br>"
	          	+ "Please <a href='https://applinic.com/login'>log in to your account</a> and continue treatment with the patient<br><br>"
	          	+ "You can find the treament session in which these test was referred through the following steps:<br><br>"
	          	+ " - Inside your account look for the patient by name in 'My Patients' menu.<br>"
	          	+ " - Click on the patient and select 'Treatment Session' under management then choose session or filter by session ID you wish to continue with.<br><br>"
	            + "Thank you for using Applinic.<br><br>"
	            + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
	            + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
	            + "For inquiries please call customer support on +2349080045678 or email us at support@applinic.com<br><br>"
	            + "Thank you for using Applinic.<br></br><br>"
	            + "<b>Applinic Team</b></td></tr></table>"
          	};

	          transporter.sendMail(mailOptions, function(error, info){
	            if (error) {
	              //console.log(error);
	            } else {
	              //console.log('Email sent: ' + info.response);
	            }
	          });


	          model.user.findOne({user_id: req.body.radiology.doctor_id})
	          .exec(function(err,doctor){
	          	doctor.doctor_notification.unshift({
	            	sender_id: objectFound.patient_id,
								message_id: parseInt(randos.genRef(6)),
								type: "radiology",
								date: + new Date(),
								message: "Radiology investigation report received!",
								sender_firstname: objectFound.patient_firstname,
								sender_lastname: objectFound.patient_lastname,
								sender_age: "",
								sender_gender: "",
								sender_location: "",
								sender_profile_pic_url: "",
								center_id: req.user.user_id
	            });
	            doctor.save(function(err,info){
	            	io.sockets.to(doctor.user_id).emit("get notification",{status:true});
	            })
	          })

	          // save study
	          //dcm.save(function(err,info){})

	          //save report
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
        model.user.findOne({user_id: req.body.radiology.patient_id},{medical_records: 1,patient_notification:1,user_id:1,presence:1,phone:1,email:1,title:1,firstname:1,lastname:1})
        .exec(function(err,data){
          if(err) throw err;
          var elementPos = data.medical_records.radiology_test.map(function(x) {return x.session_id; }).indexOf(req.body.radiology.session_id);
          var objectFound = data.medical_records.radiology_test[elementPos]; 

          if(objectFound) {         
	          objectFound.report = req.body.radiology.report || "Not Specified";
	          objectFound.conclusion = req.body.radiology.conclusion || "Not Specified";
	          objectFound.test_to_run = req.body.radiology.test_to_run || objectFound.test_to_run;
	          objectFound.sent_date = req.body.date || objectFound.sent_date;
	          objectFound.receive_date = req.body.radiology.date;
	          objectFound.payment_acknowledgement = true;
	          objectFound.files = req.body.radiology.filesUrl;
	          objectFound.indication = req.body.radiology.indication;
	          objectFound.acc = req.body.radiology.acc;
	          objectFound.study_id = dcm._id;

	          //var random = Math.floor(Math.random() * 999999);
	          data.patient_notification.unshift({
	            type:"radiology",
	            date: req.body.radiology.date,
	            note_id: req.body.radiology.test_id,
	            ref_id: req.body.ref_id,
	            session_id:req.body.radiology.session_id,
	            message: "Radiology report received."
	          });

	          if(data.presence === true){
	            io.sockets.to(data.user_id).emit("notification",{status:true});
	          } 

            var msgBody = "Radiology report received! login http://applinic.com/login" 
            + "\nPatient ID of study: " + req.body.radiology.studyId
            + "\nStudy Link Mobile: " + "https://applinic.com/dicom-mobile?id=" + dcm._id
            var phoneNunber =  data.phone;
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            ) 
	          

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
	            to: data.email,
	            subject: 'Radiology Result Received',
	            html: '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' + data.title + " " + data.lastname + ",</b><br><br>"
	 						+ "<b>" + req.user.name + "</b>" + " have sent the result of radiology investigations requested by your doctor<br><br>"
	 						+ "Patient ID of study: " + req.body.radiology.studyId + "<br><br>"
              + "Study Link: " + ovyWeb + "<br><br>"
              + "Study Link Mobile: " + "https://applinic.com/dicom-mobile?id=" + dcm._id + "<br><br>"
	          	+ "Kindly <a href='https://applinic.com/login'>log in to your account</a> to view the report. Check in notification bell icon for latest updates<br><br>"
	            + "Thank you for using Applinic.<br><br>"
	            + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
	            + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
	            + "For inquiries please call customer support on +2349080045678 or email us at support@applinic.com<br><br>"
	            + "Thank you for using Applinic.<br></br><br>"
	            + "<b>Applinic Team</b></td></tr></table>"
          	};

	          transporter.sendMail(mailOptions, function(error, info){
	            if (error) {
	              console.log(error);
	            } else {
	              console.log('Email sent: ' + info.response);
	            }
	          });

	          
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
    	
	    if(req.user) {
	    
	      updatePatient();

	      function updatePatient() {
		      model.user.findOne({user_id: req.body.radiology.patient_id},
		      	{medical_records: 1,patient_notification:1,user_id:1,presence:1,phone:1,firstname:1,lastname:1,title:1,email:1})
		   		.exec(function(err,data){
		        if(err) {
		        	throw err;
		        	res.end("server error");
		        }

		        if(!data){
		        	res.json({error: "Something went wrong. Seems patient was not found!"});
		        	return;
		        } 		


		          	 //create pdf form of the report
		        var html = "<div style='padding:20px;background-color:#000'>" 
		        + "<img src='https://applinic.com/assets/images/applinic1.png'>"
		        + "<h1 style='text-align:center;color:blue'>Heloo PDF are you working alone?</h1></div>";		        						
						var pdfName = topdf(html);
						var pdfPath = '/report/' + pdfName;
						      


			    	//create a dicom Study for viewing.
		        var locate = ('patientID=' + req.body.radiology.studyId);
		        var ovyWeb = "https://" + req.body.onlinePacs.dns + "/web/viewer.html?" + locate;

						var ovyMob = "http://" + req.body.onlinePacs.ip_address + ":8080/applinic-dicom/home.html?" + locate;
						var centerUser = req.body.onlinePacs.username;
						var centerPassword = req.body.onlinePacs.password;

		        var dcm = new model.study({
		        	patient_name: req.body.radiology.patient_firstname + " " + req.body.radiology.lastname,
					    patient_id: req.body.radiology.studyId,
					    study_id: req.body.radiology.studyId,
					    center_id: req.user.user_id,
					    center_name: req.user.name,
					    center_address: req.user.address,
					    center_city: req.user.city,
					    center_country: req.user.country,
					    center_phone: req.user.phone,
					    center_email: req.user.email,
					    patient_phone: req.body.radiology.patient_phone,
					    email: req.body.radiology.patient_email,
					    ip_address: req.body.onlinePacs.ip_address,
					    port: req.body.onlinePacs.port,
					    aetitle: req.body.onlinePacs.aetitle,
					    study_link: req.body.onlinePacs.ip_address + ":8080/weasis-pacs-connector/viewer?" + locate,
					    study_link2: ovyWeb,
					    study_link_mobile: ovyMob,
					    deleted: false,
					    created: new Date(),
					    //pdf_report: pdfPath,
					    ref_id: req.body.ref_id,
					    type: "radiology"
		        });

		        dcm.pdf_report.unshift({
		        	pathname: pdfPath,
		        	created: new Date()
		        });
		        req.body.pdf_report = dcm.pdf_report; 
		       
		        var elementPos = data.medical_records.radiology_test.map(function(x) {return x.ref_id}).indexOf(req.body.ref_id);
		        var objectFound = data.medical_records.radiology_test[elementPos];
		        if(objectFound) {    
			        objectFound.report = req.body.radiology.report || objectFound.report;
			        objectFound.conclusion = req.body.radiology.conclusion || objectFound.conclusion;
			        objectFound.test_to_run = req.body.radiology.test_ran || objectFound.test_to_run;
			        objectFound.sent_date = req.body.date || objectFound.sent_date;
			        objectFound.receive_date = req.body.radiology.date;
			        objectFound.payment_acknowledgement = true;
			        objectFound.indication = req.body.radiology.indication;
			        objectFound.files = req.body.radiology.filesUrl;
			        objectFound.acc = req.body.radiology.acc;
			        objectFound.study_id = dcm._id; // _id of the dicom study
			        objectFound.pdf_report = dcm.pdf_report;//pdfPath;
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
		        } 

	          var msgBody = "Radiology test result received!" 
	          + "\nReport Reference No: " + req.body.ref_id
            + "\nPatient ID of study: " + req.body.radiology.studyId 
            + "\nStudy Link Mobile: https://applinic.com/dicom-mobile?id=" + dcm._id;

	          var phoneNunber =  data.phone;
	          sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
          	);		        

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
	            to: data.email,
	            subject: 'Radiology Result Received',
	            html: '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' 
	            + data.title + " " + data.lastname + ",</b><br><br>"
	 						+ "<b>" + req.user.name + "</b>" + " have sent the result of radiology investigations you requested:<br><br>"
	 						+ "<b>Name:</b> " + data.firstname + " " + data.lastname + "<br><br>"
	 						+ "Patient ID of study: " + req.body.radiology.studyId + "<br><br>"
              + "Study Link: " + ovyWeb + "<br><br>"
              + "Study Link Mobile: " + "https://applinic.com/dicom-mobile?id=" + dcm._id + "<br><br>"
	          	+ "<a href='https://applinic.com/login'>log in to your account</a> to view the report. Check in notification bell icon for latest updates<br><br>"
	            + "Thank you for using Applinic.<br><br>"
	            + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
	            + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
	            + "For inquiries please call customer support on +2349080045678 or email us at support@applinic.com<br><br>"
	            + "Thank you for using Applinic.<br></br><br>"
	            + "<b>Applinic Team</b></td></tr></table>"
          	  };

	          transporter.sendMail(mailOptions, function(error, info){
	            if (error) {
	              console.log(error);
	            } else {
	              console.log('Email sent: ' + info.response);
	            }
	          });

	          //save study for viewing
	          dcm.save(function(err,info){})

	          //save report.
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
		      				console.log("service details saved!");
		      			});

		      			res.json({status: "success"});
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
			model.user.findOne({user_id:req.user.user_id},{ewallet:1},function(err,data){
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





	/** bank details add management ***/

	router.get("/user/bank-details",function(req,res){
		if(req.user){
			res.send(req.user.bank_details);
		} else {
			res.end("unathorized access!");
		}
	})


	router.post("/user/bank-details",function(req,res){
		if(req.user){
			model.user.findById(req.user._id)
			.exec(function(err,user){
				if(err) throw err;
				user.bank_details.push(req.body);
				user.save(function(err,info){
					console.log("bank details added");
					res.send({status: true})
				})
			})
		} else {
			res.end("unathorized access!");
		}
	});

	router.delete("/user/bank-details",function(req,res){
		if(req.user){
			model.user.findById(req.user._id)
			.exec(function(err,user){
				console.log(user.bank_details);
				var toNum = parseInt(req.query.id);
				var elemPos = user.bank_details.map(function(x){return x.id}).indexOf(toNum);
				if(elemPos !== -1){
					var found = user.bank_details.splice(elemPos,1);
					console.log(found);
					res.send({status:true,index:elemPos});
				} else {
					res.send({status:false});
				}
				user.save(function(err,info){});
				
			})
		} else {
			res.end("unathorized access!");
		}
	})


	//user cashing out some money from wallet.
	router.post("/user/cashout",function(req,res){
		if(req.user){
			if(!req.body.otp) {
				res.send({message: "Authentication is required before request can be submitted."});
				return;
			} else {
				model.otpSchema.findOne({otp: req.body.otp})
				.exec(function(err,data){
					if(data){
						authSuccess()
						data.remove(function(){})
					} else {
						res.send({message: "Authentication failed.Please make sure you entered the right OTP and try again."});
					}
				})
			}

			function authSuccess() {
				var userId = (!req.body.userId) ? req.user.user_id : req.body.userId;
				model.user.findOne({user_id:userId},{ewallet:1}).exec(function(err,wallet){
					if(err) throw err;
					if(wallet.ewallet.available_amount >= req.body.amount) {
						wallet.ewallet.available_amount -= req.body.amount;					
						wallet.save(function(err,info){
							if(err) {
								res.json({message: "Error occured! Please try again later."});
							} else {
								allClear(wallet.ewallet.available_amount);
							}
						});				
					} else {
						res.send({message: "Request rejected!! Reason: Amount you entered is more than available balance."});
					}
				});
			}

			function allClear(wallet) {
				var random = randos.genRef(12);
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
					phone: req.user.phone,
					account_type: req.body.account_type,
					verified: false,
					title: req.user.title,
					email: req.user.email,
					attended: false
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
					phone: req.user.phone,
					account_type: req.body.account_type
				})

				var msgbody = "<div style='font-size:14px;line-height:25px'>Hello, <b>" + req.user.name + "</b> with ID <b>" + req.user.user_id  
				  + " </b> Phone number " + req.user.phone + "<br>"  
		          + " has requested to cashout some amount of money"
		          + " from his wallet <br><br>"
		          + "<a href='https://applinic.com/login'>Please Attend to the request</a>" 
		          + "</div>"


				CashObj.save(function(err,info){
					if(err) throw err;
					var mailOptions = {
	                  from: 'Applinic info@applinic.com',
	                  to: ['info@applinic.com','chimarhotex@gmail.com'],
	                  subject: 'Cashout Request From ' + req.user.name,
	                  html: msgbody
	                };

	                transporter.sendMail(mailOptions, function(error, info){
	                  if (error) {
	                    console.log(error);
	                  } else {
	                    console.log('Email sent: ' + info.response);
	                  }
	                });
				});

				res.send({message: "Request accepted! Transaction may take up to 24hrs to complete.",balance:wallet});
			}

		} else {
			res.send("Unauthorized access!");
		}
	});

router.get("/user/cashout",function(req,res){
	if(req.user && req.user.user_id === process.env.ADMIN_ID){
		
		if(!req.query.type) {
			model.cashout.find({verified: false,attended: false},function(err,list){
				if(err) throw err;
				res.send(list)
			})
		} else {
				model.cashout.find({user_id: req.query.id},function(err,list){
					if(err) throw err;
					res.send(list)
				})
		}
	} else {
		if(req.query.id) {
				model.cashout.find({user_id: req.query.id,verified: false,attended: false},function(err,list){
					if(err) throw err;
					res.send(list)
				})
		} else {
			res.send("Unauthorized access!")
		}
		
	}
});

router.put("/user/cashout",function(req,res){
	if(req.user && req.user.user_id === process.env.ADMIN_ID){
		model.cashout.findById(req.body.id)
		.exec(function(err,data){
			if(err) throw err;
			if(data){
				data.attended = true;
				data.verified = true;
				confirmation_date: new Date();
				data.save(function(err,info){
					if(err) {
						throw err;
						res.json({message: "Error occured"});
					}
					if(info){
						res.json({status: true,message: "This transaction has been completed!"})
					} else {
						res.json({message: "Error occured will verifying transaction.Please try again."})
					}
				})
			} else {
				res.json({message: "Error: This transaction ID does not exist."})
			}
		})
		
	} else {
		res.end("Unauthorized access!");
	}
});

router.get("/user/settled-cashout",function(req,res){
	if(req.user && req.user.user_id === process.env.ADMIN_ID){
		model.cashout.find({verified: true,attended: true})
		.exec(function(err,data){
			if(err) throw err;
			res.json(data);
		});
	} else {
		res.end("Unauthorized access!");
	}
})

router.put("/user/settled-cashout",function(req,res){
	if(req.user && req.user.user_id === process.env.ADMIN_ID){
		model.cashout.findById(req.body.id)
		.exec(function(err,data){
			if(err) throw err;
			if(data){
				data.attended = false;
				data.verified = false;
				data.save(function(err,info){
					res.json({status:true,message:"transaction re-opened"})
				})
			} else {
				res.json({message: "Error occured, cannot reopen"})
			}
		});
	} else {
		res.end("Unauthorized access!");
	}
})

router.post("/user/courier/payment-confirmation",function(req,res){
	if(req.user){
		if(req.body.otp) {
			model.otpSchema.findOne({otp: req.body.otp})
			.exec(function(err,data){
				if(err) throw err;
				if(data){
					if(data.amount <= req.user.ewallet.available_amount){
						model.courier.findById(req.body.courier_id)
						.exec(function(err,courier){
							if(err) throw err;
							if(courier) {
								var mediScroll = new model.scroll({
									amount: data.amount,
									amount_str: req.user.currencyCode + "" + data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
									debitor: req.user.user_id,
									creditor: req.body.centerId,
									start_date: new Date(),
									courier_id: req.body.courier_id, // refers to _id of the subject obj
									order_id : courier.request_id, // refers to generated id of the subject obj also called request ID
									type: "courier",
									deleted: false,
									delivery_charge: courier.delivery_charge
								});
								
								req.user.ewallet.available_amount -= data.amount;

								courier.is_paid = true;

								courier.save(function(){
								  if(err) throw err;

								})
									
								mediScroll.save(function(){})

								data.remove(function(){});
								
								req.user.save(function(err,info){
									if(err) throw err;									
									res.json({message: "Payment made successfully!",status: true})
								});
							} else {
								res.send({});
							}
						})
						
					} else {
						res.send({message: 
							"Oops! Seems you have insufficient fund in your account to pay for this service. Please fund your MediPay wallet and try again.",
							status: false});
					}
				} else {
					res.send({message: "The pin you entered is incorrect",status:false});
				}
			})
		} else {
			res.send({message: "Please enter the OTP sent to you via SMS.",status: false});
		}
	} else {
		res.end("Unauthorized access!");
	}
})

router.put("/user/field-agent",function(req,res){ 
	model.agent.findById(req.body.agentId)
	.exec(function(err,agent){
		if(err) throw err;
		if(agent || req.user.user_id === agent.center_id){ //agent or center cn verify a courier delivery
		
			model.scroll.findOne({order_id: req.body.order,courier_id: req.body.courierId,
				creditor:req.body.creditorId,debitor:req.body.debitorId,deleted:false})
			.exec(function(err,scroll){
				if(err) throw err;
				if(scroll){
						scroll.end_date = new Date();
						scroll.deleted = true;
						model.courier.findById(req.body.courierId)
						.exec(function(err,courier){
							if(err) throw err;
							if(courier){
								courier.completed = true;
								courier.receipt_date = + new Date();
								var toNum = parseInt(courier.total_cost);
								io.sockets.to(courier.user_id).emit("courier billed",
									{status:true,_id:courier._id,message: "Success! Delivery agent has confirmed you have received the package.",isConfirm: true});
								var pay = new Wallet(courier.receipt_date,courier.firstname,courier.lastname,"courier billing");
        				pay.courier(model,courier.center_id,courier.user_id,toNum,io,courier.delivery_charge,courier.city_grade,sms,courier.center_charge);

         				//user_id refers to the patient,center_id refers to the center,toNum refrs to amount
								courier.save(function(err,info){});
								//remove courier from agent List
								var elemPo = agent.couriers.map(function(x){return x._id.toString()}).indexOf(req.body.courierId);
								if(elemPo !== -1){
									agent.couriers.splice(elemPo,1);
								}

								agent.save(function(err,info){
									//console.log("courier removed from field agent's list");
								});
							}
						})
						scroll.save(function(err,info){});
						res.json({message: "Verification successfully!",status:true});
				} else {
					res.json({message: "Error: No record for this service was found in mediscroll",status: false})
				}
			})
		} else {
			res.send({status: false, message: "You are not allowed to confirm this transaction."});
		}
	});
	  
});

router.get("/user/outpatient-billing",function(req,res){
	if(req.user){
	  if(req.query.billId) {
	    model.outPatientBilling.findOne({bill_id: req.query.billId},function(err,bill){
		  	if(err) throw err;
		  	if(bill) {
		  		res.json(bill);
		  	} else {
		  		res.send({});
		  	}
	   })
  	} else if(req.query.patientId){
  		model.outPatientBilling.find({patient_id: req.query.patientId,sender_id: req.user.user_id})
  		.exec(function(err,bill){
		  	if(err) throw err;		  	
		  	res.json(bill);		  	
	   })
  	}
	} else {
		res.end("Unauthorized access!!");
	}
});

router.post("/user/outpatient-billing",function(req,res){	
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

		console.log(bill)

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

	  	

	  	patient.save(function(err,info){
	  		if(err) throw err;
	  		console.log("patient's mail saved!");
	  		if(patient.presence) {
		  		io.sockets.to(req.body.patientId).emit("message notification",{status: true});
		  	}
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
		
		model.otpSchema.findOne({user_id: req.user.user_id,otp: req.body.otp},function(err,data){
			if(err) throw err;
			if(data) {
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


router.post("/user/dicom-details",function(req,res){
	if(req.user) {
	
		var rados;
		if(req.body.isAcc) {
		  rados = "A" + randos.genRef(8);
		  var date = new Date();
		  var acc = new model.accession({
		    id: rados,
		    centerId: req.body.center.user_id,
		    date: date
		  });

		  acc.save(function(err,info){});

		  req.body.patientID = rados

		} else {
			rados = null;
		}

		var id =  req.body.studyID || req.body.patientID;

		var criteria = {$or: [{ study_id : id},{study_uid: id}]};//{ study_id : id};

		model.study.find(criteria)
		.exec(function(err,result){
			if(err) throw err;
			if(result.length == 0){
				createStudy()
			} else {
				res.json({status: false,message:"Study ID already exist."});
			}
		});


		function createStudy() {
			var locate = (req.body.studyID) ? ('studyUID=' + req.body.studyID) : ('patientID=' + req.body.patientID);
			var ovyWeb = "https://applinic.com/dcm?id=" + id; //"https://" + req.body.onlinePacs.dns + "/web/viewer.html?" + locate;
			var ovyMob = "http://" + req.body.onlinePacs.ip_address + ":8080/applinic-dicom/home.html?" + locate;
			var centerUser = req.body.onlinePacs.username;
			var centerPassword = req.body.onlinePacs.password;

		  var study = new model.study({
		    patient_name: req.body.patientName,
		    patient_id: req.body.patientID,
		    study_id: req.body.patientID,
		    study_uid: req.body.studyID,
		    center_id: req.user.user_id,
		    center_name: req.user.name,
		    center_address: req.user.address,
		    center_city: req.user.city,
		    center_country: req.user.country,
		    center_phone: req.user.phone,
		    center_email: req.user.email,
		    created: date,
		    patient_phone: req.body.patientPhone,
		    email: req.body.patientEmail,
		    patient_age: req.body.patientAge || "",
		    patient_sex: req.body.patientSex || "",
		    ip_address: req.body.onlinePacs.ip_address,
		    port: req.body.onlinePacs.port,
		    aetitle: req.body.onlinePacs.aetitle,
		    accession_number: rados,
		    study_link: req.body.onlinePacs.ip_address + ":8080/weasis-pacs-connector/viewer?" + locate,
		    study_link2: ovyWeb,
		    study_link_mobile: ovyMob,
		    study_type: req.body.type || "",
		    study_name: req.body.studyName,
		    deleted: false,
		    created: new Date(),
		    study_date: req.body.studyDate,
		    referring_physician: req.body.referringPhysician,
		    summary: req.body.clinicalSummaryIndication,
		    referring_physician_email: req.body.referringPhysicianEmail || "",
		    referring_physician_phone: req.body.referringPhysicianPhone || "",
		    attended: false,
		    assigned_radiologist_id: req.body.reporters,
		    remark: req.body.remark || "",
		    id_of_ref_dumped: (req.body.patientData) ? req.body.patientData._id : ""
		  })

		  study.study_link_mobile = "https://applinic.com/dicom-mobile?id=" + study._id;
		  study.study_link2 += "&key=" + study._id;

		  if(req.body.isUserConnectLinking) {
		  	study.isUserConnectLinking = true;			  
		  	// keep the referral details. Works for existing patients in the platform
		    study.referral_detail_dump.push(req.body.patientData); 

		    // keep the referral so that doctor can see it study before report is written
		    model.session.findOne({session_id: req.body.patientData.radiology.session_id}).exec(function(err,objectFound){
		    	if(err) throw err;
		    	if(objectFound) {
		    		var pos = objectFound.diagnosis.radiology_test_results.map(function(x) { return x.test_id;})
		    		.indexOf(req.body.patientData.radiology.test_id);

		    		if(objectFound.diagnosis.radiology_test_results[pos]) {
              var theObj = objectFound.diagnosis.radiology_test_results[pos];         
              theObj.study_ref_id = study._id;
              theObj.patient_id_of_study = study.patient_id;
              theObj.mobile_viewer_path = study.study_link_mobile;
              theObj.web_viewer_path = study.study_link2;
            } 

            objectFound.save(function(err,info){
            	if(err) throw err;            	
            })            
		    	}
		    });
		  }

		  study.save(function(err,info){
		  	if(err){
		  		throw err;
		  		res.end("error occured");
		  	} else {			  		
		  		var msg = (rados || id) + " - dicom study upload";
				  var pay = new Wallet(date,req.user.name,"",msg,rados);
				  pay.dicom(model,req.body.amount,req.user,io);
				  var auth = id || rados;
				  res.json({acc_no: rados,status:true,studyId: auth});	

				  var redirectLink = "https://applinic.com/dicom-mobile?id=" + study._id;

				  var tp = (req.body.studyID) ? "Study Instance ID '" : "PatientID ";
				  var msgBody = "Your radiology dicom study with '" + tp + "' " + (rados || id) 
				  + " has been uploaded.\n" 
				  + "You can share or use the above Patient ID to view the study on your smart phone.\nKindly visit " + redirectLink
				  + "\nLog in with \nusername: " + centerUser + "\npassword: " + centerPassword;
					sms.messages.create(
            {
              to: req.body.patientPhone,
              from: '+16467985692',
              body: msgBody,
            },
            callBack
          );

          if(req.body.patientData) {		 
					  model.user.findOne({user_id: req.body.patientData.radiology.patient_id},{medical_records:1})
					  .exec(function(err,patient){
					  	if(err) throw err;
					  	if(patient){
					  	  var elementPos = patient.medical_records.radiology_test.map(function(x) {return x.ref_id })
					  	  .indexOf(req.body.patientData.ref_id);
	              var objectFound = patient.medical_records.radiology_test[elementPos]; 
	              if(objectFound){
	               	objectFound.mobile_viewer_path = study.study_link_mobile;
	               	objectFound.web_viewer_path = study.study_link2;
	               	objectFound.patient_id_of_study = study.patient_id || study.study_uid;
	              }
	              patient.save(function(err,info){})
					  	}
					  });
					}

          var cp = (req.body.isAcc) ? rados  : id;
          var tempLink;
          var reporterEmail;

          var webView = "https://applinic.com/dcm?id=" + id + "&key=" + study._id; //"https://dicom.applinic.com/web/viewer.html?" + locate;
          var mobileView = "https://applinic.com/dicom-mobile?id=" + study._id;

          var mailOptions = {
            from: 'Applinic Healthcare info@applinic.com',
            to: req.body.patientEmail || "info@applinic.com",
            subject: 'Radiology DICOM Study Uploaded',
            html: '<table><tr><tr><td style="line-height: 25px">Hello,<br><br>Your study with ' 
            +  tp  + " <b>" + (rados || id) + '</b> has been uploaded to our Online PACs server '
            + 'by ' + req.user.name + '. You can share or use the ID to view the study.<br>' 
            + 'username: ' + centerUser + "<br>password: " + centerPassword
            + '<br><br><div style="text-align: center">'
            + '<br><a href="' 
            + webView + '" style="padding:10px;background-color:red;color:#fff">Click to view study</a></div></td></tr></table>'
          };

          var mailOptions2 = {
            from: 'Applinic Healthcare info@applinic.com',
            to: req.body.referringPhysicianEmail || "info@applinic.com",
            subject: 'Radiology DICOM Study Uploaded for your patient',
            html: '<table><tr><tr><td style="line-height: 25px">Hello Doc,<br><br>The Investigation ( <b>' + req.body.studyName + '</b> ) ' 
            + 'you requested for the patient - <b>' + req.body.patientName + '</b> with ' 
            +  tp  + " <b>" + (rados || id) + '</b> has been uploaded to our Online PACs Server.<br>' 
            + 'The written report of this study will be emailed to you as soon as it has been submitted ' 
            + 'by the reporting radiologist(s).<br>'
            + 'Uploaded by ' + req.user.name + '.<br> You can view the study with DICOM viewer using the URLs below.<br>' 
            + "<b> Desktop Dicom Viewer URL:  " 
            +  webView + "<br> Mobile Device DICOM Viewer URL: " + mobileView + "<br>" 
            + 'username: ' + centerUser + "<br>password: " + centerPassword + '<br>'
            +  tp  + ": <b>" + (rados || id) 
            + '</b><br><br> <p><a href="www.applinic.com/signup">Create an account</a> with us and enjoy easy access to patients and medical records at all time. </p> <b>Applinic Team</b> </td></tr></table>'
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          if(req.body.referringPhysicianEmail)
	          transporter.sendMail(mailOptions2, function(error, info){
	            if (error) {
	              console.log(error);
	            } else {
	              console.log('Email sent: ' + info.response);
	            }
	          });

          // send email and sms to the reporting radiologists with links to the dicom viewer, 
          //mobile viewer and center template. If center has no template use default template.
          
          //var elemPos = req.user.reporters.map(function(x){return x.id.toString()}).indexOf(req.body.reporter);
         // if(elemPos !== -1) {


         

          function radioEmail(tempLink,email) {	          	

	          var mailOptions = {
	            from: 'Applinic Healthcare info@applinic.com',
	            to: email || "info@applinic.com",
	            subject: 'Write Report For Study - ' + req.body.studyName,
	            html: '<table><tr><tr><td style="line-height: 25px">Hi, please write report for the study below:<br><br>'
	            + 'Study: ' + req.body.studyName + "<br><br>"
	            + 'Ref: ' + study._id + "<br><br>"
	            + tp + ": " + (rados || id) + '<br><br>'
	            + "<b>Request sent from:</b> " + req.user.name + "<br>"
	            + "<b>Address:</b> " + req.user.address + ", " + req.user.city + ", " + req.user.country + "<br>"
	            + "<b>Phone:</b> " + req.user.phone + "<br><br>"
	            + "<b>Web Viewer DICOM URL:</b><br> " + webView + "<br>"
	            + "<b>Mobile Device DICOM Viewer URL:</b> <br> " + mobileView + "<br>"
	            + "<b>Report Template URL:</b> <span style='font-style:italic'>( Use this template to enter your report )</span> <br>" + tempLink + "<br>"	
	            + "<p><a href='http://167.71.149.196:8080/dcm4chee-web3/'>You can the download study folder</a> from PACs archive and open with any dicom viewer installed in your PC</p>" 
	            + "<b>Username:</b> nauth <br>"
	            + "<b>Password:</b> nauth1234 <br><br>"        
	            + "Thank you! <br><br> <b>Applinic Team</b>" 
	            + '</td></tr></table>'
	          };

	          transporter.sendMail(mailOptions, function(error, info){
	            if (error) {
	              //console.log(error);
	            } else {
	              //console.log('Email sent: ' + info.response);
	            }
	          });

          }


          var reporterEmailList = [];
          if(req.body.reporters) {
          	req.body.reporters.forEach(function(reporter){
          		tempLink = "https://applinic.com/report-template/" + reporter.id + "/" + study._id;
          		reporterEmailList.push(reporter.email);
          		radioEmail(tempLink,reporterEmailList)
          	})	          	
          }

		  	}
		  	
		  });

		  function callBack(err,info) {
		  	if(err){
		  		console.log(err)
		  	}
		  }
		}
	  } else {
	  	res.end("Unauthorized Access");
	  }
	  
});


router.post("/user/reassign-study",function(req,res){
	if(req.user){

		model.study.findById(req.body._id)
    .exec(function(err,study){
    	if(err) throw err;

    	if(study) {
			var msg = (rados || id) + " - dicom study upload";
			var rados;

			var id =  req.body.patient_id || req.body.study_uid;

			var tp = (req.body.study_uid) ? "Study Instance ID '" : "PatientID ";
						 
		  var auth = id || rados;
		  //res.json({acc_no: rados,status:true,studyId: auth});	

		  var redirectLink = "https://applinic.com/dicom-mobile?id=" + study._id;

		  /*var tp = (req.body.studyID) ? "Study Instance ID '" : "PatientID ";
		  var msgBody = "Your radiology dicom study with '" + tp + "' " + (rados || id) 
		  + " has been re-assigned to another radiologist for reporting.\n" 
		  + "You can share or use the above Patient ID to view the study on your smart phone.\nKindly visit " + redirectLink
		  + "\nLog in with \nusername: " + centerUser + "\npassword: " + centerPassword;
			sms.messages.create(
	      {
	        to: req.body.patientPhone,
	        from: '+16467985692',
	        body: msgBody,
	      },
	      callBack
	    );

	    */

	    /*var transporter = nodemailer.createTransport({
	      host: "mail.privateemail.com",
	      port: 465,
	      auth: {
	        user: "info@applinic.com",
	        pass: process.env.EMAIL_PASSWORD
	      }
	    });*/
	    // send email and sms to the reporting radiologists with links to the dicom viewer, 
	    //mobile viewer and center template. If center has no template use default template.
	    
	    //var elemPos = req.user.reporters.map(function(x){return x.id.toString()}).indexOf(req.body.reporter);
	   // if(elemPos !== -1) {

	   	var tempLink;
	    var reporterEmail;

	    var webView = "https://applinic.com/dcm?id=" + id + "&key=" + study._id; //"https://dicom.applinic.com/web/viewer.html?" + locate;
	    var mobileView = "https://applinic.com/dicom-mobile?id=" + study._id;
	   

	    function radioEmail(tempLink,email) {	          	

	      var mailOptions = {
	        from: 'Applinic Healthcare info@applinic.com',
	        to: email || "info@applinic.com",
	        subject: 'Radiology Report ' + study._id,
	        html: '<table><tr><tr><td style="line-height: 25px">Hi, please write report for the study below:<br><br>'
	        + 'Investigation: ' + req.body.study_name + "<br><br>"
	        + 'Ref: ' + study._id + "<br><br>"
	        + tp + ": " + id + '<br><br>'
	        + "<b>Web viewer DICOM url:</b><br> " + webView + "<br>"
	        + "<b>Mobile device DICOM viewer url:</b> <br> " + mobileView + "<br>"
	        + "<b>Report template url:</b> <br>" + tempLink + "<br><br>"
	        + "Center Name: " + req.user.name + "<br>"
	        + "Address: " + req.user.address + ", " + req.user.city + ", " + req.user.country + "<br><br>"
	        + "Thank you! <br><br> <b>Applinic Team</b>" 
	        + '</td></tr></table>'
	      };

	      transporter.sendMail(mailOptions, function(error, info){
	        if (error) {
	          console.log(error);
	        } else {
	          console.log('Email sent: ' + info.response);
	        }
	      });

	    }

	    if(req.body.assigned_radiologist_id.length > 0) {
	    	study.assigned_radiologist_id.splice(0);
	    	req.body.assigned_radiologist_id.forEach(function(reporter){
	    		tempLink = "https://applinic.com/report-template/" + reporter.id + "/" + study._id;
	    		reporterEmail = reporter.email;
	    		study.assigned_radiologist_id.push(reporter)
	    		radioEmail(tempLink,reporterEmail)
	    	})	

	  		study.save(function(err,info){
	  			if(err) throw err;
	  			res.json({message: 'Study re-assigned successfully. Radiologist(s) will be notified'})
	  		})
	    	       	
	    } else {
	    	res.json({message: 'No radiologist was selected'})
	    }

	  } else {
	  	res.json({message: "Study not found or does not exist"})
	  }

    })

	} else {
		res.end("unathorized access")
	}
})

router.post("/user/sharing-study",function(req,res){
	if(req.user){
		var id = req.body.patient_id || req.body.study_uid;
		var filteredEmailList = [];
		var emailReg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;
		var webView = "https://applinic.com/dcm?id=" + id + "&key=" + req.body._id;
	  var mobileView = "https://applinic.com/dicom-mobile?id=" + req.body._id;


	  for(var i = 0; i < req.body.sharingRecipientEmail.length; i++){
	   	if(emailReg.test(req.body.sharingRecipientEmail[i])){
	   		filteredEmailList.push(req.body.sharingRecipientEmail[i]);
	   	}
	  }

	  /*
		var emailReg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;

      if(emailReg.test(req.body.recepient)){
        recepient = {email: req.body.recepient, type:"Patient"}
	  */

	  if(filteredEmailList.length > 0) {
	    /*var transporter = nodemailer.createTransport({
	      host: "mail.privateemail.com",
	      port: 465,
	      auth: {
	        user: "info@applinic.com",
	        pass: process.env.EMAIL_PASSWORD
	      }
	    });*/

	    var mailOptions = {
        from: 'Applinic Healthcare info@applinic.com',
        to: filteredEmailList || "support@applinic.com",
        subject: req.body.patient_name + " " + req.body.study_name + " Radiology Result",
        html: '<table><tr><tr><td style="line-height: 25px">Hello sir, here is the patient study shared with you.<br><br>'
        + 'Investigation: ' + req.body.study_name + "<br><br>"
        + 'Ref: ' + req.body._id + "<br><br>"
        + "Patient Name : " + req.body.patient_name + "<br><br>"
        + "Patient ID of Study: "  + req.body.patient_id + '<br><br>'
        + "<b>Web viewer DICOM url:</b><br> " + webView + "<br>"
        + "<b>Mobile device DICOM viewer url:</b> <br>" + mobileView + "<br>"
        + "Center Name: " + req.user.name + "<br>"
        + "Address: " + req.user.address + ", " + req.user.city + ", " + req.user.country + "<br><br>"
        + "Thank you! <br><br> <b>Applinic Team</b>" 
        + '</td></tr></table>'
      };


      var fileFromLink = (req.body.pdf_report.length > 0) ? req.body.pdf_report[0].pathname.split('/') : [];
	    var pdfName = fileFromLink[fileFromLink.length - 1];

	    if(pdfName) {
	    	var filePath = './pdf/' + pdfName;
	    	var FILE_CONTENT = fs.readFileSync(filePath, 'base64');
	    	var buf = Buffer.from(FILE_CONTENT, 'base64');

	    	var attachment = [{
          	filename: pdfName,
          	content: buf,
          	contentType: 'application/pdf'
      		}]

      	mailOptions.attachments = attachment;
      }


      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.json({message: "Error occured while sending email. Please check and try again."})
        } else {
          console.log('Email sent: ' + info.response);
          res.json({message: "Good! Study was shared successfully."})
        }
      });

  	} else {
  		res.json({message: "Error: Seems you have entered wrong recipient email address."})
  	}


	} else {
		res.end("unathorized access")
	}

})

router.post("/user/sharing-labtest",function(req,res){
	if(req.user){
		var id = req.body.patient_id || req.body.study_uid;
		var filteredEmailList = [];
		var emailReg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;
		//var webView = "https://applinic.com/dcm?id=" + id + "&key=" + req.body._id;
	  //var mobileView = "https://applinic.com/dicom-mobile?id=" + req.body._id;

	  for(var i = 0; i < req.body.sharingRecipientEmail.length; i++){
	   	if(emailReg.test(req.body.sharingRecipientEmail[i])){
	   		filteredEmailList.push(req.body.sharingRecipientEmail[i]);
	   	}
	  }

	  if(filteredEmailList.length > 0) {
	    /*var transporter = nodemailer.createTransport({
	      host: "mail.privateemail.com",
	      port: 465,
	      auth: {
	        user: "info@applinic.com",
	        pass: process.env.EMAIL_PASSWORD
	      }
	    });*/

	    var mailOptions = {
        from: 'Applinic Healthcare info@applinic.com',
        to: filteredEmailList || "info@applinic.com",
        subject: req.body.laboratory.patient_firstname + " " + req.body.laboratory.patient_lastname + " Laboratory Test Result",
        html: '<table><tr><tr><td style="line-height: 25px">Hello, here is the patient laboratory test result shared with you.<br><br>'
        + 'Please find the attached test result PDF file.' + "<br><br>"
        + "To learn more on what we offer in Healthcare services. Visit www.applinic.com <br>"       
        + "Thank you! <br><br> <b>Applinic Team</b>" 
        + '</td></tr></table>'
      };


      var fileFromLink = (req.body.laboratory.lab_pdf_report.length > 0) ? req.body.laboratory.lab_pdf_report[0].pdf_report.split('/') : [];
	    var pdfName = fileFromLink[fileFromLink.length - 1];

	    if(pdfName) {
	    	var filePath = './pdf/' + pdfName;
	    	var FILE_CONTENT = fs.readFileSync(filePath, 'base64');
	    	var buf = Buffer.from(FILE_CONTENT, 'base64');

	    	var attachment = [{
        	filename: pdfName,
        	content: buf,
        	contentType: 'application/pdf'
    		}]

      	mailOptions.attachments = attachment;
      }

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.json({message: "Error occured while sending email. Please check and try again."})
        } else {
          console.log('Email sent: ' + info.response);
          res.json({message: "Good! Study was shared successfully."})
        }
      });

  	} else {
  		res.json({message: "Error: Seems you have entered wrong recipient email address."})
  	}

	} else {
		res.end("unathorized access")
	}

});

router.get("/user/doctor/subscription",function(req,res){

	if(req.user){
		model.plan.findOne({userId: req.user.user_id,deleted:false})
		.exec(function(err,account){
			if(err) throw err;
			if(account){
				res.json(account)
			} else {
				res.json({});
			}
		});

	} else {
		res.end("Unathorized access");
	}

});

router.post("/user/doctor/subscription",function(req,res){
	if(req.user){
		if(req.body.price <= req.user.ewallet.available_amount){
			var user = req.user;
			var firstname = req.user.firstname || req.user.name;
			var date = + new Date();

			model.plan.findOne({userId: req.user.user_id,deleted: false})
				.exec(function(err,data){
					if(err) throw err;
					if(!data){

						var dt = new Date();

						var planSchema = new model.plan({
							date: dt,
							userId: req.user.user_id,
							subscription: req.body.name,
							type: req.body.type,
							deleted: false
						})



						switch(req.body.duration) {
							case '12':
								planSchema.expirationDate = new Date(dt.getTime() + 3.416e+10);
								planSchema.expirationDate.expires = 300;	
							break;
							case '6':
								planSchema.expirationDate = new Date(dt.getTime() + 1.84e+10);
								planSchema.expirationDate.expires = 300;	
							break;
							case '3':
								planSchema.expirationDate = new Date(dt.getTime() + 1.051e+10);
								planSchema.expirationDate.expires = 300;	
							break;
							case '1':
								planSchema.expirationDate = new Date(dt.getTime() + 5.256e+9);
								planSchema.expirationDate.expires = 300;	
							break;
							default:
							break;
						}


						var plan = new Wallet(date,firstname,req.user.lastname,req.body.name);

						plan.subscription(model,req.body.price,user,io,function(balance){
							res.json({status: true, message: "Subscription upgrade was successful",plan:planSchema});
							planSchema.save(function(err,info){
								if(err) throw err;
								if(info){
									var mailOptions = {
	                from: 'Applinic info@applinic.com',
	                to: user.email,//doc.email || info@applinic.com,
	                subject: 'NOTIFICATION OF ACCOUNT UPGRADE TO PREMIUM PLAN',
	                html: '<table><tr></th></tr><tr><td style="line-height:25px">Dear ' 
	                + req.user.name + ",<br><br>You have successfully upgraded your account to " + req.body.type 
	                + " Plan for " + req.body.duration + " month(s) with a one bonus.<br>" 
	                + "This subscription will expire on " +  req.body.expireDate 
	                + ". Your account will no longer be charged per consultation fee.<br>" 
	                + "Remember to renew your subscription before then to avoid downgrade to Standard Plan.<br><br>"  
	                + "Thank you for using Applinic.<br></br><br>"
	                + "<b>Applinic Team</b></td></tr></table>"
              		};

	                transporter.sendMail(mailOptions, function(error, info){
	                  if (error) {
	                    console.log(error);
	                  } else {
	                    console.log('Email sent: ' + info.response);
	                  }
	                });
								}
							})
						});

					} else if(data.subscription == req.body.name) {

						res.json({status: false, message: "You have already subscribed to this plan"});

					} else {

						var dt = new Date();
						data.date = dt;
						data.subscription = req.body.name;
						data.type = req.body.name;

						switch(req.body.duration) {
							case '12':
								planSchema.expirationDate = new Date(dt.getTime() + 3.416e+10);
								planSchema.expirationDate.expires = 300;	
							break;
							case '6':
								planSchema.expirationDate = new Date(dt.getTime() + 1.84e+10);
								planSchema.expirationDate.expires = 300;	
							break;
							case '3':
								planSchema.expirationDate = new Date(dt.getTime() + 1.051e+10);
								planSchema.expirationDate.expires = 300;	
							break;
							case '1':
								planSchema.expirationDate = new Date(dt.getTime() + 5.256e+9);
								planSchema.expirationDate.expires = 300;	
							break;
							default:
							break;
						}

						var plan = new Wallet(date,firstname,req.user.lastname,req.body.name);

						plan.subscription(model,req.body.price,req.user,io,function(balance){
							res.json({status: true, message: "Subscription upgrade was successful",plan: data});
							data.save(function(err,info){
								if(err) throw err;
								
								var mailOptions = {
	                from: 'Applinic info@applinic.com',
	                to: req.user.email,
	                subject: 'NOTIFICATION OF ACCOUNT UPGRADE TO PREMIUM PLAN',
	                html: '<table><tr></th></tr><tr><td style="line-height:25px">Dear ' 
	                + req.user.name + ",<br><br>You have successfully upgraded your account to " + req.body.type 
	                + " Plan for " + req.body.duration + " month(s) with a one bonus.<br>" 
	                + "This subscription will expire on " +  req.body.expireDate 
	                + ". Your account will no longer be charged per consultation fee.<br>" 
	                + "Remember to renew your subscription before then to avoid downgrade to Standard Plan.<br><br>"  
	                + "Thank you for using Applinic.<br></br><br>"
	                + "<b>Applinic Team</b></td></tr></table>"
              	};

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
							})
						});
					}

				})


		} else {
			res.json({status: false, message: "Oops! You have insufficient balance to continue with this upgrade. Please fund your wallet."})
		}
	} else {
		res.send("unathorized Access!");
	}
});

router.delete("/user/doctor/subscription",function(req,res){
	if(req.user){
		model.plan.findOne({userId: req.user.user_id,deleted:false})
		.exec(function(err,account){
			if(err) throw err;
			if(account){
				account.deleted = true;
				account.save(function(err,info){
					if(err) throw err;
					res.json({status: true,message: "Plan downgraded successfully!",plan:{}});

					var mailOptions = {
            from: 'Applinic info@applinic.com',
            to: 'ede.obinna27@gmail.com',
            subject: 'NOTIFICATION OF DOWNGRADE OF YOUR  APPLINIC ACCOUNT',
            html: '<table><tr></th></tr><tr><td style="line-height:25px">Dear ' 
            + req.user.name + ",<br><br>You have successfully downgraded your account on Applinic to the Standard Plan." 
            + "<br>"
            + "You are now on the Standard plan which is a Pay as You go package that requires 10% service charge per "
            + "consultation fee paid by patient on the platform. <br>" 
            + "If you want to continue on this plan, please ignore this mail..<br>" 
            + "To upgrade to a Premium Plan which charges once per selected period " 
            + "<a href='https://applinic.com/user/doctor'>log into</a> your dashboard to upgrade." 
            + "<br><br>"  
            + "Thank you for using Applinic.<br></br><br>"
            + "<b>Applinic Team</b></td></tr></table>"
        	};

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
				})
			} else {
				res.json({status: false,
				 message: "Oops! Something went wrong while processing your request. Maybe the plan does not exist."});
			}
		});

	} else {
		res.end("Unathorized access");
	}

});

/*

var planSchema = Schema({
		expirationDate: {
			type: Date,
			expires: Number
		},		
		createdAt: {
			type: Date,
			expires: Number
		},
		date: Date,
		userId: String,
		subscription: String,
		amount: String
	})

 var date = new Date();
					      otp.expirationDate = new Date(date.getTime() + 300000);
					      otp.expirationDate.expires = 300;			  


category: '12 Months',
  price: 25550,
  duration: 12,
  name: 'Premium Plan Subscription'
*/


}

module.exports = basicPaymentRoute;




//note to save transaction of previously registered people will error because the model of the date field in the transaction
//object has been changed to "Number" from "string" user for test are naza@gmail.com and cy@gmail.co. this two users don't error during
//saving of transaction because they registered after the field has changed to "number"