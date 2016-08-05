/*
 * Index.
 */

'use strict';

const passport = require('passport');
const express = require('express');
const path = require('path');
const Event = require(path.join(__dirname, '..', 'models', 'event'));
const router = express.Router();


router.route('/')
.get(function (req, res)
{
  /* GET /login. */
    return res.render('login');
})
.post(passport.authenticate('local'), function login(req, res)
{
  /* POST /login.
   *
   * Redirect to [user-type] index on success.
   * 400 on failure.
   */
    return res.redirect(req.user.type);
});


router.route('/logout')
.get(function (req, res)
{
  /* GET logout. Redirect to index */
    req.logout();
    res.clearCookie();
    return res.redirect('/');
});

router.route('/form')
.get(function (req, res)
{
    return res.render('events-proposal-form-online');
})
.post(function (req, res, next)
{
    let event = Event(req.body);
    event.save()
    .then(function ()
    {
        return res.json({ 'message': 'success' });
    })
    .catch(next);
});

router.route('/public')
.get(function(req, res, next){
  res.render('public');
})

module.exports = router;
