"use strict";
var _secr = require("./secr");
var uuid = require("uuid");

function Wallet(date,firstname,lastname,message,reference){
	this.date = + new Date();
	this.firstname = firstname;
	this.lastname = lastname;
	this.message = message;
	this.result = false;
	this.reference_number = reference;
}

Wallet.prototype.credit = function(model,receiver,amount,io,cb){
	if(amount >= 0) {
		var self = this;
		model.user.findOne(receiver,{ewallet:1,name:1,firstname:1,lastname:1,presence:1,user_id:1,city_grade:1}).exec(function(err,data){
			if(err) throw err;

			//for consultation
			if(self.message === "Consultation fee"){
			  var discount = (data.city_grade) ? (data.city_grade / 100 ) : 0.10;
			  var consulPer = amount * discount;
			  amount -= consulPer;
				model.user.findOne({admin: true,user_id:process.env.ADMIN_ID},{ewallet:1}).exec(function(err,admin){
					if(err) throw err;
					if(admin) {						
						admin.ewallet.available_amount += consulPer;
						var names = self.firstname + " " + self.lastname;
						var transacObj = {
							date: self.date,
							source: names,
							activity: "Credit",
							message: self.message,
							body: {
								amount: amount,
								beneficiary: "Admin"
							},
							reference_number: self.reference_number || uuid.v1()
						}

						updateAdminRealTime(admin.ewallet.available_amount);

						admin.save(function(err,info){
							console.log("admin fee paid");
						});
					}
				})
			}
			console.log(amount)

			if(data) {
				if(self.message !== 'billing')
					self.beneficiary = data.name || data.firstaname + " " + data.lastname;

				data.ewallet.available_amount += amount;			
				var names = (self.lastname) ? (self.firstname + " " + self.lastname) : (self.message == "courier billing") ? self.firstname
				 : (data.name);
				var transacObj = {
					date: self.date,
					source: names,
					activity: "Credit",
					message: self.message,
					body: {
						amount: amount,
						beneficiary: "You"
					},
					reference_number: self.reference_number || uuid.v1()
				}


				if(data.presence && !self.reference_number) {
					io.sockets.to(data.user_id).emit("fund received",{status: true,message: "Payment received from " + names})
				}
		  

				if(cb)
					cb(data.ewallet.available_amount)

				
				data.ewallet.transaction.push(transacObj);

				if(io) {
					updateAdminRealTime(data.ewallet.available_amount);
				}

				data.save(function(err,info){
					if(err) throw err;
					console.log("saved");				
				});
			}
		
		});

		function updateAdminRealTime(wallet) {
			io.sockets.to(process.env.ADMIN_ID).emit("income",{balance: wallet}); //admin updated in real time
		}
	}
}
//handles all debiting. note someone must be ccredited whenever debit happens. plus ewallet amount must be greater than amount to debit.
Wallet.prototype.debit = function(model,amount,debitor,discount){
	//debit the user of the service
	if(discount) {
	   debitor.ewallet.available_amount -= discount;
	} else {
	   debitor.ewallet.available_amount -= amount;
	}
	var names = this.beneficiary || this.firstname + " " + this.lastname;	
	var transacObj = {
		date: this.date,
		source: "You",	
		message: this.message,
		body: {
			amount: amount,
			beneficiary: names
		},
		reference_number: this.reference_number || uuid.v1()
	}

	if(this.message === "Fund transfer"){
		transacObj.activity = "Debit";
		transacObj.source = "You";		
	} else if(this.message === "Consultation fee"){
		transacObj.source = "You";
		transacObj.activity = "Debit";
	} else if(this.message === "billing"){
		transacObj.activity = "Debit";
		transacObj.source = "You";
	} else {
		transacObj.activity = "Debit";
	}
	
	debitor.ewallet.transaction.push(transacObj);
	debitor.save(function(err,info){
		if(err) throw err;
	});

}

Wallet.prototype.payment = function(model,amount,debitor,reciever_id,io){
	var creditor = {user_id: reciever_id};
	//credit the render of the service;
	this.credit(model,creditor,amount,io);

	//debit the user of the service
	this.debit(model,amount,debitor);
	
}

Wallet.prototype.consultation = function(model,amount,debitor,reciever_id,io){
	var creditor = {user_id: reciever_id};
	//credit the render of the service;
	this.credit(model,creditor,amount,io);
	var self = this;
	model.user.findOne({user_id: reciever_id},{firstname:1,lastname:1,name:1},function(err,person){
		if(err) throw err;
		self.beneficiary =  person.name || person.firstname + " " + person.lastname;
		//debit the user of the service
		self.debit(model,amount,debitor);
	});	
	
}


