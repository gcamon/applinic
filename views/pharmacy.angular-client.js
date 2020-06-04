

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
    templateUrl: '/assets/pages/patient/my-doctors.html',
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
  controller: 'walletController'
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

 .when("/p/selected-appointment/:id",{
  templateUrl: "/assets/pages/patient/patient-appointment.html",
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
    controller: 'invitationCtrl'
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
  templateUrl: "/assets/pages/utilities/find-specialist.html",
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
  templateUrl: "/assets/pages/utilities/courier-response.html",
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

/*General chat implementations for centers and patients */

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



/***** All factorries *************/

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


////////////////////////////// move the controll below to a right place later.


app.service("patientMedHistory",["$resource",function($resource){
  return $resource("/user/patient/medical-history",null,{update: {method: "PUT"}});
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

    console.log($scope.history)
    patientMedHistory.update($scope.history,function(response){
      $scope.loading = false;
      $scope.msg = response.message;
      console.log(response);
    })
  }

  /*$scope.$watch("history.blood_pressure",function(oldVal,newVal){
    if(oldVal) {
      $scope.history.bp_date = + new Date();
    }
  })

  $scope.$watch("history.blood_sugar",function(oldVal,newVal){
    if(oldVal) {
      $scope.history.bs_date = + new Date();
    }
  })*/

}]);


app.service("userLoginService",["$resource",function($resource){
  return $resource('/user/login',null,{logPerson:{method:"POST"}});
}]);

app.service("changPasswordService",["$resource",function($resource){
  return $resource('/user/change-password/:id',{id:"@userId"},{updatePassword:{method:"PUT"},verifyUser:{method:"POST"}});
}]);


app.controller("serviceRecordController",["$scope","$http","$rootScope","ModalService","$filter",
function($scope,$http,$rootScope,ModalService,$filter){
  $http({
    method  : 'GET',
    url     : "/user/rendered-services",
    headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {    
            
      if(data) {
        $scope.renderedServices = data || [];                          
      } 
  }); 

  $scope.viewReport = function(person) {
    $rootScope.person = person;
    ModalService.showModal({
      templateUrl: 'report-history-modal.html',
      controller: 'workHistoryModalController'
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {             
      });
    });
  } 

  var checkGroup = {}
  $scope.getDateGroup = function(date,person){
   var dy = $filter('amCalendar')(date).split(" at")[0];
   if(!checkGroup.hasOwnProperty(dy)){
    person.dategroup = dy;
   } 
   checkGroup[dy] = true;   
  }                       
}]);

app.controller("workHistoryModalController",["$rootScope","$scope","$location","localManager",
  function($rootScope,$scope,$location,localManager){
  $scope.reportList = [];
  
  var count = 0
  $scope.getReport = function(report){
    if(count === 0) {
     
      var reportSplt = report.split(",");
      for(var i = 0; i < reportSplt.length; i++) {
        var nextSplt = reportSplt[i].split(":");
        var newObj = {};
        newObj.investigation = nextSplt[0];
        newObj.report = nextSplt[1];
        $scope.reportList.push(newObj);
      }
    }
     count++;
    
  }

  

  $scope.editReport = function(person) {
    var path = (person.laboratory) ? "/laboratory/view-test/" + person.ref_id : "/radiology/view-test/" + person.ref_id;
    (person.laboratory) ? localManager.setValue("laboratoryData",person) : localManager.setValue("radiologyData",person);
    (person.laboratory) ? localManager.setValue("currPageForLaboratory",path) : localManager.setValue("currPageForRadiology",path);
    $location.path(path);
  }
  
}]);


app.controller("centerCourierController",["$scope","$rootScope","$http","mySocket","ModalService","templateService",
  "ModalService","fieldAgentService",
  function($scope,$rootScope,$http,mySocket,ModalService,templateService,ModalService,fieldAgentService){
  
  //this will only allow cebters permitted to render courier services use the feature.
  //note for center that will run courier service must have "courier access" enabled and "courier_access_password" set to desired password;
  //$rootScope.fieldagentUrl = "https://applinic.com/bicboy/" + $rootScope.checkLogIn.user_id + "/" + $rootScope.checkLogIn.courier_access_password;
  var getCurr = function(){
    $http({
      method  : 'GET',
      url     : "/user/get-courier",
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {      
      $rootScope.courierRequests = data || [];
    });
     $scope.selected1 = true;
     $scope.selected = false;
     $scope.selected2 = false;
     $rootScope.completedRequest = [];
  }

  getCurr();

  /*mySocket.on("receiver courier",function(data){
    if(data.city === $rootScope.checkLogIn.city) {
      $rootScope.courierRequests.unshift(data);
      templateService.playAudio(3);
    }
  });*/

  mySocket.on("completed courier",function(data){
    var elemPos = $rootScope.courierRequests.map(function(x){return x.date.toString()}).indexOf(data.date.toString())
    $rootScope.courierRequests[elemPos].receipt_date = data.receipt_date;
    templateService.playAudio(3);
  })

  $scope.courierBilling = function(courier) {
    $rootScope.aCourierRequest = courier;
     ModalService.showModal({
        templateUrl: 'selected-courier-request.html',
        controller: "selectedCourierRequestController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.isEMP = false; 
        });
    });
  }

  $scope.refresh = function() {
    getCurr();
  }

  $scope.decline = function(request) {
    
    var warn = confirm("This courier request will be deleted.");
    if(warn) {
      request.loading = true;
      $http.put("/user/decline-courier",request)
      .success(function(res){
        request.loading = false;
        var elemPos = $rootScope.courierRequests.map(function(x){return x._id}).indexOf(res._id);
        $rootScope.courierRequests.splice(elemPos,1);
      })
    }
  }

  $scope.current = function(){
    getCurr();
    $scope.selected1 = true;

    $scope.selected2 = false;
  }

  $scope.completed = function() {
    $rootScope.courierRequests = [];
    var url = "/user/get-courier" + "?completed=true";
    $http({
      method  : 'GET',
      url     : url,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) { 
          
      $rootScope.completedRequest = data || [];
    });
    $scope.selected2 = true;
    $scope.selected1 = false;
    $scope.selected = false;
  }

  $scope.ready = function(){
    $http({
      method  : 'GET',
      url     : "/user/get-courier" + "?paid=true",
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {      
      $rootScope.courierRequests = data || [];
    });
    $scope.selected = true;
    $scope.selected2 = false;
    $scope.selected1 = false;
    $rootScope.completedRequest = [];
  }

  $scope.getTotal = function(val1,val2){
    $scope.sum = parseInt(val1) + parseInt(val2);
    return ($rootScope.checkLogIn.currencyCode) ? $rootScope.checkLogIn.currencyCode +
     " " + $scope.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "NGN" +
     " " + $scope.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  $scope.addFieldAgent = function(){
    ModalService.showModal({
        templateUrl: 'new-field-agent.html',
        controller: "fieldAgentCtrl"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          
        });
    });       
  }

  $scope.manageFieldAgent = function(){
    ModalService.showModal({
        templateUrl: 'manage-field-agent.html',
        controller: "manageFieldAgentCtrl"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          
        });
    });       
  }


  //gets  the field agents working for this center
  var agent = fieldAgentService;

  $scope.fieldUser = {};

  agent.query(function(data){
    $scope.agents = data || [];
  });

  $scope.startDelivery = function(courier){
    $scope.fieldUser.courierId = courier._id;
    courier.loading = true;
    $http.put("/user/agent-delivery",$scope.fieldUser)
    .success(function(res){
      courier.loading = false;
      if(res.status){
        courier.on_delivery = res.status;
        courier.delivery_msg = res.message;
      }      
    })
  }

  $scope.toNaira = function(val){
     var str = "NGN" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     return str
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
  }


  /*

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // use the 1st file from the list
    f = files[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {

          jQuery( '#ms_word_filtered_html' ).val( e.target.result );
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
  }

  document.getElementById('upload').addEventListener('change', handleFileSelect, false);

  */

}]);

