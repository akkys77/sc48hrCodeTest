const express = require('express');
const router = express.Router();

const { middleware } = require('../middleware');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/login', middleware.getAuth0Info.authenticate(), (req, res) => {
  res.redirect('/user');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/callback', middleware.getAuth0Info.authenticate(), (req, res) => {
  res.redirect('/user');
});

router.get('/failure', (req, res) => {
  let error = req.flash('error');
  let error_description = req.flash('error_description');
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0]
  });
});

module.exports = router;
