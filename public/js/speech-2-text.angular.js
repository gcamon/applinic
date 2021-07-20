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

		var saveText = angular.element(document.getElementById('saveTextBtn'))

		$scope.studyData = localManager.getValue('speechTextData') || {radiology:{}}

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

			$http.post('/user/save-report',$scope.studyData)
	        .success(function(response){          
	          if(!response.status){
	          	alert("Oops! Error occurred while saving. Please try again")    
	          } else {  
	         	alert("Entry saved!")
	          }

	          $scope.loading = false
	        });
    	}
		
	}]);

})();