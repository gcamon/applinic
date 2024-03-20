//var axios = require('axios');
var FormData = require('form-data');
var uuid = require("uuid");
var request = require('request');
//var axios = require('axios/dist/node/axios.cjs');

const sendSMS = (recipient, message, cb) => {
    // var data = new FormData();
    // var refId = uuid.v1();

    // data.append('token', process.env.SMSTOKEN);
    // data.append('sender', 'Applinic');
    // data.append('to', recipient);
    // data.append('message', message);
    // data.append('type', 0);
    // data.append('routing', 3);
    // data.append('ref_id', refId);
    // data.append('simserver_token', 'simserver-token');
    // data.append('dlr_timeout', 'dlr-timeout');
    // data.append('schedule', 'time-in-future');

    //var headers = data.getHeaders();

    // var config = {
    // //method: 'post',
    // //maxBodyLength: Infinity,
    // url: 'https://app.smartsmssolutions.com/io/api/client/v1/sms/',
    // //headers: headers,
    // data : data,
    // formData: data
    // };

    const url = `https://kullsms.com/customer/api/?username=ede.obinna27@gmail.com.com&password=${process.env.KULLSMS_PASSWORD}
    &message=${message}&sender=Applinic Healthcare&mobiles=${recipient}`

    request.post(url,function(err,response,body){
        if(err){
            console.log(err)
            cb(err,null)
        }

        if(cb) cb(null, response)
        if(response === 1701)
            console.log("sms sent successfully")
    });

}

module.exports = sendSMS;
