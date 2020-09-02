var app = angular.module('myApp',["angularModalService","angularMoment",'ui.bootstrap',
  'angular-clipboard',"ngResource"]);


app.controller("templatectrl",["$scope","$http","$filter","ModalService","$rootScope",
  function($scope,$http,$filter,ModalService,$rootScope){
  $scope.patient = {};
  

  var s = angular.element(document.getElementById('summary'));
  var f = angular.element(document.getElementById('findings'));
  var c = angular.element(document.getElementById('conclusion'));
  var a = angular.element(document.getElementById('advise'));
  //var r = angular.element(document.getElementById('remark'));
  var img = angular.element(document.getElementById('img'));


  $scope.getdata = function(patientNames,patientId,studyDate,patientAge,
    patientSex,referringPhysician, studyName, studyDate, reporterName, reporterDesignation, 
    reporterEmail,studyLink,summary,findings,conclusion,advise,centerName,
    centerAddress, centerCity, centerCountry, centerPhone, centerEmail, centerProfilePic,
     _id,centerId,templateId,remark){
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
      //r[0].innerText = remark || "";
      a[0].innerText = advise || "";
      if(templateId === 'none')
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

  $rootScope.closeTemp = function() {
    $rootScope.isPreIframe = false;
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
          for(var i = 0; i < $rootScope.addForLinux.length; i++) {
            $rootScope.addForLinux[i].style.zoom = 1.0;
          }   
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
    var qlink;

    $scope.getLink = function(study) {
      qlink = 'https://applinic.com/report-template/' + reporterID + '/' + study._id;
      return qlink;
    }

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