model.services.find({type:"Laboratory",center_city:req.query.city},
    {center_name:1,center_city:1,center_address:1,center_country:1,user_id:1,unavailable_services:1,center_phone:1,_id:0},function(err,data){
    if(err) throw err;
    if(data) {
      var newListToSend = [];        
      var sendObj = {};
      var listOfTests = req.query.testList;        
      for(var i = 0; i < listOfTests.length; i++){
        var elements = data.map(function(x){return x.unavailable_services});
        var count = 0;
        var foundTest = [];          
        while(count < elements.length){
          var centerInfo = {}                      
          var elementPos = elements[count].map(function(x){ return x.id}).indexOf(listOfTests[i].id);            
          centerInfo.notFound = listOfTests[i].name;
          if(elementPos === -1){                     
            centerInfo.center_name = data[count].center_name;
            centerInfo.center_city = data[count].center_city;
            centerInfo.center_country = data[count].center_country;
            centerInfo.center_city = data[count].center_city;
            centerInfo.center_phone = data[count].center_phone;
            centerInfo.center_id = data[count].user_id;
            centerInfo.center_address = data[count].center_address;
            centerInfo.testFound = listOfTests[i].name;              
            foundTest.push(centerInfo);               
            sendObj[listOfTests[i].name] = foundTest;
            newListToSend.push(sendObj)  
          } 
          count++;
        }
      }
     
      var filter = {};
          
      for(var i in sendObj){
        for(var j = 0; j < sendObj[i].length; j++){
          if(!filter.hasOwnProperty(sendObj[i][j].center_id)){                             
            filter[sendObj[i][j].center_id] = {};
            filter[sendObj[i][j].center_id].count = 1;
            filter[sendObj[i][j].center_id].name = sendObj[i][j].center_name;
            filter[sendObj[i][j].center_id].address = sendObj[i][j].center_address;
            filter[sendObj[i][j].center_id].city = sendObj[i][j].center_city;
            filter[sendObj[i][j].center_id].country = sendObj[i][j].center_country
            filter[sendObj[i][j].center_id].id = sendObj[i][j].center_id
            filter[sendObj[i][j].center_id].str = sendObj[i][j].testFound;
            filter[sendObj[i][j].center_id].phone = sendObj[i][j].center_phone;
          } else {
            filter[sendObj[i][j].center_id].str += "," + sendObj[i][j].testFound;
            filter[sendObj[i][j].center_id].count++;
          }
        }
      }
     

      Array.prototype.diff = function(arr2) {
        var ret = [];
        this.sort();
        arr2.sort();
        for(var i = 0; i < this.length; i += 1) {
            if(arr2.indexOf( this[i].name ) === -1){
                ret.push( this[i] );
            }
        }
        return ret;
      };

      var sub = {};
      sub['full'] = []
      sub['less'] = [];
      for(var k in filter){
        if(filter[k].count === req.query.testList.length) {
          sub['full'].push(filter[k])
        } else {
          var arr1 = req.query.testList;
          var newFilterArr = filter[k].str.split(",");           
          var notFoundArr = arr1.diff(newFilterArr);
          filter[k].notFound = notFoundArr;          
          sub['less'].push(filter[k]);
        }
      }
      res.send(sub)
    } else {
      var sub = {};
      sub['full'] = []
      sub['less'] = [];
      res.send(sub);
    }
  });