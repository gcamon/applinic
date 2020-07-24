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

//laboratory
app.service("labProfileEditService",["$resource",function($resource){
  return $resource("/user/getcenter-details",null,{updateInfo:{method:"PUT"}});
}]);


//pharmacy
app.controller("pharmacyDrugServicesUpdateController",["$scope","$http","$location","localManager",
  "templateService","Drugs","ModalService","$resource","$rootScope","dynamicService",
  function($scope,$http,$location,localManager,templateService,Drugs,ModalService,$resource,$rootScope,dynamicService) {
    var objLen = Drugs.length;
    var count = 0;
    /* while(objLen > count){
      Drugs.forEach(function(item){
        item.val = true;
      })
      count++
    }*/
    if(!$rootScope.allDrugs2) {
      var resource = dynamicService; //$resource("/user/dynamic-service");
      $scope.loading = true;
      $http({
        method  : 'GET',
        url     : "/user/pharmacy/not-ran-services",        
        headers : {'Content-Type': 'application/json'} 
       })
      .success(function(response) {
        $scope.notService = response;
        resource.query({type:"Pharmacy"},function(data){
          $rootScope.allDrugs2 = data;
          $scope.loading = false;
          var elemPos;
          for(var i = 0; i < $scope.notService.length; i++) {
            elemPos = $rootScope.allDrugs2.map(function(x){return x.id}).indexOf($scope.notService[i].id);
            if(elemPos !== -1){
              $rootScope.allDrugs2[elemPos].val = false;
            }
          }
        });
      });

    }

    $scope.allDrugs = Drugs;


    $scope.saveSelection = function() {     
       ModalService.showModal({
          templateUrl: 'selected-drug-not-have.html',
          controller: "pharmacyDrugNotHaveByCenterModalController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
            $scope.message = "You said " + result;
          });
      });
    }

}]);

app.controller("pharmacyDrugNotHaveByCenterModalController",["$scope","$http","$location",
  "templateService","Drugs","$rootScope",
  function($scope,$http,$location,templateService,Drugs,$rootScope) {
    var notRanList = [];
    var objLen = Drugs.length;
    var userId = $rootScope.checkLogIn.user_id;

    var count = 0;
    while(objLen > count){         
      if(Drugs[count].val === false)
          notRanList.push(Drugs[count]);
      count++;
    }

    if($rootScope.allDrugs2)
      for(var j = 0; j < $rootScope.allDrugs2.length; j++) {
        if($rootScope.allDrugs2[j].val === false) {
          //$rootScope.allDrugs2[j].center_id = userId;
          notRanList.push($rootScope.allDrugs2[j]);
        }
      }
    $scope.selectedDrugs = notRanList;

    $scope.save = function(){
      $scope.loading = true;
      $http({
        method  : 'POST',
        url     : "/user/pharmacy/create-services",
        data    : $scope.selectedDrugs, //forms user object
        headers : {'Content-Type': 'application/json'} 
       })
      .success(function(data) {
        if(data){
          alert("Service saved successfully.")
        }
        $scope.loading = false;
      });                                  
    }

    $scope.goBack = function(){
      $location.path("/pharmacy/drug-service/update");
    }

}]);

app.controller("pharmacyDrugNotHaveBycenterController",["$scope","$http",function($scope,$http){
    $http({
      method  : 'GET',
      url     : "/user/pharmacy/not-ran-services",        
      headers : {'Content-Type': 'application/json'} 
     })
    .success(function(data) {
      
      $scope.notService = data;
    });

    $scope.saveDrugs = function() {
      var picked = [];
      var drugList = $scope.notService;
      for(var i = 0; i < drugList.length; i++){
        if(drugList[i].val === true) {
          picked.push(drugList[i].id)
        }
      }
      $http({
      method  : 'PUT',
      url     : "/user/pharmacy/update-services",
      data    :   picked,       
      headers : {'Content-Type': 'application/json'} 
     })
      .success(function(data) {
        if(data.message) {
          alert("Success! Drug stock updated")
        } else {
          alert("Drug stock is not updated! Something went wrong")
        }
        
      });
    } 

    $scope.$watch("notService",function(newVal,oldVal){
      if(oldVal){
        $scope.isToSave = true;
      }
    },true)                            
}]);


app.service("userLoginService",["$resource",function($resource){
  return $resource('/user/login',null,{logPerson:{method:"POST"}});
}]);

app.service("changPasswordService",["$resource",function($resource){
  return $resource('/user/change-password/:id',{id:"@userId"},{updatePassword:{method:"PUT"},verifyUser:{method:"POST"}});
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

app.service("manageRecordAccessService",["$resource",function($resource){
  return $resource("/user/manage-access",null,{updateAccess:{method: "PUT"},changeKey: {method: "PATCH"}})
}]);

app.service("getBalanceService",["$resource",function($resource){
  return $resource('/user/get-balance',null,{headers:{withCredentials: true}});
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



// reponsible for end message to admi on the contact us 
app.controller("contactController",["$scope","$http",function($scope,$http){
  $scope.contact = {};
  
  $scope.sendMessage = function() {
    $scope.loading = true;
    $http({
      method  : 'POST',
      url     : '/messages',
      data    : $scope.contact, //forms user object
      headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data){      
      $scope.loading = false;
      $scope.responseMessage = "Message sent! we will contact you soon.";
    })
  }
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

app.controller('pictureController',["$scope","$http","$location","multiData",function($scope,$http,$location,multiData) {
   $scope.user = {};
    
   $scope.update = function(typeOfFile){
    $scope.user.type = typeOfFile;
    var uploadUrl = "/user/update";     
     multiData.sendPic(uploadUrl,$scope.user);    
    } 
}]);





app.service("profileDataService",["$resource",function($resource){
  return $resource("/user/get-profile-data");
}]);



//start directive
app.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="{star: star.filled === true}"  >' + //ng-click="toggle($index)"
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: scope.ratingValue > i
                    });
                  //scope.isStar = true; 
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                  rating: index + 1
                });
                
            };


            updateStars();

            /*scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });*/
        }
    }
});


app.controller("skillModalController",["$scope","$rootScope","localManager",function($scope,$rootScope,localManager){

}]);


//use to change phone or email of a user.
app.controller("authChangeController",["$scope","$rootScope","$http","$location","multiData2","$window","localManager","mySocket",
  function($scope,$rootScope,$http,$location,multiData2,$window,localManager,mySocket) {
  $scope.user = {};
  $scope.email =  $rootScope.checkLogIn.email; 
  $scope.phone =  $rootScope.checkLogIn.phone;
  $rootScope.message = "";
  $scope.update = function(arg){
    if(arg == "phone"){
     
      if(typeof $scope.user.phone === 'number'){
        sendForm();
      } else {
        alert("Invalid phone number")
      }
    }

    function sendForm(){
      $http({
      method  : 'PUT',
      url     : "/user/change-auth",
      data    : $scope.user, //forms user object
      headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data) {              
        if(data.status === "success"){
          alert("yes oooo")
          $rootScope.status = data.message;
          $rootScope.message = data.message;
          $rootScope.phone = $scope.user.phone         
        } else if(data.status === "failed") {
          $scope.error = data.message;
        }

       
      });                 
    }

    $scope.tryAgain = function(){
      $scope.message = "";
      delete $scope.status;
    }          
  }     
}]);

