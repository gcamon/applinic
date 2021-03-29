
(function() {

var app = angular.module('myApp',["ngRoute","ngAnimate","angularModalService","angularMoment",'ui.bootstrap',
  'angular-clipboard',"ngResource","btford.socket-io","ngTouch",'ngPrint','paystack','ngSanitize','summernote',
  'xen3r0.underscorejs',"chart.js",'pdf','templates']);

if (!angular.merge) {
  angular.merge = (function mergePollyfill() {
    function setHashKey(obj, h) {
      if (h) {
        obj.$$hashKey = h;
      } else {
        delete obj.$$hashKey;
      }
    }

    function baseExtend(dst, objs, deep) {
      var h = dst.$$hashKey;

      for (var i = 0, ii = objs.length; i < ii; ++i) {
        var obj = objs[i];
        if (!angular.isObject(obj) && !angular.isFunction(obj)) continue;
        var keys = Object.keys(obj);
        for (var j = 0, jj = keys.length; j < jj; j++) {
          var key = keys[j];
          var src = obj[key];

          if (deep && angular.isObject(src)) {
            if (angular.isDate(src)) {
              dst[key] = new Date(src.valueOf());
            } else {
              if (!angular.isObject(dst[key])) dst[key] = angular.isArray(src) ? [] : {};
              baseExtend(dst[key], [src], true);
            }
          } else {
            dst[key] = src;
          }
        }
      }

      setHashKey(dst, h);
      return dst;
    }

    return function merge(dst) {
      return baseExtend(dst, [].slice.call(arguments, 1), true);
    }
  })();
}

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


app.config(['$paystackProvider','$routeProvider',
  function($paystackProvider,$routeProvider){
  $paystackProvider.configure({
      key: "pk_live_8c802331778d98d466afb1817e00867080369bfe",//"pk_test_f9caf875a730e2ce7059b6eda000194c65125bda"
  });

  $routeProvider

  .when("/",{
    templateUrl: '/assets/pages/utilities/landing-update.html',
    controller: 'resultController',
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();
      }
    }
  })

  .when('/consultation-messages',{
    templateUrl: '/assets/pages/doctor/consultation-messages.html',
    controller: 'resultController',
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();
      }
    }
  })

  .when("/list",{
    templateUrl: '/assets/pages/list-doctors.html',
    controller: 'listController',
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();
      }
    }
  })

  .when("/list2",{
    templateUrl: '/assets/pages/list-doctors2.html',
    controller: 'listController',
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();
      }
    }
  })

  .when("/list/:num",{
    templateUrl: '/assets/pages/list-doctors.html',
    controller: 'listController',
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();
      }
    }
  })

  .when("/my-doctors",{
    templateUrl: 'my-doctors.html',//'/assets/pages/patient/my-doctors.html',
    controller: 'manageDoctorsListCtr',
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();
      }
    }
  })

  .when("/consult-specialist",{
    templateUrl: '/assets/pages/patient/selected-doc.html',
    controller: 'bookingDocController'    
  })

  .when("/consult-specialist/default",{
    templateUrl: '/assets/pages/patient/selected-doc2.html',
    controller: 'bookingDocController'    
  })

  .when("/faq",{
    templateUrl: "/assets/pages/utilities/faq.html",
    controller: "supportController"
  })

  .when("/announcement",{
    templateUrl: "/assets/pages/utilities/announcement.html",
    controller: "supportController"
  })

  .when("/rendered-services",{
    templateUrl: "/assets/pages/utilities/service-record.html",
    controller: 'serviceRecordController'
  })

  .when("/patient-dashboard",{
    templateUrl: '/assets/pages/in-patient-dashboard-welcome.html',
    controller: 'patientWelcomeController'
  })

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

  .when("/skills-result",{
    templateUrl: "/assets/pages/utilities/skills.html",
    controller: 'skillListController'
  })

  .when("/create-family-account",{
    templateUrl: "/assets/pages/signups/family-account-signup.html",
    controller: 'familyAccountController'
  })

 
  .when("/appointment",{
    templateUrl: '/assets/pages/in-patient-dashboard.html',
    controller: 'appointmentController'
  })

  .when("/welcome",{
    templateUrl: '/assets/pages/welcome.html',
    controller: 'welcomeController'
  })

  .when("/my-skills",{
    templateUrl: '/assets/pages/utilities/my-skills.html',
    controller: 'skillController'
  })

  .when("/patient-request/:num",{
    templateUrl: '/assets/pages/request-body.html',
    controller: 'requestController',
  })

  .when("/manage-patients",{
    templateUrl: '/assets/pages/doctor/manage-patients.html',
    controller: 'checkingOutDoctorPatientController',
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();
      }
    }
  })

  .when("/granted-request/:id",{
    templateUrl: '/assets/pages/view-request.html',
    controller: 'patientViewRequestController',
    /*resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();
      }
    }*/
  })

  .when("/rejected-request/:id",{
    templateUrl: '/assets/pages/rejected-request.html',
    controller: 'patientViewRequestController'
  })

 .when("/patient-doctor/treatment",{
  templateUrl: '/assets/pages/patient-treatment.html',
  controller: 'patientTreatmentController'
 })

 .when("/patient-doctor/treatment/:id",{
  templateUrl: '/assets/pages/specific-doctor.html',
  controller: 'myDoctorController'
 })

 .when('/doctor-patient/treatment/:id',{
  templateUrl: '/assets/pages/specific-patient.html',
  controller: 'myPatientController'
 })  

 //wallet route
 .when("/wallet",{
  templateUrl: '/assets/pages/finance/my-wallet.html',
  controller: 'walletController',
 /* resolve: {
    path: function($location,$rootScope){
      $rootScope.path = $location.path();
    }
  }*/
 })


 .when("/transfer",{
  templateUrl: '/assets/pages/finance/fund-transfer.html',
  controller: 'walletController'
 })

 .when("/transactions",{
  templateUrl: '/assets/pages/finance/transaction.html',
  controller: 'walletController'
 })

 .when("/user-otp",{
  templateUrl:"/assets/pages/finance/one-time-pin.html",
  controller: 'walletController'
 })

 .when("/billing-otp",{
  templateUrl: "/assets/pages/finance/billing.html",
  controller: 'billingController'
 })

 .when("/cash-out",{
  templateUrl: "/assets/pages/finance/cash-out.html",
  controller: "cashOutController"
 })

 //end of wallet route

 .when("/charts", {
  templateUrl: '/assets/pages/utilities/chart.html',
  controller: 'chartCtrl'
 })

 .when("/doc-edit-profile", {
  templateUrl: '/assets/pages/doctor/doctor-edit-profile.html',
  controller: 'docProfileEditController'
 })

 .when("/edit-profile", {
  templateUrl: '/assets/pages/patient-edit-profile.html',
  controller: 'patientProfileEditController'
 })

 .when("/edit-picture",{
  templateUrl: "/assets/pages/edit-picture.html",
  controller: 'changePictureController'
 })

 .when("/medical-record",{
  templateUrl: "/assets/pages/patient-view-medical-record.html",
  controller: "medicalRecordTemplateController"
 })

 .when("/patient-prescriptions",{
  templateUrl: "/assets/pages/patient-view-prescriptions.html",
  controller: 'prescriptionTemplateController',
  resolve: {
    path: function($location,$rootScope){
      $rootScope.path = $location.path();
    }
  }
 })

 .when("/patient-prescriptions/:id",{
  templateUrl: "/assets/pages/patient-view-prescriptions.html",
  controller: 'prescriptionTemplateController',
  resolve: {
    path: function($location,$rootScope){
      $rootScope.path = $location.path();  
    }
  }
 })

 .when("/patient-prescriptions/em",{
  templateUrl: "/assets/pages/patient-view-prescriptions.html",
  controller: "emprescriptionTemplateController"
 }) 

 .when("/patient-prescriptions/em/:id",{
  templateUrl: "/assets/pages/patient-view-prescriptions.html",
  controller: "emprescriptionTemplateController"
 })

 .when("/patient-prescription/view-from-notification/:id",{
  templateUrl: "/assets/pages/patient-view-prescriptions.html",
  controller: "viewPrescriptionFromNoticeTemplateController"
 })
 
 .when("/search/pharmacy",{
  templateUrl: "/assets/pages/search-phamarcy.html",
  controller: 'searchForPharmacyController'
 })

 .when("/patient/search/pharmacy",{
  templateUrl: "/assets/pages/search-phamarcy.html",
  controller: 'patientSearchForPharmacyController'
 })
//for pharmacy
 .when("/referred-patients",{
  templateUrl: "/assets/pages/referred-patients-list.html",
  controller: 'referredPatientsController',
  resolve: {
    path: function($location,$rootScope){
      $rootScope.path = $location.path();  
    }
  }
 })
////////////////////////////////////////////////////////////////////////////////////////////////////////

 //for laboratory
 .when("/referral/laboratory-test",{
  templateUrl:"/assets/pages/laboratory/referral-lab.html",
  controller: 'labReferredPatientsController'
 })

 .when("/laboratory-edit-profile",{
  templateUrl: "/assets/pages/laboratory/profile-edit.html",
  controller: 'labProfileEdit'
 })

 .when("/lab/test-service/update",{
  templateUrl: "/assets/pages/laboratory/test-update.html",
  controller: 'labTestServicesUpdateController'
 })

 .when("/lab/off-service",{
  templateUrl: "/assets/pages/laboratory/not-ran-test.html",
  controller: "testNotRanBycenterController"
 })

 .when("/laboratory/test-search/result",{
  templateUrl: "/assets/pages/utilities/test-search-result.html",
  controller: 'testSearchResultController'
 })

 .when("/test/selected-laboratory",{
  templateUrl: "/assets/pages/utilities/selected-center.html",
  controller: 'testSearchSelectedCenterController'
 })

 //for radiology

 .when("/radiology-edit-profile",{
  templateUrl: "/assets/pages/radiology/profile-edit.html",
  controller: 'radioProfileEdit'
 })

 .when("/radio/test-service/update",{
  templateUrl: "/assets/pages/radiology/test-update.html",
  controller: 'radioTestServicesUpdateController'
 })

 .when("/radio/off-service",{
  templateUrl: "/assets/pages/radiology/not-ran-test.html",
  controller: "radioTestNotRanBycenterController"
 })

 .when("/referral/radiology-test",{
  templateUrl: "/assets/pages/radiology/referral-scan.html",
  controller: 'radioReferredPatientController'
 })

 .when("/radiology/scan-search/result",{
  templateUrl: "/assets/pages/utilities/scan-search-result.html",
  controller: 'scanSearchResultController'
 })

 .when("/scan/selected-radiology",{
  templateUrl: "/assets/pages/utilities/selected-center.html",
  controller: "scanSearchSelectedCenterController"
 })

 //for pharmacy

 .when("/pharmacy-edit-profile",{
  templateUrl: "/assets/pages/pharmacy-inner-pages/profile-edit.html",
  controller: 'pharmacyProfileEditController'
 })

 .when("/pharmacy/drug-service/update",{
  templateUrl: "/assets/pages/pharmacy-inner-pages/drug-update.html",
  controller: 'pharmacyDrugServicesUpdateController'
 })

 .when("/pharmacy/off-service",{
  templateUrl: "/assets/pages/pharmacy-inner-pages/not-have-drugs.html",
  controller: "pharmacyDrugNotHaveBycenterController"
 })

 .when("/pharmacy/view-prescription/:id",{
  templateUrl: "/assets/pages/pharmacy-inner-pages/view-prescription.html",
  controller: 'pharmacyViewPrescriptionController'
 })

 .when("/pharmacy/drug-search/result",{
  templateUrl: "/assets/pages/utilities/drug-search-result.html",
  controller: 'drugSearchResultController',
  resolve: {
    path: function($location,$rootScope){
      $rootScope.path = $location.path();  
    }
  }
 })

 .when("/drug/selected-pharmacy",{
  templateUrl:"/assets/pages/utilities/selected-center.html",
  controller:'searchSelectedCenterController'
 })


 /////////////////////////////////////////////////////

 .when("/patient/selected-center/:id",{
  templateUrl: "/assets/pages/selected-center.html",
  controller: 'selectedCenterController'
 })

 .when("/patient/view-prescription-history/:id",{
  templateUrl : "/assets/pages/patient-view-prescription-history.html",
  controller : 'trackedPrescriptionController'
 })

 .when('/doctor/call',{
  templateUrl: "/assets/pages/empty.html",
  controller: 'callController'
 })

 .when("/selected-appointment/:id",{
  templateUrl: "/assets/pages/doctor-appointment.html",
  controller: 'selectedAppointmentController'
 })

 .when("/p/selected-appointment",{
  templateUrl: "patient-appointment.html",//"/assets/pages/patient/patient-appointment.html",
  controller: 'selectedAppointmentControllerForPatient'
 })

 .when("/lab",{
  templateUrl: "/assets/pages/lab-test-list.html",
  controller: 'labController'
 })

 .when("/preview-test",{
  templateUrl: "/assets/pages/preview-lab-test.html",
  controller: 'previewLabTestController'
 })

 .when("/preview-scan-test",{
  templateUrl: "/assets/pages/radiology/preview-scan-test.html",
  controller: 'previewScanTestController'
 })

 .when("/find-laboratory",{
  templateUrl: "/assets/pages/find-laboratory.html",
  controller: 'findLabController'
 })

 .when("/find-radiology",{
  templateUrl: "/assets/pages/radiology/find-radiology.html",
  controller: 'findRadioController'
 })



 .when("/selected-laboratory/:id",{
  templateUrl: "/assets/pages/selected-laboratory.html",
  controller: 'selectedLabController'
 })

 .when('/selected-radiology/:id',{
  templateUrl: "/assets/pages/radiology/selected-radiology.html",
  controller: "selectedRadioController"
 })

 .when("/laboratory/selected-laboratory/:id",{
  templateUrl: "/assets/pages/selected-laboratory.html",
  controller: "laboratorySelectedLabController"
 })

 .when("/laboratory/view-test/:id",{
  templateUrl:"/assets/pages/laboratory/lab-view-test.html",
  controller: 'labTestControler',
  resolve: {
    path: function($location,$rootScope){
      var iframe = document.getElementById('iframeTag');

      var tempDiv = document.getElementById('innerDivTemp');
      if(iframe) {
        iframe.style.visibility = "hidden";
        tempDiv.style.visibility = "hidden";
        $rootScope.hideFrame = true;
      }


    }
  }
 })

 .when("/laboratory/find-laboratory",{
  templateUrl: "/assets/pages/find-laboratory.html",
  controller: "laboratoryfindLabController"
 })

 //general center search for nearby contact
 .when("/pharmacy-in",{
  templateUrl: "/assets/pages/pharmacy-inner-pages/pharmacy-center.html",
  controller: "findCenterController"
 })

 .when("/laboratory-in",{
  templateUrl: "/assets/pages/laboratory/lab-center.html",
  controller: "findCenterController"
 })

 .when("/radiology-in",{
  templateUrl: "/assets/pages/radiology/radio-center.html",
  controller: "findCenterController"
 })

 //for radiology

 .when('/scan',{
  templateUrl: "/assets/pages/radiology/scan-test-list.html",
  controller: "scanController"
 })

 .when("/radiology/view-test/:id",{
   templateUrl:"/assets/pages/radiology/radio-view-test.html",
   controller: 'radioTestControler'
 })

 .when("/radiology/find-radiology",{
  templateUrl: "/assets/pages/radiology/find-radiology.html",
  controller: "radiologyfindRadioController"
 })

 .when('/radiology/selected-radiology/:id',{
  templateUrl: "/assets/pages/radiology/selected-radiology.html",
  controller: "radiologySelectedRadioController"
 })

 .when("/pending/lab-test",{
  templateUrl: "/assets/pages/pending-test.html",
  controller: 'pendingLabTestController'
 })

 .when("/pending/scan-test",{
  templateUrl: "/assets/pages/pending-test.html",
  controller: 'pendingRadioTestController'
 })

 .when("/pending/lab-test/:id",{
  templateUrl: "/assets/pages/pending-test.html",
  controller: 'pendingLabTestController'
 })

 .when("/pending/scan-test/:id",{
  templateUrl: "/assets/pages/pending-test.html",
  controller: 'pendingRadioTestController'
 })


 .when("/patient/laboratory-test",{
  templateUrl:"/assets/pages/laboratory/lab-test.html",
  controller: 'patientLabTestController'
 })

 .when("/patient/laboratory-test/:id",{
  templateUrl:"/assets/pages/laboratory/lab-test.html",
  controller: 'patientLabTestController'
 })

 .when("/patient/radiology-test",{
  templateUrl:"/assets/pages/radiology/scan-test.html",
  controller: 'patientRadioTestController'
 })

 .when("/patient/radiology-test/:id",{
  templateUrl:"/assets/pages/radiology/scan-test.html",
  controller: 'patientRadioTestController'
 })

 .when("/patient/my-doctors",{
  templateUrl:"/assets/pages/patient/my-doctors.html",
  controller: 'chooseDoctorController'
 })
  
 .when("/patient/selected-doctor",{
  templateUrl: "/assets/pages/patient/selected-doctor.html",
  controller: 'selectedDoctorToSendTestController'
 })

 /**for emergency profile user **/
 .when("/emp",{
  templateUrl: "/assets/pages/em/em-note.html",
  controller: "emNoteController"
 })

 .when("/em/patient/laboratory-test",{
  templateUrl: "/assets/pages/em/em-lab-test.html",
  controller: "emLabTestController"
 })

 .when("/em/patient/radiology-test",{
  templateUrl: "/assets/pages/em/em-scan-test.html",
  controller: "emScanTestController"
 })


 /**** for utilities ****/
 .when("/drug",{
  templateUrl: "/assets/pages/utilities/search-drug.html",
  controller: 'drugController'
 })

 .when("/search-test",{
  templateUrl: "/assets/pages/utilities/search-test.html",
  controller: 'searchTestController'
 })

 .when("/scan-search",{
  templateUrl: "/assets/pages/utilities/search-test.html",
  controller: 'searchScanController'
 })

 .when("/procedure",{
  templateUrl:"/assets/pages/utilities/skill-procedure.html",
  controller: 'resultController'
 })

 .when("/invite",{
    templateUrl:"/assets/pages/utilities/invitation.html",
    controller: 'invitationCtrl',
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();  
      }
    }
 })

.when("/invite-doctor",{
    templateUrl:"/assets/pages/utilities/invitation2.html",
    controller: 'invitationCtrl',
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();  
      }
    }
 })

 .when("/help",{
  templateUrl: "/assets/pages/utilities/help.html",
  controller: 'helpController2'
 })

.when("/need-specialist",{
  templateUrl: "/assets/pages/utilities/get-specialist.html",
  controller: 'helpController'
 })

.when("/patient/forward-test",{
  templateUrl: "/assets/pages/patient/forward-test.html",
  controller: 'patientRedirectTestController'
})

.when("/find-specialist",{
  templateUrl: 'find-specialist.html',//"/assets/pages/utilities/find-specialist.html",
  controller: 'resultController'
 })

.when("/special-center",{
  templateUrl: "/assets/pages/utilities/special-center.html",
  controller: 'resultController'
 })


.when("/view-response/:complaintId",{
  templateUrl: "/assets/pages/utilities/view-response.html",
  controller: 'PatientViewResponseController',
})

.when("/courier",{
  templateUrl: "/assets/pages/utilities/courier.html",
  controller: 'courierController',
 /*resolve: {
    path: function($location,$rootScope){
      $rootScope.path = $location.path();  
    }
  }*/
 })

 .when("/courier-response/:id",{
  templateUrl: 'courier-response.html',//"/assets/pages/utilities/courier-response.html",
  controller: "courierResponseCtrl",
  resolve: {
    path: function($location,$rootScope){
      $rootScope.path = $location.path();  
    }
  }
 })

 //display

 .when("/specialists",{
  templateUrl: "/assets/pages/home-display/specialists.html",
  controller: "displayController"
 })

 .when("/laboratory",{
  templateUrl: "/assets/pages/home-display/laboratory.html"
 })

 .when("/radiology",{
  templateUrl: "/assets/pages/home-display/radiology.html"
 })

 .when("/pharmacy",{
  templateUrl: "/assets/pages/home-display/pharmacy.html"
 })

 .when("/add-service", {
  templateUrl: "/assets/pages/add-service.html",
  controller: "createTestController"
 })

 .when("/courier-requests",{
  templateUrl: "/assets/pages/pharmacy-inner-pages/courier-request.html",
  controller: "centerCourierController"
 })

 //for general chats

 .when("/general-chat",{
  templateUrl: "/assets/pages/utilities/chat.html",
  controller: 'generalChatController'
 })

 .when("/outpatient-billing/:id",{
  templateUrl: "/assets/pages/utilities/out-patient-billing.html",
  controller: "outPatientBillingCtrl"
 })


 .when("/bank-details",{
  templateUrl: "/assets/pages/finance/add-bank-details.html",
  controller: "bankDetailsCtrl"
 })


 /** Admin utilities **/

 .when('/admin',{
  templateUrl: "/assets/pages/utilities/analytics.html",
  controller: "adminAnalyticManageCtrl"
 })

 .when("/admin-doctors",{
    templateUrl: "/assets/pages/utilities/admin-users.html",
    controller: "adminManageCtrl"
 })

 .when("/admin-patients",{
    templateUrl: "/assets/pages/utilities/admin-users.html",
    controller: "adminManageCtrl"
 })

 .when("/admin-pharmacy",{
    templateUrl: "/assets/pages/utilities/admin-users.html",
    controller: "adminManageCtrl"
 })

 .when("/admin-laboratory",{
    templateUrl: "/assets/pages/utilities/admin-users.html",
    controller: "adminManageCtrl"
 })

 .when("/admin-radiology",{
    templateUrl: "/assets/pages/utilities/admin-users.html",
    controller: "adminManageCtrl"
 })

 .when("/admin-special-center",{
    templateUrl: "/assets/pages/utilities/admin-users.html",
    controller: "adminManageCtrl"
 })

 .when("/admin-user-details",{
    templateUrl: "/assets/pages/utilities/admin-user-details.html",
    controller: "adminGetUserCtrl"
 })

 .when("/admin-withdrawals",{
    templateUrl: "/assets/pages/utilities/admin-withdrawals.html",
    controller: "adminWithdrawalCtrl"
 })

 .when("/admin-withdrawals-attend/:id",{
    templateUrl: "/assets/pages/utilities/admin-withdrawals-attend.html",
    controller: "adminWithdrawalAttendCtrl"
 })

 .when("/admin-settled-withdrawals",{
    templateUrl: "/assets/pages/utilities/settled-withdrawals.html",
    controller: "adminSettledWithdrawalAttendCtrl"
 })

 .when("/consultation-requests",{
    templateUrl: "/assets/pages/utilities/consultations.html",
    controller: "adminConsultationRequestCtrl"
 })

 .when("/commissions",{
    templateUrl: "/assets/pages/utilities/commission.html",
    controller: "adminCommissionRequestCtrl"
 })

 .when("/add-kits",{
    templateUrl: "/assets/pages/utilities/kits.html",
    controller: "adminAddKitCtrl"
 })

 .when("/add-to-list",{
    templateUrl: "/assets/pages/utilities/add-to-list.html",
    controller: "adminAddToListCtrl"
 })

 .when("/scroll",{
    templateUrl: "/assets/pages/utilities/scroll.html",
    controller: "adminScrollCtrl"
 })

.when("/pwr",{
    templateUrl: "/assets/pages/utilities/pwr.html",
    controller: "adminPWRCtrl",
    resolve: {
      path: function($location,$rootScope){
        $rootScope.path = $location.path();  
      }
    }
})

.when("/complaint-details",{
  templateUrl: "/assets/pages/utilities/pwr-details.html",
  controller: "adminPWRDetailCtrl"
})

.when("/medical-history",{
  templateUrl: "/assets/pages/utilities/medical-history.html",
  controller: "medHistoryCtrl"
})

.when("/dicom-services",{
  templateUrl: "/assets/pages/utilities/dicom.html",
  controller: "dicomCtrl"
})

.when("/import",{
  templateUrl: "/assets/pages/utilities/link-dicom.html",
  controller: "dicomCtrl"
})

.when("/dicom-update",{
  templateUrl: "/assets/pages/utilities/update-dicom.html",
  controller: "dicomCtrl"
})

.when("/template-update",{
  templateUrl: "/assets/pages/utilities/temp-update.html",
  controller: "tempCtrl"
})

.when("/add-radiologist",{
  templateUrl: "/assets/pages/radiology/add-radiologist.html",
  controller: "addRadiologistCtrl"
})

.when("/manage-radiologist",{
  templateUrl: "/assets/pages/radiology/manage-radiologist.html",
  controller: "addRadiologistCtrl"
})

.when("/edit-radiologist",{
  templateUrl: "/assets/pages/radiology/edit-radiologist.html",
  controller: "addRadiologistCtrl"
})

.when("/linked",{
  templateUrl: "/assets/pages/radiology/view-dicom.html",
  controller: "viewLinkedDicomCtrl"
})

.when("/laboratory-out",{
  templateUrl: "/assets/pages/laboratory/lab-out.html",
  controller: "labOutCtrl"
})

.when("/radiology-out",{
  templateUrl: "/assets/pages/radiology/radio-out.html",
  controller: "radioOutCtrl"
})

.when("/prescription-out",{
  templateUrl: "/assets/pages/pharmacy-inner-pages/prescription-out.html",
  controller: "prescriptionOutCtrl"
})

.when("/drugs-and-kits",{
  templateUrl: "/assets/pages/utilities/drugs-and-kits.html",
  controller: "drugsAndKitsCtrl"
})

.when("/subscriptions",{
  templateUrl: "/assets/pages/utilities/plan.html",
  controller: "planCtrl"
})

.when("/subscriptions2",{
  templateUrl: "/assets/pages/utilities/plan2.html",
  controller: "planCtrl"
})

.when('/consultation-fee/:id',{
  templateUrl: "/assets/pages/patient/consultation-fee.html",
  controller: "consultationFeeCtrl",
})

.when("/messages",{
  templateUrl: "/assets/pages/utilities/messages.html",
  controller: "noteCtrl"
})

.when("/courier-notification",{
  templateUrl: 'courier-note.html',//"/assets/pages/utilities/courier-note.html",
  controller: "noteCtrl"
})

.when("/chats-notification",{
  templateUrl: "/assets/pages/utilities/chats-notification.html",
  controller: "noteCtrl"
})

.when("/audioChat-notification",{
  templateUrl: "/assets/pages/utilities/audio-notification.html",
  controller: "noteCtrl"
})

