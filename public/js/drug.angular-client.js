

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

app.controller("hompageController",["$scope","cities","Drugs","$http",
  "ModalService","$rootScope","homePageDynamicService",
  "homepageSearchService","localManager","$window","templateService","mySocket","$location","$anchorScroll",
  function($scope,cities,Drugs,$http,
  	ModalService,$rootScope,homePageDynamicService,
  	homepageSearchService,localManager,$window,templateService,mySocket,$location,$anchorScroll){


  $rootScope.cities = cities;

  $rootScope.person = {};

  $rootScope.patient = {}; //used in booking modal

  $scope.itemList = [];

  $rootScope.user = {};

  $scope.search = {};

  

  var dyna = [];
  var filter = {};
  var spArr = [];
  var skArr = [];
  var diArr = [];


  $scope.descriptions = ["Caplets","Capsule","Packet","Bottle","Sachet","Tablets","Vial",
    "Ampoule","Suppository","Syrup","Carton","Ointment","Pints","Pieces","Bags"]


  if(localManager.getValue('cart')){
    $rootScope.cart = localManager.getValue('cart');
  } else {
    $rootScope.cart = [];
    localManager.setValue("cart",$rootScope.cart)
  }

  $scope.dropDownList = [];

  $rootScope.user.category = "Pharmacy";

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

    if(qVal.length > 2){
      var str = qVal[1] || "";
      $rootScope.user.kitItem = str.replace(/%20/g, " ");
    } else {
      var str = qVal[qVal.length - 1] || "";
      $rootScope.user.item = str.replace(/%20/g, " ");
    }
  }

  homePageDynamicService.query($rootScope.user,function(data){
    var list = Drugs.concat(data);
    $scope.drugs = [];
    list.forEach(function(drug){
      $scope.dropDownList.push(drug.name);
      $scope.drugs.push(drug.name)
    });
  });  

  var filter = {};

  $http.get("/drug-kits/all")
  .success(function(response){
    response.forEach(function(item){
      if(!filter.hasOwnProperty(item.name)){
        filter[item.name] = {};
        filter[item.name].disease = item.disease;
        filter[item.name].name = item.name;
        filter[item.name].note = item.note;
        filter[item.name].package = item.package || 0;
        filter[item.name].type = item.type;
        filter[item.name]['content'] = [];//item.content;
        filter[item.name]['content'].push({
          package: item.package,
          content: item.content 
        })
      } else {  
        //filter[item.disease].name = item.name;
        //filter[item.disease].package = item.package;
        //filter[item.disease]['content'] = item.content;
        filter[item.name]['content'].push({
          package: item.package,
          content: item.content 
        })    
       
      }
    })

    $rootScope.allKits = Object.keys(filter);

    if($rootScope.user.kitItem){
      $scope.getKit("Drug",$rootScope.user.kitItem);
    } else {
      $scope.getKit("Drug",'anti-malaria kit');
    }
   
  }) 

  $http.get("/home/getAllPharmarcy")
  .success(function(response){
    response.forEach(function(item){
      $scope.dropDownList.push(item.name);
    })
  }) 

  $rootScope.getKit = function(type,name) {
    $scope.kits = filter[name];
    $scope.section = 'kits';
    //$location.hash('kitArea')
    //$anchorScroll()
  } 


  $scope.clearCart = function() {
    $rootScope.cart.splice(0);
    localManager.setValue("cart",$rootScope.cart);
    $scope.resetSelected();
  }

  $scope.resetSelected = function(id) {
    for(k in filter){
      if(filter.hasOwnProperty(k)){
        if(id){
          for(var a = 0; a < filter[k].content.length; a++){ 
            if(filter[k].content[a].cartId === id){
              filter[k].content[a].isAdded = false;
              break;
            }
          }
        } else {
          for(var a = 0; a < filter[k].content.length; a++){ 
            if(filter[k].content[a].isAdded){
              filter[k].content[a].isAdded = false;
            }
          }
        }
      }
    }
  }


  var cartElemPos; 

  $scope.addToCart = function(itemObj){
    //console.log(content);
    if(!itemObj.isAdded) {
      itemObj.isAdded = true;
      itemObj.cartId = Math.floor(Math.random() * 99999999);
      $rootScope.cart.push({
        id: itemObj.cartId,
        content: itemObj.content
      })     
      localManager.setValue("cart",$rootScope.cart);
    } else {
      cartElemPos = $rootScope.cart.map(function(x){return x.id}).indexOf(itemObj.cartId)
      if(cartElemPos !== -1){
        $rootScope.cart.splice(cartElemPos,1);
        localManager.setValue("cart",$rootScope.cart);
        itemObj.isAdded = false;
      }
    }
  }

  $scope.compose = {}

  $scope.composedItems = [];

  var composeContent;
  var dosageDescription;

  $scope.newDrug = function(drug) {
    $scope.section = 'compose';
    if(drug){
      $scope.compose.item = drug;
    }
  }

  $scope.addComposedItem = function(){
    $scope.drugErrorMsg = "";
    if(!$scope.compose.item){
      $scope.drugErrorMsg = "Drug name field cannot be empty.";
      return;
    }

    dosageDescription =  ($scope.compose.quantity) ?  ($scope.compose.quantity + " " + $scope.compose.dosage) 
    : $scope.compose.dosage; 

    composeContent = [];

    composeContent.push({
      drug_name: $scope.compose.item,
      dosage: dosageDescription,
      frequency: "",
      duration: ""
    })

    $scope.composedItems.push({
      id: Math.floor(Math.random() * 99999999),
      content: composeContent
    });

    $scope.isComposedAdded = false;
  }

  var composeElemPos;
  $scope.delete = function(itemId){
    composeElemPos = $scope.composedItems.map(function(x){return x.id}).indexOf(itemId);    
    $scope.composedItems.splice(composeElemPos,1);
    $scope.isComposedAdded = false;
  }

  $scope.addComposeToCart = function(){
    var combineList = [];
    $scope.composedItems.forEach(function(item){
      for(var i = 0; i < item.content.length; i++){
        combineList.push(item.content[i]);
      }
    });

    $scope.isComposedAdded = true;
   
    $scope.addToCart({
      content: combineList
    })

  }

  $scope.viewCart = function() {
    $scope.section  = 'cartArea';
    $location.hash('cartListArea'); 
    $anchorScroll('cartListArea');
  }

  $scope.deleteItemInCart = function(item) {      
    var elemPos = $rootScope.cart.map(function(x){return x.id}).indexOf(item.id);
    if(elemPos !== -1){
      $rootScope.cart.splice(elemPos,1)
      localManager.setValue("cart",$rootScope.cart);
      $scope.resetSelected(item.id); 
    }
  }

  $scope.find = function(isCartItem) {
    $rootScope.user.item = $scope.search.item;
    $rootScope.user.city = $scope.search.city;
    $location.hash('searchResultArea');   
    $scope.isCart = (isCartItem) ? true : false;
  	$scope.loading = true;
    $scope.section = "search-result";
    $rootScope.searchItems = $scope.user.item;
    $rootScope.searchItemType = "drug";
  	homepageSearchService.get($rootScope.user,function(response){
      $scope.loading = false;   
      $scope.searchResultFull = response.full;
      $scope.searchResultSub = response.sub;
      $anchorScroll();
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

  $scope.chooseKit = function() {
    ModalService.showModal({
      templateUrl: 'choose-kit.html',
      controller: 'chooseKitModalCtrl'
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        console.log(result)             
      });
    });
  }

  $scope.forward = function(center) { 	
   
    if(!$rootScope.checkLogIn.isLoggedIn){
      $rootScope.holdCenter = center;
      ModalService.showModal({
        templateUrl: 'auth.html',
        controller: 'authModalController'
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {             
        });
      });

    } else {    

      var presId = Math.floor(Math.random() * 99999) + "" + Math.floor(Math.random() * 99999);
      var url;
      var method;

      var intRegex = /[0-9 -()+]+$/;
      if(intRegex.test($rootScope.user.phone)){
        if($rootScope.user.phone.indexOf('+') == -1) {
          var newSlice = $rootScope.user.phone.slice(1);
          $rootScope.user.phone = "+234" + newSlice;
        }       
      } else {
        alert("You selected home delivery option. Please check to see if you entered a valid" +
        " mobile phone number we can use to contact you while delivering the package.")
        return;
      }

      $rootScope.cart.forEach(function(cartItem){
      
        if($rootScope.user.isCourier === 'yes'){

          url = "/user/courier";
          method = "POST";    

          sendObj = {
            city: $rootScope.checkLogIn.city,
            location: $rootScope.user.address,
            center_id: center.user_id,
            phone1: $rootScope.user.phone,
            phone2: $rootScope.checkLogIn.phone,
            address: $rootScope.user.address,
            prescriptionId: presId,
            refId: null,
            prescription_body : cartItem.content,
            centerInfo: center,
          }

        } else {

          url = "/user/patient/pharmacy/referral-by-patient";
          method = "PUT";

          sendObj = {
            prescription_body : cartItem.content,    
            user_id : center.user_id,
            provisional_diagnosis: "none",
            explanation: "none",
            date: new Date(),
            prescriptionId: presId,
            title: '',
            doctor_specialty: "",
            doctor_profile_url: '',
            doctor_firstname: '',
            doctor_address: '',
            doctor_id: '',
            doctor_city: '',
            doctor_country: '',
            doctor_profile_pic_url: '',
            patient_id: $rootScope.checkLogIn.user_id || "",
            patient_profile_pic_url: $rootScope.checkLogIn.profile_pic_url,
            patient_firstname: $rootScope.checkLogIn.firstname,
            patient_lastname: $rootScope.checkLogIn.lastname,
            patient_address: $rootScope.checkLogIn.address || $rootScope.checkLogIn.work_place,
            patient_gender: $rootScope.checkLogIn.gender,
            patient_age: $rootScope.checkLogIn.age,
            patient_city: $rootScope.checkLogIn.city,
            patient_country: $rootScope.checkLogIn.country,
            patient_phone: $rootScope.checkLogIn.phone,
            is_paid: false,
            sender: $rootScope.checkLogIn.type
          }
        }

        sendItem(sendObj,center,url,method);  
      })
    }
  }

  var sendItem = function(sendObj,center,url,method) {
    center.loading = true;
    $http({
      method  : method,
      url     : url, 
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      if(data.success){   
        center.success = true;

        if($rootScope.user.isCourier && !$scope.isCalled){
          alert("Sent successfully!"
          + " Please go to your dashboard and check motorcycle icon for update on the home delivery request.");
          //$rootScope.$broadcast("new courier order",{status:true})
          $scope.isCalled = true;
        }

      } else {          
        alert("Prescription not sent! Error occured. Please try again shortly.");
      }
      center.loading = false;
    });
  }

  $rootScope.holdcenter = {};

  $scope.chat = function(center) {
  	if($rootScope.checkLogIn.isLoggedIn){ 
	  	$rootScope.holdcenter = center;
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

  //$scope.find();

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


}]);

app.controller("chooseKitModalCtrl",['$scope','$rootScope',
  function($scope,$rootScope){

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
    
    $scope.sendChatSingle = function(partnerId,partnerId2){
      $scope.loading = true;
      var pId = (partnerId) ? partnerId : partnerId2;
      mySocket.emit("send message general",{to: pId,message:$scope.messageBody,from: user.user_id},function(data){ 
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


app.controller("investigationSearchCtrl",["$scope","$rootScope","$window","$http","$timeout","deviceCheckService",
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


}]);


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




//radiology data



app.factory("Drugs",function(){

  var listOfDrugs = [{name: "Abilify",id:1},{name: "Acetaminophen",id:2},{name: "Acyclovir",id:3},
  {name: "Adderall",id:4},{name: "Albuterol",id:5},{name: "Aleve",id:6},{name: "Allopurinol",id:7},
  {name: "Alprazolam",id:8},{name: "Ambien",id:9},{name: "Amiodarone",id:10},{name: "Amitriptyline",id:11},{name: "Amlodipine",id:12},
  {name: "Amoxicillin",id:13},{name: "Aricept",id:14},
  {name: "Aspirin",id:15},{name: "Atenolol",id:6},{name: "Ativan",id:17},{name: "Atorvastatin",id:18},
  {name: "Augmentin",id:19},{name: "Azithromycin",id:20},
  {name: "Baclofen",id:21},{name: "Bactrim",id:22},{name: "Bactroban",id:23},{name: "Belsomra",id:24},
  {name: "Benadryl",id:25},{name: "Benicar",id:26},
  {name: "Biaxin",id:27},{name: "Bisoprolol",id:28},{name: "Boniva",id:29},{name: "Breo Ellipta",id:30},
  {name: "Brilinta",id:31},{name: "Brovana",id:32},{name: "Bupropion",id:33},
  {name: "Buspar",id:34},{name: "Buspirone",id:35},{name: "Butrans",id:36},{name: "Bydureon",id:37},{name: "Byetta",id:38},
  {name: "Bystolic",id:39},
  {name: "Cardizem",id:40},{name: "Carvedilol",id:41},{name: "Celebrex",id:42},{name: "Celexa",id:43},{name: "Cephalexin",id:44},
  {name: "Cetirizine",id:45},
  {name: "Cialis",id:46},{name: "Cipro",id:47},{name: "Ciprofloxacin",id:48},{name: "Citalopram",id:49},
  {name: "Claritin",id:50},{name: "Clindamycin",id:51},{name: "Clonazepam",id:52},{name: "Clonidine",id:53},{name: "Coreg",id:54},
  {name: "Coumadin",id:55},
  {name: "Cozaar",id:56},{name: "Crestor",id:57},{name: "Cyclobenzaprine",id:58},{name: "Cymbalta",id:59},
  {name: "Daliresp",id:60},{name: "Depakote",id:61},
  {name: "Detrol",id:62},{name: "Dexamethasone",id:63},{name: "Dextromethorphan",id:64},{name: "Diazepam",id:65},
  {name: "Diclofenac",id:66},{name: "Diflucan",id:67},
  {name: "Digoxin",id:68},{name: "Dilantin",id:69},{name: "Dilaudid",id:70},{name: "Diltiazem",id:71},
  {name: "Diovan",id:72},{name: " Diphenhydramine",id:73},{name: "Ditropan",id:74},{name: "Doxazosin",id:75},{name: "Doxycycline",id:76},
  {name: "Dulera",id:77},
  {name: "DuoNeb",id:78},{name: "Dyazide",id:79},{name: "Effexor",id:80},{name: "Effient",id:81},{name: "Elavil",id:82},
  {name: "Eligard",id:83},{name: "Eliquis",id:84},
  {name: "Elocon",id:85},{name: "Enalapril",id:86},{name: "Enbrel",id:87},{name: "Entresto",id:88},{name: "EpiPen",id:89},
  {name: "Epogen",id:90},
  {name: "Erythromycin",id:91},{name: "Estrace",id:92},{name: "Estradiol",id:93},{name: "Etodolac",id:94},
  {name: "Evista",id:95},{name: "Excedrin",id:96},{name: "Exelon",id:97},
  {name: "Exforge",id:98},{name: "Ezetimibe",id:99},{name: "Famotidine",id:100},{name: "Farxiga",id:101},{name: "Femara",id:102},
  {name: "Fenofibrate",id:103},
  {name: "Fentanyl",id:104},{name: "Ferrous Sulfate",id:105},{name: "Fetzima",id:106},{name: "Fioricet",id:107},
  {name: "Fish Oil",id:108},{name: "Flagyl",id:109},
  {name: "Flexeril",id:110},{name: "Flomax",id:111},{name: "Flonase",id:112},{name: "Flovent",id:113},
  {name: "Fluoxetine",id:114},{name: "Focalin",id:115},{name: "Folic Acid",id:116},{name: "Forteo",id:117},
  {name: "Fosamax",id:118},{name: "Furosemide",id:119},
  {name: "Furosemide",id:120},{name: "Gabapentin",id:121},{name: "Gammagard",id:122},{name: "Gamunex",id:123},
  {name: "Garcinia Cambogia",id:124},{name: "Gardasil",id:125},{name: "Gemfibrozil",id:126},
  {name: "Gemzar",id:127},{name: "Genvoya",id:128},{name: "Geodon",id:129},{name: "Gilenya",id:130},
  {name: "Gilotrif",id:131},{name: "Gleevec",id:132},{name: "Glipizide",id:133},
  {name: "Glucophage",id:134},{name: "Glucotrol",id:135},{name: "Glucovance",id:136},{name: "Glyburide",id:137},{name: "Glyxambi",id:138},
  {name: "Gralise",id:139},{name: "Guaifenesin",id:140},
  {name: "Halaven",id:141},{name: "Harvoni",id:142},{name: "Havrix",id:143},{name: "Hcg",id:144},{name: "Heparin",id:45},
  {name: "Herceptin",id:146},{name: "Hetlioz",id:147},
  {name: "Hizentra",id:148},{name: "Horizant",id:149},{name: "Humalog",id:150},{name: "Humira",id:151},
  {name: "Humulin",id:152},{name: "Humulin N",id:153},{name: "Hydrochlorothiazide",id:154},
  {name: "Hydrocodone",id:155},{name: "Hydroxychloroquine",id:156},{name: "Hydroxyzine",id:157},{name: "Hysingla ER",id:158},
  {name: "Hytrin",id:159},{name: "Hyzaar",id:160},{name: "Ibrance",id:161},
  {name: "Ibuprofen",id:162},{name: "Imbruvica",id:163},{name: "Imdur",id:164},{name: "Imitrex",id:165},{name: "Imodium",id:166},
  {name: "Implanon",id:167},{name: "Incruse Ellipta",id:168},{name: "Inderal",id:169},{name: "Injectafer",id:170},
  {name: "Inlyta",id:171},{name: "Insulin",id:172},{name: "Intelence",id:173},
  {name: "Intuniv",id:174},{name: "Invega",id:175},{name: "Invokamet",id:176},
  {name: "Invokana",id:177},{name: "Isentress",id:178},{name: "Isosorbide",id:179},{name: "Istalol",id:180},
  {name: "Jakafi",id:181},{name: "Jalyn",id:182},{name: "Janumet",id:183},{name: "Januvia",id:184},
  {name: "Jardiance",id:185},{name: "Jentadueto",id:186},{name: "Jetrea",id:187},
  {name: "Jevtana",id:188},{name: "Jublia",id:189},{name: "Juvederm",id:190},{name: "Juvisync",id:191},
  {name: "Juxtapid",id:192},{name: "K-dur",id:193},{name: "Kadcyla",id:194},
  {name: "Kadian",id:195},{name: "Kalbitor",id:196},{name: "Kaletra",id:197},{name: "Kapidex",id:198},
  {name: "Kapvay",id:199},{name: "Kazano",id:200},{name: "Keflex",id:201},
  {name: "Kenalog",id:202},{name: "Keppra",id:203},{name: "Kerydin",id:204},{name: "Keytruda",id:205},{name: "Kineret",id:206},
  {name: "Klonopin",id:207},
  {name: "Klor-con",id:208},{name: "Kombiglyze XR",id:209},{name: "Krill Oil",id:210},
  {name: "Kyprolis",id:211},{name: "Kytril",id:212},{name: "Lamictal",id:213},{name: "Lansoprazole",id:214},
  {name: "Lasix",id:215},{name: "Latuda",id:216},{name: "Levaquin",id:217},{name: "Levothyroxine",id:218},
  {name: "Levoxyl",id:219},{name: "Lexapro",id:220},{name: "Lidoderm",id:221},
  {name: "Linzess",id:222},{name: "Lipitor",id:223},{name: "Lisinopril",id:224},{name: "Lithium",id:225},
  {name: "Loratadine",id:226},{name: "Lorazepam",id:227},
  {name: "Losartan",id:228},{name: "Lovenox",id:229},{name: "Lumigan",id:230},{name: "Lupron",id:231},{name: "Lyrica",id:232},{name: "Macrobid",id:233},
  {name: "Meclizine",id:234},{name: "Melatonin",id:235},{name: "Meloxicam",id:236},{name: "Metformin",id:237},
  {name: "Methadone",id:238},{name: "Methocarbamol",id:239},{name: "Methotrexate",id:240},{name: "Methylprednisolone",id:241},
  {name: "Metoclopramide",id:242},{name: "Metoprolol",id:243},
  {name: "Metronidazole",id:244},{name: "MiraLax",id:245},{name: "Mirapex",id:246},{name: "Mirtazapine",id:247},
  {name: "Mobic",id:248},{name: "Morphine",id:249},{name: "Motrin",id:250},{name: "Mucinex",id:251},
  {name: "Naloxone",id:252},{name: "Namenda",id:253},{name: "Naprosyn",id:254},{name: "Naproxen",id:255},{name: "Nasacort",id:256},
  {name: "Nasonex",id:257},{name: "Neurontin",id:258},{name: "Nexium",id:259},{name: "Niacin",id:260},
  {name: "Niaspan",id:261},{name: "Nicotine",id:262},{name: "Nifedipine",id:263},{name: "Nitrofurantoin",id:264},{name: "Nizoral",id:265},
  {name: "Norco",id:266},{name: "Nortriptyline",id:267},{name: "Norvasc",id:268},
  {name: "NovoLog",id:269},{name: "Nucynta",id:270},{name: "Nuvigil",id:271},{name: "Ofev",id:272},{name: "Omeprazole",id:273},
  {name: "Omnicef",id:274},{name: "Ondansetron",id:275},{name: "Onfi",id:276},
  {name: "Onglyza",id:277},{name: "Opana",id:278},{name: "Opdivo",id:279},{name: "Orapred",id:280},{name: "Orencia",id:281},
  {name: "Orlistat",id:282},{name: "Ortho Tri-Cyclen",id:283},{name: "Orthovisc",id:284},
  {name: "Oseltamivir",id:285},{name: "Osphena",id:286},{name: "Otezla",id:287},{name: "Oxybutynin",id:289},{name: "Oxycodone",id:290},
  {name: "Oxycontin",id:291},{name: "Oxytrol",id:292},
  {name: "Paroxetine",id:293},{name: "Paxil",id:294},{name: "Pepcid",id:295},{name: "Percocet",id:296},{name: "Phenergan",id:297},
  {name: "Plaquenil",id:298},{name: "Plavix",id:299},{name: "Potassium Chloride",id:300},
  {name: "Pradaxa",id:301},{name: "Pravachol",id:302},{name: "Pravastatin",id:303},{name: "Prednisone",id:304},
  {name: "Premarin",id:305},{name: "Prevacid",id:306},{name: "Prilosec",id:307},{name: "Prolia",id:308},{name: "Promethazine",id:309},
  {name: "Propranolol",id:310},
  {name: "Protonix",id:311},{name: "Prozac",id:312},{name: "QNASL",id:313},{name: "Qsymia",id:314},{name: "Quillivant XR",id:315},
  {name: "Qutenza",id:316},{name: "Ramipril",id:317},{name: "Ranexa",id:318},
  {name: "Ranitidine",id:319},{name: "Rapaflo",id:320},{name: "Reclast",id:321},{name: "Reglan",id:322},{name: "Relafen",id:323},
  {name: "Remeron",id:324},{name: "Remicade",id:325},{name: "Renvela",id:326},
  {name: "Requip",id:327},{name: "Restasis",id:328},{name: "Restoril",id:329},{name: "Revlimid",id:330},
  {name: "Risperdal",id:331},{name: "Risperidone",id:332},{name: "Ritalin",id:333},
  {name: "Rituxan",id:335},{name: "Robaxin",id:336},{name: "Rocephin",id:337},{name: "Saphris",id:338},
  {name: "Savella",id:339},{name: "Senna",id:340},{name: "Sensipar",id:341},
  {name: "Septra",id:342},{name: "Seroquel",id:343},{name: "Sertraline",id:344},{name: "Sildenafil",id:345},
  {name: "Simbrinza",id:346},{name: "Simvastatin",id:347},{name: "Singulair",id:348},{name: "Skelaxin",id:349},
  {name: "Soma",id:350},{name: "Spiriva",id:351},{name: "Spironolactone",id:352},{name: "Stiolto Respimat",id:353},
  {name: "Strattera",id:354},{name: "Suboxone",id:355},{name: "Symbicort",id:356},
  {name: "Synthroid",id:357},{name: "Tamoxifen",id:357},{name: "Tamsulosin",id:358},
  {name: "Tegretol",id:359},{name: "Temazepam",id:360},{name: "Terazosin",id:361},{name: "Testosterone",id:362},{name: "Tizanidine",id:363},
  {name: "Topamax",id:364},{name: "Toprol",id:365},{name: "Toradol",id:366},{name: "Tradjenta",id:367},{name: "Tramadol",id:368},
  {name: "Travatan",id:369},{name: "Trazodone",id:370},{name: "Triamcinolone",id:371},
  {name: "Triamterene",id:372},{name: "Tricor",id:373},{name: "Trileptal",id:374},
  {name: "Trintellix",id:375},{name: "Tylenol",id:376},{name: "Uceris",id:377},{name: "Ulesfia",id:378},{name: "Uloric",id:379},
  {name: "Ultane",id:380},{name: "Ultracet",id:381},{name: "Ultram",id:382},{name: "Ultresa",id:383},{name: "Uptravi",id:384},
  {name: "Uroxatral",id:385},{name: "Utibron Neohaler",id:386},
  {name: "Valacyclovir",id:387},{name: "Valium",id:388},{name: "Valtrex",id:389},{name: "Vancomycin",id:390},
  {name: "Vasotec",id:391},{name: "Venlafaxine",id:392},{name: "Ventolin",id:393},
  {name: "Verapamil",id:394},{name: "Vesicare",id:395},{name: "Viagra",id:396},{name: "Vicodin",id:397},
  {name: "Victoza",id:398},{name: "Viibryd",id:399},{name: "Vimpat",id:400},
  {name: "Vistaril",id:401},{name: "Vitamin E",id:402},{name: "Voltaren",id:403},{name: "Voltaren Gel",id:404},
  {name: "Vytorin",id:405},{name: "Vyvanse",id:406},{name: "Warfarin",id:407},
  {name: "Wellbutrin",id:408},{name: "Wilate",id:409},{name: "Xalatan",id:410},{name: "Xalkori",id:411},
  {name: "Xanax",id:412},{name: "Xanax XR",id:413},{name: "Xarelto",id:414},
  {name: "Xeljanz",id:415},{name: "Xeloda",id:416},{name: "Xenazine",id:417},{name: "Xenical",id:418},
  {name: "Xgeva",id:419},{name: "Xiaflex",id:420},{name: "Xifaxan",id:421},
  {name: "Xigduo XR",id:422},{name: "Xiidra",id:423},{name: "Xofigo",id:424},{name: "Xolair",id:425},
  {name: "Xopenex",id:426},{name: "Xtandi",id:427},{name: "Xyrem",id:428},
  {name: "Xyzal",id:429},{name: "Yasmin",id:430},{name: "Yaz",id:431},{name: "Yervoy",id:432},{name: "Yondelis",id:433},
  {name: "Yosprala",id:434},{name: "Zanaflex",id:435},
  {name: "Zantac",id:436},{name: "Zestoretic",id:437},{name: "Zestril",id:438},{name: "Zetia",id:439},
  {name: "Ziac",id:440},{name: "Zithromax",id:441},{name: "Zocor",id:443},
  {name: "Zofran",id:444},{name: "Zoloft",id:445},{name: "Zolpidem",id:446},{name: "Zometa",id:447},{name: "Zomig",id:448},
  {name: "Zostavax",id:449},
  {name: "Zosyn",id:450},{name: "Zovirax",id:451},{name: "Zyprexa",id:452},{name: "Zyrtec",id:453},
  {name: "Zytiga",id:454},{name: "Zyvox",id:455}];

  return [];//listOfDrugs;
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