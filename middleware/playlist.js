const { ManagementClient } = require('auth0');

const { config } = require('../config');
const util = require('util');
const auth0 = new ManagementClient({
  domain: config.auth0Domain,
  clientId: config.auth0Client,
  clientSecret: config.auth0ClientSecret
});

const read = () => {
  return async (req, res, next) => {
    // res.locals.user.id = req.session.passport.user.id;
    await auth0
      .getUser({ id: req.session.passport.user.id })
      .then(user => {
        if (!user.user_metadata) {
          return;
        }
        if (user.user_metadata) {
          let savedPlaylist = user.user_metadata;
          let savedPlaylistArray = JSON.parse(
            Object.keys(JSON.parse(Object.values(savedPlaylist)[0]))[0]
          );
          res.locals.playlist = savedPlaylistArray;
        }
      })
      .catch(err => console.log(err));
    next();
  };
};

const readAll = () => {
  return async (req, res, next) => {
    await auth0
      .getUsers({ per_page: 10 })
      .then(users => {
        return users.reduce((res, user) => {
          if (user.user_metadata) {
            if (user.user_metadata.playlist) {
              res.push({
                user_id: user.user_id,
                user_playlist: JSON.parse(
                  Object.keys(
                    JSON.parse(Object.values(user.user_metadata)[0])
                  )[0]
                )
              });
            }
          }
          return res;
        }, []);
      })
      .then(results => {
        res.locals.playlists = results;
      })
      .catch(err => console.log(err));
    next();
  };
};

const save = () => {
  return (req, res, next) => {
    const userId = res.locals.user.id;
    const playlist = JSON.stringify(req.body);
    auth0
      .updateUserMetadata({ id: userId }, { playlist })
      .catch(err => console.log(err));
    next();
  };
};

module.exports = {
  read,
  save,
  readAll
};
