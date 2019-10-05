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

  .when("/consult-specialist",{
    templateUrl: '/assets/pages/patient/selected-doc.html',
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
    controller: 'requestController'
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
  controller: 'referredPatientsController'
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
   controller: 'labTestControler'
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
  resolve: {
    path: function($location,$rootScope){
      $rootScope.path = $location.path();  
    }
  }
 })

 .when("/courier-response/:id",{
  templateUrl: "/assets/pages/utilities/courier-response.html",
  controller: "courierResponseCtrl"
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

app.controller("labProfileEdit",["$scope","$resource","$location","$window","ModalService",
  "templateService","localManager","labProfileEditService",
  function($scope,$resource,$location,$window,ModalService,templateService,localManager,labProfileEditService) {


  var center = labProfileEditService; //$resource("/user/getcenter-details",null,{updateInfo:{method:"PUT"}})
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

app.controller("labTestServicesUpdateController",["$scope","$http","$location",
  "localManager","templateService","labTests","ModalService","$resource","$rootScope","dynamicService",
  function($scope,$http,$location,localManager,templateService,labTests,ModalService,$resource,$rootScope,dynamicService) {

    /*** todo ajax call will be made to get the center unran test if any from the backend***/
    var ObjList = Object.keys(labTests);
    var objLen = Object.keys(labTests).length;

    var count = 0;
    while(objLen > count){
      labTests[ObjList[count]].forEach(function(item){
        item.val = true;
      })
      count++
    }

    var resource = dynamicService; //$resource("/user/dynamic-service");
    resource.query({type:"Laboratory"},function(data){
      $rootScope.tests8 = data;
    });

    $scope.tests1 = labTests.listInfo;
    $scope.tests2 = labTests.listInfo2;
    $scope.tests3 = labTests.listInfo3;
    $scope.tests4 = labTests.listInfo4;
    $scope.tests5 = labTests.listInfo5;
    $scope.tests6 = labTests.listInfo6;
    $scope.tests7 = labTests.listInfo7;

    $scope.saveSelection = function() {     
       ModalService.showModal({
          templateUrl: 'selected-test-not-ran.html',
          controller: "labTestNotRanByCenterModalController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
            $scope.message = "You said " + result;
          });
      });
    }

}]);

app.controller("labTestNotRanByCenterModalController",["$scope","$http","$location","templateService","labTests","$rootScope",
  function($scope,$http,$location,templateService,labTests,$rootScope) {
    
    var notRanList = [];
    var ObjList = Object.keys(labTests);
    var objLen = Object.keys(labTests).length;
    var userId = $rootScope.checkLogIn.user_id;

    var count = 0;
    while(objLen > count){
      labTests[ObjList[count]].forEach(function(item){
        if(item.val === false)
          notRanList.push(item)
      });

      count++
    }

    if($rootScope.tests8)
      for(var j = 0; j < $rootScope.tests8.length; j++) {
        if($rootScope.tests8[j].val === false) {
          $rootScope.tests8[j].center_id = userId;
          notRanList.push($rootScope.tests8[j]);
        }
      }



    $scope.selectedTest = notRanList;

    $scope.save = function(){
      $http({
        method  : 'POST',
        url     : "/user/laboratory/create-services",
        data    : $scope.selectedTest, //forms user object
        headers : {'Content-Type': 'application/json'} 
       })
      .success(function(data) {
       if(data) {
        alert("Service created successfully.")
       }
        
      });                                  
    }

    $scope.goBack = function(){
      $location.path("/lab/test-service/update")
    }
}]);

app.controller("testNotRanBycenterController",["$scope","$http",function($scope,$http){
    $http({
      method  : 'GET',
      url     : "/user/laboratory/not-ran-services",        
      headers : {'Content-Type': 'application/json'} 
     })
    .success(function(data) {
     
      $scope.notService = data;
    });

    $scope.saveTests = function() {
      var picked = [];
      var testList = $scope.notService;
      for(var i = 0; i < testList.length; i++){
        if(testList[i].val === true) {
          picked.push(testList[i].id)
        }
      }
      $http({
      method  : 'PUT',
      url     : "/user/laboratory/update-services",
      data    :   picked,       
      headers : {'Content-Type': 'application/json'} 
     })
      .success(function(data) {
        if(data.message) {
          alert("Success! Tests services updated")
        } else {
          alert("tests services not updated! Something went wrong")
        }
        
      });
    }

    $scope.$watch("notService",function(newVal,oldVal){
      if(oldVal){
        $scope.isToSave = true;
      }
    },true);                                     
}]);

//radiology
app.service("radioProfileEditService",["$resource",function($resource){
  return  $resource("/user/getcenter-details",null,{updateInfo:{method:"PUT"}});
}]);


app.controller("radioProfileEdit",["$scope","$resource","$location","$window","ModalService",
  "templateService","localManager","radioProfileEditService",
  function($scope,$resource,$location,$window,ModalService,templateService,localManager,radioProfileEditService) {

  var center = radioProfileEditService; //$resource("/user/getcenter-details",null,{updateInfo:{method:"PUT"}})
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

app.controller("radioTestServicesUpdateController",["$scope","$http","$location",
  "localManager","templateService","scanTests","ModalService","$rootScope","$resource","dynamicService",
  function($scope,$http,$location,localManager,templateService,scanTests,ModalService,$rootScope,$resource,dynamicService) {

    /*** todo ajax call will be made to get the center unran test if any from the backend***/
    var ObjList = Object.keys(scanTests);
    var objLen = Object.keys(scanTests).length;

    var count = 0;
    while(objLen > count){
      scanTests[ObjList[count]].forEach(function(item){
        item.val = true;
      })
      count++
    }

    if(!$rootScope.tests7) {
      var resource = dynamicService; //$resource("/user/dynamic-service");
      resource.query({type:"Radiology"},function(data){
        $rootScope.tests7 = data;
      });
    }

    $scope.tests1 = scanTests.listInfo1;
    $scope.tests2 = scanTests.listInfo2;
    $scope.tests3 = scanTests.listInfo3;
    $scope.tests4 = scanTests.listInfo4;
    $scope.tests5 = scanTests.listInfo5;
    $scope.tests6 = scanTests.listInfo6;

    $scope.saveSelection = function() {     
       ModalService.showModal({
          templateUrl: 'selected-test-not-ran.html',
          controller: "radioTestNotRanByCenterModalController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
            $scope.message = "You said " + result;
          });
      });
    }

}]);

app.controller("radioTestNotRanByCenterModalController",["$scope","$http","$location",
  "templateService","scanTests","$rootScope","$resource",
  function($scope,$http,$location,templateService,scanTests,$rootScope,$resource) {
    
    
    var notRanList = [];
    var ObjList = Object.keys(scanTests);
    var objLen = Object.keys(scanTests).length;
    var userId = $rootScope.checkLogIn.user_id;
   
    var count = 0;
    while(objLen > count){
      scanTests[ObjList[count]].forEach(function(item){
        if(item.val === false)
          notRanList.push(item)
      })
      
      
      count++;
    }

    if($rootScope.tests7)
      for(var j = 0; j < $rootScope.tests7.length; j++) {
        if($rootScope.tests7[j].val === false) {
          $rootScope.tests7[j].center_id = userId;
          notRanList.push($rootScope.tests7[j]);
        }
      }
    $scope.selectedTest = notRanList;

    $scope.save = function(){
      $http({
        method  : 'POST',
        url     : "/user/radiology/create-services",
        data    : $scope.selectedTest, //forms user object
        headers : {'Content-Type': 'application/json'} 
       })
      .success(function(data) {
        alert("service created successfully.");
        
      });                                  
    }

    $scope.goBack = function(){
      $location.path("/radio/test-service/update")
    }
}]);

app.controller("radioTestNotRanBycenterController",["$scope","$http",function($scope,$http){
    $http({
      method  : 'GET',
      url     : "/user/radiology/not-ran-services",        
      headers : {'Content-Type': 'application/json'} 
     })
    .success(function(data) {
     
      $scope.notService = data;
    });

    $scope.saveTests = function() {
      var picked = [];
      var testList = $scope.notService;
      for(var i = 0; i < testList.length; i++){
        if(testList[i].val === true) {
          picked.push(testList[i].id)
        }
      }
      $http({
      method  : 'PUT',
      url     : "/user/radiology/update-services",
      data    :   picked,       
      headers : {'Content-Type': 'application/json'} 
     })
      .success(function(data) {
        if(data.message) {
          alert("Success! Tests services updated")
        } else {
          alert("tests services not updated! Something went wrong")
        }
        
      });
    } 

    $scope.$watch("notService",function(newVal,oldVal){
    
      if(oldVal){
        $scope.isToSave = true;
      }
    },true)                            
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

app.service("userSignUpService",["$resource",function($resource){
  return $resource('/user/signup',null,{userSignup:{method:"POST"},emailCheck:{method:"PUT"}});
}]); 

app.service("phoneVerifyService",["$resource",function($resource){
  return $resource("/user/verify-phone-number",null,{go:{method:"PUT"}});
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
    count++;
    if(count <= 1 && type) {
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
    var capitalize = $scope.user.city.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
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
      phoneNumber = "+" + $scope.user.callingCode.toString() + $scope.user.phone.toString();
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
              
              $rootScope.imageFile()
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

app.controller('docProfileEditController',["$scope","$rootScope","$http","$location","multiData2","$window","localManager","mySocket",
  function($scope,$rootScope,$http,$location,multiData2,$window,localManager,mySocket) {  

  var path = $location.path();
  localManager.setValue("currentPage",path)

  function initForm(){
    $scope.user = {};
    $scope.user.type = "form"; 
    $scope.user.education = [{"id":1,"type":"edu"}];
    $scope.user.subSpecialty = [{"id":1,"type":"ss"}];
    $scope.user.procedure = [{"id":1,"type":"pro"}];
    $scope.user.award = [{"id":1,"type":"ha"}];
    $scope.user.office = [{"id":1,"type":"of"}];



    $scope.addNewField = function(arr) {
     var random = Math.floor(Math.random() * 99965);
     arr.push({});
     arr[arr.length-1].id = random;
     arr[arr.length-1].type = arr[0].type;
     $scope.check(arr);
    }; 

    $scope.removeNewField = function(arr) {
     if ( arr.length !== 1 ) {
      arr.pop();
      $scope.check(arr);
     }
    };
  }

  


  $scope.type = "personal";

  $scope.view = function(type){
    $scope.type = type;
  }         

  $scope.check = function(arr){
     switch(arr[0].type) {
        case "edu":
          if(arr.length > 1) {
            $scope.edu = true;
          } else {
            $scope.edu = false;
          }
          break;
        case "ss":
          if(arr.length > 1) {
            $scope.sp = true;
          } else {
            $scope.sp = false;
          }
          break;
        case "pro":
          if(arr.length > 1) {
            $scope.pro = true;
          } else {
            $scope.pro = false;
          }
          break;
        case "ha":
          if(arr.length > 1) {
            $scope.ha = true;
          } else {
            $scope.ha = false;
          }
          break;
        case "of":
          if(arr.length > 1) {
            $scope.of = true;
          } else {
            $scope.of = false;
          }
          break;
        default:
          break;
     }
   }
   
   $scope.item = {};

  $scope.update = function(arg){
    $scope.loading = true;
    if(arg){     
      if(Object.keys($scope.item).length >= 3 && $scope.item.procedure_skill !== undefined && $scope.item.procedure_description !== undefined) {
        uploadSkill();
        
      } else {
        alert("Please complete all fields!");
        $scope.loading = false;
      }
    } else {
      $http({
        method  : 'PUT',
        url     : '/user/update',
        data    : $scope.user, //forms user object
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {              
        if (data) {
          updateRecord();
          initForm();
          alert("Saved to records");
         // $window.location.href = '/user/doctor/update';                           
        } 
        $scope.loading = false;
      });                          
    }    
             
  }

  $scope.deleteRecord = function(arg,arg2){
    if(arg == 'intro'){

      $scope.user.introductory = $scope.docInfo.introductory;

    } else if(arg == 'years'){

      $scope.user.experience = $scope.docInfo.experience;

    } else {
      var verify = confirm("Do you want to delete one of " + arg2 + "?")
      if(verify) {        
        var sendObj = {field: arg2,item_id: arg};
        $http({
        method  : 'DELETE',
        url     : '/user/doctor/delete-record',
        data    : sendObj, //forms user object
        headers : {'Content-Type': 'application/json'} 
        })
        .success(function(data) {              
          if (data.status) {
            
            var list = $scope.docInfo[arg2];
            var elemPos = list.map(function(x){return x._id}).indexOf(arg);
            //var found = list[elemPos];
            var removed = list.splice(elemPos,1); 
            $scope.docInfo.specialty = data.specialty;                         
          } else {
            alert("Oops! error occured, Try again.")
          }
        });                          
      }
      
    }

  }

  var uploadSkill = function(){ 
   $scope.skill = {
    files: $scope.files,
    form : {
      type: "procedure",
      disease: $scope.item.disease,
      skill: $scope.item.procedure_skill,
      description: $scope.item.procedure_description,
    }
   }
   //nitice skilll was uploaded differently from the rest.
   multiData2.sendSkill("/user/update",$scope.skill);

   mySocket.on("uploaded skill",function(data){
   
    $scope.skill = {};
    updateRecord();
    $scope.loading = false;
    $scope.docInfo.skills.push(data);
    initForm();
   });
  }

  function updateRecord(){
    $http({
      method  : 'GET',
      url     : "/user/doctor/update",
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) { 
                 
      if (data) {
        $scope.docInfo = data;                         
      } 
    });
  }

  initForm();
  updateRecord();

  /*$scope.$watch("user.subSpecialty",function(newVal,oldVal){
    if(oldVal){
      alert("sdsjh")
    }
  },true)*/

}]);

app.service("skillService",["$resource",function($resource){
  return $resource("/user/get-skills",null,{updateSkill: {method: "PUT"}});
}])

app.service("skillCommentsService",["$resource",function($resource){
  return $resource("/user/skill/comments",null,{updateComment: {method: "PUT"}});
}])

app.controller("skillController",["$scope","$rootScope","skillCommentsService","$sce","skillService","$http","localManager","mySocket",
function($scope,$rootScope,skillCommentsService,$sce,skillService,$http,localManager,mySocket){

  var comments = skillCommentsService;
  var skill = skillService;

  var user = $rootScope.checkLogIn || localManager.getValue("resolveUser");
  $rootScope.checkLogIn = user;

  $scope.logout = function(){
    if(user) {
      mySocket.emit("set presence",{status:"offline",userId:user.user_id},function(response){
        if(response.status === false){
          if(user.typeOfUser === "Doctor"){
            mySocket.emit("doctor disconnect",{userId:user.user_id});
          } else if(user.typeOfUser === "Patient") {
            mySocket.emit("patient disconnect",user);
          }
        }
      });

      window.location.href = "/user/logout";
      destroyStorage();
    }
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
  }

  if(user) {
    skill.query({id: user.user_id},function(data){
      $scope.mySkills = data;
    })
  }

  $scope.deleteSkill = function(item) {
    var sure = confirm("You want to delete " + item.skill + " ?")
    if(sure)
      $http({
        method  : 'DELETE',
        url     : '/user/doctor/delete-record',
        data    : {field:'skills',item_id: item._id}, //forms user object
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data) {              
          if (data) {
             var elemPos = $scope.mySkills.map(function(x){return x._id}).indexOf(item._id)   
             if($scope.mySkills[elemPos]){
               $scope.mySkills.splice(elemPos,1)
             }                       
          } 
      });     

  }

  $scope.trustAsHtml = function(string) {
    return $sce.trustAsHtml(string);
  };

  $scope.search = function() {

  }

  
  $scope.post = function(id) {
    if(user) {
      if($scope.article)  {
        $scope.loading = true;
        comments.updateComment({id: id,message: $scope.article},function(data){
          $scope.loading = false;
          alert(data.message)
        })
      }
    } else {
      $scope.info = " Oops! You cannot comment on this post. Please <a href='/login' target='_blank'>log in</a> or <a href='/signup' target='_blank'>create account</a>"
    }
  }
}]);


app.service("profileDataService",["$resource",function($resource){
  return $resource("/user/get-profile-data");
}]);

//for view of docors profile public
app.controller("docProfileViewController",["$scope","$rootScope","$resource","$location","localManager",
  "ModalService","templateService","profileDataService",
  function($scope,$rootScope,$resource,$location,localManager,ModalService,templateService,profileDataService) {

   /**
  var skill = skillService

  skill.query({id: $rootScope.checkLogIn.user_id},function(data){
    $scope.mySkills = data;
  })
  **/

   var path = window.location.pathname;
   var toArr = path.split("/");
   var userId = toArr[toArr.length-1];
   

   var source = profileDataService;//$resource("/user/get-profile-data",{userId: userId });
   source.get({userId: userId },function(data) {
    $rootScope.docInfo = data;
    templateService.holdForSpecificDoc = data;

   });


  
   $scope.profileBook = function() {
     modalCall("request.html","bookingDocController");
   }


   //to be implemented later. Note for asking questions has been implimmented half way but left to be complted later
   $scope.profileAsk = function() {
     modalCall("question.html","bookingDocController");
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

  $scope.viewSkill = function(skill) {
     $rootScope.skill = skill;
     ModalService.showModal({
        templateUrl: "skill-modal.html",
        controller: "skillModalController"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.message = "You said " + result;
        });
    });
  }

  

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
  "localManager","cities","templateService","templateUrlFactory","patientfindDoctorService","skillProcedureService",
  function($scope,$rootScope,$http,$location,$resource,localManager,
    cities,templateService,templateUrlFactory,patientfindDoctorService,skillProcedureService) {
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
        for(var i = 0; i < data.length; i++){
          if(!filter[data[i].specialty]) {
            filter[data[i].specialty] = 1;
            var keywords = (data[i].skills.length > 0) ? addDisease(data[i]) : data[i].specialty;
            centerArr.push(keywords)
          } else {
            filter[data[i].specialty]++;
          }
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
  })                              
}]);

//another controller for login. it is a modal controller found in the home page ie "doctore signup"
app.controller("homeDoctorSignupController",["$scope","ModalService","templateService",function($scope,ModalService,templateService){
   $scope.docSignup = function(){
    templateService.singleForm = true;
      ModalService.showModal({
          templateUrl: 'doc-signup.html',
          controller: "signupController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
          });
      });

    }

}]);

//another controller for login. it is a modal controller found in the home page ie "patient signup"
app.controller("homePatientSignupController",["$scope","ModalService","templateService",function($scope,ModalService,templateService){
   $scope.patientSignup = function(){
    templateService.singleForm = true;
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

//model that brings a login/ signup for for users that have already logged in. it is found in the search and result pages 
app.controller("appointmentController",["$scope","$location","localManager","ModalService","templateService",
  function($scope,$location,localManager,ModalService,templateService){
   var doctorData = localManager.getValue("userInfo");
   $scope.docInfo= doctorData;   

   $scope.question = function(){
      ModalService.showModal({
          templateUrl: 'question.html',
          controller: "connectController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
          });
      });

    }

    $scope.request = function(){
      ModalService.showModal({
          templateUrl: 'request.html',
          controller: "connectController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
          });
      });

    }


}]);

//conroller id found inside a modal when user finally complete sending request to a doctor. it builds request object to be sent
app.controller("connectController",["$scope","$location","$http","localManager","templateService",
  function($scope,$location,$http,localManager,templateService){
  
   //code moved to bookingModalController for better UX.
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


app.controller("modalViewSkillController",["$scope","$rootScope",function($scope,$rootScope){
  $rootScope.docInfo = $rootScope.userSkill;
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

  console.log($scope.searchResult)

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

app.controller("bookingDocController",["$scope","templateService","$http","mySocket","localManager","symptomsFactory",
  function($scope,templateService,$http,mySocket,localManager,symptomsFactory){
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

    $scope.sendRequest();
  }

 
  $scope.sendRequest = function() {
    $scope.loading = true
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

        console.log(data)
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

   /*

    var fd = new FormData();
    
    for(var key in data){
      if(key !== "symptoms" && data.hasOwnProperty(key))
        fd.append(key,data[key]);
    };

    for(var i = 0; i < data.symptoms.length; i++){
      if(data.symptoms[i].name)
        fd.append("symptoms", data.symptoms[i].name);
    }

    //validate the files picked.
     //= ($scope.blobs && $scope.files) ? $scope.files.concat($scope.blobs) : $scope.blobs;
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
      if($scope.user.description) {
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
     
      xhr.open("POST", "/user/help");
      xhr.send(fd);
      $scope.progressVisible = false;
      player.srcObject.getVideoTracks().forEach(function(track) { track.stop()});
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

   */

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

/*** for doctors ***/
//saves few details about the logged in doctor to a angularjs service so that it can be used in other controllers.
app.controller("inDoctorDashboardController",["$scope","$location","$http","localManager","templateService","ModalService","$rootScope",
  function($scope,$location,$http,localManager,templateService,ModalService,$rootScope){
    //remember that templateservice.getid is used in another controller in case you wish to modify this block to use ajax to fetch data when
    //doctor's dashboard page loads.
    /*$scope.getName = function(firstname,lastname,id,pic,specialty){
      templateService.getfirstname = firstname;
      templateService.getlastname = lastname;
      templateService.getid = id;
      templateService.getpic = pic;
      templateService.getspecialty = specialty;
      setId(id,firstname,lastname);
    }*/

    function setId(id,firstname,lastname){
      var comObj = {
        callerId: id,
        firstname: firstname,
        lastname: lastname
      }

      templateService.holdDoctorIdForCommunication = comObj;
    }
   
    
    $location.path(localManager.getValue("currentPage") || "/");
    //highlits modal to fill in new patient basic information.
    

}]);

//sends a request to get all notifications for the logged in doctor and also filters the result.

app.controller("docNotificationController",["$scope","$location","$resource","$interval","localManager","templateService",
  "requestManager","mySocket","$rootScope","$timeout","ModalService","chatService","deleteFactory","courierResponseService",
  function($scope,$location,$resource,$interval,localManager,templateService,requestManager,
    mySocket,$rootScope,$timeout,ModalService,chatService,deleteFactory,courierResponseService){
    var getPerson = localManager.getValue("resolveUser");
    localManager.removeItem("callOptionMany");// removes call many if any was set before call page was redirected to
    var getRequestInTime = $resource("/user/doctor/:userId/get-all-request",{userId:getPerson.user_id});
    
    var random;
    //sets array to hold requests from patients temporarily.
    //but clears when doctor logs out.
    
    var getRequest = function() {
      var filterList = [];
      var filter = {};
      var filter2 = {};



     var requests =  getRequestInTime.get(null,function(data){
       
        for(var item = data.doctor_notification.length - 1; item >= 0; item--) {
          if(!filter.hasOwnProperty(data.doctor_notification[item].type)){
            filter[data.doctor_notification[item].type] = [];
            filter[data.doctor_notification[item].type].unshift(data.doctor_notification[item]);
          } else {
            filter[data.doctor_notification[item].type].unshift(data.doctor_notification[item]);
          }
        }

        
        $scope.name = templateService.getfirstname;
        $scope.total = data.doctor_notification.length;        
        $rootScope.consultation = filter.consultation;

        $rootScope.docNotification = filter.acceptance; //remember to concat for video and audio requests
        $rootScope.videoRequest = (!localManager.getValue("videoCallerList")) ? localManager.getValue("videoCallerList") : null;
        $rootScope.audioRequest = (!localManager.getValue("audioCallerList")) ? localManager.getValue("audioCallerList") : null;
        $rootScope.inPersonRequest =  filter["Meet In-person"] || [];//(!localManager.getValue("meetInPersonList")) ? localManager.getValue("meetInPersonList") : null;
        $scope.inPersonRequestLen = $scope.inPersonRequest.length;
        

        if(filter.hasOwnProperty("consultation"))
          $scope.consultationLen = filter.consultation.length;

      
        $rootScope.view = function(patient){
          random = Math.floor(Math.random() * 999999);          
          requestManager.set(patient);
          $location.path("/patient-request/" + random);
        };

        $scope.viewsMessage = function(patient){
          random = Math.floor(Math.random() * 999999);          
          requestManager.set(patient);
          $location.path("/patient-request/" + random);
        };


        
        var dataList = data.doctor_prescriptionRequest;
        for(var i = 0; i < dataList.length; i++){
          if(!filter2.hasOwnProperty(dataList[i].sender_id)) {
             filter2[dataList[i].sender_id] = "";
             filterList.push(dataList[i]);       
          } 
        }

        templateService.holdPrescriptionRequestData =  data.doctor_prescriptionRequest;
        localManager.setValue("prescriptionRequestData",data.doctor_prescriptionRequest);
        var request =  filterList;
        if(request.length > 0) {
          $scope.isNew = true;
          $scope.len = request.length;
          $scope.allRequest = request;
        } else {
          $scope.noRequest = "Prescription request list empty";
        }

        $scope.viewPatient = function(id){
          var callerId = templateService.holdDoctorIdForCommunication;
          localManager.setValue("receiver",id);
          localManager.setValue('caller',callerId);    
          templateService.holdIdForSpecificPatient = id;
          var page = "/doctor-patient/treatment/" + id;
          localManager.setValue("currentPage",page);
          $location.path(page);
        }

      });

        
    }

    
  getRequest();

 
  $scope.delMsg = function(msgId){
    var del = new deleteFactory(msgId,'doctor_notification');
    del.deleteItem("/user/delete-one/msgId","");//deletes notification once it is viewed.
    var elem = $rootScope.docNotification.map(function(x){return x.message_id}).indexOf(msgId);
    if(elem !== -1) {
      $rootScope.docNotification.splice(elem,1);
    }
  }


  $rootScope.$on('get notification',function(e,r){
    getRequest();
  });


  mySocket.on("received in-person request",function(res){
    if(res.status){
      templateService.playAudio(0);
      $scope.inPersonRequestLen.unshift(res.data)
    }
  });


 //deletes a selected request from a patient.        
  $rootScope.$on('declined request',function(env,data){
    if(data.status){
      /*getRequest();
      var random = Math.floor(Math.random() * ($scope.consultation.length - 1));      
      //shows another consultation request
      $scope.view($scope.consultation[random])*/
      var elemPos = $scope.consultation.map(function(x){return x.message_id}).indexOf(data.id);
      if(elemPos !== -1){
        $scope.consultation.splice(elemPos,1)
        if($scope.consultationLen > 0)
          $scope.consultationLen--;    
      }
    }
  })

  //deletes attended request from doctor notification.        
  $rootScope.$on('consultation attended',function(env,data){
    var elemPos = $scope.consultation.map(function(x){return x.message_id}).indexOf(data.id);
    if(elemPos !== -1){
      $scope.consultation.splice(elemPos,1)
    }

    if(data.status){
      deleteByMsgId(data.id,"doctor_notification")
    }
  })

  function deleteByMsgId(id,field) {
    var msg = "Notification deleted";
    var del = new deleteFactory(id,field);
    del.deleteItem("/user/delete-one/msgId","");//deletes notification once it is viewed.
    if($scope.consultationLen > 0)
      $scope.consultationLen--;    
  }


  function deleteByNoteId(id,field) {
    var msg = "Notification deleted";
    var del = new deleteFactory(id,field);
    del.deleteItem("/user/delete-one/noteId","");//deletes notification once it is viewed.
    if($rootScope.noteLen > 0)
      $rootScope.noteLen--;    
  }


  var video = [];
  var audio = [];
  var meeting = [];

  //Note list clears when page is refreshed. will be improved later
  mySocket.on("receive signal",function(data){   
    switch(data.type){
      case "Meet In-Person":        
        meeting.unshift(data);
        $scope.inPersonRequest = meeting;
        $scope.inPersonRequestLen = meeting.length;
        //save(meeting,"meetInPersonList")        
      break;
      case "Audio Call":
        audio.unshift(data);
        $rootScope.audioRequest = audio;
        $scope.audioRequestLen = audio.length;
        //save(audio,"audioCallerList")            
      break;
      case "Video Call":        
        video.unshift(data);
        $rootScope.videoRequest = video;
        $scope.videoRequestLen = video.length;
        //save(video,"videoCallerList");               
      break;
      default:
      break;
    }

    function save(video,type){
      localManager.setValue(type,video);      
    }
    popout(data);
  });


  //doctor receives prescription request in real time.
  mySocket.on("receive prescription request",function(data){
   
    // instead of geting the data from back end and adding it to the list of prescription request
    // i simply called the function below for for doctors to update its 
    // request and do thsame.
    // this may not be the best way compare to earlier but iwas done because earlier has been implemented before later
    // it could be modified if all are traced appropriately.
    getRequest();
    var msg = "You have new prescription request. Please attend."
    data.info = msg;
    popout(data);    
  });

  //doctor receives consultation request in real time.
  mySocket.on("receive consultation request",function(data){
    
    // instead of geting the data from back end and adding it to the list of prescription request
    // i simply called the function below for "/doctor/:userId/get-all-request" for doctors to update its 
    // request and do thsame.
    // this may not be the best way compare to earlier but iwas done because earlier has been implemented before later
    // it could be modified if all are traced appropriately.
    getRequest();
     var msg;
    if(data.type == "question") {
      msg = "Someone asked a question"
    } else {
      msg = "You have new consultation request. Please attend";
    }
    alert(msg)
    data.info = msg;
    popout(data);    
  }); 


  function popout(data) {
    templateService.playAudio(3);
    $rootScope.sender = data;
    $scope.isReceivedRequest = true;
    $timeout(function(){
      $scope.isReceivedRequest = false;
    },10000);
  }
 

  $scope.viewRequest = function(id,type,firstname,lastname,pic){
    templateService.holdBriefForSpecificPatient = {
      id: id,
      type: type,
      firstname: firstname,
      lastname: lastname,
      profile_pic_url: pic,
    }

    localManager.setValue("patientInfoforCommunication",templateService.holdBriefForSpecificPatient);
    ModalService.showModal({
        templateUrl: 'set-conversation-time.html',
        controller: "setTimeForConversationController"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
    });
  }



  $rootScope.viewApp2 = function(id,msgId) {
    var deleteFn = new deleteFactory(msgId,"doctor_notification");
    deleteFn.deleteItem("/user/doctor/deleteAppRequest","Appointment request deleted");
    $scope.inPersonRequestLen--;
    var path = "/doctor-patient/treatment/" + id;
    $location.path(path);
  }

  mySocket.on("user rejected calls",function(data){
    if(data.status) {
      alert("Calling failed! Reason: Your " + data.status);
    }
  });


  $scope.doctorResponse = function(){
    var sendObject = {
      to: "135920854",
      time: 30000,
      status: "accepted",
      type: "Video Call",
      firstname: "obinna",
      profile_pic_url:""
    }
    mySocket.emit("signal response",sendObject);
  }

  //controls chat indictor and notifications
  $scope.showIndicator = false;
  $rootScope.$on("unattendedMsg",function(status,data){
    $scope.showIndicator = data;
  });

  


   // to be modified later suit general
  $rootScope.loadChats = function() {
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

  $rootScope.loadChats();

  $rootScope.viewChat = function(partnerId) {
    templateService.holdId = partnerId;
    $location.path("/general-chat");
    $scope.showIndicator = false;
  }



  //courier services
  var courierResponse = courierResponseService;

  function getCourier() {
    courierResponse.query(function(data){
      $rootScope.courierResponseList = data;
      $scope.unRead = data[0];
     
    });
  }

  mySocket.on("courier billed",function(res){
    getCourier();
  });

  mySocket.on("new courier order",function(res){
    getCourier();
  });


  $rootScope.$on('new courier order',function(status,res){
     getCourier();
  })

  var pt;

  $rootScope.viewResponse = function(item) {
    $rootScope.courierResponse = item;
    pt = '/courier-response/' + Math.floor(Math.random() * 99999999);
    $location.path(pt);
  }

  getCourier();

}]);

//modal controiller for pick time slot for video or audio request from patients.
app.controller("setTimeForConversationController",["$scope","$rootScope","$window","mySocket","$timeout","localManager","templateService",
  function($scope,$rootScope,$window,mySocket,$timeout,localManager,templateService){

  var user = localManager.getValue("resolveUser");
  var sender = templateService.holdBriefForSpecificPatient;
  $scope.patient = sender;
  var theSelected = {};

  $scope.pickedTime = function(time) {
    $scope.isPicked = time;
    theSelected.currentlyPicked = time;
    //$scope.patient.otherTime = null;
  }

  /*$scope.$watch("patient.otherTime",function(newVal,oldVal){
    if(newVal){
      theSelected.currentlyPicked = $scope.patient.otherTime;
    }
  });*/

  
  
  $scope.selectedTime = function(quantity){  
    if(sender.type === "Video Call"){
      theSelected.list = $rootScope.videoRequest;      
    } else if(sender.type === "Audio Call"){
      theSelected.list = $rootScope.audioRequest;
    }   
    /*
    concept: when a patient requests for video or audio conversation doctor picks a convinent time slot. doctor cannot pick 
    thesame time slot seperately for two patients else, Doctor can pick a time slot for all requested patients when he clicks the appropriate
    button.
    */
    var caller = genId();
    var receiver = genId();
   
    if(theSelected.currentlyPicked === 0){      
      localManager.setValue("personToCall",sender.id); //this is the id of the person to be called which is useful in communication controllers
      localManager.setValue("receiver",receiver); 
      localManager.setValue('caller',caller); 
      $window.location.href = "/user/doctor/call";
    } else {            
      var index =  theSelected.list.map(function(x){return x.from}).indexOf(sender.id);
      if(!theSelected.list[index].hasOwnProperty("bookedTime")){
        var actualTime = theSelected.currentlyPicked * 60000;
        //gives doc option to call just one or many
        if(quantity === 'single') {
          tellPatient(theSelected.currentlyPicked);
        } else if(quantity === 'many') {
          tellAllPatients(theSelected.currentlyPicked);
        } 
        //checks to see if a patient has already been booked.
        time(actualTime); 
      } else {
        alert("This patient has already been booked!");
      } 
    }
  }

  function tellPatient(time) {
    var sendObject = {
      to: sender.id,
      time: theSelected.currentlyPicked,
      status: "accepted",
      type: sender.type,
      firstname: user.firstname,
      lastname: user.lastname,
      profile_pic_url:user.profile_pic_url,
      from: user.user_id
    }  
    
    $rootScope.isBooked = time; //hides the time slots for onces already booked
    var elemPos = theSelected.list.map(function(x){return x.from}).indexOf(sender.id);
    theSelected.list[elemPos].bookedTime = time + " minutes";
    mySocket.emit("signal response",sendObject);
  }

  function tellAllPatients(time){    
    $rootScope.isBooked = time;
    localManager.setValue("callOptionMany",true); // to be used in communicationDoctor Controller for sending in call signal
    // for all doctor's patients
    //sends to all patieents that request for video call at the instance.
    theSelected.list.forEach(function(patient){
      var sendObject = {
        to: patient.from,
        time: theSelected.currentlyPicked,
        status: "accepted",
        type: patient.type,
        firstname: user.firstname,
        lastname: user.lastname,
        profile_pic_url:user.profile_pic_url,
        from: user.user_id
      }
      patient.bookedTime = time + " minutes"; // sets the booked time on the drop down list
      mySocket.emit("signal response",sendObject);
    });
  }

  function time(time) {    
    $timeout(function(){
      var reminder = confirm("You have " + $scope.patient.type + " appointment with " + $scope.patient.firstname + " " + $scope.patient.lastname + " now!");
      if(reminder){
        localManager.setValue("personToCall",sender.id);
        localManager.setValue("receiver",receiver); 
        localManager.setValue('caller',caller); 
        $window.location.href = "/user/doctor/call";
      } 
    },time);
  }

  function genId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

      for( var i=0; i < 12; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
  }

}]);

app.service("docAppointmentViewService",["$resource",function($resource){
  return $resource("/user/doctor/appointment/view",null,{view: {method: "PUT"},mark: {method: "PATCH"}})
}]);

app.controller("docAppointmentController",["$scope","$rootScope","$location","templateService","docAppointmentViewService",
  function($scope,$rootScope,$location,templateService,docAppointmentViewService){


  var appointment = docAppointmentViewService;
  var date = new Date();

  var day = date.getDay();
  var month = date.getMonth();
  var year = date.getFullYear();

  var getAppoint = function() {
    appointment.query({month: month,year: year,day: day},function(list){
     
      $rootScope.appointmentList = list;
    })
  }

  getAppoint();

  $scope.refresh = function() {
    getAppoint()
  }
     
  $scope.getDateTime = function(date,time){    
    $scope.date = date;
    $scope.time = time;
  }

  $scope.viewAppointment = function(sessionId) {
    $("#app").removeClass("sidebar-open");
    var session = {
      id: sessionId
    }
    appointment.view(session,function(data){
      if(data.session_id){
        templateService.holdAppointmentData = data;
        $location.path("/selected-appointment/" + sessionId);
      } else {
        alert("Appointment details not found!")
      }
           
    })
  }

 

}]);


app.controller("newPatientModalController",["$scope","$http","ModalService","templateService","$rootScope","$resource","localManager",
  function($scope,$http,ModalService,templateService,$rootScope,$resource,localManager){
  $scope.patient = {};
  
  
  $scope.isForm = true;
  $scope.existingP = function(){
    $scope.isExisting = true;
    $scope.isForm = false;
  }

  $scope.newP = function(){
    $scope.isExisting = false;
    $scope.isForm = true;
  }

  var user = localManager.getValue("resolveUser");

  //for adding existing patient
  $scope.FindPatient = function () {//use o find existing patient for lab and redio test.
      var date = new Date();
      $scope.loading = true;
      var patient = $resource("/user/existing-user");
      var centerType = (user.typeOfUser === "Laboratory") ? 'laboratory' : 'radiology';
      patient.get({phone:$scope.patient.existing_phone,type: centerType},function(data){
       
        if(data.patient){
          $scope.existingPatient = data.patient;
          $scope.addToList = function(type){           
            switch(type){              
              case "laboratory":           
                var newPatient = {};
                newPatient.laboratory = {};
                newPatient.laboratory.patient_firstname = data.patient.firstname;
                newPatient.laboratory.patient_lastname = data.patient.lastname;
                newPatient.laboratory.patient_id = data.patient.user_id;            
                newPatient.laboratory.ref_id = data.patient.ref_id;
                newPatient.laboratory.patient_profile_pic_url = data.patient.profile_pic_url;
                newPatient.date = data.date;
                newPatient.newPatient = true;
                             
                $rootScope.attendanceList.unshift(newPatient);
              break;
              case "radiology":
                var newPatient = {};
                newPatient.radiology = {};
                newPatient.radiology.patient_firstname = data.patient.firstname;
                newPatient.radiology.patient_lastname = data.patient.lastname; 
                newPatient.radiology.patient_id = data.patient.user_id;              
                newPatient.radiology.ref_id = data.patient.ref_id;
                newPatient.radiology.patient_profile_pic_url = data.patient.profile_pic_url;
                newPatient.newPatient = true;
                newPatient.date = data.date;       
                $rootScope.attendanceList.unshift(newPatient);
              break;
              default:
              break;
            }  
          }

        } else {
          $scope.error = data.error;
        }

        $scope.loading = false;
      });
  }

 

  

 
  $scope.sendForm = function(type){

    $scope.formatError = "";
     $scope.showErr = "";

    if(!$scope.patient.phone) {
      alert("fill out all fields!");
      return;
    }

    if($scope.patient.phone.slice(0,1) !== "+"){
      $scope.formatError = "Wrong format! e.g +2348067****23";
      return;
    }
    
    var signUp = $resource("/user/signup")
    signUp.get({phone:$scope.patient.phone},function(res){
      if(res.error === true){
        $scope.showErr = res.errorMsg;
      } else {
        createPatient(type)
       
      }
      $scope.numErr = res.error;
    });    
  }


  function createPatient(type) {
    if(Object.keys($scope.patient).length >= 3) {
      for(var i in $scope.patient) {
        if($scope.patient.hasOwnProperty(i) && $scope.patient[i] === undefined) {
          alert("Please complete patient " + i  + " below")
          return;
        }

        if($scope.showErr && $scope.showErr !== "") {
          return;
        }        
      }
    } else {      
      alert("Please complete all fields");
    }

    var date = + new Date();

    $scope.patient.type = type;
    $scope.patient.date = date;

    $http({
      method  : 'POST',
      url     : "/user/emergency-signup",
      data    : $scope.patient,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      if(data.message){
        
        $scope.error = data.message;
      } else {        
        switch(type){
          case "doctor":
            templateService.holdDocPatientList.unshift(data);
          break;
          case "laboratory":           
            var newPatient = {};
            newPatient.laboratory = {};
            newPatient.laboratory.patient_firstname = data.patient_firstname;
            newPatient.laboratory.patient_lastname = data.patient_lastname;
            newPatient.laboratory.patient_id = data.patient_id;            
            newPatient.ref_id = data.ref;
            newPatient.laboratory.patient_profile_pic_url = data.patient_profile_pic_url;
            newPatient.date = data.date;
            newPatient.newPatient = true;
                          
            $rootScope.attendanceList.unshift(newPatient);
          break;
          case "radiology":
            var newPatient = {};
            newPatient.radiology = {};
            newPatient.radiology.patient_firstname = data.patient_firstname;
            newPatient.radiology.patient_lastname = data.patient_lastname; 
            newPatient.radiology.patient_id = data.patient_id;              
            newPatient.radiology.ref_id = data.ref;
            newPatient.radiology.patient_profile_pic_url = data.patient_profile_pic_url;
            newPatient.newPatient = true;
            newPatient.date = data.date;       
            $rootScope.attendanceList.unshift(newPatient);
          default:
          break;
        }  
        
        $scope.isForm = false;
        $scope.isCreated = true;
      }
    });
  }

}]);
/////////////////////////////////////////////////////////////////////////////////////////
app.controller("selectedAppointmentController",["$scope","$rootScope","$location","$http","$window","templateService",
  "localManager","docAppointmentViewService",
  function($scope,$rootScope,$location,$http,$window,templateService,localManager,docAppointmentViewService){

    $scope.sessionInfo = templateService.holdAppointmentData;
    var appointment = docAppointmentViewService;
   
    $scope.getTreatment = function(){
      $scope.loading = true;
      var session = {};
      $scope.isToTreat = templateService.isTrue; 
      session.sessionId = $scope.sessionInfo.session_id;
      $http({
        method  : 'POST',
        url     : "/user/doctor/get-session",
        data    : session,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        if(data){
          //data.patientInfo = templateService.holdAppointmentData;        
          //localManager.setValue("heldSessionData",data);
          $scope.loading = false;
          templateService.holdIdForSpecificPatient = data.patient_id;
          $location.path("/doctor-patient/treatment/" + data.patient_id)
          //$window.location.href = "/user/treatment";
        } else {
          alert("error occurred while trying to get this session")
        }              
      });
    }

   

    $scope.$watch('isAttended',function(oldVal,newVal){
      if($scope.isAttended) {
        markAttended($scope.sessionInfo.session_id)
      }
    })

    var markAttended = function(sessionId){
      var session = {
        id: sessionId
      }

      appointment.mark(session,function(data){
        
        if(data.status){
          $scope.info = data.message;
        }
             
      })

      var list = $rootScope.appointmentList;
      var elemPost = list.map(function(x){return x.session_id}).indexOf(sessionId)

      if(list[elemPost]){
        list.splice(elemPost,1)
      }

    }
}]);



app.controller("inTreatmentController",["$scope","$http","localManager","$location","$rootScope",
  "templateService","$document","ModalService","Drugs","$filter","moment",
  function($scope,$http,localManager,$location,$rootScope,templateService,$document,ModalService,Drugs,$filter,moment){

  $scope.sessionData = localManager.getValue("heldSessionData");

  

  $rootScope.sub_session_id = genId();

  templateService.holdForSpecificPatient = $scope.sessionData;
   $scope.isLab = false;
   $scope.isScan = false;
   $scope.isNewLab = false;
   $scope.isNewRadio = false;

   $scope.laboratory = function(){
    if(!$scope.isLab) {
      if($scope.testResult) {
        $scope.testResult = [];        
      }
      investigation("/user/doctor/get-test-result");      
      $scope.isLab = true;
      $scope.isScan = false;
      $scope.isNewRadio = false;
      $scope.isNewLab = false; 
      $scope.isClerk = false;
      $scope.isMain = false;
      $scope.isSubView = false;
      $scope.isFollowups = false;
    } else {
      $scope.isLab = false;
    }
    returnToMain($scope.sessionData.diagnosis.sub_session)
   } 

   function returnToMain(sess){
    for(var i = 0; i < sess.length; i++){
      if(sess[i].sub_session_id == 'main')
          sess[i].status = true;
      else  
         sess[i].status = false;
    }
   }

   $scope.newLab = function() {
    //$location.path('/lab');
    if(!$scope.isNewLab) {
      $scope.isLab = false;
      $scope.isScan = false;
      $scope.isNewRadio = false;
      $scope.isNewLab = true; 
      $rootScope.flag = 'lab'; 

      //sets if the investigation request is made from continuation
      if($scope.isSubNote) {
        $rootScope.isSubNote = true;
      }
    } else {
      $scope.isNewLab = false;
    }
   }

   //for radiology
  $scope.radiology = function(){
    if(!$scope.isScan) {
      if($scope.testResult) { 
        $scope.testResult = [];
      }
      investigation("/user/doctor/get-scan-result");
      $scope.isScan = true;
      $scope.isLab = false;
      $scope.isNewRadio = false;
      $scope.isNewLab = false; 
      $scope.isClerk = false;
      $scope.isMain = false
      $scope.isSubView = false;
      $scope.isFollowups = false;
    } else {
      $scope.isScan = false;
    }

    returnToMain($scope.sessionData.diagnosis.sub_session)
  } 

  $scope.newRadio = function() {
    //$location.path('/scan');
    if(!$scope.isNewRadio){
      $scope.isLab = false;
      $scope.isScan = false;
      $scope.isNewRadio = true;
      $scope.isNewLab = false; 
      $rootScope.flag = 'radio';
    } else {
      $scope.isNewRadio = false;
    }

    if($scope.isSubNote) {
      $rootScope.isSubNote = true;
    }
    returnToMain($scope.sessionData.diagnosis.sub_session)       
  }

  $scope.subSession = function() {
    //if(input.check <= 1) { // this value is used below in watchers to check and prompt users to save changes made.
    $scope.isSubNote = true;
    $scope.isClerk = true;
    $scope.isMain = false;
    $scope.isSubView = false;
    $scope.isLab = false;
    $scope.isScan = false;
    //$scope.isInvestigation = true;
    $scope.isPE = false;
    $scope.isReportView = false;
    $scope.isFollowups = false;
    sanitize($scope.sessionData.diagnosis.sub_session);
    $scope.isLab = false;
    $scope.isScan = false;
    $scope.isNewRadio = false;
    $scope.isNewLab = false; 
    $scope.isNote = false;
    $scope.updateMsg = "";
    $scope.edit = {};
    input.check = 0;
    //} else {
     // alert("Please save changes before you can proceed.")
    //}
    returnToMain($scope.sessionData.diagnosis.sub_session)
  }

  $scope.isClerk = true;

  $scope.clerk = function() {
    if(input.check <= 1) { // this value is used below in watchers to check and prompt users to save changes made.
    $scope.isFollowups = false;
    $scope.isSubNote = false;
    $scope.isLab = false;
    $scope.isScan = false;
    $scope.isClerk = true;
    $scope.isMain = true;
    $scope.isPE = false;
    $scope.isReportView = false;
    $scope.isInvestigation = false;
    $scope.isLab = false;
    $scope.isScan = false;
    $scope.isNewRadio = false;
    $scope.isNewLab = false;
    $scope.isNote = false;
    $scope.updateMsg = "";
    $scope.edit = {};

    } else {
      alert("Please save changes before you can proceed.")
    }

  }

  $scope.FollowUpsView = function() {
    //if(input.check <= 1) { // this value is used below in watchers to check and prompt users to save changes made.
      $scope.isFollowups = true;
      $scope.isSubNote = false;
      $scope.isClerk = true;
      $scope.isPE = false;
      $scope.isReportView = false;
      $scope.isMain = true;
      $scope.isInvestigation = false;
      $scope.isLab = false;
      $scope.isScan = false;
      $scope.isNewRadio = false;
      $scope.isNewLab = false; 
      $scope.updateMsg = "";
      $scope.isNote = false;
      $scope.edit = {};
      input.check = 0;
   // } else {
   //   alert("Please save changes before you can proceed.")
   // }

    returnToMain($scope.sessionData.diagnosis.sub_session)
  }

  $scope.investView = function(){
    if(input.check <= 1) { // this value is used below in watchers to check and prompt users to save changes made.
      $scope.isInvestigation = true;
      $scope.isFollowups = false;
      //$scope.isSubNote = false;
      $scope.isClerk = true;
      $scope.isPE = false;
      $scope.isReportView = false;
      $scope.isMain = false;
      $scope.isSubView = false;
      $scope.isLab = false;
      $scope.isScan = false;
      $scope.isNewRadio = false;
      $scope.isNewLab = false; 
      $scope.isNote = false;
      $scope.updateMsg = "";
    } else {
      alert("Please save changes before you can proceed.")
    }
  }

  $scope.takeNote = function(){
    if(input.check <= 1) { // this value is used below in watchers to check and prompt users to save changes made.
      $scope.isNote = true;
      $scope.isPE = false;
      $scope.isInvestigation = false;
      $scope.isFollowups = false;
      //$scope.isSubNote = false;
      $scope.isClerk = true;
      $scope.isMain = false;
      $scope.isSubView = false;
      $scope.isLab = false;
      $scope.isScan = false;
      $scope.isNewRadio = false;
      $scope.isNewLab = false; 
      $scope.isReportView = false;
      $scope.updateMsg = "";
      $scope.edit = {};
    } else {
      alert("Please save changes before you can proceed.")
    }
  }

  $scope.reportView = function(){
    /*if(input.check <= 1) { // this value is used below in watchers to check and prompt users to save changes made.
      $scope.isReportView = true;
      $scope.isPE = false;
      $scope.isInvestigation = false;
      $scope.isFollowups = false;
      $scope.isSubNote = false;
      $scope.isClerk = true;
      $scope.isMain = false;
      $scope.isSubView = false;
      $scope.isLab = false;
      $scope.isScan = false;
      $scope.isNewRadio = false;
      $scope.isNewLab = false; 
      $scope.isNote = false;
      $scope.updateMsg = "";
    } else {
      alert("Please save changes before you can proceed.")
    }*/
    $scope.isReportView = true;
  }

  $scope.close = function() {
    $scope.isReportView = false;
    $scope.edit = {};
    input.check = 0;
  }


  $scope.peView = function(){
    if(input.check <= 1) { // this value is used below in watchers to check and prompt users to save changes made.
      $scope.isPE = true;
      $scope.isReportView = false;
      $scope.isInvestigation = false;
      $scope.isFollowups = false;
      //$scope.isSubNote = false;
      $scope.isClerk = true;
      $scope.isMain = false;
      $scope.isSubView = false;
      $scope.isLab = false;
      $scope.isScan = false;
      $scope.isNewRadio = false;
      $scope.isNewLab = false; 
      $scope.isNote = false;
      $scope.updateMsg = "";
      $scope.edit = {};
    } else {
      alert("Please save changes before you can proceed.");
    }
  }

  

   
  //var getSubList = (!$scope.sessionData.diagnosis.sub_session) ? [{sub_session_id:"main",status: false}] : $scope.sessionData.diagnosis.sub_session.unshift({sub_session_id:"main",status: false});
  if(!$scope.sessionData.diagnosis.sub_session) {
    $scope.sessionData.diagnosis.sub_session = [{sub_session_id:"main",status: false}];
  } else {
    $scope.sessionData.diagnosis.sub_session.unshift({sub_session_id:"main",status: false});
  }


  //$scope.subSessionList = getSubList;
  $scope.sub = function(item,arr){
    if(!item) {
      $scope.sessionData.diagnosis.sub_session[0].status = true;
      $scope.isMain = true;
      return;
    } else if(item.sub_session_id === "main"){
      sanitize(arr);
      $scope.isMain = true;
      item.status = true;
      $scope.isClerk = true;
      $scope.isSubView = false;   
      $scope.isLab = false;
      $scope.isScan = false;  
      return;
    } 

    sanitize(arr);
    $scope.isMain = false;
    $scope.isSubNote = false;
    $scope.isSubView = true;
    item.status = true;
    $scope.isClerk = true;
    $scope.isFollowups = true;
   // $scope.edit = {};

    $scope.selectedSub = item.status
    getContinuationData(item.sub_session_id)
    
  }

  function sanitize(arr) {
    for(var k = 0; k < arr.length; k++) {
      arr[k].status = false;
    }
  }

  $scope.sub();

  function getContinuationData(id) {
    var subList = $scope.sessionData.diagnosis.sub_session;
    //var testList = $scope.sessionData.diagnosis.laboratory_test_results.concat($scope.sessionData.diagnosis.radiology_test_results);
    $scope.subId = id;
    var elementPos = subList.map(function(x){return x.sub_session_id}).indexOf(id);
    /*if(elementPos)
      $scope.subDate =  subList[elementPos].date;
      $scope.subNote = subList[elementPos].note;*/
    $scope.subRecord = subList[elementPos]; 
    $scope.loading = true;
    $http.put("/user/doctor/get-scan-result",{
      id : $scope.sessionData.session_id
    })
    .success(function(radioRes){
      $http.put("/user/doctor/get-test-result",{
         id : $scope.sessionData.session_id
      })
      .success(function(labRes){
        var allTests = [];
        var testList = radioRes.result.concat(labRes.result)
        for(var i = 0; i < testList.length; i++) {
          if(testList[i].sub_session_id === id) {
            allTests.push(testList[i]);
          }
        }
        $scope.loading = false;        
        $scope.subTests = allTests;       
      })
    });
    
    $scope.getReportForSub(id)

  }

  $scope.getReportForSub = function(id) {
    $http({
      method  : 'GET',
      url     : "/user/doctor/get-report?sessionId=" 
      + $scope.sessionData.session_id + "&patientId=" + $scope.sessionData.patient_id 
      + "&subSessionId=" + id,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(res) {
      
      $scope.medReport = res;
    });           
  }
  
 function investigation(url)  {
  var session = {};
  session.id = $scope.sessionData.session_id; 
  $http({
      method  : 'PUT',
      url     : url,
      data    : session,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      if(data.result){   
        console.log(data.result)            
        $scope.testResult = data.result;
      } else {
        $scope.message = "No test result for this patient";
      }
  });            
 }

 $scope.bookAppointment = function(){
    ModalService.showModal({
        templateUrl: 'calender-template.html',
        controller: 'appointmentModalController'
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
    });
 }
  

  $scope.sendToScan = function () {
    
    
  }

  $scope.sendToECG = function () {
    
  }

  $scope.otherCheck = function () {
    
  }

  


  //treatment logic on the ui
  $scope.isPharmacy = false;
  $scope.isSurgery = false;
  $scope.isPhysiotherapy = false;
  $scope.isOther = false;

  
  $scope.pharmacy = function(){
    if($scope.isPharmacy === false) {
      $scope.isPharmacy = true;
    } else {
      $scope.isPharmacy = false;
    }
  }

  $scope.surgery = function(){
    if($scope.isSurgery === false) {
      $scope.isSurgery = true;
    } else {
      $scope.isSurgery = false;
    }
  }

  $scope.physiotherapy = function(){
    if($scope.isPhysiotherapy === false) {
      $scope.isPhysiotherapy = true;
    } else {
      $scope.isPhysiotherapy = false;
    }
  }

  $scope.other = function(){
    if($scope.isOther === false) {
      $scope.isOther = true;
    } else {
      $scope.isOther = false;
    }
  }


  //treatment by pharmaceutical control

  $scope.isNewPrescription = false;
  $scope.isOldPrescription = false;

  var patient = {};
  patient.id = $scope.sessionData.patient_id;

  $scope.writeNew = function() {
    if($scope.isNewPrescription === false) {      
      var random = parseInt(Math.floor(Math.random() * 999999 ) + "" + Math.floor(Math.random() * 9999999 ));      
      $http({
        method  : 'PUT',
        url     : "/user/doctor/specific-patient",
        data    : patient,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        $scope.patientInfo = data;        
        patient.prescriptionId = random;
        patient.patient_id = patient.id;    
        patient.firstname = $scope.patientInfo.firstname;
        patient.lastname = $scope.patientInfo.lastname;
        patient.gender = $scope.patientInfo.gender;
        patient.age = $scope.patientInfo.age;
        patient.address = $scope.patientInfo.address;
        patient.city = $scope.patientInfo.city;
        patient.country = $scope.patientInfo.country;
        patient.patient_profile_pic_url = $scope.patientInfo.profile_pic_url;        
        patient.title = $scope.patientInfo.title;
        patient.sender = "doctor";        
      });
      $scope.isNewPrescription = true;
    } else {
      $scope.isNewPrescription = false;
    }
  }

  $scope.viewOld = function() {
    if($scope.isOldPrescription === false) {
      getPatientMedication("/user/doctor/get-patient/medication");
    } else {
      $scope.isOldPrescription = false;
    }
  }

//view previously writen prescription by this doctor for this patient
  var getPatientMedication = function(url){
    $http({
      method  : 'PUT',
      url     : url,
      data    : patient,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      var myFoundPrescriptions = [];
      for(var i = data.medications.length-1; i >= 0; i--){
        if(data.medications[i].doctor_id === data.user) {
          myFoundPrescriptions.push(data.medications[i]);
          $scope.wroteByThisDoctor = myFoundPrescriptions;
        }
      }        
    });
    $scope.isOldPrescription = true;
  }

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
      patient.prescriptionBody = newVal;// adds prescription body to the prescription object as the doctor 
    //prepares to send it to the back end.
    },true)    

    $scope.toPatient = function(){
      //doctor creates the prescription object and sends it the the back end. url is "patient/forwarded-prescription", other informations that
      //comes with the prescription object added to the prescription object on the backend.
      templateService.holdPrescriptionToBeForwarded = patient;
      $http({
        method  : 'PUT',
        url     : "/user/patient/forwarded-prescription",
        data    : patient,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {    
        alert(data);
        $scope.isNewPrescription = false;
      });
      
    }

    $scope.toPharmacy = function(){   
      templateService.holdPrescriptionToBeForwarded = patient;
      $location.path("/search/pharmacy");
      $scope.isNewPrescription = false;
    }

    //watching update
    var edit = {}
    edit.newlyEdit = true;// use to control inserting time per edit
    $scope.edit = {};
   
    
    var dt = + new Date();
    edit.date = $filter('date')(dt, 'EEE, MMM d, y')
    
   

  var input = {
    check : 0
  }// scope watch count to show save changes button on ui this is bcos newVal is set when the controller is initialized.
  //when count is 2 the watch should display the save changes button on the ui.
  
  $scope.$watch("edit",function(newVal,oldVal){  
    if($scope.updateMsg)
      $scope.updateMsg = "";

    if(input.check > 0) 
      $scope.isChanges = true;

    input.check++;    
  },true);

  $scope.saveChanges = function () {    
    input.check = 1;
    var filter = {};

    for(var i in $scope.edit) {
      if($scope.edit.hasOwnProperty(i) && typeof $scope.edit[i] !== "object" && $scope.edit[i] !== "" && $scope.edit[i] !== undefined) {
        filter[i] = ($scope.edit[i]) ? (!lessThan24HourAgo()) ? "<br><font color='green' weight='bold'> " +
         edit.date + " </font>:  " + $scope.edit[i] : "<br><font color='grey' weight='bold'> &nbsp;" +
          $scope.edit[i] + "</font>" : "";
      }
    }

    filter.session_id = $scope.sessionData.session_id;
   
    filter.subSession = true;
    if(!$scope.edit.medical_report) {
      filter.sub_session_id = $rootScope.sub_session_id;
    } else {
      if($scope.subId) {
        filter.sub_session_id = $scope.subId;
      } else {
        filter.sub_session_id = $rootScope.sub_session_id;
      }
    }
    

    filter.patient_id = patient.id;
    $scope.loading = true;
    $http({
      method  : 'PUT',
      url     : "/user/doctor/session-update/save-changes",
      data    : filter,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      $scope.loading = false;
      if(data.success)
        if(data.subSession) {
          //$scope.sessionData.diagnosis.sub_session.push(data.subSession);
          var elem = $scope.sessionData.diagnosis.sub_session.map(function(x){return x.sub_session_id}).indexOf(data.subSession.sub_session_id)
          if($scope.sessionData.diagnosis.sub_session[elem]){
            if(data.subSession.note)
              $scope.sessionData.diagnosis.sub_session[elem].note = data.subSession.note;
            if(data.subSession.general)
              $scope.sessionData.diagnosis.sub_session[elem].general = data.subSession.general;
            if(data.subSession.systemic)
              $scope.sessionData.diagnosis.sub_session[elem].systemic = data.subSession.systemic;
            if(data.subSession.diagnosis)
              $scope.sessionData.diagnosis.sub_session[elem].diagnosis = data.subSession.diagnosis;
          } else {
            if(!$scope.edit.medical_report) {
              $scope.sessionData.diagnosis.sub_session.push(data.subSession)
            } else {
              $scope.getReportForSub($scope.subId)
            }
          }

          $scope.updateMsg = "saved!" ;
          $scope.isChanges = false;
        } else {
          alert("Oops! Error occured. Changes not saved!,Try again");
        }               
    });         
  }

  var lessThan24HourAgo = function(date) {
    return moment(date).isAfter(moment().subtract(24, 'hours'));
  }


  function genId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

      for( var i=0; i < 20; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
  }

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

app.controller("investigationController",["$scope","$http","labTests","scanTests",
  "$rootScope","$resource","templateService","labNotRanService","getAllLaboratoryService",
  "radioNotRanService","getAllRadiologyService",
  function($scope,$http,labTests,scanTests,$rootScope,$resource,templateService,
    labNotRanService,getAllLaboratoryService,radioNotRanService,getAllRadiologyService){

    var sessionInfo = templateService.holdForSpecificPatient || localManager.getValue("heldSessionData");
    var patient = $rootScope.patientInfo || {};
    $rootScope.session = sessionInfo.session_id;
    $rootScope.treatment = ($rootScope.treatment) ? $rootScope.treatment : {};
    $scope.isSearchToSend = false;

    

    $scope.treatment.city = patient.city;
    $scope.treatment.country = patient.country;


    $scope.lab = function() {
      $scope.isNewLab = true;
      $scope.isNewRadio = false;
      
      var test_name;
      var index;

      $scope.getTest = function (test) {
        test_name = test;
        if($scope.TestList.length === 1)
          $scope.TestList[0].name = test;
        if( $scope.TestList.length > 1)
          $scope.TestList[index].name = test;
      }

    
      $scope.tests = labTests.listInfo.concat(labTests.listInfo2,labTests.listInfo3,labTests.listInfo4,labTests.listInfo5,labTests.listInfo6,labTests.listInfo7);

      $http({
        method  : "GET",
        url     : "/user/getSpecialTests", //gets special tests from backend     
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(response) {   
        $scope.tests = $scope.tests.concat(response);
      });


      $scope.TestList = [{
        sn: 1,
        name: ""
      }];

      var count = {};
      count.num = 1;


      $scope.addTest = function(){
        var testObj = {};
        count.num++;
        testObj.sn = count.num;
        $scope.TestList.push(testObj);
        index = $scope.TestList.length - 1;
      }

      $scope.removeTest = function() {
        if(count.num > 1){
          $scope.TestList.pop();
          count.num--;
        }
      }


       $scope.$watch("TestList",function(newVal,oldVal){
        patient.lab_test_list = newVal;// adds prescription body to the prescription object as the doctor 
      //prepares to send it to the back end.
      },true);  

      $scope.sendToLab = function () {        
          $scope.isNewLab = false;
          $scope.isSearchToSend = true;
          
          getLaboratories();
        

        
        $scope.changeOption = function() {
          getLaboratories();
        }

        $scope.goBack = function() {
          $scope.isNewLab = true;
          $scope.isSearchToSend = false;
        }

       
        $scope.pickedCenter = null;
        $rootScope.treatment.session_id = $rootScope.session; // id to identify prescription in a session if one is written.
        $rootScope.treatment.patient_id = patient.patient_id || patient.user_id;
        patient.patient_id = patient.patient_id || patient.user_id;
        $rootScope.treatment.typeOfSession = "";

        $scope.selected = function(center) {
          $scope.pickedCenter = center;
          if($scope.message) 
            $scope.message = null;


         

          var source = labNotRanService;//$resource("/user/laboratory/not-ran-services");

          source.query({centerId: center.user_id},function(data) { 
            if(data.error){
              $sccope.status = "Not Updated!";
              return;
            }

            $scope.status = "Updated!";
            var elemPos;
            for(var i = 0; i < $scope.TestList.length; i++) {
              $scope.TestList[i].available = true;
              elemPos = data.map(function(x){return x.name}).indexOf($scope.TestList[i].name)
              if(elemPos !== -1) {
                $scope.TestList[i].available = false;
              }
            }

            patient.user_id = center.user_id // id is the id of the laboratory
          });
        }


       
      
        function getLaboratories() {
          $scope.loading = true;
          var source = getAllLaboratoryService; //$resource("/user/getAllLaboratory")
          source.query({city:$scope.treatment.city,country:$scope.treatment.country},function(list){
            $scope.loading = false;
            $scope.searchResult = list;
          });
        }
       
        $scope.sendTest = function () {
            $scope.isLoading = true;
           patient.laboratory = {};
           patient.laboratory.patient_gender = patient.gender;
           patient.history = $rootScope.treatment.history;
           patient.laboratory.patient_age = patient.age;
           patient.patient_firstname = patient.firstname;
           patient.patient_lastname = patient.lastname;
           patient.patient_address = patient.address;
           patient.patient_profilePic = patient.profile_pic_url;
           patient.patient_title = patient.title;
           patient.session_id = $rootScope.session;
           patient.clinical_summary = $scope.treatment.clinical_summary;
           patient.indication = $scope.treatment.indication;
           patient.lmp = $scope.treatment.lmp;
           patient.parity = $scope.treatment.parity;
           patient.date = + new Date(); 
           patient.noUpdate = true,
           patient.typeOfSession = "";
           patient.treatment = $rootScope.treatment ;

           if($rootScope.isSubNote) {
              patient.subSession = true;
              patient.sub_session_id = $rootScope.sub_session_id;
              $rootScope.isSubNote = false;
           }

          $http({
          method  : 'POST',
          url     : "/user/doctor/send-test",
          data    : patient,
          headers : {'Content-Type': 'application/json'} 
          })
          .success(function(data) {
            $scope.isLoading = false;
            if(data) {   
              $scope.message = "Investigations sent!";
            } else {
              alert("Error: Investigation not sent!");
            }
          });
        }

        function toPatient() {
          patient.provisional_diagnosis = $rootScope.treatment.provisionalDiagnosis;
          patient.prescriptionBody = testList;
        }
        
      };
    }

    $scope.radio = function() {
      $scope.isNewLab = false;
      $scope.isNewRadio = true;  
      var test_name;
      var index;
      $scope.getTest = function (test) {
        test_name = test;
        if($scope.TestList.length === 1)
          $scope.TestList[0].name = test;
        if( $scope.TestList.length > 1)
          $scope.TestList[index].name = test;
      }     

      $scope.tests = scanTests.listInfo1.concat(scanTests.listInfo2,scanTests.listInfo3,scanTests.listInfo4,scanTests.listInfo5,scanTests.listInfo6);

      $http({
        method  : "GET",
        url     : "/user/getSpecialTestsRadio", //gets special tests from backend     
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(response) {   
        $scope.tests = $scope.tests.concat(response);
      });
      
      $scope.TestList = [{
        sn: 1,
        name: ""
      }];

      var count = {};
      count.num = 1;


      $scope.addTest = function(){
        var testObj = {};
        count.num++;
        testObj.sn = count.num;
        $scope.TestList.push(testObj);
        index = $scope.TestList.length - 1;
      }

      $scope.removeTest = function() {
        if(count.num > 1){
          $scope.TestList.pop();
          count.num--;
        }
      }

      $scope.sendToRad = function () {        
        $scope.isNewRadio = false;
        $scope.isSearchToSend = true;
       // $rootScope.treatment.city = patient.city;
        //$rootScope.treatment.country = patient.country;

        getRadiologies();
      }

      $scope.changeOption = function() {
        getRadiologies();
      }

      $scope.goBack = function() {
        $scope.isNewRadio = true;
        $scope.isSearchToSend = false;
      }

      $scope.$watch("TestList",function(newVal,oldVal){
        patient.lab_test_list = newVal;// adds prescription body to the prescription object as the doctor 
      //prepares to send it to the back end.
      },true);  

      $scope.pickedCenter = null;
      $rootScope.treatment.session_id = $rootScope.session; // id to identify prescription in a session if one is written.
      $rootScope.treatment.patient_id = patient.patient_id || patient.user_id;
      patient.patient_id = patient.patient_id || patient.user_id;
      $rootScope.treatment.typeOfSession = "";

      $scope.selected = function(center) {
        $scope.pickedCenter = center;
        if($scope.message) 
          $scope.message = null;

       

        var source = radioNotRanService; //$resource("/user/radiology/not-ran-services");
        source.query({centerId: center.user_id},function(data) { 
          if(data.error){
            $sccope.status = "Not Updated!";
            return;
          }

          $scope.status = "Updated!";
          var elemPos;
          for(var i = 0; i < $scope.TestList.length; i++) {
            $scope.TestList[i].available = true;
            elemPos = data.map(function(x){return x.name}).indexOf($scope.TestList[i].name)
            if(elemPos !== -1) {
              $scope.TestList[i].available = false;
            }
          }

          patient.user_id = center.user_id // id is the id of the laboratory
        })
      }


      function getRadiologies() {
        var source = getAllRadiologyService; //$resource("/user/getAllRadiology")
        $scope.loading = true;
        source.query({city:$scope.treatment.city,country:$scope.treatment.country},function(list){
          $scope.loading = false;
          $scope.searchResult = list;
        })
      }

      $scope.sendTest = function () {
        $scope.isLoading = true;
         patient.radiology = {};
         patient.radiology.patient_gender = patient.gender;
         patient.history = $scope.treatment.history;
         patient.radiology.patient_age = patient.age;
         patient.patient_address = patient.address;
         patient.patient_firstname = patient.firstname;
         patient.patient_lastname = patient.lastname;
         patient.patient_profilePic = patient.patient_profile_pic_url;
         patient.patient_title = patient.title;
         patient.clinical_summary = $scope.treatment.clinical_summary;
         patient.indication = $scope.treatment.indication;
         patient.lmp = $scope.treatment.lmp;
         patient.parity = $scope.treatment.parity;
         patient.session_id = $rootScope.session;
         patient.date = + new Date(); 
         patient.noUpdate = true;
         patient.typeOfSession = "";
         patient.treatment = $rootScope.treatment;

         if($rootScope.isSubNote) {
            patient.subSession = true;
            patient.sub_session_id = $rootScope.sub_session_id;
            $rootScope.isSubNote = false;
         }
          
        $http({
          method  : 'POST',
          url     : "/user/doctor/radiology/send-test",
          data    : patient,
          headers : {'Content-Type': 'application/json'} 
          })
        .success(function(data) {
          $scope.isLoading = false;
          if(data) { 
            $scope.message = "Investigations sent!"  
          } else {
            alert("Error: Investigation not sent!")
          }

        });
      }
    }


    if($rootScope.flag === "lab") {
      $scope.lab();
    } else {
      $scope.radio();
    }


   
}]);

/**********************Laboratory tests list **********************/

app.controller("labController",["$scope","$location","templateService","labTests",function($scope,$location,templateService,labTests){

var listInfo = labTests.listInfo;


var listInfo2 = labTests.listInfo2;

var listInfo3 = labTests.listInfo3;

var listInfo4 = labTests.listInfo4;

var listInfo5 = labTests.listInfo5;

var listInfo6 = labTests.listInfo6

var listInfo7 = labTests.listInfo7;

  var holdList = {};
  var selectedItemList = [];
  

  $scope.isChemical = true;  

  holdList.listInfo = listInfo;  
  $scope.list = holdList.listInfo;

  $scope.chemical = function(){
    $scope.isChemical = true;
    $scope.isBlood = false;
    $scope.isCytology = false;
    $scope.isHormone = false;
    $scope.isParasitology = false;
    $scope.isMolecular = false;
    $scope.isToxicology = false;

    $scope.list = holdList.listInfo;
  }

  $scope.blood = function(){
    $scope.isChemical = false;
    $scope.isBlood = true;
    $scope.isCytology = false;
    $scope.isHormone = false;
    $scope.isParasitology = false;
    $scope.isMolecular = false;
    $scope.isToxicology = false;

    holdList.listInfo2 = listInfo2;
    $scope.list = holdList.listInfo2;
  }

  $scope.cytology = function(){
    $scope.isChemical = false;
    $scope.isBlood = false;
    $scope.isCytology = true;
    $scope.isHormone = false;
    $scope.isParasitology = false;
    $scope.isMolecular = false;
    $scope.isToxicology = false;

    holdList.listInfo3 = listInfo3;
    $scope.list = holdList.listInfo3;
  }

  $scope.hormone = function(){
    $scope.isChemical = false;
    $scope.isBlood = false;
    $scope.isCytology = false;
    $scope.isHormone = true;
    $scope.isParasitology = false;
    $scope.isMolecular = false;
    $scope.isToxicology = false;

    holdList.listInfo4 = listInfo4;
    $scope.list = holdList.listInfo4;
  }

  $scope.parasitology = function() {
    $scope.isChemical = false;
    $scope.isBlood = false;
    $scope.isCytology = false;
    $scope.isHormone = false;
    $scope.isParasitology = true;
    $scope.isMolecular = false;
    $scope.isToxicology = false;

    holdList.listInfo5 = listInfo5;
    $scope.list = holdList.listInfo5;

  }

  $scope.toxicology = function(){
    $scope.isChemical = false;
    $scope.isBlood = false;
    $scope.isCytology = false;
    $scope.isHormone = false;
    $scope.isParasitology = false;
    $scope.isMolecular = false;
    $scope.isToxicology = true;

    holdList.listInfo6 = listInfo6;
    $scope.list = holdList.listInfo6;
  }

  $scope.molecular = function(){
    $scope.isChemical = false;
    $scope.isBlood = false;
    $scope.isCytology = false;
    $scope.isHormone = false;
    $scope.isParasitology = false;
    $scope.isMolecular = true;
    $scope.isToxicology = false;


    holdList.listInfo7 = listInfo7;
    $scope.list = holdList.listInfo7;
  }
  
  var index = 1;

  $scope.preview = function(){ 
    for(var i in holdList) {
      if(holdList.hasOwnProperty(i)){
        for(var j = 0; j < holdList[i].length; j++){
          if(!holdList[i][j].sn && holdList[i][j].select === true){            
            holdList[i][j].sn = index;
            selectedItemList.push(holdList[i][j]);
            index++;            
          } 
        }
      }
    }

    templateService.holdSelectedLabTest = selectedItemList;
    $location.path("/preview-test"); 
  }

}]);

app.controller("scanController",["$scope","$location","templateService","scanTests",function($scope,$location,templateService,scanTests){

/***********Listing of X-Ray Investigation *******************/   

var listInfo1 = scanTests.listInfo1

/*******Listing of Ultrasonography *************/    

var listInfo2 = scanTests.listInfo2

/********************Listing of Computerized Tomography Scan (C.T. SCAN)  **********************/   


var listInfo3 = scanTests.listInfo3

/************** Listing of ECG  ****************/

var listInfo4 = scanTests.listInfo4

/**************** Listing of MRI  ************/ 

var listInfo5 = scanTests.listInfo5


/***************** Listing of MAMMOGRAM   ********************/

var listInfo6 = scanTests.listInfo6

 var holdList = {};
  var selectedItemList = [];
  

  $scope.isXRay = true;  

  holdList.listInfo = listInfo1;  
  $scope.list = holdList.listInfo;

  $scope.xray = function(){
    $scope.isXRay = true;
    $scope.isUltra = false;
    $scope.isCT = false;
    $scope.isECG = false;
    $scope.isMRI = false;
    $scope.isMammo = false;
    $scope.list = holdList.listInfo;
  }

  $scope.ultra = function(){
    $scope.isXRay = true;
    $scope.isUltra = true;
    $scope.isCT = false;
    $scope.isECG = false;
    $scope.isMRI = false;
    $scope.isMammo = false;

    holdList.listInfo2 = listInfo2;
    $scope.list = holdList.listInfo2;
  }

  $scope.ct = function(){
    $scope.isXRay = true;
    $scope.isUltra = false;
    $scope.isCT = false;
    $scope.isECG = false;
    $scope.isMRI = false;
    $scope.isMammo = false;

    holdList.listInfo3 = listInfo3;
    $scope.list = holdList.listInfo3;
  }

  $scope.ecg = function(){
    $scope.isXRay = false;
    $scope.isUltra = false;
    $scope.isCT = false;
    $scope.isECG = true;
    $scope.isMRI = false;
    $scope.isMammo = false;

    holdList.listInfo4 = listInfo4;
    $scope.list = holdList.listInfo4;
  }

  $scope.mri = function(){
    $scope.isXRay = false;
    $scope.isUltra = false;
    $scope.isCT = false;
    $scope.isECG = false;
    $scope.isMRI = true;
    $scope.isMammo = false;

    holdList.listInfo5 = listInfo5;
    $scope.list = holdList.listInfo5;
  }

  $scope.mammo = function() {
    $scope.isXRay = false;
    $scope.isUltra = false;
    $scope.isCT = false;
    $scope.isECG = false;
    $scope.isMRI = false;
    $scope.isMammo = true;

    holdList.listInfo6 = listInfo6;
    $scope.list = holdList.listInfo6;

  }

  var index = 1;

  $scope.preview = function(){ 
    for(var i in holdList) {
      if(holdList.hasOwnProperty(i)){
        for(var j = 0; j < holdList[i].length; j++){
          if(!holdList[i][j].sn && holdList[i][j].select === true){            
            holdList[i][j].sn = index;
            selectedItemList.push(holdList[i][j]);
            index++;            
          } 
        }
      }
    }

    templateService.holdSelectedLabTest = selectedItemList;
    $location.path("/preview-scan-test"); 
  }

}]);

//this controls the preview lab test xelected by the doctor
app.controller("previewLabTestController",["$scope","localManager","$location","templateService",
  function($scope,localManager,$location,templateService){
  var list = templateService.holdSelectedLabTest;
  $scope.labTest = list;

  var getTotal = {}
  getTotal.total = 0;

  list.forEach(function(item){
    getTotal.total = getTotal.total + item.price;
  })

  $scope.cost = getTotal.total;

  $scope.del = function(sn){
    var elementPos = list.map(function(x) {return x.sn; }).indexOf(sn);             
    var remv = list.splice( elementPos, 1 );
    getTotal.total = getTotal.total - remv[0].price;
    $scope.cost = getTotal.total;   
  }
  
  //doctor search for labortory within is city. by default, doctor gets a laboratory within his city.
  $scope.sendTolab = function(){    
    $location.path("/find-laboratory");
  }
  
}]);

app.controller("previewScanTestController",["$scope","localManager","$location","templateService",
  function($scope,localManager,$location,templateService){
  var list = templateService.holdSelectedLabTest;
  $scope.labTest = list;

  var getTotal = {}
  getTotal.total = 0;

  list.forEach(function(item){
    getTotal.total = getTotal.total + item.price;
  })

  $scope.cost = getTotal.total;

  $scope.del = function(sn){
    var elementPos = list.map(function(x) {return x.sn; }).indexOf(sn);             
    var remv = list.splice( elementPos, 1 );
    getTotal.total = getTotal.total - remv[0].price;
    $scope.cost = getTotal.total;   
  }
  
  //doctor search for labortory within is city. by default, doctor gets a laboratory within his city.
  $scope.sendToScan = function(){    
    $location.path("/find-radiology");
  }

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


// inside the above modal doctor compiles acceptance object and send to paitent
app.controller("grantedRequestController",["$scope","$http","$rootScope","ModalService","requestManager","templateService","deleteFactory","$rootScope","$location","$resource",
  function($scope,$http,$rootScope,ModalService,requestManager,templateService,deleteFactory,$rootScope,$location,$resource){
  $scope.data = requestManager.get();
  $scope.docName = templateService.getfirstname;
  $scope.docName2 = templateService.getlastname;
  $scope.user = {};
  $scope.user.fee = 0;
  var inNaira;
  var raw;
  var commission;
  $scope.$watch('user.fee',function(){
    commission = $scope.user.fee * (($rootScope.checkLogIn.city_grade / 100) || 0.1);
    raw = $scope.user.fee - commission;
    inNaira = ($rootScope.checkLogIn.currencyCode) ? $rootScope.checkLogIn.currencyCode + raw.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "NGN " + raw.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $scope.total = inNaira;
  });  
  
  $scope.sendAcceptance = function(){
  
    if($scope.user.fee > 0){
      $scope.loading = true;
      var date = + new Date();
      var grantedRequest = {};
      grantedRequest.patientId = $scope.data.sender_id;
      grantedRequest.date = date;      
      grantedRequest.consultation_fee = $scope.user.fee;      
      grantedRequest.service_access = false;
      grantedRequest.originalComp = $rootScope.data;
      grantedRequest.response = $scope.user.response;


      $http({
        method  : 'PUT',
        url     : "/user/doctor/acceptance",
        data : grantedRequest,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        $scope.loading = false;              
        if(data.status){
          $rootScope.$broadcast("consultation attended",{status:true,id: $rootScope.data.message_id});
          $rootScope.data = null;
          $scope.acceptanceMsg = "Success! Consultation acceptance submitted, patient will be notified."//alert("Success! Patient will be notified");
        } else {
          $scope.message = "Oops! Something went wrong. Acceptance not sent.";
        }
      });

    } else {
        $scope.message = "Please enter your consultation fee below."
    }
  }

  $scope.delineReq = function(data) {
    $scope.loading = true;
    $http({
      method  : 'PUT',
      url     : "/user/doctor/decline-request",
      data : data,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(res) {
      $scope.loading = false;              
      if(res.status){
        //alert("request")
        //update doctor's  notification list
        //;
        $rootScope.$broadcast('declined request',{status: true, id: $rootScope.data.message_id});
        $rootScope.data = null;
      } else {
        alert("error occured! request was not declined. Try again")
      }
    });
  }

}]);


app.service("findSpecialistService",["$resource",function($resource){
  return $resource("/user/find-specialist",null,{refer:{method: "PUT"}});
}]);

app.controller("referRequestController",["$scope","$http","ModalService","requestManager",
  "templateService","deleteFactory","$rootScope","$location","$resource","findSpecialistService","$filter",
  function($scope,$http,ModalService,requestManager,templateService,
    deleteFactory,$rootScope,$location,$resource,findSpecialistService,$filter){

    var source = findSpecialistService;//$resource("/user/find-specialist",null,{refer:{method: "PUT"}});
    $scope.search = {};
    $scope.search.city = $rootScope.checkLogIn.city;
    $scope.search.specialty = $rootScope.checkLogIn.specialty;
    var spArr = [];
    var filter = {};

    $scope.findSpecialist = function() {
      $scope.loading = true;
      source.query($scope.search,function(data){
        $scope.loading = false;
        $scope.searchResults = data;
      });
    } 

    $scope.findSpecialist();

    $scope.isInitial = true;

    $http({
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
          } else {
            filter[data[i].specialty]++;
          }
        }

        $scope.allSpecialties = spArr || [];
      }
    }); 

    $scope.continue = function() {
      $scope.isInitial = false;
      $scope.isSearch = true;
    }

    $scope.edit = function() {
      $scope.isInitial = true;
      $scope.isSearch = false;
      $scope.isReview = false;
    }

    $scope.back = function() {
      $scope.isInitial = false;
      $scope.isSearch = true;
      $scope.isReview = false;
    }



    $scope.refer = function(doc) {
      $scope.doc = doc;
      var date = + new Date();

      var patient = $rootScope.patientInfo || $rootScope.data;

      var sender = ($rootScope.checkLogIn.lastname) ? ($rootScope.checkLogIn.title + " " 
        + $rootScope.checkLogIn.lastname + " " + $rootScope.checkLogIn.firstname) : $rootScope.checkLogIn.name;

      var patientName = (patient.firstname) ? patient.title + " " 
      + patient.firstname + " " + patient.lastname : patient.sender_firstname + " " + patient.sender_lastname;

      var age = (patient.age) ? patient.age : patient.sender_age;
      var gender = (patient.gender) ? patient.gender : patient.sender_gender;
      var patientCity = (patient.city) ? patient.city : patient.sender_location;

      var msg = "<div><b>" 
      + sender + "</b><br> " 
      + $rootScope.checkLogIn.specialty + "<br> " 
      + $rootScope.checkLogIn.city + "<br><br> <b>TO</b> <br><br><b> " 
      + doc.name + "</b><br> " 
      + doc.specialty + "<br> " 
      + doc.city + "<br><br><label>Referral Date: </label> " 
      + $filter('date')(date,'mediumDate') + " at " + $filter('date')(date,'shortTime') + "<br><br>" 
      + "<h6>We hereby refer to you this patient:</h6><label>Patient Name: </label> " 
      + patientName
      + "<br><label>Age: </label> " 
      + age
      + "<br><label>Gender: </label> " 
      + gender + "<br><label>City: </label> " 
      + patientCity + "<br><br>" 
      + "<h6>With the following presenting complaints:</h6><p>" 
      + $scope.search.initial 
      + "</p><br><h6>Management so far:</h6><p>" + $scope.search.howFar 
      + "</p><br><p>Kindly take over the expert management.</p>" 
      + "<label>Sincerely yours,</label><br><label>" 
      + sender
      + "</label><br><span>" + $rootScope.checkLogIn.specialty + "</span><br></div>"

      $rootScope.data.isLaterRef = "yes";

      $rootScope.data.message = msg;


      /*doc.loading = true;
      $rootScope.data.receiverId = doc.user_id;
      source.refer($rootScope.data,function(response){
        doc.loading = false;
        if(response.status) {
          doc.msg = "request sent!";
          $rootScope.$broadcast("consultation attended",{status:true,id: $rootScope.data.message_id});
          $rootScope.data = null
        }
      })*/
      $scope.isSearch = false;
      $scope.isReview = true;
    }

   

    $scope.send = function() {
      var doc = $scope.doc;
      doc.loading = true;
      $rootScope.data.receiverId = doc.user_id;
      source.refer($rootScope.data,function(response){
        doc.loading = false;
        if(response.status) {
          doc.msg = "Referral sent!";
          $rootScope.$broadcast("consultation attended",{status:true,id: $rootScope.data.message_id});
        } else {
          doc.msg = "Oops! Something went wrong. Please try again";
        }
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

app.controller('infoController',["$scope",function($scope){

}]);




/**** for patients ***/

//runs first when patient first logged in
app.controller("inPatientDashboardController",["$scope","$location","templateService","localManager","ModalService",
  function($scope,$location,templateService,localManager,ModalService){

 if(localManager.getValue("resolveUser")) {
    $location.path(localManager.getValue("currentPageForPatients") || "/");
  } 

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

// this controller gets  the patient medical records from the backend and seperates laboratory tsest from radiology test 
//to store then templateService. Note patient prescription  is not amonge the data filtered so far.
app.controller("patientNotificationController",["$scope","$location","$http","$window","$rootScope","$resource","chatService",
  "templateService","localManager","deleteFactory","mySocket","$timeout","medicaRecordFactory","patientNotificationService",
  "getMedicalHistoryService","chatHistoryService","getResponseService","getMessagesService","getAppointmentServce","courierResponseService",
  function($scope,$location,$http, $window,$rootScope,$resource,chatService,templateService,localManager,
    deleteFactory,mySocket,$timeout,medicaRecordFactory,patientNotificationService,
    getMedicalHistoryService,chatHistoryService,getResponseService,getMessagesService,getAppointmentServce,courierResponseService){
  
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
      if(list[test].conclusion === "Pending" || list[test].report === "Pending") {
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
      if(list[test].conclusion === "Pending" || list[test].report === "Pending") {
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

  

  $scope.viewNote = function(id,type){
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
  }


  
  $scope.getLen = function(len){
    return len;
  }


  $scope.isView = false;


 

  function getNotification() {
    var note = patientNotificationService; 
    note.query(function(data){
      $rootScope.allNote = data;
      $rootScope.noteLen = data.length; 
    })
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
      if(data[elementPos].report === "Pending"){
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
      var holdRecord = [];
      data.forEach(function(record){
        if(record.prescriptionId === id) {
          holdRecord.unshift(record);
        }
      });
      templateService.holdTrackRecord = holdRecord;
    });

    var presIndex = prescriptions.map(function(x){return x.prescriptionId}).indexOf(id)
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
        $rootScope.appLen = templateService.holdAppLen(len);             
        templateService.holdAppointmentData = data; 
        $rootScope.allApp = data;
      }   
    })
    
  }
  

  $rootScope.viewAppointment = function(sessionId){
    templateService.holdId = sessionId;
    $location.path("/p/selected-appointment/" + sessionId); 
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


  $scope.holdVideoCallResponse = [];
  $scope.holdAudioCallResponse = [];

  mySocket.on("conversation status",function(data){
    alert(data.firstname + "says yes");
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
      $timeout(function(){
        $scope.isReceivedRequest = false;
      },10000);
      getMessages();
    }
  });

  mySocket.on("notification",function(data){
    if(data.status){
      templateService.playAudio(0);
      data.type = "notification";
      $scope.isReceivedRequest = true;
      $timeout(function(){
        $scope.isReceivedRequest = false;
      },10000);
      getNotification();
    }
  })

  mySocket.on("calling",function(data){
    var decide = confirm(data.callerFirstname + " " + data.callerLastname  + " wants to have video chat with you now!!!");
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
  $rootScope.loadChats = function() {
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

  $rootScope.loadChats();

  $rootScope.viewChat = function(partnerId) {
    templateService.holdId = partnerId;
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
    pt = '/courier-response/' + Math.floor(Math.random() * 99999999);
    $location.path(pt);
  }

  getCourier();

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


app.service("getPersonProfileService",["$resource",function($resource){
  return $resource("/user/get-person-profile");
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
          $rootScope.balance = "NGN " + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");          
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

/////handles pending tests list including communications
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//not neccessary since view notifictaion from the drop down is note implemented.

/*app.controller("viewPrescriptionFromNoticeTemplateController",["$scope","$location","$http","templateService",
  function($scope,$location,$http,templateService){
    var container = [];
    var deleteObj = {};
    templateService.holdAllPrescriptionForOtherCtrl.forEach(function(prescription){
      if(prescription.doctor_id === templateService.holdPrescriptionsId) {
        container.unshift(prescription);        
        $scope.prescriptionRecordsResult = container;
        deleteObj.doctor_id = prescription.doctor_id;
        $http({
          method  : 'PUT',
          url     : "/patient/acceptance/prescription",
          data    : deleteObj,
          headers : {'Content-Type': 'application/json'} 
          })
        .success(function(data) { 
          return;
        });
        
      }
    });  
}]);*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  $scope.pay.mode = "Pay with Card/Bank Account";

  /*$scope.goBack = function () {
    $location.path(localManager.getValue("currentPageForPatients"))
  }*/

  $scope.$watch("pay.mode",function(newVal,oldVal){
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
        $rootScope.balance = "NGN" + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  $scope.pay.amount = 0;



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
        var round = Math.round(data.balance)
        var format = "NGN" + round.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $rootScope.balance = format;

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
            var check = confirm("Your want to transfer " + $scope.str + " to " +  data.firstname + " " + data.lastname + "\nThis amount will be debited from your wallet.");
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
          $rootScope.balance = "NGN " + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          $scope.isTransfer = true;
          $scope.isOTP = false;
          $scope.isPhone = true;
          $scope.isUserId = false;
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
          $rootScope.balance = "NGN" + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");          
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
            $rootScope.balance = "NGN" + data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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



//this controller controls the patient-treatment.html. it brings the docobj and gives patient 
//all utilities available to communicate with his doctor. this template is responsible for all contact and connections b/w doctor and patient.
app.controller("patientTreatmentController",["$scope","$http","ModalService","requestManager","templateService",function($scope,$http,ModalService,requestManager,templateService){
 $scope.user = {};
 $scope.makeCall = false;
 
      
}]);

app.service("medicalRecordService",["$resource",function($resource){
  return $resource("/user/get-medical-record");
}])

//recieves the patients medical record and prescription from the back end.
app.controller("patientPanelController",["$scope","$location","$http","$rootScope","localManager","ModalService",
  "templateService","templateUrlFactory","mySocket","$resource","$window","medicalRecordService",
  function($scope,$location,$http,$rootScope,localManager, ModalService, templateService,templateUrlFactory,
    mySocket,$resource,$window,medicalRecordService){
  templateUrlFactory.setUrl();
  var medical = {};
  var filter = {};
  var total = {};
  
  var records = medicalRecordService; //$resource("/user/get-medical-record");
  function recordFetch() {
    records.get(function(data){   
      var filteredPrescriptions = [];
      medical.records = data.medical_records;
      medical.prescriptions = data.prescriptions;  
          
      templateService.holdPrescriptions = medical.prescriptions; 
      var concatName;
      $scope.totalPrescription = 0;
      var filteredPrescriptions = [];

      for(var j = 0; j < medical.prescriptions.length; j++){        
        if(!filter.hasOwnProperty(medical.prescriptions[j].doctor_id)){                        
          total[medical.prescriptions[j].doctor_id] = medical.prescriptions[j];
          filter[medical.prescriptions[j].doctor_id] = 1;        
                 
        } else {       
          filter[medical.prescriptions[j].doctor_id]++;
        }

        $scope.totalPrescription++;
      };

      for(var i in filter){
        if(total.hasOwnProperty(i)) {
          var pres = total[i];
          pres.len = filter[i];
          filteredPrescriptions.push(pres);
        }
      }

     
      $scope.filteredPrescriptions = filteredPrescriptions;//Object.keys(filter)//filteredPrescriptions;
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

app.controller("accoundLoaderConTroller",["$rootScope",function(rootscope){

}])


//account-switch-modal.html

app.controller("selectedAppointmentControllerForPatient",["$scope","$location","$rootScope","templateService","localManager","deleteFactory",
  function($scope,$location,$rootScope,templateService,localManager,deleteFactory){
    var appData = templateService.holdAppointmentData;
    var elementPos = appData.map(function(x){return x.session_id}).indexOf(templateService.holdId);
    var found = appData[elementPos];

    $scope.appointment = found;
    $scope.notDeleted = true;
    $scope.delbtn = "Delete appointment";

   

    $scope.deleteApp = function(){
      var remove = appData.splice(elementPos,1);
      var len = appData.length;
      $rootScope.appLen = templateService.holdAppLen(len);           
      var deleteAppointment = new deleteFactory(found.session_id,"appointment");
      deleteAppointment.deleteItem("/user/patient/delete-one/appointment","Appointment deleted!");
      $scope.notDeleted = false;
      $scope.delbtn = "Appointment deleted!";
    }
    
}]);

app.controller("patientLabTestController",["$scope","$location","$http","$window",
  "templateService","localManager","patientMedViewController","$rootScope","$timeout",
  function($scope,$location,$http,$window,templateService,localManager,patientMedViewController,$rootScope,$timeout){ 

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

app.controller("patientViewScanController",["$rootScope","$scope",function($rootScope,$scope){
  $scope.test = $rootScope.holdTest
}]);

app.service('patientRedirectTestService',["$resource",function($resource){
  return $resource("/user/patient/get-centers",null,{sendTest:{method:"PUT"}});
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



app.controller("chooseDoctorController",["$scope","$location","$http","$window","templateService","localManager",
  function($scope,$location,$http,$window,templateService,localManager){  
  $scope.doctors = templateService.holdMyDoctorsForSendingTest;
  $scope.test = templateService.holdTestToBeForwarded;
 
  $scope.selectedDoctor = function(docObj) {
    //templateService.holdSelectedDoctorToSendTest = docObj;
    //$location.path("/patient/selected-doctor");
    docObj.loading = true;
    var date = new Date;
    var dataToSend = {
      type_of_test: $scope.test.type,
      doctorId: docObj.doctor_id,
      center_name: $scope.test.center_name,
      center_address: $scope.test.center_address,
      cente_city: $scope.test.center_city,
      center_country: $scope.test.center_country,
      test_result: $scope.test.test_to_run,
      conclusion: $scope.test.conclusion,
      files: $scope.test.files,
      date_sent: date,
      ref_id: $scope.test.ref_id
    }

    $http({
    method  : 'PUT',
    url     : "/user/patient/test-result/forward",
    data    : dataToSend,
    headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
      docObj.loading = false;
      if(data.status) {       
        docObj.message = "request sent!";
        /*switch($scope.test.type) {
          case "laboratory":
            $location.path("/patient/laboratory-test");
          break;
          case "radiology":
            $location.path("/patient/radiology-test");
          break;
          default:
          break;
        }*/
      } else {
        alert("Oops! Something went wrong while sending prescription request. Try again...")
      }

    }); 


  }

  $scope.goBack = function() {
    $location.path(localManager.getValue("currentPageForPatients"));
  }

}]);

app.controller("selectedDoctorToSendTestController",["$scope","$location","$http","multiData","templateService","mySocket",
  function($scope,$location,$http,multiData,templateService,mySocket){

  $scope.test = templateService.holdTestToBeForwarded;
  $scope.doctor = templateService.holdSelectedDoctorToSendTest;

  $scope.noSend = function() {
    $location.path("/patient/my-doctors");
  }

  $scope.send = function() {
    var date = new Date;
    var dataToSend = {
      type_of_test: $scope.test.type,
      doctorId: $scope.doctor.doctor_id,
      center_name: $scope.test.center_name,
      center_address: $scope.test.center_address,
      cente_city: $scope.test.center_city,
      center_country: $scope.test.center_country,
      test_result: $scope.test.test_to_run,
      conclusion: $scope.test.conclusion,
      files: $scope.test.files,
      date_sent: date,
      ref_id: $scope.test.ref_id
    }

    $http({
    method  : 'PUT',
    url     : "/user/patient/test-result/forward",
    data    : dataToSend,
    headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
      if(data.status) {       
        alert("Test rssult sent successfully!!!");
        switch($scope.test.type) {
          case "laboratory":
            $location.path("/patient/laboratory-test");
          break;
          case "radiology":
            $location.path("/patient/radiology-test");
          break;
          default:
          break;
        }
        //notify doctor in real time
        /*mySocket.emit("i sent test",{doctorId: $scope.doctor.doctor_id},function(response){
          if(response.error){
            alert(response.error);
          }
        });*/
      } else {
        alert("Oops! Something went wrong while sending test reusult. Try again...")
      }
    }); 
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

app.controller("medicalRecordTemplateController",["$scope","$location","$http","templateService",function($scope,$location,$http,templateService){
  $scope.medicalRecordsResult = templateService.holdMedicalRecord;

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
        if(record.prescriptionId === id) {
          holdRecord.unshift(record);
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

  
    //templateService.holdPrescriptionToBeForwarded = prescription;

    $rootScope.refData = prescription;
    $rootScope.refData.sender = "patient";          
    $location.path("/patient/search/pharmacy");                  
  }

}])

//this controls the search for phamarcy template. when a patient wish to forward his prescription to a desired phamarcy.
app.controller("searchForPharmacyController",["$scope","$location","$http","templateService","ModalService","$rootScope","cities","localManager",
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
      $rootScope.refData.pharmacy.prescription_body = $rootScope.unavailableDrugArr;
      $rootScope.refData.user_id = center.user_id;
      center.loading = true;
      $http({
        method  : 'PUT',
        url     : "/user/patient/pharmacy/referral-by-pharmacy", 
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
        $rootScope.refData.pharmacy.prescription_body = $rootScope.refData.pharmacy.newList;
        localManager.setValue("pharmacyData",$rootScope.refData);
      });
    }

    
    $scope.goBack = function() {
      $location.path(localManager.getValue("currPageForPharmacy"));
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


app.controller("createRoomController",["$scope","localManager","mySocket","$rootScope","templateService","$location",
  function($scope,localManager,mySocket,$rootScope,templateService,$location){
  var user = localManager.getValue("resolveUser");

  $rootScope.chatStatus = localManager.getValue("hasChat");

  var getCurrentPage = localManager.getValue("currentPageForPatients") || localManager.getValue("currentPage");
  var getHandlerPage = localManager.getValue("holdPageForHandler");
  mySocket.emit('join',{userId: user.user_id});

}]);


//controls online presence icon to show who is online or offline. Note for doctors only ppatients that are online are displayed.
app.controller("presenceSocketController",["$rootScope","$scope","$window","mySocket","localManager","ModalService","templateService",
  function($rootScope,$scope,$window,mySocket,localManager,ModalService,templateService){
   
   var person = localManager.getValue("resolveUser");
   JSON.stringify(window.localStorage.setItem("user",person));// just to save person to local storage;

   if(person.typeOfUser === "Patient"){
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
      }*/

      $rootScope.$broadcast("users presence",{type: 'patientList',data: $rootScope.patientList ,sockets: data.connects});
      
     });
  }

  
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


//this controller handles patient's doctors on the right corner of the patient profile page. it locates each doctors details when clicked.
//note this controller is used both by doctors dashboard and patient dashboard.
app.controller("checkingOutDoctorPatientController",["$scope","$location","$rootScope","$http",
  "$interval","templateService","localManager","mySocket","$interval",
function($scope,$location,$rootScope,$http,$interval,templateService,localManager,mySocket,$interval){
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
        },60000) //1 min

      } else if(type === "doctor"){       
        $rootScope.patientList = data;       
        getPatientsRealTime($rootScope.patientList);
        setAppointment($rootScope.patientList)

        $interval(function(){
          getPatientsRealTime($rootScope.patientList) 
        },60000) //1 min
      }

    });
  }

  function getDoctorsRealTime(list) {   
    mySocket.emit("check presence",{status: true},function(res){
      $rootScope.$broadcast("users presence",{type: 'doctorList',data: list,sockets: res});         
    })
             
  }

  function getPatientsRealTime(list) {
    //_.invert(hash))[1]
    // returns the current sockets of online users and _.iverts inverts the keys/values
    //use to check online presence   
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
    ///user/doctor/my-patients
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

}]);

app.controller("redirectModal",["$rootScope","$window",function($rootScope,$window){
  $window.location.href = $rootScope.controlUrl //redirects to video call page
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

app.factory("adminDoctorsService",["$resource",function($resource){
  return $resource('/user/getAllDoctor',null,{verify:{method: "PUT"}});
}])

app.factory("adminPWRService",["$resource",function($resource){
  return $resource('/user/admin/pwr',null,{update:{method: "PUT"}});
}])

app.controller("adminCreateRoomController",["$scope","localManager","mySocket","$rootScope",
  "templateService","$resource","ModalService","adminDoctorsService","$http","$location",
  "cashOutControllerService","adminConsultationService","adminScrollService","adminPWRService",
  function($scope,localManager,mySocket,$rootScope,templateService,$resource,
    ModalService,adminDoctorsService,$http,$location,cashOutControllerService,
    adminConsultationService,adminScrollService,adminPWRService){
  var user = localManager.getValue("resolveUser");  
  mySocket.emit('join',{userId: user.user_id});

  $location.path("/admin");

  $scope.total = 0;

  mySocket.on("income",function(data){
    var whole = Math.round(data.balance);
    var format = "NGN" + whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $rootScope.balance = format;    
  });

  mySocket.on("cash out",function(data){
    $rootScope.CashOutList.push(data);
  });

  mySocket.on("new user",function(data){
    $rootScope.newUserToday.push(data)
    $rootScope.newUserWeek.push(data);
    $rootScope.newUserMonth.push(data);
    $scope.total++;
  });

  mySocket.on("help request",function(data){
    $rootScope.HelpRequestList.push(data);
  });

 

  var getAllPatients = $resource('/user/getAllPatients');
  getAllPatients.get(null,function(data){
    $scope.patients = data.count;
    $scope.total += data.count;
    $rootScope.listPatients = data.data;
  });

  var getAllDoctor = adminDoctorsService;//$resource('/user/getAllDoctor');
  getAllDoctor.get(null,function(data){
    $scope.doctors = data.count;
    $rootScope.listDoctors = data.data;
    $scope.total += data.count;
  });

  var getAllPharmarcy = $resource('/user/getAllPharmarcy');
  getAllPharmarcy.get(null,function(data){
    $scope.pharmacy = data.count;
    $rootScope.listPharmacy = data.data;
    $scope.total += data.count;
  });

  var getAllLaboratory = $resource('/user/getAllLaboratory');
  getAllLaboratory.get(null,function(data){
    $scope.laboratory = data.count;
    $rootScope.listLaboratory = data.data;
    $scope.total += data.count;
  });

  var getAllRadiology = $resource('/user/getAllRadiology');
  getAllRadiology.get(null,function(data){
    $scope.radiology = data.count;
    $rootScope.listRadiology = data.data;
    $scope.total += data.count;
  })

  var getAllSpecialCenters = $resource('/user/get-specialcenters');
  getAllSpecialCenters.query(null,function(data){
    $scope.specialCenter = data.length;
    $rootScope.listSpecialCenter = data;
   
    $scope.total += data.length;
  })



  var getCashOut = cashOutControllerService;
  getCashOut.query(null,function(data){
    var result = (data.length > 0) ? data : [];
   
    $rootScope.CashOutList = result;
  });


  adminConsultationService.query(function(data){
    $rootScope.consultations = data;
  });

  adminScrollService.query(function(data){
    
    $rootScope.scrollList = data;
  });


  function pwr() {
    adminPWRService.query(function(data){
      $rootScope.pwr = data;
    })
  }

  pwr();

  $rootScope.$on("getPWR",function(i,j){
    pwr();
  });

  /*$scope.view = function(id) {
    templateService.holdId = id;
    var elemPos = $rootScope.CashOutList.map(function(x){return x.date}).indexOf(id);
    $rootScope.info = $rootScope.CashOutList[elemPos];
    ModalService.showModal({
      templateUrl: 'pay-user.html',
      controller: "cashoutModalController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
         
      });
    });
  }*/

  $scope.getBance = function(user){
    var whole = Math.round(user.ewallet.available_amount);
    var format = user.currencyCode + whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return format;
  }

  $rootScope.getUser = function(id) {    
    $http({
      method  : "GET",
      url     : (!id) ? ("/user/admin/get-user-details?item=" + $scope.user) : ("/user/admin/get-user-details?item=" + id), //gets special drugs from backend     
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {  
      if(data.length > 0) {
        localManager.setValue("adminFoundUser",data);
        $rootScope.foundUser = data;
        $location.path("/admin-user-details");
      } else {
        alert("User not found!");
      }
    });    
  }


  $http({
    method  : "GET",
    url     :  "/user/get-balance?userId=" + user.user_id,  
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {  
    $rootScope.adminProfit = data.balance;
  });    



  // note has update route for reopening
  $http({
    method  : "GET",
    url     :  "/user/settled-cashout",  
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {  
    var total = 0;
    for(var i = 0; i < data.length; i++){
      total += data[i].amount;
    }
    $scope.cashedOutTotal = total;
    $rootScope.cashedOut = data;
  });    



  

  $scope.isViewTransaction = true;

  $scope.view = function(type){
    switch(type) {
      case 'transaction':
        $scope.isViewTransaction = true;
        $scope.isViewFamily = false;
        $scope.isViewMatter = false;
        $scope.isReferral = false;
        break;
      case 'matters':
        $scope.isViewMatter = true;
        $scope.isViewFamily = false;
        $scope.isViewTransaction = false;
        $scope.isReferral = false;
        break;
      case 'family':
        $scope.isViewFamily = true;
        $scope.isViewTransaction = false;
        $scope.isViewMatter = false;
        $scope.isReferral = false;
        break;
      case 'referral':
        $scope.isViewFamily = false;
        $scope.isViewTransaction = false;
        $scope.isViewMatter = false;
        $scope.isReferral = true;
        break;
      default:
      break;
    }
  }

}]);

app.controller("adminGetUserCtrl",["$scope","$location","$rootScope","$http","localManager","$http",
  function($scope,$location,$rootScope,http,localManager,$http){

  $scope.userDetails = $rootScope.foundUser || localManager.getValue("adminFoundUser");
  


  $scope.verifyUser = function(type,user){
    if(type == 'verify')
      var check = confirm("Are you sure you want to mark this user as verified?");
    if(type == 'block')
      var check = confirm("Are you sure you want to block this user?");
    if(type == 'unverify')
      var check = confirm("Are you sure you want to mark this user as not verified?");
    if(check) {
      $http({
        method  : "PUT",
        data: {action: type, userId: user._id},
        url     : "/user/admin/verify-user",   
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {  
        if(data) {
          if(!data.type) {
            user.verified = data.status;
            localManager.setValue("adminFoundUser",[user]);
          }

          alert(data.message);
        }
        
      });
    }
  }

  $scope.deleteAcc = function(userId){
    var sure = prompt("Enter confirm key. Note account will be erased from the database and will never be recovered.");
    if(sure === 'yeyemaster!') {
      $http({
        method  : "DELETE",
        data  : {userId: userId},
        url     : "/user/admin/delete-user", //gets special drugs from backend     
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(res) {  
        if(res.status){         
          $scope.userDetails = [{}];
          localManager.setValue("adminFoundUser",[{}]);        
          switch(res.type) {
            case 'Patient':
              var elemPos = $rootScope.listPatients.map(function(x){return x._id.toString()}).indexOf(userId);
              if(elemPos !== -1)
                $rootScope.listPatients.splice(elemPos,1)
            break;
            case 'Doctor':
              if(res.title == "SC") {
                var elemPos = $rootScope.listSpecialCenter.map(function(x){return x._id.toString()}).indexOf(userId);
                if(elemPos !== -1){                
                  $rootScope.listSpecialCenter.splice(elemPos,1)
                }
              } else {
                var elemPos = $rootScope.listDoctors.map(function(x){return x._id.toString()}).indexOf(userId);
                if(elemPos !== -1){
                  $rootScope.listDoctors.splice(elemPos,1)
                }
              }              
            break;
            case 'Pharmacy':
              var elemPos = $rootScope.listPharmacy.map(function(x){return x._id.toString()}).indexOf(userId);
              if(elemPos !== -1)
                $rootScope.listPharmacy.splice(elemPos,1)
            break;
            case 'Laboratory':
              var elemPos = $rootScope.listLaboratory.map(function(x){return x._id.toString()}).indexOf(userId);
              if(elemPos !== -1)
                $rootScope.listLaboratory.splice(elemPos,1)
            break;
            case 'Radiology':
              var elemPos = $rootScope.listRadiology.map(function(x){return x._id.toString()}).indexOf(userId);
              if(elemPos !== -1)
                $rootScope.listRadiology.splice(elemPos,1)
            break;
          }
        }
        
      });
    } else {
      alert("wrong confirmation key!");
    }
  }

}]);

app.controller("adminAnalyticManageCtrl",["$scope","$rootScope","$location","$http","ModalService",
  function($scope,$rootScope,$location,$http,ModalService){

    $http({
      method  : "GET",
      url     : "/user/admin/new-user-report", //gets special drugs from backend     
      headers : {'Content-Type': 'application/json'} 
    })
    .success(function(res) {  
      $rootScope.newUserToday = res.day;
      $rootScope.newUserWeek = res.week;
      $rootScope.newUserMonth = res.month;
    });

    $scope.date = new Date();

    $scope.viewDetails = function(data,when) {
      $rootScope.newUserDetails = {
        data:data,
        when: when
      };
      ModalService.showModal({
      templateUrl: 'admin-view-new-user.html',
      controller: "newUserDetailsModal"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
      });
    }

}]);

app.controller("newUserDetailsModal",["$scope","$rootScope",function($scope,$rootScope){
 
}]);

app.controller("adminManageCtrl",["$scope","$location","$rootScope","adminDoctorsService",
  function($scope,$location,$rootScope,adminDoctorsService){

    switch($location.path()) {
      case '/admin-doctors':
        $scope.name = "Doctors"
        $scope.isDoctorsView = true;
        $scope.list = $rootScope.listDoctors;
        break;
      case '/admin-patients': 
        $scope.name = "Patients";
        $scope.isPatientsView = true;
        $scope.list = $rootScope.listPatients;
        break;
      case '/admin-pharmacy':
        $scope.name = "Pharmacies";
        $scope.list = $rootScope.listPharmacy;
        break;
      case '/admin-laboratory': 
        $scope.name = "Laboratories";
        $scope.list = $rootScope.listLaboratory;
        break;
      case '/admin-radiology': 
        $scope.name = "Radiologies";
        $scope.list = $rootScope.listRadiology;
        break;
      case '/admin-special-center': 
        $scope.name = "Special Centers";
        $scope.list = $rootScope.listSpecialCenter;
        break;
      default:
         
        break;
    }

}]);


app.service("cashOutControllerService",["$resource",function($resource){
  return $resource("/user/cashout",null,{cashing:{method: "POST"},update:{method: "PUT"}});
}]);

app.controller('adminWithdrawalCtrl',["$scope","$location",function($scope,$location){
  //$rootscope.cashoutList is filled in adminController
  $scope.viewDetails = function(id) {
    $location.path('/admin-withdrawals-attend/' + id)
  }
}]);

app.controller('adminWithdrawalAttendCtrl',["$scope","$location","$rootScope","cashOutControllerService",
  function($scope,$location,$rootScope,cashOutControllerService){

  var path = $location.path();
  var arr = path.split('/');
  var reqId = (arr[arr.length - 1]) ? parseInt(arr[arr.length - 1]) : "";

  var elemPos = $rootScope.CashOutList.map(function(x){return x.id}).indexOf(reqId);
  if($rootScope.CashOutList[elemPos]) {
    $scope.request = $rootScope.CashOutList[elemPos];
  } else {
    $scope.request = {};
  }

  $scope.confirmPay = function(_id) {
    var sure = confirm("You want to confirm this transction and transfer was successfully done?");
    if(sure)
      cashOutControllerService.update({id: _id},function(res){      
        if(res.status) {
          $scope.resMsg = res.message;
          $scope.request = null;
          $rootScope.CashOutList.splice(elemPos,1)
        } else {
          alert(res.message)
        }
      })
  }
   
}]);


app.controller('adminSettledWithdrawalAttendCtrl',["$scope","$location",function($scope,$location){
 
}]);

app.service("commissionService",["$resource",function($resource){
  return $resource("/user/admin/commissions",null,{update:{method:"PUT"},create: {method: "POST"}});
}]);

app.controller('adminCommissionRequestCtrl',["$scope","commissionService",function($scope,commissionService){
  commissionService.get(function(data){
    $scope.response = data;
   
    $scope.docObj = [];
    $scope.pharmObj = [];
    $scope.labObj = [];
    $scope.radObj = [];
    $scope.courierObj = [];
    for(var i in data){
      if(data.hasOwnProperty(i)){
        if(i == "doctors") {
          var filter = {}
          data[i].forEach(function(item){
            if(item.city_grade)
              if(!filter[item.city]){
                filter[item.city] = {
                  type: i,
                  city: item.city,
                  discount: item.city_grade,
                  country: item.country
                } 
                $scope.docObj.push(filter[item.city])
              }
          })

          

        } else if( i == "pharmacies") {
          var filter = {}
          data[i].forEach(function(item){
            if(item.city_grade)
              if(!filter[item.city]){
                filter[item.city] = {
                  type: i,
                  city: item.city,
                  discount: item.city_grade,
                  country: item.country,
                } 
                $scope.pharmObj.push(filter[item.city])
              }

              if(item.courier_access) {
                filter[item.city] = {
                  type: i,
                  city: item.city,
                  discount: item.city_grade,
                  country: item.country,
                  courier_access: item.courier_access,
                  courier_commission: item.courier_commission,
                  courier_charge: item.courier_charge,
                  name: item.name,
                  id: item.user_id
                } 
                $scope.courierObj.push(filter[item.city])
              }
          })
        } else if( i == "laboratories") {
          var filter = {}
          data[i].forEach(function(item){
            if(item.city_grade)
              if(!filter[item.city]){
                filter[item.city] = {
                  type: i,
                  city: item.city,
                  discount: item.city_grade,
                  country: item.country
                } 
                $scope.labObj.push(filter[item.city])
              }
          })
        } else if( i == "radiologies") {
          var filter = {}
          data[i].forEach(function(item){
            if(item.city_grade)
              if(!filter[item.city]){
                filter[item.city] = {
                  type: i,
                  city: item.city,
                  discount: item.city_grade,
                  country: item.country
                } 
                $scope.radObj.push(filter[item.city])
              }
          })
        }
      }
    }
  });

  $scope.view = function(type){
    $scope.isDocView = false;
    $scope.isPharmView = false;
    $scope.isLabView = false;
    $scope.isRadioView = false;
    $scope.isCourierView = false;
    switch (type) {
      case "doc":
        $scope.selected = "Doctors discount by City";
        $scope.isDocView = true;
      break;
      case "pharm":
        $scope.selected = "Pharmacies discount by City";
        $scope.isPharmView = true;
      break;
      case "lab":
        $scope.selected = "Laboratories discount by City";
        $scope.isLabView = true;
      break;
      case "radio":
        $scope.selected = "Radiologies discount by City";
        $scope.isRadioView = true;
      break;
      case "courier":
        $scope.selected = "Courier Commissions by City";
        $scope.isCourierView = true;
      break;
    }
  }

}]);


app.service("adminConsultationService",["$resource",function($resource){
  return $resource('/user/admin/get-consultations');
}]);

app.service("adminScrollService",["$resource",function($resource){
  return $resource('/user/admin/scrolls');
}]);

app.controller('adminConsultationRequestCtrl',["$scope","$rootScope","adminConsultationService","ModalService",
  function($scope,$rootScope,adminConsultationService,ModalService){


  $scope.viewComplaint = function(complaint) {
    if(!$rootScope.access){
      var key = prompt("Enter access key");
      if(key == "cfcd") {
        $rootScope.complaint = complaint;
        $rootScope.access = key;
        ModalService.showModal({
          templateUrl: 'admin-view-complaint.html',
          controller: "adminComplaintModalCtrl"
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
          });
        });
      } else {
        alert("Wrong access key")
      }
    } else {
      $rootScope.complaint = complaint;
      ModalService.showModal({
        templateUrl: 'admin-view-complaint.html',
        controller: "adminComplaintModalCtrl"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {});
      });
    }
  }

  $scope.toAnother = function(user) {
    $rootScope.user = user;
    ModalService.showModal({
      templateUrl: 'admin-refer-another.html',
      controller: "adminReferToAnotherModalCtrl"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {});
    });
  }

  $scope.delConsultation = function(id){
    var sure = confirm("You want to delete this consultation?");
    if(sure)
      adminConsultationService.delete({id: id},function(res){
        var elemPos = $rootScope.consultations.map(function(x){return x._id}).indexOf(id);
        if(elemPos !== -1) {
          $rootScope.consultations.splice(elemPos,1); // one hour before can be redirected
        }
      })
  }


  $scope.lessThanOneHourAgo = function(date) {
    return moment(date).isAfter(moment().subtract(1, 'hours'));
  }

}]); 

app.controller("adminComplaintModalCtrl",function(){});

app.controller("adminReferToAnotherModalCtrl",["$scope","$rootScope","$http","cities","adminConsultationService",
function($scope,$rootScope,$http,cities,adminConsultationService){
  $scope.req = {
    city: $rootScope.user.doctor_city,
    specialty: $rootScope.user.doctor_specialty
  }
  
  function getDoctors() {
    $scope.loading = true;
    $http({
      method  : 'GET',
      url     : "/user/patient/find-doctor?city=" + $scope.req.city + "&specialty=" 
      + $scope.req.specialty + "&type=specialty",
      headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
      
      $scope.loading = false;
      $scope.result = data;
    });
  }

  $http({
    method  : 'GET',
    url     : "/user/get-specialties",
    headers : {'Content-Type': 'application/json'} 
  })
  .success(function(data) {
    
    $scope.specialties = data;
  });

  $scope.cities = cities;

  $scope.find = function() {
    getDoctors()
  }

  $scope.refer = function(user,doc) {
    user.newDoctor = doc.user_id;
    doc.loading = true;
    $http({
      method  : 'POST',
      url     : "/user/admin/redirect-consultation", 
      data    : user,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      doc.loading = false;
      if(data.status){
        doc.msg = data.message;
        adminConsultationService.query(function(data){
          $rootScope.consultations = data;
        })
      } else {
        alert("Referral failed!")
      }
    });
  }

  getDoctors()
}]);

app.controller('adminScrollCtrl',["$scope","$rootScope","adminScrollService","ModalService",
  function($scope,$rootScope,adminScrollService,ModalService){

  $scope.refresh = function() {
    adminScrollService.query(function(data){
      $rootScope.scrollList = data;
    })
  }

  $scope.viewDetails = function(courierId){
    $rootScope.courierId = courierId;
    ModalService.showModal({
      templateUrl: 'admin-view-courier.html',
      controller: "adminCourierModalCtrl"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
         
      });
    });
  }

  $scope.refund = function(request){
    //note this should refund the requester, delete the scroll, delete both reqester and center courier notifications
  }

}]); 

app.controller('adminPWRCtrl',["$scope","$rootScope","$location",
  function($scope,$rootScope,$location){
  $scope.refresh = function() {
    $rootScope.$broadcast("getPWR",true);
  }

  $scope.viewDetails = function(complaint) {
    $rootScope.complaint = complaint;
    $location.path('complaint-details');
  }
}]); 

app.controller('adminPWRDetailCtrl',["$scope","$rootScope","adminPWRService","ModalService",
  function($scope,$rootScope,adminPWRService,ModalService){

  $scope.del = function(id) {
    var check = confirm("You want to delete compalint?")
    if(check) {
      $scope.loading = true;
      adminPWRService.delete({id: id},function(res){
        $scope.loading = false;
        if(res.status) {
          alert(res.message);
          var elem = $rootScope.pwr.map(function(x){if(x) return x._id}).indexOf(id);
          if(elem !== -1) {
            $rootScope.pwr.splice(elem,1);
          }
        } else {
          alert(res.message)
        }
      })
    }
  }

  $scope.refer = function(complaint) {
    $rootScope.user = {
      message: complaint.description,
      files: complaint.files,
      patient_id: complaint.patient_id,
      id: + Math.floor(Math.random() * 9999999999),
      patient_city: complaint.patient_city,
      patient_name: complaint.name
    }
    console.log(complaint)
    ModalService.showModal({
      templateUrl: 'admin-refer-another.html',
      controller: "adminReferToAnotherModalCtrl"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {});
    });
  }

 
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
          var whole = Math.round(data.balance);
          var format = "NGN" + whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          $rootScope.balance = format;
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


//doctor's id is paased to this controller for ajax call;
app.controller("myDoctorController",["$scope","$location","$http","$window","$rootScope","templateService","$filter",'$compile',
  "localManager","ModalService","mySocket","$timeout","deviceCheckService",
  function($scope,$location,$http,$window,$rootScope,templateService,$filter,$compile,localManager,ModalService,mySocket,
    $timeout,deviceCheckService){
    
    var doctor = {};
    var savePath = $location.path(); //(localManager.getValue("currentPageForPatients")) ?
     //localManager.getValue("currentPageForPatients") : $location.path();
    var arr = savePath.split("/");  
    var userId = arr[arr.length-1];
    doctor.id = templateService.holdIdForSpecificDoc || userId;
    var user = localManager.getValue("resolveUser");

    $http({
      method  : 'PUT',
      url     : "/user/patient/specific-doctor",
      data    : doctor,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      $scope.docInfo = data || $rootScope.tempDoctor;
      if(data) {
        var holdData = {
          profilePic: $scope.docInfo.profile_pic_url,
          firstname: $scope.docInfo.firstname,
          lastname: $scope.docInfo.lastname,
          title: $scope.docInfo.title,
          presence: $scope.docInfo.presence,
          user_id: $scope.docInfo.user_id
        }
        //$rootScope.dispalyPresence = data.presence;
        localManager.setValue("doctorInfoforCommunication", holdData);
      }
    });


    var avail = localManager.getValue("availablility") || {id: doctor.id};
    $rootScope.dispalyPresence = avail.status;

    $scope.videoRequest = function(type,docObj){
      //$window.location.href = "/patient/call";
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

    /*$scope.chatRequest = function(type,docObj){
      //$window.location.href = "/patient/call";
      //Before a patient can communicate with his doctor a request for communication will be sent
      //if  the doctor grants such request the communication route will be established
      //docObj.type = type;
      //reqModal(docObj);
    }*/

    $scope.deleteChat = function(){
      var check = confirm("All chats will be deleted. Do you wish to continue?");
      if(check) {
        var chatId = user.user_id + "/" + doctor.id;
        var sendObj = {
          item: chatId,
          dest: "messages"
        }
        $http({
        method  : 'DELETE',
        url     : "/user/delete-all-chat",
        data    : sendObj,
        headers : {'Content-Type': 'application/json'} 
        })
        .success(function(data) {
          if(data === "deleted" && $rootScope.message1){
            $rootScope.message1.splice(0);
          }
        });
      }
    }


  /*** this initializes the web socket for chat the patient to start send and receiving messages from doctor ****/

  //$rootScope.message1 = [];
  
  
  $scope.user = {};

  /*if($rootScope.chatStatus !== true)
    mySocket.emit('join',{userId: user.user_id}); */

  mySocket.removeAllListeners("new_msg"); // incase if this listener is registered already
 

  $scope.getkeys = function (event) {
    if(!deviceCheckService.getDeviceType()) {
      if(event.keyCode === 13) {
        $scope.sendChat1();
        event.preventDefault();
      }
    } 
  }

  mySocket.on("isReceived",function(response){
    
    var elem = document.getElementById(response.id);
    elem.innerHTML = "";
    elem.innerHTML += " &nbsp;&nbsp;&nbsp;SEEN! ";
      //mySocket.emit("save message",msg);//this saves the message as double mark
    
  });
  
  $scope.sendChat1 = function(){ 
   if($scope.user.text1 !== "" && $scope.user.text1 !== undefined) {   
      $scope.user.isSent = true;
      mySocket.emit("send message",{to: doctor.id,message:$scope.user.text1,from: user.user_id},function(data){ 
        var date = + new Date();
        var msg = {};
        msg.time = data.date;
        msg.sent = data.message;
        msg.isSent = false;
        msg.isReceived = false;
        //$rootScope.message1.push(msg);      
        msg.userId = user.user_id;
        msg.partnerId = doctor.id; 
        msg.id = data.date//genId();

        chats(msg);
        
        mySocket.emit("isSent",msg,function(status){
          //var getIndex = $rootScope.message1.length - 1; //gets the index of the currently send text from the array
          //$rootScope.message1[getIndex].isSent = status;
          if(status) {
            var elem = document.getElementById(msg.id);
            elem.innerHTML += " &nbsp;&nbsp;&nbsp;sent!";
            //mySocket.emit("save message",msg);//this saves the message as double mark
          }
        });
        //mySocket.emit("save message",msg);//this saves the message as one mark
      });
      $scope.user.text1 = "";
    }
  }


  mySocket.emit('init chat',{userId: user.user_id,partnerId: doctor.id},function(data){
    //$rootScope.message1 = messages || [];    
    if(data.messages.length > 0) {
      for(var i = 0; i < data.messages.length; i++) {        
        chats(data.messages[i]);
      }
    } else {
      //send something to the doctor.
      $scope.user.text1 = "Hello doctor";
      $scope.sendChat1();      
    }
    
    
  });

 

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
    var base = angular.element(document.getElementById('base1')); 
    var container = angular.element(document.getElementById('sentmessage1'));      
    var item = angular.element(document.createElement('an-item'));
    var breaker = angular.element(document.createElement('div'));
    var p = angular.element(document.createElement('p'));
    var small = angular.element(document.createElement('small'));
    var fileElem;
    
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
          a[0].style.color = (data.sent) ? "#eee" : "yellow";
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
    small[0].style.display = "block";
    small[0].style.marginTop = "5px";
    small[0].style.color = "#ccc";
    if(!fileElem) {
      p[0].innerHTML += (data.sent) ? data.sent : data.received; 
    } else {
      p[0].innerHTML += data.fileType;
    }
   
   
    small[0].id = data.id;
    //var time = ($filter('amTimeAgo')(data.time) === 'a few seconds ago') ? 'Now' : $filter('amTimeAgo')(data.time);
    small[0].innerHTML += $filter('amCalendar')(data.time);
    //small[0].innerHTML += (data.sent) ? "&nbsp;&nbsp;" + $filter('amTimeAgo')(data.time) : "&nbsp;&nbsp;" + $filter('amTimeAgo')(data.time);     
    
    breaker[0].style.display = "block";
    breaker[0].style.textAlign = (data.sent) ? "right" : "left";
    
    item[0].appendChild(p[0]);

    if(fileElem)
      item[0].appendChild(fileElem[0]);

    
    item[0].appendChild(small[0]);


    breaker[0].appendChild(item[0]);
    
   
    item[0].style.display = "inline-block";
    item[0].style.maxWidth = (deviceCheckService.getDeviceType()) ? "90%" : "70%";
    item[0].className = (data.sent) ? "talk-bubble tri-right right-top talktext msg_sent bg-info" : "talk-bubble tri-right left-top talktext";
    item[0].style.whiteSpace = "pre-line";
    container[0].appendChild(breaker[0]);
    base[0].scrollTop = sentmessage1.scrollHeight;
  }




  //controls alert when doctor is currently in view of chat page
  var currChat = $location.path();
  var toArr = currChat.split("/");

  
  mySocket.on("new_msg", function(data) {
    var date = + new Date();
    var msg = {};
    msg.time = data.date;
    msg.received = data.message;
    msg.url = data.url;
    msg.fileType = data.fileType;
    msg.mimeType = data.mimeType;  
    if(data.from === doctor.id) {
      //$rootScope.message1.push(msg);
      msg.userId = user.user_id;
      msg.partnerId = doctor.id;
      msg.id = data.date;
      //mySocket.emit("save message",msg);
      if(toArr[1] !== "patient-doctor")        
        templateService.playAudio(2); // note all sounds can be turned of through settings.
      chats(msg)
    } else {
      
      if($location.path() !== "/general-chat") {
        $rootScope.$broadcast("unattendedMsg",true);   
        templateService.playAudio(2);  
      }
    }
    mySocket.emit("msg received",{to: data.from,id:data.date});
  });


  $scope.$watch("user.text1",function(newVal,oldVal){
    if(newVal !== "" && newVal !== undefined){      
      mySocket.emit("user typing",{to: doctor.id,message:"Typing..."});
    } else {
      mySocket.emit("user typing",{to: doctor.id,message:""});
    }
  });

  mySocket.on("typing", function(data) {
    $scope.typing = data.message;
  });

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
  //for single file upload
  $rootScope.imageFile = function() {
    if($scope.files.size <= 31457280) { // 30mb max size
    var file = $scope.files,
      fileReader = new FileReader(),
      slice = file.slice(0, 100000);

    fileReader.readAsArrayBuffer(slice); 
    img[file.name] = file.name;

      //incase listener is registered twice.
    var evt1 = "request slice upload " + file.name;
    var evt2 = "end upload " + file.name;
    var evt3 = "upload error " + file.name;


    mySocket.removeAllListeners(evt1);
    mySocket.removeAllListeners(evt2);
    mySocket.removeAllListeners(evt3);

    var base = angular.element(document.getElementById('base1')); 
    var container = angular.element(document.getElementById('sentmessage1'));      
    var item = angular.element(document.createElement('an-item'));
    var breaker = angular.element(document.createElement('div'));
    var p = angular.element(document.createElement('p'));
    var small = angular.element(document.createElement('small'));
    var span = angular.element(document.createElement('span'));

    breaker[0].style.display = "block";
    breaker[0].style.textAlign =  "right";
    p[0].style.display = "inline-block";

   // p[0].className = "fa fa-upload";
    p[0].innerHTML += file.name + "\n Uploading... ";
    
    item[0].appendChild(p[0]);

    item[0].appendChild(span[0]);
    
    item[0].appendChild(small[0]);

    breaker[0].id = file.name;


    breaker[0].appendChild(item[0]);


    item[0].style.display = "inline-block";
    item[0].style.maxWidth = (deviceCheckService.getDeviceType()) ? "90%" : "70%";
    item[0].className =  "talk-bubble tri-right right-top talktext msg_sent bg-info";
    item[0].style.whiteSpace = "pre-line";
    container[0].appendChild(breaker[0]);
  
    base[0].scrollTop = sentmessage1.scrollHeight;

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
      ele2.children[0].childNodes[1].innerHTML = "" + Math.round(fnProgress(place)) + "%";
      fileReader.readAsArrayBuffer(slice); 
    });


    var fnProgress = function(bytes) {
      var percentage = (bytes / file.size) * 100;
      return percentage;
    }

    

    mySocket.on(evt2,function(response){
      mySocket.emit("send message",{to: doctor.id,message:response.url,url:response.url, from: user.user_id,fileType: response.fileType,mimeType: response.mimeType},function(data){ 
        var date = + new Date();
        var msg = {};
        msg.time = data.date;
        msg.sent = (response.fileType) ? response.fileType : data.message;
        msg.isSent = false;
        msg.isReceived = false;
        //$rootScope.message1.push(msg);      
        msg.userId = user.user_id;
        msg.partnerId = doctor.id; 
        msg.id = data.date;//genId();
        msg.url = response.url;
        msg.fileType = response.fileType;
        msg.mimeType = response.mimeType;


        /* var elPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf($scope.partner.partnerId);
        if(elPos !== -1) {
          $rootScope.chatsList[elPos].is_read = true;
          $rootScope.chatsList[elPos].messages.push(msg);
        }*/

        chats(msg);
        var ele = document.getElementById(img[file.name]);
        ele.style.display = "none";
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
      var ele = document.getElementById(img[file.name]);
      ele.style.display = "none";
      delete img[file.name];
      alert("Error occured while uploading " + file.name);
    })

    } else {
      alert("File size out of range. Max size should be less than 30mb");
    }

  }
 
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

//similar the mydoctorController
app.controller("myPatientController",["$scope","$http","$location","$window","$rootScope","templateService","localManager","$filter",
  "ModalService","Drugs","mySocket","$resource","deviceCheckService","myPatientControllerService","outPatientBillingService",
  "getPatientMedicationByDoctorService","getMedicalHistoryService","drugNotRanService","getAllPharmacyService","getSessionService",'$compile',
  function($scope,$http,$location,$window,$rootScope,templateService,localManager,$filter,ModalService,
    Drugs,mySocket,$resource,deviceCheckService,myPatientControllerService,outPatientBillingService,
    getPatientMedicationByDoctorService,getMedicalHistoryService,drugNotRanService,getAllPharmacyService,getSessionService,$compile){

  var patient = {}; //patient obj.
  
  /*
  * the doctor refreshing the dashboard page will still keep the patient on the current view template
  * so the data to populate the template will be generate through ajax call.
  * @localManager.getValue this gets the current url of the current view template from the local storage of the browser.
  * @writePrescription,@viewMedicalHistory,@writeNew all controls the html element on the template
  */ 

  var path = localManager.getValue("currentPage") || $location.path();
  var arr = path.split("/");  
  var userId = arr[arr.length-1];

  
  
  
  var sessionId = genId(); //parseInt(Math.floor(Math.random() * 9999999) + "" + Math.floor(Math.random() * 999999));
  patient.id = templateService.holdIdForSpecificPatient || userId;
  $rootScope.holdId =  patient.id;
  var user = localManager.getValue("resolveUser");

  var avail = localManager.getValue("availablility") || {id : patient.id};
  $rootScope.patientAvailability  = avail.status;

  $scope.frequencies = ["OD","BD","TDS","QDS"];
  $scope.durations = ["1 day","2 days","3 days", "5 days","6 days", "7 days","1 week", "2 weeks", "3 weeks", "1 month", "2 months","3 months","4 months","6 months"]

  var getPatientData = myPatientControllerService //$resource("/user/doctor/specific-patient");
  getPatientData.get(patient,function(data){  
    $scope.patientInfo = data; 
    $rootScope.patientInfo = data;     
    //patient.prescriptionId = random;
    patient.patient_id = patient.id;    
    patient.firstname = $scope.patientInfo.firstname;
    patient.lastname = $scope.patientInfo.lastname;
    patient.gender = $scope.patientInfo.gender;
    patient.phone = $scope.patientInfo.phone;
    patient.age = $scope.patientInfo.age;
    patient.address = $scope.patientInfo.address;
    patient.city = $scope.patientInfo.city;
    patient.country = $scope.patientInfo.country;
    patient.patient_profile_pic_url = $scope.patientInfo.profile_pic_url;
    patient.lab_analysis = $scope.patientInfo.lab_analysis;
    patient.scan_analysis = $scope.patientInfo.scan_analysis;
    patient.provisional_diagnosis = $scope.patientInfo.provisional_diagnosis;
    patient.title = $scope.patientInfo.title;
    patient.sender = "doctor";
    var holdData = {
      profilePic: data.profile_pic_url,
      firstname: data.firstname,
      lastname: data.lastname
    }
    templateService.holdForSpecificPatient = $scope.patientInfo;
    localManager.setValue("patientInfoForCommunication", holdData);    
  })


   
///////////////////////////////////////////////////// for chat logic and sockets

  $scope.user = {};

  
  $scope.deleteChat = function(){
    var check = confirm("All chats will be deleted. Do you wish to continue?");
    if(check) {
      var chatId = user.user_id + "/" + patient.id;
      var sendObj = {
        item: chatId,
        dest: "messages"
      }
      $http({
      method  : 'DELETE',
      url     : "/user/delete-all-chat",
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data) {
        if(data === "deleted" && $rootScope.message1){
          $rootScope.message1.splice(0);
        }
      });
    }
  }

  /*** this initializes the web socket for chat the patient to start send and receiving messages from doctor ****/

  //$rootScope.message1 = [];
  // checks to see if a user is already in chat

 /* if($rootScope.chatStatus !== true)
    mySocket.emit('join',{userId: user.user_id}); */
  
  function initChat() {
    mySocket.emit('init chat',{userId: user.user_id,partnerId: patient.id},function(data){
      //$rootScope.message1 = messages || [];
      for(var i = 0; i < data.messages.length; i++) {        
          chats(data.messages[i])
      }
    });
  }

  mySocket.removeAllListeners("new_msg"); // incase if this listener is registered already

  initChat()

  $scope.getkeys = function (event) {
    //$scope.keyval = event.keyCode;
  if(!deviceCheckService.getDeviceType())
    if(event.keyCode === 13) {
      $scope.sendChat2();
      event.preventDefault();
    }
    
  }

 
  mySocket.on("isReceived",function(response){
    var elem = document.getElementById(response.id);
    elem.innerHTML = "";
    elem.innerHTML += " &nbsp;&nbsp;&nbsp;SEEN! ";
    //mySocket.emit("save message",msg);//this saves the message as double mark
  });

  $scope.sendChat2 = function(){    
    if($scope.user.text2 !== "" && $scope.user.text2 !== undefined) {   
        $scope.user.isSent = true;
        mySocket.emit("send message",{to: patient.id,message:$scope.user.text2,from: user.user_id},function(data){ 
        var date = + new Date();
        var msg = {};
        msg.time = data.date;
        msg.sent = data.message;
        msg.isSent = false;
        msg.isReceived = false;
        //$rootScope.message1.push(msg);      
        msg.userId = user.user_id;
        msg.partnerId = patient.id;
        msg.id = data.date

        chats(msg);       

        mySocket.emit("isSent",msg,function(status){
          //var getIndex = $rootScope.message1.length - 1; //gets the index of the currently send text from the array
          //$rootScope.message1[getIndex].isSent = status;
          if(status) {
            var elem = document.getElementById(msg.id);
            elem.innerHTML += " &nbsp;&nbsp;&nbsp;sent! ";
            //mySocket.emit("save message",msg);//this saves the message as double mark
          }
        });
        //mySocket.emit("save message",msg);        
      });
      $scope.user.text2 = "";
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
    var base = angular.element(document.getElementById('base1')); 
    var container = angular.element(document.getElementById('sentmessage1'));      
    var item = angular.element(document.createElement('an-item'));
    var breaker = angular.element(document.createElement('div'));
    var p = angular.element(document.createElement('p'));
    var small = angular.element(document.createElement('small'));
    var fileElem;
    switch(data.fileType){
      case 'image':        
        fileElem = angular.element(document.createElement('img'));
        fileElem[0].src = data.url;
        fileElem[0].alt = "loading image...";
        fileElem[0].style.maxWidth = "280px";
        fileElem[0].style.height = "220px";
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
          a[0].style.color = (data.sent) ? "#eee" : "yellow";
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
    small[0].style.display = "block";
    small[0].style.marginTop = "5px";
    small[0].style.color = "#ccc";
    if(!fileElem) {
      p[0].innerHTML += (data.sent) ? data.sent : data.received; 
    } else {
      p[0].innerHTML += data.fileType;
    }
   
   
    small[0].id = data.id;
    //var time = ($filter('amTimeAgo')(data.time) === 'a few seconds ago') ? 'Now' : $filter('amTimeAgo')(data.time);
    small[0].innerHTML += $filter('amCalendar')(data.time);
    //small[0].innerHTML += (data.sent) ? "&nbsp;&nbsp;" + $filter('amTimeAgo')(data.time) : "&nbsp;&nbsp;" + $filter('amTimeAgo')(data.time);     
    
    breaker[0].style.display = "block";
    breaker[0].style.textAlign = (data.sent) ? "right" : "left";
    
    item[0].appendChild(p[0]);

    if(fileElem)
      item[0].appendChild(fileElem[0]);

    
    item[0].appendChild(small[0]);


    breaker[0].appendChild(item[0]);
    
   
    item[0].style.display = "inline-block";
    item[0].style.maxWidth = (deviceCheckService.getDeviceType()) ? "90%" : "70%";
    item[0].className = (data.sent) ? "talk-bubble tri-right right-top talktext msg_sent bg-info" : "talk-bubble tri-right left-top talktext";
    item[0].style.whiteSpace = "pre-line";
    container[0].appendChild(breaker[0]);
    base[0].scrollTop = sentmessage1.scrollHeight;
  }


  //alert when doctor is not view active chat div
  var currChat = $location.path();
  var toArr = currChat.split("/");
  var elPos;

  mySocket.on("new_msg", function(data) {
    var date = + new Date();
    var msg = {};
    msg.time = data.date;
    msg.received = data.message;
    msg.url = data.url;
    msg.fileType = data.fileType;
    msg.mimeType = data.mimeType;  
    if(data.from === patient.id) {
      //$rootScope.message1.push(msg);
      msg.userId = user.user_id;
      msg.partnerId = patient.id;
      msg.id = data.date;//genId();
      //msg.url = response.url;
      //msg.fileType = response.fileType;
      //msg.mimeType = response.mimeType;
      //mySocket.emit("save message",msg);
      //templateService.playAudio(3);
      if(toArr[1] !== 'doctor-patient'){
        templateService.playAudio(2);
      }
      chats(msg)
    } else {
      
      if($location.path() !== "/general-chat") {
        $rootScope.$broadcast("unattendedMsg",true);    
        templateService.playAudio(2); 
      }
      //then push the message to the list of patients so that user can view later.
    }
    mySocket.emit("msg received",{to: data.from,id:data.date});

  });


  $scope.$watch("user.text2",function(newVal,oldVal){
    if(newVal !== "" && newVal !== undefined){      
      mySocket.emit("user typing",{to: patient.id,message:"Typing..."})
    } else {
      mySocket.emit("user typing",{to: patient.id,message:""})
    }
  });

  mySocket.on("typing", function(data) {
    $scope.typing = data.message;
  });


  var img = {};
  var progress = {};
  //for single file upload
  $rootScope.imageFile = function() {
    if($scope.files.size <= 31457280) { // 30mb max size
    var file = $scope.files,
      fileReader = new FileReader(),
      slice = file.slice(0, 100000);

    fileReader.readAsArrayBuffer(slice); 
    img[file.name] = file.name;

      //incase listener is registered twice.
    var evt1 = "request slice upload " + file.name;
    var evt2 = "end upload " + file.name;
    var evt3 = "upload error " + file.name;


    mySocket.removeAllListeners(evt1);
    mySocket.removeAllListeners(evt2);
    mySocket.removeAllListeners(evt3);

    var base = angular.element(document.getElementById('base1')); 
    var container = angular.element(document.getElementById('sentmessage1'));      
    var item = angular.element(document.createElement('an-item'));
    var breaker = angular.element(document.createElement('div'));
    var p = angular.element(document.createElement('p'));
    var small = angular.element(document.createElement('small'));
    var span = angular.element(document.createElement('span'));

    breaker[0].style.display = "block";
    breaker[0].style.textAlign =  "right";
    p[0].style.display = "inline-block";

   // p[0].className = "fa fa-upload";
    p[0].innerHTML += file.name + "\n Uploading... ";
    
    item[0].appendChild(p[0]);

    item[0].appendChild(span[0]);
    
    item[0].appendChild(small[0]);

    breaker[0].id = file.name;


    breaker[0].appendChild(item[0]);


    item[0].style.display = "inline-block";
    item[0].style.maxWidth = (deviceCheckService.getDeviceType()) ? "90%" : "70%";
    item[0].className =  "talk-bubble tri-right right-top talktext msg_sent bg-info";
    item[0].style.whiteSpace = "pre-line";
    container[0].appendChild(breaker[0]);
  
    base[0].scrollTop = sentmessage1.scrollHeight;

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
      ele2.children[0].childNodes[1].innerHTML = "" + Math.round(fnProgress(place)) + "%";
      fileReader.readAsArrayBuffer(slice); 
    });


    var fnProgress = function(bytes) {
      var percentage = (bytes / file.size) * 100;
      return percentage;
    }

    

    mySocket.on(evt2,function(response){
      mySocket.emit("send message",{to: patient.id,message:response.url,url:response.url, from: user.user_id,fileType: response.fileType,mimeType: response.mimeType},function(data){ 
        var date = + new Date();
        var msg = {};
        msg.time = data.date;
        msg.sent = (response.fileType) ? response.fileType : data.message;
        msg.isSent = false;
        msg.isReceived = false;
        //$rootScope.message1.push(msg);      
        msg.userId = user.user_id;
        msg.partnerId = patient.id; 
        msg.id = data.date;//genId();
        msg.url = response.url;
        msg.fileType = response.fileType;
        msg.mimeType = response.mimeType;


        /* var elPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf($scope.partner.partnerId);
        if(elPos !== -1) {
          $rootScope.chatsList[elPos].is_read = true;
          $rootScope.chatsList[elPos].messages.push(msg);
        }*/

        chats(msg);
        var ele = document.getElementById(img[file.name]);
        ele.style.display = "none";
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
      var ele = document.getElementById(img[file.name]);
      ele.style.display = "none";
      delete img[file.name];
      alert("Error occured while uploading " + file.name);
    })

    } else {
      alert("File size out of range. Max size should be less than 30mb");
    }

  }

////////////////////

  var viewed = false;

  $scope.videoRequest = function(type,patientObj){
    //$window.location.href = "/patient/call";
    patientObj.type = type;
    reqModal(patientObj);
  }

  $scope.audioRequest = function(type,patientObj){
    //$window.location.href = "/user/patient/call";
    patientObj.type = type;
    reqModal(patientObj);
  }

  $scope.writePrescription =function(){     
    $scope.isToPrescribe = true;
    $scope.isToSeeRecord = false;
    $scope.isToViewLabPrescriptionReq = false;
    $scope.isToViewRadPrescriptionReq = false;
    $scope.isToViewSession = false;
    $scope.isChat = false;
    $scope.isSearchToSend = false; 
    $scope.isToViewSession = false;  
    $scope.isTreatmentSession = false;   
    $scope.isOutPatientBilling = false;
     $scope.isToLabReport = false;
      $scope.isToRadioReport = false
  }

  $scope.appointment = function(patientObj){
    templateService.holdId = patientObj.user_id; 
    //sets id of the patient for the appointmentModal controller to use.
    //make sure templateSevice is always iniatialize elsewhere.
    ModalService.showModal({
        templateUrl: 'calender-template.html',
        controller: 'appointmentModalController'
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {             
        });
    });
  
  }


  //out patient billing logic

  $scope.outPatientBilling = function() {
    $scope.isToPrescribe = false;
    $scope.isToSeeRecord = false;
    $scope.isToViewLabPrescriptionReq = false;
    $scope.isToViewRadPrescriptionReq = false;
    $scope.isToViewSession = false;
    $scope.isChat = false;
    $scope.isSearchToSend = false; 
    $scope.isToViewSession = false;  
    $scope.isTreatmentSession = false;   

    $scope.isOutPatientBilling = true;
    $scope.inMainBill = true;
    $scope.isPreviewBill = false;
     $scope.isToLabReport = false;
      $scope.isToRadioReport = false
  }

  $scope.billList = [];
  $scope.billList.push({sn: $scope.billList.length + 1});

  $scope.addBill = function() {
    $scope.billList.push({
      sn: $scope.billList.length + 1
    })
  }

  var billPos;
  var countBill;
  $scope.removeBill = function(sn) {
    billPos = $scope.billList.map(function(x){return x.sn}).indexOf(sn);
    if(billPos != -1) {
      $scope.billList.splice(billPos,1);
      countBill = 1;
      for(var i = 0; i < $scope.billList.length; i++) {
        if(i === 0) {
          $scope.billList[i].sn = countBill;
        } else {
          $scope.billList[i].sn = countBill;
        }
        countBill++;
      }
    }
  }

  $scope.mainBill = function() {
    $scope.inMainBill = true;
    $scope.isPreviewBill = false
  }

  $scope.previewBill = function() {
    $scope.inMainBill = false;
    $scope.isPreviewBill = true

    $scope.totalBilled = 0;

    for(var j = 0; j < $scope.billList.length; j++) {   
      if($scope.billList[j].cost)  
        $scope.totalBilled += $scope.billList[j].cost;
    }
  }

  $scope.sendBill = function() {
    $scope.loading = true;
    outPatientBillingService.createBill({
      patientNames: $scope.patientInfo.firstname + " " + $scope.patientInfo.lastname,
      patientId: patient.id,
      billList: $scope.billList,
      total: $scope.totalBilled
    },function(res){
      $scope.loading = false;
      if(res.status) {
        $scope.isSent = res.status;
      } else {
        alert("Oops,bill not sent! Please try again.");
      }
     
    })
  }


  //doctor can view prvious prescriptions written by him for this patient
  $scope.viewPreviousPrescriptionByDoctor = function(){         
    if(!viewed) {
      getPatientMedicationByDoctor("/user/get-medical-record");
      $scope.isToViewOldPrescription = true;
      viewed = true;
    } else {        
      $scope.isToViewOldPrescription = false;
      viewed = false;
    }
  }

  $scope.viewMedicalHistory = function(){
    $scope.isToSeeRecord = true;
    $scope.isToPrescribe = false;
    $scope.isToViewLabPrescriptionReq = false;
    $scope.isToViewRadPrescriptionReq = false;
    $scope.isToViewSession = false;
    $scope.isChat = false;
    $scope.isSearchToSend = false; 
    $scope.isToViewSession = false;     
    $scope.isTreatmentSession = false;
    $scope.isOutPatientBilling = false;
     $scope.isToLabReport = false;
      $scope.isToRadioReport = false
    if(!$scope.medicalRecordHistory)
      getMedicalHistory("/user/get-medical-record");
    
  }

  $scope.writeNew = function(){
    if(!viewed) {
      $scope.isNewPrescription = true;
      viewed = true;
    } else {
      $scope.isNewPrescription = false;
      viewed = false;
    }
  }

  $scope.viewDiagnosis = function(){         
    $scope.isDiagnosis = true;
    $scope.isPharmacy = false;
    $scope.isLaboratory = false;
    $scope.isRadiology = false; 
  }

  $scope.viewPreviousPrescriptions = function(){ 
    $scope.isDiagnosis = false;
    $scope.isPharmacy = true;
    $scope.isLaboratory = false;
    $scope.isRadiology = false;        
    $scope.prescriptionList = $scope.medicalRecordHistory.prescriptions;
  }

  $scope.viewPreviousRadiology = function(){        
    //$scope.isToViewOldPrescription = true;
    $scope.isDiagnosis = false;
    $scope.isPharmacy = false;
    $scope.isLaboratory = false;
    $scope.isRadiology = true;    
    $scope.radiologyTests = $scope.medicalRecordHistory.medical_records.radiology_test;
  }

  $scope.viewPreviousLaboratory = function(){        
    //$scope.isToViewOldPrescription = true;
    $scope.isDiagnosis = false;
    $scope.isPharmacy = false;
    $scope.isLaboratory = true;
    $scope.isRadiology = false;    
    $scope.laboratoryTests = $scope.medicalRecordHistory.medical_records.laboratory_test;
    console.log($scope.laboratoryTests)
  }

   

  var getPatientMedicationByDoctor = function(url){
      if(!$scope.medicalRecordHistory) {
        var getMedication = getPatientMedicationByDoctorService //$resource(url);
        var sendObj = {patientId:patient.id}
        getMedication.get(sendObj,function(data){
          var myFoundPrescriptions = [];
          
          for(var i = data.prescriptions.length-1; i >= 0; i--){
            if(data.prescriptions[i].doctor_id === $rootScope.checkLogIn.user_id) {
              myFoundPrescriptions.push(data.prescriptions[i]);
              $scope.wroteByThisDoctor = myFoundPrescriptions;
            }
          }
         
        });
      } else {
        var prescriptions = $scope.medicalRecordHistory.prescriptions;
        var myFoundPrescriptions = [];
        for(var i = prescriptions.length-1; i >= 0; i--){
          if(prescriptions[i].doctor_id === templateService.getid) {
            myFoundPrescriptions.push(prescriptions[i]);
            $scope.wroteByThisDoctor = myFoundPrescriptions;
          }
        }
      }
      
    }

    $scope.access = {};

    $scope.getPermission = function() {
      if($scope.successMsg) 
        $scope.message = "";

      if($scope.failureMsg)
        $scope.failureMsg = "";

      if(!$scope.access.key){
        alert("Please enter patient MRA key");
        return;
      }

      $scope.loading = true;
      var sendObj = {
        key: $scope.access.key,
        patientId: patient.id
      }

      $http.put("/user/record-permission",sendObj)
      .success(function(response){
        $scope.loading = false;
        if(response.status){         
          $scope.successMsg = "Access Granted!!!";
          //$scope.medicalRecordHistory.status = true;
          getMedicalHistory("/user/get-medical-record");
        } else {
          $scope.failureMsg = response.message;
        }
      })
      .error(function(err){
        console.log(err)
      })
    }

    

    //doctor views patient medical records. 
    var getMedicalHistory = function(url) {
      var getMedication = getMedicalHistoryService //$resource(url);
      var sendObj = {patientId:patient.id}
      getMedication.get(sendObj,function(data){ 
        
        $scope.medicalRecordHistory = data;
      });
    }

    //creates drug object for the ng-repeat on the view.
    $scope.drugs = Drugs;
    
    var count = {}; 
    var drug = {};     
    count.num = 1;
    drug.sn = count.num;
   
    $scope.drugList = [drug];
  

    /*$scope.getDrug = function(drugName){
      drug_name = drugName;
      if($scope.drugList.length === 1)
        $scope.drugList[0].drug_name = drugName;
      if( $scope.drugList.length > 1)
        $scope.drugList[pos.index].drug_name = drugName;
    }*/

    
     // this populates the array for the view ng-repeat. this is the prescription body as the doctor writes it.

    $scope.addDrug = function(){  
      var newDrug = {};         
      count.num++;
      newDrug.sn = count.num;
      $scope.drugList.push(newDrug);    
    }

    $scope.removeDrug = function(){
      if(count.num > 1){
        $scope.drugList.pop();
        count.num--;
      }
    }
    var finalBody;

   
    /*$scope.$watch("drugList",function(newVal,oldVal){
      if(oldVal){
        patient.prescriptionBody = newVal;
      }
      // adds prescription body to the prescription object as the doctor 
    //prepares to send it to the back end.
    },true) */   


    $http({
      method  : "GET",
      url     : "/user/getDrugs", //gets special drugs from backend     
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(response) {   
      $scope.drugs = Drugs.concat(response);
    });

    templateService.holdPrescriptionToBeForwarded = patient;

    

    $scope.toPatient = function(){
      //doctor creates the prescription object and sends it the the back end. url is "patient/forwarded-prescription", other informations that
      //comes with the prescription object added to the prescription object in the backend.

      var isWritten = chechIfPrescription($scope.drugList)

      if(!isWritten) {
        alert("Please complete all prescription fields");
        return false;
      }

      var random =parseInt(Math.floor(Math.random() * 99999) + "" + Math.floor(Math.random() * 999999));
      patient.provisional_diagnosis = $scope.treatment.provisionalDiagnosis;
      patient.prescriptionBody = $scope.drugList;
      patient.prescriptionId = random;
      
     

      $scope.loading = true;
      $http({
        method  : 'PUT',
        url     : "/user/patient/forwarded-prescription",
        data    : patient,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {   
        $scope.loading = false;   
        alert(data.message);
      });
      
    }

    $scope.toPharmacy = function(){
    //doctor creates a prescription object like above but saves it to a service called holdPrescriptionToBeForwarded. which will later be forwarded
    //to the backend after the doctor have searched and found the phamarcy to forward the prescription to. 
      var isWritten = chechIfPrescription($scope.drugList)

      if(!isWritten) {
        alert("Please complete all prescription fields");
        return false;
      }

      

      var random = parseInt(Math.floor(Math.random() * 99999) + "" + Math.floor(Math.random() * 999999));
      patient.provisional_diagnosis = $scope.treatment.provisionalDiagnosis;
      patient.prescriptionBody = $scope.drugList;
      patient.prescriptionId = random;

      $scope.isToPrescribe = false;
      $scope.isSearchToSend = true; 
      $scope.isToViewSession = false;
      $scope.treatment.city = patient.city;
      $scope.treatment.country = patient.country; 
      getPharmacy() 
      //$location.path("/search/pharmacy");
    }

    $scope.treatment = {};
    
    chechIfPrescription = function(data) {
      if(!data)
        data = [];
       
      for(var i = 0; i < data.length; i++) {
        if(!data[i].drug_name || !data[i].dosage ||!data[i].frequency || !data[i].duration) {
          return false;
        } 
      }

      return true;
    }

    $scope.goBack = function() {
      $scope.isToPrescribe = true;
      $scope.isSearchToSend = false;   
    }

    $scope.changeOption = function() {
      getPharmacy()
    }


    $scope.pickedCenter = null;



   

    $scope.selected = function(center) {
      $scope.pickedCenter = center;
      if($scope.message) 
        $scope.message = null;

      var source = drugNotRanService; //$resource("/user/pharmacy/not-ran-services")
      source.query({centerId: center.user_id},function(data) { 
        if(data.error){
          $scope.status = "Not Updated!";
          return;
        }

        $scope.status = "Updated!";
        var elemPos;
        for(var i = 0; i < $scope.drugList.length; i++) {
          $scope.drugList[i].available = true;
          elemPos = data.map(function(x){return x.name}).indexOf($scope.drugList[i].drug_name)
          if(elemPos !== -1) {
            $scope.drugList[i].available = false;
          }
        }

        patient.user_id = center.user_id // id is the id of the pharmacy
      })
    }

    function getPharmacy() {
       $scope.isLoading = true;
      var source = getAllPharmacyService; // $resource("/user/patient/getAllPharmacy")
      source.query({city:$scope.treatment.city,country:$scope.treatment.country},function(list){
        $scope.isLoading = false;
        $scope.searchResult = list;
      })
    }

   

    $scope.sendDrug = function() {
      $scope.loading = true;
      patient.treatment = $scope.treatment;
      $http({
        method  : 'PUT',
        url     : "/user/patient/pharmacy/referral",
        data    : patient,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        $scope.loading = false;
        if(data.success)   
          $scope.message = "Prescription sent !!!" ;     
      });
    }

    //other activities
    $scope.viewSession = function () {     
      loadSession();
      $scope.isToSeeRecord = false;
      $scope.isToPrescribe = false;
      $scope.isToViewLabPrescriptionReq = false;
      $scope.isToViewRadPrescriptionReq = false;
      $scope.isToViewSession = true;
      $scope.isSearchToSend = false; 
      $scope.isChat = false;
      $scope.isTreatmentSession = false;
      $scope.isOutPatientBilling = false;
       $scope.isToLabReport = false;
      $scope.isToRadioReport = false
    }

    $scope.viewTreatmentSession = function (session) {
      localManager.setValue("heldSessionData",session);        
      //$window.location.href = "/user/treatment";
      $scope.isToViewSession = false;
      $scope.isTreatmentSession = true;
    }

    $scope.loadMore = function (){
      loadSession();
    }

    $scope.newSession = function () {

    }

    $scope.createNewSession = function(){
      ModalService.showModal({
          templateUrl: 'quickFillComplaint.html',
          controller: "fromModalSessionController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
          });
      });
    }

  $scope.getInitialComplaint = function() {
    ModalService.showModal({
        templateUrl: 'quickViewInitialComplaint.html',
        controller: "fromModalSessionController"
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result){});
    });
  }

  $scope.viewLabPrescriptionRequest = function () {
    $scope.isToSeeRecord = false;
    $scope.isToPrescribe = false;
    $scope.isToViewLabPrescriptionReq = true;
    $scope.isToViewRadPrescriptionReq = false;
    $scope.isToViewSession = false; 
    $scope.isChat = false;
    $scope.isSearchToSend = false; 
    $scope.isToViewSession = false;  
    $scope.isTreatmentSession = false;  
    $scope.isOutPatientBilling = false; 
     $scope.isToLabReport = false;
    $scope.isToRadioReport = false
  }

  $scope.viewLabReport = function () {
    $scope.isToSeeRecord = false;
    $scope.isToPrescribe = false;
    $scope.isToViewLabPrescriptionReq = false;
    $scope.isToViewRadPrescriptionReq = false;
    $scope.isToViewSession = false; 
    $scope.isChat = false;
    $scope.isSearchToSend = false; 
    $scope.isToViewSession = false;  
    $scope.isTreatmentSession = false;  
    $scope.isOutPatientBilling = false; 
    $scope.isToRadioReport = false;
    $scope.isToLabReport = true;
    investigation("/user/doctor/get-test-result");    
  }

  $scope.viewRadioReport = function () {
    $scope.isToSeeRecord = false;
    $scope.isToPrescribe = false;
    $scope.isToViewLabPrescriptionReq = false;
    $scope.isToViewRadPrescriptionReq = false;
    $scope.isToViewSession = false; 
    $scope.isChat = false;
    $scope.isSearchToSend = false; 
    $scope.isToViewSession = false;  
    $scope.isTreatmentSession = false;  
    $scope.isOutPatientBilling = false; 
    $scope.isToLabReport = false;
    $scope.isToRadioReport = true;
    investigation("/user/doctor/get-scan-result");
  }


  $scope.viewRadioPrescriptionRequest = function () {
    $scope.isToSeeRecord = false;
    $scope.isToPrescribe = false;
    $scope.isToViewLabPrescriptionReq = false;
    $scope.isToViewRadPrescriptionReq = true;
    $scope.isToViewSession = false;
    $scope.isChat = false;
    $scope.isSearchToSend = false; 
    $scope.isToViewSession = false;
    $scope.isTreatmentSession = false; 
    $scope.isOutPatientBilling = false;
    $scope.isToLabReport = false;
    $scope.isToRadioReport = false;    
  }

  var sessionList = [];


  function investigation(url)  {
    var sendObj = {
      patientId: patient.id
    }
    $scope.loading = true;
    $scope.isResults = true;
    $http({
      method  : 'PUT',
      url     : url,
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {        
      console.log(data)   
      $scope.loading = false;         
      $scope.testResult = data;
    });            
  }


  function loadSession() {
    $scope.loading = true;
    var getSession = getSessionService;//$resource("/user/doctor/get-patient-sessions");
    var sendObj = {patient_id:patient.id}
    getSession.query(sendObj,function(data){
      $scope.loading = false; 
      //$rootScope.recentSession = data[0];
      $rootScope.sessionData = data;
      if(data.length > 0)
        templateService.holdId = data[0].patient_id;
    })
    
  }


  $scope.requestNewLab = function() {
    if(!$scope.isNewLab) {
      $scope.isResults = false;
      $scope.isNewLab = true;
      $rootScope.flag = 'lab';
    } else {      
      $scope.isNewLab = false;
      $scope.viewLabReport()
    }
  }

  $scope.requestNewRadio = function() {
    if(!$scope.isNewRadio) {
      $scope.isResults = false;
      $scope.isNewRadio = true;
      $rootScope.flag = undefined;
    } else {      
      $scope.isNewRadio = false;
      $scope.viewRadioReport();
    }
  }


  //this filters the prescriptionb reequest based 0on the type of request whether lab test or radio test ia accompanied with the request
    templateService.labPrescriptionReq = [];
    templateService.radioPrescriptionReq = [];
    
    var theReqList = templateService.holdPrescriptionRequestData || localManager.getValue("prescriptionRequestData");
    var index = 0;
    //this will check to make sure n two thsame request is addedto the list.
   
    for(var i = 0; i < theReqList.length; i++){
      if(patient.id === theReqList[i].sender_id) {
       
        if(i > 0) {
          var getId = theReqList[index].ref_id;
          index++;
        }   
       

        switch(theReqList[i].type_of_test) {
          case "laboratory":
            if(theReqList[i].ref_id !== getId)
              templateService.labPrescriptionReq.push(theReqList[i]);
          break;
          case "radiology":
            if(theReqList[i].ref_id !== getId)
              templateService.radioPrescriptionReq.push(theReqList[i]);
          break;
          default:
          break;
        }
      }
    }

    $scope.labPrescriptionReq = templateService.labPrescriptionReq;
    $scope.radioPrescriptionReq = templateService.radioPrescriptionReq;

    var labLen = $scope.labPrescriptionReq.length;
    var radioLen = $scope.radioPrescriptionReq.length;

    $scope.labLen = labLen;
    $scope.radioLen = radioLen;

    //templateService.holdlabLenOfPrescriptionRequest = $scope.labLen;
    //templateService.holdRadioLenOfPrescriptionRequest = $scope.radioLen;

    //for radio prescription request. Accompanied files can be viewed i.e x-ray files.
    $scope.viewFile = function(fileArr,resultList){
      var dataObj = {};
      dataObj.report = resultList;
      dataObj.imagery = fileArr;
      templateService.holdScanImageList = dataObj; //hold the list of urls for the x-ray files.
      ModalService.showModal({
          templateUrl: 'X-ray-view.html',
          controller: "viewXRayFilesController"
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
          });
      });
    }
    //this fuction takes care of the doctor's prescription within the patient test result.
    $scope.prescribe = function(testData){
      templateService.holdPrescriptionTestObj = testData;
      ModalService.showModal({
          templateUrl: 'write-prescription-modal.html',
          controller: 'prescriptionModalController'
      }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
             
          });
      });
    }


    //delete logic for the prescription request.
    $scope.delete = function(test) {
      var theTest;
      switch(test.type_of_test){
        case "laboratory":
          theTest = $scope.labPrescriptionReq;
          $scope.labLen--;
          break;
        case "radiology":
          theTest = $scope.radioPrescriptionReq;
          $scope.radioLen--;
          break;
        default:
        break;
      }

      //remove prescription request data from local storage.
      var removeFromManager = localManager.getValue("prescriptionRequestData");   
      var elementPos = theTest.map(function(x){return x.ref_id}).indexOf(test.ref_id)
      var testFound =  theTest.splice(elementPos,1);
      var FoundTest = removeFromManager.splice(elementPos,1); 
      
      $http({
        method  : 'DELETE',
        url     : "/user/doctor/delete-prescriptionReq-test",
        data    : test,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) { 
      if(data)  
        alert("Test deleted sucessfully!")
      });

    }


    var isClicked = true;

    $scope.chatLive = function(){
      if(isClicked){
        initChat()
        $scope.isChat = true;
        $scope.isToSeeRecord = false;
      $scope.isToPrescribe = false;
       $scope.isToViewLabPrescriptionReq = false;
      $scope.isToViewRadPrescriptionReq = false;
      $scope.isToViewSession = false;
        isClicked = false;
      } else {
        isClicked = true;
        $scope.isChat = false;
      }
    }

   
    $scope.referToAnother = function(){
      $rootScope.data = {
        date: + new Date(),
        message_id: Math.floor(Math.random() * 99999999),
        sender_age: patient.age,
        sender_firstname: patient.firstname,
        sender_gender: patient.gender,
        sender_id: patient.patient_id,
        sender_phone: patient.phone,
        sender_email: patient.email,
        sender_lastname: patient.lastname,
        sender_location: patient.city + " " +  patient.country,
        sender_profile_pic_url: patient.patient_profile_pic_url,
        sender_title: patient.title,
        type: "consultation",
        isLaterRef: "yes"
      }  

      ModalService.showModal({
          templateUrl: 'redirect-request.html',
          controller: "referRequestController"
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {               
        });
      });
    }

    /*
date: "1547987169970"
message_id: 8499218039
sender_age: "30 - 39 years (adult)"
sender_firstname: "Nnaji"
sender_gender: "Male"
sender_id: "chidiebere187432"
sender_lastname: "Chidiebere"
sender_location: "Enugu Nigeria"
sender_profile_pic_url: "/download/profile_pic/nopic"
type: "consultation"
_id: "5c4468e145e2f50a18b2949b"

    */
    function reqModal(patientObj) {
      templateService.holdForSpecificPatient = patientObj
      ModalService.showModal({
        templateUrl: 'sending-communication-request.html',
        controller: "videoInitController"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
           
        });
      });
    }

    function genId() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

      for( var i=0; i < 12; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    }


}]);  
  
app.controller("appointmentModalController",["$scope","$rootScope","$http","moment","templateService","mySocket",
  function($scope,$rootScope,$http,moment,templateService,mySocket){
    
    $scope.day = moment();

    ///////////
    $scope.selected = _removeTime($scope.selected || moment());
    $scope.month = $scope.selected.clone();

    var start = $scope.selected.clone();

    start.date(1);
    _removeTime(start.day(0));

    _buildMonth($scope, start, $scope.month);

    $scope.select = function(day) {
        $scope.selected = day.date;
        $scope.dd = day.date;
    };

    $scope.next = function() {
        var next = $scope.month.clone();
        _removeTime(next.month(next.month()+1).date(1));
        $scope.month.month($scope.month.month()+1);
        _buildMonth($scope, next, $scope.month);
    };

    $scope.previous = function() {
        var previous = $scope.month.clone();
        _removeTime(previous.month(previous.month()-1).date(1));
        $scope.month.month($scope.month.month()-1);
        _buildMonth($scope, previous, $scope.month);
    };
    
  
    
    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            $scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }

 $scope.treatment= {};
 $scope.treatment.appointment = {};

    $scope.book = function(){
      var data = templateService.holdBriefForSpecificPatient || templateService.holdForSpecificPatient;
      
      var date = + new Date();
      $scope.treatment.date = date;
      $scope.treatment.patient_id = data.patient_id || data.user_id;
      $scope.treatment.typeOfSession = "In-person meeting";
      $scope.treatment.appointment.title = "";
      $scope.treatment.appointment.date = $scope.dd._d;


      //this will take care of differrent object populating the data variable.
      if(data.hasOwnProperty("patientInfo")) {
       
        $scope.treatment.appointment.firstname = data.patientInfo.firstname 
        $scope.treatment.appointment.lastname = data.patientInfo.lastname 
        $scope.treatment.appointment.profilePic = data.patientInfo.profilePic 
        $scope.treatment.session_id = data.session_id;

        $scope.treatment.general_examination = data.diagnosis.general_examination;
        $scope.treatment.systemic_examination = data.diagnosis.systemic_examination;
        $scope.treatment.final_diagnosis = data.diagnosis.final_diagnosis;
        $scope.treatment.presenting_complain = data.diagnosis.presenting_complain;
        $scope.treatment.history_of_presenting_complain = data.diagnosis.history_of_presenting_complain;
        $scope.treatment.past_medical_history  = data.past_medical_history;

        $scope.treatment.social_history = data.diagnosis.social_history;
        $scope.treatment.family_history = data.diagnosis.family_history;
        $scope.treatment.drug_history = data.diagnosis.drug_history;
        $scope.treatment.summary = data.diagnosis.summary;

        $scope.treatment.provisional_diagnosis = data.diagnosis.provisional_diagnosis;
        sendData($scope.treatment,"/user/doctor/session-update/save-changes","PUT");

      } else {

        templateService.holdBriefForSpecificPatient = null;
        $scope.treatment.appointment.firstname = data.firstname || data.patient_firstname; 
        $scope.treatment.appointment.lastname = data.lastname || data.patient_lastname;       
        $scope.treatment.appointment.profilePic = data.profile_pic_url || data.profilePic;
        sendData($scope.treatment,"/user/doctor/patient-session","POST");
      }
      
     
    }

    function sendData(data,url,method) {
      $scope.loading = true;
      $http({
        method  : method,
        url     : url,
        data    : data,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(response) {   
        $scope.loading = false;
        if(response) {
         
          alert("Appointment booked, patient will be notified.")
          mySocket.emit("realtime appointment notification",{to:data.patient_id})
          
        }  
      });
    }

}]);



//this controller controls the form filled by the doctor when creating new session for a selected patient above.
app.controller("fromModalSessionController",["$scope","$http","$window","localManager",
  "templateService","$rootScope","$resource","getSessionService","$filter",
  function($scope,$http,$window,localManager,templateService,$rootScope,$resource,getSessionService,$filter){
  $scope.patient = {};
  //var date = new Date();     
  $scope.patient.patient_id = $rootScope.holdId;
  $scope.patient.typeOfSession = "In-person meeting"; 

  $scope.createSession = function () {
    $scope.loading = true;     
    var dt = + new Date();
    $scope.patient.date = dt;
    var date = $filter('date')(dt, 'EEE, MMM d, y');
    var sendObj = {};


    for(var i in $scope.patient) {
      if($scope.patient.hasOwnProperty(i) && $scope.patient[i] && i !== 'date' && i !== 'patient_id' && i !== 'typeOfSession') {

        sendObj[i] = "<i>" + $scope.patient[i] + "<i>" //"<font color='green' weight='bold'> >> &nbsp; " + date + "</font> : " + $scope.patient[i];
      } else {
        sendObj[i] = $scope.patient[i];
      }
    }

    $http({
      method  : 'POST',
      url     : "/user/doctor/patient-session",
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {  
      $scope.loading = false; 
      if(data.success === "success") {
        $scope.patient.diagnosis = connectObj;
        $scope.patient.session_id = data.session_id;
        $scope.patient.patient_firstname = data.patient_firstname;
        $scope.patient.patient_lastname = data.patient_lastname;
        $scope.patient.profilePic = data.profilePic;
        localManager.setValue("heldSessionData",$scope.patient);
        $scope.isCreated = true;
        //$window.location.href = "/user/treatment";
        loadSession();
      } else {
        alert("Error occured while creating this treatment session");
      }
    });


    function loadSession() {
      $scope.loading = true;
      var getSession = getSessionService;//$resource("/user/doctor/get-patient-sessions");     
      getSession.query($scope.patient,function(data){
        $scope.loading = false;       
        //$rootScope.recentSession = data[0];
        $rootScope.sessionData = data;
        if(data.length > 0)
          templateService.holdId = data[0].patient_id;
      })
      
    }


    var connectObj = {
      presenting_complain: $scope.patient.complain,
      history_of_presenting_complain: $scope.patient.historyOfComplain,
      past_medical_history: $scope.patient.pastMedicalHistory,
      social_history: $scope.patient.socialHistory,
      family_history: $scope.patient.familyHistory,
      drug_history: $scope.patient.drugHistory,
      summary: $scope.patient.summary,
      provisional_diagnosis: $scope.patient.provisionalDiagnosis,
    }

  }

  $scope.loading = true;
  $http({
    method  : 'GET',
    url     : "/user/doctor/initial-complaint/" + "?patientId=" + $rootScope.holdId,
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {  
    $scope.loading = false; 
    $scope.initial = data;
    console.log(data)
  });


}]);

app.controller("viewXRayFilesController",["$scope","$http","$window","localManager","templateService",
  function($scope,$http,$window,localManager,templateService){ 
    var fileUrl = templateService.holdScanImageList.imagery;
    var files = {};
    files.index = 0
    $scope.image = fileUrl[files.index];
    $scope.report = templateService.holdScanImageList.report;

    $scope.finishNex = true;
    $scope.previous = function() {      
      files.index--;
      if(files.index > 0) {
        $scope.finishPre = true;
        $scope.finishNex = true;
      } else {
        $scope.finishPre = false;
      }
      $scope.image = fileUrl[files.index];
    }

    $scope.next = function() {
      files.index++;
      if(files.index === fileUrl.length - 1) {
        $scope.finishNex = false;
      } else {
        $scope.finishNex = true;
        $scope.finishPre = true;
      }
      $scope.image = fileUrl[files.index];
    }
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

/*app.controller("videoCommunicationDoctorController",["$scope","$resource","$window","localManager","mySocket",
  function($scope,$resource,$window,localManager,mySocket){

  $scope.getinfo = localManager.getValue("patientInfoForCommunication");
  $scope.callWaitingList = localManager.getValue("videoCallerList");  //sets the list of requested patients for the call page.
  var user = localManager.getValue("resolveUser");
 
  /*var presence = $resource("/user/conversation-availability",null,{sendRequest:{method: "PUT"}});
  var time = + new Date();
  var user = localManager.getValue("resolveUser");
  var sendObj = {
    time: time,
    userId: user.user_id
  }
  presence.sendRequest(sendObj,function(data){
    console.log(data)
  });""


  

  var receiverId = localManager.getValue("personToCall");
  var caller = localManager.getValue("caller");
  var receiver = localManager.getValue("receiver");
  //var receiverId = localManager.getValue("receiver");
  


  //emits to bring patient in for call.
  mySocket.emit("in call",{from:user.user_id,to:receiverId,callerFirstname: user.firstname, //remember to replace "135920854" with receiverId
    callerPic:user.profile_pic_url,callerLastname: user.lastname,type:"Video Call",caller:caller,receiver:receiver});

  $scope.inCallStatus = "Waiting for patient to connect...";
  //handler to notify doc when a patient is on call paage
  mySocket.on("patient in call connected",function(data){
    if(data.status) {
      $scope.inCallStatus = "is now connected!"
    }
  })

  $scope.callAnother = function(patientId,firstname,lastname,pic){
    var patient = {
      id: patientId,
      firstname: firstname,
      lastname: lastname,
      profilePic: pic
    }

    var caller = genId();
    var receiver = genId();

    localManager.setValue("personToCall",patientId);
    localManager.setValue("patientInfoForCommunication",patient);
    localManager.setValue("receiver",receiver);
    localManager.setValue('caller',caller);
    $window.location.href = "/user/doctor/call"; 
  }

  function genId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";
    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  
}]);*/

/*app.controller("audioCommunicationDoctorController",["$scope","$resource","$window","localManager","mySocket",
  function($scope,$resource,$window,localManager,mySocket){
  $scope.getinfo = localManager.getValue("patientInfoForCommunication");
  $scope.callWaitingList = localManager.getValue("audioCallerList");  //sets the list of requested patients for the call page.
  var user = localManager.getValue("resolveUser");


  var receiverId = localManager.getValue("personToCall");
  var caller = localManager.getValue("caller");
  var receiver = localManager.getValue("receiver");
  //var receiverId = localManager.getValue("receiver");
  


  //emits to bring patient in for call.
  mySocket.emit("in call",{from:user.user_id,to:receiverId,callerFirstname: user.firstname, //remember to replace "135920854" with receiverId
    callerPic:user.profile_pic_url,callerLastname: user.lastname,type:"Audio Call",caller:caller,receiver:receiver});

  $scope.inCallStatus = "Waiting for patient to connect...";
  //handler to notify doc when a patient is on call paage
  mySocket.on("patient in call connected",function(data){
    if(data.status) {
      $scope.inCallStatus = "is now connected!"
    }
  })

  $scope.callAnother = function(patientId,firstname,lastname,pic){
    var patient = {
      id: patientId,
      firstname: firstname,
      lastname: lastname,
      profilePic: pic
    }

    var caller = genId();
    var receiver = genId();

    localManager.setValue("personToCall",patientId);
    localManager.setValue("patientInfoForCommunication",patient);
    localManager.setValue("receiver",receiver);
    localManager.setValue('caller',caller);
    $window.location.href = "/user/doctor/audio/call"; 
  }

  function genId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";
    for( var i=0; i < 12; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  
}]);*/

/*app.controller("videoCommunicationPatientController",["$scope","localManager","mySocket",function($scope,localManager,mySocket){
  $scope.getinfo = localManager.getValue('doctorInfoforCommunication'); 
  var user = localManager.getValue("resolveUser");
  mySocket.emit("in call connected",{to:$scope.getinfo.userId});

}]);*/



/*app.controller("VideoDiagnosisController",["$scope","$location","$window","$http","localManager","templateService","Drugs","$resource",
  function($scope,$location,$window,$http,localManager,templateService,Drugs,$resource){
  $scope.treatment = {};
  var patient = {};  

  var random = Math.floor(Math.random() * 999999999999 );
  patient.id = localManager.getValue("personToCall");
  var getPatientData = $resource("/user/doctor/specific-patient");
  getPatientData.get(patient,function(data){
    $scope.patientInfo = data;
    patient.prescriptionId = random;
    patient.patient_id = patient.id;    
    patient.firstname = $scope.patientInfo.firstname;
    patient.lastname = $scope.patientInfo.lastname;
    patient.gender = $scope.patientInfo.gender;
    patient.age = $scope.patientInfo.age;
    patient.address = $scope.patientInfo.address;
    patient.city = $scope.patientInfo.city;
    patient.country = $scope.patientInfo.country;
    patient.patient_profile_pic_url = $scope.patientInfo.profile_pic_url;
    patient.lab_analysis = $scope.patientInfo.lab_analysis;
    patient.scan_analysis = $scope.patientInfo.scan_analysis;
    patient.allergy = $scope.patientInfo.allergy;
    patient.title = $scope.patientInfo.title;
    patient.sender = "doctor";
  });
   
    

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
      console.log("static")
      console.log($scope.drugList);
      
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
      patient.prescriptionBody = newVal;// adds prescription body to the prescription object as the doctor 
    //prepares to send it to the back end.
    },true);  


    $scope.toPatient = function(){
      //doctor creates the prescription object and sends it the the back end. url is "patient/forwarded-prescription", other informations that
      //comes with the prescription object added to the prescription object in the backend.
      templateService.holdPrescriptionToBeForwarded = patient;
      $http({
        method  : 'PUT',
        url     : "/user/patient/forwarded-prescription",
        data    : patient,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {      
        console.log(data);
        alert(data);
      });
      
    }

    $scope.toPharmacy = function(){     
       $scope.treatment.prescription_id = patient.prescriptionId; // id to identify prescription in a session if one is written.
       $scope.treatment.patient_id = patient.id;
       $scope.treatment.typeOfSession = "video chat";
       $http({
        method  : 'POST',
        url     : "/user/doctor/patient-session",
        data    : $scope.treatment,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        if(data)   
          alert("session created!!");
      });

      templateService.holdPrescriptionToBeForwarded = patient;
      $location.path("/search/pharmacy");
    }

    $scope.isAppointment = false;
    $scope.submitSession = function(){
      if($scope.isAppointment === false){
        $scope.isAppointment = true;
        viewed = true;
        var date = new Date();
        $scope.treatment.date = date;      
        $scope.treatment.patient_id = patient.id;
        $scope.treatment.typeOfSession = "video chat";      
        $scope.treatment.appointment = {};
        $scope.bookAppointment = function(){          
          $scope.treatment.appointment.firstname = patient.firstname;
          $scope.treatment.appointment.lastname = patient.lastname;
          $scope.treatment.appointment.title = patient.title;
          $scope.treatment.appointment.profilePic = patient.patient_profile_pic_url;
          $http({
            method  : 'POST',
            url     : "/user/doctor/patient-session",
            data    : $scope.treatment,
            headers : {'Content-Type': 'application/json'} 
            })
          .success(function(data) {
            if(data)   
              alert("session created!!");
          });
        }
      } else {
        $scope.isAppointment = false;
      }
    }
}]);*/

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
      $location.path("/welcome");
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
  "localManager","chatService","$rootScope","mySocket","pharmacyCenterNotificationControllerService","addNoteService","viewNoteService","$http",
  function($scope,$location,$resource,$window,templateService,deleteFactory,localManager,chatService,
    $rootScope,mySocket,pharmacyCenterNotificationControllerService,addNoteService,viewNoteService,$http){

  var notification = pharmacyCenterNotificationControllerService; //$resource("/user/center/get-notification");

  
  notification.get(null,function(data){
    $rootScope.allNote = data.diagnostic_center_notification || [];
    $rootScope.noteLen = $rootScope.allNote.length || 0;
  });
 

  mySocket.on("center notification",function(data){
    templateService.playAudio(3);
    $rootScope.allNote.push(data);
    $rootScope.noteLen++;
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


  $rootScope.loadChats = function() {
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

  $rootScope.loadChats();

  $scope.viewChat = function(partnerId) {
    templateService.holdId = partnerId;
    $location.path("/general-chat");
    $scope.showIndicator = false;
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
  return $resource("/user/center/billing-verification",null,{verify: {method: "PUT"}});
}]);

app.service("paymentVerificationService",["$resource",function($resource){
  return $resource("/user/payment/verification",{userId: null},{verify:{method:'POST'}}); 
}]);

app.controller("pharmacyViewPrescriptionController",["$scope","$location","templateService",
  "localManager","$rootScope","$resource","billingAuthService","paymentVerificationService","phoneCallService",
  function($scope,$location,templateService,localManager,$rootScope,$resource,billingAuthService,paymentVerificationService,phoneCallService){ 
  //var pharmacyData = templateService.holdPharmacyReferralData = localManager.getValue("pharmacyData");  
  var getCurrentPage = localManager.getValue("currPageForPharmacy");
  var getIdOfCurrentPage = getCurrentPage.split("/");
  var getLastItem = getIdOfCurrentPage[getIdOfCurrentPage.length-1];
  var convertToInt = parseInt(getLastItem);
  var refId = templateService.holdId || convertToInt;

  

  //this $rootScope.refData will be used by all diagnostic centers to hold the refdata for a particular 
  //patient which will be used for billingcontroller
  
  //use to load data if has not been modified or if page is refreshed to restore default.
  $rootScope.refData = localManager.getValue("pharmacyData");

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
  $scope.patient = {};

  $scope.isNotOption = true;

  $scope.showOption = function(){
    $scope.error = "";
     $scope.isNotOption = false;
     if(!$scope.isOption){
      $scope.isOption = true;
     } else {
      $scope.isNotOption = true;
      $scope.isOption = false;
     }
  }

  $scope.findPrescription = function(){
    if(Object.keys($scope.patient).length > 0) {      
      if($scope.patient.ref_id){
        $scope.patient.criteria = "refIdCriteria";       
      } else if($scope.patient.phone) {
        $scope.patient.criteria = "phoneCriteria";
        $scope.patient.phone = $rootScope.setPhone($scope.patient.phone);
      }
      typeOfSearch($scope.patient);
    } else {
      alert("Please enter search creteria in the text field")
      return;
    }

  
  }
    

  var typeOfSearch = function(criteria) { 
    $scope.loading = true; 

    $http({
          method  : 'PUT',
          url     : "/user/pharmacy/find-patient/prescription",
          data    : criteria,
          headers : {'Content-Type': 'application/json'} 
          })
        .success(function(response) { 
          $scope.foundData = []; 
          $scope.patient = {};             
          if(response.data) {
            $scope.foundData = response.data;           
          } else {
            $scope.error = response.error;
          }

          $scope.loading = false;
      });
  }

  $scope.viewPatientPrescription = function(patient){
    templateService.holdId = patient.ref_id;
    var pageUrl = "/pharmacy/view-prescription/" + patient.ref_id;
    localManager.setValue("currPageForPharmacy",pageUrl);
    localManager.setValue("pharmacyData",patient); 
    $location.path(pageUrl);    
  }

}]);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//for laboratory centers

app.controller("labCenterDashboardController",["$scope","$location","$http","templateService","localManager","ModalService","$rootScope",
  function($scope,$location,$http,templateService,localManager,ModalService,$rootScope){
    var currPage = localManager.getValue("currPageForLaboratory");
    if(currPage) {
      $location.path(currPage);
    } else {
      //$location.path("/referral/laboratory-test");
      $location.path("/welcome");
    }

    $rootScope.attendanceList = localManager.getValue("holdTestForAttendance") || [];

    $scope.newPatient = function(){
      ModalService.showModal({
            templateUrl: 'patient-emergency-form.html',
            controller: "newPatientModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
               
        });
      });
    }
}]);

app.service("labCenterNotificationService",["$resource",function($resource){
  return $resource("/user/center/get-notification");
}]);

app.service("labNoteService",["$resource",function($resource){
  return $resource( "/user/laboratory/get-referral",null,{sendObj:{method:"PUT"}});
}]);

/*app.service("labViewNoteService",["$resource",function($resource){
  return $resource("/user/laboratory/get-referral");
}]);*/


app.controller("labCenterNotificationController",["$scope","$location","$resource","$window","templateService",
  "localManager","$http","chatService","labCenterNotificationService","labNoteService","deleteFactory","courierResponseService",
  "$rootScope","mySocket",function($scope,$location,$resource,$window,templateService,
    localManager,$http,chatService,labCenterNotificationService,labNoteService,deleteFactory,courierResponseService,$rootScope,mySocket){


  function getNotification() {
    var notification = labCenterNotificationService ; //$resource("/user/center/get-notification");
    notification.get(null,function(data){
      $rootScope.allNote = data.diagnostic_center_notification || [];
      $rootScope.noteLen = $rootScope.allNote.length || 0;
    });
  }

  getNotification();

  
    //this fn gets all notification from the back end and adds to the attendance list. this is similar to toList fn jst that instead of 
  //adding patients to the list one by one you simply all add all together.
  $scope.addAllNote = function(){
    if($rootScope.allNote.length > 0) {
      var labTests = labNoteService; //$resource( "/user/laboratory/get-referral",null,{sendObj:{method:"PUT"}});
      labTests.sendObj($rootScope.allNote,function(res){
        var data = res.labTest; 
        if($rootScope.attendanceList.length === 0){   
          //templateService.holdList = data;          
          localManager.setValue("holdTestForAttendance",data);
          $rootScope.attendanceList = data;
        } else {
          for(var i = 0; i < data.length; i++){
            $rootScope.attendanceList.push(data[i]);
          }
        } 

        $rootScope.allNote.splice(0);
        $rootScope.noteLen = 0;
        //note delete from the backend  /user/delete-many
        deleteAllNote("all","diagnostic_center_notification");
      });
    }
    
  }

   var reverseNote = [];//this holds notic=fation from backend based on how new it is
   var deletedNote = [];//this holds all deleted notifications

  
  $rootScope.viewNote = function(id,fromList,newPatient){
    templateService.holdId = id;
    //view test from attendance list does not need to go through backend since data that populated the list is already there
    if(fromList && !newPatient) {
      var list = $rootScope.attendanceList;
      var pageUrl = "/laboratory/view-test/" + id;
      localManager.setValue("currPageForLaboratory",pageUrl);
      $location.path(pageUrl);
      var elementPos = list.map(function(x) {return x.ref_id}).indexOf(id);
      localManager.setValue("laboratoryData",list[elementPos]);
    } else {      
      //view test from notification icon goes to the backend to get patient data;    
      var labTest = labNoteService; //$resource("/user/laboratory/get-referral");
      labTest.get({refId: id},function(data){
        localManager.setValue("laboratoryData",data); //pharmacyData refers to patients prescription
        var pageUrl = "/laboratory/view-test/" + id;
        $location.path(pageUrl);
        localManager.setValue("currPageForLaboratory",pageUrl);
        deleteByRefId(id,"diagnostic_center_notification");
      });   
    } 
  }


  function deleteByRefId(id,field){
    var msg = "no alert";
    var del = new deleteFactory(id,field);
    del.deleteItem("/user/delete-one/refId",msg);//deletes notification once it is viewed.
    if($rootScope.noteLen > 0)
      $rootScope.noteLen--;    
  }

   function deleteAllNote(id,field){
    var msg = "Notification deleted";
    var del = new deleteFactory(id,field);
    del.deleteItem("/user/delete-many",msg);//deletes notification once it is viewed.
    $rootScope.noteLen = 0;
  }


  mySocket.on("notification",function(response){
    if(response.status){      
      getNotification();
      templateService.playAudio(3);
    }
  });

  mySocket.on("center notification",function(data){
    templateService.playAudio(3);
    $rootScope.allNote.unshift(data);
    $rootScope.noteLen++;
  });

   $rootScope.loadChats = function() {
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

  $rootScope.loadChats();

  $scope.viewChat = function(partnerId) {
    templateService.holdId = partnerId;
    $location.path("/general-chat");
    $scope.showIndicator = false;
  }

  $scope.showIndicator = false;

  $rootScope.$on("unattendedMsg",function(status,data){
    $scope.showIndicator = data;
  });


   //courier services
  var courierResponse = courierResponseService;

  function getCourier() {
    courierResponse.query(function(data){
      $rootScope.courierResponseList = data;
      $scope.unRead = data[0];
     
    });
  }

  mySocket.on("courier billed",function(res){
    getCourier();
  });

  mySocket.on("new courier order",function(res){
    getCourier();
  });


  $rootScope.$on('new courier order',function(status,res){
     getCourier();
  })

  var pt;

  $scope.viewResponse = function(item) {
    $rootScope.courierResponse = item;
    pt = '/courier-response/' + Math.floor(Math.random() * 99999999);
    $location.path(pt);
  }

  getCourier();
  

}]);


//works just like referredPatientController. Lab center search for a patient with ref_id or phone number of the patient as search criteria.
//Object is returned from the backend and displayed on lab-view-test.html template.
app.controller("labReferredPatientsController",["$scope","$location","$http","templateService","localManager",
  function($scope,$location,$http,templateService,localManager) {
  $scope.patient = {};

  $scope.isNotOption = true;

  $scope.showOption = function(){
     $scope.error = "";
     $scope.isNotOption = false;
     if(!$scope.isOption){
      $scope.isOption = true;
     } else {
      $scope.isNotOption = true;
      $scope.isOption = false;
     }
  }

  $scope.findTest = function(){
    if($scope.patient.ref_id){
      $scope.patient.criteria = "refIdCriteria";       
    } else if($scope.patient.phone) {
      $scope.patient.criteria = "phoneCriteria";
      if($scope.patient.phone.indexOf('+') == -1 || $scope.patient.phone.indexOf('+2') == -1) {
        var newSlice = $scope.patient.phone.slice(1);
        $scope.patient.phone = "+234" + newSlice;
      }

    }

    if(Object.keys($scope.patient).length > 0) {
      typeOfSearch($scope.patient);
    } else {
      alert("Please enter search criteria in the text field")
      return;
    }
  }
    

  var typeOfSearch = function(criteria) { 
    $scope.loading = true;    
    $http({
      method  : 'PUT',
      url     : "/user/laboratory/find-patient/lab-test",
      data    : criteria,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(response) { 
      $scope.patient = {};
     
      $scope.loading = false;      
      if(response.length > 0) {
        $scope.tests = response;            
      } else {
        $scope.error = "Patient lab test not found!";
        $scope.tests = [];
      }
    });
  }

  $scope.viewLabTest = function(test){
    templateService.holdId = test.ref_id;
    var pageUrl = "/laboratory/view-test/" + test.ref_id;
    localManager.setValue("currPageForLaboratory",pageUrl);
    localManager.setValue("laboratoryData",test);
    $location.path(pageUrl);
  } 

}]);

app.controller("labCenterPanelController",["$scope","$location","$http","templateService","localManager",
  function($scope,$location,$http,templateService,localManager) {
    $scope.dashboardhome = function(){
      $location.path("/referral/laboratory-test");
    }
}]);


app.service("searchTestService",["$resource",function($resource){
  return $resource("/user/laboratory/search/find-tests",null,{findCenter:{method:"PUT"}});
}]);

app.service("toCenterService",["$resource",function($resource){
  return $resource("/user/center/send-test",null,{sendTest:{method: 'POST'}});
}]);

app.controller("labTestControler",["$scope","$location","$http","templateService","localManager",
  "ModalService","labTests","$resource","$rootScope","cities","paymentVerificationService","billingAuthService",
  "searchTestService","toCenterService","phoneCallService",
  function($scope,$location,$http,templateService,localManager,ModalService,labTests,$resource,$rootScope,
    cities,paymentVerificationService,billingAuthService,searchTestService,toCenterService,phoneCallService) {
   
   
    var objectFound = localManager.getValue("laboratoryData");
    var holdInitialTestToRun = objectFound.laboratory.test_to_run;
   

    if(objectFound !== null && !objectFound.laboratory.session_id) {
      var testArr = objectFound.laboratory.test_to_run;
      for(var i = 0; i < testArr.length; i++){
        testArr[i].select = true;
      }
      var holdInitialTestToRun = testArr;
      $scope.refInfo = objectFound;
    } else {
      objectFound.laboratory.test_to_run.forEach(function(test){
        test.select = true;
      })
      var holdInitialTestToRun = objectFound.laboratory.test_to_run;
      $scope.refInfo = objectFound;
    }

    fill(objectFound);

    function fill(obj) {

      var allTests = labTests.listInfo.concat(labTests.listInfo1,labTests.listInfo2,labTests.listInfo3,labTests.listInfo4,
      labTests.listInfo5,labTests.listInfo6,labTests.listInfo7);


      var list = [{sn:'a'}];
      $scope.inputctrl = [{sn:"a"}]


      var testName;      

      $scope.getTest = function(name){
        testName = name;
      }

      $scope.patient = {};
      $scope.testList = list;

      $scope.tests = allTests;
      var index = 0;

      $scope.add = function(){        
        if(testName !== "" && testName !== undefined) {   
          if(!/^[A-Z]/.test( testName))
            testName = toTitleCase(testName);
          var elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName)
          var objFound = $scope.tests[elementPos];
          if( elementPos === -1) {
            alert("There is no test match. Make sure you entered the test name correctly.")
          } else {
            
            if(list.length > 1){
              var pos = list.length-1
              var random = Math.floor(Math.random() * 1000);
              list[pos].sn = random;
              list[pos].name = objFound.name;
              list[pos].id = objFound.id;
              list[pos].select = true;
            }
                  
            if(!list[0].name) {              
              list[0].name = objFound.name;
              list[0].id = objFound.id;
              list[0].select = true;
            } 

            var obj = {};
            list.push(obj);            

            index++;
            $scope.inputctrl.push({sn:"b"});
            if($scope.inputctrl.length > 0)
              $scope.inputctrl.splice(0,1);
          }
          
        } else {
          alert('Please enter test name');
        }
       
      }

      $scope.remove = function(id){    
        if(list.length > 1){
        var elementPos = list.map(function(x){return x.sn}).indexOf(id)
        var objfound = list.splice(elementPos,1);
        } else {
          list.splice(0,1)
        }
      }

      if(localManager.getValue("history")) {
         $scope.refInfo.history = localManager.getValue("history")
      }

      $scope.testToRunFilled = function(){
        var sendObj = {};        
        var elementPos;
        var objFound; 
        if(list.length === 1) {
          if(testName !== undefined && testName !== "") {
          if(!/^[A-Z]/.test( testName))
             testName = toTitleCase(testName);     
          elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName)
          objFound = $scope.tests[elementPos];
          if( elementPos === -1) {
            alert("There is no test match based on your search criteria. Make sure you entered the test name correctly.")
          } else {
          list[0].name = objFound.name;
          list[0].id = objFound.id; 
          list[0].select = true;     
          obj.laboratory.test_to_run = list
          
          }
          } else {
            alert("Please enter the test name")
          }
        } else {
          var last = list.length-1;
          if(list[last].name !== "" && list[last].name !== undefined){
            elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName);
            if(elementPos !== -1){
              objFound = $scope.tests[elementPos];
              list[last].name = objFound.name;
              list[last].id = objFound.id;
              list[last].select = true;      
              obj.laboratory.test_to_run = list;
            } else {
              alert("Test name does not exist on our database! Please select from dropdown list.");
            }
          } else {
            for(var i = 0; i < list.length; i++){
              if(!list[i].name){
                list.splice(i,1);
              }
            }
            obj.laboratory.test_to_run = list;
          }
          
        }

        obj.isPatient = true;
      }

    }//end of fill function

  $scope.toList = function(firstname,lastname,profilePicUrl,ref_id,date){
    var listObj = {};
    listObj.firstname = firstname;
    listObj.lastname = lastname;
    listObj.profile_pic_url = profilePicUrl;
    listObj.ref = ref_id;
    listObj.date = date;
    var toStr = ref_id.toString();
    if(!templateService.checkInTheList.hasOwnProperty(toStr)) {      
      templateService.checkInTheList[toStr] = true;
      templateService.holdList.push(listObj);
    }
  }

  
  $scope.hasPreviewed = true;
  $scope.hasSent = true;
  $scope.lab = {};
  $scope.isResult = true;
  
  var check = {}
  check.count = 0;
  $scope.$watch("refInfo.laboratory.test_to_run",function(newVal,oldVal){
    if(newVal) {
      check.count++;
      updateList(newVal);
      bill(newVal);
    }
  },true);
  

  function updateList(testArr) {
    var ranTest = [];
    var unRanTest = [];    

    for(var i = 0; i < testArr.length; i++){
      if(testArr[i].select === true) {          
          ranTest.push(testArr[i]);
      } else {
        unRanTest.push(testArr[i]);
        ranTest.splice(i,1)
      } 
    }

   
    $scope.testReport = ranTest;
    $scope.unRantest = unRanTest;   
   
  }


  /////////////////////////////////
// this logic is good for adding amount of picked drug to the total of all picked drugs. It may be good logic for shopping cart

  var testForPay = {}; 
  testForPay.pickedTests = [];
  
  var totalCost = {};
  totalCost.sum = 0;
  $scope.str = "";
  $scope.grabRawAmount
 

  function bill (newVal) {
    if(newVal){
      for(var i = 0; i < newVal.length; i++){
        if(newVal[i].select && newVal[i].select === true && !newVal[i].added){
          var selectedTest = {
            name: newVal[i].name,
            amount: 0,
            id: newVal[i].sn,
            added: true
          }
          testForPay.pickedTests.push(selectedTest);
          newVal[i].added = true;
          totalCost.sum = 0;
          updateTotal();
         
        } else if(newVal[i].select === false){          
          for(var j = 0; j < testForPay.pickedTests.length; j++){                  
            if(testForPay.pickedTests[j].id === newVal[i].sn){                                                      
              var remove = testForPay.pickedTests.splice(j,1);                     
              delete newVal[i].added;
              break;                                         
            }
          } 
          totalCost.sum = 0;
          updateTotal();
        }
      }
    }
  }
  

  $scope.testsForSurchage = testForPay.pickedTests;
  

  $scope.$watch("testsForSurchage",function(newVal,oldVal){
    if (newVal !== null) {
      for(var k = 0; k < newVal.length; k++) {        
       if(oldVal.length > 0 && newVal[k].added) {
        totalCost.sum -= (oldVal[k]) ? oldVal[k].amount : 0;
        totalCost.sum += (newVal[k]) ? newVal[k].amount : 0;
        toNaira(totalCost.sum);
       } 

      }        
    }
  },true); 

  function updateTotal() {
    if(testForPay.pickedTests.length > 0){
      var tests = testForPay.pickedTests;
      for(var l = 0; l < tests.length; l++){
        tests[l].added = true;
        totalCost.sum += tests[l].amount;
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
     $scope.grabRawAmount = val;
     $scope.commissionedAmount = "NGN" + ( val - (val * ($rootScope.checkLogIn.city_grade / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }



  var count = 0;
   // sending billing to patient which otp will be send to patient informing the patient the toal cost of the bill.
  $rootScope.sendBill = function(patientId,oldTime,phoneCall) {
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
      if(count < 5) {
        phoneCallService(sendObj,'/user/payment/verification','POST'); 
        $rootScope.showCallingMsg = "This patient will receive a phone call in just a moment. Please enter the pin heard from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }
    } else {
      $scope.loading = true;
       if($scope.otpError)
          $scope.otpError = null;
      var otp = paymentVerificationService; 
      otp.verify(sendObj,function(data){
        $scope.loading = false;
        if(data.success){
          $scope.otpMsg = data.message
        } else {
          alert(data.message);
        }        
      });
    }
  }


  $scope.call = function(patientId,oldTime) {
    $rootScope.sendBill(patientId,oldTime,'isCall')
  }


  /////////////////////////////////////////////////////


   $scope.specimen = [{name: "Blood",status: false},{name: "Sperm",status: false},
    {name: "Urine",status: false},{name: "Stool",status: false},{name: "Vaginal Fluid",status: false},
    {name: "Semen",status: false},{name: "Saliver",status: false},{name: "Mucus",status: false}]


  var billAuth = billingAuthService;//$resource("/user/center/billing-verification",null,{verify: {method: "PUT"}})
  billAuth.get({refId: $scope.refInfo.ref_id},function(data){
    $scope.paymentStatus = data.payment; 
    $scope.paymentDetail = data.detail || {};
  });


   $scope.verifyPay = function(refInfo) {
    if($scope.lab.otp && $scope.lab.otp !== "") {
      if($scope.otpError)
        $scope.otpError = null;
      var theStringTests = combineTest($scope.testReport);
      var converToStr = theStringTests.join();
      var date = + new Date();
      var pin = $scope.lab.otp;
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
      refInfo.laboratory.date = date;
      refInfo.laboratory.v_pin = newStr;
      refInfo.laboratory.strAmount = $scope.str;
      refInfo.payObj = {
        total: $scope.grabRawAmount,
        doctorId: refInfo.laboratory.doctor_id || "admin",
        //this refInfo.referral may be the center's id who will be credited if test was not written by a doctor.it should be modified
        type: "Laboratory",
        patientId: refInfo.laboratory.patient_id,
        doctorPhone: refInfo.laboratory.doctor_phone,
        patient_firstname: refInfo.laboratory.patient_firstname,
        patient_lastname: refInfo.laboratory.patient_lastname,
        ref_id: refInfo.ref_id
      }

      $scope.loading = true;
      billAuth.verify(refInfo,function(response){
        $scope.loading = false;
        if(response.payment){          
          $scope.otpMsg = null;
          $scope.paymentStatus = response.payment;
          $scope.paymentDetail = response.detail;
          var round = Math.round(response.balance)
          var format = "NGN" + round.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          $rootScope.balance = format;
        } else {
            $scope.otpError = response.message;
        }
      })
    }
  }
 
  $scope.result = function(refInfo){
    $scope.isResult = true;
    $scope.hasPreviewed = false;
  }

  $scope.refresh = function(){    
    if($scope.refInfo.history && $scope.refInfo.history !== "") {
      localManager.setValue("history",$scope.refInfo.history)
    }
    var random = Math.floor(Math.random() * 100);
    $location.path("/laboratory/view-test/" + random);   
  }

  $scope.newPayment = function() {
    $scope.otpMsg = null;
    $scope.paymentStatus = false;
  }



  //for entering of lab test report

  $scope.createInputList = function(test) {
    if(!test.list)
      test.list = [{}];
  }

  $scope.addReport = function(reportInput) {
    reportInput.list.push({})
  }

  $scope.removeReport = function(reportInput) {
    if(reportInput.list.length > 1)
      reportInput.list.pop()
  }

  

  $scope.previewTestResult = function(refInfo){
      
       $scope.compute = "";
      $scope.incomplete = "";
      $scope.uploadStatus = "";
      $scope.reportDate = + new Date();

     if($scope.grabRawAmount === 0 || !$scope.grabRawAmount) {
      $scope.grabRawAmount = 0;
      $scope.compute = "Warning: Zero amount is billed for this service";
     }

      $scope.hasPreviewed = false;
      $scope.errorList = [];
      refInfo.laboratory.test_to_run = $scope.testReport;
      /*refInfo.laboratory.test_to_run.forEach(function(test){
        if(test.list) {
          if(!test.list[0].r_name || test.list[0].r_range)
            $scope.errorList.push(test.name);
        }
      });*/

      $scope.$watch("errorList",function(newVal,oldVal){
        if( $scope.errorList.length > 0 ) { 
          $scope.incomplete = "Please enter complete report for " + '" ' + $scope.errorList[0] + ' " below.';
        } else if($scope.lab.conclusion !== undefined) {             
          $scope.incomplete = "";
          $scope.isPreview = true;
          $scope.isResult = false;
        } else {
          $scope.incomplete = "Write your conclusion based on the test reports";
        }        
        
      });

      $scope.preTest = $scope.testReport;
    
  }

  $scope.edit = function(){
    $scope.isPreview = false;
    $scope.isResult = true;
  }
  

  var theStringTests,
      converToStr,
      date,
      report,
      url;

  $scope.sendTestResult = function(refInfo){ 
    //theStringTests = combineTest($scope.testReport);
    //converToStr = theStringTests.join();
    var reportSheet = combineTest($scope.testReport);
    date = + new Date();
    refInfo.laboratory.report = reportSheet;
    refInfo.laboratory.test_ran = $scope.testReport;
    refInfo.laboratory.conclusion = $scope.lab.conclusion;
    refInfo.laboratory.test_to_run = holdInitialTestToRun;
    refInfo.laboratory.date = date;
    refInfo.laboratory.filesUrl = templateService.holdScanImageList;
    refInfo.payObj = {
      total: $scope.grabRawAmount,
      doctorId: refInfo.laboratory.doctor_id || "admin",
      //this refInfo.referral may be the center's id who will be credited if test was not written by a doctor.it should be modified
      type: "Laboratory",
      patientId: refInfo.laboratory.patient_id,
      doctorPhone: refInfo.laboratory.doctor_phone,
      patient_firstname: refInfo.laboratory.patient_firstname,
      patient_lastname: refInfo.laboratory.patient_lastname,
      ref_id: refInfo.ref_id
    }

     if(refInfo.laboratory.session_id) {
        url = "/user/laboratory/test-result/session-update";
        msg = "SUCCESS!!! Test result sent to Dr " + refInfo.referral_firstname + " " + refInfo.referral_lastname;
      } else {
        url = "/user/laboratory/test-result/patient-test-update"
        msg = "Success!!! Test report sent to patient";
      }
      $scope.loading = true;
      console.log(refInfo)
      report = $resource(url,null,{sendReport:{method: "PUT"}});
      report.sendReport(refInfo,function(response){
        if(response.status === "success") {
          alert(msg);
          if($scope.unRantest.length > 0) {
            templateService.holdUnranTest = $scope.unRantest;
            forwardUnRanTest($scope.unRantest);          
          }
          $scope.reportSuccess = true;
          localManager.removeItem("history")
        } else {

          alert("Error ocurred while sending your report. Please try again.");
          $scope.error = "Error ocurred while sending your report. Please try again."
          //$scope.edit()
        }

        $scope.loading = false;
      });

  }


  function combineTest(testArray) {
    var report = [];
    testArray.forEach(function(test){
      //val = "" +  test.name + ":"  + " " + test.data;
      report.push({
        name: test.name,
        report_sheet: test.list
      })
    });
    return report;
  }

  $scope.isToForward = false;

  function forwardUnRanTest(unRantestArray) {    
    ModalService.showModal({
        templateUrl: 'unsent.html',
        controller:  "unRanTestModalController"
    }).then(function(modal) {
      modal.element.modal();

        getCenters();    
      modal.close.then(function(result) {          
        
      });
    });

  }

  var user;
  $scope.customGetLab = function(){
    //templateService.holdSelectedLabTest = $scope.unRanTest;          
    //var objectFound = localManager.getValue("laboratoryData");          

    //objectFound.laboratory.test_to_run = $scope.unRanTest;

    //templateService.holdReferral = objectFound;
    
    //$location.path("/laboratory/find-laboratory");
    $scope.isCriteria = true;
    $scope.user.city = user.city;

  }

  $scope.isCriteria = false;
  $scope.user = {};

  $scope.redirectTest = function(){
    getCenters()
  }

  $scope.cancel = function () {
    $scope.hasSent = true;
    $scope.isToForward = false;
  }
  //sends test for search from updated services collections from the database on backend
  function getCenters() {
    $scope.isToForward = true;
    $scope.hasPreviewed = false;
    $scope.isPreview = false;
    $scope.hasSent = false;
    $scope.isRefresh = false;
    //$scope.unRanTest = unRanTest;

    templateService.holdUnranTest = [];
    objectFound.laboratory.newList = [];

    for(var i = 0; i < objectFound.laboratory.test_to_run.length; i++) {
      if(!objectFound.laboratory.test_to_run[i].select) {
        templateService.holdUnranTest.push(objectFound.laboratory.test_to_run[i]);
      } else {
        objectFound.laboratory.newList.push(objectFound.laboratory.test_to_run[i]);
      }
    }

    $scope.cities = cities;
    $scope.unRanTest = templateService.holdUnranTest;

  
    
    var searchTest = searchTestService;//$resource("/user/laboratory/search/find-tests",null,{findCenter:{method:"PUT"}});
    var toCenter = toCenterService;//$resource("/user/center/send-test",null,{sendTest:{method: 'POST'}});
    function getResource() {
     if(!$scope.user.city && $scope.user.city !== "") {
        user = localManager.getValue("resolveUser");
      } else {
        user = $scope.user;
      }

      $scope.loading = true;
      searchTest.findCenter({city:user.city,testList:templateService.holdUnranTest},function(data){
        $scope.loading = false;
        $scope.testResult = data;
        $scope.getStr = function(str){
          var newStr = "";
          var strArr = str.split(",");
          for(var i = 0; i < strArr.length; i++){
            newStr += "@" + strArr[i] + " "
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
      });
    }

    $scope.toForwardToCenter = function(center) {
      //here the objectfound refers to the patient ref data send initially.
      //the test_to_run is set to unranTest to send to the backend. other values is thus maintained for center to forward to another center.
      objectFound.user_id = center.id // sets the seleted center's id to locate the center in the database.
      objectFound.laboratory.test_to_run = templateService.holdUnranTest;
      center.loading = true;     
      toCenter.sendTest(objectFound,function(data){
        center.loading = false;
        if(data.success){
          center.status = true;
        } else {
          center.status = false;
        }
        objectFound.laboratory.test_to_run = objectFound.laboratory.newList;
      });
    }

    $scope.find = function(){
      getResource();
    }

    getResource();

  }

  function toTitleCase(str)
  {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

}]);

app.controller("unRanTestModalController",["$scope","$location","templateService","localManager",
  function($scope,$location,templateService,localManager){
  $scope.unRanTest = templateService.holdUnranTest;

  $scope.forward = function(){
    $location.path("/unrantest");
  }
}]); 

app.service("labUnRanTestService",["$resource",function($resource){
  return $resource("/user/laboratory/search/find-tests");
}]);


app.controller("unranTestController",["$scope","templateService","localManager","labUnRanTestService",
  function($scope,templateService,localManager,labUnRanTestService){
  $scope.back = localManager.getValue("currPageForLaboratory");
   //center sends unran tests to another center.This is important for maintaning patient test integrity.
  var user = localManager.getValue("resolveUser");
  var searchTest = labUnRanTestService; //$resource("/user/laboratory/search/find-tests");
  searchTest.get({city:user.city,testList:templateService.holdUnranTest},function(data){
    $scope.testResult = data;
  });
}]);

app.controller("laboratoryfindLabController",["$scope","$http","$location","templateService",function($scope,$http,$location,templateService){
  $http({
    method  : 'GET',
    url     : "/user/doctor/find-laboratory",// this route is use both for doctor and laboratory to find a center.
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
      url     : "/user/doctor/find-laboratory/search", //this route is use both for doctor and laboratory to find a center.
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

    $location.path('/laboratory/selected-laboratory/' + id);
  }

}]);

app.controller("laboratorySelectedLabController",["$scope","$http","localManager","$location","templateService",
  function($scope,$http,localManager,$location,templateService){
    $scope.placeHolder = true
  $scope.labCenter = templateService.holdTheLaboratoryToFowardTestTo;
  
  $scope.isEnquiry = function(){
    $scope.isContactFirst = true;
  } 

   
  
  $scope.sendTest = function () {
    var sendObj = templateService.holdReferral;
    var date = new Date();
    sendObj.date = date;
    sendObj.user_id = $scope.labCenter.user_id;
    //create patient object to be sent alongside the lab test to run.
    
    //sending lab test to a selected lab center to the backend for storage;
    
    $http({
      method  : 'POST',
      url     : "/user/center/send-test",
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      
      if(data.success){
        $scope.success = true;
        $scope.placeHolder = false;
        $scope.ref_number = data.ref_no;
        $scope.message = "Test has been forwrded";
      } else {
        $scope.message = "Error occured wihile sending the Lab test. Try again.";
      }
    });
  }

}]);


///////////////////////////////////////////////////////////////////////////////
/**************** for radiology centers *********************/

app.controller("radioCenterDashboardController",["$scope","$location","$http","templateService","localManager","ModalService","$rootScope",
  function($scope,$location,$http,templateService,localManager,ModalService,$rootScope){
    var currPage = localManager.getValue("currPageForRadiology");
    if(currPage) {
     $location.path(currPage);
    } else {
     //$location.path("/referral/radiology-test");
     $location.path("/welcome");
    }

   $rootScope.attendanceList = localManager.getValue("holdTestForAttendance") || [];


    $scope.newPatient = function(){
      ModalService.showModal({
            templateUrl: 'patient-emergency-form.html',
            controller: "newPatientModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
               
        });
      });
    }

}]);


app.service("radioNotificationService",["$resource",function($resource){
  return $resource("/user/center/get-notification",null,{updateStatus:{method:'PUT'}});
}]);

app.service("radioTestsService",["$resource",function($resource){
  return $resource("/user/radiology/get-referral",null,{sendObj:{method:"PUT"}});
}]);

app.controller("radioCenterNotificationController",["$scope","$location","$http","$window","templateService",
  "localManager","$resource","$rootScope","mySocket","chatService","radioNotificationService",
  "radioTestsService","deleteFactory","courierResponseService",
  function($scope,$location,$http,$window,templateService,localManager,$resource,
    $rootScope,mySocket,chatService,radioNotificationService,radioTestsService,deleteFactory,courierResponseService) {

  var notification = radioNotificationService; //$resource("/user/center/get-notification",null,{updateStatus:{method:'PUT'}});
  var radioTests = radioTestsService; //$resource( "/user/radiology/get-referral",null,{sendObj:{method:"PUT"}});
  

  function getNotification() {    
    notification.get(null,function(data){
      $rootScope.allNote = data.diagnostic_center_notification || [];
      $rootScope.noteLen = $rootScope.allNote.length || 0;
    });
  }

  getNotification();


 
    //this fn gets all notification from the back end and adds to the worklist list. this is similar to toList fn jst that instead of 
  //adding patients to the list one by one you simply all add all together.
 
  $scope.addAllNote = function(){   
    if($rootScope.allNote.length > 0) {     
      radioTests.sendObj($rootScope.allNote,function(res){
        var data = res.radioTest; 
        if($rootScope.attendanceList.length === 0){        
          localManager.setValue("holdTestForAttendance",data);
          $rootScope.attendanceList = data;
        } else {
          for(var i = 0; i < data.length; i++){
            $rootScope.attendanceList.push(data[i]);
          }
        } 

        $rootScope.allNote.splice(0);
        $rootScope.noteLen = 0;
        deleteAllNote("all","diagnostic_center_notification")
      });
    }
  }

   var reverseNote = [];//this holds notic=fation from backend based on how new it is
   var deletedNote = [];//this holds all deleted notifications

  $rootScope.viewNote = function(id,fromList,newPatient,note){
    templateService.holdId = id;
    //view test from work list does not need to go through backend since data that populated the list is already there
    if(fromList && !newPatient) {
      var list = $rootScope.attendanceList; //refers to work list
      var pageUrl = "/radiology/view-test/" + id;
      localManager.setValue("currPageForRadiology",pageUrl);
      $location.path(pageUrl);
      var elementPos = list.map(function(x) {return x.ref_id}).indexOf(id);
      localManager.setValue("radiologyData",list[elementPos]);
    } else {

      //view test from notification icon goes to the backend to get patient data;    
      var labTest = radioTestsService; //$resource("/user/radiology/get-referral");
      labTest.get({refId: id},function(data){
       
        localManager.setValue("radiologyData",data); //pharmacyData refers to patients prescription
        var pageUrl = "/radiology/view-test/" + id;
        $location.path(pageUrl);
        localManager.setValue("currPageForRadiology",pageUrl);
        deleteByRefId(id,"diagnostic_center_notification")
      });   
    } 

    if(!note.viewed)
     notification.updateStatus({refId: id},function(res){
        note.viewed = res.updated;
     })

  }

   function deleteByRefId(id,field){
    var msg = "no alert";
    var del = new deleteFactory(id,field);
    del.deleteItem("/user/delete-one/refId",msg);//deletes notification once it is viewed.
    if($rootScope.noteLen > 0)
      $rootScope.noteLen--;    
  }

   function deleteAllNote(id,field){
    var msg = "Notification deleted";
    var del = new deleteFactory(id,field);
    del.deleteItem("/user/delete-many",msg);//deletes notification once it is viewed.
    $rootScope.noteLen = 0;
  }

  //controls chat indictor and notifications
  $scope.showIndicator = false;
  $rootScope.$on("unattendedMsg",function(status,data){
    $scope.showIndicator = data;
  });
  
  mySocket.on("notification",function(response){
    if(response.status){      
      getNotification();
      templateService.playAudio(2);
    }
  });

  mySocket.on("center notification",function(data){
    templateService.playAudio(3);
    $rootScope.allNote.unshift(data);
    $rootScope.noteLen++;
  });

  $rootScope.loadChats = function() {
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
  $rootScope.loadChats();

  $scope.viewChat = function(partnerId) {
    templateService.holdId = partnerId;
    $location.path("/general-chat");
     $scope.showIndicator = false;
  }


  //courier services
  var courierResponse = courierResponseService;

  function getCourier() {
    courierResponse.query(function(data){
      $rootScope.courierResponseList = data;
      $scope.unRead = data[0];
     
    });
  }

  mySocket.on("courier billed",function(res){
    getCourier();
  });

  mySocket.on("new courier order",function(res){
    getCourier();
  });


  $rootScope.$on('new courier order',function(status,res){
     getCourier();
  })

  var pt;

  $scope.viewResponse = function(item) {
    $rootScope.courierResponse = item;
    pt = '/courier-response/' + Math.floor(Math.random() * 99999999);
    $location.path(pt);
  }

  getCourier();

}]);


//works just like referredPatientController. Lab center search for a patient with ref_id or phone number of the patient as search criteria.
//Object is returned from the backend and displayed on lab-view-test.html template.
app.controller("radioReferredPatientController",["$scope","$location","$http","templateService","localManager",
  function($scope,$location,$http,templateService,localManager) {
  $scope.patient = {};

  $scope.isNotOption = true;

  $scope.showOption = function(){
     $scope.error = "";
     $scope.isNotOption = false;
     if(!$scope.isOption){
      $scope.isOption = true;
     } else {
      $scope.isNotOption = true;
      $scope.isOption = false;
     }
  }

  $scope.findTest = function(){
    if($scope.patient.ref_id){
      $scope.patient.criteria = "refIdCriteria";       
    } else if($scope.patient.phone) {
      $scope.patient.criteria = "phoneCriteria";
    }

    if(Object.keys($scope.patient).length > 0) {
      typeOfSearch($scope.patient);

    } else {
      alert("Please enter search criteria in the text field")
      return;
    }
  }
    

  var typeOfSearch = function(criteria) {   
  $scope.loading = true;  
    $http({
        method  : 'PUT',
        url     : "/user/radiology/find-patient/scan-test",
        data    : criteria,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(response) { 
        //$scope.patient = {};
        if(response.length > 0) {
          $scope.tests = response;            
        } else {
          $scope.error = "Patient not found!";
        }
        $scope.loading = false;
    });
  }

  $scope.viewRadioTest = function(test){
    templateService.holdId = test.ref_id;
    
    var pageUrl = "/radiology/view-test/" + test.ref_id;
    localManager.setValue("radiologyData",test);
    localManager.setValue("currPageForRadiology",pageUrl);
    $location.path(pageUrl);
  } 

}]);

app.controller("radioCenterPanelController",["$scope","$location","$http","templateService","localManager",
  function($scope,$location,$http,templateService,localManager) {
    $scope.dashboardhome = function(){
      $location.path("/referral/radiology-test");
    }
}]);


app.service("radioSearchTestService",["$resource",function($resource){
  return  $resource("/user/radiology/search/find-tests",null,{findCenter:{method:"PUT"}});
}]);

app.service("radioToService",["$resource",function($resource){
  return $resource("/user/center/radiology/send-test",null,{sendTest:{method: 'POST'}});
}]);

app.controller("radioTestControler",["$scope","$location","$http","templateService","localManager","ModalService",
  "multiData","scanTests","$rootScope","$resource","$rootScope","cities","billingAuthService","paymentVerificationService",
  "radioSearchTestService","radioToService","phoneCallService",
  function($scope,$location,$http,templateService,localManager,ModalService,multiData,
    scanTests,$rootScope,$resource,$rootScope,cities,billingAuthService,paymentVerificationService,
    radioSearchTestService,radioToService,phoneCallService) {
  
    var objectFound = localManager.getValue("radiologyData");
    var holdInitialTestToRun = objectFound.radiology.test_to_run;

    if(objectFound !== null && !objectFound.radiology.session_id) {
      var testArr = objectFound.radiology.test_to_run;
      for(var i = 0; i < testArr.length; i++){
        testArr[i].select = true;
      }
      var holdInitialTestToRun = testArr;
      $scope.refInfo = objectFound;
    } else {
      objectFound.radiology.test_to_run.forEach(function(item){
        item.select = true;
      })
      var holdInitialTestToRun = objectFound.radiology.test_to_run;
      $scope.refInfo = objectFound;
    }

    $http({
    method  : 'GET',
    url     : "/api/dicom-details?centerId=" + $rootScope.checkLogIn.user_id,
    headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {              
      $scope.dicomDetails = data;
    }); 

    fill(objectFound)


    /*$scope.specimen = [{name: "Blood",status: false},
    {name: "Urine",status: false},{name: "Stool",status: false},
    {name: "Semen",status: false},{name: "Saliver",status: false},{name: "Mucus",status: false}]*/

    function fill(obj) {

      var allTests = scanTests.listInfo1.concat(scanTests.listInfo2,scanTests.listInfo3,scanTests.listInfo4,scanTests.listInfo5,
      scanTests.listInfo6);


      var list = [{sn:'a'}];
      $scope.inputctrl = [{sn:"a"}];
      var testName;
      var thisCity;
      

      $scope.getTest = function(name){
        testName = name;
      }

      $scope.testList = list;

      $scope.tests = allTests;
      var index = 0;

     
      $scope.add = function(){        
        if(testName !== "" && testName !== undefined) {   
          if(!/^[A-Z]/.test( testName))
            testName = toTitleCase(testName);
          var elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName)
          var objFound = $scope.tests[elementPos];
          if( elementPos === -1) {
            alert("There is no test match. Make sure you entered the test name correctly.")
          } else {
            
            if(list.length > 1){
              var pos = list.length-1
              var random = Math.floor(Math.random() * 1000);
              list[pos].sn = random;
              list[pos].name = objFound.name;
              list[pos].id = objFound.id;
              list[pos].select = true;
            }
                  
            if(!list[0].name) {              
              list[0].name = objFound.name;
              list[0].id = objFound.id;
              list[0].select = true;
            } 

            var obj = {};
            list.push(obj);            

            index++;
           
            $scope.inputctrl.push({sn:"b"});
            if($scope.inputctrl.length > 0)
              $scope.inputctrl.splice(0,1);
          }
         
        } else {
          alert('Please enter test name');
        }
       
      }

      $scope.remove = function(id){    
        if(list.length > 1){
        var elementPos = list.map(function(x){return x.sn}).indexOf(id)
        var objfound = list.splice(elementPos,1);
        } else {
          list.splice(0,1)
        }
      }

      if(localManager.getValue("history")) {
         $scope.refInfo.history = localManager.getValue("history");
      }


      $scope.testToRunFilled = function(){
        var sendObj = {};        
        var elementPos;
        var objFound; 
        if(list.length === 1) {
          if(testName !== undefined && testName !== "") {
            if(!/^[A-Z]/.test( testName))
               testName = toTitleCase(testName);     
            elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName)
            objFound = $scope.tests[elementPos];
            if( elementPos === -1) {
              alert("There is no test match based on your search criteria. Make sure you entered the test name correctly.")
            } else {
              list[0].name = objFound.name;
              list[0].id = objFound.id; 
              list[0].select = true;     
              obj.radiology.test_to_run = list            
            }
          } else {
            alert("Please enter the test name")
          }
        } else {
          var last = list.length-1;
          if(list[last].name !== "" && list[last].name !== undefined){
            elementPos = $scope.tests.map(function(x){if(x !== undefined){return x.name}}).indexOf(testName);
            if(elementPos !== -1){
              objFound = $scope.tests[elementPos];
              list[last].name = objFound.name;
              list[last].id = objFound.id;
              list[last].select = true;      
              obj.radiology.test_to_run = list;
            } else {
              alert("Test name does not exist on our database! Please select from dropdown list.");
            }
          } else {
            for(var i = 0; i < list.length; i++){
              if(!list[i].name){
                list.splice(i,1);
              }
            }
            obj.radiology.test_to_run = list;
          }
          
        }

        obj.isPatient = true;
      }

    }//end of fill function

  $scope.toList = function(firstname,lastname,profilePicUrl,ref_id,date){
    var listObj = {};
    listObj.firstname = firstname;
    listObj.lastname = lastname;
    listObj.profile_pic_url = profilePicUrl;
    listObj.ref = ref_id;
    listObj.date = date;
    var toStr = ref_id.toString();
    if(!templateService.checkInTheList.hasOwnProperty(toStr)) {      
      templateService.checkInTheList[toStr] = true;
      templateService.holdList.push(listObj);
      
    }
  }


  $scope.hasPreviewed = true;
  $scope.hasSent = true;
  $scope.lab = {};

  $scope.isResult = true;
  
  var check = {}
  check.count = 0;
  $scope.$watch("refInfo.radiology.test_to_run",function(newVal,oldVal){
    if(newVal) {
      check.count++;
      updateList(newVal);
      bill(newVal);
    }
  },true);

  function updateList(testArr) {
    var ranTest = [];
    var unRanTest = [];    

    for(var i = 0; i < testArr.length; i++){
      if(testArr[i].select === true) {          
          ranTest.push(testArr[i]);
      } else {
        unRanTest.push(testArr[i]);
        ranTest.splice(i,1)
      } 
    }

   
    $scope.testReport = ranTest;
    $scope.unRantest = unRanTest;   
   
  }


  /////////////////////////////////
// this logic is good for adding amount of picked drug to the total of all picked drugs. It may be good logic for shopping cart

  var testForPay = {}; 
  testForPay.pickedTests = [];
  
  var totalCost = {};
  totalCost.sum = 0;
  $scope.str = "";
  $scope.grabRawAmount
 

  function bill (newVal) {
    if(newVal){
      for(var i = 0; i < newVal.length; i++){
        if(newVal[i].select && newVal[i].select === true && !newVal[i].added){
          var selectedTest = {
            name: newVal[i].name,
            amount: 0,
            id: newVal[i].sn,
            added: true
          }
          testForPay.pickedTests.push(selectedTest);
          newVal[i].added = true;
          totalCost.sum = 0;
          updateTotal();
         
        } else if(newVal[i].select === false){          
          for(var j = 0; j < testForPay.pickedTests.length; j++){                  
            if(testForPay.pickedTests[j].id === newVal[i].sn){                                                      
              var remove = testForPay.pickedTests.splice(j,1);                     
              delete newVal[i].added;
              break;                                         
            }
          } 
          totalCost.sum = 0;
          updateTotal();
        }
      }
    }
  }
  

  $scope.testsForSurchage = testForPay.pickedTests;
  

  $scope.$watch("testsForSurchage",function(newVal,oldVal){
    if (newVal !== null) {
      for(var k = 0; k < newVal.length; k++) {        
       if(oldVal.length > 0 && newVal[k].added) {
        totalCost.sum -= oldVal[k].amount;
        totalCost.sum += newVal[k].amount;
        toNaira(totalCost.sum);
       } 

      }        
    }
  },true); 

  function updateTotal() {
    if(testForPay.pickedTests.length > 0){
      var tests = testForPay.pickedTests;
      for(var l = 0; l < tests.length; l++){
        tests[l].added = true;
        totalCost.sum += tests[l].amount;
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
     $scope.grabRawAmount = val;
    $scope.commissionedAmount = "NGN" + ( val - (val * ($rootScope.checkLogIn.city_grade / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var count = 0;
  // sending billing to patient which otp will be send to patient informing the patient the toal cost of the bill.
  $rootScope.sendBill = function(patientId,oldTime,phoneCall) {
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
      if(count < 5) {
        phoneCallService(sendObj,'/user/payment/verification','POST'); 
        $rootScope.showCallingMsg = "This patient will receive a phone call in just a moment. Please enter the pin heard from the voice call below...";
      } else {
        alert("Sorry, you have exceeded call limit. Please contact us for assistance.");
      }
    } else {
      $scope.loading = true;
       if($scope.otpError)
          $scope.otpError = null;
      var otp = paymentVerificationService; 
      otp.verify(sendObj,function(data){
        $scope.loading = false;
        if(data.success){
          $scope.otpMsg = data.message
        } else {
          alert(data.message);
        }
        
      });
    }
  }

  $scope.call = function(patientId,oldTime) {
    $rootScope.sendBill(patientId,oldTime,'isCall')
  }


   //$scope.dicomPath = $scope.getFolderPath();
  /*$scope.getFolderPath = function(){
    var str = ""; 
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var d = + new Date();
    var a = d.toString();
    var id = a.substr(a.length - 4);
    var random;
    for(var i = 0; i < 4; i++) {
        random = Math.floor(Math.random() * letters.length - 1);
        str += letters[random];
    }
    return $scope.refInfo.radiology.patient_firstname + "_" + id + "_" +  str;
    
  }*/

  $scope.radio = {
    type : "dicom"
  }


  var billAuth = billingAuthService; //$resource("/user/center/billing-verification",null,{verify: {method: "PUT"}})
  billAuth.get({refId: $scope.refInfo.ref_id},function(data){
    $scope.paymentStatus = data.payment; 
    $scope.paymentDetail = data.detail || {};
  });

  $scope.refInfo.radiology.studyId = "A" + Math.floor(Math.random() * 9999) + "" + Math.floor(Math.random() * 999);

  $scope.verifyPay = function(refInfo) {
    if($scope.lab.otp && $scope.lab.otp !== "") {
      if($scope.otpError)
        $scope.otpError = null;
      var theStringTests = combineTest($scope.testReport);
      var converToStr = theStringTests.join();
      var date = + new Date();
      var pin = $scope.lab.otp;
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
      refInfo.radiology.date = date;
      refInfo.radiology.v_pin = newStr;
      refInfo.radiology.strAmount = $scope.str;
      refInfo.payObj = {
        total: $scope.grabRawAmount,
        doctorId: refInfo.radiology.doctor_id || "admin",
        //this refInfo.referral may be the center's id who will be credited if test was not written by a doctor.it should be modified
        type: "Radiology",
        patientId: refInfo.radiology.patient_id,
        doctorPhone: refInfo.radiology.doctor_phone,
        patient_firstname: refInfo.radiology.patient_firstname,
        patient_lastname: refInfo.radiology.patient_lastname,
        ref_id: refInfo.ref_id
      }

      $scope.loading = true;
      billAuth.verify(refInfo,function(response){
        $scope.loading = false;
        if(response.payment){          
          $scope.otpMsg = null;
          $scope.paymentStatus = response.payment;
          $scope.paymentDetail = response.detail;
          var round = Math.round(response.balance)
          var format = "NGN" + round.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          $rootScope.balance = format;
        } else {
            $scope.otpError = response.message;
        }
      })
    }
  }


  /////////////////////////////////////////////////////

  $scope.result = function(refInfo){
    $scope.isResult = true;
    $scope.hasPreviewed = false;
   
  }

  $scope.refresh = function(){
    if($scope.refInfo.history && $scope.refInfo.history !== "") {
      localManager.setValue("history",$scope.refInfo.history)
    }

    var random = Math.floor(Math.random() * 100);
    $location.path("/radiology/view-test/" + random);   
  }


  $scope.newPayment = function() {
    $scope.otpMsg = null;
    $scope.paymentStatus = false;
  }


  //for entering of radio test report

  /*$scope.createInputList = function(test) {
    if(!test.list)
      test.list = [{}];
  }

  $scope.addReport = function(reportInput) {
    reportInput.list.push({})
  }

  $scope.removeReport = function(reportInput) {
    if(reportInput.list.length > 1)
      reportInput.list.pop()
  }*/

  

  $scope.previewTestResult = function(refInfo){
   
    $scope.compute = "";
    $scope.incomplete = "";
    $scope.uploadStatus = "";
    $scope.reportDate = + new Date();
   

    if($scope.progress !== 100 && $scope.progress ) {
      $scope.uploadStatus = "Please wait files still uploading... " 
      return;
    }

    if($scope.grabRawAmount === 0 || !$scope.grabRawAmount) {
      $scope.grabRawAmount = 0;
      $scope.compute = "Warning: Zero amount is billed for this service";
    }
    
    $scope.hasPreviewed = false;
    $scope.errorList = [];
    refInfo.radiology.test_to_run = $scope.testReport;
    refInfo.radiology.test_to_run.forEach(function(test){
      if(!test.data) {
        $scope.errorList.push(test.name);
      }
    });

    $scope.$watch("errorList",function(newVal,oldVal){
      if( $scope.errorList.length > 0 ) {

        $scope.incomplete = "Please enter report for " + '" ' + $scope.errorList[0] + ' " below.';
      } else if($scope.lab.conclusion !== undefined) {             
        $scope.incomplete = "";
        $scope.isPreview = true;
        $scope.isResult = false;
      } else {
        $scope.incomplete = "Please write your conclusion based on the test reports";
      }        
      
    });

    $scope.preTest = $scope.testReport;
   
    
  }


  $scope.edit = function(){
    $scope.isPreview = false;
    $scope.isResult = true;
  }

  var theStringTests,
      converToStr,
      date,
      report,
      url;
  $scope.sendTestResult = function(refInfo){ 
    /*theStringTests = combineTest($scope.testReport);
    converToStr = theStringTests.join();*/
    var reportSheet = combineTest($scope.testReport);
    date = + new Date();

    refInfo.radiology.report = reportSheet;
    refInfo.radiology.acc = $scope.lab.acc;
    refInfo.radiology.test_ran = $scope.testReport;
    refInfo.radiology.conclusion = $scope.lab.conclusion;
    refInfo.radiology.test_to_run = holdInitialTestToRun;
    refInfo.radiology.date = date;
    refInfo.radiology.filesUrl = templateService.holdScanImageList;
    refInfo.payObj = {
      total: $scope.grabRawAmount,
      doctorId: refInfo.radiology.doctor_id || "admin",
      //this refInfo.referral may be the center's id who will be credited if test was not written by a doctor.it should be modified
      type: "Radiology",
      patientId: refInfo.radiology.patient_id,
      doctorPhone: refInfo.radiology.doctor_phone,
      patient_firstname: refInfo.radiology.patient_firstname,
      patient_lastname: refInfo.radiology.patient_lastname,
      ref_id: refInfo.ref_id
    }

    refInfo.onlinePacs = $scope.dicomDetails;

     if(refInfo.radiology.session_id) {
        url = "/user/radiology/test-result/session-update";
        msg = "SUCCESS!!! Test result sent to Dr " + refInfo.referral_firstname + " " + refInfo.referral_lastname;
      } else {
        url = "/user/radiology/test-result/patient-scan-update"
        msg = "Success!!! Test report sent to patient";
      }
      $scope.loading = true;
      report = $resource(url,null,{sendReport:{method: "PUT"}});
      report.sendReport(refInfo,function(response){
        if(response.status === "success") {
          alert(msg);
          if($scope.unRantest.length > 0) {
            templateService.holdUnranTest = $scope.unRantest;
            forwardUnRanTest($scope.unRantest);          
          }
          $scope.reportSuccess = true;
          localManager.removeItem("history")
        } else {

          alert("Error ocurred while sending your report. Please try again.");
          $scope.error = "Error ocurred while sending your report. Please try again."
          //$scope.edit()
        }

        $scope.loading = false;
      });

  }

  
  $scope.radio = {};
  $rootScope.uploadScanImage = function(){
    
    var arr = $scope.radio.scanImage;
    $scope.radio.ImageId = $scope.refInfo.ref_id;
   
    /*multiData.sendPic("/user/radiology/upload-scan",arr); this eservice was not used due to we need to put file loader as the  files loads */
    
    var uploadUrl = "/user/radiology/upload-scan";     
    var fd = new FormData();
    var xhr = new XMLHttpRequest;

    
    for(var i = 0; i < arr.length; i++){
        fd.append(arr[i].name,arr[i]);
    };

    var xhr = new XMLHttpRequest()
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
 
  
    xhr.open("PUT", uploadUrl)
    xhr.send(fd);
    $scope.progressVisible = false

  }

  
   
    function uploadProgress(evt) {
        $scope.progressVisible = true;
        $scope.$apply(function(){
            if (evt.lengthComputable) {
              
                $scope.progress = Math.round(evt.loaded * 100 / evt.total)
               
                
            } else {
                $scope.progress = 'unable to compute'
            }
        })
    }

    function uploadComplete(evt) {
      /* This event is raised when the server send back a response */
      //alert(evt.target.responseText)
      $scope.$apply(function(){
        $scope.userData = JSON.parse(evt.target.responseText);
       
      })
       
    }

    function uploadFailed(evt) {
      alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
      $scope.$apply(function(){
        $scope.progressVisible = false
      })
      alert("The upload has been canceled by the user or the browser dropped the connection.");
    }

  


  function combineTest(testArray) {
    var report = [];
    testArray.forEach(function(test){
      //val = "" +  test.name + ":"  + " " + test.data;
      report.push({
        name: test.name,
        report_sheet: test.data
      })
    });
    return report;
  }

  $scope.isToForward = false;

  function forwardUnRanTest(unRantestArray) {    
    ModalService.showModal({
        templateUrl: 'unsent.html',
        controller:  "unRanTestModalController"
    }).then(function(modal) {
      modal.element.modal();

        getCenters();        
      modal.close.then(function(result) {          
        
      });
    });

  }

  var user;
  $scope.customGetLab = function(){
    //templateService.holdSelectedLabTest = $scope.unRanTest;          
    //var objectFound = localManager.getValue("radiologyData");          

    //objectFound.radiology.test_to_run = $scope.unRanTest;

    //templateService.holdReferral = objectFound;
    
    //$location.path("/radiology/find-radiology");

    $scope.isCriteria = true;
    $scope.user.city = user.city;

  }

  $scope.isCriteria = false;
  $scope.user = {};
  $scope.redirectTest = function(){
    getCenters()
  }

  $scope.cancel = function () {
    $scope.hasSent = true;
    $scope.isToForward = false;
  }

  //sends test for search from updated services collections from the database on backend
  function getCenters() {
    $scope.isToForward = true;
    $scope.hasPreviewed = false;
    $scope.isPreview = false;
    $scope.hasSent = false;
    $scope.isRefresh = false;
    //$scope.unRanTest = unRanTest;

    templateService.holdUnranTest = [];
    objectFound.radiology.newList = [];

    for(var i = 0; i < objectFound.radiology.test_to_run.length; i++) {
      if(!objectFound.radiology.test_to_run[i].select) {
        templateService.holdUnranTest.push(objectFound.radiology.test_to_run[i]);
      } else {
        objectFound.radiology.newList.push(objectFound.radiology.test_to_run[i]);
      }
    }

    $scope.cities = cities;
    $scope.unRanTest = templateService.holdUnranTest;
    
  

 
    var searchTest = radioSearchTestService; //$resource("/user/radiology/search/find-tests",null,{findCenter:{method:"PUT"}});
    var toCenter = radioToService; //$resource("/user/center/radiology/send-test",null,{sendTest:{method: 'POST'}});
    function getResource() {
       if(!$scope.user.city && $scope.user.city !== "") {
          user = localManager.getValue("resolveUser");
        } else {
          user = $scope.user;
        }
      $scope.loading = true;
      searchTest.findCenter({city:user.city,testList:templateService.holdUnranTest},function(data){
        $scope.loading = false;
        $scope.testResult = data;
        $scope.getStr = function(str){
          var newStr = "";
          var strArr = str.split(",");
          for(var i = 0; i < strArr.length; i++){
            newStr += "@" + strArr[i] + " "
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
      });
    }

    $scope.toForwardToCenter = function(center) {
      //here the objectfound refers to the patient ref data send initially.
      //the test_to_run is set to unranTest to send to the backend. other values is thus maintained for center to forward to another center.
      objectFound.user_id = center.id // sets the seleted center's id to locate the center in the database.
      center.loading = true;
     
      toCenter.sendTest(objectFound,function(data){
        center.loading = false;
        if(data.success){
          center.status = true;
        } else {
          center.status = false;
        }
       objectFound.radiology.test_to_run = objectFound.radiology.newList;
      });
    }

    $scope.find = function(){
      getResource();
    }

    getResource();
  }

  function toTitleCase(str)
  {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

}]);

app.controller("unRanTestModalController",["$scope","$location","templateService",function($scope,$location,templateService){
  $scope.unRanTest = templateService.holdUnranTest;
}]); 



app.controller("radiologyfindRadioController",["$scope","$http","$location","templateService",function($scope,$http,$location,templateService){
  $http({
      method  : 'GET',
      url     : "/user/doctor/find-radiology",// this route is use both for doctor and laboratory to find a center.
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {          
      if(data.length > 0) {
        $scope.isFound = true;
        $scope.radioCenters = data;
      } else {        
        $scope.isError = true;
        $scope.message = "Oops! Currently, It seems there are no radiology center registered within your location. You can search for other locations";
      }
  });

  $scope.radiology = {};

  $scope.search = function() {    
    $http({
      method  : 'PUT',
      url     : "/user/doctor/find-radiology/search", //this route is use both for doctor and laboratory to find a center.
      data : $scope.radiology,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
      if(data.length > 0)  {
        $scope.isError = false;
        $scope.isFound = true;             
       $scope.radioCenters = data;
      } else {
        $scope.isFound = false;
        $scope.isError = true;
         $scope.message = "Oops! No Radiology center was found based on your search criteria.Try again or check modify your search criteria.";
      }
    });
  }

  $scope.getLab = function(id){     
    var elementPos = $scope.radioCenters.map(function(x) {return x.user_id; }).indexOf(id);
    var objectFound = $scope.radioCenters[elementPos];          
    templateService.holdTheRadiologyToFowardTestTo =  objectFound;
   
    $location.path('/radiology/selected-radiology/' + id);
  }

}]);

app.controller("radiologySelectedRadioController",["$scope","$http","localManager","$location","templateService",
  function($scope,$http,localManager,$location,templateService){
    $scope.placeHolder = true
  $scope.radioCenter = templateService.holdTheRadiologyToFowardTestTo;
  
  $scope.isEnquiry = function(){
    $scope.isContactFirst = true;
  } 

   
  
  $scope.sendTest = function () {
    var sendObj = templateService.holdReferral;
    var date = new Date();
    sendObj.date = date;
    sendObj.user_id = $scope.radioCenter.user_id;
    //create patient object to be sent alongside the lab test to run.
    
    //sending lab test to a selected lab center to the backend for storage;
    
    $http({
      method  : 'POST',
      url     : "/user/center/send-test",
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
     
      if(data.success){
        $scope.success = true;
        $scope.placeHolder = false;
        $scope.ref_number = data.ref_no;
        $scope.message = "scan has been forwrded";
      } else {
        $scope.message = "Error occured wihile sending the scan test. Try again.";
      }
    });
  }

}]);

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
        alert("No result found based on your search criteria.Please check to see if the city name or the name is spelt correctly.")
      }
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

  if($rootScope.checkLogIn.typeOfUser !== 'Patient') {
    $scope.data.phone = "";
  }

  $scope.cancel = function(){
    $scope.isToSomeOne = false;
    $scope.user.someone = false;
    if($scope.data.phone)
      $scope.data.phone = "";
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

    /*if( $rootScope.checkLogIn.typeOfUser !== 'Patient') {

      if($scope.mode !== 'inperson') {
        if(!$scope.data.phone) {
          $scope.phoneMsg = "Enter recipient's phone number";
          return;
        }

      
      }
    }*/

    if($scope.mode !== 'inperson') {
      if(!$scope.data.phone) {
        $scope.phoneMsg = "Enter recipient's phone number";
        return;
      }

      /*if(!$scope.data.provisional_diagnosis) {
        $scope.provisionalMsg = "Enter description";
        return;
      }*/
    }

    //if not to someone then phone number is not needed.
    $scope.data.phone = (!$scope.mode) ? $rootScope.setPhone($scope.data.phone) : undefined;

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
    send($scope.data,"/user/drug-search/pharmacy/referral");
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
      if(data.error) {
        alert(data.error);
        //$scope.isEMP = true;
      } else {
        //if(!courier) {          
          $scope.isContent = false;
          $scope.isSent = true;
          $scope.result = data.ref_id;
        //} else {
          //$location.path('courier')
        //}
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
    $scope.isLoading = true;
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
  $scope.someone = function(){
    $scope.user.someone = true;
    $scope.isToSomeOne = true;
  }

  $scope.back = "#/laboratory/test-search/result";

  $scope.cancel = function(){
    $scope.isToSomeOne = false;
    $scope.user.someone = false;
    if($scope.data.phone)
      $scope.data.phone = ""
  }

  $scope.isContent = true;

  if($rootScope.checkLogIn.typeOfUser !== 'Patient') {
    $scope.data.phone = "";
  }

  $scope.send = function (type){ 

    if(type !== 'inperson') {
      if(!$scope.data.phone) {
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
    $scope.data.ref_id = random;
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
    send($scope.data,"/user/test-search/laboratory/referral");
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
      if(data.error) {
        alert(data.error);
        $scope.isEMP = true;
      } else {
        $scope.isContent = false;
        $scope.isSent = true;
        $scope.result = data.ref_id;
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
    $scope.user.someone = false;
    if($scope.data.phone)
      $scope.data.phone = ""
  }

  $scope.isContent = true;

  if($rootScope.checkLogIn.typeOfUser !== 'Patient') {
    $scope.data.phone = "";
  }

  $scope.send = function (){  
    var type = ($scope.user.someone) ? "someone" : "inperson";
    $scope.data.recepient = ($scope.user.someone) ? $scope.data.phone : null;

    if(type !== 'inperson') {
      if(!$scope.data.phone) {
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
    $scope.data.ref_id = random;
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
    
    send($scope.data,"/user/scan-search/radiology/referral");
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
      if(data.error) {
        var msg = data.message || data.error;
        alert(msg);
        //$scope.isEMP = true;
      } else {
        $scope.isContent = false;
        $scope.isSent = true;
        $scope.result = data.ref_id;
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

app.controller("helpController",["$scope","$location","$window","$http","templateService","localManager","templateUrlFactory",
  "symptomsFactory","cities","multiData","ModalService","$rootScope",
function($scope,$location,$window,$http,templateService,localManager,templateUrlFactory,symptomsFactory,
  cities,multiData,ModalService,$rootScope){
 
  $scope.user =  {};
  var patient = localManager.getValue("resolveUser");

  //$scope.isPWR = true;
  
  $scope.pageUrl  = templateUrlFactory.getUrl();
  
  var date = + new Date();
  $scope.user.date = date;
  var list = [{sn:"a"}];
  var symptom; 
  var index = 0;

  /* this route gets first line doctors for easy access by patients to  just communicate without filling a form */
  $http({
    method  : 'GET',
    url     : "/user/firstline-doctors", //firstline doctors refers to doctors that attends to patients with any consultation
    //requests for treatment. Examples are doctors applinic employed for attending to patients.
    headers : {'Content-Type': 'application/json'} 
  })
  .success(function(data) {   
    $scope.firstlineDoctors = data;
  });

  var checkPresence;

  $scope.continue = function(doc) {
    checkPresence = _.invert($rootScope.sockets);
    if(!checkPresence[doc.user_id]) {
      doc.loading = true;
      $http({
        method  : 'POST',
        url     : "/user/firstline-doctors",
        data    : doc,
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data) { 
        var path = "/patient-doctor/treatment/" + doc.user_id;
        doc.loading = false;
        $location.path(path);
      });      
    } else {
      var path = "/patient-doctor/treatment/" + doc.user_id;
      $location.path(path);
    }

    $rootScope.tempDoctor = doc;
  }

  $scope.getCity = function(city){
    thisCity = city;
  } 

  $scope.cities = cities;

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
  $scope.user.sick = true;

  $scope.add = function(){
    index++;    
    var sympArr = {};
    list.push(sympArr);
  }

  $scope.remove = function(sn){
    index--;
    var remove = list.splice(sn,1);
  }

  $scope.choose = function(type){
    if(type == "pwr") {
      $scope.isPWR = true;
      $scope.isLive = false;
    }
    else {
      $scope.isLive = true;
      $scope.isPWR = false;
    }
  }

  $scope.validate = function() {
    $scope.sympMsg = "";
    $scope.pregMsg = "";
    $scope.accMsg = "";
    $scope.parMsg = "";
    $scope.earMsg = "";
    $scope.eyeMsg = "";
    $scope.teeMsg = "";
    $scope.lmpMsg = "";
    $scope.getPregnantMsg = "";

    if($scope.user.sick) {
      if(!$scope.symptomsList[0].name || $scope.symptomsList[0].name === "") {
        $scope.sympMsg = "Add symptoms of your sickness";
        return false;
      }
    }

    if($scope.user.pregnant) {
      if(!$scope.user.duration) {
        $scope.pregMsg = "Please select how long you have been pregnant.";
        return false;
      }
    }

    if($scope.user.accident) {
      if(!$scope.user.injuries) {
        $scope.accMsg = "Please write the injuries sustained.";
        return false;
      }
    }

    if($scope.user.getPregnant) {
      if(!$scope.user.getPregIssue) {
        $scope.lmpMsg = " Please select when you had your last menstruation."
        return false;
      }

      if(!$scope.user.lmp) {
         $scope.user.getPregnantMsg = "Please briefly explain the problem you're having with pregnacy."
         return false;
      }
     
    }

    if($scope.user.stroke) {
      if(!$scope.user.paralysis) {
        $scope.paraMsg = "Please write the paralysis sustained.";
        return false;
      }
    }


    if($scope.user.eye) {
      if(!$scope.user.eyeIssue) {
        $scope.eyeMsg = "This field cannot be empty.";
        return false;
      }
    }

     if($scope.user.ear) {
      if(!$scope.user.earIssue) {
        $scope.earMsg = "This field cannot be empty.";
        return false;
      }
    }

    if($scope.user.teeth) {
      if(!$scope.user.teethIssue) {
        $scope.teeMsg = "This field cannot be empty.";
        return false;
      }
    }

    if($scope.user.personal) {
      if(!$scope.user.personalIssue) {
        $scope.personalMsg = "This field cannot be empty.";
        return false;
      }
    }

    if($scope.user.other) {
      if(!$scope.user.otherIssue) {
        $scope.otherMsg = "This field cannot be empty.";
        return false;
      }
    }


    sendComplait();

  }

  var sendComplait  = function(){
    $scope.loading = true;
    $scope.user.description = "";
    if($scope.user.sick) {        
        var str = "";
        for(var i = 0; i < $scope.symptomsList.length ; i++) {
          str += $scope.symptomsList[i].name + "<br>";
        }

        $scope.user.description += '<blockquote>' + str + "</blockquote>";
       
       

        if($scope.user.period) {
           $scope.user.description += "<br>Symptom(s) have lasted for " +  $scope.user.period +
            " till date.<br>";
        }

        if($scope.user.how) {
          $scope.user.description += "Brief history of the sickness was stated as it is: <br>" +
           "<blockquote>" + $scope.user.how + ".</blockquote>";
        }

        
      } 

      if($scope.user.getPregnant){

        if($scope.user.getPregIssue) {
           $scope.user.description += "This patient wants to <b>get pregnant</b> <br>Brief issue this patient has with pregnancy was stated as written: <br>" +
           "<blockquote>" + $scope.user.getPregIssue + ".</blockquote>";
        }

        if($scope.user.lmp){
          if($scope.user.lmp === 'I am in menopause') {
             $scope.user.description += "<br>This patient is in <b> menopause</b> ";
          } else {
             $scope.user.description += "<br>This patient last <b> menstruation </b> was <b> " +  $scope.user.lmp + "</b><br>";
          }
        }
      }

      if($scope.user.pregnant) {
        $scope.user.description += "This patient is  <b> " + $scope.user.duration + " pregnant</b>.<br>";
      }

      if($scope.user.accident) {
        $scope.user.description += "This patient had  <b> an accident </b> and sustained injuries as stated:<br>" +
         "<blockquote> " + $scope.user.injuries + "</blockquote>";
      }

      if($scope.user.stroke) {
         $scope.user.description += "This patient had <b> stroke </b> and sustained paralysis as stated: <br>" +
         "<blockquote>" + $scope.user.paralysis + "</blockquote>";
      }

      if($scope.user.ear) {
         $scope.user.description += "This patient is having <b> an ear</b> problem as explained: <br>" +
         "<blockquote>" + $scope.user.earIssue + "</blockquote>";
      }

      if($scope.user.eye) {
         $scope.user.description += "This patient is having <b>an eye</b> problem as explained: <br>" +
         "<blockquote>" + $scope.user.eyeIssue + "</blockquote>";
      }

      if($scope.user.teeth) {
         $scope.user.description += "This patient is having <b>teeth</b> problem as explained: <br>" +
         "<blockquote>" + $scope.user.teethIssue + "</blockquote>";
      }

      if($scope.user.personal) {
         $scope.user.description += "This patient needs a personal doctor. The reason is explained below: <br>" +
         "<blockquote>" + $scope.user.personalIssue + "</blockquote>";
      }

      if($scope.user.other) {
         $scope.user.description += "Other issues this patient had were also explained below: <br>" +
         "<blockquote>" + $scope.user.otherIssue + "</blockquote>";
      }


     /* if($scope.patient.hasMedicated) {
         $scope.patient.history += "This patient has tried other medications or self medications but the complaints persisted."
      }*/


    if(list[0].name !== undefined);
      
    $scope.user.userId = patient.user_id;
    $scope.user.symptoms = list;
    $scope.user.city = thisCity;
    var data = $scope.user;

    if(!$scope.user.description || $scope.user.symptoms.length === 0) {
      alert("Please add symptoms you're experiencing or briefly describe how you feel right now")
      return;
    }

    var fd = new FormData();
    
    for(var key in data){
      if(key !== "symptoms" && data.hasOwnProperty(key))
        fd.append(key,data[key]);
    };

    for(var i = 0; i < data.symptoms.length; i++){
      if(data.symptoms[i].name)
        fd.append("symptoms", data.symptoms[i].name);
    }

    //validate the files picked.
     //= ($scope.blobs && $scope.files) ? $scope.files.concat($scope.blobs) : $scope.blobs;
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
      if($scope.user.description) {
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
     
      xhr.open("POST", "/user/help");
      xhr.send(fd);
      $scope.progressVisible = false;
      player.srcObject.getVideoTracks().forEach(function(track) { track.stop()});
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
      $scope.loading = false;
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
  var player = document.getElementById('player');
  var captureButton = document.getElementById('capture');
  var canvasArea = document.getElementById('canvasArea');
  
  captureButton.hasEvent = false;
  $scope.blobs = [];
  $scope.isCapture = false;
  $scope.takePhoto = function() {    
    $scope.isCapture = true;

   // var canvas = document.getElementById('canvas');
  
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


  
  $scope.sendHelp = function(){
    if(list[0].name !== "")
      $scope.user.symptoms = list;
    if(!localManager.getValue("resolveUser")) {
      alert("Please login and continue");
    } else {
      if(!$scope.user.helpType && !$scope.user.description) {
        alert("Please complete all fields");
      } else {
      $http({
        method  : 'POST',
        url     : "/user/help",
        data    : $scope.user,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {   
        if(data.status){
          alert('Complain submitted successfully!')          
        } else {
          alert("Error occured while sending form.")
        }
      });

      }
    
    }
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


/** courier services logic **/

app.service("courierResponseService",["$resource",function($resource){
  return $resource("/user/courier-response",null,{pay:{method: "POST"},reOder:{method: "PUT"}});
}])

app.controller("courierResponseCtrl",["$scope","$rootScope","courierResponseService","templateService","$location","phoneCallService",
  "paymentVerificationService","$http",
  function($scope,$rootScope,courierResponseService,templateService,$location,phoneCallService,paymentVerificationService,$http){

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

app.controller("selectedCourierRequestController",["$scope","$rootScope","$http","mySocket",function($scope,$rootScope,$http,mySocket){
  //this will only allow cebters permitted to render courier services use the feature.
  $scope.request = $rootScope.aCourierRequest;

 
  var totalCost = {};
  var obj = {};
  var deliveryCost;
  var rawCost;
  var snStr;

  $scope.deliveryCharge = $rootScope.checkLogIn.courier_charge || 1000;

  $scope.agents = $rootScope.checkLogIn.field_agents;
 
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

  $scope.request.agentId = ($scope.agents[1]) ? $scope.agents[1].id : ($scope.agents.length > 0) ? $scope.agents[0].id : "";

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
app.controller("filedAgentController",["$scope","$rootScope","$resource","fieldAgentService","$location","ModalService",
  function($scope,$rootScope,$resource,fieldAgentService,$location,ModalService){
  
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

  $scope.toCurrency = function(amount,user) {
    var str = (user.currencyCode) ? user.currencyCode + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "NGN" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str;
  }
  
}]);


app.controller('fieldAgentModalCtrl',["$scope","fieldAgentService",function($scope,fieldAgentService){
  var agent = fieldAgentService;
  $scope.verify = function(details){
    details.message = "";
    if(details.order){
      agent.verify(details,function(response){
        details.message = response.message;
        details.status = response.status;
        if(response.status) {
          var elem = document.getElementById(details.courierId);        
          elem.style.display = "none";
        } else {
          $scope.message = response.message;
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

      
}])



 

/******** For Emergency profile users *************/

app.controller("eminPatientDashboardController",["$scope","$location","templateService","localManager",
function($scope,$location,templateService,localManager){
  $location.path(localManager.getValue("currentPageForPatients") || "/emp");
}]);

app.controller("empatientNotificationController",["$scope","$location","$http","$window","templateService","localManager",
function($scope,$location,$http,$window,templateService,localManager){
   $scope.logout = function () {
    localManager.removeItem("userInfo");
    localManager.removeItem("currentPage");
    localManager.removeItem("currentPageForPatients");
    localManager.removeItem("receiver");
    localManager.removeItem('caller');
    localManager.removeItem("doctorInfoforCommunication")
    localManager.removeItem("patientInfoforCommunication");
    localManager.removeItem("resolveUser");
    localManager.removeItem("holdPrescriptions");
    localManager.removeItem("holdLabData");
    localManager.removeItem("holdScanData");
    localManager.removeItem("emPatientData") 

     $http({
        method  : 'GET',
        url     : "/user/logout",
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        $scope.userData = data;
        $window.location.href = '/';

     });
  }

  $scope.getName = function(firstname,lastname,id){
    var holdName = {
      firstname: firstname,
      lastname: lastname,
      patient_id: id
    }
    templateService.holdForSpecificPatient = holdName;
    localManager.setValue("emPatientData",holdName)
  } 


}]);

app.controller("emNoteController",["$scope","$location","templateService","localManager",
function($scope,$location,templateService,localManager){
  $scope.patient = templateService.holdForSpecificPatient;
}]);

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

app.controller("empatientPanelController",["$scope","$location","$http","templateService","localManager",'emMedService',
function($scope,$location,$http,templateService,localManager,emMedService){

  $scope.dashboardhome = function () {
    $location.path("/emp");
  }

 
  $scope.viewPrescription = function () {
    var patient = templateService.holdForSpecificPatient;
    emMedService.getRecords(patient);
    localManager.setValue("currentPageForPatients","/patient-prescriptions/em");  
    $location.path("/patient-prescriptions/em"); //id refers to the id of the doctor that wrote the prescription
    
   
  }

  $scope.viewLabTest = function () {
    var patient = templateService.holdForSpecificPatient
    localManager.setValue("currentPageForPatients","/em/patient/laboratory-test");
    emMedService.getRecords(patient);
    $location.path("/em/patient/laboratory-test")
  }

  $scope.viewScanTest = function () {
    localManager.setValue("currentPageForPatients","/em/patient/radiology-test");
    var patient = templateService.holdForSpecificPatient;
    emMedService.getRecords(patient);
    $location.path("/em/patient/radiology-test");
  }

}]);


app.controller("emcheckingOutDoctorController",["$scope","$location","templateService","localManager",
function($scope,$location,templateService,localManager){
  
}]);


app.controller("emprescriptionTemplateController",["$scope","$location","$http","templateService","localManager",
  function($scope,$location,$http,templateService,localManager){
    
    var patient = localManager.getValue("emPatientData")
    var prescriptionObjs = localManager.getValue("holdPrescriptions");

    $scope.prescriptionRecordsResult = prescriptionObjs;

    var hasBeenSentTo = {};

    $http({
      method  : 'PUT',
      url     : "/patient/get-prescription/track-record/em",
      data    :   patient,  
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {
     
      hasBeenSentTo.trackRecord = data;
    });

    $scope.trackedPrescription = function(id,prescription){   
      var holdRecord = [];
      hasBeenSentTo.trackRecord.forEach(function(record){
        if(record.prescriptionId === id) {
          holdRecord.unshift(record);
        }
      });
      templateService.holdTrackRecord = holdRecord;
      templateService.holdPrescriptionForTrackRecord = prescription;
      $location.path("/patient/view-prescription-history/" + id);//
    }


    $scope.downloadPrescription = function (prescription) {
     
    }

    //this fn is invoked when patient wish to forward prescription by himself to a phamarcy.
    $scope.forwardPrescription = function (prescription) {  
      alert("You are on an emergency profile account.To gain full access of our services please update your profile")      
      /*templateService.holdPrescriptionToBeForwarded = prescription;
      templateService.holdPrescriptionToBeForwarded.sender = "patient";          
      $location.path("/search/pharmacy"); */        
    }
    
    //this fn is invoked when a patient wish to delete a prescription.
    $scope.deletePrescription = function (id) {
      for(var i = 0; i < $scope.prescriptionRecordsResult.length; i++){
        if($scope.prescriptionRecordsResult[i].prescriptionId === id){
          $scope.prescriptionRecordsResult.splice(i,1);
        }
      }
    }

}]);

app.controller("emtrackedPrescriptionController",["$scope","$location","templateService",function($scope,$location,templateService){
  $scope.presInfo = templateService.holdPrescriptionForTrackRecord;
  $scope.trackedPrescription = templateService.holdTrackRecord;

  //this fn is invoked when patient wish to forward prescription by himself to a phamarcy.
  $scope.forwardPrescription = function (prescription) {       
    alert("You are on an emergency profile account.To gain full access of our services please update your profile")        
  }
}]);

app.controller("emLabTestController",["$scope","$location","$http","$window","templateService","localManager","$timeout",
  function($scope,$location,$http,$window,templateService,localManager,$timeout){

  $scope.labTest= localManager.getValue("holdLabData");

  $scope.downloadTest = function(testObj) {
    
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
    $scope.copy = id + ' Copied!';
    $timeout(function(){
      $scope.copy = "";
    },2000)
  };


  $scope.fail = function (err) {
    console.error('Error!', err);
  };

}]);

app.controller("emScanTestController",["$scope","$location","$http","$window","templateService","localManager","$timeout",
  function($scope,$location,$http,$window,templateService,localManager,$timeout){

  $scope.labTest= localManager.getValue("holdScanData");

  $scope.downloadTest = function(testObj) {
    
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

  $scope.success = function (id) {
    $scope.copy = id + ' Copied!';
    $timeout(function(){
      $scope.copy = "";
    },2000)
  };


  $scope.fail = function (err) {
    console.error('Error!', err);
  };

}]);


app.controller("topHeaderController",["$scope","$rootScope","$window","$location","$resource",
  "localManager","mySocket","templateService","$timeout","$document","ModalService",
   "cities","$filter","_","$interval","dynamicService",
  function($scope,$rootScope,$window,$location,$resource,localManager,mySocket,templateService,
   $timeout, $document, ModalService,cities,$filter,_,$interval,dynamicService){



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
      elemPos = $rootScope.chatsList.map(function(x){return x.chat_id}).indexOf(data.chatId)
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

    console.log($rootScope.htmlTemp)
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
     return str
  }

  function getAllconnectedSockets() {
    //gets all connected sockets for every 1 min
    mySocket.emit("check presence",{status: true},function(res){
      $rootScope.sockets = res;
      //$rootScope.$broadcast("users presence",{type: 'chatList',data:$rootScope.chatsList,sockets: res});         
    })
  }

  getAllconnectedSockets();

  //gets connected sockets every 1 min
  $interval(function(){
    getAllconnectedSockets()
  },60000)


  $rootScope.$on("users presence",function(info,response){
    var on = true;
    var off = false;
    var inView = (localManager.getValue('availablility')) ? localManager.getValue('availablility') : {};
    switch(response.type) {
      case 'patientList':        
        var invert = _.invert(response.sockets);
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
      break;
      case 'doctorList':     
        var invert = _.invert(response.sockets);
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
      case 'chatList':
        var invert = _.invert(response.sockets);
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
        var invert = _.invert(response.sockets);
        response.data.forEach(function(item){
          if(invert[item.user_id]){
            item.status = on;            
          } else {
            item.status = off;
          }
        })
      break;
      default:
        // online presence for pharmacy and diagnostic enter search results
        var list = response.data.full.concat(response.data.less);
        var invert = _.invert(response.sockets);
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


  //for viewing jnlp dicom weasis viewer as java web start launcher
  $rootScope.opnejnlp = function(link) {
    window.location.href = "jnlp://" + link;
  }


}]);

app.controller("stockModalController",["$scope","$rootScope","dynamicService","localManager",
  function($scope,$rootScope,dynamicService,localManager){

  $scope.updateStock = function() {
    console.log($rootScope.dynaServices)
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


app.service("patientWaitingRoomService",["$resource",function($resource){
  return $resource("/user/response/patients-histories/:batch",null,{respond:{method: "POST"}});
}]);

app.controller("patientWaitingRoomController",["$scope","$resource","$location","$routeParams",
  "mySocket","patientWaitingRoomService","$rootScope","ModalService",
  function($scope,$resource,$location,$routeParams,mySocket,patientWaitingRoomService,$rootScope,ModalService){
  var complaints = patientWaitingRoomService; //$resource("/user/response/patients-histories/:batch",null,{respond:{method: "POST"}});
  complaints.query({batch:1},function(data){
    $scope.complaints = data;
  });
  $scope.isViewPatient = false;
  $location.path("/1");

  //joins patient waiting room for real time update
  mySocket.emit("pwr join",{userId:'pwr'});

  $scope.batch =  "1";

  $scope.getBatch = function (set) {
    $scope.batch = set;
    $scope.loading = true;
    var num = parseInt(set);
    complaints.query({batch:num},function(data){
      $scope.loading = false;
      $scope.complaints = data;
    });
  } 

  $scope.veiwDatail = function(complaintId){
    $scope.isViewPatient = true;

    var elemPos = $scope.complaints.map(function(x){return x.complaint_id}).indexOf(complaintId);
    var found = $scope.complaints[elemPos];
    $scope.patient = found;
  }

  $scope.close = function(){
    $scope.isViewPatient = false;
  }

  mySocket.on("receive help",function(data){
    $scope.complaints.push(data);
  });

  $scope.user = {};
  var value;
  var commission;
  var discount = $rootScope.checkLogIn.city_grade || 10;
  $scope.$watch("user.amount",function(newVal,oldVal){
    if(oldVal && newVal !== null) {
      commission = $scope.user.amount * ( discount / 100 );
      value = $scope.user.amount - commission;
      $scope.str = "NGN " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      $scope.str = "";
    }
  });

  /*window.onscroll = function(ev) {
      if ((window.scrollY) === document.body.offsetHeight) {
        alert("hey you are the bottom!!!" + window.scrollY + " - " + document.body.offsetHeight)
      }
  };*/

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

  $scope.sendRequest = function(){
    var date = + new Date();
    $scope.loading = true;
    complaints.respond({
      date: date, 
      fee: $scope.user.amount || 0,
      patient_id: $scope.patient.patient_id,
      complaint_id:$scope.patient.complaint_id,
      introductory: $scope.user.introductory 
    },function(info){
      if(info.message){
        alert(info.message);
      } else {
        alert(info.error);
      }
      $scope.loading = false
    })
  }

  $scope.consultFee = {};
  $scope.consultFee.con = 'no'
  $scope.$watch("consultFee.con",function(newVal,oldVal){
    if(newVal) {
      if(newVal == 'yes') {
        $scope.showConDiv = true;
      } else {
        $scope.user.amount = 0;
        $scope.str = "";
        $scope.showConDiv = false;
      }
    }
  })



}]);


//for chats in modal and centers dashboard use for 
app.controller("generalChatController",["$scope","$rootScope", "mySocket","chatService", "templateService","$filter",
  "ModalService","$location","deviceCheckService","$compile","$interval",
  function($scope, $rootScope, mySocket,chatService,templateService,$filter,ModalService,$location,
    deviceCheckService,$compile,$interval){
    var user = $rootScope.checkLogIn || {};
    $rootScope.allChats = $rootScope.chatsList; // rootScope can be used instead   
    $scope.center = $rootScope.holdcenter || {id : templateService.holdId}; //sometimes is not center but individual
    $scope.isSent = false;
    var elemPos;

    var currView = $location.path();

    if($rootScope.chatsList) {
      var elemPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf(templateService.holdId)
      if(elemPos !== -1){
        $scope.partner = $rootScope.chatsList[elemPos];   
      } else {
        $scope.partner = {}
      }
    }

    function getUsersOnline() {     
      $rootScope.$broadcast("users presence",{type: 'chatList',data:$rootScope.chatsList,sockets: $rootScope.sockets});         
    }

    getUsersOnline();

    $interval(function(){
      getUsersOnline()
    },60009) // 1 min and some secs


    
    if($rootScope.holdcenter) {
      initChatSingle();
    } else {
      initChat();
    }

    mySocket.removeAllListeners("new_msg"); // incase if this listener is registered twice

    
    $scope.viewChat = function(chat) {    
      $scope.partner = chat;
      var base = document.getElementById('base'); 
      var msgDiv = document.getElementById("sentmessage");
      base.removeChild(msgDiv);

      if(!chat.is_read) {
        chat.is_read = true;
        mySocket.emit("seen chat",{id: chat._id})
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
    mySocket.on("real time presence",function(connects){
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
    });

    //for modal sending one-way chat message.
    function initChatSingle() {
      mySocket.emit('init chat single',{userId: user.user_id,partnerId: $scope.center.id},function(data){
       
      });
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
        //$rootScope.message1.push(msg);      
        msg.userId = user.user_id;
        msg.partnerId = $scope.partner.partnerId; 
        msg.id = data.date//genId();


        var elPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf($scope.partner.partnerId);
        if(elPos !== -1) {
          $rootScope.chatsList[elPos].is_read = true;
          $rootScope.chatsList[elPos].messages.push(msg);
        }

        chats(msg);
        
        mySocket.emit("isSent",msg,function(status){
          
          if(status) {
            var elem = angular.element(document.getElementById(msg.id));
            elem[0].innerHTML += "";            
          }
        });
        //mySocket.emit("save message",msg);//this saves the message as one mark
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
    var base = angular.element(document.getElementById('base')); 
    var container = angular.element(document.getElementById('sentmessage'));      
    var item = angular.element(document.createElement('an-item'));
    var breaker = angular.element(document.createElement('div'));
    var p = angular.element(document.createElement('p'));
    var small = angular.element(document.createElement('small'));
    var fileElem;
    
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
          a[0].style.color = (data.sent) ? "#eee" : "yellow";
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
    small[0].style.display = "block";
    small[0].style.marginTop = "5px";
    small[0].style.color = "#ccc";
    if(!fileElem) {
      p[0].innerHTML += (data.sent) ? data.sent : data.received; 
    } else {
      p[0].innerHTML += data.fileType;
    }
   
   
    small[0].id = data.id;
    //var time = ($filter('amTimeAgo')(data.time) === 'a few seconds ago') ? 'Now' : $filter('amTimeAgo')(data.time);
    small[0].innerHTML += $filter('amCalendar')(data.time);
    //small[0].innerHTML += (data.sent) ? "&nbsp;&nbsp;" + $filter('amTimeAgo')(data.time) : "&nbsp;&nbsp;" + $filter('amTimeAgo')(data.time);     
    
    breaker[0].style.display = "block";
    breaker[0].style.textAlign = (data.sent) ? "right" : "left";
    
    item[0].appendChild(p[0]);

    if(fileElem)
      item[0].appendChild(fileElem[0]);

    
    item[0].appendChild(small[0]);


    breaker[0].appendChild(item[0]);
    
   
    item[0].style.display = "inline-block";
    item[0].style.maxWidth = (deviceCheckService.getDeviceType()) ? "90%" : "70%";
    item[0].className = (data.sent) ? "talk-bubble tri-right right-top talktext msg_sent bg-info" : "talk-bubble tri-right left-top talktext";
    item[0].style.whiteSpace = "pre-line";
    container[0].appendChild(breaker[0]);
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
      var elemPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf(data.from);
      if(elemPos !== -1) {
        $rootScope.chatsList[elemPos].is_read = false;
        $rootScope.chatsList[elemPos].messages.push(msg);       
      } else {
        $rootScope.loadChats();
      }
    }
   
    mySocket.emit("msg received",{to: data.from,id:data.date});
  });


  $scope.$watch("user.text1",function(newVal,oldVal){
    if(newVal !== "" && newVal !== undefined){      
      mySocket.emit("user typing",{to: $scope.partner.partnerId,message:"Typing...",from: user.user_id});
    } else {
      mySocket.emit("user typing",{to: $scope.partner.partnerId,message:"",from: user.user_id});
    }
  });

  var tpPos;

  mySocket.on("typing", function(data) {
    tpPos = $rootScope.chatsList.map(function(x){return x.partnerId}).indexOf(data.from);
    
    if(tpPos !== -1){
      $rootScope.chatsList[tpPos].typing = data.message;      
      $scope.partner.typing = data.message;
    }
    //$scope.partner.typing = data.message;
    //$scope.typing = data;
  });

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


  $scope.chatPrivate = function(chat) {
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
  //for single file upload
  $rootScope.imageFile = function() {
    
    if($scope.files.size <= 31457280) { // 30mb max size
    var file = $scope.files,
      fileReader = new FileReader(),
      slice = file.slice(0, 100000);

    fileReader.readAsArrayBuffer(slice); 
    img[file.name] = file.name;

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
    breaker[0].style.textAlign =  "right";
    p[0].style.display = "inline-block";

   // p[0].className = "fa fa-upload";
    p[0].innerHTML += file.name + "\n Uploading... ";
    
    item[0].appendChild(p[0]);

    item[0].appendChild(span[0]);
    
    item[0].appendChild(small[0]);

    breaker[0].id = file.name;


    breaker[0].appendChild(item[0]);


    item[0].style.display = "inline-block";
    item[0].style.maxWidth = (deviceCheckService.getDeviceType()) ? "90%" : "70%";
    item[0].className =  "talk-bubble tri-right right-top talktext msg_sent bg-info";
    item[0].style.whiteSpace = "pre-line";
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
      ele2.children[0].childNodes[1].innerHTML = "" + Math.round(fnProgress(place)) + "%";
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
          $rootScope.chatsList[elPos].messages.push(msg);
        }

        chats(msg);
        var ele = document.getElementById(img[file.name]);
        ele.style.display = "none";
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
      var ele = document.getElementById(img[file.name]);
      ele.style.display = "none";
      delete img[file.name];
      alert("Error occured while uploading " + file.name);
    })

    } else {
      alert("File size out of range. Max size should be less than 30mb");
    }

  }


 



  //for multiple file upload
  $rootScope.imageFiles = function() {
    alert("the file dey come many oooo")
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
        getCenter('/user/getAllLaboratory')
      break;
      case '/pharmacy-in':
        getCenter('/user/getAllPharmarcy')
      break;
      case '/radiology-in':
        getCenter('/user/getAllRadiology')
      break;
      default:
      break;
    }

  function getCenter(url) {
    $http({
    method  : 'GET',
    url     : url,
    headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {              
      if(data) {
        $scope.centers = data.data
      }
    });    
  }                      


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

app.controller("dicomCtrl",["$rootScope","$scope","$location","$resource","$http",
  "dynamicService","scanTests","localManager","getBalanceService",
  function($rootScope,$scope,$location,$resource,$http,dynamicService,scanTests,localManager,getBalanceService){
  $scope.isNew = true;

  $scope.station = {}
  $scope.station.center = $rootScope.checkLogIn;
  $scope.station.locate = "patientID"
  $scope.test = {};
  $scope.contact = {};

  var user = localManager.getValue("resolveUser");

  var allTests = scanTests.listInfo1.concat(scanTests.listInfo2,scanTests.listInfo3,scanTests.listInfo4,scanTests.listInfo5,
  scanTests.listInfo6);

  var resource = dynamicService;
  resource.query({type:"Radiology"},function(data){
    $scope.tests = allTests.concat(data);
  });

  $http({
    method  : 'GET',
    url     : "/user/reporting-radiologist",
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {   
     $scope.radiologists = data;
  }); 

  

  $scope.isAppPatient = true;
  $scope.choose = function(type){
    switch(type){
      case 'our':
        $scope.isAppPatient = true;
        $scope.isOther = false;
      break;
      case 'other':
        $scope.isAppPatient = false;
        $scope.isOther = true;
      break;
    }
  }


  $scope.findPatient = function() {

    if(!$scope.contact.recepient){
      alert("Please enter email or phone number of the recepient");
      return;
    }

    if($rootScope.checkLogIn.email == $scope.contact.recepient){
      alert("Please you cannot use yourself.");
      return;
    }

    if($rootScope.checkLogIn.phone == $scope.contact.recepient){
      alert("Please you cannot use yourself.");
      return;
    }

    var intRegex = /[0-9 -()+]+$/;
    var emailReg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;
    if(intRegex.test($scope.contact.recepient)) {
      if($scope.contact.recepient[0] == '0'){
        var newSlice = $scope.contact.recepient.slice(1);
        $scope.contact.recepient = "+234" + newSlice;
      }

      if($scope.contact.recepient[0] == '2'){
        $scope.contact.recepient = "+" + $scope.contact.recepient;
      } 

    } else if(emailReg.test($scope.contact.recepient)) {

    } else {
      alert("Please enter valid email or phone number");
      return;
    }

    $scope.loading = true;

    $http.post("/user/invitation",$scope.contact)
    .success(function(res){
      console.log(res)
      $scope.msg = res.message;
      $scope.loading = false;
      $scope.existingUser = (res.user && res.type == 'Patient') ? true : false;
      $scope.patient = res
    })


  }

  $scope.TestList = [];

  var count = {};
  count.num = 1;

  $scope.addTest = function(){
    if($scope.test.name) {
      var testObj = {};
      testObj.name = $scope.test.name;
      testObj.val = true;
      testObj.select = true;
      testObj.sn = count.num++;
      testObj.tid = Math.floor(Math.random() * 999999);
      $scope.TestList.push(testObj);
      $scope.test.name = "";
      updateSN()
    }
  }

  $scope.removeTest = function(id) {
    if($scope.TestList.length > 0){
      var elemPos = $scope.TestList.map(function(x){return x.tid}).indexOf(id);
      $scope.TestList.splice(elemPos, 1);
      updateSN()
    }
  }


  var updateSN = function() {
    for(var i = 0; i < $scope.TestList.length; i++) {
      $scope.TestList[i].sn = i + 1;
    }
  }


  var totalCost = {};
  var amt;
  

  $scope.$watch('TestList',function(newVal,oldVal){
    totalCost.sum = 0;
    $scope.TestList.forEach(function(item){
      if(item.amount){
        totalCost.sum += item.amount;
        toNaira(totalCost.sum)  
      }    
    })
  },true)


  function toNaira(val){
     $scope.str = "NGN" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     $scope.grabRawAmount = val;
     $scope.commissionedAmount = "NGN" + ( val - (val * ($rootScope.checkLogIn.city_grade / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     //$scope.total = "NGN" + ( val - (val * ($rootScope.checkLogIn.city_grade / 100)) + $scope.dicomDetails.cost).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  $scope.isFindPatient = true;

  $scope.next = function(val) {
    switch(val) {
      case '1':
        $scope.isFindPatient = true;
        $scope.isAddTest = false;
        $scope.isTestDetails = false;
      break;
      case '2':
        $scope.isFindPatient = false;
        $scope.isAddTest = true;
        $scope.isTestDetails = false;
      break;
      case '3':
        $scope.isFindPatient = false;
        $scope.isAddTest = false;
        $scope.isTestDetails = true;
      break
    }
  }


  $scope.createStudy = function() {
    var conTest = "";

    $scope.TestList.forEach(function(item){
      conTest += item.name + ","
    });

    var sendObj = {
      name: $rootScope.checkLogIn.name,
      address: $rootScope.checkLogIn.address,
      city: $rootScope.checkLogIn.city,
      country: $rootScope.checkLogIn.country,
      id: $rootScope.checkLogIn.user_id,
      recepient: $scope.contact.recepient,
      str: conTest,
      status:true,
      clinical_summary: $scope.patient.clinical_summary,
      indication: $scope.patient.indication,
      lmp: $scope.patient.lmp,
      parity: $scope.patient.parity,
      type: 'someone',
      //ref_id: Math.floor(Math.random() * 9999999),
      user_id: $rootScope.checkLogIn.user_id,
      sent_date: new Date(),
      isSelfRequest: true,
      test_to_run: $scope.TestList,
      onlinePacs: $scope.dicomDetails
    }

    $scope.loading = true;
    $http({
      method  : 'PUT',
      url     : "/user/scan-search/radiology/referral",
      data    : sendObj,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) { 
      $scope.loading = false;             
      if(data.success) {
        localManager.setValue("radiologyData",data.refObj)
        $location.path('/radiology/view-test/' + data.ref_id);
      } else {
        alert(data.message)
      }
    }); 
  }

  var user = $rootScope.checkLogIn.user_id || "";
  $http({
    method  : 'GET',
    url     : "/api/dicom-details?centerId=" + user,
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(data) {  
    console.log(data)            
    $scope.dicomDetails = data;
    $scope.station.onlinePacs = data
  }); 

  var amount = getBalanceService;
  var wallet = amount.get({userId: user},function(data){
    console.log(data)
    $scope.availableAmount = data.balance;
  });

  $scope.genAccession = function() {
    var cost;
    switch($scope.station.type) {
      case'CT/MRI':
        cost = $rootScope.toCurrency(1000);
        $scope.station.amount = 1000;
        if($scope.availableAmount < $scope.station.amount){
          alert("You have insufficient fund for this service. Please fund your wallet.");
          return;
        }
      break;
      case'SI':
        cost = $rootScope.toCurrency(700);
        $scope.station.amount = 700;
         if($scope.availableAmount < $scope.station.amount){
          alert("You have insufficient fund for this service. Please fund your wallet.");
          return;
        }
      break;
      case'CAPEHS':
        cost = $rootScope.toCurrency(350);
        $scope.station.amount = 350;
        if($scope.availableAmount < $scope.station.amount){
          alert("You have insufficient fund for this service. Please fund your wallet.");
          return;
        }
      break;
    }


    var intRegex = /[0-9 -()+]+$/;
    if(intRegex.test($scope.station.patientPhone)) {
      if($scope.station.patientPhone.indexOf('+') == -1 || $scope.station.patientPhone.indexOf("234") == -1){
        var newSlice = $scope.station.patientPhone.slice(1);
        $scope.station.patientPhone = "+234" + newSlice;
      }
    } else {
      alert("Please enter valid phone number");
      return;
    }

    $scope.station.cost = cost;
    $scope.station.isAcc = true;

    var msg = "Generating Patient ID will cost you " + cost + ". Do you wish to continue?";
    var check = confirm(msg)
    if(check) {
      $scope.loading = true;
      $http({
        method  : 'POST',
        url     : "/user/dicom-details",
        data    : $scope.station,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {              
        $scope.loading = false;
        console.log(data)
        if(data.status){
          $scope.isSuccess = true;
          $scope.accNo = data.acc_no; 
          $rootScope.$broadcast("debit",{});
        }
      }); 
    }
  }

  $scope.addStudy = function() {
    var cost;
    switch($scope.station.type) {
      case'CT/MRI':
        cost = $rootScope.toCurrency(1000);
        $scope.station.amount = 1000;
        if($scope.availableAmount < $scope.station.amount){
          alert("You have insufficient fund for this service. Please fund your wallet.");
          return;
        }
      break;
      case'SI':
        cost = $rootScope.toCurrency(500);
        $scope.station.amount = 700;
         if($scope.availableAmount < $scope.station.amount){
          alert("You have insufficient fund for this service. Please fund your wallet.");
          return;
        }
      break;
      case'CAPEHS':
        cost = $rootScope.toCurrency(350);
        $scope.station.amount = 350;
        if($scope.availableAmount < $scope.station.amount){
          alert("You have insufficient fund for this service. Please fund your wallet.");
          return;
        }
      break;
    }


    var intRegex = /[0-9 -()+]+$/;
    if(intRegex.test($scope.station.patientPhone)) {
      if($scope.station.patientPhone[0] == '0'){
        var newSlice = $scope.station.patientPhone.slice(1);
        $scope.station.patientPhone = "+234" + newSlice;
      }

      if($scope.station.patientPhone[0] == '2'){
        $scope.station.patientPhone = "+" + $scope.station.patientPhone;
      }

    } else {
      alert("Please enter valid phone number");
      return;
    }

    $scope.station.cost = cost;

    var msg = "Adding Existing DICOM Study will cost you " + cost + " . Do you wish to continue?";
    var check = confirm(msg)
    if(check) {
      $scope.loading = true;
      $http({
        method  : 'POST',
        url     : "/user/dicom-details",
        data    : $scope.station,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {              
        $scope.loading = false;
        if(data.status){
          $scope.isSuccess = true;
          $scope.studyNum = data.studyId; 
          $rootScope.$broadcast("debit",{});
        } else {
          alert(data.message)
        }
      }); 
    }

  }

  var count = 0;
  $scope.$watch("station.locate",function(newVal,oldVal){
    count++;
    switch(newVal){
      case 'studyID':
        $scope.station.patientID = "";
      break;
      case 'patientID':
        $scope.station.studyID = "";
      break;
    }
  })

  $scope.newAcc = function() {
    $scope.isSuccess = false;
    $scope.accNo = "";
    $scope.station.patientName = "";
    $scope.station.patientPhone = "";
    $scope.station.patientEmail = "";
    $scope.station.patientSex = "";
    $scope.station.patientAge = "";
    $scope.station.studyName = "";
  }

  $scope.createService = function() {
    $scope.loading = true;
    $http({
      method  : 'POST',
      url     : "/user/dicom-service",
      data    : $scope.station,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {              
      $scope.loading = false;
      if(data.status){
        alert(data.message)
      } else {
        alert(data.message)
      }
    }); 
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


app.service("homePageDynamicService",["$resource",function($resource){
  return $resource("/dynamic-service");
}]);

app.service("homepageSearchService",["$resource",function($resource){
  return $resource("/general/homepage-search");
}]);



app.controller("hompageController",["$scope","scanTests","cities","labTests","Drugs","$http",
  "ModalService","$rootScope","homePageDynamicService","skillService",
  function($scope,scanTests,cities,labTests,Drugs,$http,ModalService,$rootScope,homePageDynamicService,skillService){


  $scope.cities = cities;

  $scope.itemList = [];
  $rootScope.user = {};
  var dyna = [];
  var filter = {};
  var spArr = [];
  var skArr = [];
  var diArr = [];

  $http({
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
        } else {
          filter[data[i].specialty]++;
        }
      }
    }
  }); 


  $http({
    method  : 'GET',
    url     : "/user/get-doctors-names",
    headers : {'Content-Type': 'application/json'} 
    })
  .success(function(res) {     
    
     for(var i = 0; i < res.length; i++){
        spArr.push(res[i]);
     }

  });

  $http({
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
        } else {
          filter[data[i].disease]++;
        }
      }
     
    }
  }); 



  skillService.query(function(data){
    for(var i = 0; i < data.length; i++){
      if(!filter[data[i].skill]) {
        filter[data[i].skill] = 1;
        skArr.push({name:data[i].skill})
      } else {
        filter[data[i].skill]++;
      }
    }
  });          

                                   

  
  $scope.itemName = "Drug / Test / Specialty / Disease"

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
          $scope.itemName = "Enter keyword ( e.g Kidney failure. )"
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
  })


  $scope.search = function() {    
    //alert($rootScope.user.city + " " + $rootScope.user.item + " " + $rootScope.user.category)
    ModalService.showModal({
      templateUrl: 'home-page-search.html',
      controller: 'homePageModalController'
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {             
      });
    });
  }

}]);

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

app.controller("tempCtrl",["$scope","$http",function($scope,$http){
  $scope.center = {};
  $scope.sendTemplate = function() {
    $scope.loading = true;
    $http({
      method  : 'POST',
      url     : "/report-template",
      data    : $scope.center,
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {              
      $scope.loading = false;
      if(data.status){
        alert(data.message)
      } else {
        alert(data.message)
      }
    }); 
  }
}]);


app.controller("addRadiologistCtrl",["$scope","$http",function($scope,$http){
  $scope.radiologist = {};

  $scope.addRadiologist = function() {
      $scope.loading = true;
      if($scope.radiologist.phone){
        if($scope.radiologist.phone[0] == '0'){
          var ext = $scope.radiologist.phone.slice(1);
          $scope.radiologist.phone = "+234" +  ext;
        }

        if($scope.radiologist.phone[0] == '2') {
          $scope.radiologist.phone = "+" + $scope.radiologist.phone;
        }
      }

      $http({
        method  : 'POST',
        url     : "/user/reporting-radiologist",
        data    : $scope.radiologist, //forms user object
        headers : {'Content-Type': 'application/json'} 
       })
      .success(function(response) {
         console.log(response)
         if(response.status) {
           alert(response.message)
         } else {
           alert(response.message)
         }  

         $scope.loading = false;      
      });          
  }
}]);


app.controller("templatectrl",["$scope","$http","$filter","ModalService","$rootScope",
  function($scope,$http,$filter,ModalService,$rootScope){
  $scope.patient = {};
  

  var s = angular.element(document.getElementById('summary'));
  var f = angular.element(document.getElementById('findings'));
  var c = angular.element(document.getElementById('conclusion'));
  var a = angular.element(document.getElementById('advise'));
  var img = angular.element(document.getElementById('img'));


  $scope.getdata = function(patientNames,patientId,studyDate,patientAge,
    patientSex,referringPhysician, studyName, studyDate, reporterName, reporterDesignation, 
    reporterEmail,studyLink,summary,findings,conclusion,advise,centerName,
    centerAddress, centerCity, centerCountry, centerPhone, centerEmail, centerProfilePic, _id,centerId,templateId){
    if(!$scope.isModalLaod) {
      $scope.patient.names = patientNames;
      $scope.patient.patientId = patientId;
      $scope.patient.studyDate = + new Date(studyDate);//studyDate;//$filter('date')(studyDate, 'EEE, MMM d, y');
      $scope.patient.age = patientAge;
      $scope.patient.sex = patientSex;
      $scope.patient.doctor = referringPhysician;
      $scope.patient.studyName = studyName;
      $scope.patient.reporter = reporterName;
      $scope.patient.reporterDesignation = reporterDesignation;
      $scope.patient.reporterEmail = reporterEmail;
      $scope.patient.centerName = centerName;
      $scope.patient.centerAddress = centerAddress;
      $scope.patient.centerCity = centerCity;
      $scope.patient.centerCountry = centerCountry;
      $scope.patient.centerPhone = centerPhone;
      $scope.patient.centerEmail = centerEmail;
      $scope.patient.centerProfilePic = centerProfilePic;
      $scope.patient._id = _id;
      $scope.patient.centerId = centerId;
      $scope.patient.studyLink = studyLink;
      s[0].innerText = summary || "";
      f[0].innerText = findings || "";
      c[0].innerText = conclusion || "";
      a[0].innerText = advise || "";
      if(templateId === 'none' || undefined || null)
        img[0].src = centerProfilePic;
    }
  }

  
  
  $scope.getTempData = function() {
    $scope.isModalLaod = true;
  
    $rootScope.addForLinux = angular.element(document.getElementsByClassName('ui-linux'));
    $rootScope.hml = angular.element(document.getElementById('tempfield'));


    $scope.loading = true;
    $scope.patient.summary = s[0].innerText;
    $scope.patient.findings = f[0].innerText;
    $scope.patient.conclusion = c[0].innerText;
    $scope.patient.advise = a[0].innerText;
    //$scope.patient.html = hml.html();


    $rootScope.templateReportDetails = $scope.patient;

    ModalService.showModal({
      templateUrl: 'tempaltedecisionmodal.html',
      controller: "templateModalController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {});
    });
   

    /*$http({
      method  : 'PUT',
      url     : "/report-template",
      data    : $scope.patient, //forms user object
      headers : {'Content-Type': 'application/json'} 
     })
    .success(function(response) {
      $scope.loading = false;
      if(response.status) {
        alert(response.message)
        //$scope.isReportPDF = true;
        $rootScope.pdfLink = response.report_pdf;

        $rootScope.templateReportDetails = $scope.patient;

        ModalService.showModal({
          templateUrl: 'tempaltedecisionmodal.html',
          controller: "templateModalController"
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {});
        });
      } else {
        alert(response.message)
      }  

      $scope.loading = false;      
    });*/
  }

  $scope.backToReport = function() {
    $scope.isReportPDF = false;
  }

  $scope.otherStudies = function() {
    ModalService.showModal({
      templateUrl: 'otherStudiesModal.html',
      controller: "otherStudiesModalController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {});
    });
  }

  
 
}]);


app.controller("templateModalController",["$scope","$http","$rootScope",
function($scope,$http,$rootScope){

  $scope.submit = {};
  $scope.recepient = {};

  $scope.recepient.email = $rootScope.templateReportDetails.centerEmail;
  $scope.recepient.toEmail = "center";

  $http({
    method  : 'GET',
    url     : "/api/reporting-radiologist?centerId=" + $rootScope.templateReportDetails.centerId,
    headers : {'Content-Type': 'application/json'} 
  })
  .success(function(response) {
    console.log(response);
    $scope.reporters = response || [];      
  }); 

  $scope.toCenter = function() {
    /*$scope.recepient.email = $rootScope.patient.centerEmail;
    $scope.recepient.pdfLink = "https://applinic.com" + $rootScope.pdfLink;
    $scope.recepient.patientName = $rootScope.patient.names;
    $scope.recepient.studyName = $rootScope.patient.studyName;
    $scope.recepient.studyLink = $rootScope.patient.studyLink;
    $scope.recepient._id = $rootScope.patient._id;
    $scope.recepient.reporter = $rootScope.patient.reporter;*/

    $rootScope.templateReportDetails.email = $scope.recepient.email;
    $scope.loading = true;

    for(var i = 0; i < $rootScope.addForLinux.length; i++) {
      $rootScope.addForLinux[i].style.zoom = 0.50;
    }

    $rootScope.templateReportDetails.html = $rootScope.hml.html();

    console.log($rootScope.addForLinux);
    $http({
      method  : 'PUT',
      url     : "/report-template",
      data    :  $rootScope.templateReportDetails, //forms user object
      headers : {'Content-Type': 'application/json'} 
     })
    .success(function(response) {
       $scope.loading = false;
       if(response.status) {
          $scope.msg = response.message;
          $scope.reportPDF = response.report_pdf     
       } else {
          alert(response.message);
       }

       $scope.loading = false;      
    }); 

  }    

  $scope.toExpert = function() {    
    var elemPos = $scope.reporters.map(function(x){return x.id.toString()}).indexOf($scope.recepient.radiologistId)
    if(elemPos !== -1) {
      $scope.loading = true;
      var sendObj = $scope.reporters[elemPos];
      $rootScope.templateReportDetails.experReporter = sendObj;   
    
      $http({
        method  : 'POST',
        url     : "/email-report",
        data    :  $rootScope.templateReportDetails, //forms user object
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(response) {
        $scope.loading = false;
        if(response.status) {
          alert(response.message)        
        } else {
          alert(response.message)
        } 
      });
    } else {
      alert("Radiologist was not selected or does not exist.");
    }
  }

}]);

app.controller("otherStudiesModalController",["$scope","$http",function($scope,$http){
    var path = window.location.toString();
    var v = path.split('/');
    var reporterID = v[v.length -2];
    var study = $scope.currStudy = v[v.length -1];
    var std = {};
    var attention;

    function getStudy() {
      $scope.loading = true;
      $http({
        method  : 'GET',
        url     : "/radiologist-studies?reporterID=" + reporterID + "&&study_ID=" + study + "&&isUnattended=" + attention,
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(result) {
        $scope.studies = result;
        $scope.loading = false;
      });
    }

    $scope.$watch("std.description",function(newVal,oldVal){
      if(!newVal){
        std.description = true;
        attention = "yes";
      } else if(newVal == "unattended") {        
        attention = "yes";
      } else {
        attention = "no"
      }      
      getStudy();
    });


}])





/*app.controller("forgotPasswordModalController",["$scope",function($scope){
  alert("jash")
}]);*/
/*
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

*/


//Drug,lab,scan factory

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





//this controller takes care of the request from a patient to communicate with his doctor at anytime.
/*app.controller("modalRequestForCommunicationController",["$scope","$resource","templateService","localManager","$interval","mySocket",
  function($scope,$resource,templateService,localManager,$interval,mySocket){

  $scope.user = {};
  $scope.docInfo = templateService.holdForSpecificDoc;

  $scope.yes = function () {
    console.log($scope.docInfo);
    $scope.isYes = true;
  }

  var patient = localManager.getValue("resolveUser");
  $scope.sendCommunictionRequest = function () {    
    var date = + new Date();
    var random = Math.floor(Math.random() * 99999);
    var msg = $scope.user.complain;
    mySocket.emit("convseration signaling",{
      date:date,
      reqId: random,
      message:msg,
      to:$scope.docInfo.user_id,
      type:$scope.docInfo.type,
      from:patient.user_id,
      profile_pic_url: patient.profile_pic_url,
      firstname: patient.firstname,
      lastname: patient.lastname
    },function(response){
      if(response.error){
        alert(response.error)
      }
    });
      
  }

  function getreaction(data){
    var theResponse = $resource(data.checkUrl);
    $interval(function(){
      theResponse.get(null,function(status){
        console.log("Hey status run")
        console.log(status)
      })
    },60000);
  }
  

  $scope.tryResponse = function(){
    var sendObj = {
      name: "obi",
      time: "today",
      id: patient.user_id
    }

    var docResponse = $resource("/user/feedback",null,{feedback:{method: "PUT"}});
    docResponse.feedback(sendObj,function(data){
      console.log(data)
    })
  }

}]);*/


