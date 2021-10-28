
(function() {

var app = angular.module('myApp',["ngRoute","ngAnimate","angularModalService","angularMoment",'ui.bootstrap',
  'angular-clipboard',"ngResource","btford.socket-io","ngTouch",'ngPrint','paystack','ngSanitize','summernote',
  'xen3r0.underscorejs']);

app.run(['$rootScope',function($rootScope){

  $rootScope.$on('$routeChangeStart',function(){
     $rootScope.stateIsLoading = true;
     $rootScope.acknowledged = true;
  });


    $rootScope.$on('$routeChangeSuccess',function(){
      $rootScope.stateIsLoading = false;
      $rootScope.acknowledged = true;
  });

}]);

app.run(function($window, $rootScope) {
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
      $rootScope.$apply(function() {
        $rootScope.online = false;
      });
    }, false);

    $window.addEventListener("online", function() {
      $rootScope.$apply(function() {
        $rootScope.online = true;
      });
    }, false);
});




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

  this.playAudio = function(track){
    switch(track){
      case 1:
        audio('/assets/audio/ping-bang.wav');
      break;
      case 2:
        audio('/assets/audio/ping-bang.wav');
      break;
      case 3:
        audio('/assets/audio/gets-in-the-way.mp3');
      break;
      case 4:
        audio('/assets/audio/dreamy.wav');
      break;
      case 5: 
        audio('/assets/audio/camera-shutter-click-01.wav');
      break;
      default:
        audio('/assets/audio/clunk-notification.wav');
      break
    }
    
  }

  var audio = function(trackurl){
    var audio = new Audio(trackurl);
    audio.play();
  }

  this.holdBriefForSpecificPatient;

  this.singleView;

}]);




app.service("deviceCheckService",function(){
  this.getDeviceType = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
  }
})



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


