var mongoose = require('mongoose');

var PaymentDetail = new mongoose.Schema({
    paymentType: { type: String, enum: ['card', 'cash'] },
    transactionId: String
});

var EmailDetail = new mongoose.Schema({
    sent: { type: Boolean, default: false },
    error: { type: Object }
});

var SalesReceipt = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    itemIds: { type: [String], required: true, ref: 'SalesItem' },
    participantId: { type: String, ref: 'Participant'},
    payment: { type: PaymentDetail },
    emailDetail: { type: EmailDetail }
}, {
    timestamps: true
});

module.exports = mongoose.model('SalesReceipt', SalesReceipt);
