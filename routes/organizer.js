/*
 * Organizer Portal.
 */

'use strict';

const path = require('path');
const Receipt = require(path.join(__dirname, '..', 'models', 'receipt'));
const Participant = require(path.join(__dirname, '..', 'models', 'participant'));
const Promise = require('bluebird');
const express = require('express');
const router = express.Router();
const util = require(path.join(__dirname, '..', 'utilities', 'util'));

router.use(util.allowedUsers(['organizer']));


router.route('/')
.get(function getIndex(req, res)
{
  /* GET organizer index. */
    let options = [
        {
            title: 'Edit participant details',
            url: '/organizer/editParticipant'
        },
        {
            title: 'View event registrations',
            url: '/organizer/eventRegistrationDetail'
        },
        {
          title: 'Export Excel Sheet',
          url: '/organizer/receipt/export'
        }
    ];
    return res.render('home', { options: options });
});

router.route('/eventRegistrationDetail')
.get(function getEventRegistrationDetail(req, res)
{
  /* GET /eventRegistrationDetail. */
    return res.render('organizer-event-registration-detail');
});


router.route('/editParticipant')
.get(function getEditParticipant(req, res)
{
  /* GET /editParticipant. */
    return res.render('organizer-edit-participant');
});


router.route('/event/:id')
.get(function (req, res, next)
{
    /* GET /event/:id
     * return all the participants for a particular event.
     */
    Receipt.find({ eventIds: req.params.id }, 'participantId').exec().then(function (participantIds)
    {
        return res.json({ 'participantIds': participantIds });
    })
    .catch(next);
});

router.route('/participant/list')
.get(function (req, res, next)
{
    Participant.find({}).exec().then(function (docs)
    {
        return res.json(
            {
                participants: docs
            });
    }).catch(next);
});

router.route('/receipt/list')
.get(function (req, res, next)
{
    Receipt.find({}).exec().then(function (docs)
    {
        return res.json(
            {
                receipts: docs
            });
    }).catch(next);
});

router.route('/receipt/export')
.get(function (req, res, next)
{
    return res.render('organizer-export');
})


router.route('/participant')
.get(function getParticipant(req, res, next)
{
  /* GET /participant?id=
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
            participant : Participant.findById(req.query.id).exec(),
            events : Receipt.find({participantId: req.query.id}, {eventIds:1}).exec()
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

router.route('/updateParticipant')
.post(function updateParticipant(req, res, next){
    /* POST /updateParticipant
     *
     * req.body must have keys: [_id, name, email, phone]
     */
    let updatedParticipant = new Participant(req.body);
    let particpantID = { '_id':req.body._id };
    Participant.update(particpantID, updatedParticipant)
     .then(function (participant)
     {
         return res.json({ message: 'success', participant: participant });
     })
     .catch(next);
});

router.route('/deleteEvent')
.post(function deleteEvent(req, res, next){
    /* POST /deleteEvent
     *
     * req.body must have keys: [Receipt_id, eventID]
     */


    Receipt.findOneAndUpdate(
         {'_id': req.body._id},
         {$pull: {eventIds: req.body.eventID}}
     )
     .then(function (receipt)
     {
         return Promise.props(
             {
                 participant: Participant.findById(req.body.participantId).exec(),
                 receipt: Receipt.findById(req.body._id).exec()
             });
     })
   .then(function (data)
   {    data.subject='Updated:';
       return util.sendReceiptEmail(data);
   })
   .then(function (receipt)
   {
       receipt.message = 'success';
       res.json(receipt);
   })
     .catch(function(e){
         console.log(e);
     });

});



module.exports = router;