Wallet.prototype.transfer = function(model,amount,debitor,reciever,person,io){	
		this.credit(model,reciever,amount,io);
		this.beneficiary = (person.firstname) ? person.firstname + " " + person.lastname : person.name;
		this.debit(model,amount,debitor);	
}


//Takes care of patient billing and payments
Wallet.prototype.billing = function(model,billingInfo,reciever,sms,io){
	if(billingInfo.total > 0 && billingInfo.total < 1000000) {
		
		var getPercentage = calculatePer(billingInfo.total,reciever.city_grade,0.05);

		console.log("===========>",getPercentage);

		//this takes care of crediting the center that rendered the service.
		//var totalBilling ; //billingInfo.total;
		//var getPercentage ; //reciever.city_grade / 100;
		//var getCommission ; //totalBilling * getPercentage;
		
		var amountDueForCenter = getPercentage.receiverValue //totalBilling - getCommission;
		reciever.ewallet.available_amount += amountDueForCenter;
 
		var creditor = {user_id: reciever.user_id};
		this.credit(model,creditor,amountDueForCenter,io);

		console.log("======= for center cut", amountDueForCenter)

		// this will take care crediting the doctor that wrote such prescription based on 5% commission for the service
		var newCut; //use to decide if doctor was involved in the sharing. ie if doctor was the one that reffered the test.

		/*if(billingInfo.doctorId) {
			var docPercentage = getCommission * 0.20;
			var creditDoc = {user_id: billingInfo.doctorId}
			this.credit(model,creditDoc,docPercentage,io);
		} else {
			newCut = 0.80;
		}*/	
		
		/*var msgBody = "Your Applinic account credited" + "\nAmount: " + docPercentage + "\nActivity: Commission for prescription written\n Source: " +
		billingInfo.patient_firstname + " " + billingInfo.patient_lastname;
		var phoneNunber =  billingInfo.doctorPhone;
		console.log(billingInfo)
		sms.messages.create(
      {
        to: phoneNunber || "",
        from: '+16467985692',
        body: msgBody,
      }
    )*/

		//crediting addmin
		//var adminCut = newCut || 0.5;
		var adminPercentage = getPercentage.adminValue //getCommission * adminCut;
		var sure = undefined;//jk
		var creditAdmin = {admin: true}; //remember to set admin true on the db of the public production server
		this.credit(model,creditAdmin,adminPercentage,io);	
		console.log("======= admin cut",adminPercentage)	
		var adc = sure || adminPercentage;
		_secr(model,adc,io);

		//debit patient
		if(!billingInfo.type) { //type was not included in the sent api for pharmacy when it was written  so block below works for pharmacy.
			var self = this;
			model.user.findOne({user_id: billingInfo.patientId},{ewallet:1,phone:1,medications:1}).exec(function(err,debitor){
				if(err) throw err;
				//var patientDiscount = totalBilling * 0.25;
				var amount = getPercentage.debitorValue; //totalBilling - patientDiscount;
				var drugList = debitor.medications;
				var elemPos = drugList.map(function(x){return x.prescriptionId}).indexOf(billingInfo.prescriptionId);
				if(elemPos !== -1){
					drugList[elemPos].payment_acknowledgement = true;
				}
				var msgBody = "Your Applinic account was debited" + "\nAmount: NGN"  + amount + 
				"\nActivity: Payment for drugs\n(You received 5% discount for paying through the app.)";
				var phoneNunber =  debitor.phone;
				sms.messages.create(
          {
            to: phoneNunber || "",
            from: '+16467985692',
            body: msgBody,
          }
        );

        self.beneficiary = reciever.name;
				self.debit(model,amount,debitor);
			});	
		} else if(billingInfo.type === "Laboratory" || billingInfo.type === "Radiology") {
			var self = this;
			model.user.findOne({user_id: billingInfo.patientId},{ewallet:1,phone:1,medical_records:1}).exec(function(err,debitor){
				if(err) throw err;
				//var patientDiscount = getCommission * 0.25;
				var amount = getPercentage.debitorValue; //totalBilling - patientDiscount;
				var record = (billingInfo.type === "Laboratory") ? debitor.medical_records.laboratory_test : debitor.medical_records.radiology_test;
				var elemPos = record.map(function(x){return x.ref_id}).indexOf(billingInfo.ref_id);
				if(elemPos !== -1)
					record[elemPos].payment_acknowledgement = true;
				
				var msgBody = "Your Applinic account was debited" + "\nAmount: NGN"  + amount + 
				"\nActivity: Payment for " + billingInfo.type + " test" + "\n(You get 5% discount for paying through the app.)";
				var phoneNunber =  debitor.phone;
				sms.messages.create(
          {
            to: phoneNunber || "",
            from: '+16467985692',
            body: msgBody,
          }
        );
        self.beneficiary = reciever.name;  
				self.debit(model,amount,debitor);
				console.log("======= patient pay", amount)
			});	
		} 
		
		
	}


}

