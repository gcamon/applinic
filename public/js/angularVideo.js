(function(){
	var app = angular.module('rtcVideo', [],
		function($locationProvider){$locationProvider.html5Mode(true);}
    );
		var client = new PeerManager(name);
		var mediaConfig = {
        audio:true,
        video: {
					mandatory: {},
					optional: []
        }
    };

    /*
    var mediaConfig = {
        audio:true,
        video: {
        	width: {max: 500},
        	height: {max: 500}
        }
    };

    */

    app.factory("localManager",["$window",function($window){
		  return {
		    setValue: function(key, value) {
		      $window.localStorage.setItem(key, JSON.stringify(value));
		    },
		    getValue: function(key) {       
		      return JSON.parse($window.localStorage.getItem(key)); 
		    },
		    removeItem: function(key) {
		      $window.localStorage.removeItem(key);
		    }
		  };
		}]);

    app.factory('camera', ['$rootScope', '$window', function($rootScope, $window){
    	var camera = {};
    	camera.preview = $window.document.getElementById('localVideo');
    	//Get the camera stream and attach to be passed onto a web element
    	camera.start = function(){
				return requestUserMedia(mediaConfig)
				.then(function(stream){						
					attachMediaStream(camera.preview, stream);
					client.setLocalStream(stream);
					camera.stream = stream;
					$rootScope.$broadcast('cameraIsOn',true);
				})
				.catch(Error('Failed to get access to local media.'));
		  };
    	camera.stop = function(){
    		return new Promise(function(resolve, reject){			
				try {
					//camera.stream.stop() no longer works
					
					var track =  camera.stream.getTracks();
          for( var i = 0; i < track.length; i++ ){
	          track[i].stop();
	        }
					camera.preview.src = '';
					resolve();
				} catch(error) {
					reject(error);
				}
    		})
    		.then(function(result){
    			$rootScope.$broadcast('cameraIsOn',false);
    		});	
		};
		return camera;
    }]);

	   /*app.config(function($routeProvider){
			  $routeProvider

			  .when("/",{
			  	templateUrl: "/assets/pages/site.html"
			  })

			  .when("/cam/:id",{
			  	templateUrl: "/assets/pages/site.html",
			  })

			  .when("/cam/:id/local-streams",{
			  	templateUrl: "/assets/pages/local-remote.html",
			  	//controller: "siteRemoteStreamsController"
			  })
		 });*/

    app.controller("siteRemoteStreamsController",["$scope","camera","$location","$http","$window",function($scope,camera,$location,$http,$window){
    	var rtc = this;
		rtc.remoteStreams = [];
		var path = $location.path();
		var toArr = path.split("/");
		console.log(toArr)
		var controlId = toArr[toArr.length - 1]; //user to get control id which is second to the last in the array
		

		function getStreamById(id) {
		    for(var i=0; i<rtc.remoteStreams.length;i++) {
		    	if (rtc.remoteStreams[i].id === id) {return rtc.remoteStreams[i];}
		    }
		}

		rtc.loadData = function () {
			// get list of streams from the server;		
			var path = window.location.pathname;
			var getControlId = path.split("/");
			var controlId = getControlId[getControlId.length - 1];
		
			var url = '/user/streams.json/' + controlId;
			
			$http.get(url).success(function(data){
			
				// filter own stream
			var streams = data.filter(function(stream) {
		      return stream.id != client.getId();
		    });
		    // get former state
		    for(var i=0; i<streams.length;i++) {
		    	var stream = getStreamById(streams[i].id);
		    	streams[i].isPlaying = (!!stream) ? stream.isPLaying : false;
		    	console.log(streams)
		    	//rtc.view(streams[i]);
		    	/*if(!stream) {
		    		streams.splice(i,1);
		    	}*/
		    }
		    // save new streams
		    rtc.remoteStreams = streams;
			});
		};

		rtc.view = function(stream){
			client.peerInit(stream.id,stream.name);
			stream.isPlaying = !stream.isPlaying;
		};

		rtc.call = function(stream){
			/* If json isn't loaded yet, construct a new stream 
			 * This happens when you load <serverUrl>/<socketId> : 
			 * it calls socketId immediatly.
			**/
			if(!stream.id){
				stream = {id: stream, isPlaying: false};
				rtc.remoteStreams.push(stream);
			}
			if(camera.isOn){
				client.toggleLocalStream(stream.id);
				if(stream.isPlaying){
					client.peerRenegociate(stream.id);
				} else {
					client.peerInit(stream.id);
				}
				stream.isPlaying = !stream.isPlaying;
			} else {
				camera.start()
				.then(function(result) {
					client.toggleLocalStream(stream.id);
					if(stream.isPlaying){
						client.peerRenegociate(stream.id);
					} else {
						client.peerInit(stream.id);
					}
					stream.isPlaying = !stream.isPlaying;
				})
				.catch(function(err) {
					console.log(err);
				});
			}
		};

		//initial load
		rtc.loadData();
    	/*if($location.url() != '/'){
      		rtc.call($location.url().slice(1));
    	};*/

    

    var controllerSocket = client.getSocketForController();

    controllerSocket.on("reload streams",function(data){
    	alert("reloading")
    	rtc.loadData();
    })
  }]);

	app.controller('RemoteStreamsController', ["$scope",'camera', '$location', '$http','$window', function($scope,camera, $location, $http, $window){
		var rtc = this;
		rtc.remoteStreams = [];

		function getStreamById(id) {
		    for(var i=0; i<rtc.remoteStreams.length;i++) {
		    	if (rtc.remoteStreams[i].id === id) {return rtc.remoteStreams[i];}
		    }
		}
		var control = {}

		rtc.siteLink = function(controlId){
			console.log(controlId)
			control.controlId = controlId;
				//join a room
    	client.controlJoin(controlId);
			return $window.location.host + "/user/cam/" + controlId;
		}

		rtc.loadData = function () {
			// get list of streams from the server		
			
			
		
			var url = '/user/streams.json/' + control.controlId;
			
			$http.get(url).success(function(data){
				// filter own stream
				
				var streams = data.filter(function(stream) {
			      	return stream.id != client.getId();
			    });
			    // get former state
			    //starts from one for remote streams
			    for(var i=0; i<streams.length;i++) {
			    	var stream = getStreamById(streams[i].id);
			    	streams[i].isPlaying = (!!stream) ? stream.isPLaying : false;
			    	alert(streams[i].id)
			    	rtc.view(streams[i])
			    }
			    // save new streams
			    console.log(data)
			    rtc.remoteStreams = streams;
			});
		};

		rtc.view = function(stream){
			client.peerInit(stream.id,stream.name);
			stream.isPlaying = !stream.isPlaying;
		};
		rtc.call = function(stream){
			/* If json isn't loaded yet, construct a new stream 
			 * This happens when you load <serverUrl>/<socketId> : 
			 * it calls socketId immediatly.
			**/
			if(!stream.id){
				stream = {id: stream, isPlaying: false};
				rtc.remoteStreams.push(stream);
			}
			if(camera.isOn){
				client.toggleLocalStream(stream.id);
				if(stream.isPlaying){
					client.peerRenegociate(stream.id);
				} else {
					client.peerInit(stream.id);
				}
				stream.isPlaying = !stream.isPlaying;
			} else {
				camera.start()
				.then(function(result) {
					client.toggleLocalStream(stream.id);
					if(stream.isPlaying){
						client.peerRenegociate(stream.id);
					} else {
						client.peerInit(stream.id);
					}
					stream.isPlaying = !stream.isPlaying;
				})
				.catch(function(err) {
					console.log(err);
				});
			}
		};

		//initial load
		rtc.loadData();
    	if($location.url() != '/'){
      		rtc.call($location.url().slice(1));
    	};


    /*client.reloadFn(function () {
    	rtc.loadData(); //automaticall call the refresh
    });*/
		var controllerSocket = client.getSocketForController();

    controllerSocket.on("reload streams",function(data){
    	
    	var message = data.name ? data.name + " stream is availble." : "Partner stream is now available."
    	console.log(data)
    	var decide = confirm(message);
    	if(decide) {
    		rtc.loadData();
    	} else {
    		alert("Video call aborted!");
    		//send emit to stop video to the other peer.
    	}
    	
    })
	}]);

	app.controller('LocalStreamController',['camera', '$scope', 'localManager','$window','$location', function(camera, $scope, localManager,$window, $location){
		var localStream = this;
		var storage = $window.localStorage.getItem("resolveUser");
		var user = JSON.parse(storage)
		localStream.name = user.title + " " + user.firstname + " " + user.lastname  || 'Guest';
		localStream.link = '';
		localStream.cameraIsOn = false;

		var saveControlId = {};
		var path = $location.path();
		var newPath = path + "/local-streams";
		$scope.allLocalStreams = function() {
			$location.path(newPath);
		}

		$scope.$on('cameraIsOn', function(event,data) {
  		$scope.$apply(function() {
	    	localStream.cameraIsOn = data;
	    });
		});

		localStream.getControlId = function(id){
			console.log(id)
			saveControlId.id = id;		
		}

		localStream.toggleCam = function(){
			if(localStream.cameraIsOn){
				localManager.removeItem("username");
				camera.stop()
				.then(function(result){
					client.send('leave');
	    		client.setLocalStream(null);
				})
				.catch(function(err) {
					console.log(err);
				});
			} else {
				camera.start()
				.then(function(result) {
					localStream.link = $window.location.host + '/' + client.getId();
					if(localManager.getValue("username") !== "Guest" || localManager.getValue("username") !== ""){
						localManager.setValue("username",localStream.name);
					}				
					client.send('readyToStream', { name: localStream.name,controlId: saveControlId.id });
				})
				.catch(function(err) {
					console.log(err);
				});
			}
		};

	}]);
})();

