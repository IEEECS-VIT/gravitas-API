/*
 * Events API.
 */
'use strict';

const path = require('path');
const express = require('express');
const Event = require(path.join(__dirname, '..', 'models', 'event'));
const SalesItem = require(path.join(__dirname, '..', 'models', 'sales-item'));
const Receipt = require(path.join(__dirname, '..', 'models', 'receipt'));
const Fields = '_id category subCategory organization coordinators description team participation.fee';
const cors = require('cors');
const Promise = require('bluebird');

const router = express.Router();
router.use(cors());

function translateDocument(e)
{
    return {
        'name': e._id,
        'category': e.category,
        'subCategory': e.subCategory,
        'organization': e.organization,
        'coordinators': e.coordinators,
        'description': e.description,
        'teamSize': e.team,
        'participationFee': e.participation.fee
    };
}


router.route('/list')
.get(function getAllEvents (req, res, next)
{
    /* GET /list */
    Event.find({})
    .select('_id organization category subCategory team participation.fee')
    .then(function (docs)
    {
        let data = docs.map(function (e)
        {
            return {
                'name': e._id,
                'category': e.category,
                'subCategory': e.subCategory,
                'organization': e.organization,
                'teamSize': e.team,
                'participationFee': e.participation.fee
            };
        });

        res.json({'events': data});
    })
    .catch(next);
});

router.route('/organization')
.get(function getEventsByOrganization (req, res, next)
{
    /* GET /organization?q= */
    Event.find({ 'organization': { $regex: req.query.q, $options : 'i' }})
        .select(Fields)
        .then(function (docs)
        {
            return res.json({'events': docs.map(translateDocument)});
        })
        .catch(next);
});

router.route('/name')
.get(function getEventsByName (req, res, next)
{
    /* GET /name?q= */
    Event.find({ '_id': { $regex: req.query.q, $options : 'i' }})
    .select(Fields)
    .then(function (docs)
    {
        return res.json({'events': docs.map(translateDocument)});
    })
    .catch(next);
});

router.route('/category')
.get(function getEventsByCategory (req, res, next)
{
    /* GET /category?q= */
    Event.find({ 'category': req.query.q })
    .select(Fields)
    .then(function (docs)
    {
        return res.json({'events': docs.map(translateDocument)});
    })
    .catch(next);
});

router.route('/subCategory')
.get(function getEventsBySubCategory (req, res, next)
{
    /* GET /subCategory?q= */
    Event.find({ 'subCategory': req.query.q })
    .select(Fields)
    .then(function (docs)
    {
        return res.json({'events': docs.map(translateDocument)});
    })
    .catch(next);
});

/*
router.route('/count')
.get(function (req, res, next)
{
    let project = { $project: {'eventIds': 1} };
    let unwind = { $unwind: '$eventIds'};
    let group = { $group: { _id: '$eventIds', count: { $sum: 1 } }  };

    Receipt.aggregate(project, unwind, group).exec().then(function (docs)
    {
        res.json(
            {
                counts: docs.map(function (e) { return { name: e._id, count: e.count };  })
            });
    }).catch(next);
});


router.route('/salesItems')
.get(function (req, res, next)
{
    SalesItem.find({}).then(function (docs)
    {
        res.json({ salesItems: docs.map(function(e) { return { name: e._id, cost: e.cost }; }) });
    }).catch(next);
})

router.route('/remaining')
.get(function(req, res, next){

      let project = { $project: {'eventIds': 1} };
      let unwind = { $unwind: '$eventIds'};
      let group = { $group: { _id: '$eventIds', count: { $sum: 1 } }  };

      Promise.props(
      {
          count : Receipt.aggregate(project, unwind, group).exec(),
          remaining : Event.find({}, "participation.expected.internal").exec()
      })
      .then(function(data){
          res.json(data)
      })
      .catch(next);

/*
    Event.find({})
    .then(function(docs){
        let obj = {};
        docs.forEach(function(e){
          obj[e._id] = e.participation.expected.internal;
        })
        res.json(obj);
    })
    .catch(next);
    

})
*/

module.exports = router;