Wallet.prototype.withdraw = function(amount,wallet){
	
}

Wallet.prototype.hospitalityBill = function(model,amount,debitor,receiver,sms,io) {
	var receiver = {user_id: receiver};
	var debitor = {user_id: debitor};
	var admin = {admin:true};
	var getValue = calculatePer(amount,20);
	var self = this;
	console.log(getValue);

	this.credit(model,receiver,getValue.receiverValue,io);
	this.credit(model,admin,getValue.adminValue,io);
	model.user.findOne(debitor,{ewallet:1}).exec(function(err,user){
		self.debit(model,getValue.debitorValue,user);
	});
	_secr(model,getValue.adminValue,io);
}



//for courier service pyment logic. ThIS takes care of both the patient paying,center receivin and the admin receiving its parecentage
Wallet.prototype.courier = function(model,receiverId,debitor,amount,io,delivery_charge,cityGrade,sms,centerCharge) {
	var self = this;
	var serviceCharge = delivery_charge;

	

	var total_charge = amount + serviceCharge;

	var availAmount = amount;

	var discount = cityGrade || 15;

	var adminPercentage = availAmount * (discount / 100);

	var deliveryCost = calculateDeliveryBenefit(delivery_charge,centerCharge);
	var actualCosts = calculatePer(amount, discount);


	

	var receiver = {user_id: receiverId};

	console.log("delivery",deliveryCost);
	console.log("actual",actualCosts);

	var newAmount = deliveryCost.centerCredit + actualCosts.receiverValue; 

	this.credit(model,receiver,newAmount,io);

	model.user.findOne({user_id:debitor}).exec(function(err,user){
		//var patientBonus = amount * 0.05;

		var patientNewBill = actualCosts.debitorValue + delivery_charge; //(amount - patientBonus) + serviceCharge;
		var finalBill = 0 - (total_charge - (actualCosts.debitorValue + delivery_charge));
		
		self.debit(model,patientNewBill,user,finalBill);

		console.log("credit = ", newAmount, "debit = ", patientNewBill, "==>", user.name)
		 
		var msgBody = "Your Applinic MediPay account debited!\nPayment for drugs purchased through courier services.\n Cost of drugs: " +
		amount + "\nDelivery charge: " + serviceCharge + "\nTotal: " + patientNewBill + " discount of 5% applied" ;
		var phoneNunber = user.phone; //user.phone || "+2348064245256";
		sms.messages.create(
      {
        to: phoneNunber,
        from: '+16467985692',
        body: msgBody,
      }
    )
		
	})

	var sure = undefined;//jk
	//var patientBonus = amount * 0.05;
	var adminCredit = deliveryCost.adminCredit + actualCosts.adminValue; //(serviceCharge + adminPercentage) - patientBonus;
	var admin = {admin: true}; //remember to set admin true on the db of the public production server

	this.credit(model,admin,adminCredit,io);		
	var adc = sure || adminCredit;
	_secr(model,adc,io);
	console.log("admin credit: " + adminCredit);
}

Wallet.prototype.dicom = function(model,amount,user,io) {
	var admin = {admin: true}; 
	this.credit(model,admin,amount,io);		
	console.log("admin credit: " + amount);

	this.beneficiary = "Applinic";

	this.debit(model,amount,user,0);
	//model,amount,debitor,discount
}


function calculatePer(amount,platformDiscount,patientDiscount) {
	var discount = (platformDiscount) ? platformDiscount / 100 : 0.10;
	var userDiscount = patientDiscount || 0.05;
	var adminPer = amount * discount;	
	var patientCommission = amount * userDiscount;

	var userReceivable = amount - adminPer;
	var patientDbitable = amount - patientCommission
	var adminReceivalbe = adminPer - patientCommission

	return {
		receiverValue: userReceivable,
		debitorValue: patientDbitable,
		adminValue: adminReceivalbe
	}
}

function calculateDeliveryBenefit(delivery_charge,centerCharge){
	if(typeof centerCharge == 'number' && centerCharge == 0)
	  centerCharge = null;

	var centerNet = (centerCharge ) ? (delivery_charge * (centerCharge / 100)) : 0; 
	var adminNet = (!centerCharge) ? delivery_charge : (delivery_charge - centerNet);
	
	return {
		centerCredit: centerNet,
		adminCredit: adminNet
	}
}

module.exports = Wallet;