.when("/videoChat-notification",{
  templateUrl: "/assets/pages/utilities/video-notification.html",
  controller: "noteCtrl"
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


app.service("chatService",["$resource",function($resource){

  var source = $resource("/user/chats",null,{updateChat:{method: "PUT"}});

  this.chats = function() {
    return source.query();
  }

 this.updateChat = function(id,chats){
   return source.updateChat({chatId: id, chats: chats})
 }

}]);

app.service("deviceCheckService",function(){
  this.getDeviceType = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
  }
})



app.service("multiData",["$http","$window","templateService",function($http,$window,templateService){
  this.sendPic = function(url,data){
    
    var fd = new FormData();
    for(var key in data){
      fd.append(key,data[key]);
    }; 

  
    
    $http.put(url,fd,{
      transformRequest: angular.identity,
      headers: {"Content-Type":undefined}
    })
    .success(function(response){
      templateService.changedProfilePic = response;
      templateService.isUpdated = true;
      templateService.holdScanImageList = response;
      
      alert("Updated successfuly!")
    });
  }
}]);

//user for docprofileedit controller, for sending skill description and images.
app.service("multiData2",["$http","$window","templateService",function($http,$window,templateService){
  this.sendSkill = function(url,data){
    
    var fd = new FormData();
    if(data.files)
      for(var key = 0; key < data.files.length; key++){
          fd.append(key,data.files[key],data.files[key].name);
      };

    //for doctor adding procedural and skill update, the file attached will be sent with the form
   
    var form = data.form;

    for(var key in form) {
      fd.append(key,form[key]);
    }
    

    $http.put(url,fd,{
      transformRequest: angular.identity,
      headers: {"Content-Type":undefined}
    })
    .success(function(response){
      alert("Skill added to records");
    });
  }
}]);

//laboratory
app.service("labProfileEditService",["$resource",function($resource){
  return $resource("/user/getcenter-details",null,{updateInfo:{method:"PUT"}});
}]);

app.service("patientMedHistory",["$resource",function($resource){
  return $resource("/user/patient/medical-history",null,{update: {method: "PUT"}});
}]);

//radiology
app.service("radioProfileEditService",["$resource",function($resource){
  return  $resource("/user/getcenter-details",null,{updateInfo:{method:"PUT"}});
}]);


app.service("userLoginService",["$resource",function($resource){
  return $resource('/user/login',null,{logPerson:{method:"POST"}});
}]);

app.service("changPasswordService",["$resource",function($resource){
  return $resource('/user/change-password/:id',{id:"@userId"},{updatePassword:{method:"PUT"},verifyUser:{method:"POST"}});
}]);

app.service("manageRecordAccessService",["$resource",function($resource){
  return $resource("/user/manage-access",null,{updateAccess:{method: "PUT"},changeKey: {method: "PATCH"}})
}]);

app.service("getBalanceService",["$resource",function($resource){
  return $resource('/user/get-balance',null,{headers:{withCredentials: true}});
}]);

app.service("userSignUpService",["$resource",function($resource){
  return $resource('/user/signup',null,{userSignup:{method:"POST"},emailCheck:{method:"PUT"}});
}]); 

app.service("phoneVerifyService",["$resource",function($resource){
  return $resource("/user/verify-phone-number",null,{go:{method:"PUT"}});
}]);

app.service("getCountryService",["$resource",function($resource){
  return $resource("/user/getCountries");
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

app.service("skillService",["$resource",function($resource){
  return $resource("/user/get-skills",null,{updateSkill: {method: "PUT"}});
}])

app.service("skillCommentsService",["$resource",function($resource){
  return $resource("/user/skill/comments",null,{updateComment: {method: "PUT"}});
}])

app.service("profileDataService",["$resource",function($resource){
  return $resource("/user/get-profile-data");
}]);


app.service("phoneUpdateService",["$resource",function($resource){
  return $resource("/user/new-phone-update",null,{userChangeNumber:{method: "PUT"}});
}]);

app.service("patientfindDoctorService",["$resource",function($resource){
  return $resource("/user/patient/find-doctor");
}]);

//for the list of doctors page

app.service("skillProcedureService",["$resource",function($resource){
  return $resource("/user/skills-procedures");
}]);

app.service("docAppointmentViewService",["$resource",function($resource){
  return $resource("/user/doctor/appointment/view",null,{view: {method: "PUT"},mark: {method: "PATCH"}})
}]);

/****************** lab and radio controller inside in-treatment view *********************/

app.service("labNotRanService",["$resource",function($resource){
  return $resource("/user/laboratory/not-ran-services");
}]);

app.service("getAllLaboratoryService",["$resource",function($resource){
  return $resource("/user/getAllLaboratory")
}]);

 app.service("radioNotRanService",["$resource",function($resource){
  return $resource("/user/radiology/not-ran-services");
}]);

app.service("getAllRadiologyService",["$resource",function($resource){
  return $resource("/user/getAllRadiology");
}]);

app.service("findSpecialistService",["$resource",function($resource){
  return $resource("/user/find-specialist",null,{refer:{method: "PUT"}});
}]);

app.service("patientNotificationService",["$resource",function($resource){
  return $resource("/user/patient/notifications");
}]);

app.service("chatHistoryService",["$resource",function($resource){
  return $resource("/user/get-chats");
}]);

app.service("getResponseService",["$resource",function($resource){
  return $resource("/user/patient/get-response");
}]);

app.service("getMessagesService",["$resource",function($resource){
  return $resource("/user/patient/get-message");
}]);

app.service("getAppointmentServce",["$resource",function($resource){
  return $resource("/user/patient/appointment/view");
}])

app.service("getPersonProfileService",["$resource",function($resource){
  return $resource("/user/get-person-profile");
}]);

app.service("walletService",["$resource",function($resource){
  this.resource = function(url,params,action){
    return $resource(url,params,action);
  }
}]);

app.service("userVerifyService",["$resource",function($resource){
  return $resource("/user/verify");
}]);

app.service("getMyDoctorService",["$resource",function($resource){
  return $resource("/user/patient/get-my-doctors");
}]);

app.service("consultationAccptanceService",["$resource",function($resource){
  return $resource("/user/patient/consultation-acceptance/confirmation",{userId: null},{confirmed:{method:'POST'}});
}]);

app.service("patientBillingService",["$resource",function($resource){
  return $resource("/user/payment/patient-billing",null,{sendBill:{method: "POST"}});
}]);

app.service("medicalRecordService",["$resource",function($resource){
  return $resource("/user/get-medical-record");
}])

app.service('patientRedirectTestService',["$resource",function($resource){
  return $resource("/user/patient/get-centers",null,{sendTest:{method:"PUT"}});
}]);

//this service is for patient view for lab test, prescriptions and radiology test based on period or most recent
app.service("patientMedViewController",function(){
  this.getList = function(num,prescriptionObjs){
    if(num !== undefined){
        var newArr = [];
        var now = new Date();
        var lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - num);
        var thisMonth = new Date();
        thisMonth.setMonth(now.getMonth());

        var thisMontStamp = + new Date(thisMonth);
        var lastStamp = + new Date(lastMonth);
        for(var i = 0; i < prescriptionObjs.length; i++){
          if(prescriptionObjs[i].date > lastStamp && prescriptionObjs[i].date < thisMontStamp) {
            newArr.push(prescriptionObjs[i]);
          }
        }
        return newArr;
      } 
  }
});

app.service("cashOutControllerService",["$resource",function($resource){
  return $resource("/user/cashout",null,{cashing:{method: "POST"},update:{method: "PUT"}});
}]);

app.service("commissionService",["$resource",function($resource){
  return $resource("/user/admin/commissions",null,{update:{method:"PUT"},create: {method: "POST"}});
}]);

app.service("adminConsultationService",["$resource",function($resource){
  return $resource('/user/admin/get-consultations');
}]);

app.service("adminScrollService",["$resource",function($resource){
  return $resource('/user/admin/scrolls');
}]);

app.service("myPatientControllerService",["$resource",function($resource){
  return $resource("/user/doctor/specific-patient");
}]);

app.service("getPatientMedicationByDoctorService",["$resource",function($resource){
  return $resource("/user/get-medical-record");
}]);

app.service("getMedicalHistoryService",["$resource",function($resource){
  return $resource("/user/get-medical-record");
}]);

app.service("drugNotRanService",["$resource",function($resource){
  return $resource("/user/pharmacy/not-ran-services");
}]);

app.service("getAllPharmacyService",["$resource",function($resource){
  return $resource("/user/patient/getAllPharmacy");
}]);

app.service("getSessionService",["$resource",function($resource){
  return $resource("/user/doctor/get-patient-sessions");
}]);

app.service("outPatientBillingService",["$resource",function($resource){
  return $resource("/user/outpatient-billing",null,{createBill: {method: "POST"},acceptBill:{method: "PUT"}});
}]);

app.service("pharmacyProfileEditControllerService",["$resource",function($resource){
  return $resource("/user/getcenter-details",null,{updateInfo:{method:"PUT"}})
}]);

app.service("pharmacyCenterNotificationControllerService",["$resource",function($resource){
  return $resource("/user/center/get-notification");
}]);

app.service("addNoteService",["$resource",function($resource){
  return $resource("/user/pharmacy/get-referral",null,{sendObj:{method:"PUT"}});
}]);

app.service("viewNoteService",["$resource",function($resource){
  return $resource("/user/pharmacy/get-referral");
}]);

app.service("billingAuthService",["$resource",function($resource){
  return $resource("/user/center/billing-verification",null,{verify: {method: "PUT"},centerVerify: {method: "POST"}});
}]);

app.service("paymentVerificationService",["$resource",function($resource){
  return $resource("/user/payment/verification",{userId: null},{verify:{method:'POST'}}); 
}]);

app.service("labCenterNotificationService",["$resource",function($resource){
  return $resource("/user/center/get-notification");
}]);

app.service("labNoteService",["$resource",function($resource){
  return $resource( "/user/laboratory/get-referral",null,{sendObj:{method:"PUT"}});
}]);

/*app.service("searchTestService",["$resource",function($resource){
  return $resource("/user/laboratory/search/find-tests",null,{findCenter:{method:"PUT"}});
}]);*/

app.service("toCenterService",["$resource",function($resource){
  return $resource("/user/center/send-test",null,{sendTest:{method: 'POST'}});
}]);

app.service("labUnRanTestService",["$resource",function($resource){
  return $resource("/user/laboratory/search/find-tests");
}]);

app.service("digitalSigneePathologistService",["$resource",function($resource){
  return $resource("/user/lab-report/signees",null,{create:{method: "POST"}});
}])

app.service("radioNotificationService",["$resource",function($resource){
  return $resource("/user/center/get-notification",null,{updateStatus:{method:'PUT'}});
}]);

app.service("radioTestsService",["$resource",function($resource){
  return $resource("/user/radiology/get-referral",null,{sendObj:{method:"PUT"}});
}]);


app.service("radioSearchTestService",["$resource",function($resource){
  return  $resource("/user/radiology/search/find-tests",null,{findCenter:{method:"PUT"}});
}]);

app.service("radioToService",["$resource",function($resource){
  return $resource("/user/center/radiology/send-test",null,{sendTest:{method: 'POST'}});
}]);

/*** for additional utilities like search for drug of lab test etc.*/

app.service("searchtestservice",["$window","$http","templateService","$location","$rootScope",
  function($window,$http,templateService,$location,$rootScope){
  this.goBack = function(type){
    switch(type){
      case "Patient":
        $window.location.href = "/user/patient";
        break;
      case "Doctor":
        $window.location.href = "/user/doctor";
        break;
      case "Laboratory":
        $window.location.href = "/user/laboratory";
        break;
      case "Radiology":
        $window.location.href = "/user/radiology";
        break;
      case "Pharmacy":
        $window.location.href = "/user/pharmacy";
        break;
      default:
        $window.location.href = "/";
      break
    }
  }

  this.find = function(data,url,path){
    $http({
      method  : 'PUT',
      url     : url,
      data    : data,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {   
      $rootScope.isLoading = false;   
      if(data.full.length !== 0 || data.less.length !== 0){
        templateService.holdSearchResult = data;      
        $location.path(path)
      } else {
        alert("No result found based on your search criteria.")
      }
      $rootScope.isLoading = false;
    });
  }


}]);

app.service("dynamicService",["$resource",function($resource){
  return $resource("/user/dynamic-service",null,{createService:{"method": "POST"},updateService: {method: "PUT"}});
}]);

app.service("centerProfileService",["$resource",function($resource){
  return $resource("/user/center-profile");
}]);

app.service("courierResponseService",["$resource",function($resource){
  return $resource("/user/courier-response",null,{pay:{method: "POST"},reOder:{method: "PUT"}});
}])

app.service("fieldAgentService",["$resource",function($resource){
  return $resource("/user/field-agent",null,{update:{method: "PUT"},del:{method:"DELETE"},verify:{method: "POST"}})
}])

app.service('emMedService',["$http","localManager",function($http,localManager,templateService){
  this.getRecords = function(person){    
    $http({
    method  : 'PUT',
    url     : "/patient/get-medical-record/em",
    data    :  person,
    headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
      if(data){
       
        localManager.setValue("holdPrescriptions",data.prescriptions); 
        localManager.setValue("holdLabData",data.medical_records.laboratory_test);
        localManager.setValue("holdScanData",data.medical_records.radiology_test);
      }
    })
  }

}]);

app.service("patientWaitingRoomService",["$resource",function($resource){
  return $resource("/user/response/patients-histories/:batch",null,{respond:{method: "POST"}});
}]);

//14/11/2019
app.service("dicomStudyService",["$resource",function($resource){
  return $resource("/user/dicom-service",null,{update:{method: "PUT"},create:{method:'POST'}});
}]);

app.service("bankDetailsService",["$resource",function($resource){
  return $resource("/user/bank-details",null,{update:{method: "PUT"},create:{method:'POST'}});
}]);

app.service("homePageDynamicService",["$resource",function($resource){
  return $resource("/dynamic-service");
}]);

app.service("homepageSearchService",["$resource",function($resource){
  return $resource("/general/homepage-search");
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

app.factory("medicaRecordFactory",function(){
  var record = {};
  return {
    set: function(data){
      record.val = data;
    },
    get: function(){
      return record.val;
    }
  }
})


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



/*********** normal controllers *********/


// this controller gets  the patient medical records from the backend and seperates laboratory tsest from radiology test 
//to store then templateService. Note patient prescription  is not amonge the data filtered so far.
app.controller("patientNotificationController",["$scope","$location","$http","$window","$rootScope","$resource","chatService",
  "templateService","localManager","deleteFactory","mySocket","$timeout","medicaRecordFactory","patientNotificationService",
  "getMedicalHistoryService","chatHistoryService","getResponseService","getMessagesService",
  "getAppointmentServce","courierResponseService","$filter","deviceCheckService",
  function($scope,$location,$http, $window,$rootScope,$resource,chatService,templateService,localManager,
    deleteFactory,mySocket,$timeout,medicaRecordFactory,patientNotificationService,
    getMedicalHistoryService,chatHistoryService,getResponseService,getMessagesService,
    getAppointmentServce,courierResponseService,$filter,deviceCheckService){
  
  var filter = {};
  
  var getRecords = function(){
    var records = getMedicalHistoryService; //$resource("/user/get-medical-record"); //$resource("/user/get-medical-record");
    records.get(function(data){
      if(data){
        //medicaRecordFactory.set(data);
        templateService.holdAllPrescriptionForTemplate = data;      
        templateService.holdAllLabTest = data.medical_records.laboratory_test;
        templateService.holdAllRadioTest = data.medical_records.radiology_test;
        localManager.setValue("holdLabData",data.medical_records.laboratory_test);
        localManager.setValue("holdScanData",data.medical_records.radiology_test);         
        // this fns checks the list to see if any test is pending for both laboratory and radiology
        checkIsLabPending(data.medical_records.laboratory_test);
        checkIsRadioPending(data.medical_records.radiology_test);
      }  
    });
  }


  var checkIsLabPending = function (list) {
    var pendingLab = [];      
    for(var test = 0; test < list.length; test++) {
      if(list[test].conclusion === "Pending") {
        pendingLab.unshift(list[test]);
      }
    }

    if(pendingLab.length > 0) {
      $scope.isLabP = true;
      $scope.labLenPending = pendingLab.length;
      templateService.pendingLab = pendingLab;
    }
  }

  var checkIsRadioPending = function (list) {
    var pendingScan = [];      
    for(var test = 0; test < list.length; test++) {
      if(list[test].conclusion === "Pending") {
        pendingScan.unshift(list[test]);
      }
    }

    if(pendingScan.length > 0) { 
      $scope.isScanP = true;
      $scope.scanLenPending = pendingScan.length;
      templateService.pendingScan = pendingScan;
    }
  }

  $scope.getData = function(firstname,lastname,date,pic,fee,patientName,wallet_amount,doc_id,service_access,specialty,message){
     if(!filter.hasOwnProperty(filter[date])){
        filter[date] = date;
         var values = {};   
         values.getRealDate = date;
         values.getfirstname = firstname;
         values.getLastname = lastname;
         values.getFee = fee;
         values.getpic = pic;
         values.patientName = patientName;
         values.wallet = wallet_amount;
         values.doctorId = doc_id;
         values.service_access = service_access;
         values.getSpecialty = specialty;
         values.getMessage = message;
         templateService.holdAllNotification.push(values);

     }
   }

   $scope.convertDate = function(date){
     templateService.getRealDate = date;
     $scope.realDate = templateService.getRealDate;
   } 

  

  /*$scope.viewNote = function(id,type){
    templateService.holdId = id;
    switch(type){
      case "laboratory":
        $location.path("/lab-notification/" + id);
      break;
      case "radiology":
        $location.path("/radio-notification/" + id);
      break;
      case "pharmacy":
        $location.path("/prescription-notification/" + id);
      break;
      default:
      break
    }
    $location.path("/notification/" + id);
  }*/


  
  $scope.getLen = function(len){
    return len;
  }


  $scope.isView = false;


 
  var note = patientNotificationService;

  function getNotification() {     
    note.query(function(data){
      $rootScope.allNote = data;
      $rootScope.noteLen = data.length; 

      for(var item = data.length - 1; item >= 0; item--) {
        if(!filter.hasOwnProperty(data[item].type)){
          filter[data[item].type] = [];
          filter[data[item].type].unshift(data[item]);
        } else {
          filter[data[item].type].unshift(data[item]);
        }
      }

      $rootScope.videoRequest = filter['video'] || [];
      $rootScope.audioRequest = filter['audio'] || []; 
      //$rootScope.inPersonRequest =  filter["Meet In-person"] || [];

    });

    $rootScope.$broadcast("fetRecord",{status: true});
  }
             
    
  $rootScope.viewNoteLab = function(id){
    $scope.isView = true;
    var absPath;
    var data = templateService.holdAllLabTest;
    var elementPos = data.map(function(x){return x.ref_id}).indexOf(id);
    if(elementPos !== -1) {   
      $rootScope.isViewSingle = true;   // shows single lab tests for
      $rootScope.singleView = [data[elementPos]];
      if(data[elementPos].report === "Pending"){
        absPath = "/pending/lab-test/" + id;
      } else {        
        absPath = "/patient/laboratory-test/" + id;
      }
    }     
   
    $location.path(absPath);
    deleteByRefId(id,"/user/delete-one/refId");
  }

  $rootScope.viewNoteRadio = function(id){   
    $scope.isView = true;
    var absPath; 
    var data = templateService.holdAllRadioTest;
    var elementPos = data.map(function(x){return x.ref_id}).indexOf(id);
    
    if(elementPos !== -1) {
      $rootScope.isViewSingle = true;   // shows single lab tests for
      $rootScope.singleView = [data[elementPos]];
      if(!data[elementPos].pdf_report[0]){
        absPath = "/pending/scan-test/" + id;
      } else {        
        absPath = "/patient/radiology-test/" + id;
      }
    }
    $location.path(absPath);
    deleteByRefId(id,"/user/delete-one/refId");
  }

  $rootScope.viewNotePharmacy = function(id){
    var prescriptions = templateService.holdPrescriptions;

    $http({
      method  : 'GET',
      url     : "/user/patient/get-prescription/track-record",        
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      templateService.holdTrackRecord = [];
      data.forEach(function(record){
        if(record.ref_id === id) {
          templateService.holdTrackRecord.unshift(record);
        }
      });
      //templateService.holdTrackRecord = holdRecord;
    });

    var presIndex = prescriptions.map(function(x){return x.ref_id}).indexOf(id)
    var found = prescriptions[presIndex];
    templateService.holdPrescriptionForTrackRecord = found;
    $location.path("/patient/view-prescription-history/" + id)    
    deleteByNoteId(id,"/user/patient/delete-one/noteId");
    $scope.isView = true;
  }

 
  function getMessages() {
    var note = getMessagesService;
    note.query(function(data){
      var len = data.length;
      if(len > 0){
        $rootScope.msgLen = templateService.holdMsgLen(len);   
        $rootScope.allMsg = data;
        templateService.holdMsg = data;
      }  
    })
  }

  $scope.hideLen = function(){
    $scope.msgLen = 0
  }

  $rootScope.viewBill = function(id){
    if(id){
      templateService.holdId = id;
      var temp = "/outpatient-billing/" + id;
      $location.path(temp);
    }
  }

  $rootScope.viewConsultationFee = function(id,msgId) {
    templateService.holdId = id;//this is underscore (_id) of the consult model in the back end;
    $location.path('/consultation-fee/' + msgId );
  }

  $rootScope.viewMessage = function(id,msg){    
    templateService.holdId = id;
    templateService.message_id = msg.message_id;
    if(!msg.reason) {
      $location.path("/granted-request/" + msg.message_id);
    } else {
      $location.path("/rejected-request/" + msg.message_id);
    }
  }

 

  $rootScope.viewResponse1 = function(doctorId,complaintId){
    var sendObj = {
      doctorId: doctorId,
      complaintId: complaintId
    }
    var msg = getResponseService; //$resource("/user/patient/get-response");
    msg.get(sendObj,function(data){
      
      templateService.holdData = data;
      var path = "/view-response/" + complaintId;
      $location.path(path);
      templateService.holdCurrentPage = path;//holds the current path so that after the user has finish send otp in 
      //other controller. this path will be return i.e returning to the initial template.
    });
  }


  //appointment views
  function getAppointment (){
    var note = getAppointmentServce //$resource("/user/patient/appointment/view");
    note.query(function(data){
      var len = data.length;
      if(len > 0) {
        //$rootScope.appLen = templateService.holdAppLen(len);             
        //templateService.holdAppointmentData = data; 
        $rootScope.allApp = data;
      }   
    })
    
  }
  

  $rootScope.viewAppointment = function(sessionId){
    //templateService.holdId = sessionId;
    $location.path("/p/selected-appointment"); 
  }

//delete logic function that controls all deleting from notification bar
  function deleteFomBackEnd(id,list) {    
      var msg = "Notification deleted";
      var del = new deleteFactory(id,"patient_notification");
      del.deleteItem("/user/patient/delete-one/appointment","");//deletes notification once it is viewed.
      if($rootScope.noteLen > 0)
        $rootScope.noteLen--;
  }

  function deleteByRefId(id,field){
    var msg = "Notification deleted";
    var del = new deleteFactory(id,"patient_notification");
    del.deleteItem("/user/delete-one/refId","");//deletes notification once it is viewed.
    if($rootScope.noteLen > 0)
      $rootScope.noteLen--;    
  }

  function deleteByNoteId(id,field) {
    var msg = "Notification deleted";
    var del = new deleteFactory(id,"patient_notification");
    del.deleteItem("/user/delete-one/refId","");//deletes notification once it is viewed.
    if($rootScope.noteLen > 0)
      $rootScope.noteLen--;    
  }


  function getIndicatorPerDoctorAction (type) {
    $http.get('/user/get-unread')
    .success(function(resp){
      $rootScope.unreadIndication = resp;
    })
  }


  $scope.holdVideoCallResponse = [];
  $scope.holdAudioCallResponse = [];

  mySocket.on("conversation status",function(data){
    
    templateService.playAudio(1);
    if(data.type === "Video Call"){
      $scope.holdVideoCallResponse.unshift(data);
      $scope.videoLen = $scope.holdVideoCallResponse.length;
    } else if(data.type === "Audio Call"){
      $scope.holdAudioCallResponse.unshift(data);
      $scope.audioLen = $scope.holdAudioCallResponse.length;
    }
    $rootScope.sender = data;
    $scope.isReceivedRequest = true;
    $timeout(function(){
      $scope.isReceivedRequest = false;
    },10000);
    
  });


  //patient receives appointment in real time.
  mySocket.on("appointment status",function(data){
    if(data.status){
      templateService.playAudio(1);
      data.type = "Meet In-Person";
      $scope.isReceivedRequest = true;
      $timeout(function(){
        $scope.isReceivedRequest = false;
      },10000);
      getAppointment();
    }
  });

  //patient receives message in real time.
  mySocket.on("message notification",function(data){
    if(data.status){
      templateService.playAudio(0);
      data.type = "message";
      $scope.isReceivedRequest = true;
      getMessages();
      $timeout(function(){
        $scope.isReceivedRequest = false;
      },10000);
     
    }
  });

  $rootScope.$on("message notification",function(data){
    getMessages();
  })

  mySocket.on("notification",function(data){
    if(data.status){
      if(!data.noSound){
        templateService.playAudio(1);
      }
      data.type = "notification";
      $scope.isReceivedRequest = true;
      $timeout(function(){
        $scope.isReceivedRequest = false;
      },10000);
      getNotification();

      //call a function that gets indicator show for a new prescription, lab or radio against any doctor that sents it.
      getIndicatorPerDoctorAction()
    }
  })

  mySocket.on("calling",function(data){
    var decide = confirm(data.callerFirstname + " " + data.callerLastname  + " wants to have video chat with you now.");
    if(decide){
      localManager.setValue("caller",data.receiver);
      localManager.setValue("receiver",data.caller);
      localManager.setValue("doctorInfoforCommunication",{userId:data.from,title: data.title,firstname: data.callerFirstname,lastname: data.callerLastname})
      mySocket.emit("in call connected",{to:data.from});
      $window.location.href = "/user/patient/call";
            
    } else {
      mySocket.emit("call rejected",{to:data.from});
    }
  });

  $scope.viewVideoAppointment = function(id){
    var elemPos = $scope.holdVideoCallResponse.map(function(x){return x.message_id}).indexOf(id);
    var found = $scope.holdVideoCallResponse[elemPos];
  }


  //loads up patient medical records
  getRecords();

  //loads up patient bell notificatio list
  getNotification();

  //loads up appointment notification list for patient
  getAppointment();

  //loads up message notification list for patient
  getMessages();

  // loads up values from  back end to show which prescription, lab or radio that has not been read or attended to by patient
  getIndicatorPerDoctorAction();

  //gets chats from the back end and also control the indicator for unattended chat
  $scope.showIndicator = false;
  $rootScope.$on("unattendedMsg",function(status,data){
    $scope.showIndicator = data;
  });

  

  $scope.viewChatsHistory = function() {
     var source = chatHistoryService; //$resource("/user/get-chats");
     source.query(function(chatsList){
      
      $scope.chatsList = chatsList || [];
     })
     $rootScope.$broadcast("unattendedMsg",false);
  }

  /*$scope.viewChat = function(chatId) {
    var split = chatId.split("/")
    var id = split[split.length - 1];
    var path = "/patient-doctor/treatment/" + id;
    $location.path(path);
  }*/

    // to be modified later suit general
  /*$rootScope.loadChats = function() {
    $scope.loading = true;
    $rootScope.chatsList = chatService.chats();
    $rootScope.chatsList.$promise.then(function(result){
      $scope.loading = false;
      $rootScope.chatsList = result;
      for(var i = 0; i < result.length; i++) {
        if(!result[i].is_read) {
          $scope.showIndicator = true;
          break;
        }
      }
    });
  }

  $rootScope.loadChats();*/

   $rootScope.viewChat3 = function(partnerId) {  
    /*var list = $rootScope.chatsList; 
    localManager.setValue("isChatListViewMobile",true);
    if(list) {
      var byRecent = $filter('orderBy')(list,'-realTime');
      templateService.holdId = byRecent[0].partnerId;   
      if(deviceCheckService.getDeviceType()){
        localManager.setValue("holdIdForChat",templateService.holdId);
        localManager.setValue("holdChatList",list)
        window.location.targer = "_blank";
        window.location.href = "/user/chat/general";
      } else if(templateService.holdId) {
        $location.path("/general-chat");
      } else {
        alert("You have no messages yet.")
      }
      $scope.showIndicator = false;
    }*/

    templateService.holdId = (partnerId !== "all") ? partnerId : $rootScope.chatsList[0].partnerId; 

    if(deviceCheckService.getDeviceType()){
      if(partnerId === 'all'){
        localManager.setValue("isChatListViewMobile",true);
      }

      localManager.setValue("holdIdForChat",partnerId);
      localManager.setValue("holdChatList",$rootScope.chatsList);
      window.location.target = "_blank";
      window.location.href = "/user/chat/general";

    } else if(templateService.holdId) {
      $location.path("/general-chat");
    } else {
      alert("You have no messages yet.")
    }

    $scope.showIndicator = false;
  }

  $rootScope.viewChat = function(partnerId) {
    templateService.holdId = partnerId;
    localManager.setValue("isChatListViewMobile",true);
    $location.path("/general-chat");
    $scope.showIndicator = false;
  }


  var courierResponse = courierResponseService;

  function getCourier() {
    courierResponse.query(function(data){
      $rootScope.courierResponseList = data;
      $scope.unRead = data[0];
      data.forEach(function(item){
        if(!item.is_paid && item.attended) {
          $scope.isReady = true;
        }
      })
    });
  }

  mySocket.on("courier billed",function(res){
    getCourier();
    templateService.playAudio(3);
    
    if(res.isConfirm){
      if($rootScope.courierResponse){
        $rootScope.courierResponse = null;
      }
      alert(res.message);
      $rootScope.getCourierResponse(res._id);
    } else {
      var check = confirm(res.message);
      if(check) {        
        if($rootScope.courierResponse){
          $rootScope.courierResponse = null;
        }
        $rootScope.getCourierResponse(res._id);
        var pt = "/courier-response/" + Math.floor(Math.random() * 99999999);       
        $location.path(pt);
      }
    } 
   
  });

  mySocket.on("new courier order",function(res){
    getCourier();
  });


  $rootScope.$on('new courier order',function(status,res){
     getCourier();
  })

  var pt;

  $rootScope.viewResponse = function(item) {
    if(!item.is_paid && item.attended)
      $scope.isReady = false;

    $rootScope.courierResponse = item;
    $rootScope.isFromNote = true;
    pt = '/courier-response/' + Math.floor(Math.random() * 99999999);
    $location.path(pt);
  }

  getCourier();

  $rootScope.getCourierResponse = function(courierId) {
    if(!$rootScope.courierResponse && !$rootScope.courierId) {
      var aCourier = localManager.getValue("holdCourierData");
      var id;

      if(aCourier){
        id = (courierId) ? courierId : aCourier._id;        
      } else {
        id = courierId;
      }

      $rootScope.courierId = id;

      $rootScope.loadingReq = true;
      var courierResponse = courierResponseService;
      courierResponse.get({_id: id},function(data){
        $rootScope.courierResponse = data;
        $rootScope.loadingReq = false;
      });
    }
  }

}]);


app.controller("topHeaderController",["$scope","$rootScope","$window","$location","$resource",
  "localManager","mySocket","templateService","$timeout","$document","ModalService",
   "cities","$filter","_","$interval","dynamicService","chatService",
  function($scope,$rootScope,$window,$location,$resource,localManager,mySocket,templateService,
   $timeout, $document, ModalService,cities,$filter,_,$interval,dynamicService,chatService){

  if(!localManager.getValue("resolveUser")) {
    $window.location.href = "/login";
  }

  $rootScope.toCurrency = function(amount) {
    if(amount) {
      var str = ($rootScope.checkLogIn.currencyCode) ? $rootScope.checkLogIn.currencyCode + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "NGN" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return str;
    } else {
      return "";
    }
  }
  
  //user this service within controllers to alert on every event status.
  
  $rootScope.alertService = function (val,msg) {
    if (val) { 
      templateService.playAudio(val);
      $rootScope.alert = true;
      $rootScope.message = msg;
      $timeout(function(){
        $scope.$apply(function(){
          $rootScope.alert = false;
          $rootScope.message = msg;
        })
      },6000)
    } 
  }

  $rootScope.setPhone = function(phoneNumber) {
    if(phoneNumber) {
      var val = (typeof phoneNumber == 'number') ? phoneNumber.toString() : phoneNumber;
      var subNum = val.substring(0,2)
      if(subNum !== "+2" && subNum !== "23"){
        var toNum = parseInt(val);
        if(typeof toNum == 'number'){
          val = "+234" + phoneNumber;
        }
      } 

      if(val.substring(0,1) !== "+"){
        val = "+" + val;
      }

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

  $scope.isMenu = false;

  $scope.isClicked = function(){
    if($scope.isMenu === false) {
      $scope.drop = true;
      $scope.isMenu = true;
    } else {
      $scope.drop = false;
      $scope.isMenu = false;
    }
    
  }

  $rootScope.cities = cities;

 
  
  $rootScope.checkLogIn = localManager.getValue("resolveUser");

  if($rootScope.checkLogIn.typeOfUser === "Patient")
    $rootScope.keepMain = localManager.getValue("mainAccount");

  localManager.setValue("userId",$rootScope.checkLogIn.user_id);

  if($scope.checkLogIn){
    switch($scope.checkLogIn.typeOfUser) {
      case "Doctor":        
        $scope.back = "/user/doctor";       
      break;
      case "Patient":
        $scope.back = "/user/patient";
      break;
      case "Pharmacy":
        $scope.back = "/user/pharmacy";
      break;
      case "Laboratory":
        $scope.back = "/user/laboratory";
      break;
      case "Radiology":
        $scope.back = "/user/radiology";
      break;
      default:
      break;
    }
  }
    
  $scope.print = function(){
    var sendObj = {
      grade: 10000,
      quantity: 20
    }

    var token = $resource("/user/token",null,{createToken:{method:"POST"}});
    token.createToken(sendObj,function(response){
      alert(response);
    });
  }

  var elemPos;
  mySocket.on("new_msg", function(data) { 
    if($location.path() !== "/general-chat") {
      $rootScope.$broadcast("unattendedMsg",true);   
      templateService.playAudio(2);
    } else {
      elemPos = $rootScope.chatsList.map(function(x){return x.chat_id}).indexOf(data.chatId);
      if(elemPos !== -1) {
        $rootScope.chatsList[elemPos].isUnRead = true;
      } else {
        $rootScope.chatsList.push(data);
      }
    }
    mySocket.emit("msg received",{to: data.from,id:data.date});
  });




  //use for filter in PWR
  $rootScope.complain = {};

  $rootScope.logout = function(){
    /*mySocket.emit("set presence",{status:"offline",userId:$scope.checkLogIn.user_id},function(response){
      if(response.status === false){
        if($scope.checkLogIn.typeOfUser === "Doctor"){
          mySocket.emit("doctor disconnect",{userId:$scope.checkLogIn.user_id});
        } else if($scope.checkLogIn.typeOfUser === "Patient") {
          mySocket.emit("patient disconnect",$scope.checkLogIn);
        }
      }
    });*/

    /*if($scope.checkLogIn.typeOfUser === "Patient")
      mySocket.emit("check presence",{status: true},function(res){
        $rootScope.$broadcast("users presence",{type: 'doctorList',data: $rootScope.patientsDoctorList,sockets: res});         
      })

    if($scope.checkLogIn.typeOfUser === "Doctor")
      mySocket.emit("check presence",{status: true},function(res){
        $rootScope.$broadcast("users presence",{type: 'patientList',data: $rootScope.patientList,sockets: res});         
      })*/

    $window.location.href = "/user/logout";
    destroyStorage();
  }

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
    localManager.removeItem("adminFoundUser");
    localManager.removeItem("availablility");
    localManager.removeItem("partnerDetails");
  }

  var inviteCount = 0;
  $rootScope.inviteOnline = function(receiver) {
    if(inviteCount <= 5)  {
      var type = receiver.type || "center";
      var msg = "You want to invite this " + type + " to come online and have a chat with you."
      var check = confirm(msg);
      if(check) {
        inviteCount++;
        var name = ($rootScope.checkLogIn.lastname) ? $rootScope.checkLogIn.lastname : "center";
        var data = {
          sender: name,
          receiver_name: (receiver.lastname) ? receiver.lastname : "center",
          receiver_phone: receiver.phone,
          receiver_id: receiver.user_id,
          type: $rootScope.checkLogIn.typeOfUser
        }

        mySocket.emit('invite online',data,function(respnse){
          alert(respnse.message);
        })
      }
    } else {
      alert("Ooops! You have reached your invitation limit for this user. Please be patient till you receive a response.")
    }

  }



  console.log('starting run');

  // Timeout timer value
  var TimeOutTimerValue = 60000000; // 15 minutes

  // Start a timeout
  var TimeOut_Thread = $timeout(function(){ LogoutByTimer()} , TimeOutTimerValue);
  var bodyElement = angular.element($document);

 $rootScope.events = ['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll'];
  /*angular.forEach(['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'], 
  function(EventName) {
       bodyElement.bind(EventName, function (e) { TimeOut_Resetter(e) });  
  });*/

  for(var i = 0; i < $rootScope.events.length; i++){
    bodyElement.on($rootScope.events[i], function (e) { TimeOut_Resetter(e) }); 
  }
  var count = 0;
  function LogoutByTimer(){
      console.log("logout");     
      //alert("You have been idle for a while you will be logged out!")      
      //bodyElement.off()
      ///////////////////////////////////////////////////
      /// redirect to another page(eg. Login.html) here
      ///////////////////////////////////////////////////
      if(count > 0) {
        //send request to log user out!
        ModalService.showModal({
            templateUrl: 'session-timeout.html',
            controller: "timeOutModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
              
            });
        });        
      }

      count++;
  }

  function TimeOut_Resetter(e){
      
      /// Stop the pending timeout
      $timeout.cancel(TimeOut_Thread);

      /// Reset the timeout
      TimeOut_Thread = $timeout(function(){ LogoutByTimer() } , TimeOutTimerValue);
  }

  $rootScope.autoExpand = function(e) {
    var element = typeof e === 'object' ? e.target : document.getElementById(e);
    var scrollHeight = element.scrollHeight - 60; // replace 60 by the sum of padding-top and padding-bottom
    element.style.height =  scrollHeight + "px";    
  };

  $rootScope.autoExpand2 = function(e) {
    var element = typeof e === 'object' ? e.target : document.getElementById(e);
    var scrollHeight = element.scrollHeight - 1; // replace 60 by the sum of padding-top and padding-bottom
    element.style.height =  scrollHeight + "px";    
  };

  //sending prescription/lab/radio to an email
  $rootScope.email = function(docInfo,type) {
    $rootScope.emailData = {};
    $rootScope.emailData.filePath = (type === 'Laboratory') ? docInfo.lab_pdf_report[0].pdf_report 
    : (type === 'Radiology') ? docInfo.pdf_report[0].pathname : "";
    $rootScope.emailData.type = type;
    switch (type) {
      case 'Prescription':
        if(docInfo.doctor_work_place) {
          $rootScope.emailData.htmlTemp = "<h3 style='text-align:center'>" 
          + docInfo.patient_firstname + " " + docInfo.patient_lastname + "<br><span style='font-size:14px'>Age: " + docInfo.patient_age 
          + "</span><br> <span style='font-size:14px'> Gender: " + docInfo.patient_gender + "</span></h3> <br><div><br><b>Prescribed By: </b> " + 
          "<span> " + docInfo.title + " " + docInfo.doctor_firstname + " " + docInfo.doctor_lastname 
          + "</span><br><br><b>Place of Work :</b>" 
          + "<span> " + docInfo.doctor_work_place + "</span><br><br>" 
           + "<b>Address: </b> <span>" + docInfo.doctor_address + ", " + docInfo.doctor_city + "</span><br><br>"
          + "<b>Specialty : </b><span>" + docInfo.doctor_specialty + "</span><br><br>" 
          + "<b>Date of prescription : </b><span>" + $filter('amCalendar')(docInfo.date) + "</span><br><br>"       
          + "<span>Profile URL: </span> " + "https://applinic.com" + docInfo.doctor_profile_url + "<br><br>"
          + "</span><br><br><b>Prescription ID: </b><span>" + docInfo.prescriptionId
          + "</span><br><br><b>Description: </b><span>" + docInfo.provisional_diagnosis
          + "</span><br><br>" 
          + "<table><tr><th style='font-size: 14px;padding:2px'>S/N</th><th style='font-size: 14px;padding:5px'>Drug</th><th style='font-size: 14px;padding:5px'>Dosage</th><th style='font-size: 14px;padding:5px'>Frequency</th><th style='font-size: 14px;padding:5px'>Duration</th></tr>" 
          + createItemTable(docInfo.prescription_body) + "</table><br><br>" 
          + "<a href='https://applinic.com' style='text-decoration:none'><img src='https://applinic.com/assets/images/icons/favicon.png' style='width:32px;height:auto'> <b>Applinic</b></a><br>"
          + "<div style='font-size: 14px'>The above prescription(s) was written in www.applinic.com (Online Healthcare Application).<br><br><a href='https://applinic.com/signup' style='text-decoration:none'>Create an account for free" +
           "</a> and enjoy easy access to healthcare services and secure archival and management of your medical records electronically.<br><br>We keep records of your prescription history and it's safe with us.<br><br> For enquiries please call customer support on +2349080045678</div>"
       } else {
           $rootScope.emailData.htmlTemp = "<h3 style='text-align:center'>" 
          + docInfo.patient_firstname + " " + docInfo.patient_lastname + "<br><span style='font-size:14px'>Age: " + docInfo.patient_age 
          + "</span><br> <span style='font-size:14px'> Gender: " + docInfo.patient_gender + "</span></h3> <br><div><br><b>Prescribed By: </b> " + 
           "<span>"+ docInfo.title + " " + docInfo.doctor_firstname + " " + docInfo.doctor_lastname 
          + "<br><br> <b>Date of prescription : </b><span>" + $filter('amCalendar')(docInfo.date) + "</span><br><br>" 
          + "<b>Prescription ID: </b><span>" + docInfo.prescriptionId + "<br><br>"
          + "<span style='color:red'>Info: This prescrition may have been written by <b>Non Professional</b></span><br><br>"
          + "<table><tr><th style='font-size: 14px;padding:2px'>S/N</th><th style='font-size: 14px;padding:5px'>Drug</th><th style='font-size: 14px;padding:5px'>Dosage</th><th style='font-size: 14px;padding:5px'>Frequency</th><th style='font-size: 14px;padding:5px'>Duration</th></tr>" 
          + createItemTable(docInfo.prescription_body) + "</table><br><br>" 
          + "<a href='https://applinic.com' style='text-decoration:none'><img src='https://applinic.com/assets/images/icons/favicon.png' style='width:32px;height:auto'> <b>Applinic</b></a><br>"
          + "<div style='font-size: 14px'>The above prescription(s) was written in www.applinic.com (Online Healthcare Application)." 
          + "<br><br><a href='https://applinic.com/signup' style='text-decoration:none'>Create an account for free </a> and enjoy easy access to healthcare services and secure archival and management of your medical records electronically.<br><br> For enquiries please call customer support on +2349080045678</div>"
      }
      break;

      case "Laboratory":
         $rootScope.emailData.htmlTemp = "<h3 style='text-align:center'>" 
          + docInfo.center_name + "<br><span style='font-size:14px'>" + docInfo.center_address + ", " 
          + docInfo.center_city + ", " + docInfo.center_country
          + "</span><br> <span style='font-size:14px'>" + docInfo.center_phone + "<span><br><span> https://applinic.com/user/profile/view/" + docInfo.center_id
          + "</span></h3>"  + "<br><b>Patient Name: </b><span>" + $rootScope.checkLogIn.title + " " 
          + $rootScope.checkLogIn.firstname + " " + $rootScope.checkLogIn.lastname 
          + "<br></span><b>Patient Age: </b><span>" + $rootScope.checkLogIn.age 
          + "<br></span><b>Gender: </b><span>" + $rootScope.checkLogIn.gender + "</span>"
          + "<br><div><br><b>Referring Physician: </b> " + 
          "<span> " + docInfo.referral_title + " " + docInfo.referral_firstname + " " + docInfo.referral_lastname 
          + "</span><br><br><b>Date Requested : </b><span>" + $filter('amCalendar')(docInfo.sent_date) + "</span><br><br>"       
          + "<span>Doctor Profile URL: </span> " + "https://applinic.com/user/profile/view/" + docInfo.referral_id + "<br><br>"
          + "</span><b>Test Referrence NO: </b><span>" + docInfo.ref_id + "</span><br><br>"
          + "</span><b>Indication: </b><span>" + ((docInfo.indication) ? docInfo.indication : 'N/A') + "</span><br><br>"
          + "<b>Investigation(s) Requested: </b> <br>" 
          + "<ol>" + listInvestigations(docInfo.test_to_run) + "</ol><br><br>"
          + "<b>Result: </b><br>"
          + createReportTests(docInfo.report,'laboratory') + "<br>"
          + "<b>CONCLUSION: </b> <br><span>" + docInfo.conclusion + "<br><br>"
          + "<p>Please view or download attached report in PDF </p><br>"
          + "<a href='https://applinic.com' style='text-decoration:none'><img src='https://applinic.com/assets/images/icons/favicon.png' style='width:32px;height:auto'> <b>Applinic</b></a><br>"
          + "<div style='font-size: 14px'>The above Investigation(s) was written in www.applinic.com (Online Healthcare Application).<br><br><a href='https://applinic.com/signup' style='text-decoration:none'>Create an account for free" +  
          "</a> and enjoy easy access to healthcare services and secure archival and management of your medical records electronically.<br><br> For enquiries please call customer support on +2349080045678</div>"
      break;
      case 'Radiology':
         $rootScope.emailData.htmlTemp = "<h3 style='text-align:center'>" 
          + docInfo.center_name + "<br><span style='font-size:14px'>" + docInfo.center_address + ", " 
          + docInfo.center_city + ", " + docInfo.center_country
          + "</span><br> <span style='font-size:14px'>" + docInfo.center_phone + "<span><br><span> https://applinic.com/user/profile/view/" + docInfo.center_id
          + "</span></h3>"  + "<br><b>Patient Name: </b><span>" + $rootScope.checkLogIn.title + " " 
          + $rootScope.checkLogIn.firstname + " " + $rootScope.checkLogIn.lastname 
          + "<br></span><b>Patient Age: </b><span>" + $rootScope.checkLogIn.age 
          + "<br></span><b>Gender: </b><span>" + $rootScope.checkLogIn.gender + "</span>"
          + "<br><div><br><b>Referring Physician: </b> " + 
          "<span> " + docInfo.referral_title + " " + docInfo.referral_firstname + " " + docInfo.referral_lastname 
          + "</span><br><br><b>Date Requested : </b><span>" + $filter('amCalendar')(docInfo.sent_date) + "</span><br><br>"       
          + "<span>Doctor Profile URL: </span> " + "https://applinic.com/user/profile/view/" + docInfo.referral_id + "<br><br>"
          + "</span><b>Test Referrence NO: </b><span>" + docInfo.ref_id + "</span><br><br>"
          + "</span><b>Indication: </b><span>" + ((docInfo.indication) ? docInfo.indication : 'N/A') + "</span><br><br>"
          + "<b>Investigation(s) requested: </b> <br>" 
          + "<ol>" + listInvestigations(docInfo.test_to_run) + "</ol><br><br>"
          + "<b>FINDINGS: </b><br>"
          + "<span>" + (docInfo.findings || '') + "</span><br><br>"          
          + "<b>CONCLUSION: </b><br><span>" + (docInfo.conclusion || '') + "<br><br>"
          + "<b>ADVISE: </b><br>"
          + "<span>" + (docInfo.advise || "") + "</span><br><br>"
          + "<p>Please view or download attached report below (PDF). </p><br>"
          + "<a href='https://applinic.com' style='text-decoration:none'><img src='https://applinic.com/assets/images/icons/favicon.png' style='width:32px;height:auto'> <b>Applinic</b></a><br>"
          + "<div style='font-size: 14px'>The above Investigation(s) was written in www.applinic.com (Online Healthcare Application).<br><br><a href='https://applinic.com/signup' style='text-decoration:none'>Create an account for free" +  
          "</a> and enjoy easy access to healthcare services and secure archival and management of your medical records electronically.<br><br>We keep records of your radiology history and it's safe with us.<br><br> For enquiries please call customer support on +2349080045678</div>"
      break;
    }

    ModalService.showModal({
      templateUrl: 'email-modal.html',
      controller: "emailModalCtrl"
    }).then(function(modal) {
      modal.element.modal();
      $rootScope.closeModal = modal;
      modal.close.then(function(result) {
        
      });
    });       
  }


  $rootScope.pdfViewer = function(filePath) {
    $rootScope.pdfFilePath = filePath;
    ModalService.showModal({
        templateUrl: 'pdf-viewer.html',
        controller: "pdfViewerCtrl"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
        })
           
    });
  }

  function createItemTable(arr) {
    var str = "";
    arr.forEach(function(item){
      str += "<tr><td style='font-size: 14px;padding:1px'>" + item.sn + "</td>" + "<td style='font-size: 12px;padding:5px'>" + item.drug_name + "</td>" + "<td style='font-size: 14px;padding:5px'>" + item.dosage 
      + "</td>" + "<td style='font-size: 14px;padding:5px'>" + item.frequency + "</td>" + "<td style='font-size: 14px;padding:5px'>" + item.duration + "</td></tr>"
    });
    return str;
  }

  function listInvestigations(arr) {
    var str = ""
    arr.forEach(function(item) {
      str += "<li><b>" + item.name + "</b></li>";
    });
    return str;
  }

  function createReportTests(arr,type) {
   
    if(type == "laboratory")
      var str = "";
      //arr.forEach(function(itemName){  
      for(var j = 0; j < arr.length; j++) { 
        var itemName = arr[j];
        str += "<div style='color: red'>" + itemName.name + ": </div>"  
        + "<table><thead><th style='font-size: 14px;padding:5px'>Name</th><th style='font-size: 14px;padding:5px'>TUM</th><th style='font-size: 14px;padding:5px'>Result</th><th style='font-size: 14px;padding:5px'>Range</th><th style='font-size: 14px;padding:5px'>Units</th><th style='font-size: 14px;padding:5px'>Flag</th></thead>";
        for(var i = 0; i <  itemName.report_sheet.length; i++) {
          var test = itemName.report_sheet[i];
          if(test) {           
            str += "<tbody><td style='font-size: 14px;padding:5px'>" + ((test.r_name) ? test.r_name : "-") + "</td><td style='font-size: 14px;padding:5px'>" + ((test.r_tum) ? test.r_tum : "-")  + "</td><td style='font-size: 14px;padding:5px'>" 
            + ((test.r_result) ? test.r_result : "-") + "</td><td style='font-size: 14px;padding:5px'>" + ((test.r_range) ? test.r_range : "-")  + "</td><td style='font-size: 14px;padding:5px'>" + ((test.r_unit) ? test.r_unit : "-")  + "</td><td style='font-size: 14px;padding:5px'>" + ((test.r_flag) ? test.r_flag : "-") + "</td></tbody>";
          }
        }
        str += "</table><br>"
      }
      //})
     return str;
  }

 

  $rootScope.$on("users presence",function(info,response){
    var on = true;
    var off = false;
    var inView = (localManager.getValue('availablility')) ? localManager.getValue('availablility') : {};
    var invert;
    switch(response.type) {
      case 'patientList':  
        if(response.data) {     
          invert = _.invert(response.sockets);
          response.data.forEach(function(item){
            if(invert[item.patient_id]){
              item.presence = on;

              if(inView.id === item.patient_id)
                $rootScope.patientAvailability = on;            
            } else {
              item.presence = off;

              if(inView.id === item.patient_id)
                $rootScope.patientAvailability = off;
              
            }
          })
        }
      break;

      case 'doctorList':     
        invert = _.invert(response.sockets);
        if(response.data)
          response.data.forEach(function(item){
            if(invert[item.doctor_id]){
              item.presence = on;
              if(inView.id === item.doctor_id)
                $rootScope.dispalyPresence = on;
            } else {
              item.presence = off;
              if(inView.id === item.doctor_id)
                $rootScope.dispalyPresence = off;
            }
          })
      break;
      case 'firstLine':
        invert = _.invert(response.sockets);
        if(response.data)
          response.data.forEach(function(item){
            if(invert[item.user_id])
              item.presence = on;
          });
      break;
      case 'chatList':
        invert = _.invert(response.sockets);
        response.data.forEach(function(item){
          if(invert[item.partnerId]){
            item.status = on;            
          } else {
            item.status = off;
          }
        })
      break;
      case "searchDocList":
        //online presense for doctors search results.
        invert = _.invert(response.sockets);
        response.data.forEach(function(item){
          if(invert[item.user_id]){
            item.status = on;            
          } else {
            item.status = off;
          }
        })
      break;
      case 'patient':
        invert = _.invert(response.sockets);      
        if(invert[response.data.patient_id])
          $rootScope.patientOnlineStatus = on;
        else
          $rootScope.patientOnlineStatus = off;
      break;
      default:
        // online presence for pharmacy and diagnostic enter search results
        var list = response.data.full.concat(response.data.less);
        invert = _.invert(response.sockets);
        list.forEach(function(item){
          if(invert[item.id]){
            item.status = on;            
          } else {
            item.status = off;
          }
        })
      break;
    }
  });

  if($rootScope.checkLogIn.typeOfUser === "Pharmacy" || $rootScope.checkLogIn.typeOfUser === "Laboratory" 
    || $rootScope.checkLogIn.typeOfUser === "Radiology") {
    dynamicService.query(function(data){
     
      if($rootScope.checkLogIn.stock_update){
        if($rootScope.checkLogIn.stock_update.status){
          $rootScope.dynaServices = data;
          ModalService.showModal({
              templateUrl: 'stock-modal.html',
              controller: "stockModalController"
          }).then(function(modal) {
              modal.element.modal();
              modal.close.then(function(result) {
                
              });
          });     
        }
      }
    })
  }


   function getAllconnectedSockets() {
    //gets all connected sockets for every 1 min
    mySocket.emit("check presence",{status: true},function(res){
      $rootScope.sockets = res;
      localManager.setValue("connectedSockets",res)
      $rootScope.$broadcast("users presence",{type: 'chatList',data:$rootScope.chatsList,sockets: res}); 
    })
  }



  $rootScope.loadChats = function() {
    $scope.loading = true;
    var date = + new Date();
    $rootScope.chatsList = chatService.chats();
    $rootScope.chatsList.$promise.then(function(result){
      $scope.loading = false;
      $rootScope.chatsList = result;
      for(var i = 0; i < result.length; i++) {
        if(!result[i].is_read) {
          $scope.showIndicator = true;
        }
      }
      getAllconnectedSockets();
    });
  }

  
  //getAllconnectedSockets();
  
  //gets connected sockets every 30 sec
  $interval(function(){
    getAllconnectedSockets()
  },30000)

  if(localManager.getValue("resolveUser"))
    $rootScope.loadChats();



  //for viewing jnlp dicom weasis viewer as java web start launcher
  $rootScope.opnejnlp = function(link) {
    window.location.href = "jnlp://" + link;
  }

  mySocket.on("received audio call request",function(data){
    var check = confirm("You have audio conversation request from " + data.sender);
    if(check){
      window.location.href = data.connectURL;
    }
  })

}]);

app.controller("pdfViewerCtrl",["$scope","$rootScope","pdfDelegate",
  function($scope,$rootScope,pdfDelegate){
  //console.log(pdfDelegate,$rootScope.pdfFilePath)
  pdfDelegate.$getByHandle('my-pdf-container').zoomIn(0.3);
}])


app.controller("createRoomController",["$scope","localManager","mySocket","$rootScope",
  "templateService","$location",function($scope,localManager,mySocket,$rootScope,templateService,$location){

  var user = localManager.getValue("resolveUser");
  $rootScope.chatStatus = localManager.getValue("hasChat");

  var getCurrentPage = localManager.getValue("currentPageForPatients") || localManager.getValue("currentPage");
  var getHandlerPage = localManager.getValue("holdPageForHandler");


  // this was muted on  26 April 2020. for using the ping users solution below.
  //mySocket.emit('join',{userId: user.user_id});

  //implemented on 26 April 2020. the check and keep users alive in the socket connections incase they are disconnected
  // due to network failure.
  var invert;
  mySocket.on("ping users",function(sockets){
    invert = _.invert(sockets);
    if(!invert[user.user_id]){
      mySocket.emit('join',{userId: user.user_id});
    } 
  })

}]);


//controls online presence icon to show who is online or offline. Note for doctors only ppatients that are online are displayed.
app.controller("presenceSocketController",["$rootScope","$scope","$window","mySocket","localManager",
  "ModalService","templateService","$interval","deviceCheckService",
  function($rootScope,$scope,$window,mySocket,localManager,ModalService,templateService,$interval,deviceCheckService){
   
   var person = localManager.getValue("resolveUser");
   JSON.stringify(window.localStorage.setItem("user",person));// just to save person to local storage;

  function getUsersOnline() {
    if(person.typeOfUser === "Patient"){
      $rootScope.$broadcast("users presence",{type: 'doctorList',data: $rootScope.patientsDoctorList ,sockets: $rootScope.sockets});
    } else if(person.typeOfUser == "Doctor"){
      $rootScope.$broadcast("users presence",{type: 'patientList',data: $rootScope.patientList ,sockets: $rootScope.sockets});
    }
  }



  getUsersOnline();

  if(deviceCheckService.getDeviceType())
    $interval(function(){
      getUsersOnline()
    },30000) // 1 min and some secs

  $scope.user = {};
  // setting user presence online or offline.
  $scope.user.presence = "online";
  $scope.isOnline = true;
  $scope.$watch("user.presence",function(newVal,oldVal){
    if(newVal === "online"){
      online();      
    } else if(newVal === "offline"){
      var warn = confirm("Turning offline you will not be able to receive massages and requests in real time");      
      if(warn){        
       
        offline();        
      } else {
        online();
        $scope.user.presence = "online"
      }
    }
  });

  var online = function(){
    $scope.isOnline = true;
    mySocket.emit("set presence",{status:"online",userId:person.user_id},function(response){
      if(response.status === true){
        mySocket.emit("doctor connect",{userId:person.user_id})
      }
    });
  }

  var offline = function(){
    $scope.isOnline = false;
    mySocket.emit("set presence",{status:"offline",userId:person.user_id},function(response){
      if(response.status === false){
        mySocket.emit("doctor disconnect",{userId:person.user_id})
      }
    });
  }

  $scope.newPatient = function(){
    ModalService.showModal({
        templateUrl: 'patient-emergency-form.html',
        controller: 'newPatientModalController'
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {             
      });
    });
  }

  mySocket.on("new consultation fee",function(data){
    templateService.playAudio(1);
    $rootScope.$broadcast("message notification",{status:true});
    var msg = data.sender 
    + " demands you pay a consultation fee sent to you. Please check your mail in your account and see details.";
    alert(msg);
  });


  /* Audio Call Logic **/

  mySocket.on("receive request audio",function(data){ 
    templateService.playAudio(1);
    
    var decide = confirm(data.message);
    if(decide){
      $rootScope.holdPartner = {
        partnerType: "Doctor",
        partnerId: data.from,
        name: data.name,
        presence: true //data.presence
      };

      ModalService.showModal({
        templateUrl: 'audio-communication-request.html',
        controller: "audioInitController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
      });

    } else {
      var name = person.name || person.title + " " + person.firstname;
      mySocket.emit("call reject",{to: data.from,message: name + " rejected your audio chat request."})
    }

  })

  /***** Video Call Logic ********/
  //takes care of receiver accepting the video call 
  mySocket.on("receive request",function(data){
    templateService.playAudio(1);
    display(data)
  });

  function display(data) {
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
      mySocket.emit("call reject",{to: data.from,message: name + " rejected your video chat request."})
    }
  }


  //for invitation through the video call page
  mySocket.on("receive invitation request",function(data){
    templateService.playAudio(1);
    display1(data)
  });

  function display1(data) {
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
      mySocket.emit("call reject",{to: data.from,message: name + " rejected your video chat request."})
    }
  }

  
  mySocket.on("convserstion denied",function(details){
    alert(details.message);
  })

  //takes care of redirecting to video call page for the call requester After the received had accepted and redirected to its on page.
  mySocket.on("video call able",function(response){
    //localManager.setValue("socket",mySocket);
    templateService.playAudio(4);
    display2(response)
  });

  function display2(response) {
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

}]);


app.controller("audioInitController",["$scope","$window","localManager","mySocket","templateService",
  function($scope,$window,localManager,mySocket,templateService){
    /******** Audio call Logic *******/
  var user = localManager.getValue("resolveUser");
  user.firstname = user.firstname || user.name;

  $scope.docInfo = templateService.holdForSpecificDoc || templateService.holdForSpecificPatient; // <== also used for patient signaling by doctor

  $scope.requestChat = function(userId) {    
    var reqObj = {
      to: userId,
      name: user.firstname,
      title: user.title,
      from: user.user_id,
      presence: $scope.docInfo.presence
    }
    // takes care of the call initator sending audio call request.
    mySocket.emit("convsersation signaling audio",reqObj,function(data){
      alert(data.message);
    })
  }

}]);  
                                



/*app.controller('audioInitController',["$scope","$window","localManager","mySocket","$rootScope","$http",
  function($scope,$window,localManager,mySocket,$rootScope,$http){

    $http.post('/user/audioCallInit',{type:$rootScope.holdPartner.partnerType, userId: $rootScope.holdPartner.partnerId})
    .success(function(response){
      
      var invert = _.invert($rootScope.sockets);      
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
      }
     
    })
      

}])*/


//controller passes data from the page to angular. data from the patient notification box to be used within angular.
app.controller('patientWelcomeController',["$scope",function($scope){

}]);



//display the current balance always
app.controller("balanceController",["$rootScope","$scope","$resource","localManager","mySocket","$timeout",
  "manageRecordAccessService","getBalanceService",
  function($rootScope,$scope,$resource,localManager,mySocket,$timeout,manageRecordAccessService,getBalanceService){  
  var user = localManager.getValue("resolveUser");

  function getBalance() {
    $scope.loading = true;
    var amount = getBalanceService;
    var wallet = amount.get({userId: user.user_id},function(data){
      $scope.loading = false;
      var whole = Math.round(data.balance);
      var format = ($rootScope.checkLogIn.currencyCode) ? $rootScope.checkLogIn.currencyCode +
      whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "NGN " + whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ;
      $rootScope.balance = format;
    })
  } 

  getBalance();


  mySocket.on("fund received",function(data){
    if(data.status) {
      getBalance();
      $rootScope.alertService(3,data.message); 
    }
  })

  $rootScope.$on("debit",function(data,event){
    
    getBalance();
  })


  $scope.supported = false;

  $scope.copy = "";

  $scope.success = function (id) {
    $scope.copy = id + ' Copied!';
    $timeout(function(){
      $scope.copy = "";
    },2000)
  };

  $scope.fail = function (err) {
    console.error('Error!', err);
  };

  var elem = document.getElementById('accessBody'); 
  var elem1 = document.getElementById('accessBody1');
  $scope.getAccess = function(search) {
    if(search) {
      elem1.style.display = "block";
    } else {
      $scope.accLoading = true;
      elem.style.display = "block";
      manageRecordAccessService.query(function(response){
        
        $scope.accLoading = false;
        $scope.accessList = response;
      });
    }
  }

  

  $scope.closeAccDiv = function(se) {
    if(se){
      elem1.style.display = "none";
    } else {
      elem.style.display = "none";
    }
  }

  $scope.updateAccess = function(user,e) {
    
    elem.style.display = "block";

    if(typeof user == "string") {
      var user = {
        userId : "all"
      }

      $scope.allLoading = true;
      user.isAll = true;
    } else {
       user.isAll = false;
    }

    user.loading = true;
    manageRecordAccessService.updateAccess({userId: user.userId},function(res){
        user.loading = false;
        $scope.allLoading = false;
       
        
        if(res.status) {
          if(user.isAll)
            $scope.allMsg = "All access denied"
          user.resMsg = res.message
        }
        //$scope.accessList = res.list
    });
  }

  $scope.changeKey = function() {
    var verify = confirm("Changing your Medical Record Access Key will deny existing users of your medical records access. Do you wish to continue?")

    if(verify) {
      $scope.isLoading = true;
      manageRecordAccessService.changeKey(function(res){
        $scope.isLoading = false;
        alert(res.message)
        $rootScope.checkLogIn.mrak = res.mrak;
        localManager.setValue("resolveUser",$rootScope.checkLogIn);
      })
    }
  }

}]);

//recieves the patients medical record and prescription from the back end.
app.controller("patientPanelController",["$scope","$location","$http","$rootScope","localManager","ModalService",
  "templateService","templateUrlFactory","mySocket","$resource","$window","medicalRecordService",
  function($scope,$location,$http,$rootScope,localManager, ModalService, templateService,templateUrlFactory,
    mySocket,$resource,$window,medicalRecordService){
  templateUrlFactory.setUrl();
  var medical = {};
  
  var records = medicalRecordService; //$resource("/user/get-medical-record");
  function recordFetch() {
    records.get(function(data){   
      var filteredPrescriptions = [];
      var filter = {};
  	  var total = {};
      medical.records = data.medical_records;
      medical.prescriptions = data.prescriptions;  
          
      templateService.holdPrescriptions = medical.prescriptions; 
      var concatName;
      //$scope.totalPrescription = 0;
      var filteredPrescriptions = [];

      for(var j = 0; j < medical.prescriptions.length; j++){        
        if(!filter.hasOwnProperty(medical.prescriptions[j].doctor_id)){                        
          total[medical.prescriptions[j].doctor_id] = medical.prescriptions[j];
          filter[medical.prescriptions[j].doctor_id] = 1;        
                 
        } else {       
          filter[medical.prescriptions[j].doctor_id]++;
        }
      };

      $scope.totalPrescription = medical.prescriptions.length;

      for(var i in filter){
        if(total.hasOwnProperty(i)) {
          var pres = total[i];
          pres.len = filter[i];
          filteredPrescriptions.push(pres);
        }
      }

     
      $rootScope.filteredPrescriptions = filteredPrescriptions;//Object.keys(filter)//filteredPrescriptions;
      //localManager.setValue("holdPrescriptionData",medical.prescriptions);
      checkIsLabPending(data.medical_records.laboratory_test);
      checkIsRadioPending(data.medical_records.radiology_test);
      templateService.holdAllLabTest = data.medical_records.laboratory_test; //hold lab tests for real time view from the notification inbox
      templateService.holdAllRadioTest = data.medical_records.radiology_test; // hholds radio for  real time view from the notification inbox
      $scope.labLen = data.medical_records.laboratory_test.length;
      $scope.radioLen = data.medical_records.radiology_test.length; 
    }); 

  }

  recordFetch();

  $rootScope.$on("fetRecord",function(e,status){
    recordFetch();
  })
  

  $scope.dashboardhome = function () {
    $location.path("/patient-dashboard");
  }

  $scope.viewTreatment = function (id) {
    if(id === undefined) {
      templateService.holdMedicalRecord = medical.records;
      $location.path('/medical-record');
    } else {
      var foundRecord = [];
      medical.records.forEach(function(record){
        if(id === record.patient_id) {
          foundRecord.push(record);
          return;          
        }
      });
      templateService.holdMedicalRecord = foundRecord;
      $location.path("/medical-record");
    }
  }  

  $scope.viewPrescription = function (id) {
    $("#app").removeClass("sidebar-open");
    if(id === undefined){
      templateService.holdPrescriptions = medical.prescriptions;
      localManager.setValue("holdPrescriptions",medical.prescriptions);
      localManager.setValue("currentPageForPatients","/patient-prescriptions");  
      $location.path("/patient-prescriptions");
    } else {
      var foundRecord = [];
      var toStr = id.toString();     
      medical.prescriptions.forEach(function(record){
        if(toStr === record.doctor_id) {          
          foundRecord.push(record);       
        }
      });
      templateService.holdPrescriptions = foundRecord;
      localManager.setValue("holdPrescriptions",foundRecord);
      localManager.setValue("currentPageForPatients","/patient-prescriptions/" + id);   
      $location.path("/patient-prescriptions/" + id);
    }
   
  }

  $scope.viewLabTest = function () {
     $("#app").removeClass("sidebar-open");
    localManager.setValue("currentPageForPatients","/patient/laboratory-test");   
    if($rootScope.singleView){
      $rootScope.isViewSingle = false; //prevents single view;
      $rootScope.singleView = [];
    }
    $location.path("/patient/laboratory-test");
  }

  $scope.viewScanTest = function () {
    $("#app").removeClass("sidebar-open");
    localManager.setValue("currentPageForPatients","/patient/radiology-test");
    if($rootScope.singleView){
      $rootScope.isViewSingle = false; //prevents single view;
      $rootScope.singleView = [];
    }
    $location.path("/patient/radiology-test");
  }

  //view prescription from the doc pallet and from footer slider
  $rootScope.viewPrescription2 = function(type,docId){
    $http.get('/user/get-medical-record',{params: {id: docId, type: type,field:'pharmacy'}})
    .success(function(response){
      //console.log(response)
      var url = (docId) ? ("/patient-prescriptions/" + docId) : "/patient-prescriptions";
      templateService.holdPrescriptions = response;
      localManager.setValue("holdPrescriptions",response);
      localManager.setValue("currentPageForPatients",url);   
      $location.path(url);
    })
  }

   //view lab and radio tests from the doc pallet and from footer slider
  $rootScope.viewLabTest2 = function(type,docId,field){
    $http.get('/user/get-medical-record',{params: {id: docId, type: type,field:'laboratory'}})
    .success(function(response){
      //console.log(response)
      var url = (docId) ? ("/patient/laboratory-test/" + docId) : "/patient/laboratory-test";
      //templateService.holdPrescriptions = response;
      //localManager.setValue("holdPrescriptions",response);
      //localManager.setValue("currentPageForPatients",url);
      $rootScope.labTest = response; 
      $location.path(url);
    })
  }

  //view lab and radio tests from the doc pallet and from footer slider
  $rootScope.viewRadioTest2 = function(type,docId,field){
    $http.get('/user/get-medical-record',{params: {id: docId, type: type,field:'radiology'}})
    .success(function(response){
      //console.log(response)
      var url = (docId) ? ("/patient/radiology-test/" + docId) : "/patient/radiology-test";
      //templateService.holdPrescriptions = response;
      //localManager.setValue("holdPrescriptions",response);
      //localManager.setValue("currentPageForPatients",url);
      $rootScope.labTest = response; 
      $location.path(url);
    })
  }

  //pending tests
  var checkIsLabPending = function (list) {
    var pendingLab = 0;  
    $scope.receivedLab = 0;    
    for(var test = 0; test < list.length; test++) {
      if(list[test].conclusion === "Pending" || list[test].report === "Pending") {
        pendingLab++;
      } else {
        $scope.receivedLab++;
      }
    }
    
    $scope.isLabP = true;
    $scope.labLenPending = pendingLab;//pendingLab.length;
    templateService.pendingLab = list;
    
  }

  var checkIsRadioPending = function (list) {
    var pendingScan = 0; 
    $scope.receivedRadio = 0     
    for(var test = 0; test < list.length; test++) {
      if(list[test].conclusion === "Pending" || list[test].report === "Pending") {
        pendingScan++;
      } else {
        $scope.receivedRadio++;
      }
    }
    
    $scope.isScanP = true;
    $scope.scanLenPending = pendingScan; //pendingScan.length;
    templateService.pendingScan = list;
    
  }

  $scope.viewLabPending = function () {   
     $("#app").removeClass("sidebar-open");
    if($rootScope.singleView){
      $rootScope.isViewSingle = false; //prevents single view;
      $rootScope.singleView = [];
    }
    $location.path("/pending/lab-test")
  }

  $scope.viewRadioPending = function () {
    $("#app").removeClass("sidebar-open");
    if($rootScope.singleView){
      $rootScope.isViewSingle = false; //prevents single view;
      $rootScope.singleView = [];
    }
    $location.path("/pending/scan-test")
  }



  /*
    Family account logic 
  */
  
  $scope.switchAccount = function(account) {
    $("#app").removeClass("sidebar-open");
     var count = {};
     count.val = 0;
     ModalService.showModal({
          templateUrl: 'account-switch-modal.html',
          controller: "accoundLoaderConTroller"
      }).then(function(modal) {
          accSwitcher();
          modal.element.modal();
          modal.close.then(function(result) {
          })
             
      });
    
    function accSwitcher() {
      var activeAcc = localManager.getValue("activeAccountId") || $rootScope.checkLogIn.user_id;
      var url = (account.main) ? "/user/family-normal/" + activeAcc + "/" + account.memberId : "/user/family-switch/" + activeAcc + "/" + account.memberId
      $http({
        method  : 'GET',
        url     : url,        
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        count.val++;
        $rootScope.newUserName = account.name
        if(data.status && data.isLoggedIn) {
          localManager.setValue("activeAccountId",account.memberId); //use to switch from main account to newUser         
          localManager.setValue("resolveUser",data);
          setValue(function(){
            $window.location.href = "/user/patient";
          });          
          //$rootScope.checkLogIn = data;         
        } else {
          if(count.val < 4) {
            accSwitcher(account);
          } else {
            alert("Error: Account switch could not be completed! Please try again later")
          }
        }
       
      });
    }


    function setValue(cb) {
      cb()
    }


  }

}]);

//this controller handles patient's doctors on the right corner of the patient profile page. it locates each doctors details when clicked.
//note this controller is used both by doctors dashboard and patient dashboard.
app.controller("checkingOutDoctorPatientController",["$scope","$location","$rootScope","$http","ModalService",
  "$interval","templateService","localManager","mySocket","$interval","chatService","deviceCheckService","profileDataService",
function($scope,$location,$rootScope,$http,ModalService,$interval,templateService,
  localManager,mySocket,$interval,chatService,deviceCheckService,profileDataService){
  function getList(url,type) {
     $http({
      method  : 'GET',
      url     : url, 
      headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
      if(type === "patient") {        
        $rootScope.patientsDoctorList = data;        
        getDoctorsRealTime($rootScope.patientsDoctorList);

        $interval(function(){
          getDoctorsRealTime($rootScope.patientsDoctorList); 
        },30000) // less 1 min

      } else if(type === "doctor"){       
        $rootScope.patientList = data;       
        getPatientsRealTime($rootScope.patientList);
        setAppointment($rootScope.patientList)

        $interval(function(){
          getPatientsRealTime($rootScope.patientList) 
        },30000) //less 1 min
      }

    });
  }

  function getDoctorsRealTime(list) {   
    mySocket.emit("check presence",{status: true},function(res){
      $rootScope.$broadcast("users presence",{type: 'doctorList',data: list,sockets: res});         
    })
             
  }

  function getPatientsRealTime(list) {
    mySocket.emit("check presence",{status: true},function(res){
      $rootScope.$broadcast("users presence",{type: 'patientList',data: list,sockets: res});
    });       
    
  }


  $scope.filter = {}

  localManager.setValue("hasChat",true);

  var user = localManager.getValue("resolveUser");

  if(user.typeOfUser === "Patient") {
   //$interval(getAtInterval,300000)
    getList("/user/patient/get-my-doctors","patient");
    $scope.userDoctor = function(id,status){
      var callerId = templateService.holdPatientIdForCommunication;
      localManager.setValue("availablility",{
        id:id,
        status: status
      });
      $rootScope.dispalyPresence = status;
      localManager.setValue("receiver",id);
      localManager.setValue('caller',callerId); 
      templateService.holdIdForSpecificDoc = id;      
      var page = "/patient-doctor/treatment/" + id;
      localManager.setValue("holdPageForHandler",page);
      localManager.setValue("currentPageForPatients",page);
      $location.path(page);
      mySocket.removeAllListeners("new_msg");

     $("#app").removeClass("sidebar-open");

      //remove queue of received messages if any
      var elemPos = $rootScope.patientsDoctorList.map(function(x){return x.doctor_id}).indexOf(id);
      if(elemPos !== -1 && $rootScope.patientsDoctorList[elemPos].hasOwnProperty("queueLen"))
        $rootScope.patientsDoctorList[elemPos].queueLen = 0;
    }

  } else if(user.typeOfUser === "Doctor") {

    getList("/user/doctor/my-online-patients","doctor");
    $scope.userPatient = function(id,status){
      $("#app").removeClass("sidebar-open");
      localManager.setValue("availablility",{
        id:id,
        status: status
      });
      $rootScope.patientAvailability = status;
      var callerId = templateService.holdDoctorIdForCommunication;
      localManager.setValue("receiver",id);
      localManager.setValue('caller',callerId);    
      templateService.holdIdForSpecificPatient = id;
      var page = "/doctor-patient/treatment/" + id;
      localManager.setValue("holdPageForHandler",page);
      localManager.setValue("currentPage",page);
      $location.path(page);
      mySocket.removeAllListeners("new_msg");

      mySocket.on("acceptance notification",function(data){
        data.type = "acceptance notification";
        templateService.playAudio(1);
        $rootScope.sender = data;
        $scope.isReceivedRequest = true;
        $timeout(function(){
          $scope.isReceivedRequest = false;
        },10000);
        $rootScope.$broadcast('get notification',{status: true});
        getList("/user/doctor/my-online-patients","doctor");
      });

      //remove queue of received messages if any
      var elemPos = $rootScope.patientList.map(function(x){return x.patient_id}).indexOf(id);
      if(elemPos !== -1 && $rootScope.patientList[elemPos].hasOwnProperty("queueLen"))
        $rootScope.patientList[elemPos].queueLen = 0;
    }
  }

  mySocket.on("remove in list",function(data) {
    if($rootScope.patientsDoctorList) {
      var pos = $rootScope.patientsDoctorList.map(function(x){return x.doctor_id}).indexOf(data.doctorId);
      if($rootScope.patientsDoctorList[pos]){
        $rootScope.patientsDoctorList.splice(pos,1)
      }
    }
  })


  
  function setAppointment(list) {
    var elm;
    if($rootScope.appointmentList)
      list.forEach(function(patient){
        elm = $rootScope.appointmentList.map(function(x){return x.patient_id}).indexOf(patient.patient_id);
        if(elm !== -1){
          patient.appointment_date = $rootScope.appointmentList[elm].date;
          patient.appointment_time = $rootScope.appointmentList[elm].time;
        }
      })
  }


  $scope.removePatient = function(patient){
    var message = "You want to remove "  
    + patient.patient_lastname + " " + patient.patient_firstname + " from your management list";

    var check = confirm(message)

    if(check) {
      patient.isLoading = true;
      $http({
        method  : 'PUT',
        data    : {patientId: patient.patient_id},
        url     : "/user/doctor/my-patients", 
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data) {
        alert(data.message)
        if(data.status) {
          var elemPos = $rootScope.patientList.map(function(x){return x.patient_id}).indexOf(patient.patient_id);
          if(elemPos !== -1) {
            $rootScope.patientList.splice(elemPos,1)
          }
        }
        patient.isLoading = false;
      });
    }
  }

  $scope.popup = function(patient){
    $rootScope.patientList.forEach(function(item){
      if(item.isManage)
        item.isManage = false
    })
    patient.isManage = true;
  }

  $scope.closePop = function(patient){
    patient.isManage = false;
  }

  $scope.consultationFee = function(patient){  
    $rootScope.data = {
      sender_firstname: patient.patient_firstname,
      sender_lastname: patient.patient_lastname,
      sender_id: patient.patient_id
    };
    //$scope.docName = templateService.getfirstname;

    ModalService.showModal({
        templateUrl: 'consultation-fee.html',
        controller: "consultationFeePaymentctrl"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
      });
    });
   
  }

  $scope.appointments = function(patient){
     $rootScope.patientForAppointmentDetails = patient;
     ModalService.showModal({
        templateUrl: 'appointment-modal.html',
        controller: "selectedAppointmentModalCtrl"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {            
      });
    });
  }

  $scope.refresh = function() {
    ptApp()
  }


  $scope.viewChat2 = function(patientId) { 
    var messageBody = "Hello!";
    var partnerId = patientId;
    $scope.loading = true;

    var msgObj = {to: partnerId,message:messageBody,from: $rootScope.checkLogIn.user_id};

    mySocket.emit("send message general",msgObj,
      function(data){ 
      //var list = $rootScope.chatsList;

      $rootScope.chatsList = chatService.chats();
      $rootScope.chatsList.$promise.then(function(result){

        $scope.loading = false;

        $rootScope.chatsList = result;

        //var byRecent = $filter('orderBy')($rootScope.chatsList,'-realTime');
        templateService.holdId = partnerId;//byRecent[0].partnerId;   
        if(deviceCheckService.getDeviceType()){
          localManager.setValue("holdIdForChat",partnerId);
          localManager.setValue("holdChatList",$rootScope.chatsList);
          window.location.href = "/user/chat/general";
        } else if(templateService.holdId) {
          $location.path("/general-chat");
        } 
      });
    });
  }


  $scope.videoChat = function(patientObj) {
    var source = profileDataService;   
    var presence = patientObj.presence || patientObj.status;
    source.get({userId: patientObj.patient_id},function(data) {
      data.type = 'Video Call';
      data.presence = presence;
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
  }

  $scope.referToAnother = function(p){
    var source = profileDataService; 
    $scope.isRefloading = true;   
    source.get({userId: p.patient_id },function(patient) {
      $rootScope.data = {
        date: + new Date(),
        message_id: Math.floor(Math.random() * 99999999),
        sender_age: patient.age,
        sender_firstname: patient.firstname,
        sender_gender: patient.gender,
        sender_id: patient.user_id,
        sender_phone: patient.phone,
        sender_email: patient.email,
        sender_lastname: patient.lastname,
        sender_location: patient.city + " " +  patient.country,
        sender_profile_pic_url: patient.patient_profile_pic_url,
        sender_title: patient.title,
        type: "consultation",
        isLaterRef: "yes"
      }  
      $scope.isRefloading = false;
      ModalService.showModal({
          templateUrl: 'redirect-request.html',
          controller: "referRequestController"
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {               
        });
      });
    })
  }

  
  function ptApp() {
    if($rootScope.appointmentList);
      $rootScope.appointmentList.forEach(function(p){
        //if(!checkDueAppointment(p.date,p.time)){
          var ptPos = $rootScope.patientList.map(function(x){return x.patient_id}).indexOf(p.patient_id)
          if($rootScope.patientList[ptPos]){
            $rootScope.patientList[ptPos].isNewAppointment = true;
            if(checkDueAppointment(p.date,p.time))
              $rootScope.patientList[ptPos].appDate = checkDueAppointment(p.date,p.time);
          }
        //} 
      })
  }

  var d,
      t,
      hr,
      stMin;

  function checkDueAppointment(dt,time) {
    d = new Date(dt)
    t = new Date(time);    
    hr = d.getHours() + t.getHours();
    stMin = d.getMinutes() + t.getMinutes();;
    d.setHours(hr);
    d.setMinutes(stMin)
    return checkIsInTime(d);//moment().isBefore(moment(d).subtract(0, 'hours'));
  }

  function checkIsInTime(d) {
    var time = moment().isBefore(moment(d).subtract(0, 'hours'))
    return (time) ? d : null;
  }

  setTimeout(function(){
    ptApp()
  },3000)
  
}]);

