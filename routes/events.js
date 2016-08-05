/*
 * Events Portal.
 */
'use strict';

const path = require('path');
const Event = require(path.join(__dirname, '..', 'models', 'event'));
const Promise = require('bluebird');
const express = require('express');
const router = express.Router();
const util = require(path.join(__dirname, '..', 'utilities', 'util'));

//router.use(util.allowedUsers(['events']));

router.route('/')
.get(function(req, res, next){
  var options = [
      {
          title: 'Events list',
          url: '/events/list'
      }];
  return res.render('home', { options: options });
})

router.route('/list')
.get(function(req, res, next){
    res.render('events-list');
})

router.route('/edit')
.post(function(req, res, next){
  res.render('events-edit', { "eventName" : req.body.eventName });
})

router.route('/edited')
.post(function(req, res, next){

  Event.findOneAndUpdate({_id: req.body.edited._id}, req.body.edited)
  .then(function(data){
    return res.json({'updatedEvent':data});
  })
  .catch(next);

})

router.route('/eventData')
.post(function(req, res, next){
    Event.find({ _id: req.body.id }).exec()
    .then(function (eventData)
    {
        return res.json({ 'eventDetail': eventData });
    })
    .catch(next);
});

module.exports = router;
