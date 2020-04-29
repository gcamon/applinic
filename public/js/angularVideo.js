(function(){
	var app = angular.module('rtcVideo', ["ngResource","angularModalService","angularMoment",'ui.bootstrap'],
		function($locationProvider){$locationProvider.html5Mode(true);}
    );


		var storage = window.localStorage.getItem("resolveUser");
		var user = JSON.parse(storage);


		var names = user.name || user.title + " " + user.firstname;
		
		var client = new PeerManager(names);
		var mediaConfig = {
        audio:true,
        video: {
					mandatory: {},
					optional: []
        }
    };

    var control = {}

    var controllerSocket = client.getSocketForController();
        /*
    var mediaConfig = {
        audio:true,
        video: {
        	width: {max: 500},
        	height: {max: 500}
        }
    };

    */

    
		//var user = JSON.parse(storage)

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

		app.service("templateService",[function(){
			this.playAudio = function(track){
		    switch(track){
		      case 1:
		        audio('/assets/audio/demonstrative.mp3');
		      break;
		      case 2:
		        audio('/assets/audio/whatsappweb.mp3');
		      break;
		      case 3:
		        audio('/assets/audio/gets-in-the-way.mp3');
		      break;
		      case 4:
		        audio('/assets/audio/cute.mp3');
		      break;
		      default:
		        audio('/assets/audio/tweet.mp3');
		      break
		    }
		    
		  }

		  var audio = function(trackurl){
		    var audio = new Audio(trackurl);
		    audio.play();
		  }

		}]);

    app.factory('camera', ['$rootScope', '$window', function($rootScope, $window){
    	var camera = {};
    	camera.preview = $window.document.getElementById('localVideo');
    	//Get the camera stream and attach to be passed onto a web element
    	camera.start = function(){
				return requestUserMedia(mediaConfig)
				.then(function(stream){						
					attachMediaStream(camera.preview, stream);
					client.setLocalStream(stream);
					camera.stream = stream;
					$rootScope.$broadcast('cameraIsOn',true);
				})
				.catch(Error('Failed to gain access to the device camera.'));
		  };
    	camera.stop = function(){
    		return new Promise(function(resolve, reject){			
				try {
					//camera.stream.stop() no longer works
					
					var track =  camera.stream.getTracks();
          for( var i = 0; i < track.length; i++ ){
	          track[i].stop();
	        }
					camera.preview.src = '';
					resolve();
				} catch(error) {
					reject(error);
				}
    		})
    		.then(function(result){
    			$rootScope.$broadcast('cameraIsOn',false);
    		});	
			};
			return camera;
    }]);

	   /*app.config(function($routeProvider){
			  $routeProvider

			  .when("/",{
			  	templateUrl: "/assets/pages/site.html"
			  })

			  .when("/cam/:id",{
			  	templateUrl: "/assets/pages/site.html",
			  })

			  .when("/cam/:id/local-streams",{
			  	templateUrl: "/assets/pages/local-remote.html",
			  	//controller: "siteRemoteStreamsController"
			  })
		 });*/

	app.controller('RemoteStreamsController', ["$scope","$rootScope",'camera', '$location', '$http','$window',"templateService",
	 function($scope,$rootScope,camera, $location, $http, $window,templateService){
		var rtc = this;
		rtc.remoteStreams = [];
		//var name = user.title + " " + user.firstname; //gets name of doctor in this case

		function getStreamById(id) {
		    for(var i=0; i<rtc.remoteStreams.length;i++) {
		    	if (rtc.remoteStreams[i].id === id) {return rtc.remoteStreams[i]}
		    }
		}
		

		rtc.siteLink = function(controlId){
			
			control.controlId = controlId;
				//join a room
    	client.controlJoin(controlId,names); 
			return $window.location.host + "/user/cam/" + controlId;
		}

		rtc.loadData = function () {
			// get list of streams from the server		
		
			var url = '/user/streams.json/' + control.controlId;
			
			$http.get(url).success(function(data){
				// filter own stream
					
				  var streams = data.filter(function(stream) {							
			      	//return stream.id !== client.getId();
			      	return stream.userId !== user.user_id;
			    });

			

			    // get former state
			    //starts from one for remote streams
			    if(rtc.remoteStreams.length == 0) { 
				    for(var i=0; i < streams.length; i++) {
				    	//var stream = getStreamById(streams[i].id);
				    	//streams[i].isPlaying = (!!stream) ? stream.isPLaying : false;
				    	streams[i].isPlaying = false;			    	
				    	rtc.remoteStreams.push(streams[i]);

				    	//modified on 28/04/2020
				    	//rtc.view(streams[i]);
				    	//break;
				    }		
			  	} else {
			  		if(streams.length > 0) {
				  		var elePo = rtc.remoteStreams.map(function(x){return x.userId}).indexOf(streams[streams.length - 1].userId);
				  		if(elePo === -1) {				  			
				  			streams[streams.length - 1].isPlaying = false;
				  			rtc.remoteStreams.push(streams[streams.length - 1]);
				  		} else {
				  			rtc.remoteStreams.splice(elePo,1);
				  			streams[streams.length - 1].isPlaying = false;
				  			rtc.remoteStreams.push(streams[streams.length - 1]);
				  		}

				  		//modified on 28/04/2020
				  		//rtc.view(streams[streams.length - 1])
			  		}
			  		//rtc.view(streams[i]);
			  	}

			  	console.log("streams: ", streams)

			    $rootScope.connections = streams;
			    //rtc.remoteStreams = streams;
			});
		};

		rtc.view = function(stream){
			client.peerInit(stream.id,stream.name);
			stream.isPlaying = !stream.isPlaying;
		};

		rtc.call = function(stream){
			/* If json isn't loaded yet, construct a new stream 
			 * This happens when you load <serverUrl>/<socketId> : 
			 * it calls socketId immediatly.
			**/
			if(!stream.id){
				stream = {id: stream, isPlaying: false};
				rtc.remoteStreams.push(stream);
			}
			if(camera.isOn){
				client.toggleLocalStream(stream.id);
				if(stream.isPlaying){
					client.peerRenegociate(stream.id);
				} else {
					client.peerInit(stream.id);
				}
				stream.isPlaying = !stream.isPlaying;
			} else {
				camera.start()
				.then(function(result) {
					client.toggleLocalStream(stream.id);
					if(stream.isPlaying){
						client.peerRenegociate(stream.id);
					} else {
						client.peerInit(stream.id);
					}
					stream.isPlaying = !stream.isPlaying;
				})
				.catch(function(err) {
					console.log(err);
				});
			}
		};

		//initial load
		//rtc.loadData();
    	/*if($location.url() != '/'){
      		rtc.call($location.url().slice(1));
    	};*/


    /*client.reloadFn(function () {
    	rtc.loadData(); //automaticall call the refresh
    });*/
		



	$rootScope.connectionStatus = false; // use to check when stream is available;
		
    controllerSocket.on("reload streams",function(data){
    
  		$rootScope.message = "Partner stream is now available.";

  		$rootScope.connectionStatus = data.status;

  		setTimeout(function(){
    		$scope.$apply(function(){
    			$rootScope.message = "";
    		})
  		},3500);
    	
    	
   		//var decide = confirm($rootScope.message);
    	if(data.status) {
    		rtc.loadData();
    	} else {
    		alert("Video call aborted!");
    		//send emit to stop video to the other peer.
    	}
    	
    })

  	rtc.investigations = [];
  	rtc.prescriptions = [];
    controllerSocket.on('new investigation',function(info){
    	templateService.playAudio(2);
    	$scope.$apply(function(){
    		rtc.investigations.unshift(info);
    		$rootScope.message = "New test receive...";

    	});

    	
    	setTimeout(function(){
    		$scope.$apply(function(){
    			$rootScope.message = "";
    		})
    	},3000);
    	
  	});

  	controllerSocket.on('new prescription',function(info){
    	templateService.playAudio(2);
    	$scope.$apply(function(){
    		rtc.prescriptions.unshift(info);
    		$rootScope.message = "New test receive...";
    	})    	
  		//alert(info.message);  
  		

    	setTimeout(function(){
    		$scope.$apply(function(){
    			$rootScope.message = "";
    		})
    	},3000);		
  	});
	  

	}]);

	app.controller('LocalStreamController',['camera','$rootScope', '$scope', 'localManager','$window','$location','$http',
	 function(camera,$rootScope, $scope, localManager,$window, $location, $http){
		var localStream = this;
		
		localStream.name = user.title + " " + user.firstname + " " + user.lastname  || 'Guest';
		localStream.link = '';
		localStream.cameraIsOn = false;
		localStream.cameraStatus = "Loading...";

		localStream.connections = $rootScope.connections;

		$scope.goToDashbaord = function(){	//remember to change the for the videoserver to point to applinic main
			switch(user.typeOfUser) {
				case "Doctor":
						window.location.href = "/user/doctor";
				break;
				case "Patient":
						window.location.href = "/user/patient";
				break;
				case "Pharmacy":
						window.location.href = "/user/pharmacy";
				break;
				case "Laboratory":
						window.location.href = "/user/laboratory";
				break;
				case "Radiology":
						window.location.href = "/user/radiology";
				break;
			}		
		
		}

		$scope.invite = {}
		$scope.findInvitee = false;

		$scope.$watch("invite.type",function(newVal,oldVal){
			if(newVal){
				$scope.findInvitee = true;
			}

			switch(newVal) {
				case "Doctor": 
					$scope.inviteInfo = "Enter Doctor's name e.g Dr Ede Obinna" 
				break;
				case "Patient": 
					$scope.inviteInfo = "Enter patient's firstname e.g Obinna" 
				break;
				default:
				 $scope.inviteInfo = "Enter center name" 
				break
			}
		})

		$scope.closeInvite = function() {
			$scope.findInvitee = false;
		}

		$scope.getInvitee = function() {
			$scope.loading = true;
			$http({
	      method  : 'GET',
	      url     : "/user/getInvitee" + "?name=" + $scope.invite.name + "&type=" + $scope.invite.type,
	      data    : $scope.invite,
	      headers : {'Content-Type': 'application/json'} 
	      })
	    .success(function(data) {
	    	$scope.loading = false;
	    	$scope.inviteeList = data;
	    });         
		}

		$scope.userId = user.user_id;
		var saveControlId = {};

		$scope.sendInvitation = function(id) {
			 controllerSocket.emit("convsersation invitation signaling",
			 	{to: id,from: user.user_id,controlId:saveControlId.id,name: user.name,firstname: user.firstname},function(data){
			 	$scope.$apply(function(){
			 		$scope.deliveryMsg = "sent!";
			 		alert(data.message)
			 	});	      
	    })
		}

		//when invitation was rejected.
		controllerSocket.on("call reject",function(res){
			alert(res.message)
		});

		var path = $location.path();
		var newPath = path + "/local-streams";
		$scope.allLocalStreams = function() {
			$location.path(newPath);
		}

		$scope.$on('cameraIsOn', function(event,data) {
  		$scope.$apply(function() {
	    	localStream.cameraIsOn = data;
	    	localStream.cameraStatus = "Connect";
	    });
		});

		localStream.getControlId = function(id){
			saveControlId.id = id;		
		}

		localStream.toggleCam = function(){
			if(localStream.cameraIsOn){
				localManager.removeItem("username");
				camera.stop()
				.then(function(result){
					client.send('leave');
	    		client.setLocalStream(null);
				})
				.catch(function(err) {
					console.log(err);
				});
			} else {
				camera.start()
				.then(function(result) {
					localStream.link = $window.location.host + '/' + client.getId();
					if(localManager.getValue("username") !== "Guest" || localManager.getValue("username") !== ""){
						localManager.setValue("username",localStream.name);
					}				
					client.send('readyToStream', { 
						name: user.name || user.title + " " + user.firstname,
						controlId: saveControlId.id,
						userId: user.user_id,
						profile_pic_url: user.profile_pic_url,
						type: user.typeOfUser,
						specialty: user.specialty
					});
				})
				.catch(function(err) {
					console.log(err);
				});
			}
		};

		localStream.toggleCam();

	}]);

	app.controller("chooseSessionController",["$scope","$http","$rootScope",function($scope,$http,$rootScope){
		
		//$rootScope.holdPatientData saved when VideoDiagnosisController initialized
		$scope.loading = true;
		$http({
      method  : 'GET',
      url     : "/user/doctor/get-patient-sessions?patient_id=" + $rootScope.holdPatientData.id, 
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(data) {      
      $scope.loading = false;
      $scope.sessions = data;
    });

   	$scope.getSession = function(sess) {
   		if(sess) {
   			$rootScope.session = sess.session_id;
   		} else {
   			$rootScope.session = genHash(18);
   		}
   	}

	}]);


	app.service("patientService",["$resource",function($resource){
		return $resource("/user/doctor/specific-patient");
	}]);


	app.controller("VideoDiagnosisController",["$rootScope","$scope","$window","$http","localManager","Drugs","$resource",
		"ModalService","patientService",
  function($rootScope,$scope,$window,$http,localManager,Drugs,$resource,ModalService,patientService){


  $rootScope.treatment = {};
  var patient = {}; 

  $rootScope.userId = user.user_id; 
 
  var random = parseInt(Math.floor(Math.random() * 9999 ) + "" + Math.floor(Math.random() * 9999))//Math.floor(Math.random() * 9999999999);

  //$rootScope.session = parseInt(Math.floor(Math.random() * 9999 ) + "" + Math.floor(Math.random() * 9999))//Math.floor(Math.random() * 99999999999);

  
  var toArr = window.location.href.split("/");


  patient.id = toArr[toArr.length-2] //localManager.getValue("userId"); Refers to user id of the patient to be treated 


  controllerSocket.emit("join",{userId: user.user_id});


  var getPatientData = patientService;

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
    patient.phone = data.phone;
    patient.sender = "doctor";
    $rootScope.holdPatientData = patient;
  });
   

  $scope.investigation = function(){
  	if($rootScope.treatment.complain && $rootScope.treatment.provisionalDiagnosis) {  
	  	if($scope.patientInfo.error) { // check to see if patient is for the doctor.
	  		alert("Not allowed: Not your patient.");
	  		return;
	  	}
	  	ModalService.showModal({
	        templateUrl: 'investigation.html',
	        controller: "investigationController"
	    }).then(function(modal) {
	        modal.element.modal();
	        modal.close.then(function(result) {
	        	          
	        });
	    });
  	} else {
  		alert("Presenting Complaint and Provisional Diagnosis fields cannot be empty!")
  	}

  
  }


  $scope.treamentPlan = function() {
  	if($rootScope.treatment.complain && $rootScope.treatment.provisionalDiagnosis) {  
	  	if($scope.patientInfo.error) { //check to see if patient if for the doctor
	  		alert("Not allowed: Not your patient.");
	  		return;
	  	}
	  	ModalService.showModal({
	      templateUrl: 'treatment-plan.html',
	      controller: "treatmentPlanController"
	    }).then(function(modal) {
	      modal.element.modal();
	      modal.close.then(function(result) { 
	      	             
	      });
	    });
    } else {
    	alert("Presenting Complaint and Provisional Diagnosis fields cannot be empty!")
    }
   
  }

  $scope.prescription = function() {
  	if($rootScope.treatment.complain && $rootScope.treatment.provisionalDiagnosis) {  
	  	if($scope.patientInfo.error) {
	  		alert("Not allowed: Not your patient.");
	  		return;
	  	}
	  	ModalService.showModal({
	      templateUrl: 'prescription.html',
	      controller: "prescriptionController"
	    }).then(function(modal) {
	      modal.element.modal();
	      modal.close.then(function(result) { 
	      	             
	      });
	    });
    } else {
    	alert("Presenting Complaint and Provisional Diagnosis fields cannot be empty!");
    }

  }

  $scope.appointment = function() {
  	if($rootScope.treatment.complain && $rootScope.treatment.provisionalDiagnosis) {  
	  	if($scope.patientInfo.error) {
	  		alert("Not allowed: Not your patient.");
	  		return;
	  	}
	  	ModalService.showModal({
	        templateUrl: 'calender-template.html',
	        controller: 'appointmentModalController'
	    }).then(function(modal) {
	        modal.element.modal();
	        modal.close.then(function(result) { 
	             
	        });
	    });
    } else {
    	alert("Presenting Complaint and Provisional Diagnosis fields cannot be empty!");
    }


    /*ModalService.showModal({
        templateUrl: 'calender-template.html',
        controller: 'appointmentModalController'
    }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) { 
             
        });
    });*/
  }



    //creates drug object for the ng-repeat on the view.
    /*$scope.drugs = Drugs;
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
    },true);  */


    $scope.toPatient = function(){
      //doctor creates the prescription object and sends it the the back end. url is "patient/forwarded-prescription", other informations that
      //comes with the prescription object added to the prescription object in the backend.
      $rootScope.holdPrescriptionToBeForwarded = patient;
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

      $rootScope.holdPrescriptionToBeForwarded = patient;
      $location.path("/search/pharmacy");
    }
    

     // use to select session where entries would be saved.
	  $scope.chechSession = function() {
		  if(!$rootScope.session) {
				ModalService.showModal({
		        templateUrl: 'sessionsList.html',
		        controller: "chooseSessionController"
		    }).then(function(modal) {
		        modal.element.modal();
		        modal.close.then(function(result) {});
		    });
		  } 
		}


    
    $rootScope.submitSession = function(){
    	if($rootScope.treatment.complain && $rootScope.treatment.provisionalDiagnosis) {  
	      var date = new Date();
	      $scope.loading = true;
	      $rootScope.treatment.date = date;      
	      $rootScope.treatment.patient_id = patient.id;
	      $rootScope.treatment.session_id = $rootScope.session;
	      $rootScope.treatment.typeOfSession = "video chat";      
	      $http({
	        method  : 'POST',
	        url     : "/user/doctor/patient-session",
	        data    : $rootScope.treatment,
	        headers : {'Content-Type': 'application/json'} 
	        })
	      .success(function(data) {	      	
	        if(data) {  
	        	$scope.loading = false;
	          $scope.message = "Entry saved successfully!!!";
	        }
	      });
    	} else {    		
    		alert("Presenting Complaint and Provisional Diagnosis fields cannot be empty!")
    	}
    }

}]);


app.controller("investigationController",["$scope","$http","labTests","scanTests","$rootScope","$resource","cities","medicalRecordService",
  function($scope,$http,labTests,scanTests,$rootScope,$resource,cities,medicalRecordService){

  	var patient = $rootScope.holdPatientData;
  	$scope.isLab = false;
  	$scope.isRadio = false;
  	$scope.isInitial = true;
   	$scope.isSearchToSend = false;
   	$rootScope.treatment = ($rootScope.treatment) ? $rootScope.treatment : {};
   	$scope.cities = cities;

  	$scope.lab = function() {
  		$scope.isLab = true;
  		$scope.isRadio = false;
  		$scope.isHistory = false;	

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

  		$scope.sendToLab = function () {  			
  			$scope.isInitial = false;
      	$scope.isSearchToSend = true;
  			getLaboratories();
  		}

  		$scope.sendToPatient = function () {
  			toPatient()
  		}

  		$scope.changeOption = function() {
  			getLaboratories();
  		}

  		$scope.goBack = function() {
  			$scope.isInitial = true;
  			$scope.isSearchToSend = false;
  		}

  		$scope.$watch("TestList",function(newVal,oldVal){
	      patient.lab_test_list = newVal;// adds prescription body to the prescription object as the doctor 
	    //prepares to send it to the back end.
	    },true);  

  		$scope.pickedCenter = null;
  		$rootScope.treatment.session_id = $rootScope.session; // id to identify prescription in a session if one is written.
	    $rootScope.treatment.patient_id = patient.id;
	    $rootScope.treatment.typeOfSession = "video chat";

	    $scope.selected = function(center) {
	    	$scope.pickedCenter = center;
	    	if($scope.message) 
	    		$scope.message = null;

	    	var source = $resource("/user/laboratory/not-ran-services");

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

	    $rootScope.treatment.city = patient.city;
    	$rootScope.treatment.country = patient.country;

	    function getLaboratories() {
	    	var source = $resource("/user/getAllLaboratory")
	    	source.query({city:$scope.treatment.city,country:$scope.treatment.country},function(list){
	    		console.log(list)
	    		$scope.searchResult = list;
	    	});
	    }

	    $scope.sendTest = function () {
		     patient.laboratory = {};
		     patient.laboratory.patient_gender = patient.gender;
		     patient.history = $scope.treatment.history;
		     patient.laboratory.patient_age = patient.age;
		     patient.patient_address = patient.address;
		     patient.patient_firstname = patient.firstname;
		     patient.patient_lastname = patient.lastname;
		     patient.patient_profilePic = patient.patient_profile_pic_url || patient.profile_pic_url;
		     patient.patient_title = patient.title;
		     patient.session_id = $rootScope.session;
		     patient.patient_id = patient.id;
		     patient.date = + new Date(); 
		     patient.noUpdate = true,
		     patient.typeOfSession = "Video chat";
		     patient.treatment = $rootScope.treatment;
		    	
	    	$http({
        method  : 'POST',
        url     : "/user/doctor/send-test",
        data    : patient,
        headers : {'Content-Type': 'application/json'} 
        })
	      .success(function(data) {
	        if(data) {   
	          $scope.message = "Investigations sent!" 
		        controllerSocket.emit("new test",{
		        	center:$scope.pickedCenter,
		        	testList:patient.lab_test_list,
		        	ref_id: data.ref_no,
		        	to:patient.id,
		        	controlId: control.controlId,
		        	by: data.by,
		        	type: "Laboratory Test"
		        });
		      } else {
		      	alert("Error: Investigation not sent!");
		      }
	      });
	    }

	    function toPatient() {
	    	patient.provisional_diagnosis = $rootScope.treatment.provisionalDiagnosis;
	    	pattient.prescriptionBody = testList
	    }
	    
  	};

  	$scope.radio = function() {
  		$scope.isLab = false;
  		$scope.isRadio = true;
  		$scope.isHistory = false;  	
  		

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
  			$scope.isInitial = false;
      	$scope.isSearchToSend = true;
  			getRadiologies();
  		}

  		$scope.sendToPatient = function () {
  			console.log($scope.TestList)
  		}


  		$scope.changeOption = function() {
  			getRadiologies();
  		}

  		$scope.goBack = function() {
  			$scope.isInitial = true;
  			$scope.isSearchToSend = false;
  		}

  		$scope.$watch("TestList",function(newVal,oldVal){
	      patient.lab_test_list = newVal;// adds prescription body to the prescription object as the doctor 
	    //prepares to send it to the back end.
	    },true);  

  		$scope.pickedCenter = null;
  		$rootScope.treatment.session_id = $rootScope.session; // id to identify prescription in a session if one is written.
	    $rootScope.treatment.patient_id = patient.id;
	    $rootScope.treatment.typeOfSession = "video chat";

	    $scope.selected = function(center) {
	    	$scope.pickedCenter = center;
	    	if($scope.message) 
	    		$scope.message = null;

	    	var source = $resource("/user/radiology/not-ran-services")
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
	    		console.log(data)
	    		console.log($scope.TestList);
	    	})
	    }

	    $rootScope.treatment.city = patient.city;
    	$rootScope.treatment.country = patient.country;

	    function getRadiologies() {
	    	var source = $resource("/user/getAllRadiology")
	    	source.query({city:$scope.treatment.city,country:$scope.treatment.country},function(list){
	    		console.log(list)
	    		$scope.searchResult = list;
	    	})
	    }

	    $scope.sendTest = function () {
		     patient.radiology = {};
		     patient.radiology.patient_gender = patient.gender;
		     patient.history = $scope.treatment.history;
		     patient.radiology.patient_age = patient.age;
		     patient.patient_firstname = patient.firstname;
		     patient.patient_lastname = patient.lastname;
		     patient.patient_profilePic = patient.patient_profile_pic_url || patient.profile_pic_url;
		     patient.patient_title = patient.title;
		     patient.session_id = $rootScope.session;
		     patient.patient_id = patient.id;
		     patient.date = + new Date(); 
		     patient.noUpdate = true,
		     patient.typeOfSession = "Video chat"
		     patient.treatment = $rootScope.treatment
		    	
		    $http({
	        method  : 'POST',
	        url     : "/user/doctor/radiology/send-test",
	        data    : patient,
	        headers : {'Content-Type': 'application/json'} 
	        })
	      .success(function(data) {
	        if(data) { 
	        	$scope.message = "Investigations sent!"  
		        controllerSocket.emit("new test",{
		        	center:$scope.pickedCenter,
		        	testList:patient.lab_test_list,
		        	ref_id: data.ref_no,
		        	to:patient.id,
		        	controlId: control.controlId,
		        	by: data.by,
		        	type: "Radiology Test"
		        });
		      } else {
		      	alert("Error: Investigation not sent!")
		      }

	      });
	    }
  	}

  	$scope.isHistory = false;
  	$scope.getHistory = function(arg) {
  		//var type = (arg === "Lab") ? {type: "laboratory"} : {type: "radiology"};
  		$scope.arg = arg;
  		switch(arg) {
				case "Lab":
						$scope.isLab = false;
						$scope.isHistory = true;  	
				break;
				case "Radio":
					$scope.isRadio = false;  
					$scope.isHistory = true;
				break;
				default:
				break;
  		}

  		if(!$scope.patientMedicalRecord) {
	  		var source = medicalRecordService; //$resource("/user/get-medical-record");
	  		source.get({patientId: patient.id},function(data){
  				console.log(data);
  				$scope.patientMedicalRecord = data;
	  		});
  		}
  	}

}]);