//runs first when patient first logged in
app.controller("inPatientDashboardController",["$scope","$location","templateService","localManager","ModalService",
  function($scope,$location,templateService,localManager,ModalService){

 if(localManager.getValue("resolveUser")) {
    $location.path(localManager.getValue("currentPageForPatients") || "/my-doctors");
  } 

}]); 

app.controller('loginController',["$scope","$http","$location","$window","$resource",
  "ModalService","templateService","localManager","userLoginService","changPasswordService","phoneCallService","$timeout",
  "$rootScope","mySocket",function($scope,$http,$location,$window,$resource,ModalService,
    templateService,localManager,userLoginService,changPasswordService,phoneCallService,$timeout,$rootScope,mySocket) {
  $scope.login = {};
  $scope.error = "";  
  var count = 0
  
  $scope.send = function(){ 
    if(count <= 10) { 
      $scope.loading = true;
      $scope.error = ""; 
      var login = userLoginService; //$resource('/user/login',null,{logPerson:{method:"POST"}});

      destroyStorage()

      login.logPerson($scope.login,function(data){   

      if (data.isLoggedIn) {  

          localManager.setValue("resolveUser",data);  

          //use to keep track of main user should sub accounts were used in a session. 
          /*if(data.typeOfUser === "Patient")
            localManager.setValue("mainAccount",data);  */  

         //user joins a room in socket.io and intantiayes his own socket
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
          
        } else {   
          $scope.loading = false;      
          $scope.error = "Email or Password incorrect!"; 
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
    localManager.removeItem("partnerDetails");
  }
  
}]);

//conroller id found inside a modal when user finally complete sending request to a doctor. it builds request object to be sent
app.controller("connectController",["$scope","$location","$http","localManager","templateService",
  function($scope,$location,$http,localManager,templateService){
  
   //code moved to bookingModalController for better UX.
}]);

//in the alerted modal check to see if the patient has enough fund in the wallet before continueing with the transaction.
//gets the patients wallent anount and cpmpares with the doctor's consultation fee billed.
app.controller("insuficientFundController",["$scope","$location","ModalService","requestManager","templateService",function($scope,$location,ModalService,requestManager,templateService){
  $scope.consultationFee = templateService.holdfee;
  $scope.walletAmount = templateService.holdwalletAmount;
}]);

app.controller('infoController',["$scope",function($scope){

}]);

app.controller("bookingDocController",["$scope","templateService","$http","$rootScope",
  "localManager","symptomsFactory","patientfindDoctorService",
  function($scope,templateService,$http,$rootScope,localManager,symptomsFactory,patientfindDoctorService){
  $scope.docInfo = templateService.holdForSpecificDoc;
  $scope.isViewDoc = true;

  $scope.patient = {};
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
  //$scope.isComplaint = true;
  $scope.isSearchToSend = true;
 

  $scope.back = function() {
    $scope.isSearchToSend = true;
    $scope.isComplaint = false;
  }

  $scope.continue = function(doc) {
    $scope.docInfo = doc;
    $scope.isSearchToSend = false;
    $scope.isComplaint = true;
   // if(!$rootScope.doctorList)
   //   $scope.find();
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

  if(!$rootScope.doctorList)
      $scope.find();

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
      //$scope.docInfo = doc;
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
      $scope.docInfo.loading = false;
      $scope.docInfo.isSent = true;
      alert("Consultation request sent! The doctor will be notified. Please contact us if you did not receive any response from the doctor within 12 hours")
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
  var a = angular.element(document.getElementById('player2'));
  var b = angular.element(document.getElementById('capture2'));
  var c = angular.element(document.getElementById('canvasArea2'));
  var player = a[0]; //document.getElementById('player2');
  var captureButton = b[0]; //document.getElementById('capture2');
  var canvasArea = c[0]; //document.getElementById('canvasArea2');
  

  captureButton.hasEvent = false;
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

app.controller("searchTestController",["$scope","$location","$window","templateService","localManager","labTests",
  "searchtestservice","cities","templateUrlFactory","$resource","$rootScope","dynamicService",
function($scope,$location,$window,templateService,localManager,labTests,searchtestservice,cities,
  templateUrlFactory,$resource,$rootScope,dynamicService){
  var allTests = labTests.listInfo.concat(labTests.listInfo1,labTests.listInfo2,labTests.listInfo3,labTests.listInfo4,
    labTests.listInfo5,labTests.listInfo6,labTests.listInfo7);

  templateUrlFactory.setUrl();
  var list = [{sn:'a'}];
  var testName;
  var thisCity;

  $scope.getTest = function(name){
    testName = name;
  }

  $scope.getCity = function(city){
    thisCity = city;
  } 

  $scope.type = "Laboratory";

  $scope.city = $rootScope.checkLogIn.city;

  var resource = dynamicService //$resource("/user/dynamic-service");
  resource.query({type:"Laboratory"},function(data){
    $scope.tests = allTests.concat(data);
  });

  $scope.testList = list;

  $scope.cities = cities;
    
  $scope.tests = allTests;

  $scope.add = function(){
    if(testName !== "" && testName !== undefined) {   
      if(!/^[A-Z]/.test( testName))
        testName = toTitleCase(testName);
      var elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName);
      objFound = $scope.tests[elementPos];
      if( elementPos === -1) {
            alert("There is no test match based on your search criteria. Make sure you entered the test name correctly.")
      } else {
        if(!list[0].name) {      
          list[0].name = objFound.name;
          list[0].id = objFound.id;      
        }
        var random = Math.floor(Math.random() * 1000);
        var obj = {};
        obj.sn = random;
        obj.name = objFound.name;
        obj.id = objFound.id;
        list.push(obj);       
      }
    } else {
      alert('Please enter test name')
    }

  }

  $scope.remove = function(id){    
    if(list.length > 1){
      var elementPos = list.map(function(x){return x.sn}).indexOf(id)
      var objfound = list.splice(elementPos,1);
    }
  }

  $scope.findTest = function(){
    var sendObj = {};
    $scope.loading = true;
    sendObj.city = thisCity;
     if(thisCity !== undefined && !/^[A-Z]/.test(thisCity))
         sendObj.city = toTitleCase(thisCity);  
    if(list.length === 1) {
      if(testName !== undefined && testName !== "") {        
      var elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName)
      objFound = $scope.tests[elementPos];
      if( elementPos === -1) {
        alert("There is no test match based on your search criteria. Make sure you entered the test name correctly.");
        $scope.loading = false;
      } else {
      list[0].name = objFound.name;
      list[0].id = objFound.id;
      sendObj.testList = list;
      templateService.holdList = sendObj.testList;
      send(sendObj)
      }
      } else {
        alert("Please enter the test name");
        $scope.loading = false;
      }
    } else {
      var elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName);
      objFound = $scope.tests[elementPos];
      list[0].name = objFound.name;
      list[0].id = objFound.id;      
      sendObj.testList = list;
      templateService.holdList = sendObj.testList;
      send(sendObj)
    }
    
    templateService.holdLaboratoryReferralData= {};   
  }

  $scope.notRef = true;
  $scope.search = {};
  $scope.user = {};
  $scope.search.category = "";

  $scope.findWithRef = function(Id){
    var sendObj = {};
    
    sendObj.testList = [];
    sendObj.city = thisCity;
     if(thisCity !== undefined && !/^[A-Z]/.test(thisCity))
         sendObj.city = toTitleCase(thisCity);      
    var toNum = parseInt(Id);
    var allTest = localManager.getValue("holdLabData");
    if(!allTest) {
      alert("Reference number not found!. This may occur if you are not a patient.");
      return;
    } 

    var elementPos = allTest.map(function(x){if(x !== undefined){return x.ref_id}}).indexOf(toNum);
    var objFound = allTest[elementPos];
    if( elementPos !== -1) {
      var objList = objFound.test_to_run;
      for(var i = 0; i < objList.length; i++) {
        var elemPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(objList[i].name);
        if(elemPos !== -1) {
          var found = $scope.tests[elemPos];
          sendObj.testList.push(found);          
        } else {
          alert('Test not found!');
          $scope.loading = false;
          return;
        }

      }
     
      templateService.holdLaboratoryReferralData = objFound;
      $scope.loading = true;
      send(sendObj);
    } else {
      alert("Test not found!")
    }

  }

  $scope.$watch("search.category",function(newVal,oldVal){
    if(newVal === "Reference number") {
      $scope.isRef = true;
      $scope.notRef = false;
    } else {
      $scope.isRef = false;
      $scope.notRef = true;
    }
  })

  function toTitleCase(str)
  {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  function send(data){
    $rootScope.isLoading = true;
    $rootScope.genRefId = parseInt(Math.floor(Math.random() * 9999) + "" + Math.floor(Math.random() * 9999));
    searchtestservice.find(data,"/user/laboratory/search/find-tests","/laboratory/test-search/result")
  }

}]);

app.controller("searchScanController",["$scope","$location","$window","templateService","localManager",
  "scanTests","searchtestservice","cities","templateUrlFactory","$resource","$rootScope","dynamicService",
function($scope,$location,$window,templateService,localManager,scanTests,
  searchtestservice,cities,templateUrlFactory,$resource,$rootScope,dynamicService){
  var allTests = scanTests.listInfo1.concat(scanTests.listInfo2,scanTests.listInfo3,scanTests.listInfo4,scanTests.listInfo5,
  scanTests.listInfo6);

  templateUrlFactory.setUrl();
  var list = [{sn:'a'}];
  var testName;
  var thisCity;

  $scope.getTest = function(name){
    testName = name;
  }

  $scope.getCity = function(city){
    thisCity = city;
  } 

  $scope.type = "Radiology";

  $scope.city = $rootScope.checkLogIn.city;

  var resource = dynamicService //$resource("/user/dynamic-service",null,{createService:{"method": "POST"}});
  resource.query({type:"Radiology"},function(data){
    $scope.tests = allTests.concat(data);
  });


  $scope.testList = list;

  $scope.cities = cities;
    
  $scope.tests = allTests;

   $scope.add = function(){
    if(testName !== "" && testName !== undefined) {   
      if(!/^[A-Z]/.test( testName))
        testName = toTitleCase(testName);
      var elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName)
      objFound = $scope.tests[elementPos];
      if( elementPos === -1) {
            alert("There is no test match based on your search criteria. Make sure you entered the test name correctly.")
      } else {
        if(!list[0].name) {      
          list[0].name = objFound.name;
          list[0].id = objFound.id;      
        }
        var random = Math.floor(Math.random() * 1000);
        var obj = {};
        obj.sn = random;
        obj.name = objFound.name;
        obj.id = objFound.id;
        list.push(obj);       
      }
    } else {
      alert('Please enter test name')
    }

  }

  $scope.remove = function(id){    
    if(list.length > 1){
      var elementPos = list.map(function(x){return x.sn}).indexOf(id)
      var objfound = list.splice(elementPos,1);
    }
  }

  $scope.findTest = function(){
    var sendObj = {}
    sendObj.city = thisCity;
     if(thisCity !== undefined && !/^[A-Z]/.test(thisCity))
         sendObj.city = toTitleCase(thisCity);  
    if(list.length === 1) {
      if(testName !== undefined && testName !== "") {
      if(!/^[A-Z]/.test( testName))
         testName = toTitleCase(testName);     
      var elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName)
      objFound = $scope.tests[elementPos];
      if( elementPos === -1) {
        alert("There is no test match based on your search criteria. Make sure you entered the test name correctly.")
      } else {
      list[0].name = objFound.name;
      list[0].id = objFound.id;
      sendObj.testList = list;
      templateService.holdList = sendObj.testList;
      send(sendObj)
      }
      } else {
        alert("Please enter the test name")
      }
    } else {
      var elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName)
      objFound = $scope.tests[elementPos];
      list[0].name = objFound.name;
      list[0].id = objFound.id;      
      sendObj.testList = list;
      templateService.holdList = sendObj.testList;
      send(sendObj)
    }
    templateService.holdLaboratoryReferralData= {};   
  }

  $scope.notRef = true;
  $scope.search = {};
  $scope.user = {};
  $scope.search.category = "";

  $scope.findWithRef = function(Id){
    var sendObj = {};
    sendObj.testList = [];
    sendObj.city = thisCity;
     if(thisCity !== undefined && !/^[A-Z]/.test(thisCity))
         sendObj.city = toTitleCase(thisCity);      
    var toNum = parseInt(Id);
    var allTest = localManager.getValue("holdScanData");
    var elementPos = allTest.map(function(x){if(x !== undefined){return x.ref_id}}).indexOf(toNum);
    var objFound = allTest[elementPos];
    if( elementPos !== -1) {
      var objList = objFound.test_to_run;
      for(var i = 0; i < objList.length; i++) {
        var elemPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(objList[i].name);
        if(elemPos !== -1) {
          var found = $scope.tests[elemPos];
          sendObj.testList.push(found);          
        } else {
          alert('Test not found!');
          return;
        }

      }
      templateService.holdLaboratoryReferralData = objFound;
      send(sendObj);
    } else {
      alert("Test not found!")
    }

  }

  $scope.$watch("search.category",function(newVal,oldVal){
    if(newVal === "Reference number") {
      $scope.isRef = true;
      $scope.notRef = false;
    } else {
      $scope.isRef = false;
      $scope.notRef = true;
    }
  })

  function toTitleCase(str)
  {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  function send(data){
    $rootScope.isLoading = true;
    $rootScope.genRefId = parseInt(Math.floor(Math.random() * 9999) + "" + Math.floor(Math.random() * 9999));
    searchtestservice.find(data,"/user/radiology/search/find-tests","/radiology/scan-search/result")
  }

}]);



app.controller("PatientViewResponseModalController",["$scope","$rootScope","$location","ModalService",
  "templateService","walletService","paymentVerificationService","consultationAccptanceService","getMyDoctorService","phoneCallService",
  function($scope,$rootScope,$location,ModalService,templateService,walletService,
    paymentVerificationService,consultationAccptanceService,getMyDoctorService,phoneCallService){

  $scope.docInfo = $rootScope.holdDocInView;
  $scope.isViewDoc = true;
  $scope.isOTP = false;
  var User = paymentVerificationService; //walletService.resource("/user/payment/verification",{userId: null},{verify:{method:'POST'}});
  $scope.accept = function(){
    $scope.isViewDoc = false;
    $scope.isToConfirm = true;
  }

  $rootScope.sendAcceptanceVerification = function(time,phoneCall){ //this function is all availabe on wallet controller
    $scope.msg = "";
    var timeStamp = + new Date();
    /*if(templateService.holdDocInView);
    templateService.sendObj = {
      user_id: $scope.docInfo.user_id,
      date_of_acceptance : timeStamp,
      firstname: $scope.docInfo.name,
      lastname: $scope.docInfo.lastname,
      profile_pic_url: $scope.docInfo.profile_pic_url,
      specialty: $scope.docInfo.specialty,
      compaintId: templateService.holdData.complaint_id
    }*/

     
    $rootScope.resend = timeStamp //time stamp use to check resend for an otp. this will find the previously sent otp and delete.
    var payObj = {
      amount: $scope.docInfo.fee,
      time: timeStamp,
      old_time: time
    }

    var count = 0;
    if(phoneCall) {
      count++;
      if(count < 5) {
        phoneCallService(payObj,'/user/payment/verification','POST') // "/user/payment/verification",{userId: null},{verify:{method:'POST'}}); 
        $scope.showCallingMsg = "You'll receive a phone call in just a moment. Please enter the pin you hear from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }
    } else {
      $scope.loading = true;
      var send = User.verify(payObj,function(data){
        $scope.loading = false;
        $scope.msg = data.message;
        if(data.success){
          //$location.path("/user-otp");
          $scope.isOTP = true;
        }
      });
    }
  }

  $scope.call = function(oldTime){
    $rootScope.sendAcceptanceVerification(oldTime,'isCall')
  }

  $scope.pay = {};


  $scope.confirmAcceptance = function() {
    if($scope.pay.acceptanceOtp) {
      $scope.loading = true;
      var resource = consultationAccptanceService;

      var date = + new Date();
      var pin = $scope.pay.acceptanceOtp;
      var str = "";
      var count = 0;
      for(var i = 0; i < pin.length; i++){
          count++;      
          if(count % 3 === 0) {
            str += pin[i];
            str += " ";
          } else {
            str += pin[i];
          }
       }

      var newStr = str.replace(/\s*$/,"");//removes empty string by the end of character
      //var receiver = templateService.sendObj.user_id || templateService.sendObj.receiverId;

      var payObj = {
        amount: $scope.docInfo.fee,
        otp: newStr,
        date: date,
        message: "Consultation fee",
        userId: $scope.docInfo.doctor_user_id,
        sendObj: {
          doctor_id: $scope.docInfo.doctor_user_id,
          date_of_acceptance: $scope.docInfo.date,
          doctor_firstname: $scope.docInfo.doctor_name,
          doctor_lastname:  $scope.docInfo.lastname,
          doctor_name: $scope.docInfo.doctor_name,
          doctor_profile_pic_url: $scope.docInfo.doctor_profile_pic_url,
          service_access: true,
          doctor_specialty: $scope.docInfo.doctor_specialty,
          compaintId: templateService.holdData.complaint_id,
          user_id: $scope.docInfo.doctor_user_id,
          original_complaint: templateService.holdData.description,
          original_complaint_date: templateService.holdData.sent_date,
          files: templateService.holdData.files || templateService.holdData.file
        }
      }

      $scope.loading = true;
      var confirmed = resource.confirmed(payObj,function(data){
        $scope.loading = false;
        $scope.msg = data.message;
        if(data.balance) {
          //$rootScope.balance = "NGN " + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
          $rootScope.$broadcast('debit',{status: true})         
          if($rootScope.msgLen > 0)
            $rootScope.msgLen--;
          //$location.path(templateService.holdCurrentPage);
          
          getMyDoctorService.query(null,function(data){   
                    
            $rootScope.patientsDoctorList = data;
          });
          $rootScope.holdDocInView.hasComplete = "Consultation accepted!";
        }
      });

    } else {
      $scope.msg = "Please enter otp sent to the number below."
    }

  }

}]);

app.controller("skillModalController",["$scope","$rootScope","localManager",function($scope,$rootScope,localManager){

}]);


app.controller("referToMeModalController",["$scope","$rootScope","$http",function($scope,$rootScope,$http){
  $scope.patient = {};
  $scope.patient.type =  "consultation";
  
  $scope.doc = $rootScope.userSkill;

  $scope.send = function(){
   
    if($rootScope.checkLogIn.typeOfUser !== "Patient" && !$scope.patient.phone && typeof $scope.patient.phone !== 'number') {
      alert("Patient number is needed!");
      return;
    }
    var url = "/user/skill-referral/" + $scope.doc.user_id;
    $http({
      method  : 'PUT',
      url     : url, //refer to doctor someone for treatment
      data : $scope.patient,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {            
       alert(data.status)
       //$scope.result = data.status;
    });
  }

}]);


//for chats in modal and centers dashboard use for 
app.controller("generalChatController",["$scope","$rootScope", "mySocket","chatService", "templateService","$filter",
  "ModalService","$location","deviceCheckService","$compile","$interval","$http","localManager","profileDataService",
  function($scope, $rootScope, mySocket,chatService,templateService,$filter,ModalService,$location,
    deviceCheckService,$compile,$interval,$http,localManager,profileDataService){
    var user = $rootScope.checkLogIn || {};
    templateService.holdId = templateService.holdId || localManager.getValue("holdIdForChat");
    $rootScope.chatsList = $rootScope.chatsList || localManager.getValue("holdChatList");
    $rootScope.allChats = $rootScope.chatsList; // rootScope can be used instead   
    $scope.center = ($rootScope.holdcenter || {id : templateService.holdId}); //sometimes is not center but individual
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
      }
    }
  
    function getUsersOnline() {     
      $rootScope.$broadcast("users presence",{type: 'chatList',data:$rootScope.chatsList,sockets: $rootScope.sockets});         
    }



    if($rootScope.holdcenter) {
      initChatSingle();
    } else {
      initChat();
    }

    mySocket.removeAllListeners("new_msg"); // incase if this listener is registered twice


    if(deviceCheckService.getDeviceType()){
      // switchesm to chat list for mobile views 
      $('.chat__container').addClass('chat__list--active');
    }

    
    $scope.viewChat = function(chat,isMobWebList) {   

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
      
    }

    function chatBodyCb(cb){
      var base = document.getElementById('base');
      var msgDiv = document.createElement('div');
      msgDiv.id = "sentmessage";
      base.appendChild(msgDiv)
      cb()
    }

    if($rootScope.searchItems)
      $scope.messageBody = "Requesting for the following  " + $rootScope.searchItemType + ":  " + $rootScope.searchItems;
    
    $scope.sendChatSingle = function(partnerId){
      $scope.loading = true;
      mySocket.emit("send message general",{to: partnerId,message:$scope.messageBody,from: user.user_id},function(data){ 
        if(data) {
          $scope.loading = false;
          $scope.isSent = true;
        }
      })
    }

    // checks to see who is online when chat div loads
   /* mySocket.emit("check presence",{},function(connects){
      var chat;
      for(var i = 0; i < $rootScope.chatsList.length; i++) {
        for(var j in connects){            
          if(connects.hasOwnProperty(j)){
            chat = (connects[j] === $rootScope.chatsList[i].partnerId) ? $rootScope.chatsList[i] : null;
            if(chat) {               
              chat.status = true;                          
              break;
            }
          }
        }
      }
    });*/

    

    //checks to see when user is online or offline
    /*mySocket.on("real time presence",function(connects){
      var chat;
      for(var i = 0; i < $rootScope.chatsList.length; i++) {
        for(var j in connects){            
          if(connects.hasOwnProperty(j)){
            chat = ( $rootScope.chatsList[i].partnerId === connects[j] ) ? $rootScope.chatsList[i] : null;
            if(chat) { 
              chat.status = true; 
              break;                 
            } else {
              $rootScope.chatsList[i].status = false;  
            }
          }
        }
      }
    });*/

    //for modal sending one-way chat message.
    function initChatSingle() {
      mySocket.emit('init chat single',{userId: user.user_id,partnerId: $scope.center.id},function(data){});
    }

    //for general chats two-way messaging
    function initChat() {
      $scope.loading = true;
      mySocket.emit('init chat',{userId: user.user_id,partnerId: $scope.partner.partnerId},function(data){ 
        
         for(var i = 0; i < data.messages.length; i++) { 
            chats(data.messages[i]);
         }
         $scope.loading = false;        
      });
    }


    getUsersOnline();

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


  $scope.inviteOnline2 = function(doc) {
    $scope.loading = true;
    $http.post("/user/firstline-doctors",doc)
    .success(function(resp){
      if(resp.status){
        doc.isSent = resp.status;
      }
      $scope.loading = false;
    })

  }

  
  $scope.sendChat1 = function(){ 
   if($scope.user.text1 !== "" && $scope.user.text1 !== undefined) {   
      $scope.user.isSent = true;
      mySocket.emit("send message",{to: $scope.partner.partnerId,message:$scope.user.text1,from: user.user_id},function(data){ 
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


  $scope.videoChat = function(partner) {
    var source = profileDataService; 
    var presence = partner.presence || partner.status; 
    source.get({userId: partner.partnerId},function(data) {
      data.type = 'Video Call';
      data.presence = presence;
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
  }

}]);


app.directive("fileModel",["$parse","$rootScope",function($parse,$rootScope){
  return {
    restrict: "A",
    link: function(scope,element,attrs){
      var model = $parse(attrs.fileModel);
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
             
              if(scope.$parent.$parent.$parent)
                if(scope.$parent.$parent.$parent.radio.scanImage)
                  $rootScope.uploadScanImage()
            } else {
              modelSetter(scope.$parent, values[0]); //remember to check for help controller ie need a doctor
              
              $rootScope.updateProfilePic()
            }
            
          });
      });
    }
  }

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



app.controller("PatientViewResponseModalController",["$scope","$rootScope","$location","ModalService",
  "templateService","walletService","paymentVerificationService","consultationAccptanceService","getMyDoctorService","phoneCallService",
  function($scope,$rootScope,$location,ModalService,templateService,walletService,
    paymentVerificationService,consultationAccptanceService,getMyDoctorService,phoneCallService){

  $scope.docInfo = $rootScope.holdDocInView;
  $scope.isViewDoc = true;
  $scope.isOTP = false;
  var User = paymentVerificationService; //walletService.resource("/user/payment/verification",{userId: null},{verify:{method:'POST'}});
  $scope.accept = function(){
    $scope.isViewDoc = false;
    $scope.isToConfirm = true;
  }

  $rootScope.sendAcceptanceVerification = function(time,phoneCall){ //this function is all availabe on wallet controller
    $scope.msg = "";
    var timeStamp = + new Date();
    /*if(templateService.holdDocInView);
    templateService.sendObj = {
      user_id: $scope.docInfo.user_id,
      date_of_acceptance : timeStamp,
      firstname: $scope.docInfo.name,
      lastname: $scope.docInfo.lastname,
      profile_pic_url: $scope.docInfo.profile_pic_url,
      specialty: $scope.docInfo.specialty,
      compaintId: templateService.holdData.complaint_id
    }*/

     
    $rootScope.resend = timeStamp //time stamp use to check resend for an otp. this will find the previously sent otp and delete.
    var payObj = {
      amount: $scope.docInfo.fee,
      time: timeStamp,
      old_time: time
    }

    var count = 0;
    if(phoneCall) {
      count++;
      if(count < 5) {
        phoneCallService(payObj,'/user/payment/verification','POST') // "/user/payment/verification",{userId: null},{verify:{method:'POST'}}); 
        $scope.showCallingMsg = "You'll receive a phone call in just a moment. Please enter the pin you hear from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }
    } else {
      $scope.loading = true;
      var send = User.verify(payObj,function(data){
        $scope.loading = false;
        $scope.msg = data.message;
        if(data.success){
          //$location.path("/user-otp");
          $scope.isOTP = true;
        }
      });
    }
  }

  $scope.call = function(oldTime){
    $rootScope.sendAcceptanceVerification(oldTime,'isCall')
  }

  $scope.pay = {};


  $scope.confirmAcceptance = function() {
    if($scope.pay.acceptanceOtp) {
      $scope.loading = true;
      var resource = consultationAccptanceService;

      var date = + new Date();
      var pin = $scope.pay.acceptanceOtp;
      var str = "";
      var count = 0;
      for(var i = 0; i < pin.length; i++){
          count++;      
          if(count % 3 === 0) {
            str += pin[i];
            str += " ";
          } else {
            str += pin[i];
          }
       }

      var newStr = str.replace(/\s*$/,"");//removes empty string by the end of character
      //var receiver = templateService.sendObj.user_id || templateService.sendObj.receiverId;

      var payObj = {
        amount: $scope.docInfo.fee,
        otp: newStr,
        date: date,
        message: "Consultation fee",
        userId: $scope.docInfo.doctor_user_id,
        sendObj: {
          doctor_id: $scope.docInfo.doctor_user_id,
          date_of_acceptance: $scope.docInfo.date,
          doctor_firstname: $scope.docInfo.doctor_name,
          doctor_lastname:  $scope.docInfo.lastname,
          doctor_name: $scope.docInfo.doctor_name,
          doctor_profile_pic_url: $scope.docInfo.doctor_profile_pic_url,
          service_access: true,
          doctor_specialty: $scope.docInfo.doctor_specialty,
          compaintId: templateService.holdData.complaint_id,
          user_id: $scope.docInfo.doctor_user_id,
          original_complaint: templateService.holdData.description,
          original_complaint_date: templateService.holdData.sent_date,
          files: templateService.holdData.files || templateService.holdData.file
        }
      }

      $scope.loading = true;
      var confirmed = resource.confirmed(payObj,function(data){
        $scope.loading = false;
        $scope.msg = data.message;
        if(data.balance) {
          //$rootScope.balance = "NGN " + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
          $rootScope.$broadcast('debit',{status: true})         
          if($rootScope.msgLen > 0)
            $rootScope.msgLen--;
          //$location.path(templateService.holdCurrentPage);
          
          getMyDoctorService.query(null,function(data){   
                    
            $rootScope.patientsDoctorList = data;
          });
          $rootScope.holdDocInView.hasComplete = "Consultation accepted!";
        }
      });

    } else {
      $scope.msg = "Please enter otp sent to the number below."
    }

  }

}]);

app.controller("videoInitController",["$scope","$window","localManager","mySocket","templateService",
  function($scope,$window,localManager,mySocket,templateService){
    /******** Video call Logic *******/
  var user = localManager.getValue("resolveUser");
  user.firstname = user.firstname || user.name;


  $scope.docInfo = templateService.holdForSpecificDoc || templateService.holdForSpecificPatient; // <== also used for patient signaling by doctor

  $scope.yes = function () {
    $scope.isYes = true;
  }
  
  $scope.requestChat = function(userId) {    
    var reqObj = {
      to: userId,
      name: user.firstname,
      title: user.title,
      from: user.user_id,
      presence: $scope.docInfo.presence
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

}]);  



app.controller("searchSelectedCenterController",["$scope","$location","$window","$http","templateService",
"localManager","ModalService","$rootScope",
function($scope,$location,$window,$http,templateService,localManager,ModalService,$rootScope){
  $scope.data = templateService.holdTheCenterToFowardPrescriptionTo;
  $scope.user = {};

  var sendObj = {};

  $scope.data.phone = $rootScope.checkLogIn.phone;

  $scope.someone = function(type){
    $scope.mode = type;
    $scope.isToSomeOne = true;
    if(!type) {
      $scope.user.someone = true;
    } else {
      $scope.user.someone = false;
      if($scope.data.phone)
        $scope.data.phone = undefined;
    }
  }




  /*if($rootScope.checkLogIn.typeOfUser !== 'Patient') {
    $scope.data.phone = "";
  }

  /*$scope.cancel = function(){
    $scope.isToSomeOne = false;
    $scope.user.someone = false;
    if($scope.data.phone)
      $scope.data.phone = "";
  }*/

  if($rootScope.checkLogIn.typeOfUser !== 'Patient') {
    $scope.isToSomeOne = true;
    $scope.user.someone = true;
  }

  $scope.cancel = function(){
    $scope.isToSomeOne = false;
    $scope.isNewPatient = false;
    $scope.user.someone = false;
    if($scope.user.patient_phone)
      $scope.user.patient_phone = ""
  }



  $scope.returnMain = function(item) {
    item.dosage = "";
    item.other = undefined;
    item.quantity = 0;
  }

  $scope.frequencies = ["OD","BD","TDS","QDS"];
  $scope.durations = ["1 day","2 days","3 days", "5 days","6 days", "7 days","1 week", "2 weeks", "3 weeks", "1 month", "2 months","3 months","4 months","6 months"]

  $scope.isContent = true;

  $scope.send = function (type){

    var isNumber = testNumber($scope.user.patient_phone);

    if(isNumber) {
      if($scope.user.patient_phone.indexOf('+') == -1)
        $scope.user.patient_phone = "+234" + parseInt($scope.user.patient_phone); 
    } else {
      $scope.phoneMsg = "Please enter a valid phone number.";
      return;
    }

    //if not to someone then phone number is not needed.
    //$scope.data.phone = (!$scope.mode) ? $rootScope.setPhone($scope.data.phone) : undefined;

    $scope.provisionalMsg = "";
    $scope.phoneMsg = "";

    var random;
    if(templateService.holdPrescriptionId){
      random = templateService.holdPrescriptionId;
    } else {      
      random = $rootScope.genRefId;
    }    

    var date = new Date();
    $scope.data.type = ($scope.data.phone) ? 'someone' : 'inperson';
    $scope.data.prescriptionId = random;
    $scope.data.user_id = $scope.data.id;
    $scope.data.sent_date = date;

    var drugArr = $rootScope.foundDrugArr;//$scope.data.str.split(",");    
    for(var i = 0; i < drugArr.length; i++){
      var drugObj = {};
      drugObj.sn = drugArr[i].sn;
      drugObj.drug_name = drugArr[i].drug_name;
      drugObj.dosage = (drugArr[i].quantity) ? ( drugArr[i].dosage + " ( " + drugArr[i].quantity + " )") : (drugArr[i].other) ? drugArr[i].other : drugArr[i].dosage;
      drugObj.frequency = (drugArr[i].frequency) ? drugArr[i].frequency : "";
      drugObj.duration = (drugArr[i].duration) ? drugArr[i].duration : "";
      drugArr[i] = drugObj;
    }
    $scope.data.prescription_body = drugArr;

    for(var i in $scope.data) {
      if($scope.data.hasOwnProperty(i)){
        sendObj[i] = $scope.data[i];
      }
    }
    send(sendObj,"/user/drug-search/pharmacy/referral");
  }


  $scope.createPatient = function(){

    $scope.loading = true;

    for(var i in $scope.data) {
      if($scope.data.hasOwnProperty(i)){
        sendObj[i] = $scope.data[i];
      }
    }

    sendObj.patient_age = calculate_age(new Date($scope.data.dob));
    sendObj.patient_phone = $scope.user.patient_phone;


    $http({
      method  : 'POST',
      url     : "/user/out/create-patients",
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
     })
    .success(function(response) {
      if(response.success){
        send(sendObj,"/user/drug-search/pharmacy/referral");
      } else if(response.retry){
        $scope.createPatient()
      } else {
        alert(response.message)
        $scope.loading = false;
      }      
    });
  }


  function send(data,url) {
    $scope.loading = true;
    sendObj['phone'] = $scope.user.patient_phone;
     $http({
      method  : 'PUT',
      url     : url,
      data    : data,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {      
      /*if(data.error) {
        alert(data.error);
       
      } else {
                 
          $scope.isContent = false;
          $scope.isSent = true;
          $scope.result = data.ref_id;
       
      }*/
      if(data.error) {
        alert(data.message);
        //$scope.isEMP = true;
      } else if(data.isNewPatient) {
        $scope.isNewPatient = true;
        $scope.isToSomeOne = false
      } else {
        $scope.isContent = false;
        $scope.isSent = true;
        $scope.result = data.ref_id;
        $scope.user.patient_names = data.patient.firstname + " " + data.patient.lastname;
      }

      $scope.loading = false;
    });
  }

  $scope.emp = function(){
    ModalService.showModal({
        templateUrl: 'patient-emergency-form.html',
        controller: "newPatientModalController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.isEMP = false; 
      });
    });
  }

}]);

app.controller("viewCenterProfileController",["$scope","$resource","$rootScope",'templateService',function($scope,$resource,$rootScope,templateService){
  $rootScope.center = $rootScope.center;
}]);

app.controller("patientViewScanController",["$rootScope","$scope",function($rootScope,$scope){
  $scope.test = $rootScope.holdTest
}]);

app.controller("accoundLoaderConTroller",["$rootScope",function(rootscope){

}]);

app.controller("redirectModal",["$rootScope","$window",function($rootScope,$window){
  $window.location.href = $rootScope.tokBoxUrl;//$rootScope.controlUrl //redirects to video call page
}]);

//logs user out if no action was taken
app.controller("timeOutModalController",["$scope","$rootScope","$timeout","$window",function($scope,$rootScope,$timeout,$window){
  var distance = 10;
  var x = setInterval(function() {
    $scope.$apply(function(){
      $scope.countDown = --distance + 10;
      if($scope.countDown <= 0) {  
        clearInterval(x);        
        $rootScope.logout()
      }
    }) 
  },1000);

  $scope.keepalive = function() {
    clearInterval(x);
  }

}]);

app.controller("imageModalController",function(){});

app.controller("emailModalCtrl",["$scope","$rootScope","$http",function($scope,$rootScope,$http){
  $scope.sendMail = function() {
    if(!$scope.recepientEmail){
      alert('Please enter recepient email.')
      return;
    }

    $scope.loading = true;
    $rootScope.emailData.recepient = $scope.recepientEmail;
    $http.post("/user/share/email",$rootScope.emailData)
    .success(function(res){
      $scope.loading = false;
      if(res.status)
        $scope.msg = "Sent to " + $scope.recepientEmail;
      else
        $scope.msg = res.message;
    })
  }
}]);

app.controller("pendingLabTestController",["$scope","templateService","$window",
  "localManager","$location","$rootScope","$timeout",
  function($scope,templateService,$window,localManager,$location,$rootScope,$timeout){
  $scope.type = "Pending laboratory test(s)";  
 
  $scope.pendingTest = templateService.pendingLab;
    
  $rootScope.path = $location.path();
  var page = "/pending/lab-test";
  $scope.makeVideoCall = function (receiverId,center_name,patienId) {
    localManager.setValue("receiver",receiverId);
    localManager.setValue('caller',patienId);
    localManager.setValue("currentPageForPatients",page);
   
    var center = {
      center_name: center_name
    }
    localManager.setValue("doctorInfoforCommunication",center)
    //$window.location.href = "/user/patient/call";
  }

  $scope.liveChat = function (receiverId,center_name,patienId) {
    localManager.setValue("receiver",receiverId);
    localManager.setValue('caller',patienId);
    localManager.setValue("currentPageForPatients",page);
   
    var center = {
      center_name: center_name
    }
    localManager.setValue("doctorInfoforCommunication",center)
    //$window.location.href = "/patient/chat";
  }

   //patient forward test to another center.
  
  $scope.forwardTest = function(testObj) {
     var path = $location.path();
     var toArr = path.split("/");
     var type;
    if(toArr[toArr.length - 1] === "lab-test") {
      type = "Laboratory";
    } else if(toArr[toArr.length - 1] === "scan-test" || toArr[toArr.length - 1] === "radio-test") {
      type = "Radiology";
    }
    testObj.type = type; 
    $rootScope.holdTestToRun = testObj.test_to_run;
    var newArr = [] ;
    for(var i = 0; i < testObj.test_to_run.length; i++){
      if(testObj.test_to_run[i].picked) {
        newArr.push(testObj.test_to_run[i]);
      }
    }


    if(newArr.length > 0)
      testObj.test_to_run = newArr;

    templateService.holdTestToBeForwarded = testObj;
    $location.path("/patient/forward-test");
  } 


  $scope.supported = false;

  $scope.copy = "";

  $scope.success = function (test) {
    test.copy = 'Copied!';
    $timeout(function(){
      test.copy = "";
    },2000)
  };

  $scope.fail = function (err) {
    console.error('Error!', err);
  };

}]);


app.controller("patientLabTestController",["$scope","$location","$http","$window",
  "templateService","localManager","patientMedViewController","$rootScope","$timeout",
  function($scope,$location,$http,$window,templateService,
    localManager,patientMedViewController,$rootScope,$timeout){ 

  $scope.labTest = templateService.holdAllLabTest || localManager.getValue("holdLabData") //($rootScope.isViewSingle) ? templateService.singleView : (templateService.holdAllLabTest || localManager.getValue("holdLabData"));
  
  $rootScope.path = $location.path();
 

  $scope.makeVideoCall = function (receiverId,center_name,patienId) {
    localManager.setValue("receiver",receiverId);
    localManager.setValue('caller',patienId);
    localManager.setValue("currentPageForPatients","/patient/laboratory-test");
    var center = {
      center_name: center_name
    }
    localManager.setValue("doctorInfoforCommunication",center)
  }

  $scope.liveChat = function (receiverId,center_name,patienId) {
    localManager.setValue("receiver",receiverId);
    localManager.setValue('caller',patienId);
    localManager.setValue("currentPageForPatients","/patient/laboratory-test");
    var center = {
      center_name: center_name
    }
    localManager.setValue("doctorInfoforCommunication",center)
    $window.location.href = "/user/patient/chat";
  }

  $scope.sendDocTest = function(testObj) {
    testObj.type = "laboratory";
    templateService.holdTestToBeForwarded = testObj;
    $http({
      method  : 'GET',
      url     : "/user/patient/my-doctors",        
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      if(data.accepted_doctors.length > 0) {
        templateService.holdMyDoctorsForSendingTest = data.accepted_doctors;
        $location.path("/patient/my-doctors");
      } else {
        alert("Sorry, you have no doctors in your list to send this test to.")
      }
    });
    
  }

  //patient forward test to another center.
  /*$scope.forwardTest = function(testObj,type) {
    testObj.type = type;  
    templateService.holdTestToBeForwarded = testObj;
    $location.path("/patient/forward-test");
  } */


  //patient forward test to another center.
  $scope.forwardTest = function(testObj,type) {
    testObj.type = type;
    $rootScope.holdTestToRun = testObj.test_to_run;
    var newArr = [] ;
    for(var i = 0; i < testObj.test_to_run.length; i++){
      if(testObj.test_to_run[i].picked) {
        newArr.push(testObj.test_to_run[i]);
      }
    }


    if(newArr.length > 0)
      testObj.test_to_run = newArr;

    templateService.holdTestToBeForwarded = testObj;
    $location.path("/patient/forward-test");
  } 
    
  //this fn is invoked when a patient wish to delete a prescription.
  $scope.deleteTest = function (id) {
    for(var i = 0; i < $scope.labTest.length; i++){
      if($scope.labTest[i].ref_id === id){
        $scope.labTest.splice(i,1);
      }
    }
  }

  //copy to clipboard

  $scope.supported = false;

  $scope.copy = "";

  $scope.success = function (test) {
    test.copy = 'Copied!';
    $timeout(function(){
      test.copy = "";
    },2000)
  };


  $scope.fail = function (err) {
    console.error('Error!', err);
  };

  // view prescription based on time received
    $scope.isAll = true;
    $scope.all = function(){
      $scope.isAll = true;


      $scope.isRecent = false;
      $scope.isThree = false;
      $scope.isSix = false;
      $scope.labTest = localManager.getValue("holdLabData");
    }

    $scope.recent = function(){
      $scope.isAll = false;
      $scope.isRecent = true;
      $scope.isThree = false;
      $scope.isSix = false;
      $scope.labTest = patientMedViewController.getList(1,localManager.getValue("holdLabData"));
    }

    $scope.three = function(){
      $scope.isAll = false;
      $scope.isRecent = false;
      $scope.isThree = true;
      $scope.isSix = false;
      $scope.labTest = patientMedViewController.getList(3,localManager.getValue("holdLabData"));
    }

    $scope.six = function(){
      $scope.isAll = false;
      $scope.isRecent = false;
      $scope.isThree = false;
      $scope.isSix = true;
      $scope.labTest = patientMedViewController.getList(6,localManager.getValue("holdLabData"));
    }

}]);

//handles pending tests list including communications
app.controller("pendingRadioTestController",["$scope","templateService","$window",
  "localManager","$location","$rootScope","$timeout",
  function($scope,templateService,$window,localManager,$location,$rootScope,$timeout){
  $scope.type = "Pending radiology test(s)"
  
  $scope.pendingTest = templateService.pendingScan;

  $rootScope.path = $location.path();

  var page = "/pending/scan-test";

  $scope.makeVideoCall = function (receiverId,center_name,patienId) {
    
    localManager.setValue("receiver",receiverId);
    localManager.setValue('caller',patienId);
    localManager.setValue("currentPageForPatients",page);
    
    var center = {
      center_name: center_name
    }
    localManager.setValue("doctorInfoforCommunication",center)
    //$window.location.href = "/user/patient/call";
  }



  $scope.liveChat = function (receiverId,center_name,patienId) {
    localManager.setValue("receiver",receiverId);
    localManager.setValue('caller',patienId);
    localManager.setValue("currentPageForPatients",page);
    
    var center = {
      center_name: center_name
    }
    localManager.setValue("doctorInfoforCommunication",center)
    //$window.location.href = "/patient/chat";
  }


  $scope.forwardTest = function(testObj) {
   
     var path = $location.path();
     var toArr = path.split("/");
     var type;
    if(toArr[toArr.length - 1] === "lab-test") {
      type = "Laboratory";
    } else if(toArr[toArr.length - 1] === "scan-test" || toArr[toArr.length - 1] === "radio-test") {
      type = "Radiology";
    }
    testObj.type = type;
     $rootScope.holdTestToRun = testObj.test_to_run;
    var newArr = [] ;
    for(var i = 0; i < testObj.test_to_run.length; i++){
      if(testObj.test_to_run[i].picked) {
        newArr.push(testObj.test_to_run[i]);
      }
    }


    if(newArr.length > 0)
      testObj.test_to_run = newArr;

    templateService.holdTestToBeForwarded = testObj;
    $location.path("/patient/forward-test");  
    templateService.holdTestToBeForwarded = testObj;
    $location.path("/patient/forward-test");
  } 

  $scope.supported = false;

  $scope.copy = "";

  $scope.success = function (test) {
    test.copy = 'Copied!';
    $timeout(function(){
      test.copy = "";
    },2000)
  };


  $scope.fail = function (err) {
    console.error('Error!', err);
  };

}]);

app.controller("patientRadioTestController",["$scope","$rootScope","$location","$http","$window","templateService",
  "localManager","patientMedViewController","ModalService","$timeout",
  function($scope,$rootScope,$location,$http,$window,templateService,localManager,patientMedViewController,ModalService,$timeout){


  /*if(!templateService.singleView) {
    $scope.labTest = templateService.holdAllRadioTest || localManager.getValue("holdScanData");
  } else {
    $scope.labTest = templateService.singleView;
    templateService.singleView = null;
  }*/

  $scope.labTest = templateService.holdAllRadioTest || localManager.getValue("holdScanData")

  $rootScope.path = $location.path();
  

  $scope.makeVideoCall = function (receiverId,center_name,patienId) {
    localManager.setValue("receiver",receiverId);
    localManager.setValue('caller',patienId);
    localManager.setValue("currentPageForPatients","/patient/radiology-test");
    var center = {
      center_name: center_name
    }
    localManager.setValue("doctorInfoforCommunication",center)
    //$window.location.href = "/patient/call";
  }

  $scope.liveChat = function (receiverId,center_name,patienId) {
    localManager.setValue("receiver",receiverId);
    localManager.setValue('caller',patienId);
    localManager.setValue("currentPageForPatients","/patient/radiology-test");
    var center = {
      center_name: center_name
    }
    localManager.setValue("doctorInfoforCommunication",center)
    $window.location.href = "/user/patient/chat";
  }

  $scope.sendDocTest = function(testObj) {
    testObj.type = "radiology";
    templateService.holdTestToBeForwarded = testObj;
    $http({
      method  : 'GET',
      url     : "/user/patient/my-doctors",        
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      if(data.accepted_doctors.length > 0) {
        templateService.holdMyDoctorsForSendingTest = data.accepted_doctors;
        $location.path("/patient/my-doctors");
      } else {
        alert("Sorry, you have no doctors in your list to send this test to.")
      }
    });
  }
  
  //patient forward test to another center.
  $scope.forwardTest = function(testObj,type) {
    testObj.type = type;
    $rootScope.holdTestToRun = testObj.test_to_run;
    var newArr = [] ;
    for(var i = 0; i < testObj.test_to_run.length; i++){
      if(testObj.test_to_run[i].picked) {
        newArr.push(testObj.test_to_run[i]);
      }
    }


    if(newArr.length > 0)
      testObj.test_to_run = newArr;

    templateService.holdTestToBeForwarded = testObj;
    $location.path("/patient/forward-test");
  } 
    
  //this fn is invoked when a patient wish to delete a prescription.
  $scope.deleteTest = function (id) {
    for(var i = 0; i < $scope.labTest.length; i++){
      if($scope.labTest[i].ref_id === id){
        $scope.labTest.splice(i,1);
      }
    }
  }

  $scope.viewFile = function(test) {
    $rootScope.holdTest = test

    //use modal to view images attached to  test.
    ModalService.showModal({
        templateUrl: 'patient-view-scan-image.html',
        controller: "patientViewScanController"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
        })
           
    });
  }

  //copy to clipboard

  $scope.supported = false;

  $scope.copy = "";

  $scope.success = function (test) {
    test.copy = 'Copied!';
    $timeout(function(){
      test.copy = "";
    },2000)
  };


  $scope.fail = function (err) {
    console.error('Error!', err);
  };

  // view prescription based on time received
    $scope.isAll = true;
    $scope.all = function(){
      $scope.isAll = true;
      $scope.isRecent = false;
      $scope.isThree = false;
      $scope.isSix = false;
      $scope.labTest = localManager.getValue("holdScanData");
    }

    $scope.recent = function(){
      $scope.isAll = false;
      $scope.isRecent = true;
      $scope.isThree = false;
      $scope.isSix = false;
      $scope.labTest = patientMedViewController.getList(1,localManager.getValue("holdScanData"));
    }

    $scope.three = function(){
      $scope.isAll = false;
      $scope.isRecent = false;
      $scope.isThree = true;
      $scope.isSix = false;
      $scope.labTest = patientMedViewController.getList(3,localManager.getValue("holdScanData"));
    }

    $scope.six = function(){
      $scope.isAll = false;
      $scope.isRecent = false;
      $scope.isThree = false;
      $scope.isSix = true;
      $scope.labTest = patientMedViewController.getList(6,localManager.getValue("holdScanData"));
    }
    
}]);

app.controller("trackedPrescriptionController",["$scope","$rootScope","$location","templateService","localManager",
  function($scope,$rootScope,$location,templateService,localManager){
  $scope.presInfo = templateService.holdPrescriptionForTrackRecord;
  $scope.trackedPrescription = templateService.holdTrackRecord;
  //$rootScope.goBack = $rootScope.back;
 
  //$rootScope.path = $location.path() //localManager.setValue('currentPageForPatients',$location.path());

  //this fn is invoked when patient wish to forward prescription by himself to a phamarcy.
  $scope.forwardPrescription = function (prescription) {       
    /*templateService.holdPrescriptionToBeForwarded = prescription;
   
    templateService.holdPrescriptionToBeForwarded.sender = "patient";          
    $location.path("/patient/search/pharmacy");*/

    $rootScope.unavailableDrugArr = [];

    for(var i = 0; i < prescription.prescription_body.length; i++) {
      if(prescription.prescription_body[i].picked) {
        $rootScope.unavailableDrugArr.push(prescription.prescription_body[i]);
      } 
    }

    if($rootScope.unavailableDrugArr.length == 0) {
      $rootScope.unavailableDrugArr = prescription.prescription_body;
    }

    $rootScope.refData = prescription;
    $rootScope.refData.sender = "patient";          
    $location.path("/patient/search/pharmacy");                  
  }

}]);

app.controller("outPatientBillingCtrl",["$scope","outPatientBillingService","templateService","$http","$rootScope","phoneCallService",
function($scope,outPatientBillingService,templateService,$http,$rootScope,phoneCallService){
  var bill = outPatientBillingService.get({billId: templateService.holdId});
  $scope.bill = bill;
  var sendObj = {};
  var count = 0;
  $scope.verify = function(oldTime,phoneCall) {
    var time = + new Date();
    $scope.otpMsg = "";
   
    sendObj.amount = bill.total;
    sendObj.time = time;
    if(oldTime) {
      sendObj.old_time = oldTime;
    }

    if(phoneCall) {
      count++;
      if(count < 5) {
        phoneCallService(sendObj,'/user/payment/verification','POST') // "/user/payment/verification",{userId: null},{verify:{method:'POST'}}); 
        $scope.showCallingMsg = "You'll receive a phone call in just a moment. Please enter the pin you hear from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }
    } else {
      $scope.loading = true;
      $http.post("/user/payment/verification",sendObj)
      .success(function(response){
        $scope.loading = false;
        if(response.success){
          $scope.otpMsg = response.message;
          $scope.isOtp = true;
        }
      })
    }
    $rootScope.resend = time;
  }

  $scope.call = function(oldTime){
    $scope.verify(oldTime,'isCall');
  }

  $scope.pay = function() {
    if(!$scope.bill.pin) {
      alert("Please enter OTP sent to your phone number via SMS.");
      return;
    }

    $scope.otpMsg = "";
    var pin = $scope.bill.pin;
    var str = "";
    var count = 0;
    for(var i = 0; i < pin.length; i++){
        count++;      
        if(count % 3 === 0) {
          str += pin[i];
          str += " ";
        } else {
          str += pin[i];
        }
     }

    $scope.bill.otp = str.replace(/\s*$/,"");//removes empty string by the end of character

    $scope.loading = true;
    outPatientBillingService.acceptBill($scope.bill,function(res){
      if(res.status) {
        $scope.isPaid = true;
        $rootScope.$broadcast("debit",{status: true})
      } else {
        $scope.otpMsg = res.message;
      }
      $scope.loading = false;
    })
  }

}]);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//patient acknowledgee doctors reply and send confirmation to the backend to be save in both doctors box and patient box.
app.controller("patientViewRequestController",["$scope","$location","$http","$rootScope","templateService","ModalService",
  "deleteFactory","localManager","walletService","paymentVerificationService","phoneCallService","consultationAccptanceService",
  function($scope,$location,$http,$rootScope,templateService,ModalService,deleteFactory,
    localManager,walletService,paymentVerificationService,phoneCallService,consultationAccptanceService){
 var id = templateService.holdId;

 localManager.setValue("currentPageForPatients",$location.path())
 $scope.viewPrescriptionFromNoticeTemplate = function () {
  templateService.holdPrescriptionsId = docObj.doctorId;
  $location.path("/patient-prescription/view-from-notification/" + docObj.doctorId);   
 }  
 
 //sents out the doctor to the patient box showing that the patient has accepted the doctor and 
 //the wallet has enough fund to pay for consultation fee

 var msgData = templateService.holdMsg || localManager.getValue('holdMessages');
 var User = paymentVerificationService; //walletService.resource("/user/payment/verification",{userId: null},{verify:{method:'POST'}});

 if(templateService.holdId) {
  localManager.setValue("holdId",templateService.holdId);
 } else {
  templateService.holdId = localManager.getValue("holdId");
 }

 if(templateService.holdMsg)
  localManager.setValue('holdMessages',templateService.holdMsg);

 var name  = localManager.getValue("resolveUser");

 $scope.patientName = name.firstname;
 var elementPos;
  for(var i = 0; i < msgData.length; i++){
    if(msgData[i].service_access && !msgData[i].reason && msgData[i].user_id === templateService.holdId && !msgData[i].doctor_id) {
      elementPos = i;      
      $scope.reqInfo = msgData[i];
      $scope.reqInfo.inNaira = "NGN " + msgData[i].consultation_fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if(msgData[i].reason) {
      $scope.reqInfo = msgData[i];
    }
  }


  $scope.acceptWithZeroFee = function(msgId) {

    /*$rootScope.patientsDoctorList.forEach(function(doc){
      if(doc.doctor_id == $scope.reqInfo.user_id) {
        alert("This doctor already exist in your account.")
      } else {
        createConnection()
      }
    })*/

    var elemPos = $rootScope.patientsDoctorList.map(function(x){if(x) return x.doctor_id}).indexOf($scope.reqInfo.user_id);

    if(elemPos == -1){
      createConnection();
    } else {
      alert("This doctor already exist in your account.");
    }


    function createConnection() {
      $scope.loading = true;
      var docObj = $scope.reqInfo;
      var timeStamp = + new Date();
      docObj.date_of_acceptance = timeStamp;

      docObj.message_id = msgId;
      var payObj = {
        amount: 0,
        //otp: newStr,
        date: timeStamp,
        message: "Consultation fee",
        userId: $scope.reqInfo.user_id,
        sendObj: docObj
      }

      consultationAccptanceService.confirmed(payObj,function(response){
        if(response.status){
          alert("Success! New doctor added to your account.");
          $rootScope.patientsDoctorList.push({
            doctor_id: docObj.user_id,
            date_of_acceptance: docObj.date_of_acceptance,
            doctor_firstname: docObj.firstname || docObj.doctor_firstname,
            doctor_lastname:  docObj.lastname || docObj.doctor_lastname,
            doctor_name: docObj.name || docObj.doctor_name,
            doctor_profile_pic_url: docObj.profile_pic_url || docObj.doctor_profile_pic_url,
            service_access: true,
            doctor_specialty: docObj.specialty || docObj.doctor_specialty,
          })

          $scope.loading = false;
        }
        else {
          alert("Oops! Something went wrong. Please try again.")
        }
      });
    }
  }


    
  
  $rootScope.sendAcceptanceVerification = function(time,phoneCall){ //this function is also availabe on wallet controller
    var docObj = $scope.reqInfo;
    templateService.holdRawAmount = $scope.reqInfo.consultation_fee;    

    var timeStamp = + new Date();
    docObj.date_of_acceptance = timeStamp;
   
    templateService.sendObj = docObj

     
    $rootScope.resend = timeStamp //time stamp use to check resend for an otp. this will find the previously sent otp and delete.
    var payObj = {
      amount: templateService.holdRawAmount,
      time: timeStamp,
      old_time: time
    }
    $scope.loading = true;
    var count = 0;
    if(phoneCall){
      count++;
      if(count < 5) {
        phoneCallService(payObj,'/user/payment/verification','POST') // "/user/payment/verification",{userId: null},{verify:{method:'POST'}}); 
        $rootScope.showCallingMsg = "You'll receive a phone call in just a moment. Please enter the pin you hear from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }
    } else {
      var send = User.verify(payObj,function(data){
        alert(data.message);
        if(data.success){
          $location.path("/user-otp");
        }

        $scope.loading = false;
      });
    }
  }
   
 $scope.decline = function(message_id){
  var result = confirm("Consultation will be terminated and message will be deleted!");
  if(result) {
    var msg = "Consultation process terminated!";
    delFromMsg(msg,message_id);
  }
 }
 $scope.isRequest = true;
 function delFromMsg(msg,message_id){
  $scope.isRequest = false;  
  var remove = msgData.splice(elementPos,1);
  var len = msgData.length;
  $rootScope.msgLen = templateService.holdMsgLen(len);
  var del = new deleteFactory(message_id,"patient_mail");
  del.deleteItem("/user/patient/delete-one",msg);
 }

}]);

app.controller("PatientViewResponseController",["$scope","$rootScope","$resource",
  "templateService","ModalService","getPersonProfileService","consultationAccptanceService",
  function($scope,$rootScope,$resource,templateService,ModalService,getPersonProfileService,consultationAccptanceService){

  
  $scope.responders = templateService.holdData;
  var str;

  $scope.getInCurr = function(doc) {
    str =  ($rootScope.checkLogIn.currencyCode) ? $rootScope.checkLogIn.currencyCode + " " +
     doc.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") :
      "NGN " + doc.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    doc.strAmount = str;
    $rootScope.consultfee = str;
    return str;
  }

  $scope.viewDocProfile = function(docId){
    var resource = getPersonProfileService; //$resource("/user/get-person-profile");
    $rootScope.holdDocInView = resource.get({personId:docId},function(d){});
   
    ModalService.showModal({
        templateUrl: "view-dco-profile-modal.html",
        controller: "PatientViewResponseModalController"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
        });
    });    
  }

  $scope.acceptWithZeroFee = function(doc) {
    /*$rootScope.patientsDoctorList.forEach(function(person){
      if(person.doctor_id === doc.doctor_user_id) {
        alert("This doctor already exist in your account.");
        return;
      } else {
        alert("sjhjdshjds")
        acceptDoc();
      }
    });*/

    var elemPos = $rootScope.patientsDoctorList.map(function(x){if(x) return x.doctor_id}).indexOf(doc.doctor_user_id);

    if(elemPos == -1){
      acceptDoc();
    } else {
      alert("This doctor already exist in your account.");
    }

    function acceptDoc() {
      $scope.docInfo = doc;
      doc.loading = true;
      var payObj = {
        amount: 0,
        //otp: newStr,
        date: + new Date(),
        message: "Consultation fee",
        userId: $scope.docInfo.doctor_user_id,
        sendObj: {
          doctor_id: $scope.docInfo.doctor_user_id,
          date_of_acceptance: $scope.docInfo.date,
          doctor_firstname: $scope.docInfo.doctor_name,
          doctor_lastname:  $scope.docInfo.lastname,
          doctor_name: $scope.docInfo.doctor_name,
          doctor_profile_pic_url: $scope.docInfo.doctor_profile_pic_url,
          service_access: true,
          doctor_specialty: $scope.docInfo.doctor_specialty,
          compaintId: templateService.holdData.complaint_id,
          user_id: $scope.docInfo.doctor_user_id,
          original_complaint: templateService.holdData.description,
          original_complaint_date: templateService.holdData.sent_date,
          files: templateService.holdData.files || templateService.holdData.file
        }
      }

    
      consultationAccptanceService.confirmed(payObj,function(response){
        if(response.status) {
          alert("Success! You have just received a new doctor in your account.");
          $rootScope.patientsDoctorList.push({
            doctor_id: $scope.docInfo.doctor_user_id,
            date_of_acceptance: $scope.docInfo.date,
            doctor_firstname: $scope.docInfo.doctor_name,
            doctor_lastname:  $scope.docInfo.lastname,
            doctor_name: $scope.docInfo.doctor_name,
            doctor_profile_pic_url: $scope.docInfo.doctor_profile_pic_url,
            service_access: true,
            doctor_specialty: $scope.docInfo.doctor_specialty,
          })
        } else{
          alert("Oops! Error just happened please try again.")
        }
        doc.loading = false;
      });
    }

  }

  $scope.acceptDoc = function(doc){
    //var resource = getPersonProfileService; //$resource("/user/get-person-profile/:personId",{personId:docId});
    //templateService.holdDocInView = resource.get({personId:docId},function(){});
    //var inNaira = $rootScope.checkLogIn.currencyCode + " " + fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //templateService.holdRawAmount = fee;
    //templateService.holdDocInView.fee = inNaira;
    //templateService.holdDocInView.intro = intro;
    var elemPos = $rootScope.patientsDoctorList.map(function(x){if(x) return x.doctor_id}).indexOf(doc.doctor_user_id);
    if(elemPos === -1) {
      $rootScope.holdDocInView = doc;
      ModalService.showModal({
        templateUrl: "acceptance-notification.html",
        controller: "PatientViewResponseModalController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
        });
      }); 
    } else {
      alert("You have already accepted " + doc.doctor_name)
    }   
  }
  
}]);

app.controller("selectedAppointmentControllerForPatient",
  ["$scope","$location","$rootScope","templateService","localManager","deleteFactory","$http","ModalService",
  function($scope,$location,$rootScope,templateService,localManager,deleteFactory,$http,ModalService){
   /* var appData = templateService.holdAppointmentData;
    var elementPos = appData.map(function(x){return x.session_id}).indexOf(templateService.holdId);
    var found = appData[elementPos];

    $scope.appointment = found;
    $scope.notDeleted = true;
    $scope.delbtn = "Delete appointment";
    */

    moment.updateLocale('en', {
      calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : '[last] dddd',
        nextWeek : 'dddd',
        sameElse : 'L'
      }
    });

    $scope.deleteApp = function(){
      var remove = appData.splice(elementPos,1);
      var len = appData.length;
      $rootScope.appLen = templateService.holdAppLen(len);           
      var deleteAppointment = new deleteFactory(found.session_id,"appointment");
      deleteAppointment.deleteItem("/user/patient/delete-one/appointment","Appointment deleted!");
      $scope.notDeleted = false;
      $scope.delbtn = "Appointment deleted!";
    }

    $scope.loading = true;
    $http.put("/user/patient/appointment/view")
    .success(function(resp){
      $scope.loading = false;
      $scope.appFetchedData = resp;
      chackDay(resp.active)
    });

    var chackDay = function(list){
       list.forEach(function(item){       
        item.isToday = hasToday(item.date);
        item.isPassed = hasPassed(item.date);
        //item.isTime = onTime(item.time);
      })
    }

    function hasToday(date){
      return moment(date).isSame(moment(), 'day');//moment(date).isAfter(moment().subtract(24, 'hours'));
    }

    function hasPassed(date){
      return moment(date).isBefore(moment(),'day');
    }

    $scope.ask = function(detail){
      var name = (detail.lastname) 
      ? (detail.title + " " + detail.firstname + " " + detail.lastname) 
      : (detail.title + " " + detail.firstname)
      $rootScope.holdcenter = {
        firstname: detail.firstname,
        lastname: detail.lastname,
        name: name,
        title: detail.title,
        id: detail.doctorId,
        address: detail.address
      }

      ModalService.showModal({
        templateUrl: 'quick-chat.html',
        controller: 'generalChatController'
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {             
        });
      })
    }


     /*$rootScope.holdcenter.id = $rootScope.holdcenter.user_id;
        ModalService.showModal({
            templateUrl: 'quick-chat.html',
            controller: 'generalChatController'
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {             
            });
        });*/
    
}]);

app.controller("courierResponseCtrl",["$scope","$rootScope","courierResponseService","templateService",
  "$location","phoneCallService","paymentVerificationService","$http","localManager",
  function($scope,$rootScope,courierResponseService,templateService,$location,phoneCallService,
    paymentVerificationService,$http,localManager){

  /*$rootScope.getCourierResponse = function(courierId) {
    if(!$rootScope.courierResponse) {
      var aCourier = localManager.getValue("holdCourierData");
      var id;
      if(aCourier){
        id = (courierId) ? courierId : aCourier._id
      } else {
        id = courierId;
      }
      $scope.loadingReq = true;
      var courierResponse = courierResponseService;
      courierResponse.get({_id: id},function(data){
        $rootScope.courierResponse = data;
        $scope.loadingReq = false;
      });
    }
  }*/



  $rootScope.getCourierResponse();

  $rootScope.courierId = null;

  $scope.reOrder = function(item) {    
    if(item){
      item.prescription_body.forEach(function(drug){
        if(drug.quantity){
          delete drug.quantity;
          delete drug.dosage;
        }
      });
      delete item.otp;
      delete item._id;
      $rootScope.selectedPrescription = item;
      $location.path('courier');
    } else {
      alert("No item was found!")
    }
  }

  $scope.user = {};

  $scope.cancel = function(itemId){
    var check = confirm("This order will be deleted and can never be used again.");
    if(check) {
      $scope.canceling = true;
      courierResponseService.delete({item: itemId},function(res){
        if(res.status) {
          var elementPos = $rootScope.courierResponseList.map(function(x){return x._id.toString()}).indexOf(itemId);
          $scope.canceling = false;
          if(elementPos !== -1) {
            $rootScope.courierResponseList.splice(elementPos,1);
            $rootScope.courierResponse = null;
            localManager.removeItem("holdCourierData");
          }
        } else {
          alert("Order cannot delete! Maybe it has been attended to or does not exists");
        }
      })
    }
  }

  $scope.getTotal = function(val1,val2){
    $scope.sum = parseInt(val1) + parseInt(val2);
    return $rootScope.checkLogIn.currencyCode + " " + $scope.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var otp = paymentVerificationService;
  var count = 0;

  $scope.pay = function(oldTime,phoneCall){    
    var time = + new Date();
    $rootScope.resend = time;
    var sendObj = {
      amount : $scope.sum,
      time: time,
      old_time: oldTime
    }

    if(phoneCall) {
      count++;
      if(count < 5) {
        phoneCallService(sendObj,'/user/payment/verification','POST'); 
        $rootScope.showCallingMsg = "You'll receive a phone call in just a moment. Please enter the pin you hear from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }
    } else {
      if($scope.otpMsg)
         $scope.otpMsg = "";

      $scope.loading = true;
      otp.verify(sendObj,function(data){
        $scope.loading = false;
        if(data.success){
          $scope.otpMsg = data.message;
          $scope.isOtp = true;
        } else {
          alert(data.message);
          $location.path('wallet');
        }
      })
    }
  }

  $scope.call = function(oldTime) {
    $scope.pay(oldTime,'isCall')
  }

  $scope.confirm = function(courier){
    var str = "";
    if($scope.user.pin) {
      
      for(var i = 0; i < $scope.user.pin.length; i++) {
        str += $scope.user.pin[i];
        if(i == 2)
            str += " ";
      }

    } else {
      alert("Please enter the pin sent to your phone.");
      return;
    }
    $scope.user.otp = str;
    $scope.user.centerId = courier.center_id;
    $scope.user.courier_id = courier._id;
    $scope.user.orderId = courier.request_id;
    $scope.loading = true;
    $http.post("/user/courier/payment-confirmation",$scope.user)
    .success(function(response){
      $scope.loading = false;
      if(response.status) {
        courier.is_paid = response.status;
        $scope.otpMsg = "";
        localManager.removeItem("holdCourierData");
        $rootScope.$broadcast("debit",{status:true});
        var assign = {
          agent_id: $rootScope.courierResponse.agentId,
          courierId: courier._id
        }
        $http.put("/user/agent-delivery",assign)
        .success(function(resp){
          if(resp.status){
            var msg = "Your drug delivery has been initiated! " + resp.message;
            alert(msg);
            $rootScope.courierResponse.delivery_msg = resp.message;
          } else {
            alert(res.message)
          }
        })
      } else {
        $scope.otpMsg = response.message;
      }
    });
 
  }

  $scope.sendDispute = function(id){
    var check = confirm("You want to initiate a dispute based on this courier service")
    if(check) {
      $http.post("/user/courier/dispute",{courierId: id})
      .success(function(response){
        alert("Dispute submitted! we'll contact you soon.")
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

app.controller("changePictureController",["$scope","$rootScope","$location","$http","$window","templateService","multiData",
  function($scope,$rootScope,$location,$http,$window,templateService,multiData){

  $http({
    method  : 'GET',
    url     : "/user/profile/getDetails",
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {
   
    $scope.userData = data;
  });

  $scope.user = {};

  $rootScope.updateProfilePic = function(){
   
    var fileType = $scope.files.type.split("/");
    var fileAsImage = fileType[0];
    if(fileAsImage === "image") {
     
      var uploadUrl = "/user/update/profile-pic";     
      var fd = new FormData();
      var xhr = new XMLHttpRequest;

     
      for(var key in $scope.files){

          if($scope.files[key].name){
            fd.append(key,$scope.files);
          }
          

      };

      var xhr = new XMLHttpRequest()
      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);
     
      
      xhr.open("PUT", uploadUrl)
      xhr.send(fd);
      $scope.progressVisible = false
    } else {
      alert("Failed! Reason: File type not image");
    }  
  }

  
   
  function uploadProgress(evt) {
        $scope.progressVisible = true;
        $scope.$apply(function(){
            if (evt.lengthComputable && evt.total <= 26214400) {
              
                $scope.progress = Math.round(evt.loaded * 100 / evt.total)
               
            } else {
                $scope.progress = 'Unable to compute! File size out of range.'
            }
        })
    }

    function uploadComplete(evt) {
      $scope.$apply(function(){
        if(evt.target.responseText) {
          $scope.userData = JSON.parse(evt.target.responseText);
        } else {
          alert("Picture size out of range! Less than 1mb recommended.")
        }
        
      })
       
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        $scope.$apply(function(){
            $scope.progressVisible = false;
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }

}]);

//controller runs when patient clicks on the edit profile like on the panel of patient dashboard
app.controller("patientProfileEditController",["$scope","$location","$http","$window","templateService","multiData",function($scope,$location,$http,
  $window,templateService,multiData){  
  //picture controller on patient page
  $scope.$watch("templateService.isUpdated", function() {
    $scope.userData = templateService.changedProfilePic;      
  });
     
  $http({
    method  : 'GET',
    url     : "/user/profile/getDetails",
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {
    $scope.userData = data;
  });

  $scope.user = {};
    
  $scope.update = function(){
    $scope.user.type = "picture";
    var uploadUrl = "/user/update/profile-pic";     
    multiData.sendPic(uploadUrl,$scope.user);   
  }

  $scope.updateDetails = function(){
    var uploadUrl = "/user/patient-profile/update";     
    multiData.sendPic(uploadUrl,$scope.user);  
  }

}]);

app.controller("familyAccountController",["$scope","$http","$rootScope","localManager",function($scope,$http,$rootScope,localManager){
  $scope.familyAccount = {};
  $scope.createAccount = function() {
   
    if(Object.keys($scope.familyAccount).length < 4 ) {
      alert("Please complete empty fields")
    } else {
      $scope.loading = true;
      $http({
        method  : 'POST',
        url     : '/user/family/create-account',
        data    : $scope.familyAccount,
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data){      
        $scope.loading = false;
        if(data.status) {
          $scope.responseMessage = "Account created successfully!";
          $rootScope.checkLogIn.family_accounts = data.accountList;
          localManager.setValue("resolveUser",$rootScope.checkLogIn);
        } else {
          alert("Error occured while creating account, Please try again.")
        }
      })
    }
  }
}]);

app.controller("invitationCtrl",["$scope","$http","$rootScope","ModalService","$timeout",
  function($scope,$http,$rootScope,ModalService,$timeout){
    $scope.invite = {};

    if($rootScope.isDocInvite) {
      $scope.invite.type = "Doctor";
    }

    $rootScope.isDocInvite = false;

    $scope.someone = function(type){
      $scope.invite.type = type;
    }


    $scope.copyText = "Consult doctors online, buy drugs with home delivery and do diagnostic tests through Applinic. Free treatment"
    + " for malaria and typhoid fever available while offer lasts. Click link below to register.  https://applinic.com"

    $scope.supported = false;

    $scope.copy = "";

    $scope.success = function (pres) {
      pres.copy = 'Copied!';
      $timeout(function(){
        pres.copy = "";
      },2000);
    };


    $scope.fail = function (err) {
      console.error('Error!', err);
    };


    $scope.inviteFn = function() {
      $scope.msg = "";

      $scope.existingUser = false;



      if(!$scope.invite.recepient){
        alert("Please enter email or phone number of the recepient");
        return;
      }

      
      if($rootScope.checkLogIn.email == $scope.invite.recepient){
        alert("Please you cannot invite yourself.");
        return;
      }

       if($rootScope.checkLogIn.phone == $scope.invite.recepient){
        alert("Please you cannot invite yourself.");
        return;
      }

      if($scope.invite.recepient[0] === '0'){
        var newSlice = $scope.invite.recepient.slice(1);
        $scope.invite.recepient = "+234" + newSlice;
      }


      $scope.loading = true;

     
    $http.post("/user/invitation",$scope.invite)
      .success(function(res){
        $scope.msg = res.message;
        $scope.loading = false;
        $scope.existingUser = (res.user && res.type == 'Patient') ? true : false;
        $scope.userToAdd = $scope.invite.recepient;
      })
    }

    $scope.addPatient = function() {
      $scope.loading = true;
      $scope.msg = "";
      $http.post("/user/doctor/add-patient",{user: $scope.userToAdd})
      .success(function(res){
        $scope.msg = res.message;
        $scope.loading = false;
        $scope.existingUser = false;
        $rootScope.patientList.unshift(res.patient)
      })
    }

    $scope.refresh = function() {
      $scope.msg = "";
      $scope.existingUser = false;
    }
}]);

app.controller('resultController',["$scope","$rootScope","$http","$location","$resource",
  "localManager","cities","templateService","templateUrlFactory","patientfindDoctorService",
  "skillProcedureService","mySocket","$filter","deviceCheckService","chatService",
  function($scope,$rootScope,$http,$location,$resource,localManager,
    cities,templateService,templateUrlFactory,patientfindDoctorService,
    skillProcedureService,mySocket,$filter,deviceCheckService,chatService) {
  $scope.user = {};
  $scope.user.type = "Doctor";
  $scope.user.city = $rootScope.checkLogIn.city;
  $scope.refineUser = {};
  var theCity;
  var theSkill;

  $scope.getCity = function(city){
    theCity = city;
  }

  
  $scope.goBack = function() {
    $location.path("/find-specialist");
  }

  var filter = {};
  var spArr = [];
  var skArr = [];
  var centerArr = [];
  var diseasArr = [];

  if($location.path() == "/procedure") {
    var source = skillProcedureService; //$resource("/user/skills-procedures");
    source.query(function(data){
      if(!data.status) {    
        for(var i = 0; i < data.length; i++){
          if(!filter[data[i].skill]) {
            filter[data[i].skill] = 1;
            skArr.push(data[i])
          } else {
            filter[data[i].skill]++;
          }
        }
        $scope.skills = skArr;
      }
      
    });  
  };

  var keywords;
 
  if($location.path() == "/find-specialist") {
    $http({
      method  : 'GET',
      url     : "/user/get-specialties",
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {              
      if(data){
        for(var i = 0; i < data.length; i++){
          keywords = (data[i].skills.length > 0) ? addDisease(data[i]) : null;
          diseasArr.push(keywords) 
          if(!filter[data[i].specialty]) {
            filter[data[i].specialty] = 1;           
            spArr.push(data[i].specialty)
          } else {
            filter[data[i].specialty]++;
          }
        }
      }
      $scope.allSpecialties = spArr; 
      $scope.diseases = diseasArr;    
           
    });

    $http({
      method  : 'GET',
      url     : "/user/get-doctors-names",
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {              
       $scope.names = data;    
    });
  }


  if($location.path() == "/special-center") {
    $http({
      method  : 'GET',
      url     : "/user/get-specialcenters",
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {              
      if(data){
       
        /*for(var i = 0; i < data.length; i++){
          if(!filter[data[i].specialty]) {
            filter[data[i].specialty] = 1;
            var keywords = (data[i].skills.length > 0) ? addDisease(data[i]) : data[i].specialty;
            centerArr.push(keywords)
          } else {
            filter[data[i].specialty]++;
          }
        }*/
        var str;
        for(var i = 0; i < data.length; i++){
          centerArr.push(data[i].specialty);
          centerArr.push(data[i].firstname);
        }

      }
      $scope.allSpecialCenter = centerArr;
    }); 
  }   


  function addDisease(item) {
    var str = "";
    for(var i = 0; i < item.skills.length; i++){
      str += item.skills[i].disease + " ";
    }

    return str;
  }                                
                                    

  $scope.cities = cities;
  templateUrlFactory.setUrl();
  var data = patientfindDoctorService;//$resource("/user/patient/find-doctor");

  $scope.find = function (skill) {
    
    if(skill === 'special-center'){
      $scope.loading = true;
      var sendObj = {};
      sendObj.item = $scope.user.item;
      sendObj.type = 'special-center';
      sendObj.city = $scope.user.city;
      data.query(sendObj,function(response){
        if(response.length > 0) {
          localManager.setValue("userInfo",response);
          $location.path("/list");
        } else {
          alert("No result found!")
        }
        $scope.loading = false;
      });          

      localManager.setValue("path","/special-center");

    } else if($scope.user.specialty || $scope.user.doctorId || $scope.user.name || $scope.user.skill || $scope.user.city || $scope.user.disease){      
      $scope.loading = true;
      if(skill !== undefined) {
        $scope.user.creteria = "skill";
      } 

      localManager.setValue("path","/find-specialist");

      switch($scope.user.creteria){
        case "doctorId":
        if($scope.user.doctorId) {
          var sendObj = {};
          sendObj.user_id = $scope.user.doctorId;
          sendObj.type = $scope.user.creteria;
          data.query(sendObj,function(data){           
            if(data.length > 0) {
              localManager.setValue("userInfo",data);
              $location.path("/list");
            } else {
              alert("No result found!");
            }
            $scope.loading = false;
          }); 
        } else {
          alert("Please enter doctor's ID");
          $scope.loading = false;
        }
        break;
        case "specialty":        
          var sendObj = {};
          sendObj.specialty = $scope.user.specialty;
          sendObj.type = $scope.user.creteria;
          sendObj.city = $scope.user.city;
          data.query(sendObj,function(data){
            if(data.length > 0) {
              localManager.setValue("userInfo",data);
              $location.path("/list");
            } else {
              alert("No result found!")
            }
            $scope.loading = false;
          });          
        break;
        case "doctorname": 
          if($scope.user.name) {        
            var sendObj = {};
            sendObj.name = $scope.user.name;
            sendObj.type = $scope.user.creteria;           
            data.query(sendObj,function(data){
              if(data.length > 0) {
                localManager.setValue("userInfo",data);
                $location.path("/list");
              } else {
                alert("No result found!")
              }

              $scope.loading = false;
            });   
          } else {
            alert("Please enter doctor's name");
            $scope.loading = false;
          }      
        break;
        case "skill":
          //alert($scope.user.skill)
          var sendObj = {};         
          sendObj.skill = $scope.user.skill; 
          $rootScope.searchItem = $scope.user.skill;
          sendObj.type = $scope.user.creteria;        
          skillProcedureService.query(sendObj,function(data){
          if(data.length > 0) {
            localManager.setValue("userInfo",data);
            $location.path("/skills-result");
            
          } else {
            alert("No result found!")
          }
          $scope.loading = false;
          });          
        break;
        case "disease":
          //alert($scope.user.skill)
          var sendObj = {};        
          sendObj.disease = $scope.user.disease;
          sendObj.type = $scope.user.creteria;   
          data.query(sendObj,function(data){
          if(data.length > 0) {
            localManager.setValue("userInfo",data);
            $location.path("/list");
            
          } else {
            alert("No result found!")
          }
          $scope.loading = false;
          });          
        break;
        default:
        break;
      }

       //save current page
      if($scope.user.creteria === "skill") {
        var user = $rootScope.checkLogIn.typeOfUser;
        if(user === "Doctor")
            localManager.setValue("currentPage","/skills-result");
        if(user === "Patient")
            localManager.setValue("currentPageForPatients","/skills-result");
        if(user === "Laboratory")
            localManager.setValue("currPageForLaboratory","/skills-result");
        if(user === "Radiology")
            localManager.setValue("currPageForRadiology","/skills-result");
        if(user === "Pharmacy")
            localManager.setValue("currPageForPharmacy","/skills-result");
        if(user === "Special_Center")
            localManager.setValue("currPageForSpecialCenter","/skills-result");
      } else {
       var user = $rootScope.checkLogIn.typeOfUser;
        if(user === "Doctor")
            localManager.setValue("currentPage","/list");
        if(user === "Patient")
            localManager.setValue("currentPageForPatients","/list");
        if(user === "Laboratory")
            localManager.setValue("currPageForLaboratory","/list");
        if(user === "Radiology")
            localManager.setValue("currPageForRadiology","/list");
        if(user === "Pharmacy")
            localManager.setValue("currPageForPharmacy","/list");
        if(user === "Special_Center")
            localManager.setValue("currPageForSpecialCenter","/list");
      }


    } else {
      alert("Please enter search criteria!")
    }

   //search($scope.user,"/user/find-group");
  }

 
  $scope.user.creteria = "doctorname";
  $scope.$watch("user.creteria",function(newVal,oldVal){
    if($scope.user.creteria === "specialty"){
      $scope.isSpecialty = true;
      $scope.isDoctorId = false;
      $scope.isName = false;
      $scope.isDisease = false;
    } else if($scope.user.creteria === "doctorname"){
      $scope.isDoctorId = false;
      $scope.isSpecialty = false;
      $scope.isName = true;
      $scope.isDisease = false;
    } else if($scope.user.creteria === "doctorId"){
      $scope.isDoctorId = true;
      $scope.isSpecialty = false;
      $scope.isName = false;
      $scope.isDisease = false;
    } else if($scope.user.creteria === "disease"){
      $scope.isDoctorId = false;
      $scope.isSpecialty = false;
      $scope.isName = false;
      $scope.isDisease = true;
    }
  });

  $http({
    method  : 'GET',
    url     : "/user/firstline-doctors", //firstline doctors refers to doctors that attends to patients with any consultation
    //requests for treatment. Examples are doctors applinic employed for attending to patients.
    headers : {'Content-Type': 'application/json'} 
  })
  .success(function(data) {   
    $scope.firstlineDoctors = data || [];
    $rootScope.$broadcast("users presence",{type: 'firstLine',data: $scope.firstlineDoctors ,sockets: $rootScope.sockets});
  });
 
  $rootScope.chatReqCount = 0;

  $scope.sendChatSingle = function(){

    var messageBody = "Hello doc";
    var partnerId;
    var docPhone;

    //Here the $scope.firstlineDoctors already has been checked in the users presence broadcasted above for online and set 
    //presence property to true;
    for(var i = 0; i < $scope.firstlineDoctors.length; i++){
      if($scope.firstlineDoctors[i].presence){
        partnerId = $scope.firstlineDoctors[i].user_id;
        docPhone = $scope.firstlineDoctors[i].phone;
        break;
      }
    }

    if(!partnerId){
      var doc = $scope.firstlineDoctors[Math.floor(Math.random() *  ($scope.firstlineDoctors.length - 1))];
      partnerId = (doc) ? doc.user_id : ""; 
      docPhone = (doc) ? doc.phone : "+2348096461927";
    }

    var noteMsg = $rootScope.checkLogIn.firstname  + " a " + $rootScope.checkLogIn.typeOfUser  +
    " wants to chat with you on Applinic Healthcare. Please login now.";

    if($rootScope.chatReqCount <= 1 ){
      var msgObj = {to: partnerId,message:messageBody,from: $rootScope.checkLogIn.user_id,
        smsMsg: noteMsg,phone: docPhone,firstname: $rootScope.checkLogIn.firstname}
    } else {
      var msgObj = {to: partnerId,message:messageBody,from: $rootScope.checkLogIn.user_id}
    }

    $scope.loading = true;

    mySocket.emit("send message general",msgObj,
      function(data){ 

      $rootScope.chatsList = chatService.chats();
      $rootScope.chatsList.$promise.then(function(result){

        $scope.loading = false;

        $rootScope.chatsList = result;

        //var byRecent = $filter('orderBy')(list,'-realTime');
        templateService.holdId = partnerId;//byRecent[0].partnerId;   
        if(deviceCheckService.getDeviceType()){
          localManager.setValue("holdIdForChat",partnerId);
          localManager.setValue("holdChatList",$rootScope.chatsList);
          window.location.href = "/mobile/chat-physician";//"/user/chat/general";
        } else if(templateService.holdId) {
          //$location.path("/general-chat");
          window.location.href = "/chat-physician";
        } else {
          alert("You have no messages yet.");
        }
      })

      $rootScope.chatReqCount++;
      
    });

  }


  $scope.getSpecialtyCategory = function(url) {
    $http.get(url)
    .success(function(result){
      $rootScope.specialtyCategoryList = result;
      $location.path('/list2');
    })
  }

  $scope.inviteDoc = function() {
    $rootScope.isDocInvite = true;
    $location.path('/invite-doctor')
  }

}]);

//list all the doctors or others
app.controller('listController',["$scope","$location","$window","localManager",
  "templateService","templateUrlFactory","ModalService","$rootScope",
  function($scope,$location,$window,localManager,templateService,templateUrlFactory,ModalService,$rootScope) { 
   //$scope.back = templateUrlFactory.getUrl();
    $scope.searchResult = localManager.getValue("userInfo");
    $scope.valid = true;
    if($scope.searchResult) {
      if($scope.searchResult.length >= 10) {
         $scope.data = true;   
      }
      if($scope.searchResult.length === 0){
        $scope.isNotFound = true;
      }
    }

    $scope.goBack = function() {      
      $location.path(localManager.getValue('path'));
    }

   

  $scope.consultation = function(doctor){
    var elementPos = $rootScope.patientsDoctorList.map(function(x){if(x) return x.doctor_id}).indexOf(doctor.user_id)
    var objFound = $rootScope.patientsDoctorList[elementPos];
    if(!objFound) {
      templateService.holdForSpecificDoc = doctor;   
      templateService.doctorsData = localManager.getValue("userInfo");
      getAHelp("book");    
    } else {
      alert("You have already accepted this doctor.")
    }
  }

  $scope.ask = function(doctor){
    //var elementPos = $scope.searchResult.map(function(x){return x.user_id}).indexOf(doctorId)
    //var objFound = $scope.searchResult[elementPos];
    $rootScope.holdcenter = doctor;   
    getAHelp("ask")
  }

  function getAnswer(type) {

  }



  function getAHelp(type) {
    var checkIsLoggedIn = localManager.getValue("resolveUser");
     if(checkIsLoggedIn.isLoggedIn) {
      //make a modal call
      if(type === "book") {
        //modalCall("selected-doc.html","bookingDocController")
        $location.path('consult-specialist');
      } else if(type === "ask") {
        //$rootScope.holdcenter set above as doctor for the modal to use 
        $rootScope.holdcenter.id = $rootScope.holdcenter.user_id;
        ModalService.showModal({
            templateUrl: 'quick-chat.html',
            controller: 'generalChatController'
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {             
            });
        });
      }
     } else {
      modalCall('login.html',"loginController");
     }
     
  }

  function modalCall(template,controller){

      ModalService.showModal({
          templateUrl: template,
          controller: controller
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
            $scope.message = "You said " + result;
          });
      });
  
  }

  
  $rootScope.$broadcast("users presence",{type: 'searchDocList',data: $scope.searchResult ,sockets: $rootScope.sockets});

  localManager.setValue("currentPageForPatients","/list");
                      
}]);

//for diagnostic and pharmaceutical center search
app.controller("findCenterController",["$scope","$http","$rootScope","ModalService",'$location',
  function($scope,$http,$rootScope,ModalService,$location){

    
    $scope.isCity = true;
    $scope.service = {};
    $scope.service.city = $rootScope.checkLogIn.city;

    var path = $location.path();

    $scope.options = function () {    
      if($scope.isCity) {
        $scope.isCity = false;
        $scope.isName = true;
      } else {
        $scope.isCity = true;
        $scope.isName = false;      
      }
    }

    $scope.$watch("service.city",function(newVal,oldVal){     
      if(newVal){
        $scope.city = newVal;
      }
    })

    $scope.findCenter = function(type) {
      $scope.loading = true;
      var url = ($scope.service.name && $scope.service.name !== undefined) ? '/user/find-center?type=' + type + "&name=" + $scope.service.name : 
      '/user/find-center?type=' + type + "&city=" + $scope.service.city;
      $http({
      method  : 'GET',
      url     : url,
      headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data) {              
        if(data) {
          $scope.loading = false;
          $scope.listOfCenter = data;  
          //centers use searchDocList for real time presence in the topheadercontroller thesame with doctors
          $rootScope.$broadcast("users presence",{type: 'searchDocList',data: $scope.listOfCenter ,sockets: $rootScope.sockets});                        
        } 
        $scope.service.name = "";
      });                          
    }


    $scope.sendChat = function(center) {
      center.id = center.user_id;
      $rootScope.holdcenter = center;
      ModalService.showModal({
        templateUrl: 'quick-chat.html',
        controller: 'generalChatController'
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {             
        });
      });
    }

  
    switch(path) {
    case '/laboratory-in':
      //getCenter('/user/getAllLaboratory')
       $scope.findCenter('Laboratory')
    break;
    case '/pharmacy-in':
      //getCenter('/user/getAllPharmarcy')
      $scope.findCenter('Pharmacy')
    break;
    case '/radiology-in':
      //getCenter('/user/getAllRadiology')
      $scope.findCenter('Radiology')
    break;
    default:
    break;
  }                    

  /*function getCenter(url) {
    $http.get(url,{params:{city:$scope.service.city}})
    .success(function(data){
      if(data) {
        $scope.centers = data.data;
      }
    })
  }*/
}]);

app.controller("drugController",["$scope","$location","$window","templateService","localManager",
  "Drugs","searchtestservice","cities","templateUrlFactory","$resource","$rootScope","dynamicService",
function($scope,$location,$window,templateService,localManager,Drugs,searchtestservice,cities,
  templateUrlFactory,$resource,$rootScope,dynamicService){
  templateUrlFactory.setUrl();
  var list = [{sn:'a'}];

  var sendObj = {}
  sendObj.city = $rootScope.checkLogIn.city;
  $scope.city = $rootScope.checkLogIn.city;

  var drugName;
  var thisCity;
  $scope.getDrug = function(name){
    drugName = name;
  }

  $scope.getCity = function(city){
    thisCity = city;
  } 
  
  $scope.drugList = list;

  $scope.add = function(){
    if(drugName !== "" && drugName !== undefined) {   
      if(!/^[A-Z]/.test( drugName))
        drugName = toTitleCase(drugName);
      var elementPos = $scope.drugs.map(function(x){return x.name}).indexOf(drugName)
      objFound = $scope.drugs[elementPos];
      if( elementPos === -1) {
            alert("There is no drug match based on your search criteria. Make sure you entered the drug name correctly.")
      } else {
        if(!list[0].name) {      
          list[0].name = objFound.name;
          list[0].id = objFound.id;      
        }
        var random = Math.floor(Math.random() * 1000);
        var obj = {};
        obj.sn = random;
        obj.name = objFound.name;
        obj.id = objFound.id;
        list.push(obj);
       
      }
    } else {
      alert('Please enter drug name')
    }

  }

  $scope.remove = function(id){    
    if(list.length > 1){
      var elementPos = list.map(function(x){return x.sn}).indexOf(id)
      var objfound = list.splice(elementPos,1);
    }
  }

 
  var resource = dynamicService; //$resource("/user/dynamic-service");
  resource.query({type:"Pharmacy"},function(data){
    $scope.drugs = Drugs.concat(data);
  });



  $scope.cities = cities;
  
  $scope.drugs = Drugs;

  

  $scope.findDrug = function(){
    $scope.loading = true;
    sendObj.city = thisCity;
     if(thisCity !== undefined && !/^[A-Z]/.test(thisCity))
         sendObj.city = toTitleCase(thisCity);  
    if(list.length === 1) {
      if(drugName !== undefined && drugName !== "") {
      if(!/^[A-Z]/.test( drugName))
         drugName = toTitleCase(drugName);     
      var elementPos = $scope.drugs.map(function(x){return x.name}).indexOf(drugName)
      objFound = $scope.drugs[elementPos];
      if( elementPos === -1) {
        alert("There is no drug match based on your search criteria. Make sure you entered the drug name correctly.");
        $scope.loading = false;
      } else {
      list[0].name = objFound.name;
      list[0].id = objFound.id;
      sendObj.drugList = list;
      templateService.holdList = sendObj.drugList;
      send(sendObj)
      }
      } else {
        alert("Enter the drug name")
        $scope.loading = false;
      }
    } else {
      var elementPos = $scope.drugs.map(function(x){return x.name}).indexOf(drugName)
      objFound = $scope.drugs[elementPos];
      list[0].name = objFound.name;
      list[0].id = objFound.id;      
      sendObj.drugList = list;
      templateService.holdList = sendObj.drugList;
      send(sendObj)
    }
    templateService.holdId = null;
  }

  //new
  $scope.notRef = true;
  $scope.search = {};
  $scope.user = {};
  $scope.search.category = "";
  var toNum;

  $scope.findWithRef = function(Id){
    $scope.loading = true;    
    sendObj.drugList = [];
    sendObj.city = thisCity;
     if(thisCity !== undefined && !/^[A-Z]/.test(thisCity))
         sendObj.city = toTitleCase(thisCity);      
    var toNum = parseInt(Id);
    var allpres = templateService.holdPrescriptions;
    var elementPos = allpres.map(function(x){return x.prescriptionId}).indexOf(toNum)
    var objFound = allpres[elementPos];

    if(elementPos !== -1){
      if(objFound.ref_id){
        templateService.holdId = objFound.ref_id;
        templateService.holdPrescriptionId = objFound.prescriptionId;
      } else {
        templateService.holdId = null;
      } 
    } else {
      alert("Prescription not found!");
       $scope.loading = false;
    }

    if( elementPos !== -1) {
      var objList = objFound.prescription_body;
      for(var i = 0; i < objList.length; i++) {
        //var elemPos = Drugs.map(function(x){return x.name}).indexOf(objList[i].drug_name);
        //if(elemPos === -1){
          //alert(objList[i].drug_name + " not found");

          //return;
       // } else {
        
        sendObj.drugList.push({
          name: objList[i].drug_name
        });        
        //}
        
      }

      send(sendObj);

    } else {
      alert("Prescription not found!");
      $scope.loading = false;
    }
  }

  $scope.$watch("search.category",function(newVal,oldVal){
    if(newVal === "Prescription ID") {
      $scope.isRef = true;
      $scope.notRef = false;
    } else {
      $scope.isRef = false;
      $scope.notRef = true;
    }
  })

  

  function toTitleCase(str)
  {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  function send(data){
    $scope.isLoading = true;
    $rootScope.genRefId = parseInt(Math.floor(Math.random() * 9999) + "" + Math.floor(Math.random() * 9999));
    searchtestservice.find(data,"/user/pharmacy/search/find-drugs","/pharmacy/drug-search/result")
  }
  
}]);

app.controller("drugsAndKitsCtrl",["$scope","$rootScope","$http","ModalService","localManager","dynamicService",
  function($scope,$rootScope,$http,ModalService,localManager,dynamicService){
    $scope.drug = {};
    $scope.drug.address = $rootScope.checkLogIn.address;
    $scope.drug.phone = $rootScope.checkLogIn.phone;
    $scope.drug.package = "";
    $scope.drug.city = $rootScope.checkLogIn.city || "";

    localManager.setValue("currentPageForPatients","/drugs-and-kits");

    $scope.isSelected = "Anti Malaria";

    $scope.dosageList = ["caplets","capsule","packet","bottle","sachet","tablets","vial",
    "ampoule","suppository","syrup","carton","ointment","pints","pieces","bags"];


    var resource = dynamicService; 
    resource.query({type:"Pharmacy"},function(data){
      $scope.drugs = data;
    });

    var filter = {};

    $http.get("/drug-kits/all")
    .success(function(response){
      //$scope.allKits = response;
     
      response.forEach(function(item){
        if(!filter.hasOwnProperty(item.disease)){
          filter[item.disease] = {};
          filter[item.disease].disease = item.disease;
          filter[item.disease].name = item.name;
          filter[item.disease].note = item.note;
          filter[item.disease].package = item.package || 0;
          filter[item.disease].type = item.type;
          filter[item.disease]['content'] = [];//item.content;
          filter[item.disease]['content'].push({
            package: item.package,
            content: item.content 
          })
        } else {  
          //filter[item.disease].name = item.name;
          //filter[item.disease].package = item.package;
          //filter[item.disease]['content'] = item.content;
          filter[item.disease]['content'].push({
            package: item.package,
            content: item.content 
          })    
         
        }
      })

      $scope.allKits = Object.keys(filter);
      getKit("Drug",'Malaria');
      //$scope.filteredKits = filter;
    })



    

    function getKit(type,name) {
      //$scope.kitLoading = true;
      /*$http.get("/drug-kits",{params:{type:type,name:name}})
      .success(function(data){
        $scope.kitLoading = false;
        $scope.selectedPackage = {}; 
        if($scope.isSelected == 'Other')  
          $scope.selectedPackage.content = [{sn:1}];   

        $scope.drug.package = (data[0]) ? data[0]._id : "";
        $scope.kits = data || [];
      });*/

      if($scope.isSelected == 'Other')  {
        $scope.selectedPackage2 = {};
        $scope.selectedPackage2.content = [{sn:1}]; 
        $scope.isSelfCompile = true;
      } else {
        $scope.isSelfCompile = false;
      }

      $scope.isNewKit = true;

      if($scope.drug.package){
        $scope.drug.package = null;
      }

      $scope.kits = filter[name];
      $scope.isJoined = false;
    }


    $scope.selectedKit = function(type,name){
      if($scope.isSelected === 'Other'){
        $scope.isSelected = null;
      } else {
        $scope.isSelected = name;
      }

      getKit(type,name);
      
    }



    var count = {};
    count.num = 1;
   
    $scope.addDrug = function(){  
      var newDrug = {};         
      count.num++;
      newDrug.sn = count.num;
      $scope.selectedPackage2.content.push(newDrug);
    }

    $scope.remove = function(id){ 
      if($scope.selectedPackage2.content.length > 1){
        /*var elementPos = $scope.selectedPackage.content.map(function(x){return x.sn}).indexOf(id);
        if($scope.selectedPackage.content[elementPos]){
          var objfound = $scope.selectedPackage.content.splice(elementPos,1);
          count.num = 1;
          $scope.selectedPackage.content.forEach(function(item){
            item.sn =  count.num;
            count.num++;
          })
        }*/
        $scope.selectedPackage2.content.pop();
        count.num--;
      }
    }

    $scope.find = function(){
      $scope.loading =  true;
      $http.get("/user/patient/getAllPharmacy",{params:{city:$scope.drug.city,type:'Pharmacy'}})
      .success(function(centers){
        $scope.centers = centers
        $scope.loading = false;
      })
    }

    $scope.find();
    //getKit("Drug",'Malaria');

    var elem;

    $scope.$watch("drug.package",function(newVal,oldVal){
      if(newVal){
        $scope.isNewKit = false;
        elem = $scope.kits.content.map(function(x){ if(x) { return x.package.toString()}}).indexOf(newVal);
        if(elem !== -1){
          $scope.selectedPackage = $scope.kits.content[elem];

          if($scope.centers){
            $scope.centers.forEach(function(item){
              if(item.success == true)
                item.success = false;
            })
          }
      
        }
      }
    });

    $scope.$watch('drug.kitsList',function(newVal,oldVal){    
      if(newVal == 'Other'){
        $scope.isSelected = 'Other';
        getKit('Drug',newVal);
      } else {
        $scope.isSelected = newVal
        getKit('Drug',newVal);
      }
    })


  $scope.sendChat = function(center) {
    var kit = ($scope.isSelfCompile) ? $scope.selectedPackage2 : $scope.selectedPackage;
    if(kit) {
      $rootScope.searchItems = "";
      kit.content.forEach(function(item){
        $rootScope.searchItems += item.drug_name + ", "
      })
     
      $rootScope.searchItemType = "drug(s)";     
      $rootScope.holdcenter = center;
      $rootScope.holdcenter.id = center.user_id;
      ModalService.showModal({
            templateUrl: 'quick-chat.html',
            controller: 'generalChatController'
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {             
            });
      });

    } else {
      alert("No kit or Drug was selected.")
    }

  }

  var sendObj;

  $scope.forwardDrug = function(center) {

    if($scope.selectedPackage || $scope.selectedPackage2){  

    var content = ($scope.isSelfCompile) ? $scope.selectedPackage2.content : $scope.selectedPackage.content;

      if(content.length == 0){
        alert("No kit or Drug was selected. Please choose a kit or compile your own drug list.");
        return;
      }

      var presId = Math.floor(Math.random() * 99999) + "" + Math.floor(Math.random() * 99999);
      var url;
      var method;
      //var content = ($scope.isSelfCompile) ? $scope.selectedPackage2.content : $scope.selectedPackage.content;
      var checkFilled;
      content.forEach(function(item){ 
        if(item.dosage){   
          checkFilled = item.dosage.split(" ")
          item.dosage = (checkFilled.length > 1) ? checkFilled[1] : item.dosage;
        }

        item.dosage = (item.quantity) ? (item.quantity + " " + item.dosage) : item.dosage;      
      })

     
  
      if($scope.drug.courier){

        var intRegex = /[0-9 -()+]+$/;

        if(intRegex.test($scope.drug.phone)){
          if($scope.drug.phone.indexOf('+') == -1) {
            var newSlice = $scope.drug.phone.slice(1);
            $scope.drug.phone = "+234" + newSlice;
          }
        } else {
          alert("You selected home delivery option. Please check to see if you entered a valid" +
          " mobile phone number we can use to contact you while delivering the package.")
          return;
        }

        sendObj = {
          city: $rootScope.checkLogIn.city,
          location: $scope.drug.address,
          center_id: center.user_id,
          phone1: $scope.drug.phone,
          phone2: $rootScope.checkLogIn.phone,
          address: $scope.drug.address,
          prescriptionId: presId,
          refId: null,
          prescription_body : content,
          centerInfo: center,
        }

        url = "/user/courier";
        method = "POST";

      } else {

        sendObj = {
          prescription_body : content,    
          user_id : center.user_id,
          provisional_diagnosis: ($scope.isSelfCompile) ? $scope.selectedPackage2.disease :  $scope.selectedPackage.disease,
          explanation: ($scope.isSelfCompile) ? ($scope.selectedPackage2.name + " self medication package") 
          : ($scope.selectedPackage.name + " self medication package"),
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
          patient_address: $rootScope.checkLogIn.address,
          patient_gender: $rootScope.checkLogIn.gender,
          patient_age: $rootScope.checkLogIn.age,
          patient_city: $rootScope.checkLogIn.city,
          patient_country: $rootScope.checkLogIn.country,
          patient_phone: $rootScope.checkLogIn.phone,
          is_paid: false,
          sender: "patient"
        }

        url = "/user/patient/pharmacy/referral-by-patient";
        method = "PUT";
      }

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

          if($scope.drug.courier){
            alert("You have requested home delivery of the selected kit or drugs."
            + " Please check motorcycle icon for update on the request.");
            $rootScope.$broadcast("new courier order",{status:true})
          }

        } else {          
          alert("Prescription not sent! Some error occured. Please try again shortly.");
        }
        center.loading = false;
      });
      
    } else {
      alert("No kit or Drug was selected. Please choose a kit or compile your own drug list.");
      return;
    }

  }



}])


app.controller("drugSearchResultController",["$scope","$location","$rootScope","$resource",
  "templateService","localManager","ModalService","centerProfileService","$rootScope",
  function($scope,$location,$rootScope,$resource,templateService,localManager,ModalService,centerProfileService,$rootScope){
  $scope.drugResult = templateService.holdSearchResult; 

  $scope.criteria = templateService.holdList;
  $scope.drugFilter = {};
  
  var searchStr = $scope.drugResult.full[0] || $scope.drugResult.less[0];
  $rootScope.foundDrugArr = [];



  if(searchStr){
    var arr = searchStr.str.split(',')
    var count = 1
    arr.forEach(function(item){
      $rootScope.foundDrugArr.push({
        drug_name: item,
        sn: count
      })
      count++;
    })
  }
  $scope.getStr = function(str,by){
    var newStr = "";
    var strArr = str.split(",");
    for(var i = 0; i < strArr.length; i++){
      if(by)
        newStr += "<span>@" + strArr[i] + "* </span>";
      else 
         newStr += "<span>@" + strArr[i] + " </span> ";
    }
    return newStr;
  }

  $scope.addedBy = function(by){
    if(by)
      return true
    else
      return false
  }

  $scope.notStr = function(arr) {
    var newStr = "";
    for(var i = 0; i < arr.length; i++){
      newStr += "@" + arr[i].name + " ";
    }

    return newStr;
  }

  $rootScope.$broadcast("users presence",{type: 'searchList',data: templateService.holdSearchResult ,sockets: $rootScope.sockets}); 

  $scope.toViewProfile = function(centerId){
    templateService.holdId = centerId;
    var resource = centerProfileService; //$resource("/user/center-profile");
    resource.get({id:templateService.holdId},function(center){
      $rootScope.center = center;
      callModal()
    });

    function callModal() {
      ModalService.showModal({
            templateUrl: 'view-center-profile.html',
            controller: "viewCenterProfileController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {             
          });
      });
    }
  }

  $scope.toForward = function(center) {    
    var isLogged = localManager.getValue("resolveUser");
    if(!isLogged.isLoggedIn) {
      window.location.href = "/login";
    } else {
      $rootScope.typeOfSearch = "pharmacy";
      if(templateService.holdId)
        center.ref_id = templateService.holdId;
      templateService.holdTheCenterToFowardPrescriptionTo = center;
      //$location.path("/drug/selected-pharmacy");
      ModalService.showModal({
        templateUrl: 'search-result.html',
        controller: "searchSelectedCenterController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
         
      });
    });

    }
  }

  var user = $rootScope.checkLogIn;

  $scope.courier = function(center) {
    
     if(user.typeOfUser !== "Pharmacy") {

      var drugArr = center.str.split(",");  
      if($rootScope.back)
        $rootScope.back = "";

      $rootScope.currPath = "/pharmacy/drug-search/result";

      for(var i = 0; i < drugArr.length; i++){
        var drugObj = {};
        drugObj.sn = i + 1;
        drugObj.drug_name = drugArr[i];
        drugObj.dosage = "";
        drugObj.frequency = "";
        drugObj.duration = "";
        drugArr[i] = drugObj;
      }

      var presId = Math.floor(Math.random() * 99999999);
      var refId = parseInt(Math.floor(Math.random() * 9999) + "" + Math.floor(Math.random() * 9999));
     
      $rootScope.holdPresDataForCourier = { 
        name: center.name,
        email: center.email,
        address: center.address,
        city: center.city,
        country: center.country,
        id: center.id,
        phone: center.phone,
        str: center.str,
        type: 'inperson',
        prescriptionId: presId,
        user_id: center.id,
        sent_date: new Date(),
        prescription_body: drugArr,
        ref_id: refId,
        initViaCourier: true
      }


      $rootScope.selectedPrescription = {
        doctor_city: "",
        doctor_country: "",
        doctor_firstname: "",
        doctor_id: "",
        doctor_lastname: "",
        patient_address: user.address,
        patient_city: user.city,
        patient_country: user.country,
        patient_id: user.user_id,
        patient_profile_pic_url: user.profile_pic_url,
        prescriptionId: presId,
        prescription_body: drugArr,
        ref_id: refId
      }

      $location.path('courier');

    }


  }

  $scope.sendChat = function(center,items) {
    $rootScope.searchItems = items;
    $rootScope.searchItemType = "drug(s)";
    $rootScope.holdcenter = center;
    ModalService.showModal({
          templateUrl: 'quick-chat.html',
          controller: 'generalChatController'
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {             
          });
    });
  }

}]);


app.controller("courierController",["$scope","$rootScope","$location","$http","localManager","Drugs","cities","courierResponseService",
function($scope,$rootScope,$location,$http,localManager,Drugs,cities,courierResponseService){
  $rootScope.back = (!$rootScope.back) ? $rootScope.currPath : ($rootScope.back || localManager.getValue("currentPageForPatients") );
  $scope.user = {}//$rootScope.selectedPrescription;


  $scope.filteredPres = [];
  $scope.noDosage = []
  for(var k = 0; k < $rootScope.selectedPrescription.prescription_body.length; k++) {
    if($rootScope.selectedPrescription.prescription_body[k].picked){
      $scope.filteredPres.push($rootScope.selectedPrescription.prescription_body[k]);
    }

    if(!$rootScope.selectedPrescription.prescription_body[k].dosage || !$rootScope.selectedPrescription.prescription_body[k].frequency){
      $rootScope.selectedPrescription.prescription_body[k].addDosage = true;
      $scope.noDosage.push($rootScope.selectedPrescription.prescription_body[k])
    }
  }

  $scope.presInfo = $rootScope.selectedPrescription;
  //$scope.presInfo.prescription_body = (filteredPres.length === 0) ? $rootScope.selectedPrescription.prescription_body : filteredPres;
  $scope.cities = cities;


  $scope.returnMain = function(item) {
    item.dosage = "";
    item.other = undefined;
    item.quantity = 0;
  }

  $http.get("/user/courier-centers")
  .success(function(response){
    $scope.centerList = response ||  [];
    $scope.user.city = $rootScope.checkLogIn.city;
    $scope.user.location = $rootScope.checkLogIn.address;
  });
 
  $scope.sendRequest = function(){
    $scope.phoneMsg = "";
    $scope.centerMsg = "";

    if(!$scope.user.center_id) {
      $scope.centerMsg = "Please choose center that will attend to your request.";
      return;
    }

    if($scope.user.phone1) {
      /*if($scope.user.phone1.slice(0,1) != "+") {
        $scope.phoneMsg = "Phone number format incorrect!";
        return;
      }*/
    } else {
      $scope.user.phone1 = $rootScope.checkLogIn.phone;
    }

    if($scope.user.phone2) {
       /*if($scope.user.phone2.slice(0,1) != "+") {
        $scope.phoneMsg = "Phone number format incorrect!";
        return;
      }*/

    } else {
      $scope.user.phone2 = $rootScope.checkLogIn.phone;
    }

    if(!$scope.user.location) {
       $scope.user.location = $rootScope.checkLogIn.address;
    }

    var newArr = [];
    var presArr = ($scope.filteredPres.length > 0) ? $scope.filteredPres : $rootScope.selectedPrescription.prescription_body;
    for(var j = 0; j < presArr.length; j++){
      var quantity = presArr[j].quantity || 1;
      var drObj = {};

      if(!presArr[j].dosage){
        alert("Please add description/dosage for all drugs.");
        return;
      } 

      if(presArr[j].addDosage){
          drObj.dosage = (presArr[j].dosage === 'dosage') ?
           ( presArr[j].other + " ( " + quantity + " )" ) :
            presArr[j].dosage + " ( " + quantity + " ) ";
      } else {
        drObj.dosage = presArr[j].dosage;
      }

      drObj.drug_name = presArr[j].drug_name;
      drObj.duration = presArr[j].duration;
      drObj.frequency = presArr[j].frequency;
      drObj.quantity = presArr[j].quantity;
      drObj.sn = presArr[j].sn;
      drObj._id = presArr[j]._id;

      newArr.push(drObj);
    }

   
    if($scope.user.phone1) {

      var check = confirm("Our courier service will include extra charges on top the actual cost of the drugs. Do you understand?");
      if(check) {
        $scope.loading = true;
        $scope.user.address = ($scope.user.location !== "" && $scope.user.location !== undefined) ? $scope.user.location : "" + 
        $scope.presInfo.patient_address + "," + $scope.presInfo.patient_city + "," + $scope.presInfo.patient_country;

        $scope.user.prescriptionId = $rootScope.selectedPrescription.prescriptionId;

        $scope.user.refId = $rootScope.selectedPrescription.ref_id;

        $scope.user.prescription_body = newArr;

        var elemPos = $scope.centerList.map(function(x){return x.user_id}).indexOf($scope.user.center_id);
        if(elemPos != -1) {
          $scope.user.centerInfo = $scope.centerList[elemPos];
        }

        $http({
          method  : 'POST',
          url     : "/user/courier",
          data    : $scope.user,
          headers : {'Content-Type': 'application/json'} 
          })
        .success(function(data) {
          $scope.loading = false;
          if(data.status) {
            $scope.status = 'Courier request sent!';         
            $rootScope.$broadcast("new courier order",{status:true});

            getCourier(data._id);

            if($rootScope.holdPresDataForCourier) {
              var url = "/user/drug-search/pharmacy/referral";
              $http({
                method  : 'PUT',
                url     : url,
                data    : $rootScope.holdPresDataForCourier,
                headers : {'Content-Type': 'application/json'} 
                })
              .success(function(data) {
                if(data.success){
                  $rootScope.holdPresDataForCourier = null;
                }
              });

            }

          } else {
            alert("OOps! something went wrong while sending your request. Try again")
          }
        });
      } 
    } else {
      $scope.info = "Please complete the fields for phone1"
      setTimeout(function(){
        $scope.$apply(function(){
          $scope.info = ""
        })
      },3000);
    }
  }

  function getCourier(id) {
    var courierResponse = courierResponseService;
    courierResponse.get({_id: id},function(data){
      $rootScope.courierResponse = data;
      var pt = '/courier-response/' + Math.floor(Math.random() * 99999999);
      localManager.setValue("currentPageForPatients",pt);
      localManager.setValue("holdCourierData",data);
      $location.path(pt);
    });
  }

}]);

app.controller("scanSearchResultController",["$scope","$location","$rootScope","$resource",
  "templateService","localManager","ModalService","centerProfileService",
  function($scope,$location,$rootScope,$resource,templateService,localManager,ModalService,centerProfileService){
  $scope.testResult = templateService.holdSearchResult;
  $scope.criteria = templateService.holdList;
  $scope.testFilter = {};
  $scope.getStr = function(str,by){
    var newStr = "";
    var strArr = str.split(",");
    for(var i = 0; i < strArr.length; i++){
      if(by)
        newStr += "<span>@" + strArr[i] + "*</span> "
      else 
        newStr += "<span>@" + strArr[i] + "</span> "
    }
    return newStr;
  }

  $scope.notStr = function(arr) {
    var newStr = "";
    for(var i = 0; i < arr.length; i++){
      newStr += "@" + arr[i].name + " "
    }

    return newStr;
  }

  $scope.back = "#/scan-search";


  $rootScope.$broadcast("users presence",{type: 'searchList',data: templateService.holdSearchResult ,sockets: $rootScope.sockets}); 

  $scope.toViewProfile = function(centerId){
    var resource = centerProfileService;
    resource.get({id:centerId},function(center){
      $rootScope.center = center;
      callModal()
    });

    function callModal() {
      ModalService.showModal({
            templateUrl: 'view-center-profile.html',
            controller: "viewCenterProfileController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {             
          });
      });
    }
  }


  $scope.toForward = function(center) {    
    var isLogged = localManager.getValue("resolveUser");
    if(!isLogged.isLoggedIn) {
      window.location.href = "/login";
    } else {
      $rootScope.typeOfSearch = "diagnostic";
      templateService.holdTheCenterToFowardPrescriptionTo = center;
      //$location.path("/scan/selected-radiology");
      ModalService.showModal({
        templateUrl: 'search-result.html',
        controller: "scanSearchSelectedCenterController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
         
      });
    });
    }
  }

  $scope.sendChat = function(center,items) {
    $rootScope.searchItems = items;
    $rootScope.searchItemType = "investigation(s)";
    $rootScope.holdcenter = center;
    ModalService.showModal({
          templateUrl: 'quick-chat.html',
          controller: 'generalChatController'
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {             
          });
    });
  }

}]);


app.controller("testSearchResultController",["$scope","$location","$rootScope","$resource",
  "templateService","localManager","ModalService","centerProfileService",
  function($scope,$location,$rootScope,$resource,templateService,localManager,ModalService,centerProfileService){

  $scope.testResult = templateService.holdSearchResult;
  $scope.criteria = templateService.holdList;
  $scope.testFilter = {};
  $scope.getStr = function(str,by){
    var newStr = "";
    var strArr = str.split(",");
    for(var i = 0; i < strArr.length; i++){
      if(by)
        newStr += "<span>@" + strArr[i] + "* </span> ";
      else
        newStr += "<span>@" + strArr[i] + " </span> ";
    }
    return newStr;
  }

  $scope.notStr = function(arr) {
    var newStr = "";
    for(var i = 0; i < arr.length; i++){
      newStr += "@" + arr[i].name + " "
    }

    return newStr;
  }

  $rootScope.$broadcast("users presence",{type: 'searchList',data: templateService.holdSearchResult ,sockets: $rootScope.sockets}); 

  $scope.back = "#/search-test";

  $scope.toViewProfile = function(centerId){
    var resource = centerProfileService//$resource("/user/center-profile");
    resource.get({id:centerId},function(center){
      $rootScope.center = center;
      callModal()
    });

    function callModal() {
      ModalService.showModal({
            templateUrl: 'view-center-profile.html',
            controller: "viewCenterProfileController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {             
          });
      });
    }
  }


  $scope.toForward = function(center) {    
    var isLogged = localManager.getValue("resolveUser");
    if(!isLogged.isLoggedIn) {
      window.location.href = "/login";
    } else {
      $rootScope.typeOfSearch = "diagnostic";
      templateService.holdTheCenterToFowardPrescriptionTo = center;
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
  }

  $scope.sendChat = function(center,items) {
    $rootScope.searchItems = items;
    $rootScope.searchItemType = "investigation(s)";
    $rootScope.holdcenter = center;
    ModalService.showModal({
          templateUrl: 'quick-chat.html',
          controller: 'generalChatController'
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {             
          });
    });
  }


}]);

app.controller("skillListController",["$scope","$location","$http","$rootScope","localManager","templateService","ModalService",
  function($scope,$location,$http,$rootScope,localManager,templateService,ModalService){
  $scope.searchResult = localManager.getValue("userInfo");
  $scope.filter = {};

  $scope.viewProcedure = function(skill){
   $rootScope.userSkill = skill;
   ModalService.showModal({
      templateUrl: 'skill-modal.html',
      controller: "modalViewSkillController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
         
      });
    });
  }

  $scope.referToMe = function(skill){
    $rootScope.userSkill = skill;
    ModalService.showModal({
        templateUrl: 'doctor-refer-to-me.html',
        controller: "referToMeModalController"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
    });
  }
   
}]);

