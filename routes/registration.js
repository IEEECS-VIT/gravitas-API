/*
 * Registration Portal.
 */

'use strict';

const path = require('path');
const util = require(path.join(__dirname, '..', 'utilities', 'util'));
const Receipt = require(path.join(__dirname, '..', 'models', 'receipt'));
const SalesReceipt = require(path.join(__dirname, '..', 'models', 'sales-receipt'));
const Participant = require(path.join(__dirname, '..', 'models', 'participant'));
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');


router.use(util.allowedUsers(['registration']));

router.route('/')
.get(function getIndex(req, res)
{
  /* GET registration index. */
    let options = [
        {
            title: 'register',
            url: '/registration/register'
        },
        {
          title: 'count',
          url: '/registration/count'
        }];
    return res.render('home', { options: options });
});


router.route('/register')
.get(function getRegister(req, res)
{
  /* GET /register. */
    return res.render('register');
})

.post(function postRegister(req, res, next)
{
   /* POST /register.
    *
    * req.body must have keys: [participantId, eventIds, payment].
    * req.body.payment must have keys: [paymentType, transactionId]
    */
    let receipt = new Receipt(
        {
            participantId: req.body.participantId,
            payment: req.body.payment,
            eventIds: req.body.eventIds,
            userId: req.user._id
        });
    Promise.props(
        {
            participant: Participant.findById(req.body.participantId).exec(),
            receipt: receipt.save()
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

    let matchParticipant = {$match: {participantId: req.query.id}};
    let unwindEventIds = {$unwind: "$eventIds"};
    let groupEventsByParticpant = {$group: {_id: "$participantId", events: {$push: "$eventIds" }} };


    let unwindItemIds = {$unwind: "$itemIds"};
    let groupItemsByParticpant = {$group: {_id: "$participantId", items: {$push: "$itemIds" }} };
    Promise.props(
    {
        participant : Participant.findById(req.query.id).exec(),
        events : Receipt.aggregate(matchParticipant,  unwindEventIds, groupEventsByParticpant).exec(),
        items: SalesReceipt.aggregate(matchParticipant, unwindItemIds, groupItemsByParticpant).exec()
    })
  .then(function (data)
  {
      if (!data.participant)
    {
          let error = new Error('Not Found');
          error.status = 404;
          return next(error);
      }
      if (data.events.length == 0)
      {
          data.events = []
      }
      else
      {
          data.events = data.events[0]['events'];
      }

      if (data.items.length == 0)
      {
          data.items = []
      }
      else
      {
          data.items = data.items[0]['items'];
      }


      data.message='success';
      return res.json(data);
  })
  .catch(next);

})
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

router.route('/purchase').post(function (req, res, next)
{
    /* POST /purchase
     *
     * req.body must have keys: [itemName, cost, participantId, payment]
     * req.body.payment must have keys: [paymentType, transactionId]
     */
     //console.log(req.body);
    let receipt = new SalesReceipt(
        {
            userId: req.user._id,
            cost: req.body.cost,
            itemIds: [req.body.itemIds],
            participantId: req.body.participantId,
            payment: req.body.payment
        }
    );
    Promise.props(
        {
            salesReceipt: receipt.save(),
            participant: Participant.findById(req.body.participantId).exec()
        })
    .then(function (data)
    {
        return util.sendSalesReceiptEmail(data);
    })
    .then(function (salesReceipt)
    {
        salesReceipt.message = 'success';
        res.json(salesReceipt);
    })
    .catch(next);
});


router.route("/count")
.get(function(req, res, next){
  res.render('event-count');
})

module.exports = router;
