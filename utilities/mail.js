var nodemailer = require('nodemailer');
var Promise = require('bluebird');
var path = require('path');


var transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
        user: process.env.MAILGUN_EMAIL_ID,
        pass: process.env.MAILGUN_PASS
    }
});

sendReceiptEmail = function () {
    var text = 'Hello 10357, you were registered for events ' + ''
    var options = {
        to: '',
        from: 'receipt@vitgravitas.com',
        subject: 'gravitas receipt id ' + '',
        text: text
    };
    transporter.sendMail(options, function (err) {
        if (err) {
            console.log("error");
            console.log(err);
        } else {
            console.log("success");
        }

    });
};

sendReceiptEmail();
