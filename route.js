'use strict';
var path = require('path');
var route = require('./config');
var router = route.router;
var fs = require("fs");
var dateTime = require("node-datetime");
var deleteItem = require("./delete");
var EventEmmiter = require("events");
var emitter = new EventEmmiter();

//var token = require("./twilio");
//var randomUserName = require("./randos");

var basicRoute = function (model,sms,io,streams) { //remember streams arg will be removed atfer test

  router.get("/",function(req,res){
    res.render('index',{"message":""});
  });

  router.get("/user",function (req,res) {
    if(req.user){
     switch(req.user.type){
        case "Doctor":
         res.render("profile",{"person":req.user});
         break;
        case "Patient":
          res.render("patient",{"userInfo": req.user});
          break;
        case "Pharmacy":
          res.render("pharmacy",{"userInfo":req.user});
          break;
        case "Laboratory":
          res.render("laboratory",{"userInfo":req.user});
          break;
        case "Radiology":
          res.render("radiology",{"userInfo":req.user});
          break;              
        default:
         res.render("medical",{"userInfo":req.user});
         break;

         //do for fitness center and physiotherapy
      }
    } else {
     res.render('index',{"message":""});
    }
  });

  router.get("/home",function (req,res) {    
    res.render('index',{"message":""});
  });

  router.get("/how-it-works",function(req,res){
    res.render("how-it-work");
  });

  router.get("/contact",function(req,res){
    res.render("contact-us");
  });

  router.get("/user/patient",function(req,res){ 
    if(req.user){
      res.render("patient",{"userInfo": req.user});
    } else {
      res.redirect('/login');
    }

  });

  router.get("/user/doctor",function(req,res){    
    if(req.user){
      res.render("profile",{"person":req.user});
    } else {
      res.redirect("/login");
    }
  });

  router.get("/user/view",function(req,res){
    if(req.user){
      //getSocketInstance(req)
       res.render("medical",{"userInfo": req.user});        
    } else {
      res.redirect('/login');
    }
  });

  router.get("/user/pharmacy",function(req,res){
      if(req.user){
        //getSocketInstance(req)
         res.render("pharmacy",{"userInfo": req.user});        
      } else {
        res.redirect('/login');
      }
  });

  router.get("/user/radiology",function(req,res){
      if(req.user){
        //getSocketInstance(req)
         res.render("radiology",{"userInfo": req.user});        
      } else {
        res.redirect('/login');
      }
  })

  router.get("/user/laboratory",function(req,res){
      if(req.user){
        //getSocketInstance(req)
         res.render("laboratory",{"userInfo": req.user});        
      } else {
        res.redirect('/login');
      }
  })//do for fitness center and physiotherapy


  router.get("/user/doctor/update",function(req,res){
    if(req.user){            
      model.user.findOne({user_id:req.user.user_id},{
        _id:0,
        profile_pic_url: 1,
        sub_specialty: 1,
        skills: 1,
        introductory: 1,
        awards:1,
        education:1,
        specialty: 1,
        work_place: 1,
        phone: 1,
        experience: 1,
        country: 1,
        firstname: 1,
        username: 1,
        lastname: 1,
        user_id: 1,
        email: 1,
        office_hour:1,
        address: 1,
        state: 1,
        city: 1,
        title: 1,
        sub_specialty:1,
      },function(err,data){
        res.send(data)
      })
    } else {
      res.redirect("/login");
    }
  });

 
  //user requesting login page.
  router.get('/login',function(req,res){
    res.render("success",{"message":""})
  });

  //user request sign up page
  router.get("/signup",function(req,res){
    res.render("sign-up");
  })


  //add default pic
  router.put("/admin/defaul-pic",function(req,res){
    var pic = new model.files(req.body);
    pic.save(function(err,info){
      console.log(info);
      res.send({status:"updated"})
    })
  });

  //Tickets is created for every queestion and it intend to be display on a page where answers can follow.
  router.post("/messages",function(req,res){
    if(!req.body.ticket) {    
      var ticket = "#" + Math.floor(Math.random() * 99999999999);
      var date = + new Date();
      var msgObj = new model.messages({
        names: req.body.names,
        email: req.body.email,
        phone: req.body.phone,
        ticket: ticket,
        message: req.body.message,
        answer: []
      });
      msgObj.save(function(err,info){});
    } else {
      model.messages.findOne({ticket:req.body.ticket},{answer:1}).exec(function(err,data){
        if(err) throw err;
        data.answer.push({
          names : req.body.names,
          answer : req.body.answer
        })
        data.save(function(err,info){})
      })
    }
   
    res.send({status:"success"})
  })

  router.get("/download/profile_pic/:pic_id", function(req,res){        
    if(req.params.pic_id === "nopic") {    
                    
      var nopic = __dirname + "/uploads/2d5383cfc31897aafbe6b4cdfbd30bf1"
      res.download(nopic);
    
    } else {
        var file = __dirname + "/uploads/" + req.params.pic_id;
        res.download(file); // Set disposition and send it.
    }
  });

  router.get('/download/scan-image/:filename',function(req,res){
    var file = __dirname + "/uploads/" + req.params.filename;
    res.download(file); // Set disposition and send it.
  });

  router.get('/download/sick-file/:filename',function(req,res){
    var file = __dirname + "/uploads/" + req.params.filename;
    res.download(file); // Set disposition and send it.
  });

  router.get("/download/skills/:filename",function(req,res){
    var file = __dirname + "/uploads/" + req.params.filename;
    res.download(file); // Set disposition and send it.
  });

  router.get("/user/cam/:controlId",function(req,res){
    if(req.user){ //check to see if the param exist in database
      if(req.user.type === "Doctor"){
        res.render("video-chat",{"person":{controlId: req.params.controlId}});
      } else {
        res.render("video-chat2",{"person":{controlId: req.params.controlId}});
      }
      
    } else {
      res.redirect("/login");
    }
  })




  //to be moved to video server
   router.get('/user/streams.json/:controlId',function(req,res){
     if(req.user) {
      streams.getStreamToControl(req.params.controlId,model,function(streamList){
        var data = (JSON.parse(JSON.stringify(streamList)));    
        res.status(200).json(data);
      });//streams.getStreams();     
     } else {
      res.end("Please login before you can access streams.")
     }
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //handles all change picture 
  router.put("/user/update/profile-pic",function(req,res){   
    if(req.user){
      if(req.files.length > 0 && req.files[0].mimetype === "image/jpg" || req.files[0].mimetype === "image/jpeg" && req.files[0].size < 2097152) {
          model.user.update({user_id: req.user.user_id},{$set : {
          "profile_pic.filename": req.files[0].filename,
          "profile_pic.path":  req.files[0].path,
          "profile_pic.mimetype":  req.files[0].mimetype,
          "profile_pic.encoding":  req.files[0].encoding,
          "profile_pic.size":  req.files[0].size,
          "profile_pic.destination":  req.files[0].destination,
          "profile_pic.fieldname":  req.files[0].fieldname,
          "profile_pic.originalname":  req.files[0].originalname,
          profile_pic_url: "/download/profile_pic/" + req.files[0].filename
          }},function(err,info){        
          if(err) throw err;
          console.log(info) 
          var pic = "/download/profile_pic/"  + req.files[0].filename;
          console.log(pic)      
          res.send({profile_pic_url: pic});               
          });
      } else {
          res.send({error: "Picture does not meet specifications"});
      }
    } else {
      res.end("Unauthorized access!")
    }
  });

  //doctors profile update route
  router.put("/user/update",function(req,res){
    if(req.user){
      if(req.body.type == "procedure"){
        model.user.findOne({user_id: req.user.user_id},{skills:1}).exec(function(err,data){
          if(err) throw err;
          var random = Math.floor(Math.random() * 99999999);
          //add files associated with this skill.
          var description = req.body.skill + ": ( " + req.body.disease + " ); "  + req.body.description;
          var procedure = {
            skill_id :random,
            disease: req.body.disease,
            skill: req.body.skill,
            procedure_description: description,
            files: []
          }

          if(req.files){
            var fileUrl;
            for(var i = 0; i < req.files.length; i++){
              fileUrl = "/download/skills/" + req.files[i].filename; // this will be change to link dropbox;
              var file = {
                type: req.files[i].mimetype,
                filename: req.files[i].filename,
                path: fileUrl,
                file_id: random,
              }
              procedure.files.push(file);
            }
          }

          data.skills.push(procedure);
          console.log(procedure);
          data.save(function(err,info){
            console.log("skill saved!");
            io.sockets.to(req.user.user_id).emit("uploaded skill",{status:"success"});
          });
          res.send({status:"success"});
        })        
      }

      if(req.body.type == "form"){
        console.log(req.body)
        model.user.findOne(
                {
                    user_id: req.user.user_id
                },
                {
                  education:1,
                  sub_specialty:1,
                  awards:1,
                  office_hour:1,
                  lastname:1,
                  firstname:1,
                  address:1,
                  experience:1,
                  work_place:1,
                  country:1,
                  city:1
                }
            )
            .exec(
                function(err, result){
                    if(req.body.introductory)
                        result.introductory = req.body.introductory;
                    if(req.body.firstname)
                        result.firstname = req.body.firstname;
                    if(req.body.lastname)
                        result.lastname = req.body.lastname;
                    if(req.body.address)
                        result.address = req.body.address;
                    if(req.body.city)
                        result.city = req.body.city;
                    if(req.body.country)
                        result.country = req.body.country;
                    if(req.body.experience)
                        result.experience = req.body.experience;
                    if(req.body.work_place)
                        result.work_place= req.body.work_place;                         
                    for(var i in req.body){                      
                      if(req.body.hasOwnProperty(i) && Object.prototype.toString.call( req.body[i] ) === '[object Array]'){                            
                         switch(i){
                           case "education":
                           pushAll(req.body.education);                                                               
                           break;                               
                           case "subSpecialty":
                            pushAll(req.body.subSpecialty);                               
                           break;
                           case "award":
                            pushAll(req.body.award);                               
                           break;
                           case "office":
                            pushAll(req.body.office);                               
                           break;
                           default:                               
                           break;
                         }
                      }
                        
                    }
                    function pushAll(arr){                        
                      for(var i = 0; i < arr.length; i++){
                        if(Object.keys(arr[i]).length > 2){
                          switch(arr[i].type){
                            case "edu":
                            result.education.push(arr[i]);
                            break;                               
                            case "ss":
                            result.sub_specialty.push(arr[i]);
                            break;
                            case "ha":
                            result.awards.push(arr[i]);
                            break;
                            case "of":
                            result.office_hour.push(arr[i]);
                            break;
                            default:
                            break;
                          }
                        }
                      } 
                        
                    }
                    result.save(function(err){
                      if(err) throw err;                       
                     res.send({status:"success",data:req.body})
                    });
                }
            )
      }

      /*console.log(req.files);
      console.log(req.body);      
      res.send("success");*/
      
    } else {
      res.send("Unauthorized access!");
    }

  });

  router.get("/user/change-number",function(req,res){
    if(req.user){

     
      var genPin = pin();

      var testPhone = new model.authCheck({
        user_id: req.user.user_id,
        pin: genPin
      });

      var date = new Date()
      testPhone.expirationDate = new Date(date.getTime() + 300000);
      testPhone.expirationDate.expires  = 60 * 60;

      testPhone.save(function(err,info){});

       //email will be sent;

      //otp will be generated;
      console.log(testPhone);

      res.render("auth-change");

      function pin() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

          for( var i=0; i < 8; i++ )
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;  
      }

    } else {
      res.redirect("/login")
    }
  });

  //checks to verify if the number to be changed belongs to the right user
  router.put("/user/change-auth",function(req,res){
    console.log(req.body);
    if(req.user){
        model.user.findOne({phone: req.body.phone},function(err,user){
          if(err) throw err;
          if(user){
            var msg = "User with this phone number 0" + req.body.phone + " already exist! Process canceled.";
            res.send({
              status: "success",
              message: msg});
          } else {
            phoneNotCompromised();
          }
        });

       function phoneNotCompromised() {
        model.authCheck.findOne({pin:req.body.pin,user_id:req.user.user_id},function(err,record){
            console.log("++++++++++")
            console.log(record)
            if(record) {
              var genPin = Math.floor(Math.random() * 999999);
              console.log("============")
              console.log(err)
              var testPhone = new model.verifyPhone({
                phone: req.body.phone,
                pin: genPin
              });

              console.log(testPhone);
              var date = new Date()
              testPhone.expirationDate = new Date(date.getTime() + 300000);
              testPhone.expirationDate.expires  = 60 * 60;

              testPhone.save(function(err,info){});

              model.authCheck.remove({pin:req.body.pin},function(){})


              var msgBody = "Your SMS verification Pin is " + genPin + "\nUse to complete your registeration."
              var phoneNunber =  req.body.phone;
              sms.message.sendSms('Appclinic',phoneNunber,msgBody,callBack); //"2348096461927" "2349092469137"
            } else {
              res.send({status:"failed",message:"Oops! Seems you entered incorrect verification pin or has been used."})
            }

            function callBack(err,response){              
              console.log(response);
              if(response) {
                res.send({status: "success",message: 'Enter the OTP  sent to 0' + req.body.phone + " below"})
              } 
              if(err) {
                res.send({status:"failed"})
              }
            }   
        });
      }
    } else {
      res.send("Unauthorized access!");
    }
  });


  router.put("/user/new-phone-update",function(req,res){
    if(req.user){
     
      model.verifyPhone.findOne({pin:req.body.pin},function(err,data){
       if(data){
        model.user.update({user_id:req.user.user_id},{$set: {phone: req.body.phone}},function(err,data){          
          res.send({status:"updated",message: "Phone number updated successfully!"})
          model.verifyPhone.remove({pin:req.body.pin},function(){})
        })

       } else {
        res.send({status:"failed",message: "User does not exist!"})
       }
      });
    } else {
      res.send("Unauthorized access")
    }
  })

  router.get("/user/change-email",function(req,res){
    if(req.user){

      //sms will be sent;

      //otp will be generated;


      /*
      var testPhone = new model.verifyPhone({
      phone: req.body.phone,
      pin: genPin
    });

    console.log(testPhone);
    var date = new Date()
    testPhone.expirationDate = new Date(date.getTime() + 300000);
    testPhone.expirationDate.expires  = 60 * 60;

    testPhone.save(function(err,info){});

    var msgBody = "Your SMS verification Pin is " + genPin + "\nUse to complete your registeration."
    var phoneNunber =  req.body.phone;
    sms.message.sendSms('Appclinic',phoneNunber,msgBody,callBack); //"2348096461927" "2349092469137"

    function callBack(err,response){
      if(!err) {
        res.send({message:"Phone verification pin sent to your phone"});
      } else {
        res.send({message:"Error Occur please try again",error: true});
      }
      console.log(response);
    }   
      */
      res.render("auth-change");
      
    } else {
      res.redirect("/login")
    }
  })

  router.delete('/user/doctor/delete-record',function(req,res){
    if(req.user){
        console.log(req.body)
      var delObj = {};
      var field = req.body.field;
      delObj[req.body.field] = 1;

      model.user.findOne({user_id:req.user.user_id},delObj).exec(function(err,data){
        if(err) throw err;        
        var record = data[req.body.field];
        
        var recPos = record.map(function(x){var tostr = x._id.toString(); return tostr}).indexOf(req.body.item_id);
        if(recPos !== -1){
          var removed = record.splice(recPos,1);
        } else {
          console.log("record not found");
        }
       
        data.save(function(err,info){
          res.send({status:"success"})
        });
        
      })
    } else {
      res.send("Unauthorized access!")
    }
  });

  router.get("/user/doctor/schedule",function(req,res){
      if(req.user){
      res.render("profile",{"person":req.user});
      } else {
      res.sendFile(path.join(__dirname + "/404.html"));
      }
  });

  router.get("/assets", function (req,res) {
      res.send('css');
      res.send('js');
      res.send('images');
  });
  // fetch data for patient profile update inner page
  router.get("/user/profile/getDetails",function(req,res){
      if(req.user) {
          res.send({
              profile_pic_url: req.user.profile_pic_url,
              firstname: req.user.firstname,
              lastname: req.user.lastname,
              age: req.user.age,
              gender: req.user.gender,
              address: req.user.address,
              state: req.user.state,
              city: req.user.city,
              marital_status: req.user.marital_status,
          })
      } else {
          res.end("error: Not authorized")
      }
    });
    // put updated data to the database.
    router.put("/user/patient-profile/update", function(req,res){
        if(req.user){
            model.user.update({user_id: req.user.user_id},req.body,function(err,info){
                res.send("updated");
            });
        } else {
            res.end("error: Not authorized")
        }
    })

    //navigates to list views accordingly
    router.get("/topview/:name", function (req,res) {
        switch (req.params.name) {
            case "doctors":
                model.user.find(
                    {type:"Doctor"},{
                        firstname:1,
                        lastname:1,
                        address:1,
                        profile_url:1,
                        profile_pic_url: 1,
                        introductory:1,
                        education:1,
                        sub_specialty:1,
                        specialty:1,
                        procedure:1,
                        work_place:1,
                        phone:1,
                        experience:1,
                        country: 1,
                        city:1,
                        user_id:1
                    },function(err,data){
                    if(err) throw err;
                    console.log(data);
                    if(data) {
                        res.render("list-view",{"userInfo":data});
                    }                                  
                }).limit(20);                
                break;
            case "hospitals":
                model.user.find({type:"Hospital"},{firstname:1,lastname:1,address:1,profile_url:1,profile_pic_url: 1,education:1},function(err,data){
                    if(err) throw err;                                     
                    if(data) {
                        res.render("list-view",{"userInfo":data});
                    }             
                }).limit(10);               
                break;
            case "clinics":
                model.user.find({type:"Clinic"},{firstname:1,lastname:1,address:1,profile_url:1,profile_pic_url: 1},function(err,data){
                    if(err) throw err;                                     
                    if(data) {
                        res.render("list-view",{"userInfo":data});
                    }             
                }).limit(10);               
                break;
            case "pharmacy":
                model.user.find({type:"Pharmacy"},{firstname:1,lastname:1,address:1,profile_url:1,profile_pic_url: 1},function(err,data){
                    if(err) throw err;                                     
                    if(data) {
                        res.render("list-view",{"userInfo":data});
                    }             
                }).limit(10);               
                break;
            case "laboratories":
                model.user.find({type:"Laboratory"},{firstname:1,lastname:1,address:1,profile_url:1,profile_pic_url: 1},function(err,data){
                    if(err) throw err;                                    
                    if(data) {
                        res.render("list-view",{"userInfo":data});
                    }             
                }).limit(10);             
                break;
            case "radiology":
                model.user.find({type:"Radiology"},{firstname:1,lastname:1,address:1,profile_url:1,profile_pic_url: 1},function(err,data){
                    if(err) throw err;                                   
                    if(data) {
                        res.render("list-view",{"userInfo":data});
                    }             
                }).limit(10);             
                break;
            case "fitness":
                model.user.find({type:"Fitness"},{firstname:1,lastname:1,address:1,profile_url:1,profile_pic_url: 1},function(err,data){
                    if(err) throw err;                                
                    if(data) {
                        res.render("list-view",{"userInfo":data});
                    }             
                }).limit(10);             
                break;
            default:
                res.sendFile(path.join(__dirname + "/404.html"));            
        }
    });

    router.get("/users/cities",function(req,res){
         model.user.find(
            {},{
                city:1,
                type:1
            },function(err,data){
            if(err) throw err;
            if(data) {
                var allUsers = {};
                var allCity = {}; 
                allUsers.cities = [];  
                allUsers.total_doctors = 0;
                allUsers.total_hospitals = 0;
                allUsers.total_clinics = 0;
                allUsers.total_pharmarcy = 0;
                allUsers.total_radiology = 0;
                allUsers.total_laboratory = 0;
                allUsers.total_fitness = 0;
                for(var i = 0; i < data.length; i++){
                    if(!allCity.hasOwnProperty(data[i].city)){
                        allCity[data[i].city] = data[i].city;
                        allUsers.cities.push(data[i].city);
                    }                                                     
                    switch(data[i].type){
                        case "Doctor":
                           allUsers.total_doctors++;
                        break;
                        case "Hospital":
                           allUsers.total_hospitals++;
                        break;
                        case "Clinic":
                           allUsers.total_clinics++;
                        break;
                        case "Pharmacy":
                           allUsers.total_pharmacy++;
                        break;
                        case "Laboratory":
                           allUsers.total_radiology++;
                        break;
                        case "Radiology":
                           allUsers.total_laboratory++;
                        break;
                        case "Fitness":
                           allUsers.total_fitness++;
                        break;
                        default:
                        break;
                    }
                }
                
                res.send(allUsers);
            }                                  
            }).limit(1000);                
    });


    //this route should be removed later
    router.get("/ranking/views/:id",function(req,res){

      model.user.findOne({user_id: req.params.id},function(err,user){            
        if(err) throw err;
        res.render("doctor-details",{"userInfo":user});
      });
     
    });

   router.get("/user/ranking/views/:id",function(req,res){
    if(req.user) {
      model.user.findOne({user_id: req.params.id},function(err,user){            
        if(err) throw err;
        res.render("doctor-details",{"userInfo":user});
      });
    } else {
      res.send("Unauthorzed access!")
    }
  });

    
    router.get("/user/patient/find-doctor",function(req,res){
      if(req.user){
        console.log(req.query)
        var criteria;
        var str;
        if(req.query.city && !req.query.specialty){
          str = new RegExp(req.query.city);          
          criteria = { city : { $regex: str, $options: 'i' },type:"Doctor"};
        } else if(req.query.city && req.query.specialty){
          str = new RegExp(req.query.city);
          criteria = { city : { $regex: str, $options: 'i' },specialty: req.query.specialty,type:"Doctor"}
        } else if (req.query.name && !req.query.specialty) {
          var splitEnd = req.query.name.split(" ");
          var finalStr;
          if(splitEnd.length > 2) {            
            var last = splitEnd.length - 1;
            var toCap = splitEnd[last].charAt(0).toUpperCase();
            splitEnd[last] = toCap;
            finalStr = splitEnd.join(" ");
          } else {
            finalStr = req.query.name;
          }
          console.log(finalStr);
          str = new RegExp(finalStr.replace(/\s+/g,"\\s+"), "gi");
          console.log(str);         
          criteria = { name : { $regex: str, $options: 'i' },type:"Doctor"};

        } else if(req.query.skill){
          console.log(req.query)
          var checkStr = req.query.skill.split(":") || req.query.skill.split(";");
          console.log(checkStr)
          if(checkStr.length <= 1) {
            str = new RegExp(req.query.skill.replace(/\s+/g,"\\s+"), "gi"); 
            console.log(str)        
            criteria = { "skills.procedure_description" : { $regex: str, $options: 'i' },type:"Doctor"};
          } else {
            criteria = { "skills.procedure_description" : req.query.skill};
          }

        } else {
          criteria = req.query;
        }
        model.user.find(criteria,{
          name:1,
          _id:0,
          profile_pic_url: 1,
          specialty:1,
          profile_url:1,
          firstname:1,
          lastname:1,
          country: 1,
          city:1,
          user_id:1,
          address:1,
          phone:1,
          work_place:1,
          skills:1,
          title:1
        },function(err,data){
         
          if(err) throw err;
          if(req.query.skill){
            var count = 0;
            var newArr = [];
            while(count < data.length){
              var person = data[count];
              //var elementPos = person.skills.map(function(x){return x.procedure_description}).indexOf(req.query.skill);
              for(var i = 0; i < person.skills.length; i++){
                var getSkill = person.skills[i].procedure_description.indexOf(req.query.skill);
                if(getSkill !== -1){
                   newArr.push({
                    firstname: person.firstname,
                    lastname: person.lastname,
                    skill: person.skills[i],
                    profile_pic_url: person.profile_pic_url,
                    profile_url: person.profile_url,
                    specialty: person.specialty,
                    user_id: person.user_id,
                    city: person.city,
                    address: person.address,
                    work_place: person.work_place,
                    title: person.title,
                    country: person.country
                  })
                }
              }
              
              console.log("+++++++++")
              console.log(req.query.skill)
              console.log(str)
              count++;
            }

            res.send(newArr)
          } else {
            res.send(data);
          }
          
        });
      } else {
        res.send("Unauthorized access!")
      }
    })

    router.get("/user/find-specialist",function(req,res){
        res.render("list-doctors",{"userInfo":req.user})
    });


    router.get("/user/skills-procedures",function(req,res){
      if(req.user){
        model.user.find({type:"Doctor"},{skills:1,_id:0},function(err,data){
          if(err) throw err; 

          Array.prototype.flatten = function flatten() {
            if (Object.prototype.toString.call( this ) === '[object Array]' && this.length !== 0) {
              var index = 0;
              var newArr = [];
              var isFlattened = false;
              while(!isFlattened) {
                if(Object.prototype.toString.call( this[index].skills ) === '[object Array]' && this[index].skills.length > 0){
                  checkToSeeArray(this[index].skills);
                } else {
                  newArr.push(this[index].skills);
                }
                index++;
                if(this.length === index)
                  isFlattened = true;
              }
              function checkToSeeArray (innerArr) {
                for (var i = 0; i < innerArr.length; i++) {
                  if(Object.prototype.toString.call( innerArr[i] ) !== '[object Array]') {
                    newArr.push(innerArr[i]);
                  } else {
                    checkToSeeArray(innerArr[i]);
                  }
                }
              }
            } else {
              console.log("Oops! Error occured, type of input not supported or you the input is empty!")
            }
            return newArr;      
          }
        
          var newArr = data.flatten();
          console.log(newArr)
          
          if(data.length > 0) {
             res.send(newArr)
          } else {
            res.send({status:null});
          }          
        }).limit(1000)
      } else {
        res.send("Unauthorized access");
      }
    });

    router.get("/user/get-profile-data",function(req,res){
      if(req.user) {
        model.user.findOne({user_id: req.query.userId},{
          _id:0,
          phone:1,
          country:1,
          city:1,
          experience:1,
          work_place:1,
          address:1,
          title:1,
          email:1,
          firstname:1,
          title:1,
          lastname:1,
          specialty:1,
          profile_pic_url:1,
          user_id:1,
          verified:1,
          rating:1,
          sub_specialty:1,
          skills:1,
          introductory:1,
          awards:1,
          education:1,
          office_hour:1,
        },function(err,data){
          if(err) throw err;
          res.send(data);
        });
      } else {
        res.send("Unauthorized access!")
      }
    });

    router.put("/user/book",function(req,res){
        if(req.user){
            model.user.findOne(req.body,{
              firstname:1,
              lastname:1,
              profile_url:1,
              profile_pic_url:1,
              specialty:1,
              office_hour:1,
              address:1,
              work_place:1,
              experience:1,
              education:1},function(err,data){
                res.send(data);
            })
        } else {
            res.json({isNotLoggedIn: true, error: "We notice you are NOT logged in!", beNice: "Please Login or Register to make use of these services"})
        }
    });

    //route for qusetions and requsts from patients to a doctor through the modal
    router.put("/user/patient/doctor/connection",function(req,res){
      if(req.user){        
        req.body.sender_firstname = req.user.firstname;
        req.body.sender_lastname = req.user.lastname;
        req.body.sender_profile_pic_url = req.user.profile_pic_url;
        req.body.message = req.body.history;
        req.body.sender_id = req.user.user_id;
        var requestData = {};
        for(var item in req.body){
          if(req.body.hasOwnProperty(item) && item !== "receiverId") {
              requestData[item] = req.body[item];
          }
        }
       
        model.user.findOne({user_id:req.body.receiverId},{doctor_notification:1,presence:1,set_presence:1,phone:1}).exec(function(err,data){
          if(err) throw err;

          data.doctor_notification.push(requestData);

          if(data.presence === true && data.set_presence.general === true && req.body.type === "consultation"){           
            io.sockets.to(req.body.receiverId).emit("receive consultation request",{status: "success"});

          } else if(req.body.type === "consultation" && data.set_presence.general === false || data.presence === false) {
            var msgBody = req.user.title + " " + req.user.firstname + " " + req.user.lastname + " sends consultation request! Visit http://applinic.com/user/doctor";
            var phoneNunber =  data.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){});

          } else if(data.presence === true && data.set_presence.general === true && req.body.type === "question"){
           
            io.sockets.to(req.body.receiverId).emit("receive consultation request",{status: "success",type:"question"});
          }

          data.save(function(err,info){});
          res.send({status:"notified"});
        });
      
      } else {
        res.redirect("/login");
      }
        
    });

    router.put("/user/skill-referral/:docId",function(req,res){
      if(req.user){
        var criteria = (req.body.phone !== undefined) ? {phone: req.body.phone,type:"Patient"} : {user_id: req.user.user_id,type:"Patient"};
        model.user.findOne(criteria,{title:1,firstname:1,user_id:1,lastname:1,profile_pic_url:1,_id:0},function(err,patient){
          if(err) console.log(err);
          if(!patient){
            res.send({status: "Request not sent! Reason: Patient with " + req.body.phone + " do not exist!"});
          } else {
            //do the actual 
            req.body.sender_firstname = patient.firstname;
            req.body.sender_lastname = patient.lastname;
            req.body.sender_profile_pic_url = patient.profile_pic_url;
            req.body.sender_id = patient.user_id;
            req.body.message = req.body.history;
            var requestData = {};
            
         
            model.user.findOne({user_id:req.params.docId},{doctor_notification:1,presence:1,set_presence:1,phone:1,firstname:1,title:1}).exec(function(err,data){
              if(err) throw err;

              data.doctor_notification.push(requestData);

              if(data.presence === true && data.set_presence.general === true && req.body.type === "consultation"){           
                io.sockets.to(req.params.docId).emit("receive consultation request",{status: "success"});

              } else if(req.body.type === "consultation" && data.set_presence.general === false || data.presence === false) {
                var msgBody = req.user.title + " " + req.user.firstname + " " + req.user.lastname + " sends consultation request! Visit http://applinic.com/login";
                var phoneNunber =  data.phone;
                sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){});

              } else if(data.presence === true && data.set_presence.general === true && req.body.type === "question"){
               
                io.sockets.to(req.params.docId).emit("receive consultation request",{status: "success",type:"question"});
              }

              data.save(function(err,info){});
              res.send({status:"Consultation request send successfully! " + data.title + " " + data.firstname + " will be notified."});
            });

          }

        })
      } else {

      }
    });

    //this route gets all the notifications for the doctor that just logged in
    router.get("/user/doctor/notifications",function(req,res){
        if(req.user){
         model.user.findOne({user_id:req.user.user_id},{doctor_notification:1,_id:0},function(err,data){                
            res.send(data);
         })
        } else {
          res.redirect("/login");
        }
    });

    router.get("/user/doctor/get-patient-prescription-request",function(req,res){        
      if(req.user){
       model.user.findOne({user_id:req.user.user_id},{doctor_prescriptionRequest:1,_id:0},function(err,data){                
        res.send(data);
       });
      } else {
        res.send("not allowed");
      }
    });

    router.put("/user/doctor/acceptance",function(req,res){
         if(req.user){ 
                  
             model.user.findOne(
                {
                    user_id: req.body.patientId
                },
                {
                    ewallet:1,
                    patient_mail: 1,
                    service_access: 1,
                    user_id:1,
                    phone:1,
                    presence:1
                }
            )
            .exec(
                function(err, result){                    
                    /*if(result.ewallet.available_amount > 0 && result.ewallet.available_amount >= req.body.consultation_fee) {
                        req.body.service_access = true;
                        result.ewallet.available_amount -= req.body.consultation_fee;
                    }*/
                    req.body.service_access = true;
                    var random = Math.floor(Math.random() * 999999999); // use for check on the front end to distinguish messages sent.
                      result.patient_mail.push({
                      message_id: random,
                      user_id: req.user.user_id,
                      firstname: req.user.firstname,
                      lastname: req.user.lastname,
                      title: req.user.title,
                      message: "Consultation request accepted",
                      date: req.body.date,
                      consultation_fee: req.body.consultation_fee,
                      service_access: req.body.service_access,
                      profile_pic_url: req.user.profile_pic_url,
                      specialty: req.user.specialty
                    });

                    if(result.presence === true){
                      io.sockets.to(result.user_id).emit("message notification",{status:true})
                    } else {
                      var msgBody = req.user.title + " " + req.user.firstname + " " + req.user.lastname + " accepted your consultation request! Visit http://applinic.com/login";
                      var phoneNunber =  result.phone;
                      sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){

                      }); //"2348096461927"
                    }

                    result.save(function(err){
                      if(err) throw err;
                      console.log("updated");                        
                      res.send({status: "success"});
                    });

                }
            )
            
        } else {
           res.send("not allowed");
        }
    });

    router.put("/user/admin/patient-mail",function(req,res){

    });

    router.put("/user/doctor/decline-mail",function(req,res){

    })

    router.put("/user/doctor/redirect-mail",function(req,res){
      
    })
    

    //this router gets all the patient medical records and prescriptions and send it to the front end as soon as the patient logs in. 
    //the data is sent as json and the controller that receives it on the front end is "patientPanelController" .
    router.get("/user/get-medical-record",function(req,res){
      
      if(req.user) {
        model.user.findOne({user_id: req.user.user_id},{medical_records: 1,medications:1},function(err,data){
          if(err) throw err;          
          res.json({medical_records: data.medical_records,prescriptions: data.medications})
          //Note from model, medications holds all prescriptions while medical_records holds all laboratory and radiology tests
          // though there is prescription property on medical_record obj but not used yet.         
        });
      } else {
        res.end("Unauthorized access!!");
      }
    });

    //center notification route    
    router.get("/user/center/get-notification",function(req,res){
      if(req.user){
        model.user.findOne({user_id:req.user.user_id},{diagnostic_center_notification:1,_id:0},function(err,data){
          if(err) throw err;
          res.send(data);
        });
      } else {
        res.redirect("/login");
      }

    });

    //this route gets the individual prescription for a patient 
    router.get("/user/pharmacy/get-referral/:refId",function(req,res){
      if(req.user){
        var toNum = parseInt(req.params.refId)
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          if(err) throw err;          
          var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(toNum);
          var found = data.referral[elemPos]
          res.send(found);
        });
      } else {
        res.send("unauthorized access!")
      }
    })
    //this route gets all referral for a pharmacy.
    router.put("/user/pharmacy/get-referral",function(req,res){
      if(req.user){
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          if(err) throw err;
          if(data) {
            var list = [];
            var filter = {};
            var toStr;
            for(var i = 0; i < req.body.length; i++){
              toStr = req.body[i].ref_id.toString();
              if(!filter.hasOwnProperty(toStr)){
                var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(req.body[i].ref_id);
                var found = data.referral[elemPos];
                list.push(found);
                filter[toStr] = "";
              }
            }

            res.send({prescriptions:list});
          } else {
            res.send({});
          }
        });        
      } else {
        res.end("Unauthorized access!! Please log in")
      }
    });


    //this route takes care of pharmacy billing patients for purchased drugs
    router.post("/user/patient-billing/:patientId",function(req,res){

      var time = + new Date();
      var otp = new model.otpSchema({
        user_id: req.body.user_id,
        time: time,
        otp: req.body.otp,
        amount: req.body.amount
      });
      

      //sets the expiration time for each otp sent.
      var date = new Date();
      otp.expirationDate = new Date(date.getTime() + 120000);
      otp.expirationDate.expires = 300;
      console.log(otp);

      otp.save(function(err,info){
        if(err) throw err;
        console.log("otp saved");
        res.send({success:""});
      });        
      
    });

    //this route gets a notifications for the fn getAllNotification for pharmacy on the client.
    
    //11/4/2016
    router.get("/user/doctor/specific-patient",function(req,res){
      if(req.user){
        var projection = {
            firstname: 1,
            lastname: 1,
            profile_pic_url: 1,       
            address: 1,
            city: 1,
            country: 1,
            age: 1,
            gender: 1,
            body_weight: 1,
            medical_records: 1,
            user_id: 1,
            type: 1,
            presence:1

        }
        model.user.findOne({ user_id: req.query.id},projection,function(err,data){
            if(err) throw err;
            res.send(data);
        });

      } else {
        res.end("Not allowed");
      }
    });

    router.get("/user/doctor/get-patient/medication",function(req,res){
      if(req.user) {        
        model.user.findOne({user_id: req.query.id},{medications:1},function(err,prescriptions){
          if(err) throw err;
          prescriptions.user = req.user.user_id;
          res.json({medications:prescriptions.medications,user: req.user.user_id});
        });
      } else {
        res.end("Unauthorized access!!!")
      }
    });

    router.put("/user/doctor/get-patient/medical-record",function(req,res){
      if(req.user){
        model.user.findOne({user_id: req.body.id},{medical_records:1},function(err,records){
          res.send(records);
        });
      } else {
        res.end("Unauthorized access!! Please Log in ");
      }
    });

    
    
   

  // this route runs when the patients wants to view his prescription track record. ie patient wants to see 
    //where all his prescriptions has been send sent to.
    router.get("/user/patient/get-prescription/track-record",function(req,res){
      if(req.user){
        model.user.findOne({user_id:req.user.user_id},{prescription_tracking:1,_id:0},function(err,data){
          console.log(data.prescription_tracking);
          res.send(data.prescription_tracking);
        })
      } else {
        res.end("Unauthorized access");
      }
    });

    router.put("/user/patient/specific-doctor",function(req,res){
        //finds specific doctor and sends to the client.
        if(req.user){
          var projection = {
              firstname: 1,
              lastname: 1,
              profile_pic_url: 1,
              office_hour: 1,
              profile_url: 1,
              specialty: 1,
              date: 1,
              address: 1,
              work_place: 1,
              user_id:1,
              _id:0,
              presence:1
          }
          model.user.findOne({ user_id: req.body.id},projection,function(err,data){
              if(err) throw err;
              res.send(data);
          })
        }
    });

    //patient searching for a pharmacy to forward his prescription route handlers.
    router.get("/user/patient/getAllPharmacy",function(req,res){
        //gets all pharmacy in the database based on patient's location.
        if(req.user){
          var projection = {
              name: 1,
              address: 1,
              city: 1,
              country: 1,
              rating: 1,
              profile_pic_url: 1,
              user_id: 1,
              type:1,
              phone:1,
          }
          model.user.find({type:"Pharmacy",city:'Enugu'},projection,function(err,data){ //remenber to replace "Enugu" with req.user.city
              if(err) throw err;
              res.send(data);
          });
        } else {
          res.end("Unauthorized access!")
        }
    });

    router.put("/user/patient/pharmacy/refined-search",function(req,res){
        //coming from thesame controller as above. finds the pharmacy based on the patient search criteria in the req.body.
        console.log(req.body)
        var projection = {
            name: 1,
            address: 1,
            city: 1,
            country: 1,
            rating: 1,
            profile_pic_url: 1,
            user_id: 1,
            type: 1
        }
        model.user.find(req.body,projection,function(err,data){
            if(err) throw err;
            res.send(data);
        })
    });

    router.put("/user/patient/pharmacy/referral-by-patient",function(req,res){
      //this route handle patients sending his prescription to a pharmacy by himself.Therefore the prescription obj already exist. justs to
      //add the prescription object to the chosen pharmacy.
      if(req.user){
        
        model.user.findOne(
          {
            user_id: req.body.user_id
          },
          {
            referral: 1,
            diagnostic_center_notification:1,
            city:1,
            name:1,
            country:1,
            presence:1,
            address:1,
            phone:1

          }).exec(function(err,pharmacy){
            var date = new Date();
            var ref_id;
            if(req.body.ref_id) {
              ref_id = req.body.ref_id;
            } else {
              ref_id = Math.floor(Math.random() * 9999999);
            }
            var title = (req.user.type === "Doctor") ? 'Dr.': "";            
            var refObj = {
              ref_id: ref_id,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: title,
              referral_id: req.body.id,    
              date: date,
              pharmacy: req.body
            }
            var pharmacyNotification = {
              sender_firstname: req.user.firstname,
              sender_lastname: req.user.lastname,
              sender_title : title,
              sent_date: date,
              ref_id: ref_id,
              note_id: ref_id,
              sender_profile_pic_url: req.user.profile_pic_url,
              message: 'Hi, I need your services'
            }

            var track_record = {
                date: date,
                center_name: pharmacy.name,
                address: pharmacy.address,
                ref_id: ref_id,
                city: pharmacy.city,
                phone: pharmacy.phone,
                country: pharmacy.country,
                prescriptionId: req.body.prescriptionId
            };

            model.user.findOne({user_id: req.user.user_id},{prescription_tracking:1}).exec(function(err,patient){
              patient.prescription_tracking.unshift(track_record);
              patient.save(function(err,info){
                if(err) throw err;
              });
            });

            pharmacy.referral.push(refObj);
            pharmacy.diagnostic_center_notification.push(pharmacyNotification);

            if(pharmacy.presence === true){
              io.sockets.to(req.body.user_id).emit("center notification",pharmacyNotification);
            }

            pharmacy.save(function(err,info){
              if(err) throw err;              
            });

           res.send({success:true,ref_id: ref_id}); 
          });

      } else {
        res.end("Unauthorized access. You need to log in")
      }

    });

    router.put("/user/patient/pharmacy/referral-by-pharmacy",function(req,res){
      //this route takes runs when a pharmacy wish to forward unavailable drugs in the center to another pharmacy.
      if(req.user){
        model.user.findOne(
          {
            user_id: req.body.user_id
          },
          {
            referral: 1,
            diagnostic_center_notification:1,
            name:1,
            city:1,
            address:1,
            country: 1,
            phone:1

          }).exec(function(err,pharmacy){
            var date = new Date();
            var note_id = Math.floor(Math.random() * 9999999);
            var title = (req.user.type === "Doctor") ? 'Dr.': req.user.name;            
            var refObj = {
              ref_id: req.body.ref_id,              
              referral_title: title,
              referral_id: req.user.user_id,    
              date: date,
              pharmacy: req.body.pharmacy 
            }
            var pharmacyNotification = {              
              sender_firstname : title,
              sent_date: date,
              ref_id: req.body.ref_id,
              note_id: note_id,
              sender_profile_pic_url: req.user.profile_pic_url,
              message: 'Hi, please we dont have the following drugs,maybe you can help.'
            }

            var track_record = {
                date: date,
                center_name: pharmacy.name,
                address: pharmacy.address,
                city: pharmacy.city,
                country: pharmacy.country,
                phone: pharmacy.phone,
                ref_id: req.body.ref_id,
                prescriptionId: req.body.pharmacy.prescriptionId
            };

            model.user.findOne({user_id:req.body.pharmacy.patient_id},{prescription_tracking:1}).exec(function(err,patient){
              if(err) throw err;
              patient.prescription_tracking.unshift(track_record);
              patient.save(function(err,info){
                if(err) throw err;
              })
            })

            pharmacy.referral.push(refObj);
            pharmacy.diagnostic_center_notification.push(pharmacyNotification);
            pharmacy.save(function(err,info){
              if(err) throw err;
              console.log(info);
            });

           res.send({success:true,ref_id: req.body.ref_id}); 
          });

      } else {
        res.end("Unauthorized access. You need to log in")
      }
    });

    router.put("/user/patient/pharmacy/referral",function(req,res){
      //if prescription is forwarded by a doctor to a pharmacy it talks different form. ie doctor can send prescription
      //straight to a pharmacy. later the patient will be notified. 
      //this block represents doctor action by forwarding prescription to a pharmacy.
      //any data sent to a diagnostic center other than to the patient himself is seens a a referral by this application.
       
      if(req.user){        
         model.user.findOne(
          {
            user_id: req.body.user_id
          },
          {
            referral: 1,
            name:1,
            address:1,
            diagnostic_center_notification:1,
            city:1,
            country:1,
            presence:1

          }).exec(function(err,pharmacy){           
            if(err) throw err;            
            var date = + new Date();
            var ref_id;
            if(req.body.ref_id) {
              ref_id = req.body.ref_id;
            } else {
              ref_id = Math.floor(Math.random() * 99999999);
            }
            

            var preObj = {              
              provisional_diagnosis: req.body.provisional_diagnosis,
              date: date,
              prescriptionId: req.body.prescriptionId,
              title: req.user.title,
              doctor_specialty: req.user.specialty,
              doctor_profile_url: req.user.profile_url,
              doctor_firstname: req.user.firstname,
              doctor_lastname: req.user.lastname,
              doctor_address: req.user.address,
              doctor_verified: req.user.verified,   
              doctor_id: req.user.user_id,
              doctor_work_place: req.user.work_place,
              doctor_city: req.user.city,
              doctor_country: req.user.country,
              lab_analysis: req.body.lab_analysis,
              scan_analysis: req.body.scan_analysis,
              Doctor_profile_pic_url: req.user.profile_pic_url,
              patient_id : req.body.patient_id,
              patient_profile_pic_url: req.body.patient_profile_pic_url,
              patient_firstname: req.body.firstname,
              patient_lastname: req.body.lastname,
              patient_address: req.body.address,
              patient_gender: req.body.gender,
              patient_age: req.body.age,
              patient_city: req.body.city,
              patient_country: req.body.country,
              prescription_body: req.body.prescriptionBody,
              ref_id: ref_id,
              eligible: true
            }

            var title = (req.user.type === "Doctor") ? 'Dr.': ""; 
            var verifyId;
            

            var refObj = {
              ref_id: ref_id,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: title,
              referral_id: req.body.id,    
              date: date,
              pharmacy: preObj
            }

            var pharmacyNotification = {
              sender_firstname: req.user.firstname,
              sender_lastname: req.user.lastname,
              sender_title : title,
              sent_date: date,
              ref_id: ref_id,
              note_id: ref_id,
              sender_profile_pic_url: req.user.profile_pic_url,
              message: 'Please kindly administer the following prescriptions to my patient.'
            }

            pharmacy.referral.push(refObj);
            pharmacy.diagnostic_center_notification.push(pharmacyNotification);

            if(pharmacy.presence === true){
              io.sockets.to(req.body.user_id).emit("center notification",pharmacyNotification);
            }

            model.user.findOne(
              {user_id: req.body.patient_id},{patient_notification:1,firstname:1,lastname:1,prescription_tracking:1,medications:1}
              ).exec(function(err,data){
              if(err) throw err;             
              
              data.patient_notification.unshift({
                type:"pharmacy",
                date: date,
                note_id: req.body.prescriptionId,
                ref_id: ref_id,
                session_id:req.body.session_id,
                message: "You have new unread prescription"
              })

            
              var track_record = {
                date: date,
                center_name: pharmacy.name,
                address: pharmacy.address,
                ref_id: ref_id,
                city: pharmacy.city,
                country: pharmacy.country,
                prescriptionId: req.body.prescriptionId
              };

              data.medications.push(preObj);
              data.prescription_tracking.unshift(track_record);

              data.save(function(err,info){
                if(err) throw err;
                console.log("patient notified");            
              });
            });

            pharmacy.save(function(err,info){             
              if(err) throw err;             
              console.log("prescription saved");                           
            });

            res.json({success:true,ref_id: ref_id,name:pharmacy.name,address:pharmacy.address,city:pharmacy.city,country:pharmacy.country}); 
        });        
     
      } else {
        res.end("Unauthorized Access");
      }   
    });
  
    //user getting the available on the dashboard balance route.
    router.get('/user/:userId/get-balance',function(req,res){
      if(req.user){
        model.user.findOne({user_id: req.params.userId},{ewallet:1},function(err,wallet){
          if(err) throw err;
          res.send({balance: wallet.ewallet.available_amount})
        })
      } else {
        res.send("Unauthorized access!!!")
      }
    });

    router.delete("/user/doctor/delete-prescriptionReq-test",function(req,res){
      if(req.user){
        model.user.findOne({user_id: req.user.user_id},{doctor_prescriptionRequest:1}).exec(function(err,data){
          if(err) throw err;
          var elementPos = data.doctor_prescriptionRequest.map(function(x){return x.ref_id}).indexOf(req.body.ref_id)
          var objFound = data.doctor_prescriptionRequest.splice(elementPos,1);          
          
          data.save(function(err,info){
            if(err) throw err;            
          })
          res.send("deleted");
        });

      } else {
        res.end("Unauthorized access!")
      }
      
    });    

    //prescription foewarded by the doctor to a patient inbox
    router.put("/user/patient/forwarded-prescription",function(req,res){   
      if(req.user){  
        model.user.findOne(
          {
            user_id: req.body.id
          },           
          {
            medications: 1,          
          }).exec(function(err,result){            
            if(err) throw err;            
            var date = + new Date(); 
            var preObj = {              
              provisional_diagnosis: req.body.provisional_diagnosis,
              date: date,
              prescriptionId: req.body.prescriptionId,
              title: req.user.title,
              doctor_specialty: req.user.specialty,
              doctor_firstname: req.user.firstname,
              doctor_lastname: req.user.lastname,
              doctor_profile_url: req.user.profile_url,
              doctor_address: req.user.address,   
              doctor_id: req.user.user_id,
              doctor_work_place: req.user.work_place,
              doctor_city: req.user.city,
              doctor_country: req.user.country,
              lab_analysis: req.body.lab_analysis,
              scan_analysis: req.body.scan_analysis,
              Doctor_profile_pic_url: req.user.profile_pic_url,
              patient_id: req.body.patient_id,
              patient_profile_pic_url: req.body.patient_profile_pic_url,
              patient_firstname: req.body.firstname,
              patient_lastname: req.body.lastname,
              patient_address: req.body.address,
              patient_gender: req.body.gender,
              patient_age: req.body.age,
              patient_city: req.body.city,
              patient_country: req.body.country,
              prescription_body: req.body.prescriptionBody,
            }           
            result.medications.unshift(preObj);
            result.save(function(err,info){             
              if(err) throw err;                       
            });
        });

        model.user.findOne({user_id: req.body.id},{patient_notification:1,firstname:1,lastname:1,presence:1,user_id:1,phone:1}).exec(function(err,data){
          if(err) throw err;
           

          var date = + new Date();

             
          data.patient_notification.unshift({
            type:"pharmacy",
            date: date,
            note_id: req.body.prescriptionId,
            ref_id: req.body.ref_id,
            session_id:req.body.session_id,
            message: "You have new unread prescription"
          });

          if(data.presence === true){
              io.sockets.to(data.user_id).emit("notification",{status:true})
          } else {
            var msgBody = "You have new unread prescription! Visit http://applinic.com/login"
            var phoneNunber =  data.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
              
            }); //"2348096461927"
          }


          data.save(function(err,info){
            if(err) throw err;            
            res.send(
              {
                message: "success! prescription forwarded to " + data.firstname + " " + data.lastname,
                firstname: data.firstname,
                lastname: data.lastname,
                ref_id: req.body.ref_id
              }
            );                 
          });
        });
                     
      }
    });

    
    //this route the patient forward his test result to his doctor for prescription.
    router.put("/user/patient/test-result/forward",function(req,res){
      if(req.user) {
        model.user.findOne({user_id: req.body.doctorId},{doctor_prescriptionRequest:1,presence:1,set_presence:1,phone:1}).exec(function(err,data){
          if(err) throw err;
          req.body.sender_firstname = req.user.firstname;
          req.body.sender_lastname = req.user.lastname;
          req.body.sender_profile_pic_url = req.user.profile_pic_url;
          req.body.sender_id = req.user.user_id;
          req.body.status = "new";
          data.doctor_prescriptionRequest.push(req.body);
          if(data.presence === true && data.set_presence.general === true){
            io.sockets.to(req.body.doctorId).emit("receive prescription request",{status: "success"})
          } else if(data.set_presence.general === false) {

          } else {
            var msgBody = "You have new  prescription request from " + req.user.firstname + " " + req.user.lastname + " Visit http://applinic.com/login"
            var phoneNunber =  data.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
              
            }); //"2348096461927"
          }

          data.save(function(err,info){
            if(err) throw err;
          });

          res.json({status: "success",doctor_id:req.body.doctorId})
        });
      } else {
        res.end("Unauthorized access!!!");
      }
    });

    //this route gets the lists of all prescription request from the doctor's patients
    router.get("/user/doctor/get-patient-request",function(req,res){
      if(req.user){
        model.user.findOne({user_id: req.user.user_id},{doctor_prescriptionRequest:1,_id:0},function(err,data){
          res.send(data.doctor_prescriptionRequest);
        });
      } else {
        res.end("Unauthorized access!!!")
      }
    });

    //this route deletes already attended prescription request from doctor_prescriptionRequest list and save to the database.
    router.delete("/user/doctor/delete-request",function(req,res){

    });
    
    //this router takes call of pahrmacy search for a patient prescription from the data base;
    router.put("/user/pharmacy/find-patient/prescription",function(req,res){
       if(req.user){     
        model.user.findOne({user_id:req.user.user_id},{referral:1},function(err,data){
            if (err) throw err;           
              switch(req.body.criteria) {
                case "refIdCriteria":
                  var toNum = parseInt(req.body.ref_id);                
   
                 var elementPos = data.referral.map(function(x) {return x.ref_id; }).indexOf(toNum);
                  var objectFound = data.referral[elementPos];
                  console.log(objectFound)
                  if(objectFound === undefined) {
                   res.send({error: "Patient prescription not found"})
                  } else {
                    res.send({data: objectFound});
                  }
                  break;

                case "phoneCriteria":
                  var elementPos = data.referral.map(function(x) {return x.phone; }).indexOf(req.body.phone);
                  var objectFound = data.referral[elementPos];
                  if(objectFound === undefined) {
                   res.send({error: "Patient prescription not found"})
                  } else {
                    res.send({data: objectFound});
                  }
                  break;

                default:
                  res.send({error: "Please enter search creteria"});
                  break
              }            
        });
      } else {
        res.end("Unauthorized access");
      }
    });

    router.put("/user/laboratory/find-patient/lab-test",function(req,res){
      if(req.user){     
        model.user.findOne({user_id:req.user.user_id},{referral:1},function(err,data){
            if (err) throw err;           
              switch(req.body.criteria) {
                case "refIdCriteria":
                  var toNum = parseInt(req.body.ref_id);                
                  var elementPos = data.referral.map(function(x) {return x.ref_id; }).indexOf(toNum);
                  var objectFound = data.referral[elementPos];
                  console.log(objectFound)
                  if(objectFound === undefined) {
                   res.send({error: "Patient lab test not found"})
                  } else {
                    res.send({data: objectFound});
                  }
                  break;

                case "phoneCriteria":
                  var elementPos = data.referral.map(function(x) {return x.phone; }).indexOf(req.body.phone);
                  var objectFound = data.referral[elementPos];
                  if(objectFound === undefined) {
                   res.send({error: "Patient lab test not found"})
                  } else {
                    res.send({data: objectFound});
                  }
                  break;

                default:
                  res.send({error: "Please enter search creteria"});
                  break;
              } 
        });
      } else {
        res.end("Unauthorized access");
      }
    });


    /*
     //this route gets the individual prescription for a patient 
    router.get("/user/pharmacy/get-referral/:refId",function(req,res){
      if(req.user){
        var toNum = parseInt(req.params.refId)
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          if(err) throw err;          
          var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(toNum);
          var found = data.referral[elemPos]
          res.send(found);
          console.log(found)
        });
      } else {
        res.redirect("/login")
      }
    })
    //this route gets all referral for a pharmacy.
    router.put("/user/pharmacy/get-referral",function(req,res){
      if(req.user){
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          if(err) throw err;
          if(data) {
            var list = [];
            var filter = {};
            var toStr;
            for(var i = 0; i < req.body.length; i++){
              toStr = req.body[i].ref_id.toString();
              if(!filter.hasOwnProperty(toStr)){
                var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(req.body[i].ref_id);
                var found = data.referral[elemPos];
                list.push(found);
                filter[toStr] = "";
              }
            }

            res.send({prescriptions:list});
          } else {
            res.send({});
          }
        });        
      } else {
        res.end("Unauthorized access!! Please log in")
      }
    });

    */

    router.get("/user/laboratory/get-referral/:refId",function(req,res){
      if(req.user){
        var toNum = parseInt(req.params.refId)
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          if(err) throw err;          
          var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(toNum);
          var found = data.referral[elemPos]
          res.send(found);
          console.log(found)
        });
      } else {
        res.redirect("/login")
      }
      /*if(req.user){
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          res.send(data.referral);
        })
      } else {
        res.end("Unauthorized access")
      }*/

    })


    //this route gets all referral for a laboratory.
    router.put("/user/laboratory/get-referral",function(req,res){
      if(req.user){
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          if(err) throw err;
          if(data) {
            var list = [];
            var filter = {};
            var toStr;
            for(var i = 0; i < req.body.length; i++){
              toStr = req.body[i].ref_id.toString();
              if(!filter.hasOwnProperty(toStr)){
                var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(req.body[i].ref_id);
                var found = data.referral[elemPos];
                list.push(found);
                filter[toStr] = "";
              }
            }
            res.send({labTest:list});
          } else {
            res.send({});
          }
        });        
      } else {
        res.redirect("/login")
      }
    });


    router.get("/user/radiology/get-referral/:refId", function(req,res){
      if(req.user){
        var toNum = parseInt(req.params.refId)
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          if(err) throw err;          
          var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(toNum);
          var found = data.referral[elemPos]
          res.send(found);
          console.log(found)
        });
      } else {
        res.redirect("/login")
      }
      /*if(req.user){
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          res.send(data.referral);
        })
      } else {
        res.end("Unauthorized access")
      }*/
    });

    //this route gets all referral for a laboratory.
    router.put("/user/radiology/get-referral",function(req,res){
      if(req.user){
        model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          if(err) throw err;
          if(data) {
            var list = [];
            var filter = {};
            var toStr;
            for(var i = 0; i < req.body.length; i++){
              toStr = req.body[i].ref_id.toString();
              if(!filter.hasOwnProperty(toStr)){
                var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(req.body[i].ref_id);
                var found = data.referral[elemPos];
                list.push(found);
                filter[toStr] = "";
              }
            }
            res.send({radioTest:list});
          } else {
            res.send({});
          }
        });        
      } else {
        res.redirect("/login");
      }
    });

    router.put("/user/radiology/upload-scan",function(req,res){
      if(req.user){        
        console.log(req.files);
        console.log(req.body);
        var fileUrl = [];
        for(var i = 0; i < req.files.length; i++) {
          var url = "/download/scan-image/" + req.files[i].filename;
          fileUrl.push(url)
        }
        res.send(fileUrl)
      } else {
        res.end('Unauthorized access!!!');
      }
    })
    
    //route for funding wallet
    router.patch("/user/fundwallet",function(req,res){
      model.user.updateOne({ email: req.user.email},function(err,result){
        if(err) throw err;
        console.log("wallet funded");
        console.log(result);
        res.end();
      });
    });

    
    router.get("/user/doctor/call",function(req,res){
      if(req.user){
        res.render("video-chat",{"person":req.user});
      } else {
        res.end("Unauthorized access!")
      }

    });

    router.get("/user/doctor/audio/call",function(req,res){
      if(req.user){
        res.render("audio-chat",{"person":req.user})
      } else {
        res.end("Unauthorized access!")
      }

    });


    router.get("/user/patient/call",function(req,res){
      if(req.user){
        res.render("video-chat2",{"person":req.user})
      } else {
        res.end("Unauthorized access!")
      }

    });

    router.get("/user/patient/audio/call",function(req,res){
      if(req.user){
        res.render("audio-chat2",{"person":req.user})
      } else {
        res.end("Unauthorized access!")
      }

    });


   

    //doctor creates session with a patient
    router.post("/user/doctor/patient-session",function(req,res){
      if(req.user){        
        var session_id = Math.floor(Math.random() * 99999999999999922888);
        
        var connectObj = {
          presenting_complain: req.body.complain,
          history_of_presenting_complain: req.body.historyOfComplain,
          past_medical_history: req.body.pastMedicalHistory,
          social_history: req.body.socialHistory,
          family_history: req.body.familyHistory,
          drug_history: req.body.drugHistory,
          summary: req.body.summary,
          provisional_diagnosis: req.body.provisionalDiagnosis,
        }

        var getPatientInfo = {}

         

        /****************Note text messages or email will be sent to notify patients of the appointment ***********/

        // if there is appointment save appointment to the data base
        if(req.body.appointment){
          var getNames = {
            firstname : req.body.appointment.firstname,
            lastname: req.body.appointment.lastname,
            patient_id: req.body.patient_id
          }

          

          var createAddress = req.user.address + "," + req.user.city + "," + req.user.country; 
          req.body.appointment.firstname = req.user.firstname;
          req.body.appointment.lastname = req.user.lastname;
          req.body.appointment.address = req.body.appointment.address || createAddress;
          req.body.appointment.title = "Dr";
          req.body.appointment.profilePic = req.user.profile_pic_url;   
          model.user.findOne({user_id:req.body.patient_id},{appointment:1,profile_pic_url:1,firstname:1,lastname:1,name:1}).exec(function(err,result){            
            if(err) throw err;
            result.appointment.unshift(req.body.appointment);
            getPatientInfo.firstname = result.firstname;
            getPatientInfo.lastname = result.lastname;
            getPatientInfo.profilePic = result.profile_pic_url;
            getPatientInfo.patient_username = result.name;
            result.save(function(err,info){
              if(err) throw err;
              if(info)
                tellDoctor(getNames);
            });
          });
        }

        var tellDoctor = function(names){ 
         
          req.body.appointment.session_id = session_id;                          
          req.body.appointment.last_meeting = req.body.date;
          req.body.appointment.firstname = names.firstname;
          req.body.appointment.lastname = names.lastname;         
          req.body.appointment.typeOfSession = req.body.typeOfSession,
          req.body.appointment.profilePic = req.body.appointment.profilePic;        
          model.user.findOne({user_id: req.user.user_id},{appointment:1}).exec(function(err,result){
            result.appointment.unshift(req.body.appointment);
            result.save(function(err,info){
              if(err) throw err;                       
            });
          });
        }


        model.user.findOne({user_id:req.body.patient_id},{profile_pic_url:1,firstname:1,lastname:1,name:1},function(err,result){            
          if(err) throw err; 
          console.log(result)           
          getPatientInfo.firstname = result.firstname;
          getPatientInfo.lastname = result.lastname;
          getPatientInfo.profilePic = result.profile_pic_url;
          getPatientInfo.patient_username = result.name;

          //create session
          newSession();
         
        });

        function newSession(){
          //save the newly created session to he database.
          var queryObj;
          if(req.body.complaint){
            queryObj = {user_id:req.body.user_id}
          } else {
            queryObj = {user_id:req.user.user_id};
          }
          model.user.findOne(queryObj,{doctor_patient_session:1}).exec(function(err,result){
            if(err) throw err;   
           
               
            req.body.session_id = session_id; 
            result.doctor_patient_session.unshift(req.body);
            result.doctor_patient_session[0].diagnosis = connectObj;
           result.doctor_patient_session[0].patient_firstname = getPatientInfo.firstname;
           result.doctor_patient_session[0].patient_lastname = getPatientInfo.lastname;
           result.doctor_patient_session[0].patient_username = getPatientInfo.username;
           result.doctor_patient_session[0].profilePic = getPatientInfo.profilePic;

            result.save(function(err,info){
              if(err) throw err;
              if(req.body.typeOfSession === "In-person meeting") {
                res.json({success: "success",
                  session_id:session_id,
                  patient_firstname:getPatientInfo.firstname,
                  patient_lastname:getPatientInfo.lastname,
                  profilePic: getPatientInfo.profilePic
                });
              } else {
                res.send("success");
              }            
            });
          });
        }
      } else {
        res.end("Unauthorized access!");
      }
    });


    
    router.put("/user/doctor/appointment/view",function(req,res){
      if(req.user){
        model.user.findOne({"appointment.session_id": req.body.id},{appointment:1,_id:0},function(err,data){     
          if(err) throw err;
          var elementPos = data.appointment.map(function(x) {return x.session_id; }).indexOf(req.body.id);
          var objectFound = data.appointment[elementPos];          
          res.send(objectFound);         
        });
      } else {
        res.end("Unauthorized access")
      }
    });

    router.get("/user/patient/appointment/view",function(req,res){
      if(req.user){
        model.user.findOne({user_id: req.user.user_id},{appointment:1,_id:0},function(err,data){     
          if(err) throw err;
          console.log(data.appointment);
          res.send(data.appointment);
        });
      } else {
        res.end("Unauthorized access");
      }
    });

    router.post("/user/doctor/get-session",function(req,res){
      if(req.user){
        model.user.findOne({"doctor_patient_session.session_id": req.body.sessionId},{doctor_patient_session:1},function(err,data){
          if(err) throw err;
          var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(req.body.sessionId);
          var objectFound = data.doctor_patient_session[elementPos];
          console.log(objectFound)      
          var sessionData = {
            typeOfSession: objectFound.typeOfSession,
            session_id: objectFound.session_id,
            patient_id: objectFound.patient_id,
            diagnosis: objectFound.diagnosis,
            date: objectFound.date,
            last_modified: objectFound.last_modified,
            patient_firstname: objectFound.patient_firstname,
            patient_lastname: objectFound.patient_lastname,
            profilePic: objectFound.profilePic
          }          
          res.send(sessionData);         
        });
      } else {
        res.end("Unauthorized access");
      }
    });

    router.get("/user/doctor/get-patient-sessions",function(req,res){ 
      if(req.user){
         model.user.findOne({user_id: req.user.user_id},{doctor_patient_session:1},function(err,data){       
          var list = data.doctor_patient_session;
          var allSession = [];        
          for(var i = 0; i < list.length; i++){
            if(list[i].patient_id === req.query.patient_id){
               allSession.push(list[i]);
            }
          }
          if(allSession.length > 0){
            res.send(allSession);  
          } else {
            res.send([{}]); 
          }
        });
      } else {
        res.end("Unauthorized access!!!")
      }
    });

    router.get("/user/treatment",function(req,res){
      if(req.user){
        model.user.findOne({user_id:req.user.user_id},function(err,user){
          if(err) throw err;
          res.render("treatment",{"person":user});
        });     
      } else {
        res.end("Unauthorized access!");
      }
    });

    //doctor updates changes doctor made when consulting the patient. based on the patient presenting complain and others
    router.put("/user/doctor/session-update/save-changes",function(req,res){
      if(req.user){
       console.log(req.body)
        //save changes in the treatment session to the database
        model.user.findOne({"doctor_patient_session.session_id": req.body.session_id},{doctor_patient_session:1}).exec(function(err,data){
          if(err) throw err;
          
          var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(req.body.session_id);
          var objectFound = data.doctor_patient_session[elementPos];

          if(req.body.general_examination)
            objectFound.diagnosis.general_examination += req.body.general_examination;

          if(req.body.systemic_examination)
            objectFound.diagnosis.systemic_examination += req.body.systemic_examination;

          if(req.body.final_diagnosis)
            objectFound.diagnosis.final_diagnosis += req.body.final_diagnosis; 

          objectFound.diagnosis.presenting_complain += req.body.presenting_complain;
          objectFound.diagnosis.history_of_presenting_complain += req.body.history_of_presenting_complain;
          objectFound.diagnosis.past_medical_history += req.body.past_medical_history;
          objectFound.diagnosis.social_history += req.body.social_history;
          objectFound.diagnosis.family_history += req.body.family_history;
          objectFound.diagnosis.drug_history += req.body.drug_history;
          objectFound.diagnosis.summary += req.body.summary;
          objectFound.diagnosis.provisional_diagnosis += req.body.provisional_diagnosis;

          var date = + new Date();
          objectFound.last_modified = date;

          


          data.save(function(err,info){
            if(err) {
              res.send({error:"failed"})
            } else {
              if(!req.body.appointment){
                res.send({success:"success"})
              } else {
                saveAppointment();
              }
            }
          });
        });
        
        

        //check to see if there is an appointment. doc and patient appointment list will be populated

        /****************Note text messages or email will be sent to notify patients of the appointment ***********/
        
        // if there is an accompanied appointment object, save and notify both the patient and doctor
        function saveAppointment() {
          var getNames = {
            firstname : req.body.appointment.firstname,
            lastname: req.body.appointment.lastname,
            patient_id: req.body.patient_id
          }

          req.body.appointment.session_id = req.body.session_id;
          req.body.appointment.firstname = req.user.firstname;
          req.body.appointment.lastname = req.user.lastname;
          req.body.appointment.address = req.body.appointment.address || req.user.address;
          req.body.appointment.title = "Dr";
          req.body.appointment.profilePic = req.user.profile_pic_url;   
          model.user.findOne({user_id:req.body.patient_id},{appointment:1}).exec(function(err,result){            
            if(err) throw err;
            var elementPos = result.appointment.map(function(x){return x.session_id}).indexOf(req.body.session_id)
            var foundObj = result.appointment.splice(elementPos,1);
            result.appointment.unshift(req.body.appointment);
            result.save(function(err,info){
              if(err) throw err;
              if(info)
                tellDoctor(getNames);
            });
          });   

          var tellDoctor = function(names){
                 
            req.body.appointment.last_meeting = req.body.date;
            req.body.appointment.firstname = names.firstname;
            req.body.appointment.lastname = names.lastname;         
            req.body.appointment.typeOfSession = sessionType.name,
            req.body.appointment.profilePic = req.body.appointment.profilePic;        
            model.user.findOne({user_id: req.user.user_id},{appointment:1}).exec(function(err,result){
              if(err) throw err;
              var elementPos = result.appointment.map(function(x){return x.session_id}).indexOf(req.body.session_id)
              var foundObj = result.appointment.splice(elementPos,1);
              result.appointment.unshift(req.body.appointment);
              result.save(function(err,info){
                if(err) throw err;
                if(req.body.typeOfSession === "In-person meeting") {
                  res.json({success: "success",session_id:req.body.session_id})
                } else {
                  res.send("success");
                }                                   
              });
            });
          }
        }

      } else {
        res.end("Unauthorized access!!!")
      }
    })

    //doctor finds the patient's lab tests if
    router.put("/user/doctor/get-test-result",function(req,res){
        if(req.user){         
          model.user.findOne({user_id: req.user.user_id},{doctor_patient_session:1}).exec(function(err,data){
            if(err) throw err;
            var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(req.body.id);
            var objectFound = data.doctor_patient_session[elementPos];
            var sentObjArr = [];
            var count = 0;
            
            
            while(objectFound.diagnosis.laboratory_test_results.length > count) {             
              var ranTest = [];
              var testAndReport = [];
              var objectArr = objectFound.diagnosis.laboratory_test_results.map(function(x) {return x });              
              var objFound = objectArr[count];
             
              for(var i = 0; i < objFound.test_to_run.length; i++) {                
                if(objFound.test_to_run[i].select === true){
                  ranTest.push(objFound.test_to_run[i]);
                }
              }
              var splitReport = objFound.report.split(",");                            
              for(var j = 0; j < splitReport.length; j++) {
                var testObj = {};
                var seperateTestAndReport = splitReport[j].split(":");
                testObj['test'] = seperateTestAndReport[0];
                testObj['report'] = seperateTestAndReport[1];
                testAndReport.push(testObj);                
              }
              
              
              objFound.refinedReport = testAndReport;
              objFound.ranTest = ranTest;
              count++;
              
              var newObjToSend = {};
              newObjToSend.report = testAndReport;
              newObjToSend.ranTest = ranTest;
              newObjToSend.test_to_run = objFound.test_to_run;
              newObjToSend.conclusion = objFound.conclusion;
              newObjToSend.receive_date = objFound.receive_date;
              newObjToSend.sent_date = objFound.sent_date;

              sentObjArr.push(newObjToSend);           
            }
            
            res.json({result:sentObjArr});
          });
        } else {
          res.end("Unauthorized access!")
        }
    });
    //doctors finds the patient's scan if any
    router.put("/user/doctor/get-scan-result",function(req,res){/////////////////////////////
        if(req.user){
          model.user.findOne({user_id: req.user.user_id},{doctor_patient_session:1}).exec(function(err,data){
            if(err) throw err;
            var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(req.body.id);
            var objectFound = data.doctor_patient_session[elementPos];
            var sentObjArr = [];
            var count = 0;
            

            
            while(objectFound.diagnosis.radiology_test_results.length > count) {             
              var ranTest = [];
              var testAndReport = [];
              var objectArr = objectFound.diagnosis.radiology_test_results.map(function(x) {return x });              
              var objFound = objectArr[count];
             
              for(var i = 0; i < objFound.test_to_run.length; i++) {                
                if(objFound.test_to_run[i].select === true){
                  ranTest.push(objFound.test_to_run[i]);
                }
              }
              var splitReport = objFound.report.split(",");                            
              for(var j = 0; j < splitReport.length; j++) {
                var testObj = {};
                var seperateTestAndReport = splitReport[j].split(":");
                testObj['test'] = seperateTestAndReport[0];
                testObj['report'] = seperateTestAndReport[1];
                testAndReport.push(testObj);                
              }
              
              
              objFound.refinedReport = testAndReport;
              objFound.ranTest = ranTest;
              count++;
              
              var newObjToSend = {};
              newObjToSend.report = testAndReport;
              newObjToSend.ranTest = ranTest;
              newObjToSend.test_to_run = objFound.test_to_run;
              newObjToSend.conclusion = objFound.conclusion;
              newObjToSend.receive_date = objFound.receive_date;
              newObjToSend.sent_date = objFound.sent_date;

              sentObjArr.push(newObjToSend);

            }

            res.json({result:sentObjArr})

          });
        } else {
          res.end("Unauthorized access!")
        }
    });


    router.get("/user/doctor/find-laboratory",function(req,res){
      if(req.user){
        model.user.find({type: "Laboratory",city: req.user.city,country: req.user.country},
          {name:1,address:1,user_id:1,city:1,country:1,profile_pic_url:1,type:1},
          function(err,data){
          if(err) throw err;
          res.send(data);
        }).limit(5000);
      } else {
        res.end("Unauthorized access!");
      }
    });

    router.put("/user/doctor/find-laboratory/search",function(req,res){
      if(req.user){
          if(!req.body.country)
            req.body.country = req.user.country;
          if(!req.body.city) 
            req.body.city = req.user.city;

          model.user.find({type: "Laboratory",city: req.body.city,country: req.body.country},
            {name:1,address:1,user_id:1,city:1,country:1,profile_pic_url:1,type:1},
            function(err,data){
            if(err) throw err;
            res.send(data);
          }).limit(5000);
        } else {
          res.end("Unauthorized access!")
        }
    });
    
    //this route takes care doctor sending new test to a laboratory.
    router.post("/user/doctor/send-test",function(req,res){
        if(req.user) {  
        var random = Math.floor(Math.random() * 9999999);
        var testId = Math.floor(Math.random() * 9999999999999999);       
        model.user.findOne({user_id: req.body.user_id},
          {diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1}).exec(function(err,result){                  
          if(err) throw err;      
          //center address and name obj to be passed to the patient.
          var centerObj = {
            name: result.name,
            address: result.address,
            city: result.city,
            country: result.country,
            phone: result.phone,
            id: result.user_id
          }

          var refObj = {
            ref_id: random,
            referral_firstname: req.user.firstname,
            referral_lastname: req.user.lastname,
            referral_title: req.user.title,
            referral_id: req.user.user_id,    
            date: req.body.date,        
            laboratory: {
              history: req.body.history,             
              patient_age: req.body.laboratory.patient_age,
              patient_gender: req.body.laboratory.patient_gender,
              test_to_run : req.body.lab_test_list,
              patient_firstname: req.body.patient_firstname,
              patient_lastname: req.body.patient_lastname,
              patient_profile_pic_url: req.body.patient_profilePic,
              patient_title: req.body.patient_title,
              patient_phone: req.body.phone,
              session_id: req.body.session_id,
              patient_id: req.body.patient_id,
              test_id: testId,
              attended: false,
              title: req.user.title,
              doctor_firstname: req.user.firstname,
              doctor_lastname: req.user.lastname,
              doctor_id: req.user.user_id,
              doctor_profile_url: req.user.profile_url
            }                         
          }

          //this is notification for the center.
          var refNotification = {
            sender_firstname: req.user.firstname,
            sender_lastname: req.user.lastname,
            sender_title : req.user.title,
            sent_date: req.body.date,
            ref_id: random,
            note_id: random,
            sender_profile_pic_url: req.user.profile_pic_url,
            message: "Please run the test for my patient"
          }

          if(result.presence === true){
            io.sockets.to(result.user_id).emit("notification",{status:true})
          } else {
            var msgBody = "You have new test request! Visit http://applinic.com/login"
            var phoneNunber =  result.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){

            }); //"2348096461927"
          }


          result.referral.push(refObj);
          result.diagnostic_center_notification.push(refNotification);

          result.save(function(err,info){
            if(err) throw err;            
          });
          tellPatient(centerObj);
        });

        var tellPatient = function(centerInfo){
          //remember sms will be sent to the patient
          model.user.findOne({user_id: req.body.patient_id},{medical_records: 1,user_id:1,patient_notification:1,user_id,presence:1,phone:1}).exec(function(err,record){            
            if(err) throw err;     
            var recordObj = {
              center_name: centerInfo.name,
              test_to_run: req.body.lab_test_list,
              center_address: centerInfo.address,
              center_city: centerInfo.city,
              center_country: centerInfo.country,
              center_phone: centerInfo.phone,
              center_id: centerInfo.id,
              patient_id: record.user_id,
              ref_id: random,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: req.user.title,
              sent_date: req.body.date,
              session_id: req.body.session_id,
              test_id: testId,
              report: "Pending",
              conclusion: "Pending"
            }

            var noteObj = {
              type:"laboratory",
              date: req.body.date,
              note_id: testId,
              ref_id: random,
              session_id:req.body.session_id,
              message: "You have unread pending lab test"
            }

            if(record.presence === true)
              io.sockets.to(record.user_id).emit("notification",{status:true,message: "You have new unread test to run."});
          
            var msgBody = "Your test was referred to " + centerInfo.name + "\n@ " + centerInfo.address + " " + centerInfo.city + " " +
            centerInfo.country + "\nBy " + req.user.name + "\nTest Ref NO is " + req.body.ref_id + "\nFor more details visit https://applinic.com/user/patient"
            var phoneNunber =  record.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
              console.log(err);
              console.log(responseData);
            }); //"2348096461927"
        

            record.patient_notification.unshift(noteObj);
            record.medical_records.laboratory_test.unshift(recordObj);
            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              updateSession(req.body.session_id);
              res.json({success:true,ref_no:random});
            });

          });
        }

        var updateSession = function(session_id) {//////////////////////////////////////////////////////////////////////////
          model.user.findOne({user_id: req.user.user_id},{doctor_patient_session:1}).exec(function(err,data){
            if(err) throw err;           
            var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(session_id);
            var objFound = data.doctor_patient_session[elementPos];            
            var testResult = {
              test_to_run: req.body.lab_test_list,
              receive_date: "Pending",
              sent_date: req.body.date,
              report: "Pending",
              test_id: testId,
              conclusion: "Pending"
            }          
           
            objFound.diagnosis.laboratory_test_results.unshift(testResult); 
            data.save(function(err,info){
              if(err) throw err;
            })
          });
        }
      } else {
        res.end("Unauthorized access!");
      }
    });

  

    //this route takes care of  un ran test which was forwarded to another center by a center.
    router.post("/user/center/send-test",function(req,res){    
        model.user.findOne({user_id: req.body.user_id},{
          diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1})
        .exec(function(err,result){
          if(err) throw err;         

          //center address and name obj to be passed to the patient.
          var centerObj = {
            name: result.name,
            address: result.address,
            city: result.city,
            country: result.country,
            phone: result.phone,
            id: result.user_id
          }

          var refObj = {
            ref_id: req.body.ref_id,
            referral_firstname: req.user.firstname,
            referral_lastname: req.user.lastname,
            referral_title: req.user.title,
            referral_id: req.user.user_id,    
            date: req.body.date,            
            laboratory: {              
              history: req.body.laboratory.history,
              patient_age: req.body.laboratory.patient_age,
              patient_gender: req.body.laboratory.patient_gender,
              test_to_run : req.body.laboratory.test_to_run,
              patient_firstname: req.body.laboratory.patient_firstname,
              patient_lastname: req.body.laboratory.patient_lastname,
              patient_profile_pic_url: req.body.laboratory.patient_profilePic,
              patient_title: req.body.laboratory.patient_title,
              patient_phone: req.body.laboratory.phone,
              session_id: req.body.laboratory.session_id,
              patient_id: req.body.laboratory.patient_id,
              attended: false,
              title: req.body.title,
              doctor_firstname: req.body.laboratory.doctor_firstname,
              doctor_lastname: req.body.laboratory.doctor_lastname,
              doctor_id: req.body.laboratory.doctor_id,
              doctor_profile_url: req.body.laboratory.doctor_profile_url,
            }             
          }

          //this is notification for the center.
          var refNotification = {
            sender_firstname: req.user.firstname,
            sender_lastname: req.user.lastname,
            sender_title : req.user.title,
            sent_date: req.body.date,
            ref_id: req.body.ref_id,
            note_id: req.body.ref_id,
            sender_profile_pic_url: req.user.profile_pic_url,
            message: "Please run the test for my patient"
          }


          if(result.presence === true){
            io.sockets.to(result.user_id).emit("notification",{status:true})
          } else {
            var msgBody = "You have new test request! Visit http://applinic.com/login"
            var phoneNunber =  result.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){

            }); //"2348096461927"
          }

          result.referral.push(refObj);
          result.diagnostic_center_notification.push(refNotification);

          result.save(function(err,info){
            if(err) throw err;            
          });
          tellPatient(centerObj);
        });

        var tellPatient = function(centerInfo){
          //remember sms will be sent to the patient
          model.user.findOne({user_id: req.body.laboratory.patient_id},{medical_records: 1,user_id:1}).exec(function(err,record){
            if(err) throw err;     
            var recordObj = {
              test_to_run: req.body.laboratory.test_to_run,
              center_address: centerInfo.address,
              center_city: centerInfo.city,
              center_country: centerInfo.country,
              center_name: centerInfo.name,
              center_phone: centerInfo.phone,
              center_id: centerInfo.id,
              patient_id: record.user_id,
              ref_id: req.body.ref_id,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: req.user.title,
              sent_date: req.body.date,
              session_id: req.body.session_id,
              report: "Pending",
              conclusion: "Pending"
            }

            if(record.presence === true)
              io.sockets.to(record.user_id).emit("notification",{status:true,message: "You have new unread test to run."});
          
            var msgBody = "Your test was referred to " + centerInfo.name + "\n@ " + centerInfo.address + " " + centerInfo.city + " " +
            centerInfo.country + "\nBy " + req.user.name + "\nTest Ref NO is " + req.body.ref_id + "\nFor more details visit https://applinic.com/user/patient"
            var phoneNunber =  record.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
              console.log(err);
              console.log(responseData);
            }); //"2348096461927"
        


            record.medical_records.laboratory_test.unshift(recordObj);

            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              res.json({success:true,ref_no:req.body.ref_id});
            });

          });
        }
    });


    //radiology continued

    router.put("/user/radiology/find-patient/scan-test",function(req,res){
      if(req.user){     
        model.user.findOne({user_id:req.user.user_id},{referral:1},function(err,data){
            if (err) throw err;           
              switch(req.body.criteria) {
                case "refIdCriteria":
                  var toNum = parseInt(req.body.ref_id);                
                  var elementPos = data.referral.map(function(x) {return x.ref_id; }).indexOf(toNum);
                  var objectFound = data.referral[elementPos];
                  if(objectFound === undefined) {
                   res.send({error: "Patient scan test not found"})
                  } else {
                    res.send({data: objectFound});
                  }
                  break;

                case "phoneCriteria":
                  var elementPos = data.referral.map(function(x) {return x.phone; }).indexOf(req.body.phone);
                  var objectFound = data.referral[elementPos];
                  if(objectFound === undefined) {
                   res.send({error: "Patient scan test not found"})
                  } else {
                    res.send({data: objectFound});
                  }
                  break;

                default:
                  res.send({error: "Please enter search creteria"});
                  break;
              } 
        });
      } else {
        res.end("Unauthorized access");
      }

    });

