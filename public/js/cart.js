
var app = angular.module('services.cart',[]);

app.service("Reviewer",["localManager",function(localManager){
    this.review = function(cart){
      if(cart) {
        console.log(cart)
      }
    }
}]);

app.service("Cart",["$rootScope","Reviewer",function($rootScope,Reviewer){
    function Storage(){};

    Storage.prototype.setValue = function(key,value){
      window.localStorage.setItem(key, JSON.stringify(value));
    }

    Storage.prototype.getValue = function(key){
      return JSON.parse(window.localStorage.getItem(key));
    }

    Storage.prototype.removeItem = function(key){
      window.localStorage.removeItem(key);
    }

    var localManager = new Storage();



    this.getCart = function(){
      return localManager.getValue("cart") || [];
    };

    this.addItem = function(id){    
      var random = Math.floor(Math.random() * 99999999);      
      if(cartList.length > 0) {
        var elemPos = cartList.map(function(x){return x.id}).indexOf(id);
        if(elemPos !== -1) {
          cartList[elemPos].quantity++;
        } else {
          cartList.push({
            id: random,
            quantity: 1
          });
        }
      } else {
        cartList.push({
          id: random,
          quantity: 1
        });
      }

      this.persist()
    };

    this.addItems = function(arr){
     if(Object.prototype.toString.call( arr ) === '[object Array]') {
        for(var i = 0;i < arr.length; i++) {
          this.addItem(arr[i]);
        }
      } else {
        console.log("Error: requires a list of item's id");
      }
    };


    this.save = function(){
      Reviewer.review(cartList);
    };


    this.remove = function(id){
      if(id !== undefined) {    
        var elempos = cartList.map(function(x){return x.id}).indexOf(id);
        if(elempos !== -1) {
          if(cartList[elempos].quantity > 1) {
            this.changeQuantity(id)
          } else {
            var remove = cartList.splice(elempos,1);
          }          
          this.persist()
        } else {
          console.log("item not in the list")
        }      
      } else {
        console.log("requires id of item to be removed")
      }
    };

    this.clear = function(){
      if(cartList.length > 0) {
        var emptyCart = cartList.splice(0);
      }      
      this.persist();
    };

    this.persist = function(){
      localManager.setValue("cart",cartList);
      this.refresh();   
    };

    this.changeQuantity = function(id){
      var elemPos = cartList.map(function(x){return x.id}).indexOf(id)
      cartList[elemPos].quantity--;
    };

    this.refresh = function(){
       this.getCart();
    };

    var cartList = this.getCart();

}]);

app.controller("cartController",["$scope","$rootScope","Cart","Reviewer",function($scope,$rootScope,Cart,Reviewer){
    
  
    $rootScope.getCart = function(){
      Cart.getCart()
    }

    $rootScope.addItem = function(id){
      Cart.addItem(id)
    }

    $rootScope.addItems = function (arr) {
      Cart.addItems(arr)
    }

    $rootScope.save = function(){      
      Cart.save()
    }
   

    $rootScope.remove = function(id) {
      Cart.remove(id)
    } 

    $rootScope.clear = function(){      
      Cart.clear()
    };

    $rootScope.persist = function(){        
      Cart.persist()
    }

    $rootScope.changeQuantity = function(id){
      Cart.changeQuantity(id)
    };

    $rootScope.refresh = function(){
      Cart.refresh
    };

}]);