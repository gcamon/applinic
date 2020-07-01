

var app = angular.module('myApp',["angularModalService","ngResource",'ui.bootstrap','btford.socket-io','angular-clipboard']);

app.service("homePageDynamicService",["$resource",function($resource){
  return $resource("/dynamic-service");
}]);

app.service("homepageSearchService",["$resource",function($resource){
  return $resource("/general/homepage-search");
}]);


app.service("skillService",["$resource",function($resource){
  return $resource("/user/get-skills",null,{updateSkill: {method: "PUT"}});
}])

app.service("skillCommentsService",["$resource",function($resource){
  return $resource("/user/skill/comments",null,{updateComment: {method: "PUT"}});
}])

app.service("deviceCheckService",function(){
  this.getDeviceType = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
  }
})


app.service("userVerifyService",["$resource",function($resource){
  return $resource("/user/verify");
}]);

app.service("userLoginService",["$resource",function($resource){
  return $resource('/user/login',null,{logPerson:{method:"POST"}});
}]);

app.service("changPasswordService",["$resource",function($resource){
  return $resource('/user/change-password/:id',{id:"@userId"},{updatePassword:{method:"PUT"},verifyUser:{method:"POST"}});
}]);


app.service("userSignUpService",["$resource",function($resource){
  return $resource('/user/signup',null,{userSignup:{method:"POST"},emailCheck:{method:"PUT"}});
}]); 

app.service("phoneVerifyService",["$resource",function($resource){
  return $resource("/user/verify-phone-number",null,{go:{method:"PUT"}});
}]);

app.service("patientfindDoctorService",["$resource",function($resource){
  return $resource("/user/patient/find-doctor");
}]);

app.service('templateService',[function(){
  this.isThroughLogin = false;
  this.getname = "";
  this.getid = "";
  this.getpic = "";
  this.getRealDate = new Date();
  this.getfirstname = "";
  this.getLastname = "";
  this.getFee = 0;
  this.patientName = "";
  this.wallet = {};
  this.getspecialty = "";
  this.holdAllNotification = [];
  this.holdId = "";

  //holds patients id as soon as patient logs in for communication purpose
  this.holdPatientIdForCommunication;

  //HOLDS DOCTOR id for communication purpose
  this.holdDoctorIdForCommunication;
  //hold id of a doctor in the checkOutcontroller
  this.holdIdForSpecificDoc = "";

  //holds id for a specific patient clicked in the checkoutcontroller
  this.holdIdForSpecificPatient;
  
  //this service is just to hold the consultation and current wallet amount for insuficientfundController.
  this.holdfee = "";
  this.holdwalletAmount = "";

  //holds doctor info for search result page ie listcontroller
  this.doctorsData = [];

  //holds medical records
  this.holdMedicalRecord = [];

  //holds prescriptions
  this.holdPrescriptions = [];
  //holds id for finding prescription or medical record in an array above
  this.holdIdForFindingRecord;
  //this holds prescription for patientview request controller.
  this.holdAllPrescriptionForOtherCtrl;
  //holds prescription to be forwarded to a phamarcy.note this can hold for prescription that can be forward from doctor to pharmacy, patient
  //to pharmacy and pharmacy to pharmacy.
  this.holdPrescriptionToBeForwarded;
  

  //hol attendance list
  this.holdList = [];

  //checks the list for already exist patient
  this.checkInTheList = {};

  //holds prescription id
  this.holdPrescriptionsId;

  //holds referral data for pharmacy
  this.holdPharmacyReferralData;

  //holds where prescriptions has been sent to.
  this.holdTrackRecord;
  //holds prescription for where prescriptions have been sent.
  this.holdPrescriptionForTrackRecord;

  //holds all lab test from the back end
  this.holdAllLabTest;

  //holds all scan test from the back end
  this.holdAllRadioTest;

  //holds all pending laboratory
  this.pendingLab;

  //holds all pending radiolography
  this.pendingScan; 


  //hodls fn to call when patients wants to view prescription from the notification template.
  this.holdFnToViewNotification = function(fn) {
    fn();
  }

  this.changedProfilePic = "";
  this.isUpdated = false;

  //holds the referral for diagnostic centers
  this.holdReferral;

  //holds the selected center a patient finally picked to forward his or her prescription to;
  this.holdTheCenterToFowardPrescriptionTo;
  //holds the current page of the user browser.
  this.holdCurrentPage = "/welcome";

  //this holds the selected appointment by the doctor
  this.holdAppointmentData;

  //holds the selected lab test be run
  this.holdSelectedLabTest;

  //holds patient data which will be sent to a laboratory
  this.holdForSpecificPatient

  //holds for selected doctor
  this.holdForSpecificDoc;

  //holds lab referral data
  this.holdLaboratoryReferralData

  //holds unRantest array 
  this.holdUnranTest;

  this.holdTheRadiologyToFowardTestTo;

  //holds  test to be forwarded to another center;
  this.holdTestToBeForwarded;

  //holds patients accepted doctors for chooseDoctorController
  this.holdMyDoctorsForSendingTest;

  //holds selected doctor obj
  this.holdSelectedDoctorToSendTest;

  //holds the scan images for a particular referral in any 
  this.holdScanImageList;

  //holds the list of precription request for the doctor
  this.holdPrescriptionRequestData
  //hold a particular prescription test obj
  this.holdPrescriptionTestObj

  //hold the urrent length of prescription request list
  this.holdlabLenOfPrescriptionRequest;

  this.holdRadioLenOfPrescriptionRequest;

  //holds labPrescriptionReq for lab 
  this.labPrescriptionReq;
  //holds radioPrescriptionReq for scan
  this.radioPrescriptionReq;

  //this holds doctor's patients list
  this.holdDocPatientList

  //just holds truthy
  this.isTrue

  //holds drug search results
  this.holdDrugSearchResult;

  //this holds record for view template
  this.holdAllPrescriptionForTemplate;

  //holds the length of messages
  this.holdMsgLen = function(len){
    return len;
  }

  //holds length of appointments
  this.holdAppLen = function(len){
    return len;
  }
  // identify single for filled by user
  this.singleForm;

  //templateService.modalViewDocProfile(docId,intro)
  this.holdData;

  this.holdDocInView;
  //holds the raw amount of consultation fee which will be used in another controller.
  this.holdRawAmount;
  //holds send Obj for doctor acceptance by the patient
  this.sendObj;

  

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

  this.holdBriefForSpecificPatient;

  this.singleView;

}]);