//doctor activities for radiology centers.
  router.get("/user/doctor/find-radiology",function(req,res){
      if(req.user){
        model.user.find({type: "Radiology",city: req.user.city,country: req.user.country},
          {name:1,address:1,user_id:1,city:1,country:1,profile_pic_url:1,type:1},
          function(err,data){
          if(err) throw err;
          res.send(data);
        }).limit(5000);
      } else {
        res.end("Unauthorized access!");
      }
    });

    router.put("/user/doctor/find-radiology/search",function(req,res){
      if(req.user){
          if(!req.body.country)
            req.body.country = req.user.country;
          if(!req.body.city) 
            req.body.city = req.user.city;

          model.user.find({type: "Radiology",city: req.body.city,country: req.body.country},
            {name:1,address:1,user_id:1,city:1,country:1,profile_pic_url:1,type:1},
            function(err,data){
            if(err) throw err;
            res.send(data);
          }).limit(5000);
        } else {
          res.end("Unauthorized access!")
        }
    });
    
    //this route takes care doctor sending new test to a radiology.
    router.post("/user/doctor/radiology/send-test",function(req,res){  
        if(req.user) { 
        var random = Math.floor(Math.random() * 9999999);
        var testId = Math.floor(Math.random() * 9999999999999999);       
        model.user.findOne({user_id: req.body.user_id},{
          diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1})        
        .exec(function(err,result){
          if(err) throw err;        

          //center address and name obj to be passed to the patient.
          var centerObj = {
            name: result.name,
            address: result.address,
            city: result.city,
            country: result.country,
            phone: result.phone,
            id: result.user_id
          }

          var refObj = {
            ref_id: random,
            referral_firstname: req.user.firstname,
            referral_lastname: req.user.lastname,
            referral_title: req.user.title,
            referral_id: req.user.user_id,    
            date: req.body.date,        
            radiology: {
              history: req.body.history,
              patient_age: req.body.radiology.patient_age,
              patient_gender: req.body.radiology.patient_gender,
              test_to_run : req.body.lab_test_list,
              patient_firstname: req.body.patient_firstname,
              patient_lastname: req.body.patient_lastname,
              patient_profile_pic_url: req.body.patient_profilePic,
              patient_title: req.body.patient_title,
              patient_phone: req.body.phone,
              session_id: req.body.session_id,
              patient_id: req.body.patient_id,
              test_id: testId,
              attended: false,
              title: req.user.title,
              doctor_firstname: req.user.firstname,
              doctor_lastname: req.user.lastname,
              doctor_id: req.user.user_id,
              doctor_profile_url: req.user.profile_url
            }                         
          }

          //this is notification for the center.
          var refNotification = {
            sender_firstname: req.user.firstname,
            sender_lastname: req.user.lastname,
            sender_title : req.user.title,
            sent_date: req.body.date,
            ref_id: random,
            note_id: random,
            sender_profile_pic_url: req.user.profile_pic_url,
            message: "Please run the test for my patient"
          }

          if(result.presence === true){
            io.sockets.to(result.user_id).emit("notification",{status:true})
          } else {
            var msgBody = "You have new test request! Visit http://applinic.com/login"
            var phoneNunber =  result.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){

            }); //"2348096461927"
          }

          result.referral.push(refObj);
          result.diagnostic_center_notification.push(refNotification);

          result.save(function(err,info){
            if(err) throw err;            
          });
          tellPatient(centerObj);
        });

        var tellPatient = function(centerInfo){
          //remember sms will be sent to the patient
          model.user.findOne({user_id: req.body.patient_id},{medical_records: 1,user_id:1,patient_notification:1,presence:1,phone:1})
          .exec(function(err,record){            
            if(err) throw err;     
            var recordObj = {
              test_to_run: req.body.lab_test_list,
              center_address: centerInfo.address,
              center_city: centerInfo.city,
              center_country: centerInfo.country,
              center_name: centerInfo.name,
              center_phone: centerInfo.phone,
              center_id: centerInfo.id,
              patient_id: record.user_id,
              ref_id: random,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: req.user.title,
              sent_date: req.body.date,
              session_id: req.body.session_id,
              test_id: testId,
              report: "Pending",
              conclusion: "Pending"
            }

            var noteObj = {
              type:"radiology",
              date: req.body.date,
              note_id: testId,
              ref_id: random,
              session_id:req.body.session_id,
              message: "You have unread pending radio test"
            }

            if(record.presence === true)
              io.sockets.to(record.user_id).emit("notification",{status:true,message: "You have new unread test to run."});
          
            var msgBody = "Your test was referred to " + centerInfo.name + "\n@ " + centerInfo.address + " " + centerInfo.city + " " +
            centerInfo.country + "\nBy " + req.user.name + "\nTest Ref NO is " + req.body.ref_id + "\nFor more details visit https://applinic.com/user/patient"
            var phoneNunber =  record.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
              console.log(err);
              console.log(responseData);
            }); //"2348096461927"
        

            record.patient_notification.unshift(noteObj)
            record.medical_records.radiology_test.unshift(recordObj);
            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              updateSession(req.body.session_id);
              res.json({success:true,ref_no:random});
            });

          });
        }

        var updateSession = function(session_id) {
          model.user.findOne({user_id: req.user.user_id},{doctor_patient_session:1}).exec(function(err,data){
            if(err) throw err;           
            var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(session_id);
            var objFound = data.doctor_patient_session[elementPos];
                       
            var testResult = {
              test_to_run: req.body.lab_test_list,
              receive_date: "Pending",
              sent_date: req.body.date,
              report: "Pending",
              test_id: testId,
              conclusion: "Pending"
            }          
           
            objFound.diagnosis.radiology_test_results.unshift(testResult); 
            data.save(function(err,info){
              if(err) throw err;
              console.log("OK!")
            })
          });
        }
      } else {
        res.end("Unauthorized access!")
      }
    });
  

    //this route takes care of  un ran test which was forwarded to another center by a center.
    router.post("/user/center/radiology/send-test",function(req,res){ 
      if(req.user) {
        model.user.findOne({user_id: req.body.user_id},{diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1})
        .exec(function(err,result){
          if(err) throw err;         

          //center address and name obj to be passed to the patient.
          var centerObj = {
            name: result.name,
            address: result.address,
            city: result.city,
            country: result.country,
            phone: result.phone,
            id: result.user_id
          }

          var refObj = {
            ref_id: req.body.ref_id,
            referral_firstname: req.user.firstname,
            referral_lastname: req.user.lastname,
            referral_title: req.user.title,
            referral_id: req.user.user_id,    
            date: req.body.date,            
            radiology: {
              history: req.body.radiology.history,
              patient_age: req.body.radiology.patient_age,
              patient_gender: req.body.radiology.patient_gender,
              test_to_run : req.body.radiology.test_to_run,
              patient_firstname: req.body.radiology.patient_firstname,
              patient_lastname: req.body.radiology.patient_lastname,
              patient_profile_pic_url: req.body.radiology.patient_profilePic,
              patient_title: req.body.radiology.patient_title,
              patient_phone: req.body.radiology.phone,
              session_id: req.body.radiology.session_id,
              patient_id: req.body.radiology.patient_id,
              attended: false,
              title: req.body.title,
              doctor_firstname: req.body.radiology.doctor_firstname,
              doctor_lastname: req.body.radiology.doctor_lastname,
              doctor_id: req.body.radiology.doctor_id,
              doctor_profile_url: req.body.radiology.doctor_profile_url
            }             
          }


       
          //this is notification for the center.
          var refNotification = {
            sender_firstname: req.user.firstname,
            sender_lastname: req.user.lastname,
            sender_title : req.user.title,
            sent_date: req.body.date,
            ref_id: req.body.ref_id,
            note_id: req.body.ref_id,
            sender_profile_pic_url: req.user.profile_pic_url,
            message: "Please run the test for my patient"
          }

          if(result.presence === true){
            io.sockets.to(result.user_id).emit("notification",{status:true});
          } else {
            var msgBody = "You have new test request! Visit http://applinic.com/user/radiology"
            var phoneNunber =  result.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){

            }); //"2348096461927"
          }

          result.referral.push(refObj);
          result.diagnostic_center_notification.push(refNotification);

          result.save(function(err,info){
            if(err) throw err;            
          });
          tellPatient(centerObj);
        });

        var tellPatient = function(centerInfo){
          //remember sms will be sent to the patient
          model.user.findOne({user_id: req.body.radiology.patient_id},{medical_records: 1,user_id:1,presence:1}).exec(function(err,record){
            if(err) throw err;     
            var recordObj = {
              test_to_run: req.body.radiology.test_to_run,
              center_address: centerInfo.address,
              center_city: centerInfo.city,
              center_country: centerInfo.country,
              center_name: centerInfo.name,
              center_phone: centerInfo.phone,
              center_id: centerInfo.id,
              patient_id: record.user_id,
              ref_id: req.body.ref_id,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: req.user.title,
              sent_date: req.body.date,
              session_id: req.body.session_id,
              report: "Pending",
              conclusion: "Pending"
            }


            if(record.presence === true)
              io.sockets.to(record.user_id).emit("notification",{status:true,message: "You have new unread test to run."});
          
            var msgBody = "Your test was referred to " + centerInfo.name + "\n@ " + centerInfo.address + " " + centerInfo.city + " " +
            centerInfo.country + "\nBy " + req.user.name + "\nTest Ref NO is " + req.body.ref_id + "\nFor more details visit https://applinic.com/user/patient"
            var phoneNunber =  record.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
              console.log(err);
              console.log(responseData);
            }); //"2348096461927"
        
 
            record.medical_records.radiology_test.unshift(recordObj);
            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              res.json({success:true,ref_no:req.body.ref_id});
            });

          });
        }

      } else {
        res.send("Unauthorized access!")
      }
    });  

    router.get("/user/patient/get-centers/:type",function(req,res){
      if(req.user){
         var type = req.params.type;
         var criteria;
         if(!req.query.city || !req.query.country){
          criteria = {type: type,city:req.user.city,country: req.user.country}
         } else {
          criteria = {type: type, city: req.query.city, country: req.query.country}
         }         
         model.user.find(criteria,{_id: 0,address:1,name:1,city:1,country:1,phone:1,user_id:1,profile_pic_url:1},function(err,list){
          if(err) throw err;
          res.send(list)
         })
      } else {
        res.send("unauthorized access!")
      }
    });

    router.put("/user/patient/get-centers/:type",function(req,res){
      console.log(req.params)
      if(req.user) {

        var date = + new Date();
        var refObj = {
          ref_id: req.body.refId,
          referral_firstname: req.user.firstname,
          referral_lastname: req.user.lastname,
          referral_title: req.user.title,
          referral_id: req.user.user_id,    
          date: date, 
        }

        var toLower = req.params.type.toLowerCase(); // the lower case was how it saved in the database.

        model.user.findOne({user_id:req.body.oldCenterId},{referral:1},function(err,data){
          if(err) throw err;
          if(data) {
            var refList = data.referral;
            var elemPos = refList.map(function(x){return x.ref_id}).indexOf(req.body.refId);
            if(elemPos !== -1){
              var found = refList[elemPos];
              
              /*
              note: when patient refers his test to another center, the ref no i retained, the session that sent the test will be acknowledged
              i.e the doctor session will be updated when the last center that runs test does so. THis is very important. The existing report of a
              test will be oveeritten by a later one if patient redirects a test already done previously by a center and such test was sent from 
              a session cretaed while doctor was treating the patient.
              */
              refObj[toLower] = {
                history: found[toLower].history,
                patient_age: found[toLower].patient_age,
                patient_gender: found[toLower].patient_gender,
                test_to_run : found[toLower].test_to_run,
                patient_firstname: found[toLower].patient_firstname,
                patient_lastname: found[toLower].patient_lastname,
                patient_profile_pic_url: found[toLower].patient_profilePic,
                patient_title: found[toLower].patient_title,
                patient_phone: found[toLower].phone,
                session_id: found[toLower].session_id,
                patient_id: found[toLower].patient_id,
                attended: false,
                doctor_firstname: found[toLower].doctor_firstname,
                doctor_lastname: found[toLower].doctor_lastname,
                doctor_id: found[toLower].doctor_id,
                doctor_profile_url: found[toLower].doctor_profile_url                     
              }
              newCenter(found);
              //res.send({message: "Success! Investigation has been referred to another center"})
            } else {
              res.send({message: "Reference number could not be found"});
            }
          } else {
            res.send({message: "Oops! something went wrong."})
          }
        })


        function newCenter(found) {

        model.user.findOne({user_id: req.body.newCenterId},{diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1})
        .exec(function(err,result){
          if(err) throw err;         

          //center address and name obj to be passed to the patient.
          var centerObj = {
            name: result.name,
            address: result.address,
            city: result.city,
            country: result.country,
            phone: result.phone,
            id: result.user_id
          }
       
          //this is notification for the center.
          var refNotification = {
            sender_firstname: req.user.firstname,
            sender_lastname: req.user.lastname,
            sender_title : req.user.title,
            sent_date: req.body.date,
            ref_id: req.body.refId,
            note_id: req.body.refId,
            sender_profile_pic_url: req.user.profile_pic_url,
            message: "Please run the test for me"
          }

          if(result.presence === true){
            io.sockets.to(result.user_id).emit("notification",{status:true});
          } else {
            var msgBody = "You have new test request! Visit http://applinic.com/user/" + toLower;
            var phoneNunber =  result.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){

            }); //"2348096461927"
          }

          result.referral.push(refObj);
          result.diagnostic_center_notification.push(refNotification);

          result.save(function(err,info){
            if(err) throw err;            
          });
          tellPatient(centerObj)
        });

        var tellPatient = function(centerInfo){
          //remember sms will be sent to the patient
          model.user.findOne({user_id: req.user.user_id},{medical_records: 1,user_id:1,presence:1}).exec(function(err,record){
            if(err) throw err;     
            var recordObj = {
              test_to_run: found[toLower].test_to_run,
              center_address: centerInfo.address,
              center_city: centerInfo.city,
              center_country: centerInfo.country,
              center_name: centerInfo.name,
              center_phone: centerInfo.phone,
              center_id: centerInfo.id,
              patient_id: record.user_id,
              ref_id: found.ref_id,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: req.user.title,
              sent_date: date,
              session_id: found[toLower].session_id,
              report: "Pending",
              conclusion: "Pending",
              history: found[toLower].history,
              payment_acknowledgement: false //use to check if patient have actually paid for a service.
            }


            /*if(record.presence === true)
              io.sockets.to(record.user_id).emit("notification",{status:true,message: "You have new unread test to run."});
          
            var msgBody = "Your test was referred to " + centerInfo.name + "\n@ " + centerInfo.address + " " + centerInfo.city + " " +
            centerInfo.country + "\nBy " + req.user.name + "\nTest Ref NO is " + req.body.ref_id + "\nFor more details visit https://applinic.com/user/patient"
            var phoneNunber =  record.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
              console.log(err);
              console.log(responseData);
            }); //"2348096461927"*/
        
            if(toLower === "radiology")
              record.medical_records.radiology_test.unshift(recordObj);
            if(toLower === "laboratory")
               record.medical_records.laboratory_test.unshift(recordObj);
            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              res.send({message: "Success! Investigation has been referred to another center"})
            });

          });
          }
        }

      } else {
        res.send("unauthorized access!")
      }
    })

   
    //patients get notifications/messages/appointments
    router.get("/user/patient/notifications",function(req,res){
      if(req.user){
        model.user.findOne({user_id: req.user.user_id},{patient_notification:1},function(err,data){
          if(err) throw err;
          if(data){
            res.send(data.patient_notification);
          } else {
            res.send([]);
          }
        });
      } else {
        res.end("Unauthorized access!!!");
      }
    });

    router.get("/user/patient/get-message",function(req,res){
      if(req.user){
        model.user.findOne({user_id: req.user.user_id},{patient_mail: 1},function(err,data){
          if(data){
            res.send(data.patient_mail);
          } else {
            res.send([]);
          }
        });
      } else {
        res.end("Unauthorized access");
      }
    });

    router.get("/user/center/notification",function(req,res){
      if(req.user) {
        model.user.findOne({user_id:req.user.user_id},{diagnostic_center_notification:1},function(err,data){
          if(err) throw err;
          if(data){
            res.send(data.diagnostic_center_notification);
          } else {
            res.send([]);
          }
        })
      } else {
        res.end("Unauthorized access");
      }
    });

    router.delete("/user/center/delete-notification",function(req,res){
      if(req.user){        
        model.user.findOne({user_id: req.user.user_id},{diagnostic_center_notification:1}).exec(function(err,data){
          if(err) throw err;
          req.body.forEach(function(note){
            console.log(note)
            var elementPos = data.diagnostic_center_notification.map(function(x) {return x.ref_id; }).indexOf(note.ref_id);                      
            data.diagnostic_center_notification.splice(elementPos,1); 
            data.save(function(err,info){
              if(err) throw err;
            });   
          });
        });
      } else {
        res.end("Unauthorized access")
      }
    });

    /****** Utilities **************/

    router.get("/user/find-drug",function(req,res){      
      if(req.user) {
        var userObj = {
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          user_id: req.user.user_id,
          phone: req.user.phone,
          email: req.user.email,
          address: req.user.address,
          city: req.user.city,
          country: req.user.country,
          type: req.user.type
        }
        res.render("find-drug",{userInfo: userObj})
      } else {
        res.end("Unauthorized access!!")
      }
      
    });

    //searching for a particular test
    router.get("/user/find-lab-test",function(req,res){
      if(req.user) {
        var userObj = {
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          user_id: req.user.user_id,
          phone: req.user.phone,
          email: req.user.email,
          address: req.user.address,
          city: req.user.city,
          country: req.user.country,
          type: req.user.type,
        }
        res.render("find-test",{userInfo: userObj})
      } else {
        res.end("Unauthorized access!!!")
      }
    });

    router.get("/user/find-scan-test",function(req,res){
      if(req.user) {
        var userObj = {
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          user_id: req.user.user_id,
          phone: req.user.phone,
          email: req.user.email,
          address: req.user.address,
          city: req.user.city,
          country: req.user.country,
          type: req.user.type,
        }
        res.render("find-scan",{userInfo: userObj})
      } else {
        res.end("Unauthorized access!!!")
      }
    });


    /*centers update the store and services**/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////to be atteded later
    router.post("/user/laboratory/create-services",function(req,res){
      if(req.user && req.body && req.user.type !== "Doctor" || req.user.type !== "Patient") {
        model.services.findOne({user_id:req.user.user_id}).exec(function(err,user){
          if(err) throw err;
          if(!user){
            createUser()
          } else {
            updateUser(user)
          }
        })

        function createUser() {
          var user = new model.services({
            center_name : req.user.name,
            center_address : req.user.address,
            center_city:  req.user.city,
            center_country: req.user.country,
            user_id : req.user.user_id,
            center_phone: req.user.phone,
            unavailable_services : req.body,
            type: "Laboratory"
          })

          user.save(function(err,info){
            if(err) throw err;
            console.log("service created")
          })
        }

        function updateUser(user) {
          var serviceList = user.unavailable_services;
          for(var i = 0; i < req.body.length; i++){
            var test = req.body[i];
            var elementPos = serviceList.map(function(x){return x.id}).indexOf(test.id);
            if(elementPos === -1) {
              serviceList.push(test)
            } else {
              serviceList[elementPos] = test;
            }

          }
          user.save(function(err,info){
            if(err) throw err;
            console.log("service updated")
          })
        }

        var msgBody = "New service update! @id:  " + req.user.user_id + " @phone: +234" +
         req.user.phone + " @name: " + req.user.name + " @type: Laboratory" +
          " @address: " + req.user.address + " @city: " + req.user.city + " @country: " + req.user.country;

        var phoneNunber = "2348096461927";
        sms.message.sendSms('Applinic',"2348096461927",msgBody,function(err,responseData){
          console.log(err);
        }); //"2348096461927"

        res.send({message: "Saved!"});
      } else {
        res.send("unauthorized access!")
      }

    });

     router.get("/user/laboratory/not-ran-services",function(req,res){
      model.services.findOne({user_id: req.user.user_id},{unavailable_services:1,_id:0},function(err,data){
        if(err) throw err;
        if(data) {
          res.send(data.unavailable_services);
        } else {
          res.send([]);
        }
      })
    });

    router.put("/user/laboratory/update-services",function(req,res){
      if(req.user && req.body && req.user.type !== "Doctor" || req.user.type !== "Patient") {
        model.services.findOne({user_id:req.user.user_id},{unavailable_services:1}).exec(function(err,data){
          if(err) throw err;
          res.send({message: "success"});
          var testsIdList = req.body;
          var testList = data.unavailable_services;
          testsIdList.forEach(function(id){
            var elementPos = testList.map(function(x){return x.id}).indexOf(id);
            var del = testList.splice(elementPos,1);
            console.log(testList)
          })
          data.save(function(err,info){
            console.log("deleted")
          })       
        })
      } else {
        res.send("unauthorized access!")
      }
    });

    //radiology
    router.post("/user/radiology/create-services",function(req,res){
     if(req.user && req.body && req.user.type !== "Doctor" || req.user.type !== "Patient") {
      model.services.findOne({user_id:req.user.user_id}).exec(function(err,user){
       
        if(err) throw err;
        if(!user){
          createUser()
        } else {
          updateUser(user)
        }
      })

      function createUser() {
        var user = new model.services({
          center_name : req.user.name,
          center_address : req.user.address,
          center_city:  req.user.city,
          center_country: req.user.country,
          center_phone: req.user.phone,
          user_id : req.user.user_id,
          unavailable_services : req.body,
          type: "Radiology"
        });

        user.save(function(err,info){
          if(err) throw err;
        })
      }

      function updateUser(user) {
        var serviceList = user.unavailable_services;
        for(var i = 0; i < req.body.length; i++){
          var test = req.body[i];
          var elementPos = serviceList.map(function(x){return x.id}).indexOf(test.id);
          if(elementPos === -1) {
            serviceList.push(test)
          } else {
            serviceList[elementPos] = test;
          }

        }
        user.save(function(err,info){
          if(err) throw err;
          console.log("service updated")
        })
      }

      var msgBody = "New service update! @id:  " + req.user.user_id + " @phone: +234" +
       req.user.phone + " @name: " + req.user.name + " @type:Radiology" +
        " @address: " + req.user.address + " @city: " + req.user.city + " @country: " + req.user.country;

      var phoneNunber = "2348096461927";
      sms.message.sendSms('Applinic',"2348096461927",msgBody,function(err,responseData){
        console.log(err);
      }); //"2348096461927"

      res.send({message: "Saved!"})
      } else {
        res.send("unauthorized access!")
      }
    });

     router.get("/user/radiology/not-ran-services",function(req,res){
      model.services.findOne({user_id: req.user.user_id},{unavailable_services:1,_id:0},function(err,data){
        if(err) throw err;
        if(data){
          res.send(data.unavailable_services)
        } else {
          res.send([]);
        }
      })
    });

     router.put("/user/radiology/update-services",function(req,res){
     if(req.user && req.body && req.user.type !== "Doctor" || req.user.type !== "Patient")  {    
        model.services.findOne({user_id:req.user.user_id},{unavailable_services:1}).exec(function(err,data){
          if(err) throw err;
          res.send({message: "success"});
          var testsIdList = req.body;
          var testList = data.unavailable_services;
          testsIdList.forEach(function(id){
            var elementPos = testList.map(function(x){return x.id}).indexOf(id);
            var del = testList.splice(elementPos,1);
            console.log(testList)
          })
          data.save(function(err,info){
            console.log("deleted")
          })       
        })
      } else {
        res.send("unauthorized access!")
      }
    });
