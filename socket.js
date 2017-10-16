"use strict";

module.exports = function(model,io) {    
  io.sockets.on('connection', function(socket){  	   
	    console.log('a user connected');
	    var user = {};
	    socket.on('join', function (data) {
	    	user.isPresent = true; //use to check presence of user without hitting the database.
	    	console.log(data)
	      socket.join(data.userId);      
	      console.log("room created");
	    });

	    socket.on('courier join', function (data) {
	      socket.join(data.id);      
	      console.log("room created for courier service");
	    });

	    /**secr****/
	    socket.on('join_secr',function(data){
	    	socket.join(data.userId);  
	    	var list = [process.env.ODP_DOCTOR,process.env.ODP_PHARMACY,process.env.ODP_RADIOLOGY,process.env.ODP_LABORATORY];
	    	for(var i = 0; i < list.length; i++){
	    		console.log("room created " + i);
	    		socket.join(list[i]);
	    	}
	    })

  		socket.on("init chat",function(data,cb){

  			var chatId = data.userId + "/" + data.partnerId; //creates chat id for the user and a partner to be saved in the database.

	      model.chats.findOne({chat_id:chatId},function(err,chat){
	      	if(err) throw err;
	      	if(!chat){
	      		var date= + new Date();    		
	      		var newChat = new model.chats({
	      			date_created: date,
	      			chat_id: chatId,
	      			type:"chat",
	      		});
	      		newChat.save(function(err,info){
	      		});
	      	} else {
	      		cb(chat.messages);
	      	}
	      });
  		})

	    socket.on("send message",function(data,cb){
	      cb(data);
	      //if(Object.keys(socket.rooms).indexOf(data.to) !== -1)
	       model.user.findOne({user_id: data.to},{set_presence:1},function(err,Obj){
	       	if(err) throw err;

	       	var checkBlocked = Obj.set_presence.particular.indexOf(data.from);	       	
	       	if(checkBlocked === -1){	       		
	       		if(Obj.set_presence.general === true) {		       			          			
	       			io.sockets.to(data.to).emit('new_msg',data);
	       		}
	       	}
	       	
	       });
	       
	       socket.on("isSent",function(data,cb){
	       	data.isSent = true;
	       	cb(data.isSent);
	       });

	    });

	    socket.on("msg received",function(data){
	    	data.isReceived = true;
	    	io.sockets.to(data.to).emit("isReceived",data.isReceived)
	    })

	    socket.on("user typing",function(data){
	    	if(user.isPresent === true)
	    		io.sockets.to(data.to).emit('typing',data.message);	      
	    });

	    socket.on("save message",function(data){
	    	var chatId = data.userId + "/" + data.partnerId;
	    	model.chats.findOne({chat_id: chatId},{messages:1}).exec(function(err,chats){
	    		if(data.hasOwnProperty('$$hashKey'))
	    			delete data['$$hashKey'];
	    		chats.messages.push(data);
	    		chats.save(function(err,info){
	    			if(err) throw err;
	    			console.log("chat saved!!!")
	    		})
	    	})
	    })

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
			socket.on("convseration signaling",function(req,cb){
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

			socket.on("call rejected",function(data){
				io.sockets.to(data.to).emit("user rejected calls",{status:"Call rejected!"})
			});

	

  });
  
 }