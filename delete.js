"use strict";

function Delete(item,user) {
	this.item = item;
	this.user = user;
}

Delete.prototype.DeleteByUserId = function(model,projection) {
	var self = this;
	model.user.findOne({user_id: this.user},projection).exec(function(err,data){
		if(err) throw err;		
		var key;	
		for(var i in projection)	{
			if(projection.hasOwnProperty(i)){
				key = i;
			}
		}			
		var result = data[key];			
		var elemPos = result.map(function(x){return x.doctor_id}).indexOf(self.item)
		var remove = result.splice(elemPos,1);

		data.save(function(err,info){
			if(err) throw err;
			console.log("deleted");
		});
	});
}

Delete.prototype.DeleteByRefId = function(model,projection) {
	
	
}

Delete.prototype.DeleteBySessionId = function(model,projection) {
	var self = this;
	model.user.findOne({user_id: this.user},projection).exec(function(err,data){
		if(err) throw err;		
		var key;	
		for(var i in projection)	{
			if(projection.hasOwnProperty(i)){
				key = i;
			}
		}			
		var result = data[key];			
		var elemPos = result.map(function(x){return x.session_id}).indexOf(self.item)
		var remove = result.splice(elemPos,1);

		data.save(function(err,info){
			if(err) throw err;
			console.log("deleted");
		});
	});
}

Delete.prototype.DeleteAll = function(model,projection) {
	var self = this;
	model.user.findOne({user_id: this.user},projection).exec(function(err,data){
		if(err) throw err;		
		var key;	
		for(var i in projection)	{
			if(projection.hasOwnProperty(i)){
				key = i;
			}
		}			
		data[key].splice(0);

		data.save(function(err,info){
			if(err) throw err;
		});
	});
}

Delete.prototype.deleteAllChat = function(model,projection){
	model.chats.findOne({chat_id:this.item},projection).exec(function(err,data){
		if(err) throw err;
		var key;	
		for(var i in projection)	{
			if(projection.hasOwnProperty(i)){
				key = i;
			}
		}		
		data[key].splice(0);

		data.save(function(err,info){
			if(err) throw err;
			console.log("deleted");
		});
	});
}

module.exports = Delete;