app.factory('mySocket', function (socketFactory) {
  var socket = socketFactory();
  window.localStorage.setItem('saveSocket',socket);
  return socket;
});


app.service('phoneCallService',['$http','$rootScope',function($http,$rootScope){
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




app.controller("hompageController",["$scope","cities","$http",
  "ModalService","$rootScope","homePageDynamicService",
  "skillService","homepageSearchService","localManager","$window","templateService","mySocket","$location",
  function($scope,cities,$http,
  	ModalService,$rootScope,homePageDynamicService,skillService,
  	homepageSearchService,localManager,$window,templateService,mySocket,$location){


  $rootScope.cities = cities;

  $rootScope.person = {};

  $rootScope.patient = {}; //used in booking modal

  $scope.itemList = [];

  $rootScope.user = {};


  var dyna = [];
  var filter = {};
  var spArr = [];
  var skArr = [];
  var diArr = [];

  $scope.dropDownList = [];

  $http({
    method  : 'GET',
    url     : "/user/get-specialties",
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {              
    if(data){
      
      for(var i = 0; i < data.length; i++){
        if(!filter[data[i].specialty]) {
          filter[data[i].specialty] = 1;
          spArr.push({name:data[i].specialty});
          $scope.dropDownList.push(data[i].specialty)
          $scope.dropDownList.push(data[i].name)

        } else {
          filter[data[i].specialty]++;
        }
      }


    }
  }); 

  
 

  /*$http({
    method  : 'GET',
    url     : "/user/get-doctors-names",
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(res) {     
    
     for(var i = 0; i < res.length; i++){
        spArr.push(res[i]);
        dropDownList.concat()
     }

  });*/

  /*$http({
    method  : 'GET',
    url     : "/user/get-diseases",
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {              
    if(data){
      
      for(var i = 0; i < data.length; i++){
        if(!filter[data[i].disease]) {
          filter[data[i].disease] = 1;
          diArr.push({name:data[i].disease})
          $scope.dropDownList.push(data[i].disease)
        } else {
          filter[data[i].disease]++;
        }
      }
     
    }
  });*/


  $rootScope.todashboard = function(type) {
  	switch(type) {
      case "Patient":
        $window.location.href = "/user/patient";   
      break;
      case "Doctor":
       $window.location.href = "/user/doctor";   
      break;
      case "Pharmacy":
        $window.location.href = "/user/pharmacy"; 
      break;
      case "Laboratory":
        $window.location.href = "/user/laboratory"; 
      break;
      case "Radiology":
        $window.location.href = "/user/radiology"; 
      break;          
      case "admin":
        $window.location.href = "/user/admin";
      break;
    }
  }



  skillService.query(function(data){
    for(var i = 0; i < data.length; i++){
      if(!filter[data[i].skill]) {
        filter[data[i].skill] = 1;
        skArr.push({name:data[i].skill})
        $scope.dropDownList.push(data[i].skill)
        $scope.dropDownList.push(data[i].disease)
      } else {
        filter[data[i].skill]++;
      }
    }
  });   


  

  var qStr = window.location.search;
  if(qStr) {
  	var qVal = qStr.split('=');
  	$rootScope.user.item = qVal[qVal.length - 1];
  }


  $scope.find = function() {
  	$rootScope.user.category = "Doctor";

  	if(!$rootScope.user.item){
  		$rootScope.user.item = 'live-doctors';
  	}

  	$scope.loading = true;
  	homepageSearchService.get($rootScope.user,function(response){
      $scope.loading = false; 
      $scope.searchResultFull = response.full;
      $scope.searchResultSub = response.sub;
    });  
  }



  var user = localManager.getValue("resolveUser");

  if(user) {
  	mySocket.emit('join',{userId: user.user_id});
  }

  $rootScope.checkLogIn = user;

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

  $scope.consult = function(doc) {
  	$rootScope.holdDoc = doc;
  	if(!user){  	  	
  	  ModalService.showModal({
      	templateUrl: 'auth.html',
      	controller: 'authModalController'
     	}).then(function(modal) {
    		modal.element.modal();
    		modal.close.then(function(result) {             
    		});
    	});
  	} else {	  	
      ModalService.showModal({
        templateUrl: "selected-doc.html",
        controller: "bookingDocController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
        });
      });
  	}

  }

  $rootScope.holdcenter = {};

  $scope.chat = function(doc) {
  	if(user){ 
	  	$rootScope.holdcenter = doc;
	  	//templateService.holdId = doc.user_id;
	    ModalService.showModal({
	        templateUrl: 'quick-chat.html',
	        controller: 'generalChatCtrl'
	    }).then(function(modal) {
	        modal.element.modal();
	        modal.close.then(function(result) {             
	        });
	    });
	  } else {
	  	 ModalService.showModal({
      	templateUrl: 'auth.html',
      	controller: 'authModalController'
     	}).then(function(modal) {
    		modal.element.modal();
    		modal.close.then(function(result) {             
    		});
    	});
	  }
  }


  $scope.search = function() {   
    ModalService.showModal({
      templateUrl: 'home-page-search.html',
      controller: 'homePageModalController'
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {             
      });
    });
  }

  

  $scope.supported = false;

  $scope.copy = "Share this page";


  $scope.success = function () {    
    $scope.copy = 'Link copied!';
    /*$timeout(function(){
      $scope.copy = "Share this page";
    },2000);*/
  };


  $scope.fail = function (err) {
    console.error('Error!', err);
  };

  $scope.addSymptoms = function() {
    ModalService.showModal({
      templateUrl: 'choose-sypmtom.html',
      controller: 'symptomModalCtrl'
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {             
      });
    });
  }


}]);

