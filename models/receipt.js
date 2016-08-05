var mongoose = require('mongoose');

var PaymentDetail = new mongoose.Schema({
    paymentType: { type: String, enum: ['card', 'cash'] },
    transactionId: String
});

var EmailDetail = new mongoose.Schema({
    sent: { type: Boolean, default: false },
    error: { type: Object }
});

var Receipt = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    eventIds: { type: [String], ref: 'Event', required: true },
    payment: { type: PaymentDetail },
    participantId: { type: String, ref: 'Participant', required: true },
    emailDetail: { type: EmailDetail }
}, {
    timestamps: true
});

module.exports = mongoose.model('Receipt', Receipt);