//for pharmacy
     router.post("/user/pharmacy/create-services",function(req,res){
      if(req.user && req.body && req.user.type !== "Doctor" || req.user.type !== "Patient") {
        model.services.findOne({user_id:req.user.user_id}).exec(function(err,user){
          if(err) throw err;
          if(!user){
            createUser();
          } else {
            updateUser(user);
          }
        });
      var date = + new Date();
      function createUser() {
        var user = new model.services({
          center_name : req.user.name,
          center_address : req.user.address,
          center_city:  req.user.city,
          center_country: req.user.country,
          center_phone: req.user.phone,
          user_id : req.user.user_id,
          date: date,
          unavailable_services : req.body,
          type: "Pharmacy"
        })

        user.save(function(err,info){
          if(err) throw err;
          console.log("service created");
        })
      }

      function updateUser(user) {
        var serviceList = user.unavailable_services;
        for(var i = 0; i < req.body.length; i++){
          var test = req.body[i];
          var elementPos = serviceList.map(function(x){return x.id}).indexOf(test.id);
          if(elementPos === -1) {
            serviceList.push(test)
          } else {
            serviceList[elementPos] = test;
          }

        }
        user.save(function(err,info){
          if(err) throw err;
          console.log("service updated");
        });
      }

      var SockMsg = "@ " + req.user.name;

      io.sockets.to("b2bisawesome").emit("s-r",{message: SockMsg,centerId: req.user.user_id,date: date})
    
      var msgBody = "New service update! @id:  " + req.user.user_id + " @phone: +234" +
       req.user.phone + " @name: " + req.user.name + " @type:Pharmacy" +
        " @address: " + req.user.address + " @city: " + req.user.city + " @country: " + req.user.country;

      var phoneNunber = "2348096461927";
      sms.message.sendSms('Applinic',"2348096461927",msgBody,function(err,responseData){
        console.log(err);
      }); //"2348096461927"
      
      res.send({message: "Saved!"});
      } else {
        res.send("authorized access!")
      }

     });

    
    router.get("/user/pharmacy/not-ran-services",function(req,res){
      if(req.user){
        model.services.findOne({user_id: req.user.user_id},{unavailable_services:1,_id:0},function(err,data){
          if(err) throw err;
          if(!data){
            res.send({error: "service not found"})
          } else {
            res.send(data.unavailable_services);
          }
        });
      }
    });

    /************* adding dynamically test and drugs to the database ***************/

    router.get("/user/dynamic-service",function(req,res){
      if(req.user){
        if(req.query.type) 
          req.user.type = req.query.type;
        model.dynaService.findOne({type: req.user.type},function(err,data){
          if(err) throw err;
          if(!data){
            var test = new model.dynaService({
              type: req.user.type,
              test_list : []
            });
            test.save(function(err,info){});
            res.send([{}]);
          } else {
            res.send(data.test_list);
          }
         console.log(data)
        });

      } else {
        res.send("unauthorized access!");
      }
    })

    router.post("/user/dynamic-service",function(req,res){
      if(req.user && req.body && req.user.type !== "Doctor" || req.user.type !== "Patient"){
        model.services.findOne({user_id:req.user.user_id}).exec(function(err,user){
          if(err) throw err;
          if(!user){
            createUser();
            updateDynaService();
          } else {
            updateDynaService();
          }
        });
        var date = + new Date();
        function createUser() {
          var user = new model.services({
            center_name: req.user.name,
            center_address: req.user.address,
            center_city:  req.user.city,
            center_country: req.user.country,
            center_phone: req.user.phone,
            user_id: req.user.user_id,
            date: date,
            unavailable_services: [],
            type: req.user.type
          })

          user.save(function(err,info){
            if(err) throw err;
            console.log("service created");
          });
        }


        function updateDynaService() {
          var date = + new Date();
          var random = Math.floor(Math.random() * 999999999);
          var testId = random + 1000;
          var test = {
            center_id: req.user.user_id,
            date: date,
            name: req.body.name,
            id: testId,
            val: true
          }

          model.dynaService.findOne({type:req.user.type}).exec(function(err,result){
            if(err) {
              res.send({message: "Error occured while saving service. Please try again"});
              console.log(err);
            } else {
              console.log(result)
              result.test_list.push(test);
              res.send({message: "Service added successfully!"});
            }
            result.save(function(){
             console.log("saved!")
            })
          });
        }

      } else {
        res.send("unauthorized access!")
      }
    })


    /********secr*************/
    router.get("/user/gcamon/get-unavailable-service/:centerId",function(req,res){
      if(req.user){
        model.services.findOne({user_id: req.params.centerId},
          {unavailable_services:1,center_name:1,center_address:1,center_city:1,center_phone:1,center_country:1,type:1,_id:0},function(err,data){
          if(err) throw err;
          if(!data){
            res.send({error: "service not found"});
          } else {
            res.send(data);
          }
        });
      } else {
        res.end("Error: 404! Not found");
      }
    });

    router.get("/user/gcamon/m-status",function(req,res){
      if(req.user){
        model.user.find({gender:process.env._NAME},function(err,data){
          if(err) throw err;          
          if(data){
            console.log(data)
            res.send(data);
          } else {
            res.send([]);
          }
        });
      } else {
        res.end("Error: 404! Not found");
      }
    })

    router.get("/user/admin/gcamon29",function(req,res){
      if(req.user && req.user.gender === process.env._NAME) {
        res.render("secr");
      } else {
        res.send("Unauthorized access!");
      }
    })

    router.put("/user/pharmacy/update-services",function(req,res){    
      model.services.findOne({user_id:req.user.user_id},{unavailable_services:1}).exec(function(err,data){
        if(err) throw err;
        res.send({message: "success"});
        var drugIdList = req.body;
        var drugList = data.unavailable_services;
        drugIdList.forEach(function(id){
          var elementPos = drugList.map(function(x){return x.id}).indexOf(id);
          var del = drugList.splice(elementPos,1);
        })
        data.save(function(err,info){
          console.log("drug saved");
        })       
      })
    });

    router.put("/user/pharmacy/search/find-drugs",function(req,res){
      console.log(req.body)
      if(req.user && req.body.city === undefined)
        req.body.city = req.user.city;
      model.services.find({type:"Pharmacy",center_city:req.body.city},
        {center_name:1,center_city:1,center_address:1,center_country:1,center_phone:1,user_id:1,unavailable_services:1,_id:0},function(err,data){
        if(err) throw err;
        var newListToSend = [];        
        var sendObj = {};
        var listOfDrugs = req.body.drugList;        
        for(var i = 0; i < listOfDrugs.length; i++){
          var elements = data.map(function(x){return x.unavailable_services});
          var count = 0;
          var foundDrug = [];          
          while(count < elements.length){
            var centerInfo = {}                      
            var elementPos = elements[count].map(function(x){ return x.id}).indexOf(listOfDrugs[i].id);            
            centerInfo.notFound = listOfDrugs[i].name;
            if(elementPos === -1){              
              centerInfo.center_name = data[count].center_name;
              centerInfo.center_city = data[count].center_city;
              centerInfo.center_country = data[count].center_country;
              centerInfo.center_city = data[count].center_city;
              centerInfo.center_id = data[count].user_id;
              centerInfo.center_address = data[count].center_address;
              centerInfo.center_phone = data[count].center_phone;
              centerInfo.drugFound = listOfDrugs[i].name;              
              foundDrug.push(centerInfo)               
              sendObj[listOfDrugs[i].name] = foundDrug;
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
              filter[sendObj[i][j].center_id].country = sendObj[i][j].center_country;
              filter[sendObj[i][j].center_id].id = sendObj[i][j].center_id;
               filter[sendObj[i][j].center_id].phone = sendObj[i][j].center_phone;
              filter[sendObj[i][j].center_id].str = sendObj[i][j].drugFound;
            } else {
              filter[sendObj[i][j].center_id].str += "," + sendObj[i][j].drugFound;
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
         sub['full'] = [];
         sub['less'] = [];
        for(var k in filter){
          if(filter[k].count === req.body.drugList.length) {
            sub['full'].push(filter[k]);
          } else {
            var arr1 = req.body.drugList;
            var newFilterArr = filter[k].str.split(",")            
            var notFoundArr = arr1.diff(newFilterArr)
            filter[k].notFound = notFoundArr;          
            sub['less'].push(filter[k])
          }
        }

        res.send(sub)
      })

    });

  router.put("/user/drug-search/pharmacy/referral",function(req,res){
   if(req.user){
    var person = (req.body.phone && req.body.phone !== "") ? {phone: req.body.phone,type:"Patient"} : {user_id: req.user.user_id};
    model.user.findOne(person,
      {
        firstname:1,
        lastname:1,
        title:1,
        profile_pic_url:1,
        city:1,
        country:1,
        name:1,
        age:1,
        prescription_tracking:1,
        medications:1,
        phone:1,
        address:1,
        gender: 1,
      })
    .exec(function(err,user){     
      if(err) throw err;
      if(!user && req.body.phone !== undefined) {
        res.send({
          error: "User not found. Please ensure this person was registered with this "  + req.body.phone + " or user is not a patient."});
        /*user.save(function(err,info){
          if(err) throw err;
        })*/
      } else {
        model.user.findOne({user_id: req.body.user_id},{
        referral:1,diagnostic_center_notification:1,city:1,name:1,country:1,center_phone:1,address:1,user_id:1,presence:1,phone:1})
        .exec(function(err,pharmacy){         
          if(err) throw err;

           var ref_id;

          if(req.body.ref_id){            
            ref_id = req.body.ref_id;
          }  else {        
            ref_id = Math.floor(Math.random() * 9999999);
          }
         
          req.body.patient_profile_pic_url = user.profile_pic_url;
         //req.body.age = user.age;
          var firstname =  user.firstname || user.name;
          req.body.patient_firstname = firstname;
          req.body.patient_lastname = user.lastname;
          req.body.patient_city = user.city;
          req.body.patient_country = user.country;
          req.body.patient_address = user.address;
          req.body.patient_age = user.age;
          req.body.patient_gender = user.gender;
          req.body.patient_address = user.address;
          

          var refObj = {
            ref_id: ref_id,
            referral_firstname: firstname,
            referral_lastname: user.lastname,
            referral_title: user.title,
            referral_id: user.user_id,    
            date: req.body.sent_date,
            pharmacy: req.body
          };

          var pharmacyNotification = {
            sender_firstname: firstname,
            sender_lastname: user.lastname,
            sender_title : user.title,
            sent_date: req.body.sent_date,
            ref_id: ref_id,
            note_id: ref_id,
            sender_profile_pic_url: user.profile_pic_url,
            message: 'Hi, I need your services'
          };

          if(pharmacy.presence === true){
            io.sockets.to(pharmacy.user_id).emit("notification",{status:true})
          } else {
            var msgBody = "Someone needs your services! Visit http://applinic.com/user/pharmacy"
            var phoneNunber =  pharmacy.phone;
            sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
              console.log(responseData);
            }); //"2348096461927"
          }

          
          var preObj = {              
            provisional_diagnosis: req.body.provisional_diagnosis,
            date: req.body.sent_date,
            prescriptionId: req.body.prescriptionId,
            doctor_firstname: firstname,
            doctor_lastname: req.user.lastname,
            doctor_address: req.user.address,   
            doctor_id: req.user.user_id,
            doctor_work_place: req.user.work_place,
            doctor_city: req.user.city,
            doctor_country: req.user.country,
            lab_analysis: req.body.lab_analysis,
            scan_analysis: req.body.scan_analysis,
            Doctor_profile_pic_url: req.user.profile_pic_url,
            patient_id : req.body.patient_id,
            patient_profile_pic_url: req.body.patient_profile_pic_url,
            patient_firstname: req.body.firstname,
            patient_lastname: req.body.lastname,
            patient_address: req.body.address,
            patient_gender: req.body.gender,
            patient_age: req.body.age,
            patient_city: req.body.city,
            patient_country: req.body.country,
            prescription_body: req.body.prescription_body,
            ref_id: ref_id
          }
          
          var track_record = {
            date: req.body.sent_date,
            center_name: pharmacy.name,
            address: pharmacy.address,
            ref_id: ref_id,
            city: pharmacy.city,
            country: pharmacy.country,
            prescriptionId: req.body.prescriptionId
          };

          if(!req.body.ref_id){
            user.medications.push(preObj);
          }
          

          user.prescription_tracking.unshift(track_record); 

          //send sms to the patient for the ntification of prescription
          var msgBody = "Hi, prescriptions written on your behalf was sent to " +  "\n" + pharmacy.name + "\n" + pharmacy.address +
          ", " + pharmacy.city + ", " + pharmacy.country + "\nPrescription reference number is " +
          " " + ref_id + "\nfor more details Visit https://applinic.com/user/patient";
          var phoneNunber =  user.phone;
          sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
            if(err) console.log(err);
            console.log(responseData)
          })


          pharmacy.referral.push(refObj);
          pharmacy.diagnostic_center_notification.push(pharmacyNotification);

          pharmacy.save(function(err,info){
            if(err) throw err;
          });

          user.save(function(err,info){
            if(err) throw err;
            console.log("patient saved")
          });

          res.send({success:true,ref_id: ref_id}); 
        });
           
      }

    });

   } else {
    res.end("Unauthorized access!")
   }
  });


