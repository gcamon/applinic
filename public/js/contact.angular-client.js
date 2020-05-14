var app = angular.module('myApp',[]);
//htmlToPdfSave

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