// Catch-all twin of api/index.js.
//
// api/index.js only answers the bare /api. This file takes everything deeper -
// /api/users/login, /api/listings/7, /api/messages - and Vercel's catch-all
// routing hands the function the original path on req.url, so Express matches
// its own /api/... mounts without a rewrite translating anything first.
module.exports = require('./index.js');