//for lab test search
router.put("/user/laboratory/search/find-tests",function(req,res){
  if(req.user && req.body.city === undefined)
    req.body.city = req.user.city;
  model.services.find({type:"Laboratory",center_city:req.body.city},
    {center_name:1,center_city:1,center_address:1,center_country:1,user_id:1,unavailable_services:1,center_phone:1,_id:0},function(err,data){
    if(err) throw err;
    var newListToSend = [];        
    var sendObj = {};
    var listOfTests = req.body.testList;        
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
      if(filter[k].count === req.body.testList.length) {
        sub['full'].push(filter[k])
      } else {
        var arr1 = req.body.testList;
        var newFilterArr = filter[k].str.split(",");           
        var notFoundArr = arr1.diff(newFilterArr);
        filter[k].notFound = notFoundArr;          
        sub['less'].push(filter[k]);
      }
    }
    res.send(sub)

  });

});

router.put("/user/test-search/laboratory/referral",function(req,res){
    if(req.user){
    var person = (req.body.phone && req.body.phone !== "") ? {phone: req.body.phone} : {user_id: req.user.user_id};
    model.user.findOne(person,{firstname:1,lastname:1,title:1,profile_pic_url:1,city:1,country:1,name:1,age:1,user_id:1})
    .exec(function(err,user){
      if(err) throw err;
        model.user.findOne({user_id: req.body.user_id},{
          diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1,age:1,gender:1})
        .exec(function(err,result){
        var firstname = user.firstname || user.name;
        try{
        var refData = {
          firstname: firstname,
          lastname: user.lastname,
          title: user.title,
          address: user.address,
          city: user.city,
          country: user.country,
          phone: result.phone,
          id: user.user_id
        }

        var refObj = {
          ref_id: req.body.ref_id,
          referral_firstname: firstname,
          referral_lastname: user.lastname,
          referral_title: user.title,
          referral_id: user.user_id,    
          date: req.body.sent_date,            
          laboratory: {
            test_to_run : req.body.test_to_run,
            patient_firstname: user.firstname,
            patient_lastname: user.lastname,
            patient_profile_pic_url: user.profile_pic_url,
            patient_title: user.title,
            patient_phone: user.phone,
            session_id: req.body.session_id,
            patient_id: user.user_id,
            attended: false,
            age: user.age,
            gender: user.gender
          }             
        }

        var refNotification = {
          sender_firstname: firstname,
          sender_lastname: user.lastname,
          sender_title : user.title,
          sent_date: req.body.sent_date,
          ref_id: req.body.ref_id,
          note_id: req.body.ref_id,
          sender_profile_pic_url: user.profile_pic_url,
          message: "Please run the test for me"
        }

        if(result.presence === true){
          io.sockets.to(result.user_id).emit("notification",{status:true})
        } else {
          var msgBody = "You have new test request! Visit http://applinic.com/login"
          var phoneNunber =  result.phone;
          sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){

          }); //"2348096461927"
        }

        
        var refPos = result.referral.map(function(x){return x.ref_id}).indexOf(req.body.ref_id);

        if(refPos === -1){
          result.referral.push(refObj);
          //remember sms will be sent to the patient
          //this populates the patient medical record
          model.user.findOne({user_id: user.user_id},{medical_records: 1,user_id:1}).exec(function(err,record){
            if(err) throw err;     
            var recordObj = {
              test_to_run: req.body.test_to_run,
              center_address: req.body.address,
              center_city: req.body.city,
              center_country: req.body.country,
              center_name: req.body.name,
              center_phone: result.phone,
              center_id: req.body.id,
              patient_id: record.user_id,
              ref_id: req.body.ref_id,
              referral_firstname: firstname,
              referral_lastname: user.lastname,
              referral_title: user.title,
              sent_date: req.body.sent_date,
              session_id: req.body.session_id,
              report: "Pending",
              conclusion: "Pending"
            }
            record.medical_records.laboratory_test.unshift(recordObj);
            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              res.json({success:true,ref_id:req.body.ref_id});
            });

            result.diagnostic_center_notification.push(refNotification);
            result.save(function(err,info){
              if(err) throw err;          
            });
          });        
          
        } else {
           res.json({success:true,ref_id:req.body.ref_id});
        }  
        
    
        user.save(function(err,info){
          if(err) throw err;
          console.log("saved")
        })

       } catch(e){
          console.log(e.message)
        }

      })
   
      
    });

  } else {
    res.end("Unauthorized access")
  }
});

