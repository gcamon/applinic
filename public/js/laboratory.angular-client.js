
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




app.controller("hompageController",["$scope","cities","labTests","$http",
  "ModalService","$rootScope","homePageDynamicService",
  "skillService","homepageSearchService","localManager","$window","templateService","mySocket","$location","$anchorScroll",
  function($scope,cities,labTests,$http,
  	ModalService,$rootScope,homePageDynamicService,skillService,
  	homepageSearchService,localManager,$window,templateService,mySocket,$location,$anchorScroll){


  $rootScope.cities = cities;

  $rootScope.person = {};

  $rootScope.patient = {}; //used in booking modal

  $scope.itemList = [];

  $rootScope.user = {};

  $rootScope.user.category = "Laboratory";


  var dyna = [];
  var filter = {};
  var spArr = [];
  var skArr = [];
  var diArr = [];

  $scope.dropDownList = [];

  /*$http({
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
  });*/


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



  /*skillService.query(function(data){
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
  });*/  


  

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
      $scope.loading = false; 
      $scope.searchResultFull = response.full;
      $scope.searchResultSub = response.less;      
      $rootScope.searchItemType = "Laboratory test(s)";
      $anchorScroll()
      if(response.full[0]){
        $rootScope.searchItems =  response.full[0].str;
      } else if(response.less[0]){
        $rootScope.searchItems = response.less[0].str
      }
    });  
  }



 /* var user = localManager.getValue("resolveUser");

  if(user) {
  	mySocket.emit('join',{userId: user.user_id});
  }

  $rootScope.checkLogIn = user;*/

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
    $scope.dropDownList = labTests.listInfo.concat(labTests.listInfo2,labTests.listInfo3,
    labTests.listInfo4,labTests.listInfo5,labTests.listInfo6,labTests.listInfo7,data);
  });         


  /*$scope.itemName = "Drug / Test / Specialty / Disease";

  $scope.$watch('user.category',function(newVal,oldVal){
    if(newVal) {
      switch(newVal) {
        case 'Doctor':
          $scope.itemList = spArr;
          $scope.itemName = "Enter specialty or name (e.g Dr Ede)";
        break;
        case 'Pharmacy':
          homePageDynamicService.query($rootScope.user,function(data){
            $scope.itemList = Drugs.concat(data);
          });         
          $scope.itemName = "Enter drug name";
        break;
        case "Laboratory":
          homePageDynamicService.query($rootScope.user,function(data){
            $scope.itemList = labTests.listInfo.concat(labTests.listInfo2,labTests.listInfo3,
            labTests.listInfo4,labTests.listInfo5,labTests.listInfo6,labTests.listInfo7,data);
          });         
          $scope.itemName = "Enter test name";
        break;
        case 'Radiology':
          homePageDynamicService.query($rootScope.user,function(data){
            $scope.itemList = scanTests.listInfo1.concat(scanTests.listInfo2,scanTests.listInfo3,
            scanTests.listInfo4,scanTests.listInfo5,scanTests.listInfo6,data);
          });        
          $scope.itemName = "Enter test name";
        break;
        case 'Special Center':
          $scope.itemList = spArr;
          $scope.itemName = "Enter center name or specialty."
        break;
        case 'Skills & Procedures':
          $scope.itemList = skArr;
          $scope.itemName = "Enter a skill or disease";
        break;
        case 'Disease':
          $scope.itemList = diArr;
          $scope.itemName = "Enter a disease";
        break;
        default:
        break;
      }
    }
  })*/


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
    $rootScope.holdTheCenterToFowardPrescriptionTo = center;
    //$location.path("/test/selected-laboratory");
    ModalService.showModal({
        templateUrl: 'search-result.html',
        controller: "testSearchSelectedCenterController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {         
      });
    });
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
  $scope.data = $rootScope.holdTheCenterToFowardPrescriptionTo;
  $scope.user = {};
  var sendObj = {};

  $scope.typeOfSearch = "diagnostic";

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

  $scope.send = function (type){ 

    if(type !== 'inperson') {

      var isNumber = testNumber($scope.user.phone);

      if(isNumber) {
        if($scope.user.phone.indexOf('+') == -1)
          $scope.user.phone = "+234" + parseInt($scope.user.phone); 
      } else {
        $scope.phoneMsg = "Please enter a valid phone number.";
        return;
      }

      if(!$scope.user.phone) {
        $scope.phoneMsg = "Enter patient's phone number";
        return;
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
    $scope.data.type = type;
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
    send(sendObj,"/user/test-search/laboratory/referral");
  }

  $scope.createPatient = function(){
    $scope.loading = true;

    for(var i in $scope.data) {
      if($scope.data.hasOwnProperty(i)){
        sendObj[i] = $scope.data[i];
      }
    }

    sendObj.patient_age = calculate_age(new Date($scope.data.dob)) + " years";
    sendObj.patient_phone = $scope.user.patient_phone;

    $http({
      method  : 'POST',
      url     : "/user/out/create-patients",
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
     })
    .success(function(response) {
      if(response.success){
        send(sendObj,"/user/test-search/laboratory/referral");
      } else if(response.retry){
        $scope.createPatient()
      } else {
        alert(response.message)
        $scope.loading = false;
      }      
    });
  }

  $scope.back = function() {
    $scope.isNewPatient = false;
    $scope.isToSomeOne = true
  }


  function send(data,url) {
    $scope.loading = true;
    sendObj['phone'] = $scope.user.phone;

     $http({
      method  : 'PUT',
      url     : url,
      data    : data,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {      
      if(data.error) {
        alert(data.message);
        $scope.isEMP = true;
      } else if(data.isNewPatient) {
        $scope.isNewPatient = true;
        $scope.isToSomeOne = false
      } else {
        $scope.isContent = false;
        $scope.isSent = true;
        $scope.result = data.ref_id;
        $scope.user.patient_names = data.refObj.laboratory.patient_firstname + " " + data.refObj.laboratory.patient_lastname;
      }
      $scope.loading = false;
    });
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



app.factory("labTests",function(){
  var labTestList = {};
labTestList.listInfo = [{name: "ORAL GLOCOSE TOLERANCE TEST (OGTT)",id:1},{name: "TWO HOURS POSTPRANDIAL (2HPP)",id:2},
{name: "FASTING BLOOD SUGAR (FBS)",id:3},
{name: "RANDOM BLOOD SUGAR (RBS)",id:4},{name: "PREGNANCY TEST  ( URINE )",id:5},{name: "SODIUM Na+",id:6},{name: "POTASSIUM K",id:7},
{name: "ELECTROLYTES",id:8},
{name: "BICARBONATE HC03",id:9},{name: "CALCIUMS Ca2",id:10},{name: "UREA",id:11},{name: "CREATININE",id:12},{name: "URINE ELECTROLYTES",id:13},
{name: "KIDNEY FUNCTION TEST(KFT)",id:14},
{name: "ELECTROLYTE/UREA/CREATININE E/U -Cr",id:15},{name: "IN PHOSPHORUS   ( PO4 )( INORGANIC PHOS)",id:16},
{name: "B-HCG. ( BLOOD PREGNANCY TEST )",id:7},
{name: "LFT ( LIVER FUNCTION TEST)",id:18},{name: "SGOT/AST",id:19},{name: "SGPT/ALT",id:20},{name: "ALP (ALKALINE PHOSPHASE)",id:21},
{name: "TOTAL BILIRUBIN",id:22},{name: "DIRECT BILIRUBIN",id:23},
{name: "AIBUMIN",id:24},{name: "TOTAL PROTEIN",id:25},{name: "GLOBULIN",id:26},{name: "CHOLESTEROL",id:27},{name: "TRIGLYCERIDES",id:28},
{name: "URIC ACID",id:29},{name: "GAMMA GT",id:30},
{name: "LIPID PROFILE",id:31},{name: "LOW DENSITY LIPOPROTEIN",id:32},{name: "HIGH DENSITY LIPOPROTEIN ( HDL )",id:33},
{name: "KIDNEY STONE ANALYSIS",id:34},{name: "AMYLASE ( TOTAL )",id:35},
{name: "CREATINE PHOSPHATE KINASE (CK/CPK)",id:36},{name: "ACID PHOSPHATASE",id:37},{name: "PROTEIN ELECTROPHORESIS",id:38},
{name: "URINALYSIS",id:39},{name: "OCCULT  BLOOD  TEST ( OBT)",id:40},
{name: "KIDNEY FUNCTION TEST",id:41},{name: "GLYCATED HAEMOGLOBIN ( HBA1C)",id:42},{name: "24 HRS URINE FOR CREATININE/CREATININE CLEARANCE",id:43},
{name: "PROTEIN/CR. RATIO IN URINE",id:44},
{name: "MICRO ALBUMIN  IN  URINE",id:45},{name: "D -  DIMER",id:46},{name: "CREATINE  KINASE MYOGLOBLIN  ( C K . MB )",id:47},
{name: "IRON  FERRITIN",id:48},{name: "PROTEIN IN 24hrs URINE",id:49},
{name: "PROTEIN  TOTAL IN C S F",id:50},{name: "AMYLASE  ( PANCREATIC )",id:51},{name: "Hs C - REACTIVE  PROTEIN   ( C R P ). QAUNTITATIVE",id:52},
{name: "CREATININE CLEARANCE",id:53},
{name: "Astin",id:54},{name: "LDH",id:55},{name: "Inorgnic Phosporus Serum",id:56},{name: "TROPONIN I (QTY)",id:57},{name: "BENCE JONES PROTEIN",id:58},
{name: "MAGNESIUM",id:59},{name: "BUN",id:60},
{name: "MYOGLOBIN SERUM/URINE",id:61},{name: "SERUM IRON",id:62},{name: "TROPONIN T (QTY)",id:63},{name: "VITAMIN B 12",id:64},
{name: "24HRS URINE FOR CREATININE",id:65},{name: "C- PEPTIDE",id:66},
{name: "C - REACTIVE  PROTEIN   ( C R P ).RAPID",id:67},{name: "VITAMIN D (25 Hydroxyl)",id:68},{name: "VITANIN D (25OH)",id:69},
{name: "GLOMERULAR FILTERATION RATE (GFR)",id:70},
{name: "ANA (ANTINUCLEAR ANTIBODIES)",id:71},{name: "GLUCOSE-6-PHOSPHATE DEHYDROGENASE (G-6PD)",id:72},{name: "1 Hrs. After Ingesting Glucose",id:73},
{name: "2 Hrs. After Ingesting Glucose",id:74},
{name: "CHLAMYDIA IgM ELISA (Serum)",id:75},{name: "CHLAMYDIA IgM ELSA (Serum)",id:76},{name: "CHLAMYDIA IgM ELISA (SERUM)",id:77},
{name: "LIPASE",id:78},{name: "Chlamydia IgG (ELISA) SERUM",id:79},
{name: "Lead",id:90},{name: "Corper",id:91},{name: "Iron metabolism",id:92},{name: "Zinc",id:93},{name: "HPV DNA GENOTYPE",id:94},
{name: "HPV DNA GENOTYPE",id:95},{name: "Sodium Valproate Level:",id:96},
{name: "Serum alpha 1 anti-trypsin (AAT)",id:97},{name: "BLOOD PH",id:98},{name: "24HRS URINE CALCIUM",id:99},
{name: "HOMOCYSTEINE LEVEL IN PLASMA",id:100},
{name: "URINE TOTAL PROTEIN 24HR",id:101},
{name: "ANTI LIVER & KIDNEY MICROSOMAL ANTIBODY (ANTI KLM)",id:102}];


labTestList.listInfo2 = [{name: "PCV ( PACK CELL VOLUME )",id:103},{name: "HB ( HAEMOGLOBIN )",id:104},{name: "RBC ( RED BLOOD CELL COUNT )",id:105},
{name: "WBC TOTAL (Abacus 5)",id:106},{name: "FULL BLOOD COUNT (5 part diff)",id:107},{name: "ESR ( ERYTHROCYTE SEDIMENTATION RATE )",id:108},
{name: "EOSIN COUNT",id:109},
{name: "PLATELET COUNT",id:110},
{name: "RETICULOCYTE COUNT",id:111},{name: "SICKLING TEST",id:112},{name: "GENOTYPE TEST",id:113},{name: "BLOOD GROUP",id:114},
{name: "FULL BLOOD COUNT( MANUAL)",id:115},
{name: "CLOTTING TIME (CT)",id:116},
{name: "PROTHROMBIN TIME (PT)",id:117},{name: "GROUPING ,SCREENING & CROSS -MATCHING 1 PINT OF BLOOD",id:118},{name: "CD3/CD4 COUNT ABSOLUTE",id:119},
{name: "INDIRECT COOMBS TEST",id:120},{name: "WBC  Diff (5parts diff)",id:121},{name: "COAGULATION  PROFILE",id:122},{name: "WBC TOTAL (Manual)",id:123},
{name: "CD 8 Count",id:124},
{name: "HIV VIRAL LOAD COUNT",id:125},
{name: "RHESUS ANTI-BODIES TITRE",id:126},{name: "GROUP ,SCREENING",id:127},{name: "GROUP ,SCREENING & X  MATCH  3  PINT",id:128},
{name: "ONE  PINT  OF  BLOOD( TRANSFUSION )",id:129},{name: "Group  and save",id:130},{name: "DIRECT  COOMBS TEST",id:131},
{name: "CEROBROSPINAL FLUID (CSF) CELL COUNT",id:132},
{name: "WBC DIFF (manual)",id:133},{name: "BLEEDING TIME",id:134},{name: "BLOOD FILM",id:135},{name: "PCV ( PACK CELL VOLUME ) - ADULT",id:136},
{name: "SCREENING AND X OF DONATED BLOOD(DIALYSIS)",id:137},{name: "ACTIVATED PARTIAL THROMBOPLASTIN TIME APTT (PTTK)",id:138},
{name: "COMPLEMENT C3 PROTEIN",id:139},{name: "ANTI DNAse B TEST",id:140},
{name: "ANF ANTI DNA (ds DNA)",id:141},

{name: "COMPLEMENT C4 PROTEIN",id:142},{name: "SCREENING AND X OF DONATED BLOOD(OPD) 1 PINT",id:143},
{name: "SCREENING AND X OF DONATED BLOOD(OPD ) 2 PINTS",id:144},
{name: "SCREENING AND X OF DONATED BLOOD( OPD) 3 PINTS",id:145},
{name: "INR(INTERNATIONAL NORMALISED RATIO)",id:146},{name: "TOTAL IgE",id:147},{name: "CROSS- MATCHING",id:148},{name: "ARTERIAL BLOOD GASES",id:149},
{name: "RECTICULOCYTE PRODUCTION INDEX",id:150},
{name: "HIV 1 & 2 ELISA + P24 ANTIGEN",id:151},{name: "ADULT ALLERGY FOOD SCREEN",id:152},{name: "FOLIC ACID (SERIUM)",id:153},
{name: "FOLIC ACID(SERIUM)",id:154},
{name: "FIBRINOGEN",id:155},{name: "Phadiatops(Inhalants)",id:156},{name: "HUMAN LYMPHOCYTIC T VIRUS 1 & 2 QUANTIFICATN",id:157},
{name: "HB Electrophoresis Quantitative",id:158},{name: "Total IgG ASSAY",id:159},{name: "PROTEIN C",id:160},{name: "PROTEIN S",id:161},
{name: "TOTAL IgA ASSAY",id:162},{name: "TOTAL IgM ASSAY",id:163},{name: "TOTAL IgD ASSAY",id:164},{name: "TOTAL IgG, IgM & IgA ASSAY",id:165},
{name: "Anti Phospholipids Antibody IgG & IgM",id:166}];

labTestList.listInfo3 = [{name: "PAP SMEAR  FOR CYTOLOGY",id:167},{name: "URINE   CYTOLOGY",id:168},{name: "BLOOD  CYTOLOGY",id:169},
{name: "ASPIRATE  FOR CYTOLOGY",id:170},{name: "TISSUE   HISTOLOGY",id:171},{name: "BONE   HISTOLOGY",id:172},{name: "SPUTUM  CYTOLOGY",id:173},
{name: "F N A C( FINE NEEDLE  ASPIRATE FOR CYTOLOGY)",id:174},
{name: "BUCCAL SMEAR FOR CYTOLOGY",id:175},{name: "TISSUE BIOPSY FOR HISTOLOGY",id:176},{name: "GASTRIC BIOPSY HISTOLOGY",id:177},
{name: "TISSUE FUNGI ANALYSIS",id:178},{name: "TISSUE AFB ANALYSIS",id:179},
{name: "TISSUE HISTOLOGY WITH SPECIAL STAINS",id:180}];

labTestList.listInfo4 = [{name: "PSA ( RAPID )",id:181},{name: "B-HCG QUANTITATIVE",id:182},{name: "T3",id:183},
{name: "T4",id:184},{name: "TSH",id:185},{name: "FSH",id:186},{name: "LH",id:187},
{name: "H C G (QTY)",id:188},
{name: "PROGESTERONE",id:189},{name: "PROLACTIN",id:190},{name: "TESTOSTERONE",id:191},
{name: "OESTROGEN",id:192},{name: "THYRIOD FUNCTION TEST (TFT)",id:193},
{name: "CORTISOL",id:194},
{name: "FERTILITY PROFILE",id:195},{name: "OVULATION PROFILE",id:196},{name: "ALFA FETO PROTEIN ( A F P )",id:197},

{name: "TOTAL P S A(QTY)",id:198},{name: "C E A ( CARCINO EMBROYONIC ANTIGEN)",id:199},{name: "CA125",id:200},{name: "CA 15-3",id:201},
{name: "FREE T4",id:202},
{name: "THYROGLOBULIN ANTIBODIES",id:203},
{name: "NT-Pro BNP",id:204},{name: "TSH RECEPTOR ANTIBODIES",id:205},{name: "THYROID PEROXIDASE ANTIBODY",id:206},
{name: "ACTH",id:207},{name: "HUMAN GROWTH HORMONE",id:208},{name: "FREE T3",id:209},{name: "FREE PSA",id:210},
{name: "17-OH PROGESTERONE",id:211},{name: "INSULIN QUANTITATIVE",id:212},{name: "DHEA-S",id:213},

{name: "PLASMA FREE METNEPHRINES",id:214},
{name: "ANDROSTENEDIONE ASSAY",id:215},{name: "MINERALOCORTICOID ASSAY",id:216},{name: "B2- MICROGLOBULIN",id:217},
{name: "PTH (PARATHYROID HORMONE)",id:218},
{name: "CA19-9",id:219},

{name: "HLA-B27",id:220},{name: "ANTI - MULLERIAN HORMONE",id:221},{name: "ANTI-PHOSPHOLIPID ANTIBODY",id:222},
{name: "ANTI-CARDIOLIPIN ANTIBODY",id:223},
{name: "ANTI-CYCLIC CITRULLINATED PEPTIDE ANTIBODIES(Anti- CCP) Quantitative.",id:224},{name: "SOMATOMEDIN (IGF)",id:225},
{name: "ANTI DIRUETIC HORMONE (ADH)",id:226},
{name: "FREE TESTOSTERONE",id:227},

{name: "FREE/TOTAL PSA RATIO",id:228},
{name: "FREE/TOTAL PSA RATIO",id:229},{name: "ANCA (ANTI CYTOPLASMIC AUTOANTIBODIES)",id:230},
{name: "AGBM (ANTI BASMENT GLOMERULAR ANTIBPDIES)",id:231},
{name: "INHIBIN B",id:232},
{name: "DIHYDROTESTOSTERONE LEVEL",id:233},{name: "SEX CHROMOSOME DETERMINATION",id:234}];

labTestList.listInfo5 = [{name: "MALARIA PARASITE",id:235},{name: "URINE MICROSCOPY",id:236},{name: "URINE M/C/S",id:237},
{name: "HVS MICROSCOPY",id:238},{name: "HVS M/C/S",id:239},{name: "ENDOCERVICAL SWAB (ECS) M/C/S",id:240},{name: "URETHRAL SWAB (US) M/C/S",id:241},
{name: "EYE SWAB M/C/S",id:242},
{name: "THROAT SWAB M/C/S",id:243},{name: "EAR SWAB M/C/S",id:244},{name: "SPUTUM AFB x3",id:245},
{name: "SPUTUM M/C/S",id:246},{name: "SEMEN ANALYSIS",id:247},
{name: "SEMEN Analysis/M/C/S",id:248},
{name: "CSF M/C/S",id:249},{name: "CSF ANALYSIS",id:250},{name: "BLOOD CULTURE",id:251},

{name: "STOOL M/C/S",id:252},{name: "GRAM STAIN",id:253},{name: "VDRL",id:254},{name: "Widal",id:255},{name: "BLOOD FOR MICROFILARIAE",id:256},
{name: "RHEUMATOID FACTOR (RAPID)",id:257},
{name: "MANTOUX",id:258},{name: "HEPATITIS B SURFACE   ANTIGEN  (HBs Ag )",id:259},{name: "HEPATITIS C VIRUS ANTIBODY  (H C V RAPID)",id:260},
{name: "SKIN SNIP FOR MICROFILARIAE",id:261},{name: "ASO TITRE",id:262},{name: "HIV 1",id:263},{name: "HELICOBACTER PYLORI TEST ( H. PYLORI )",id:264},
{name: "T.B. SEROLOGY IgG/IgM",id:265},{name: "STOOL ANALYSIS/MICROSCOPY",id:266},{name: "SPUTUM  AFB   X I",id:267},
{name: "ASPIRATE     M / C / S",id:268},

{name: "RHEUMATOID FACTOR  (Quantitative)",id:269},
{name: "WOUND SWAB    M / C / S",id:270},{name: "BUCCAL SWAB FOR   MYCOLOGY",id:271},{name: "SEMEN  M / C / S",id:272},
{name: "NASAL  SWAB  M / C / S",id:273},
{name: "HEPATITIS B Envelope ANTIBODY (HBeAb)",id:274},

{name: "MALARIA PARASITE (Thick and Thin Film)",id:275},{name: "HEPATITIS B Envelope ANTIGEN   (HBeAg)",id:276},
{name: "HEPATITIS B SURFACE  ANTIBODY ( HBsAb )",id:277},
{name: "HEPATITIS B CORE ANTIBODY (HbcAb) ELISA/TOTAL",id:278},
{name: "HEPATITIS B CORE ANTIBODY IgM( HBcAb )",id:279},{name: "HEPATITIS C  VIRUS TEST ( HCV ELISA)",id:280},{name: "CATHETER  TIP M/C/S",id:281},
{name: "ASPIRATE  FOR  A F B",id:282},

{name: "IUCD M/C /S",id:283},
{name: "HAEMO (BLOOD) PARASITES",id:284},{name: "Chlamydia Urine (PCR)",id:285},{name: "Chlamydia Urethra Swab",id:286},
{name: "Chlamydia Cervica Swab",id:287},
{name: "HEPATITIS A VIRUS (IgM)",id:288},{name: "HERPES SIMPLEX 1,2 VIRUS IgG",id:289},{name: "HERPES SIMPLEX 1,2 VIRUS IgM",id:290},
{name: "T. PALLIDIUM ELISA IgG",id:291},{name: "RUBELLA VIRUS IgM",id:292},{name: "VARICELLA IgM",id:293},{name: "VARICELLA IgG",id:294},
{name: "RUBELLA VIRUS IgG",id:295},{name: "CYTOMEGALO VIRUS(CMV) IgG",id:296},{name: "CYTOMEGALO VIRUS (CMV) IgM",id:297},
{name: "TOXOPLASMA GONDII (TOXO IgG)",id:298},
{name: "TOXOPLASMA GONDII (TOXO IgM)",id:299},

{name: "HIV 1 AND 2 SCREENING TEST",id:300},{name: "HEPATITIS B SURFACE ANTIBODY ( HBSAB ) ELISA",id:301},
{name: "HEPATITIS B SURFACE ANTIGEN (HBs Ag ) ELISA",id:302},
{name: "HEPATITIS B CORE ANTIBODY IgG( HBcAb )",id:303},
{name: "HEPATITIS B CORE ANTIBODY (HbcAb) TOTAL",id:304},{name: "BREAST LUMP- M/C/S",id:305},{name: "BREAST LUMP M/C/S",id:306},
{name: "OTHER SWAAB MC/S",id:307},{name: "T.B QUANTIFERON GOLD",id:308},{name: "HIV 1&2 ANTIBODIES",id:309},{name: "HEPATITIS C GENOTYPE",id:310},
{name: "HEPATITIS  B  PROFILE",id:311},

{name: "ROTAVIRUS/ADENOVIRUS COMBI TEST",id:312},{name: "VEROTOXIN/E.COLI 0157 COMBI TEST",id:313},{name: "PAEDIATRIC ALLERGY FOOD SCREEN",id:314},
{name: "HERPES SIMPLEX VIRUS I (HSVI) IgG",id:315},{name: "HERPES SIMPLEX VIRUSI (HSV-I)IgM",id:316},
{name: "HERPES SIMPLEX VIRUSII (HSV-II)IgG",id:317},
{name: "HERPES SIMPLEX VIRUSII(HSV-II)IgM",id:318},{name: "PCR- HIV QUANTITATIVE",id:319},
{name: "HAPETITIS B SURFACE ANTIGEN (qHBSAg) QUANTIFICATION",id:320},
{name: "Skin Scrapping for Fungal test (KOH)",id:321},{name: "Sputum fungal Test (M/C/S)",id:322},
{name: "CHLAMYDIA IgG ELISA (Serum)",id:323},{name: "Chlamydia IgM (ELISA) SERUM",id:324},{name: "MEASLES IgG/IgM",id:325},
{name: "MUMPS IgG/IgM",id:326},{name: "SKIN SCRAPPING FOR MYCOLOGY",id:327},{name: "HIV DRUG RESISTANT ASSAY",id:328},
{name: "HEPATITIS B CORE ANTIBODY IgM ELISA",id:329}];

labTestList.listInfo6 = [{name: "CARBAMAZEPINE-S (TEGRETOL)",id:330},{name: "CANNABIS (blood/urine)",id:331},{name: "COCAINE (Urine )",id:332},
{name: "OPIATES (Urine )",id:333},{name: "MORPHINE (Urine )",id:334},{name: "BARBITURATES (Urine )",id:335},{name: "AMPHETAMINE (Urine )",id:336},
{name: "SERUM LEVETIRACETAM",id:337},{name: "BENZOLEDIAZIPAN",id:338},{name: "TACROLIMUS CONCENTRATION IN PLASMA",id:339},
{name: "AFLATOXIN B1 LEVEL:",id:87},{name: "AFLATOXIN- M1 LEVEL:",id:88},{name: "ALCOHOL (BLOOD)",id:89}];

labTestList.listInfo7 = [{name: "HBV DNA VIRAL LOAD",id:80},{name: "HCV RNA VIRAL LOAD",id:81},{name: "CELLULAR/GENETIC DNA TEST",id:82},
{name: "HPV DNA TEST",id:83},
{name: "HLA B27 STATUS",id:84},{name: "ANGIOTENSIN CONVERTING ENZYME (ACE LEVELS)",id:85},{name: "BCR-FGFR1 QUANTITATION",id:86}];
  
  
  return labTestList;

});

//radiology data



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