/**
 * Expose middleware.
 */
const playlist = require('./playlist');
const getAuth0Info = require('./getAuth0Info');
const middleware = {
  playlist,
  getAuth0Info
};
module.exports = { middleware };