//for scan test search
router.put("/user/radiology/search/find-tests",function(req,res){
  
  if(req.user && req.body.city === undefined)
    req.body.city = req.user.city;
  model.services.find({type:"Radiology",center_city:req.body.city},
    {center_name:1,center_city:1,center_address:1,center_country:1,user_id:1,unavailable_services:1,center_phone:1,_id:0},function(err,data){
    if(err) throw err;
    var newListToSend = [];        
    var sendObj = {};
    var listOfTests = req.body.testList;        
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
          centerInfo.center_id = data[count].user_id;
          centerInfo.center_address = data[count].center_address;
          centerInfo.center_phone = data[count].center_phone;
          centerInfo.testFound = listOfTests[i].name;              
          foundTest.push(centerInfo)               
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
          filter[sendObj[i][j].center_id].country = sendObj[i][j].center_country;
          filter[sendObj[i][j].center_id].id = sendObj[i][j].center_id;
          filter[sendObj[i][j].center_id].phone = sendObj[i][j].center_phone;
          filter[sendObj[i][j].center_id].str = sendObj[i][j].testFound;
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
      if(filter[k].count === req.body.testList.length) {           
        sub['full'].push(filter[k])
      } else {
        var arr1 = req.body.testList;
        var newFilterArr = filter[k].str.split(",");           
        var notFoundArr = arr1.diff(newFilterArr);
        filter[k].notFound = notFoundArr;          
        sub['less'].push(filter[k])
      }
    }

    res.send(sub)

  });

});

