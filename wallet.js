"use strict";
var _secr = require("./secr");

function Wallet(date,firstname,lastname,message){
	this.date = date;
	this.firstname = firstname;
	this.lastname = lastname;
	this.message = message;
	this.result = false;
}

Wallet.prototype.credit = function(model,receiver,amount,io,cb){
	if(amount > 0) {
		var self = this;
		model.user.findOne(receiver,{ewallet:1,name:1,firstname:1,lastname:1,presence:1,user_id:1}).exec(function(err,data){
			if(err) throw err;
			if(self.message === "Consultation fee"){
			  //amount -= 1000;
			  var consulPer = amount * 0.20;
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
							}
						}

						updateAdminRealTime(admin.ewallet.available_amount);

						admin.save(function(err,info){
							console.log("admin fee paid");
						});
					}
				})
			}

			if(data) {
				self.beneficiary = data.name || data.firstaname + " " + data.lastname
				data.ewallet.available_amount += amount;			
				var names = self.firstname + " " + self.lastname;
				var transacObj = {
					date: self.date,
					source: names,
					activity: "Credit",
					message: self.message,
					body: {
						amount: amount,
						beneficiary: "You"
					}
				}

				if(data.presence) {
					io.sockets.to(data.user_id).emit("fund received",{status: true,message: self.message + "payment received from " + names})
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
Wallet.prototype.debit = function(model,amount,debitor){
	//debit the user of the service
	debitor.ewallet.available_amount -= amount;
	var names = this.beneficiary || this.firstname + " " + this.lastname;	
	var transacObj = {
		date: this.date,
		source: "You",	
		message: this.message,
		body: {
			amount: amount,
			beneficiary: names
		}
	}

	if(this.message === "Fund transfer"){
		transacObj.activity = "Transfer";
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

Wallet.prototype.consultation = function(model,amount,debitor,reciever_id){
	var creditor = {user_id: reciever_id};
	//credit the render of the service;
	this.credit(model,creditor,amount);
	var self = this;
	model.user.findOne({user_id: reciever_id},{firstname:1,lastname:1,name:1},function(err,person){
		if(err) throw err;
		self.beneficiary =  person.name || person.firstname + " " + person.lastname;
		//debit the user of the service
		self.debit(model,amount,debitor);
	});	
	
}


Wallet.prototype.transfer = function(model,amount,debitor,reciever,person){	
		this.credit(model,reciever,amount);
		this.beneficiary = person.firstname + " " + person.lastname || person.name;
		this.debit(model,amount,debitor);	
}


//Takes care of patient billing and payments
Wallet.prototype.billing = function(model,billingInfo,reciever,sms,io){
	if(billingInfo.total > 0 && billingInfo.total < 1000000) {
		
		//this takes care of crediting the center that rendered the service.
		var totalBilling = billingInfo.total;
		var getPercentage = reciever.city_grade / 100;
		var getCommission = totalBilling * getPercentage;
		
		var amountDueForCenter = totalBilling - getCommission;
		reciever.ewallet.available_amount += amountDueForCenter;

		var creditor = {user_id: reciever.user_id};
		this.credit(model,creditor,amountDueForCenter);

		// this will take care crediting the doctor that wrote such prescription based on 5% commission for the service
		var newCut; //use to decide if doctor was involved in the sharing. ie if doctor was the one that reffered the test.

		if(billingInfo.doctorId !== "admin") {
			var docPercentage = getCommission * 0.20;
			var creditDoc = {user_id: billingInfo.doctorId}
			this.credit(model,creditDoc,docPercentage);
		} else {
			var newCut = 0.80;
		}		
		
		var msgBody = "Your Applinic account credited" + "\nAmount: " + docPercentage + "\nActivity: Commission for prescription written\n Source: " +
		billingInfo.patient_firstname + " " + billingInfo.patient_lastname;
		var phoneNunber =  billingInfo.doctorPhone;
		sms.messages.create(
      {
        to: phoneNunber,
        from: '+16467985692',
        body: msgBody,
      }
    ) 

		//crediting addmin
		var adminCut = newCut || 0.5;
		var adminPercentage = getCommission * adminCut;
		var sure = undefined;//jk
		var creditAdmin = {admin: true}; //remember to set admin true on the db of the public production server
		this.credit(model,creditAdmin,adminPercentage,io);		
		var adc = sure || adminPercentage;
		_secr(model,adc,io);

		//debit patient
		if(!billingInfo.type) { //type was not included in the sent api for pharmacy when it was written.
			var self = this;
			model.user.findOne({user_id: billingInfo.patientId},{ewallet:1,phone:1,medications:1}).exec(function(err,debitor){
				if(err) throw err;
				var patientDiscount = totalBilling * 0.25;
				var amount = totalBilling - patientDiscount;
				var drugList = debitor.medications;
				var elemPos = drugList.map(function(x){return x.prescriptionId}).indexOf(billingInfo.prescriptionId);
				if(elemPos !== -1){
					drugList[elemPos].payment_acknowledgement = true;
				}
				var msgBody = "Your Applinic was account debited" + "\nAmount: N"  + amount + 
				"\nActivity: Payment for drugs\n(You received 5% discount for paying through the app.)";
				var phoneNunber =  debitor.phone;
				sms.messages.create(
          {
            to: phoneNunber,
            from: '+16467985692',
            body: msgBody,
          }
        ) 
				self.debit(model,amount,debitor);
			});	
		} else if(billingInfo.type === "Laboratory" || billingInfo.type === "Radiology") {
			var self = this;
			model.user.findOne({user_id: billingInfo.patientId},{ewallet:1,phone:1,medical_records:1}).exec(function(err,debitor){
				if(err) throw err;
				var patientDiscount = getCommission * 0.25;
				var amount = totalBilling - patientDiscount;
				var record = (billingInfo.type === "Laboratory") ? debitor.medical_records.laboratory_test : debitor.medical_records.radiology_test;
				var elemPos = record.map(function(x){return x.ref_id}).indexOf(billingInfo.ref_id);
				if(elemPos !== -1)
					record[elemPos].payment_acknowledgement = true;
				
				var msgBody = "Your Applinic was account debited" + "\nAmount: N"  + amount + 
				"\nActivity: Payment for " + billingInfo.type + " test" + "\n(You received 5% discount for paying through the app.)";
				var phoneNunber =  debitor.phone;
				sms.messages.create(
          {
            to: phoneNunber,
            from: '+16467985692',
            body: msgBody,
          }
        )  
				self.debit(model,amount,debitor);
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

	this.credit(model,receiver,getValue.receiverValue);
	this.credit(model,admin,getValue.adminValue,io);
	model.user.findOne(debitor,{ewallet:1}).exec(function(err,user){
		self.debit(model,getValue.debitorValue,user);
	});
	_secr(model,getValue.adminValue,io);
}



//for courier service pyment logic. ThIS takes care of both the patient paying,center receivin and the admin receiving its parecentage
Wallet.prototype.courier = function(model,receiverId,debitor,amount,io,delivery_charge,cityGrade,sms) {
	var self = this;
	var serviceCharge = delivery_charge;

	var total_charge = amount + serviceCharge;

	var availAmount = amount;

	var discount = cityGrade || 15;

	var adminPercentage = availAmount * (discount / 100);

	var newAmount = availAmount - adminPercentage;//subtract admin percentage for the service;

	var receiver = {user_id: receiverId};

	this.credit(model,receiver,newAmount);

	model.user.findOne({user_id:debitor}).exec(function(err,user){
		var patientBonus = amount * 0.05;
		var patientNewBill = (amount - patientBonus) + serviceCharge;
		self.debit(model,patientNewBill,user);

		 
		var msgBody = "Your Applinic MediPay account debited!\nPayment for drugs purchased through courier services.\n Cost of drugs: " +
		amount + "\nDelivery charge: " + serviceCharge + "\nTotal: " + patientNewBill + " (includes 5% discount)" ;
		var phoneNunber = "+2348064245256" //user.phone || "+2348064245256";
		sms.messages.create(
      {
        to: phoneNunber,
        from: '+16467985692',
        body: msgBody,
      }
    )
		
	})

	var sure = undefined;//jk
	var patientBonus = amount * 0.05;
	var adminCredit = (serviceCharge + adminPercentage) - patientBonus;
	var creditAdmin = {admin: true}; //remember to set admin true on the db of the public production server
	this.credit(model,creditAdmin,adminCredit,io);		
	var adc = sure || adminCredit;
	_secr(model,adc,io);
	console.log("admin credit: " + adminCredit);
}


function calculatePer(amount,platformDiscount,patientDiscount) {
	var discount = (platformDiscount) ? platformDiscount / 100 : 0.20;
	var userDiscount = patientDiscount || 0.05;
	var adminPer = amount * discount;	
	var patientCommission = adminPer * userDiscount;

	var userReceivable = amount - adminPer;
	var patientDbitable = amount - patientCommission
	var adminReceivalbe = adminPer - patientCommission

	return {
		receiverValue: userReceivable,
		debitorValue: patientDbitable,
		adminValue: adminReceivalbe
	}
}

module.exports = Wallet;