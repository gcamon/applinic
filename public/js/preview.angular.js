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
	.controller('previewCtrl',['$scope','$rootScope','$http','localManager',
	function($scope,$rootScope,$http,localManager){

		var tempField = angular.element(document.getElementById('tempField'))

		$scope.submitReport = function(id,uid) {
			var url = '/study/' + study.uid + "/" + id;
		  var htm = tempField.html();

		  $scope.loading = true;

		  var fixZoom = "<div style='zoom:0.66'>" + htm + '</div>';

		  $http.post(url,{html: fixZoom,_id: id,uid: uid})
		  .success(function(resp){
		  	if(resp.status){
		  		$scope.msg = resp.message;
		  	} else {
		  		alert(resp.message)
		  	}

		  	$scope.loading = false;
		  })
		   
		}

		$scope.back = localManager.getValue('studyPath');
		
	}]);

})();