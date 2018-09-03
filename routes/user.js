const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

const { middleware } = require('../middleware');
// console.log(middleware);

var playlist = [];

// Spotify Wrapper documentation
// http://michaelthelin.se/spotify-web-api-node/

//  Search API documentation
//  https://developer.spotify.com/web-api/search-item/

//  Please note that this endpoint does not require authentication. However, using an access token
//  when making requests will give your application a higher rate limit.

const spotifyApi = new SpotifyWebApi({
  clientId: 'ebc7a632b02846e49ae54d902265da3a',
  clientSecret: '4eb7860bea054fb2a6c3f66ff6a8584b'
});

/* GET user profile. */
// router.get("/", function(req, res, next) {
// router.get('/', ensureLoggedIn, middleware.playlist.read(), function(
router.get('/', ensureLoggedIn, middleware.playlist.read(), (req, res) => {
  // console.log(res.locals.playlist);
  res.render('user', {
    user: req.user,
    userProfile: JSON.stringify(req.user, null, '  '),
    playlist: res.locals.playlist||{},
    playlistArray: JSON.stringify(res.locals.playlist)||{},
    results: []
  });
});

router.post('/searchSpotify', (req, res) => {
  // var searchTerms =req.params.terms;
  var searchTerms = req.body.searchTerms;
  spotifyApi
    .clientCredentialsGrant()
    .then(
      function(data) {
        // console.log("The access token is " + data.body["access_token"]);
        spotifyApi.setAccessToken(data.body['access_token']);
      },
      function(err) {
        console.log('Something went wrong!', err);
      }
    )
    .then(function() {
      let results = [];
      return spotifyApi.searchTracks(searchTerms).then(
        function(data) {
          // console.log(JSON.stringify(data.body));
          var i = 1;
          data.body.tracks.items.map(item => {
            results.push({
              pos: i++,
              name: encodeURIComponent(item.name),
              artist: item.artists.map(artist => encodeURIComponent(artist.name)),
              // artist: item.artist,
              id: item.id,
              image: item.album.images[2].url,
              release_date: item.album.release_date
            });
          });
          // console.log(results);
          return results;
          // console.log(JSON.stringify(data.body));
        },
        function(err) {
          console.log('Something went wrong', err);
        }
      );
    })
    .then(function(results) {
      // console.log('results: ',results)
      // return res.render('user', { user: req.user, results: results });
      res.json({
        success: 'Updated Successfully',
        results: results,
        status: 200
      });
    })
    .catch(err => console.log(err));
});

// router.post('/savePlaylist', middleware.playlist.save(), (req, res) => {
router.post(
  '/savePlaylist',
  middleware.getAuth0Info.getAuth0Info(),
  middleware.playlist.save(),
  (req, res) => {
    res.json({ success: 'Updated Successfully', status: 200 });
  }
);

module.exports = router;
