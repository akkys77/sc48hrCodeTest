var SpotifyWebApi = require("spotify-web-api-node");

// Spotify Wrapper documentation
// http://michaelthelin.se/spotify-web-api-node/

//  Search API documentation
//  https://developer.spotify.com/web-api/search-item/

//  Please note that this endpoint does not require authentication. However, using an access token
//  when making requests will give your application a higher rate limit.

var spotifyApi = new SpotifyWebApi({
  clientId: "ebc7a632b02846e49ae54d902265da3a",
  clientSecret: "4eb7860bea054fb2a6c3f66ff6a8584b"
});

var results = [];

var searchSong = function(searchTerms) {
  // Get an access token and 'save' it using a setter
  spotifyApi
    .clientCredentialsGrant()
    .then(
      function(data) {
        console.log("The access token is " + data.body["access_token"]);
        spotifyApi.setAccessToken(data.body["access_token"]);
      },
      function(err) {
        console.log("Something went wrong!", err);
      }
    )
    .then(function() {
      return spotifyApi.searchTracks(searchTerms).then(
        function(data) {
          // console.log(JSON.stringify(data.body));
          var i = 1;
          data.body.tracks.items.map(item => {
            results.push({
              pos: i++,
              name: item.name,
              artist: item.artists.map(artist => artist.name),
              id: item.id,
              image: item.album.images[2].url,
              release_date: item.album.release_date
            });
          });
          console.log(results);
          // console.log(JSON.stringify(data.body));
        },
        function(err) {
          console.log("Something went wrong", err);
        }
      );
    })
    .catch(err => console.log(err));
};
// console.log(searchSong);