app.controller("manageDoctorsListCtr",["$scope","$location","$rootScope","$http","ModalService",
  "$interval","templateService","localManager","mySocket","$interval","deviceCheckService",
  "profileDataService","chatService","$filter",
function($scope,$location,$rootScope,$http,ModalService,$interval,templateService,
  localManager,mySocket,$interval,deviceCheckService,profileDataService,chatService,$filter){

  $http.get('/user/firstline-doctors')
  .success(function(data){
    $rootScope.firstLineDoctors = [];
    data.forEach(function(item){
      $rootScope.firstLineDoctors.push({
        doctor_firstname: item.firstname,
        doctor_id: item.user_id,
        doctor_lastname: item.lastname,
        doctor_profile_pic_url: item.profile_pic_url,
        doctor_specialty: item.specialty,
        doctor_city: item.city,
        doctor_title: item.title,
        access: item.access,
        work_place: item.work_place
      })
    })

    $scope.hasLoaded = true;
    
    $rootScope.$broadcast("users presence",{type: 'firstLine',data: $rootScope.firstLineDoctors,sockets: $rootScope.sockets});

    showUnreadActionIndictor($rootScope.firstLineDoctors)
    ptApp($rootScope.firstLineDoctors);

  });

  //Attach indicator to pres, lab, radio or appointment that has not been read
  function showUnreadActionIndictor(list) {
    //console.log($rootScope.unreadIndication)
    if(list){
      var elm;
      list.forEach(function(doc){
         doc.indicators = $rootScope.unreadIndication;
        //elm = $rootScope.unreadIndication.map(function(x){return x}).indexOf(doc.doctor_id)
        //if(elm !== -1){
         // doc.indicators = true;
        //}
      })
    }
  }

  showUnreadActionIndictor($rootScope.patientsDoctorList)

  $scope.removePatient = function(doctor){
    var message = "You want to remove "  
    + doctor.doctor_lastname + " " + doctor.doctor_firstname + " from your account?";

    var check = confirm(message);

    if(check) {
      doctor.isLoading = true;
      $http({
        method  : 'PUT',
        data    : {doctorId: doctor.doctor_id},
        url     : "/user/patient/my-doctors", 
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data) {
        //alert(data.message)
        if(data.status) {
          var elemPos = $rootScope.patientsDoctorList.map(function(x){return x.doctor_id}).indexOf(doctor.doctor_id);
          if(elemPos !== -1) {
            $rootScope.patientsDoctorList.splice(elemPos,1)
          }
        }
        doctor.isLoading = false;
      });
    }
  }

  $scope.popup = function(doctor){
    $rootScope.patientsDoctorList.forEach(function(item){
      if(item.isManage)
        item.isManage = false
    })
    doctor.isManage = true;
  }

  $scope.closePop = function(doctor){
    doctor.isManage = false;
  }

  $scope.videoChat = function(docObj) {
    var source = profileDataService;    
    source.get({userId: docObj.doctor_id },function(data) {
      data.type = 'Video Call';
      data.presence = docObj.presence;
      $rootScope.docInfo = data;
      templateService.holdForSpecificDoc = data;
      ModalService.showModal({
        templateUrl: 'sending-communication-request.html',
        controller: "videoInitController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
      });
    });   
  }


  $scope.audioChat = function(docObj){
    var source = profileDataService;    
    source.get({userId: docObj.doctor_id },function(data) {
      data.type = 'Audio Chat';
      data.presence = docObj.presence || docObj.status;
      $rootScope.docInfo = data;
      templateService.holdForSpecificDoc = data;
      /*$rootScope.holdPartner = {
        type: data.type,
        partnerId: data.user_id
      }*/

      ModalService.showModal({
        templateUrl: 'sending-communication-request.html',
        controller: "audioInitController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
      });
    });   
  }


  $scope.viewChat2 = function(doctorId) { 
    var messageBody = "Hello!";
    var partnerId = doctorId;
    $scope.loading = true;

    var msgObj = {to: partnerId,message:messageBody,from: $rootScope.checkLogIn.user_id};

    mySocket.emit("send message general",msgObj,
      function(data){ 
      //var list = $rootScope.chatsList;

      $rootScope.chatsList = chatService.chats();
      $rootScope.chatsList.$promise.then(function(result){

        $scope.loading = false;

        $rootScope.chatsList = result;

        //var byRecent = $filter('orderBy')($rootScope.chatsList,'-realTime');
        templateService.holdId = partnerId;//byRecent[0].partnerId;   
        if(deviceCheckService.getDeviceType()){
          localManager.setValue("holdIdForChat",partnerId);
          localManager.setValue("holdChatList",$rootScope.chatsList);
          window.location.href = "/user/chat/general";
        } else if(templateService.holdId) {
          $location.path("/general-chat");
        } 
      });
    });
  }

  $scope.appointments = function(sessionId){
     templateService.holdId = sessionId;
     ModalService.showModal({
        templateUrl: 'appointment-modal-view.html',
        controller: "selectedAppointmentControllerForPatient"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {            
      });
    });
  }

  $scope.refresh = function() {
    //ptApp()
    $http.put("/user/patient/appointment/view")
    .success(function(data){
      $scope.allApp = data;
      ptApp($scope.allApp.active);
    })
  }

  $scope.consultationFee = function(doc) {
    $http.get("/user/patient/consultation-fee",{params:{isMultiple: true}})
    .success(function(data){
      $rootScope.docModalObj = doc;
      $rootScope.patientConsultationFees = data;
      ModalService.showModal({
        templateUrl: 'patient-consult-fee-modal.html',
        controller: "patientConsultFeeModalCtrl"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {            
        });
      });
    })
  }
  
  function ptApp(list) {
    var filter = {};
    list.forEach(function(p){
      if(!filter[p.doctorId]){       
        filter[p.doctorId] = 1;
        var ptPos = $rootScope.patientsDoctorList.map(function(x){return x.doctor_id}).indexOf(p.doctorId)
        if($rootScope.patientsDoctorList[ptPos]){
          $rootScope.patientsDoctorList[ptPos].isNewAppointment = true;
          $rootScope.patientsDoctorList[ptPos].sessionId = p.session_id;
          if(checkDueAppointment(p.date,p.time))
            $rootScope.patientsDoctorList[ptPos].appDate = checkDueAppointment(p.date,p.time);
        }
      } 
    })
  }

  var d,
      t,
      hr,
      stMin;

  function checkDueAppointment(dt,time) {
    d = new Date(dt)
    t = new Date(time);    
    hr = d.getHours() + t.getHours();
    stMin = d.getMinutes() + t.getMinutes();
    d.setHours(hr);
    d.setMinutes(stMin)
    return checkIsInTime(d);//moment().isBefore(moment(d).subtract(0, 'hours'));
  }

  function checkIsInTime(d) {
    var time = moment().isBefore(moment(d).subtract(0, 'hours'))
    return (time) ? d : null;
  }

  /*setTimeout(function(){
    ptApp()
  },3000)*/


  /*$scope.$watch('firstLineDoctors',function(newVal,oldVal){
    $scope.hasLoaded
    if(oldVal && $scope.hasLoaded) {
      updateAccess({isPermission: true, docList: newVal})
    }
  },true)*/

  /*$scope.$watch('patientsDoctorList',function(newVal,oldVal){
    if(oldVal && $scope.hasLoaded){
      updateAccess({isPermission: true, docList: newVal})
    }
  },true)*/

  $scope.updateAccess = function(doc) {
    $http.post('/user/manage-access',doc)
    .success(function(resp){     
      alert(resp.message)
    })
  }


  $scope.inviteDoc = function() {
    $rootScope.isDocInvite = true;
    $location.path('/invite-doctor')
  }

  /*moment.updateLocale('en', {
    calendar : {
      lastDay : '[Yesterday]',
      sameDay : '[Today]',
      nextDay : '[Tomorrow]',
      lastWeek : '[last] dddd',
      nextWeek : 'dddd',
      sameElse : 'L'
    }
  });*/

   $scope.refresh();
  
}]);


