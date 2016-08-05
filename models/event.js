var mongoose = require('mongoose');

var Coordinator = new mongoose.Schema({
    _id: String,
    name: String,
    phone: String,
    email: String
});

var Faculty = new mongoose.Schema({
    _id: String,
    name: String,
    school: String,
    phone: String,
    email: String
});

var Event = new mongoose.Schema({
    _id: String, // event title
    description: String,
    organization: [String],
    category: String,
    subCategory: String,
    remarks: String,
    resourcePerson: String,
    duration: String,
    team: Number, // number of people in 1 team
    rules: String,
    roundDescription: String,
    judgingCriteria: String,
    venue: {
        requested: {
            building: String,
            requirement: String
        }
    },
    participation: {
        fee: Number,
        expected: {
            internal: Number,
            external: Number,
        }
    },
    budget: {
        sponsorship: {
            expected: Number
        },
        registrations: {
            internal: Number,
            external: Number
        },

        purchase: {
            materials: String,
            description: String,
            honorarium: Number,
            travel: Number,
            refreshment: Number,
            memento: Number,
            major: Number,
            stationary: Number,
            certificates: Number,
            tags: Number,
            misc: Number,
        },
        total:Number,
        prizes: [Number]

    },
    coordinators: [Coordinator],
    faculty: Faculty,

});


module.exports = mongoose.model('Event', Event);
