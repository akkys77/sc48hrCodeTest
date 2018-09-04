const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

const { middleware } = require('../middleware');

router.get('/', ensureLoggedIn, middleware.playlist.readAll(), (req, res) => {
  res.render('admin', {
    user: req.user,
    userProfile: JSON.stringify(req.user, null, '  '),
    playlists: res.locals.playlists || {}
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
