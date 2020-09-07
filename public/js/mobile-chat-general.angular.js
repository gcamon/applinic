
var app = angular.module('myApp',["angularModalService","ngResource",
  'ui.bootstrap','btford.socket-io','angular-clipboard','angularMoment','xen3r0.underscorejs']);

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


app.directive("fileModelChat",["$parse","$rootScope",function($parse,$rootScope){
  return {
    restrict: "A",
    link: function(scope,element,attrs){
      var model = $parse(attrs.fileModelChat);
      var modelSetter = model.assign;
      var isMultiple = attrs.multiple;

      element.bind('change', function () {
          var values = [];
            
          angular.forEach(element[0].files, function (item) {              
            values.push(item);
          });
          scope.$apply(function () {
            if (isMultiple) {
             
              modelSetter(scope.$parent, values);
              $rootScope.imageFiles()
            } else {
              modelSetter(scope.$parent, values[0]); //remember to check for help controller ie need a doctor
              //console.log(scope.$parent)
              $rootScope.imageFile(scope.$parent.files)
            }
            
          });
      });
    }
  }
}]);

app.controller('pictureController',["$scope","$http","$location","multiData",function($scope,$http,$location,multiData) {
   $scope.user = {};
    
   $scope.update = function(typeOfFile){
    $scope.user.type = typeOfFile;
    var uploadUrl = "/user/update";     
     multiData.sendPic(uploadUrl,$scope.user);    
    } 
}]);