app.controller("imageModalController",function(){})


app.service("fieldAgentService",["$resource",function($resource){
  return $resource("/user/field-agent",null,{update:{method: "PUT"},del:{method:"DELETE"}})
}]);


app.controller("manageFieldAgentCtrl",["$scope","$http","fieldAgentService",function($scope,$http,fieldAgentService){

  var agent = fieldAgentService;

  agent.query(function(data){
    $scope.agents = data || [];
  });

  $scope.delete = function(id){
    var check = confirm("You want to delete this agent permanently");
    if(check) {
      agent.delete({id: id},function(data){
        if(data.status){
          alert(data.message);
          var elePo = $scope.agents.map(function(x){return x.id}).indexOf(id);
          if(elePo !== -1){
            $scope.agents.splice(elePo,1)
          }
        }
      })
    }
  }
  
  
}]);


app.controller("fieldAgentCtrl",["$scope","$http",function($scope,$http){
  $scope.user = {};

  $scope.create = function(){
    if($scope.message)
      $scope.message = "";

    var intRegex = /[0-9 -()+]+$/;
    var emailReg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;

    if(intRegex.test($scope.user.phone)) {
      if($scope.user.phone[0] == '0'){
        var newSlice = $scope.user.phone.slice(1);
        $scope.user.phone = "+234" + newSlice;
      }
    } else {
      alert("Enter valid phone number.")
      return;
    }

    if(!emailReg.test($scope.user.email)){
      alert("Enter valid email address.");
      return;
    }

    $scope.loading = true;
    $http.post("/user/field-agent",$scope.user)
    .success(function(response){
      if(response.status){
        $scope.isSuccess = response.status;
        $scope.user.password = response.password;
      } else {
        $scope.message = response.message;
      }
      $scope.loading = false;
    });
  }
}]);


