/*
 * Sales Portal.
 */

'use strict';

const path = require('path');
const util = require(path.join(__dirname, '..', 'utilities', 'util'));
const SalesReceipt = require(path.join(__dirname, '..', 'models', 'sales-receipt'));
const Participant = require(path.join(__dirname, '..', 'models', 'participant'));
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

router.use(util.allowedUsers(['sales']));


router.route('/').get(function (req, res)
{
    let options = [
        {
            title: 'tshirt count',
            url: '/sales/count'
        }];
    return res.render('home', { options: options });
});

router.route('/count')
.get(function (req, res, next)
{
    /* GET /count
     * return all the participants for a particular event.
     */
    SalesReceipt.find({}, 'participantId').then(function (participantIds)
    {
        return res.render('sales-count', { 'participantIds': participantIds });
    })
    .catch(next);
});

module.exports = router;