app.controller("patientConsultFeeModalCtrl",["$scope","$http","templateService","$location",
  function($scope,$http,templateService,$location){
  $scope.makePayment = function(fee) {
    templateService.holdId = fee._id;
    $location.path('consultation-fee/' + 1);
  }
}])


app.controller("walletController",["$scope","$http","$rootScope","$location","ModalService","requestManager",
  "templateService","localManager","$resource","walletService","$filter","paymentVerificationService","userVerifyService",
  "getMyDoctorService","consultationAccptanceService","phoneCallService",
  function($scope,$http,$rootScope,$location,ModalService,requestManager,templateService,
    localManager,$resource,walletService,$filter,paymentVerificationService,userVerifyService,
    getMyDoctorService,consultationAccptanceService,phoneCallService){
  $scope.viewInvoice = false;
  var user = localManager.getValue("resolveUser");
  $scope.pay = {};
  $scope.pay.pin = "";
  $scope.pay.mode2 = "Pay with Card/Bank Account";

  /*$scope.goBack = function () {
    $location.path(localManager.getValue("currentPageForPatients"))
  }*/

  $scope.$watch("pay.mode2",function(newVal,oldVal){
    if(newVal){
      
      switch(newVal) {
        case "Pay with Card/Bank Account":
          $scope.isATM = true;
          $scope.isBank = false;
          $scope.isUSSD = false;
          $scope.isVoucher= false;
        break;
        case "Pay through Bank Deposit":
          $scope.isATM = false;
          $scope.isBank = true;
          $scope.isUSSD = false;
          $scope.isVoucher = false;
        break;
        case "Pay with USSD":
          $scope.isATM = false;
          $scope.isBank = false;
          $scope.isUSSD = true;
          $scope.isVoucher = false;
        break;
        case "Voucher":
          $scope.isATM = false;
          $scope.isBank = false;
          $scope.isUSSD = false;
          $scope.isVoucher = true;
        break;
        default:
        break;
      }
    }
  });

  /**** pin recharge logic *****/

  //auto sending voucher for account top up. this reads the length of in put and sends the voucheer when length is 16
  
  $scope.$watch("pay.pin",function(newVal,oldVal){
    if(newVal.length === 16){
      send($scope.pay.pin);
    }
  });

  function send(data) {
    var pin = data;
    var str = "";
    var date = + new Date();
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
    var newStr = str.replace(/\s*$/,"");//removes an empty space at the end of string.
    var payObj = {
      date: date,
      pin: newStr,
      message: "Account top up"
    }
    var User = walletService.resource("/user/account/pin-top-up",{userId: null},{top_up:{method:'PUT'}});
    var topUp = User.top_up(payObj,function(data){
      if(data.error) {
        alert(data.error)
      } else if(data.success){
        alert(data.success);
        //$rootScope.balance = "NGN" + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $rootScope.$broadcast('debit',{status: true})
      }
    });
  }

  /***** end of pin recharge logic ***/


  localManager.setValue("currentPageForPatients",'wallet');

  /****paystack ************/
  var customer = $rootScope.checkLogIn;

  $scope.paystatusMsg = "";
  //var toStrAmount = (!$scope.pay.amount) ? null : $scope.pay.amount.toString();
  $scope.reference = genRef();
 
  //The customer's email address. 
  $scope.email = customer.email;

  $scope.pay.amount = null;



  //status check

  $scope.status = function() {   
    $scope.paystackLoad = "Loading Paystack..."
  }
  
  //Amount you want to bill the customer 
  //$scope.amount = toStrAmount;
  
  //Metadata is optional 
  $scope.metadata = {
    custom_fields: [
      {
        display_name: "Mobile Number",
        variable_name: "mobile_number",
        value: customer.phone
      }
    ]
  };

 
  
  //Javascript function that is called when the payment is successful 
  $scope.callback = function (response) {    
      delete $scope.paystackLoad;
      $scope.paystackLoad = "Loading Paystack...";
      //$scope.$apply(function(){
        //$scope.reference = genRef();
     // }); 
      if(response) {
        verifyTransaction(response);        
      }
  };


  
  //Javascript function that is called if the customer closes the payment window 
  $scope.close = function () {
    //alert("Paystack closed")
    $scope.paystackLoad = "";
  };

  function verifyTransaction(data) {
   $http({
      method  : 'POST',
      url     : "/user/paystack/payment-verify",
      data    : data,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {    

      if(!data.error) {
        /*var whole = Math.round(data.balance);
        var format = "NGN" + whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $rootScope.balance = format;
        //$rootScope.alertService(3,data.message);
        $scope.paystackLoad = ""; 
        $rootScope.paystatusMsg = data.message;*/
        alert(data.message)
        //window.location.href = dashbard;

        /*var round = Math.round(data.balance)
        var format = "NGN" + round.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $rootScope.balance = format;*/

        $rootScope.$broadcast('debit',{status: true})

      } else {
        alert(data.message);
        //window.location.href = dashbard;              
      }
    });
  }

  

  function genRef() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0001112333344467888999666005557772229999";
      for( var i=0; i < 26; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
  }

 


  

/***** end of paystack *******/


 /** transfer fund logic ***/

  $scope.$watch("pay.amount",function(newVal,oldVal){
    if(oldVal && newVal !== null) { 
      $scope.str = "NGN " + $scope.pay.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      $scope.str = "N0.00"
    }
  });

  $scope.pay.mode = "phone";
  $scope.isPhone = true;
  $scope.$watch("pay.mode",function(newVal,oldVal){
    if(newVal === "userId"){
      $scope.isUserId = true;
      $scope.isPhone = false;
    } else {
      $scope.isPhone = true;
      $scope.isUserId = false;
    }
    
  });

 

  $scope.confirm = function(time,phoneCall){
   if($scope.pay.amount !== null){
      var sendParam;
      if($scope.pay.phone && $scope.pay.phone !== undefined){
        sendParam = {phone: $scope.pay.phone}
      } else if($scope.pay.userId && $scope.pay.userId !== undefined) {
        sendParam = {userId: $scope.pay.userId}
      }
      var creditor = userVerifyService; //$resource("/user/verify");
      creditor.get(sendParam,function(data){
        if(data.error){
          alert(data.error)
        } else if(data.user_id && data.user_id !== user.user_id){ 
          if(!time) {  
            var lastname = data.lastname || ""    
            var check = confirm("You want to transfer " + $scope.str + " to " +  data.firstname 
              + " " + lastname + "\nThis amount will be debited from your wallet.");
            if(check){         
              transferFund(data,time,phoneCall);
            } else {
              alert("Transaction canceled!");
            }
          } else {
            transferFund(data,time,phoneCall);
          }
        } else {
          alert("You can not transfer to this person. Transanction canceled!")
        }
       
      });
   } else {
      $scope.errorMsg = "Please enter the amount";
   }

  }


  $scope.cancel = function(){
    $scope.isAmount = false;
    $scope.isATM = true;
  }

 
  $scope.isTransfer = true;
  var count = 0;
  function transferFund(creditor,time,phoneCall) {
    //the id of the beneficiary will be saved in an obj
    $scope.pay.beneficiaryId = creditor.user_id;
    //otp,date,message,userId or phone
    var timeStamp = + new Date();
    $scope.resend = timeStamp //time stamp use to check resend for an otp. this will find the previously sent otp and delete.
    var payObj = {
      amount: $scope.pay.amount,
      time: timeStamp,
      old_time: time
    }
    $scope.loading = true;
    if(phoneCall) {
      count++;
      if(count < 5) {
        phoneCallService(payObj,'/user/payment/verification','POST'); 
        $rootScope.showCallingMsg = "Please enter the pin heard from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }
    } else {
      var User = paymentVerificationService; //walletService.resource("/user/payment/verification",{userId: null},{verify:{method:'POST'}});
      var send = User.verify(payObj,function(data){        
        if(data.success){
          alert("OTP was sent to your phone.");
          $scope.isTransfer = false;
          $scope.isOTP = true;
          $scope.isPhone = false;
          $scope.isUserId = false;
        } else {
          alert(data.message);
        }
        $scope.loading = false;
      });
    }
  }

  
  $scope.$watch("pay.otp",function(newVal,oldVal){
    if(newVal > oldVal && $scope.pay.otp.length === 6){
      var date = + new Date();
      var pin = $scope.pay.otp;
      var str = "";
      var count = 0;
      for(var i = 0; i < pin.length; i++){
        count++;      
        if(count % 3 === 0) {
          str += pin[i];
          str += " ";
        } else {
          str += pin[i];
        }
      }
      var newStr = str.replace(/\s*$/,"");
      var payObj = {
        amount: $scope.pay.amount,
        otp: newStr,
        date: date,
        message: "Fund transfer",
        userId: $scope.pay.beneficiaryId
      }
      var Debitor = walletService.resource("/user/tranfer/confirmation",{userId: null},{confirmed:{method:'POST'}});
      $scope.loading = true;
      Debitor.confirmed(payObj,function(data){
        alert(data.message);
        $scope.loading = false;
        if(data.balance) {
          //$rootScope.balance = "NGN " + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          $scope.isTransfer = true;
          $scope.isOTP = false;
          $scope.isPhone = true;
          $scope.isUserId = false;
          $rootScope.$broadcast("debit",{status: true})
        }
      });
    }
  });
  /** end of transfer logic ***/

  

  /**** view transaction logic ***/
var myVariable = new Date();
var makeDate = new Date(myVariable);
$scope.period = {};
$scope.duration = {};
var newObj = {};        
var currMonth = + makeDate;
makeDate.setMonth(makeDate.getMonth() - 1);
var lastMonth = + makeDate;

newObj["from"] = lastMonth;
newObj["to"] = currMonth; 

$scope.duration.from = $filter('date')(newObj["from"]);
$scope.duration.to = $filter('date')(newObj["to"]);

var User = walletService.resource("/user/:userId/transactions",{userId: user.user_id},{getWallet:{method:'GET',isArray:true}});

$scope.transactHistory = function() {
  
  var list = Object.keys($scope.period);   
  if(list.length > 1){      
    newObj["from"] = + new Date($scope.period.from);
    newObj["to"] = + new Date($scope.period.to);
  } else {
    newObj["from"] = lastMonth;
    newObj["to"] = currMonth; 
  }

  $scope.duration.from = $filter('date')(newObj["from"]);
  $scope.duration.to = $filter('date')(newObj["to"]);

  getTransactions() 
}

function getTransactions() {
  $scope.loading = true;
  User.getWallet(newObj,function(data){
    $scope.loading = false;
    $scope.transacts = data;
  });
}

getTransactions();

  /**** end of view transaction logic ******/


  /*** print token logic ***/
  $scope.submit = function(amount,phone,other_id){
    var date = new Date();
    var payObj = {
      grade: 50000,
      quantity: 5
    }

    
    $http({
        method  : 'POST',
        url     : "/user/token",//"/user/account/pin-top-up",//"/user/account/top-up",
        data    : payObj,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        $scope.date = data;                     
        alert(data);
    });
    /**** end of print token logic ****/

    //var User = $resource("/patient/:verb/:myId",{verb:"obinna23",myId: "@id"},{charge: {method:"POST",params:{amount:300,like:200,dislike:23}}})
    /*var data = User.query(function(){
      var person = data[0];
      person.surname = "Ede";
     
      person.$charge();
    })*/


    /*$http({
        method  : 'GET',
        url     : "/patient/dashboard/all?name=uche",//"/user/account/pin-top-up",//"/user/account/top-up",
        data    : payObj,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
          $scope.date = data;                     
         alert(data);
    });
    /*var payObj = { // this pay obj will be used by all payment routing
      amount: amount,
      date : date,
      message : "funding",
      phone: phone,//thesame below for a person the credit is being recharged for if any. other it is undefined
      other_id: other_id //this id refers to a condition when user is recharging for another user otherwise the value id undefined
    }*/

    /*$http({
        method  : 'POST',
        url     : "/user/account/pin-top-up",//"/user/account/top-up",
        data    : payObj,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {                     
         alert(data);
    });*/
  }

 
  var Debitor = consultationAccptanceService; //walletService.resource("/user/patient/consultation-acceptance/confirmation",{userId: null},{confirmed:{method:'POST'}});
  var updateDocList = getMyDoctorService; //$resource("/user/patient/get-my-doctors");

  $scope.$watch("pay.acceptanceOtp",function(newVal,oldVal){    
    if(newVal > oldVal && $scope.pay.acceptanceOtp.length === 6){
      var date = + new Date();
      var pin = $scope.pay.acceptanceOtp;
      var str = "";
      var count = 0;
      for(var i = 0; i < pin.length; i++){
        count++;      
        if(count % 3 === 0) {
          str += pin[i];
          str += " ";
        } else {
          str += pin[i];
        }
      }
      var newStr = str.replace(/\s*$/,"");//removes empty string by the end of character
      var receiver = templateService.sendObj.user_id || templateService.sendObj.receiverId;
      templateService.sendObj.message_id = (templateService.message_id) ? templateService.message_id : templateService.sendObj.message_id;
      var payObj = {
        amount: templateService.holdRawAmount,
        otp: newStr,
        date: date,
        message: "Consultation fee",
        userId: receiver,
        sendObj: templateService.sendObj
      }
      $scope.loading = true;
      var confirmed = Debitor.confirmed(payObj,function(data){
        $scope.loading = false;
        alert(data.message);
        if(data.balance) {
          //$rootScope.balance = "NGN" + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
          $rootScope.$broadcast('debit',{status: true})         
          if($rootScope.msgLen > 0)
            $rootScope.msgLen--;
          //$location.path(templateService.holdCurrentPage);
          
          //updateDocList.query(null,function(data){            
            //$rootScope.patientsDoctorList = data;
          //});
          $rootScope.patientsDoctorList.push({
            doctor_id: templateService.sendObj.user_id,
            date_of_acceptance: templateService.sendObj.date_of_acceptance,
            doctor_firstname: templateService.sendObj.firstname || templateService.sendObj.doctor_firstname,
            doctor_lastname:  templateService.sendObj.lastname || templateService.sendObj.doctor_lastname,
            doctor_name: templateService.sendObj.name || templateService.sendObj.doctor_name,
            doctor_profile_pic_url: templateService.sendObj.profile_pic_url || templateService.sendObj.doctor_profile_pic_url,
            service_access: true,
            doctor_specialty: templateService.sendObj.specialty || templateService.sendObj.doctor_specialty,
          })
        }
      });
    }
  });  

  $scope.sendAcceptanceVerification = function(time){
    $rootScope.sendAcceptanceVerification(time);
  };

  $scope.call = function(time){
    $rootScope.sendAcceptanceVerification(time,'isCall');
  }

 $scope.invoice = function(){
  $scope.viewInvoice = true;
  $scope.viewTransactions = false;
  $scope.phone = user.phone;
  $scope.name = user.user_id;
 
 }

 $scope.transactions = function(){
  $scope.viewInvoice = false;
  $scope.viewTransactions = true;
 }

}]);


app.controller("prescriptionTemplateController",["$scope","$rootScope","$location","$http","templateService",
  "localManager","patientMedViewController","$timeout","path",
  function($scope,$rootScope,$location,$http,templateService,localManager,patientMedViewController,$timeout,path){
    var prescriptionObjs = (templateService.holdPrescriptions.length > 0) ? templateService.holdPrescriptions : localManager.getValue("holdPrescriptions");
  
    $scope.prescriptionRecordsResult = prescriptionObjs;

    var hasBeenSentTo = {};

    //$rootScope.path = $location.path();

    $http({
      method  : 'GET',
      url     : "/user/patient/get-prescription/track-record",        
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      hasBeenSentTo.trackRecord = data;
    });

    $scope.trackedPrescription = function(id,prescription){   
      var holdRecord = [];
      hasBeenSentTo.trackRecord.forEach(function(record){
      	if(record.prescriptionId) {
	        if(record.prescriptionId.toString() === id) {
	          holdRecord.unshift(record);
	        }
    	}
      });
      templateService.holdTrackRecord = holdRecord;
      templateService.holdPrescriptionForTrackRecord = prescription;
      $location.path("/patient/view-prescription-history/" + id);
    }


    //this fn is invoked when patient wish to forward prescription by himself to a phamarcy.
    $scope.forwardPrescription = function (prescription) {
      
      $rootScope.unavailableDrugArr = [];

      for(var i = 0; i < prescription.prescription_body.length; i++) {
        if(prescription.prescription_body[i].picked) {
          $rootScope.unavailableDrugArr.push(prescription.prescription_body[i]);
        } 
      }

      if($rootScope.unavailableDrugArr.length == 0) {
        $rootScope.unavailableDrugArr = prescription.prescription_body;
      }

  
      //templateService.holdPrescriptionToBeForwarded = prescription;

      $rootScope.refData = prescription;
      $rootScope.refData.sender = "patient";          
      $location.path("/patient/search/pharmacy");         
    }
    
    //this fn is invoked when a patient wish to delete a prescription.
    $scope.deletePrescription = function (id) {
      for(var i = 0; i < $scope.prescriptionRecordsResult.length; i++){
        if($scope.prescriptionRecordsResult[i].prescriptionId === id){
          $scope.prescriptionRecordsResult.splice(i,1);
        }
      }
    }

    $scope.courier = function(prescription){
      $rootScope.selectedPrescription = prescription;
      $location.path("/courier")
     
    }



    $scope.id = {};

    
    //copy to clipboard

    $scope.supported = false;

    $scope.copy = "";

    $scope.success = function (pres) {
      pres.copy = 'Copied!';
      $timeout(function(){
        pres.copy = "";
      },2000);
    };


    $scope.fail = function (err) {
      console.error('Error!', err);
    };

    // view prescription based on time received
    $scope.isAll = true;
    $scope.all = function(){
      $scope.isAll = true;
      $scope.isRecent = false;
      $scope.isThree = false;
      $scope.isSix = false;
      $scope.prescriptionRecordsResult = prescriptionObjs;
    }

    $scope.recent = function(){
      $scope.isAll = false;
      $scope.isRecent = true;
      $scope.isThree = false;
      $scope.isSix = false;
      $scope.prescriptionRecordsResult = patientMedViewController.getList(1,prescriptionObjs);
    }

    $scope.three = function(){
      $scope.isAll = false;
      $scope.isRecent = false;
      $scope.isThree = true;
      $scope.isSix = false;
      $scope.prescriptionRecordsResult = patientMedViewController.getList(3,prescriptionObjs);
    }

    $scope.six = function(){
      $scope.isAll = false;
      $scope.isRecent = false;
      $scope.isThree = false;
      $scope.isSix = true;
      $scope.prescriptionRecordsResult = patientMedViewController.getList(6,prescriptionObjs);
    }
    

}]);

app.controller("captureImageController",["$scope",function($scope){
  var player = angular.element(document.getElementById('player'));
  var canvas = angular.element(document.getElementById('canvas'));
  var context = angular.element(canvas.context.getContext('2d'));
  var captureButton = angular.element(document.getElementById('capture'));
  constraints = {
    video: true,
  };

  captureButton[0].addEventListener('click', function(){
    // Draw the video frame to the canvas.
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
  });

  // Attach the video stream to the video element and autoplay.
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream){
      player[0].srcObject = stream;
    });
}]);


