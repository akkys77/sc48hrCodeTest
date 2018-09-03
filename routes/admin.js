const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

const { middleware } = require('../middleware');
// console.log(middleware);

router.get('/', ensureLoggedIn, middleware.playlist.readAll(),(req, res) => {
  // console.log(res.locals.playlist);
  res.render('admin', {
    user: req.user,
    userProfile: JSON.stringify(req.user, null, '  '),
    playlists: res.locals.playlists||{},
    // playlistArray: JSON.stringify(res.locals.playlist)||{},
    // results: []
  });
});

router.get(
  '/login',
  middleware.getAuth0Info.authenticateAdmin(),
  (req, res) => {
    res.redirect('/admin');
  }
);

router.get(
  '/callback',
  middleware.getAuth0Info.authenticateAdmin(),
  (req, res) => {
    res.redirect('/admin');
  }
);

module.exports = router;
