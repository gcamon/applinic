var axios = require('axios');
var FormData = require('form-data');
var uuid = require("uuid");

const sendSMS = (recipient, message) => {
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

    var config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://app.smartsmssolutions.com/io/api/client/v1/sms/',
    headers: { 
        ...data.getHeaders()
    },
    data : data
    };

    axios(config)
    .then(function (response) {
    console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
    console.log(error);
    });

}

module.exports = sendSMS;