app.controller("symptomModalCtrl",["$scope",function($scope){
  
}])

app.service("chatService",["$resource",function($resource){

  var source = $resource("/user/chats",null,{updateChat:{method: "PUT"}});

  this.chats = function() {
    return source.query();
  }

 this.updateChat = function(id,chats){
   return source.updateChat({chatId: id, chats: chats})
 }

}]);

app.service("profileDataService",["$resource",function($resource){
  return $resource("/user/get-profile-data");
}]);

app.controller("generalChatCtrl",["$scope","$rootScope","mySocket",function($scope,$rootScope,mySocket){
	  var user = $rootScope.checkLogIn || {};
    //templateService.holdId = templateService.holdId || localManager.getValue("holdIdForChat");
    //$rootScope.chatsList = $rootScope.chatsList || localManager.getValue("holdChatList");
    //$rootScope.allChats = $rootScope.chatsList; // rootScope can be used instead   
    $scope.center = $rootScope.holdcenter; //sometimes is not center but individual
    //$rootScope.sockets = $rootScope.sockets || localManager.getValue('connectedSockets');//connectedSockets
    $scope.isSent = false;
    var elemPos;

    if($rootScope.holdcenter) {
      initChatSingle();
    } 

    if($rootScope.searchItems){
      $scope.messageBody = "Requesting for the following  " + $rootScope.searchItemType + ":  " + $rootScope.searchItems;
    }
    
    $scope.sendChatSingle = function(partnerId){
      $scope.loading = true;
      mySocket.emit("send message general",{to: partnerId,message:$scope.messageBody,from: user.user_id},function(data){ 
        if(data) {
          $scope.loading = false;
          $scope.isSent = true;
        }
      })
    }

    //for modal sending one-way chat message.
    function initChatSingle() {
      mySocket.emit('init chat single',{userId: user.user_id,partnerId: $scope.center.id},function(data){});
    }

}]);


app.controller("authModalController",["$scope","$rootScope","homepageSearchService",
	"localManager","$window","userLoginService","userSignUpService","phoneVerifyService","phoneCallService","mySocket",
  function($scope,$rootScope,homepageSearchService,localManager,$window,
  	userLoginService,userSignUpService,phoneVerifyService,phoneCallService,mySocket){

  $rootScope.person.type = "Patient";

  $rootScope.person.action = "login";

  var login = userLoginService;

	$scope.chooseType = function(type) {
	   $rootScope.person.type = type;
	}

	$scope.create = function() {
		$rootScope.person.action = "signup";
	}

	$scope.enterAccount = function() {
		
		$scope.loginMessage = "";
		$scope.loading = true;

		var intRegex = /[0-9 -()+]+$/;

    if(intRegex.test($rootScope.person.username)){
      $rootScope.person.isPhoneNumber = true;
      if($rootScope.person.username[0] == '0'){
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
    		mySocket.emit('join',{userId: data.user_id});
    	} else {
    		$scope.loginMessage = data.message;
    	}
		})
	}

	$scope.verifyPhone = function() {

	}

	$scope.normalUser = function() {
		$rootScope.person.action = "login";
	}

	//destroyStorage(localManager);

}]);

/*app.controller("findDocPageModalController",["$scope","$rootScope","homepageSearchService","localManager","$window",
  function($scope,$rootScope,homepageSearchService,localManager,$window){

}])*/

