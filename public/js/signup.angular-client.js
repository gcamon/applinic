
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

app.config(['$routeProvider',
  function($routeProvider){

  $routeProvider

 //signup routes
  .when("/landing-signup",{
    templateUrl: '/assets/pages/signups/landing-signup.html',
    controller: 'signupController'
  })

  .when("/doctor-signup",{
    templateUrl: '/assets/pages/signups/doctor-signup.html',
    controller: 'signupController'
  })

  .when("/patient-signup",{
    templateUrl: '/assets/pages/signups/patient-signup.html',
    controller: 'signupController'
  })

  .when("/diagnostic-signup",{
    templateUrl: '/assets/pages/signups/diagnostic-center-signup.html',
    controller: 'signupController'
  })

  .when("/pharmacy-signup",{
    templateUrl: '/assets/pages/signups/pharmacy-signup.html',
    controller: 'signupController'
  })

  .when("/special-center-signup",{
    templateUrl: '/assets/pages/signups/special-center.html',
    controller: 'signupController'
  })

  .when("/phone-verification",{
    templateUrl: "/assets/pages/signups/verify-number.html",
    controller: 'verifyPhoneController'
  })

}])


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


app.service("getCountryService",["$resource",function($resource){
  return $resource("/user/getCountries");
}]);

app.controller('signupController',["$scope","$http","$location","$window","templateService",
  "$resource","$rootScope","localManager","userSignUpService","phoneVerifyService","getCountryService",
  'phoneCallService',"$timeout","cities",
  function($scope,$http,$location,$window,templateService,$resource,$rootScope,localManager,
    userSignUpService,phoneVerifyService,getCountryService,phoneCallService,$timeout,cities) {

  var signUp = userSignUpService; //$resource('/user/signup',null,{userSignup:{method:"POST"},emailCheck:{method:"PUT"}});
  $scope.countries = localManager.getValue("countries") || getCountries();
  $scope.status = "Country";
  $scope.status1 = "State/Province";
  $scope.status2 = "City/Town";
  $scope.status3 = "LGA/Region";
  
  $scope.cities = cities;

  var currency = {};

  $scope.user = {};

  


  $scope.getRoute = function(type){
    $location.path(type);
    $rootScope.auser = type;
  }

  var count = 0;
  $scope.referredType = function(type,id) {
    if(!$rootScope.invitationId && type) {
      $rootScope.invitationId = id;
      switch(type){
        case "Patient":
          $scope.userType(type,'patient-signup')
        break;
        case "Doctor":
          $scope.userType('Doctor','doctor-signup')
        break;
        case "Pharmacy":
          $scope.userType('Pharmacy','pharmacy-signup')
        break;
        case "Special Center":
          $scope.userType('Special Center','special-center-signup')
        break;
        default:
          $scope.userType('Diagnostic','diagnostic-signup')
        break;
      }
    }
  }

  switch($location.path()) {
    case '/':
      $scope.user.typeOfUser = "";
    break;
    case '/patient-signup':
      $scope.user.typeOfUser = "Patient";
    break;
    case '/doctor-signup':
      $scope.user.typeOfUser = "Doctor";
    break;
    case '/pharmacy-signup':
      $scope.user.typeOfUser = "Pharmacy";
    break;
    case '/diagnostic-signup':
      $scope.user.typeOfUser = "Diagnostic";
    break;
     case '/special-center-signup':
      $scope.user.typeOfUser = "Special Center";
    break;
    default:
      $location.path("landing-signup");
      $scope.user.typeOfUser = "landing signup";
    break;
  }


  $scope.userType = function(type,path) {
    $location.path(path);
    $scope.user.typeOfUser = type;
  }
  

 

  var phoneNumber;

  $scope.submit = function(type,argTitle){

  $scope.user.currencyCode = currency.code;
  $scope.user.state = currency.state;
  $scope.user.region = currency.region;


  

  //capitalize the first letter in words like two words city names.
  if($scope.user.city && $scope.user.city !== "") {
    var capitalize = $scope.user.city.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() 
      + txt.substr(1).toLowerCase()});
    $scope.user.city = capitalize;
  }


  if(argTitle) {
    $scope.user.title = ($scope.user.typeOfUser == "Special Center") ? "SC" : $scope.user.title;
  } 

  

  if(templateService.singleForm)
    templateService.singleForm = false;

    var objLen = Object.keys($scope.user).length;
    var msg = "Please fill out empty field"; 

  if($scope.user.email) {
    signUp.get({email: $scope.user.email},function(response){
      if(!response.success){ 
        $scope.emailMessage = "User with " + $scope.user.email + " already exists!";
      } else {
        checkExistingPhone();
      }
    })
  } 

  function checkExistingPhone() {
    if($scope.user.phone) {
      //phoneNumber = "+" + $scope.user.callingCode.toString() + $scope.user.phone.toString();
      if($scope.user.phone[0] == '0'){
        var newSlice = $scope.user.phone.slice(1);
        $scope.user.phone = "+234" + newSlice;
      }

      phoneNumber = $scope.user.phone;

      signUp.get({phone:phoneNumber},function(res){
        if(res.error) {        
          $scope.phoneMessage = res.errorMsg;
        } else {
          $rootScope.holdPhoneForCall = phoneNumber;
          validate($scope.user); 
        }

      })
    }
  }
    
 }
 // this will be to get the type of diagnostic center a user slected as the type of user
 $scope.center = {}

 $scope.$watch("center.type",function(newVal,oldVal){
  if(newVal) {
    $scope.userType(newVal);//sets the type of diagnostic center a user selected.
  }
 })

  $scope.close = function(result) {
    close(result,500);
  }


 
  function validate(data){
      
      $scope.nameMessage = ""
      $scope.typeMessage = ""
      $scope.passwordMessage = ""
      $scope.FirstNameMessage = ""
      $scope.lastNameMessage = ""
      $scope.typeMessage = ""
      $scope.countryMessage = ""
      $scope.cityMessage = ""
      $scope.phoneMessage = ""
      $scope.passwordError = ""
      $scope.termMessage = ""
      $scope.emailMessage = ""
      $scope.ageMessage = ""
      $scope.genderMessage = ""
      $scope.usernameMessage = ""
      $scope.addressMessage = ""
      $scope.titleMessage = ""
      $scope.specialtyMessage = ""
      $scope.passwordMessage = ""
      $scope.numberError = "";

      if(data.typeOfUser !== "Patient" && data.typeOfUser !== "Doctor" && data.typeOfUser !== 'Special Center') {
        if(data.name === undefined || data.name === "") {
          $scope.nameMessage = "Enter your center name";
          return;
        }
        
      } 
      
      if(data.typeOfUser === 'Special Center') {
        if(!data.firstname) {
          $scope.nameMessage = "Enter your center name";
          return;
        }
        
      } 

      if(data.typeOfUser !== "Patient" && data.typeOfUser !== "Doctor" && data.typeOfUser !== 'Special Center' && data.typeOfUser !== 'Pharmacy') {
        if(!$scope.center.type) {
          $scope.typeMessage = "Select the type of diagnostic center";
          return;
        }
        
      } 

      if(data.password) {
        if(data.password.length <= 6) {
          $scope.passwordMessage = "Incomplete number of characters for password!";
          return;
        }
      }

      if(data.typeOfUser === "Patient" && data.firstname === undefined || data.firstname === "") {
        $scope.FirstNameMessage = "Enter value for firstname";
        return;
      } else if(data.typeOfUser === "Patient" && data.lastname === undefined || data.lastname === "") {
        $scope.lastNameMessage = "Enter value for lastname";
        return;
      } else if(data.typeOfUser === undefined || data.typeOfUser === "" ) {
        $scope.typeMessage = "Select type of user";
        return;
      } else if(data.country === undefined || data.country === "") {
        $scope.countryMessage = "Select your country of residence";
        return;
      } else if(typeof data.city !== 'string' || data.city === "") {
        $scope.cityMessage = "Enter your city";
        return;
      } else if(typeof data.phone !== 'number') {
        $scope.phoneMessage = "Enter a valid mobile phone number";
        return;
      } else if(data.password !== data.password2) {
        $scope.passwordError = "Password does not match!";
        return;
      } else if(data.agree !== true) {
        $scope.termMessage = "You have to agree to our terms and privacy policy";
        return;
      } else if(data.email === undefined || data.email === ""){
        $scope.emailMessage = "Enter value for email";
        return;
      } else if(data.typeOfUser === "Patient" && data.age === undefined || data.age === "") {
        $scope.ageMessage = "Select your age category";
        return;
      } else if(data.typeOfUser === "Patient" && data.gender === undefined || data.gender === "") {
        $scope.genderMessage = "Select your gender";
        return;
      } else if(data.username === undefined || data.username === "") {
        $scope.usernameMessage = "Enter value for username";
        return;
      /*} else if(data.typeOfUser === "Doctor" && data.work_place === undefined || data.work_place === "") {
        $scope.workMessage = "Enter your place of work";
        return;*/
      } else if(data.address === undefined || data.address === "") {
        $scope.addressMessage = "Enter place of work address";
        return;
      } else if(data.typeOfUser === "Doctor" && data.title === undefined || data.title === "") {
        $scope.titleMessage = "Select title";
        return;
      } else if(data.typeOfUser === "Doctor" && data.specialty === undefined || data.specialty === "") {
        $scope.specialtyMessage = "Select your specialty";
        return;
      } else if(data.password === undefined || data.password === ""){
        $scope.passwordMessage = "Enter value for password";
        return;
      } else {
        finalValidation();
      }

    function finalValidation() {
      if(data.agree === true) {        
        if($scope.user.callingCode){        
          data.phone = phoneNumber;
          data.username = data.username.replace(/\s+/g, '');
          $rootScope.formData = data;
          $rootScope.formData.invitationId = $rootScope.invitationId;
          sendDetail();
        } else {
          $scope.numberError = "Invalid number format";
          return;
        }

        function sendDetail() {
          $scope.loading = true;
          var sendPin = phoneVerifyService;//$resource("/user/verify-phone-number",null,{go:{method:"PUT"}});
          var send = sendPin.go({phone:phoneNumber},function(data){
            if(data.error) {
              $scope.phoneMessage = data.message;
            } else {
              $rootScope.verifyInfo = data.message; 
              $scope.isPhoneverify = true;
              $location.path("phone-verification");
            }
            $scope.loading = false;
          });   
        }     
        
      } else {
        $scope.termMessage = "Agree to our terms and conditions";        
      }
    } 
  }

  var reqObj;
  function getCountries() {
    $scope.status = "Loading...";
    reqObj = getCountryService;//$resource("/user/getCountries");
    reqObj.query(function(data){
      $scope.countries = data;
      localManager.setValue("countries",data);
      $scope.status = "Country";
    });
  }

  
  $scope.$watch("user.country",function(newVal,oldVal){
    if($scope.user.country !== undefined) {
      $scope.status1 = "Loading...";
      var arr = $scope.user.country.split(";");
      var getId = arr[0];
      var toNum = parseInt(getId);
      var countryCode = arr[1];
      $scope.user.countryName = arr[arr.length-1];
      $scope.user.geonameId = toNum;
      /*reqObj = $resource("/user/remote/geo-data",{geonameId:toNum,countryCode:countryCode});
      reqObj.query(function(data){
        $scope.status1 = "State/Province";
        $scope.states = data || [];
        $scope.isNext1 = true;
        
      });*/
      getCurrency(toNum);

      $.getJSON("/assets/calling_code.json", function(result){
        $scope.user.callingCode = parseInt(result[countryCode]);
        $scope.numberError = "";
      });
      
    }
  });

  function getCurrency(id) {
    var elemPos = $scope.countries.map(function(x){return x.geonameId.toString()}).indexOf(id.toString());
   
    currency.code = $scope.countries[elemPos].currencyCode;
  }

 
  $scope.isSpeciaty = false;
  $scope.$watch("user.specialty",function(newVal,oldVal){
    if($scope.user.specialty === "edit-specialty") {
      $scope.isSpeciaty = true;
      $scope.user.specialty = "";
    }
  });

  var toStr;
  var count=0;
  var msg = "Wrong format! Select country above to auto fill the calling code field.";


  $scope.$watch("user.phone",function(newVal,oldVal){
    if(newVal && !$scope.user.callingCode) {
      $scope.numberError = msg;
    } 
    
  });

  $scope.$watch("user.password",function(newVal,oldVal){
    str = "" + newVal;
    if(newVal)
      $scope.passwordMessage = "Password must be more than six characters. Make sure you used conbinations of letters and numbers for security purposes."
    if(str.length > 6){
      $scope.passwordMessage = "";
    }
  });

  $scope.$watch('online', function(newStatus) { 
    $rootScope.onlineStatus = newStatus;
    $rootScope.acknowledged = false;
    if(newStatus) {
      $timeout(function(){
        $rootScope.acknowledged = true;
      },3000)
    }
  });
  //password must be checked lastly. Very important.
}]);

app.controller("verifyPhoneController",["$rootScope","$scope","$resource","$window","userSignUpService","phoneCallService",
  function($rootScope,$scope,$resource,$window,userSignUpService,phoneCallService){
  $scope.verify = {};
  $scope.success;
  $scope.sendForm = function (){
    if(!$scope.verify.pin){
      alert("Please enter the verification pin you received.")
      return;
    }

    $scope.loading = true;
    $rootScope.formData.v_pin = $scope.verify.pin;
    var signUp = userSignUpService;//$resource("/user/signup",null,{userSignup:{method: "POST"}})    
    signUp.userSignup($rootScope.formData,function(response){ //
      $scope.loading = false;
         
      if(!response.error) {  
        $scope.success = response.message;            
        //$window.location.href = '/login';                           
      } else {       
        $scope.error = response.errorMsg;       
      }
    });
  }

  $scope.call = function(oldTime){
    phoneCallService({phone: $rootScope.holdPhoneForCall || '2348064245256'},"/user/verify-phone-number",'PUT')
    $scope.showCallingMsg = "You'll receive a phone call in just a moment. Please enter the pin you hear from the voice call below..."
  }

}]);


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






})() //end of IIFE




