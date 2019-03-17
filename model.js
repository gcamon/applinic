'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dbURL = "mongodb://127.0.0.1:27017/medicalmull"; //"mongodb://127.0.0.1:27017/medicalmull"; 45.55.204.222
var options = {
	autoReconnect: true,
	useMongoClient: true,
	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0,
	//useNewUrlParser: true 
}

mongoose.connect(dbURL,options)
.then(
  () => { console.log("db connected!") },
  err => { console.log(err)}
)

var Schema = mongoose.Schema;
var myModel = function () {
	var fileSchema = Schema({
		type: String,
		filename: String,
		path: String,
		file_id: String,
		external_link: String
	},{
		collections: "fileinfo"
	});

	var skillSchema = Schema({
		user_id: String,
		name: String,
		profile_pic_url: String,
		profile_url: String,
		specialty: String,
		work_place: String,
		city: String,
		country: String,
		date: Number,
		comments: Array,
		skill_id: String,
		disease: String,
		skill: String,
		procedure_description: String,
		files: [fileSchema],
		ref_url: String,
		path: String,
		like: Number,
		dislike: Number,
		views: Number,
		deleted: Boolean

	},{
		collections: "skillinfos"
	});


	var service_objSchema = Schema({
		date_created : Number,
		center_id: String,
		name: String,
		val: Boolean,
		id: Number,
		price: Number
	});

	var serviceSchema = Schema({
		center_name: String,
		center_address: String,
		center_city: String,
		center_country: String,
		center_phone: Number, 
		profile_url: String,
		center_email: String,
		user_id: String,
		unavailable_services: [service_objSchema],
		type: String
	},{
		collections: "centerservices"
	});

	var mailSchema = Schema({
		firstname: String,
		message_id: String,
		title: String,
		lastname: String,
		specialty: String,
		user_id: String,
		date: String,
		consultation_fee: Number,
    service_access: String,
    profile_pic_url: String,
    profile_url: String,
		message: String,
		category: String,//note categories are admin, decline, redirect,need_doctor.
		reason: String,
		complaint_id: String,
		original_complaint: String,
    original_complaint_date : String,
    response: String,
		redirect: {
			title: String,
			firstname: String,
			lastname: String,
			specialty: String,
			user_id: String
		}
	});

	var AwardSchema = Schema({
		id: Number,
		type_of_Award: String,
		date: String,
		description: String
	});

	var EducationSchema = Schema({
		id: Number,
		school: String,
		start_year: Date,
		end_year: Date,
		certificate: String
	});

	//prescriptionbodyschema goes inside prescription schema

	var prescriptionBodySchema = Schema({
		sn: Number,
		dosage: String,
		frequency: String,
		drug_name: String,
		duration: String,
		cost: Number
	});

	var statusSchema = Schema({
		date: Date,
		center_name: String,
		address: String,
		city:String,
		country: String,
		ref_id: Number,
		phone: String,
		prescriptionId: Number
	});

	var prescriptionSchema = Schema({
		prescriptionId: Number,
		provisional_diagnosis: String,
		date: String,
		doctor_experience: Number,	
		doctor_firstname: String,
		doctor_lastname: String,
		title: String,
		doctor_address: String,		
		doctor_id: String,
		doctor_verified: Boolean,
		doctor_work_place: String,
		doctor_city: String,
		doctor_country: String,
		doctor_phone: String,
		doctor_specialty: String,
		lab_analysis: String,
		scan_analysis: String,
		doctor_profile_pic_url: String,
		doctor_profile_url: String,
		patient_profile_pic_url: String,
		patient_firstname: String,
		patient_id: String,
		patient_lastname: String,
		patient_phone: String,
		patient_address: String,
		patient_gender: String,
		patient_age: String,
		patient_city: String,
		patient_country: String,
		prescription_body: [prescriptionBodySchema],
		ref_id: Number,
		eligible: Boolean,
		is_paid: Boolean,
		detail: {
			amount: String,
			date: String
		},
		payment_acknowledgement: Boolean // use to check if patient have actually paid for a prescription through our app.
		//if false, prescription will be deleted after one month it was created.
	});

	var transactionSchema = Schema({
		date: String,
		source: String,
		message: String,
		activity: String,		
		body: {
			amount: Number,
			beneficiary: String,
		},
		reference_number: String
		
	});

	var noteSchema = Schema({
		sender_id: String,
		message_id: Number,
		type: String,
		date: String,
		message: String,
		sender_firstname: String,
		sender_lastname: String,
		sender_age: String,
		sender_gender: String,
		sender_location: String,
		sender_profile_pic_url: String,
		files: Array
	});

	var periodSchema = Schema({
		day: String,
		from: String,
		to: String
	});

	var subspecialtySchema = Schema({
		id: Number,
		sub_specialty: String
	});

	var patient_noteSchema = Schema({
		date: String,
		note_id: Number,
		ref_id: Number,
		session_id: String,
		type: String,
		message: String
	});

	var doc_briefSchema = Schema({
		doctor_id: String,
		date_of_acceptance: String,
		doctor_firstname: String,
		doctor_lastname: String,
		doctor_profile_pic_url: String,
		service_access: Boolean,
		doctor_specialty: String,
		work_place: String,
		office_hour:[periodSchema],
		presence: Boolean,
		deleted: Boolean	
	});

	var patient_briefSchema = Schema({
		patient_firstname: String,
		date: Number,
		patient_lastname: String,
		patient_id: String,
		patient_profile_pic_url: String,
		patient_address: String,
		patient_city: String,
		Patient_country: String,
		patient_gender: String,
		patient_age: String,
		patient_body_weight: String,
		presence: Boolean,
		initial_complaint: {
    	complaint: String,
    	complaint_date: String,
    	date_received: Number,
    	files: Array
    	},
    	deleted: Boolean
	});
	//this holds records for lab,prescription and scan for the patient
	var diagnosisSchema = Schema({
		doctor_note: String,
		doctor_firstname: String,
		doctor_lastname: String,
		date: Date,
		illness: String
	});

	var patient_TestSchema = Schema({ 
		test_to_run: Array,
		center_name: String,
		center_phone: String,
		center_address: String,
		center_city: String,
		center_country: String,
		center_id: String,
		patient_id: String,
		ref_id: Number,
		referral_firstname: String,
		referral_id: String,
		referral_lastname: String,
		referral_title: String,
		sent_date: String,
		receive_date: String,
		report: Array,//String,
		conclusion: String,
		session_id: String,
		files: Array,
		history: String,
		indication: String,
		acc: String,
		payment_acknowledgement: Boolean //use to check if patient have actually paid for a service.
	});
	
	//this holds the sent test to ba ran by the laboratory center
	var center_refSchema = Schema({
		test_to_run: Array,
		patient_firstname: String,
		age: String,
		gender: String,
		history: String,
		patient_lastname: String,
		patient_profile_pic_url: String,
		patient_title: String,
		patient_gender: String,
		patient_age: String,
		patient_phone: String,
		session_id: String,
		patient_id: String,
		test_id: Number,
		patient_address: String,
    indication: String,
    clinical_summary: String,
    lmp: String,
    parity: String,
		attended: Boolean,
		title: String,
		doctor_firstname: String,
		doctor_lastname: String,
		doctor_id: String,
		doctor_phone: Number,
		is_paid: Boolean,
		detail: {
			amount: String,
			date: String
		}
	});

	var drug_refSchema = Schema({
		dosage: String,
	    drugName: String,
	    frequency: String,
	    duration: String,
	    drugId: Number
	});

	var refSchema = Schema({
		ref_id: Number,
		referral_firstname: String,
		referral_lastname: String,
		referral_title: String,
		referral_id: String,		
		date: String,
		type_of_test: String,		
		laboratory: center_refSchema,
		radiology: center_refSchema,
		pharmacy: prescriptionSchema
	});

	var appointment_schema = Schema({
		date: String,
		time: String,
		last_meeting: String,
		firstname: String,
		lastname: String,
		title: String,
		patient_id: String,
		address: String,
		session_id: String,
		typeOfSession: String,
		profilePic: String
	});

	var ref_notificationSchema = Schema({
		sender_firstname: String,
		sender_lastname: String,
		sender_title : String,
		sent_date: String,
		ref_id: Number,
		note_id: Number,
		sender_profile_pic_url: String,
		message: String,
		viewed: Boolean 
	});
//for session
	var conversationSchema = Schema({
		date: Date,
		messages: String
	});

	var testResultSchema = Schema({ //note received date will be set as pending if the test has not returned. other be updated to date when returned
		receive_date: String,
		test_to_run: Array,
		report: Array,//String,
		conclusion: String,
		sent_date: String,
		test_ran_by: String,
		test_id: Number,
		files: Array,
		center_address: String,
		center_city: String,
		center_country: String,
		center_phone: String,
		center_profile_pic_url: String,
		sub_session_id: String,
		indication: String,
		clinical_summary: String,
		center_email: String,
		acc: String

	});

	var subSession = Schema({
		date: String,
		note: String,
		general: String,
		systemic: String,
		diagnosis: String,
		sub_session_id: String
	});

	var docDignosisSchema = Schema({
		presenting_complain: String,
		history_of_presenting_complain: String,
		past_medical_history: String,
		social_history: String,
		family_history: String,
		drug_history: String,
		summary: String,
		medical_report: String,
		notes: String,
		provisional_diagnosis: String,
		general_examination: String,
		systemic_examination: String,
		diagnosis: String,
		laboratory_test_results: [testResultSchema],
		radiology_test_results: [testResultSchema],
		ecg_test_result: [testResultSchema],
		others: [testResultSchema],
		final_diagnosis: String,
		files: Array,
		treatment_plan: String,
		sub_session: [subSession]

	});

	var sessionSchema = Schema({
		date: String,
		last_modified: String,
		session_id: String,
		patient_id: String,
		profilePic: String,
		patient_firstname: String,
		patient_lastname: String,
		patient_username: String,
		prescription_id: Number,
		typeOfSession: String,
		conversations: conversationSchema,
		diagnosis: docDignosisSchema
	});

	var requestSchema = Schema({
		status: String,
		sender_firstname: String,
		sender_lastname: String,
		sender_profile_pic_url: String,
		sender_id: String,
		conclusion: String,
		type_of_test: String,
	    center_name: String,
	    center_address: String,
	    cente_city: String,
	    center_country: String,
	    center_phone: String,
	    test_result: Array,
	    files: Array,
	    date_sent: String,
	    ref_id: Number
	});

	
	var accessSchema = Schema({
		patient_id: String,
		access_to_record: Boolean,
		key: String,
		userId: String,
		name: String,
		profile_pic_url: String
	});

	var medReportSchema = Schema({ //hold doctors medical report for patients
		doctor_id: String,
		doctor_name: String,
		doctor_specialty: String,
		doctor_work_place: String,
		doctor_address: String,
		doctor_city: String,
		doctor_country: String,
		patient_id: String,
		doctor_profile_pic_url: String,
		report: String,
		date: String,
		diagnosis: String,
		report_id: String,
		session_id: String,
		doctor_profile_url: String,
		sub_session_id: String
	})


	var updateSchema = Schema({
		type: String,
		status: Boolean,
		last_updated: Number,
	});


//end for session
	var userSchema = Schema({	  
		firstname: String,
		username: String,
		lastname: String,
		user_id: String,
		password: String,
		age: String,
		email: String,
		gender: String,
		address: String,
		currencyCode: String,
		state: String,
		region: String,
		city: String,
		title: String,
		marital_status: String,
		medications: [prescriptionSchema],
		date: Date,
		profile_url: String,
		verified: Boolean,
		ewallet:{			
			available_amount: Number,
			transaction:[transactionSchema]
		},
		admin: Boolean,
		type: String,
		profile_pic: {
			fieldname: String,
			originalname: String,
			encoding: String,
			mimetype: String,
			destination: String,
			filename: String,
			path: String,
			size: Number
		},
		files:[fileSchema],
		rating: {
			votes: Number,
			current: Number,
			max: Number
		},
		profile_pic_url: String,
		sub_specialty: [subspecialtySchema],
		skills: [skillSchema],
		introductory: String,
		awards: [AwardSchema],
		education: [EducationSchema],
		specialty: String,
		work_place: String,
		phone: String,
		experience: Number,
		country: String,
		doctor_notification:[noteSchema],
		referral: [refSchema],
		patient_notification: [patient_noteSchema],
		office_hour:[periodSchema],
		record_access:[accessSchema],
		accepted_doctors: [doc_briefSchema],
		doctor_patients_list : [patient_briefSchema],
		medical_records: {					
			diagnosis: [diagnosisSchema],		
			prescription: [prescriptionSchema],
			laboratory_test: [patient_TestSchema],
			radiology_test: [patient_TestSchema]
		},
		name: String,
		diagnostic_center_notification:[ref_notificationSchema],
		accepted_patients: [patient_briefSchema],
		appointment:[appointment_schema],
		prescription_tracking: [statusSchema],
		doctor_patient_session: [sessionSchema],
		doctor_prescriptionRequest: [requestSchema],
		emergency_ref_url: String,
		patient_mail: [mailSchema],
		presence: Boolean,
		set_presence:{
			general: Boolean,
			particular: Array // sets the presence of the user and controls who sends messages to the user.
		},
		city_grade: Number,
		watch_list: Array,
		barred: Boolean,
		courier_access:Boolean,
		courier_access_password: String,//ue to authenticate field aagents for courier deleivery
		family_flag: Boolean,
		family_accounts: Array,
		deleted: Boolean,
		service_details: Array, //services rendered by a center successfully
		mrak: String, //medical record access key
		medical_reports: [medReportSchema],
		courier_charge: Number,
		courier_commission: Number,
		disease_tag: String,
		bank_details: Array,
		field_agents: Array,
		updated: Date,
		stock_update: updateSchema
	},{
		collections: "userinfos"
	})

	var needHelpchema = Schema({
		user_id: String,
		message: String,
		name: String,
		phone: String
	})
	
	//for patient waiting room
	var helpSchema = Schema({
		helpType: String,
		description: String,
		sent_date: String,
		symptoms: Array,
		introductory: String,
		patient_id: String,
		complaint_id: String,
		age: String,
		patient_city:String,
		patient_country: String,
		gender: String,
		preferred_city: String,
		isview: Boolean,
		response: Array,
		files: Array,
		deleted: Boolean,
		phone: String,
		email: String,
		name: String,
	},{
		collections: "helpinfos"
	});

	var otpSchema = Schema({
		expirationDate: {
			type: Date,
			expires: 3600
		},		
		createdAt: {
			type: Date,
			expires: Number
		},		
		user_id: String,
		time: Number,
		amount: Number,
		otp: String,
		senderId: String
	},{
		collections:"otpinfos"
	});

	var phoneVerificationSchema = Schema({
		expirationDate: {
			type: Date,
			expires: 3600
		},		
		createdAt: {
			type: Date,
			expires: Number
		},		
		phone: String,
		pin: String
	},{
		collections: "phoneVerify"
	});

	var authChangeSchema = Schema({
		expirationDate: {
			type: Date,
			expires: 3600
		},		
		createdAt: {
			type: Date,
			expires: Number
		},		
		user_id: String,
		pin: String
	},{
		collections: "authVerify"
	});

	var pinSchema = Schema({
		voucher: Array,
		voucher_two: Array,
		voucher_three: Array,
		otp: Array
	},{
		collections: "pininfo"
	});

	var inConversationSchema = Schema({
		ongoing_conversation: Array
	},{
		collections:"callinfo"
	});

	var chatSchema = Schema({
		userId: String,
		name: String,
		partnerType: String,
		profilePic: String,
		status: Boolean,
		chat_id: String,
		partnerId: String,
		type: String,
		realTime: String,
		messages: Array,
		date_created: String,
		is_read: Boolean
	},{
		collections: "chatinfos"
	});

	var cashOutSchema = Schema({
		date: Number,
		account_number: String,
		firstname: String,
		lastname: String,
		user_id: String,
		amount: Number,
		phone: Number,
		bank: String,
		id: Number,
		name: String,
		account_type: String,
		verified: Boolean,
		title: String,
		email: String,
		attended: Boolean,
		confirmation_date: Date
	},{
		collections: "cashoutinfos"
	});

	var dynaTestSchema = Schema({
		type: String,
		test_list: [service_objSchema]
	},{
		collections: "dynamictestinfos"
	});

	var courierSchema = Schema({
		request_id : String,
		verified: Boolean,
		total_cost: String,
		firstname: String,
		address: String,
		email: String,
		prescription_body: Array,
		city: String,
		phone1: String,
		phone2: String,
		lastname: String,
		title: String,
		attended: Boolean,
		profile_pic_url: String,
		user_id: String,
		center_id: String,
		center_name: String,
		center_address: String,
		center_phone: String,
		center_email: String,
		date: Number, //use date to find refers to date the request was made or initiated
		otp: String,
		receipt_date: Number,
		verification_date: Number,
		completed: Boolean,
		delivery_charge: Number,
		deleted: Boolean,
		currencyCode: String,
		city_grade: Number,
		prescriptionId: Number,
		is_paid: Boolean,
		new: Number,
		dispute: Boolean,
		complaints: Array,
		on_delivery: Boolean,
		delivery_msg: String,
		delivery_start_date: Date,
		center_charge: String,
		agentId: String
	},{
		collections: "courierinfos"
	});

	var geonameSchema = Schema({
	 continent: String,
     capital: String,
     languages: String,
     geonameId: Number,
     south: Number,
     isoAlpha3: String,
     north: Number,
     fipsCode: String,
     population: String,
     east: Number,
     isoNumeric: String,
     areaInSqKm: String,
     countryCode: String,
     west: Number,
     countryName: String,
     continentName: String,
     currencyCode: String,
     cities: Array
	},{
		collections: "geonamesinfo"
	});

	var messageSchema = Schema({
		date: String,
		names: String,
		ticket: String,
		email: String,
		phone: String,
		message: String,
		answers: Array,
	},{
		collections: "messageinfos"
	});


	var controlSchema = Schema({
		expirationDate: {
			type: Date,
			expires: Number
		},		
		createdAt: {
			type: Date,
			expires: Number
		},
		controlId: String,		
		controlUrl: String,
		streams: Array
	},{
		collections: "controlinfos"
	});


	var treatmentBillSchema = Schema({
		date: Number,
		sender_names: String,
		sender_address: String,
		sender_id: String,
		sender_city: String,
		sender_country: String,
		sender_profile_pic_url: String,
		sender_specialty: String,
		patient_names: String,
		patient_id: String,
		total: Number,
		payment_acknowledgement: {
			status: Boolean,
			date: Number
		},
		bill_list: Array,
		bill_id: String
	},{
		collections: "billinginfos"
	});

	var docAppointmentSchema = Schema({
		date: Date,
		time: Date,
		last_meeting: String,
		firstname: String,
		lastname: String,
		title: String,
		patient_id: String,
		address: String,
		session_id: String,
		typeOfSession: String,
		profilePic: String,
		doctorId: String,
		attended: Boolean
	},{
		collections: "appointmentinfos"
	});

	var mediScroll = Schema({
		amount: Number,
		debitor: String,
		amount_str: String,
		creditor: String,
		start_date: Date,
		end_date: Date,
		courier_id: String, // refers to _id of the subject obj
		order_id : String, // refers to generated id of the subject obj also called request ID
		type: String,
		deleted: Boolean,
		delivery_charge: Number
	},{
		collections: "scrollinfos"
	});

	var fieldAgentSchema = Schema({
		password: String,
		isLoggedIn: Boolean,
		userId: String,
		date: Date,
		center_id: String,
		center_name: String,
		center_city: String,
		couriers: Array,
		firstname: String,
		lastname: String,
		email: String,
		phone: String,
		url: String
	},{
		collections: "fieldagentinfos"
	});

	var consultSchema = Schema({
		patient_name: String,
		doctor_name: String,
		date: Date,
		doctor_phone: String,
		doctor_email: String,
		doctor_id: String,
		patient_phone: String,
		patient_email: String,
		patient_id: String,
		doctor_specialty: String,
		patient_city: String,
		doctor_city: String,
		patient_country: String,
		doctor_country: String,
		files: Array,
		message: String,
		id: Number,
		redirect_info: {
			date: Date,
			id: String,
			doctor: String,
			specialty: String,
			doctorId: String,
			city: String
		}
	});

	var inviteSchema = Schema({
	   referral_id: String,
	   id: String,
	   date: Number,
	   type: String
	})

	
	/*var callingSchema = Schema({
		calling_code: {
			countryCode: String
		}
	},{
		collections: "callingcodeinfos"
	})*/



	/*var callRequestSchema = Schema({
		message_id: String,
		type: String,
		request: Array,
		date: String
	},{
		collections: "requestinfos"
	});*/

	//models
	var models = {};
	models.user = mongoose.model('userinfos', userSchema);
	models.files = mongoose.model('fileinfo', fileSchema);
	models.patient = mongoose.model("patientinfo",patient_briefSchema);
	models.services = mongoose.model("centerservices",serviceSchema);
	models.help = mongoose.model("helpinfos",helpSchema);
	models.pins = mongoose.model("pininfo",pinSchema);
	models.communication = mongoose.model("callinfo",inConversationSchema);
	models.chats = mongoose.model("chatinfos",chatSchema);
	models.otpSchema = mongoose.model("otpinfos",otpSchema);
	models.verifyPhone = mongoose.model("phoneVerify",phoneVerificationSchema);
	models.authCheck = mongoose.model("authVerify",authChangeSchema);
	models.cashout = mongoose.model("cashoutinfos",cashOutSchema);
	models.dynaService = mongoose.model("dynamictestinfos",dynaTestSchema);
	models.courier = mongoose.model("courierinfos",courierSchema);
	models.geonames = mongoose.model("geonamesinfo",geonameSchema);
	models.messages = mongoose.model("messageinfo",messageSchema);
	models.control = mongoose.model("controlinfos",controlSchema);//to be moved to another server
	models.needHelp = mongoose.model('needhelpinfos',needHelpchema);
	models.outPatientBilling = mongoose.model("billinginfos",treatmentBillSchema);
	models.appointment = mongoose.model("appointmentinfos",docAppointmentSchema);
	models.skills = mongoose.model("skillinfos",skillSchema);
	models.scroll = mongoose.model("scrollinfos",mediScroll);
	models.agent = mongoose.model("fieldagentinfos",fieldAgentSchema);
	models.consult = mongoose.model("consultinfos",consultSchema);
	models.invite = mongoose.model("inviteinfo",inviteSchema);
	//models.calling_code = mongoose.model("callingcodeinfos",callingSchema)
	
	return models		
}

module.exports = myModel;