app.controller("hompageController",["$scope","cities","$http",
  "ModalService","$rootScope","homePageDynamicService",
  "skillService","homepageSearchService","localManager","$window","templateService","mySocket","$location","$anchorScroll",
  function($scope,cities,$http,
  	ModalService,$rootScope,homePageDynamicService,skillService,
  	homepageSearchService,localManager,$window,templateService,mySocket,$location,$anchorScroll){


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
      default:
        $window.location.href = "/"; 
      break; 
    }
  }

 

 

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

  /*$scope.chat = function(doc) {
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
  }*/

  /*$scope.forward = function(center) {
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
  }*/

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



//for chats in modal and centers dashboard use for 
app.controller("generalChatController",["$scope","$rootScope", "mySocket","chatService", "templateService","$filter",
  "ModalService","$location","deviceCheckService","$compile","$interval","$http","localManager","profileDataService",
  function($scope, $rootScope, mySocket,chatService,templateService,$filter,ModalService,$location,
    deviceCheckService,$compile,$interval,$http,localManager,profileDataService){


   
    $rootScope.userLoginService = function() {
      $http.get("/user/getuser")
      .success(function(user){
        //user = localManager.getValue("resolveUser");
        if(user.isLoggedIn){
          //$rootScope.user.phone = user.phone;
          //$rootScope.user.address = user.address || user.work_place;

          $rootScope.checkLogIn = user;
          $rootScope.checkLogIn.typeOfUser = user.type;
        
          mySocket.emit('join',{userId: user.user_id}); 

          landingUserChatPresenceService()

        } else {
          $rootScope.checkLogIn = {};
          landingUserChatPresenceService();        
        }

      })
    }

    $http.get("/user/chats")
    .success(function(data){
      $rootScope.chatsList = data;
    });




    $rootScope.userLoginService();

    var landingUserChatPresenceService = function() {



    //$rootScope.checkLogIn = localManager.getValue("resolveUser") || {}
    //$rootScope.chatsList = localManager.getValue("holdChatList") || [];

    templateService.holdId = templateService.holdId || localManager.getValue("holdIdForChat");
    alert(templateService.holdId)
   
    if(deviceCheckService.getDeviceType() && !templateService.holdId){
      // switchesm to chat list for mobile views 
     //window.location.href = '/mobile/chat-physician';
      $('.chat__container').addClass('chat__list--active');

    } else if(localManager.getValue("isChatListViewMobile")){

      $('.chat__container').addClass('chat__list--active');

      localManager.removeItem("isChatListViewMobile");
    }


    var user = $rootScope.checkLogIn;
    var person = $rootScope.checkLogIn;
    //templateService.holdId = templateService.holdId || localManager.getValue("holdIdForChat");
    //$rootScope.chatsList = [];
    $rootScope.allChats = $rootScope.chatsList; // rootScope can be used instead   
    //$scope.center = ($rootScope.holdcenter || {id : templateService.holdId}); //sometimes is not center but individual
    $rootScope.sockets = $rootScope.sockets || localManager.getValue('connectedSockets');//connectedSockets
    $scope.isSent = false;
    var elemPos;

    var currView = $location.path();


    if($rootScope.chatsList) {
      var elemPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf(templateService.holdId)
      if(elemPos !== -1){
        $scope.partner = $rootScope.chatsList[elemPos]; 
      } else {
        $scope.partner = {};
        $scope.partner.partnerId = (templateService.holdId) ? templateService.holdId : undefined;
      }

      if(templateService.holdId){
        localManager.removeItem('holdIdForChat');
      } 
    }

    initChat();


    /*$http.get("/user/firstline-doctors")
    .success(function(data){
      data.forEach(function(item){
        $rootScope.chatsList.push({
          name: item.name,
          specialty: item.specialty,
          work_place: item.work_place,
          education: item.education,
          city: item.city,
          country: item.country,
          partnerId: item.user_id,
          profilePic: item.profile_pic_url,
          profile_url: item.profile_url,
          partnerType: item.type,
          phone: item.phone
          //email: item.email
        })
      })
    })*/

    /*if($rootScope.chatsList) {
      var elemPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf(templateService.holdId)
      if(elemPos !== -1){
        $scope.partner = $rootScope.chatsList[elemPos]; 
      } else {
        $scope.partner = {};
      }
    }*/

    //$scope.partner = {};
  
    function getUsersOnline(initiated) {
      mySocket.emit("check presence",{status: true},function(res){
        $rootScope.sockets = res;
        invert = _.invert($rootScope.sockets);
        if($rootScope.chatsList)
          $rootScope.chatsList.forEach(function(item){
            if(invert[item.partnerId]){
              item.status = true;
            }
          });        
      })     
      //$rootScope.$broadcast("users presence",{type: 'chatList',data:$rootScope.chatsList,sockets: $rootScope.sockets});         
    }


    var invert;
    mySocket.on("ping users",function(sockets){
      if($rootScope.checkLogIn) {
        invert = _.invert(sockets);
        if(!invert[$rootScope.checkLogIn.user_id]){
          mySocket.emit('join',{userId: $rootScope.checkLogIn.user_id});
        } 
      }
    })

    //if($rootScope.holdcenter) {
      //initChatSingle();
    //} else {
     // initChat();
    //}

    

    mySocket.removeAllListeners("new_msg"); // incase if this listener is registered twice
    
    $scope.viewChat = function(chat,isMobWebList) {  
      if($rootScope.checkLogIn.isLoggedIn){
        $scope.partner = chat;
        var base = document.getElementById('base'); 
        var msgDiv = document.getElementById("sentmessage");
        base.removeChild(msgDiv);

        if(!chat.is_read) {
          chat.is_read = true;
          mySocket.emit("seen chat",{id: chat._id})
        }

        if(isMobWebList) {
          $('.chat__container').removeClass('chat__list--active');
        } 
        
        //use to control different chat data in the general chat body inner div
        chatBodyCb(function(){
          initChat()
        })
      } else {
        //$rootScope.userLoginService();
        ModalService.showModal({
          templateUrl: 'chat-auth.html',
          controller: 'signupController'
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {             
          });
        })
      }
      
    }

    function chatBodyCb(cb){
      var base = document.getElementById('base');
      var msgDiv = document.createElement('div');
      msgDiv.id = "sentmessage";
      base.appendChild(msgDiv)
      cb()
    }

    /*if($rootScope.searchItems)
      $scope.messageBody = "Requesting for the following  " + $rootScope.searchItemType + ":  " + $rootScope.searchItems;
    
    $scope.sendChatSingle = function(partnerId){
      $scope.loading = true;
      mySocket.emit("send message general",{to: partnerId,message:$scope.messageBody,from: user.user_id},function(data){ 
        if(data) {
          $scope.loading = false;
          $scope.isSent = true;
        }
      })
    }*/

  
    //for modal sending one-way chat message.
    /*function initChatSingle() {
      mySocket.emit('init chat single',{userId: user.user_id,partnerId: $scope.center.id},function(data){});
    }*/

    //for general chats two-way messaging
    function initChat() {
      $scope.loading = true;
      mySocket.emit('init chat',{userId: $rootScope.checkLogIn.user_id,partnerId: $scope.partner.partnerId},function(data){ 
         //chat.messages =  data.messages;         
         for(var i = 0; i < data.messages.length; i++) { 
            chats(data.messages[i]);
         }
         $scope.loading = false;        
      });
    }


    //getUsersOnline();

    $interval(function(){
      getUsersOnline()
    },3000) // less 30 secs


  //chat logic

  $scope.user = {}

  $scope.getkeys = function (event) {
    if(!deviceCheckService.getDeviceType())
      if(event.keyCode === 13) {
        $scope.sendChat1();
        event.preventDefault();
      }

  }

  mySocket.on("isReceived",function(response){
   
    var elem = angular.element(document.getElementById(response.id));
    elem[0].innerHTML = "";
    elem[0].innerHTML += " &nbsp;&nbsp;&nbsp;seen! ";
    
  });
  
  $scope.sendChat1 = function(){ 
   if(!$scope.partner.partnerId){
    alert("Please select a physician.")
    return;
   }

   if($scope.user.text1 !== "" && $scope.user.text1 !== undefined) {   
      $scope.user.isSent = true;
      mySocket.emit("send message",{to: $scope.partner.partnerId,message:$scope.user.text1,from: $rootScope.checkLogIn.user_id},function(data){ 
        var date = + new Date();
        var msg = {};
        msg.time = data.date;
        msg.sent = data.message;
        msg.isSent = false;
        msg.isReceived = false;    
        msg.userId = user.user_id;
        msg.partnerId = $scope.partner.partnerId; 
        msg.id = data.date;


        var elPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf($scope.partner.partnerId);
        if(elPos !== -1) {
          $rootScope.chatsList[elPos].is_read = true;
          $rootScope.chatsList[elPos].realTime = date;
          $rootScope.chatsList[elPos].messages.push(msg);
        }

        chats(msg);
        
        mySocket.emit("isSent",msg,function(status){
          
          if(status) {
            var elem = angular.element(document.getElementById(msg.id));
            elem[0].innerHTML += "";            
          }
        });
      });
      $scope.user.text1 = "";
    }
  }


  //for viewing image on chat template
  var imageArg;
  $scope.imageClickEvt = function(imgUrl){
    $rootScope.imgUrl = imgUrl;
    ModalService.showModal({
        templateUrl: 'image-modal.html',
        controller: "imageModalController"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          
        });
    });     
  }

  function chats(data) {

    if(deviceCheckService.getDeviceType()){
      mobileWeb(data);
      return;
    }

    var base = angular.element(document.getElementById('base')); 
    var container = angular.element(document.getElementById('sentmessage'));      
    var item = angular.element(document.createElement('an-item'));
    var breaker = angular.element(document.createElement('div'));
    var p = angular.element(document.createElement('p'));
    var small = angular.element(document.createElement('span'));
    var fileElem;

    //new implementations as of 24th March changing chat design

    var item1 = angular.element(document.createElement('div'));
    var item2 = angular.element(document.createElement('div'));
    var item3 = angular.element(document.createElement('div'));
    var item4 = angular.element(document.createElement('div'));
    var img = angular.element(document.createElement('img'));

    // end of new item added
    
    switch(data.fileType){
      case 'image':        
        fileElem = angular.element(document.createElement('img'));
        fileElem[0].src = data.url;
        fileElem[0].alt = "loading image...";
        fileElem[0].style.maxWidth = "280px";
        fileElem[0].style.height = "220px";
        //fileElem[0]["data-ng-click"] = $scope.create;
        imageArg = "imageClickEvt('" + data.url + "')";
        fileElem.attr('ng-click', imageArg);
        $compile(fileElem[0])($scope);
        
      break;
      case 'audio':
        fileElem = angular.element(document.createElement('audio'));
        fileElem[0].src = data.url;
        fileElem[0].controls = true;
      break;
      case "video":
         fileElem = angular.element(document.createElement('video'));
        var sourceElem = angular.element(document.createElement('source'));
        sourceElem[0].src = data.url; //"/assets/daddy_home.mp4";
        //sourceElem[0].type = data.type;
        fileElem[0].append(sourceElem[0]);
        fileElem[0].style.maxWidth = "280px";
        fileElem[0].style.height = "220px";
        fileElem[0].controls = true;
      break;
      case 'application':
        if(data.mimeType == "application/pdf") {
          fileElem = angular.element(document.createElement('div'));
          //var embed = angular.element(document.createElement('embed'));
          var a = angular.element(document.createElement('a'));
          a[0].href = "https://drive.google.com/viewerng/viewer?embedded=true&url=" + data.url;
          a[0].style.cursor = "pointer";
          a[0].style.display = "block";
          a[0].style.textAlign = "center";
          a[0].style.fontSize = "32px";
          a[0].className = "fa fa-file";
          a[0].innerHTML += "";
          a[0].style.color = (data.sent) ? "#eee" : "#05728f";
          a[0].target = "_blank";
          a[0].style.margin = "20px 0";
          a[0].title = "View file";
          
          fileElem[0].appendChild(a[0]);

          data.fileType = "pdf";
          
        } else {
          fileElem = angular.element(document.createElement('a'));
          fileElem[0].href = data.url;
          fileElem[0].style.display = "block";
          fileElem[0].style.color = "#fff";
          fileElem[0].style.fontSize = "18px";
          fileElem[0].style.padding = "10px 0";
          fileElem[0].className = "fa fa-download";
          fileElem[0].innerHTML += " download word document.";
          data.fileType = "";
        }
      break;
      case 'text':
           fileElem = angular.element(document.createElement('div'));
          //var embed = angular.element(document.createElement('embed'));
          var a = angular.element(document.createElement('a'));
          a[0].href = "https://drive.google.com/viewerng/viewer?embedded=true&url=" + data.url;
          a[0].style.cursor = "pointer";
          a[0].style.display = "block";
          a[0].style.textAlign = "center";
          a[0].style.fontSize = "32px";
          a[0].className = "fa fa-file";
          a[0].innerHTML += "";
          a[0].style.color = "#eee";
          a[0].target = "_blank";
          a[0].style.margin = "20px 0";
          a[0].title = "View file";
         
          fileElem[0].appendChild(a[0]);

          data.fileType = "txt";
      break;
      default:
      break;
    }

    p[0].style.display = "block";
    p[0].style.wordBreak = "break-word";
    small[0].style.display = "block";
    small[0].style.marginTop = "5px";
    small[0].style.color = "#ccc";
    if(!fileElem) {
      p[0].innerHTML += (data.sent) ? data.sent : data.received; 
    } else {
      p[0].innerHTML += data.fileType;
    }
   
   
    small[0].id = data.id;
    small[0].className = "time_date";
    small[0].style.color = "rgba(0,0,0,0.5)";
    //var time = ($filter('amTimeAgo')(data.time) === 'a few seconds ago') ? 'Now' : $filter('amTimeAgo')(data.time);
    small[0].innerHTML += $filter('amCalendar')(data.time);
    //small[0].innerHTML += (data.sent) ? "&nbsp;&nbsp;" + $filter('amTimeAgo')(data.time) : "&nbsp;&nbsp;" + $filter('amTimeAgo')(data.time);     
    
    breaker[0].style.display = "block";
    //breaker[0].style.textAlign = (data.sent) ? "right" : "left";
    
    //item[0].appendChild(p[0]);

    

    //new code 
    if(data.sent){
      item1[0].className = "outgoing_msg";
      item2[0].className = "sent_msg";
     
      item1[0].appendChild(item2[0]);
      if(fileElem){
        p[0].appendChild(fileElem[0]);
      }

      item2[0].appendChild(p[0]);
      item2[0].appendChild(small[0]);

    } else {
      img[0].src = "https://ptetutorials.com/images/user-profile.png";
      item1[0].className = "incoming_msg";
      item2[0].className = "incoming_msg_img";
      item3[0].className = "received_msg";
      item4[0].className = "received_withd_msg";
      item2[0].appendChild(img[0]);
      

      if(fileElem){
        p[0].appendChild(fileElem[0]);
      }

      item4[0].appendChild(p[0]);
      item4[0].appendChild(small[0]);

      item3[0].appendChild(item4[0])
      
      item1[0].style['margin-top'] = "20px";
      
      item1[0].appendChild(item2[0]);
      item1[0].appendChild(item3[0]);
      //item1[0].appendChild(item4[0]);
    }

    // end of new code
    //item1[0].appendChild(small[0]);
    breaker[0].appendChild(item1[0]);
    
    /*item[0].style.display = "inline-block";
    item[0].style.maxWidth = (deviceCheckService.getDeviceType()) ? "90%" : "70%";
    item[0].className = (data.sent) ? "talk-bubble tri-right right-top talktext msg_sent bg-info" : "talk-bubble tri-right left-top talktext";
    item[0].style.whiteSpace = "pre-line";*/
    container[0].appendChild(breaker[0]);
    base[0].scrollTop = sentmessage.scrollHeight;
  }

  

  function mobileWeb(data) {
    var base = angular.element(document.getElementById('base')); 
    var container = angular.element(document.getElementById('sentmessage'));      
    var breaker = angular.element(document.createElement('div'));
    var article = angular.element(document.createElement('article'));
    var p = angular.element(document.createElement('p'));
    var small = angular.element(document.createElement('span'));
    var fileElem;

    //new implementations as of 24th March changing chat design

    //var item1 = angular.element(document.createElement('div'));
    //var item2 = angular.element(document.createElement('div'));
    
    var img = angular.element(document.createElement('img'));

    // end of new item added
    
    switch(data.fileType){
      case 'image':        
        fileElem = angular.element(document.createElement('img'));
        fileElem[0].src = data.url;
        fileElem[0].alt = "loading image...";
        fileElem[0].style.maxWidth = "280px";
        fileElem[0].style.height = "220px";
        //fileElem[0]["data-ng-click"] = $scope.create;
        imageArg = "imageClickEvt('" + data.url + "')";
        fileElem.attr('ng-click', imageArg);
        $compile(fileElem[0])($scope);
        
      break;
      case 'audio':
        fileElem = angular.element(document.createElement('audio'));
        fileElem[0].src = data.url;
        fileElem[0].controls = true;
      break;
      case "video":
         fileElem = angular.element(document.createElement('video'));
        var sourceElem = angular.element(document.createElement('source'));
        sourceElem[0].src = data.url; //"/assets/daddy_home.mp4";
        //sourceElem[0].type = data.type;
        fileElem[0].append(sourceElem[0]);
        fileElem[0].style.maxWidth = "280px";
        fileElem[0].style.height = "220px";
        fileElem[0].controls = true;
      break;
      case 'application':
        if(data.mimeType == "application/pdf") {
          fileElem = angular.element(document.createElement('div'));
          //var embed = angular.element(document.createElement('embed'));
          var a = angular.element(document.createElement('a'));
          a[0].href = "https://drive.google.com/viewerng/viewer?embedded=true&url=" + data.url;
          a[0].style.cursor = "pointer";
          a[0].style.display = "block";
          a[0].style.textAlign = "center";
          a[0].style.fontSize = "32px";
          a[0].className = "fa fa-file";
          a[0].innerHTML += "";
          a[0].style.color = (data.sent) ? "#eee" : "#05728f";
          a[0].target = "_blank";
          a[0].style.margin = "20px 0";
          a[0].title = "View file";
          
          fileElem[0].appendChild(a[0]);

          data.fileType = "pdf";
          
        } else {
          fileElem = angular.element(document.createElement('a'));
          fileElem[0].href = data.url;
          fileElem[0].style.display = "block";
          fileElem[0].style.color = "#fff";
          fileElem[0].style.fontSize = "18px";
          fileElem[0].style.padding = "10px 0";
          fileElem[0].className = "fa fa-download";
          fileElem[0].innerHTML += " download word document.";
          data.fileType = "";
        }
      break;
      case 'text':
           fileElem = angular.element(document.createElement('div'));
          //var embed = angular.element(document.createElement('embed'));
          var a = angular.element(document.createElement('a'));
          a[0].href = "https://drive.google.com/viewerng/viewer?embedded=true&url=" + data.url;
          a[0].style.cursor = "pointer";
          a[0].style.display = "block";
          a[0].style.textAlign = "center";
          a[0].style.fontSize = "32px";
          a[0].className = "fa fa-file";
          a[0].innerHTML += "";
          a[0].style.color = "#eee";
          a[0].target = "_blank";
          a[0].style.margin = "20px 0";
          a[0].title = "View file";
         
          fileElem[0].appendChild(a[0]);

          data.fileType = "txt";
      break;
      default:
      break;
    }


   
    //small[0].style.display = "block";
    p[0].style.fontSize = "16px";
    p[0].style.wordBreak = "break-word";
    small[0].style.marginTop = "5px";
   
    if(!fileElem) {
      p[0].innerHTML += (data.sent) ? data.sent : data.received; 
    } else {
      p[0].innerHTML += data.fileType;
    }
   
   
    small[0].id = data.id;
    small[0].className = "time_date";
    small[0].style.color = "rgba(0,0,0,0.4)";
    
    small[0].innerHTML += $filter('amCalendar')(data.time);

    breaker[0].style.textAlign = "center";
    breaker[0].style.padding = "2px 0";
    breaker[0].appendChild(small[0]);
    article[0].className = "conversation__view__bubbles"; 
    
    
    //breaker[0].style.display = "block";    

    //new code 
    if(data.sent){
     
      if(fileElem){
        p[0].appendChild(fileElem[0]);
      }

       
      p[0].className = "chat__right__bubble";
   
      article[0].appendChild(breaker[0]);
    
      article[0].appendChild(p[0]);
      //article[0].appendChild(small[0]);
      container[0].appendChild(article[0]);

    } else { 

      if(fileElem){
        p[0].appendChild(fileElem[0]);
      } 

      p[0].className = "chat__left__bubble";
      //container[0].className = "conversation__view__bubbles";
      article[0].appendChild(breaker[0]);
      article[0].appendChild(p[0]);
      //container[0].appendChild(breaker[0]);
      container[0].appendChild(article[0]);
      //container[0].appendChild(small[0]);
    }

    base[0].scrollTop = sentmessage.scrollHeight;

  }

  var elPos;

  mySocket.on("new_msg", function(data) {
    if(currView !== "/general-chat") {
      $rootScope.$broadcast("unattendedMsg",true);
      templateService.playAudio(2);   
    } else {
      mySocket.emit("chat in-view",data); // use to reset a chat that has been read at the backend as read in db
    }

    var elemPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf(data.from);
    if(elemPos !== -1) {
      $rootScope.chatsList[elemPos].realTime = data.realtime;
      $rootScope.chatsList[elemPos].messages[$rootScope.chatsList[elemPos].messages.length -1].msg = data.message;
    }

    var date = + new Date();
    var msg = {};
    msg.time = data.date;
    msg.received = data.message;
    msg.url = data.url;
    msg.fileType = data.fileType;
    msg.mimeType = data.mimeType;  

    if(data.from === $scope.partner.partnerId) {     
      msg.userId = user.user_id;
      msg.partnerId = $scope.partner.partnerId; 
      msg.id = data.date;//genId();

      //msg.url = response.url;
      //msg.fileType = response.fileType;
      //msg.mimeType = response.mimeType;           
      chats(msg);
      templateService.playAudio(3); 
    } else {     
      //$rootScope.$broadcast("unattendedMsg",true);   
      templateService.playAudio(2);
      //var elemPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf(data.from);
      if(elemPos !== -1) {
        $rootScope.chatsList[elemPos].is_read = false;
        $rootScope.chatsList[elemPos].messages.push(msg);       
      } else {
        $rootScope.loadChats();
      }
    }   
    mySocket.emit("msg received",{to: data.from,id:data.date});
  });

  //$scope.$watch("chatsList.messages",function(oldVal,newVal){},true)

  $scope.$watch("user.text1",function(newVal,oldVal){
    if(newVal !== "" && newVal !== undefined){      
      mySocket.emit("user typing",{to: $scope.partner.partnerId,message:"Typing...",from: user.user_id});
    } else {
      mySocket.emit("user typing",{to: $scope.partner.partnerId,message:"",from: user.user_id});
    }
  });

  

  mySocket.on("typing", function(data) {
    var tpPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf(data.from);    
    if(tpPos !== -1){
      $rootScope.chatsList[tpPos].typing = data.message;      
      //$scope.partner.typing = data.message;
      if(deviceCheckService.getDeviceType()){
        if(data.message !== "" && data.message !== undefined) {
          showTypingForMobile(data);
        } else {
          $scope.partnerIsTying = false;
          deleteTypingStatus();
        }
      }
    }
    //$scope.partner.typing = data.message;
    //$scope.typing = data;
  });

  $scope.partnerIsTying = false;

  function showTypingForMobile(data) {

    if(!$scope.partnerIsTying) {
      var base = angular.element(document.getElementById('base')); 
      var container = angular.element(document.getElementById('sentmessage'));      
      var breaker = angular.element(document.createElement('div'));
      var article = angular.element(document.createElement('article'));
      var p = angular.element(document.createElement('p'));
      var small = angular.element(document.createElement('span'));

       //small[0].style.display = "block";
      p[0].style.fontSize = "16px";
      p[0].style.fontStyle = "italic";
      p[0].style.color = "rgba(0,0,0,0.5)";
      p[0].className = "text-muted";
      small[0].style.marginTop = "5px";
     
   
      p[0].innerHTML += data.message; 

      var id =  "typing_" + Math.floor(Math.random() * 999999);

      article[0].id = id;
      $scope.typingStatusId = id;
    
     
     
      //small[0].id = data.id;
      //small[0].className = "time_date";
      //small[0].style.color = "rgba(0,0,0,0.4)";
      
      //small[0].innerHTML += $filter('amCalendar')(data.time);

      breaker[0].style.textAlign = "center";
      breaker[0].style.padding = "2px 0";
      //breaker[0].appendChild(small[0]);
      article[0].className = "conversation__view__bubbles"; 
      
      
      //breaker[0].style.display = "block";    

      //new code 
      
     
      p[0].className = "chat__left__bubble";
      //container[0].className = "conversation__view__bubbles";
      article[0].appendChild(breaker[0]);
      article[0].appendChild(p[0]);
      //container[0].appendChild(breaker[0]);
      container[0].appendChild(article[0]);
      //container[0].appendChild(small[0]);
      

      base[0].scrollTop = sentmessage.scrollHeight;

      $scope.partnerIsTying = true;
    }
  }

  var deleteTypingStatus = function() {
    var ele = document.getElementById($scope.typingStatusId)//document.getElementById(img[file.name]);
    if(ele)
      ele.style.display = "none";
  }

  $scope.videoRequest = function(type,docObj){
    docObj.type = type;
    reqModal(docObj);
  }

  $scope.audioRequest = function(type,docObj){
    //$window.location.href = "/user/patient/call";
    docObj.type = type;
    reqModal(docObj);
  }

  $scope.inPersonRequest = function(type,docObj){
    
    docObj.type = type;
    reqModal(docObj);
  }


  $scope.chatPrivate = function(chat,isMobileView) {

    var elPos;

    var infer;

    $http.get("/user/doctor/my-patients")
    .success(function(list){
     
      elPos = list.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(chat.partnerId);

      if(elPos !== -1){
        openCaseNote(chat,isMobileView);
      } else {
        infer = confirm("This patient will be added in your patients' list for further management if you proceed");
        if(infer){
          $http.put("/user/doctor/my-patients",{patientId: chat.partnerId,date : new Date()})
          .success(function(response){
            if(response.status){
              openCaseNote(chat,isMobileView);
            } else {
              alert(response.message);
            }
          })
        }
      }
     
    });
    
  }

  function openCaseNote(chat,isMobileView) {

    if(isMobileView) {
      var who = (chat.partnerType === "Patient") ? true : false;
      if(who){
        var split = chat.chat_id.split("/");
        var id = split[split.length - 1];
        var path = "/doctor-patient/treatment/" + id;
        localManager.setValue("currentPage",path)
        window.location.href = "/user/doctor";
      }
      return;
    }

    if(chat.partnerType === "Doctor") {

      var split = chat.chat_id.split("/");
      var id = split[split.length - 1];
      var path = "/patient-doctor/treatment/" + id;
      $location.path(path);

    } else if(chat.partnerType === "Patient"){

      var split = chat.chat_id.split("/");
      var id = split[split.length - 1];
      var path = "/doctor-patient/treatment/" + id;
      $location.path(path);

    } else {
      var getUser = (user.typeOfUser === 'Patient') ? "manage a patient" : 'chat private with a doctor';
      alert("Oops! You can only " + getUser)
    }
  }

  function reqModal(docObj) {
    templateService.holdForSpecificDoc = docObj
    ModalService.showModal({
      templateUrl: 'sending-communication-request.html',
      controller: "videoInitController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
         
      });
    });
  }



  var img = {};
  var progress = {};
  dlArray = [];

  //for single file upload
  $rootScope.imageFile = function(file) {   
    $scope.files = file;
    if($scope.files.size <= 31457280) { // 30mb max size
    var file = $scope.files,
      fileReader = new FileReader(),
      slice = file.slice(0, 100000);

    fileReader.readAsArrayBuffer(slice); 
    img[file.name] = file.name;

    //set up a deletable array of ids so that after upload indcator shows it deletes after uploads
    dlArray.push(Math.floor(Math.random() * 999999));

      //incase listener is registered twice.
    var evt1 = "request slice upload " + file.name;
    var evt2 = "end upload " + file.name;
    var evt3 = "upload error " + file.name;



    mySocket.removeAllListeners(evt1);
    mySocket.removeAllListeners(evt2);
    mySocket.removeAllListeners(evt3);

    var base = angular.element(document.getElementById('base')); 
    var container = angular.element(document.getElementById('sentmessage'));      
    var item = angular.element(document.createElement('an-item'));
    var breaker = angular.element(document.createElement('div'));
    var p = angular.element(document.createElement('p'));
    var small = angular.element(document.createElement('small'));
    var span = angular.element(document.createElement('span'));

    breaker[0].style.display = "block";
    //breaker[0].style.textAlign =  "right";
    p[0].style.display = "inline-block";


    var item1 = angular.element(document.createElement('div'));
    var item2 = angular.element(document.createElement('div'));
    var item3 = angular.element(document.createElement('div'));
    var item4 = angular.element(document.createElement('div'));
    var progressBar = angular.element(document.createElement("div"));
    var innerBar = angular.element(document.createElement("div"));


    small[0].style.display = "block";
    small[0].style.marginTop = "5px";


  
    p[0].innerHTML += file.name;
    small[0].id = file.name;
    //p[0].id = file.name;
    //item[0].appendChild(p[0]);

    //item[0].appendChild(span[0]);
    
    //item[0].appendChild(small[0]);
    item1[0].className = "outgoing_msg";
    item2[0].className = "sent_msg";
   
    item1[0].appendChild(item2[0]);
   

    item2[0].appendChild(p[0]);
    item2[0].appendChild(span[0]);
    item2[0].appendChild(small[0]);

    breaker[0].id = dlArray[0];


    breaker[0].appendChild(item1[0]);


    /*item[0].style.display = "inline-block";
    item[0].style.maxWidth = (deviceCheckService.getDeviceType()) ? "90%" : "70%";
    item[0].className =  "talk-bubble tri-right right-top talktext msg_sent bg-info";
    item[0].style.whiteSpace = "pre-line";*/
    container[0].appendChild(breaker[0]);
  
    base[0].scrollTop = sentmessage.scrollHeight;

    fileReader.onload = function(evt){
      var arrayBuffer = fileReader.result;
      var toArr = file.type.split('/');
      var theType = toArr[0];

      mySocket.emit('slice upload', { 
        name: file.name, 
        type: file.type, 
        size: file.size, 
        data: arrayBuffer,
        fileType: theType
      }); 
    }

    var ele2;
     //keep sending slice
    mySocket.on(evt1,function(data){ 
      var place = data.currentSlice * 100000, 
        slice = file.slice(place, place + Math.min(100000, file.size - place)); 
      
      ele2 = document.getElementById(img[data.name]);     
      ele2.innerHTML = "Uploading... " + Math.round(fnProgress(place)) + "%";
      fileReader.readAsArrayBuffer(slice); 
    });


    var fnProgress = function(bytes) {
      var percentage = (bytes / file.size) * 100;
      return percentage;
    }

    

    mySocket.on(evt2,function(response){
      mySocket.emit("send message",{to: $scope.partner.partnerId,message:response.url,url:response.url, from: user.user_id,fileType: response.fileType,mimeType: response.mimeType},function(data){ 
        var date = + new Date();
        var msg = {};
        msg.time = data.date;
        msg.sent = (response.fileType) ? response.fileType : data.message;
        msg.isSent = false;
        msg.isReceived = false;
        //$rootScope.message1.push(msg);      
        msg.userId = user.user_id;
        msg.partnerId = $scope.partner.partnerId; 
        msg.id = data.date;//genId();
        msg.url = response.url;
        msg.fileType = response.fileType;
        msg.mimeType = response.mimeType;


        var elPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf($scope.partner.partnerId);
        if(elPos !== -1) {
          $rootScope.chatsList[elPos].is_read = true;
          $rootScope.chatsList[elPos].realTime = date;
          $rootScope.chatsList[elPos].messages.push(msg);
        }

        chats(msg);
        //var ele = document.getElementById(img[file.name]);
        //ele.style.display = "none";
        var ele = document.getElementById(dlArray[0])//document.getElementById(img[file.name]);
        ele.style.display = "none";
        dlArray.splice(0,1);
        delete img[file.name];
        
        mySocket.emit("isSent",msg,function(status){          
          if(status) {
            var elem = angular.element(document.getElementById(msg.id));
            elem[0].innerHTML += "";            
          }
        });
        //mySocket.emit("save message",msg);//this saves the message as one mark
      });
    })

    mySocket.on(evt3,function(res){
      var ele = document.getElementById(dlArray[0])//document.getElementById(img[file.name]);
      ele.style.display = "none";
      dlArray.splice(0,1);
      delete img[file.name];
      alert("Error occured while uploading " + file.name);
    })

    } else {
      alert("File size out of range. Max size should be less than 30mb");
    }

  }


  var lessThan24HourAgo = function(date) {
    return moment(date).isAfter(moment().subtract(24, 'hours'));
  }



  //for multiple file upload
  $rootScope.imageFiles = function() {
    alert("the file dey come many oooo")
  }


  /*$scope.videoChat = function(partner) {
    var source = profileDataService;   
    source.get({userId: partner.partnerId},function(data) {
      data.type = 'Video Call';
      templateService.holdForSpecificPatient = data;
      ModalService.showModal({
        templateUrl: 'sending-communication-request.html',
        controller: "videoInitController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
      });
    });   
  }*/

   $scope.videoChat = function(partner) {
    //var source = profileDataService;   
   // source.get({userId: partner.partnerId},function(data) {
      //data.type = 'Video Call';
      var online = partner.status || partner.presence;

      templateService.holdForSpecificPatient = {user_id: partner.partnerId, presence: online,name: partner.name};
      ModalService.showModal({
        templateUrl: 'sending-communication-request.html',
        controller: "videoInitController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
      });
    //});   
  }


  $scope.inviteOnline = function(doc) {
    $scope.loading = true;
    $http.post("/user/firstline-doctors",doc)
    .success(function(resp){
      if(resp.status){
        doc.isSent = resp.status;
      }
      $scope.loading = false;
    })

  }

    /***** Video Call Logic ********/
    //takes care of receiver accepting the video call 
    mySocket.on("receive request",function(data){
      templateService.playAudio(1);
      setTimeout(function(){
        display()
      },2000);

      function display() {
        var decide = confirm(data.message);
        if(decide) {
          //time will be include to enable user decide when t have conversation

          var idPatient = (person.typeOfUser === 'Patient') ? person.user_id : data.from; // this will identify which patient was used to initilalze the video caht

          mySocket.emit("conversation acceptance",{status:true,time: "now",to:data.from,title:person.title,
            name: person.firstname || person.name,type:person.typeOfUser,patientId: idPatient},function(response){

              //localManager.setValue("userId",data.from);

              $rootScope.controlUrl = response.controlUrl;
              $rootScope.tokBoxUrl = response.tokBoxVideoURL;
              ModalService.showModal({
                templateUrl: 'redirect-modal.html',
                  controller: 'redirectModal'
                }).then(function(modal) {
                  modal.element.modal();
                  modal.close.then(function(result) {                     
                });
              });
          });
        } else {
          //when call is rejected by the receiver
          var name = person.name || person.title + " " + person.firstname;
          //mySocket.emit("call reject",{to: data.from,message: name + " rejected your video chat request."})
        }
      }
    });


    //for invitation through the video call page
    mySocket.on("receive invitation request",function(data){
      templateService.playAudio(1);
      setTimeout(function(){
        display()
      },2000);

      function display() {
        var decide = confirm(data.message);
        if(decide) {
          var names = person.name  ||  person.title + " " + person.firstname
          //time will be include to enable user decide when t have conversation
          mySocket.emit("conversation invitation acceptance",{status:true,time: "now",to:data.from,
            name: names ,type:person.typeOfUser,controlId: data.controlId,userId:person.user_id},function(response){
            localManager.setValue("userId",data.from);
            $rootScope.controlUrl = response.controlUrl;
            ModalService.showModal({
              templateUrl: 'redirect-modal.html',
              controller: 'redirectModal'
              }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {                     
              });
            });
          });
        } else {
          //when call is rejected by the receiver
          var name = person.name || person.title + " " + person.firstname;
          //mySocket.emit("call reject",{to: data.from,message: name + " rejected your video chat request."})
        }
      }
    });

    
    mySocket.on("convserstion denied",function(details){
      alert(details.message);
    })

    //takes care of redirecting to video call page for the call requester After the received had accepted and redirected to its on page.
    mySocket.on("video call able",function(response){
      //localManager.setValue("socket",mySocket);
      templateService.playAudio(4);
      setTimeout(function(){
        display();
      },3000);

      function display() {
        var decide = confirm(response.message);
        if(decide){
           $rootScope.controlUrl = response.controlUrl;
           $rootScope.tokBoxUrl = response.tokBoxVideoURL;
           localManager.setValue("partnerDetails",response.partnerDetails);
           ModalService.showModal({
            templateUrl: 'redirect-modal.html',
                controller: 'redirectModal'
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {                 
            });
          });
        }
      }
    });
  }

  $scope.audioChat = function(partner){
    $rootScope.holdPartner = {
      partnerType: partner.partnerType,
      partnerId: partner.partnerId,
      name: partner.name,
      presence: partner.status
    };
    ModalService.showModal({
      templateUrl: 'audio-communication-request.html',
      controller: "audioInitController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
         
      });
    });
  }

  mySocket.on("received audio call request",function(data){
    var check = confirm("You have audio conversation request from " + data.sender);
    if(check){
      window.location.href = data.connectURL;
    }
  })

}]);