app.controller("patientSearchForPharmacyController",["$scope","$location","$http","templateService","ModalService","$rootScope","cities","localManager",
  function($scope,$location,$http,templateService,ModalService,$rootScope,cities,localManager){
    //for phamarcy
    $scope.pharmacy = {};

    //$scope.unavailableDrugArr = $rootScope.unavailableDrugArr; value is set globally so $scope aspect is not needed.

    $scope.cities = cities;

    $scope.loading = true;

    $http({
        method  : 'GET',
        url     : "/user/patient/getAllPharmacy",
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) { 
        $scope.pharmacyData = data;
       
        $scope.pharmacy.city = data[0].city;
        $scope.loading = false;
    });
      
    
    $scope.findPharmacy = function () {
      var searchObj = {};
      $scope.loading = true
      for(var i in $scope.pharmacy){
        if($scope.pharmacy.hasOwnProperty(i) && $scope.pharmacy[i] !== ""){
          searchObj[i] = $scope.pharmacy[i];
        }
      }
       searchObj.type = "Pharmacy";
       $http({
        method  : 'PUT',
        url     : "/user/patient/pharmacy/refined-search", 
        data    : searchObj,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        $scope.pharmacyData = data;
        $scope.loading = false;
      });
    }



    //when a desired phamarcy is clicked by the patient this function runs to store that center details to a service which will be use for display
    //in selectedCenterController.
    $scope.forwardPrescriptionTo = function (center) {
      $rootScope.refData.prescription_body = ($rootScope.unavailableDrugArr.length > 0) ? $rootScope.unavailableDrugArr : $rootScope.refData.prescription_body;    
      $rootScope.refData.user_id = center.user_id;
      center.loading = true;
      $http({
        method  : 'PUT',
        url     : "/user/patient/pharmacy/referral-by-patient", 
        data    : $rootScope.refData,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        if(data.success){   
          center.success = true;
        } else {          
          alert("Prescription not sent!! Try again.");
        }
        center.loading = false;
      });
    }

    
    $scope.goBack = function() {
      $location.path($rootScope.path);
    }

    $scope.sendChat = function(center) {
      center.id = center.user_id // just to set common property for the modal and control using this resource.
      $rootScope.holdcenter = center;
      ModalService.showModal({
            templateUrl: 'quick-chat.html',
            controller: 'generalChatController'
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {             
            });
      });
    }

    
}]);