app.controller("homePageModalController",["$scope","$rootScope","homepageSearchService","localManager","$window",
  function($scope,$rootScope,homepageSearchService,localManager,$window){
    $scope.loading = true;
    homepageSearchService.get($rootScope.user,function(response){
      $scope.loading = false;
      
      $scope.searchResult = response.full;
    });  

    $scope.account = function(selected,type) {
      selected.type = type;       
      localManager.setValue("onreg_held_item",selected);
      var user = localManager.getValue('resolveUser');
      if(user) {
         switch(user.typeOfUser) {
          case "Patient":
            $window.location.href = "/user/patient";   
          break;
          case "Doctor":
           $window.location.href = "/user/doctor";   
          break;
          case "Pharmacy":
            $window.location.href = "/user/pharmacy"; 
          break;
          case "Laboratory":
            $window.location.href = "/user/laboratory"; 
          break;
          case "Radiology":
            $window.location.href = "/user/radiology"; 
          break;          
          case "admin":
            $window.location.href = "/user/admin";
          break;
          default:
            $window.location.href = "/user/view"; 
          break; 
        }
      } else {
        selected.msg = "Please <a href='/signup'> create account </a> or <a href='/login'> log in </a> to have full access!";
      }
    }
}]);

app.controller('symptomsCtrl',["$scope","$rootScope","$http","homepageSearchService","$location","$anchorScroll",
	function($scope,$rootScope,$http,homepageSearchService,$location,$anchorScroll){
	

  $rootScope.selected = [];
  var filter = {}
  $scope.user = {};

  var specialtyFilter = {};
  var sympElem;
  $rootScope.$watch("symptomsList",function(newVal,oldVal){
  	if(newVal){
	  	newVal.forEach(function(item){
	  		if(item.picked && !filter[item.Name]){
	  			$rootScope.selected.push(item)
	  			filter[item.Name] = 1;
	  		} else {
          $rootScope.selected.forEach(function(symptom){
            if(!symptom.picked){
              sympElem = $rootScope.selected.map(function(x){return x.ID}).indexOf(symptom.ID);
              if(sympElem !== -1) {
                delete filter[$rootScope.selected[sympElem].Name]
                $rootScope.selected.splice(sympElem,1)
              }
            }
          })
        }
	  	})
    }
  },true);

   //crypto

	var uri = "https://sandbox-authservice.priaid.ch/login";
  var secret_key = "m4TZg78KiAo6y2GJj";
  var computedHash = CryptoJS.HmacMD5(uri, secret_key);
  var computedHashString = computedHash.toString(CryptoJS.enc.Base64);   
  
  var auth = 'Bearer ' + "ede.obinna27@gmail.com:" + computedHashString;
  

  $http({
    method  : 'POST',
    url     : uri,
    headers : {'Content-Type': 'application/json','Authorization': auth}
  })
  .success(function(res) {     
  	$scope.token = res.Token;
  	$scope.getSymptoms();
  });
  
  $scope.getSymptoms = function(token) {
  	var url = "https://sandbox-healthservice.priaid.ch/issues?"
  	+ "token=" + $scope.token + "&language=en-gb&format=json";
	  $http.get(url)
	  .success(function(response){
	  	$rootScope.symptomsList = response;
	  });
  }


  $location.hash('')


  $scope.getResult = function(){
   
  	if(!$scope.user.gender || !$scope.user.age){
  		alert("Please both Gender and Date of birth values are needed.")
  		return;
  	}

  	if($rootScope.selected.length == 0){
  		alert("Please add symptoms you are experiencing.")
  		return;
  	}

  	var symptomsIds = [];
  	$rootScope.selected.forEach(function(item){
  		symptomsIds.push(item.ID.toString());
  	});

    $location.hash('issuearea')
    $anchorScroll()

  	var str = JSON.stringify(symptomsIds);

  	var year = $scope.user.age.getFullYear();

  	var url = 'https://sandbox-healthservice.priaid.ch/diagnosis?symptoms=' + str + 
  	"&gender=" + $scope.user.gender + "&year_of_birth=" + year + "&token=" + $scope.token
  	+ "&language=en-gb&format=json";
  	$scope.loading = true;
  	$http.get(url)
  	.success(function(response){
     
  		$scope.issues = response;
  		$scope.loading = false;
  		$scope.issues.forEach(function(item){
  			if(!specialtyFilter[item.Specialisation.Name]) {
  				specialtyFilter[item.Specialisation.Name] = item.Specialisation.Name;
  				$scope.getSpecialist(item.Specialisation.Name)
  			}
  		})
  	});

  }

  var elemPos;

  $scope.deleteSymptom = function(id) {
  	elemPos = $rootScope.selected.map(function(x){return x.ID}).indexOf(id);
  	$rootScope.selected.splice(elemPos,1)
  	$rootScope.symptomsList.forEach(function(item){
  		if(item.ID === id){
  			item.picked = false;
  			delete filter[item.Name];
  		}
  	})
  }

  $scope.getSpecialist = function(specialty) {
  	//$rootScope.user.item = specialty;
  	$scope.find(specialty)
  }

  $scope.find = function(item) {
  	$rootScope.user.category = "Doctor";

  	//if(item === 'live-doctors'){
  	$rootScope.user.item = item;
  	//}

  	$scope.loading = true;
    $rootScope.user.isSymptomReq = true;
  	homepageSearchService.get($rootScope.user,function(response){
      $scope.loading = false; 
      $scope.searchResultFull = response.full;
      $scope.searchResultSub = response.sub;
    });  
  }




}])