app.controller('audioInitController',["$scope","$window","localManager","mySocket","$rootScope","$http","$filter",
  function($scope,$window,localManager,mySocket,$rootScope,$http,$filter){


    $scope.isConnected = true;

    $scope.offline = {};

    $http.post('/user/audioCallInit',{type:$rootScope.holdPartner.partnerType, userId: $rootScope.holdPartner.partnerId})
    .success(function(response){
      //console.log(response)$rootScope.sockets;

      /*var invert = _.invert($rootScope.sockets);      
      if(invert[$rootScope.holdPartner.partnerId]){

        var sender = $rootScope.checkLogIn.name || $rootScope.checkLogIn.firstname;
        mySocket.emit("audio call signaling",
          {partnerConnectURL: response.partnerConnectURL,
            partnerId: $rootScope.holdPartner.partnerId,sender:sender},
          function(data){
        
          localManager.setValue("partnerDetails",{patientId: $rootScope.holdPartner.partnerId,type: "Patient"});
          window.location.href = response.url;
        });

      } else {
        var msg = ($rootScope.holdPartner.name || $rootScope.holdPartner.firstname) 
        + " is currently offline but we will forward audio call" 
        + " invitation via SMS and you will be alerted when connection is re-established. Please stay logged in."
        var check = confirm(msg);
        if(check){

        }
      }*/


      if($rootScope.holdPartner.presence) {
        var sender = $rootScope.checkLogIn.name || $rootScope.checkLogIn.firstname;
        mySocket.emit("audio call signaling",
          {partnerConnectURL: response.partnerConnectURL,
            partnerId: $rootScope.holdPartner.partnerId,sender:sender,senderId: $rootScope.checkLogIn.user_id},
          function(data){
          //alert(data.message);
          //console.log(data);
          localManager.setValue("partnerDetails",{patientId: $rootScope.holdPartner.partnerId,type: "Patient"});
          window.location.href = response.url;
        });

      } else {
        $scope.isConnected = false;
        $scope.msg = ($rootScope.holdPartner.name || $rootScope.holdPartner.firstname) 
        + " is offline but we can invite him to have audio chat with you at anytime you choose below. You will be notified when she connects. " 
        + " Please stay logged in."
      }

      $scope.confirmTime = function() {
        $scope.offline.type = "Audio Chat";
        if(!$scope.offline.time){
          alert("Please choose a suitable time for your conversation.")    
        } else if($scope.offline.time !== 'now'){
          var sptArr = $scope.offline.time.split('-');
          var d = new Date();
          var toNum = parseInt(sptArr[0]);
          var timeOffset;
          var timeFlag;

          if(sptArr[1] == 'm'){
            var minutes = d.getMinutes() + toNum;
            d.setHours(d.getHours(),minutes);
            timeOffset = sptArr[0];
            timeFlag = "Minutes";
          } else {
            var hr = d.getHours() + toNum;
            d.setHours(hr);
            timeOffset = sptArr[0];
            timeFlag = "Hour";
          }

          var tm = $filter('date')(d, 'shortTime');

          $scope.loading = true;

          $http.post("/user/offline-message",
            {offset: timeOffset,time:tm,partnerURL: response.partnerConnectURL,
              timeFlag:timeFlag,type: $scope.offline.type,partnerId:$rootScope.holdPartner.partnerId })
          .success(function(res){
            $scope.loading = false;
            if(res.status){
              $scope.isSent = res.status;
              $scope.bookedTimeMsg = res.msg
            }
          })

        } else {
          $scope.loading = true;
          $http.post("/user/offline-message",
            {partnerURL: response.partnerConnectURL,
            type: $scope.offline.type,partnerId:$rootScope.holdPartner.partnerId,isNow: true })
          .success(function(res){
            $scope.loading = false;
            if(res.status){
              $scope.isSent = res.status;
              $scope.bookedTimeMsg = res.msg
            }
          })
        }

      }
     
    })
}])




