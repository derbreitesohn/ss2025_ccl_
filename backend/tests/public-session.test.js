const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

// Exercise the real HTTP routes and JWT cookies without contacting a database.
process.env.ACCESS_TOKEN_SECRET = 'isolated-session-test-secret';
const databasePath = require.resolve('../services/database');
require.cache[databasePath] = {
    id: databasePath, filename: databasePath, loaded: true,
    exports: { config: { query() { throw new Error('Database access is not allowed in this test'); } } },
};
const userModel = require('../models/userModel');
const listingModel = require('../models/listingModel');
const listing = { id: 1, user_id: 12, pet_name: 'Fee', listing_type: 'playdate' };
const account = { id: 42, name: 'Pat Pal', username: 'session-test' };
userModel.getUsers = async () => [account];
userModel.getUser = async () => ({ id: account.id, name: account.name });
listingModel.getListings = async () => [listing];
listingModel.getListing = async () => listing;
const app = express();
app.use(express.json(), cookieParser());
app.use('/api', require('../routes/index'));
app.use('/api/users', require('../routes/users'));
app.use('/api/listings', require('../routes/listings'));
app.use('/api/favorites', require('../routes/favorites'));
let server;
let base;

before(async () => {
    account.password = await bcrypt.hash('test-password-only', 4);
    server = await new Promise(resolve => {
        const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
    });
    base = `http://127.0.0.1:${server.address().port}/api`;
});
after(() => new Promise(resolve => server.close(resolve)));

test('listing browsing and details are public HTTP endpoints', async () => {
    const browse = await fetch(base + '/listings');
    assert.equal(browse.status, 200);
    assert.deepEqual(await browse.json(), { listings: [listing] });
    const detail = await fetch(base + '/listings/1');
    assert.equal(detail.status, 200);
    assert.deepEqual(await detail.json(), { listing });
});

test('account and favorites require a session', async () => {
    assert.equal((await fetch(base + '/users/me')).status, 401);
    assert.equal((await fetch(base + '/favorites')).status, 401);
    assert.equal((await fetch(base + '/listings/mine')).status, 401);
});

test('login creates a usable cookie and logout expires that cookie', async () => {
    const login = await fetch(base + '/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: account.username, password: 'test-password-only' }),
    });
    assert.deepEqual(await login.json(), { Login: 'success' });
    const setCookie = login.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/);
    assert.match(setCookie, /SameSite=Lax/);
    const cookie = setCookie.split(';')[0];
    const session = await fetch(base + '/users/me', { headers: { Cookie: cookie } });
    assert.equal(session.status, 200);
    assert.equal((await session.json()).id, 42);

    const logout = await fetch(base + '/logout', { method: 'POST', headers: { Cookie: cookie } });
    assert.equal(logout.status, 204);
    const expiredCookie = logout.headers.get('set-cookie');
    assert.match(expiredCookie, /^accessToken=;/);
    assert.match(expiredCookie, /Path=\//);
    assert.match(expiredCookie, /Expires=Thu, 01 Jan 1970/);
    const afterLogout = await fetch(base + '/users/me', { headers: { Cookie: expiredCookie.split(';')[0] } });
    assert.equal(afterLogout.status, 401);
});

test('a rejected password does not establish a session', async () => {
    const login = await fetch(base + '/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: account.username, password: 'wrong-password' }),
    });
    assert.deepEqual(await login.json(), { Login: 'Fail' });
    assert.match(login.headers.get('set-cookie'), /^accessToken=;/);
});
