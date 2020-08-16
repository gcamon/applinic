(function() {

	var app = angular.module('myApp',["angularModalService",'ui.bootstrap',"btford.socket-io",'xen3r0.underscorejs']);

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


	app.factory('mySocket', function (socketFactory) {
	  var socket = socketFactory();
	  window.localStorage.setItem('saveSocket',socket);
	  return socket;
	});

	app.service('templateService',[function(){ 
	  var audio  = new Audio('/assets/audio/ping-bang.wav');
	  var audio2 = audio;
	  var audio3 = new Audio('/assets/audio/gets-in-the-way.mp3');
	  var audio4 = new Audio('/assets/audio/dreamy.wav');
	  var audio5 = new Audio('/assets/audio/camera-shutter-click-01.wav');
	  var audio0 = new Audio('/assets/audio/clunk-notification.wav');

	  this.playAudio = function(track){
	    switch(track){
	      case 1: 
	        audio.play();
	      break;
	      case 2:
	        audio2.play();
	      break;
	      case 3:
	        audio3.play();
	      break;
	      case 4:
	        audio4.play();
	      break;
	       case 5:
	        audio5.play();
	      break;
	       case 0:
	        audio0.play();
	      break;
	    }
	    
	  }

  }]);


	app.controller("presenceSocketController",["$scope","$http","mySocket",
		"localManager","templateService","$rootScope","ModalService",
		function($scope,$http,mySocket,localManager,templateService,$rootScope,ModalService){
			var user = localManager.getValue("resolveUser");
			if(user) {
				mySocket.emit("join",{userId:user.user_id});

				mySocket.on("video call able",function(response){
			    templateService.playAudio(4);
			    setTimeout(function(){
			      display();
			    },3000);

			    function display() {
			      var decide = confirm(response.message);
			      if(decide){
				      $rootScope.msg = response.message;
		          //$rootScope.tokBoxUrl = response.tokBoxVideoURL;
		          window.location.href = response.tokBoxVideoURL;
		          localManager.setValue("partnerDetails",response.partnerDetails);
		          /*ModalService.showModal({
		            templateUrl: 'redirect-modal.html',
		            controller: 'redirectModal'
		          }).then(function(modal) {
	              //modal.element.modal();
	              modal.close.then(function(result) {                 
	              });
		          });*/
			      }
			    }
			  });

			  mySocket.on("received audio call request",function(data){
			    var check = confirm("You have audio conversation request from " + data.sender);
			    if(check){
			      window.location.href = data.connectURL;
			    }
			  })
			}			
	}]);

	app.controller("redirectModal",["$scope","$http",function($scope,$http){

		$scope.partner = {};

		$scope.later = function(){
			$scope.isLater = true;
		}

		$scope.sendTime = function() {

		}

	}]);


})();