app.controller("selectedCourierRequestController",["$scope","$rootScope","$http","mySocket","fieldAgentService",
  function($scope,$rootScope,$http,mySocket,fieldAgentService){
  //this will only allow cebters permitted to render courier services use the feature.
  $scope.request = $rootScope.aCourierRequest;

 
  var totalCost = {};
  var obj = {};
  var deliveryCost;
  var rawCost;
  var snStr;

  $scope.deliveryCharge = $rootScope.checkLogIn.courier_charge || 1000;

  var agent = fieldAgentService;

  $scope.agentLoading = true;
  agent.query(function(data){
    $scope.agentLoading = false;
    $scope.agents = data || [];
    $scope.request.agentId = ($scope.agents[1]) ? $scope.agents[1].id : ($scope.agents.length > 0) ? $scope.agents[0].id : "";
    $scope.request.agentNumber = ($scope.agents[1]) ? $scope.agents[1].phone : ($scope.agents.length > 0) ? $scope.agents[0].phone : "";
  });

  //$scope.agents = $rootScope.checkLogIn.field_agents;
 
  $scope.$watch("request.prescription_body",function(newVal,oldVal){
    if(newVal){
      for(var i = 0; i < newVal.length; i++) {
        if(newVal[i].cost || newVal[i].cost === null) {         
          snStr = newVal[i].sn.toString();
          deliveryCost = $scope.deliveryCharge //newVal[i].delivery_charge || 0;
          $rootScope.aCourierRequest.delivery_charge = $scope.deliveryCharge;
          $rootScope.aCourierRequest.prescription_body[i].cost = newVal[i].cost;
          //totalCost.rawCost = newVal[i].cost;
          totalCost[snStr] = newVal[i].cost //+ $scope.deliveryCharge;
          computeTotal()
        } 
      }
    }
  },true);

  function computeTotal() {
    obj.cost = 0
    for(var j in totalCost) {
      if(totalCost.hasOwnProperty(j)){        
        obj.cost += totalCost[j];
        toNaira(obj.cost);    
      }
    }
  }

  function toNaira(val){
   $scope.str = $rootScope.toCurrency(val);
   $scope.request.total_cost = val;
   var applyDiscount = val * ( $rootScope.checkLogIn.city_grade / 100)
   var amt = val - applyDiscount;
   $scope.receivable = $rootScope.toCurrency(amt);
  }

 

  $scope.sendBilling = function() { 
    $scope.loading = true; 

    if($scope.request.delivery_charge > 0 ) {
      $rootScope.aCourierRequest.attended = true;
      $http({
        method  : 'PUT',
        url     : "/user/courier-update",
        data    : $scope.request,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {  
      if(data.status) {
         $scope.message = data.message;
         var elem = document.getElementById($scope.request._id);
         elem.style.display = "none";
         
      } else {
        $scope.error = data.message;
      }
       
        $scope.loading = false;
      });    
    } else {
      $scope.deliveryChargeMsg = "Please add amount for the for delivery charge."
    }
  }

}]);

//for pharmacists,laboratory,radiologist use this controller
//works just like referredPatientController. pharmacy center search for a patient with ref_id or phone number of the patient as search criteria.
//Object is returned from the backend and displayed on lab-view-test.html template.
app.controller("referredPatientsController",["$scope","$location","$http","templateService","localManager","$rootScope",
  function($scope,$location,$http,templateService,localManager,$rootScope) {

  if($rootScope.queryObj){
    $scope.patient = (Object.keys($rootScope.queryObj).length > 0) ? $rootScope.queryObj : {from: new Date(), to: new Date()};
  } else {
    $scope.patient = {};
    $scope.patient.from = new Date();
    $scope.patient.to = new Date();
  }

  $scope.today = function() {
    $scope.patient.from = new Date();
    $scope.patient.to = new Date();
    $scope.searchTests();
  }

  $scope.days7 = function() {
    var dt = new Date();
    var days = dt.setDate(dt.getDate() - 7);    
    $scope.patient.from = new Date(days);
    $scope.patient.to = new Date();
    $scope.searchTests();
  }


  $scope.searchTests = function() {
    if($scope.patient.patienPhone){
      if($scope.patient.patienPhone.indexOf('+') == -1 || $scope.patient.patienPhone.indexOf('+2') == -1) {
        var newSlice = $scope.patienPhone.phone.slice(1);
        $scope.patient.patienPhone = "+234" + newSlice;
      }
    }

    $scope.loading = true;

    $http.get("/user/pharmacy/find-patient/prescription",{params: $scope.patient})
    .success(function(data){
      $scope.requestList = data;
      $scope.loading = false;
    })

    $rootScope.queryObj = $scope.patient;
  }


  $scope.viewPatientPrescription = function(patient){
    templateService.holdId = patient.ref_id;
    var pageUrl = "/pharmacy/view-prescription/" + patient.ref_id;
    localManager.setValue("currPageForPharmacy",pageUrl);
    localManager.setValue("pharmacyData",patient); 
    $location.path(pageUrl);    
  }


  $scope.clear = function(){
    $scope.patient = {};
    $rootScope.queryObj = null;
  }

  var testPointer;
  $scope.popup = function(pres) {
    //testPointer.isManage = false;
    pres.isManage = true; 
    //testPointer = test;      
  }

  $scope.closePop = function(pres) {
    pres.isManage = false;
  }


  localManager.setValue("currPageForPharmacy",$location.path());
  $scope.searchTests();

  $rootScope.$on('new center data',function(a,b){
    $scope.searchTests();
  })
}]);

app.service("billingAuthService",["$resource",function($resource){
  return $resource("/user/center/billing-verification",null,{verify: {method: "PUT"},
    centerVerify: {method: "POST"}});
}]);

app.service("billingAuthService2",["$resource",function($resource){
  return $resource("/user/referral/billing-verification",null,{referralVerify: {method: "POST"}});
}]);

app.service("paymentVerificationService",["$resource",function($resource){
  return $resource("/user/payment/verification",{userId: null},{verify:{method:'POST'}}); 
}]);

app.controller("pharmacyViewPrescriptionController",["$scope","$location","templateService",
  "localManager","$rootScope","$resource","billingAuthService","paymentVerificationService","phoneCallService",
  "billingAuthService2","$http","fieldAgentService",
  function($scope,$location,templateService,localManager,$rootScope,$resource,billingAuthService,
    paymentVerificationService,phoneCallService,billingAuthService2,$http,fieldAgentService){ 
  //var pharmacyData = templateService.holdPharmacyReferralData = localManager.getValue("pharmacyData");  
  var getCurrentPage = localManager.getValue("currPageForPharmacy");
  var getIdOfCurrentPage = getCurrentPage.split("/");
  var getLastItem = getIdOfCurrentPage[getIdOfCurrentPage.length-1];
  var convertToInt = parseInt(getLastItem);
  var refId = templateService.holdId || convertToInt;

  

  //this $rootScope.refData will be used by all diagnostic centers to hold the refdata for a particular 
  //patient which will be used for billingcontroller
  
  //use to load data if has not been modified or if page is refreshed to restore default.
  $rootScope.refData = localManager.getValue("pharmacyData") || {};




  if($rootScope.refData.pharmacy)
    for(var i = 0; i < $rootScope.refData.pharmacy.prescription_body.length; i++) {
      $rootScope.refData.pharmacy.prescription_body[i].picked = true;
    }


  //check payment
  var billAuth = billingAuthService; //$resource("/user/center/billing-verification",null,{verify: {method: "PUT"}})
  billAuth.get({refId: $rootScope.refData.ref_id},function(data){
    $rootScope.refData.pharmacy.is_paid = data.payment; 
    $rootScope.refData.pharmacy.detail = data.detail || {};
  });
  

  //unavailabledrug once present means the user has fowarded to another center. above if statemaent keeps the modifield version
  $scope.toAnotherPharmacy = function(){      
    $rootScope.unavailableDrugArr = [];
    $rootScope.refData.pharmacy.newList = [];

   
    var list = $rootScope.refData.pharmacy.prescription_body;
    for(var j = 0; j < list.length; j++) {
      var drug = list[j];      
      if(!drug.picked || drug.picked !== true) {
        var filter = {};
        filter.sn = drug.sn;
        filter.drug_name = drug.drug_name;
        filter.dosage = drug.dosage;
        filter.duration = drug.duration;
        filter.frequency = drug.frequency;
        $rootScope.unavailableDrugArr.push(filter);
        drug.unavail = drug.sn.toString(); // this is use to hide unavailable drug temporarily
      } else {
        var filter = {};
        filter.sn = drug.sn;
        filter.drug_name = drug.drug_name;
        filter.dosage = drug.dosage;
        filter.duration = drug.duration;
        filter.frequency = drug.frequency;
        $rootScope.refData.pharmacy.newList.push(filter);
        drug.avail = drug.sn.toString(); // this is use to hide unavailable drug temporarily
      }
    };

    
    $location.path("/search/pharmacy"); 
    //$rootScope.refData.pharmacy.prescription_body = unavailableDrugArr;
    //templateService.holdPrescriptionToBeForwarded = $rootScope.refData;
    rootScope.refData.sender = "Pharmacy";                   
  }

  $scope.refresh = function(){
     $rootScope.refData = localManager.getValue("pharmacyData");
  }

  $scope.toList = function(firstname,lastname,profilePicUrl,ref_id,date){
    var listObj = {};
    listObj.pharmacy = {}
    listObj.pharmacy.patient_firstname = firstname;
    listObj.pharmacy.patient_lastname = lastname;
    listObj.pharmacy.patient_profile_pic_url = profilePicUrl;
    listObj.ref_id = ref_id;
    listObj.date = date;   
    if($rootScope.attendanceList.length > 0){
      var elemPos = $rootScope.attendanceList.map(function(x){return x.ref_id}).indexOf(ref_id)
      if(elemPos === -1){
        $rootScope.attendanceList.push(listObj);
      }
    } else {
      $rootScope.attendanceList.push(listObj);
    }

    var index = $rootScope.allNote.map(function(x){return x.ref_id}).indexOf(ref_id);
    var found = $rootScope.allNote[index];
    $rootScope.noteLen--;

  }

  $scope.done = function(){

  }
  // this logic is good for adding amount of picked drug to the total of all picked drugs. It may be good logic for shopping cart
  var drugForPay = {};
  drugForPay.pickedDrugs = [];
  
  var totalCost = {};
  totalCost.sum = 0;
  //$scope.totalCostOfDrugs = 0;
  $scope.str = "";
 
  $scope.$watch("refData.pharmacy.prescription_body",function(newVal,oldVal){
    if(newVal){
      for(var i = 0; i < newVal.length; i++){
        if(newVal[i].picked && newVal[i].picked === true && !newVal[i].added){
          var selectedDrug = {
            name: newVal[i].drug_name,
            amount: 0,
            id: newVal[i].sn,
            added: true,
            dosage: (newVal[i].dosage) ? newVal[i].dosage : ""
          }
          drugForPay.pickedDrugs.push(selectedDrug);
          newVal[i].added = true;
          totalCost.sum = 0;
          updateTotal();
         
        } else if(newVal[i].picked === false){          
          for(var j = 0; j < drugForPay.pickedDrugs.length; j++){                  
            if(drugForPay.pickedDrugs[j].id === newVal[i].sn){                                                      
              var remove = drugForPay.pickedDrugs.splice(j,1);                     
              delete newVal[i].added;
              break;                                         
            }
          } 
          totalCost.sum = 0;
          updateTotal();
        } 

        if(newVal.length !== drugForPay.pickedDrugs.length) {
          $scope.isForwardable = true;
        } else {
          $scope.isForwardable = false;
        }
      }
    }
  },true);

  $scope.drugsForSurchage = drugForPay.pickedDrugs;
  count = 0;

  $scope.$watch("drugsForSurchage",function(newVal,oldVal){
    count++;
    if (newVal !== null) {
      for(var k = 0; k < newVal.length; k++) {        
       if(oldVal.length > 0 && newVal[k].added) {
        if(oldVal[k])
          totalCost.sum -= oldVal[k].amount;
        totalCost.sum += newVal[k].amount;
        toNaira(totalCost.sum);
       } 

      }        
    }
  },true); 

  function updateTotal() {
    if(drugForPay.pickedDrugs.length > 0){
      var drugs = drugForPay.pickedDrugs;
      for(var l = 0; l < drugs.length; l++){
        drugs[l].added = true;
        totalCost.sum += drugs[l].amount;
        toNaira(totalCost.sum);
      }
      $scope.isFilled = true;
    } else {
      totalCost.sum = 0;
      toNaira(totalCost.sum);
      $scope.isFilled = false;
    }
  }

  function toNaira(val){
    $scope.str = "NGN" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $scope.commissionedAmount = "NGN " + ( val - (val * ($rootScope.checkLogIn.city_grade / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var count = 0;
  // sending billing to patient which otp will be send to patient informing the patient the toal cost of the bill.
  $rootScope.sendBill = function(patientId,oldTime,phoneCall) {


    if(totalCost.sum < 1) {
      var check = confirm("You did not compute the cost of drugs and the total cost is 0. Do you want to continue?");
      if(!check)
        return;
    }

    
    var center = localManager.getValue('resolveUser');
    var time = + new Date();
    $rootScope.resend = time; //sets th old time in case otp  is resend to delete the formal otp sent by thsame user.
    $rootScope.resendPatientId = patientId;
    var sendObj = {
      amount : totalCost.sum,
      userId: patientId,
      time: time,
      old_time: oldTime
    }

    if(phoneCall) {
      count++;
      if(count <= 5) {
        phoneCallService(sendObj,'/user/payment/verification','POST'); 
        $rootScope.showCallingMsg = "This patient will receive a phone call in just a moment. Please enter the pin heard from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }

    } else {
      var otp = paymentVerificationService; 
      $scope.loading = true;
      otp.verify(sendObj,function(data){
        if(data.success){
          alert(data.message);
          $rootScope.refData.amount = $scope.str; // holds the amount to pay for the otp template that will come next 
          $rootScope.refData.rawAmount = totalCost.sum;
          $rootScope.refData.isSearchDrugRef = true;//use to check if precription from search drug utility was in use so that missing fields may be updated
          $scope.isOTP = true;
          //$location.path("/billing-otp");
        } else {
          alert(data.message);
        }
        $scope.loading = false;
      });
    }    
  }

  $scope.call = function(patientId,oldTime) {
    $rootScope.sendBill(patientId,oldTime,'isCall');
  }

  $scope.newPayment = function() {
    $scope.isOTP = false;
    $rootScope.refData.pharmacy.is_paid = false;
    $rootScope.refData.pharmacy.detail = {};
  }


  $scope.centerVerifyPay = function(refInfo) {
    
    $scope.loading = true;

    refInfo.pharmacy.strAmount = $scope.str;

    var billAuth = billingAuthService;

    refInfo.payObj = {
      total: totalCost.sum,
      doctorId: refInfo.pharmacy.doctor_id || "admin",
      type: "Pharmacy",
      patientId: refInfo.pharmacy.patient_id,
      doctorPhone: refInfo.pharmacy.doctor_phone,
      patient_firstname: refInfo.pharmacy.patient_firstname,
      patient_lastname: refInfo.pharmacy.patient_lastname,
      ref_id: refInfo.ref_id
    }

    billAuth.centerVerify(refInfo,function(response){

      $scope.loading = false;
      if(response.payment){      
        alert(response.message);
        refInfo.pharmacy.detail = response.detail;
        refInfo.pharmacy.is_paid = response.payment;
        //refInfo.pharmacy.is_paid = response.payment;
        $rootScope.$broadcast('debit',{status: true});
      } else {
        alert(response.message)
      }

    })
  }

  $scope.referralVerifyPay = function(refInfo) {
    
    $scope.loading = true;

    refInfo.pharmacy.strAmount = $scope.str;

    var billAuth2 = billingAuthService2;

    refInfo.payObj = {
      total: totalCost.sum,
      doctorId: refInfo.pharmacy.doctor_id || "admin",
      type: "Pharmacy",
      patientId: refInfo.pharmacy.patient_id,
      doctorPhone: refInfo.pharmacy.doctor_phone,
      patient_firstname: refInfo.pharmacy.patient_firstname,
      patient_lastname: refInfo.pharmacy.patient_lastname,
      ref_id: refInfo.ref_id
    }

    billAuth2.referralVerify(refInfo,function(response){
      $scope.loading = false;
      if(response.payment){      
        alert(response.message);
        refInfo.pharmacy = response.detail;
        $rootScope.$broadcast('debit',{status: true});
      } else {
        alert(response.message)
      }
    })

  }


  if($rootScope.refData.isCourierType){
    /*$http.get("/user/get-courier",{params:{id:$rootScope.refData.courierId}})
    .success(function(aCourierRequest){
      $scope.request = {}
    })*/

    $scope.request = {
      _id: $rootScope.refData.courierId
    }

    $scope.deliveryCharge = $rootScope.checkLogIn.courier_charge || 1000;

    var agent = fieldAgentService;

    agent.query(function(data){    
      $scope.agents = data || [];
      $scope.request.agentId = ($scope.agents[1]) ? $scope.agents[1].id : ($scope.agents.length > 0) ? $scope.agents[0].id : "";
      $scope.request.agentNumber = ($scope.agents[1]) ? $scope.agents[1].phone : ($scope.agents.length > 0) ? $scope.agents[0].phone : "";
    });

    //$scope.agents = $rootScope.checkLogIn.field_agents;
  }

  $scope.billPatient = function() {
    $scope.loading = true;
    $scope.request.total_cost = totalCost.sum;
    $scope.request.delivery_charge = $rootScope.checkLogIn.courier_charge || 1000;
    $scope.request.prescription_body = $rootScope.refData.pharmacy.prescription_body;

    $http({
      method  : 'PUT',
      url     : "/user/courier-update",
      data    : $scope.request,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {  
      if(data.status) {
        $scope.message = data.message;  
      } else {
        alert(data.message)
      }

      $scope.loading = false;

    });    
  }

}]);

app.controller("invitationCtrl",["$scope","$http","$rootScope","ModalService",function($scope,$http,$rootScope,ModalService){
    $scope.invite = {};

    $scope.someone = function(type){
      $scope.invite.type = type;
    }

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

      if($scope.invite.recepient.indexOf('+') == -1 || $scope.invite.recepient.indexOf("234") == -1){
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





function testNumber(str) {
  var intRegex = /[0-9 -()+]+$/;
  return intRegex.test(str)
}

function calculate_age(dob) { 
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
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






})()