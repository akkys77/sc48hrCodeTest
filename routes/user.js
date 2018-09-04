const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

const { middleware } = require('../middleware');
const {config} = require('../config');

// Spotify Wrapper documentation
// http://michaelthelin.se/spotify-web-api-node/

//  Search API documentation
//  https://developer.spotify.com/web-api/search-item/

//  Please note that this endpoint does not require authentication. However, using an access token
//  when making requests will give your application a higher rate limit.

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotifyClientId,
  clientSecret: config.spotifyClientSecret
});

router.get('/', ensureLoggedIn, middleware.playlist.read(), (req, res) => {
  res.render('user', {
    user: req.user,
    userProfile: JSON.stringify(req.user, null, '  '),
    playlist: res.locals.playlist || {},
    playlistArray: JSON.stringify(res.locals.playlist) || {},
    results: []
  });
});

router.post('/searchSpotify', (req, res) => {
  var searchTerms = req.body.searchTerms;
  spotifyApi
    .clientCredentialsGrant()
    .then(
      function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
      },
      function(err) {
        // eslint-disable-next-line no-console
        console.log('Something went wrong!', err);
      }
    )
    .then(function() {
      let results = [];
      return spotifyApi.searchTracks(searchTerms).then(
        function(data) {
          var i = 1;
          data.body.tracks.items.map(item => {
            results.push({
              pos: i++,
              name: encodeURIComponent(item.name),
              artist: item.artists.map(artist =>
                encodeURIComponent(artist.name)
              ),
              id: item.id,
              image: item.album.images[2].url,
              release_date: item.album.release_date
            });
          });
          return results;
        },
        function(err) {
          // eslint-disable-next-line no-console
          console.log('Something went wrong', err);
        }
      );
    })
    .then(function(results) {
      res.json({
        success: 'Updated Successfully',
        results: results,
        status: 200
      });
    })
    // eslint-disable-next-line no-console
    .catch(err => console.log(err));
});

router.post(
  '/savePlaylist',
  middleware.getAuth0Info.getAuth0Info(),
  middleware.playlist.save(),
  (req, res) => {
    res.json({ success: 'Updated Successfully', status: 200 });
  }
);

module.exports = router;
