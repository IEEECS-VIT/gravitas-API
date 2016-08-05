var nodemailer = require('nodemailer');
var Promise = require('bluebird');
var path = require('path');
var Receipt = require(path.join(__dirname, '..', 'models', 'receipt'));
var SalesReceipt = require(path.join(__dirname, '..', 'models', 'sales-receipt'));

var transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
        user: process.env.MAILGUN_EMAIL_ID,
        pass: process.env.MAILGUN_PASS
    }
});

exports.allowedUsers = function (types) {
    return function (req, res, next) {
        if (req.user && types.indexOf(req.user.type) !== -1) {
            next();
        } else {
            var error = new Error ('Unauthorized');
            error.status = 403;
            next(error);
        }
    };
};

exports.sendReceiptEmail = function (data) {
    var text = 'Hello ' + data.receipt.participantId + ', you were registered for events ' + data.receipt.eventIds;
    var options = {
        to: data.participant.email,
        from: 'receipt@vitgravitas.com',
        subject: 'gravitas receipt id ' + data.receipt._id,
        text: text
    };
    options.subject = ( data.subject ? data.subject : "" ) + options.subject;
    return new Promise(function (resolve, reject) {
        transporter.sendMail(options, function (err) {
            var promise = null;
            if (err) {
                promise = Receipt.findByIdAndUpdate(data.receipt._id, { emailDetail: {  sent: false, error: err } }, { new: true });
            } else {
                promise = Receipt.findByIdAndUpdate(data.receipt._id, { emailDetail: {  sent: true, error: null } }, { new: true });
            }

            promise.then(function ()
            {
                return resolve(data.receipt);
            }).catch(function (e)
            {
                return reject(e);
            });


        });

    });
};

exports.sendSalesReceiptEmail = function (data) {
    var text = 'Hello ' + data.salesReceipt.participantId + ', you were registered for item ' + data.salesReceipt.itemName;
    var options = {
        to: data.participant.email,
        from: 'receipt@vitgravitas.com',
        subject: 'gravitas sales receipt id ' + data.salesReceipt._id,
        text: text
    };
    options.subject = ( data.subject ? data.subject : "" ) + options.subject;
    return new Promise(function (resolve, reject) {
        transporter.sendMail(options, function (err) {
            var promise = null;
            if (err) {
                promise = SalesReceipt.findByIdAndUpdate(data.salesReceipt._id, {$set : { emailDetail: {  sent: false, error: err } } }, { new: true });
            } else {
                promise = SalesReceipt.findByIdAndUpdate(data.salesReceipt._id, {$set: { emailDetail: {  sent: true, error: null } }  }, { new: true });
            }

            promise.then(function ()
            {
                return resolve(data.salesReceipt);
            }).catch(function (e)
            {
                return reject(e);
            });


        });

    });
};