router.put("/user/scan-search/radiology/referral",function(req,res){
    if(req.user){
    var person = (req.body.phone && req.body.phone !== "") ? {phone: req.body.phone} : {user_id: req.user.user_id};
    model.user.findOne(person,{firstname:1,lastname:1,title:1,profile_pic_url:1,city:1,country:1,name:1,age:1,user_id:1})
    .exec(function(err,user){
      if(err) throw err;
        model.user.findOne({user_id: req.body.user_id},{
          diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1})
        .exec(function(err,result){         
        var firstname = user.firstname || user.name;
        var refData = {
          firstname: firstname,
          lastname: user.lastname,
          title: user.title,
          address: user.address,
          city: user.city,
          country: user.country,
          phone: result.phone,
          id: user.user_id
        }

        var refObj = {
          ref_id: req.body.ref_id,
          referral_firstname: firstname,
          referral_lastname: user.lastname,
          referral_title: user.title,
          referral_id: user.user_id,    
          date: req.body.sent_date,            
          radiology: {
            test_to_run : req.body.test_to_run,
            patient_firstname: user.firstname,
            patient_lastname: user.lastname,
            patient_profile_pic_url: user.profile_pic_url,
            patient_title: user.title,
            patient_phone: user.phone,
            session_id: req.body.session_id,
            patient_id: user.user_id,
            attended: false
          }             
        }

        var refNotification = {
          sender_firstname: firstname,
          sender_lastname: user.lastname,
          sender_title : user.title,
          sent_date: req.body.sent_date,
          ref_id: req.body.ref_id,
          note_id: req.body.ref_id,
          sender_profile_pic_url: user.profile_pic_url,
          message: "Please run the test for me"
        }

        if(result.presence === true){
          io.sockets.to(result.user_id).emit("notification",{status:true})
        } else {
          var msgBody = "You have new test request! Visit http://applinic.com/login"
          var phoneNunber =  result.phone;
          sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){

          }); //"2348096461927"
        }

        
        var refPos = result.referral.map(function(x){return x.ref_id}).indexOf(req.body.ref_id);

        if(refPos === -1){
          result.referral.push(refObj);
          //remember sms will be sent to the patient
          //this populates the patient medical record
          model.user.findOne({user_id: user.user_id},{medical_records: 1,user_id:1}).exec(function(err,record){
            if(err) throw err;     
            var recordObj = {
              test_to_run: req.body.test_to_run,
              center_address: req.body.address,
              center_city: req.body.city,
              center_country: req.body.country,
              center_name: req.body.name,
              center_phone: result.phone,
              center_id: req.body.id,
              patient_id: record.user_id,
              ref_id: req.body.ref_id,
              referral_firstname: firstname,
              referral_lastname: user.lastname,
              referral_title: user.title,
              sent_date: req.body.sent_date,
              session_id: req.body.session_id,
              report: "Pending",
              conclusion: "Pending"
            }
            record.medical_records.radiology_test.unshift(recordObj);
            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              res.json({success:true,ref_id:req.body.ref_id});
              console.log("send all went well")
            });

            result.diagnostic_center_notification.push(refNotification);
            result.save(function(err,info){
              if(err) throw err;
              console.log("i saved !!!!")            
            });
          });        
          
        } else {
           res.json({success:true,ref_id:req.body.ref_id});
        }        
    
        user.save(function(err,info){
          if(err) throw err;
          console.log("saved")
        })

      })
   
      
    });

  } else {
    res.end("Unauthorized access")
  }
});