app.service("medicalRecordService",["$resource",function($resource){
  return $resource("/user/get-medical-record");
}]);


app.controller("prescriptionController",["$rootScope","$scope","$window","$http","cities",
	"localManager","Drugs","$resource","ModalService","$resource","medicalRecordService",
  function($rootScope,$scope,$window,$http,cities,localManager,Drugs,$resource,ModalService,$resource,medicalRecordService) {
 		
  	var patient = $rootScope.holdPatientData;
  	$scope.isHistory = false;

  	$scope.cities = cities;
  	 //creates drug object for the ng-repeat on the view.
  	$http({
      method  : "GET",
      url     : "/user/getDrugs", //gets special drugs from backend     
      headers : {'Content-Type': 'application/json'} 
      })
    .success(function(response) {   
      $scope.drugs = Drugs.concat(response);
    });

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
      patient.treatment = $rootScope.treatment;
      patient.session_id = $rootScope.session;
      patient.ref_id = Math.floor(Math.random() * 9999999);
	   
      $http({
        method  : 'PUT',
        url     : "/user/patient/forwarded-prescription",
        data    : patient,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) { 
      	console.log(data);   
        alert(data.message);
        controllerSocket.emit("new drugs",{
        	drugList:$scope.drugList,
        	ref_id: patient.ref_id,
        	to:patient.id,
        	controlId: control.controlId,
        	by: data.by,
        	type: "Prescriptions"
        });		     
      });
      
    }

    /*
 			enter the drugs to buy if to send to pharmacy. List of pharmacy within the patient's location will be pulled by defult
 			doctoc selects the center of choice, the selection info div will be updated, indication the stock info of the written drugs
 			if any drug is if found in the list of unavailabe dtrugs for that center puled from the backend, it will be indicated with line through
 			stock info will say "updated or not update" depends on if the center have updated their stock.
    */

    $scope.isInitial = true;
    
    patient.typeOfSession = "video chat";

    $scope.toPharmacy = function(){  
      $scope.isInitial = false;
      $scope.isSearchToSend = true;
      getPharmacy()
      //$location.path("/search/pharmacy");
    }

    $scope.goBack = function() {
    	$scope.isInitial = true;
      $scope.isSearchToSend = false;
    }
    //$rootScope.treatment is defined in videoDiagnosisController

    $rootScope.treatment.city = patient.city;
    $rootScope.treatment.country = patient.country;

    $scope.changeOption = function() {
    	getPharmacy()
    }

    $scope.pickedCenter = null;

    $scope.selected = function(center) {
    	$scope.pickedCenter = center;
    	if($scope.message) 
    		$scope.message = null;

    	var source = $resource("/user/pharmacy/not-ran-services")
    	source.query({centerId: center.user_id},function(data) { 
    		if(data.error){
    			$scope.status = "Not Updated!";
    			return;
    		}

    		$scope.status = "Updated!"
    		var elemPos;
    		for(var i = 0; i < $scope.drugList.length; i++) {
    			$scope.drugList[i].available = true;
    			elemPos = data.map(function(x){return x.name}).indexOf($scope.drugList[i].drug_name)
    			if(elemPos !== -1) {
    				$scope.drugList[i].available = false
    			}
    		}

    		patient.user_id = center.user_id // id is the id of the pharmacy
    	})
    }

    function getPharmacy() {
    	var source = $resource("/user/patient/getAllPharmacy")
    	source.query({city:$scope.treatment.city,country:$scope.treatment.country},function(list){
    		$scope.searchResult = list;
    	})
    }

    $scope.sendDrug = function() {
    	patient.treatment = $rootScope.treatment;
    	$http({
        method  : 'PUT',
        url     : "/user/patient/pharmacy/referral",
        data    : patient,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        if(data.success)   
          $scope.message = "Prescriptions sent !!"
        //alert($scope.message);

        controllerSocket.emit("new drugs",{
        	center:$scope.pickedCenter,
        	drugList:$scope.drugList,
        	ref_id: data.ref_id,
        	to:patient.id,
        	controlId: control.controlId,
        	by: data.by,
        	type: "Prescriptions"
        });		     
       
      });
    }

 
    $scope.isHistory = false;
  	$scope.getHistory = function() {
  		if($scope.isHistory === false) {
	  		$scope.isInitial  = false;
	  		$scope.isSearchToSend = false;
				$scope.isHistory = true; 

	  		if(!$scope.patientMedicalRecord) {
		  		var source = medicalRecordService;//$resource("/user/get-medical-record");
		  		source.get({patientId: patient.id},function(data){
	  				$scope.patientMedicalRecord = data.prescriptions;
		  		});
	  		}

  	 } else {
  	 		$scope.isInitial  = true;	  		
				$scope.isHistory = false; 
  	 }
  	}

  

}]);

