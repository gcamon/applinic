//var axios = require('axios');
var FormData = require('form-data');
var uuid = require("uuid");
var request = require('request');
//var axios = require('axios/dist/node/axios.cjs');

const sendSMS = (recipient, message, cb) => {
    var data = new FormData();
    var refId = uuid.v1();

    data.append('token', process.env.SMSTOKEN);
    data.append('sender', 'Applinic');
    data.append('to', recipient);
    data.append('message', message);
    data.append('type', 0);
    data.append('routing', 3);
    data.append('ref_id', refId);
    // data.append('simserver_token', 'simserver-token');
    // data.append('dlr_timeout', 'dlr-timeout');
    // data.append('schedule', 'time-in-future');

    //var headers = data.getHeaders();

    var config = {
    //method: 'post',
    //maxBodyLength: Infinity,
    url: 'https://app.smartsmssolutions.com/io/api/client/v1/sms/',
    //headers: headers,
    data : data,
    formData: data
    };

    request.post(config,function(err,response,body){
        if(err){
            console.log(err)
        }

        if(cb) cb(null, response)
        console.log("sms sent successfully")
    })
    // axios(config)
    // .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //     if(cb) cb(null, response)
    // })
    // .catch(function (error) {
    //     console.log(error);
    //     if(cb) cb(error, null)
    // });

}

module.exports = sendSMS;
