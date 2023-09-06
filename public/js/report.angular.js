var app = angular.module('myApp',["angularModalService","angularMoment",'ui.bootstrap',
  'angular-clipboard',"ngResource","btford.socket-io","ngTouch",'xen3r0.underscorejs',"pdf"]);


app.run(function(){
  moment.updateLocale('en', {
    calendar : {
      lastDay : '[Yesterday at] HH:mm',
      sameDay : '[Today at] HH:mm',
      nextDay : '[Tomorrow at] HH:mm',
      lastWeek : '[last] dddd [at] HH:mm',
      nextWeek : 'dddd [at] HH:mm',
      sameElse : 'L'
    }
  });
});

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


app.controller("ultraSoundReportCtrl",["$scope","$http","localManager","$rootScope",
  function($scope,$http,localManager,$rootScope){
    var uid = "";

    $scope.fileList = [];
    var studyDetails = getParamsToObject(window.location.search); //localManager.getValue("studyProps")

    $http.get("https://applinic.com/ris/radiology/get-referral",
      {params:{centerEmail: studyDetails.centerEmail,ref_uid: studyDetails.studyIUID}})
    .success(function(responseData){
      var data = responseData.center || {};
      $scope.ultraRefData = responseData.ris || {radiology:{}};
      //$scope.ultraRefData.radiology = {};
      //please the reporter credentials are password= ID; username=center email;
      console.log(data.reporters, data)
      var elemPos = data.reporters.map(function(elem){return elem.email.toString()}).indexOf(studyDetails.radiologistEmail);
      if(elemPos !== -1){
        var reporter = data.reporters[elemPos];
        $scope.ultraRefData.center_name = data.name;
        $scope.ultraRefData.center_email = data.email;
        $scope.ultraRefData.center_uid = data._id;
        $scope.ultraRefData.center_phone = data.phone;
        $scope.ultraRefData.center_id = data.user_id;
        $scope.ultraRefData.radiology.staffname = reporter.name || "";
        $scope.ultraRefData.radiology.designation = reporter.designation || "";
        $scope.ultraRefData.radiology.attended = false;
        //$scope.ultraRefData.radiology.clinical_summary = "";
        $scope.ultraRefData.radiology.doctor_firstname = studyDetails.referringPhysician;
       $scope.ultraRefData.radiology.doctor_lastname = "";
       //$scope.ultraRefData.radiology.doctor_id = "";
      // $scope.ultraRefData.radiology.findings =  "";
       //$scope.ultraRefData.radiology.indication = "";
       $scope.ultraRefData.radiology.patient_age = studyDetails.birtDate;
       $scope.ultraRefData.radiology.patient_firstname = studyDetails.patientName;
       //$scope.ultraRefData.radiology.patient_phone = "";
       $scope.ultraRefData.radiology.patient_gender = studyDetails.gender || "";
       //$scope.ultraRefData.radiology.patient_email = "";
        //$scope.ultraRefData.radiology.doctor_email = "";
        $scope.ultraRefData.radiology.report_date = new Date();
       $scope.ultraRefData.radiology.ray_type = "ultrasound";
      $scope.ultraRefData.radiology.sample_files = [];
       $scope.ultraRefData.radiology.test_id = studyDetails.studyIUID;
       $scope.ultraRefData.radiology.test_to_run = [{name: studyDetails.studyName,sn:1}];
       $scope.ultraRefData.ref_id = Math.floor(Math.random() * 9999999999);
       $scope.ultraRefData.ref_uid = studyDetails.studyIUID;
       $scope.ultraRefData.date = studyDetails.studyDate;
      } else {
        alert("You are not permitted to write report for this study. Please contact the center for permission");
      }
    });


    $scope.preview = function(study) {
      /*if(!navigator.onLine){
        alert('NO INTERNET CONNECTIONS! You have to connect to internet before you can proceed.');
        return;
      }*/
    $scope.loading = true;

      study.date = new Date(studyDetails.studyDate);

      var fd = new FormData();

      var arr = [];

      localManager.setValue('radiology_type','ultrasound_test');

      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);

      function uploadFile(file) {
        xhr.open("POST", '/ris/save-report')
        xhr.send(file);
      }

      if($scope.fileList.length > 0){
        //$scope.fileList.forEach(function(file){
   for(var key = 0; key < $scope.fileList.length; key++){
            fd.append(key,$scope.fileList[key],$scope.fileList[key].name);
          };
          uploadFile(fd)
        //})
      } else {
        $scope.progress = 100;
        postData(study);
      }

      function uploadProgress(evt) {
        $scope.progressVisible = true;
        $scope.$apply(function(){
          if (evt.lengthComputable) {
            $scope.progress = Math.round(evt.loaded * 100 / evt.total);
          } else {
            $scope.progress = 'unable to compute';
          }
        })
      }

      function uploadComplete(evt) {
        $scope.$apply(function(){
    $scope.userData = JSON.parse(evt.target.responseText);
          //$scope.sampleImages = $scope.userData.arr;
          study.sample_files = $scope.userData.arr;
          postData(study);
        })

      }

      function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
        $scope.loading = false;
      }

      function uploadCanceled(evt) {
        $scope.$apply(function(){
          $scope.progressVisible = false;
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.");
      }


      function postData(data) {
        $http.post('/ris/save-report',data)
 .success(function(response){
          if(!response.status){
            alert(response.message);
            $scope.loading = false;
          } else {
            //localManager.setValue("currentPage",path)
            //localManager.setValue("currPageForRadiology",path)
            localManager.setValue('templatePath',window.location.href)
            localManager.removeItem('speechTextData');
            window.location.href = response.path;
          }
        });
      }

    }

    /* drag and drop image logic */
    var drop = $("input");
    drop.on('dragenter', function (e) {
      $(".drop").css({
        "border": "4px dashed #09f",
        "background": "rgba(0, 153, 255, .05)"
      });
 $(".cont").css({
        "color": "#09f"
      });
    }).on('dragleave dragend mouseout drop', function (e) {
      $(".drop").css({
        "border": "3px dashed #DADFE3",
        "background": "transparent"
      });
      $(".cont").css({
        "color": "#8E99A5"
      });
    });

    function handleFileSelect(evt) {

      var files = evt.target.files; // FileList object

      var ft = Array.from(files);

      for(var j = 0; j < ft.length; j++){ // helps to accomodate files selected singly
        $scope.fileList.push(ft[j])
      }
 // Loop through the FileList and render image files as thumbnails.
      for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
          continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            // Render thumbnail.
            var span = document.createElement('span');
            span.id = Math.floor(Math.random() * 999999).toString();
            span.fileName = theFile.name;
            span.addEventListener('click',delImage,false);
            span.innerHTML = ['<img class="thumb" src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('') + '<span style="font-weight: bold;cursor: pointer;margin-right: 15px">X</span>';
            document.getElementById('list').insertBefore(span, null);
          };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
      }
    }

    var elem;

    function delImage(evt){
      elem = document.getElementById(evt.currentTarget.id);
      elem.style.display = "none";
      for(var j = 0; j < $scope.fileList.length; j++){
        if($scope.fileList[j].name === evt.currentTarget.fileName){
          $scope.fileList.splice(j,1);
          break;
        }
      }
    }

    $('#files').change(handleFileSelect);

   
    var iframe = angular.element(document.getElementById("loadSpeechText"));
    var btnClose = angular.element(document.getElementById("flameCloseBtn"));
    iframe[0].style.visibility = "hidden";
    btnClose[0].style.visibility = "hidden";
    $scope.isOpen = false;
    iframe[0].src = "https://www.applinic.com";
   
    $scope.speech2Text = function(field){
      //$scope.ultraRefData.fieldType = field;
      //localManager.setValue('speechTextData',$scope.ultraRefData);
      src = `http://applinic.com/assets/pages/speechText.html?field=${field}&name=${$scope.ultraRefData.radiology.patient_firstname}&age=${$scope.ultraRefData.radiology.patient_age}&gender=${$scope.ultraRefData.radiology.patient_gender}&studyname=${studyDetails.studyName}&uid=${studyDetails.studyIUID}`;
      iframe[0].src = src;
      if(!$scope.isOpen) {
        iframe[0].style.visibility = "visible";
        btnClose[0].style.visibility = "visible"
        iframe[0].contentWindow.document.open();
        $scope.isOpen = true;
      } else {
        //iframe[0].style.visibility = "hidden";
        iframe[0].contentWindow.document.close();
        $scope.isOpen = false;
      }
    }

    $scope.closeFrame = function() {
        iframe[0].style.visibility = "hidden";
        btnClose[0].style.visibility = "hidden"
        iframe[0].contentWindow.document.close();
        iframe[0].src = "https://www.applinic.com";
        $scope.isOpen = false;
    }

}]);


function getParamsToObject(str) {
  var obj = {}; 
  str.replace(/([^?=&]+)=([^&]*)/g, function(m, key, value) {
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
  }); 

  return obj;
}


