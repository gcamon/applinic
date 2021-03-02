angular.module('templates',[])
.run(["$templateCache",function($templateCache) {
   $templateCache.put('my-doctors.html','<style> .col-md-6 {padding: 0 5px}</style><div style="position: relative"><h4 class="h4"> My Doctors</h4><div style="position: absolute;right: 0;top:5px"> <a href="" ng-click="inviteDoc()" class="btn btn-sm btn-primary"><i class="fa fa-user-plus"></i></a>&nbsp;&nbsp; <a href="#/find-specialist" class="btn btn-sm btn-primary"><i class="fa fa-search"></i></a></div></div><div><div class="col-md-6" ng-repeat="j in patientsDoctorList | orderBy: \'-presence\' | filter : person" ng-if="!j.deleted"><div class="card"><div class="col-md-4 col-sm-4 col-xs-4 pl-1 pt-1"> <a href="{{\'/user/profile/view/\' + j.doctor_id}}" target="_blank"> <img src="{{j.doctor_profile_pic_url}}" style="width: auto;max-height: 170px" alt="Profile Picture" /> </a></div><div class="pt-2 pb-1 col-md-8 col-sm-8 col-xs-8 pl-1" style="min-height: 110px;max-height: 140px; position: relative;"><div><h5 class="mb-0 pb-0 ellipsis">{{j.doctor_title}} {{j.doctor_lastname}} {{j.doctor_firstname}}</h5></div><div class="text-muted"> <span class="ellipsis block"><i class="icon-stethoscopetwo"></i> {{j.doctor_specialty || \'N/A\'}}</span> <span class="block ellipsis"> <i class="fa fa-map-marker text-primary" ng-show="j.presence"></i><i class="fa fa-map-marker" ng-show="!j.presence"></i> {{j.work_place}} {{j.doctor_city || "Enugu"}}</span></div><div> <a href="" ng-click="appointments(j.sessionId)" ng-if="j.isNewAppointment" title="In-person meeting appointment with this doctor"> <i class="fa fa-clock-o text-primary" aria-hidden="true"></i> <span class="text-danger" style="font-size: 14px">{{j.appDate | amCalendar }}</span> </a> <a href="" ng-if="!j.isNewAppointment" style="height: 13px">&nbsp;</a><br></div> <i class="online" ng-show="j.presence" title="Online" style="position: absolute;top: 3px; right: 5px"></i> <i class="online" ng-show="!j.presence" title="Offline" style="position: absolute;top: 3px; right: 5px;background-color: #eee"></i></div><div class="clearfix"></div> <br><div style="position: relative;" class="pl-1 pb-1"><div> <label class="switch"> <input type="checkbox" class="success" ng-model="j.access" ng-change="updateAccess(j)"> <span class="slider round"></span> </label><div style="display: inline-block;margin-left: 10px;font-size: 22px;float: left;margin-top: -5px"> <a href="" class="btn btn-neutral text-primary" ng-click="viewPrescription2(\'single\',j.doctor_id)"> <i class="icon-Pills"></i> <sup> <span class="counter btn-danger" ng-show="j.indicators.pharmacy.indexOf(j.doctor_id) !== -1" style="border-radius: 12px;width: 10px;height: 10px;display: inline-block;"></span> </sup> </a> <a href="" class="btn btn-neutral text-primary" ng-click="viewLabTest2(\'single\',j.doctor_id)"> <i class="fa fa-microscope"></i> <sup> <span class="counter btn-danger" ng-show="j.indicators.laboratory.indexOf(j.doctor_id) !== -1" style="border-radius: 12px;width: 10px;height: 10px;display: inline-block;"></span> </sup> </a> <a href="" class="btn btn-neutral text-primary" ng-click="viewRadioTest2(\'single\',j.doctor_id)"> <i class="fa fa-radiation-alt"></i> <sup> <span class="counter btn-danger" ng-show="j.indicators.radiology.indexOf(j.doctor_id) !== -1" style="border-radius: 12px;width: 10px;height: 10px;display: inline-block;"></span> </sup> </a></div></div><div class="clearfix"></div> <br> <i class="fa fa-ellipsis-v text-muted" style="position: absolute;right: 15px;bottom: 10px;cursor: pointer;padding: 5px;font-size: 25px" ng-click="popup(j)"></i><div ng-class="{\'popup2\': j.isManage == true}" ng-if="j.isManage" style="line-height: 35px;padding: 5px"><div ng-click="closePop(j)"><i class="fa fa-times text-primary"></i></div> <a href="{{\'/user/profile/view/\' + j.doctor_id}}" target="_blank" class="pt-1 pb-1 font-1_1"><i class="fa fa-user-md text-success"></i> View Profile</a><br> <a href="" ng-click="appointments(j.sessionId)" class="pt-1 pb-1 font-1_1"><i class="fa fa-calendar text-success"></i> In-Person Meeting</a><br> <a href="" ng-click="consultationFee(j)" class="pt-1 pb-1 font-1_1"><i class="fa fa-money text-success"></i> Consultation Fees</a><br> <a href="" ng-click="viewChat2(j.doctor_id)" class="pt-1 pb-1 font-1_1"><i class="fa fa-comments text-success"></i> Chat with Doctor <i class="fa fa-spinner fa-pulse fa-1x fa-fw" style="color:orange" ng-if="loading"></i> </a><br><a href="" ng-click="audioChat(j)" class="pt-1 pb-1 font-1_1"><i class="fa fa-phone text-success"></i> Audio Chat</a><br><a href="" ng-click="videoChat(j)" class="pt-1 pb-1 font-1_1"><i class="fa fa-video-camera text-success"></i> Video Chat</a><br> <a href="" ng-click="removePatient(j)" class="pt-1 pb-1 font-1_1"><i class="fa fa-times text-danger"></i> Remove Doctor</a></div></div></div></div><div class="clearfix"></div><div class="card"><p ng-show="patientsDoctorList.length === 0" style="text-align: center;padding: 20px;font-weight: bold;">You can <a href="#/invite"> Invite your doctor </a> or <a href="#/find-specialist">Search for a physician</a> who you wish to manage your health issues in Applinic.</p></div><div><h4 class="h4 pt-2"> Featured Doctors</h4><div><div class="col-md-6" ng-repeat="j in firstLineDoctors | orderBy: \'-presence\' | filter : person"><div class="card"><div class="col-md-4 col-sm-4 col-xs-4 pl-1 pt-1"> <a href="{{\'/user/profile/view/\' + j.doctor_id}}" target="_blank"> <img src="{{j.doctor_profile_pic_url}}" style="width: auto;max-height: 170px" alt="Profile Picture" /> </a></div><div class="pt-2 pb-1 col-md-8 col-sm-8 col-xs-8 pl-1" style="min-height: 110px;max-height: 140px; position: relative;"><div><h5 class="mb-0 pb-0 ellipsis">{{j.doctor_title}} {{j.doctor_lastname}} {{j.doctor_firstname}}</h5></div><div class="text-muted"> <span class="ellipsis block"><i class="icon-stethoscopetwo"></i> {{j.doctor_specialty || \'N/A\'}}</span> <span class="ellipsis block"><i class="fa fa-map-marker text-primary" ng-show="j.presence"></i> <i class="fa fa-map-marker" ng-show="!j.presence"></i> {{j.work_place}} {{j.doctor_city || "Enugu"}}</span></div><div> <a href="" ng-click="appointments(j.sessionId)" ng-if="j.isNewAppointment" title="In-person meeting appointment with this doctor"> <i class="fa fa-clock-o text-primary" aria-hidden="true"></i> <span class="text-danger" style="font-size: 14px">{{j.appDate | amCalendar }}</span> </a> <a href="" ng-if="!j.isNewAppointment" style="height: 13px">&nbsp;</a><br></div> <i class="online" ng-show="j.presence" title="Online" style="position: absolute;top: 3px; right: 5px"></i> <i class="online" ng-show="!j.presence" title="Offline" style="position: absolute;top: 3px; right: 5px;background-color: #eee"></i></div><div class="clearfix"></div> <br><div style="position: relative;" class="pl-1 pb-1"><div> <label class="switch"> <input type="checkbox" class="success" ng-model="j.access" ng-change="updateAccess(j)"> <span class="slider round"></span> </label><div style="display: inline-block;margin-left: 10px;font-size: 22px;float: left;margin-top: -5px"> <a href="" class="btn btn-neutral text-primary" ng-click="viewPrescription2(\'single\',j.doctor_id)"> <i class="icon-Pills"></i> <sup> <span class="counter btn-danger" ng-show="j.indicators.pharmacy.indexOf(j.doctor_id) !== -1" style="border-radius: 12px;width: 10px;height: 10px;display: inline-block;"></span> </sup> </a> <a href="" class="btn btn-neutral text-primary" ng-click="viewLabTest2(\'single\',j.doctor_id)"> <i class="fa fa-microscope"></i> <sup> <span class="counter btn-danger" ng-show="j.indicators.laboratory.indexOf(j.doctor_id) !== -1" style="border-radius: 12px;width: 10px;height: 10px;display: inline-block;"></span> </sup> </a> <a href="" class="btn btn-neutral text-primary" ng-click="viewRadioTest2(\'single\',j.doctor_id)"> <i class="fa fa-radiation-alt"></i> <sup> <span class="counter btn-danger" ng-show="j.indicators.radiology.indexOf(j.doctor_id) !== -1" style="border-radius: 12px;width: 10px;height: 10px;display: inline-block;"></span> </sup> </a></div></div><div class="clearfix"></div> <br> <i class="fa fa-ellipsis-v text-muted" style="position: absolute;right: 15px;bottom: 10px;cursor: pointer;padding: 5px;font-size: 25px" ng-click="popup(j)"></i><div ng-class="{\'popup2\': j.isManage == true}" ng-if="j.isManage" style="line-height: 35px;padding: 5px"><div style="position: absolute;top:4px;right: 10px" ng-click="closePop(j)"><i class="fa fa-times text-info"></i></div> <a href="{{\'/user/profile/view/\' + j.doctor_id}}" target="_blank"><i class="fa fa-user-md text-success"></i> View Profile</a><br> <a href="" ng-click="appointments(j.sessionId)"><i class="fa fa-calendar text-success"></i> In-Person Meeting</a><br> <a href="" ng-click="consultationFee(j)"><i class="fa fa-money text-success"></i> Consultation Fees</a><br> <a href="" ng-click="viewChat2(j.doctor_id)"><i class="fa fa-comments text-success"></i> Chat with Doctor <i class="fa fa-spinner fa-pulse fa-1x fa-fw" style="color:orange" ng-if="loading"></i> </a><br><a href="" ng-click="audioChat(j)"><i class="fa fa-phone text-success"></i> Audio Chat</a><br><a href="" ng-click="videoChat(j)"><i class="fa fa-video-camera text-success"></i> Video Chat</a><br></div></div></div></div></div> &nbsp;</div><div style="height: 300px"></div></div>')
   $templateCache.put("patient-appointment.html",'<div class="card-center-1"> <a href="#{{path || "/my-doctors"}}" class="btn btn-neutral"><i class="fa fa-arrow-left"></i> Back</a></div><div class="card-center-1"><h4 class="h4">Appointments</h4></div><div class="card-center-1"> <input type="text" class="form-control" name="" placeholder="search" ng-model="search"></div> <br><div class="card-center-1"><h6>Current</h6></div><div class="card card-center-1 p-1 mb-2" ng-repeat="app in appFetchedData.active | filter: search"><div style="position: relative;"> <a href=""> <b style="font-size: 16px" class="text-muted" ng-class="{\'text-primary\': app.isToday,\'text-danger\': app.isPassed }"> {{app.date | amCalendar}}</b><br> <span>{{app.title}} {{app.firstname}} {{app.lastname}}</span><br> <span>{{app.date | date : \'mediumDate\'}}</span><br> <span>{{app.address}}</span> </a> <time style="position: absolute;top: 2px; right: 5px;font-size: 16px" class="text-muted" ng-class="{\'text-primary\': app.isToday && !app.isTime,\'text-warning\': app.isTime }"><b>{{app.time | date: \'shortTime\'}}</b></time> <article style="position: absolute;bottom: 0; right: -5px;font-size: 16px"> <a href="" ng-click="ask(app)"><i class="btn btn-simple btn-sm fa fa-comment"></i></a> <i class="fa fa-spinner fa-pulse fa-1x fa-fw" style="color:orange" ng-show="app.loading"> </i> </article></div></div> <br><div class="card-center-1"><h6>Elapsed</h6></div><div class="card card-center-1 p-1 mb-2" ng-repeat="app in appFetchedData.passed | orderBy: \'-date\' | filter: search"><div style="position: relative;"> <a href=""> <b style="font-size: 16px" class="text-muted" ng-class="{\'text-primary\': app.isToday,\'text-danger\': app.isPassed }"> {{app.date | amCalendar}}</b><br> <span>{{app.title}} {{app.firstname}} {{app.lastname}}</span><br> <span>{{app.date | date : \'mediumDate\'}}</span><br> <span>{{app.address}}</span> </a> <time style="position: absolute;top: 2px; right: 5px;font-size: 16px" class="text-muted" ng-class="{\'text-primary\': app.isToday && !app.isTime,\'hide\': app.isPassed, \'text-warning\': app.isTime }"><b>{{app.time | date: \'shortTime\'}}</b></time> <article style="position: absolute;bottom: 0; right: -5px;font-size: 16px"> <a href="" ng-click="ask(app)"><i class="btn btn-simple btn-sm fa fa-comment"></i></a> <i class="fa fa-spinner fa-pulse fa-1x fa-fw" style="color:orange" ng-show="app.loading"> </i> </article></div></div><div style="height: 200px;text-align: center;padding: 20px 0"> <i class="fa fa-spinner fa-pulse fa-1x fa-fw" style="color: orange;font-size: 18px" ng-show="!appFetchedData"></i></div>')
   //$templateCache.put("patient-view-prescriptions.html",'<div class="card-center-1"><a href="#/my-doctors" class="btn btn-neutral"><i class="fa fa-arrow-left"></i> Back</a></div><div class="pl-0 card-center-1" style="position: relative;"><div class="col-md-7"><h4 class="pt-1 h4">Prescriptions</h4></div><div class="col-md-5 pl-0"> <input type="text" name="" placeholder="Filter by test name, center name, date sent, date received, etc" ng-model="filterResult" class="form-control"></div></div><div class="clearfix"></div><div class="card card-center-1 mb-1" ng-repeat="docInfo in prescriptionRecordsResult |filter : filterResult | orderBy: \'-date'" id=\"{{docInfo.prescriptionId}}\"><div><div class=\"pl-1 pt-1\" style=\"position: relative;\"> <button class=\"collapsed dropdown-toggle btn btn-neutral btn-sm\" role=\"button\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#{{'pres' + docInfo.ref_id + docInfo.prescriptionId}}\" aria-expanded="false" aria-controls=\"collapsefifty\">View details</button> <span am-time-Ago=\"docInfo.date\" style=\"position: absolute;top:20px;right: 20px\"></span></div><div style=\"line-height: 30px;\" id=\"{{'pres' + docInfo.ref_id + docInfo.prescriptionId}}\" class=\"panel-collapse collapse p-1\" role=\"tabpanel\" aria-labelledby=\"headingfifty\"><strong style=\"font-weight: bold;padding: 15px 0px 5px;line-height: 35px\"> Prescribed by: </strong> <span>{{docInfo.title}} {{docInfo.doctor_firstname}} {{docInfo.doctor_lastname}}</span> <br><span ng-if=\"docInfo.doctor_work_place\"><strong style="" ng-if=\"docInfo.doctor_specialty\" >Specialty: </strong> <span>{{docInfo.doctor_specialty}}</span><br></span><span ng-if=\"docInfo.doctor_work_place\"><strong> Place of work: </strong> <span>{{docInfo.doctor_work_place}}</span><br></span><strong> Address:</strong> <span>{{docInfo.doctor_address}} {{docInfo.doctor_city}} {{docInfo.doctor_country}}</span><br><strong>Date of prescription</strong> : <span>{{docInfo.date | date: \"mediumDate\"}} ( <span am-time-Ago=\"docInfo.date\"></span> )</span><br><strong>Prescription ID :</strong> <span>{{(docInfo.copy) ? \"Copied!\" : docInfo.prescriptionId}}</span> <a href="" clipboard supported=\"supported\" text=\"docInfo.prescriptionId\" on-copied=\"success(docInfo)\" on-error=\"fail(err)\" title=\"{{copy}}\" class=\"fa fa-copy text-danger\" style=\"padding: 5px\"> Copy</a><br><p style=\"padding-right:10px;word-wrap: break-word\" ng-show=\"docInfo.explanation\"><strong>Description</strong> : <span>{{docInfo.explanation}}</span></p><p style=\"color:red;padding: 10px 20px 0 0 ng-if=\"!docInfo.doctor_work_place\"><i class=\"fa fa-warning\"></i> This prescription may have been writen by non-professional.</p><a href=\"{{docInfo.doctor_profile_url}}\" title=\"view profile\" ng-if=\"docInfo.doctor_work_place\" class=\"text-info\">View doctor's profile</a><br></div><div class=\"p-1\" style=\"margin-top: -15px\"><div class=\"no-mobile-item-display\"><table class=\"table table-striped\"><tr><thead><th>S/N</th><th>Drug Name</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th class=\"text-muted\">Select</th></thead></tr><tr><tbody ng-repeat=\"prescription in docInfo.prescription_body\"><td>{{prescription.sn}}</td><td>{{prescription.drug_name}}</td><td>{{prescription.dosage}}</td><td>{{prescription.frequency}}</td><td>{{prescription.duration}}</td><td><label class=\"custom-control custom-checkbox\"> <input type=\"checkbox\" class=\"custom-control-input\" ng-model= \"prescription.picked\"> <span class=\"custom-control-indicator\"></span> <span class=\"custom-control-description\" style=\"opacity:0\">.</span> </label></td></tbody></tr></table></div><div class=\"mobile-item-display\"><table class=\"table pb-1\" ng-repeat=\"prescription in docInfo.prescription_body\"><thead><td> {{prescription.sn}})</td><td> {{prescription.drug_name}}</td><td> ( {{prescription.dosage}} )</td><td> {{prescription.frequency}}</td><td> {{prescription.duration}}</td><td> <label class=\"custom-control custom-checkbox\"> <input type=\"checkbox\" class=\"custom-control-input\" ng-model= \"prescription.picked\" > <span class=\"custom-control-indicator\"></span> <span class=\"custom-control-description\" style=\"opacity:0;\">.</span> </label></td></thead><hr></table></div></div></div><div class=\"p-1\"><div style=\"position: relative;\"> <a href="" style=\"font-size: 18px;margin-right:0px;\" ng-click=\"email(docInfo,'Prescription')\"><i class=\"fa fa-share-alt btn btn-simple btn-sm text-primary\" aria-hidden=\"true\" title=\"send prescription to an email\"></i></a><a href="" ng-click=\"courier(docInfo)\" style=\"font-size: 18px;margin-right:0px;\"><i class=\"fa fa-motorcycle btn btn-simple btn-sm text-primary\" aria-hidden=\"true\" title=\"Use our courier service\"></i></a><a href="" style=\"font-size:18px;margin-right:0px;\" ng-click=\"forwardPrescription(docInfo)\"><i class=\"fa fa-share btn btn-simple btn-sm text-primary\" aria-hidden=\"true\" title=\"Forward this prescription to a Phamarcy\"></i></a> <a href=\" \" class=\"btn btn-simple btn-sm\" style=\"float: right;color: green\" ng-click=\"trackedPrescription(docInfo.prescriptionId,docInfo)\" title=\"Look up pharmacies this prescription has been sent to\">Track record</a></div></div></div>')
}])
