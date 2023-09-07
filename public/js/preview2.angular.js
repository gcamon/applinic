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

		alert(localManager.getValue("centerEmail"))

		$scope.submitReport = function(id,uid) {

			var url = '/ris/' + uid + "/" + id;
		  var htm = tempField.html();

		  $scope.loading = true;

		  var type = localManager.getValue('radiology_type') || null;

		  var fixZoom = "<div style='zoom:0.66'>" + htm + '</div>';

		  $http.post(url,{html: fixZoom,_id: id,uid: uid,type: type})
		  .success(function(resp){
		  	if(resp.status){
		  		$scope.msg = resp.message;
		  		localManager.removeItem('radiology_type')
		  		//window.location.href = localManager.getValue('templatePath');
		  	} else {
		  		alert(resp.message)
		  	}

		  	$scope.loading = false;
		  })
		   
		}

		$scope.back = localManager.getValue('templatePath');
		
	}]);

})();