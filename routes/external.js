/*
 * External registration Portal.
 */

'use strict';

const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'user'));
const Event = require(path.join(__dirname, '..', 'models', 'event'));
const Receipt = require(path.join(__dirname, '..', 'models', 'receipt'));
const util = require(path.join(__dirname, '..', 'utilities', 'util'));
const express = require('express');
const Promise = require('bluebird');
const router = express.Router();

router.use(util.allowedUsers(['external']));


router.route('/register')
.get(function getRegister(req, res) 
{
  /* GET /register. */
    return res.render('external-register');
})
.post(function postRegister(req, res, next) 
{
  /* POST /register. */
    let external = new User(
        {
            _id: req.body.username,
            password: req.body.password,
            type: 'external',
            details: {
                fullName: req.body.fullName,
                institute: req.body.institute,
                email: req.body.email,
                gender: req.body.gender
            }
        });

    external.save().then(function() 
  {
        return res.redirect('/');
    })
  .catch(next);
});


router.all('/', util.allowedUsers(['external']));
router.all('/profile', util.allowedUsers(['external']));


router.route('/')
.get(function (req, res, next) 
{
    /* GET index page. */
    Promise.props(
        {
            external : Receipt.find({participantId: req.user._id}, 'eventIds') ,
            events : Event.find({})
        }).then(function(data)
        {
            return res.render('external-home', data);
        })
    .catch(next);
})
.post(function postRegisterUnpaid(req, res, next) 
{
    let updates = { $pushAll:{'details.unpaidEventIds': req.body.eventIds } };
    User.findByIdAndUpdate(req.user._id, updates).then(function() 
    {
        return res.json({ message: 'success' });
    })
  .catch(next);
});



router.route('/profile')
.get(function(req, res, next)
{
    Receipt.find({participantId: req.user._id}, 'eventIds -_id').then(function(events)
    {
        let data = 
            {
                'events': events,
                'user' : req.user
            };
        return res.render('external-profile', data );
    })
    .catch(next);
});

// TODO: link after adding payment functionality.
/*
function postRegister(req, res, next){
    let receipt = new Receipt(
        {
            participantId: req.user._id,
            eventIds: req.body.eventIds,
            userId: req.user._id
        });
    Promise.props({
        participant: {
            email : req.user.details.email
        },
        receipt: receipt.save()
    })
    .then(function (data) {
        return util.sendReceiptEmail(data);
    })
    .then(function (receipt) {
        receipt.message = 'success';
        res.json(receipt);
    })
    .catch(next);
}
*/

module.exports = router;
