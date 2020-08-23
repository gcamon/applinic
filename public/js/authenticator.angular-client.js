

var app = angular.module('myApp',["angularMoment",'ui.bootstrap',"btford.socket-io"]);


app.factory('mySocket', function (socketFactory) {
  var socket = socketFactory();
  window.localStorage.setItem('saveSocket',socket);
  return socket;
});


app.service("userLoginService",["$resource",function($resource){
  return $resource('/user/login',null,{logPerson:{method:"POST"}});
}]);

app.service("phoneVerifyService",["$resource",function($resource){
  return $resource("/user/verify-phone-number",null,{go:{method:"PUT"}});
}]);

app.service('phoneCallService',['$http','mySocket','$rootScope',function($http,mySocket,$rootScope){
    return function(data,url,method,oldTime){
      if(data)
        data.isPhoneCall = true;

      if(method == 'GET'){
        url += "?isPhoneCall=yes&&val=" + data.val + "&&phone=" + data.phone;
      }

      if(oldTime)
        data.old_time = oldTime;

      $http({
        method  : method,
        url     : url,
        data    : data,
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data){      
        data.isPhoneCall = false;
        //$rootScope.showCallingMsg = "";
        if(data.error) {
          alert(data.message)
        }
      })
    }
}]);

app.controller("initCtrl",["ModalService",function(ModalService){

	$rootScope.userLoginService = function() {
    $http.get("/user/getuser")
    .success(function(user){
      //user = localManager.getValue("resolveUser");
      if(user.isLoggedIn){
        //$rootScope.user.phone = user.phone;
        //$rootScope.user.address = user.address || user.work_place;

        $rootScope.checkLogIn = user;
        $rootScope.checkLogIn.typeOfUser = user.type;
      
        //mySocket.emit('join',{userId: user.user_id}); 

      } else {
        $rootScope.checkLogIn = {};  
        $scope.loginIntOAcc();           
      }
    })
  }

  $rootScope.userLoginService();

	$scope.loginIntOAcc = function() {
  	ModalService.showModal({
    	templateUrl: 'auth.html',
    	controller: 'authModalController'
   	}).then(function(modal) {
  		modal.element.modal();
  		modal.close.then(function(result) {             
  		});
  	});
  }

}]);

app.controller("authModalController",["$scope","$rootScope",
	"localManager","$window","userLoginService","phoneVerifyService","phoneCallService","mySocket",
  function($scope,$rootScope,localManager,$window,
  	userLoginService,phoneVerifyService,phoneCallService,mySocket){

  //$rootScope.person.type = "Patient";

  //$rootScope.person.action = "login";

  var login = userLoginService;

	/*$scope.chooseType = function(type) {
	   $rootScope.person.type = type;
	}*/

	$scope.create = function() {
    localManager.setValue("landingCurrPageURL",$window.location.href);
    $window.location.href = '/signup';
    //$rootScope.person.action = "signup";
  }

	$scope.enterAccount = function() {
		
		$scope.loginMessage = "";
		$scope.loading = true;

		var intRegex = /[0-9 -()+]+$/;

    if(intRegex.test($rootScope.person.username)){
      $rootScope.person.isPhoneNumber = true;
      if($rootScope.person.username[0] === '0'){
        var newSlice = $rootScope.person.username.slice(1);
        $rootScope.person.username = "+234" + newSlice;
      }
    }

    login.logPerson($rootScope.person,function(data){   
    	$scope.loading = false;
    	if(data.isLoggedIn){
    		localManager.setValue("resolveUser",data); 
    		var name = data.firstname || data.name;
    		$scope.loginSuccess = "Welcome " + name + "! " + "Close the modal and continue."
    		//mySocket.emit('join',{userId: data.user_id});
        $rootScope.userLoginService();
    	} else {
    		$scope.loginMessage = data.message;
    	}
		})
	}

	

	$scope.normalUser = function() {
		$rootScope.person.action = "login";
	}

	//destroyStorage(localManager);

}]);


