/**
 * Expose middleware.
 */
const permit = require('./ensureAdmin');
const playlist = require('./playlist');
const getAuth0Info = require('./getAuth0Info');
const middleware = {
  permit,
  playlist,
  getAuth0Info
};
// console.log(middleware);
module.exports = { middleware };
