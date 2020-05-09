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
		date: Date,
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
		},
		consultationFeeId: String
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
		ref_id: String,
		phone: String,
		prescriptionId: Number
	});

	var prescriptionSchema = Schema({
		prescriptionId: String,
		provisional_diagnosis: String,
		date: Date,
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
		ref_id: String,
		eligible: Boolean,
		is_paid: Boolean,
		detail: {
			amount: String,
			date: String
		},
		explanation: String,
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
		files: Array,
		isLaterRef: String
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
		ref_id: String,
		session_id: String,
		type: String,
		message: String
	});

	var doc_briefSchema = Schema({
		doctor_id: String,
		doctor_title: String,
		date_of_acceptance: Date,
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
		date: Date,
		patient_lastname: String,
		patient_id: String,
		patient_profile_pic_url: String,
		patient_address: String,
		patient_city: String,
		patient_country: String,
		patient_gender: String,
		patient_age: String,
		patient_phone: String,
		patient_body_weight: String,
		presence: Boolean,
		initial_complaint: {
    	complaint: String,
    	complaint_date: String,
    	date_received: Date,
    	files: Array
    },
    deleted: Boolean,
    activity: {
    	isNew: Boolean,
    	labCount: Number,
    	radioCount: Number
    },
    isBlocked: Boolean,
    fee_history: Array
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
		ref_id: String,
		referral_firstname: String,
		referral_id: String,
		referral_lastname: String,
		referral_title: String,
		sent_date: String,
		receive_date: String,
		report: Array,
		conclusion: String,
		findings: String,
		advise: String,
		session_id: String,
		files: Array,
		history: String,
		indication: String,
		acc: String,
		acc_no: String,
		study_link: String,
		payment_acknowledgement: Boolean, //use to check if patient have actually paid for a service.
		created: Date,
		study_id: String,
		pdf_report: Array,
		lab_pdf_report: Array,
		patient_id_of_study: String
	});
	
	//this holds the sent test to ba ran by the laboratory center
	var center_refSchema = Schema({
		test_to_run: Array,
		patient_firstname: String,
		age: String,
		gender: String,
		patient_email: String,
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
		doctor_email: String,
		doctor_phone: Number,
		acc_no: String,
		study_link: String,
		is_paid: Boolean,
		detail: {
			amount: String,
			date: String
		},
		lab_pdf_report: Array
	});

	var drug_refSchema = Schema({
		dosage: String,
	    drugName: String,
	    frequency: String,
	    duration: String,
	    drugId: Number
	});

	var refSchema = Schema({
		ref_id: String,
		referral_firstname: String,
		referral_lastname: String,
		referral_title: String,
		referral_id: String,
		referral_email: String,
		referral_phone: String,
		acc_no: String,
		date: Date,
		type_of_test: String,		
		laboratory: center_refSchema,
		radiology: center_refSchema,
		pharmacy: prescriptionSchema,
		center_id: String,
		deleted: Boolean,
		redirect_to: Array 
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
		ref_id: String,
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
		acc: String,
		acc_no: String,
		study_link: String,
		study_ref_id: String,
		patient_id_of_study: String,
		lab_pdf_report: Array
	});

	var subSession = Schema({
		date: String,
		note: String,
		general: String,
		systemic: String,
		diagnosis: String,
		sub_session_id: String,
		study_ref_id: String
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
		sub_session: [subSession],
    study_id: String
	});

	var sessionSchema = Schema({
		date: Date,
		last_modified: Date,
		session_id: String,
		patient_id: String,
		profilePic: String,
		patient_firstname: String,
		patient_lastname: String,
		patient_username: String,
		prescription_id: Number,
		typeOfSession: String,
		conversations: conversationSchema,
		diagnosis: docDignosisSchema,
		doctor_id: String
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
	    ref_id: String
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

	var patientHistorySchema = Schema({
		last_modified: Number,
		height: String,
		weight: String,
		medication: String,
		allergies: String,
		lifestyle: Array,
		last_visited: Date,
		blood_pressure: String,
		blood_sugar: String,
		visitation_purpose: String,
		health_problems: Array,
		bp_date: Number,
		bs_date: Number,
		bp_chart: Array,
		bs_chart: Array
	})


//end for session
	var userSchema = Schema({	  
		account_type: String,
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
		stock_update: updateSchema,
		patient_history: patientHistorySchema,
		reporters: Array,
		dicom_enterprise: Boolean,
		report_signees: Array
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
		realTime: Number,
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
		date: Date, //use date to find refers to date the request was made or initiated
		otp: String,
		receipt_date: Date,
		verification_date: Date,
		completed: Boolean,
		delivery_charge: Number,
		deleted: Boolean,
		currencyCode: String,
		city_grade: Number,
		prescriptionId: String,
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
		attended: Boolean,
		created: Date,
		patient_title: String,
		patient_firstname: String,
		patient_lastname: String 
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
	});

	var studySchema = Schema({
		patient_name: String,
		patient_id: String,
		study_id: String,
		study_uid: String,
		center_id: String,
		center_name: String,
		center_address: String,
		center_city: String,
		center_country: String,
		center_phone: String,
		center_email: String,
		age: String,
		gender: String,
		created: Date,
		email: String,
	  ip_address: String,
	  port: Number,
	  aetitle: String,
	  accession_number: String,
	  study_link: String,
	  study_link2: String,
	  study_link_mobile: String,
	  deleted: Boolean,
	  ref_id: String,
	  study_type: String,
	  pdf_report: Array,
	  ref_id: String,
	  type: String,
	  patient_sex: String,
	  patient_age: String,
	  study_name: String,
	  patient_phone: String,
	  study_date: Date,
	  referring_physician: String,
	  conclusion: String,
	  findings: String,
	  summary: String,
	  advise: String,
	  referring_physician_email: String,
		referring_physician_phone: String,
		attended: Boolean,
		assigned_radiologist_id: Array,
		remark: String,
		isUserConnectLinking: Boolean, //this is used to know if linking is from exist patient in the platform
		referral_detail_dump: Array //dump the patient existing patient referral object
	});

	var dicomSchema = Schema({
		ip_address: String,
		port: Number,
		dns: String,
		aetitle: String,
		cost: Number,
		status: String,
		center_id: String,
		center_name: String,
		username: String,
		password: String
	});

	var accessionSchema = Schema({
		id: Number,
		centerId: String,
		date: Date
	});

	var reportTemplateSchema = Schema({
		center_id: String,
		email: String,
		phone: String,
		template: String,
		created: Date,
		description: String, //name of the owner of template
		type: String
	})

	var docEntrySchema = Schema({
		name: String,
		email: String,
		phone: String,
		spacialty: String,
		created: Date,
		fx_number: String, //fellowship number
		address: String,
		year_of_fellowship: String
	})

	var labStoreSchema = Schema({
		center_id: String,
		lab_data: Array,
		ref_id: String,
		center_pic: String,
    center_name: String,
    center_address: String,
    center_email: String,
    center_phone: String,
    center_city: String,
    center_country: String,
    id_by: String,
    report_date: Date
	});


	var consultationFeeSchema = Schema({
		status: String,
		is_paid: Boolean,
		amount: Number,
		doctor_id: String,
		patient_id: String,
		date: Date,
		commission: Number
	});

	var chatKeySchema = Schema({
		key: String,
		date: Date
	});

	var kitsSchema = Schema({
		package: Number,
    content: Array,
    type: String,
    disease: String,
    name: String,
    age: String,
    created: Date,
    note: String
    //doctorId: String 
	})

	var planSchema = Schema({
		expirationDate: {
			type: Date,
			expires: Number
		},		
		createdAt: {
			type: Date,
			expires: Number
		},
		date: Date,
		userId: String,
		subscription: String,
		type: String,
		deleted: Boolean
	})

	/*_id: "njds884943",
        package: 1,
        content: [{drug_name: "Camosunate tabs",dosage:"",frequency: "", duration: ""},
        {drug_name:"Panadol",dosage:"2 tabs",frequency: "thrice daily", duration: "" },
        {drug_name:"Vitamin Capsule",dosage:"1",frequency: "daily", duration: "" }],
        type: "Drug",
        disease: "Malaria",
        name: "Anti Malaria",
        age: "18",
        created: new Date(),
        note: "Please eat enough food before taking and drink enough water",
        doctorId: "sdhjd"   
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
	models.dicom = mongoose.model("dicominfo",dicomSchema);
	models.study = mongoose.model("studyinfo",studySchema);
	models.accession = mongoose.model("accessioninfo",accessionSchema);
	models.template = mongoose.model("templateinfo",reportTemplateSchema);
	models.session = mongoose.model("sessioninfo",sessionSchema);
	models.doc_entry = mongoose.model("docEntryinfos",docEntrySchema);
	models.lab_store = mongoose.model("labstoreinfos",labStoreSchema);
	models.referral = mongoose.model("referralinfos",refSchema);	
	models.consultationFee = mongoose.model("consultationfeeinfos",consultationFeeSchema);
	models.chat_key = mongoose.model("chatKeyinfos",chatKeySchema);
	models.kits = mongoose.model("kitinfos",kitsSchema); 
	models.plan = mongoose.model("planinfos",planSchema); 
	//models.chat_file = mongoose.model("chatFileinfos",chatFileSchema);
	//models.calling_code = mongoose.model("callingcodeinfos",callingSchema)
	
	return models		
}

module.exports = myModel;













