"use strict";

var fs = require('fs');
var pdf = require('html-pdf');


module.exports = function(html) {

	var options2 = { format: 'Letter' };
	var dt = + new Date();
	var fileName = dt + "-" + Math.floor(Math.random() * 999) + '.pdf';
	var filePath = './pdf/' + fileName;

	pdf.create(html).toStream(function(err, stream){
  	stream.pipe(fs.createWriteStream(filePath));
	});

	return fileName;

}








