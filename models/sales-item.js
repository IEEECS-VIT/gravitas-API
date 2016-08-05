var mongoose = require('mongoose');


var SalesItem = new mongoose.Schema({
    _id: { type: String, unique: true},
    cost: { type: Number, required: true }
});

module.exports = mongoose.model('SalesItem', SalesItem);
