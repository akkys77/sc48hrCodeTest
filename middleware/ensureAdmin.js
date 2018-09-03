const { config } = require('../config');
const ManagementClient = require('auth0').ManagementClient;
const auth0 = new ManagementClient({
  domain: config.auth0Domain,
  clientId: config.auth0Client,
  clientSecret: config.auth0ClientSecret
});

const permit = (...allowed) => {
  const isAllowed = role => allowed.indexOf(role) > -1;
  // console.log(allowed);
  // return a middleware
  return (req, res, next) => {
    auth0
      .getUser({
        id: req.session.passport.user.id
      })
      .then(function(user) {
        // console.log("role: " + JSON.stringify(user.user_metadata.role));
        res.locals.role = user.user_metadata.role;
        if (isAllowed(res.locals.role)) next();
        // role is allowed, so continue on the next middleware
        else {
          res.status(403).json({
            message: 'Forbidden'
          }); // user is forbidden
        }
      })
      .catch(function(err) {
        console.log(err);
        // next();
      });
  };
};

module.exports = {
  permit
};
