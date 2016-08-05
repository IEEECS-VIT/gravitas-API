/*
 * Participant Portal.
 */

'use strict';

const path = require('path');
const Receipt = require(path.join(__dirname, '..', 'models', 'receipt'));
const Participant = require(path.join(__dirname, '..', 'models', 'participant'));
const Promise = require('bluebird');
const express = require('express');
const crypto = Promise.promisifyAll(require('crypto'));
const router = express.Router();
const util = require(path.join(__dirname, '..', 'utilities', 'util'));

// No auth.
// router.use(util.allowedUsers(['participant']));


router.route('/').get(function (req, res) 
{
    return res.render('participant-index');
});

router.route('/participant')
.get(function getParticipant(req, res, next) 
{
  /* GET /participant?id= 
   * 
   * returns participant data + events registered by participant as json.
   * 404 if not found.
   */
    if (!req.query.id) 
    {
        let error = new Error('Not Found');
        error.status = 404;
        return next(error);
    }
 
    Promise.props(
        {
            participant : Participant.findById(req.query.id),
            events : Receipt.find({participantId: req.query.id}, 'eventIds')
        })
  .then(function (data) 
  {
      if (!data.participant) 
    {
          let error = new Error('Not Found');
          error.status = 404;
          return next(error);
      }
      data.message='success';
      if (data.events != 0)
      {
          data.events = data.events[0].eventIds;
      } 
      else 
      {
          data.events = [];
      }
      return res.json(data);
  })
  .catch(next);

});
router.route('/participant')
.post(function createParticipant(req, res, next) 
{
  /* POST /participant
   *
   * req.body must have keys: [_id, name, email, phone]
   */
    let participant = new Participant(req.body);
    participant.save()
  .then(function (participant) 
  {
      return res.json({ message: 'success', participant: participant });
  })
  .catch(next);
});

router.route('/register')
.post(function postRegister(req, res, next) 
{
   /* POST /register.
    *
    * req.body must have keys: [participantId, eventIds, payment].
    * req.body.payment must have keys: [paymentType, transactionId]
    */
    crypto.randomBytesAsync(3).then(function (buffer)
    {
        let receipt = new Receipt(
            {
                participantId: req.body.participantId,
                payment: req.body.payment,
                eventIds: req.body.eventIds,
                _id: 'GRA' + buffer.toString('hex'),
                userId: req.body.participantId
            });

        return Promise.props(
            {
                participant: Participant.findById(req.body.participantId),
                receipt: receipt.save()
            });
    })
    .then(function (data) 
    {
        return util.sendReceiptEmail(data);
    })
    .then(function (receipt) 
    {
        receipt.message = 'success';
        res.json(receipt);
    })
    .catch(next);
});

module.exports = router;