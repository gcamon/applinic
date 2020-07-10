
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




app.controller("hompageController",["$scope","cities","scanTests","$http",
  "ModalService","$rootScope","homePageDynamicService",
  "skillService","homepageSearchService","localManager","$window","templateService","mySocket","$location","$anchorScroll",
  function($scope,cities,scanTests,$http,
  	ModalService,$rootScope,homePageDynamicService,skillService,
  	homepageSearchService,localManager,$window,templateService,mySocket,$location,$anchorScroll){


  $rootScope.cities = cities;

  $rootScope.person = {};

  $rootScope.patient = {}; //used in booking modal

  $scope.itemList = [];

  $rootScope.user = {};

  $rootScope.user.category = "Radiology";


  var dyna = [];
  var filter = {};
  var spArr = [];
  var skArr = [];
  var diArr = [];

  $scope.dropDownList = [];

  

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


  $scope.todashboard = function(type) {
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
      case "Field Agent":
        $window.location.href = "/user/field-agent/" + data.user_id;
      break;
      default:
        $window.location.href = "/user/view"; 
      break; 
    }
  }

  var qStr = window.location.search;
  if(qStr) {
    var qVal = qStr.split('=');
    var str = qVal[qVal.length - 1] || "";
    $rootScope.user.item = str.replace(/%20/g, " ");
  }

  $scope.find = function() {
  	$scope.loading = true;
    $location.hash('searchResultArea');
    $rootScope.user.test_to_run = $scope.pickedTests;
  	homepageSearchService.get($rootScope.user,function(response){
      console.log(response)
      $scope.loading = false; 
      $scope.searchResultFull = response.full;
      $scope.searchResultSub = response.less;      
      $rootScope.searchItemType = "radiology test(s)";
      $anchorScroll()
      if(response.full[0]){
        $rootScope.searchItems =  response.full[0].str;
      } else if(response.less[0]){
        $rootScope.searchItems = response.less[0].str
      }
    });  
  }

  $rootScope.userLoginService = function() {
    $http.get("/user/getuser")
    .success(function(user){
      //user = localManager.getValue("resolveUser");
      if(user.isLoggedIn){
        $rootScope.user.phone = user.phone;
        $rootScope.user.address = user.address || user.work_place;

        $rootScope.checkLogIn = user;
        $rootScope.checkLogIn.typeOfUser = user.type;
      
        mySocket.emit('join',{userId: user.user_id});      
      } else {
        $rootScope.checkLogIn = {};
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

 
  $rootScope.holdcenter = {};

  $scope.chat = function(doc) {
  	if($rootScope.checkLogIn.isLoggedIn){ 
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

  homePageDynamicService.query($rootScope.user,function(data){
    $scope.dropDownList = scanTests.listInfo1.concat(scanTests.listInfo2,scanTests.listInfo3,
    scanTests.listInfo4,scanTests.listInfo5,scanTests.listInfo6,data);
  });  


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

  $scope.find();

  $scope.pickedTests = [];

  $scope.add = function() {
    if($rootScope.user.item) {
      $scope.pickedTests.push($rootScope.user.item);
    } else {
      alert("Please enter a test name before adding");
    }
  }


  $scope.forward = function(center) {
    if($rootScope.checkLogIn.isLoggedIn){ 
      $rootScope.holdTheCenterToFowardTestTo = center;
      //$location.path("/test/selected-laboratory");
      ModalService.showModal({
          templateUrl: 'search-result.html',
          controller: "testSearchSelectedCenterController"
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

  var elemIndex;

  $scope.remove = function(test) {
    elemIndex = $scope.pickedTests.map(function(x){return x}).indexOf(test)
    $scope.pickedTests.splice(elemIndex,1)
  }


  $scope.getStr = function(str){
    if(str) {
      var newStr = "";
      var strArr = str.split(",");
      for(var i = 0; i < strArr.length; i++){
        newStr += "@" + strArr[i] + " "
      }

      return newStr;
    }
   
  }

  $scope.notStr = function(arr) {
    if(arr) {
      var newStr = "";
      for(var i = 0; i < arr.length; i++){
        newStr += "@" + arr[i].name + " "
      }

      return newStr;
    }
  }

  $scope.getTest = function(test) {
    $rootScope.user.item = test;
    $scope.find()
  }

}]);


app.controller("testSearchSelectedCenterController",["$scope","$location","$window","$http","templateService","localManager","ModalService",
  "$rootScope",function($scope,$location,$window,$http,templateService,localManager,ModalService,$rootScope){
  $scope.data = $rootScope.holdTheCenterToFowardTestTo;
  $scope.user = {};
  var sendObj = {};

  $scope.typeOfSearch = "diagnostic";


  $scope.forwardType = "inperson";

  $scope.someone = function(type){
    $scope.forwardType = type;
  }


  $scope.cancel = function(){
    $scope.forwardType = null;
    if($scope.user.patient_phone)
      $scope.user.patient_phone = ""
  }

  $scope.isContent = true;

  if($rootScope.checkLogIn.typeOfUser !== 'Patient') {
    $scope.user.patient_phone = "";
    $scope.isToSomeOne = true;
    $scope.user.someone = true;
  }

  $scope.send = function (){ 
    if($scope.forwardType !== 'inperson') {

      if(!$scope.user.phone) {
        $scope.phoneMsg = "Enter patient's phone number";
        return;
      }

      var isNumber = testNumber($scope.user.phone);

      if(isNumber) {
        if($scope.user.phone.indexOf('+') == -1)
          $scope.user.phone = "+234" + parseInt($scope.user.phone); 
      } else {
        $scope.phoneMsg = "Please enter a valid phone number.";
        return;
      }
     
    } 

    if(!$scope.data.clinical_summary) {
      //$scope.summuryMsg = "Enter clinic summary";
      //return;
      $scope.data.clinical_summary = "N/A";
    }

    if(!$scope.data.indication) {
      //$scope.indictionMsg = "Enter indication";
      //return;
      $scope.data.indication = "N/A";
    }

    $scope.summuryMsg = "";
    $scope.phoneMsg = "";
    $scope.indictionMsg = ""; 



    /*var random;
    var labData = templateService.holdLaboratoryReferralData;
    if(labData.ref_id){      
      random = labData.ref_id;
    } else {      
      random = $rootScope.genRefId;
    } */ 

    var date = new Date();
    $scope.data.type = $scope.forwardType;
    //$scope.data.ref_id = random;
    $scope.data.user_id = $scope.data.id;
    $scope.data.sent_date = date;
    //$scope.data.session_id = labData.session_id;

    var testArr = $scope.data.str.split(",");    
    for(var i = 0; i < testArr.length; i++){
      var testObj = {};
      testObj.name = testArr[i];
      testObj.sn = i + 1;
      testObj.select = true;
      testArr[i] = testObj;
    }

    $scope.data.test_to_run = testArr;

    for(var i in $scope.data) {
      if($scope.data.hasOwnProperty(i)){
        sendObj[i] = $scope.data[i];
      }
    }

    sendObj.isCommonSearch = true;

    sendObj.phone = $scope.user.phone;

    send(sendObj,"/user/scan-search/radiology/referral");
  }

 
  $scope.back = function() {
    $scope.isNewPatient = false;
    $scope.isToSomeOne = true
  }


  function send(data,url) {
    $scope.loading = true;
    $http({
      method  : 'PUT',
      url     : url,
      data    : data,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {     
      if(data.isNewPatient) {
        $scope.isNewPatient = true;
        $scope.isToSomeOne = false
      } else if(data.isReferReq) {
        $scope.isReferReq = true;
      } else {
        $scope.isContent = false;
        $scope.isSent = true;
        $scope.result = data.ref_id;
        $scope.user.patient_names = data.refObj.laboratory.patient_firstname + " " + data.refObj.laboratory.patient_lastname;
      }
      $scope.loading = false;
    });
  }

  $scope.invite = function(){
    $scope.loading = true;
    $scope.user.recepient = $scope.user.phone;
    $http.post("/user/invitation",$scope.user)
    .success(function(res){
      console.log(res)
      $scope.inviteStatus = res.status;
      $scope.invitationMsg = res.message; 
      $scope.loading = false;    
    })
  }

 

}]);

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
      $scope.messageBody = "Requesting for the following " + $rootScope.searchItemType + ":  " + $rootScope.searchItems;
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
    		//mySocket.emit('join',{userId: data.user_id});
        $rootScope.userLoginService();
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


/*app.controller("investigationSearchCtrl",["$scope","$rootScope","$window","$http","$timeout","deviceCheckService",
  function($scope,$rootScope,$window,$http,$timeout,deviceCheckService){
  $scope.invest = {};

  $scope.invest.type = 'radio';

  $scope.findInvestigation = function() {
    var url = "/investigation/result?type=" + $scope.invest.type + "&id=" + $scope.invest.id;
    $window.location.href = url;
  }

  $http({
    method  : 'GET',
    url     : "/api/dicom-details",
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {              
    $scope.dicomDetails = data;
    $scope.dcmserver = "http://" + $scope.dicomDetails.ip_address + ":8080";
  }); 

  $scope.supported = false;

  $scope.copy = "";

  $scope.success = function (id) {
    $scope.copy = 'Copied!';
    $timeout(function(){
      $scope.copy = "";
    },2000)
  };

  $scope.isMobileDevice = deviceCheckService.getDeviceType();
 

  $scope.openjnlp = function(link) {
    window.location.href = "jnlp://" + link;
  }


}]);*/


function testNumber(str) {
  var intRegex = /[0-9 -()+]+$/;
  return intRegex.test(str)
}

function calculate_age(dob) { 
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}






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



app.factory("scanTests",function(){
var scanTestList = {};

scanTestList.listInfo1 = [{name: "Chest X-ray (CXR)  1 view",price: 1000,id:1},{name: "Skull X-ray (FXR)  (2 View)",price:800,id:2},
{name: "Pelvic  X-ray (1 view)",id:3},
{name: "Intravenous Urography (IVU)",id:4},{name: "Barium Swallow (BS)",id:5},{name: "Barium Meal & follow through (BM&FT)",id:6},
{name: "Retrograde Cystourethrogram(Uretrography)",id:7},{name: "Barium Enema",id:8},
{name: "POST-NASAL SPACE(P.N.S)  Nasopharnyx (1 View)",id:9},{name: "Shoulder X-Ray (1 view)",id:10},
{name: "Abdomen X-ray",id:11},{name: "Abdominal (Erect & Supine) X-ray",id:12},{name: "Ankle X-ray (2 Views)",id:13},
{name: "Calcaneum X-ray (2 Views)",id:14},
{name: "Neck/Cervical X-ray (2 Views)",id:15},{name: "Coccyx X-ray",id:16},{name: "Elbow joint X-ray (2 Views)",id:17},
{name: "Femur/Thigh X-ray (2 views)",id:18},{name: "Finger X-ray (2 views)",id:19},{name: "Foot/Toe X-ray (2 Views)",id:20},
{name: "Hand (Carpal/Metacarpal Bones) X-ray (2 Views)",id:21},{name: "Hip Joint X-ray (2 Views)",id:22},
{name: "Humerus/Upper Arm X-ray (2 Views)",id:23},
{name: "Knee X-ray (2 views)",id:24},{name: "Lumbo Sacral Spines X-ray (2 views)",id:25},{name: "Mastoid Air Cells",id:26},
{name: "Micturating Cystourethrogram",id:27},{name: "Scapula X-ray (2 Views)",id:28},{name: "Sternum X-ray (2 Views)",id:29},
{name: "Thoracic Inlets X-Ray (2 Views)",id:30},
{name: "Tibia/Fibula (Leg) X-ray (2 Views)",id:31},{name: "Ulna/Radius (Forearm) X-ray",id:32},{name: "Wrist X-ray (2 views)",id:33},
{name: "Forearm/Ulna/Radius X-ray (2 views)",id:34},{name: "Jaw Maxilla and Mandibles X-ray (2 Views)",id:35},
{name: "Clavicular X-Ray (1 View)",id:36},{name: "Sternoclavicular Joints (2 views)",id:37},{name: "Thoracic Vertabrae X-Ray (2 Views)",id:38},
{name: "Temporomandibular Joint (5 Views)",id:39},{name: "X-ray Paranasal sinuses - OM, OF, LAT.",id:40},
{name: "CHEST X-RAY(PA and LAT.) 2 VIEWS",id:41},{name: "Ankle X-ray(3views)",id:42},{name: "Foot/Toe X-ray (3Views)",id:43},
{name: "Fistulogram",id:44},
{name: "Shoulder X-ray(3viiews)",id:45},{name: "Shoulder X-ray(2views)",id:46},{name: "VENOGRAM",id:47},
{name: "Occipito-mental(OM) X-ray (1 view)",id:48},
{name: "Hand X-ray (Carpal/Metacarpal:Both Hands)(4views)",id:49},
{name: "Foot/Toe X-ray (Both Feet)(4views)",id:50},{name: "Knee X-ray (Both knees) (4views)",id:51},{name: "Ankle X-ray (Both Ankles)(4views)",id:52},
{name: "Wrist X-ray (Both wrists) (4Views)",id:53},
{name: "Tibia/Fibula X-ray (Both Legs)(4Views)",id:54},{name: "Femur/Thigh X-ray(Both Femoral/Thighs) (4Views)",id:55},
{name: "X-ray Reporting Only",id:56},{name: "Myelogram",id:57},{name: "Clavicle X-ray (2 views)",id:58},{name: "Pelvimetry X-ray",id:59},
{name: "Mastoids",id:60},
{name: "TEMPORO-MANDIBULAR JOINT(TMJ) X-RAY X-ray 2views",id:61},{name: "Digital X-ray",id:62},{name: "LATERAL SOFT TISSUE (NECK)",id:63},
{name: "Cervical Spine(Flexion and Extension) 2 Views",id:64},{name: "Retrograde Urethrogram",id:65},{name: "X-Ray CD Reprinting",id:66},
{name: "HYSTEROSALPINOGRAM -HSG (DISPOSABLE)",id:67},{name: "HYSTEROSALPINOGRAM -HSG (NON-DISPOSABLE)",id:68},
{name: "PROSTRATE USS",id:69},{name: "Lumbo Sacral Spine X-ray (3 Views)",id:70},
{name: "Hand/Finger - NHIS",id:71},{name: "Wrist - NHIS",id:72},{name: "Foream - NHIS",id:73},{name: "Elbow - NHIS",id:74},
{name: "Humerus - NHIS",id:75},{name: "Shoulder - NHIS",id:76},{name: "Clavicle - NHIS",id:77},
{name: "Foot/Toe - NHIS",id:78},{name: "Ancle-NHIS",id:79},
{name: "Leg (Tibia/Fibula NHIS",id:80},{name: "Knee -NHIS",id:81},{name: "Hip -NHIS",id:82},{name: "Femur or tThigh -NHIS",id:83},
{name: "Pelvic -NHIS",id:84},{name: "Chest(PA/AP) - NHIS",id:85},{name: "Chest(PA/Latereal) - NHIS",id:86},
{name: "Chest For Ribs (Oblique) - NHIS",id:87},{name: "Apical/Lordotic - NHIS",id:88},{name: "Stemum - NHIS",id:89},
{name: "Thoracic Inlet - NHIS",id:90},
{name: "Cervical Spine - NHIS",id:91},
{name: "Lateral Neck(Soft Tissue - NHIS",id:92},{name: "Thoracic Spine - NHIS",id:93},{name: "Thoraco Lumba Spine - NHIS",id:94},
{name: "Lumbar Spine - NHIS",id:95},{name: "Lumbo Sacral Spine - NHIS",id:96},{name: "Scrum - NHIS",id:97},
{name: "Sacro Illiac Joint (S.I.J) - NHIS",id:98},
{name: "Cervical Spine (Oblique) - NHIS",id:99},{name: "Sacro-coccxy - NHIS",id:100},
{name: "Abdomen(Plain) - NHIS",id:101},{name: "Abdomen(Eract/Supine) - NHIS",id:102},{name: "Abdomen (Pregnancy) - NHIS",id:103},
{name: "Skule(AP/Lat) - NHIS",id:104},{name: "Skulll(Pa/Lat/Townes) - NHIS",id:105},
{name: "Mastoids - NHIS",id:106},{name: "Sinuses AP/LNT/OM - NHIS",id:107},{name: "Mandibles (Jaw) - NHIS",id:108},
{name: "Temporo Mandibular Joints (TM) - NHIS",id:109},{name: "Sella Turcica - NHIS",id:111},{name: "Tangental - NHIS",id:112},
{name: "Occipito-Mental (OM) - NHIS",id:113},
{name: "Periapical - NHIS",id:114},{name: "Bitewings - NHIS",id:115},{name: "Panoramic View - NHIS",id:116},{name: "Barium Swallow - NHIS",id:117},
{name: "Barium Meal/Follow through - NHIS",id:118},{name: "Barium enema - NHIS",id:119},{name: "Intravenus Urography (IVU) - NHIS",id:120},
{name: "Hysterosalpingogram (HSG) - NHIS",id:121},{name: "Cysto-Urethorgram - NHIS",id:122},{name: "Fistulogram - NHIS",id:123},
{name: "Myelogram - NHIS",id:124},{name: "Skeletal Survey (Adult) - NHIS",id:125},{name: "Electrocadography - NHIS",id:126},
{name: "Eletro Encephalography",id:127},{name: "Mycturating Cyto-Urethrogram - NHIS",id:128},{name: "Phlebogram-One Leg - NHIS",id:129},
{name: "Venogram-One Leg - NHIS",id:130},{name: "Arthrogram - NHIS",id:131},{name: "Sialogram - NHIS",id:132},{name: "Sinogram - NHIS",id:133},
{name: "MRI Scan - NHIS",id:134},{name: "CT Scan - NHIS",id:135},{name: "Mammography - NHIS",id:136}];

/*******Listing of Ultrasonography *************/    

scanTestList.listInfo2 = [{name: "Obstetric/Gynaecology Scan",id:137},{name: "Female Pelvic Scan - With print out",id:138},
{name: "Female Pelvic Scan - Without print out",id:139},{name: "Abdominal Scan emphasis - Liver (Hepatobillary) Scan",id:140},
{name: "Ophthalmic Scan Per Eye",id:141},{name: "ECHOCARDIOGRAPHY(Cardiac Echo)",id:142},{name: "SPIROMETRY TEST",id:143},
{name: "Doppler Ultrasound Per Region",id:144},{name: "Abdominal Scan",id:145},{name: "Abdominal Scan emphasis - Kidney (Renal Scan)",id:146},
{name: "Abdominal Scan emphasis - Bowels",id:147},
{name: "Abdominal Scan emphasis - Pancrease",id:148},{name: "Abdominal Scan emphasis - Spleen",id:149},
{name: "Scrotal/Testicular Scan",id:150},{name: "Soft Tissue (Breast) scan",id:151},{name: "BREAST SCAN",id:152},
{name: "TRANSVAGINAL SCAN",id:153},{name: "FONTANELLE USS",id:154},{name: "Folliculometry Scan",id:155},
{name: "Soft Tissue(Neck/Thyroid etc) Scan",id:156},
{name: "TRANSRECTAL SCAN",id:157},{name: "THYROID SCAN",id:158},{name: "Soft Tissue(Muscles) Ultrasound",id:159},
{name: "Soft Tissue(Thigh) Scan",id:160},
{name: "STRESS ECHOCARDIOGRAPHY(Stress Cardiac Echo)",id:161},{name: "Obstetric - 4D",id:162},{name: "Biophysical Profile - Obstetric",id:163},
{name: "Ultrasound Print Out Per Sheet",id:164},{name: "Ultrasound Guided Biopsy",id:165},{name: "Abdomino-Pelvic Scan",id:166},
{name: "SONO-HSG",id:167},{name: "HAND/FINGER (NHIS)",id:168},{name: "Obstetric Scan - NHIS",id:169},{name: "Abdominal Scann - NHIS",id:170},
{name: "Pelvic Scan - NHIS",id:171},{name: "Breast Scan - NHIS",id:172},{name: "Bladder Scan - NHIS",id:173},
{name: "Abdominal Pelvic Scan - NHIS",id:174},{name: "Prostate Scan - NHIS",id:175},{name: "Thyroid Scan - NHIS",id:176},
{name: "Testes/scrotal Scan (each) - NHIS",id:177},{name: "Ovulometry/Tv Scan - NHIS",id:178},{name: "Trans-Fontanellar  (Children) - NHIS",id:179}];

/********************Listing of Computerized Tomography Scan (C.T. SCAN)  **********************/   


scanTestList.listInfo3 = [{name: "CT Scan Interpreting Only",id:180},{name: "BRAIN/SKULL C.T.SCAN-PLAIN (P)",id:181},
{name: "Neck CT Scan (Cervical)-PLAIN",id:182},{name: "CT Scan Sinuses/Nasal Cavity",id:183},{name: "Abdominal/Pelvic CT Scan-PLAIN",id:184},
{name: "CT Scan Pelvic Girdle (Pelvis)",id:185},{name: "Thoracic Spine CT Scan",id:186},{name: "Chest CT Scan-PLAIN",id:187},
{name: "CT Scan Femur (thigh) and Related Soft Tissues",id:188},{name: "C.T.SCAN-Angiography Whole Body",id:189},
{name: "C.T.SCAN-Angiography Regional",id:190},{name: "C.T.SCAN-Angiography (Interventional) Including Introduction of Stents",id:200},
{name: "C.T.SCAN CD Result Recording Per Plate",id:201},{name: "Hand CT Scan (Fingers Included)",id:202},

{name: "CT Scan Upper Arm (Humerus and Related Soft Tissues)",id:203},{name: "CT Scan Lower Arm (Ulna and Redius and Related Soft Tissues)",id:204},
{name: "CT Scan Tibia and Fibula and Related Soft Tissues",id:205},{name: "Lumbosacral Spine C.T.SCAN",id:206},
{name: "BRAIN/SKULL C.T.SCAN-SINGLE CONTRAST (P)",id:207},{name: "ABDOMINAL/PELVIC C.T.SCAN-SINGLE CONTRAST",id:208},
{name: "ABDOMINAL/PELVIC C.T.SCAN-DOUBLE CONTRAST",id:209},{name: "ABDOMINAL/PELVIC C.T.SCAN-TRIPPLE CONTRAST",id:210},
{name: "CHEST C.T.SCAN-SINGLE CONTRAST",id:211},{name: "CHEST C.T.SCAN-DOUBLE CONTRAST",id:212},{name: "CHEST C.T.SCAN-TRIPPLE CONTRAST",id:213},
{name: "KNEE JOINT C.T.SCAN",id:214},{name: "NECK C.T. SCAN (SoftTissue) -Single Contrast",id:215},{name: "ELBOW JOINT C.T.SCAN",id:216},
{name: "ORBITAL C.T.SCAN",id:217},{name: "C.T.SCAN-PELVIMETRY",id:218},{name: "EAR/MASTOIDS C.T.SCAN",id:219},{name: "C.T.SCAN-MYELOGRAM",id:220},
{name: "MRI",id:221},
{name: "MRI REPORTING ONLY",id:222},{name: "ANKLE C.T.SCAN",id:223},{name: "C.T.SCAN-Angiography including Tripple Screen/Cardiac Study",id:224},
{name: "C.T.SCAN- Perfusion(Specify Organ/Tissue)",id:225},{name: "C.T.SCAN-Colonoscopy(Virtual Colonoscopy)",id:226},
{name: "C.T.SCAN-Pneumography",id:227},{name: "C.T.SCAN-Calcium Scoring (for increased Specificity of FRAMINGHAM SCORE)",id:228},
{name: "C.T.SCAN-KUB (Kidney,Ureter & Bladder)",id:229},{name: "C.T.SCAN-Bronchoscopy(Virtual Bronchoscopy)",id:230},

{name: "C.T.SCAN-VENOGRAPHY",id:231},{name: "C.T Scan of the jaws (maxilla and mandibles and related soft tissues",id:232},
  {name: "CT Scan Paranasal Sinusis",id:233},
{name: "CT Scan Myelography",id:234},{name: "CT Scan IVU",id:235},{name: "CT Scanogram",id:236},
{name: "CT Scan Abdomen",id:237},{name: "C.T Scan Facial Bones",id:238},
{name: "C.T Scan Head and Neck",id:239},{name: "CT-Scan-PELVIMETRY",id:240},{name: "CT CD Reprinting",id:241},
{name: "ANGIOGRAPHY STUDIES",id:242},{name: "ABDOMINAL/PELVIC C.T. SCAN-DOUBLE/TRIPLE CONTRAST (P)",id:243},
{name: "ABDOMINAL/PELVIC C.T. SCAN-SINGLE CONTRAST (P)",id:244},
{name: "ABDOMINAL/PELVIC C.T. SCAN-PLAN (P)",id:245},
{name: "ANKLE C.T. SCAN (P)",id:246},{name: "S",id:247},{name: "BRAIN/SKULL C.T.SCAN-SINGLE CONTAST",id:248},
{name: "C. T. SCAN FACIAL BONES (P)",id:249},
{name: "C. T. SCAN HEAD AND NECK (P)",id:250},{name: "C. T. SCAN OF THE JAWS (MAXILLA AND MANDIBLES) (P)",id:251},
{name: "C. T. SCAN CD RESULT RECORDING PER PLATE (P)",id:252},{name: "C.T. SCAN REPORTING (P) (P)",id:253},
{name: "C. T. SCAN-ANGIOGRAPHY (CARDIAC STUDY) (P)",id:254},{name: "C. T. SCAN-ANGIOGRAPHY REGIONAL (P)",id:255},

{name: "C. T. SCAN-ANGIOGRAPHY WHOLE BODY (P)",id:256},
{name: "C. T. SCAN-CALCIUM SCORING (FOR INCREASED SPECDIFICITY OF FRAMINGHAM SCORE) (P)",id:257},
{name: "C. T. SCAN-COLONOSCOPY (VIRTUAL COLONOSCOPY) (P)",id:258},{name: "C. T. SCAN-KUB (KIDNEY, URETER & BLADDER) (P)",id:259},
{name: "CHEST C.T. SCAN-SINGLE CONTRAST (P)",id:260},{name: "CHEST C.T. SCAN-PLAIN (P)",id:261},{name: "CHEST C.T. SCAN-DOUBLE CONTRAST (P)",id:262},
{name: "CHEST C.T. SCAN-TRIPLE CONTRAST (P)",id:263},{name: "CHEST C.T. SCAN REPORTING (P)",id:264},{name: "C.T. SCAN ABDMEN (P)",id:265},
{name: "CHEST C.T. SCAN FEMUR (THIGH) AND RELATEED SOFT TISSUES (P)",id:266},{name: "C.T. SCAN INTERPRETING ONLY (P)",id:267},
{name: "C.T. SCAN IVU (P)",id:268},{name: "C.T. SCAN LOWER ARM (ULNA AND RADIUS AND RELATED SOFT TISSUES) (P)",id:269},
{name: "C.T. SCAN MYELOGRAPHY (P)",id:270},{name: "C.T. SCAN PELVIC GIRDLE (PELVIS) (P)",id:271},{name: "C.T. SCAN SINUSES/NASAL CAVITY (P)",id:272},
{name: "C.T. SCAN TIBIA AND FIBULA AND RELATEDE SOFT TISSUES (P)",id:273},{name: "C.T. SCAN UPPER ARM (HUMERUS AND RELATED SOFT TISSUES) (P)",id:274},
{name: "EAR/MASTODIDS C.T. SCAN (P)",id:275},{name: "ELBOW JOINT C.T. SCAN (P)",id:276},
{name: "HAND C. T. SCAN (FINGERS INCLUDED) (P)",id:277},{name: "KNEE JOINT C.T. SCAN (P)",id:278},{name: "LUMBO-SACRAL SPINE C.T. SCAN (P)",id:279},
{name: "NECK C. T. SCAN (SOFT TISSUE) - SINGLE CONTRAST (P)",id:280},{name: "NECK C. T. SCAN (CERVICAL) - PLAIN (P)",id:281},
{name: "ORBITAL C.T. SCAN (P)",id:282},{name: "THORACIC SPINE S.T. SCAN (P)",id:283},{name: "C.T. HEAD AND NECK (P)",id:284},
{name: "THORACOLUMBAR CT",id:285},
{name: "C. T. BRAIN",id:286}]


/************** Listing of ECG  ****************/

scanTestList.listInfo4 = [{name: "ECG  12 Lead/Analysis NORMAL ECG @ REST)",id:287},{name: "STRESS ECG(ECG @ EXERCISE)",id:288},
{name: "HOLTER/AMBULATORY ECG",id:289}];

/**************** Listing of MRI  ************/ 

scanTestList.listInfo5 = [{name: "MRI - ABDOMINO-PELVIC SCAN-SINGLE CONTRAST",id:290},{name: "MRI - ABDOMINO-PELVIC SCAN PLAIN",id:291},
{name: "MRI - ANKLE SCAN",id:292},{name: "MRI - BRAIN SCAN-PLAIN",id:293},{name: "MRI - BRAIN SCAN-CONTRAST",id:294},
{name: "MRI - RESULT RECORDING PER PLATE(FPR REPLACEMENT)",id:295},
{name: "FUNCTIONAL MRI (FMRI)",id:296},{name: "MRI -CERVICAL SPINE",id:297},{name: "MRI - THORACIC SPINE",id:298},
{name: "MRI - LUMBOSACRAL SPINE",id:299},
{name: "MRI - ABDOMEN",id:300},
{name: "MRI - PELVIC",id:301},{name: "MRI - CHEST",id:302},{name: "MRI - EXTREMITIES-KNEES, ANKLES, SHOULDER JOINT",id:303},
{name: "MRI - ANGIOGRAPHY STUDIES",id:304},{name: "MRI Spectroscopy",id:305},{name: "MRI - Screening One Sequence",id:306},
{name: "MRI CD Reprinting",id:307},
{name: "MRI - Chol-Pancreatography",id:308},{name: "MRI -ANGIOGRAPHY STUDIES (PEDIATRIC)",id:309},{name: "MRI CHOL-PANCREATOGRAPHY (PEDIATRIC)",id:310},
{name: "MRI SCREENING ONE SEQUENCE (PEDIATRIC)",id:311},{name: "MRI -ABDOMINO-PELVIC SCAN-SINGLE-CIBTRAST (PEDIATRIC)",id:312},
{name: "MRI -ABDOMINO-PELVIC SCAN-PLAIN (MRCP) (PEDIATRIC)",id:313},{name: "MRI -ANKLE SCAN (PEDIATRIC)",id:314},
{name: "MRI -BRAIN SCAN-PLAIN (PEDIATRIC)",id:315},{name: "MRI -BRAIN SCAN-CONTRAST (ANGIO)",id:316},
{name: "MRI REPORTING ONLY (PEDIATRIC)",id:317},{name: "MRI RESULT RECORDING PER PLATE (FOR A REPLACEMENT) (PEDIATRIC)",id:318},
{name: "MRI CD REPRINTING (PEDIATRIC)",id:319},{name: "FUNCTIONAL MRI (FMR)(PEDIATRIC)",id:320},
{name: "MRI -CERVICAL SPINE(PEDIATRIC)",id:321},{name: "THORACIC SPINE(PEDIATRIC)",id:322},{name: "MRI -LUMBOSACRAL SPINE(PEDIATRIC)",id:323},
{name: "MRI -ABDOMEN(PEDIATRIC)",id:324},
{name: "PELVIC SCAN SINGLE CONTRAST(PEDIATRIC)",id:325},{name: "MRI -CHEST(PEDIATRIC)",id:326},
{name: "MRI -EXTREMITIES-KNEES, ANKLES, SHOULDER JOINT(PEDIATRIC)",id:327},
{name: "MRI Total Spine (CBN)",id:328},{name: "MRI - LEG",id:329},{name: "MRI BRAIN (P) WITH CONTRAST",id:330},
{name: "MRI PELVIS PAEDIATRICS",id:331}];


/***************** Listing of MAMMOGRAM   ********************/

scanTestList.listInfo6 = [{name: "MAMMOGRAPHY - SINGLE BREAST(ADDITIONAL VIEW)",id:332},
{name: "MAMMOGRAPHY - SINGLE BREAST(PREVIOUS MASTECTOMY)",id:333},
{name: "MAMMOGRAPHY WITH STEREOTACTIC BIOPSY",id:334},{name: "MAMMOGRAPHY - BOTH BREASTS (TWO VIEWS)",id:335}];

  
  return scanTestList;
});




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