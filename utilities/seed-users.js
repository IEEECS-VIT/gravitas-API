#!/usr/bin/env node

/*
 * seed-users.js
 * This script makes dummy accounts (user1, user2, .., usern) where n =
 * 
 */
require('dotenv').config({ silent: true });
var path = require('path');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var User = require(path.join(__dirname, '..', 'models', 'user'));


try {
    var n = parseInt(process.argv[2]);
} catch(e) {
    console.log('n is not an integer');
    process.exit(1);
}

seedUsers(n);



function seedUsers(n)
{
    var users = [];
    for (var i=100; i<=n; i++)
    {
        users.push(
            {
                _id: 'user' + i.toString(),
                type: 'sales',
                password: '123'
            }
        );
    }


    mongoose.Promise = bluebird;
    mongoose.connect(process.env.MONGO_URI);
    console.log('connected to the database');
    User.create(users)
    .then(function (docs)
    {
        console.log('users created.');
        mongoose.disconnect();
    })
    .catch(function (err) 
    {
        console.log('could not seed database.');
        console.log(err);
        mongoose.disconnect();
    });
};

module.exports = seedUsers;