'use strict';
var path = require('path');
var https = require('https');
var route = require('./config');
var router = route.router;
var fs = require("fs");
var dateTime = require("node-datetime");
var deleteItem = require("./delete");
var EventEmmiter = require("events");
var emitter = new EventEmmiter();
var uuid = require("uuid");
var moment = require('moment');
var salt = require('./salt');
var Voice = require('twilio').twiml.VoiceResponse;
var mongoose = require("mongoose");
var options = {
  host: "global.xirsys.net",
  path: "/_turn/www.applinic.com",
  method: "PUT",
  headers: {
      "Authorization": Buffer.from("gcamon:406b470c-2ddf-11e8-9c83-538c56484774", 'base64') //"Basic " +  Buffer("gcamon:406b470c-2ddf-11e8-9c83-538c56484774").toString("base64")
  }
};

//var token = require("./twilio");
var randos = require("./randos");
//var topdf = require("./topdf");
var pdf = require('html-pdf');



function createNewsLink(title){
  var str = "";
  if(title) {
    var spt = title.split(" ");
    for(var i = 0; i < spt.length; i++){
      str += spt[i] + "-";
    }
  }

  var tm = str.slice(0, -1)

  
  return tm;
}

function createVoiceText(title){
  var str = "";
  if(title) {
    var toStr = title.toString();
    var spt = toStr.split("");
    for(var i = 0; i < spt.length; i++){
      str += spt[i] + " ,, ";
    }
  }

  var tm = str.slice(0, -3)

  
  return tm;
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

console.log(createVoiceText(2345))

function genHash(count) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

    for( var i=0; i < count; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

var basicRoute = function (model,sms,io,streams,client,nodemailer) { 

  var transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    auth: {
      user: "info@applinic.com",
      pass: process.env.EMAIL_PASSWORD
    }
  })

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
      res.render("doctor",{"person":req.user});
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
        //skills: 1,
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
        model.skills.find({user_id: req.user.user_id,deleted:false},function(err,result){
          if(err) throw err;     
          data.skills = result;
          res.send(data)
        });        
      });
    } else {
      res.redirect("/login");
    }
  });

 
  //user requesting login page.
  router.get('/login',function(req,res){
    res.render("login",{"message":""})
  });

  //user request sign up page
  router.get("/signup",function(req,res){
    res.render("sign-up",{type: req.query.type || null,id: req.query.id});
  });

  router.get('/terms',function(req,res){
    res.render('terms');
  });

  router.get('/privacy',function(req,res){
    res.render("privacy");
  });

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
      var ticket = "#" + randos.genRef(8);
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

    var mailOptions = {
      from: 'Applinic info@applinic.com',
      to: "info@applinic.com",
      subject: 'Message from ' + req.body.names,
      html: '<table><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' 
      + ",</b><br><br>"
      + req.body.message
      + "<br><br>Sender details: <br>" 
      + "Name: " + req.body.names
      + "<br>Email: " + req.body.email
      + "<br>Phone: " + req.body.phone
      + "<br><br>"
      + "Please attend.<br></br>"
      + "</td></tr></table>"
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.json({status: false})
      } else {
        console.log('Email sent: ' + info.response);
        res.json({status: true});
      }
    });
   
    res.send({status:"success"})
  })

  router.get("/download/profile_pic/:pic_id", function(req,res){        
    if(req.params.pic_id === "nopic") {    
                    
      var nopic = __dirname + "/uploads/nopic.jpg"
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

  router.get("/report/:filename",function(req,res){
    var file = __dirname + "/pdf/" + req.params.filename;
    res.download(file); // Set disposition and send it.
  });

  router.get("/chat-files/:filename",function(req,res){
    var file = __dirname + "/uploads/" + req.params.filename;
    res.download(file); // Set disposition and send it.
  });


  router.get("/user/cam/:userId/:controlId",function(req,res){
    if(req.user){ //check to see if the param exist in database
      model.user.findOne({user_id:req.params.userId},function(err,data){
        if(err) throw err;
        if(data) {
          if(req.user.type === "Doctor"){
            res.render("video-chat",{"person":{controlId: req.params.controlId}});
          } else {
            res.render("video-chat2",{"person":{controlId: req.params.controlId}});
          }
        } else {
          res.end("Error 404: resource not found!");
        }
      });   
      
    } else {
      res.redirect("/login");
    }
  });

  /*router.get("/user/cam/:controlId",function(req,res){
    if(req.user){ //check to see if the param exist in database
      if(req.user.type === "Doctor"){
        res.render("video-chat",{"person":{controlId: req.params.controlId}});
      } else {
        res.render("video-chat2",{"person":{controlId: req.params.controlId}});
      }
      
    } else {
      res.redirect("/login");
    }
  });*/

  router.get("/user/getInvitee",function(req,res){
    if(req.user) {
      var criteria;
      var str;
      switch(req.query.type) {
        case "Doctor":
          str = new RegExp(req.query.name.replace(/\s+/g,"\\s+"), "gi");         
          criteria = {$or: [{ name : { $regex: str, $options: 'i' },type:"Doctor"},{firstname: { $regex: str, $options: 'i' },type:"Doctor" }]};
        break;
        case "Patient":
          str = new RegExp(req.query.name.replace(/\s+/g,"\\s+"), "gi");              
          //criteria = { firstname : { $regex: str, $options: 'i' },type:"Patient"};
          criteria = {$or: [{ lastname : { $regex: str, $options: 'i' },type:"Patient"},{firstname: { $regex: str, $options: 'i' },type: "Patient"}]};
        break;
        default:
          str = new RegExp(req.query.name.replace(/\s+/g,"\\s+"), "gi");              
          criteria = { name : { $regex: str, $options: 'i' }};
        break;
      }

      model.user.find(criteria,{name:1,presence:1,firstname:1,lastname:1,specialty:1,work_place:1,_id:0,profile_pic_url:1,address:1,city:1,country:1,user_id:1},
        function(err,list){
        if(err) throw err;
        res.json(list);
      })
    } else {
      res.end("unauthorized access!");
    }
  })

  /*router.get("/user/iceservers-list",function() {
    if(req.user) {
    var httpreq = https.request(options, function(httpres) {
      var str = "";

      httpres.on("data", function(data){
       str += data; 
       res.json(str);
      });

      httpres.on("error", function(e){ console.log("error: ",e); });

      httpres.on("end", function(){ 
          console.log("ICE List: ", str);
      });
    });

    httpreq.end();
 
    } else {
      res.end("Unauthorized access!!")
    }
  })*/

   router.get('/user/streams.json/:controlId',function(req,res){
    if(req.user) {
      streams.getStreamToControl(req.params.controlId,model,function(streamList){
        var data = (JSON.parse(JSON.stringify(streamList)));   
        res.status(200).json(data);
      });//streams.getStreams(); 
    } else {
      res.end({error: "Must login to access streams"})
    }    
     
  });

   router.get("/user/chat-test",function(req,res){
     res.render('chat2');
   })


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //handles all change picture 
  router.put("/user/update/profile-pic",function(req,res){   
    if(req.user && req.files){
     
      var path = req.files[0].location || "/download/profile_pic/" + req.files[0].filename;

      if(req.files.length > 0 && req.files[0].mimetype === "image/jpg" || req.files[0].mimetype === "image/jpeg" || req.files[0].mimetype === "image/png") {
          model.user.update({user_id: req.user.user_id},{$set : {
          "profile_pic.filename": req.files[0].filename,
          "profile_pic.path":  req.files[0].path,
          "profile_pic.mimetype":  req.files[0].mimetype,
          "profile_pic.encoding":  req.files[0].encoding,
          "profile_pic.size":  req.files[0].size,
          "profile_pic.destination":  req.files[0].destination,
          "profile_pic.fieldname":  req.files[0].fieldname,
          "profile_pic.originalname":  req.files[0].originalname,
          profile_pic_url: path
          }},function(err,info){        
          if(err) throw err;
          console.log(info) 
          //var pic = "/download/profile_pic/"  + req.files[0].filename;   
          res.send({profile_pic_url: path});               
          });
      } else {
          res.send({error: "Picture does not meet specifications"});
      }
    } else {
      res.end("Unauthorized access!")
    }
  });


  router.get("/skill/:id/:title",function(req,res){
    model.skills.findOne({skill_id: req.params.id,deleted: false},function(err,data){
      if(err) throw err;
      if(data){        
        model.skills.find({specialty:data.specialty,deleted: false},function(err,result){
          if(err) throw err;
          res.render("skills",{skill:data,related: result});
        }).limit(20)
      } else {
        res.send({error: "OOps, this skill was not found!"})
      }
    })
  });


  router.get("/user/get-skills",function(req,res){
    if(!req.query.id)
      model.skills.find({deleted: false},function(err,data){
        res.json(data)
      }).limit(500);
    else 
      model.skills.find({deleted: false,user_id:req.query.id},function(err,data){
        if(err) throw err;
        res.json(data)
      })
  })

  router.put("/user/skill/comments",function(req,res){
    if(req.user) {
      model.skills.findById(req.body.id)
      .exec(function(err,skill){
        skill.comments.push({
          name: (req.user.name) ? req.user.name : req.user.title + " " + req.user.firstname,
          userId: req.user.user_id,
          date: + new Date(),
          article: req.body.message,
          messageId: genHash(7)
        });

        skill.save(function(err,inf){
          console.log("comment saved")
        })
      });
      res.json({status: true,message: "Your comment was sent successfully!"});
    } else {
      res.json({status: false, message: "You cannot comment on the post."})
    }
    
  })



  //doctors profile update route
  router.put("/user/update",function(req,res){
    if(req.user){
      if(req.body.type == "procedure"){
        var random = genHash(10);
        var titledLink = createNewsLink(req.body.skill);
        var description = req.body.description;

        var newSkill = new model.skills({
          user_id: req.user.user_id,
          name: req.user.name,
          work_place: req.user.work_place,
          city: req.user.city,
          country: req.user.country,
          profile_pic_url: req.user.profile_pic_url,
          profile_url: req.user.profile_url,
          specialty: req.user.specialty,
          date: + new Date(),
          comments: [],
          skill_id: random,
          disease: req.body.disease,
          skill: req.body.skill,
          procedure_description: description,
          ref_url: "https://" + req.hostname + "/skill/" + random + "/" + titledLink,
          path: "/skill/" + random + "/" + titledLink,
          like: 0,
          dislike: 0,
          views: 0,
          deleted: false
        })


        if(req.files){
          var fileUrl;
          for(var i = 0; i < req.files.length; i++){
            fileUrl = req.files[i].location || "/download/skills/" + req.files[i].filename; // this will be change to link dropbox;
            var file = {
              type: req.files[i].mimetype,
              filename: req.files[i].filename,
              path: fileUrl,
              file_id: random,
              external_link: req.files[i].location || "https://" + req.hostname + "/download/skills/" + req.files[i].filename
            }
            newSkill.files.push(file);
          }
        }

  
        newSkill.save(function(err,info){
          if(err) throw err;
          res.json({status:"success"});
          console.log("skill saved!");
          io.sockets.to(req.user.user_id).emit("uploaded skill",newSkill);
        })
        

        /*model.user.findOne({user_id: req.user.user_id},{skills:1}).exec(function(err,data){
          if(err) throw err;
          var random = randos.genRef(8);
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
        })    */    
      } else if(req.body.type == "form"){
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
                  city:1,
                  specialty:1
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
                            result.specialty += "," + arr[i].sub_specialty;
                            req.body.specialty = result.specialty;
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
           
            if(record) {
              var genPin = randos.genRef(6);
             
              var testPhone = new model.verifyPhone({
                phone: req.body.phone,
                pin: genPin
              });

            
              var date = new Date()
              testPhone.expirationDate = new Date(date.getTime() + 300000);
              testPhone.expirationDate.expires  = 60 * 60;

              testPhone.save(function(err,info){});

              model.authCheck.remove({pin:req.body.pin},function(){})


              var msgBody = "Your SMS verification Pin is " + genPin + "\nUse to complete your registeration."
              var phoneNunber =  req.body.phone;
              
              sms.messages.create(
                {
                  to: phoneNunber,
                  from: '+16467985692',
                  body: msgBody,
                },
                callBack
              ) 


            } else {
              res.send({status:"failed",message:"Oops! Seems you entered incorrect verification pin or has been used."})
            }

            function callBack(err,response){              
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
      delObj.specialty = 1;

      if(req.body.field == "skills"){
        model.skills.findById(req.body.item_id)
        .exec(function(err,data){
          if(err) throw err;
          console.log(data)
          if(data) {
            data.deleted = true;
            data.save(function(err,info){
              if(err) throw err;
              console.log("skill deleted!")
              res.send({status:"success"})
            })
          } else {
            res.send({status:"error"})
          }
        })
      } else {
        model.user.findOne({user_id:req.user.user_id},delObj).exec(function(err,data){
          if(err) throw err;        
          var record = data[req.body.field];
          
          var recPos = record.map(function(x){var tostr = x._id.toString(); return tostr}).indexOf(req.body.item_id);
         

          if(recPos !== -1){
            if(req.body.field === "sub_specialty"){
              var str = "," + record[recPos].sub_specialty;
              data.specialty = data.specialty.replace(str, '');
            }
            var removed = record.splice(recPos,1);
          } else {
            console.log("record not found");
          }
         
          data.save(function(err,info){
            res.send({status:"success",specialty: data.specialty})
          });
          
        })
      }
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

  /*router.get("/assets", function (req,res,next) {
      res.send('css');
      res.send('js');
      res.send('images');
      next();
  });*/
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
   /* router.get("/ranking/views/:id",function(req,res){

      model.user.findOne({user_id: req.params.id},function(err,user){            
        if(err) throw err;
        res.render("doctor-details",{"userInfo":user});
      });
     
    });*/

   router.get("/user/profile/view/:id",function(req,res){    
      model.user.findOne({user_id: req.params.id},function(err,user){            
        if(err) throw err;
        if(user) {
          if(user.type == 'Doctor'){
            res.render("doctor-details",{"userInfo":user});
          } else if(user.type !== "Patient"){
            res.render("user-details",{"userInfo":user});
          } else {
            res.end("Patients has no profile");
          }
          
        } else {
          res.end("Person profile not found!");
        }
       
      })
  });

    
  router.get("/user/patient/find-doctor",function(req,res){
      if(req.user){
        var criteria;
        var str;

        switch(req.query.type){
          case "doctorname":
            var docName = (req.query.name) ? req.query.name : "";
            var str = new RegExp(docName.replace(/\s+/g,"\\s+"), "gi");  
            var criteria;
            if(req.query.city) {
              ///var criteria = {name: req.query.name,city:req.query.city};
              criteria = {$or: [{ name : { $regex: str, $options: 'i' },type:"Doctor", city: req.query.city },
              {firstname: { $regex: str, $options: 'i' },type:"Doctor",city: req.query.city }]};                         
            } else {
              criteria = {$or: [{ name : { $regex: str, $options: 'i' },type:"Doctor"},
              {firstname: { $regex: str, $options: 'i' },type:"Doctor" }]};            
            }

            model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
              specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name: 1,profile_url:1,office_hour:1},
              function(err,data){
              if(err) {        
                res.send({error:"status 500",full:[]});
                return;
              } else {  

                res.json(data);
                
                /*if(data.length == 0){
                  var criteria = (req.query.city) ? {name: { $regex: str, $options: 'i' },type:"Doctor",city: req.query.city} : 
                  {name: { $regex: str, $options: 'i' },type:"Doctor"};

                  model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
                  specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,profile_url:1,office_hour:1},
                  function(err,data2){
                    if(err) throw err;
                    res.json(data2);
                    return;
                  })
                } */                
              }
            });
            
          break;
          case "specialty" :
            var first5 = req.query.specialty.substring(0,5)
            var str = new RegExp(first5.replace(/\s+/g,"\\s+"), "gi");              
            /*if(req.query.city) {
              var criteria = {$text : {$search : req.query.specialty},city:req.query.city}
            } else {
              var criteria = {$text : {$search : req.query.specialty}}
            }*/

            if(req.query.city) {
              var criteria = {$text : {$search : first5},city:req.query.city}
            } else {
              var criteria = {$text : {$search : first5}}
            }


            model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
              specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name: 1,profile_url:1,office_hour:1},
              function(err,data){
              if(err) {        
                res.send([]);
              } else {   
                if(data.length == 0){
                  var criteria = (req.query.city) ? {specialty: { $regex: str, $options: 'i' },type:"Doctor",city: req.query.city} : 
                  {specialty: { $regex: str, $options: 'i' },type:"Doctor"};

                  model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
                  specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,profile_url:1,office_hour:1},
                  function(err,data2){
                    if(err) throw err;
                    res.json(data2);
                  })
                } else {
                  res.json(data);
                }   
                
              }
            });
          break;
          case "doctorId":
            var criteria = {user_id: req.query.user_id}
            model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
              specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,profile_url:1,office_hour:1},function(err,data){
                if(err) throw err;
                res.json(data);
            });
          break;

          case "disease":
            var str = new RegExp(req.query.disease.replace(/\s+/g,"\\s+"), "gi");
            if(req.query.city) {            
              var criteria = { $or: [{ "skills.skill" : { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city},
              {"skills.disease": { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city}]};
            } else {
              var criteria = { $or: [{ "skills.skill" : { $regex: str, $options: 'i' },type:"Doctor"},
              {"skills.disease": { $regex: str, $options: 'i' },type:"Doctor"}]};
            }
            //var byDisease = {"skills.disease": { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city};
            model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
            specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,profile_url:1,office_hour:1},function(err,data){
              if(err) {
                res.send({error:"status 500",full:[]});
              } else {
                if(data.length == 0){
                  var first4 = req.query.disease.substring(0,4);
                  str = new RegExp(first4.replace(/\s+/g,"\\s+"), "gi");  
                  var criteria = (req.query.city) ? { "skills.disease" : { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city} : 
                  { "skills.disease" : { $regex: str, $options: 'i' },type:"Doctor"}

                  model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
                  specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,skills:1,profile_url:1,office_hour:1},
                  function(err,data2){
                    if(err) throw err;
                    res.json(data2);
                  })
                } else {
                  res.json(data);
                }   
              }
            });
          break;
          case "special-center":
            var first5 = req.query.item.substring(0,5);
            var str = new RegExp(first5.replace(/\s+/g,"\\s+"), "gi");               
           // var criteria = { "skills.disease" : { $regex: str, $options: 'i' },type:"Doctor",title:"SC",city:req.query.city};
            /*var criteria = { $or: [{disease_tag : { $regex: str, $options: 'i' },type:"Doctor",title:"SC",city:req.query.city},
            {specialty : { $regex: str, $options: 'i' },type:"Doctor",title:"SC",city:req.query.city}]};*/

            
            if(req.query.city){
              var criteria = { name : { $regex: str, $options: 'i' },type:"Doctor", city: req.query.city};
            } else {
              var criteria = { name : { $regex: str, $options: 'i' },type:"Doctor"};
            }
            

            model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
            specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,profile_url:1,office_hour:1},
            function(err,data){
              if(err) {
                res.send({error:"status 500",full:[]});
              } else {
                  if(data.length == 0){
                  var first5 = req.query.item.substring(0,5);
                  str = new RegExp(first5.replace(/\s+/g,"\\s+"), "gi");  
                  /*var criteria = (req.query.city) ? { disease_tag : { $regex: str, $options: 'i'},type:"Doctor",title:"SC",city:req.query.city} : 
                  { disease_tag : { $regex: str, $options: 'i' },type:"Doctor",title:"SC"};*/

                  if(req.query.city){
                    var criteria = { specialty : { $regex: str, $options: 'i' },type:"Doctor", city: req.query.city};
                  } else {
                    var criteria = { specialty : { $regex: str, $options: 'i' },type:"Doctor"};
                  }

                  model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
                    specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,skills:1,profile_url:1,office_hour:1},
                    function(err,data2){
                      if(err) throw err;
                      res.json(data2);
                  })
                } else {
                  res.json(data);
                }   
              }
            });
          break;
          case "skill": 
            var str = new RegExp(req.query.skill.replace(/\s+/g,"\\s+"), "gi");              
            // var criteria = { "skills.disease" : { $regex: str, $options: 'i' },type:"Doctor",title:"SC",city:req.query.city};
            var criteria = { $or: [{disease : { $regex: str, $options: 'i' },type:"Doctor"},
            {skill : { $regex: str, $options: 'i' },type:"Doctor"}]};
            model.skills.find(criteria,function(err,data){
              if(err) {
                res.send({error:"status 500",full:[]});
              } else {
                if(data.length == 0){
                  var first4 = req.query.skill.substring(0,5);
                  str = new RegExp(first4.replace(/\s+/g,"\\s+"), "gi");  
                  var criteria = { procedure_description : { $regex: str, $options: 'i' },type:"Doctor"};
                  model.skills.find(criteria,
                    function(err,data2){
                      if(err) throw err;
                      res.json(data2);
                  })
                } else {
                  res.json(data);
                }   
              }
            });
          break;
          default:
            criteria = {
              type: "Doctor"
            };

            if(req.query.city){
              var c = new RegExp(req.query.city.replace(/\s+/g,"\\s+"), "gi");
              criteria['city'] = { $regex: c, $options: 'i' };
            } 

            if(req.query.specialty) {
              var s = new RegExp(req.query.specialty.replace(/\s+/g,"\\s+"), "gi");
              criteria['specialty'] = { $regex: s, $options: 'i' };
            } 

            if(req.query.doctorname) {
              var d = new RegExp(req.query.doctorname.replace(/\s+/g,"\\s+"), "gi");
              criteria['name'] = { $regex: d, $options: 'i' };
            } 

            model.user.find(criteria,{user_id:1,firstname:1,title:1,
              work_place:1,profile_pic_url:1,address:1,lastname:1,profile_url:1,specialty:1,city:1,country:1,verified:1})
            .limit(500)
            .exec(function(err,data){
              if(err) throw err;
              res.json(data);
            })
          break;
        }
       
      } else {
        res.send("Unauthorized access!")
      }
    })
  

    //dcotor refering patient to another doctor from doctor's dashboard
    router.get("/user/find-specialist",function(req,res){     
      if(req.user) {
       /* req.query.type = "Doctor";     
        model.user.find(req.query,{profile_pic_url:1, 
          firstname: 1,title: 1,lastname:1,user_id:1,_id:0,work_place:1,address:1,city:1,country:1,phone:1,specialty:1},function(err,list){
            if(err) throw err;
            res.json(list)
        })*/
        var first4 = req.query.specialty.substring(0,4);
        var str = new RegExp(first4.replace(/\s+/g,"\\s+"), "gi");              
        if(req.query.city) {
          var criteria = {$text : {$search : req.query.specialty},city:req.query.city}
        } else {
          var criteria = {$text : {$search : req.query.specialty}}
        }

        model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
          specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name: 1,profile_url:1},
          function(err,data){
          if(err) {        
            res.send([]);
          } else {   
            if(data.length == 0){
              var criteria = (req.query.city) ? {specialty: { $regex: str, $options: 'i' },type:"Doctor",city: req.query.city} : 
              {specialty: { $regex: str, $options: 'i' },type:"Doctor"};

              model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
              specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,profile_url:1},
              function(err,data2){
                if(err) throw err;
                res.json(data2);
              })
            } else {
              res.json(data);
            }  
          }
        });

      } else {
        res.end("unauthorized access!");
      }
    });

    router.put("/user/find-specialist",function(req,res){     
      if(req.user) {
        console.log(req.body);

        if(req.body.isLaterRef) {
          var pos = req.user.doctor_patients_list.map(function(x){if(x){return x.patient_id}}).indexOf(req.body.sender_id)
          if(pos !== -1 && !req.body.message) {
            req.body.message = req.user.doctor_patients_list[pos].initial_complaint.complaint;
          }

          if(pos !== -1)
            req.body.files = req.user.doctor_patients_list[pos].initial_complaint.files;
          
        }
        
        var requestData = {};
        for(var item in req.body){
          if(req.body.hasOwnProperty(item) && item !== "receiverId") {
              requestData[item] = req.body[item];
          }
        }

        if(requestData._id)
          delete requestData._id;

      
        model.user.findOne({user_id:req.body.receiverId},{doctor_notification:1,presence:1,
          set_presence:1,phone:1,title:1,firstname:1,lastname:1,email:1,user_id:1,city:1,country:1,specialty:1})
        .exec(function(err,data){
          if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });

          } else if(data) {

            data.doctor_notification.push(requestData);

            if(data.presence === true && data.set_presence.general === true && req.body.type === "consultation"){           
              io.sockets.to(req.body.receiverId).emit("receive consultation request",{status: "success"});

            } //else if(req.body.type === "consultation" && data.set_presence.general === false || data.presence === false) {

          
            //}

          var msgBody = req.user.title + " " + req.user.firstname + " " + req.user.lastname + 
          " sent a consultation request! visit https://applinic.com/user/doctor to attend.";

          var phoneNunber = data.phone;   
          
          sms.messages.create(
            {
              to: phoneNunber || "",
              from: '+16467985692',
              body: msgBody,
            }
          )
          .then(
            function(call){
              console.log(call);
            },
            function(err) {
              console.log(err)
            }
          );

          sms.calls 
          .create({
            url: "https://applinic.com/voicenotification?firstname=" + data.lastname + "&&title=" + data.title,
            to: phoneNunber || "",
            from: '+16467985692',
          })
          .then(
            function(call){
              console.log(call.sid);
            },
            function(err) {
              console.log(err)
            }
          );

          //} else if(data.presence  && data.set_presence.general  && req.body.type === "question"){  
          if(data.presence  && data.set_presence.general  && req.body.type === "question") {      
            io.sockets.to(req.body.receiverId).emit("receive consultation request",{status: "success",type:"question"});
          }


          model.user.findOne({user_id: req.body.sender_id},{title:1,email:1,phone:1})
          .exec(function(err,patient){
            if(err) throw err;
            if(patient) {
              var consult = new model.consult({
                patient_name: patient.title + " " + req.body.sender_firstname + " " + req.body.sender_lastname,
                doctor_name: data.title + " " + data.firstname,
                id: requestData.message_id,
                date: + new Date(),
                doctor_phone: data.phone,
                doctor_email: data.email,
                doctor_id: data.user_id,
                patient_phone: patient.phone,
                patient_email: patient.email,
                patient_id: req.body.sender_id,
                doctor_specialty: data.specialty,
                patient_city: req.body.sender_location,
                doctor_city: data.city,
                message: req.body.message,
                files: (req.body.files) ? req.body.files : null
              });

              consult.save(function(err,info){});       

              /*var transporter = nodemailer.createTransport({
                host: "mail.privateemail.com",
                port: 465,
                auth: {
                  user: "info@applinic.com",
                  pass: process.env.EMAIL_PASSWORD
                }
              });*/

              var mailOptions = {
                from: 'Applinic info@applinic.com',
                to: data.email,//'ede.obinna27@gmail.com',//data.email
                subject: 'Consultation Request from a Patient',
                html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b> Dear ' + data.title + " " + data.firstname + 
                ",</b><br><br> You received a consultation request from a patient.<br><br>" 
                + req.body.sender_title + " " + req.body.sender_lastname + " " + req.body.sender_firstname
                + " has just submitted a consultation request to you on Applinic<br><br>"
                + "Please click the link below to sign in to respond to her request.<br><br>"
                + "URL: https://applinic.com/user/doctor <br><br>"
                + "When you log in, click the notification message icon on top of your dashboard to see the request.<br>" 
                + "Select the message to open, review and respond to the request.<br><br>"
                + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone." 
                + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
                + "For inquiries please call customer support on +2349080045678<br><br>"
                + "Thank you for using Applinic<br><br>"
                + "<b>Applinic Team</b></td></tr></table>"

              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

              patient.save(function(err,info){})
            }
          });

          data.save(function(err,info){});
          res.send({status:"notified"});
          } else {
            res.end("error 404 occured!")
          }
        });
      } else {
        res.end("unauthorized access!")
      }

    });


    router.get("/user/skills-procedures",function(req,res){
      if(req.user){

        /*model.skills.find({skill: req.query.item},function(err,data){
          if(err) throw err;
          res.send(data)
        });*/
         if(req.query.item) {
           var str = new RegExp(req.query.item.replace(/\s+/g,"\\s+"), "gi");  

            if(req.query.city) {            
              var criteria = { $or: [{ skill : { $regex: str, $options: 'i' },city:req.query.city,deleted:false},
              {disease: { $regex: str, $options: 'i' },city:req.query.city,deleted:false}]};
            } else {
              var criteria = { $or: [{ skill : { $regex: str, $options: 'i' },deleted: false},
              {disease: { $regex: str, $options: 'i' },deleted:false}]};
            }
            //var byDisease = {"skills.disease": { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city};
            model.skills.find(criteria,function(err,data){
              if(err) {
                res.send({error:"status 500",full:[]});
              } else {
                if(data.length == 0){
                  var first4 = req.query.item.substring(0,5)
                  str = new RegExp(first4.replace(/\s+/g,"\\s+"), "gi");  
                  var criteria = (req.query.city) ? { skill : { $regex: str, $options: 'i' },deleted:false,city:req.query.city} : 
                  { skill : { $regex: str, $options: 'i' },deleted:false}

                  model.skills.find(criteria,
                  function(err,data2){
                    if(err) throw err;
                    res.json(data2);
                  })
                } else {
                  res.json(data);
                }   
              }
            });
          } else {
            model.skills.find({deleted: false})
            .limit(500)
            .exec(function(err,data){
              if(err) throw err;
              res.send(data)
            })
            
          }
       /* model.user.find({type:"Doctor"},{skills:1,_id:0},function(err,data){
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
        }).limit(1000)*/
      } else {
        res.send("Unauthorized access");
      }
    });

    router.get("/user/get-profile-data",function(req,res){
     
        model.user.findOne({user_id: req.query.userId},{
          _id:0,
          phone:1,
          country:1,
          city:1,
          age: 1,
          gender:1,
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
          introductory:1,
          awards:1,
          education:1,
          office_hour:1,
        },function(err,data){
          if(err) throw err;
          if(data){
            model.skills.find({user_id: data.user_id,deleted:false},function(err,result){
              data.skills = result;
              res.send(data);
            })
          } else {
            res.send([]);          
          }
        });
      
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
    router.post("/user/patient/doctor/connection",function(req,res){
      if(req.user){    
       
        req.body.sender_firstname = req.user.firstname;
        req.body.sender_lastname = req.user.lastname;
        req.body.sender_profile_pic_url = req.user.profile_pic_url;
        req.body.message = req.body.history;
        req.body.sender_id = req.user.user_id;
        req.body.sender_age = req.user.age;
        req.body.sender_gender = req.user.gender;
        req.body.sender_location = req.user.city + " " + req.user.country;
        var random = genHash(10);
        if(req.files){
          req.body.files = [];
          var fileUrl;
          for(var i = 0; i < req.files.length; i++){
            fileUrl = req.files[i].location || "/download/skills/" + req.files[i].filename; // this will be change to link dropbox;
            var file = {
              type: req.files[i].mimetype,
              filename: req.files[i].filename,
              path: fileUrl,
              file_id: random,
              external_link: req.files[i].location || "https://" + req.hostname + "/download/skills/" + req.files[i].filename
            }
            req.body.files.push(file);
          }

        }
      
        //loop below was giving errors therefore commented

        /*for(var key in req.body){
          console.log(key)
          if(req.body.hasOwnProperty(key) && key !== "receiverId") {
              requestData[key] = req.body[key];
          }
        }*/

        model.user.findOne({user_id:req.body.receiverId},
          {doctor_notification:1,presence:1,set_presence:1,phone:1,firstname:1,title:1,
            user_id:1,email:1,specialty:1,city:1,country:1})
        .exec(function(err,data){
          if(err) throw err;

          delete req.body.receiverId;

          var requestData = req.body;

          data.doctor_notification.push(requestData);

          req.body.receiverId = data.user_id;


          var msgBody = req.user.title + " " + req.user.firstname + " " + req.user.lastname + 
          " sent a consultation request! visit https://applinic.com/user/doctor to attend.";

          var phoneNunber = data.phone;   
          
          sms.messages.create(
            {
              to: phoneNunber || "",
              from: '+16467985692',
              body: msgBody,
            }
          );

          sms.calls 
          .create({
            url: "https://applinic.com/voicenotification?firstname=" + data.firstname + "&&title=" + data.title,
            to: phoneNunber,
            from: '+16467985692',
          })
          .then(
            function(call){
              console.log(call.sid);
            },
            function(err) {
              console.log(err)
            }
          );

          //} else if(data.presence  && data.set_presence.general  && req.body.type === "question"){  
          if(data.presence  && data.set_presence.general  && req.body.type === "question") {      
            io.sockets.to(req.body.receiverId).emit("receive consultation request",{status: "success",type:"question"});
          }

          var consult = new model.consult({
            patient_name: req.user.title + " " + req.user.firstname + " " + req.user.lastname,
            doctor_name: data.title + " " + data.firstname,
            id: requestData.message_id,
            date: + new Date(),
            doctor_phone: data.phone,
            doctor_email: data.email,
            doctor_id: data.user_id,
            patient_phone: req.user.phone,
            patient_email: req.user.email,
            patient_id: req.user.user_id,
            doctor_specialty: data.specialty,
            patient_city: req.user.city,
            doctor_city: data.city,
            message: req.body.history,
            files: (req.body.files) ? req.body.files : null
          });

          consult.save(function(err,info){
            if(req.body.type === "consultation"){           
              io.sockets.to(req.body.receiverId).emit("receive consultation request",{status: "success"});
            }
          });       

          /*var transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            auth: {
              user: "info@applinic.com",
              pass: process.env.EMAIL_PASSWORD
            }
          });*/

          var mailOptions = {
            from: 'Applinic info@applinic.com',
            to: data.email,//'ede.obinna27@gmail.com',//data.email
            subject: 'Consultation Request from a Patient',
            html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b> Dear ' + data.title + " " + data.firstname + 
            ",</b><br><br> You received a consultation request from a patient.<br><br>" 
            + req.user.title + " " + req.user.firstname + " " + req.user.lastname 
            + " has just submitted a consultation request to you on Applinic<br><br>"
            + "Please click the link below to sign in to respond to her request.<br><br>"
            + "URL: https://applinic.com/user/doctor <br><br>"
            + "When you log in, click the notification message icon on top of your dashboard to see the request.<br>" 
            + "Select the message to open, review and respond to the request.<br><br>"
            + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone." 
            + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
            + "For inquiries please call customer support on +2349080045678<br><br>"
            + "Thank you for using Applinic<br><br>"
            + "<b>Applinic Team</b></td></tr></table>"

          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          data.save(function(err,info){});
          res.send({status:"notified"});
        });
      
      } else {
        res.redirect("/login");
      }
        
    });

    router.post("/user/admin/redirect-consultation",function(req,res){
      if(req.user) {
        if(req.user.type === "admin") {
          console.log(req.body)
          model.user.findOne({user_id: req.body.patient_id}).exec(function(err,patient){
            req.user = patient;        
            var requestData = {
              sender_firstname: req.user.firstname,
              sender_lastname : req.user.lastname,
              sender_profile_pic_url : req.user.profile_pic_url,
              message : req.body.message,
              sender_id : req.user.user_id,
              sender_age : req.user.age,
              sender_gender: req.user.gender,
              sender_location : req.user.city + " " + req.user.country,
              type: 'consultation',
              message_id: req.body.id,
              date: + new Date(),
            };
            /*for(var item in req.body){
              if(req.body.hasOwnProperty(item) && item !== "receiverId") {
                  requestData[item] = req.body[item];
              }
            }*/
            
            model.user.findOne({user_id:req.body.newDoctor},
              {doctor_notification:1,presence:1,set_presence:1,phone:1,firstname:1,title:1,user_id:1,email:1,specialty:1,city:1,country:1,name:1})
            .exec(function(err,data){
              if(err) throw err;
              if(data) {
              data.doctor_notification.push(requestData);

           //else if(req.body.type === "consultation" && !data.set_presence.general || !data.presence) {

              var msgBody = req.user.title + " " + req.user.firstname + " " + req.user.lastname + 
              " sent a consultation request! Go to https://applinic.com/user/doctor and check your mail";

              var phoneNunber = data.phone;   

             

              sms.messages.create(
                {
                  to: phoneNunber || "",
                  from: '+16467985692',
                  body: msgBody,
                }
              );

              sms.calls 
              .create({
                url: "https://applinic.com/voicenotification?firstname=" + data.firstname + "&&title=" + data.title,
                to: phoneNunber || "",
                from: '+16467985692',
              })
              .then(
                function(call){
                  console.log(call.sid);
                },
                function(err) {
                  console.log(err)
                }
              );

              //} else if(data.presence  && data.set_presence.general  && req.body.type === "question"){   
              if(data.presence  && data.set_presence.general  && req.body.type === "question") {     
                io.sockets.to(req.body.receiverId).emit("receive consultation request",{status: "success",type:"question"});
              }


              model.consult.findById(req.body._id)
                .exec(function(err,con){
                  if(err) {
                    throw err;
                    //res.send({})
                    return;
                  }

                  if(con){
                    con.redirect_info = {
                      date: new Date(),
                      id: requestData.message_id,
                      doctor: data.name,
                      specialty: data.specialty,
                      doctorId: data.user_id,
                      city: data.city
                    }
                    con.save(function(err,info){
                      if(req.body.type === "consultation"){           
                        io.sockets.to(req.body.receiverId).emit("receive consultation request",{status: "success"});
                      } 
                    });
                  } 
                })

                var consult = new model.consult({
                  patient_name: req.user.title + " " + req.user.firstname + " " + req.user.lastname,
                  doctor_name: data.title + " " + data.firstname,
                  id: requestData.message_id,
                  date: + new Date(),
                  doctor_phone: data.phone,
                  doctor_email: data.email,
                  doctor_id: data.user_id,
                  patient_phone: req.user.phone,
                  patient_email: req.user.email,
                  patient_id: req.user.user_id,
                  doctor_specialty: data.specialty,
                  patient_city: req.user.city,
                  doctor_city: data.city,
                  message: req.body.message,
                  files: (req.body.files) ? req.body.files : null
                });

                consult.save(function(err,info){
                  if(err) throw err;
                  if(req.body.type === "consultation"){           
                    io.sockets.to(req.body.receiverId).emit("receive consultation request",{status: "success"});
                  } 
                });       

              /*var transporter = nodemailer.createTransport({
                host: "mail.privateemail.com",
                port: 465,
                auth: {
                  user: "info@applinic.com",
                  pass: process.env.EMAIL_PASSWORD
                }
              });*/

              var mailOptions = {
                from: 'Applinic info@applinic.com',
                to: data.email,//'ede.obinna27@gmail.com',//data.email
                subject: 'Consultation Request from a Patient',
                html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b> Dear ' + data.title + " " + data.firstname + 
                ",</b><br><br> You received a consultation request from a patient.<br><br>" 
                + req.user.title + " " + req.user.firstname + " " + req.user.lastname 
                + " has just submitted a consultation request to you on Applinic<br><br>"
                + "Please click the link below to sign in to respond to her request.<br><br>"
                + "URL: https://applinic.com/user/doctor <br><br>"
                + "When you log in, click the notification message icon on top of your dashboard to see the request.<br>" 
                + "Select the message to open, review and respond to the request.<br><br>"
                + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone." 
                + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
                + "For inquiries please call customer support on +2349080045678<br><br>"
                + "Thank you for using Applinic<br><br>"
                + "<b>Applinic Team</b></td></tr></table>"

              };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

                data.save(function(err,info){});
                res.send({status:true,message: "Redirect successful."});
              } else {
                res.send({Error: "Doctor not found!"})
              }
            });

          });
          } else {
            res.send({Error: "403"})
          }
      } else {
        res.end("unauthorized access!")
      }
    })

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
            req.body.type = "consultation";
            var requestData = {};
            
         
            model.user.findOne({user_id:req.params.docId},{doctor_notification:1,presence:1,set_presence:1,phone:1,firstname:1,title:1}).exec(function(err,data){
              if(err) throw err;

              data.doctor_notification.push(req.body);

              if(data.presence === true && data.set_presence.general === true && req.body.type === "consultation"){           
                io.sockets.to(req.params.docId).emit("receive consultation request",{status: "success"});

              } else if(req.body.type === "consultation" && data.set_presence.general === false || data.presence === false) {
                var msgBody = req.user.title + " " + req.user.firstname + " " + req.user.lastname + " sends consultation request! Visit http://applinic.com/login";
                var phoneNunber =  data.phone;            
                sms.messages.create(
                  {
                    to: phoneNunber,
                    from: '+16467985692',
                    body: msgBody,
                  }
                ) 

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
                    presence:1,
                    title:1,
                    lastname:1,
                    email:1

                }
            )
            .exec(
                function(err, result){                    
                    if(err) throw err;
                    if(result) {
                      var date = + new Date();
                      req.body.service_access = true;
                      var random = randos.genRef(8); // use for check on the front end to distinguish messages sent.
                        result.patient_mail.push({
                        message_id: (req.body.originalComp) ? req.body.originalComp.message_id : random.toString(),
                        user_id: req.user.user_id,
                        firstname: req.user.firstname,
                        lastname: req.user.lastname,
                        title: req.user.title,
                        message: "Consultation request accepted!",
                        date: req.body.date,
                        consultation_fee: req.body.consultation_fee,
                        service_access: req.body.service_access,
                        profile_pic_url: req.user.profile_pic_url,
                        profile_url: req.user.profile_url,
                        specialty: req.user.specialty,
                        original_complaint: (req.body.originalComp) ? req.body.originalComp.message : null,
                        original_complaint_date : (req.body.originalComp) ? req.body.originalComp.date : null,
                        response: req.body.response
                      });

                      if(result.presence){
                        io.sockets.to(result.user_id).emit("message notification",{status:true})
                      } //else {

                      var msgBody = req.user.title + " " + req.user.firstname + " " + req.user.lastname +
                       " accepted your consultation request! Go to dashboard https://applinic.com/user/patient for more details";
                      var phoneNunber =  result.phone;                  

                      sms.messages.create(
                        {
                          to: phoneNunber,
                          from: '+16467985692',
                          body: msgBody,
                        }
                      );
                    
                      sms.calls 
                      .create({
                        url: "https://applinic.com/voicenotification?firstname=" + req.user.lastname + "&&title=" + req.user.title,
                        to: phoneNunber || "",
                        from: '+16467985692',
                      })
                      .then(
                        function(call){
                          console.log(call.sid);
                        },
                        function(err) {
                          console.log(err);
                        }
                      )

                      /*var transporter = nodemailer.createTransport({
                        host: "mail.privateemail.com",
                        port: 465,
                        auth: {
                          user: "info@applinic.com",
                          pass: process.env.EMAIL_PASSWORD
                        }
                      });*/

                      var mailOptions = {
                        from: 'Applinic info@applinic.com',
                        to: result.email,//result.email,//req.body.email || 'ede.obinna27@gmail.com',
                        subject: 'Response to Your Consultation Request',
                        html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Dear ' + result.lastname + ",</b><br><br>" 
                        + req.user.title + " " + req.user.lastname 
                        + "has accepted your consultation request. Click the link below to log in and see his response.<br><br>"
                        + "URL: https://applinic.com/user/patient<br><br>"
                        + "Thank you for using Applinic.<br><br>"
                        + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone." 
                        + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
                        + "For inquiries please call customer support on +2349080045678<br><br>"
                        + "Thank you for using Applinic.<br></br><br>"
                        + "<b>Applinic Team</b></td></tr></table>"
                      };

                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });

                      result.save(function(err){
                        if(err) throw err;                    
                        res.json({status: true});
                      });

                    } else {
                      res.send({status: false});
                    }
                }
            )

            
        } else {
           res.send("not allowed");
        }
    });

    router.put("/user/admin/patient-mail",function(req,res){

    });

    router.put("/user/doctor/decline-request",function(req,res){
      if(req.user) {

       var random = randos.genRef(8);
        model.user.findOne({user_id: req.body.sender_id},{patient_mail:1})
        .exec(function(err,patient){
          if(err) throw err;
          if(patient) {
            patient.patient_mail.push({
              message : "Consultation request rejected!",
              message_id: random.toString(),
              user_id: req.user.user_id,
              firstname: req.user.firstname,
              lastname: req.user.lastname,
              title: req.user.title,
              date: req.body.date, 
              reason: req.body.reason,
              profile_pic_url: req.user.profile_pic_url              
            });

            patient.save(function(err,info){
              updateDoctor()
            });
            
          } else {
            res.send({message: "Patient does not exist!"})
          }
        });

        function updateDoctor() {
          model.user.findOne({user_id:req.user.user_id},{doctor_notification: 1}).exec(function(err,user){
            if(err) throw err;
            var elemPos = user.doctor_notification.map(function(x){return x.message_id}).indexOf(req.body.message_id);
            
            if (elemPos !== -1) {
              user.doctor_notification.splice(elemPos,1);
            }

            user.save(function(err,info){
              console.log("request deleted")
            })

            res.json({status: true})

          })
        }

        
      } else {
        res.end("unauthorized accesss!")
      }
    });


    router.get("/user/get-doctors-names",function(req,res){      
      model.user.find({type:"Doctor"},{name:1,_id:0})
      .limit(500)
      .sort('name')
      .exec(function(err,data){
        if(err) throw err;
        res.json(data);
      });
     
    });

    router.get("/user/get-specialties",function(req,res){      
      model.user.find({type:"Doctor"},{specialty:1,skills:1})
      .limit(500)
      .sort('specialty')
      .exec(function(err,data){
        if(err) throw err;
        res.json(data);
      });
     
    });

    router.get("/user/get-diseases",function(req,res){      
      model.skills.find({},{specialty:1,disease:1})
      .limit(500)
      .exec(function(err,data){
        if(err) throw err;
        res.json(data);
      });
     
    });


    router.get("/user/get-specialcenters",function(req,res){      
      model.user.find({title: "SC", type: "Doctor"},{name:1,firstname:1,user_id:1,specialty:1,disease:1},
        function(err,data){
        if(err) throw err;
        res.json(data);
      });
      
    })



    //this router gets all the patient medical records and prescriptions and send it to the front end as soon as the patient logs in. 
    //the data is sent as json and the controller that receives it on the front end is "patientPanelController" .
    router.get("/user/get-medical-record",function(req,res){
      if(req.user) {
        var criteria = (req.user.type !== "Patient") ? {user_id: req.query.patientId} : {user_id: req.user.user_id};

        model.user.findOne(criteria,{medical_records:1,medications:1,medical_reports:1,record_access:1},function(err,data){
          if(err) throw err;
          if(data) {
            if(req.user.type !== "Patient") {
              var accessList = data.record_access;
              var elementPos = accessList.map(function(x) {return x.userId}).indexOf(req.user.user_id);
              if(elementPos !== -1) {
                res.json(
                  {
                    medical_records: data.medical_records,
                    prescriptions: data.medications,
                    reports: data.medical_reports,
                    status: true
                  }
                )
              } else {
                if(req.user.type === "Doctor") {
                  var presArr = [];
                  var invArr = [];

                  //for prescription only when doctor wish to view previous prescriptions he had given to patient
                  for(var j = 0; j < data.medications.length; j++){
                    if(data.medications[j].doctor_id === req.user.user_id){
                      presArr.push(data.medications[j]);
                    }
                  }

                  /* todo the medical record is sent to doctor on video call session without being filtered for the only the doctor referred */
                 
                  /*for(var i = 0; i < data.medical_records.length; i++){
                    if(data.medical_records[i].referral_id === req.user.user_id){
                      invArr.push(data.medical_records[i]);
                    }
                  }*/
                  
                  res.json(
                     {                      
                      prescriptions: presArr,
                      status: false,
                      medical_records: data.medical_records,
                      reports: []
                    }
                  );

                } else {
                  res.send({
                    message: "You have no permission to view this patient's full medical records.",
                    status: false,
                    medical_records: [],
                    prescriptions: [],
                    reports: []
                  });
                }
              }
            } else {    
              res.json(
                {
                  medical_records: data.medical_records,
                  prescriptions: data.medications,
                  reports: data.medical_reports,
                  record_access: data.record_access
                }
              )
            }
          //Note from model, medications holds all prescriptions while medical_records holds all laboratory and radiology tests
          // though there is prescription property on medical_record obj but not used yet. 
          } else {
            res.end("user not found")
          }        
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

    //gets center details for profile edit
    router.get("/user/getcenter-details",function(req,res){
      if(req.user){
        model.user.findOne({user_id: req.user.user_id},{name:1,address:1,city:1,country:1,email:1},function(err,center){
          if(err){
            throw err;
            res.end("error")
          } else {
            res.send(center);
          }
        });
      } else {
        res.end("unauthorized access!")
      }
    });

    router.put("/user/getcenter-details",function(req,res){
      if(req.user){
        model.user.updateOne({user_id: req.user.user_id},{$set:req.body},function(err,info){
          if(err) throw err;
          if(info){
            res.send({status:true});
            model.services.updateOne({user_id:req.user.user_id},{$set:{
              center_city: req.body.city,
              center_name: req.body.name,
              center_address: req.body.address,
              center_country: req.body.country,
              center_email: req.body.email
            }},function(err,info){})
          } else {
            res.send({status: false})
          }
        });
        
      } else {
        res.end("unauthorized access");
      }
    })

    router.put("/user/center/get-notification",function(req,res){
      if(req.user){
        model.user.findOne({user_id:req.user.user_id},{diagnostic_center_notification:1}).exec(function(err,result){
          if(err) throw err;
          var elem = result.diagnostic_center_notification.map(function(x){return x.ref_id}).indexOf(req.body.refId)
          result.diagnostic_center_notification[elem].viewed = true;
          result.save(function(){});
          res.send({updated:true})
        })
        
      } else {
        res.end("unauthorized access")
      }
    })

    //this route gets the individual prescription for a patient 
    router.get("/user/pharmacy/get-referral",function(req,res){
      if(req.user){
        var toNum = req.query.refId;
        model.referral.findOne({center_id:req.user.user_id,ref_id: toNum},function(err,found){
          if(err) throw err;          
          //var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(toNum);
          //var found = data.referral[elemPos]
          res.send(found);
        });
      } else {
        res.send("unauthorized access!")
      }
    })
    //this route gets all referral for a pharmacy.
    router.put("/user/pharmacy/get-referral",function(req,res){
      if(req.user){
        model.referral.find({center_id:req.user.user_id},function(err,data){
          if(err) throw err;
          if(data) {
            var list = [];
            var filter = {};
            var toStr;
            for(var i = 0; i < req.body.length; i++){
              toStr = req.body[i].ref_id.toString();
              if(!filter.hasOwnProperty(toStr)){
                var elemPos = data.map(function(x){return x.ref_id}).indexOf(req.body[i].ref_id);
                var found = data[elemPos];
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
    
    router.get("/user/doctor/specific-patient",function(req,res){
      
      if(req.user){   
        var patientId = req.query.id || null;     
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
            presence:1,
            title:1,
            phone:1,
            email:1

        }

        model.user.findOne({ user_id: patientId},projection,function(err,data){
            if(err) throw err;
            if(data) {
              res.send(data);
            } else {
              res.send({error:"patient Not found"});
            }
            
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
        /*model.user.findOne({user_id:req.user.user_id},{prescription_tracking:1,_id:0},function(err,data){
          console.log(data.prescription_tracking);
          res.send(data.prescription_tracking);
        })*/
        res.json(req.user.prescription_tracking);
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
              presence:1,
              phone:1,
              type:1,
              name: 1
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
        var param = (req.query.city) ? req.query.city : req.user.city;
        var str = new RegExp(param.replace(/\s+/g,"\\s+"), "gi");
        var criteria = {type:"Pharmacy",city:{ $regex: str, $options: 'i' }};
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
            courier_access:1
        }

        model.user.find(criteria,projection,function(err,data){ //remenber to replace "Enugu" with req.user.city
          if(err) throw err;
          res.send(data);
        }).limit(500);

      } else {
        res.end("Unauthorized access!");
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
            type: 1,
            phone:1
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
              ref_id = randos.genRef(6);
            }

            var title = (req.user.type === "Doctor") ? 'Dr.': "";            
            var refObj = {
              ref_id: ref_id,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: title,
              referral_id: req.body.id,    
              date: date,
              referral_id: req.user.user_id,
              referral_email: req.user.email,
              referral_phone: req.user.phone,
              center_id: req.body.user_id,
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

            //pharmacy.referral.push(refObj);

            pharmacy.diagnostic_center_notification.unshift(pharmacyNotification);

            if(pharmacy.presence === true){
              io.sockets.to(req.body.user_id).emit("center notification",pharmacyNotification);
            }

            pharmacy.save(function(err,info){
              if(err) throw err;              
            });

            var referral = new model.referral(refObj)
            referral.save(function(err,info){
              if(err) throw err;
             
              var msgBody = "Your prescription was sent to " +  "\n" + pharmacy.name + "\n" + pharmacy.address +
              ", " + pharmacy.city + ", " + pharmacy.country + "\nreference number is " +
              " " + ref_id + "\nfor more details login https://applinic.com/login";
              var phoneNunber = req.user.phone;

              sms.messages.create(
                {
                  to: phoneNunber,
                  from: '+16467985692',
                  body: msgBody,
                }
              );              

              console.log("referral saved");
            })

            res.send({success:true,ref_id: ref_id}); 
          });

      } else {
        res.end("Unauthorized access. You need to log in");
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
            var note_id = randos.genRef(8);
            var title = (req.user.type === "Doctor") ? req.user.title : req.user.name;            
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
            pharmacy.diagnostic_center_notification.unshift(pharmacyNotification);
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
          console.log(req.body)
            var date = new Date();

            var ref_id;
            if(req.body.ref_id) {
              ref_id = req.body.ref_id;
            } else {
              ref_id = randos.genRef(6);
            }

            req.body.prescriptionId = randos.genRef(12);
            var reqId = randos.genRef(7);

            var courier;

            if(req.body.courierObj){
              var firstname = (req.body.referral_pays == 'Yes') ? req.user.firstname : req.body.firstname;
              var lastname = (req.body.referral_pays == 'Yes') ? req.user.lastname : req.body.lastname;
              var title = (req.body.referral_pays == 'Yes') ? req.user.title : req.body.title;
              var pic = (req.body.referral_pays == 'Yes') ? req.user.profile_pic_url : req.body.patient_profile_pic_url;
              var userId = (req.body.referral_pays == 'Yes') ? req.user.user_id : req.body.patient_id;
              var optMsg = (req.body.referral_pays == 'Yes') ? "The doctor chose the option to pay the bill." : "";
              var courierData = {
                request_id: reqId,
                verified: false,
                firstname: firstname,
                address: req.body.courierObj.address,
                ref_id: ref_id,
                prescription_body: req.body.prescriptionBody,
                city: (req.body.referral_pays == 'Yes') ? req.user.city : req.body.city,
                phone1: req.body.courierObj.phone1,
                phone2: req.body.phone,
                lastname: lastname,
                title: title,
                attended: false,
                profile_pic_url: pic,
                user_id: userId,
                center_id: req.body.user_id,
                center_name: req.body.center_name,
                center_address: req.body.center_address,
                center_phone: req.body.center_phone,
                center_email: req.body.center_email,
                center_city: req.body.center_city,
                date: date, //use date to find refers to date the request was made or initiated
                deleted: false,
                prescriptionId: req.body.prescriptionId,
                is_paid: false,
                new: 0
              }

              courier = new model.courier(courierData);

              courier.save(function(err,info){
                if(err) throw err;

                io.sockets.to(req.body.center_id).emit("receiver courier",courierData);

                var msgBody = "A new home delivery of drug(s) request just came in. Please log in and compute the cost for payment. " 
                + "\nRef No is " + ref_id +
                "\nDelivery process will be initiated when the receiver had paid the bill." +
                "\nGo to your account https://applinic.com/login";

                sms.messages.create(
                  {
                    to: req.body.center_phone,
                    from: '+16467985692',
                    body: msgBody,
                  }
                )
                .then(
                  function(call){
                    console.log(call.sid);
                  },
                  function(err) {
                    console.log(err)
                  }
                )

                io.sockets.to(req.body.user_id).emit("center notification",{isNewDrug:true});


                var mailOptions = {
                  from: 'Applinic info@applinic.com',
                  to: 'info@applinic.com',
                  subject: 'New Courier Request Order!',
                  html: '<table><tr></th></tr><tr><td>'
                  + "Sender Name: " + req.user.name + "<br><br>"
                  + "Sender Address: " + req.user.address + "<br><br>"
                  + "Sender City: " + req.user.city + "<br><br>"
                  + "Sender Phone: " + req.user.phone + "<br><br>"
                  + "Ref No: " + ref_id +  "<br><br>"
                  + "Order ID: <b>" + reqId +  "</b><br><br>"
                  + "Dispatch Center: " + req.body.center_name + "<br><br>"
                  + "Dispatch Address: " + req.body.center_address + " " + req.body.center_city + "<br><br>"                  
                  + "Dispatch Center Phone: " + req.body.center_phone + "<br><br>"
                  + "<b>Please note this courier request was made through doctor's e-treatment interface for a patient below:</b><br><br>"
                  + "Patient name: " + req.body.title + " " + req.body.firstname + " " + req.body.lastname + "<br><br>"
                  + "Patient ID: " + req.body.patient_id + "<br><br>" 
                  + "Patient Phone: " + req.body.phone + "<br><br><span style='color: green;font-style:italic'>"
                  + optMsg + "</span><br>"   
                  + "</td></tr></table>"
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

              });

            }

            var preObj = {              
              provisional_diagnosis: req.body.provisional_diagnosis,
              explanation: req.body.explanation,
              date: date,
              prescriptionId: req.body.prescriptionId,
              title: req.user.title,
              doctor_specialty: req.user.specialty,
              doctor_profile_url: req.user.profile_url,
              doctor_firstname: req.user.firstname || req.user.name,
              doctor_lastname: req.user.lastname,
              doctor_address: req.user.address,
              doctor_verified: req.user.verified,   
              doctor_id: req.user.user_id,
              doctor_work_place: req.user.work_place,
              doctor_city: req.user.city,
              doctor_country: req.user.country,
              lab_analysis: req.body.lab_analysis,
              scan_analysis: req.body.scan_analysis,
              doctor_profile_pic_url: req.user.profile_pic_url,
              patient_id : req.body.patient_id,
              patient_profile_pic_url: req.body.patient_profile_pic_url,
              patient_firstname: req.body.firstname,
              patient_lastname: req.body.lastname,
              patient_address: req.body.address,
              patient_gender: req.body.gender,
              patient_age: req.body.age,
              patient_city: req.body.city,
              patient_country: req.body.country,
              is_paid: false,
              detail: {
                amount: 0,
                date: null
              },
              prescription_body: req.body.prescriptionBody,
              ref_id: ref_id,
              eligible: true
            }

            var title = (req.user.type === "Doctor") ? req.user.title : ""; 
            var verifyId;
            
            var refObj = {
              ref_id: ref_id,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: title,
              referral_id: req.user.user_id, 
              referral_email: req.user.email,
              referral_phone: req.user.phone,  
              deleted: false, 
              referral_pays: req.body.referral_pays, 
              date: date,
              center_id: req.body.user_id,
              pharmacy: preObj
            }

            if(req.body.courierObj){
              refObj.isCourierType = true;
              refObj.courierId = courier._id;
            }

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
            presence:1,
            phone: 1

          }).exec(function(err,pharmacy){          
            if(err) throw err;
            if(pharmacy){           
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
              
              pharmacy.diagnostic_center_notification.unshift(pharmacyNotification);

              if(pharmacy.presence === true){
                io.sockets.to(req.body.user_id).emit("center notification",pharmacyNotification);
              }

              savePatient(pharmacy);

            } else {
              res.send({error: "Unknown error Occured"})
            }
        });

        function savePatient(pharmacy) {
            model.user.findOne(
              {user_id: req.body.patient_id},
              {patient_notification:1,firstname:1,lastname:1,prescription_tracking:1,
                medications:1,phone:1,user_id:1,accepted_doctors:1}
              ).exec(function(err,data){
              if(err) throw err;   

              if(!data) {
                res.json({error: true, message: 'Something went wrong. Please try again'});
                return;
              }

              req.body.holdPatientData = data;          
              
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
                phone: pharmacy.phone,
                prescriptionId: req.body.prescriptionId
              };

              data.medications.unshift(preObj);
              data.prescription_tracking.unshift(track_record);

              var docPos = data.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(req.user.user_id);
              if(docPos == -1){
                if(req.user.type === "Doctor")
                  data.accepted_doctors.unshift({
                    doctor_id: req.user.user_id,
                    doctor_title: req.user.title,
                    date_of_acceptance: date,
                    doctor_firstname: req.user.firstname,
                    doctor_lastname: req.user.lastname,
                    doctor_profile_pic_url: req.user.profile_pic_url,                  
                    doctor_specialty: req.user.specialty,
                    work_place: req.user.work_place,
                  })
              }

              data.save(function(err,info){
                if(err) throw err;
                io.sockets.to(data.user_id).emit("notification",{status:true,isNewDrug: true});
                        
              });

              preObj.patient_phone = data.phone;

              var refSchema = new model.referral(refObj)

              //pharmacy.referral.push(refObj);

              refSchema.save(function(err,info){             
                if(err) throw err;             
                console.log("prescription saved");
                io.sockets.to(req.body.user_id).emit("center notification",{status:true,isNewDrug: true});                                         
              });

              var msgBody;
              var names = req.user.name
              if(!req.body.courierObj){
                msgBody = names
                +  " has written some prescriptions for you which was forwarded to " 
                + pharmacy.name + " at " + pharmacy.address + ", " + pharmacy.city + ". Please show " 
                + "this Ref No - " +  ref_id + " to the center. To view the prescription " 
                + "or to share it with another physician please log into your account or create one at www.applinic.com/signup"

              } else {
                msgBody = names + " has written some prescription and activated home delivery service for you." 
                + " You may be contacted by our home delivery agent if payment for the prescription is made."
              }

              var phoneNunber =  data.phone;              
              sms.messages.create(
                {
                  to: phoneNunber,
                  from: '+16467985692',
                  body: msgBody,
                },
                callBack
              ) 

              function callBack(eer, status) {
                if(err) console.log(err);
              }

            });           

            var by = req.user.title + " " + req.user.firstname + " " + req.user.lastname;
            res.json({
              success:true,
              ref_id: ref_id,
              name:pharmacy.name,
              address:pharmacy.address,
              city:pharmacy.city,
              country:pharmacy.country,
              by: by
            }); 
          }

          if(req.body.typeOfSession === "video chat") {
            model.session.findOne({session_id: req.body.session_id})
            .exec(function(err,record){
              if(err) throw err;
              
              if(!record) {                
                req.body.patient_firstname = req.body.firstname;
                req.body.patient_lastname = req.body.lastname;
                req.body.patient_username = req.body.username;
                req.body.date = date;
                var sess = new model.session(req.body);
                sess.diagnosis = req.body.treatment;
                sess.save(function(err,info){console.log("new session created")});
              }

            });
          }

          var patientPos = req.user.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(req.body.patient_id);
          if(patientPos == -1){
            req.user.doctor_patients_list.unshift({
              date: date,
              patient_lastname: req.body.lastname,
              patient_firstname: req.body.firstname,
              patient_id: req.body.patient_id,
              patient_profile_pic_url: req.body.patient_profile_pic_url,
              patient_address: req.body.address || "N/A",
              patient_city: req.body.city,
              patient_country: req.body.country,
              patient_gender: req.body.gender,
              patient_age: req.body.age,
              patient_phone: req.body.phone
            })

            req.user.save(function(err,info){
              if(err) throw err;
              console.log("patient save in doctors list")
            })  
          }
     
      } else {
        res.end("Unauthorized Access");
      }   
    });
  
    //user getting the available on the dashboard balance route.
    router.get('/user/get-balance',function(req,res){
      if(req.user){
        model.user.findOne({user_id: req.query.userId},{ewallet:1},function(err,wallet){
          if(err) throw err;
          if(wallet) {
            res.send({balance: wallet.ewallet.available_amount})
          } else {
            res.send({balance: 0})
          }
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

    router.delete("/user/doctor/deleteAppRequest",function(req,res){
      if(req.user){
        console.log(req.body)
        model.user.findOne({user_id: req.user.user_id},{doctor_notification:1})
        .exec(function(err,data){
          if(err) throw err;
          console.log(data)
          var elemPos = data.doctor_notification.map(function(x){return x.message_id}).indexOf(req.body.item)
          if(elemPos !== -1) {
            data.doctor_notification.splice(elemPos,1);
          }
          data.save(function(err,info){
            if(err) throw err;
            console.log("Appointment request viewed and deleted.");
          })
        })
      } else {
        res.send("unauthorized access!");
      }
    })

    //prescription fowarded by the doctor to a patient inbox
    router.put("/user/patient/forwarded-prescription",function(req,res){   
      console.log(req.body);
      var provisionalDiagnosis = (req.body.treatment) ? req.body.treatment.provisionalDiagnosis : null;
      var complain = (req.body.treatment) ? req.body.treatment.complain : null;
      req.body.ref_id = randos.genRef(7);
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
              provisional_diagnosis: (req.body.treatment) ? provisionalDiagnosis : req.body.provisional_diagnosis,
              date: date,
              prescriptionId: req.body.prescriptionId,
              title: req.user.title,
              doctor_specialty: req.user.specialty,
              doctor_firstname: req.user.firstname || req.user.name,
              doctor_lastname: req.user.lastname,
              doctor_profile_url: req.user.profile_url,
              doctor_address: req.user.address,   
              doctor_id: req.user.user_id,
              doctor_work_place: req.user.work_place,
              doctor_city: req.user.city,
              doctor_country: req.user.country,
              lab_analysis: req.body.lab_analysis,
              scan_analysis: req.body.scan_analysis,
              doctor_profile_pic_url: req.user.profile_pic_url,
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

            //just to add patient number on the above list;
            model.user.findOne({user_id: req.body.patient_id},{phone:1},function(err,patient){
              preObj.patient_phone = patient.phone;
            });

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
            io.sockets.to(data.user_id).emit("notification",{status:true});
          } else {
            var msgBody = "You have new unread prescription! Visit https://applinic.com/login"
            var phoneNunber =  data.phone;              
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            ) 
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

        if(req.body.typeOfSession === "video chat") {
          model.session.findOne({session_id: req.body.session_id})
          .exec(function(err,record){
            if(err) throw err;
            /*var elemPos = record.map(function(x){return x.session_id}).indexOf(req.body.session_id);
            if(elemPos !== -1) {
              req.body.patient_firstname = req.body.firstname;
              req.body.patient_lastname = req.body.lastname;
              req.body.patient_username = req.body.username;
              req.body.date = + new Date();
              record.doctor_patient_session.unshift(req.body);
              record.doctor_patient_session[0].diagnosis = req.body.treatment;
            }
            record.save(function(err,info){});
            */
            if(record){

              record.diagnosis = req.body.treatment;
              record.save(function(err,info){
                if(err) throw err;
                console.log("Session save!");
              });

            } else {
              var dt = new Date();
              var sess = new model.session({
                date: dt,
                last_modified: dt,
                session_id: req.body.session_id,
                patient_id: req.body.patient_id,
                profilePic: req.body.patient_profile_pic_url,
                patient_firstname: req.body.firstname,
                patient_lastname: req.body.lastname,
                patient_username: req.body.username,
                prescription_id: req.body.prescriptionId,
                typeOfSession: req.body.typeOfSession,
                diagnosis: req.body.treatment,
                doctor_id: req.user.user_id
              });

              sess.save(function(err,info){
                if(err) throw err;
                console.log("Session save!");
              });
            }
          })
        }
      } else {
        res.end("unauthorzed access")
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
            var msgBody = "You have new  prescription request from " + req.user.firstname + " " + req.user.lastname + " Visit https://applinic.com/login"
            var phoneNunber =  data.phone;          
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            ) 
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

   
    //this router takes call of pahrmacy search for a patient prescription from the data base;
    router.put("/user/pharmacy/find-patient/prescription",function(req,res){
       if(req.user){    
          var data = req.user;
          switch(req.body.criteria) {
            case "refIdCriteria":
              var toNum = req.body.ref_id;               

              var elementPos = data.referral.map(function(x) {return x.ref_id}).indexOf(toNum);
              var objectFound = data.referral[elementPos];
              
              if(objectFound === undefined) {
                res.send({error: "Patient prescription not found"});
              } else {
                res.send({data: [objectFound]});
              }
            break;
            case "phoneCriteria":
              var presList = [];
             // var elementPos = data.referral.map(function(x) {return x.phone; }).indexOf(req.body.phone);
             // var objectFound = data.referral[elementPos];
              var phone = req.body.phone;
              for(var i = 0; i < data.referral.length; i++) {
                if(data.referral[i].pharmacy.patient_phone === phone) {
                  presList.push(data.referral[i]);
                }
              }

              if(presList.length === 0) {
                res.send({error: "Patient prescription not found"})
              } else {
                res.send({data: presList});
              }
                break;

            default:
              res.send({error: "Please enter search creteria"});
              break
          }            

      } else {
        res.end("Unauthorized access");
      }
    });


    router.get("/user/pharmacy/find-patient/prescription",function(req,res){
      if(req.user){ 

        var criteria = {center_id: req.user.user_id};

        if(req.query.from){           
          var startDate = moment(req.query.from).startOf('day'); // set to 12:00 am today
          var endDate = moment(req.query.to).endOf('day'); // set to 23:59 pm off date range
          criteria['date'] = {$gt: startDate,$lt: endDate};
        }

        if(req.query.refId) {
          var intRegex = /[0-9 -()+]+$/;
          if(intRegex.test(req.query.refId))
            criteria['ref_id'] = req.query.refId;
        }

        if(req.query.patienPhone) {
          criteria['pharmacy.patient_phone'] = req.query.patienPhone;
        }

        model.referral.find(criteria)
        .exec(function(err,referralList){
          if(err) throw err;
          res.json(referralList)
        })

      } else {
        res.end("Unauthorized access");
      }
      
    });

    router.get("/user/laboratory/find-patient/lab-test",function(req,res){
      if(req.user){ 


        var criteria = {center_id: req.user.user_id};

        if(req.query.from){           
          var startDate = moment(req.query.from).startOf('day'); // set to 12:00 am today
          var endDate = moment(req.query.to).endOf('day'); // set to 23:59 pm off date range
          criteria['date'] = {$gt: startDate,$lt: endDate};
        }

        if(req.query.refId) {
          var intRegex = /[0-9 -()+]+$/;
          if(intRegex.test(req.query.refId))
            criteria['ref_id'] = req.query.refId;
        }

        if(req.query.patienPhone) {
          criteria['laboratory.patient_phone'] = req.query.patienPhone;
        }

        model.referral.find(criteria)
        .exec(function(err,referralList){
          if(err) throw err;
          res.json(referralList)
        })

      } else {
        res.end("Unauthorized access");
      }
      
    });


  
    router.get("/user/laboratory/get-referral",function(req,res){
      if(req.user){
        var toNum = req.query.refId;
        model.referral.findOne({ref_id: toNum,center_id: req.user.user_id})
        .exec(function(err,found){ 
          //var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(toNum);
          //var found = data.referral[elemPos]         
          if(err) throw err;
          res.send(found);               
        });
      } else {
        res.redirect("/login")
      }

    })


    //this route gets all referral for a laboratory.
    router.put("/user/laboratory/get-referral",function(req,res){
      if(req.user){
        model.referral.find({center_id:req.user.user_id},function(err,data){
          if(err) throw err;
          if(data) {
            var list = [];
            var filter = {};
            var toStr;
            for(var i = 0; i < req.body.length; i++){
              toStr = req.body[i].ref_id.toString();
              if(!filter.hasOwnProperty(toStr)){
                var elemPos = data.map(function(x){return x.ref_id}).indexOf(req.body[i].ref_id);
                var found = data[elemPos];
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


    router.get("/user/radiology/get-referral", function(req,res){
      if(req.user){
        var toNum = req.query.refId;
        model.referral.findOne({ref_id: toNum,center_id: req.user.user_id})
        .exec(function(err,found){
          if(err) throw err;          
          res.json(found);
        })
        /*model.user.findOne({user_id:req.user.user_id},{referral:1,_id:0},function(err,data){
          if(err) throw err;          
          var elemPos = data.referral.map(function(x){return x.ref_id}).indexOf(toNum);
          var found = data.referral[elemPos]
          res.send(found);
          console.log(found)
        });*/
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
         model.referral.find({center_id:req.user.user_id},function(err,data){
          if(err) throw err;
          if(data) {
            var list = [];
            var filter = {};
            var toStr;
            for(var i = 0; i < req.body.length; i++){
              toStr = req.body[i].ref_id.toString();
              if(!filter.hasOwnProperty(toStr)){
                var elemPos = data.map(function(x){return x.ref_id}).indexOf(req.body[i].ref_id);
                var found = data[elemPos];
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
        var fileUrl = [];
        for(var i = 0; i < req.files.length; i++) {
          var url = req.files[i].location || "/download/scan-image/" + req.files[i].filename;
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

        var session_id = uuid.v1() //parseInt(Math.floor(Math.random() * 999999) + "" + Math.floor(Math.random() * 999999));
        
        var connectObj = {
          presenting_complain: req.body.complain,
          history_of_presenting_complain: req.body.historyOfComplain,
          past_medical_history: req.body.pastMedicalHistory,
          social_history: req.body.socialHistory,
          family_history: req.body.familyHistory,
          drug_history: req.body.drugHistory,
          summary: req.body.summary,
          notes: req.body.notes,
          provisional_diagnosis: req.body.provisionalDiagnosis,
        }

        var getPatientInfo = {}   

        req.body.doctor_id = req.user.user_id;      

        /****************Note text messages or email will be sent to notify patients of the appointment ***********/

        // if there is appointment save appointment to the data base
        if(req.body.appointment){

          var getNames = {
            firstname : req.body.appointment.firstname,
            lastname: req.body.appointment.lastname,
            patient_id: req.body.patient_id
          }

         console.log(req.body)

          var createAddress = req.user.address + "," + req.user.city + "," + req.user.country; 
          req.body.appointment.patient_firstname = req.body.appointment.firstname;
          req.body.appointment.patient_lastname = req.body.appointment.lastname;
          req.body.appointment.patient_title = req.body.appointment.title;

          req.body.appointment.firstname = req.user.firstname;
          req.body.appointment.lastname = req.user.lastname;
          req.body.appointment.address = req.body.appointment.address || createAddress;
          req.body.appointment.title = req.user.title;
          req.body.appointment.profilePic = req.user.profile_pic_url;
          req.body.appointment.session_id = session_id; 
          req.body.appointment.attended = false;
          req.body.appointment.last_meeting = req.body.date;
         
          req.body.appointment.typeOfSession = req.body.typeOfSession;
          req.body.appointment.doctorId = req.user.user_id;
          req.body.appointment.patient_id = req.body.patient_id;
          req.body.appointment.attended = false;
          req.body.appointment.created = new Date();

          model.user.findOne({user_id:req.body.patient_id,type:"Patient"},
          {profile_pic_url:1,firstname:1,lastname:1,name:1,phone:1})
          .exec(function(err,result){   

            getPatientInfo.firstname = result.firstname;
            getPatientInfo.lastname = result.lastname;
            getPatientInfo.profilePic = result.profile_pic_url;
            getPatientInfo.patient_username = result.name;
            getPatientInfo.phone = result.phone;
            

            var ap = new model.appointment(req.body.appointment);

            ap.save(function(err){
              if(err) throw err;
              console.log("appointment saved!")
              var msgBody = "Hello " + getPatientInfo.firstname + ", " + req.user.title + " " + req.user.firstname
              + " from Applinic Healthcare has Scheduled an In-Person meeting appointment with you on " 
              + req.body.appointment.strDate + "\nTime is " 
              + req.body.appointment.strTime + "\nVenue is " + req.body.appointment.address + "\nKindly login https://applinic.com/login to find out more from your doctor."
              var phoneNunber = getPatientInfo.phone || "+2348064245256";             
              sms.messages.create(
                {
                  to: phoneNunber,
                  from: '+16467985692',
                  body: msgBody,
                }
              )
            });
          })


          /*model.user.findOne({user_id:req.body.patient_id,type:"Patient"},
            {appointment:1,profile_pic_url:1,firstname:1,lastname:1,name:1,phone:1}).exec(function(err,result){            
            if(err) throw err;            
            if(result){
              result.appointment.unshift(req.body.appointment);
              getPatientInfo.firstname = result.firstname;
              getPatientInfo.lastname = result.lastname;
              getPatientInfo.profilePic = result.profile_pic_url;
              getPatientInfo.patient_username = result.name;
              getPatientInfo.phone = result.phone;
              result.save(function(err,info){
                if(err) throw err;
                if(info)
                  tellDoctor(getNames);
              });
            } else {
              res.json({error:true,message:"Patient was not found."})
            }
          });*/
        }

        /*var tellDoctor = function(names){
          req.body.appointment.session_id = req.body.session_id || session_id;                          
          req.body.appointment.last_meeting = req.body.date;
          req.body.appointment.firstname = names.firstname;
          req.body.appointment.lastname = names.lastname;         
          req.body.appointment.typeOfSession = req.body.typeOfSession;
          req.body.appointment.doctorId = req.user.user_id;
          req.body.appointment.patient_id = req.body.patient_id;
          req.body.appointment.attended = false;
          req.body.appointment.created = new Date();

          var ap = new model.appointment(req.body.appointment)
          ap.save(function(err){
            if(err) throw err;
            console.log("appointment saved!")
            var msgBody = "Hello " + getPatientInfo.firstname + ", " + req.user.title + " " + req.user.firstname
            + " from Applinic Healthcare has Scheduled an In-Person meeting appointment with you on " 
            + req.body.appointment.strDate + "\nTime is " 
            + req.body.appointment.strTime + "\nVenue is " + req.body.appointment.address + "\nKindly login https://applinic.com/login to find out more from your doctor."
            var phoneNunber = getPatientInfo.phone || "+2348064245256";             
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            )
          });
        }*/


        model.user.findOne({user_id:req.body.patient_id})
        .exec(function(err,result){            
          if(err) throw err; 
          if(result) {        
            getPatientInfo.firstname = result.firstname;
            getPatientInfo.lastname = result.lastname;
            getPatientInfo.profilePic = result.profile_pic_url;
            getPatientInfo.patient_username = result.name || "";

            //create session Note; video chat initiation of sessions comes with session id from the client
            if(!req.body.session_id){
              newSession();
            } else {
              updateSession()
            }  
          } else {
            res.end("Error occured")
          }    
         
        });

         //save the newly created session to he database.
        //var queryObj = (req.body.user_id) ? {user_id:req.body.user_id} : {user_id:req.user.user_id};

        function newSession(){         
          //model.user.findOne(queryObj,{doctor_patient_session:1}).exec(function(err,result){
          //if(err) throw err; 

           req.body.session_id = session_id;
           var result = new model.session(req.body)  
           //result.doctor_patient_session.unshift(req.body);
           result.diagnosis = connectObj;
           result.patient_firstname = getPatientInfo.firstname;
           result.patient_lastname = getPatientInfo.lastname;
           result.patient_username = getPatientInfo.username;
           result.profilePic = getPatientInfo.profilePic;
           
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
                res.send({status:"success"});
              }            
            });
         // });
        }

        function updateSession() {
          //model.user.findOne(queryObj,{doctor_patient_session:1}).exec(function(err,record){
            //if(err) throw err;
            //var elementPos = record.doctor_patient_session.map(function(x){return x.session_id}).indexOf(req.body.session_id)
          model.session.findOne({session_id: req.body.session_id})
          .exec(function(err,objFound){
            if(objFound) {
              //var objFound = record.doctor_patient_session[elementPos];    
              objFound.last_modified = + new Date();
              objFound.diagnosis.presenting_complain = (objFound.diagnosis.presenting_complain ) ? objFound.diagnosis.presenting_complain + " " + req.body.complain : req.body.complain;
              objFound.diagnosis.history_of_presenting_complain = (objFound.diagnosis.history_of_presenting_complain) ? objFound.diagnosis.history_of_presenting_complain + " " + req.body.historyOfComplain : req.body.historyOfComplain; 
              objFound.diagnosis.past_medical_history = (objFound.diagnosis.past_medical_history) ? objFound.diagnosis.past_medical_history + " " + req.body.pastMedicalHistory : req.body.pastMedicalHistory;
              objFound.diagnosis.social_history = (objFound.diagnosis.social_history) ? objFound.diagnosis.social_history + " " + req.body.socialHistory : req.body.socialHistory;
              objFound.diagnosis.family_history = (objFound.diagnosis.family_history) ? objFound.diagnosis.family_history + " " + req.body.familyHistory : req.body.familyHistory;
              objFound.diagnosis.drug_history = (objFound.diagnosis.drug_history) ? objFound.diagnosis.drug_history + " " + req.body.drugHistory : req.body.drugHistory;
              objFound.diagnosis.notes = (objFound.diagnosis.notes) ? objFound.diagnosis.notes + " " + req.body.notes : req.body.notes;
              objFound.diagnosis.summary = (objFound.diagnosis.summary) ? objFound.diagnosis.summary + " " + req.body.summary : req.body.summary;
              objFound.diagnosis.provisional_diagnosis = (objFound.diagnosis.provisional_diagnosis) ? objFound.diagnosis.provisional_diagnosis + " " + req.body.provisionalDiagnosis : req.body.provisionalDiagnosis;
              
              objFound.save(function(err,info){
                if(err) throw err;
                console.log("session updated!"); 
                res.send({status:"success"});
              });

            } else { 
              var record = new model.session(req.body)             
              //record.doctor_patient_session.unshift(req.body);
              record.diagnosis = connectObj;
              record.patient_firstname = getPatientInfo.firstname;
              record.patient_lastname = getPatientInfo.lastname;
              record.patient_username = getPatientInfo.username;
              record.profilePic = getPatientInfo.profilePic;

              record.save(function(err,info){
                if(err) throw err;
                console.log("session updated!"); 
                res.send({status:"success"});
              }) 
            }
            
          });
        }
      } else {
        res.end("Unauthorized access!");
      }
    });


  /* this takes care of doctor appointment with patients to be advanced later */

    router.get("/user/doctor/appointment/view",function(req,res){
      if(req.user) {
        //var startDate = moment().year(req.query.year).month(req.query.month).startOf("month");
       // var endDate = startDate.clone().endOf('month');

        var criteria = (req.query.patientId) ? {doctorId: req.user.user_id,patient_id: req.query.patientId,attended:false} :
        {doctorId: req.user.user_id,attended:false};

        model.appointment.find(criteria)
         .exec(function(err,data){
          if(err) throw err;
          res.json(data);
        })
      } else {
        res.end("unauthorized access!");
      }

    })


    router.put("/user/doctor/appointment/view",function(req,res){
      if(req.user){
        var appointmentId;
        if(req.body.id) {
          appointmentId = req.body.id;
        }

        model.appointment.findOne({doctorId: req.user.user_id,session_id:appointmentId,attended: false},function(err,data){
          if(err) throw err;
          if(data){
            res.send(data)
          } else {
            res.send({});
          }
        })
      } else {
        res.end("Unauthorized access!");
      }
    });

     router.patch("/user/doctor/appointment/view",function(req,res){
      if(req.user){
        var appointmentId;
        if(req.body.id) {
          appointmentId = req.body.id;
        }

        model.appointment.findOne({doctorId: req.user.user_id,session_id:appointmentId,attended: false})
        .exec(function(err,data){
          if(err) throw err;
          if(data){
            data.attended = true;
            data.save(function(err,info){
              if(req.body.isFromModal){
                var msgBody = "Hello " + req.body.patientName + ", " + req.user.title + " " + req.user.firstname
                + " from Applinic Healthcare has CANCELED your appointment which was scheduled on " + req.body.date + "by " 
                + req.body.time + "\nKindly login https://applinic.com/login to find more from your doctor."
                var phoneNunber =  req.body.phone || "+2348064245256";             
                sms.messages.create(
                  {
                    to: phoneNunber,
                    from: '+16467985692',
                    body: msgBody,
                  }
                )
              }
            });
            res.send({status: true,message:"marked!"})
          } else {
            res.send({});
          }

        })
        
      } else {
        res.end("Unauthorized access!");
      }
    });

     /* for patient appointment logic */
    router.get("/user/patient/appointment/view",function(req,res){
      if(req.user){
        //res.json(req.user.appointment);
        model.appointment.find({patient_id: req.user.user_id})
        .exec(function(err,app){
          if(err) throw err;
          res.json(app);
        })
      } else {
        res.end("Unauthorized access");
      }
    });

    // will be modified later
    router.post("/user/doctor/get-session",function(req,res){
      if(req.user){
        model.session.findOne({session_id: req.body.sessionId},function(err,objectFound){
          if(err) throw err;
          //var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(req.body.sessionId);
          //var objectFound = data.doctor_patient_session[elementPos];
          if(objectFound){
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
            res.json(sessionData);  
          } else {
            res.json({})
          }     
        });
      } else {
        res.end("Unauthorized access");
      }
    });

    router.get("/user/doctor/get-patient-sessions",function(req,res){ 
      if(req.user){
        model.session.find({doctor_id: req.user.user_id, patient_id: req.query.patient_id})
        .exec(function(err,sessions){
          if(err) throw err;
          res.json(sessions)
        })
        /*var list = req.user.doctor_patient_session;
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
        }*/
      } else {
        res.end("Unauthorized access!!!")
      }
    });


    router.put("/user/record-permission", function(req,res){
      if(req.user){
        model.user.findOne({mrak: req.body.key,user_id: req.body.patientId}).exec(function(err,data){
          if(err) throw err;
          if(data){
            var elemPos = data.record_access.map(function(x){return x.userId}).indexOf(req.user.user_id);
            var found = data.record_access[elemPos];

            if(!found) {
              data.record_access.push({
                patient_id: req.body.patientId,
                key: req.body.key,
                access_to_record : true,
                name: (req.user.type == "Doctor") ? req.user.title + " " + req.user.firstname + " " + req.user.lastname : req.user.name,
                userId: req.user.user_id,
                profile_pic_url: req.user.profile_pic_url
              })
            }

            data.save(function(err,info){
              if(err) throw err;
              console.log("record access permitted");
              res.json({message: "Access Granted!!!",status: true});
            })
          } else {
            res.send({message:"Permission denied! Reason: Invalid key or key mismatch.",status: false})
          }
        })
      } else {
        res.end("unauthorized access!")
      }
    });

    router.get("/user/manage-access",function(req,res){
        if(req.user) {
          res.json(req.user.record_access);
        } else {
          res.end("unauthorized access!");
        }
    });

    router.put("/user/manage-access",function(req,res){
      console.log(req.body)
      if(req.user) {
        model.user.findOne({user_id:req.user.user_id},{record_access: 1}).exec(function(err,data){
          if(err) throw err;
          if(data){
            if(req.body.userId === "all"){
              data.record_access.splice(0);
              res.json({message: "access denied",status: true});
            } else {
              var elemPos = data.record_access.map(function(x){return x.userId}).indexOf(req.body.userId);              
              if(elemPos !== -1){
                data.record_access.splice(elemPos,1);
              }
              res.json({message: "access denied",status: true});
            }
          } else {
            res.send({message: "failed."});
          }

          data.save(function(err,info){
            if(err) throw err;
            console.log("record access updated!")
          })
        })
      } else {
        res.end("unauthorized access!")
      }
    });

    router.patch("/user/manage-access",function(req,res){
      if(req.user){
        model.user.findOne({user_id:req.user.user_id},{mrak:1,record_access:1}).exec(function(err,data){
          if(err) throw err;
          if(data){
            data.mrak = uuid.v1();
            data.record_access.splice(0);
            res.json({message: "Medical Record Access Key changed successfully",mrak: data.mrak})
          } else {
            res.json({message: "Oops! Something went wrong. Try again."})
          }

          data.save(function(err,info){
            if(err) throw err;
            console.log("mrak key changed")
          })
        })
      } else {
        res.end("unauthorized access!")
      }
    })

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
      
        //save changes in the treatment session to the database
        model.session.findOne({session_id: req.body.session_id})
        .exec(function(err,objectFound){
          if(err) throw err;
          //var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(req.body.session_id);

          if(req.body.general_examination)
            objectFound.diagnosis.general_examination = (objectFound.diagnosis.general_examination) ?
             objectFound.diagnosis.general_examination + req.body.general_examination : req.body.general_examination;

          if(req.body.systemic_examination)
            objectFound.diagnosis.systemic_examination = (objectFound.diagnosis.systemic_examination) ?
             objectFound.diagnosis.systemic_examination + req.body.systemic_examination : req.body.systemic_examination;

          if(req.body.final_diagnosis) 
            objectFound.diagnosis.final_diagnosis = (objectFound.diagnosis.final_diagnosis) ?
             objectFound.diagnosis.final_diagnosis + req.body.final_diagnosis : req.body.final_diagnosis; 

          if(req.body.medical_report) {
            model.user.findOne({user_id: req.body.patient_id},{medical_reports:1}).exec(function(err,patient){
              if(err) throw err;
              if(patient) {
                var elemPos = patient.medical_reports.map(function(x){ if(x) return x.sub_session_id}).indexOf(req.body.sub_session_id)

                if(elemPos === -1) {
                  patient.medical_reports.unshift({
                    doctor_id: req.user.user_id,
                    doctor_name: req.user.title + " " + req.user.firstname + " " + req.user.lastname,
                    doctor_specialty: req.user.specialty,
                    doctor_work_place: req.user.work_place,
                    doctor_address: req.user.address,
                    doctor_city: req.user.city,
                    doctor_country: req.user.country,
                    patient_id: patient.user_id,
                    doctor_profile_pic_url: req.user.profile_pic_url,
                    doctor_profile_url: req.user.profile_url,
                    report: req.body.medical_report,
                    date: + new Date(),
                    diagnosis: req.body.final_diagnosis,
                    report_id: uuid.v1(),
                    session_id: req.body.session_id,
                    sub_session_id: req.body.sub_session_id
                  }); 
                } else {
                  patient.medical_reports[elemPos].report = req.body.medical_report;
                  patient.medical_reports[elemPos].date = + new Date();
                }

                patient.save(function(err,info){
                  console.log("report save")
                });
              }

            });

            objectFound.diagnosis.medical_report = (objectFound.diagnosis.medical_report) ?
            (objectFound.diagnosis.medical_report += req.body.medical_report) : req.body.medical_report;
          }

          if(req.body.presenting_complain)
            objectFound.diagnosis.presenting_complain = req.body.presenting_complain;

          if(req.body.history_of_presenting_complain)
            objectFound.diagnosis.history_of_presenting_complain = req.body.history_of_presenting_complain;

          if(req.body.past_medical_history)
            objectFound.diagnosis.past_medical_history = req.body.past_medical_history;

          if(req.body.social_history)
            objectFound.diagnosis.social_history = req.body.social_history;

          if(req.body.family_history)
            objectFound.diagnosis.family_history = req.body.family_history;

          if(req.body.drug_history)
            objectFound.diagnosis.drug_history = req.body.drug_history;

          if(req.body.summary)
            objectFound.diagnosis.summary = req.body.summary;

          if(req.body.provisional_diagnosis)
            objectFound.diagnosis.provisional_diagnosis = req.body.provisional_diagnosis;


         
          var date = + new Date();
          objectFound.last_modified = date;


          var sub = {
            date: date,
            note: (req.body.sub_note) ? req.body.sub_note : "",
            general: (req.body.general_examination) ? req.body.general_examination : "",
            systemic: (req.body.systemic_examination) ? req.body.systemic_examination : "",
            diagnosis: (req.body.final_diagnosis) ? req.body.final_diagnosis : "",
            sub_session_id: req.body.sub_session_id
          }

      

          if(req.body.subSession && !req.body.medical_report) { 
            var subList = objectFound.diagnosis.sub_session;
            var elemPos = subList.map(function(x){return x.sub_session_id}).indexOf(req.body.sub_session_id)
            if(elemPos === -1) {   
              objectFound.diagnosis.sub_session.push(sub);
            } else {
              if(req.body.sub_note)
                objectFound.diagnosis.sub_session[elemPos].note = req.body.sub_note;
              if(req.body.general_examination)
                objectFound.diagnosis.sub_session[elemPos].general = req.body.general_examination;
              if(req.body.systemic_examination)
                objectFound.diagnosis.sub_session[elemPos].systemic = req.body.systemic_examination;
              if(req.body.final_diagnosis)
                objectFound.diagnosis.sub_session[elemPos].diagnosis = req.body.final_diagnosis;
            }
          }


          objectFound.markModified('diagnosis');


          objectFound.save(function(err,info){
            if(err) {
              res.send({error:"failed"})
            } else {
              if(!req.body.appointment){
                var resObj = (req.body.subSession) ? {success:"success",subSession: sub} : {success:"success"};
                res.json(resObj);
              } else {
                saveAppointment();
              }
            }
          })
        })
        
        

        //check to see if there is an appointment. doc and patient appointment list will be populated

        /****************Note text messages or email will be sent to notify patients of the appointment ***********/
        
        // if there is an accompanied appointment object, save and notify both the patient and doctor
        function saveAppointment() {
          /*var getNames = {
            firstname : req.body.appointment.firstname,
            lastname: req.body.appointment.lastname,
            patient_id: req.body.patient_id
          }*/
          model.user.findOne({user_id: req.body.patient_id})
          .exec(function(err,patient){
            if(err) throw err;

            req.body.appointment.session_id = req.body.session_id;
            req.body.appointment.firstname = req.user.firstname;
            req.body.appointment.lastname = req.user.lastname;
            req.body.appointment.address = req.body.appointment.address || req.user.address;
            req.body.appointment.title = req.user.title;
            req.body.appointment.last_meeting = req.body.date;
            req.body.appointment.typeOfSession = sessionType.name;
            req.body.appointment.profilePic = req.user.profile_pic_url;
            req.body.appointment.patient_title = patient.title;
            req.body.appointment.patient_firstname = patient.firstname;
            req.body.appointment.patient_lastname = patient.lastname;
            req.body.appointment.doctorId = req.user.user_id;
            req.body.appointment.patient_id = patient.user_id;


            var appointment = new model.appointment(req.body.appointment);

            appointment.save(function(err,info){
              if(err) throw err;
              //tellDoctor(getNames);
            });

            console.log(appointment, "shgsdhhgsghs")

            if(req.body.typeOfSession === "In-person meeting") {
              res.json({success: "success",session_id:req.body.session_id})
            } else {
              res.send("success");
            }                    

          })
         
          /*model.user.findOne({user_id:req.body.patient_id},{appointment:1}).exec(function(err,result){            
            if(err) throw err;
            var elementPos = result.appointment.map(function(x){return x.session_id}).indexOf(req.body.session_id)
            var foundObj = result.appointment.splice(elementPos,1);
            result.appointment.unshift(req.body.appointment);
            result.save(function(err,info){
              if(err) throw err;
              if(info)
                tellDoctor(getNames);
            });
          });*/  

          /*var tellDoctor = function(names){
                 
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
          }*/
        }

      } else {
        res.end("Unauthorized access!!!")
      }
    });

    router.get("/user/doctor/get-report",function(req,res){
      if(req.user){
        console.log(req.query,"++++++++");
        model.user.findOne({user_id: req.query.patientId},{medical_reports:1})
        .exec(function(err,data){
          if(err) throw err;
          if(data){
            var elemPos = data.medical_reports.map(function(x){return x.sub_session_id}).indexOf(req.query.subSessionId);
            if(elemPos !== -1) {
              res.json(data.medical_reports[elemPos]);
            } else {
              res.json({error: "No record found!"});
            }
          } else {
            res.send({error: "No record found!"});
          }
        });
      } else {
        res.end("unauthorized access!")
      }
    })

    //doctor finds the patient's lab tests if
    router.put("/user/doctor/get-test-result",function(req,res){
        if(req.user){   
          console.log(req.body)      
          //model.user.findOne({user_id: req.user.user_id},{doctor_patient_session:1}).exec(function(err,data){
           // if(err) throw err;
           var data = req.user;

           if(req.body.id) {

            model.session.findOne({session_id: req.body.id})
            .exec(function(err,objectFound){
              if(err) throw err;

              if(objectFound) {


                //var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(req.body.id);
               // var objectFound = data.doctor_patient_session[elementPos];
                var sentObjArr = [];
                var count = 0;
                
                
                while(objectFound.diagnosis.laboratory_test_results.length > count) {             
                  var ranTest = [];
                 
                  var objectArr = objectFound.diagnosis.laboratory_test_results.map(function(x) {return x });              
                  var objFound = objectArr[count];
                 
                  for(var i = 0; i < objFound.test_to_run.length; i++) {                
                    if(objFound.test_to_run[i].select === true){
                      ranTest.push(objFound.test_to_run[i]);
                    }
                  }

                  var testAndReport = objFound.report
                  /*var splitReport = objFound.report;//objFound.report.split(",");                            
                  for(var j = 0; j < splitReport.length; j++) {
                    var testObj = {};
                    var seperateTestAndReport = splitReport[j];
                    testObj['test'] = seperateTestAndReport.name;
                    testObj['report'] = seperateTestAndReport.report_sheet;
                    testAndReport.push(testObj);                
                  }*/
                  
                  
                  objFound.refinedReport = testAndReport;
                  objFound.ranTest = ranTest;
                  count++;
                  
                  var newObjToSend = {};
                  newObjToSend.report = testAndReport;
                  newObjToSend.ranTest = ranTest;
                  newObjToSend.indication =  objFound.indication;
                  newObjToSend.type = "laboratory";
                  newObjToSend.test_to_run = objFound.test_to_run;
                  newObjToSend.conclusion = objFound.conclusion;
                  newObjToSend.receive_date = objFound.receive_date;
                  newObjToSend.sent_date = objFound.sent_date;
                  newObjToSend.center_name = objFound.test_ran_by;
                  newObjToSend.center_address = objFound.center_address;
                  newObjToSend.center_city = objFound.center_city;
                  newObjToSend.center_country = objFound.center_country;
                  newObjToSend.center_email = objFound.center_email;
                  newObjToSend.center_phone = objFound.center_phone;
                  newObjToSend.sub_session_id = objFound.sub_session_id;

                  sentObjArr.push(newObjToSend);           
                }
                
                res.json({result:sentObjArr});

              } else {
                res.json({result:[]});
              }
            
            })

          } else {
            //var newArr = [];

            model.session.find({doctor_id: req.user.user_id, patient_id: req.body.patientId})
            .exec(function(err,sessions){
              if(err) throw err;
              res.json(sessions);
            })
            /*data.doctor_patient_session.forEach(function(item){
              if(item.patient_id === req.body.patientId){
                newArr.push(item);
              }
            })
            res.json(newArr);*/
          }
          //});
        } else {
          res.end("Unauthorized access!")
        }
    });
    //doctors finds the patient's scan if any
    router.put("/user/doctor/get-scan-result",function(req,res){/////////////////////////////
        if(req.user){
          //model.user.findOne({user_id: req.user.user_id},{doctor_patient_session:1}).exec(function(err,data){
            //if(err) throw err;
            var data = req.user;

            if(req.body.id) {

            model.session.findOne({session_id: req.body.id})
            .exec(function(err,session){
              if(err) throw err;
              if(session){
                var objectFound = session;
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

                  var testAndReport = objFound.report;
                 
                  
                  
                  objFound.refinedReport = testAndReport;
                  objFound.ranTest = ranTest;
                  count++;
                  
                  var newObjToSend = {};
                  newObjToSend.report = testAndReport;
                  newObjToSend.ranTest = ranTest;
                  newObjToSend.indication =  objFound.indication;
                  newObjToSend.type = "radiology"
                  newObjToSend.test_to_run = objFound.test_to_run;
                  newObjToSend.conclusion = objFound.conclusion;
                  newObjToSend.receive_date = objFound.receive_date;
                  newObjToSend.sent_date = objFound.sent_date;
                  newObjToSend.center_name = objFound.test_ran_by;
                  newObjToSend.center_address = objFound.center_address;
                  newObjToSend.center_city = objFound.center_city;
                  newObjToSend.center_country = objFound.center_country;
                  newObjToSend.center_phone = objFound.center_phone;
                  newObjToSend.files = objFound.files;
                  newObjToSend.sub_session_id = objFound.sub_session_id;

                  sentObjArr.push(newObjToSend);

                }

                res.json({result:sentObjArr});

              } else {
                res.json({result:[]})
              }
              
            })
          

          } else {
            var newArr = [];
           
            /*data.doctor_patient_session.forEach(function(item){
              
              if(item.patient_id === req.body.patientId){
                newArr.push(item);
              }
            })*/
            model.session.find({doctor_id: req.user.user_id, patient_id: req.body.patientId})
            .exec(function(err,session){
              if(err) throw err;
              res.json(session);
            })
            //res.json(newArr);
          }

         // });
        } else {
          res.end("Unauthorized access!")
        }
    });


    router.get("/user/doctor/find-laboratory",function(req,res){
      if(req.user){
        //var city = (req.query.city) ? req.query.city : req.user.city;
        req.query.city = (req.query.city) ? req.query.city : req.user.city;
        var str = new RegExp(req.query.city.replace(/\s+/g,"\\s+"), "gi"); 
        var criteria = {city: { $regex: str, $options: 'i' },type:"Laboratory"}
        model.user.find(criteria,
          {name:1,address:1,user_id:1,city:1,country:1,profile_pic_url:1,type:1,phone:1},
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
            {name:1,address:1,user_id:1,city:1,country:1,profile_pic_url:1,type:1,phone:1},
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
       
        var random = randos.genRef(7);
        var testId = randos.genRef(8); 
        var date = + new Date(); 

        if(req.body.isOutPatientReq){
          req.body.treatment = {};
          //req.body.date = new Date();
          req.body.user_id = req.body.centerDetails.user_id;
          req.body.patient_id = req.body.patientDetails.user_id;
          req.body.patient_firstname = req.body.patientDetails.firstname; 
          req.body.patient_lastname = req.body.patientDetails.lastname;
          req.body.patient_title = req.body.patientDetails.title;
          req.body.phone = req.body.patientDetails.phone;
          req.body.patient_address = req.body.patientDetails.address;
          req.body.patient_city = req.body.patientDetails.city
          req.body.patient_profilePic = req.body.patientDetails.profile_pic_url
          req.body.laboratory = {
            patient_age: req.body.patientDetails.age,
            patient_gender: req.body.patientDetails.gender,
            profile_pic_url: req.body.patientDetails.profile_pic_url
          }

          var elemPos = req.user.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(req.body.patient_id);
          if(elemPos == -1){
            req.user.doctor_patients_list.unshift({
              date: date,
              patient_lastname: req.body.patient_lastname,
              patient_firstname: req.body.patient_firstname,
              patient_id: req.body.patient_id,
              patient_profile_pic_url: req.body.patient_profilePic,
              patient_address: req.body.patient_address || "N/A",
              patient_city: req.body.patient_city,
              patient_country: req.body.patientDetails.country || 'Nigeria',
              patient_gender: req.body.patientDetails.gender,
              patient_age: req.body.patientDetails.age,
              patient_phone: req.body.patientDetails.phone
            })

            req.user.save(function(err,info){
              if(err) throw err;
              console.log("patient save in doctors list")
            })
          }


        }

        model.user.findOne({user_id: req.body.user_id},
        {diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1,email:1,profile_pic_url:1})
        .exec(function(err,result){                  
          if(err) throw err;      
        
          model.session.find({doctor_id: req.user.user_id, patient_id: req.body.patient_id})
          .exec(function(err,sessions){
            if(err) throw err;

            if(!req.body.session_id && sessions.length > 0) {
              req.body.session_id = sessions[sessions.length - 1].session_id;
            } else {
              req.body.session_id = (req.body.session_id) ? req.body.session_id : uuid.v1();
            }

           

            if(req.body._id){
              delete req.body._id
            }


            req.body.center_name = result.name;
            req.body.center_address = result.address;
            req.body.center_city = result.city;
            req.body.center_phone = result.phone;
            req.body.center_email = result.email;
            req.body.center_profile_pic_url = result.profile_pic_url;

            var centerObj = {
              name: result.name,
              address: result.address,
              city: result.city,
              country: result.country,
              phone: result.phone,
              id: result.user_id
            }

            console.log(req.body)
            
            var refObj = {
              ref_id: random,
              referral_firstname: req.user.firstname,
              referral_lastname: req.user.lastname,
              referral_title: req.user.title,
              referral_id: req.user.user_id, 
              referral_email: req.user.email,
              referral_phone: req.user.phone,
              referral_pays: req.body.referral_pays,   
              date: req.body.date || new Date(),  
              center_id: result.user_id,      
              laboratory: {
                history: req.body.history,             
                patient_age: req.body.laboratory.patient_age,
                patient_gender: req.body.laboratory.patient_gender,
                test_to_run : req.body.lab_test_list,
                patient_firstname: req.body.patient_firstname,
                patient_lastname: req.body.patient_lastname,
                patient_profile_pic_url: req.body.laboratory.profile_pic_url || req.body.profile_pic_url,
                patient_title: req.body.patient_title,
                patient_phone: req.body.phone,
                session_id: req.body.session_id,
                patient_id: req.body.patient_id,
                test_id: testId,
                patient_address: req.body.patient_address,
                indication: req.body.treatment.indication || req.body.indication,
                clinical_summary: req.body.treatment.clinical_summary || req.body.clinical_summary,
                lmp: req.body.treatment.lmb || req.body.lmb,
                parity: req.body.treatment.parity || req.body.parity,
                attended: false,
                title: req.user.title,
                doctor_firstname: req.user.firstname,
                doctor_lastname: req.user.lastname,
                doctor_id: req.user.user_id,
                doctor_email: req.user.email,
                doctor_profile_url: req.user.profile_url,
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

            if(result.presence){
              io.sockets.to(result.user_id).emit("center notification",refNotification);
            }


            //result.referral.push(refObj);
            var referral = new model.referral(refObj);
            referral.save(function(err,info){
              if(err) throw err;
              console.log("referral saved")
            })

            result.diagnostic_center_notification.unshift(refNotification);

            result.save(function(err,info){
              if(err) throw err;            
            });
            tellPatient(centerObj);
          })

        });

        var tellPatient = function(centerInfo){
          //remember sms will be sent to the patient
          model.user.findOne({user_id: req.body.patient_id},{medical_records: 1,
            user_id:1,patient_notification:1,presence:1,phone:1,accepted_doctors:1})
          .exec(function(err,record){            
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
              referral_id: req.user.user_id,
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
              message: "You have unread pending laboratory test"
            };

            //if(record.presence === true) {
            io.sockets.to(record.user_id).emit("notification",{status:true,message: "You have new unread test to run.",type: "laboratory"});
            //} else {     
            var name = (req.user.firstname) ?  req.user.title + " " + req.user.firstname : req.user.name   
            var msgBody = "Your laboratory test was referred to " + centerInfo.name + "\n@ " + centerInfo.address + " " + centerInfo.city + " " +
            centerInfo.country + "\nBy " + name + "\nRef No " + random + "\nFor more details visit https://applinic.com/user/patient"
            var phoneNunber =  record.phone;             
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            ) 
            

            record.patient_notification.unshift(noteObj);
            record.medical_records.laboratory_test.unshift(recordObj);

            if(req.user.type == "Doctor" && req.body.isOutPatientReq){
              var docPos = record.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(req.user.user_id);
              if(docPos == -1){
                record.accepted_doctors.unshift({
                  doctor_id: req.user.user_id,
                  doctor_title: req.user.title,
                  date_of_acceptance: date,
                  doctor_firstname: req.user.firstname,
                  doctor_lastname: req.user.lastname,
                  doctor_profile_pic_url: req.user.profile_pic_url,                  
                  doctor_specialty: req.user.specialty,
                  work_place: req.user.work_place,
                })
              }
            }

            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              var doc = req.user.title + " " + req.user.firstname + " " + req.user.lastname;
              updateSession(req.body.session_id);
              res.json({success:true,ref_no:random,by: doc});
            });

          });
        }

        var updateSession = function(session_id) {

          var testResult = {
            test_to_run: req.body.lab_test_list,
            receive_date: "Pending",
            sent_date: req.body.date,
            report: "Pending",
            test_id: testId,
            conclusion: "Pending",
            sub_session_id: req.body.sub_session_id,
            indication: req.body.indication,
            clinical_summary: req.body.clinical_summary,
            test_ran_by: req.body.center_name,
            center_address: req.body.center_address,
            center_city: req.body.center_city,
            center_phone: req.body.center_phone,
            center_email: req.body.center_email,
            center_profile_pic_url: req.body.center_profile_pic_url
          }  

          
          model.session.findOne({session_id: session_id})
          .exec(function(err,data){

            if(err) throw err;           
            //var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(session_id);

           
            var objFound = data;  

            if(objFound) {                  

              if(req.body.subSession) {
                var subList = objFound.diagnosis.sub_session;
                var subPos = subList.map(function(x){return x.sub_session_id}).indexOf(req.body.sub_session_id);
                if(subPos === -1) {
                  subList.push({
                    date: date,
                    note: "",
                    sub_session_id: req.body.sub_session_id
                  })
                }
                //objFound.diagnosis.laboratory_test_results.unshift(testResult); 
              }  

              objFound.last_modified = + new Date();

              objFound.diagnosis.laboratory_test_results.unshift(testResult);

              objFound.save(function(err,info){
                if(err) throw err;
                console.log("session updated!")
              })

            } else {

              var complainObj = {
                presenting_complain: req.body.treatment.complain,
                history_of_presenting_complain: req.body.treatment.historyOfComplain,
                past_medical_history: req.body.treatment.pastMedicalHistory,
                social_history: req.body.treatment.socialHistory,
                family_history: req.body.treatment.familyHistory,
                drug_history: req.body.treatment.drugHistory,
                notes: req.body.treatment.notes,
                summary: req.body.treatment.summary,
                provisional_diagnosis: req.body.treatment.provisionalDiagnosis,
              }

              req.body.profilePic = req.body.patient_profilePic;
              req.body.last_modified = req.body.date;
              req.body.prescription_id = req.body.prescriptionId;
              req.body.doctor_id = req.user.user_id;

              //data.doctor_patient_session.unshift(req.body);

              var record = new model.session(req.body);

              record.diagnosis =  complainObj; 
              /*if(req.body.subSession) {
                var subList = record.diagnosis.sub_session;
                var subPos = subList.map(function(x){return x.sub_session_id}).indexOf(req.body.sub_session_id);
                if(subPos === -1) {
                  subList.push({
                    date: date,
                    note: "",
                    sub_session_id: req.body.sub_session_id
                  })
                }
              }*/
              record.diagnosis.laboratory_test_results.unshift(testResult);
              
              record.save(function(err,info){
                if(err) throw err;
                console.log("session created!")
              });
            }
            
          });
        }
      } else {
        res.end("Unauthorized access!");
      }
    });

    //this route takes care of  un ran test which was forwarded to another center by a center.
    router.post("/user/center/send-test",function(req,res){
      if(req.user) { 

        var originalRef = req.body.ref_id;
        req.body.ref_id = randos.genRef(6);
        req.body.date = new Date();
        var originalTest = req.body.laboratory.test_to_run;
        var referredTest = [];
        var unRefered = [];

        model.user.findOne({user_id: req.body.user_id,type: "Laboratory"},
        {diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1})
        .exec(function(err,result){
          if(err) throw err; 

          if(result) {          

            for(var i = 0; i < originalTest.length; i++){
              if(originalTest[i].select == true){
                referredTest.push(originalTest[i]);
              } else {
                unRefered.push(originalTest[i])
              }
            }

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
              referral_firstname: req.user.firstname || req.user.name,
              referral_lastname: req.user.lastname || "",
              referral_title: req.user.title || "",
              referral_id: req.user.user_id,
              referral_email: req.user.email,
              referral_phone: req.user.phone,    
              date: req.body.date,
              center_id: result.user_id,             
              laboratory: {              
                history: req.body.laboratory.history,
                patient_age: req.body.laboratory.patient_age,
                patient_gender: req.body.laboratory.patient_gender,
                test_to_run : referredTest,//req.body.laboratory.test_to_run,
                patient_firstname: req.body.laboratory.patient_firstname,
                patient_lastname: req.body.laboratory.patient_lastname,
                patient_profile_pic_url: req.body.laboratory.patient_profilePic,
                patient_title: req.body.laboratory.patient_title,
                patient_phone: req.body.laboratory.patient_phone,
                session_id: req.body.laboratory.session_id,
                patient_id: req.body.laboratory.patient_id,
                patient_address: req.body.laboratory.patient_address,
                indication: req.body.laboratory.indication,
                clinical_summary: req.body.laboratory.clinical_summary,
                lmp: req.body.laboratory.lmb,
                parity: req.body.laboratory.parity,
                attended: false,
                title: req.body.title,
                doctor_firstname: req.body.laboratory.doctor_firstname,
                doctor_lastname: req.body.laboratory.doctor_lastname,
                doctor_id: req.body.laboratory.doctor_id,
                doctor_email: req.body.laboratory.doctor_email,
                doctor_profile_url: req.body.laboratory.doctor_profile_url,
                test_id: req.body.laboratory.test_id
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


            if(result.presence){
              io.sockets.to(result.user_id).emit("center notification",refNotification)
            } 

            //result.referral.push(refObj);
            var referral = new model.referral(refObj);
            referral.save(function(err,info){
              if(err) throw err;
              console.log("referral saved")
            })
            result.diagnostic_center_notification.unshift(refNotification);

            result.save(function(err,info){
              if(err) throw err;            
            });
            tellPatient(centerObj);
          } else {
            res.json({error: true,message: "Center not found!"})
          }
        });

        var tellPatient = function(centerInfo){
          //remember sms will be sent to the patient
          model.user.findOne({user_id: req.body.laboratory.patient_id},{medical_records: 1,
            user_id:1,phone:1,accepted_doctors:1})
          .exec(function(err,record){
            if(err) throw err;     
            var recordObj = {
              test_to_run: referredTest,//req.body.laboratory.test_to_run,
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
              referral_id: req.user.user_id,
              referral_title: req.user.title,
              sent_date: req.body.date,
              session_id: req.body.session_id,
              report: "Pending",
              conclusion: "Pending"
            }

            if(record.presence){
              io.sockets.to(record.user_id).emit("notification",{status:true,message: "You have new unread test to run."});
            }
          
            var msgBody = "Your test was referred to " + centerInfo.name + "\n@ " + centerInfo.address + " " + centerInfo.city + " " +
            centerInfo.country + "\nBy " + req.user.name + "\nTest Ref NO is " + req.body.ref_id + "\nFor more details visit https://applinic.com/user/patient"
            var phoneNunber =  record.phone;
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            )        

            record.medical_records.laboratory_test.unshift(recordObj);

            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              

              model.referral.findOne({ref_id: originalRef,center_id: req.user.user_id})
              .exec(function(err,ref){
                if(err) throw err;
                if(ref){
                  centerInfo.referredTests = referredTest;
                  centerInfo.ref_id = req.body.ref_id;
                  ref.redirect_to.push(centerInfo);
                  //ref.laboratory.test_to_run = unRefered;;
                  ref.save(function(err,info){});
                  res.json({success:true,ref_no:req.body.ref_id,redirect_to: ref.redirect_to});
                } else {
                  res.json({success:true,ref_no:req.body.ref_id,redirect_to: []});
                }
              })

            });

          });
        }

      } else {
        res.end({error: true, message: "Out of session"})
      }
    });


    //radiology continued

    router.get("/user/radiology/find-patient/scan-test",function(req,res){
      if(req.user){  

        var criteria = {center_id: req.user.user_id};

        if(req.query.from){           
          var startDate = moment(req.query.from).startOf('day'); // set to 12:00 am today
          var endDate = moment(req.query.to).endOf('day'); // set to 23:59 pm off date range
          criteria['date'] = {$gt: startDate,$lt: endDate};
        }

        if(req.query.refId) {
          var intRegex = /[0-9 -()+]+$/;
          if(intRegex.test(req.query.refId))
            criteria['ref_id'] = req.query.refId;
        }

        if(req.query.patienPhone) {
          criteria['radiology.patient_phone'] = req.query.patienPhone;
        }

        model.referral.find(criteria)
        .exec(function(err,referralList){
          if(err) throw err;
          res.json(referralList)
        });

        /*model.user.findOne({user_id:req.user.user_id},{referral:1},function(err,data){
            if (err) throw err;           
              switch(req.body.criteria) {
                case "refIdCriteria":
                  var toNum = parseInt(req.body.ref_id);                
                  var elementPos = data.referral.map(function(x) {return x.ref_id; }).indexOf(toNum);
                  var objectFound = data.referral[elementPos];
                  if(objectFound === undefined) {
                   res.send({error: "Patient test not found"})
                  } else {
                    res.json([objectFound]);
                  }
                  break;

                case "phoneCriteria":
                  var sendArr = [];
                  var phone = "+" + req.body.phone;
                  for(var i = 0; i < data.referral.length; i++) {
                    if(data.referral[i].radiology.patient_phone === phone ) {
                      sendArr.push(data.referral[i]);
                    }
                  }
                  res.json(sendArr)
                  
                  break;

                default:
                  res.send([]);
                  break;
              } 
        });*/
      } else {
        res.end("Unauthorized access");
      }

    });

//doctor activities for radiology centers.
  router.get("/user/doctor/find-radiology",function(req,res){
      if(req.user){
        req.query.city = (req.query.city) ? req.query.city : req.user.city;
        var str = new RegExp(req.query.city.replace(/\s+/g,"\\s+"), "gi"); 
        var criteria = {city: { $regex: str, $options: 'i' },type:"Radiology"}
        model.user.find(criteria,
          {name:1,address:1,user_id:1,city:1,country:1,profile_pic_url:1,type:1,email:1,phone:1},
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
          var random = randos.genRef(7);
          var testId = randos.genRef(8); 
          var accNo = randos.genRef(8);
          var date = + new Date();


        if(req.body.isOutPatientReq){
          req.body.treatment = {};
          //req.body.date = new Date();
          req.body.user_id = req.body.centerDetails.user_id;
          req.body.patient_id = req.body.patientDetails.user_id;
          req.body.patient_firstname = req.body.patientDetails.firstname; 
          req.body.patient_lastname = req.body.patientDetails.lastname;
          req.body.patient_title = req.body.patientDetails.title;
          req.body.phone = req.body.patientDetails.phone;
          req.body.patient_address = req.body.patientDetails.address;
          req.body.patient_city = req.body.patientDetails.city
          req.body.patient_profilePic = req.body.patientDetails.profile_pic_url
          req.body.radiology = {
            patient_age: req.body.patientDetails.age,
            patient_gender: req.body.patientDetails.gender,
            profile_pic_url: req.body.patientDetails.profile_pic_url
          }

          var elemPos = req.user.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(req.body.patient_id);
          if(elemPos == -1){
            req.user.doctor_patients_list.unshift({
              date: date,
              patient_lastname: req.body.patient_lastname,
              patient_firstname: req.body.patient_firstname,
              patient_id: req.body.patient_id,
              patient_profile_pic_url: req.body.patient_profilePic,
              patient_address: req.body.patient_address || "N/A",
              patient_city: req.body.patient_city,
              patient_country: req.body.patientDetails.country || 'Nigeria',
              patient_gender: req.body.patientDetails.gender,
              patient_age: req.body.patientDetails.age,
              patient_phone: req.body.patientDetails.phone
            })

            req.user.save(function(err,info){
              if(err) throw err;
              console.log("patient save in doctors list")
            })
          }


        }

          
         model.user.findOne({user_id: req.body.user_id},{
          diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1,email:1,profile_pic_url:1})        
        .exec(function(err,result){
          if(err) throw err;        

            // Always check to see if the request came from a session. All investigations requested from a doc must be in session
            model.session.find({doctor_id: req.user.user_id,patient_id: req.body.patient_id})
            .exec(function(err,sessionData){
              if(err) throw err;

              //req.body.session_id = (!req.body.session_id) ?
              //(sessionData[sessionData.length -1]) ?
              //sessionData[sessionData.length - 1].session_id : uuid.v1() : req.body.session_id;

              if(!req.body.session_id && sessionData.length > 0) {
                req.body.session_id = sessionData[sessionData.length - 1].session_id;
              } else {
                req.body.session_id = (req.body.session_id) ? req.body.session_id : uuid.v1();
              }


              if(req.body._id){
                delete req.body._id
              }

              
            
              req.body.center_name = result.name;
              req.body.center_address = result.address;
              req.body.center_city = result.city;
              req.body.center_phone = result.phone;
              req.body.center_email = result.email;
              req.body.center_profile_pic_url = result.profile_pic_url;

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
                referral_email: req.user.email,
                referral_phone: req.user.phone,
                referral_id: req.user.user_id, 
                acc_no: accNo,   
                date: req.body.date || new Date(),  
                center_id: result.user_id,      
                radiology: {
                  history: req.body.history,
                  patient_age: req.body.radiology.patient_age,              
                  patient_gender: req.body.radiology.patient_gender,
                  test_to_run : req.body.lab_test_list,
                  patient_firstname: req.body.patient_firstname,
                  patient_lastname: req.body.patient_lastname,
                  patient_profile_pic_url: req.body.patient_profilePic || req.body.profile_pic_url,
                  patient_title: req.body.patient_title,
                  patient_phone: req.body.phone,
                  session_id: req.body.session_id,
                  patient_id: req.body.patient_id,
                  test_id: testId,
                  patient_address: req.body.patient_address,
                  indication: req.body.treatment.indication || req.body.indication,
                  clinical_summary: req.body.treatment.clinical_summary || req.body.clinical_summary,
                  lmp: req.body.treatment.lmb || req.body.lmb,
                  parity: req.body.treatment.parity || req.body.parity,
                  attended: false,
                  acc_no: accNo,
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
                message: "Please run the test for my patient",
                viewed: false
              }

              if(result.presence === true){
                io.sockets.to(result.user_id).emit("center notification",refNotification);
              } /*else {
                var msgBody = "You have new test request! Visit http://applinic.com/login"
                var phoneNunber =  result.phone;
                sms.messages.create(
                  {
                    to: phoneNunber,
                    from: '+16467985692',
                    body: msgBody,
                  }
                ) 
              */
              //result.referral.push(refObj);
              var referral = new model.referral(refObj);
              referral.save(function(err,info){
                if(err) throw err;
                console.log("referral saved")
              })
              result.diagnostic_center_notification.unshift(refNotification);

              result.save(function(err,info){
                if(err) throw err;            
              });
              tellPatient(centerObj);
            })
        });

        var tellPatient = function(centerInfo){
          //remember sms will be sent to the patient
          model.user.findOne({user_id: req.body.patient_id},
            {medical_records: 1,user_id:1,patient_notification:1,presence:1,phone:1,accepted_doctors:1})
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
              acc_no: accNo,
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
              message: "You have unread pending radiology test"
            }

            if(record.presence === true)
              io.sockets.to(record.user_id).emit("notification",{status:true,message: "You have new unread test to run."});
          
            var msgBody = "Your radiology test was referred to " + centerInfo.name + "\n@ " + centerInfo.address + " " + centerInfo.city + " " +
            centerInfo.country + "\nBy " + req.user.name + "\nTest Ref No " + random + "\nFor more details visit https://applinic.com/user/patient"
            var phoneNunber =  record.phone;
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            ) 
        
            record.patient_notification.unshift(noteObj);
            record.medical_records.radiology_test.unshift(recordObj);

            if(req.user.type === "Doctor" && req.body.isOutPatientReq){
              var docPos = record.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(req.user.user_id);
              if(docPos === -1){
                record.accepted_doctors.unshift({
                  doctor_id: req.user.user_id,
                  doctor_title: req.user.title,
                  date_of_acceptance: date,
                  doctor_firstname: req.user.firstname,
                  doctor_lastname: req.user.lastname,
                  doctor_profile_pic_url: req.user.profile_pic_url,                  
                  doctor_specialty: req.user.specialty,
                  work_place: req.user.work_place,
                })
              }
            }
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
          var testResult = {
            test_to_run: req.body.lab_test_list,
            receive_date: "Pending",
            sent_date: req.body.date,
            report: "Pending",
            test_id: testId,
            conclusion: "Pending",
            sub_session_id: req.body.sub_session_id,
            indication: req.body.indication,
            test_ran_by: req.body.center_name,
            center_address: req.body.center_address,
            center_city: req.body.center_city,
            center_phone: req.body.center_phone,
            center_email: req.body.center_email,
            center_profile_pic_url: req.body.center_profile_pic_url,
          }       
          
            //var objFound = (sessionData[0]) ? sessionData[0] : null;
          model.session.findOne({session_id: session_id})
          .exec(function(err, objFound){
            if(err) throw err;

            if(req.body._id)
              delete req.body._id;
          
            if(objFound) {

              if(req.body.subSession) {
                var subList = objFound.diagnosis.sub_session;
                var subPos = subList.map(function(x){return x.sub_session_id}).indexOf(req.body.sub_session_id);
                if(subPos === -1) {
                  subList.push({
                    date: date,
                    note: "",
                    sub_session_id: req.body.sub_session_id
                  })
                }
                                
              }        
               
              objFound.last_modified = + new Date();

              objFound.diagnosis.radiology_test_results.unshift(testResult); 

              objFound.save(function(err,info){
                if(err) throw err;
                console.log("OK! updated")
              })
              

          } else {             

              var complainObj = {
                presenting_complain: req.body.treatment.complain,
                history_of_presenting_complain: req.body.treatment.historyOfComplain,
                past_medical_history: req.body.treatment.pastMedicalHistory,
                social_history: req.body.treatment.socialHistory,
                family_history: req.body.treatment.familyHistory,
                drug_history: req.body.treatment.drugHistory,
                summary: req.body.treatment.summary,
                notes: req.body.treatment.notes,
                provisional_diagnosis: req.body.treatment.provisionalDiagnosis,
              }

              req.body.profilePic = req.body.patient_profilePic;
              req.body.last_modified = req.body.date;
              req.body.prescription_id = req.body.prescriptionId;
              req.body.doctor_id = req.user.user_id;


              //session introduced on 12/12/2019 instated of storiing sessions in "doctor_patients_session array"
          
              var record = new model.session(req.body)
              record.diagnosis = complainObj;


              if(req.body.subSession) {
                var subList = record.diagnosis.sub_session;
                var subPos = subList.map(function(x){return x.sub_session_id}).indexOf(req.body.sub_session_id);
                if(subPos === -1) {
                  subList.push({
                    date: date,
                    note: "",
                    sub_session_id: req.body.sub_session_id
                  })
                }
              }               
              record.diagnosis.radiology_test_results.unshift(testResult);

              record.save(function(err,info){
                if(err) throw err;
                console.log("OK! created")
              })

          }

         });
        
        }
      } else {
        res.end("Unauthorized access!")
      }
    });


  


    //this route takes care of  un ran test which was forwarded to another center by a center.
    router.post("/user/center/radiology/send-test",function(req,res){ 
      if(req.user) {

        var originalRef = req.body.ref_id;
        req.body.ref_id = randos.genRef(6);
        req.body.date = new Date();
        var originalTest = req.body.radiology.test_to_run;
        var referredTest = [];
        var unRefered = [];

        model.user.findOne({user_id: req.body.user_id},
        {diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1})
        .exec(function(err,result){
          if(err) throw err; 

          if(result) {          

            for(var i = 0; i < originalTest.length; i++){
              if(originalTest[i].select == true){
                referredTest.push(originalTest[i]);
              } else {
                unRefered.push(originalTest[i])
              }
            }

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
              referral_firstname: req.user.firstname || req.user.name,
              referral_lastname: req.user.lastname || "",
              referral_title: req.user.title || "",
              referral_id: req.user.user_id,
              referral_email: req.user.email,
              referral_phone: req.user.phone,    
              date: req.body.date,
              center_id: result.user_id,             
              radiology: {              
                history: req.body.radiology.history,
                patient_age: req.body.radiology.patient_age,
                patient_gender: req.body.radiology.patient_gender,
                test_to_run : referredTest,//req.body.laboratory.test_to_run,
                patient_firstname: req.body.radiology.patient_firstname,
                patient_lastname: req.body.radiology.patient_lastname,
                patient_profile_pic_url: req.body.radiology.patient_profilePic,
                patient_title: req.body.radiology.patient_title,
                patient_phone: req.body.radiology.patient_phone,
                session_id: req.body.radiology.session_id,
                patient_id: req.body.radiology.patient_id,
                patient_address: req.body.radiology.patient_address,
                indication: req.body.radiology.indication,
                clinical_summary: req.body.radiology.clinical_summary,
                lmp: req.body.radiology.lmb,
                parity: req.body.radiology.parity,
                attended: false,
                title: req.body.title,
                doctor_firstname: req.body.radiology.doctor_firstname,
                doctor_lastname: req.body.radiology.doctor_lastname,
                doctor_id: req.body.radiology.doctor_id,
                doctor_email: req.body.radiology.doctor_email,
                doctor_profile_url: req.body.radiology.doctor_profile_url,
                test_id: req.body.radiology.test_id
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


            if(result.presence){
              io.sockets.to(result.user_id).emit("center notification",refNotification)
            } 

            //result.referral.push(refObj);
            var referral = new model.referral(refObj);
            referral.save(function(err,info){
              if(err) throw err;
              console.log("referral saved")
            })
            result.diagnostic_center_notification.unshift(refNotification);

            result.save(function(err,info){
              if(err) throw err;            
            });
            tellPatient(centerObj);
          } else {
            res.json({error: true,message: "Center not found!"})
          }
        });

        var tellPatient = function(centerInfo){
          //remember sms will be sent to the patient
          model.user.findOne({user_id: req.body.radiology.patient_id},{medical_records: 1,user_id:1,phone:1})
          .exec(function(err,record){
            if(err) throw err;     
            var recordObj = {
              test_to_run: referredTest,//req.body.laboratory.test_to_run,
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
              referral_id: req.user.user_id,
              referral_title: req.user.title,
              sent_date: req.body.date,
              session_id: req.body.session_id,
              report: "Pending",
              conclusion: "Pending"
            }

            if(record.presence){
              io.sockets.to(record.user_id).emit("notification",{status:true,message: "You have new unread test to run."});
            }
          
            var msgBody = "Your test was referred to " + centerInfo.name + "\n@ " + centerInfo.address + " " + centerInfo.city + " " +
            centerInfo.country + "\nBy " + req.user.name + "\nTest Ref NO " + req.body.ref_id + "\nFor more details visit https://applinic.com/user/patient"
            var phoneNunber =  record.phone;
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            )        

            record.medical_records.radiology_test.unshift(recordObj);

            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              

              model.referral.findOne({ref_id: originalRef,center_id: req.user.user_id})
              .exec(function(err,ref){
                if(err) throw err;
                if(ref){
                  centerInfo.referredTests = referredTest;
                  centerInfo.ref_id = req.body.ref_id;
                  ref.redirect_to.push(centerInfo);
                  //ref.laboratory.test_to_run = unRefered;
                  ref.save(function(err,info){});
                  res.json({success:true,ref_no:req.body.ref_id,redirect_to: ref.redirect_to});
                } else {
                  res.json({success:true,ref_no:req.body.ref_id,redirect_to: []}); //test_to_run:unRefered
                }
              })

            });

          });
        }

      } else {
        res.end({error: true, message: "Out of session"})
      }

    });  

    router.put("/user/doctor/treatment-plan",function(req,res){
      if(req.user) {
        model.user.findOne({user_id: req.user.user_id},{doctor_patient_session:1}).exec(function(err,data){
            if(err) throw err; 

            var elementPos = data.doctor_patient_session.map(function(x) {return x.session_id; }).indexOf(req.body.session_id);
            if(elementPos !== -1) {
              var objFound = data.doctor_patient_session[elementPos];                      
              objFound.diagnosis.treatment_plan = req.body.treatmentPlan;
            } else {
              var complainObj = {
                presenting_complain: req.body.complain,
                history_of_presenting_complain: req.body.historyOfComplain,
                past_medical_history: req.body.pastMedicalHistory,
                social_history: req.body.socialHistory,
                family_history: req.body.familyHistory,
                drug_history: req.body.drugHistory,
                summary: req.body.summary,
                notes: req.body.notes,
                provisional_diagnosis: req.body.provisionalDiagnosis,
                treatment_plan: req.body.treatmentPlan
              }


              req.body.profilePic = req.body.patient.patient_profile_pic_url;
              req.body.last_modified = req.body.date;
              req.body.patient_firstname = req.body.patient.firstname;
              req.body.patient_lastname = req.body.patient.lastname;
              req.body.patient_username = req.body.patient.username;
              data.doctor_patient_session.unshift(req.body);
              var record = data.doctor_patient_session[0];
              record.diagnosis =  complainObj;
            }

            data.save(function(err,info){
              if(err) throw err;
              console.log("OK!")
            });

            res.json({success: true});
          });
      } else {
        res.end("unauthorized access!");
      }
    })

    router.get("/user/patient/get-centers",function(req,res){
      if(req.user){
         var type = req.query.type;
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
        res.send("unauthorized access!");
      }
    });

    router.put("/user/patient/get-centers",function(req,res){
      if(req.user) {
        
        var date = new Date();
        req.body.refId = req.body.refId.toString();
        var refObj = {
          ref_id: req.body.refId,
          referral_firstname: req.user.firstname,
          referral_lastname: req.user.lastname,
          referral_title: req.user.title,
          referral_id: req.user.user_id,    
          date: date, 
        }

        var toLower = req.body.type.toLowerCase(); // the lower case was how it saved in the database.

        model.referral.findOne({ref_id:req.body.refId},function(err,data){
          if(err) throw err;
          if(data) {
            //var refList = data;
            //var elemPos = refList.map(function(x){return x.ref_id}).indexOf(req.body.refId);
            //if(elemPos !== -1){
              var found = data;
              
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
            var msgBody = "You have new test request! Visit http://applinic.com/login";
            var phoneNunber =  result.phone;
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            ) 
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
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            ) */
        
            if(toLower === "radiology")
              record.medical_records.radiology_test.unshift(recordObj);
            if(toLower === "laboratory")
               record.medical_records.laboratory_test.unshift(recordObj);
            record.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              res.send({message: "Success! Investigation has been referred to another center",status:true})
            });

          });
          }
        }

      } else {
        res.send("unauthorized access!")
      }
    });


    router.get("/user/doctor/notifications",function(req,res){
      if(req.user){
        var data = req.user.doctor_notification || [];
        res.send(data);
      } else {
        res.end("Unauthorized access!!!");
      }
    });
    

   
    //patients get notifications/messages/appointments
    router.get("/user/patient/notifications",function(req,res){
      if(req.user){
        /*model.user.findOne({user_id: req.user.user_id},{patient_notification:1},function(err,data){
          if(err) throw err;
          if(data){
            
          } else {
            res.send([]);
          }
        });*/
        var data = req.user.patient_notification || [];
        res.send(data);
      } else {
        res.end("Unauthorized access!!!");
      }
    });

    router.get("/user/patient/get-message",function(req,res){
      if(req.user){
        /*model.user.findOne({user_id: req.user.user_id},{patient_mail: 1},function(err,data){
          if(data){
            
          } else {
            res.send([]);
          }
        });*/

        var data = req.user.patient_mail || [];
        res.send(data);
      } else {
        res.end("Unauthorized access");
      }
    });

    router.get("/user/center/notification",function(req,res){
      if(req.user) {
        /*model.user.findOne({user_id:req.user.user_id},{diagnostic_center_notification:1},function(err,data){
          if(err) throw err;
          if(data){
            res.send(data.diagnostic_center_notification);
          } else {
            res.send([]);
          }
        })*/
        var data = req.user.diagnostic_center_notification || [];
        res.send(data);
      } else {
        res.end("Unauthorized access");
      }
    });

    router.delete("/user/center/delete-notification",function(req,res){
      if(req.user){        
        model.user.findOne({user_id: req.user.user_id},{diagnostic_center_notification:1}).exec(function(err,data){
          if(err) throw err;
          req.body.forEach(function(note){
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
            profile_url: req.user.profile_url,
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
       
        sms.messages.create(
          {
            to: phoneNunber,
            from: '+16467985692',
            body: msgBody,
          }
        ) 

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
        console.log(user)
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
          profile_url: req.user.profile_url,
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
      sms.messages.create(
        {
          to: phoneNunber,
          from: '+16467985692',
          body: msgBody,
        }
      ) 
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
          console.log(data)
          if(data) {
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
          } else {
            res.send({message: "failed"})
          }      
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
          profile_url: req.user.profile_url,
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
            console.log(serviceList[elementPos], "========", test);
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
       sms.messages.create(
          {
            to: phoneNunber,
            from: '+16467985692',
            body: msgBody,
          }
        ) 
      
      res.send({message: "Saved!"});
      } else {
        res.send("authorized access!")
      }

     });

    
    router.get("/user/pharmacy/not-ran-services",function(req,res){
      if(req.user){
        var creteria = (req.query.centerId) ? {user_id: req.query.centerId}: {user_id: req.user.user_id};
        model.services.findOne(creteria,{unavailable_services:1,_id:0},function(err,data){
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
              /*var elemPos = data.test_list.map(function(x){return x.name}).indexOf("OBINNA SIT DOWN DRUG")
              if(elemPos !== -1){
                data.test_list.splice(elemPos,1)
                data.save(function(err,info){})
              }*/
              res.json(data.test_list);
            }
    
          });

      } else {
        res.send("unauthorized access!");
      }
    });

    router.post("/user/dynamic-service",function(req,res){
      if(req.user && req.body){
        if(req.user.type !== "Doctor" || req.user.type !== "Patient")
          model.services.findOne({user_id:req.user.user_id}).exec(function(err,user){
            if(err) throw err;
            if(!user){
              createUser();
              updateDynaService();
            } else {
              updateDynaService();
            }
          });
        else
          res.json({message: "You are not authorized to add service",status:false});

        var date = + new Date();
        function createUser() {
          var user = new model.services({
            center_name: req.user.name,
            center_address: req.user.address,
            center_city:  req.user.city,
            center_country: req.user.country,
            center_phone: req.user.phone,
            user_id: req.user.user_id,
            profile_url: req.user.profile_url,
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
          //var date = + new Date();
          var random = randos.genRef(6);
          var testId = randos.genRef(8);

          var test = {
            center_id: req.user.user_id,
            date_created: date,
            name: req.body.name,
            id: testId,
            val: true
          }

          model.dynaService.findOne({type:req.user.type}).exec(function(err,result){
            if(err) {
              res.send({message: "Error occured while saving service. Please try again"});
              console.log(err);
            }

            if(result) {

              result.test_list.push(test);             

              console.log(test)
              result.save(function(){
               console.log("saved!");
              })


              //mark the updator to prevent modal showing in the client
             /* model.user.findOne({user_id: req.user.user_id})
              .exec(function(err,user){
                if(!user.stock_update.status) {
                  user.stock_update.status = false
                  user.save(function(err,info){})
                }
              })*/


              model.user.updateMany({"stock_update.status": false,type: req.user.type},
                {$set:{"stock_update.type":req.user.type,"stock_update.status": true,"stock_update.last_updated":date}},
                function(err,info){
                  console.log("error", err)
                  console.log("info", info)
              });

              model.services.find({type: req.user.type})
              .exec(function(err,data){
                if(err) throw err;
                data.forEach(function(item){
                  if(item.user_id !== req.user.user_id) {
                    test.val = false;
                    item.unavailable_services.push(test);
                    item.save(function(){})
                  }
                });

                res.send({message: "Service updated successfully!"});
              })


             

            } else {
              res.send({message: "Error. service not found"});
            }
            

          });
        }

      } else {
        res.send("unauthorized access!");
      }
    });


    router.put("/user/dynamic-service",function(req,res){
      if(req.user) {
        console.log(req.body)
        
        model.services.findOne({type: req.user.type,user_id: req.user.user_id})
        .exec(function(err,data){
          if(err) throw err;
          var elemPos;
          if(data) {
            req.body.forEach(function(item){
              elemPos = data.unavailable_services.map(function(x){return x.id}).indexOf(item.id);
              if(elemPos !== -1){
                data.unavailable_services.splice(elemPos,1);
                data.save(function(err,info){});
                model.user.findOne({user_id: req.user.user_id})
                .exec(function(err,user){
                  user.stock_update.status = false;
                  user.save(function(err,info){})
                })
              }
            });
            res.json({status:true,message: "Service successfully updated!"})
         } else {
           res.json({status: false,message:"Service not found, service not updated."})
         }
          
        });
      } else {
        res.end("unauthorized access!");
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
      console.log(req.body);
      var criteria = (req.body.city) ? {type:"Pharmacy",center_city:req.body.city} : {type: "Pharmacy"};
      model.services.find(criteria,
        {center_name:1,center_city:1,center_address:1,center_country:1,center_phone:1,user_id:1,
        unavailable_services:1,_id:0,center_email:1},function(err,data){
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
              var el = elements[count].map(function(x){return x.center_id}).indexOf(data[count].user_id);
              centerInfo.center_name = data[count].center_name;
              centerInfo.center_city = data[count].center_city;
              centerInfo.center_country = data[count].center_country;
              centerInfo.center_city = data[count].center_city;
              centerInfo.center_id = data[count].user_id;
              centerInfo.center_address = data[count].center_address;
              centerInfo.center_phone = data[count].center_phone;
              centerInfo.center_email = data[count].center_email;
              centerInfo.drugFound = listOfDrugs[i].name;  
              centerInfo.addBy = (elements[count][el]) ? elements[count][el].center_id : undefined;// the id of center that added the drugs           
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
              filter[sendObj[i][j].center_id].email = sendObj[i][j].center_email;
              filter[sendObj[i][j].center_id].str = sendObj[i][j].drugFound;
              filter[sendObj[i][j].center_id].addBy = sendObj[i][j].addBy;
            } else {
              filter[sendObj[i][j].center_id].str += "," + sendObj[i][j].drugFound;
              filter[sendObj[i][j].center_id].count++;
            }
          }
        }
        
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
    var phone = req.body.line || req.body.phone;
    var person = (req.body.type == 'inperson') ? {user_id: req.user.user_id} : {phone: phone}
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
        user_id: 1,
        accepted_doctors:1
      })
    .exec(function(err,user){     
      if(err) throw err;
      if(!user && req.body.phone !== undefined) {
        /*res.json({
          message: "User not found. Please ensure this person was registered with this "  
          + req.body.phone + " or user is not a patient.",error:true});*/
        if(req.user.type !== "Doctor"){
          res.send({message:"The user with phone number does not exist.",error:true});
        } else {
          res.json({isNewPatient: true})
        }

      } else {
        model.user.findOne({user_id: req.body.user_id},{
        referral:1,diagnostic_center_notification:1,city:1,name:1,country:1,center_phone:1,address:1,user_id:1,presence:1,phone:1})
        .exec(function(err,pharmacy){         
          if(err) throw err;

          if(pharmacy) {

            var ref_id;

            if(req.body.ref_id){            
              ref_id = req.body.ref_id;
            }  else {        
              ref_id = randos.genRef(7);
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
            req.body.patient_phone = user.phone;
            req.body.patient_gender = user.gender;
            req.body.patient_address = user.address;
            req.body.patient_id = user.user_id;
            req.body.is_paid = 0;
            req.body.detail = {
              amount: 0,
              date: null
            };      
            

            var refObj = {
              ref_id: ref_id,
              referral_firstname: req.user.firstname || req.user.name,
              referral_lastname: req.user.lastname,
              referral_title: req.user.title,
              referral_id: req.user.user_id,    
              date: req.body.sent_date,
              center_id: pharmacy.user_id,
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

            if(pharmacy.presence === true && !req.body.initViaCourier){
              io.sockets.to(pharmacy.user_id).emit("center notification",pharmacyNotification)
            } 
           
            var preObj = {              
              provisional_diagnosis: req.body.provisional_diagnosis,
              explanation: req.body.explanation,
              date: req.body.sent_date,
              prescriptionId: req.body.prescriptionId,
              doctor_firstname: (req.user.firstname || req.user.name),
              title: req.user.title,
              doctor_lastname: req.user.lastname,
              doctor_address: req.user.address,   
              doctor_id: (req.user.type == "Doctor") ? req.user.user_id : "",
              doctor_work_place: (req.user.type == "Doctor") ?  req.user.work_place : "",
              doctor_city: (req.user.type == "Doctor") ? req.user.city : "",
              doctor_country: (req.user.type == "Doctor") ? req.user.country : "",
              lab_analysis: req.body.lab_analysis,
              scan_analysis: req.body.scan_analysis,
              doctor_profile_pic_url: (req.user.type == "Doctor") ? req.user.profile_pic_url : "",
              patient_id : req.body.patient_id || user.user_id,
              patient_profile_pic_url: req.body.patient_profile_pic_url || user.profile_pic_url,
              patient_firstname: req.body.firstname || user.firstname,
              patient_lastname: req.body.lastname || user.lastname,
              patient_address: req.body.address || user.address,
              patient_gender: req.body.gender || user.gender,
              patient_age: req.body.age || user.age,
              patient_city: req.body.city || user.city,
              patient_country: req.body.country || user.country,
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
              phone: pharmacy.phone,
              prescriptionId: req.body.prescriptionId
            };

            if(!req.body.ref_id || req.body.initViaCourier){
              user.medications.push(preObj);
            }
            
            user.prescription_tracking.unshift(track_record);

            if(req.user.type === "Doctor"){
              var docPos = user.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(req.user.user_id);
              if(docPos == -1){
                user.accepted_doctors.unshift({
                  doctor_id: req.user.user_id,
                  doctor_title: req.user.title,
                  date_of_acceptance: new Date(),
                  doctor_firstname: req.user.firstname,
                  doctor_lastname: req.user.lastname,
                  doctor_profile_pic_url: req.user.profile_pic_url,                  
                  doctor_specialty: req.user.specialty,
                  work_place: req.user.work_place,
                });
              }
            }
             

            //send sms to the patient for the ntification of prescription
            var msgBody = "Your prescription was sent to " +  "\n" + pharmacy.name + "\n" + pharmacy.address +
            ", " + pharmacy.city + ", " + pharmacy.country + "\nreference number is " +
            " " + ref_id + "\nfor more details login https://applinic.com/login";
            var phoneNunber =  user.phone;

            if(!req.body.initViaCourier) {
              sms.messages.create(
                {
                  to: phoneNunber,
                  from: '+16467985692',
                  body: msgBody,
                }
              ) 
            }

            //pharmacy.referral.push(refObj);
            
            var referral = new model.referral(refObj);
            referral.save(function(err,info){
              if(err) throw err;
              console.log("referral saved");
            }); 

            if(!req.body.initViaCourier) {
              pharmacy.diagnostic_center_notification.unshift(pharmacyNotification);
            } else {
              if(pharmacy.presence === true)
                io.sockets.to(pharmacy.user_id).emit("receiver courier",{subType: true,message: "You have new courier request."});
            }

            pharmacy.save(function(err,info){
              if(err) throw err;
            });


            user.save(function(err,info){
              if(err) throw err;
              console.log("patient saved")
            });

            res.json({success:true,ref_id: ref_id,
              patient:{firstname:req.body.patient_firstname,
                title: req.body.patient_title,lastname: req.body.patient_lastname}}); 

             //add patient to doctor list if does not exist
            var elemPos = req.user.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(user.user_id);
            if(elemPos == -1){
              req.user.doctor_patients_list.unshift({
                date: req.body.sent_date,
                patient_lastname: user.lastname,
                patient_firstname: user.firstname,
                patient_id: user.user_id,
                patient_profile_pic_url: user.profile_pic_url,
                patient_address: user.address || "N/A",
                patient_city: user.city,
                patient_country: user.country || 'Nigeria',
                patient_gender: user.gender,
                patient_age: user.age,
                patient_phone: user.phone
              })

              req.user.save(function(err,info){
                if(err) throw err;
                console.log("patient save in doctors list")
              })
            }
            
          } else {
            res.json({success:false,message:"Something went wrong."}); 
          }

        });
           
      }

    });

   } else {
    res.end("Unauthorized access!")
   }
  });

router.post("/user/need-help",function(req,res){
  if(req.user) {
     /*var help = new model.needHelp({
        user_id: req.user.user_id,
        message: req.body.description,
        name: (req.user.lastname) ? req.user.title + " " + req.user.firstname + " " + req.user.lastname : req.user.name,
        phone: req.user.phone
     });

     help.save(function(err,info){
      if(err) {
        res.json({status: false})
      } else {
        res.json({status: true});
      }
      
    });*/

    var names = req.user.name || ( req.user.title + ' ' + req.user.lastname + ' ' + req.user.firstname)

    var mailOptions = {
      from: 'Applinic info@applinic.com',
      to: "info@applinic.com",
      subject: 'Need Help from ' + names,
      html: '<table><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' 
      + ",</b><br><br>"
      + names + " a "  + req.user.type + " on Applinic with phone number " + req.user.phone 
      + " sends the following comlaint to admin  as qouted below: <br><br>" 
      + req.body.description
      + "<br><br>"
      + "Please attend.<br></br>"
      + "</td></tr></table>"
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.json({status: false})
      } else {
        console.log('Email sent: ' + info.response);
        res.json({status: true});
      }
    });

  } else {
    res.end("unauthorized access!")
  }
})


//for lab test search
router.put("/user/laboratory/search/find-tests",function(req,res){
  if(req.user && req.body.city === undefined)
    req.body.city = req.user.city;
  model.services.find({type:"Laboratory",center_city:req.body.city},
    {center_name:1,center_city:1,center_address:1,center_country:1,user_id:1,unavailable_services:1,center_phone:1,_id:0,profile_url:1},function(err,data){
    if(err) throw err;
    if(data) {
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
            var el = elements[count].map(function(x){return x.center_id}).indexOf(data[count].user_id);                   
            centerInfo.center_name = data[count].center_name;
            centerInfo.center_city = data[count].center_city;
            centerInfo.center_country = data[count].center_country;
            centerInfo.center_city = data[count].center_city;
            centerInfo.center_phone = data[count].center_phone;
            centerInfo.center_id = data[count].user_id;
            centerInfo.center_address = data[count].center_address;
            centerInfo.testFound = listOfTests[i].name;  
            centerInfo.addBy = (elements[count][el]) ? elements[count][el].center_id : undefined;            
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
            filter[sendObj[i][j].center_id].addBy = sendObj[i][j].addBy;
          } else {
            filter[sendObj[i][j].center_id].str += "," + sendObj[i][j].testFound;
            filter[sendObj[i][j].center_id].count++;
          }
        }
      }
     

      /*Array.prototype.diff = function(arr2) {
        var ret = [];
        this.sort();
        arr2.sort();
        for(var i = 0; i < this.length; i += 1) {
            if(arr2.indexOf( this[i].name ) === -1){
                ret.push( this[i] );
            }
        }
        return ret;
      };*/

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
    } else {
      var sub = {};
      sub['full'] = []
      sub['less'] = [];
      res.send(sub);
    }
  });

});

router.put("/user/test-search/laboratory/referral",function(req,res){
    if(req.user){  
    var phone = req.body.line  || req.body.phone;
    var person = (req.body.type === 'inperson') ? {user_id: req.user.user_id} : {phone: phone};
    model.user.findOne(person,{firstname:1,lastname:1,title:1,profile_pic_url:1,city:1,country:1,name:1,age:1,user_id:1,medical_records:1,phone:1,type:1,gender:1,address:1})
    .exec(function(err,user){

      if(err) throw err;

      if(user) {        

        if(user.type == "Patient"){

          req.body.ref_id = randos.genRef(7);
          req.body.session_id = uuid.v1();
          var testId = randos.genRef(8);
          var isDoctor = (req.user.type === "Doctor") ? true : false;

          model.user.findOne({user_id: req.body.user_id},{
            diagnostic_center_notification:1,referral:1,address:1,name:1,city:1,country:1,phone:1,user_id:1,presence:1,age:1,profile_pic_url:1,email:1})
          .exec(function(err,result){
          var firstname = user.firstname || user.name;

          try{

          var refObj = {
            ref_id: req.body.ref_id,
            referral_firstname: (req.user.type !== "Patient") ? req.user.name : firstname,
            referral_lastname: (req.user.type !== "Patient") ? null : user.lastname,
            referral_title: (req.user.type !== "Patient") ? null : user.title,
            referral_id: (req.user.type !== "Patient") ? req.user.user_id : user.user_id, 
            referral_id: req.user.user_id, 
            referral_email: req.user.email,
            referral_phone: req.user.phone,      
            date: req.body.sent_date,  
            center_id: result.user_id,          
            laboratory: {
              test_to_run : req.body.test_to_run,
              patient_age: user.age,
              patient_gender: user.gender,
              patient_firstname: user.firstname,
              patient_lastname: user.lastname,
              patient_profile_pic_url: user.profile_pic_url,
              patient_title: user.title,
              patient_phone: user.phone,
              session_id: req.body.session_id,
              patient_id: user.user_id,
              clinical_summary: req.body.clinical_summary,
              indication: req.body.indication,
              lmp: req.body.lmp,
              test_id: testId,
              parity: req.body.parity,
              attended: false,
              title: req.user.title,
              doctor_firstname: (isDoctor) ? req.user.firstname : '',
              doctor_lastname: (isDoctor) ? req.user.lastname : '',
              doctor_id: (isDoctor) ? req.user.user_id : '',
              doctor_email: (isDoctor) ? req.user.email : '',
              doctor_profile_url: (isDoctor) ? req.user.profile_url : ''
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
              message: "Hi, I need your services"
            }

            if(result.presence === true){
              io.sockets.to(result.user_id).emit("center notification",refNotification)
            }


            //var refPos = result.referral.map(function(x){return x.ref_id}).indexOf(req.body.ref_id);
            var referral = new model.referral(refObj);
            referral.save(function(err,info){
              if(err) throw err;
              var sender = (req.user.type == "Doctor" || req.user.type == "Patient") ? (req.user.title + " " + req.user.lastname) : req.user.name
              var msgBody = "Your laboratory test request was sent to " + result.name + " at " +
               result.address + ", " + result.city + " " + result.country + "\nBy " + sender + "\n" + "Ref No " + req.body.ref_id; 
              var phoneNunber =  user.phone;
              sms.messages.create(
                {
                  to: phoneNunber,
                  from: '+16467985692',
                  body: msgBody,
                },
                callBack
              ) 
            });

            var callBack = function(err,info) {
              if(err) {
                console.log(err);
              } else {
                console.log(info);
              }
            }
           
           
            var recordObj = {
              test_to_run: req.body.test_to_run,
              center_address: req.body.address,
              center_city: req.body.city,
              center_country: req.body.country,
              center_name: req.body.name,
              center_phone: result.phone,
              center_id: req.body.id,
              patient_id: user.user_id,
              ref_id: req.body.ref_id,
              referral_firstname: firstname,
              referral_lastname: user.lastname,
              referral_title: user.title,
              sent_date: req.body.sent_date,
              session_id: req.body.session_id,
              report: "Pending",
              conclusion: "Pending"
            }

            user.medical_records.laboratory_test.unshift(recordObj);
            if(req.user.type === "Doctor"){
              var docPos = user.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(req.user.user_id);
              if(docPos == -1){
                user.accepted_doctors.unshift({
                  doctor_id: req.user.user_id,
                  doctor_title: req.user.title,
                  date_of_acceptance: new Date(),
                  doctor_firstname: req.user.firstname,
                  doctor_lastname: req.user.lastname,
                  doctor_profile_pic_url: req.user.profile_pic_url,                  
                  doctor_specialty: req.user.specialty,
                  work_place: req.user.work_place,
                });
              }
            }
             
            user.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
               res.json({success:true,ref_id:req.body.ref_id,refObj: refObj});
            });

            result.diagnostic_center_notification.unshift(refNotification);
            result.save(function(err,info){
              if(err) throw err;          
            });  
          
            /*user.save(function(err,info){
              if(err) throw err;
              console.log("saved!")
            })*/

            if(isDoctor) {

              var complainObj = {}

              /*req.body.profilePic = user.profile_pic_url;
              req.body.last_modified = req.body.sent_date;
              req.body.doctor_id = req.user.user_id;*/

              //data.doctor_patient_session.unshift(req.body);

              var record = new model.session({
                date: req.body.sent_date,
                profilePic: user.profile_pic_url,
                last_modified: req.body.sent_date,
                doctor_id: req.user.user_id,
                session_id: req.body.session_id,
                patient_id: user.user_id,
                patient_firstname: user.firstname,
                patient_lastname: user.lastname,
                typeOfSession: "In-person"
              });

              record.diagnosis =  complainObj; 

              var testResult = {
                test_to_run: req.body.test_to_run,
                receive_date: "Pending",
                sent_date: req.body.sent_date,
                report: "Pending",
                test_id: testId,
                conclusion: "Pending",
                sub_session_id: "",
                indication: req.body.indication,
                clinical_summary: req.body.clinical_summary,
                test_ran_by: result.name,
                center_address: result.address,
                center_city: result.city,
                center_phone: result.phone,
                center_email: result.email,
                center_profile_pic_url: result.profile_pic_url
              }  

              record.diagnosis.laboratory_test_results.unshift(testResult);
              
              record.save(function(err,info){
                if(err) throw err;
                console.log("session created!")
              });

              //add patient to doctor list if does not exist
              var elemPos = req.user.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(user.user_id);
              if(elemPos == -1){
                req.user.doctor_patients_list.unshift({
                  date: req.body.sent_date,
                  patient_lastname: user.lastname,
                  patient_firstname: user.firstname,
                  patient_id: user.user_id,
                  patient_profile_pic_url: user.profile_pic_url,
                  patient_address: user.address || "N/A",
                  patient_city: user.city,
                  patient_country: user.country || 'Nigeria',
                  patient_gender: user.gender,
                  patient_age: user.age,
                  patient_phone: user.phone
                })

                req.user.save(function(err,info){
                  if(err) throw err;
                  console.log("patient save in doctors list")
                })
              }
            }

           } catch(e){
              console.log(e.message)
            }

          })

          } else {
            res.json({message:"User not a patient.",error:true});
          }// end of if user is a patient
     
        } else {

          if(req.user.type !== "Doctor"){
            res.json({message:"The user with phone number does not exist or not a patient.",error:true});
          } else {
            res.json({isNewPatient: true})
          }

        } // end of if user
      
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
    {center_name:1,center_city:1,center_address:1,center_country:1,user_id:1,unavailable_services:1,center_phone:1,_id:0,profile_url:1},function(err,data){
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
          var el = elements[count].map(function(x){return x.center_id}).indexOf(data[count].user_id);          
          centerInfo.center_name = data[count].center_name;
          centerInfo.center_city = data[count].center_city;
          centerInfo.center_country = data[count].center_country;
          centerInfo.center_city = data[count].center_city;
          centerInfo.center_id = data[count].user_id;
          centerInfo.center_address = data[count].center_address;
          centerInfo.center_phone = data[count].center_phone;
          centerInfo.addBy = (elements[count][el]) ? elements[count][el].center_id : undefined;
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
          filter[sendObj[i][j].center_id].addBy = sendObj[i][j].addBy;
        } else {
          filter[sendObj[i][j].center_id].str += "," + sendObj[i][j].testFound;
          filter[sendObj[i][j].center_id].count++;
        }
      }
    }
   

   /* Array.prototype.diff = function(arr2) {
      var ret = [];
      this.sort();
      arr2.sort();
      for(var i = 0; i < this.length; i += 1) {
          if(arr2.indexOf( this[i].name ) === -1){
              ret.push( this[i] );
          }
      }
      return ret;
    };*/

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
    res.send(sub);
  });

});

router.put("/user/scan-search/radiology/referral",function(req,res){
  if(req.user){  

    var phone = req.body.line  || req.body.phone;
    var recepient;

    if(req.body.recepient) {
      var intRegex = /[0-9 -()+]+$/;
      var emailReg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;

      if(emailReg.test(req.body.recepient)){
        recepient = {email: req.body.recepient, type:"Patient"}

      } else {

        if(intRegex.test(req.body.recepient)) {
          if(req.body.recepient[0] == '0'){
            var fix = req.body.recepient.slice(1);
            req.body.recepient = "+234" + fix;
          } else if(req.body.recepient[0] !== '+') {
            req.body.recepient = "+" + req.body.recepient;
          } else {

          }
          
        }

        recepient = {phone: req.body.recepient} 
      }

    } else {
      recepient = {phone: phone}
    }


    var isDoctor = (req.user.type === "Doctor") ? true : false;

    var person = (req.body.type === 'inperson') ? {user_id: req.user.user_id} : recepient;

    model.user.findOne(person,
      {firstname:1,lastname:1,title:1,profile_pic_url:1,city:1,country:1,
      name:1,age:1,user_id:1,medical_records:1,phone:1,type:1,gender:1,address:1})
    .exec(function(err,user){

      if(err) throw err;

      if(user) {

        if(user.type == "Patient"){
          req.body.ref_id = randos.genRef(7);
          var accNo = randos.genRef(7);
          var testId = randos.genRef(8);

          model.user.findOne({user_id: req.body.user_id})
          .exec(function(err,result){

            var firstname = user.firstname || user.name;

         

            if(!req.body.isCommonSearch) { //start of if isCommonSearch          
             //creates accession number for the study
              var acc = new model.accession({
                id: accNo,
                centerId: req.user.user_id,
                date: new Date()
              });

              //create a dicom Study for viewing.
              var locate = ('patientID=' + accNo);
              var ovyWeb = "https://applinic.com/dcm?id=" + accNo;//"https://" + req.body.onlinePacs.dns + "/web/viewer.html?" + locate;

              var ovyMob = "http://" + req.body.onlinePacs.ip_address + ":8080/applinic-dicom/home.html?" + locate;
              var centerUser = req.body.onlinePacs.username;
              var centerPassword = req.body.onlinePacs.password;

              var study = new model.study({
                patient_name: user.firstname + " " + user.lastname,
                patient_id: accNo,
                study_id: accNo,
                center_id: result.user_id,
                center_name: result.name,
                center_address: result.address,
                center_city: result.city,
                center_country: result.country,
                center_phone: result.phone,
                center_email: result.email,
                created: new Date(),
                patient_phone: user.phone,
                email: user.email,
                ip_address: req.body.onlinePacs.ip_address,
                port: req.body.onlinePacs.port,
                aetitle: req.body.onlinePacs.aetitle,
                accession_number: accNo,
                study_link: req.body.onlinePacs.ip_address + ":8080/weasis-pacs-connector/viewer?patientID=" + accNo,
                deleted: false,
                study_link2: ovyWeb,
                study_link_mobile: ovyMob,
                ref_id: req.body.ref_id,
              });

              acc.save(function(err,info){});
              study.save(function(err,info){});

              var refObj = {
                ref_id: req.body.ref_id,
                referral_firstname: (req.user.type !== "Patient") ? req.user.name : firstname,
                referral_lastname: (req.user.type !== "Patient") ? null : user.lastname,
                referral_title: (req.user.type !== "Patient") ? null : user.title,
                referral_id: (req.user.type !== "Patient") ? req.user.user_id : user.user_id,    
                referral_id: req.user.user_id, 
                referral_email: req.user.email,
                referral_phone: req.user.phone,      
                date: req.body.sent_date,  
                center_id: result.user_id,          
                acc_no: accNo,            
                radiology: {
                  test_to_run: req.body.test_to_run,
                  patient_age: user.age,
                  patient_gender: user.gender,
                  patient_firstname: user.firstname,
                  patient_lastname: user.lastname,
                  patient_profile_pic_url: user.profile_pic_url,
                  patient_title: user.title,
                  patient_phone: user.phone,
                  session_id: req.body.session_id,
                  patient_id: user.user_id,
                  clinical_summary: req.body.clinical_summary,
                  indication: req.body.indication,
                  lmp: req.body.lmp,
                  acc_no: accNo,
                  study_link: "http://" + req.body.onlinePacs.ip_address + ":8080/weasis-pacs-connector/viewer?patientID=" + accNo,
                  test_id: testId,
                  parity: req.body.parity,
                  attended: false,
                  study_id: study._id,
                  title: req.user.title,
                  doctor_firstname: (isDoctor) ? req.user.firstname : '',
                  doctor_lastname: (isDoctor) ? req.user.lastname : '',
                  doctor_id: (isDoctor) ? req.user.user_id : '',
                  doctor_email: (isDoctor) ? req.user.email : '',
                  doctor_profile_url: (isDoctor) ? req.user.profile_url : ''
                }             
              }

            } else {

            var refObj = {
              ref_id: req.body.ref_id,
              referral_firstname: (req.user.type !== "Patient") ? req.user.name : firstname,
              referral_lastname: (req.user.type !== "Patient") ? null : user.lastname,
              referral_title: (req.user.type !== "Patient") ? null : user.title,
              referral_id: (req.user.type !== "Patient") ? req.user.user_id : user.user_id,    
              date: req.body.sent_date,
              referral_email: req.user.email,
              referral_phone: req.user.phone,      
              date: req.body.sent_date,  
              center_id: result.user_id,          
              //acc_no: accNo,            
              radiology: {
                test_to_run: req.body.test_to_run,
                patient_age: user.age,
                patient_gender: user.gender,
                patient_firstname: user.firstname,
                patient_lastname: user.lastname,
                patient_profile_pic_url: user.profile_pic_url,
                patient_title: user.title,
                patient_phone: user.phone,
                session_id: req.body.session_id,
                patient_id: user.user_id,
                clinical_summary: req.body.clinical_summary,
                indication: req.body.indication,
                lmp: req.body.lmp,
                //acc_no: accNo,
                //study_link: "http://" + req.body.onlinePacs.ip_address + ":8080/weasis-pacs-connector/viewer?patientID=" + accNo,
                test_id: testId,
                parity: req.body.parity,
                attended: false,
                title: req.user.title,
                doctor_firstname: (isDoctor) ? req.user.firstname : '',
                doctor_lastname: (isDoctor) ? req.user.lastname : '',
                doctor_id: (isDoctor) ? req.user.user_id : '',
                doctor_email: (isDoctor) ? req.user.email : '',
                doctor_profile_url: (isDoctor) ? req.user.profile_url : ''
                //study_id: study._id
              }             
            }

          }// end of is isCommonSearch

         

          var refNotification = {
            sender_firstname: firstname,
            sender_lastname: user.lastname,
            sender_title : user.title,
            sent_date: req.body.sent_date,
            ref_id: req.body.ref_id,
            note_id: req.body.ref_id,
            sender_profile_pic_url: user.profile_pic_url,
            message: "Hi, I need your services"
          }

          if(result.presence === true){
            io.sockets.to(result.user_id).emit("center notification",refNotification)
          } 

          /*if(!req.body.isSelfRequest){
            var msgBody = "You have new investigation request! Visit https://applinic.com/login"
            var phoneNunber =  result.phone;
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              }
            )
          }*/
          
          //var refPos = result.referral.map(function(x){return x.ref_id}).indexOf(req.body.ref_id);

         // if(refPos === -1){
            //result.referral.push(refObj);
            //remember sms / email will be sent to the patient

            //this populates the patient medical record

            var referral = new model.referral(refObj);
            referral.save(function(err,info){
              if(err) throw err;
              var sender = (req.user.type == "Doctor" || req.user.type == "Patient") ? (req.user.title + " " + req.user.lastname) : req.user.name;
              var msgBody = "Your radiology investigation request was sent to " + result.name + " at " +
               result.address + ", " + result.city + " " + result.country + "\nBy " + sender + "\n" + "Ref No " + req.body.ref_id; 
              var phoneNunber =  user.phone;
              sms.messages.create(
                {
                  to: phoneNunber,
                  from: '+16467985692',
                  body: msgBody,
                },
                callBack
              ) 
            });

            var callBack = function(err,info) {
              if(err) {
                console.log(err);
              } else {
                console.log(info);
              }
            }
           
            var recordObj = {
              test_to_run: req.body.test_to_run,
              center_address: req.body.address,
              center_city: req.body.city,
              center_country: req.body.country,
              center_name: req.body.name,
              center_phone: result.phone,
              center_id: req.body.id,
              patient_id: user.user_id,
              ref_id: req.body.ref_id,
              referral_firstname: firstname,
              referral_lastname: user.lastname,
              referral_title: user.title,
              sent_date: req.body.sent_date,
             //acc_no: accNo,
             // study_link: "http://" + req.body.onlinePacs.ip_address + ":8080/weasis-pacs-connector/viewer?patientID=" + accNo,
              session_id: req.body.session_id,
              report: "Pending",
              conclusion: "Pending"
            }
            user.medical_records.radiology_test.unshift(recordObj);
            if(req.user.type === "Doctor"){
              var docPos = user.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(req.user.user_id);
              if(docPos == -1){
                user.accepted_doctors.unshift({
                  doctor_id: req.user.user_id,
                  doctor_title: req.user.title,
                  date_of_acceptance: new Date(),
                  doctor_firstname: req.user.firstname,
                  doctor_lastname: req.user.lastname,
                  doctor_profile_pic_url: req.user.profile_pic_url,                  
                  doctor_specialty: req.user.specialty,
                  work_place: req.user.work_place,
                });
              }
            }
             
            user.save(function(err,info){
              if(err) {
                throw err;
                res.end('500: Internal server error')
              }
              res.json({success:true,ref_id:req.body.ref_id,refObj: refObj});
            });

            result.diagnostic_center_notification.unshift(refNotification);
            result.save(function(err,info){
              if(err) throw err;          
            });

            /*var transporter = nodemailer.createTransport({
              host: "mail.privateemail.com",
              port: 465,
              auth: {
                user: "info@applinic.com",
                pass: process.env.EMAIL_PASSWORD
              }
            });

            var mailOptions = {
              from: 'Applinic info@applinic.com',
              to: result.email,
              subject: 'New Investigation Request',
              html: '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' 
              + result.name + ",</b><br><br>"
              + "You have new investigation request"  
             // + "The patient might visit you with a reference number to the investigation<br>"
              + "Please <a href='https://applinic.com/login'> log in </a> and attend to the patient when present."
              + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
              + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
              + "For inquiries please call customer support on +2349080045678 or email us at support@applinic.com<br><br>"
              + "Thank you for using Applinic.<br></br><br>"
              + "<b>Applinic Team</b></td></tr></table>"
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });*/

            
          /*} else {
             res.json({success:true,ref_id:req.body.ref_id});
          }  */
          
      
            /*user.save(function(err,info){
              if(err) throw err;
              console.log("saved!")
            });*/

            if(isDoctor) {

              var complainObj = {};

              var record = new model.session({
                date: req.body.sent_date,
                profilePic: user.profile_pic_url,
                last_modified: req.body.sent_date,
                doctor_id: req.user.user_id,
                session_id: req.body.session_id,
                patient_id: user.user_id,
                patient_firstname: user.firstname,
                patient_lastname: user.lastname,
                typeOfSession: "In-person"
              });

              record.diagnosis =  complainObj; 

              var testResult = {
                test_to_run: req.body.test_to_run,
                receive_date: "Pending",
                sent_date: req.body.sent_date,
                report: "Pending",
                test_id: testId,
                conclusion: "Pending",
                sub_session_id: "",
                indication: req.body.indication,
                clinical_summary: req.body.clinical_summary,
                test_ran_by: result.name,
                center_address: result.address,
                center_city: result.city,
                center_phone: result.phone,
                center_email: result.email,
                center_profile_pic_url: result.profile_pic_url
              }  

              record.diagnosis.radiology_test_results.unshift(testResult);
              
              record.save(function(err,info){
                if(err) throw err;
                console.log("session created!")
              });

              //add patient to doctor list if does not exist
              var elemPos = req.user.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(user.user_id);
              if(elemPos == -1){
                req.user.doctor_patients_list.unshift({
                  date: req.body.sent_date,
                  patient_lastname: user.lastname,
                  patient_firstname: user.firstname,
                  patient_id: user.user_id,
                  patient_profile_pic_url: user.profile_pic_url,
                  patient_address: user.address || "N/A",
                  patient_city: user.city,
                  patient_country: user.country || 'Nigeria',
                  patient_gender: user.gender,
                  patient_age: user.age,
                  patient_phone: user.phone
                })

                req.user.save(function(err,info){
                  if(err) throw err;
                  console.log("patient save in doctors list")
                })
              }
            }

          });

        } else {
          res.send({message:"User found not a patient.",error:true})
        } // end of if user is a patient
   
      } else {

        if(req.user.type !== "Doctor"){
          res.send({message:"The user with phone number does not exist.",error:true});
        } else {
          res.json({isNewPatient: true})
        }
      }
    });

  } else {
    res.end("Unauthorized access")
  }
});

/**** courier services logic ****/

/*router.get('/field-agent/login',function(req,res){
  res.render("field-agent-login")
})*/

//for patient getting requested courier services
router.get("/user/courier-response",function(req,res){
  console.log(req.query)
  if(req.user){
    if(req.query.id){
      model.courier.findOne({request_id: req.query.id},function(err,data){
        if(err) throw err;
        res.json(data);
      })

    } else if(req.query._id) {
      model.courier.findById(req.query._id)
      .exec(function(err,data){
        if(err) throw err;
        res.json(data);
      })
    } else {
      model.courier.find({user_id: req.user.user_id})
      .sort('new')
      .exec(function(err,data){
        if(err) throw err;
        res.json(data);
      })
    }
  } else {
    res.end("unauthorized access!")
  }
});

//for patient updating/paying for the courier billed amount
router.post("/user/courier-response",function(req,res){
  if(req.user){
    res.end("sdds")
  } else {
    res.end("unauthorized access!")
  }
});


//for patient re-ordering the prescription dosage and quantities or wish to choose another center.
router.put("/user/courier-response",function(req,res){
  if(req.user){
    res.send({})
  } else {
    res.end("unauthorized access!")
  }
});


//for patient deleting or declining the bill if cannot pay
router.delete("/user/courier-response",function(req,res){
  if(req.user){
    model.courier.findOne({_id: req.query.item})
    .exec(function(err,data){
      if(err) throw err;
      if(data){
        if(!data.attended || !data.isPaid){
          data.remove(function(){});
          res.send({status: true});
        } else {
          res.send({status: false});
        }
      } else {
        res.send({status: false})
      }
    })
    
  } else {
    res.end("unauthorized access!");
  }
});


//for patient creating new courier request. note is different from the above route
router.post("/user/courier",function(req,res){
  if(req.user) {
    var date = new Date();
    //if(!req.body.refId){
    req.body.refId = randos.genRef(7);
    //}
    req.body.firstname = req.user.name || req.user.firstname;
    req.body.lastname = (!req.user.name) ? req.user.lastname : "";
    req.body.title = (req.user.type !== "Doctor") ? req.user.title : "";
    req.body.profile_pic_url = req.user.profile_pic_url;
    req.body.user_id = req.user.user_id;
    req.body.date = date;
    req.body.verified = false;
    req.body.attended = false;
    req.body.completed = false;
    req.body.deleted = false;
    req.body.ref_id = req.body.refId;
    req.body.new = 0;
    req.body.email = req.user.email;
    req.body.request_id = randos.genRef(8);
    req.body.center_name = req.body.centerInfo.name;
    req.body.center_address = req.body.centerInfo.address;
    req.body.center_phone =  req.body.centerInfo.phone;
    req.body.center_id = req.body.centerInfo.user_id;

    var courier = new model.courier(req.body);
    courier.save(function(err,info){
      //io.sockets.to("couriergroup").emit("receiver courier",req.body);
      //io.sockets.to(req.user.user_id).emit("new courier order",{status:true});
      if(err) throw err;
      io.sockets.to(req.body.center_id).emit("receiver courier",req.body);
    });

    var refObj = {
      ref_id: req.body.refId,
      referral_firstname: req.body.firstname,
      referral_lastname: req.body.lastname,
      referral_title: req.body.title,
      referral_id: req.user.user_id,    
      date: date,
      isCourierType: true,
      courierId: courier._id,
      referral_email: req.user.email,
      referral_phone: req.user.phone,
      center_id: req.body.centerInfo.user_id,
      pharmacy: req.body
    }

    refObj.pharmacy.patient_lastname = req.body.lastname;
    refObj.pharmacy.patient_firstname = req.body.firstname;
    refObj.pharmacy.patient_phone = req.body.phone1 || req.user.phone;
    refObj.pharmacy.patient_id = req.user.user_id;
    refObj.pharmacy.patient_address = req.user.address;
    refObj.pharmacy.patient_city = req.user.city;
    refObj.pharmacy.patient_country = req.user.country;
    refObj.pharmacy.patient_age = req.user.age;
    refObj.pharmacy.patient_gender = req.user.gender;
    refObj.pharmacy.patient_profile_pic_url = req.user.profile_pic_url;

    //var referral = new model.referral({})

    if(req.user.type == "Patient")
      model.user.findOne({user_id:req.user.user_id},{prescription_tracking:1}).exec(function(err,patient){
        if(err) throw err;
        if(patient){
          patient.prescription_tracking.push({
            date: date,
            center_name: req.body.centerInfo.name + " ( Courier Services )",
            address: req.body.centerInfo.address,
            ref_id: req.body.refId,
            city: req.body.centerInfo.city,
            country: req.body.centerInfo.country,
            phone: req.body.centerInfo.phone,
            prescriptionId: req.body.prescriptionId
          })
        } 
        patient.save(function(err,info){});
      })

    var ref = new model.referral(refObj) 
    ref.save(function(err,info){
      if(err) throw err;
      /*var msgBody = "Your home delivery confirmation pin is " + req.body.request_id +
      "\nPlease give out to the delivery agent when you have confirmed receipt of the package." +
      "\nPlease note that you have to make payment before delivery is initiated.\nGo to your account https://applinic.com/login"
      sms.messages.create(
        {
          to: req.user.phone,
          from: '+16467985692',
          body: msgBody,
        }
      )*/

    });

    res.send({status:true,message:"Sent successfully!",success: true,id: req.body.request_id,_id: courier._id});

    model.user.findOne({user_id: req.body.center_id},
    function(err,center){
      if(err) throw err;
      /*sms.calls 
      .create({
        url: "https://applinic.com/voicenotification?firstname=" 
        + req.user.lastname + "&&title=" + req.user.title + "&&type=" + "courier",
        to: center.phone || "",
        from: '+16467985692',
      })
      .then(
        function(call){
          console.log(call.sid);
        },
        function(err) {
          console.log(err)
        }
      );*/

      var msgBody = "A new home delivery of drug(s) request just came in. Please log in and compute the cost for payment. " 
      + "\nRef No is " + req.body.refId + "\nSender number: " + req.user.phone +
      "\nDelivery process will be initiated when the receiver had paid the bill." +
      "\nGo to your account https://applinic.com/login";
 
      sms.messages.create(
        {
          to: center.phone,
          from: '+16467985692',
          body: msgBody,
        }
      )
      .then(
        function(call){
          console.log(call.sid);
        },
        function(err) {
          console.log(err)
        }
      )

      io.sockets.to(center.user_id).emit("center notification",{isNewDrug:true});

     

      /*var transporter = nodemailer.createTransport({
        host: "mail.privateemail.com",
        port: 465,
        auth: {
          user: "info@applinic.com",
          pass: process.env.EMAIL_PASSWORD
        }
      });*/

      var mailOptions = {
        from: 'Applinic info@applinic.com',
        to: 'info@applinic.com',
        subject: 'New Courier Request Order!',
        html: '<table><tr></th></tr><tr><td>'
        + "Sender Name: " + req.body.firstname + " " + req.body.lastname + "<br><br>"
        + "Sender Address: " + req.user.address + "<br><br>"
        + "Sender City: " + req.user.city + "<br><br>"
        + "Sender Phone: " + req.body.phone1 + " " + req.body.phone2 +  "<br><br>"
        + "Ref No: " + req.body.refId +  "<br><br>"
        + "Order ID: <b>" + req.body.request_id +  "</b><br><br>"
        + "Dispatch Center: " + center.name + "<br><br>"
        + "Dispatch Address: " + center.address + " " + center.city + " " + center.country + "<br><br>"
        + "Dispatch Center Phone: " + center.phone + "<br>"
        + "</td></tr></table>"
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    })
   
  } else {
    res.send("unauthorized access!");
  }
  
});

router.get("/user/courier-centers",function(req,res){
  if(req.user){
    model.user.find({type: "Pharmacy",courier_access: true},{_id: 0, name:1,address:1,city:1,user_id:1,phone:1,country:1},function(err,data){
      if(err) throw err;
      res.send(data);
    });
  } else {
    res.end("unauthorized access!");
  }
})

router.put("/user/courier-update",function(req,res){
  if(req.user){  
    if(req.body.prescription_body){
      model.courier.findById(req.body._id).exec(function(err,user){
        if(user) { //user.verified !== true
          var random1 = randos.genRef(3);
          var random2 = randos.genRef(3);
          var password = check(random1) + " " + check(random2);

          user.verified = true;
          user.total_cost = req.body.total_cost;
          user.otp = password;
          user.attended = true;
          user.verification_date = + new Date();
          user.delivery_charge = req.body.delivery_charge || 500;
          user.center_id = req.user.user_id;
          user.user_id = req.body.user_id || user.user_id;
          user.prescription_body = req.body.prescription_body || user.prescription_body;
          user.currencyCode = req.user.currencyCode;
          user.city_grade = req.user.city_grade;
          user.isPaid = false;
          user.new = 1;
          user.agentId = req.body.agentId;
          user.center_charge = req.user.courier_commission;

          var count = 0;
          var presObj = {};
          presObj.details = "";
          var capture;
        
          var currency = (req.user.currencyCode) ? req.user.currencyCode : "NGN";

          var msgBody = "The drug(s) you requested for home delivery is ready!\n" 
          + "Please go to your account and make payment to initiate delivery.\n" 
          + "Your Order ID is " + user.request_id
          + "\nhttps://applinic.com/login";

          
          var phoneNunber = user.phone1 || user.phone2; 

          sendSMS(phoneNunber,msgBody)

         

          var msgBody2 = "A new home delivery of drug(s) has been initiated by  " + req.user.name + " @ "
          + req.user.address + " " + req.user.city 
          + "\nPlease follow up this transaction and inform the sender to complete payment before delivery starts."
          + "\nRef No is " + user.ref_id + "\nSender Phone : " + user.phone1 + " " + user.phone2 + "\nSender Address: " 
          + user.address 
          + " " + req.user.city
          + "\nGo to your service page https://applinic.com/login";

          sendSMS(req.body.agentNumber,msgBody2);


          function sendSMS(number,body) {
            sms.messages.create(
              {
                to: number,
                from: '+16467985692',
                body: body,
              }
            )
            .then(
              function(call){
                console.log(call.sid);
              },
              function(err) {
                console.log(err)
              }
            )
          }


          /*var transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            auth: {
              user: "info@applinic.com",
              pass: process.env.EMAIL_PASSWORD
            }
          });*/

          /*var mailOptions = {
            from: 'Applinic info@applinic.com',
            to: user.email,//center.email,//result.email,//req.body.email || 'ede.obinna27@gmail.com',
            subject: 'Billing for drugs delivery received',
            html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' + user.firstname + ",</b><br><br>"
            + "Here is the details of drugs ordered for delivery:<br><br>"
            + "Status : Acknowledged:<br> Cost of drugs: " +  currency + "" + req.body.total_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "<br>"
            + "Delivery charge: " + currency + "" + req.body.delivery_charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "<br>"
            + "Center : " + req.user.name + "\n" + req.user.address + "," + req.user.city + "," + req.user.country + "<br>" 
            + "Phone: " + req.user.phone + "<br><br>"
            + "<a href='https://applinic.com/login'>Log in now</a> to pay and get instant delivery! <br><br> Always check the motorcycle icon on top of your applinic account dashboard for current courier requests<br><br>"
            + "Thank you for using Applinic.<br><br>"
            + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
            + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
            + "For inquiries please call customer support on +2349080045678<br><br>"
            + "Thank you for using Applinic.<br></br><br>"
            + "<b>Applinic Team</b></td></tr></table>"
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });*/


          user.save(function(err,info){});

          io.sockets.to(user.user_id).emit("courier billed",
            {status: true,_id:user._id,message: "The cost of the drugs you requested for home delivery is ready!" 
            + " Click 'OK' to pay now or 'CANCEL' to pay later by clicking the motorcycle icon on top"});

          res.send({message:"Bill sent for payment successfully!",status: true});
        } else {
          res.send({message: "Patient has already been verified by another center",status:false});
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
      res.send({message: "Can not send empty drug list"});
    }

  } else {
    res.send("unauthorized access!");
  }

});

router.put("/user/decline-courier",function(req,res){
  if(req.user){
    model.courier.findOne({_id: req.body._id,center_id: req.user.user_id},{deleted: 1}).exec(function(err,courier){
      if(err) throw err;
      if(courier)
        courier.deleted = true;
      res.send(req.body);
      courier.save(function(err,info){
        if(err) {
          console.log(err);
        } else {
          console.log("courier deleted!");
        }
      });
    })
  } else {
    res.end("unauthorized access!");
  }
})


router.get("/user/get-courier",function(req,res){
  if(req.user){
    if(req.query.isSingle){
      model.courier.findById(req.query.id)
      .exec(function(err,courier){
        if(err) throw err;
        res.json(courier)
      })
    } else {
      var criteria;
      if(req.query.completed) {
        criteria = {completed: true,center_id: req.user.user_id,attended: true,is_paid: true,deleted:false}
      } else if(req.query.paid){
        criteria = {is_paid: true,center_id: req.user.user_id,deleted: false,completed: false,attended:true}
      } else {
        criteria = {city:req.user.city,attended:false,center_id: req.user.user_id,deleted: false}
      }
      model.courier.find(criteria,{otp:0,request_id: 0})
      .sort('-date')
      .limit(200)
      .exec(function(err,data){
        res.send(data);
      })
    }
  } else {
    res.send("unauthorized access!");
  }

});


//field agent gets the courier assigned to them to deliver
router.get("/user/field-agent/:centerId/:agentId",function(req,res){
  if(req.user) {
    model.user.findOne({user_id: req.params.centerId},function(err,center){
      if(err) throw err;
      if(center){
        var agentId = req.params.centerId + "/" + req.params.agentId;
        model.agent.findOne({userId: agentId})
        .exec(function(err,agent){
          if(err) throw err;
          if(agent){
            if(req.user.user_id === agent.userId || agent.center_id === req.user.user_id) {
              res.render("field-agent",{agent: agent});
            } else {
              res.send({Error: "Field agent not authentication failed!"});
            }
          } else {
            res.send({Error: "This agent is not registered by the center."});
          }
        })
      } else {
        res.send({Error: "Permission error! User not enrolled for courier services"})
      }
    });
  } else {
    res.end("Unauthorized access!")
  }
});

router.get("/user/field-agent/get-data",function(req,res){
  if(req.user){
    model.agent.findOne({userId: req.query.id})
    .exec(function(err,agent){
      if(err) throw err;
      if(agent){
        res.json(agent)
      } else {
        res.json({})
      }
    })
  } else {
    res.render("login")
  }

})

//this gets field agents registered by a center
router.get("/user/field-agent",function(req,res){
  if(req.user){
    res.json(req.user.field_agents);
  } else {
    res.end("unauthorized access!");
  }
});


//this creates field agent by the center
router.post("/user/field-agent",function(req,res){
  if(req.user){
    model.agent.findOne({phone: req.body.phone}).exec(function(err,data){
      if(err) throw err;
      if(!data) {
        var agentId = req.user.user_id + "/" + genHash(12);
        var password = genHash(8);
        var url = "https://" + req.hostname + "/user/field-agent/" + agentId;
        var agent = new model.agent({
          password: password,
          userId: agentId,
          date: new Date(),
          center_id: req.user.user_id,
          center_name: req.user.name,
          center_city: req.user.city,
          couriers: [],
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
          url: url
        });

        model.user.findOne({phone: req.body.phone})
        .exec(function(err,result){
          if(err) throw err;

          if(result){
            res.json({message: "User with the phone number already exists", status: false});

          } else {         

            var User = new model.user({
              password: salt.createHash(password),
              type: "Field Agent",
              email: req.body.email,
              phone: req.body.phone,
              user_id: agentId,
              profile_pic_url: "/download/profile_pic/nopic",
            })

            User.save(function(err,info){})

            req.user.field_agents.push({
              names: req.body.firstname + " " + req.body.lastname,
              url: url,
              id: agent._id,
              phone: req.body.phone,
              email: req.body.email,
              password: password
            })

            req.user.save(function(){});

            agent.save(function(err,info){
              if(err) throw err;
              console.log("Agent saved!")
            })

            sms.messages.create(
              {
                to: req.body.phone,
                from: '+16467985692',
                body: "Your applinic.com field agent log in details\nphone " + req.body.phone + "\npassword " + password,
              },
              callBack
            ) 
            //infobip sms gateway for second option
            var msg = "Your applinic.com field agent log in details\nphone " + req.body.phone + "\npassword " + password;

            //var message = {from: "InfoSMS", to : req.body.phone, text : msg}
            //client.SMS.send(message,callBack);

            function callBack (err,info){
              if(err)
                console.log(err)
              console.log(info)
            }
            res.send({message: "Field agent created successfully!",phone: req.body.phone, password: password,status:true})
          }
        })

      } else {
        res.json({message: "User already exists as an agent!", status: false})
      }
    });    

  } else {
    res.end("unauthorized access!")
  }
});

//this deletes the field agent by the center
router.delete("/user/field-agent",function(req,res){
  if(req.user){
    model.agent.remove({_id: req.query.id});
    var elemPos = req.user.field_agents.map(function(x){return x.id.toString()}).indexOf(req.query.id)
    if(elemPos !== -1){    
      model.user.findOne({user_id: req.query.id},function(err,agent){
        if(err) throw err;
        if(agent) {
          agent.remove(function(err,info){})
        }
      })
      req.user.field_agents.splice(elemPos,1);
      req.user.save(function(){});
    }
    res.send({message:"Agent deleted!",status: true});
  } else {
    res.end("unauthorized access!");
  }
});

// this route handles the allocation of delivery task to agent
router.put("/user/agent-delivery",function(req,res){
  if(req.user){
    model.agent.findById(req.body.agent_id)
    .exec(function(err,agent){
      if(err) throw err;
      if(agent){
        model.courier.findById(req.body.courierId,{request_id:0,otp:0})
        .exec(function(err,courier){
          if(err) throw err;
          if(courier) {

            var message = "Assigned to " + 
            agent.firstname + " " + agent.lastname + " " + agent.phone;

            courier.on_delivery = true;
            courier.delivery_msg = message;
            courier.delivery_start_date = new Date();

            agent.couriers.push(courier);
            agent.save(function(err,info){});

            courier.save(function(err,info){});
            res.json({status: true,message: message});

            io.sockets.to(agent.userId).emit('delivery start',{status:true})
            /*var transporter = nodemailer.createTransport({
              host: "mail.privateemail.com",
              port: 465,
              auth: {
                user: "info@applinic.com",
                pass: process.env.EMAIL_PASSWORD
              }
            });*/

            /*var mailOptions = {
              from: 'Applinic info@applinic.com',
              to: agent.email,//result.email,//req.body.email || 'ede.obinna27@gmail.com',
              subject: 'Order Ready for Delivery',
              html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' + agent.firstname + " " + agent.lastname + ",</b><br><br>"
              + "You have new order for delivery at " + courier.address + ", " + courier.city + "<br><br>"
              + "Your login details:<br><br>Email: " + agent.email + "<br>Password: " + agent.password + "<br><br>"
              + "<a href='https://applinic.com/login'>Log in to view order now!</a><br><br>"
              + "Thank you for using Applinic.<br><br>"
              + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
              + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
              + "For inquiries please call customer support on +2349080045678<br><br>"
              + "Thank you for using Applinic.<br></br><br>"
              + "<b>Applinic Team</b></td></tr></table>"
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });*/
          } else {
           res.send({message: "Error: Courier record not found!",status:false})
          }
        })
      } else {
        res.send({message: "Error: Field agent not found!",status:false})
      }
    })
  } else {
    res.end("unauthorized access!");
  }
});

router.post("/user/courier/dispute",function(req,res){
  if(req.user){
     model.courier.findById(req.body.courierId)
     .exec(function(err,data){
      if(err) throw err;
      data.dispute = true;
      data.save(function(){})
      res.send({})
      var name = req.user.name || req.user.title + " " + req.user.firstname + " " + req.user.lastname
      var mailOptions = {
        from: 'Applinic info@applinic.com',
        to: 'info@applinic.com',
        subject: 'DISPUTE on Courier Order ' + req.body.courierId + ' was Loggod',
        html: '<table><tr></th></tr><tr><td>'
        + "Sender Name: " + name + "<br><br>"
        + "Sender Address: " + req.user.address + "<br><br>"
        + "Sender City: " + req.user.city + "<br><br>"
        + "Sender Phone: " + req.user.phone +  "<br><br>"
        + "Sender ID: " + req.user.user_id +  "<br><br>"
        + "Sender Email: " + req.user.email +  "<br><br>"
        + "Courier Request Id: " + data.request_id + "<br><br>"
        + "Model ID: " + data._id 
        + "</td></tr></table>"
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

     })
  } else {
    res.send("unauthorized access!");
  }
});



//log out route
router.get("/user/logout",function(req,res){
    if(req.user){
      model.user.findOne({email: req.user.email,password: req.user.password},{presence:1,firstname:1,set_presence:1,family_accounts:1,family_flag:1})
      .exec(function(err,data){
        if(data) {
          data.presence = false;
          data.set_presence.general = false;
          data.family_flag = false;
          if(data.family_accounts) {
            for(var i = 0; i < data.family_accounts.length; i++) {
              if(data.family_accounts[i].status === true) {
                data.family_accounts[i].status = false;
              }
            }
          }
          data.family_accounts.push({});
          data.family_accounts.pop()
          data.save(function(err,info){
            console.log("presence is offline");           
            completeAction()
          });
        } else {
          res.end("unauthorized access!")
        }
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

router.delete("/user/patient/delete-one",function(req,res){
  if(req.user) {
    var projection = {};
    projection[req.body.dest] = 1;
    var del = new deleteItem(req.body.item,req.user.user_id);
    del.DeleteByUserId(model,projection);
    res.send("deleted");
  } else {
    res.end("unauthorized access!");
  }
});

router.delete("/user/delete-one/refId", function(req,res){ //this route is also used by diagnostic centers to delete viewed notification
  if(req.user){
    var projection = {};
    projection[req.body.dest] = 1;
    var del = new deleteItem(req.body.item,req.user.user_id);
    del.DeleteByRefId(model,projection);
    res.send("deleted");
  } else {
    res.end("unauthorized access!")
  }
});

router.delete("/user/delete-one/noteId", function(req,res){ //this route is also used by diagnostic centers to delete viewed notification
  if(req.user){
    var projection = {};
    projection[req.body.dest] = 1;
    var del = new deleteItem(req.body.item,req.user.user_id);
    del.DeleteByNoteId(model,projection);
    res.send("deleted");
  } else {
    res.end("unauthorized access!")
  }
});

router.delete("/user/delete-one/msgId", function(req,res){ //this route is also used by diagnostic centers to delete viewed notification
  if(req.user){
    var projection = {};
    projection[req.body.dest] = 1;
    var del = new deleteItem(req.body.item,req.user.user_id);
    del.DeleteByMsgId(model,projection);
    res.send("deleted");
  } else {
    res.end("unauthorized access!")
  }
});

router.delete("/user/patient/delete-one/noteId", function(req,res){
  if(req.user){
    var projection = {};
    projection[req.body.dest] = 1;
    var del = new deleteItem(req.body.item,req.user.user_id);
    del.DeleteByNoteId(model,projection);
    res.send("deleted");
  } else {
    res.end("unauthorized access!")
  }
})



router.delete("/user/patient/delete-one/appointment",function(req,res){
  if(req.user) {
    console.log(req.body)
    var projection = {};
    projection[req.body.dest] = 1;
    var del = new deleteItem(req.body.item,req.user.user_id);
    del.DeleteBySessionId(model,projection);
    res.send("deleted");
  } else {
    res.end("unauthorized access!");
  }
});


router.delete("/user/delete-many",function(req,res){
  if(req.user) {
    console.log("++++++++++++++")
    console.log(req.body);
    var projection = {};
    projection[req.body.dest] = 1;
    var del = new deleteItem(req.body.item,req.user.user_id);
    del.DeleteAll(model,projection);
    res.send("deleted");
  } else {
    res.end("unauthorized access!")
  }
});

router.delete("/user/delete-all-chat",function(req,res){
  if(req.user) {
    var projection = {};
    projection[req.body.dest] = 1;
    var del = new deleteItem(req.body.item);
    del.deleteAllChat(model,projection);
    res.send("deleted");
  } else {
    res.end("unauthorized access!")
  }
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
    var selected = data.slice(index);
    res.send(selected);
    
  })
  .sort('-sent_date')
  .limit(limit);
});

router.post("/user/response/patients-histories",function(req,res){
  console.log(req.body)
  if(req.user){
      if(req.user.type === "Doctor" && req.user.verified) {
        var data = req.user;
        model.help.findOne({complaint_id: req.body.complaint_id,patient_id:req.body.patient_id},{response:1}).exec(function(err,found){
          if(err) throw err;

          if(!found){
            res.send({error:"user not found!",message: "Sorry, this complaint has been closed."});
            return;
          }

          req.body.doctor_name = (data.lastname) ? (data.title + " " + data.firstname + " " + data.lastname ) : data.name;
          req.body.doctor_profile_pic_url = data.profile_pic_url;
          req.body.doctor_profile_url = data.profile_url;
          req.body.doctor_specialty = data.specialty;
          req.body.doctor_user_id = data.user_id;
          var elemPos = found.response.map(function(x){return x.doctor_user_id}).indexOf(data.user_id);
          if(elemPos === -1){          
            model.user.findOne({user_id:req.body.patient_id},
              {patient_mail:1,accepted_doctors:1,firstname:1,lastname:1,user_id:1,phone:1,presence:1,email:1}).exec(function(err,patient){           
              if(err) throw err;
              var checkIsMyDoctor = patient.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(data.user_id);
              
              if(checkIsMyDoctor === -1){              
                found.response.push(req.body);
                var date = + new Date();
                var msg = "(" + found.response.length + ") " + " responses to your complaint.";
                var checkComplain = patient.patient_mail.map(function(x){return x.complaint_id}).indexOf(req.body.complaint_id);
                if(checkComplain !== -1){
                  var complain = patient.patient_mail[checkComplain];
                  complain.message = msg;
                } else {
                  msg = "One response to your complaint";
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
                } 

                var msgBody = "A doctor reacted to your complaint! Go to dashboard https://applinic.com/user/patient"
                var phoneNunber =  patient.phone;
                sms.messages.create(
                  {
                    to: phoneNunber,
                    from: '+16467985692',
                    body: msgBody,
                  }
                );

                sms.calls 
                .create({
                  url: "https://applinic.com/voicenotification?firstname=" + req.user.lastname + "&&title=" + req.user.title + "&&type=" + "resp",
                  to: phoneNunber || "",
                  from: '+16467985692',
                })
                .then(
                  function(call){
                    console.log(call.sid);
                  },
                  function(err) {
                    console.log(err)
                  }
                );

                /*var transporter = nodemailer.createTransport({
                  host: "mail.privateemail.com",
                  port: 465,
                  auth: {
                    user: "info@applinic.com",
                    pass: process.env.EMAIL_PASSWORD
                  }
                });*/

                var mailOptions = {
                  from: 'Applinic info@applinic.com',
                  to: patient.email,//result.email,//req.body.email || 'ede.obinna27@gmail.com',
                  subject: 'Response to Your Consultation Request',
                  html: '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Dear ' + patient.lastname + ",</b><br><br>"
                  + req.user.title + " " + req.user.lastname 
                  + "has accepted your consultation request. Click the link below to log in and see his response.<br><br>"
                  + "URL: https://applinic.com/user/patient<br><br>"
                  + "Thank you for using Applinic.<br><br>"
                  + "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
                  + "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
                  + "For inquiries please call customer support on +2349080045678<br><br>"
                  + "Thank you for using Applinic.<br></br><br>"
                  + "<b>Applinic Team</b></td></tr></table>"
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
                
              } else {
                patient.save(function(err,info){})
                var info = "Oops!! Your response was declined.Reason: This complaint is from your patient. Please contact " + 
                patient.firstname + " " + patient.lastname;
              }
              patient.save(function(err,info){});
              var message = info || "Thanks for responding " + req.user.title + " " + req.user.firstname 
              + ". Your proposal has been sent to the patient.";
              res.send({message: message}); 
              found.save(function(err,info){       
              });
            });
            
          } else {
            res.send({error: "You have already responded to this history"});

          }

        });

    } else {
      res.json({Error: "403",
        error: "You are not yet verified. Only verified doctors on the platform can respond to patients' complaint. Please contact admin for verification"});
    }

  } else {
      if(!req.user){
        res.send({error: "Oops!Request NOT submitted! Your session has expired because you have been idle for a while.Please refresh and log in then continue."})
      } else {
        res.end("Error 403: You are not unathorized to view this page");
      }
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

router.get("/user/get-person-profile",function(req,res){
  if(req.user){
    model.user.findOne({user_id: req.query.personId},function(err,data){
      if(err) throw err;
      res.send(data);
    })
  } else {
    res.send("Unauthorized access!");
  }
});

router.get("/user/patient/get-my-doctors",function(req,res){
  if(req.user) {   
    /*model.user.find({"doctor_patients_list.patient_id": req.user.user_id,type:"Doctor"},
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
            } 

            sendList.push(list.accepted_doctors[elementPos]);
          
          count++
        }       
        
      }); 

    });*/
    res.json(req.user.accepted_doctors);
  } else {
    res.send("Unauthorized access!")
  }
});
/***************  will be modified as above ************/
 //this route get all the doctor's patients to include which patient is online or not.
 router.get("/user/doctor/my-online-patients",function(req,res){
    if(req.user){
      /*model.user.find({"accepted_doctors.doctor_id":req.user.user_id,type:"Patient"},
        {user_id:1,_id:0,firstname:1,lastname:1,presence:1,profile_pic_url:1},function(err,data){
        if(err) throw err;
        var sendList = [];
        var dataLen = data.length;
        var count = 0;
       
          while(dataLen > count){
            var elementPos = req.user.doctor_patients_list.map(function(x){if(x) return x.patient_id}).indexOf(data[count].user_id)
              
              if(data[count].presence){ 
                if(req.user.doctor_patients_list[elementPos])            
                  req.user.doctor_patients_list[elementPos].presence = true;                
              }

              sendList.push(req.user.doctor_patients_list[elementPos]);
            
            count++
          } 
          res.json(sendList);
        
      })*/
      res.json(req.user.doctor_patients_list)
    } else {
      res.end("Unauthorized access!!")
    }
  }); 

  //this route gets all doctors accepted patient. just for other ourposes wihich may no include whether use is presence or not at first.

  router.get("/user/doctor/my-patients",function(req,res){
    if(req.user){
      model.user.findOne({"accepted_doctors.doctor_id":req.user.user_id},{doctor_patients_list:1,_id:0},function(err,data){
        if(err) throw err;
        res.json(data);
      });
      //res.json({doctor_patients_list: req.user.doctor_patients_list});
    } else {
      res.end("Unauthorized access!!")
    }
  });

//this route gets all patients accepted doctors. just for other ourposes wihich may no include whether use is presence or not at first.
  router.get("/user/patient/my-doctors",function(req,res){
    if(req.user){
      /*model.user.findOne({user_id: req.user.user_id},{accepted_doctors:1,_id:0},function(err,data){
        if(err) throw err;
        res.send(data);
      });*/
      res.json({accepted_doctors: req.user.accepted_doctors});
    } else {
      res.end("Unauthorized access!!!");
    }
  });


  router.put("/user/doctor/my-patients",function(req,res){
    if(req.user){
      model.user.findOne({user_id:req.body.patientId,type:"Patient"})
      .exec(function(err,data){
        if(err) throw err;
        if(data) {
          var index = data.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(req.user.user_id)
          if(data.accepted_doctors[index]){
            data.accepted_doctors[index].deleted = true;

            var msgBody = req.user.title + " " + req.user.firstname + " " + req.user.lastname 
            + " removed you from the management list.";

            var phoneNunber =  data.phone || "+2348096461927";
            
            sms.messages.create(
              {
                to: phoneNunber,
                from: '+16467985692',
                body: msgBody,
              },
              function(err,response){
                console.log(err)
              }) 

            data.save(function(err,info){
              updateDocList()
            });

          }  else {
             res.json({status: false, message: "Your are not in the patient's list"})
          }
        } else {
          res.json({status: false, message: "Patient not found"})
        }
      });

      function updateDocList() {
        var elemPos = req.user.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(req.body.patientId);
        if(req.user.doctor_patients_list[elemPos]){
          //req.user.doctor_patients_list.splice(elemPos,1)
          req.user.doctor_patients_list[elemPos].deleted = true;
          req.user.save(function(err,info){
            if(err) throw err;
            io.sockets.to(req.body.patientId).emit("remove in list",{doctorId: req.user.user_id})
          })
          res.json({status: true,message: "Patient removed successfully."})
        } else {
          res.json({status: false, message: "Error occured, Patient not removed from your account"})
        }
      }
    } else {
      res.end("Unauthorized access!!")
    }
  });

  router.put('/user/patient/my-doctors',function(req,res){
    if(req.user){
      model.user.findOne({user_id: req.body.doctorId,type: "Doctor"})
      .exec(function(err,doc){
        if(err) throw err;

        if(doc) {
          var elemPos = doc.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(req.user.user_id);
          if(elemPos !== -1){
            doc.doctor_patients_list.splice(elemPos,1)
            doc.save(function(err,info){
              if(err) throw err;

              /*var transporter = nodemailer.createTransport({
                host: "mail.privateemail.com",
                port: 465,
                auth: {
                  user: "info@applinic.com",
                  pass: process.env.EMAIL_PASSWORD
                }
              });*/

              var sex = (req.user.gender == 'Male') ? "his" : "her";

              var mailOptions = {
                from: 'Applinic info@applinic.com',
                to: 'ede.obinna27@gmail.com',//doc.email || info@applinic.com,
                subject: 'Patient Removed You!',
                html: '<table><tr></th></tr><tr><td>Dear ' 
                + doc.title + ' ' + doc.firstname + "<br><br>Your patient - " + req.user.title + ' ' 
                + req.user.firstname + " " + req.user.lastname + "<br> removed you from " + sex + " management list.<br><br> "
                + "Please contact the patient - " + req.user.phone + " for more details <br>"
                + "Thank you for using Applinic.<br></br><br>"
                + "<b>Applinic Team</b></td></tr></table>"
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              res.json({status: true,message: "Doctor removed successfully."})
              updatePatientList();
            })
          } else {
            res.json({status: false,message: "Error occured, Doctor not removed from your account"})
          }
        }
      })

      function updatePatientList() {        
        var index = req.user.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(req.body.doctorId)
        if(req.user.accepted_doctors[index]){
          req.user.accepted_doctors.splice(index,1)
          req.user.save(function(err,info){
            if(err) throw err;
            console.log("doctor removed from list successfully!");
          })
        }
      }


    } else {
      res.end("Unauthorized Access!")
    }

  })


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
      res.send({count:data.length,data:data});
    })
  } else {
    res.redirect("/login")
  }
});

router.get('/user/getAllDoctor',function(req,res){
  if(req.user){
    model.user.find({type:"Doctor"},function(err,data){
      res.send({count:data.length,data: data});
    })
  } else {
    res.redirect("/login")
  }
});

router.get('/user/getAllPharmarcy',function(req,res){
  if(req.user){   
    model.user.find({type:"Pharmacy"},function(err,data){
      res.send({count:data.length,data:data});
    })
  } else {
    res.redirect("/login")
  }
});

router.get('/user/getAllLaboratory',function(req,res){
  if(req.user){
    var str = (req.query.city) ? new RegExp(req.query.city.replace(/\s+/g,"\\s+"), "gi") : ""; 
    var criteria = (req.query.city) ? {city: { $regex: str, $options: 'i' },type:"Laboratory"} : {type:"Laboratory"};
    model.user.find(criteria,{name:1,address:1,user_id:1,city:1,country:1,phone:1,_id:1,email:1,verified:1},function(err,data){
      if(err) throw err;
      if(!req.query.city) {
        res.json({count:data.length,data:data});
      } else {
        res.send(data);
      }
    }).limit(5000)
  } else {
    res.redirect("/login")
  }
});

router.get('/user/getAllRadiology',function(req,res){
  if(req.user){
    var str = (req.query.city) ? (new RegExp(req.query.city.replace(/\s+/g,"\\s+"), "gi")) : ""; 
    var criteria = (req.query.city) ? {city: { $regex: str, $options: 'i' },type:"Radiology"} : {type:"Radiology"};
    model.user.find(criteria,{name:1,address:1,user_id:1,city:1,country:1,phone:1,_id:1,email:1,verified:1},function(err,data){
      if(err) throw err;
      if(!req.query.city) {
        res.json({count:data.length,data:data});
      } else {
        res.send(data);
      }
    }).limit(5000)
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

router.get("/user/admin/get-user-details",function(req,res){
  if(req.user){
    if(req.query.item && req.user.type === 'admin'){
       var criteria = { $or: [{ phone : req.query.item},{user_id: req.query.item},{email : req.query.item}]};
       model.user.find(criteria,function(err,data){
        if(err) throw err;
        res.json(data);
       })
    } else {
      res.end("unauthorized access!");
    }
  } else {
    res.end("unauthorized access!");
  }
});

router.get('/user/admin/get-consultations',function(req,res){
  if(req.user){
    if(req.user.type === 'admin' && req.user.admin){
      model.consult.find({},function(err,data){
        if(err) throw err;
        res.json(data);
      });
    } else {
      res.end("unauthorized access!");
    }
  } else {
    res.end("unauthorized access!");
  }
});

router.delete('/user/admin/get-consultations',function(req,res){
  if(req.user){
    if(req.user.type === 'admin'){
      model.consult.findById(req.query.id)
      .exec(function(err,data){
        if(err) throw err;
        if(data){
          data.remove(function(){});
        }
        res.json({message: "deleted!"})
      })
    } else {
      res.end("unauthorized access!");
    }
  } else {
    res.end("unauthorized access!");
  }
});


router.get('/user/admin/pwr',function(req,res){
  if(req.user){
    if(req.user.type === 'admin'){
      model.help.find({})
      .exec(function(err,data){
        if(err) throw err;
        res.json(data);
      })
    } else {
      res.end("unauthorized access!");
    }
  } else {
    res.end("unauthorized access!");
  }
});

router.delete('/user/admin/pwr',function(req,res){
  if(req.user){
  
    if(req.user.type === 'admin' && req.user.admin){
      model.help.findById(req.query.id)
      .exec(function(err,data){        
        if(data){
          data.remove(function(err,info){
            if(err) throw err;
            res.json({status:true,message: "Complaint deteted!"})
          });         
        } else {
          res.json({status:false, message: "Error ocurred, try again"})
        }
      })
    } else {
      res.end("unauthorized access!");
    }
  } else {
    res.end("unauthorized access!");
  }
});




router.get('/user/admin/scrolls',function(req,res){
  if(req.user){
    if(req.user.type === 'admin'){
      model.scroll.find({deleted: false},function(err,data){
        if(err) throw err;
        res.json(data);
      });
    } else {
      res.end("unauthorized access!");
    }
  } else {
    res.end("unauthorized access!");
  }
});


router.get('/user/admin/get-courier',function(req,res){
  if(req.user){
    if(req.user.type === 'admin'){
      model.courier.findById(req.query.id)
      .exec(function(err,data) {
        if(err) throw err;
        res.json(data);
      });
    } else {
      res.end("unauthorized access!");
    }
  } else {
    res.end("unauthorized access!");
  }
});






router.get("/user/center-profile",function(req,res){
  if(req.user){
    model.user.findOne({user_id: req.query.id},{name:1,rating:1,address:1,city:1,country:1,_id:0,phone:1,profile_pic_url:1},function(err,data){
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

router.get("/user/getDrugs",function(req,res){
  if(req.user){
      model.dynaService.findOne({type: "Pharmacy"},{test_list:1,_id:0},function(err,data){
        if(err) throw err;
        var result = data.test_list || [];
        res.send(result);
      });
  } else {
    res.end()
  }
});

router.get("/user/getSpecialTests",function(req,res){
  if(req.user) {
    model.dynaService.findOne({type: "Laboratory"},{test_list:1,_id:0},function(err,data){
      if(err) throw err;
      var result = data.test_list || [];
      console.log(result)
      res.send(result);
    });
  } else {
    res.end();
  }

});

router.get("/user/getSpecialTestsRadio",function(req,res){
  if(req.user) {
    model.dynaService.findOne({type: "Radiology"},{test_list:1,_id:0},function(err,data){
      if(err) throw err;
      var result = data.test_list || [];
      res.send(result);
    });
  } else {
    res.end();
  }
});

router.get("/user/chats",function(req,res){
  if(req.user){
    model.chats.find({userId: req.user.user_id},function(err,chats){
      if(err) throw err;
      res.json(chats);
    })
  } else {
    res.end("unauthorized access!");
  }
});

router.put("/user/admin/verify-user",function(req,res){
  if(req.user)
    if(req.user.type == 'admin' && req.user.admin) {
      model.user.findById(req.body.userId)
      .exec(function(err,user){
        if(err) throw err;
        if(user){
          if(req.body.action == 'verify'){
            user.verified = true;
            user.save(function(err,info){})
            res.json({status: true,message: "User verified!"});

          } else if(req.body.action == 'block'){
            user.deleted = true;
            user.save(function(err,info){
              console.log("user blocked by admin");
            });
            res.json({status: true, message: "User blocked!",type: "block"});

          } else if(req.body.action == 'unverify'){
            user.verified = false;
            user.save(function(err,info){
              console.log("user unverified by admin");
            });
            res.json({status: false,message: "User unverified!"});
          }
        } else {
          res.send({status: false,message: "verification failed!"})
        }
      })
    } else {
      res.end("unautorized access!");
    }
})

router.delete("/user/admin/delete-user",function(req,res){
  if(req.user) {
    if(req.user.type == 'admin' && req.user.admin) {
      model.user.findById(req.body.userId)
      .exec(function(err,user){
        if(err) throw err;
        if(user) {
          user.remove(function(err,info){
            if(err){
              res.json({status: false, message: "Error ocurred, Please try again"})
            } else {
              res.json({status: true, message: "User account deleted!",type: user.type,title: user.title})
            }            
          });
        } else {
          res.json({status: false, message: "User not found"})
        }
      });
    }
  } else {
    res.end("unautorized access!");
  }
});

router.get("/user/admin/new-user-report",function(req,res){
  if(req.user){
    if(req.user.type == "admin" && req.user.admin){
      var resObj = {};

      var startDay = moment().startOf('day');//day week month
      var endDay = startDay.clone().endOf('day');

      var startWeek = moment().startOf('week');
      var endWeek = startWeek.clone().endOf('week');

      var startMonth = moment().startOf('month');
      var endMonth = startMonth.clone().endOf('month');

      model.user.find({date: {
        $gt: startDay,
        $lt: endDay
      }},{email:1,phone:1,city:1,firstname:1,name:1,type:1,country:1,title:1,date:1},function(err,dayData){
        resObj.day = dayData;

        model.user.find({date: {
          $gt: startWeek,
          $lt: endWeek
        }},{email:1,phone:1,city:1,firstname:1,name:1,type:1,country:1,title:1,date:1},function(err,weekData){
          resObj.week = weekData;
           model.user.find({date: {
            $gt: startMonth,
            $lt: endMonth
          }},{email:1,phone:1,city:1,firstname:1,name:1,type:1,country:1,title:1,date:1},function(err,monthData){
            resObj.month = monthData;
            res.json(resObj);
          });
        })
      })


     
     

    } else {
      res.send({});
    }
  } else {
    res.end("unautorized access")
  }
});

/*
$gt: startDate,
$lt: endDate

*/



/*
    Family account logic and implmentations

*/


//update family account
router.put("/user/family-accounts",function(req,res){
  
})

//creATE new family account
router.post("/user/family/create-account",function(req,res){
  if(req.user) {
    var getId = uuid.v1();
    model.user.findOne({email: req.user.email,password: req.user.password}).exec(function(err,main){     
      if(err) throw err;
      if(main) {
        if(main.family_accounts.length <= 10) {
          main.family_accounts.push({
            status: false,
            memberId: getId,
            name: req.body.firstname,
            title: req.body.title
          })

          main.save(function(err,info){
            createAccount(main.family_accounts);
          })
        } else {
          res.json({status:false,message: "Error: Maximum number of accounts exceeded!"})
        }
      } else {
        res.json({status:false,message: "Error: User not found!"})
      }
    })

    function createAccount(accounts) {
      
      var User = new model.user({
        email: null,
        user_id: getId,
        password: null,
        phone: req.user.phone,
        admin: false,
        country: req.user.countryName,
        type: req.user.typeOfUser,
        city: req.user.city,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.user.username,
        address: req.user.address,
        gender: req.body.gender,
        title: req.body.title,
        age: req.body.age,
        family_flag: true,
        family_accounts : req.user.family_accounts,
        profile_pic_url: "/download/profile_pic/nopic",
       
      });     

      User.ewallet = {
        available_amount: 0,
        transaction: []
      }

      User.save(function(err){
        console.log("user saved");
        res.json({status: true,accountList: accounts})
        if(err) throw err;         
      }); 
    }

  } else {
    res.end("unautorized access!")
  }
});

router.get("/user/family-switch/:userId/:memberId",function(req,res){
  if(req.user){
    if(req.user.switchSuccess) {
      res.json({
        status: req.user.family_flag,
        isLoggedIn: true,        
        typeOfUser: req.user.type,
        firstname: req.user.attach.firstname,
        lastname:req.user.lastname,
        phone: req.user.phone,
        email: req.user.email,
        title: req.user.attach.title,
        user_id: req.user.attach.userId,
        balance: req.user.ewallet.available_amount,
        profile_pic_url: req.user.profile_pic_url,
        city: req.user.city,
        country: req.user.country,     
        address:req.user.address,
        family_accounts: req.user.family_accounts
      });
    } else {
      res.json({status: false});
    }

  } else {
    res.end("unauthorized acesss!")
  }
  
});

router.get("/user/family-normal/:userId/:memberId",function(req,res){
  if(req.user){
    if(req.user.switchSuccess) {
      res.json({
        status: req.user.family_flag,
        isLoggedIn: true,        
        typeOfUser: req.user.type,
        firstname: req.user.attach.firstname,
        lastname:req.user.lastname,
        phone: req.user.phone,
        email: req.user.email,
        title: req.user.title,
        user_id: req.user.attach.userId,
        balance: req.user.ewallet.available_amount,
        profile_pic_url: req.user.profile_pic_url,
        city: req.user.city,
        country: req.user.country,     
        address:req.user.address,
        family_accounts: req.user.family_accounts
      });
    } else {
      res.json({status: false});
    }

  } else {
    res.end("unauthorized acesss!");
  }
  
});

router.get('/user/find-center',function(req,res){
  if(req.user){
    var str;
    var criteria;
    if(req.query.name) {
      str = new RegExp(req.query.name.replace(/\s+/g,"\\s+"), "gi");              
      criteria = { name : { $regex: str, $options: 'i' },type:req.query.type};
    } else {
      criteria = {city: req.query.city,type:req.query.type};
    }
    model.user.find(criteria,{name:1,address:1,city:1,country:1,phone:1,user_id:1,
      profile_pic_url:1,presence:1,email:1},function(err,result){
      if(err) throw err;
      res.json(result);
    })
    .limit(200);
  } else {
    res.end("unauthorized access!");
  }
});

router.get("/user/rendered-services",function(req,res){
  if(req.user) {
    console.log(req.user.service_details)
    res.json(req.user.service_details.slice(0,200))
  } else {
    res.end("unauthorized access!")
  }
});

router.get("/general/homepage-search",function(req,res){

  /*if(!req.query.city)
      req.query.city = "Enugu";*/

  /*if(!req.query.item) {
    res.send({full:[]});
    return;
  }*/

  if(req.query.category === "Pharmacy") {
    req.query.drugList = [{name: req.query.item}];
    if(req.query.city){
      var criteria = (req.query.item) ? {type:"Pharmacy",center_city:req.query.city} : {type:"Pharmacy",city:req.query.city}
    } else {
      var criteria = {type:"Pharmacy"}
    }

    if(req.query.item) {
      model.services.find(criteria,
        {center_name:1,center_city:1,center_address:1,center_country:1,center_phone:1,user_id:1,unavailable_services:1,_id:0,profile_url:1},function(err,data){
        if(err) throw err;
        var newListToSend = [];        
        var sendObj = {};
        var listOfDrugs = req.query.drugList;        
        for(var i = 0; i < listOfDrugs.length; i++){
          var elements = data.map(function(x){return x.unavailable_services});
          var count = 0;
          var foundDrug = [];          
          while(count < elements.length){
            var centerInfo = {}                      
            var elementPos = elements[count].map(function(x){ return x.name}).indexOf(listOfDrugs[i].name);            
            centerInfo.notFound = listOfDrugs[i].name;
            if(elementPos === -1){    
              var el = elements[count].map(function(x){return x.center_id}).indexOf(data[count].user_id);          
              centerInfo.center_name = data[count].center_name;
              centerInfo.center_city = data[count].center_city;
              centerInfo.center_country = data[count].center_country;
              centerInfo.center_city = data[count].center_city;
              centerInfo.center_id = data[count].user_id;
              centerInfo.center_address = data[count].center_address;
              centerInfo.center_phone = data[count].center_phone;
              centerInfo.addBy = (elements[count][el]) ? elements[count][el].center_id : undefined;
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
                filter[sendObj[i][j].center_id].addBy = sendObj[i][j].addBy;
              } else {
                filter[sendObj[i][j].center_id].str += "," + sendObj[i][j].drugFound;
                filter[sendObj[i][j].center_id].count++;
              }
            }
          }
          
          /*Array.prototype.diff = function(arr2) {
            var ret = [];
            this.sort();
            arr2.sort();
            for(var i = 0; i < this.length; i += 1) {
              if(arr2.indexOf( this[i].name ) === -1){
                  ret.push( this[i] );
              }
            }
            return ret;
          };*/

          var sub = {};
           sub['full'] = [];
           sub['less'] = [];
          for(var k in filter){
            if(filter[k].count === req.query.drugList.length) {
              sub['full'].push(filter[k]);
            } else {
              var arr1 = req.query.drugList;
              var newFilterArr = filter[k].str.split(",")            
              var notFoundArr = arr1.diff(newFilterArr)
              filter[k].notFound = notFoundArr;          
              sub['less'].push(filter[k])
            }
          }

          res.send(sub)
        })
      } else {
        model.user.find(criteria,{address:1,name:1,profile_pic_url:1,city:1,country:1,user_id:1,profile_url:1,title:1},function(err,data){
          if(err) throw err;
          console.log(data);
          var sub = {};
          sub['full'] = data;
          res.send(sub)
        });
      }

  } else if(req.query.category === "Doctor") {
    if(req.query.item) {  
      var first4 = (req.query.item.substring(0,2) !== 'Dr' || req.query.item.substring(0,2) !== 'Prof') ? req.query.item.substring(0,5) : req.query.item;
      var str = new RegExp(first4.replace(/\s+/g,"\\s+"), "gi");              
      //var criteria = { specialty : { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city};
      //var byDisease = {"skills.disease": { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city};
      if(req.query.city) {
        var criteria = {$text : {$search : req.query.item},city:req.query.city}
        /*var criteria = { $or: [{ specialty : { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city},
        {"skills.disease": { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city}]};*/
      } else {
        var criteria = {$text : {$search : req.query.item}}
        //var criteria = { $or: [{ specialty : { $regex: str, $options: 'i' },type:"Doctor"},
        //{"skills.disease": { $regex: str, $options: 'i' },type:"Doctor"}]}; 
      }
    } else {
      var criteria = (req.query.city) ? {type: "Doctor",city:req.query.city} : {type: "Doctor"};
    }

    model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
      specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name: 1,profile_url:1})
      .limit(100)
      .exec(function(err,data){
      if(err) {        
        res.send({error:"status 500",full:[]});
      } else {   
        //res.render('list-view',{data: data})
        if(data.length == 0){
          var criteria = (req.query.city) ? { $or: [{ specialty : { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city},{name: { $regex: str, $options: 'i' },type:"Doctor",city: req.query.city}]} : 
          { $or: [{ specialty : { $regex: str, $options: 'i' },type:"Doctor"},{name: { $regex: str, $options: 'i' },type:"Doctor"}]}

          model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
          specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,profile_url:1},
          function(err,data2){
            if(err) throw err;
            res.json({full: data2});
          })
        } else {
          res.json({full: data});
        }   
        
      }
    });

  } else if(req.query.category === "Laboratory" || req.query.category === "Radiology") {
    console.log(req.query);
    //for lab and radio search from home page
  
  req.query.testList = [{name: req.query.item}];

  if(req.query.city){
    var criteria = {type:req.query.category,center_city:req.query.city}
  } else {
    var criteria = {type:req.query.category}
  }

  if(req.query.item) {
  model.services.find(criteria,
    {center_name:1,center_city:1,center_address:1,center_country:1,user_id:1,unavailable_services:1,center_phone:1,_id:0,profile_url:1},function(err,data){
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
          var elementPos = elements[count].map(function(x){ return x.name}).indexOf(listOfTests[i].name);            
          centerInfo.notFound = listOfTests[i].name;
          if(elementPos === -1){  
            var el = elements[count].map(function(x){return x.center_id}).indexOf(data[count].user_id);                   
            centerInfo.center_name = data[count].center_name;
            centerInfo.center_city = data[count].center_city;
            centerInfo.center_country = data[count].center_country;
            centerInfo.center_city = data[count].center_city;
            centerInfo.center_phone = data[count].center_phone;
            centerInfo.center_id = data[count].user_id;
            centerInfo.center_address = data[count].center_address;
            centerInfo.addBy = (elements[count][el]) ? elements[count][el].center_id : undefined;
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
            filter[sendObj[i][j].center_id].addBy = sendObj[i][j].addBy;
          } else {
            filter[sendObj[i][j].center_id].str += "," + sendObj[i][j].testFound;
            filter[sendObj[i][j].center_id].count++;
          }
        }
      }
     

      /*Array.prototype.diff = function(arr2) {
        var ret = [];
        this.sort();
        arr2.sort();
        for(var i = 0; i < this.length; i += 1) {
            if(arr2.indexOf( this[i].name ) === -1){
                ret.push( this[i] );
            }
        }
        return ret;
      };*/

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

  } else {
    model.user.find(criteria,{address:1,name:1,profile_pic_url:1,city:1,country:1,user_id:1,profile_url:1,title:1},function(err,data){
      if(err) throw err;
      console.log(data);
      var sub = {};
      sub['full'] = data;
      res.send(sub)
    });
  }

  } else if(req.query.category === "Skills & Procedures") {

      if(req.query.item) {
        var str = new RegExp(req.query.item.replace(/\s+/g,"\\s+"), "gi");  

        if(req.query.city) {            
          var criteria = { $or: [{ skill : { $regex: str, $options: 'i' },city:req.query.city,deleted: false},
          {disease: { $regex: str, $options: 'i' },city:req.query.city,deleted: false}]};
        } else {
          var criteria = { $or: [{ skill : { $regex: str, $options: 'i' },deleted: false},
          {disease: { $regex: str, $options: 'i' },deleted: false}]};
        }
      } else {
        var criteria = (req.query.city) ? {city: req.query.city} : {};
      }
      //var byDisease = {"skills.disease": { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city};
      model.skills.find(criteria)
      .limit(100)
      .exec(function(err,data){
        if(err) {
          res.send({error:"status 500",full:[]});
        } else {
          if(data.length == 0){
            var first4 = (req.query.item) ? req.query.item.substring(0,4) : "";
            str = new RegExp(first4.replace(/\s+/g,"\\s+"), "gi");  
            var criteria = (req.query.city) ? { skill : { $regex: str, $options: 'i' },city:req.query.city,deleted: false} : 
            { disease : { $regex: str, $options: 'i' },deleted: false}

            model.skills.find(criteria,
            function(err,data2){
              if(err) throw err;
              res.json({full: data2});
            })
          } else {
            res.json({full: data});
          }   
        }
      });
    
  } else if(req.query.category === "Disease") {


    var str = (req.query.item) ? new RegExp(req.query.item.replace(/\s+/g,"\\s+"), "gi") : null;  

    if(req.query.city) {            
      var criteria =   { disease : { $regex: str, $options: 'i' },city:req.query.city}; //{ $or: [{ disease : { $regex: str, $options: 'i' },city:req.query.city},
      //{disease: { $regex: str, $options: 'i' },city:req.query.city}]};
    } else {
      var criteria = { disease : { $regex: str, $options: 'i'}}; //{ $or: [{ disease : { $regex: str, $options: 'i'}},
      //{disease: { $regex: str, $options: 'i' }}]};
    }
    //var byDisease = {"skills.disease": { $regex: str, $options: 'i' },type:"Doctor",city:req.query.city};
    model.skills.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
    specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,profile_url:1,skill:1,ref_url:1})
    .limit(100)
    .exec(function(err,data){
      if(err) {
        res.send({error:"status 500",full:[]});
      } else {
        if(data.length == 0){
          var first4 = (req.query.item) ? req.query.item.substring(0,5) : "";
          str = new RegExp(first4.replace(/\s+/g,"\\s+"), "gi");  
          var criteria = (req.query.city) ? { disease: { $regex: str, $options: 'i' },city:req.query.city} : 
          { disease : { $regex: str, $options: 'i' }}

          model.skills.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
          specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,skill:1,profile_url:1,ref_url:1},
          function(err,data2){
            if(err) throw err;
            res.json({full: data2});
          })
        } else {
          res.json({full: data});
        }   
      }
    });
  } else if(req.query.category === "Special Center") {
    var str = (req.query.item) ? new RegExp(req.query.item.replace(/\s+/g,"\\s+"), "gi") : null;              
   // var criteria = { "skills.disease" : { $regex: str, $options: 'i' },type:"Doctor",title:"SC",city:req.query.city};
   var criteria;
    if(str) {
      criteria = { $or: [{specialty : { $regex: str, $options: 'i' },type:"Doctor",title:"SC",city:req.query.city}, //note disease tag may be use
      {specialty : { $regex: str, $options: 'i' },type:"Doctor",title:"SC"}]};
    } else {
      criteria = (req.query.city) ? {type: "Doctor",title: "SC", city: req.query.city} : {type: "Doctor",title: "SC"}
    }

    model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
    specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,profile_url:1})
    .limit(100)
    .exec(function(err,data){
      if(err) {
        res.send({error:"status 500",full:[]});
      } else {
          if(data.length == 0){
          var first4 = (req.query.item) ? req.query.item.substring(0,4) : "";
          str = new RegExp(first4.replace(/\s+/g,"\\s+"), "gi");  
          var criteria = (req.query.city) ? { name : { $regex: str, $options: 'i' },type:"Doctor",title:"SC",city:req.query.city} : 
          { name : { $regex: str, $options: 'i' },type:"Doctor",title:"SC"};
          model.user.find(criteria,{firstname:1,lastname:1,work_place:1,city:1,country:1,address:1,
            specialty:1,_id:0,profile_pic_url:1,education:1,user_id:1,title:1,name:1,skills:1,profile_url:1},
            function(err,data2){
              if(err) throw err;
              res.json({full: data2});
          })
        } else {
          res.json({full: data});
        }   
      }
    });

  } else {
    res.json({full:[]});
  }

});

router.get("/dynamic-service",function(req,res){ 
  model.dynaService.findOne({type: req.query.category},function(err,data){
    if(err) throw err;
    if(!data){
      res.send([]);
    } else {
      res.send(data.test_list);
    }
   console.log(data)
  });
});

router.get("/user/doctor/initial-complaint",function(req,res){
  if(req.user){
    console.log(req.query)
    var list = req.user.doctor_patients_list;
    var complaints = [];
    for(var i = 0; i < list.length; i++){
      if(list[i].patient_id == req.query.patientId){
        complaints.push(list[i])
      }
    }
    res.json(complaints);
  } else {
    res.end("unauthorized access");
  }
});

router.post("/user/invitation",function(req,res){
  if(req.user) {
    var msgBody;
    var intRegex = /[0-9 -()+]+$/;
    var emailReg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;
    var names = (req.user.lastname) ? (req.user.title + " " + req.user.lastname + " " + req.user.firstname) : req.user.name;
    var work = (req.user.work_place) ? "at " + req.user.work_place : "on Applinic";
    var uid = uuid.v1();

    model.user.findOne({$or: [{ phone : req.body.recepient},{email: req.body.recepient}]})
    .exec(function(err,user){
      if(err) throw err;
      if(!user) {
        if(emailReg.test(req.body.recepient)){
          sendEmail()
        } else if(intRegex.test(req.body.recepient)){
          sendSMS()
        } else {
          res.json({status:false,message:"Invalid recepient email address or phone number"})
          return;
        }
      } else {
        var names = user.title + " " + user.lastname + " " + user.firstname;
        res.json({
          status: false,
          user: true,
          message: names + ' is already in Applinic',
          type: user.type,
          names: names,
          age: user.age,
          gender: user.gender,
          profile_pic_url: user.profile_pic_url,
          patientId: user.user_id
        })
      }
    })
   


    function sendEmail() {
      switch(req.body.type) {
        case 'Patient':
          msgBody = '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 16px;">'  
          + "<br><br> <b>Invitation to join Applinic</b><br><br><b>" + names + ",</b> " + "a " + req.user.type + " " + work
          + "<br> invites you to join Applinic for your medical appointments, consultations, investigations and prescriptions.<br><br>" 
          + "This will enable you save your medical records for future use and also get discounts on medical services.<br><br>" 
          + "Click the button below to register now for free.<br><br> <div style='text-align:center;padding-top:15px'> <a href='https://applinic.com/signup?ref=" + req.user.user_id + "&id=" + uid
          + "&type=Patient'style='padding: 20px;background-color:green;color:#fff;border-radius:4px'>Join now!</a></div>" 
          + "<br><br> <b>Applinic Team</b></td></tr></table>"
        break;
        case 'Doctor':
          msgBody = '<table><tr><th><h3  style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 16px;">'  
          + "<br><br> <b>Invitation to join Applinic</b><br><br><b>" + names + ",</b> " + "a " + req.user.type + " " + work
          + "<br> invites you to join Applinic for your medical appointments, consultations, investigations and prescriptions.<br><br>" 
          + "This will enable you save, access and manage patient medical record online and also communicate with your patient anywhere, anytime.<br><br>" 
          + "Click the button below to register now for free.<br><br> <div style='text-align:center;padding-top:15px'> <a href='https://applinic.com/signup?ref=" + req.user.user_id + "&id=" + uid
          + "&type=Doctor'style='padding: 20px;background-color:green;color:#fff;border-radius:4px'>Join now!</a></div>" 
          + "<br><br> <b>Applinic Team</b></td></tr></table>"
        break;
        case 'Pharmacy':
          msgBody = '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 16px;">'  
          + "<br><br> <b>Invitation to join Applinic</b><br><br><b>" + names + ",</b> " + "a " + req.user.type + " " + work
          + "<br> invites you to join Applinic so that patients' prescriptions can be referred to your center.<br><br>" 
          + "This will enable you grow your business and receive prescription order online.<br><br>" 
          + "Click the button below to register now for free.<br><br> <div style='text-align:center;padding-top:15px'> <a href='https://applinic.com/signup?ref=" + req.user.user_id + "&id=" + uid
          + "&type=Pharmacy'style='padding: 20px;background-color:green;color:#fff;border-radius:4px'>Join now!</a></div>" 
          + "<br><br> <b>Applinic Team</b></td></tr></table>"
        break;
        default:
           msgBody = '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 16px;">'  
          + "<br><br> <b>Invitation to join Applinic</b><br><br><b>" + names + ",</b> " + "a " + req.user.type + " " + work
          + "<br> invites you to join Applinic so that patients' investigations can be referred to your center.<br><br>" 
          + "This will enable you grow your business and receive investigation requests online.<br><br>" 
          + "Click the button below to register now for free.<br><br> <div style='text-align:center;padding-top:15px'> <a href='https://applinic.com/signup?ref=" + req.user.user_id + "&id=" + uid
          + "&type=Center'style='padding: 20px;background-color:green;color:#fff;border-radius:4px'>Join now!</a></div>" 
          + "<br><br> <b>Applinic Team</b></td></tr></table>"
        break;
      }

      /*var transporter = nodemailer.createTransport({
        host: "mail.privateemail.com",
        port: 465,
        auth: {
          user: "info@applinic.com",
          pass: process.env.EMAIL_PASSWORD
        }
      });*/

      var mailOptions = {
        from: 'Applinic info@applinic.com',
        to: req.body.recepient,
        subject: 'Invitation from ' + names,
        html: msgBody
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.json({status:false,message:"Error occured while sending email. Please check the email is correct and try again."})

        } else {
          res.json({status:true,message: "invitation sent!"});
          if(req.body.type == "Patient" || req.body.type == "Doctor")
            createInvite()
        }
      });
    }

    function sendSMS() {
      if(req.user.type == "Doctor" || req.user.type == "admin"){
        var title = (req.user.title == 'SC') ? "" : ", a physician at Applinic Telehealth"
        var msgBody = names + title + " is pleased to inform you he now consults patients"
        + " online at Applinic platform." 
        + " Click the link below to register now for free!\n" 
        + "https://applinic.com/signup?ref=" + req.user.user_id + "&id=" + uid + "&type=" + req.body.type;
      } else {
        var msgBody = names + ", a " + req.user.type 
        + "\nsent an invitation to join Applinic. click the link below to register now for free!\n" 
        + "https://applinic.com/signup?ref=" + req.user.user_id + "&id=" + uid + "&type=" + req.body.type;
      }

      var phoneNunber = req.body.recepient;
      
      sms.messages.create(
        {
          to: phoneNunber,
          from: '+16467985692',
          body: msgBody,
        },
        function(err,response){
          if(err) {
            console.log(err)
            res.json({status: false,message:"Error occured while sending invitation. Please check the phone number and try again."})
          }

          if(response){
            res.json({status:true,message: "invitation sent!"});
            if(req.body.type == "Patient" || req.body.type == "Doctor")
              createInvite()
          }
      }) 
    }

    function createInvite() {
      //create and save invitation for identifying who the registrant belongs to
      //so that when the invitee registers in future it will automatically be added to the requester
      var invite = new model.invite({
        referral_id: req.user.user_id,
        id: uid,
        type: req.body.type,
        date: + new Date()
      });

      invite.save(function(){});
    }
    

  } else {
    res.end("unauthorized access!");
  }

});

router.post("/user/doctor/add-patient",function(req,res){
  if(req.user){
    if(req.user.type == 'Doctor'){
      var criteria = (req.body.isAcceptanceAlone) ? {user_id: req.body.sender_id,type:'Patient'} :
      {$or: [{ phone : req.body.user,type:'Patient'},
        {email: req.body.user,type:'Patient'},{user_id: req.body.sender_id,type:'Patient'}]}
      model.user.findOne(criteria)
      .exec(function(err,user){
        if(err) throw err;
        if(user){
          var elemPos = req.user.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(user.user_id);
          var patient = {            
            patient_profile_pic_url: user.profile_pic_url,
            patient_id: user.user_id,
            patient_lastname: user.lastname,
            patient_firstname: user.firstname,
            patient_address: user.address,
            patient_city: user.city,
            patient_country: user.country,
            patient_gender: user.gender,
            patient_age: user.age,
            patient_phone: user.phone,
            date: new Date(),
            deleted: false
          }

          if(elemPos == -1) {           
            req.user.doctor_patients_list.unshift(patient);     
          } else if(req.user.doctor_patients_list[elemPos]){
            req.user.doctor_patients_list[elemPos].deleted = false; 
          }

          req.user.save(function(err,info){
            if(err) throw err;
            res.json({status:true,message: "Success! Patient added to your account. To see all your patients go to 'My Patients' ",patient: patient});
            addToPatient()
          }); 

        } else {
          res.json({status: false, message: "Patient not found!"});
        }

        function addToPatient() {
          var indexPos = user.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(req.user.user_id)
          if(indexPos == -1) {           
            user.accepted_doctors.unshift({
              doctor_id: req.user.user_id,
              doctor_title: req.user.title,
              date_of_acceptance: new Date(),
              doctor_firstname: req.user.firstname,
              doctor_lastname: req.user.lastname,
              doctor_profile_pic_url: req.user.profile_pic_url,
              service_access: true,
              doctor_specialty: req.user.specialty,
              work_place: req.user.work_place,
              office_hour:req.user.office_hour,
              deleted: false  
            })

          } else if(user.accepted_doctors[indexPos]) {
            user.accepted_doctors[indexPos].deleted = false;
          }

          user.save(function(err,info){
            if(err) throw err;
            console.log("Patient's doctor list updated");
          });

          /*var transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            auth: {
              user: "info@applinic.com",
              pass: process.env.EMAIL_PASSWORD
            }
          });*/

          var body = "<div style='font-size:18px'><b>Hello" + user.firstname + "</b>, <br><br> " 
          + req.user.title + " " + req.user.firstname + " " + req.user.lastname 
          + " from Applinic Healthcare has accepted your consultation <br>"
          + "request. You can now request his attention at anytime <br>"
          + "by chat, audio or video call or appointment request from your account by <br>"
          + "clicking 'My Doctors', finding him and sending the request."
          + "Kindly login to https://applinic.com/login<br>" 
          + "<br><br>Thank you! <br><br> Applinic Team</div>"

          var mailOptions = {
            from: 'Applinic info@applinic.com',
            to: user.email,
            subject:'Consultation Accepted!',
            html: body
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(err)
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          var msgBody = user.firstname + ", " + req.user.title + " " 
          + req.user.firstname + " " + req.user.lastname 
          + " has accepted your consultation request.\nKindly login to https://applinic.com/login"
          + " to have a chat with the doctor.";

          var phoneNunber = user.phone;
          sms.messages.create(
            {
              to: phoneNunber,
              from: '+16467985692',
              body: msgBody,
            }
          ) 
        } 
      });  


    } else {
      res.json({status: false, message: "You are not allowed to use this service."});
    }
  } else {
    res.end("unauthorized access!");
  }
});

router.post("/twiliovoicemsg",function(req,res){
  //var arr = req.query.pin.split('');
  /*var twiml = 
  '<?xml version="1.0" encoding="UTF-8" ?><Response><Say>Your\n applinic.com\n verification\n code\n is\n' + arr[0] + ' \n' + ' \n' +
   ' \n' + ' \n' + ' \n' 
  + arr[1] + ' \n' + ' \n' + ' \n' + ' \n' + ' \n' + arr[2] + ' \n' + ' \n' + ' \n' + ' \n' + ' \n' + arr[3] + ' \n' + ' \n' + ' \n' +  'again' + ' \n' + ' \n' + ' \n' + ' \n' +  arr[0] + ' ' + ' ' + ' ' + ' '
  + arr[1] + ' \n' + ' \n' + ' \n' + ' \n' + ' \n' + arr[2] + ' \n' + ' \n' + ' \n' + ' \n' + ' \n' + arr[3]  + '\nthank you.</Say></Response>';
  res.set('Content-Type', 'text/xml');
  res.send(twiml)*/
  var twiml = new Voice();
  var splitTxt = createVoiceText(req.query.pin);
  var textToSay = 'Your, applinic dot com verification code is, '  + splitTxt + ', I repeat, ' + splitTxt + ', again, ' + splitTxt + 'thank you!';
  twiml.say({ voice: 'man',language: 'en-gb' },textToSay);
  res.type('text/xml');
  res.send(twiml.toString());
 
});

router.post("/voicenotification",function(req,res){
  var twiml = new Voice();
  var textToSay;
  if(req.query.type == 'courier')
    textToSay = "You have received a drug delivery request, Please log in to your app linic dot com account and attend to the request, Thank you.";
  else
    textToSay = (req.query.type) ? "Hello " + req.query.title + " , " + req.query.firstname + " , " 
  + ", a doctor just responded to your complaint.Please go to your dashboard on app linic for more details , Thank you."
   :  "Hello " + req.query.title + " , " + req.query.firstname + " , " +  
  " You have new consultation request. Please log on to your app linic dot com account and attend to the patient. Thank you" 
  twiml.say({ voice: 'man',language: 'en-gb' },textToSay);
  res.type('text/xml');
  res.send(twiml.toString());
});

router.post("/inviteonlinecall",function(req,res){
  var twiml = new Voice();
  console.log(req.query)
  var textToSay = "Hi " + req.query.receiver + " , " + req.query.sender + " , a " + req.query.type + " , wants to have a chat with you on app linic .com, Please log in now to attend. Thank you."
  twiml.say({ voice: 'man',language: 'en-gb' },textToSay);
  res.type('text/xml');
  res.send(twiml.toString());
});

router.post("/pwrcall",function(req,res){
  var twiml = new Voice();
  var textToSay = "Hi doc, a patient, submitted a complaint in patient waiting room , on applinic. Please  log on  and  attend."
  twiml.say({ voice: 'man',language: 'en-gb' },textToSay);
  res.type('text/xml');
  res.send(twiml.toString());
});



/*router.post('/mamavoice',function(req,res){ 
  var twiml = new Voice();
  twiml.play('http://nelsonarum.com/assets/campaign-audio.mp3');
  res.type('text/xml');
  res.send(twiml.toString());
});*/



router.get("/user/admin/commissions",function(req,res){
  if(req.user){
    if(req.user.type == "admin"){
      var resObj = {};
      model.user.find({type: "Doctor"},{city_grade:1,city:1,country:1},function(err,doctors){
        resObj.doctors = doctors;
        model.user.find({type:"Pharmacy"},{city_grade:1,city:1,country:1,courier_charge:1,courier_commission:1,
          courier_access:1,name:1,user_id:1},function(err,pharmacies){
          resObj.pharmacies = pharmacies;
          model.user.find({type:"Laboratory"},{city_grade:1,city:1,country:1},function(err,laboratories){
            resObj.laboratories = laboratories;
            model.user.find({type:"Radiology"},{city_grade:1,city:1,country:1},function(err,radiologies){
              resObj.radiologies = radiologies;
              res.json(resObj)
            })
          })
        })
      })
    } else {
      res.end("unauthorized access")
    }
  } else {
    res.end("unauthorized access")
  }
});

router.get("/user/dicom-viewer",function(req,res){
  res.render("dicom-viewer");
});



router.post("/user/share/email",function(req,res){
  if(req.user){
   
     /*var transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      auth: {
        user: "info@applinic.com",
        pass: process.env.EMAIL_PASSWORD
      }
    });*/

    var mailOptions = {
      from: 'Applinic info@applinic.com',
      to: req.body.recepient,
      subject:'Patient ' + req.body.type ,
      html: req.body.htmlTemp
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        res.json({status:false,message:"Error occured while sending email. Try again."})
      } else {
        console.log('Email sent: ' + info.response);
        res.json({status: true})
      }
    });
    
  } else {
    res.end("unauthorized access");
  }
});

router.get("/user/patient/medical-history",function(req,res){
  if(req.user){
    model.user.findOne({user_id: req.query.patientId})
    .exec(function(err,data){
      if(err) throw err;
      console.log(data.patient_history)
      var data = data.patient_history || {}
      res.json(data);
    })
  } else {
    res.end("Unauthorized access");
  }
});

router.put("/user/patient/medical-history",function(req,res){
  if(req.user){  
    console.log(req.body) 
    model.user.findOne({user_id: req.body.patientId})
    .exec(function(err,patient){
      if(err) throw err;
      patient.patient_history.lifestyle = req.body.lifestyle;
      patient.patient_history.height = req.body.height; 
      patient.patient_history.weight = req.body.weight;
      patient.patient_history.medication = req.body.medication;
      patient.patient_history.allergies = req.body.allergies;
      patient.patient_history.last_visited = req.body.last_visited;
      patient.patient_history.visitation_purpose = req.body.visitation_purpose;
      patient.patient_history.last_modified = + new Date();
      patient.patient_history.health_problems = req.body.health_problems;

      patient.patient_history.bp_chart.push({
        value: req.body.blood_pressure,
        date: + new Date(),
        unit: req.body.bp_unit
      })

      patient.patient_history.bs_chart.push({
        value: req.body.blood_sugar,
        date: + new Date(),
        unit: req.body.bs_unit
      })

      patient.save(function(err,info){
        if(err) throw err;
        console.log("history saved")
        res.json({status:true,message:"Record saved successfully"});
      })
      //res.json(patient.patient_history);
    });
  } else {
    res.end("Unauthorized access");
  }
});


router.get("/user/firstline-doctors",function(req,res){
  if(req.user){
    model.user.find({isFirstline: true},{user_id:1,name:1,specialty:1,work_place:1,address:1,
      city:1,profile_pic_url:1,verified:1,phone:1,email:1})
    .exec(function(err,data){
      res.json(data);
    });
  } else {
    res.end("Unauthorized access");
  }
});

router.post("/user/firstline-doctors",function(req,res){
  if(req.user){
    model.user.findOne({user_id: req.body.user_id})
    .exec(function(err,doc){
      if(err) throw err;
      if(doc) {
        //send a robo call to selected firstline doctor
        if(doc.email === "applinic@gmail.com"){
          doc.email = "info@applinic.com";
          //doc.phone = "+2349080045678";
        }

        sms.calls 
        .create({
          url: "https://applinic.com/inviteonlinecall?receiver=" + "doctor" + "&&sender=" 
          + req.user.lastname + "&&type=" + req.user.type,
          to: doc.phone || "",
          from: '+16467985692',
        })
        .then(
          function(call){
            console.log(call.sid);
          },
          function(err) {
            console.log(err)
          }
        );

        //send sms to the firstline doctor
        var msgBody = "Please attend to this patient via chat on applinic\n" + req.user.title 
        + " " + req.user.firstname + "\n" + req.user.phone;        
        sms.messages.create(
          {
            to: doc.phone || "",
            from: '+16467985692',
            body: msgBody,
          },
          callBack
        );

        function callBack(err,response){              
          console.log(response)
        }

        /*var transporter = nodemailer.createTransport({
          host: "mail.privateemail.com",
          port: 465,
          auth: {
            user: "info@applinic.com",
            pass: process.env.EMAIL_PASSWORD
          }
        });*/

        var mailOptions = {
          from: 'Applinic info@applinic.com',
          to: doc.email,
          subject:'Patient Chat Request',
          html: "<div style='font-size:18px'><b>Hello doctor</b>, <br><br> A patient wants to have a chat with you. <br> Kindly login to attend. <br><br> https://applinic.com/login <br><br> Thank you!</div>"
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(err)
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }       
    })
    res.json({status: true});

  } else {
    res.end("Unauthorized access");
  }
});

router.get("/api/dicom-details",function(req,res){
  model.dicom.findOne({center_id: req.query.centerId})
  .exec(function(err,data){
    if(data) {
      res.json(data);
    } else {
      res.json({
        ip_address: "167.71.149.196",
        dns: "dicom.applinic.com", 
        // this was changed to this on 13 oct, 2019 since the sub domain nginx connection was having issues
        //dicom.applinic.com
        port: 11112,
        aetitle: "applinic",
        cost: 1000,
        status: "beta",
        center_id: req.body.centerId || "",
        center_name: "Applinic",
        username: "user",
        password: "1234"
      });
    }
  })
});


router.put("/user/dicom-details",function(req,res){
  if(req.user){
    model.study.update({_id: req.body._id},req.body,null, function(err,info) {
      if(info)
        res.json({status: true, message: "Study updated successfully"});
      else 
        res.send({message: "Error occured. Try again"})
    })
    
  } else {
    res.send({message: "Error occured. Try again"})
  }
})


router.get("/user/dicom-service",function(req,res){
  if(req.user) {
    //note this converts the startdate to ISO date which is on UTC and it time zone is at 0;
    var dt;
    var startDate;
    var endDate;
    var criteria = {};
    if(Object.keys(req.query).length > 0) {

      if(req.query.from) {
       /* dt = new Date(req.query.from);   
        dt.setHours(dt.getHours() - 24);
        startDate = dt.toISOString();
        endDate = new Date(req.query.to);*/
        startDate = moment(req.query.from).startOf('day'); // set to 12:00 am today
        endDate = moment(req.query.to).endOf('day'); // set to 23:59 pm off date range
        criteria['study_date'] = {$gt: startDate,$lt: endDate};
      }

      if(req.query.patientID) {
        criteria['patient_id'] = req.query.patientID;
      }

      if(req.query.patientName) {
        criteria['patient_name'] = req.query.patientName;
      }

    }

    criteria.center_id = req.user.user_id; 
   
    model.study.find(criteria)
    .exec(function(err,data){
      if(err) throw err;
      res.json(data);
    });    

  } else {
    res.end("Unauthorized access.");
  }
})

router.post("/user/dicom-service",function(req,res){
  if(req.user) {
    if(req.user.type == "admin") {
      model.dicom.findOne({aetitle: req.body.aetitle})
      .exec(function(err,result){
        if(err) throw err;
        if(result){
          res.json({message: "Oops! Center with AE Title DICOM service already exist.",status:false})
        } else {
          create()
        }
      })

      function create() {
        var dcm = new model.dicom({
          ip_address: req.body.ip_address,
          dns: req.body.hostname,
          port: 11112,
          aetitle: req.body.aetitle,
          cost: 1000,
          status: "beta",
          center_id: req.body.centerId || "",
          center_name: req.body.center_name,
          username: req.body.username,
          password: req.body.password
        });

        dcm.save(function(err,info){
          if(err) throw err;
          res.json({message: "Service created successfully",status: true});
          model.user.findOne({user_id: req.body.centerId})
          .exec(function(err,center){
            center.dicom_enterprise = true;
            center.save(function(err,info){});
          })
        });
      }
    } else {
      res.json({message: "Permission denied.",status:false});
    }
  } else {
    res.end("Unauthorized Access!")
  }
});

router.put("/user/dicom-service",function(req,res){
  if(req.user) {
    if(req.user.type == "admin") {
      model.dicom.findOne({aetitle: req.body.aetitle})
      .exec(function(err,data){
        if(err) throw err;
        if(data){

        } else {
          res.json({message: "Resource not found"})
        }
      })
    } else {
      res.json({message: "Permission denied."})
    }
  } else {
    res.end("Unauthorized Access!")
  }
});

router.delete("/user/dicom-service",function(req,res){
  if(req.user) {
    if(req.user.type == "admin") {
    
    } else {
      res.json({message: "Permission denied."})
    }
  } else {
    res.end("Unauthorized Access!")
  }
});

router.get("/investigation/result",function(req,res){
  switch(req.query.type) {
    case 'radio':
      model.study.find({study_uid: req.query.id})
      .exec(function(err,data){
        if(err) throw err;
        if(data.length == 0) {
          model.study.find({patient_id: req.query.id})
          .exec(function(err,data){
            if(err) throw err;
            if(data.length == 0) {
                //var toInt = parseInt(req.query.id)
                //var intRegex = /[0-9 -()+]+$/;
                //if(intRegex.test(toInt)){
                  model.study.find({ref_id: req.query.id})
                  .exec(function(err,data){
                    if(err) throw err; 
                    if(data.length == 1) {           
                      res.render("investigation-result",{result:data});
                    } else {
                      res.render("investigation-result",{result:[]});
                    }
                  })
                //} else {
                //  res.render("investigation-result",{result:[]})
               // }
            } else {
              console.log(data)
              res.render("investigation-result",{result:data});
            }
          })
        } else {
          res.render("investigation-result",{result:data});
        }
      })
    break;
    case 'lab':
      model.study.find({ref_id: req.query.id})
      .exec(function(err,data){
        if(err) throw err;
        if(data.length == 1) {
          model.study.find({ref_id: req.query.id})
          .exec(function(err,data){
            if(err) throw err; 
            if(data.length == 1) {           
              res.render("investigation-result",{result:data});
            } else {
              res.render("investigation-result",{result:[]});
            }
          })
        } else {
          res.render("investigation-result",{result:[]});
        }
      })
    break;
    default:
      res.render("investigation-result",{result:[]})
    break;
  }
  //res.render("investigation-result");
});

router.get("/Studyshare&Teleradiology",function(req,res){
  res.render('teleradiology')
});

router.get("/dicom-mobile",function(req,res){
  //IP address of client will vary so study should map on the right client workspace 
  //using query strings Id to create link of study for mobile viewer.
  if(req.query.id){
    model.study.findById(req.query.id)
    .exec(function(err,result){
      if(err) throw err;
      if(result){
        var ovyMob = "http://" + result.ip_address + ":8080/applinic-dicom/home.html";
        res.redirect(ovyMob);
      } else {
        res.end("Patient study link not accurate or does not exist.")
      }
    })
  } else {
    res.redirect('http://167.71.149.196:8080/applinic-dicom/home.html');
  }
});

router.get("/dcm",function(req,res){
  //IP address of client will vary so study should map on the right client workspace 
  //using query strings Id to create link of study for mobile viewer.
  if(req.query.id){

    //model.study.findOne({$or:[{patient_id : req.query.id},{study_uid: req.query.id}]})
    model.study.findById(req.query.key)
    .exec(function(err,result){
      if(err) throw err;
      if(result){
        var locate = (result.patient_id) ? ("patientID=" + result.patient_id) : ("studyUID=" + result.study_uid);
        var ovyWeb = "http://" + result.ip_address + ":8080/web/viewer.html?" + locate;
        res.redirect(ovyWeb);
      } else {
        model.study.findOne({$or:[{patient_id : req.query.id},{study_uid: req.query.id}]})
        .exec(function(err,study){
          if(err) throw err;
          if(study){
            var locate = (result.patient_id) ? ("patientID=" + result.patient_id) : ("studyUID=" + result.study_uid);
            var ovyWeb = "http://" + result.ip_address + ":8080/web/viewer.html?" + locate;
            res.redirect(ovyWeb);
          } else {
            res.end("Patient study link not accurate or does not exist.")
          }
        })       
      }
    })
  } else {
    var link = 'http://167.71.149.196:8080/web/viewer.html?patientID=' + req.query.id;
    res.redirect(link);
  }
});

router.get("/report-template/:reporterId/:study_id",function(req,res){
  //params and query strings @reporterId @studyId;
  model.study.findById(req.params.study_id)
  .exec(function(err,study){
    if(err) throw err;
    if(study){
      var details = {
        study: study
      }
      model.user.findOne({user_id: study.center_id})
      .exec(function(err,center){
        if(err) throw err;
        if(center && typeof study.assigned_radiologist_id !== 'string'){
          var elemPos = study.assigned_radiologist_id.map(function(x){return x.id.toString()}).indexOf(req.params.reporterId);
          if(elemPos !== -1) {
            details.reporter = study.assigned_radiologist_id[elemPos];
            details.study.center_profile_pic_url = "https://applinic.com" + center.profile_pic_url;
           
            model.template.findOne({center_id: study.center_id,type:"Radiology"})
            .exec(function(err,temp){
              if(err) throw err;
              if(temp){
                details.template = temp;
                res.render('report-template',details);
              } else {
                model.template.findOne({center_id:"none",type: "Radiology"})
                .exec(function(err,tempDefault){
                  if(err) throw err;
                  details.template = tempDefault;
                  res.render('report-template',details);
                });
              }
            })            
          } else {
            //if the reporterId params not in center's reporters array
            res.json({Error: true, message: "Radiologist ID not recognized or not authorized for reporting this study."})
          }
        } else {
          res.json({Error: true, message: "Centre for such study does not exist"})
        }
      })
    } else if(center) {

      var elemPos = center.reporters.map(function(x){return x.id.toString()}).indexOf(req.params.reporterId);
      if(elemPos !== -1) {
        details.reporter = center.reporters[elemPos];
        details.study.center_profile_pic_url = "https://applinic.com" + center.profile_pic_url;
       
        model.template.findOne({center_id: study.center_id,type:"Radiology"})
        .exec(function(err,temp){
          if(err) throw err;
          if(temp){
            details.template = temp;
            res.render('report-template',details);
          } else {
            model.template.findOne({center_id:"none",type: "Radiology"})
            .exec(function(err,tempDefault){
              if(err) throw err;
              details.template = tempDefault;
              res.render('report-template',details);
            });
          }
        })
      } else {
        res.json({Error: true, message: "Radiologist ID not recognized or not authorized for reporting this study."})
      }            
      
    } else {
      res.json({status: "404", message: "Study not found or does not exist."})
    }
  })

 
});

router.post("/report-template",function(req,res){
    model.template.findOne({center_id: req.body.center_id,type: req.body.type})
    .exec(function(err,result){
    if(err) throw err;
    if(!result) {
      var temp = new model.template(req.body)
      temp.save(function(err,info){
        if(err) throw err;
        res.json({message: "Template created successfully"});
      })
    } else {
      res.json({message: "Template already exist"});
    }

   })
});

router.put("/report-template",function(req,res){
  model.study.findById(req.body._id)
  .exec(function(err,study){
    if(err) throw err;
    if(study){
      model.user.findOne({user_id: req.body.centerId})
      .exec(function(err,center){
        study.summary = req.body.summary || "";
        study.findings = req.body.findings || "";
        study.conclusion = req.body.conclusion || "";
        study.advise = req.body.advise || "";
        study.attended = true;
           
            var dt = + new Date();
            var pdfName = dt + "-" + Math.floor(Math.random() * 999999) + '.pdf';
            var filePath = './pdf/' + pdfName;
 
            pdf.create(req.body.html).toFile(filePath, function(err, file) { //start of toFile
              if (err) return console.log(err);                        

              var pdfPath = '/report/' + pdfName;
              var emailPDFPath = "https://applinic.com" + pdfPath;
            

              study.pdf_report.unshift({
                pathname: pdfPath,
                created: new Date()
              });

              req.body.pdfPathSave = pdfPath;
             
              /*var transporter = nodemailer.createTransport({
                host: "mail.privateemail.com",
                port: 465,
                auth: {
                  user: "info@applinic.com",
                  pass: process.env.EMAIL_PASSWORD
                }
              });*/

              var FILE_CONTENT = fs.readFileSync(file.filename, 'base64');
              var buf = Buffer.from(FILE_CONTENT, 'base64')

              var emailArr = [req.body.email];

              if(study.referring_physician_email) {
                emailArr.push(study.referring_physician_email);
              }

              var mob = "https://applinic.com/dicom-mobile?id=" + study._id;

              var mailOptions = {
                from: 'Applinic Healthcare info@applinic.com',
                to: emailArr || "support@applinic.com", //req.body.email
                subject: 'Complete Radiology Report',
                html: '<table><tr><tr><td style="line-height: 25px">Hi, please find the <b>Radiology Report</b> PDF for the study below:<br><br>'
                + 'Patient: ' + req.body.names + "<br>"
                + 'Investigation: ' + req.body.studyName + "<br>"
                + 'Patiend ID of Study: ' + study.patient_id + "<br>"
                + 'Ref: ' + req.body._id + "<br>"
                + "Reported by: " + req.body.reporter + "<br><br>"               
                + "Mobile DICOM viewer url: <br>" + study.study_link_mobile + "<br>"
                + "Web DICOM viewer url: <br>" + mob + "<br><br>"
                //+ "Report PDF: <br><img src='" + emailPDFPath + "'/><br><br>"
                + "<b>Applinic Team</b><br>"
                + '</td></tr></table>',
                attachments:[{
                  filename: pdfName,
                  content: buf,
                  contentType: 'application/pdf'
                }]
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.json({status: false, message: "Oops! Error occured while sending email. Please try again."})
                } else {
                  console.log('Email sent: ' + info.response);
                  res.json({status: true, message: "Report sent successfully.",report_pdf: pdfPath});
                }
              });

          if(study.isUserConnectLinking && study.referral_detail_dump[0]) {
            req.body.radiology = study.referral_detail_dump[0];
            model.session.findOne({session_id: req.body.radiology.radiology.session_id}).exec(function(err,data){
              if(err) throw err;

              var objectFound = data; 

              if(objectFound) {
                var pos = objectFound.diagnosis.radiology_test_results.map(function(x) { return x.test_id;}).indexOf(req.body.radiology.radiology.test_id);

                if(objectFound.diagnosis.radiology_test_results[pos]) {
                  var theObj = objectFound.diagnosis.radiology_test_results[pos];         
                  theObj.receive_date = + new Date();
                  theObj.test_to_run = req.body.radiology.radiology.test_to_run;
                  theObj.report = req.body.radiology.radiology.report;
                  theObj.conclusion = req.body.conclusion;
                  theObj.sent_date = req.body.radiology.date;
                  theObj.test_ran_by = req.body.centerName;
                  theObj.center_address = req.body.centerAddress;
                  theObj.center_city = req.body.centerCity;
                  theObj.center_country = req.body.centerCountry;
                  theObj.center_phone = req.body.centerPhone;
                  theObj.indication = req.body.summary;
                  //theObj.center_profile_pic_url =  req.user.profile_pic_url;
                  theObj.study_ref_id = study._id;
                  theObj.patient_id_of_study = study.patient_id;
                }             
                
                data.save(function(err,info){
                  if(err) {
                    res.send({status: "error"});
                  } else { 
                    updatePatient()
                  }
                }); 

              }              

            });
            
          } //end of if

          function updatePatient() {         
                //here patient test result is updated.
                model.user.findOne({user_id: req.body.radiology.radiology.patient_id},{medical_records: 1,patient_notification:1,user_id:1,presence:1,phone:1,email:1,title:1,firstname:1,lastname:1})
                .exec(function(err,data){
                  if(err) throw err;
                  var elementPos = data.medical_records.radiology_test.map(function(x) {return x.session_id; }).indexOf(req.body.radiology.radiology.session_id);
                  var objectFound = data.medical_records.radiology_test[elementPos]; 

                  if(objectFound) {         
                    objectFound.report = req.body.radiology.radiology.report || "Not specified";
                    objectFound.conclusion = req.body.conclusion || "Not specified";
                    objectFound.findings = req.body.findings || "Not specified";
                    objectFound.advise = req.body.advise || "Not specified";
                    objectFound.test_to_run = req.body.radiology.radiology.test_to_run || objectFound.test_to_run;
                    objectFound.sent_date = req.body.date || objectFound.sent_date;
                    objectFound.receive_date = req.body.radiology.radiology.date || (+ new Date());
                    objectFound.payment_acknowledgement = true;
                    objectFound.files = req.body.radiology.radiology.filesUrl;
                    objectFound.indication = req.body.radiology.radiology.indication;
                    objectFound.acc = req.body.radiology.radiology.acc;
                    objectFound.study_id = study._id;
                    objectFound.patient_id_of_study = study.patient_id;
                    objectFound.pdf_report.unshift({
                      pathname: req.body.pdfPathSave,
                      created: new Date()
                    })

                    //var random = Math.floor(Math.random() * 999999);
                    data.patient_notification.unshift({
                      type:"radiology",
                      date: req.body.radiology.radiology.date || (+ new Date()),
                      note_id: req.body.radiology.radiology.test_id,
                      ref_id: req.body.ref_id,
                      session_id:req.body.radiology.radiology.session_id,
                      message: "Radiology test result received."
                    });

                    if(data.presence === true){
                      io.sockets.to(data.user_id).emit("notification",{status:true});
                    } 

                    var msgBody = "Radiology test result received! login http://applinic.com/login" 
                    + "\nPatient ID of study: " + study.patient_id
                    + "\nStudy Link Mobile: " + "https://applinic.com/dicom-mobile?id=" + study._id
                    var phoneNunber =  data.phone;
                    sms.messages.create(
                      {
                        to: phoneNunber,
                        from: '+16467985692',
                        body: msgBody,
                      }
                    ) 
                    

                    /*var transporter = nodemailer.createTransport({
                      host: "mail.privateemail.com",
                      port: 465,
                      auth: {
                        user: "info@applinic.com",
                        pass: process.env.EMAIL_PASSWORD
                      }
                    });*/

                    var mailOptions = {
                      from: 'Applinic info@applinic.com',
                      to: data.email,
                      subject: 'Radiology Study Report Received',
                      html: '<table><tr><th><h3 style="background-color:#85CE36; color: #fff; padding: 30px"><img src="https://applinic.com/assets/images/applinic1.png" style="width: 250px; height: auto"/><br/><span>Healthcare... anywhere, anytime.</span></h3></th></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><b>Hello ' + data.title + " " + data.lastname + ",</b><br>"
                      + "<br><br>kindly find attached report of your  <br>" 
                      + "<b>" + req.body.studyName + "</b> below. <br><br>"
                     // + "Study Name: " + + "<br><br>"
                     
                      //+ "Study Link: " + ovyWeb + "<br><br>"
                      //+ "Study Link Mobile: " + "https://applinic.com/dicom-mobile?id=" + study._id + "<br><br>"
                     // + "Kindly <a href='https://applinic.com/login'>log in to your account</a> to view the report. Check in notification bell icon for latest updates<br><br>"
                      //+ "Thank you for using Applinic.<br><br>"
                      //+ "For ease of usage, you may download the Applinic mobile application on google play store if you use an android phone. " 
                      //+ "<a href='https://play.google.com/store/apps/details?id=com.farelandsnigeria.applinic'>Click here </a> to do so now.<br><br>"
                      + "For inquiries please call customer support on +2349080045678 or email us at support@applinic.com<br><br>"
                      + "Thank you for using Applinic.<br></br><br>"
                      + "<b>Applinic Team</b></td></tr></table>",
                      attachments:[{
                        filename: pdfName,
                        content: buf,
                        contentType: 'application/pdf'
                      }]
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });

                    
                    data.save(function(err,info){
                      if(err) res.send({status: "error"});           
                      //res.send({status: "success"});
                    });

                  } else {
                    res.end("error: 404")
                  }
                });
          }




              /////////////



            study.save(function(err,info){})

            }) //end of toFile

          
          
      });



    } else {
      res.json({Error: true, message: "Study does not exist"});
    }


  })

}); 

router.post("/email-report",function(req,res){
  model.study.findById(req.body._id)
  .exec(function(err,study){
    if(err) throw err;
    if(study){
      var reportLink = 'https://applinic.com/report-template/' + req.body.experReporter.id + "/" + req.body._id;
      study.summary = req.body.summary || "";
      study.findings = req.body.findings || "";
      study.conclusion = req.body.conclusion || "";
      study.advise = req.body.advise || "";
      study.save(function(err,info){
        if(err) throw err;
        if(info){
          /*var transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            auth: {
              user: "info@applinic.com",
              pass: process.env.EMAIL_PASSWORD
            }
          });*/

          var mailOptions = {
            from: 'Applinic Healthcare info@applinic.com',
            to: req.body.experReporter.email || "support@applinic.com",
            subject: 'Review Investigation Report for study ' + req.body._id,
            html: '<table><tr><tr><td style="line-height: 25px">Sir, <br> Kindly review and edit the report written by <b>' 
            + req.body.reporter + '</b>. See details and report template URL below:<br><br>'
            + 'Patient: ' + req.body.names + "<br>"
            + 'Investigation: ' + req.body.studyName + "<br>"
            + 'Ref: ' + req.body._id + "<br>"
            + '<b>Forwarded by</b>: <br>' + req.body.reporter 
            + "<br>Designation: " + req.body.reporterDesignation
            + '<br>Email: ' + req.body.reporterEmail + "<br><br>"
            + "Web DICOM viewer url: <br>" + req.body.studyLink + "<br>"
            + "Report Template URL: <br>" + reportLink + "<br><br>"
            + "Applinic Team"
            + '</td></tr></table>'
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.json({status: false, message: "Oops! Error occured while sending email. Please try again."})
            } else {
              console.log('Email sent: ' + info.response);
              res.json({status: true, message: "Report sent successfully."})
            }
          });

        } else {
          res.json({status: false, message: "Something went wrong. Please try again."})
        }
      })

    } else {
      res.json({status: false, message: "Study with ID not found."})
    }
  })
  
})

router.get("/radiologist-studies",function(req,res){
  var reporterId = (req.query.reporterID) ? parseInt(req.query.reporterID) : null;
  var criteria = (req.query.isUnattended == "yes") ?
   {"assigned_radiologist_id.id": reporterId,attended: false} : {"assigned_radiologist_id.id": reporterId}
  model.study.find(criteria)
  .exec(function(err,data){
    if(err) throw err;
    res.json(data);
  })
})


router.get("/user/reporting-radiologist",function(req,res){
  if(req.user) {
    var radiologists = req.user.reporters || [];
    res.json({reporters: radiologists, package: req.user.dicom_enterprise});
  } else {
    res.end("unauthorized access");
  }
});



router.post("/user/reporting-radiologist",function(req,res){
  if(req.user) {
    model.user.findOne({user_id: req.user.user_id})
    .exec(function(err,data){
      if(err) throw err;
      if(data) {
        req.body.id = randos.genRef(8);
        data.reporters.push(req.body);
        data.save(function(err,inf){
          if(err) throw err;
          res.json({message: "Radiologist added successfully.",status: true})
        });
      } else {
        res.end("User not found");
      }
    })
  } else {
    res.end("unauthorized access");
  }
});

router.put("/user/reporting-radiologist",function(req,res){
  if(req.user) {
    model.user.findOne({user_id: req.user.user_id})
    .exec(function(err,data){
      if(err) throw err;
      if(data) {
        var elem = data.reporters.map(function(x){return x.id}).indexOf(req.body.id);
        if(elem !== -1) {
          data.reporters.splice(elem,1)
          data.reporters.push(req.body);
        } else if (req.body.id && req.body.name) {
          data.reporters.push(req.body);
        }

        data.save(function(err,inf){
          if(err) throw err;
          res.json({message: "Radiologist updated successfully.",status: true, radiologist: req.body})
        });
      } else {
        res.end("User not found");
      }
    })
  } else {
    res.end("unauthorized access");
  }
});

router.delete("/user/reporting-radiologist",function(req,res){
  if(req.user) {
    model.user.findOne({user_id: req.user.user_id})
    .exec(function(err,data){
      if(err) throw err;
      if(data) {
        var elem = data.reporters.map(function(x){return x.id}).indexOf(req.body.id);
        if(elem !== -1) {
          data.reporters.splice(elem,1)
        }
       
        data.save(function(err,inf){
          if(err) throw err;
          res.json({message: "Radiologist deleted successfully.",status: true})
        });
      } else {
        res.end("User not found");
      }
    })
  } else {
    res.end("unauthorized access");
  }
});




router.get("/api/reporting-radiologist",function(req,res){
  model.user.findOne({user_id: req.query.centerId})
  .exec(function(err,result){
    if(err) throw err;
    if(result) {
      res.json(result.reporters);
    } else {
      res.json([]);
    }
  }); 
});

router.get("/user/study-reports",function(req,res){
  if(req.user){
    if(!req.query.stdId){
      res.json({})
      return
    }

    model.study.findById(req.query.stdId)
    .exec(function(err,study){
      if(err) throw err;
      if(study){
        res.json(study)
        
      } else {
        res.json({})
      }
    })
  } else {
    res.end("unauthorized access")
  }
})


router.get("/lab-template/:temp/:labData/:count",function(req,res){
  if(mongoose.Types.ObjectId.isValid(req.params.labData)){
    model.lab_store.findById(req.params.labData)
    .exec(function(err,labData){
      if(err) throw err;
      if(labData){
        labData.moment = moment;
        res.render("lab-report-template",labData) 
      } else {
        res.end("Template not found!")
      }
    })
  } else {
    res.end("Error: record not found or invalid")
  }
    
})

router.get("/entry/doc-details/dshjhdfhsdgsd",function(req,res){  
  res.render("doc-entry")
})

router.post("/entry/doc-details/dshjhdfhsdgsd",function(req,res){
  //if(req.body.length > 0){    
    var count = 0;
    var regDoctor;
    var doc;

    doc = req.body;
    if(doc.fx_number && doc.name) {
      doc.created = new Date();
      regDoctor = new model.doc_entry(doc)
      regDoctor.save(function(err,info){
        if(err) throw err;
        res.json({message: "Entries saved successfully!",status: true,doc:req.body});
      })
    } else {
      res.json({message: "No entries. Nothing was saved"})
    }
    /*req.body.forEach(function(doc){
      if(doc.fx_number && doc.name) {
        doc.created = new Date();
        regDoctor = new model.doc_entry(doc)
        regDoctor.save(function(err,info){
          if(err) throw err;
        })
      }
    })  
    while(count < req.body.length){
      doc = req.body;
      if(doc.fx_number && doc.name) {
        doc.created = new Date();
        regDoctor = new model.doc_entry(doc)
        regDoctor.save(function(err,info){
          if(err) throw err;
        })
      }
      count++;
    }*/
    

  //} else {
   // res.json({message: "No entries. Nothing was saved"})
  //}

})

router.get("/user/lab-report/signees",function(req,res){
  if(req.user) {
    res.json(req.user.report_signees)
  } else {
    res.json({error: true, message: "Not in session or not logged in."})
  }
})

router.post("/user/lab-report/signees",function(req,res){
  if(req.user) {
    model.user.findOne({user_id: req.user.user_id})
    .exec(function(err,user){
      if(err) throw err;
      user.report_signees.push(req.body);
      user.save(function(err,info){
        if(err) throw err;
        res.json({success: true})
      })
    })
  } else {
    res.json({error: true, message: "Not in session or not logged in."});
  }
})

router.delete("/user/lab-report/signees",function(req,res){
  if(req.user){
    model.user.findOne({user_id: req.user.user_id})
    .exec(function(err,user){
      var elemPos = user.report_signees.map(function(x){return x.id}).indexOf(req.query.id)
      if(elemPos !== -1) {
        user.report_signees.splice(elemPos,1);
        user.save(function(err,info){
          if(err) throw err;
          res.json({success: true})
        })
      } else {
        res.json({error: true, message: "Pathologist or Scientist does not exist"});
      }
    });   
  } else {
    res.json({error: true, message: "Not in session or not logged in."});
  }
});

router.get("/user/patient/consultation-fee",function(req,res){ //this route is also used by patient to get consultation fee
  if(req.user){
    if(req.query.isMultiple){
      model.consultationFee.find({patient_id: req.user.user_id})
      .exec(function(err,fees){
        if(err) throw err;
        res.json(fees)
      })
    } else {
      model.consultationFee.findById(req.query.id)
      .exec(function(err,fee){
        if(err) throw err;
        if(fee){
          model.user.findOne({user_id: fee.doctor_id},{title:1,name: 1, profile_pic_url:1, specialty:1,firstname:1,lastname:1})
          .exec(function(err,doc){
            if(err) throw err;
            var sendObj = {
              fee: fee,
              sender: doc
            }
            res.json(sendObj)
          });   
        } else {
          res.json({})
        }
      })
    }
  } else {
    res.end("unathorized access!")
  }
});

router.post("/user/doctor/consultation-fee",function(req,res){
  if(req.user) {
    var date = new Date();
    var id = randos.genRef(10);
    var consultFee = new model.consultationFee({
      status: 'Pending',
      is_paid: false,
      amount: req.body.consultation_fee,
      doctor_id: req.user.user_id,
      patient_id: req.body.patientId,
      date: date,
      strAmount: req.body.message.strAmt,
      deleted: false,
      commission: req.body.commission,
      invoiceId: id
    });

    model.user.findOne({user_id: req.body.patientId,type: "Patient"})
    .exec(function(err,patient){
      if(err) throw err;
      if(patient){
        var mail = patient.patient_mail;
        req.body.service_access = true;
        var random = randos.genRef(8);
        mail.push({
          message_id: random.toString(),
          user_id: req.user.user_id,
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          title: req.user.title,
          message: "Consultation Fee",
          date: date,
          consultation_fee: req.body.consultation_fee,
          profile_pic_url: req.user.profile_pic_url,
          profile_url: req.user.profile_url,
          specialty: req.user.specialty,
          consultationFeeId: consultFee._id
        });
        patient.save(function(err,info){});
      }
    })

    var elemPos = req.user.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(req.body.patientId);
    var patient;

    if(elemPos !== -1){
      patient = req.user.doctor_patients_list[elemPos] || {};
      patient.fee_history.unshift(req.body.message)
      req.user.save(function(err,info){
        if(err) throw err;
        console.log("fee history saved on doc patients' list");
      })
    }

    consultFee.save(function(err,info){
      if(err) throw err;
      res.json({status: true,patient: patient});

      var names = req.user.name;

      var msgBody = "Hello " + patient.patient_firstname + ", " + names
      + "\nhereby requests the fees for his consultation and medical services."
      + "\nThe total amount is " + req.body.message.strAmt
      + "\nKindly fund your Applinic account and settle the payment."     
      + "\nhttps://applinic.com/login";

      var phoneNunber =  req.body.patient_phone || "+2348064245256";
      
      sms.messages.create(
        {
          to: phoneNunber,
          from: '+16467985692',
          body: msgBody,
        },
        callBack
       ) 

       function callBack(err,info) {
        if(err) console.log(err);
       }

       io.sockets.to(req.body.patientId).emit("new consultation fee",{status: true,sender: names});
    });

  } else {
    res.json({error: true, message: "Session has expired! Please longin again."});
  }
});


router.get("/user/chat/general",function(req,res){
  if(req.user){
    res.render("general-chat")
  } else {
    res.end("unauthorized access.")
  }
});

router.get("/drug-kits/all",function(req,res){ 
  model.kits.find({})
  .exec(function(err,kits){
    if(err) throw err;
    res.json(kits);
  })
})

router.get("/drug-kits",function(req,res){ 
  //if(req.user){
    var str = new RegExp(req.query.name.replace(/\s+/g,"\\s+"), "gi"); 
    model.kits.find({type: req.query.type, disease: { $regex: str, $options: 'i' }})
    .exec(function(err,kits){
      if(err) throw err;
      res.json(kits);
    })

 // } else {
 //   res.end("unathorized access!");
  //}
});

router.post("/user/drug-kits",function(req,res){ 
  if(req.user.admin){
    model.kits.find({})
    .exec(function(err,data){
      if(err) throw err
      req.body.package = data.length + 1;
      req.body.created = new Date();
      var kit = new model.kits(req.body)
      kit.save(function(err,info){
        if(err) throw err;
        console.log("kit created and saved!");
        res.json({status: true, message: "kit created and saved successfully."})
      })
    })    
  } else {
    res.end("unathorized access!")
  }
})

router.get("/covid-19",function(req,res){
  res.render("covid-19")
})

router.get("/covid-19",function(req,res){
  res.render("covid-19")
})

router.post("/user/import-patient",function(req,res){
  if(req.user){
    if(req.user.admin) {
      model.user.findOne({phone: req.body.phone,type: "Patient"})
      .exec(function(err,patient){
        if(err) throw err;
        if(patient){
            model.user.findOne({phone: req.body.doctorPhone,type: "Doctor"})
            .exec(function(err,doctor){
              if(err) throw err;
              if(doctor){
                var elemPos = patient.accepted_doctors.map(function(x){return x.doctor_id}).indexOf(doctor.user_id)
                if(elemPos == -1) {
                  patient.accepted_doctors.unshift({
                    doctor_id: doctor.user_id,
                    date_of_acceptance: + new Date(),
                    doctor_firstname: doctor.name,
                    doctor_lastname:  doctor.lastname,
                    doctor_profile_pic_url: doctor.profile_pic_url,
                    service_access: true,
                    doctor_specialty: doctor.specialty          
                  });
                }
                var elemPos2 = doctor.doctor_patients_list.map(function(x){return x.patient_id}).indexOf(patient.user_id)
                if(elemPos2 == -1) {
                  doctor.doctor_patients_list.unshift({
                    patient_firstname: patient.firstname,
                    date: + new Date(),
                    patient_lastname: patient.lastname,
                    patient_id: patient.user_id,
                    patient_profile_pic_url: patient.profile_pic_url,
                    patient_address: patient.address,
                    patient_city: patient.city,
                    Patient_country: patient.country,
                    patient_gender: patient.gender,
                    patient_age: patient.age,
                    presence: false,
                    initial_complaint: {
                      complaint: "This patient was added through invitation. No complaint was recorded.",
                      complaint_date: + new Date(),
                      date_received: + new Date(),
                    }
                  });
                }

                patient.save(function(err,info){
                  if(err) throw err;
                  console.log("Doctor added to patient list")
                });

                doctor.save(function(err,info){
                  if(err) throw err;
                   console.log("Patient added to doctor list");
                   res.json({status: true,message: 'Success!'})
                });

              } else {
                res.json({status: false, message: "Doctor not found"})
              }
            })
        } else {
          res.json({status: false, message: "Patient not found"})
        }
      });

    } else {
      res.json({status: false, message: "You have no permission to do this."})
    }
  } else {
    res.end("Unauthorized Access")
  }
});


router.get('/user/video',function(req,res){
  if(req.user) {
     var script = "https://tokbox.com/embed/embed/ot-embed.js?embedId=1cf8b23e-3a59-4012-a2ac-8fff36468112&room=" +
     req.query.roomId;
    if(req.user.type == "Doctor"){
      res.render("tokbox-video",{tokBox: script})
    } else {
      res.render("tokbox-video2",{tokBox: script})
    }
  } else {
    res.redirect('login')
  }
  
})





/*router.get("/lab/report-template/:_id",function(req,res){
  //params and query strings @reporterId @studyId @refId
  // if the study was done in applinic initially it will have a query string of @refId;
  res.render('report-template');
});*/



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