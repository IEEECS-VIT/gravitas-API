var mongoose = require('mongoose');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));

var SALT_WORK_FACTOR = 10;

var OptionalDetails = new mongoose.Schema({
    email: { type: String, required: true },
    institute: { type: String, required: true },
    gender: { type: String, required: true },
    fullName: { type: String, required: true },
    unpaidEventIds : [String]
});

var User = new mongoose.Schema({
    _id: String, // username
    password: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['registration', 'external', 'organizer', 'sales', 'events']
    },
    details: { type: OptionalDetails, required: false },
});

User.pre('save', function (next) {
    var user = this;

  // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

  // generate a salt
    bcrypt.genSaltAsync(SALT_WORK_FACTOR)
    .then(function (salt) {
      // hash the password using our new salt
        return bcrypt.hashAsync(user.password, salt);
    })
    .then(function (hash) {

      // override the cleartext password with the hashed one
        user.password = hash;
        next();
    })
    .catch(next);


});

User.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareAsync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', User);