app.service("phoneUpdateService",["$resource",function($resource){
  return $resource("/user/new-phone-update",null,{userChangeNumber:{method: "PUT"}});
}]);

app.controller("verifyPhoneForChangeController",["$rootScope","$scope","$resource","$window","phoneUpdateService",
  function($rootScope,$scope,$resource,$window,phoneUpdateService){
  $scope.verify = {};
  $scope.verify.phone = $rootScope.phone;
  $rootScope.status = "success";
  $scope.sendForm = function (){
    var user = phoneUpdateService; //$resource("/user/new-phone-update",null,{userChangeNumber:{method: "PUT"}})    
    user.userChangeNumber($scope.verify,function(response){
      alert("Phone number changed!")
      
      $rootScope.message = response.message;
      if(response.status === "updated"){
        $scope.isUpdate = true;
      }
    });
  }

}]);





//controller for searches from  the home page Note this controller is abandoned for now
app.controller('searchController',["$scope","$http","$location","$window","multiData","localManager","templateService",
  function($scope,$http,$location,$window,multiData,localManager,templateService) {
   $scope.user = {};
   $scope.user.type = "Doctor";
    $scope.search = function(){
      if($scope.user.city !== undefined) {
        var capitalize = $scope.user.city.charAt(0).toUpperCase() + $scope.user.city.slice(1);
        $scope.user.city = capitalize;        
      }

       var filterInput = {};
      for(var i in $scope.user){
        if($scope.user.hasOwnProperty(i) && $scope.user[i] !== "" && $scope.user[i].length > 1) {
          filterInput[i] = $scope.user[i];
        }
      }
            
      $http({
        method  : 'POST',
        url     : "/user/find-group",
        data    : filterInput, //forms user object
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {              
        if(data){
          localManager.setValue("userInfo",data);
          $window.location.href = "/user/find-specialist";
        }
      });                                    
    }    
}]);

app.service("patientfindDoctorService",["$resource",function($resource){
  return $resource("/user/patient/find-doctor");
}]);

//for the list of doctors page

app.service("skillProcedureService",["$resource",function($resource){
  return $resource("/user/skills-procedures");
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
        console.log(data)
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
          window.location.href = "/user/chat/general";
        } else if(templateService.holdId) {
          $location.path("/general-chat");
        } else {
          alert("You have no messages yet.");
        }
      })

      $rootScope.chatReqCount++;
      
    });

  }

}]);