app.controller("imageModalController",function(){})

app.controller("redirectModal",["$rootScope","$window",function($rootScope,$window){
  $window.location.href = $rootScope.tokBoxUrl;//$rootScope.controlUrl //redirects to video call page
}]);

/*app.controller("videoInitController",["$scope","$window","localManager","mySocket","templateService",
  function($scope,$window,localManager,mySocket,templateService){
   
  var user = localManager.getValue("resolveUser");
  user.firstname = user.firstname || user.name;


  $scope.docInfo = templateService.holdForSpecificDoc || templateService.holdForSpecificPatient; // <== also used for patient signaling by doctor

  $scope.yes = function () {
    $scope.isYes = true;
  }
  
  $scope.requestVideoCall = function(userId) {    
    var reqObj = {
      to: userId,
      name: user.firstname,
      title: user.title,
      from: user.user_id
    }

    // takes care of the call initator sending video call request.
    mySocket.emit("convsersation signaling",reqObj,function(data){
      alert(data.message);
    })
  }

  $scope.requestAppointment = function(userId) {
    var reqObj = {
      to: userId,
      message_id: parseInt(Math.floor(Math.random() * 99999) + "" + Math.floor(Math.random() * 99999)),
      date: + new Date(),
      sender_firstname: user.firstname,
      sender_lastname: user.lastname,
      sender_profile_pic_url: user.sender_profile_pic_url,
      sender_id: user.user_id,
      type: "Meet In-person",
      message: "Meet in-person request",
      sender_profile_pic_url: user.profile_pic_url 
    }

    mySocket.emit("appointment signaling",reqObj,function(data){
      alert(data.message);
    })
  }

}]); */