//controller for patient who wish to redirect an investigation another center.
app.controller("patientRedirectTestController",["$scope","$location","$resource","$window",
  "templateService","patientRedirectTestService","$rootScope","ModalService",
  function($scope,$location,$resource,$window,templateService,patientRedirectTestService,$rootScope,ModalService){ 
  $scope.criteria = {};

  var resource = patientRedirectTestService; //$resource("/user/patient/get-centers",{sendTest:{method:"PUT"}});

  var test = templateService.holdTestToBeForwarded; 

  $scope.goBack = function() {
    test.test_to_run = $rootScope.holdTestToRun;
    $location.path($rootScope.path);
  }

  
  $scope.testToRun = test.test_to_run;
  
 
  function getData() {
    $scope.loading = true; 
    $scope.criteria.type = test.type;
    resource.query($scope.criteria,function(data){
      $scope.loading = false;
      if(data.length > 0) {
        $scope.criteria.city = data[0].city;
        $scope.criteria.country = data[0].country;
      } else {
        $scope.message = "No centers found based on the search criteria."
      }
      $scope.centerLists = data;
    });
  }

  $scope.findCenter = function () {
    getData();
  }

  $scope.forwardInvestigtion = function(center) {   
   // var verify = confirm("Test will be sent to " + test.center_name); 
    center.loading = true;  
    var sendObj = {
      oldCenterId: test.center_id,
      newCenterId: center.user_id,
      test_to_run: test.test_to_run,
      patientId: test.patient_id,
      type: test.type,
      refId: test.ref_id
    }

    resource.sendTest(sendObj,function(response){
      center.loading = false;
      if(response.status){
        center.status = response.status;
      } else {
        alert(response.message)
      }
      
    })
    
  }

  $scope.sendChat = function(center) {
    
    center.id = center.user_id // just to set common property for the modal and controller using this resource.
    $rootScope.holdcenter = center;
    ModalService.showModal({
        templateUrl: 'quick-chat.html',
        controller: 'generalChatController'
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {             
        });
    });
  }

  getData();

}]);

