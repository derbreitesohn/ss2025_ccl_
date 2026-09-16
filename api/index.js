// Vercel serverless entry point for the Express API.
//
// Vercel turns every file under /api into a function. This one hands the whole
// request to the existing Express app in backend/app.js, so the routes keep the
// exact shape they have locally: /api, /api/users, /api/pets, /api/listings,
// /api/favorites, /api/messages. Nothing about the routing moved.
//
// vercel.json rewrites every /api/* request here, and the original path arrives
// intact on req.url, which is what lets Express match its own /api mounts.
//
// Socket.IO is the one thing that does not survive the move: serverless
// functions cannot hold an open connection, so the realtime hop in Messages
// stays quiet on the deployed site. Messages still save and load over REST.
process.env.VERCEL = process.env.VERCEL || '1';

module.exports = require('../backend/app.js');
