const express = require('express');
const passport = require('passport');
const router = express.Router();

const { config } = require('../config');
const { middleware } = require('../middleware');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/login', middleware.getAuth0Info.authenticate(), function(
  req,
  res
) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/callback', middleware.getAuth0Info.authenticate(), (req, res) => {
  res.redirect(req.session.returnTo || '/user');
});

router.get('/failure', function(req, res) {
  var error = req.flash('error');
  var error_description = req.flash('error_description');
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0]
  });
});

module.exports = router;
