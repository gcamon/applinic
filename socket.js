"use strict";

var uuid = require("uuid");
var connects = {}
module.exports = function(model,io,streams) {    
  io.sockets.on('connection', function(socket){  	   
	    console.log('a user connected');
	    var user = {};

	    socket.on('join', function (data) {
	    	user.isPresent = true; //use to check presence of user without hitting the database.
	      socket.join(data.userId);
	     	connects[socket.id] = data.userId;
	     	//this will be reviewd later in terms of performance on the client.
	    });

	    //for pwr join a room for real time update
	    socket.on("pwr join",function(data){
	    	socket.join("pwr");
	    })


	    socket.on('courier join', function (data) {
	      socket.join(data.id);      
	      console.log("room created for courier service");
	    });

	    /**secr****/
	    socket.on('join_secr',function(data){
	    	var roomId = process.env._NAME || data.user_id;
	    	socket.join(roomId);  
	    });

	  
	    //creat chat enable process for the user and the receiver
  		socket.on("init chat",function(data,cb){
  			var chatId = data.userId + "/" + data.partnerId; //creates chat id for the user and a partner to be saved in the database.
	      model.chats.findOne({chat_id:chatId},function(err,chat){
	      	if(err) throw err;
	      	if(!chat){
	      		var date = + new Date();    		
	      		var newChat = new model.chats({
	      			status: false,
	      			date_created: date,
	      			chat_id: chatId,
	      			realTime: date,
	      			type:"chat",
	      		});
	      		model.user.findOne({user_id: data.partnerId},function(err,partner){
	      			if(err) throw err;
	      			newChat.userId = data.userId; //user.user_id;
	      			newChat.partnerId = data.partnerId;
	      			newChat.name = partner.name || partner.firstname; // this refers the the parner name not the owner  of this chat
	      			newChat.profilePic = partner.profile_pic_url;
	      			newChat.partnerType = partner.type;
	      			newChat.save(function(err,info){});
	      		});
	      		cb({messages:[]});	      		
	      	} else {
	      		cb(chat);
	      	}
	      });
  		});

  		socket.on('init chat single',function(data,cb){
  			console.log(data)
  			var chatId = data.userId + "/" + data.partnerId;
  			model.chats.findOne({chat_id:chatId},function(err,chat){
	      	if(err) throw err;
	      	if(!chat){
	      		var date = + new Date();    		
	      		var newChat = new model.chats({
	      			status: false,
	      			date_created: date,
	      			chat_id: chatId,
	      			realTime: date,
	      			type:"chat",
	      		});
	      		model.user.findOne({user_id: data.partnerId},function(err,partner){
	      			if(err) throw err;
	      			newChat.userId = data.userId; //user.user_id;
	      			newChat.partnerId = data.partnerId;
	      			newChat.name = partner.name || partner.firstname; // this refers the the parner name not the owner  of this chat
	      			newChat.profilePic = partner.profile_pic_url;
	      			newChat.partnerType = partner.type;
	      			newChat.save(function(err,info){});
	      		});
	      		cb({status: true});	      		
	      	} else {
	      		cb({status: true});
	      	}
	      });
  		})

  	


	    socket.on("send message",function(data,cb){
	    	var date = + new Date();
	    	data.date = date.toString();
	    	data.id = data.date;
	      cb(data);
	       model.user.findOne({user_id: data.to},{set_presence:1},function(err,Obj){
	       	if(err) throw err;
	       	var checkBlocked = Obj.set_presence.particular.indexOf(data.from);	       	
	       	if(checkBlocked === -1){	       		
	       		if(Obj.set_presence.general === true) {		       			          			
	       			io.sockets.to(data.to).emit('new_msg',data);
	       		}
	       	}	       	
	       });
	      //save chats
	      var chatId = data.from + "/" + data.to;
	    	var otherId = data.to + "/" + data.from;
	    	model.chats.findOne({chat_id: chatId},{messages:1,realTime:1}).exec(function(err,chats){
	    		if(err) throw err;
	    		if(chats) {
		    		var msg = {}	  
		    		msg.sent = data.message;
		    		msg.time = data.date;
		    		msg.isSent = false;
	      		msg.isReceived = false;
	      		msg.id = data.date;	
	      		chats.realTime = + new Date();
		    		chats.messages.push(msg);
		    		chats.save(function(err,info){
		    			if(err) throw err;
		    		
		    		});
	    		}
	    	});

	    	model.chats.findOne({chat_id: otherId},{messages:1}).exec(function(err,chats){
	    		if(err) throw err;
	    		var msg = {}	  
	    		msg.received = data.message;
	    		msg.time = data.date;
      		msg.id = data.date;	
	    		if(chats) {	
	    			chats.is_read = false;  // added to check when a chat is read.  		    		
		    		chats.messages.push(msg);
		    		chats.save(function(err,info){
		    			if(err) throw err;		    			
		    		});
	    		} else {
	    			var date = + new Date();    		
	      		var newChat = new model.chats({
	      			status: false,
	      			date_created: date,
	      			chat_id: otherId,
	      			type:"chat",
	      		});
	      		model.user.findOne({user_id: data.from},function(err,user){
	      			if(err) throw err;
	      			newChat.userId = data.to;
	      			newChat.partnerId = user.user_id;
	      			newChat.realTime = date;
	      			newChat.name = user.name || user.title + " " + user.firstname; // refers tp parner name
	      			newChat.profilePic = user.profile_pic_url;
	      			newChat.is_read = (!data.presence) ? false : true; // added to check when a chat is read.
	      			newChat.partnerType = user.type;
	      			newChat.messages.push(msg)
	      			newChat.save(function(err,info){});
	      		});	      		
	    		}
	    	});

	    });


	    socket.on("send message general",function(data,cb){     	

	     	var chatId = data.from + "/" + data.to;
	    	var otherId = data.to + "/" + data.from;
	    	var date = + new Date();
	    	data.date = date.toString();
	    	data.id = data.date;
	    	data.chatId = chatId;
	    	data.opponentId = otherId;
	      cb(data);

	      io.sockets.to(data.to).emit('new_msg',data);	       	
	       
	      //save chats
	     
	    	model.chats.findOne({chat_id: chatId},{messages:1,realTime:1}).exec(function(err,chats){
	    		if(err) throw err;
	    		if(chats) {
		    		var msg = {}	  
		    		msg.sent = data.message;
		    		msg.time = data.date;
		    		msg.isSent = false;
	      		msg.isReceived = false;
	      		msg.id = data.date;	
	      		chats.realTime = + new Date();
		    		chats.messages.push(msg);
		    		chats.save(function(err,info){
		    			if(err) throw err;		    		
		    		});
	    		}
	    	});

	    	model.chats.findOne({chat_id: otherId},{messages:1,realTime:1}).exec(function(err,chats){
	    		if(err) throw err;
	    		var msg = {}	  
	    		msg.received = data.message;
	    		msg.time = data.date;
      		msg.id = data.date;	
	    		if(chats) {	
	    			chats.realTime = + new Date();
	    			chats.is_read = false; // added to check when a chat is read.  			
		    		chats.messages.push(msg);
		    		chats.save(function(err,info){
		    			if(err) throw err;		    			
		    		});
	    		} else {
	    			var date = + new Date();    		
	      		var newChat = new model.chats({
	      			status: false,
	      			date_created: date,
	      			chat_id: otherId,
	      			type:"chat",
	      		});
	      		model.user.findOne({user_id: data.from},function(err,user){
	      			if(err) throw err;
	      			if(user) {
		      			newChat.userId = data.to;
		      			newChat.partnerId = user.user_id;
		      			newChat.realTime = date;
		      			newChat.name = user.name || user.title + " " + user.firstname;
		      			newChat.profilePic = user.profile_pic_url;
		      			newChat.partnerType = user.type;
		      			newChat.is_read = (!data.presence) ? false : true; // added to check when a chat is read.
		      			newChat.messages.push(msg)
		      			newChat.save(function(err,info){});
	      			}
	      		});	      		
	    		}
	    	});

	    });

	    socket.on("seen chat",function(data){ // for general chat when a chat from the list is viewed/clicked.
	    	model.chats.findById(data.id)
	    	.exec(function(err,chat){
	    		if(err) throw err;
	    		if(chat) {
		    		chat.is_read = true;
		    		chat.save(function(err,info){})
	    		}
	    	})
	    });

	    //when user is not currently viewing or replying to chats in the general chats view it sets incoming messages as not seen
	    socket.on("chat in-view",function(data){
	    	model.chats.findOne({chat_id: data.opponentId})
	    	.exec(function(err,chat){
	    		if(err) throw err;
	    		if(chat){
	    			chat.is_read = true;
	    			chat.save(function(err,info){});
	    		}
	    	})
	    });

	    socket.on("isSent",function(data,cb){
       	data.isSent = true;
       	cb(data.isSent);
      });

	    socket.on("msg received",function(data){
	    	data.isReceived = true;
	    	io.sockets.to(data.to).emit("isReceived",data)
	    });

	    socket.on("user typing",function(data){
	    	//if(user.isPresent === true)
	    	io.sockets.to(data.to).emit('typing',data);	      
	    });

	    socket.on("save message",function(data){
	    	var chatId = data.userId + "/" + data.partnerId;
	    	var otherId = data.partnerId + "/" + data.userId;
	    	model.chats.findOne({chat_id: chatId},{messages:1}).exec(function(err,chats){
	    		if(data.hasOwnProperty('$$hashKey'))
	    			delete data['$$hashKey'];
	    		chats.messages.push(data);
	    		chats.save(function(err,info){
	    			if(err) throw err;
	    			console.log("chat saved!!!");
	    		});
	    	});

	    	model.chats.findOne({chat_id: otherId},{messages:1}).exec(function(err,chat){
	    		if(err) throw err;

	    	})
	    });
	    /*
	 var date = + new Date();
    var msg = {};
    msg.time = date;
    msg.received = data.message;
	    */
	    //for blocking a user
	    socket.on("block user",function(data){
	    	model.user.findOne({user_id:data.userId},{set_presence:1}).exec(function(err,user){
	    		if(err) throw err;
	    		user.set_presence.particular.push(data.defaulter) // defaulter is the the user-id of the person to be blocked.
	    		user.save(function(err,info){
	    			console.log("somebody blocked!")
	    		})
	    	})
	    });

	    //for unblocking a user
	    socket.on("unblock user",function(data){
	    	model.user.findOne({user_id:data.userId},{set_presence:1}).exec(function(err,user){
	    		if(err) throw err;
	    		var index = user.set_presence.particular.indexOf(data.defaulter) // defaulter is the the user-id of the person to be blocked.
	    		var person = user.set_presence.particular.splice(index,1);
	    		user.save(function(err,info){
	    			console.log( person + " unblocked!")
	    		})
	    	})
	    })

	    socket.on("set presence",function(data,cb){
	    	model.user.findOne({user_id:data.userId},{set_presence:1,presence:1}).exec(function(err,user){
	    		if(err) throw err;
	    		if(data.status === "online"){
	    			user.set_presence.general = true;
	    			user.presence = true;
	    			user.isPresent = true;
	    			cb({status: true})
	    		} else if(data.status === "offline"){
	    			user.set_presence.general = false;
	    			user.presence = false;
	    			cb({status: false});
	    			user.isPresent = false;
	    		}

	    		user.save(function(err,info){})
	    	})
	    })

	    socket.on("doctor connect",function(data){
	    	model.user.find({"accepted_doctors.doctor_id": data.userId,type:"Patient"},{user_id:1},function(err,list){
	    		if(err) throw err;
	    		var status = {presence: true,doctor_id:data.userId};
	    		user.isPresent = true;
	    		list.forEach(function(user){	    			
	    			io.sockets.to(user.user_id).emit("doctor presence",status);
	    		})
	    	})
	    });

	    socket.on("doctor disconnect",function(data){
	    	model.user.find({"accepted_doctors.doctor_id": data.userId,type:"Patient"},{user_id:1},function(err,list){
	    		if(err) throw err;
	    		var status = {presence: false,doctor_id:data.userId};
	    		user.isPresent = false;
	    		list.forEach(function(user){	    			
	    			io.sockets.to(user.user_id).emit("doctor presence",status);
	    		})
	    	})
	    });

			socket.on("patient connect",function(data){
				model.user.find({"doctor_patients_list.patient_id": data.user_id,type:"Doctor"},{user_id:1},function(err,list){
	    		if(err) throw err;
	    		var status = {presence: true,patient:data};
	    		user.isPresent = true;
	    		list.forEach(function(user){	    			
	    			io.sockets.to(user.user_id).emit("patient presence",status);
	    		})
	    	});
	    });

	    socket.on("patient disconnect",function(data){
	    	model.user.find({"doctor_patients_list.patient_id": data.user_id,type:"Doctor"},{user_id:1},function(err,list){
	    		if(err) throw err;
	    		var status = {presence: false,patient:data};
	    		user.isPresent = false;
	    		list.forEach(function(user){	    			
	    			io.sockets.to(user.user_id).emit("patient presence",status);
	    		});
	    	})
	    });

	    //
			//video logic this will be moved to a new server
			//sending video or audio request
			socket.on("convsersation signaling",function(req,cb){

				model.user.findOne({user_id:req.to},{set_presence:1,firstname:1,title:1,type:1,name:1},function(err,user){
					if(err) throw err;
					var names = user.name || user.title + " " + user.firstname;
					if(user.set_presence.general && user.type === "Doctor") {
						//{type:req.type,message:req.message,time:req.time}
						io.sockets.to(req.to).emit("receive request",{message: req.title + " " + 
							req.name + " wants to have video chat with you!",from: req.from});
						cb({message:"Video call request has been sent to " + names})
					} else if(user.type === "Patient") {
						io.sockets.to(req.to).emit("receive request",{message: req.title + " " + 
							req.name + " wants to have video chat with you!",from: req.from});
						cb({message:"Video call request has been sent to " + names})
					} else {
						var msg = names + " is currently not available.Your request has been qeued for attendance.";
		    		cb({message: msg});
					}
				});			
			});

			// this refers to appointment signaling from patient to meet in-person with his doctor.
			socket.on("appointment signaling",function(req,cb){
				model.user.findOne({user_id: req.to},{doctor_notification:1,presence:1})
				.exec(function(err,data){
					if(err) {
						cb({status: false,message: "Oops! Error occured while sending request."})
						throw err;
					} else {
						data.doctor_notification.push(req);
						cb({status:true,message: "Meet in-person request sent successfully."})
						if(data.presence){
							io.sockets.to(req.to).emit("received in-person request",{status:true,data: req})
						}
						data.save(function(err,info){
							if(err) throw err;
							console.log("meet inperson request saved!")
						})
					}					
				})
			})

			socket.on("convsersation invitation signaling",function(req,cb){
				model.user.findOne({user_id:req.to},{set_presence:1,firstname:1,title:1,type:1,presence:1,name:1},function(err,user){
					if(err) throw err;
					var names = user.name || user.title + " " + user.firstname;
					if(user.set_presence.general && user.presence) {
						//{type:req.type,message:req.message,time:req.time}
						io.sockets.to(req.to).emit("receive invitation request",{message: req.title + " " + 
							req.name + " wants to have video conference with you!",from: req.from,controlId:req.controlId});
						cb({message:"Video call request sent to " + names})
					} else if(user.presence) {
						io.sockets.to(req.to).emit("receive invitation request",{message: req.title + " " + 
							req.name + " wants to have video conference with you!",from: req.from,controlId:req.controlId});
						cb({message:"Video call request sent to " + names})
					} else {
						
						var msg = names + " is currently not available.Your request is qeued for attendance."
		    		cb({message: msg});
					}

				});			
			});

			/*
			model.control.findOne({controlId: details.controlId}).exec(function(err,control){
						if(err) throw err;
						if(control) {
							streams.addStream(socket.id, details.name, details.controlId,model);
							cb({controlUrl: control.controlUrl});
						}
					})
			*/

			socket.on("conversation invitation acceptance",function(details,cb){
				//will be modified to accomadate other chosen time							
				model.control.findOne({controlId: details.controlId}).exec(function(err,control){
					if(err) throw err;
					console.log(control)
					if(control) {
						streams.addStream(socket.id, details.name, details.controlId,model);						
						cb({controlUrl: control.controlUrl});
					}
				});

			});

			socket.on("conversation acceptance",function(details,cb){
				//will be modified to accomadate other chosen time							
				switch(details.time){
					case "now":
					  var controlId = genRemoteId();
						var createUrl = "/user/cam/" + controlId;
						saveControlControl(createUrl,controlId,details);						
						io.sockets.to(details.to).emit("video call able",{controlUrl: createUrl,message: details.title +
						" " + details.name + " is waiting to have video conference with you!"});
						cb({controlUrl: createUrl});
					break;
					default:
					break;
				}
			});

			function genRemoteId() {
				return uuid.v1();
			}

			function saveControlControl(controlUrl,controlId,details) {
				var control = new model.control({
					controlId: controlId,
					controlUrl: controlUrl,
					streams: []
				});

				var date = new Date();
			  control.expirationDate = new Date(date.getTime() + 300000);
			  control.expirationDate.expires = 36000; //10 hours before the control data is deleted.
				control.save(function(){});
			}

			socket.on("call reject",function(details){
				console.log('Cecking out details +========', details)
				io.sockets.to(datails.to).emit("convserstion denied",details)
			});


		//webrtc data transfer logic
		console.log('-- ' + socket.id + ' joined --');
    socket.emit('id', socket.id);

    socket.on('message', function (details,cb) {
      var othersocket = io.sockets.connected[details.to];
      
      if (!othersocket) {
      	cb({status:false});
        return;
      }
      delete details.to;
      details.from = socket.id;
      othersocket.emit('message', details);
    });
      
   

    // gets te control to join a room
    socket.on("control join",function(control,cb){
    	socket.join(control.control); //control.joins a roo
    	cb(control);
    	//streams.addStream(socket.id,control.name,control.control,model);
    })

    socket.on('readyToStream', function(options,cb) {
      console.log('-- ' + socket.id + ' is ready to stream --');
      console.log(options);
      //search database to see which control this socket belong to.
      streams.addStream(socket.id, options.name, options.controlId,model,options.userId,options.profile_pic_url,options.type,options.specialty);
      //socket.join(options.controlId); //create a room for common sites using one control.
      //io.sockets.to(options.controlId).emit("new stream added",{message:"new stream",controlId:options.controlId});
      cb({controlId:options.controlId});
    });

    socket.on("init reload",function(data){
    	console.log("==================");
    	console.log(data);
    	io.sockets.to(data.controlId).emit("reload streams",{status:true,name:data.names,userId:data.userId});
    })
    
    socket.on('update', function(options) {
      streams.update(socket.id, options.name);
    });

    //doc sent new investigation to the room during video chat where all members in the room will see it and ask questions if need be
    socket.on("new test",function(data){
    	io.sockets.to(data.controlId).emit("new investigation",data);
    });

    //doc sent new prescriptions to the room during video chat where all members in the room will see it and ask questions if need be
    socket.on("new drugs",function(data){
    	io.sockets.to(data.controlId).emit("new prescription",data);
    });



    socket.on("check presence",function(data,cb){
    	cb(connects);
    })


    function leave() {
      console.log('-- ' + socket.id + ' left --');
      delete connects[socket.id];
      io.sockets.emit("real time presence",connects);
      console.log(connects);
      //io.sockets.emit("real time presence",{socketId: socket.id,status: false})
      //streams.removeStream(socket.id);
    }	

    socket.on('disconnect', leave);
    socket.on('leave', leave);

  });

  
 }

 //patients sends notification in real time to update doctor about the prescription request sent
	   	 /*socket.on("i sent test",function(data,cb){	    	
	    	model.user.findOne({user_id: data.doctorId},{set_presence:1,presence:1,firstname:1,title:1},function(err,doc){
	    		if(err) throw err;
	    		if(doc.set_presence.general === true && doc.presence === true) {
	    			console.log("did it happen bro !!!!")
	    			io.sockets.to(data.doctorId).emit("receive prescription request",{status: "success"})
	    		} else {
	    			var msg = doc.title + " " + doc.firstname + " is currently not available. Try later."
	    			cb({error: msg});
	    		}
	    	});
	    });*/

	    //patients sends notification in real time to update doctor about the  request sent
	    /*socket.on("i sent consultation",function(data,cb){
	    	model.user.findOne({user_id: data.doctorId},{set_presence:1,presence:1,firstname:1,title:1},function(err,doc){
	    		if(err) throw err;
	    		if(doc.set_presence.general === true && doc.presence === true) {
	    			console.log("did it happen bro !!!!");
	    			io.sockets.to(data.doctorId).emit("receive consultation request",{status: "success"})
	    		} else {
	    			var msg = doc.title + " " + doc.firstname + " is currently not available. Try later."
	    			cb({error: msg});
	    		}
	    	});	    	
	    });*/
	    

			//sending video or audio request
			/*socket.on("convseration signaling",function(req,cb){
				model.user.findOne({user_id:req.to},{set_presence:1,firstname:1,title:1},function(err,doc){
					if(err) throw err;
					if(doc.set_presence.general === true) {
						//{type:req.type,message:req.message,time:req.time}
						io.sockets.to(req.to).emit("receive signal",req);
					} else {
						var msg = doc.title + " " + doc.firstname + " is currently not available. Try later."
		    		cb({error: msg});
					}
				});			
			});

			//response to the video or audio reqquest.
			socket.on("signal response",function(data){
				data.message_id = Math.floor(Math.random() * 999999);
				io.sockets.to(data.to).emit("conversation status",data);
			});


			//in call directed to patients when doc enters call page emited from the front end.
			socket.on("in call",function(data){
				io.sockets.to(data.to).emit("calling",data);
			});

			//when patient is inside a call page the doctor is notified
			socket.on("in call connected",function(data){
				io.sockets.to(data.to).emit("patient in call connected",{status: true})
			});

			
			///////