app.service("userVerifyService",["$resource",function($resource){
  return $resource("/user/verify");
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

app.factory("requestManager",[function(){
  var data = {};
  return {
      set: function(patient) {
        data.user = patient;
      },
      get: function() {
        return data.user;
      }
  };
}]);

app.factory('mySocket', function (socketFactory) {
  var socket = socketFactory();
  window.localStorage.setItem('saveSocket',socket);
  return socket;
});

app.directive("loading",["$http",function($http){
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.isLoading = function () {
        return $http.pendingRequests.length > 0;
      };
      scope.$watch(scope.isLoading, function (value) {
        if (value) {
          element.removeClass('ng-hide');
        } else {
          element.addClass('ng-hide');
        }
      });
    }
  };
}]);

app.controller('loginController',["$scope","$http","$location","$window","$resource",
  "ModalService","templateService","localManager","userLoginService","changPasswordService","phoneCallService","$timeout",
  "$rootScope","mySocket",function($scope,$http,$location,$window,$resource,ModalService,
    templateService,localManager,userLoginService,changPasswordService,phoneCallService,$timeout,$rootScope,mySocket) {
  $scope.login = {};
  $scope.error = "";  
  var count = 0;

  var qStr = window.location.search;
  if(qStr) {
    var qVal = qStr.split('=');
    if(qVal[qVal.length - 1] === 'audio'){
      var url = "/user/audiocall" + window.location.search;
      $rootScope.landingCurrPageURL = url;

    } else if(qVal[qVal.length - 1] === 'video') {
      var url = "/user/video" + window.location.search;
      $rootScope.landingCurrPageURL = url;

    } else if(qVal[qVal.length - 1] === 'chat') { 

      if(qVal[1]){
        var sp = qVal[1].split('&');
        var partnerId = sp[0];        
        var url = "/user/chat/general?partnerId=" + partnerId;
        $rootScope.landingCurrPageURL = url;
      }
    }
  }
  
  $scope.send = function(){ 
    if(count <= 10) { 
      $scope.loading = true;
      $scope.error = ""; 
      var login = userLoginService; //$resource('/user/login',null,{logPerson:{method:"POST"}});

      destroyStorage();

      var intRegex = /[0-9 -()+]+$/;
      //var emailReg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;

      //intRegex.test()
      //emailReg.test()

      if(intRegex.test($scope.login.username)){
        $scope.login.isPhoneNumber = true;
        if($scope.login.username[0] == '0'){
          var newSlice = $scope.login.username.slice(1);
          $scope.login.username = "+234" + newSlice;
        }
      }

      login.logPerson($scope.login,function(data){   
        

      if (data.isLoggedIn) {  

          localManager.setValue("resolveUser",data);  

          if(!data.dob && data.typeOfUser === "Patient"){
            $window.location.href = "/patient/dob?id=" + data.id; 
            return;
          }
          //use to keep track of main user should sub accounts were used in a session. 
          /*if(data.typeOfUser === "Patient")
            localManager.setValue("mainAccount",data);  */  

         //user joins a room in socket.io and intantiayes his own socket
          if($rootScope.landingCurrPageURL) {
            $window.location.href = $rootScope.landingCurrPageURL;
          } else {
            switch(data.typeOfUser) {
              case "Patient":
                createAwareness(data)
                $window.location.href = "/user/patient";   
              break;
              case "Doctor":
                createAwareness(data)
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
          
        } else {   
          $scope.loading = false;      
          $scope.error = "Authentication Failed!"; 
          count++;
        }
      });
    } else {
      $scope.error = "Oops! Seems you are having trouble login. Please contact us."
    }
  }



  //this updates the current availability of user in real time.
  function createAwareness(data) {
    mySocket.emit("set presence",{status:"online",userId:data.user_id},function(response){
      if(response.status === true){
        if(data.typeOfUser === "Doctor"){
          mySocket.emit("doctor connect",{userId:data.user_id});
        } else if(data.typeOfUser === "Patient") {
          mySocket.emit("patient connect",data);
        }
      }
    });                                  
    
  }

 

  $scope.close = function(result) {
    close(result,500);
  }

  $scope.register = function(){
     ModalService.showModal({
          templateUrl: 'signup.html',
          controller: "signupController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
              $scope.message = "You said " + result;
          });
      });
  }

  // Change Password Logic

  $scope.changePassword = {};
  $scope.changePassword.val = "";
  $scope.cpMsg = "";
  
  $scope.getUser = function() {
    $scope.cpMsg = "";

    if(!$scope.changePassword.val){
      $scope.cpMsg = "Please enter email or phone number";
      return;
    }

    var input = validateEmailorPhone($scope.changePassword.val);
    var sendObj = {};
    if(input){
      sendObj.val = input;
    } else{
      return;
    }

    var user = changPasswordService.get(sendObj);
    $scope.isLoading = true;
    user.$promise.then(function() {
     
      if(user.status){
        $scope.isSuccess = true;
      }
      $scope.cpMsg = user.message;
      $scope.changePassword.userId = user.id;
      $rootScope.holdPhoneForCall = user.phone;
      $scope.isLoading = false;
    })
  }

  var count = 0;
  $scope.call = function(oldTime){
    count++;
    if(count < 5) {
      phoneCallService({val: $rootScope.holdPhoneForCall,phone: $rootScope.holdPhoneForCall},'/user/change-password','GET')
      $scope.showCallingMsg = "You'll receive a phone call in just a moment. Please enter the pin you hear from the voice call below...";
    } else {
      alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
    }
  }

  var verifyUser = null;

  $scope.verify = function() {
    $scope.isLoading = true;
    var pin = $scope.changePassword.pin;
    var str = "";
    var count = 0;
    for(var i = 0; i < pin.length; i++){
      count++;      
      if(count % 4 === 0) {
        str += pin[i];
        str += " ";
      } else {
        str += pin[i];
      }
    }
    var newStr = str.replace(/\s*$/,"");
    //user.pin = newStr;
    $scope.verifyMsg = "";
    var verifyUser = new changPasswordService();
    verifyUser.pin = newStr;
    verifyUser.id = $scope.changePassword.userId;
    var savePromise = verifyUser.$verifyUser();

    savePromise.then(function() {
     
      if(verifyUser.isVerified) {
        $scope.isVerified = verifyUser.isVerified;
        $scope.changePassword.userId = verifyUser.userId;
        $scope.changePassword.isVerified = verifyUser.isVerified;
      } else {
        $scope.verifyMsg = "Pin incorrect.";
      }
      $scope.isLoading = false;
    })
  }

  $scope.updatePassword = function() {
    $scope.passwordErrorMsg = "";
    $scope.passwordMsg = "";
    if($scope.changePassword.newPassword === $scope.changePassword.newPassword2) {
      $scope.isLoading = true;
      var update = new changPasswordService();
      update.newPassword = $scope.changePassword.newPassword;
      update.userId = $scope.changePassword.userId;
      update.isVerified = $scope.changePassword.isVerified;

      

      var savePromise = update.$updatePassword();

      savePromise.then(function(){
        $scope.isLoading = false;
        if(update.isPasswordChanged){
          $scope.passwordMsg = "Password changed successfully.";
        } else {
          $scope.passwordErrorMsg = "Oops! something went wrong; Try again.";
        }
      })
    } else {
      $scope.passwordErrorMsg = "Password mismatch";
    }
  }

  function validateEmailorPhone(val) {
       
        var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/;
        if (val == "") {
            alert( "Please enter your Email or Phone Number  ");
        }
        else if (!mailFormat.test(val)) {
            alert( "Email Address / Phone number is not valid, Please provide a valid Email or phone number ");
            return false;
        }
        else {
            return val;
        }
  }


  $scope.$watch('online', function(newStatus) { 
    $rootScope.onlineStatus = newStatus;
    $rootScope.acknowledged = false;
    if(newStatus) {
      $timeout(function(){
        $rootScope.acknowledged = true;
      },3000)
    }
  });

  function destroyStorage() {
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
    //localManager.removeItem("partnerDetails");
  }
  
}]);



})() //end of IIFE