app.controller("bookingDocController",["$scope","$http","$rootScope",
  "localManager","symptomsFactory","patientfindDoctorService","templateService","ModalService",
  function($scope,$http,$rootScope,localManager,symptomsFactory,
  	patientfindDoctorService,templateService,ModalService){

  $scope.docInfo = $rootScope.holdDoc;
  $scope.isViewDoc = true;

 
  $scope.patient = $rootScope.patient;

  $scope.patient.sick = true;
  
  var list = [{sn:"a"}];
  var symptom; 
  var index = 0;


  $scope.getSymptom = function(name){
    symptom = name;
    if(list.length === 1){
      list[0].name = name;
    } else {
      list[index].sn = index;
      list[index].name = name;
    }
  }

  $scope.symptoms = symptomsFactory;

  $scope.symptomsList = list;


  $scope.add = function(){
    index++;    
    var sympArr = {};
    list.push(sympArr);
  }

  $scope.remove = function(sn){
    index--;
    var remove = list.splice(sn,1);
  }

  $scope.searchObj = {};
  $scope.searchObj.city = localManager.getValue('resolveUser').city;
  var fetchDoctors = patientfindDoctorService;
  $scope.isComplaint = true;

  $scope.back = function() {
    $scope.isSearchToSend = false;
    $scope.isComplaint = true;
  }

  $scope.continue = function() {
    $scope.isSearchToSend = true;
    $scope.isComplaint = false;
    if(!$rootScope.doctorList)
      $scope.find();
  }

  $scope.find = function() {
    $scope.loading = true;
    fetchDoctors.query($scope.searchObj,function(data){           
      if(data.length > 0) {
        $rootScope.doctorList = data;
      } else {
        alert("No result found base on the search criteria!");
      }
      $scope.loading = false;
    }); 
  }

  $scope.quickFind = function(specialty) {
    $scope.searchObj.specialty = specialty;
    $scope.searchObj.type = "specialty";
    $scope.find()
  }

  $scope.specialties = ["Cardiologist","Gynecologist","Surgeon",
  "Pediatrician","Neurologist","Family Physician","Dermatologist","Neurosurgeon","Ophthalmologist",
  "Orthopedic Surgeon","Dental Surgeon","Urologist","Nephrologists",
  "ENT Surgeon","Gastroeneterologists","Rheumatologist","Endocrinologists"]

  $scope.validate = function() {
    $scope.sympMsg = "";
    $scope.pregMsg = "";
    $scope.accMsg = "";
    $scope.parMsg = "";
    $scope.earMsg = "";
    $scope.eyeMsg = "";
    $scope.teeMsg = "";
    $scope.getPregnantMsg = "";

    if($scope.patient.sick) {
      if(!$scope.symptomsList[0].name || $scope.symptomsList[0].name === "") {
        $scope.sympMsg = "Add symptoms of your sickness";
        return false;
      }
    }

    if($scope.patient.pregnant) {
      if(!$scope.patient.duration) {
        $scope.pregMsg = "Please select how long you have been pregnant.";
        return false;
      }
    }

    if($scope.patient.accident) {
      if(!$scope.patient.injuries) {
        $scope.accMsg = "Please write the injuries sustained.";
        return false;
      }
    }

    if($scope.patient.stroke) {
      if(!$scope.patient.paralysis) {
        $scope.paraMsg = "Please write the paralysis sustained.";
        return false;
      }
    }


    if($scope.patient.eye) {
      if(!$scope.patient.eyeIssue) {
        $scope.eyeMsg = "This field cannot be empty.";
        return false;
      }
    }

     if($scope.patient.ear) {
      if(!$scope.patient.earIssue) {
        $scope.earMsg = "This field cannot be empty.";
        return false;
      }
    }

     if($scope.patient.teeth) {
      if(!$scope.patient.teethIssue) {
        $scope.teeMsg = "This field cannot be empty.";
        return false;
      }
    }

    if($scope.patient.getPregnant) {
      if(!$scope.patient.getPregIssue) {
        $scope.getPregnantMsg = "This field cannot be empty.";
        return false;
      }
    }

    if($scope.patient.other) {
      if(!$scope.patient.otherIssue) {
        $scope.otherMsg = "This field cannot be empty.";
        return false;
      }
    }

    if($scope.patient.personal) {
      if(!$scope.patient.personalIssue) {
        $scope.personalMsg = "This field cannot be empty.";
        return false;
      }
    }

    $scope.sendRequest($scope.docInfo);
    //$scope.continue();
  }

 
  $scope.sendRequest = function(doc) {
      doc.loading = true;
      $scope.docInfo = doc;
      $scope.patient.history = "";
      if($scope.patient.sick) {
        $scope.patient.history =  "I am sick. I am having the following symptoms:"
        var str = "";
        for(var i = 0; i < $scope.symptomsList.length ; i++) {
          str += $scope.symptomsList[i].name + "<br>";
        }

        $scope.patient.history += '<blockquote>' + str + "</blockquote>";

        if($scope.patient.period) {
           $scope.patient.history += "<br>The symptom(s) have lasted for " +  $scope.patient.period +
            " till date.<br>";
        }

        if($scope.patient.how) {
          $scope.patient.history += "Brief history of the sickness was stated as it is: <br>" +
           "<blockquote>" + $scope.patient.how + ".</blockquote>";
        }

      } 

      if($scope.patient.pregnant) {
        $scope.patient.history += "This patient is  <b> " + $scope.patient.duration + "</b> pregnant.<br>";
      }

      if($scope.patient.accident) {
        $scope.patient.history += "This patient had an accident and sustained injuries as stated:<br>" +
         "<blockquote> " + $scope.patient.injuries + "</blockquote>";
      }

      if($scope.patient.stroke) {
         $scope.patient.history += "This patient had stroke and sustained paralysis as stated: <br>" +
         "<blockquote>" + $scope.patient.paralysis + "</blockquote>";
      }

      if($scope.patient.ear) {
         $scope.patient.history += "This patient is having ear problem as explained: <br>" +
         "<blockquote>" + $scope.patient.earIssue + "</blockquote>";
      }

      if($scope.patient.eye) {
         $scope.patient.history += "This patient is having  eye problem as explained: <br>" +
         "<blockquote>" + $scope.patient.eyeIssue + "</blockquote>";
      }

      if($scope.patient.teeth) {
         $scope.patient.history += "This patient is having teeth problem as explained: <br>" +
         "<blockquote>" + $scope.patient.teethIssue + "</blockquote>";
      }

      if($scope.patient.getPregnant) {
         $scope.patient.history += "This patient wants to <b> get pregnant. </b>This issue was explained as stated: <br>" +
         "<blockquote>" + $scope.patient.getPregIssue + "<br> Last menstruation was  <b> " + $scope.patient.lmp + " </b></blockquote>";
      }


      if($scope.patient.hasMedicated) {
         $scope.patient.history += "This patient have tried other medications or self medications but the complaints persisted."
      }

      if($scope.patient.personal) {
         $scope.patient.history += "This patient needs a personal doctor. The reason is explained below: <br>" +
         "<blockquote>" + $scope.patient.personalIssue + "</blockquote>";
      }

      if($scope.patient.other) {
         $scope.patient.history += "Other issues this patient had were also explained below: <br>" +
         "<blockquote>" + $scope.patient.otherIssue + "</blockquote>";
      }

      var user = localManager.getValue("resolveUser");

      if($scope.docInfo.user_id !== user.user_id) {

        var random = parseInt(Math.floor(Math.random() * 999999) + "" + Math.floor(Math.random() * 99999));     
        $scope.patient.type = "consultation";      
        $scope.patient.message_id = random;
        $scope.patient.symptoms = list;
        $scope.patient.date = + new Date();
        $scope.patient.receiverId = $scope.docInfo.user_id;

        var data = $scope.patient;

    
        var fd = new FormData();
        
        for(var key in data){
          if(key !== "symptoms" && data.hasOwnProperty(key))
            fd.append(key,data[key]);
        };


        for(var i = 0; i < data.symptoms.length; i++){
          if(data.symptoms[i].name)
            fd.append("symptoms", data.symptoms[i].name);
        }


        if($scope.blobs && $scope.files) {
          var files = $scope.files.concat($scope.blobs);
        } else if($scope.blobs) {
          var files = $scope.blobs;
        } else if($scope.files) {
          var files = $scope.files;
        }


        if(files){
          if(files.length <= 5){
            for(var key in files){
              if(files[key].size <= 8388608 && files.hasOwnProperty(key)) {    
                fd.append("images",files[key]);          
              } else {
                alert("Error: Complain NOT sent! Reason: One of the file size is greater than 8mb");
                return;
              }
            };
            sizeOk();
          } else {
            alert("Error: Complain NOT sent! Reason: You can't upload more than 5 files with this complaint.");
          }

        } else {
          if($scope.patient.description) {
            sizeOk();
          } else {
            alert('Please write your complain')
          }
        }


        function sizeOk(){
          var xhr = new XMLHttpRequest()
          xhr.upload.addEventListener("progress", uploadProgress, false);
          xhr.addEventListener("load", uploadComplete, false);
          xhr.addEventListener("error", uploadFailed, false);
          xhr.addEventListener("abort", uploadCanceled, false);
         
          xhr.open("POST", "/user/patient/doctor/connection");
          xhr.send(fd);
          $scope.progressVisible = false;
          if(player.srcObject)
            player.srcObject.getVideoTracks().forEach(function(track) { track.stop()});
        }

        //original
        /*$http({
          method  : 'PUT',
          url     : "/user/patient/doctor/connection",
          data : $scope.patient,
          headers : {'Content-Type': 'application/json'} 
          })
        .success(function(data) {
            $scope.loading = false;         
            if(data.status) {             
              $scope.status = "Your request was sent successfully!";
            }
        });*/
      } else {
        alert("Booking failed! Reason: You cannot book yourself.")
      }
        
   }



   function uploadProgress(evt) {
      $scope.progressVisible = true;
      $scope.$apply(function(){
          if (evt.lengthComputable) {
            
              $scope.progress = Math.round(evt.loaded * 100 / evt.total)
              if($scope.progress === 100) {
                $scope.statusMsg = "Your complaint has been queued in PWR successfully! Doctors will respond soon.";
              }
              
          } else {
              $scope.progress = 'unable to compute'
          }
      })
  }


  function uploadComplete(evt) {       
     $scope.$apply(function(){
      $scope.userData = JSON.parse(evt.target.responseText);
      if($scope.userData){
	      $scope.docInfo.loading = false;
	      $scope.docInfo.isSent = true;
    	} else {
    		$scope.docInfo.loading = false;	      
    		ModalService.showModal({
	      	templateUrl: 'auth.html',
	      	controller: 'authModalController'
	     	}).then(function(modal) {
	    		modal.element.modal();
	    		modal.close.then(function(result) {             
	    		});
	    	});
    	}
      //alert("Consultation request sent! The doctor will be notified. Please contact us if you did not receive any response from the doctor within 12 hours")
    })
       
  }

  function uploadFailed(evt) {
    alert("There was an error attempting to upload the file.");
  }

  function uploadCanceled(evt) {
    $scope.$apply(function(){
      $scope.progressVisible = false
    })
    alert("The upload has been canceled by the user or the browser dropped the connection.")
  }



  //take photo logic
  //this cavElem, playElem and CaptureElem were gotten from directive attached to the element in the view
  

 
  var player;//document.getElementById('player2');
  var captureButton;//document.getElementById('capture2');
  var canvasArea;//document.getElementById('canvasArea2');
	

  $rootScope.$on("get canvas",function(event,data){ 
  	canvasArea = data;
	})

	$rootScope.$on("get player",function(event,data){ 	
		player = data;//angular.element(document.getElementById('capture2'));
	})

	$rootScope.$on("get captureButton",function(event,data){ 	
		captureButton = data;
		captureButton.hasEvent = false;
	})

  $scope.blobs = [];
  $scope.isCapture = false;


  $scope.takePhoto = function() {    
    $scope.isCapture = true;
    var canvas;
    var canvasId;
    var iconClose;
   
    //var context = canvas.getContext('2d');
    
    
    constraints = {
      video: { width: 480, height: 280 }
    };

    captureButton.style.visibility = "visible";
    player.height = 330;    
      if(!captureButton.hasEvent)
      captureButton.addEventListener('click', function() { 
        if($scope.blobs.length <= 5) {    
          canvas = document.createElement('canvas');
          iconClose = document.createElement('i');
          iconClose.className = "fa fa-times ml-1 videoPicDelete";
          iconClose.style.marginTop = "-85px";
          iconClose.style.marginRight = "20px";
          iconClose.style.color = "red";         
          canvas.className = "image-fit";
          canvas.id = Math.floor(Math.random() * 9999999).toString();
          iconClose.id = Math.floor(Math.random() * 99999).toString();
          context = canvas.getContext('2d');
          context.drawImage(player, 0, 0, canvas.width, canvas.height);


          templateService.playAudio(5);
          canvasArea.append(canvas);
          canvasArea.append(iconClose);
          //Stop all video streams.
          //player.srcObject.getVideoTracks().forEach(track => track.stop());
          getImage(canvas.id);
          var elemCanvas = document.getElementById(canvas.id);
          var elemI = document.getElementById(iconClose.id);
          document.getElementById(iconClose.id).addEventListener('click',function(){
            canvasArea.removeChild(elemCanvas);
            canvasArea.removeChild(elemI);
            removeFromBlobList(elemCanvas.id)
          });  
          captureButton.hasEvent = true;  
        } else {
          alert("Maximum number of pictures has exceeded! Please delete some and continue")
        } 
      });
    

    /*
   getUserMedia = navigator.mozGetUserMedia.bind(navigator);
  navigator.getUserMedia = getUserMedia;
    */

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // Attach the video stream to the video element and autoplay.

    var media = getUserMedia.bind(navigator);

    var onSuccess = function(stream) {
      player.srcObject = stream;      
    };

    var onError = function(error) {
      console.log(error);
    };

    media(constraints,onSuccess,onError);
   
  }

  $scope.closeCam = function() {
    $scope.isCapture = false;
    player.srcObject.getVideoTracks().forEach(function(track) {track.stop()});
  }

  function getImage(canvas) {
    try {
    var img = new Image();
    var Pic = document.getElementById(canvas).toDataURL("image/png");
    Pic = Pic.replace(/^data:image\/(png|jpg);base64,/, "")
    
    //img.sizes();
    //img.name();
    //img.src = Pic;
    if(window.atob) {
      var blobBin = window.atob(Pic);
      var array = [];
      for(var i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
      }

      var file = new Blob([new Uint8Array(array)], {type: 'image/png'});      
      file.id = canvas;
      $scope.blobs.push(file);
    } else {
      alert("Oops! Seems your browser does not support this for now.Please choose an existing file.")
    }

    } catch(e) {
      alert(e.mess)
     
    }

  }

  function removeFromBlobList(id) {
    for(var i = 0; i < $scope.blobs.length; i++) {
      if($scope.blobs[i].id === id) {
        $scope.blobs.splice(i,1);
      }
    }
  }

 
   $scope.getAnswer = function() {
     if(Object.keys($scope.patient).length > 0){
      var random = parseInt(Math.floor(Math.random() * 999999) + "" + Math.floor(Math.random() * 99999));
       
       $scope.patient.type = "question";
       
       $scope.patient.message_id = random;
       $scope.patient.date = new Date();
       $scope.patient.receiverId = $scope.docInfo.user_id;

        $http({
            method  : 'POST',
            url     : "/user/patient/doctor/connection",
            data : $scope.patient,
            headers : {'Content-Type': 'application/json'} 
            })
          .success(function(data) {
              if(data)              
               $scope.message = "Your complaint has been sent!";
               $scope.patient.message= " ";
               //use settime out to clear the textfieeld and the response message
          });
      }
    }
  
}]);

