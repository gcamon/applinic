"use strict";

var uuid = require("node-uuid");

module.exports = function(model,io,streams) {    
  io.sockets.on('connection', function(socket){  	   
	    console.log('a user connected');
	    var user = {};

	    socket.on('join', function (data) {
	    	user.isPresent = true; //use to check presence of user without hitting the database.
	      socket.join(data.userId);      
	      console.log("room created");
	    });

	    socket.on('courier join', function (data) {
	      socket.join(data.id);      
	      console.log("room created for courier service");
	    });

	    /**secr****/
	    socket.on('join_secr',function(data){
	    	var roomId = process.env._NAME || data.user_id;
	    	socket.join(roomId);  
	    });

  		socket.on("init chat",function(data,cb){

  			var chatId = data.userId + "/" + data.partnerId; //creates chat id for the user and a partner to be saved in the database.

	      model.chats.findOne({chat_id:chatId},function(err,chat){
	      	if(err) throw err;
	      	if(!chat){
	      		var date = + new Date();    		
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
	    	io.sockets.to(data.to).emit("isReceived",data)
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
	    			console.log("chat saved!!!");
	    		});
	    	});
	    });

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

			///////

			//video logic this will be moved to a new server
			//sending video or audio request
			socket.on("convsersation signaling",function(req,cb){
				model.user.findOne({user_id:req.to},{set_presence:1,firstname:1,title:1},function(err,user){
					if(err) throw err;
					if(user.set_presence.general === true) {
						//{type:req.type,message:req.message,time:req.time}
						io.sockets.to(req.to).emit("receive request",{message: req.title + " " + 
							req.name + " requests for video call with you!",from: req.from});
						cb({message:"Video call request has been sent to " + user.title + " " + user.firstname})
					} else {
						var msg = user.title + " " + user.firstname + " is currently not available.Your request has been qeued for attendance."
		    			cb({message: msg});
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
			})

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
	      control.expirationDate.expires = 36000; //10 hours before the data is deleted.
				control.save(function(){});
			}

			socket.on("call reject",function(details){
				io.sockets.to(datails.to).emit("convserstion denied",details)
			})









			/////////////////////

		// to be moved to another server for video
		console.log('-- ' + socket.id + ' joined --');
    socket.emit('id', socket.id);

    socket.on('message', function (details) {
      var othersocket = io.sockets.connected[details.to];
      
      if (!othersocket) {
        return;
      }
        delete details.to;
        details.from = socket.id;
        othersocket.emit('message', details);
    });
      
    /*socket.on('readyToStream', function(options) {
      console.log('-- ' + socket.id + ' is ready to stream --');      
      streams.addStream(socket.id, options.name); 
    });*/

    // gets te control to join a room
    socket.on("control join",function(control,cb){
    	console.log("checking----------")
    	console.log(control);
    	socket.join(control.control);//control.joins a roo
    	cb(control);
    	//streams.addStream(socket.id,control.name,control.control,model)
    })

    socket.on('readyToStream', function(options,cb) {
      console.log('-- ' + socket.id + ' is ready to stream --');
      //search database to see which control this socket belong to.
      streams.addStream(socket.id, options.name, options.controlId,model);
      socket.join(options.controlId); //create a room for common sites using one control.
      //io.sockets.to(options.controlId).emit("new stream added",{message:"new stream",controlId:options.controlId});
      cb({controlId:options.controlId})
    });

    socket.on("init reload",function(data){
    	console.log("reloadiiiiiiiiiiiiiiiiii")
    	console.log(data)
    	console.log(data.message)
    	io.sockets.to(data.controlId).emit("reload streams",{status:true,name:data.names,userId:data.userId})
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


    function leave() {
      console.log('-- ' + socket.id + ' left --');
      streams.removeStream(socket.id);
    }	

    socket.on('disconnect', leave);
    socket.on('leave', leave);

  });

  
 }