app.controller("treatmentPlanController",["$scope","$http","$rootScope",
  function($scope,$http,$rootScope){

		$scope.submitPlan = function() {
			$rootScope.treatment.patient = $rootScope.holdPatientData;
			$rootScope.treatment.session_id = $rootScope.session;
			$rootScope.treatment.typeOfSession = "video chat";
			$rootScope.treatment.date = + new Date();

			$http({
        method  : 'PUT',
        url     : "/user/doctor/treatment-plan",
        data    : $rootScope.treatment,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(data) {
        if(data.success)   
          $scope.message = "Treatment Plan saved !!";       
      });
		}


}]);

app.controller("appointmentModalController",["$scope","$http","$rootScope","moment",
  function($scope,$http,$rootScope,moment){
    
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

		 $scope.treatment = $rootScope.treatment;
		 $scope.treatment.appointment = {};
		 var data = $rootScope.holdPatientData;

    $scope.book = function(){        
      var date = + new Date();
      $scope.treatment.date = date;
      $scope.treatment.patient_id = data.patient_id || data.user_id;
      $scope.treatment.typeOfSession = "Video chat";
      $scope.treatment.appointment.date = $scope.dd._d;
      $scope.treatment.appointment.firstname = data.firstname;
      $scope.treatment.appointment.lastname = data.lastname;
      $scope.treatment.session_id = $rootScope.session;
      $scope.treatment.appointment.profilePic = data.patient_profile_pic_url;

     	sendData($scope.treatment,"/user/doctor/patient-session","POST");  
     	console.log($scope.treatment)   
    }
    //sendData($scope.treatment,"/user/doctor/session-update/save-changes","PUT");
    //sendData($scope.treatment,"/user/doctor/patient-session","POST");
    function sendData(data,url,method) {
      $http({
        method  : method,
        url     : url,
        data    : data,
        headers : {'Content-Type': 'application/json'} 
        })
      .success(function(response) {   
        if(response) {
          $scope.message = "Appointment booked!!";
          //alert("Appointment booked, patient will be notified.");
          //mySocket.emit("realtime appointment notification",{to:data.patient_id});
        }  
      });
    }

}]);





app.factory("Drugs",["$http",function($http){

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



  return listOfDrugs;
}]);


function genHash(count) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

    for( var i=0; i < count; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}



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


})();

