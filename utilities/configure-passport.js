var path = require('path');
var LocalStrategy = require('passport-local');
var User = require(path.join(__dirname, '..', 'models', 'user'));

/**
 * Configure passport.js with LocalStrategy.
 */

module.exports = function (passport) 
{

    var strategy = new LocalStrategy(
    function (username, password, done) 
    {
        var user = null;

        User.findById(username).then(function (result) 
      {
            if (!result) 
        {
                var error = new Error('user not found');
                error.status = 400;
                throw error;
            }
            user = result;
            return user.comparePassword(password);
        })
      .then(function (match) 
      {
          if (!match) 
        {
              var error = new Error('incorrect password');
              error.status = 400;
              throw error;
          }
          return done(null, user);
      })
      .catch(done);
    });

    passport.use(strategy);

    passport.serializeUser(function (user, done) 
  {
        return done(null, user._id);
    });

    passport.deserializeUser(function (id, done) 
  {
        User.findById(id, function (err, user) 
    {
            return done(err, user);
        });

    });

};