'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dbURL = "mongodb://127.0.0.1:27017/medicalmull"; //"mongodb://127.0.0.1:27017/medicalmull"; 45.55.204.222
var options = {
	autoReconnect: true,
	useMongoClient: true,
	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0,
	//useNewUrlParser: true 
}

mongoose.connect(dbURL,options)
.then(
  () => { console.log("db connected!") },
  err => { console.log(err)}
)

module.exports = mongoose;