app.directive('canvasArea',["$rootScope",function($rootScope){
	return {
    link: function (scope, element, attr) {
      $rootScope.$broadcast("get canvas",element[0]);
    }
	}
}])

app.directive('playerElement',["$rootScope",function($rootScope){
	return {
    link: function (scope, element, attr) {
       $rootScope.$broadcast("get player",element[0]);
    }
	}
}])

app.directive('captureBtn',["$rootScope",function($rootScope){
	return {
    link: function (scope, element, attr) {
        $rootScope.$broadcast("get captureButton",element[0]);
    }
	}
}])

function destroyStorage(localManager) {
    localManager.removeItem("resolveUser")
    localManager.removeItem("userInfo");
    localManager.removeItem("heldSessionData");
    localManager.removeItem("currentPage");
    localManager.removeItem("currentPageForPatients");
    localManager.removeItem("receiver");
    localManager.removeItem('caller');
    localManager.removeItem("doctorInfoforCommunication")
    localManager.removeItem("patientInfoforCommunication");
    localManager.removeItem("resolveUser");
    //localManager.removeItem("patientPrescriptions");
    localManager.removeItem("holdPrescriptionId");
    localManager.removeItem("holdLabData");
    localManager.removeItem("holdScanData");
    localManager.removeItem("holdPrescriptions");
    localManager.removeItem("hasChat");
    localManager.removeItem("videoCallerList");
    localManager.removeItem("audioCallerList");
    localManager.removeItem("currPageForPharmacy");
    localManager.removeItem("pharmacyData");
    localManager.removeItem("holdPrescriptionForAttendance");
    localManager.removeItem("holdTestForAttendance");
    localManager.removeItem("laboratoryData");
    localManager.removeItem("radiologyData");
    localManager.removeItem('currPageForLaboratory');
    localManager.removeItem('currPageForRadiology');
    localManager.removeItem('prescriptionRequestData'); 
    localManager.removeItem("userId");
    localManager.removeItem('saveSocket');
    localManager.removeItem('activeAccountId');
    localManager.removeItem('mainAccount');
    localManager.removeItem('holdMessages');
    localManager.removeItem('holdId');
    localManager.removeItem("holdIdForChat");
    localManager.removeItem("holdChatList");
    localManager.removeItem("partnerDetails");
}