app.controller('supportController',["$scope","$http",function($scope,$http){

  $scope.reportIssue = function() {

  }

  $scope.picked = 'grow';

  $scope.select = function(article){
    $scope.picked = article;
  }

      
}])

app.controller("helpController2",["$scope","$location","$http",function($scope,$location,$http){
  $scope.user = {};

  $scope.sendHelp = function() {
  	$scope.loading = true
    $http({
      method  : 'POST',
      url     : "/user/need-help",
      data    : $scope.user,
      headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {   
      if(data.status){
        alert('Complaint submitted successfully!');        
      } else {
        alert("Error occured while sending form.");
      }
      $scope.loading = false;
    });

  }
   
}]);


app.controller("testSearchSelectedCenterController",["$scope","$location","$window","$http","templateService","localManager","ModalService",
  "$rootScope",function($scope,$location,$window,$http,templateService,localManager,ModalService,$rootScope){
  $scope.data = templateService.holdTheCenterToFowardPrescriptionTo;
  $scope.user = {};
  var sendObj = {};

  $scope.someone = function(){
    $scope.user.someone = true;
    $scope.isToSomeOne = true;
  }

  $scope.back = "#/laboratory/test-search/result";

  $scope.cancel = function(){
    $scope.isToSomeOne = false;
    $scope.isNewPatient = false;
    $scope.user.someone = false;
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

      var isNumber = testNumber($scope.user.patient_phone);

      if(isNumber) {
        if($scope.user.patient_phone.indexOf('+') == -1)
          $scope.user.patient_phone = "+234" + parseInt($scope.user.patient_phone); 
      } else {
        $scope.phoneMsg = "Please enter a valid phone number.";
        return;
      }

      if(!$scope.user.patient_phone) {
        $scope.phoneMsg = "Enter patient's phone number";
        return;
      }

      if(!$scope.data.clinical_summary) {
        $scope.summuryMsg = "Enter clinic summary";
        return;
      }

      if(!$scope.data.indication) {
        $scope.indictionMsg = "Enter indication";
        return;
      }
    }

    $scope.summuryMsg = "";
    $scope.phoneMsg = "";
    $scope.indictionMsg = ""; 

    var random;
    var labData = templateService.holdLaboratoryReferralData;
    if(labData.ref_id){      
      random = labData.ref_id;
    } else {      
      random = $rootScope.genRefId;
    }    

    var date = new Date();
    $scope.data.type = type;
    //$scope.data.ref_id = random;
    $scope.data.user_id = $scope.data.id;
    $scope.data.sent_date = date;
    $scope.data.session_id = labData.session_id;

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

    sendObj.patient_age = calculate_age(new Date($scope.data.dob));
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
    sendObj['phone'] = $scope.user.patient_phone;

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

  //runs if the patient is not yet registered
  $scope.emp = function(){
    ModalService.showModal({
        templateUrl: 'patient-emergency-form.html',
        controller: "newPatientModalController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.isEMP = false; 
      });
    });
  }

}]);

app.controller("medHistoryCtrl",["$scope","$rootScope","patientMedHistory",
  function($scope,$rootScope,patientMedHistory){

  $scope.history = {};
  $scope.lifeStyle = {}
  $scope.healthProblems = {};

  patientMedHistory.get({patientId: $rootScope.checkLogIn.user_id},function(data){
    console.log(data);
  })

  $scope.history.lifestyle = [];
  $scope.history.health_problems = [];

  $scope.save = function() {
    $scope.loading = true;
    console.log($scope.history,"==>",$scope.lifeStyle,"tttt>>",$scope.healthProblems)
   
    for(var i in $scope.lifeStyle) {
      if($scope.lifeStyle.hasOwnProperty(i)){
        if($scope.lifeStyle[i]) {
          switch(i) {
            case 'tobacco':
              $scope.history.lifestyle.push({
                tobacco: $scope.lifeStyle[i],
                report: "Smokes or use tobacco"
              })
            break;
            case 'alcohol':
              $scope.history.lifestyle.push({
                alcohol: $scope.lifeStyle[i],
                report: "Drinks alcohol reqularly"
              })
            break;
            case 'substances':
              $scope.history.lifestyle.push({
                substances: $scope.lifeStyle[i],
                report: "Takes social substances"
              })
            break;
            case 'sports':
              $scope.history.lifestyle.push({
                sports: $scope.lifeStyle[i],
                report: "Does sports regualarly"
              })
            break;
            default:
            break
          }
        }
      }
    }

    for(var j in $scope.healthProblems){
      if($scope.healthProblems.hasOwnProperty(j)){
        if($scope.healthProblems[j]){
          if(j == "other"){
            $scope.history.health_problems.push($scope.healthProblems.otherIssue);
          }
          else {
            if(j !== "otherIssue")
              $scope.history.health_problems.push(j);
          }
        }
      }
    }

    
    patientMedHistory.update($scope.history,function(response){
      $scope.loading = false;
      $scope.msg = response.message;
     
    })
  }

  

}]);

app.controller('welcomeController',["$scope","$rootScope","templateService","localManager","ModalService",
  function($scope,$rootScope,templateService,localManager,ModalService){
  var user = localManager.getValue("resolveUser")
  var data = localManager.getValue("onreg_held_item");
  
  if(data) { 
    $rootScope.holdType = data.type;   
    if(data.title && user.typeOfUser == "Patient") {
      templateService.holdForSpecificDoc = data;
      ModalService.showModal({
        templateUrl: "selected-doc.html",
        controller: "bookingDocController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
        });
      });

    } else if(data.type == "Pharmacy") {
      //templateService.holdTheCenterToFowardPrescriptionTo = data;
      
      ModalService.showModal({
        templateUrl: 'info.html',
        controller: "infoController"
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {           
          });
      });
    } else if(data.type == "Laboratory") {
      //templateService.holdTheCenterToFowardPrescriptionTo = data;
      ModalService.showModal({
        templateUrl: 'info.html',
        controller: "infoController"
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {           
          });
      });
    } else if(data.type == "Radiology") {
      //templateService.holdTheCenterToFowardPrescriptionTo = data;
      ModalService.showModal({
        templateUrl: 'info.html',
        controller: "infoController"
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {           
          });
      });
    }

  }

  localManager.removeItem("onreg_held_item");

}]);

app.controller('consultationFeeCtrl',["$scope","$http","templateService","$filter","$rootScope","$location",
  function($scope,$http,templateService,$filter,$rootScope,$location){

  $http.get('/user/patient/consultation-fee',{params: {id: templateService.holdId}})
  .success(function(data){
    //console.log(data)
    $scope.consultation = data;
  })

  $scope.payFee = function() {

    var check = confirm("You want to pay the consultation fee below and account will be debited by the amount specified?");

    if($scope.consultation && check){
      var date = new Date();
      var msg = "Consultation Fee Payment made on " 
      + $filter('date')(date, 'EEE, MMM d, y') + " amount " + $scope.consultation.fee.strAmount
      var sendObj = {
        receiver: $scope.consultation.fee.doctor_id,
        amount: $scope.consultation.fee.amount,
        consultationFeeId: $scope.consultation.fee._id,
        patientId: $scope.consultation.fee.patient_id,
        paymentMessage: {tag: 'Payment',body: msg}
      }

      $scope.loading = true;

      $http({
        method  : 'PUT',
        url     : "/user/patient/consultation-fee",
        data    : sendObj,
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data) {   
        if(data.status){
          $scope.consultation.fee.is_paid = true;
          $scope.consultation.fee.payment_date = data.date;
          $rootScope.$broadcast('debit',{status:true});
        } else if(data.isFund) {
          alert(data.message);
          $location.path('wallet');
        } else {
          alert(data.message);
        }
        $scope.loading = false;
      });
    }
  }
}]);

app.service('chartReadingService',["$resource",function($resource){
  return $resource("/user/charts",null,{update: {method: "PUT"},
    deleteReading:{method: "DELETE"},partialUpdate:{method: "PATCH"}});
}])

app.controller("chartCtrl",["$scope","$rootScope","chartReadingService","$filter","$http",
  function($scope,$rootScope,chartReadingService,$filter,$http){

  var chartService = chartReadingService;

  $scope.chart = {}
  $scope.chart.readings = {};
  $scope.chart.readings1 = {};
  $scope.chart.readings2 = {};

  var date = new Date();

  $scope.chart.year = date.getFullYear();

 

  $scope.patient = {};
  $scope.chart.userId = $scope.patient.userId || $rootScope.checkLogIn.user_id;


  var getYealList = function(fromWatch){
    $http.get("/user/charts/all",{params:{userId: $scope.chart.userId}})
    .success(function(chartYesrs){
      $scope.yearList = chartYesrs;
      if(fromWatch){
        $scope.getChartData()
      }
    });
  }

  //getYealList();


  $scope.getChartData = function() {

    chartService.get({userId: $scope.chart.userId,year: $scope.chart.year},function(chartObj){

      $scope.chartData = chartObj || {};


      if(chartObj["bp_readings"]){
        $scope.megaArrBP = [];
        var limit = 10;
        $scope.arrLen = 0;
        $scope.bpMarker = -1;
        var bpLen = chartObj["bp_readings"]["length"];

        function fillArrBP(index){
          var list = [];

          for(var i = index; list.length < limit; i++) {
            if(chartObj["bp_readings"][i]) {
              list.push(chartObj["bp_readings"][i]);
              $scope.arrLen++;
            } else {
              break;
            }
          }
         
          $scope.megaArrBP.push(list);
          $scope.bpMarker++;

          if($scope.arrLen < bpLen){
            fillArrBP($scope.arrLen);
          }
        }

        fillArrBP(0);  
       
       

        var prevList;
        var prevData;
        var newDataList;
        var allLists;
        var pulse;
        var diastol;
        var selectedChartBPList;
        var innerList;
        

        $scope.chartViewBP = function() {
          allLists = [];
          pulse = [];
          systol = [];
          diastol = [];
          $scope.labels = [];
          
          innerList = $scope.megaArrBP[$scope.bpMarker];
          
          if(innerList.length === 1 && $scope.megaArrBP.length > 1) {
            //this logic helps to fill the line graph when the data left over is single as such line need to be drawn from
            //the previous value for good presentation
            prevList = $scope.megaArrBP[$scope.bpMarker - 1];
            prevData = prevList[prevList.length - 1];
            newDataList = [prevData,innerList[0]];
            selectedChartBPList = newDataList;

          } else {
            selectedChartBPList = innerList;
          }

          if(selectedChartBPList) {
            selectedChartBPList.forEach(function(item){
              $scope.labels.push(item.label)
              pulse.push(item.pulse);
              systol.push(item.systol);
              diastol.push(item.diastol);
            })

            allLists.push(pulse)
            allLists.push(systol)
            allLists.push(diastol);

            $scope.data = allLists;

            $scope.series = ['Pulse','Systol','Diastol'];
            $scope.colors = ['#45b7cd','#ff6384','#FDB45C'];
          } else {
            $scope.bpMarker = 0;
          }

        }

        $scope.chartViewBP();

        $scope.onClick = function (points, evt) {
          //console.log(points, evt);
        };

      } //end  chart bp_readings


      //Blood Sugar chart logic 

      if(chartObj["bs_readings"]){
        $scope.megaArrBS = [];
        var limit1 = 10;
        $scope.arrLen1 = 0;
        $scope.bsMarker = -1;
        var bsLen = chartObj["bs_readings"]["length"];

        function fillArrBS(index){
          var list1 = [];

          for(var i = index; list1.length < limit1; i++) {
            if(chartObj["bs_readings"][i]) {
              list1.push(chartObj["bs_readings"][i]);
              $scope.arrLen1++;
            } else {
              break;
            }
          }
         
          $scope.megaArrBS.push(list1);
          $scope.bsMarker++;

          if($scope.arrLen1 < bsLen){
            fillArrBS($scope.arrLen1);
          }
        }

        fillArrBS(0);  
       
        $scope.series1 = ['FBS','RBS'];
        $scope.colors1 = ['#45b7cd', '#ff6384'];

        var prevList1;
        var prevData1;
        var newDataList1;
        var allLists1;
        var fbs;
        var rbs;
        var selectedChartBSList;
        var innerList1;
        

        $scope.chartViewBS = function() {
          allLists1 = [];
          fbs = [];
          rbs = [];
         
          $scope.labels1 = [];
          
          innerList1 = $scope.megaArrBS[$scope.bsMarker];
          
          if(innerList1.length === 1 && $scope.megaArrBS.length > 1) {
            //this logic helps to fill the line graph when the data left over is single as such line need to be drawn from
            //the previous value for good presentation
            prevList1 = $scope.megaArrBS[$scope.bsMarker - 1];
            prevData1 = prevList1[prevList1.length - 1];
            newDataList1 = [prevData1,innerList1[0]];
            selectedChartBSList = newDataList1;

          } else {
            selectedChartBSList = innerList1;
          }

          if(selectedChartBSList) {
            selectedChartBSList.forEach(function(item){
              $scope.labels1.push(item.label)
              fbs.push(item.fasting);
              rbs.push(item.random);
            })

          
            allLists1.push(fbs)
            allLists1.push(rbs);

            $scope.data1 = allLists1;
          } else {
            $scope.bsMarker = 0;
          }

        }

        $scope.chartViewBS();

        $scope.onClick1 = function (points, evt) {
          //console.log(points, evt);
        };

      } // end chart bs_sudgar



      // Temperature Logic
      if(chartObj["temp_readings"]){
        $scope.megaArrTemp = [];
        var limit2 = 10;
        $scope.arrLen2 = 0;
        $scope.tempMarker = -1;
        var tempLen = chartObj["temp_readings"]["length"];

        function fillArrTemp(index){
          var list2 = [];

          for(var i = index; list2.length < limit2; i++) {
            if(chartObj["temp_readings"][i]) {
              list2.push(chartObj["temp_readings"][i]);
              $scope.arrLen2++;
            } else {
              break;
            }
          }
         
          $scope.megaArrTemp.push(list2);
          $scope.tempMarker++;

          if($scope.arrLen2 < tempLen){
            fillArrTemp($scope.arrLen2);
          }
        }

        fillArrTemp(0);  
       
        $scope.series2 = ['Temperature'];
        $scope.colors2 = ['#FDB45C'];

        var prevList2;
        var prevData2;
        var newDataList2;
        var allLists2;
        var temp;       
        var selectedChartTempList;
        var innerList2;
        

        $scope.chartViewTemp = function() {
          allLists2 = [];
          temp = [];
         
         
          $scope.labels2 = [];
          
          innerList2 = $scope.megaArrTemp[$scope.tempMarker];
          
          if(innerList2.length === 1 && $scope.megaArrTemp.length > 1) {
            //this logic helps to fill the line graph when the data left over is single as such line need to be drawn from
            //the previous value for good presentation
            prevList2 = $scope.megaArrTemp[$scope.tempMarker - 1];
            prevData2 = prevList2[prevList2.length - 1];
            newDataList2 = [prevData2,innerList2[0]];
            selectedChartTempList = newDataList2;

          } else {
            selectedChartTempList = innerList2;
          }

          if(selectedChartTempList) {
            selectedChartTempList.forEach(function(item){
              $scope.labels2.push(item.label)
              temp.push(item.temperature);
            })

          
            allLists2.push(temp)
            //allLists2.push(rbs);

            $scope.data2 = allLists2;
          } else {
            $scope.tempMarker = 0;
          }

        }

        $scope.chartViewTemp();

        $scope.onClick2 = function (points, evt) {
          console.log(points, evt);
        };

      } // end chart bs_sudgar

    })

  } //end of get chart data

  $scope.setChart = function(type) {
    if(type === 'positive') {
      $scope.bpMarker++;
    } else {
      $scope.bpMarker--;     
    }

    $scope.chartViewBP()
  }


  $scope.setChart1 = function(type) {
    if(type === 'positive') {
      $scope.bsMarker++;
    } else {
      $scope.bsMarker--;     
    }

    $scope.chartViewBS()
  }


  $scope.setChart2 = function(type) {
    if(type === 'positive') {
      $scope.tempMarker++;
    } else {
      $scope.tempMarker--;     
    }

    $scope.chartViewTemp()
  }

  //$scope.getChartData();
 
  $scope.$watch('chart.year',function(newVal,oldVal){
    if(newVal){
      //$scope.getChartData();
      getYealList('isWached')
    }
  })

 

  //$scope.labels = ["Jan 20", "February", "Mar 20 2:00pm", "April", "May", "June", "July"];

  //$scope.series = ['Pulse', 'Systol','Diastol'];

  /*$scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90],
    [80, 50, 40, 70, 86, 89, 60]
  ];*/

  //$scope.colors = ['#45b7cd', '#ff6384', '#FDB45C'];

  /*$scope.onClick = function (points, evt) {
    console.log(points, evt);
  };*/


  $scope.sendDataBP = function(){
    $scope.loadingBP = true;

    if(!testNumber($scope.chart.readings.pulse)){
      alert("Pulse value should be a number only.");
      return;
    }

    if(!testNumber($scope.chart.readings.systol)){
      alert("Systol value should be a number only.");
      return;
    }

    if(!testNumber($scope.chart.readings.diastol)){
      alert("Diastol value should be a number only.");
      return;
    }

    $scope.chart.year = date.getFullYear();

    $scope.chart.name = "Blood Pressure";    
    $scope.chart.date = date;
    $scope.chart.readings.time = + $scope.time;
    $scope.chart.readings.day = + new Date();
    $scope.chart.readings.name = "Blood Pressure";
    $scope.chart.readings.unit = "mmHg";
    //$scope.chart.readings.id = Math.floor(Math.random() * 999999) + "" + Math.floor(Math.random() * 999999);
    
    var dt = $filter('date')($scope.chart.readings.time,'shortTime');
    var dt2 = $filter('date')(date,'d MMM');

    $scope.chart.readings.label = dt2 + " " + dt;
    
    $scope.chart.userId = $scope.patient.userId || $rootScope.checkLogIn.user_id;
    $scope.chart.phone = $scope.patient.phone || $rootScope.checkLogIn.phone;

    chartService.update($scope.chart,function(response){

      if(response.status){
        $scope.getChartData();
        alert(response.message)
      } else {
        alert("Some errors occured. Please try again later.")
      }

      $scope.loadingBP = false;
    })
    
  }

  var elemPos;

  $scope.deleteChartReadingBP = function(reading) {
    var check = confirm("You want to delete Blood Pressure result recorded on " + reading.label)
    if(check){
      reading.loading = true;
      chartService.deleteReading({chartId:  $scope.chartData._id,dataId:reading.id,
        year: $scope.chartData.year,type:"bp_readings"},function(resp){
        reading.loading = false;
        if(resp.status){
          elemPos = $scope.chartData.bp_readings.map(function(item){return item.id}).indexOf(reading.id)
          if(elemPos !== -1){
            $scope.chartData.bp_readings.splice(elemPos,1);
          }
          $scope.getChartData();
        } 
        alert(resp.message);
      })
    }
  }

  // Sending blood sugar data for recording 

  $scope.sendDataBS = function() {
    if($scope.chart.readings1.fasting)
      if(!testNumber($scope.chart.readings1.fasting)){
        alert("FBS value should be a number only.");
        return;
      }

    if($scope.chart.readings1.random)
      if(!testNumber($scope.chart.readings1.random)){
        alert("RBS value should be a number only.");
        return;
      }
   

    $scope.loadingBS = true;

    $scope.chart.year = date.getFullYear();

    $scope.chart.name = "Blood Sugar";    
    $scope.chart.date = date;
    $scope.chart.readings1.time = + $scope.time;
    $scope.chart.readings1.day = + new Date();
    $scope.chart.readings1.name = "Blood Sugar";
    $scope.chart.readings1.unit = "mg/dl";
    //$scope.chart.readings1.id = Math.floor(Math.random() * 999999) + "" + Math.floor(Math.random() * 999999);
    
    var dt = $filter('date')($scope.chart.readings1.time,'shortTime');
    var dt2 = $filter('date')(date,'d MMM');

    $scope.chart.readings1.label = dt2 + " " + dt;
    
    $scope.chart.userId = $scope.patient.userId || $rootScope.checkLogIn.user_id;
    $scope.chart.phone = $scope.patient.phone || $rootScope.checkLogIn.phone;

    chartService.update($scope.chart,function(response){

      if(response.status){
        $scope.getChartData();
        alert(response.message)
      } else {
        alert("Some errors occured. Please try again later.")
      }

      $scope.loadingBS = false;
    })
  }


  $scope.convertToDl = function(){
    if($scope.mmol){
      $scope.tomgdl = Math.round(18 * $scope.mmol)
    }
  }


  $scope.deleteChartReadingBS = function(reading) {
    var check = confirm("You want to delete Blood Sugar result recorded on " + reading.label)
    if(check){
      reading.loading = true;
      chartService.deleteReading({chartId: $scope.chartData._id,dataId:reading.id,
        year: $scope.chartData.year,type:"bs_readings"},function(resp){
        reading.loading = false;
        if(resp.status){
          elemPos = $scope.chartData.bs_readings.map(function(item){return item.id}).indexOf(reading.id)
          if(elemPos !== -1){
            $scope.chartData.bs_readings.splice(elemPos,1);
          }
          $scope.getChartData();
        } 
        alert(resp.message);
      })
    }
  }


  

  
  // Sending blood sugar data for recording 

  $scope.sendDataTemp = function() {
    
    
    if(!testNumber($scope.chart.readings2.temperature)){
      alert("Temperature value should be a number only.");
      return;
    }

   
    $scope.loadingTemp = true;

    $scope.chart.year = date.getFullYear();

    $scope.chart.name = "Temperature";    
    $scope.chart.date = date;
    $scope.chart.readings2.time = + $scope.time;
    $scope.chart.readings2.day = + new Date();
    $scope.chart.readings2.name = "Temperature";
    $scope.chart.readings2.unit = "°C";
    //$scope.chart.readings2.id = Math.floor(Math.random() * 999999) + "" + Math.floor(Math.random() * 999999);
    
    var dt = $filter('date')($scope.chart.readings2.time,'shortTime');
    var dt2 = $filter('date')(date,'d MMM');

    $scope.chart.readings2.label = dt2 + " " + dt;
    
    $scope.chart.userId = $scope.patient.userId || $rootScope.checkLogIn.user_id;
    $scope.chart.phone = $scope.patient.phone || $rootScope.checkLogIn.phone;

    chartService.update($scope.chart,function(response){

      if(response.status){
        $scope.getChartData();
        alert(response.message)
      } else {
        alert("Some errors occured. Please try again later.")
      }

      $scope.loadingTemp = false;
    })
  }


  $scope.deleteChartReadingTemp = function(reading) {
    var check = confirm("You want to delete Temperature result recorded on " + reading.label)
    if(check){
      reading.loading = true;
      chartService.deleteReading({chartId:  $scope.chartData._id,dataId:reading.id,type:"temp_readings"},function(resp){
        reading.loading = false;
        if(resp.status){
          elemPos = $scope.chartData.temp_readings.map(function(item){return item.id}).indexOf(reading.id)
          if(elemPos !== -1){
            $scope.chartData.temp_readings.splice(elemPos,1);
          }
          $scope.getChartData();
        } 
        alert(resp.message);
      })
    }
  }

  $scope.editReading = function(reading){
    reading.isEdit = true;
  }

  $scope.cancelEdit = function(reading){
    reading.isEdit = false;
  }


  $scope.updateReading = function(reading,type){
    var sendObj = {
      type: type,
      dataId: reading.id,
      chartId: $scope.chartData._id,
      readings: reading
    }

    switch(type){
      case 'bp_readings':
        if(!testNumber(reading.pulse)){
          alert("Pulse value should be a number only.");
          return;
        }

        if(!testNumber(reading.systol)){
          alert("Systol value should be a number only.");
          return;
        }

        if(!testNumber(reading.diastol)){
          alert("Diastol value should be a number only.");
          return;
        }
      break;
      case "bs_readings":
        if(reading.fasting)
          if(!testNumber(reading.fasting)){
            alert("FBS value should be a number only.");
            return;
          }

        if(reading.random)
          if(!testNumber(reading.random)){
            alert("RBS value should be a number only.");
            return;
          } 
      break;
      case 'temp_readings':
        if(!testNumber(reading.temperature)){
          alert("Temperature value should be a number only.");
          return;
        }
      break;
      default:
      break;
    }

    reading.isloading = true;
    chartService.partialUpdate(sendObj,function(response){
      if(response.status){
        $scope.getChartData();
        alert(response.message)
      } else {
        alert("Some errors occured. Please try again later.")
      }

      reading.isloading = false;
    })
  }


}]);


app.controller("noteCtrl",["$scope","$location","$rootScope",
  function($scope,$location,$rootScope){
  $rootScope.isFromNote = false;
}]);


function testNumber(str) {
  var intRegex = /[0-9 -()+]+$/;
  return intRegex.test(str)
}

/*function calculate_age(dob) { 
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms); 

  return Math.abs(age_dt.getUTCFullYear() - 1970);
}*/

function calculate_age(dob) { 
 
  var years = moment().diff(dob, 'years');
  var months = moment().diff(dob, 'months');
  var days = moment().diff(dob, 'days');

  if(years){
    return (years == 1) ? (years + " year") : (years + " years");
  } else if(months) {
    return (months == 1) ? (months + " month") : (months + " months");
  } else {
    return (days == 1) ? (days + " day") : (days + " days");
  }
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


})() //end of IIFE




