(function() {
	angular.module("myApp",[])
	.factory("localManager",["$window",function($window){
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
	}])
	.controller('speechTextCtrl',['$scope','localManager','$http',
	function($scope,localManager,$http){

		var saveText = angular.element(document.getElementById('saveTextBtn'));

		console.log(window.location.search)

		$scope.studyData = {
			center_email: "",
			radiology:{

			}
		};

		$scope.closeFrame = function() {
			window.parent.close();
		}

		switch($scope.studyData.fieldType) {
			case "findings":
				$scope.entry = $scope.studyData.radiology.findings;
			break;
			case "conclusion":
			    $scope.entry = $scope.studyData.radiology.conclusion;
			break;
			case "advice":
				$scope.entry = $scope.studyData.radiology.advice;
			break;
		}


		$scope.saveEdit = function() {
			$scope.loading = true;
			switch($scope.studyData.fieldType) {
				case "findings":
					$scope.studyData.radiology.findings = $scope.entry;
				break;
				case "conclusion":
				    $scope.studyData.radiology.conclusion = $scope.entry;
				break;
				case "advice":
					$scope.studyData.radiology.advice = $scope.entry;
				break;
			}

			$http.post('/ris/save-report',$scope.studyData)
	        .success(function(response){    
	          if(!response.status){
	          	alert("Oops! Error occurred while saving. Please try again")    
	          } else {  
	         	alert("Entry saved!")
	          }

	          $scope.loading = false;
	        });
    	}
		
	}]);

})();

function getParamsToObject(str) {
  var obj = {}; 
  str.replace(/([^?=&]+)=([^&]*)/g, function(m, key, value) {
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
  }); 

  return obj;
}