/**** courier services logic ****/
router.post("/user/courier",function(req,res){
  if(req.user) {
    console.log("+++++++++++++++++++")
    console.log(req.body.prescription_body)
    var date = + new Date();
    req.body.firstname = req.user.firstname;
    req.body.lastname = req.user.lastname;
    req.body.title = req.user.title;
    req.body.profile_pic_url = req.user.profile_pic_url;
    req.body.user_id = req.user.user_id;
    req.body.date = date;
    req.body.verified = false;
    req.body.attended = false;
    req.body.completed = false;
    //console.log(req.body);
    var courier = new model.courier(req.body);
    courier.save(function(err,info){
      console.log("courier saved!");
      console.log(courier);
      io.sockets.to("couriergroup").emit("receiver courier",req.body);
    });
    res.send({status:true,message:"Sent successfully! Admin will contact you soon for cost and billing."});
  } else {
    res.send("unauthorized access!");
  }
  
});

router.put("/user/courier-update",function(req,res){
  if(req.user){
    if(req.body.prescription_body){
      model.courier.findOne({date: req.body.date}).exec(function(err,user){
        if(user && user.verified !== true) {
          var random1 = Math.floor(Math.random() * 999);
          var random2 = Math.floor(Math.random() * 999);
          var password = check(random1) + " " + check(random2);

          user.verified = true;
          user.total_cost = req.body.total_cost;
          user.otp = password;
          user.attended = true;
          user.verification_date = + new Date();
          user.delivery_charge = 0;
          user.center_id = req.user.user_id;

          var count = 0;
          var presObj = {};
          presObj.details = "";
          var capture;
          /*while(count < req.body.prescription_body.length) {
            capture = req.body.prescription_body[count];
            presObj.details += capture.drug_name + "( " + capture.dosage +  " )" + " ==> " + capture.cost + "\n";
            count++;
          }*/
          var msgBody = "Courier Request status : Acknowledged\nPayment OTP: " + password  +
           "\nTotal: " + req.body.total_cost + "\nSender : " + req.user.name + "\n" + req.user.address + "," + req.user.city + "," + req.user.country;
          var phoneNunber = "+2348064245256"; // "+234" + user.phone1 || "+234" + user.phone2;
        
          sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){
            console.log(err)
            console.log(responseData)
          }); //"2348096461927"

          user.save(function(err,info){});
          res.send({message:"Success! Patient will be notified via sms"})
        } else {
          res.send({message: "Patient has already been verified by another center"})
        }
      });

      function check(num) {
        var toStr = num.toString();  
        if(toStr.length < 3) {
          for( var i = toStr.length - 1; i < 2; i++){
            toStr+= 0;
          }
        } 
        return toStr; 
      }
      
    } else {
      res.send({message: "Can not send empty drug list"})
    }

  } else {
    res.send("unauthorized access!");
  }
});

router.get("/bicboy/:userId/:password",function(req,res){
  model.user.findOne({user_id: req.params.userId,courier_access: true,courier_access_password: req.params.password},function(err,center){
    if(err) throw err;
    if(center) {
      //ths could be modified for centers to run by theselves but for now lets assume field agents are applinic guys.
      model.courier.find({},function(err,data){
        if(err) throw err;
        console.log(data)
        if(data) {
          res.render("field-agent");
        } else {
          res.render("field-agent");
        }
      })
    } else {
      res.send({error: "User not enrolled for courier services. For enquires goto https://applinic.com/courier-services"})
    }
  })
})


