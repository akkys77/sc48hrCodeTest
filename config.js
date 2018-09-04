// Define app configuration in a single location, but pull in values from
// system environment variables (so we don't check them in to source control!)
// ESLint ignore instruction as process is defined by dotenv.
/* eslint no-undef: 0 */ // --> OFF

const dotenv = require('dotenv');
dotenv.config();

const config = {
  // 3 options development, testing or production
  env: process.env.NODE_ENV,
  // The port your web application will run on
  port: process.env.PORT || 3000,

  //Spotify
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  // Auth0
  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0Client: process.env.AUTH0_CLIENT_ID,
  auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
  auth0CallbackUrl: process.env.NODE_ENV==='development'?'http://localhost:3000/callback':process.env.AUTH0_CALLBACK_URL,
  auth0Redirect:process.env.NODE_ENV === 'development'?'http://localhost:3000':process.env.AUTH0_REDIRECT,
  auth0AdminClient: process.env.AUTH0_ADMIN_CLIENT_ID,
  auth0AdminClientSecret: process.env.AUTH0_ADMIN_CLIENT_SECRET,
  auth0AdminCallbackUrl: process.env.NODE_ENV==='development'?'http://localhost:3000/admin/callback':process.env.AUTH0_ADMIN_CALLBACK_URL,
  auth0AdminRedirect: process.env.NODE_ENV === 'development'?'http://localhost:3000/admin':process.env.AUTH0_ADMIN_REDIRECT,
};
module.exports = { config };
