const { ManagementClient } = require('auth0');
const passport = require('passport');
const { config } = require('../config');

const { inspect } = require('util');
// LoggedIn Middleware function used to store user information
const loggedIn = (req, res, next) => {
  if (!res.hasOwnProperty('locals')) {
    res.locals = {};
  }
  res.locals.loggedIn = false;
  if (
    req.session.passport &&
    typeof req.session.passport.user !== 'undefined'
  ) {
    res.locals.loggedIn = true;
  }
  if (!res.locals.user) {
    res.locals.user = req.user;
  }
  // console.log('in LoggedIn:', inspect(res.locals));
  next();
};

const auth0 = new ManagementClient({
  domain: config.auth0Domain,
  clientId: config.auth0Client,
  clientSecret: config.auth0ClientSecret
});

const getAuth0Info = () => {
  return (req, res, next) => {
    if (req.session.passport) {
      if (req.session.passport.user) {
        const auth0id = req.session.passport.user._json.sub;
        auth0
          .getUser({
            id: auth0id
          })
          .then(user => {
            const { user_metadata } = user;
            res.locals.user.user_metadata = { ...user_metadata };
            return res.locals.user;
          })
          .then(show => {
            next();
          })
          // .then()
          .catch(err => {
            console.log(err);
            next();
          });
      } else {
        next();
      }
    } else {
      next();
    }
  };
};

const authenticate = (req, res, next) => {
  console.log('do not forget to specify redirect url from env')
  return passport.authenticate('normal', {
    clientID: config.auth0Client,
    domain: config.auth0Domain,
    redirectUri: config.auth0Redirect,
    audience: 'https://' + config.auth0Domain + '/userinfo',
    responseType: 'code',
    scope: 'openid profile',
    failureRedirect: '/'
  });
};

const authenticateAdmin = (req, res, next) => {
  console.log('do not forget to specify redirect url from env')
  return passport.authenticate('admin', {
    clientID: config.auth0AdminClient,
    domain: config.auth0Domain,
    redirectUri: config.auth0AdminRedirect,
    audience: 'https://' + config.auth0Domain + '/userinfo',
    responseType: 'code',
    scope: 'openid profile',
    failureRedirect: '/'
  });
};

module.exports = { authenticate, authenticateAdmin, loggedIn, getAuth0Info };