app.controller("videoInitController",["$scope","$window","localManager","mySocket","templateService","$filter","$http",
  function($scope,$window,localManager,mySocket,templateService,$filter,$http){
    /******** Video call Logic *******/
  var user = localManager.getValue("resolveUser");
  user.firstname = user.firstname || user.name;

  $scope.isConnected = true;

  $scope.offline = {};


  $scope.docInfo = templateService.holdForSpecificPatient; // <== also used for patient signaling by doctor

  $scope.yes = function () {
    $scope.isYes = true;
  }


  $scope.requestVideoCall = function(userId) {    
    var reqObj = {
      to: userId,
      name: user.firstname,
      title: user.title,
      from: user.user_id
    }

    // takes care of the call initator sending video call request.
    mySocket.emit("convsersation signaling",reqObj,function(data){
      $scope.msg = data.message;
    })
  }


  if($scope.docInfo.presence) {
    $scope.requestVideoCall($scope.docInfo.user_id)
  } else {
    $scope.msg = $scope.docInfo.name + " is currently offline."
    $scope.isConnected = false;
  }

  $scope.requestAppointment = function(userId) {
    var reqObj = {
      to: userId,
      message_id: parseInt(Math.floor(Math.random() * 99999) + "" + Math.floor(Math.random() * 99999)),
      date: + new Date(),
      sender_firstname: user.firstname,
      sender_lastname: user.lastname,
      sender_profile_pic_url: user.sender_profile_pic_url,
      sender_id: user.user_id,
      type: "Meet In-person",
      message: "Meet in-person request",
      sender_profile_pic_url: user.profile_pic_url 
    }

    mySocket.emit("appointment signaling",reqObj,function(data){
      alert(data.message);
    })
  }

  $scope.confirmTime = function() {
    $scope.offline.type = "Video Chat";
    if(!$scope.offline.time){
      alert("Please choose a suitable time for your conversation.")    
    } else if($scope.offline.time !== 'now'){
      var sptArr = $scope.offline.time.split('-');
      var d = new Date();
      var toNum = parseInt(sptArr[0]);
      var timeOffset;
      var timeFlag;

      if(sptArr[1] == 'm'){
        var minutes = d.getMinutes() + toNum;
        d.setHours(d.getHours(),minutes);
        timeOffset = sptArr[0];
        timeFlag = "Minutes";
      } else {
        var hr = d.getHours() + toNum;
        d.setHours(hr);
        timeOffset = sptArr[0];
        timeFlag = "Hour";
      }

      var tm = $filter('date')(d, 'shortTime');

      $scope.loading = true;

      $http.post("/user/offline-message",
        {offset: timeOffset,time:tm,
          timeFlag:timeFlag,type: $scope.offline.type,partnerId:$scope.docInfo.user_id})
      .success(function(res){
        $scope.loading = false;
        if(res.status){
          $scope.isSent = res.status;
          $scope.bookedTimeMsg = res.msg
        }
      })

    } else {
      $scope.loading = true;
      $http.post("/user/offline-message",
        {type: $scope.offline.type,partnerId:$scope.docInfo.user_id,isNow: true })
      .success(function(res){
        $scope.loading = false;
        if(res.status){
          $scope.isSent = res.status;
          $scope.bookedTimeMsg = res.msg
        }
      })
    }

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

	$scope.verifyPhone = function() {

	}

	$scope.normalUser = function() {
		$rootScope.person.action = "login";
	}

	//destroyStorage(localManager);

}]);

app.service("getCountryService",["$resource",function($resource){
  return $resource("/user/getCountries");
}]);


app.controller('signupController',["$scope","$http","$location","$window","templateService",
  "$resource","$rootScope","localManager","userSignUpService","phoneVerifyService","getCountryService",
  'phoneCallService',"$timeout","cities","userLoginService","ModalService",
  function($scope,$http,$location,$window,templateService,$resource,$rootScope,localManager,
    userSignUpService,phoneVerifyService,getCountryService,phoneCallService,$timeout,cities,userLoginService,ModalService) {

  var signUp = userSignUpService; //$resource('/user/signup',null,{userSignup:{method:"POST"},emailCheck:{method:"PUT"}});
  $scope.countries = localManager.getValue("countries") || getCountries();
  $scope.status = "Country";
  $scope.status1 = "State/Province";
  $scope.status2 = "City/Town";
  $scope.status3 = "LGA/Region";
  
  $scope.cities = cities;

  var currency = {};

  $scope.user = {};

  $rootScope.user = $scope.user;


  $scope.getRoute = function(type){
    $location.path(type);
    $rootScope.auser = type;
  }

  var count = 0;

  var phoneNumber;

  $scope.createAccount = function(type,argTitle){
 
  $scope.user.currencyCode = currency.code;
  $scope.user.state = currency.state;
  $scope.user.region = currency.region;

  $scope.user.typeOfUser = "Patient";

  $scope.user.country = '2328926;NG;Nigeria';

  if(type === 'Patient'){
    $scope.user.age = calculate_age(new Date($scope.user.dob)) + " years";
  }

  if(!$scope.user.username){
    if($scope.user.email){
      var em = $scope.user.email.split('@');
      $scope.user.username = em[0];
    } else {
      var name = $scope.user.firstname || $scope.user.name;
      var em = name.replace(/\s/g, "");
      $scope.user.username = em;
    }
  }

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

    //var objLen = Object.keys($scope.user).length;
    //var msg = "Please fill out empty field"; 

  /*if($scope.user.email) {
    signUp.get({email: $scope.user.email},function(response){
      if(!response.success){ 
        $scope.emailMessage = "User with " + $scope.user.email + " already exists!";
      } else {
        checkExistingPhone();
      }
    })
  } */

  function checkExistingPhone() {
    $scope.phoneMessage = "";
    if($scope.user.phone) {
      //phoneNumber = "+" + $scope.user.callingCode.toString() + $scope.user.phone.toString();
      if($scope.user.phone[0] !== '+'){
        var newSlice = $scope.user.phone.slice(1);
        var code = "+234";//('+' + $scope.user.callingCode.toString()) || "+234";
        $scope.user.phone = code + newSlice;
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

  checkExistingPhone();
    
 }
 // this will be to get the type of diagnostic center a user slected as the type of user
 $scope.center = {}

// $scope.$watch("center.type",function(newVal,oldVal){
  //if(newVal) {
    //$scope.userType(newVal);//sets the type of diagnostic center a user selected.
  //}
 //})
 
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
     // } else if(typeof data.phone !== 'number') {
      //  $scope.phoneMessage = "Enter a valid mobile phone number";
      //  return;
     // } else if(data.password !== data.password2) {
      //  $scope.passwordError = "Password does not match!";
      //  return;
      } else if(data.agree !== true) {
        $scope.termMessage = "You have to agree to our terms and privacy policy";
        return;
     /* } else if(data.email === undefined || data.email === ""){
        $scope.emailMessage = "Enter value for email";
        return;*/
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
     /* } else if(data.address === undefined || data.address === "") {
        $scope.addressMessage = "Enter place of work address";
        return;*/
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
        //if($scope.user.callingCode){        
          data.phone = phoneNumber;
          data.username = data.username.replace(/\s+/g, '');
          $rootScope.formData = data;
          $rootScope.formData.invitationId = $rootScope.invitationId;

          sendDetail();
        //} else {
        //  $scope.numberError = "Invalid number format";
        //  return;
        
      } else {
        $scope.termMessage = "Agree to our terms and conditions";        
      }
    } 
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
        //$location.path("phone-verification");
      }
      $scope.loading = false;
    });   
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
     
      getCurrency(toNum);

      $.getJSON("/assets/calling_code.json", function(result){
        $scope.user.callingCode = result[countryCode]; //parseInt(result[countryCode]);
        $scope.numberError = "";
      }); 
    }
  });

  function getCurrency(id) {
    var elemPos = $scope.countries.map(function(x){return x.geonameId.toString()}).indexOf(id.toString());
   
    currency.code = $scope.countries[elemPos].currencyCode;
  }

 
 /* $scope.isSpeciaty = false;
  $scope.$watch("user.specialty",function(newVal,oldVal){
    if($scope.user.specialty === "edit-specialty") {
      $scope.isSpeciaty = true;
      $scope.user.specialty = "";
    }
  });
 */
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
      $scope.passwordMessage = "Password must be more than six characters. Make sure you used conbinations of letters, special characters and numbers for security purposes."
    if(str.length > 6){
      $scope.passwordMessage = "";
    }
  });

  /*$scope.$watch('online', function(newStatus) { 
    $rootScope.onlineStatus = newStatus;
    $rootScope.acknowledged = false;
    if(newStatus) {
      $timeout(function(){
        $rootScope.acknowledged = true;
      },3000)
    }
  });*/
  //password must be checked lastly. Very important.


  $scope.verify = {};
  $scope.success;
  $scope.sendForm = function (){
    if(!$scope.verify.pin){
      alert("Please enter the verification pin you received.")
      return;
    }

    $scope.loading = true;
    $rootScope.formData.v_pin = $scope.verify.pin;
    //var signUp = userSignUpService;//$resource("/user/signup",null,{userSignup:{method: "POST"}})   
    signUp.userSignup($rootScope.formData,function(response){ 
      $scope.loading = false;         
      if(!response.error) {  
        $scope.success = response.message;       
        //$window.location.href = "/chat-physician";  
        $rootScope.person.username = $rootScope.formData.phone;
        $rootScope.person.password = $rootScope.formData.password;
        $scope.enterAccount();                               
      } else {       
        $scope.error = response.message;       
      }
    });
  }

  $scope.call = function(oldTime){
    phoneCallService({phone: $rootScope.holdPhoneForCall},"/user/verify-phone-number",'PUT')
    $scope.showCallingMsg = "You'll receive a phone call in just a moment. Please enter the pin you hear from the voice call below..."
  }

  var login = userLoginService;

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
        //var name = data.firstname || data.name;
        //$scope.loginSuccess = "Welcome " + name + "! " + "Close the modal and continue."
        //mySocket.emit('join',{userId: data.user_id});
        $rootScope.userLoginService();
      } else {
        $scope.loginMessage = data.message;
      }
    })
  }

  $scope.signin = function(){
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

/*app.controller("verifyPhoneController",["$rootScope","$scope","$resource","$window",
  "userSignUpService","phoneCallService","localManager",
  function($rootScope,$scope,$resource,$window,userSignUpService,phoneCallService,localManager){
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
        if(localManager.getValue('landingCurrPageURL')) {
          $window.location.href = localManager.getValue('landingCurrPageURL');
        }                                   
      } else {       
        $scope.error = response.errorMsg;       
      }
    });
  }

  $scope.call = function(oldTime){
    phoneCallService({phone: $rootScope.holdPhoneForCall},"/user/verify-phone-number",'PUT')
    $scope.showCallingMsg = "You'll receive a phone call in just a moment. Please enter the pin you hear from the voice call below..."
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