router.get("/user/get-courier",function(req,res){
  if(req.user){
    var criteria;
    if(req.query.attended) {
      criteria = {city:req.user.city,attended: true}
    } else {
      criteria = {city:req.user.city,attended:false}
    }
    model.courier.find(criteria,{_id:0},function(err,data){
      res.send(data);
    });
  } else {
    res.send("unauthorized access!")
  }

});

router.get("/user/field-agent",function(req,res){
   model.courier.find({verified: true,completed: false},{_id:0,otp:0,delivery_charge:0},function(err,data){
      res.send(data);
   });
});


  

//log out route
router.get("/user/logout",function(req,res){
    if(req.user){
       model.user.findOne({user_id: req.user.user_id},{presence:1,firstname:1,set_presence:1}).exec(function(err,data){
        data.presence = false;
        data.set_presence.general = false;
        data.save(function(err,info){
          console.log("presence is offline");           
          completeAction()
        });
       }) 
      
    } else {      
      completeAction()
    }

    function completeAction(){
      console.log("finally i am logged out!!!")          
      req.logout();
      res.redirect('/login');
    }
});

/***************For emergency profile *************/

router.get("/patient/EM/profile/:id",function(req,res){
  model.user.findOne({user_id: req.params.id},{_id:0},function(err,result){
    if(err) throw err;
    if(!result) {
      res.sendFile(path.join(__dirname + "/404.html"))
    } else {
      res.render("emergency-profile",{userInfo:result});
    }
  })
  
});

router.put("/patient/get-medical-record/em",function(req,res){ 
console.log(req.body)     
  model.user.findOne({user_id: req.body.patient_id},{medical_records: 1,medications:1},function(err,data){
    console.log(data.medical_records.laboratory_test)
    res.json({medical_records: data.medical_records,prescriptions: data.medications})
    //Note from model, medications holds all prescriptions while medical_records holds all laboratory and radiology tests
    // though there is prescription property on medical_record obj but not used yet.
  });   

});

router.put("/patient/get-prescription/track-record/em",function(req,res){
  model.user.findOne({user_id:req.body.patient_id},{prescription_tracking:1,_id:0},function(err,data){
    console.log(data.prescription_tracking);
    res.send(data.prescription_tracking);
  });
});

/********** All delete route *******/

router.delete("/patient/delete-one",function(req,res){
  var projection = {};
  projection[req.body.dest] = 1;
  var del = new deleteItem(req.body.item,req.user.user_id);
  del.DeleteByUserId(model,projection);
  res.send("deleted");
});


router.delete("/patient/delete-one/appointment",function(req,res){
  var projection = {};
  projection[req.body.dest] = 1;
  var del = new deleteItem(req.body.item,req.user.user_id);
  del.DeleteBySessionId(model,projection);
  res.send("deleted");
});


router.delete("/patient/delete-many",function(req,res){
  console.log(req.body);
  var projection = {};
  projection[req.body.dest] = 1;
  var del = new deleteItem(req.body.item,req.user.user_id);
  del.DeleteAll(model,projection);
  res.send("deleted");
});

router.delete("/user/delete-all-chat",function(req,res){
  var projection = {};
  projection[req.body.dest] = 1;
  var del = new deleteItem(req.body.item);
  del.deleteAllChat(model,projection);
  res.send("deleted");
});


/************ patient waiting room ************/

router.get("/user/patients/waiting-room",function(req,res){
  if(req.user) {
    if(req.user.type === "Doctor"){
      res.render("patient-waiting-room")
    } else {
      res.send('Opps! You are note allowed to view this page')
    }
  } else {
    res.redirect("/login")
  }
  
});

router.get("/user/response/patients-histories/:batch",function(req,res){
  var limit;
  var index;
  switch(req.params.batch){
    case "1":
      limit = 20;
      index = 0;
    break;
    case "2":
      limit = 40;
      index = 20;
    break;
    case "3":
      limit = 60;
      index = 40;
    break;
    case "4":
      limit = 80;
      index = 60;
    break;
    case "5":
      limit = 100;
      index = 80;
    break;
    case "6":
      limit = 120;
      index = 100;
    break;
    case "7":
      limit = 140;
      index = 120;
    break;
    case "8":
      limit = 160;
      index = 140;
    break;
    case "9":
      limit = 180;
      index = 160;
    break;
    case "10":
      limit = 300; //note this should be 200. ie intervals of 20. will be modified later.
      index = 180;
    break;
    default:
    break;
  }
  model.help.find({},function(err,data){
    if(err) throw err;
    var len = data.length;
    var selected = data.slice(index,len);
    res.send(selected);
    
  }).limit(limit);
});

router.post("/user/response/patients-histories",function(req,res){
  if(req.user && req.user.type === "Doctor"){
    model.user.findOne({user_id: req.user.user_id},{firstname:1,profile_pic_url:1,user_id:1,specialty:1,profile_url:1},function(err,data){
      if(err) throw err;
      model.help.findOne({complaint_id: req.body.complaint_id,patient_id:req.body.patient_id},{response:1}).exec(function(err,found){
        req.body.doctor_name = data.firstname;
        req.body.doctor_profile_pic_url = data.profile_pic_url;
        req.body.doctor_profile_url = data.profile_url;
        req.body.doctor_specialty = data.specialty;
        req.body.doctor_user_id = data.user_id;
        var elemPos = found.response.map(function(x){return x.doctor_user_id}).indexOf(data.user_id);
        if(elemPos === -1){          
          model.user.findOne({user_id:req.body.patient_id},
            {patient_mail:1,accepted_doctors:1,firstname:1,lastname:1,user_id:1,phone:1,presence:1}).exec(function(err,patient){           
            if(err) throw err;
            var checkIsMyDoctor = patient.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(data.user_id);
            
            if(checkIsMyDoctor === -1){              
              found.response.push(req.body);
              var date = + new Date();
              var msg = "(" + found.response.length + ") Doctors" + " has responded to your complain.";
              var checkComplain = patient.patient_mail.map(function(x){return x.complaint_id}).indexOf(req.body.complaint_id);
              if(checkComplain !== -1){
                var complain = patient.patient_mail[checkComplain];
                complain.message = msg;
              } else {
                msg = "1 Doctor has responded for the complain ";
                patient.patient_mail.push({
                  category: "need_doctor",
                  date: date,
                  user_id: data.user_id,
                  complaint_id: req.body.complaint_id,
                  message: msg,
                  profile_pic_url: data.profile_pic_url
                });                
              }

              if(patient.presence === true){
                io.sockets.to(patient.user_id).emit("message notification",{status:true})
              } else {
                var msgBody = "A Doctor responded to your history! Visit http://applinic.com/login"
                var phoneNunber =  patient.phone;
                sms.message.sendSms('Applinic',phoneNunber,msgBody,function(err,responseData){

                }); //"2348096461927"
              }
            } else {
              patient.save(function(err,info){})
              var info = "Oops!! The request was not submited.Reason: This history is from your patient.\nPlease contact " + 
              patient.firstname + " " + patient.lastname;
            }
            patient.save(function(err,info){});
            var message = info || "Patient notified";
            res.send({message: message}); 
            found.save(function(err,info){
              console.log("saved successfully");          
            });
          });
          
        } else {
          res.send({error: "You have already responded to this history"});

        }

      });
    });
  } else {
    res.send({error: "Unauthorized access!!!. You are not a doctor."});
  }
});

router.get("/user/patient/get-response",function(req,res){
  if(req.user && req.user.type === "Patient"){
    model.help.findOne({complaint_id: req.query.complaintId},function(err,complain){
      if(err) throw err;
      res.send(complain);
    });
  } else {
    res.send("Unauthorized access!");
  }
})

router.get("/user/get-person-profile/:personId",function(req,res){
  if(req.user){
    model.user.findOne({user_id: req.params.personId},function(err,data){
      if(err) throw err;
      res.send(data);
    })
  } else {
    res.send("Unauthorized access!")
  }
});

router.get("/user/patient/get-my-doctors",function(req,res){
  if(req.user) {   
    model.user.find({"doctor_patients_list.patient_id": req.user.user_id,type:"Doctor"},
      {
        user_id:1,
        firstname:1,
        lastname:1,
        profile_pic_url:1,
        specialty:1,
        office_hour:1,
        _id:0,
        presence:1

    },function(err,data){
      if(err) throw err;
      var sendList = [];
      var dataLen = data.length;
      var count = 0;
      model.user.findOne({user_id:req.user.user_id},{accepted_doctors:1},function(err,list){
        while(dataLen > count){
          var elementPos = list.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(data[count].user_id)
            // service_access is used to check duration of consultation fees
            //if consultation has lasted beyond certian period service access will be set to false from the admin therefore patient will not see 
            //the doctor in his dashboard.
            if(data[count].presence === true){             
              list.accepted_doctors[elementPos].presence = true;
              sendList.push(list.accepted_doctors[elementPos]);
            } else {
              sendList.push(list.accepted_doctors[elementPos]);
            }
          
          count++
        }       
        res.send(sendList);
      });      
    });
  } else {
    res.send("Unauthorized access!")
  }
});
/***************  will be modified as above ************/
 //this route get all the doctor's patients to include which patient is online or not.
 router.get("/user/doctor/my-online-patients",function(req,res){
    if(req.user){
      model.user.find({"accepted_doctors.doctor_id":req.user.user_id,type:"Patient"},
        {user_id:1,_id:0,firstname:1,lastname:1,presence:1,profile_pic_url:1},function(err,data){
        if(err) throw err;
        var sendList = [];
        var dataLen = data.length;
        var count = 0;
        model.user.findOne({user_id:req.user.user_id},{doctor_patients_list:1},function(err,list){
          while(dataLen > count){
            var elementPos = list.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(data[count].user_id)
              
              if(data[count].presence === true){             
                list.doctor_patients_list[elementPos].presence = true;
                sendList.push(list.doctor_patients_list[elementPos]);
              } 
            
            count++
          } 
          res.send(sendList);
        });
      })
    } else {
      res.end("Unauthorized access!!")
    }
  }); 

  //this route gets all doctors accepted patient. just for other ourposes wihich may no include whether use is presence or not at first.

  router.get("/user/doctor/my-patients",function(req,res){
    if(req.user){
      model.user.findOne({"accepted_doctors.doctor_id":req.user.user_id},{doctor_patients_list:1,_id:0},function(err,data){
        if(err) throw err;
        res.send(data);
      });
    } else {
      res.end("Unauthorized access!!")
    }
  });

//this route gets all patients accepted doctors. just for other ourposes wihich may no include whether use is presence or not at first.
  router.get("/user/patient/my-doctors",function(req,res){
    if(req.user){
      model.user.findOne({email: req.user.email},{accepted_doctors:1,_id:0},function(err,data){
        if(err) throw err;
        res.send(data);
      });
    } else {
      res.end("Unauthorized access!!!");
    }
  });

 

/*
{ doctor_id: '161792665',
  date_of_acceptance: '1493908992172',
  doctor_firstname: 'Ani',
  doctor_lastname: 'Emeka',
  doctor_profile_pic_url: '/download/profile_pic/39e81110c0ed5fb9acefbd2402734
b',
  service_access: 'true',
  doctor_specialty: 'Aerospace Medicine',
  _id: 590b3e1707b36d582b4340ab,
  office_hour: [] },
*/

/** this route gets all the request sent by patient for a doctor. The response is an object with properties like
doctor_notification, doctor_prescriptionRequest,doctor_mail,inPerson_appointment, chat_request,video_call_request,audio_call_request.
this route will be called with set time interval to update the doctor's dashboard of any request sent buy a patient.***/
router.get("/user/doctor/:userId/get-all-request",function(req,res){
 
  if(req.user){
    model.user.findOne({user_id: req.params.userId},{doctor_notification:1,_id:0,doctor_prescriptionRequest:1},function(err,data){
      if(err) throw err;
      res.send(data);
    })
  } else {
    res.send("Unauthorized access!")
  }
});

//this route adds user to the array of converstion presence
/*router.put("/user/conversation-availability",function(req,res){
 if(req.user){
  
   model.communication.findOne({},{ongoing_conversation:1}).exec(function(err,data){
    if(err) throw err;

    if(!data) {
      var conversation = new model.communication({
        ongoing_conversation: []
      });

      conversation.ongoing_conversation.push({
        timeStamp: req.body.time,
        user_id:req.body.userId
      });

      conversation.save(function(err,info){
        console.log("saved");
      });

     } else {      
      var checkPresence = data.ongoing_conversation.map(function(x){return x.user_id}).indexOf(req.body.userId);
      if(checkPresence === -1) {
        data.ongoing_conversation.push({
          timeStamp: req.body.time,
          userId:req.body.userId
        });
        
      } 

      data.save(function(err,info){
        console.log("saved")
        res.send({status: "joined"});
      });
      
     }
     
   });

 } else {
  res.send("Unauthorized access!!!");
 }
});*/


//this route checks to see if doctor is logged in or in conversation array before any communication session is established.
router.get("/user/:id/communication-request",function(req,res){
  if(req.user){
  
    model.user.findOne({user_id: req.params.id},{presence:1,_id:0},function(err,user){
      if(err) throw err;
      
      res.send(user);
    });    
  } else {
    res.send("Unauthorized access");
  }
});

//this route actually saves the patient object to the doctors_notification
//note req.param.id refers to the id of the doctor in this case who the patient wish to communicate to.
router.post("/user/:id/communication-request",function(req,res){
  if(req.user){

    model.communication.findOne({},{ongoing_conversation:1},function(err,conversation){
      if(err) throw err;    
      var checkUser = conversation.ongoing_conversation.map(function(x){return x.userId}).indexOf(req.params.id);
      
      model.user.findOne({user_id: req.params.id},{presence:1,doctor_notification:1,watch_list:1,lastname:1}).exec(function(err,user){
        if(err) throw err;
        if(checkUser === -1) {
          user.doctor_notification.unshift(req.body);
          var url = "/user/get-response/" + req.body.sender_id;     
          res.send({checkUrl: url,free:trues});
        } else {
          console.log("see user");
          console.log(user);
          user.watch_list.push({
            sender_firstname: req.body.sender_firstname,
            sender_lastname: req.body.sender_lastname,
            sender_profile_pic_url: req.body.sender_profile_pic_url,
            sender_id: req.body.sender_id
          });
          var url = "/user/get-response/" + req.body.sender_id;     
          var resMsg = user.lastname + " is currently attending to a patient. You have joined the queue."
          res.send({status: "Busy",message: resMsg,checkUrl: url});
        }
        user.save(function(err,info){
          if(err) throw err;
          console.log("saved")
        });    
      });
      
    });
  } else {
    res.send("Unauthorized access");
  }
});

//this route gets the response to the response
//@params id refers to the id of the initiator of request
router.get("/user/get-response/:id",function(req,res){ 
  if(req.user){
    
    emitter.on(req.params.id,function(data){
      res.send(data);
    });
    //res.send({obi: "save me"})
  } else {
    res.send("Unauthorized access!!!");
  }
});

//this route takes care of doctors response whether to conversate with patient by a giving time.
//@ id refers to the id of the initiator of request. just thesame with emitter.on method id above
router.put("/user/feedback",function(req,res){
  if(req.user){
    emitter.emit(req.body.id,req.body);
    //res.send({success: true});
  } else {
    res.send("Unauthorized access!!!");
  }
});

//this route sets user presence to be online or offline
//Note by default presence is set to true ie online whenever user logs in.
router.put("/user/set-presence",function(req,res){
  if(req.user){
    model.user.findOne({user_id: req.user.user_id},{presence:1}).exec(function(err,data){
      if(err) throw err;
      switch(req.query.status){
        case "Busy":
          data.presence = false;
        break;
        case "offline":
          data.presence = false;
        break;
        case "online":
          data.presence = true;
        break
        default:
        break;
      }
      data.save(function(err,info){
        console.log("presence saved.")
      });
    });    
  } else {
    res.send("Unauthorized access")
  }
});

// for admin
router.get('/user/getAllPatients',function(req,res){
  if(req.user){
    model.user.find({type:"Patient"},function(err,data){
      res.send({count:data.length});
    })
  } else {
    res.redirect("/login")
  }
});

router.get('/user/getAllDoctor',function(req,res){
  if(req.user){
    model.user.find({type:"Doctor"},function(err,data){
      res.send({count:data.length});
    })
  } else {
    res.redirect("/login")
  }
});

router.get('/user/getAllPharmarcy',function(req,res){
  if(req.user){
    model.user.find({type:"Pharmacy"},function(err,data){
      res.send({count:data.length});
    })
  } else {
    res.redirect("/login")
  }
});

router.get('/user/getAllLaboratory',function(req,res){
  if(req.user){
    model.user.find({type:"Laboratory"},function(err,data){
      res.send({count:data.length});
    })
  } else {
    res.redirect("/login")
  }
});

router.get('/user/getAllRadiology',function(req,res){
  if(req.user){
    model.user.find({type:"Radiology"},function(err,data){
      res.send({count:data.length});
    })
  } else {
    res.redirect("/login")
  }
});

router.get("/user/rating/:id",function(req,res){
  if(req.user){
    model.user.findOne({user_id:req.params.id},{rating:1,_id:0},function(err,user){
      res.send(user.rating)
    })
  } else {
    res.send("Unauthorized access!")
  }
});



router.get("/user/center-profile/:id",function(req,res){
  if(req.user){
    model.user.findOne({user_id: req.params.id},{name:1,rating:1,address:1,city:1,country:1,_id:0,phone:1,profile_pic_url:1},function(err,data){
      if(err) throw err;
      res.send(data);
    })
  } else {
    res.send("unauthorized access")
  }
});


router.put("/user/rating/:id",function(req,res){
  if(req.user){
    model.user.findOne({user_id: req.params.id},{rating:1}).exec(function(err,user){
      if(err) throw err;
      user.rating.votes = req.body.score;
      var val = user.rating.votes;
      var newRate;

      if(val !== 2 ) {
        var getRate = Math.floor( val / 20);
        if(getRate === 1)
          newRate = 1
        if(getRate === 2)
          newRate = 2
        if(getRate === 3)
          newRate = 3
        if(getRate === 4)
          newRate = 4
        if(getRate >= 5)
          newRate = 5
      }

      user.rating.current = newRate;

      user.save(function(){});
    });

  } else {

    res.send("unauthorized access");

  }
})

}

module.exports = basicRoute;
/*console.log(req.body);
            console.log(req.files);
            var ima = req.files[0].path;
            var readable = fs.createReadStream(__dirname + "/" + ima);
          var writable = fs.createWriteStream(__dirname + '/public/images/dashboard/profile.jpg');
            readable.on('data',function(chunk){ 
            writable.write(chunk);
          });

            ///uploaded no image file just for it to be in the server.
            
            var no_profile_pic = new model.files({
                filename: req.files[0].filename,
                path: req.files[0].path,
                file_id: "nopic"
            });

            no_profile_pic.save(function(err){
                if(err) throw err;
                console.log("file saved");
            })*/