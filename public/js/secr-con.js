app.controller("secrController",["$scope","$rootScope","$resource","ModalService","templateService",
  function($scope,$rootScope,$resource,ModalService,templateService){

  $scope.viewService = function(id){
    var center;
    if(id) {
      center = {centerId: id};
    } else {
      center = {centerId: $scope.service.id};
    }

    var service = $resource("/user/gcamon/get-unavailable-service/:centerId",center)
    service.get(function(data){
      console.log('========')
      console.log(data);
      $rootScope.sList = data;
    })
  }

  var secr_m = $resource("/user/gcamon/m-status");
  secr_m.query(function(data){
    console.log('========');
    console.log(data);
    $rootScope.mList = data;
  })

  $scope.pay = function(id,name){ 
    $rootScope.name = name
    templateService.holdId = id;
    ModalService.showModal({
      templateUrl: 'bank-info.html',
      controller: "cashoutSecrModalController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
         
      });
    });  
    
  }

  /*
    <input type="text" placeholder="write.." ng-model="bankDetail.bank_name">
    </div>
    <div>
      <label>Bank account number: </label>
      <input type="text" placeholder="write.." ng-model="bankDetail.account_number">
    </div>
    <div>
      <label>Amount to cash out: </label>
      <input type="number" placeholder="write.." ng-model="bankDetail.amount">
    </div>
    <div style="padding:20px">
  */

}]);

app.controller("cashoutSecrModalController",["$scope","$rootScope","$resource","ModalService","templateService",
  function($scope,$rootScope,$resource,ModalService,templateService){
  var id = templateService.holdId;
  $scope.account = {}
  $scope.cashout = function() {
    if(Object.keys($scope.account).length === 2){

      var elempos = $rootScope.mList.map(function(x){return x.user_id}).indexOf(id);
      var found = $rootScope.mList[elempos];
      var whole = Math.round(found.ewallet.available_amount);
      var reduceWhole = whole - 1;
      if(reduceWhole > 1) {
        var payObj = {
          bank_name: $scope.account.bank,
          account_number: $scope.account.number,
          amount: reduceWhole,
          userId: id
        }
        console.log(payObj)
        var cashOut = $resource("/user/cashout",null,{cashing:{method: "PUT"}});
        cashOut.cashing(payObj,function(data){
          alert(data.message);
          if(data.balance) {
           alert("Remaining balance: " + data.balance)
          }    
        });
      } else {
        alert("insufficient fund")
      }
    } else {
      alert("Please fill all field")
    }

  }
}])


app.controller("createRoomSecr",["$scope","$rootScope","mySocket","localManager",function($scope,$rootScope,mySocket,localManager){
  var user = localManager.getValue("resolveUser");
  console.log("========")
  console.log(user)
  $scope.service = {};
  mySocket.emit('join_secr',{userId: user.user_id});

  mySocket.on("s-r",function(data){
    console.log(data);
  });

  mySocket.on("m-r",function(data){
    alert(data.amount)
    console.log(data);
    var elempos = $rootScope.mList.map(function(x){return x.user_id}).indexOf(data.secrId);
    var found = $rootScope.mList[elempos]
    found.ewallet.available_amount += data.amount;
  });

  $scope.check = function() {
    mySocket.emit("try pay",{userId: user.user_id});
  }

 

}]);