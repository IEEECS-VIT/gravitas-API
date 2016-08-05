var mongoose = require('mongoose');

var Participant = new mongoose.Schema({
    _id: { type: String, required: true }, // registration number
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    room: { type: String, required: true },
    tShirtSize: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true}
});

module.exports = mongoose.model('Participant', Participant);