app.factory("cities",function(){
  var allCities = ["Aba","Abakaliki","Abeokuta","Abonnema","Abuja","Ado Ekiti","Afikpo","Agbor","Agulu","Aku","Akure",
  "Amaigbo","Ankpa","Asaba","Auchi","Awka","Azare","Bama","Bauchi","Bende","Benin City",
  "Bida","Birnin Kebbi","Biu","Buguma","Calabar","Damaturu","Daura","Dutse","Ede","Effium","Effon Alaiye","Eha Amufu",
  "Ejigbo","Ekpoma","Enugu","Enugu Ukwu","Epe","Etiti",
  "Ezza Inyimagu","Funtua","Gamboru","Gashua","Gboko","Gbongan","Gombe","Gusau","Hadejia","Ibadan","Idah",
  "Ife","Ifo","Ifon","Igboho","Igbo Ora","Igbo Ukwu","Ihiala","Ijebu Igbo",
  "Ijebu Ode","Ijero","Ikare","Ikeja","Ikerre","Ikire","Ikirun","Ikom","Ikorodu","Ikot Ekpene","Ila Orangun",
  "Ilawe Ekiti","Ilesha","Ilobu","Ilorin","Inisa","Ise","Iseyin",
  "Ishieke","Iwo","Jalingo","Jimeta","Jos","Kaduna","Kafanchan","Kagoro","Kano","Katsina","Kaura Namoda","Keffi","Kishi",
  "Kontagora","Kuroko","Lafia","Lagos",
  "Lokoja","Maiduguri","Makurdi","Malumfashi","Minna","Modakeke","Mubi","Nguru","Nkpor",
  "Nnewi","Nsukka","Numan","Obosi","Offa","Ogaminan","Ogbomosho","Ohafia","Oka Akoko","Okene",
  "Okigwi","Okitipupa","Okpogho","Okrika","Ondo","Onitsha","Oron","Oshogbo","Otukpo","Owerri",
  "Owo","Oyo","Ozubulu","Port Harcourt","Sagamu","Sango Otta","Sapele","Shaki",
  "Sokoto","Suleja","Uga","Ugep","Ughelli","Umuahia","Uromi","Uyo","Warri","Wukari","Yenagoa","Yola","Zaria"];

  return allCities;
});

app.factory("symptomsFactory",function(){

  var allSymptoms = ["Headache","Abdominal Pain","Fever","Nausea","Vomiting","Neck Pain","Stiff Neck","Catarrh","Cough","Body Weakness",
  "Joint Pain","Difficulty breathing"];

  return allSymptoms;
});