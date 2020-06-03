(function() {

var app = angular.module('myApp',["ngRoute","ngAnimate","angularModalService","angularMoment",'ui.bootstrap',
  'angular-clipboard',"ngResource","btford.socket-io","ngTouch",'ngPrint','paystack','ngSanitize','summernote',
  'xen3r0.underscorejs']);
//htmlToPdfSave

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

app.factory("userData",function(){
  var user = {};
  return {
    set: function(data){
      
      user["userInfo"] = data;
    },
    get: function(){
      return user["userInfo"];
    }
  }
});

//controls all delete logic.
app.factory("deleteFactory",["$http",function($http){
 function Del(item,dest){
    this.item = item;
    this.dest = dest;  
 }

 Del.prototype.deleteItem = function(url,msg){
  var self = this;
  $http({
    method  : 'DELETE',
    url     : url,
    data    : this, 
    headers : {'Content-Type': 'application/json'} 
   })
  .success(function(data) {
    if(self.dest !== "patient_notification" && self.dest !== "doctor_notification" && self.dest !== "diagnostic_center_notification")
      alert(msg);
  });                  
 }

 return Del;

}]);


//sets and retrive the url for templates i.e inner pages for backward navigations.
app.factory("templateUrlFactory",["$window",function($window){
  var urlObj = {};
  return {
    setUrl: function(){
      var url = $window.location.href;
      var arr = url.split("/");
      urlObj.page = arr[arr.length - 1];
    },
    getUrl: function(){
      return (urlObj.page !== "dashboard") ? "#/" + urlObj.page : "#/find-specialist";
    }
  }
}]);


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



app.service("fieldAgentService",["$resource",function($resource){
  return $resource("/user/field-agent",null,{verify:{method: "PUT"}});
}]);

//refers to couroer field agents controller
app.controller("filedAgentController",["$scope","$rootScope","$http",
  "fieldAgentService","$location","ModalService","mySocket","templateService",
  function($scope,$rootScope,$http,fieldAgentService,$location,ModalService,mySocket,templateService){


  var path = window.location.pathname;

  var st = path.split('/')

  var id = st[st.length - 2] + "/" + st[st.length - 1]; 
  $scope.agentId = id;
  
 

  function getData() {
    $http.get("/user/field-agent/get-data",{params:{id:id}})
    .success(function(data){
      $rootScope.courierData = data;
    })
  }

  getData();
  
  $scope.attend = function(firstname,lastname,courierId,creditorId,debitorId,cost,agentId){
    $rootScope.courier = {
      names: firstname + " " + lastname,
      courierId: courierId,
      creditorId: creditorId,
      debitorId: debitorId,
      totalCost: cost,
      status: false,
      agentId: agentId 
    }

    ModalService.showModal({
        templateUrl: 'fieldAgentModal.html',
        controller: "fieldAgentModalCtrl"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {});
    });       

  }

  mySocket.emit("join",{userId: id});

  mySocket.on("delivery start",function(res){
    getData();
    templateService.playAudio(2)
  })

  $scope.toCurrency = function(amount,user) {
    var str = (user.currencyCode) ? user.currencyCode + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "NGN" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str;
  }
  
}]);


app.controller('fieldAgentModalCtrl',["$scope","fieldAgentService","$rootScope",
  function($scope,fieldAgentService,$rootScope){
  var agent = fieldAgentService;
  $scope.verify = function(details){
    details.message = "";
    if(details.order){
      details.loading = true;
      agent.verify(details,function(response){
        details.loading = false
        details.message = response.message;
        details.status = response.status;
        if(response.status) {
          //var elem = document.getElementById(details.courierId);        
          //elem.style.display = "none";
          var elemPos = $rootScope.courierData.couriers.map(function(x){return x._id.toString()})
          .indexOf($rootScope.courier.courierId)
          if(elemPos !== -1){
            $rootScope.courierData.couriers.splice(elemPos,1);
          }
        } else {
          details.message = response.message;
        }
      });
    } else {
      alert("Please enter order ID in the field below.");
    }
  }
}]);

})()