//conroller id found inside a modal when user finally complete sending request to a doctor. it builds request object to be sent
app.controller("connectController",["$scope","$location","$http","localManager","templateService",
  function($scope,$location,$http,localManager,templateService){
  
   //code moved to bookingModalController for better UX.
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

//brings a  selected doctor to the patient profile page
app.controller('bookController',["$scope","$http","$location","$window","localManager","ModalService","templateService",
  function($scope,$http,$location,$window,localManager,ModalService,templateService) {

  var doctorsList = localManager.getValue("userInfo")
  $scope.book = function(person){
    var elementPos = doctorsList.map(function(x){return x.user_id}).indexOf(person)
    var objFound = doctorsList[elementPos];
    templateService.holdForSpecificDoc = objFound;   
    templateService.doctorsData = localManager.getValue("userInfo");
    getAHelp("book");    
  }

  $scope.ask = function(person){
    var elementPos = doctorsList.map(function(x){return x.user_id}).indexOf(person)
    var objFound = doctorsList[elementPos];
    templateService.holdForSpecificDoc = objFound;   
    getAHelp("ask")
  }

  function getAnswer(type) {

  }

  function getAHelp(type) {
    var checkIsLoggedIn = localManager.getValue("resolveUser");
     if(checkIsLoggedIn.isLoggedIn) {
      //make a modal call
      if(type === "book") {
        alert("jsdjs")
        //modalCall("selected-doc.html","bookingDocController")
        $location.path('consult-specialist');
      } else if(type === "ask") {
        modalCall("question.html","bookingDocController")
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
                      
}]);



app.service("getAllLaboratoryService",["$resource",function($resource){
  return $resource("/user/getAllLaboratory")
}]);


app.service("getAllRadiologyService",["$resource",function($resource){
  return $resource("/user/getAllRadiology");
}]);


app.controller("findLabController",["$scope","$http","localManager","$location","templateService",
  function($scope,$http,localManager,$location,templateService){
  $http({
      method  : 'GET',
      url     : "/user/doctor/find-laboratory",
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {          
      if(data.length > 0) {
        $scope.isFound = true;
        $scope.labCenters = data;
      } else {        
        $scope.isError = true;
        $scope.message = "Oops! Currently, It seems there are no laboratory center registered within your location. You can search for other locations";
      }
  });

  $scope.laboratory = {};
  $scope.search = function() {    
    $http({
      method  : 'PUT',
      url     : "/user/doctor/find-laboratory/search",
      data : $scope.laboratory,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      if(data.length > 0)  {
        $scope.isError = false;
        $scope.isFound = true;             
       $scope.labCenters = data;
      } else {
        $scope.isFound = false;
        $scope.isError = true;
         $scope.message = "Oops! No laboratory center was found based on your search criteria.Try again or check modify your search criteria.";
      }
    });
  }

  $scope.getLab = function(id){     
    var elementPos = $scope.labCenters.map(function(x) {return x.user_id; }).indexOf(id);
    var objectFound = $scope.labCenters[elementPos];          
    templateService.holdTheLaboratoryToFowardTestTo =  objectFound; 

    //use this block below if error occur.

  /*$scope.pharmacyData.forEach(function(center){
    if(center.user_id === id){
      templateService.holdTheCenterToFowardPrescriptionTo = center;
      return;
    }
  });*/     
    $location.path('/selected-laboratory/' + id);
  }

}]);

app.controller("findRadioController",["$scope","$http","localManager","$location","templateService",
  function($scope,$http,localManager,$location,templateService){
  $http({
      method  : 'GET',
      url     : "/user/doctor/find-radiology",
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {          
      if(data.length > 0) {
        $scope.isFound = true;
        $scope.labCenters = data;
      } else {        
        $scope.isError = true;
        $scope.message = "Oops! Currently, It seems there are no laboratory center registered within your location. You can search for other locations";
      }
  });

  $scope.radiology = {};
  $scope.search = function() {    
    $http({
      method  : 'PUT',
      url     : "/user/doctor/find-radiology/search",
      data : $scope.radiology,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      if(data.length > 0)  {
        $scope.isError = false;
        $scope.isFound = true;             
        $scope.labCenters = data;
      } else {
        $scope.isFound = false;
        $scope.isError = true;
        $scope.message = "Oops! No laboratory center was found based on your search criteria.Try again or check modify your search criteria.";
      }
    });
  }

  $scope.getRadio = function(id){     
    var elementPos = $scope.labCenters.map(function(x) {return x.user_id; }).indexOf(id);
    var objectFound = $scope.labCenters[elementPos];          
    templateService.holdTheLaboratoryToFowardTestTo =  objectFound; 

    $location.path('/selected-radiology/' + id);
  }

}]);



app.controller("selectedLabController",["$scope","$http","localManager","$location","templateService",
  function($scope,$http,localManager,$location,templateService){
  $scope.placeHolder = true;
  $scope.labCenter = templateService.holdTheLaboratoryToFowardTestTo;

  $scope.isEnquiry = function(){
    $scope.isContactFirst = true;
  } 

   
  
  $scope.sendTest = function () {
    var sendObj = {};
    var date = new Date();
    
    //create patient object to be sent alongside the lab test to run.
    sendObj.patient_id = templateService.holdForSpecificPatient.patient_id;
    sendObj.user_id = $scope.labCenter.user_id;
    sendObj.lab_test_list = templateService.holdSelectedLabTest;
    sendObj.patient_firstname = templateService.holdForSpecificPatient.patientInfo.firstname;
    sendObj.patient_lastname = templateService.holdForSpecificPatient.patientInfo.lastname;
    sendObj.patient_profilePic = templateService.holdForSpecificPatient.patientInfo.profilePic;
    sendObj.patient_title = templateService.holdForSpecificPatient.patientInfo.title;
    sendObj.session_id = templateService.holdForSpecificPatient.session_id;
    sendObj.date = date;
    //sending lab test to a selected lab center to the backend for storage;
   
    $http({
      method  : 'POST',
      url     : "/user/doctor/send-test",
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      
      if(data.success){
        $scope.success = true;
        $scope.placeHolder = false;
        $scope.ref_number = data.ref_no;
        $scope.message = "Test has been forwrded"
      } else {
        $scope.message = "Error occured wihile sending the Lab test. Try again.";
      }
    });
  }

}]);

app.controller("selectedRadioController",["$scope","$http","localManager","$location","templateService",
  function($scope,$http,localManager,$location,templateService){
    $scope.placeHolder = true;
  $scope.labCenter = templateService.holdTheLaboratoryToFowardTestTo;

  $scope.isEnquiry = function(){
    $scope.isContactFirst = true;
  } 

   
  
  $scope.sendTest = function () {
    var sendObj = {};
    var date = new Date();
   
    //create patient object to be sent alongside the lab test to run.
    sendObj.patient_id = templateService.holdForSpecificPatient.patient_id;
    sendObj.user_id = $scope.labCenter.user_id;
    sendObj.lab_test_list = templateService.holdSelectedLabTest;
    sendObj.patient_firstname = templateService.holdForSpecificPatient.patientInfo.firstname;
    sendObj.patient_lastname = templateService.holdForSpecificPatient.patientInfo.lastname;
    sendObj.patient_profilePic = templateService.holdForSpecificPatient.patientInfo.profilePic;
    sendObj.patient_title = templateService.holdForSpecificPatient.patientInfo.title;
    sendObj.session_id = templateService.holdForSpecificPatient.session_id;
    sendObj.date = date;
    //sending lab test to a selected lab center to the backend for storage;
    $http({
      method  : 'POST',
      url     : "/user/doctor/radiology/send-test",
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      
      if(data.success){
        $scope.success = true;
        $scope.placeHolder = false;
        $scope.ref_number = data.ref_no;
        $scope.message = "Test has been forwrded"
      } else {
        $scope.message = "Error occured wihile sending the Lab test. Try again.";
      }
    });
  }
}]);


//after a selected patient is clicked to be view this controller is connected waiting for the doctor to accept to run its modal 
//and pass some data like the doctor's firstname.
app.controller("requestController",["$scope","ModalService","requestManager","templateService","$rootScope",
  function($scope,ModalService,requestManager,templateService,$rootScope){
  $rootScope.data = requestManager.get();
  $scope.docName = templateService.getfirstname;

  $scope.accept = function(){   
      ModalService.showModal({
          templateUrl: 'granted-request.html',
          controller: "grantedRequestController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
      });
    });
   
  }

  $scope.decline = function(){   
      ModalService.showModal({
          templateUrl: 'declined-request.html',
          controller: "grantedRequestController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
      });
    });
   
  }

  $scope.referToAnother = function(){   
    ModalService.showModal({
          templateUrl: 'redirect-request.html',
          controller: "referRequestController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {             
      });
    });
  }

  $scope.viewFile = function(file){
    if(file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/png'){
      $rootScope.file = file;
      ModalService.showModal({
          templateUrl: 'image-viewer.html',
          controller: "viewerModalController"
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {             
        });
      });
    } 
  }



}]);

app.controller("viewerModalController",["$scope",function($scope){}])





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

app.controller('infoController',["$scope",function($scope){

}]);







////////////////////////////////////////////////////////////////////////////////////
//controller passes data from the page to angular. data from the patient notification box to be used within angular.
app.controller('patientWelcomeController',["$scope",function($scope){

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




app.service("chatHistoryService",["$resource",function($resource){
  return $resource("/user/get-chats");
}]);


app.service("getPersonProfileService",["$resource",function($resource){
  return $resource("/user/get-person-profile");
}]);





//in the alerted modal check to see if the patient has enough fund in the wallet before continueing with the transaction.
//gets the patients wallent anount and cpmpares with the doctor's consultation fee billed.
app.controller("insuficientFundController",["$scope","$location","ModalService","requestManager","templateService",function($scope,$location,ModalService,requestManager,templateService){
  $scope.consultationFee = templateService.holdfee;
  $scope.walletAmount = templateService.holdwalletAmount;
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

app.service("patientBillingService",["$resource",function($resource){
  return $resource("/user/payment/patient-billing",null,{sendBill:{method: "POST"}});
}]);

//just like wallet coontroller above. Takes care of patients billing.iru
app.controller("billingController",["$scope","$http","$rootScope","$location","ModalService",
  "requestManager","templateService","localManager","$resource","walletService","patientBillingService",
  function($scope,$http,$rootScope,$location,ModalService,requestManager,
    templateService,localManager,$resource,walletService,patientBillingService){

    $scope.pay = {};
    var bill = patientBillingService;//$resource("/user/payment/patient-billing",null,{sendBill:{method: "POST"}});
    
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
          otp: newStr,
          date: date,
          message: "Billing",
          total: $rootScope.refData.rawAmount,// this value is set from the connroller that brought about this on
          patientId: $rootScope.refData.pharmacy.patient_id,
          doctorId: $rootScope.refData.pharmacy.doctor_id,
          patient_firstname: $rootScope.refData.pharmacy.patient_firstname,
          patient_lastname: $rootScope.refData.pharmacy.patient_lastname,
          prescriptionId: $rootScope.refData.pharmacy.prescriptionId,
          refId: $rootScope.refData.ref_id,
          doctorPhone: $rootScope.refData.pharmacy.doctor_phone,
          prescriptionBody: ($rootScope.refData.isSearchDrugRef) ? $rootScope.refData.pharmacy.prescription_body : null
        }

        bill.sendBill(payObj,function(data){         
          if(data.balance) {
            //templateService.playAudio(2);          
            //$rootScope.balance = "NGN" + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $rootScope.$broadcast('debit',{status: true});
            $scope.isPaid = true; 
            $rootScope.refData.pharmacy.is_paid = true; 
            $rootScope.refData.pharmacy.detail = {
              amount: "NGN" + $rootScope.refData.rawAmount,
              date: date
            }
          }        
          alert(data.message);
        });
      }
    });

    $scope.goBack = function(){
      $location.path(localManager.getValue("currPageForPharmacy"))
    }

}]);


app.controller("accoundLoaderConTroller",["$rootScope",function(rootscope){

}])

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






//this controller handles the selected center chosen to forward anything to. including patients prescription.
app.controller("selectedCenterController",["$scope","$location","$http","templateService",function($scope,$location,$http,templateService){
  $scope.centerInfo = templateService.holdTheCenterToFowardPrescriptionTo;

  $scope.isEnquiry = function(){
    $scope.isContactFirst = true;
  }

  $scope.placeHolder = true;

  /*
  * @sendReferral this scope function is basically used by both doctor and patient. It should be use when doctor wants to refer a patient for
  * lab test, scan, prescription. But only used when a patient wants to forward his prescription to his desired phamarcy center.
  * most times, this fn is hit by the patients's doctor as he is the one that shld refer a patient to a diagnostic centers.
  * when the sendReferral is invoked referral object is created based on the type of diagnostic center. Centers are routed separately to their
  * specific url. Note referral object is save on the center's referral schema on the database.
  */

  $scope.sendReferral = function (id,type) {
      //id refers to the user_id of the phamarcy referred to.
      switch (type) {
        case "Pharmacy":
          if(templateService.holdPrescriptionToBeForwarded.sender === "doctor"){
            
            sending(id,type,"/user/patient/pharmacy/referral");
          } else if (templateService.holdPrescriptionToBeForwarded.sender ==="patient") {
            sending(id,type,"/user/patient/pharmacy/referral-by-patient");
          } else if(templateService.holdPrescriptionToBeForwarded.sender ==="Pharmacy") {
             sending(id,type,"/user/patient/pharmacy/referral-by-pharmacy");
          }
        break;

        case "Laboratory":
          sending(id,type,"/user/patient/laboratory/referral");
        break;

        case "Radiology":
          sending(id,type,"/user/patient/radiology/referral");
        break;

        default:
        break;
      }      
      
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var sending = function(id,type,url) {      
      if(type === 'Pharmacy'){   
        templateService.holdPrescriptionToBeForwarded.user_id = id; //user_id is the id of the pharmcy patient is forwarding prescription to.               
        
      }      
      $scope.placeHolder = false;
      $scope.sendGif = true;
      $http({
        method  : 'PUT',
        url     : url , 
        data    : templateService.holdPrescriptionToBeForwarded,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
       
        $scope.sendGif = false;
        $scope.message = {};
        $scope.message.ref = data.ref_id;
        if(data.success){
         $scope.message.info = "Prescription sent successfully!!!";
         $scope.success = true;
        } else {          
          $scope.placeHolder = true;
          $scope.message = "Prescription not sent!! Try again.";
        }
      });
  }

}]);


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


 
   /*if(person.typeOfUser === "Patient"){
     //patients  see doctors as the log in
     mySocket.on("doctor presence",function(data){
      //var elemPos = $rootScope.patientsDoctorList.map(function(x){return x.doctor_id}).indexOf(data.doctor_id);
      //var found = $rootScope.patientsDoctorList[elemPos];
      //found.presence = data.presence;
      //$rootScope.dispalyPresence = data.presence;  
      $rootScope.$broadcast("users presence",{type: 'doctorList',data: $rootScope.patientsDoctorList ,sockets: data.connects});         
     });
   } else if(person.typeOfUser === "Doctor") {
   //doctors see patients the log in. doctors can only see logged in patients but not all the patients at once.
   // this could be modified later as to control the number of patients in the doctor's dashboard.
    mySocket.on("patient presence",function(data){
      /*var elemPos = $rootScope.patientList.map(function(x){return x.patient_id}).indexOf(data.patient.user_id);
      var found = $rootScope.patientList[elemPos];
      if(elemPos === -1 && data.presence){
        var patient = {
          patient_profile_pic_url: data.patient.profile_pic_url,
          patient_firstname: data.patient.firstname,
          patient_lastname: data.patient.lastname,
          patient_id: data.patient.user_id,
          presence: true
        }
        $rootScope.patientList.push(patient);
        $rootScope.patientAvailability = data.presence; // note $rootScope.patientAvailability is use to control patient presence in the view.  
      } else {
        found.presence = data.presence;
        $rootScope.dispalyPresence = data.presence;
        $rootScope.patientAvailability = data.presence;  
      }

      $rootScope.$broadcast("users presence",{type: 'patientList',data: $rootScope.patientList ,sockets: data.connects});
      
     });
  }*/

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

}]);




app.controller("redirectModal",["$rootScope","$window",function($rootScope,$window){
  $window.location.href = $rootScope.tokBoxUrl;//$rootScope.controlUrl //redirects to video call page
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

}]);  


app.controller("newUserDetailsModal",["$scope","$rootScope",function($scope,$rootScope){
 
}]);




app.service("cashOutControllerService",["$resource",function($resource){
  return $resource("/user/cashout",null,{cashing:{method: "POST"},update:{method: "PUT"}});
}]);


app.controller('adminCourierModalCtrl',["$rootScope","$http",function($rootScope,$http){
  $http({
    method  : 'GET',
    url     : "/user/admin/get-courier?id=" + $rootScope.courierId,
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {
    $rootScope.courierDetails = data || {};
  });
}]);             



/*app.controller("cashoutModalController",["$scope","$rootScope","templateService",function($scope,$rootScope,templateService){
  
}]);*/

app.controller("cashOutController",["$scope","$rootScope","$resource","cashOutControllerService",
  "bankDetailsService","phoneCallService","paymentVerificationService",
  function($scope,$rootScope,$resource,cashOutControllerService,bankDetailsService,phoneCallService,paymentVerificationService){
  $scope.bankDetail = {};

  var user = bankDetailsService;
  var elemPos;

  user.query(function(data){
    $scope.bankDetails = data;
    if(data.length > 0) {
      $scope.bankDetail.acc = data[0].acc_no;
    }
  });

  var cashOut = cashOutControllerService; 

  cashOut.query({id: $rootScope.checkLogIn.user_id},function(res){
    $scope.requests = res;
  })

  $scope.$watch("bankDetail.acc",function(newVal,oldVal){
    if(newVal) {
      elemPos = $scope.bankDetails.map(function(x){return x.acc_no.toString()}).indexOf(newVal);
      if(elemPos !== -1) {
        $scope.bankDetail.account_number = newVal;
        $scope.bankDetail.account_type = $scope.bankDetails[elemPos].acc_type;
        $scope.bankDetail.bank_name = $scope.bankDetails[elemPos].bank_name;
      }
    }
  });

  $scope.$watch("bankDetail.amount",function(newVal,oldVal){
    if(oldVal){
      $scope.str = "NGN " + $scope.bankDetail.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  });  

  var count = 0;
  $scope.auth = function(oldTime,phoneCall) {

      $scope.isSent = false;

      if(!$scope.bankDetail.amount){
        alert("Please enter amount you want to withdraw.")
        return;
      }

      if(!$scope.bankDetail.account_number){
        alert("Please choose account to use.")
        return;
      }

      var time = + new Date();
        $rootScope.resend = time;
        var sendObj = {
        amount : $scope.bankDetail.amount,
        userId: $rootScope.checkLogIn.user_id,
        time: time,
        old_time: oldTime,
        isCashOutVerify: "yes"
      }

    if(phoneCall) {
      count++;
      if(count < 5) {
        phoneCallService(sendObj,'/user/payment/verification','POST'); 
        $rootScope.showCallingMsg = "This patient will receive a phone call in just a moment. Please enter the pin heard from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }
    } else {
      $scope.loading = true;
      var otp = paymentVerificationService; 
      otp.verify(sendObj,function(data){
        $scope.loading = false;      
        if(data.success){
          $scope.otpMsg = "One Time Pin was sent to your phone. Use the pin to verify is you."
          $scope.isVerify = true;
        } else {
          alert(data.message);
        }      
      });
    }
  }

  $scope.cash = function(){
    if(!$scope.bankDetail.account_number) {
      alert("Please select account to use.");
    } else if(Object.keys($scope.bankDetail).length >= 3 && $scope.bankDetail.amount && $scope.bankDetail.amount !== "") {

      if(!$scope.bankDetail.otp) {
        alert('Please enter OTP');
        return;
      }

      var pin = $scope.bankDetail.otp;
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
       
      $scope.bankDetail.otp = str.replace(/\s*$/,"");
      $scope.loading = true;
      cashOut.cashing($scope.bankDetail,function(data){
        $scope.loading = false;
        alert(data.message);
        if(data.balance) {
          /*var whole = Math.round(data.balance);
          var format = "NGN" + whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          $rootScope.balance = format;*/
          $rootScope.$broadcast('debit',{status: true});
          $scope.isSent = true;
        }    
      });
    } else {
      alert("Please fill out all fields");
    }
  }


  $scope.requestAgain = function() {
    $scope.isVerify = false;
    $rootScope.resend = null;
  }

}]);





app.directive('anItem', function(){
  return {
    templateUrl: '/assets/pages/chat/pallet.html'
  };
});

app.directive('nop', function(){
    return {
        link: function(scope, elm, attr){
          var base = document.getElementById('base');
          base.scrollTop = 0
          base.scrollTop = elm[0].scrollHeight
          
          elm.css('color', 'red');
        }
    }
});




app.service("drugNotRanService",["$resource",function($resource){
  return $resource("/user/pharmacy/not-ran-services");
}]);

app.service("getAllPharmacyService",["$resource",function($resource){
  return $resource("/user/patient/getAllPharmacy");
}]);



/*
  this cotroller no longer in use maybe reoved later.
*/
app.controller("prescriptionModalController",["$scope","$http","$window","localManager","templateService","$location","$rootScope","Drugs",
  function($scope,$http,$window,localManager,templateService,$location,$rootScope,Drugs) {
    $scope.patient = templateService.holdPrescriptionToBeForwarded;
    $scope.testObj = templateService.holdPrescriptionTestObj;

    //creates drug object for the ng-repeat on the view.
    $scope.drugs = Drugs;
    var drug_name;
    var index;
    $scope.getDrug = function(drugName){
      drug_name = drugName;
      if($scope.drugList.length === 1)
        $scope.drugList[0].drug_name = drugName;
      if( $scope.drugList.length > 1)
        $scope.drugList[index].drug_name = drugName;
    }

    var drug = {};
    var count = {};
    count.num = 1;
    drug.sn = count.num;
    $scope.drugList = [drug]; // this populates the array for the view ng-repeat. this is the prescription body as the doctor writes it.

    $scope.addDrug = function(){  
      var newDrug = {};         
      count.num++;
      newDrug.sn = count.num;
      $scope.drugList.push(newDrug);
      index = $scope.drugList.length - 1;      
    }

    $scope.removeDrug = function(){
      if(count.num > 1){
        $scope.drugList.pop(drug);
        count.num--;
        index--;
      }
    }
    var finalBody;
    $scope.$watch("drugList",function(newVal,oldVal){
      $scope.patient.prescriptionBody = newVal;// adds prescription body to the prescription object as the doctor 
    //prepares to send it to the back end.
    },true)    

    // adds prescription body to the prescription object as the doctor 
    //prepares to send it to the back end.

    $scope.patient.ref_id = $scope.testObj.ref_id;

    
    if($scope.testObj.type_of_test === "laboratory") {
      $scope.patient.lab_analysis = $scope.testObj.conclusion;
    } else if($scope.testObj.type_of_test === "radiology") {
      $scope.patient.scan_analysis = $scope.testObj.conclusion;
    }

    $scope.toPatient = function(){
      //doctor creates the prescription object and sends it the the back end. url is "patient/forwarded-prescription", other informations that
      //comes with the prescription object added to the prescription object in the backend.
      $http({
        method  : 'PUT',
        url     : "/user/patient/forwarded-prescription",
        data    : $scope.patient,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {      
        alert(data.message);
        updateTheTestSent(data.ref_id,data.name,data.address,data.city,data.country,"patient")
      });      
    }

   
    $scope.isToPrescribe = true;

    $scope.toPharmacy = function(){
      $scope.pharmacy = {};
      $scope.loading = true;
      $http({
            method  : 'GET',
            url     : "/user/patient/getAllPharmacy",
            headers : {'Content-Type': 'application/json'} 
            })
          .success(function(data) { 
            $scope.loading = false;       
            $scope.pharmacyData = data;       
            $scope.pharmacy.city = data[0].city;
        });        

        $scope.isToPrescribe = false;
        $scope.isFindPharmacy = true;

      //doctor creates a prescription object like above but saves it to a service called holdPrescriptionToBeForwarded. which will later be forwarded
    //to the backend after the doctor have searched and found the phamarcy to forward the prescription to.      
      //$location.path("/search/pharmacy");
    }

    $scope.findPharmacy = function () {
      var searchObj = {};
      $scope.loading = true;
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
        $scope.loading = false;
        $scope.pharmacyData = data;
      });
    }


    $scope.forwardPrescriptionTo = function(id){
      var elementPos = $scope.pharmacyData.map(function(x) {return x.user_id; }).indexOf(id);
      var objectFound = $scope.pharmacyData[elementPos];          
      $scope.centerInfo =  objectFound;

      
      $scope.isEnquiry = function(){
        $scope.isContactFirst = true;
      }

      $scope.placeHolder = true;

      /*
      * @sendReferral this scope function is basically used by both doctor and patient. It should be use when doctor wants to refer a patient for
      * lab test, scan, prescription. But only used when a patient wants to forward his prescription to his desired phamarcy center.
      * most times, this fn is hit by the patients's doctor as he is the one that shld refer a patient to a diagnostic centers.
      * when the sendReferral is invoked referral object is created based on the type of diagnostic center. Centers are routed separately to their
      * specific url. Note referral object is save on the center's referral schema on the database.
      */

      $scope.sendReferral = function (id,type) {
          //id refers to the user_id of the phamarcy referred to.
          sending(id,type,"/user/patient/pharmacy/referral");
          
      }
       var sending = function(id,type,url) {      
        if(type === 'Pharmacy'){   
          templateService.holdPrescriptionToBeForwarded.user_id = id; //user_id is the id of the pharmcy patient is forwarding prescription to.               
          
        }      
        $scope.placeHolder = false;
        $scope.sendGif = true;
        $http({
          method  : 'PUT',
          url     : url , 
          data    : templateService.holdPrescriptionToBeForwarded,
          headers : {'Content-Type': 'application/json'} 
          })
        .success(function(data) {         
          $scope.sendGif = false;
          $scope.message = {};
          $scope.message.ref = data.ref_id;
          if(data.success){
           $scope.message.info = "Prescription sent successfully!!!";
           $scope.success = true;
           updateTheTestSent(data.ref_id,data.name,data.address,data.city,data.country);
          } else {          
            $scope.placeHolder = true;
            $scope.message = "Prescription not sent!! Try again.";
          }
        });
      }   


      $scope.isToPrescribe = false;
      $scope.isFindPharmacy = false;
      $scope.isCenter = true;

      
    }


      $scope.back = function(state) {
        switch(state){
          case "find":
          $scope.isToPrescribe = true;
          $scope.isFindPharmacy = false;
          $scope.isCenter = false;
          break;

          case "center":
          $scope.isToPrescribe = false;
          $scope.isFindPharmacy = true;
          $scope.isCenter = false;
          break;

          default:
          break;
        }
      }

      var updateTheTestSent = function(id,name,address,city,country,receiver) {
        
        var theTest;
        switch($scope.testObj.type_of_test){
          case "laboratory":
            theTest = templateService.labPrescriptionReq;
          break;
          case "radiology":
           theTest = templateService.radioPrescriptionReq
           break;
          default:
           break;
        }
        var elementPos = theTest.map(function(x){return x.ref_id}).indexOf(id);
        var objectFound = theTest[elementPos];        
        var date = Math.floor(Date.now());
        if(receiver === "patient") {
          var attended = {
            patient: "This patient",            
            date_sent: date
          }
        } else {    
          var attended = {
            name: name,
            city: city,
            address: address,
            country: country,
            date_sent: date
          }
        }
        if(!objectFound.attended)
          objectFound.attended = [];


        objectFound.attended.push(attended);
        localManager.setValue("attended", objectFound.attended);

        $scope.theAttended = localManager.getValue("attended");
        
      }

}]);



app.controller("callController",["$scope",function($scope){

}]);


//for phamarcists
app.controller("pharmacyCenterDashboardController",["$scope","$location","templateService","localManager","$rootScope",
  function($scope,$location,templateService,localManager,$rootScope){
    var currPage = localManager.getValue("currPageForPharmacy");
    if(currPage) {
     $location.path(localManager.getValue("currPageForPharmacy"));
    } else {
      //$location.path("/referred-patients");
      $location.path("/referred-patients");
    }
    $rootScope.attendanceList = localManager.getValue("holdPrescriptionForAttendance") || []; //display patients in attendace list when added

    
}]);

app.service("pharmacyProfileEditControllerService",["$resource",function($resource){
  return $resource("/user/getcenter-details",null,{updateInfo:{method:"PUT"}})
}]);

app.controller("pharmacyProfileEditController",["$scope","$resource","$location","$window",
  "ModalService","templateService","localManager","pharmacyProfileEditControllerService",
  function($scope,$resource,$location,$window,ModalService,templateService,localManager,pharmacyProfileEditControllerService) {
  var center = pharmacyProfileEditControllerService;//$resource("/user/getcenter-details",null,{updateInfo:{method:"PUT"}})
  center.get(function(data){
    $scope.centerInfo = data || {};
  })

  
  $scope.sendUpdate = function() {
    $scope.loading = true;
    center.updateInfo($scope.centerInfo,function(res){
      $scope.loading = false;
      $scope.status = res.status;
    })
  }

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

app.controller("pharmacyCenterNotificationController",["$scope","$location","$resource","$window","templateService","deleteFactory",
  "localManager","chatService","$rootScope","mySocket","pharmacyCenterNotificationControllerService",
  "addNoteService","viewNoteService","$http","$filter","deviceCheckService",
  function($scope,$location,$resource,$window,templateService,deleteFactory,localManager,chatService,
    $rootScope,mySocket,pharmacyCenterNotificationControllerService,
    addNoteService,viewNoteService,$http,$filter,deviceCheckService){

  var notification = pharmacyCenterNotificationControllerService; //$resource("/user/center/get-notification");

  
  notification.get(null,function(data){
    $rootScope.allNote = data.diagnostic_center_notification || [];
    $rootScope.noteLen = $rootScope.allNote.length || 0;
  });
 

  mySocket.on("center notification",function(data){
    templateService.playAudio(3);
    $rootScope.allNote.push(data);
    $rootScope.noteLen++;

    if(data.isNewDrug){
      $rootScope.$broadcast('new center data')
    }
  });

  $rootScope.viewNote = function(id){
    templateService.holdId = id;
    var prescription = viewNoteService; //$resource("/user/pharmacy/get-referral");
    prescription.get({refId: id},function(data){
     
      localManager.setValue("pharmacyData",data); //pharmacyData refers to patients prescription
      var pageUrl = "/pharmacy/view-prescription/" + id;
      $location.path(pageUrl);
      localManager.setValue("currPageForPharmacy",pageUrl);
      deleteByRefId(id,"diagnostic_center_notification")
    });    
  }


  function deleteByRefId(id,field){
    var msg = "no alert";
    var del = new deleteFactory(id,field);
    del.deleteItem("/user/delete-one/refId",msg);//deletes notification once it is viewed.
    if($rootScope.noteLen > 0) {
      $rootScope.noteLen--;  
      var elem = $rootScope.allNote.map(function(x){return x.ref_id}).indexOf(id);
      if($rootScope.allNote[elem]){
        $rootScope.allNote.splice(elem,1)
      }
    }
  }


  //this fn gets all notification from the back end and adds to the attendance list. this is similar to toList fn jst that instead of 
  //adding patients to the list one by one you simply all add all together.
  $scope.addAllNote = function(){
    if($rootScope.allNote.length > 0) {
      var prescriptions = addNoteService//$resource("/user/pharmacy/get-referral",null,{sendObj:{method:"PUT"}});
      prescriptions.sendObj($rootScope.allNote,function(res){
        var data = res.prescriptions; 
        if($rootScope.attendanceList.length === 0){   
          //templateService.holdList = data;          
          localManager.setValue("holdPrescriptionForAttendance",data);
          $rootScope.attendanceList = data;
        } else {
          for(var i = 0; i < data.length; i++){
            $rootScope.attendanceList.push(data[i]);
          }
        } 

        $rootScope.allNote.splice(0);
        $rootScope.noteLen = 0;
        //note delete from the backend 
      });

    }
  }


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

  $scope.viewChat = function() { 
    var list = $rootScope.chatsList;  
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
    }
  }



  $scope.showIndicator = false;

  $rootScope.$on("unattendedMsg",function(status,data){
    $scope.showIndicator = data;
  });


  //for courier services  notification


  //this will only allow centers permitted to render courier services use the feature.
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
  }

  getCurr();

  mySocket.on("receiver courier",function(data){  
    if(!data.subType) {
      $rootScope.courierRequests.unshift(data);
    } else {
      getCurr();
    }
    templateService.playAudio(3); 
  });


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

app.controller("checkingOutPatientController",["$scope","$location","templateService","localManager",
  function($scope,$location,templateService,localManager){

  /*$scope.patientPrescription = function(id){
    var holdList = localManager.getValue("holdPrescriptionForAttendance")
    holdList.forEach(function(item){
      if(item.ref_id === id){
        templateService.holdId = id;
        var pageUrl = "/pharmacy/view-prescription/" + id;
        localManager.setValue("currPageForPharmacy",pageUrl); 
        $location.path(pageUrl);
      } 
    }); 
  }*/


  $scope.viewLabTest = function(id){ 
    templateService.holdId = id;
    var pageUrl = "/laboratory/view-test/" + id;
    localManager.setValue("currPageForLaboratory",pageUrl);
    $location.path(pageUrl);
  }

  $scope.viewRadioTest = function(id){
    templateService.holdId = id;
    var pageUrl = "/radiology/view-test/" + id;
    localManager.setValue("currPageForRadiology",pageUrl);
    $location.path(pageUrl);
  }

  $scope.pendingList = localManager.getValue("holdPrescriptionForAttendance");

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
    $scope.query = "Today";
    $scope.searchTests();
  }

  $scope.yesterday = function() {
    var dt = new Date();
    var days = dt.setDate(dt.getDate() - 1);    
    $scope.patient.from = new Date(days);
    $scope.patient.to = new Date();
     $scope.query = "Yesterday";
    $scope.searchTests();
  }


  $scope.days7 = function() {
    var dt = new Date();
    var days = dt.setDate(dt.getDate() - 7);    
    $scope.patient.from = new Date(days);
    $scope.patient.to = new Date();
    $scope.query = "Last7";
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
    $scope.query = "Clear";
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





app.service("searchTestService",["$resource",function($resource){
  return $resource("/user/laboratory/search/find-tests",null,{findCenter:{method:"PUT"}});
}]);





app.service("radioSearchTestService",["$resource",function($resource){
  return  $resource("/user/radiology/search/find-tests",null,{findCenter:{method:"PUT"}});
}]);

app.service("radioToService",["$resource",function($resource){
  return $resource("/user/center/radiology/send-test",null,{sendTest:{method: 'POST'}});
}]);


/*app.controller("unRanTestModalController",["$scope","$location","templateService",function($scope,$location,templateService){
  $scope.unRanTest = templateService.holdUnranTest;
}]);*/





app.directive('myIframe', function(){
  var linkFn = function(scope, element, attrs) {
      element.find('iframe').bind('load', function (event) {
        event.target.contentWindow.scrollTo(0,400);
      });
  };
  return {
    restrict: 'EA',
    scope: {
      src:'@src',
      height: '@height',
      width: '@width',
      scrolling: '@scrolling'
    },
    template: '<iframe class="frame" height="{{height}}" width="{{width}}" frameborder="0" border="0" marginwidth="0" marginheight="0" scrolling="{{scrolling}}" src="{{src}}"></iframe>',
    link : linkFn
  };
});

app.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
      iElement.autocomplete({
          source: scope[iAttrs.uiItems],
          select: function() {
              $timeout(function() {
                iElement.trigger('input');
              }, 0);
          }
      });
    };
});

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

app.controller("findRadioTestController",["$scope","$location","$window","templateService","localManager","scanTests","searchtestservice",
function($scope,$location,$window,templateService,localManager,scanTests,searchtestservice){
  $scope.backTo = function(type){
    searchtestservice.goBack(type);
  }

  $location.path("/scan-search")
}]);

app.controller("drugSearchController",["$scope","$location","$window","templateService","localManager","Drugs","searchtestservice","cities",
function($scope,$location,$window,templateService,localManager,Drugs,searchtestservice,cities){
  $scope.backTo = function(type){
    searchtestservice.goBack(type);
  }
  $location.path("/drug")
}]);



app.controller("findTestController",["$scope","$location","$window","templateService","localManager","labTests","searchtestservice","cities",
function($scope,$location,$window,templateService,localManager,labTests,searchtestservice,cities){
  $scope.backTo = function(type){
    searchtestservice.goBack(type);
  }

  $location.path("/search-test")
}]);

app.service("dynamicService",["$resource",function($resource){
  return $resource("/user/dynamic-service",null,{createService:{"method": "POST"},updateService: {method: "PUT"}});
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
        if(!/^[A-Z]/.test( drugName)){
           drugName = toTitleCase(drugName);    
        } 
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
      var elementPos = $scope.drugs.map(function(x){return x.name}).indexOf(drugName);      
      objFound = $scope.drugs[elementPos];
      if(objFound){
        list[list.length - 1].name = objFound.name;
        list[list.length - 1].id = objFound.id;
      }       
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

app.service("centerProfileService",["$resource",function($resource){
  return $resource("/user/center-profile");
}]);

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

app.controller("viewCenterProfileController",["$scope","$resource","$rootScope",'templateService',function($scope,$resource,$rootScope,templateService){
  $rootScope.center = $rootScope.center;
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

app.controller("isNotloggedInModalController",["$scope","$location","$window","templateService","localManager","ModalService",
function($scope,$location,$window,templateService,localManager,ModalService){
  $scope.signUp = function(){
    ModalService.showModal({
        templateUrl: 'patient-signup.html',
        controller: "signupController"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {             
        });
    });
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

app.controller("scanSearchSelectedCenterController",["$scope","$location","$window","$http","templateService","localManager","ModalService",
"$rootScope",function($scope,$location,$window,$http,templateService,localManager,ModalService,$rootScope){
  $scope.data = templateService.holdTheCenterToFowardPrescriptionTo;//holds thssame for lab and scan
  $scope.user = {};
  var sendObj = {};

  $scope.someone = function(type){
    if(type !== 'inperson') {
      $scope.user.someone = true;     
    } else {
      $scope.user.someone = false;
    }

    $scope.isToSomeOne = true;
    
  }

  $scope.back = "#/radiology/scan-search/result";

  $scope.cancel = function(){
    $scope.isToSomeOne = false;
    $scope.isNewPatient = false;
    $scope.user.someone = false;
    if($scope.user.patient_phone)
      $scope.user.patient_phone = ""
  }

  $scope.isContent = true;

  if($rootScope.checkLogIn.typeOfUser !== 'Patient') {
    $scope.isToSomeOne = true;
    $scope.user.someone = true;
  }

  $scope.send = function (type){  
    /*var type = ($scope.user.someone) ? "someone" : "inperson";
    $scope.data.recepient = ($scope.user.someone) ? $scope.data.phone : null;*/

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
    var labData = templateService.holdLaboratoryReferralData; //holds thsame for scan
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

    //use to seperate search from create study search i center dashboard. The later needs to create dicom study.
    $scope.data.isCommonSearch = true;

    var testArr = $scope.data.str.split(",");    
    for(var i = 0; i < testArr.length; i++){
      var testObj = {};
      testObj.name = testArr[i];
      testObj.sn = i + 1;
      testObj.select = true;
      testArr[i] = testObj;
    }

    $scope.data.test_to_run = testArr; 

    // this was implemented change pointer since data is pointing to template service so any changes do affect the seach result 
    //through the displayed modal

    for(var i in $scope.data) {
      if($scope.data.hasOwnProperty(i)){
        sendObj[i] = $scope.data[i];
      }
    }

    send(sendObj,"/user/scan-search/radiology/referral");
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
        send(sendObj,"/user/scan-search/radiology/referral");
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
        $scope.user.patient_names = data.refObj.radiology.patient_firstname + " " + data.refObj.radiology.patient_lastname;
      }

      $scope.loading = false;

    });
  }

  $scope.back = function() {
    $scope.isNewPatient = false;
    $scope.isToSomeOne = true
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

app.controller("helpController2",["$scope","$location","$http",function($scope,$location,$http){
  $scope.user = {};

  $scope.sendHelp = function() {
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
    });

  }
   
}]);



/** courier services logic **/

app.service("courierResponseService",["$resource",function($resource){
  return $resource("/user/courier-response",null,{pay:{method: "POST"},reOder:{method: "PUT"}});
}])

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
   
    if(item) {
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

            getCourier(data.id);

            /*if($rootScope.holdPresDataForCourier) {
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

            }*/

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
    courierResponse.get({id: id},function(data){
      console.log(data)
      $rootScope.courierResponse = data;
      var pt = '/courier-response/' + Math.floor(Math.random() * 99999999);
      $location.path(pt);
    });
  }


 

}]);

//for center that is eligeable to render courier service can join room
app.controller("courierJoinController",["$scope","$rootScope","$http","mySocket",function($scope,$rootScope,$http,mySocket){
  if($rootScope.checkLogIn.courier_access === true) {
    //mySocket.emit("courier join",{id: "couriergroup"});
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

app.service("fieldAgentService",["$resource",function($resource){
  return $resource("/user/field-agent",null,{update:{method: "PUT"},del:{method:"DELETE"}})
}])

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

app.controller('supportController',["$scope","$http",function($scope,$http){

  $scope.reportIssue = function() {

  }

  $scope.picked = 'grow';

  $scope.select = function(article){
    $scope.picked = article;
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
    $rootScope.emailData = {}
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
           "</a> and enjoy our services for writting, receiving and sharing prescriptions with friends or collegues.<br><br>We keep records of your prescription history and it's safe with us.<br><br> For enquiries please call customer support on +2349080045678</div>"
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
          + "<br><br><a href='https://applinic.com/signup' style='text-decoration:none'>Create an account for free </a> and enjoy our services for writting, receiving and sharing prescriptions with friends or collegues.<br><br>We keep records of your prescription history and it's safe with us.<br><br> For enquiries please call customer support on +2349080045678</div>"
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
          + "<a href='https://applinic.com' style='text-decoration:none'><img src='https://applinic.com/assets/images/icons/favicon.png' style='width:32px;height:auto'> <b>Applinic</b></a><br>"
          + "<div style='font-size: 14px'>The above Investigation(s) was written in www.applinic.com (Online Healthcare Application).<br><br><a href='https://applinic.com/signup' style='text-decoration:none'>Create an account for free" +  
          "</a> and enjoy our services for writting, receiving and sharing investigation with friends or collegues.<br><br>We keep records of your laboratory history and it's safe with us.<br><br> For enquiries please call customer support on +2349080045678</div>"
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

  function getAllconnectedSockets() {
    //gets all connected sockets for every 1 min
    mySocket.emit("check presence",{status: true},function(res){
      $rootScope.sockets = res;
      localManager.setValue("connectedSockets",res)
      //$rootScope.$broadcast("users presence",{type: 'chatList',data:$rootScope.chatsList,sockets: res});         
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
        //result[i].realTime = date;
      }
    });
  }

  if(localManager.getValue("resolveUser"))
    $rootScope.loadChats();

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
    /*dynamicService.query(function(data){
     
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
    })*/
  }

  getAllconnectedSockets();
  //gets connected sockets every 1 min
  $interval(function(){
    getAllconnectedSockets()
  },60000)



  //for viewing jnlp dicom weasis viewer as java web start launcher
  $rootScope.opnejnlp = function(link) {
    window.location.href = "jnlp://" + link;
  }


  


}]);

app.controller("stockModalController",["$scope","$rootScope","dynamicService","localManager",
  function($scope,$rootScope,dynamicService,localManager){

  $scope.updateStock = function() {
    var sendArr = [];
    $rootScope.dynaServices.forEach(function(item){
      if(item.picked){
        sendArr.push(item)
      }
    })
    $scope.loading = true;
    dynamicService.updateService(sendArr,function(response){
      if(response){
        $rootScope.checkLogIn.stock_update.status = false;
        localManager.setValue("resolveUser",$rootScope.checkLogIn)
        $scope.msg = response.message;
      }

      $scope.loading = false;
    })
  }

  $scope.notNow = function() {
    $rootScope.checkLogIn.stock_update.status = false;
    localManager.setValue("resolveUser",$rootScope.checkLogIn)
  }

}]);

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
        $scope.msg = "Prescription sent to " + $scope.recepientEmail;
      else
        $scope.msg = res.message;
    })
  }
}])

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



app.controller("displayController",["$scope","$location",function($scope,$location){
  $location.path("/specialists");
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

}]);

app.controller("createTestController",["$scope","$resource","localManager","labTests","scanTests","Drugs","dynamicService",
  function($scope,$resource,localManager,labTests,scanTests,Drugs,dynamicService){
  var user = localManager.getValue("resolveUser");
  var list; 

  var resource = dynamicService; //$resource("/user/dynamic-service",null,{createService:{"method": "POST"}});

  function getService() {    
      resource.query(function(data){
      $scope.services = list.concat(data);
    });
  }

  getService();

  switch(user.typeOfUser) {
    case"Laboratory":
      list = labTests.listInfo.concat(labTests.listInfo1,labTests.listInfo2,labTests.listInfo3,labTests.listInfo4,
      labTests.listInfo5,labTests.listInfo6,labTests.listInfo7);
    break;
    case"Radiology":
      list = scanTests.listInfo1.concat(scanTests.listInfo2,scanTests.listInfo3,scanTests.listInfo4,scanTests.listInfo5,
      scanTests.listInfo6);
    break;
    case"Pharmacy":
      list = Drugs
    break;
    case"Special_Center":
      list = [{}];
    break;
  }

  //$scope.services = list;
  $scope.test = {};
  $scope.createTest = function(){
    if($scope.test.name !== ''){
      $scope.loading = true;
      var testName = $scope.test.name.toUpperCase();
      var elemPos = $scope.services.map(function(x){return x.name}).indexOf(testName);
     
      if(elemPos === -1) {
        resource.createService({name:testName},function(data){
          $scope.status = data.message;
          setTimeout(function(){
             $scope.$apply(function(){
               $scope.status = "";
               $scope.test.name = "";
             })
          },3000);
          getService();
          $scope.loading = false;
        });
        
      } else {
        alert("Oops! Item already exist!.");
        $scope.loading = false;
      }
    }
  }
}]);

app.controller("imageModalController",function(){})

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


//investigationResultsCtrl

app.service("bankDetailsService",["$resource",function($resource){
  return $resource("/user/bank-details",null,{update:{method: "PUT"},create:{method:'POST'}});
}]);

app.controller("bankDetailsCtrl",["$scope","bankDetailsService",function($scope,bankDetailsService){

  var user = bankDetailsService;

  user.query(function(data){
    $scope.bank_details = data || [];
  })

  $scope.bankDetail = {};

  $scope.save = function() {    
    if(Object.keys($scope.bankDetail).length >= 2) {
      $scope.loading = true;
      $scope.bankDetail.bank_name = ($scope.bankDetail.other) ? $scope.bankDetail.other : $scope.bankDetail.bank_name;
      $scope.bankDetail.id = Math.floor(Math.random() * 9999999);
      user.create($scope.bankDetail,function(response){
        if(response.status){
          $scope.bank_details.push($scope.bankDetail);
        }
        $scope.loading = false;
        $scope.bankDetail = {};
      });
    } else {
      alert("Complete all fields");
    }
   
  }

  $scope.deleteAcc = function(acc){
    user.delete(acc,function(res){
      $scope.bank_details.splice(res.index,1)
    })
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



})() //end of IIFE



