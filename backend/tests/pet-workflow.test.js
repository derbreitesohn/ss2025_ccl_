const { before, after, beforeEach, test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
process.env.ACCESS_TOKEN_SECRET = 'isolated-pet-test-secret';
const databasePath = require.resolve('../services/database');
require.cache[databasePath] = { id: databasePath, filename: databasePath, loaded: true, exports: { config: { query() { throw new Error('No real database allowed'); } } } };
const petModel = require('../models/petModel');
const listingModel = require('../models/listingModel');
let pets, listings;
petModel.getPets = async () => pets;
petModel.getPet = async id => pets.find(pet => String(pet.id) === String(id)) || Promise.reject(new Error('Error 404: Pet not found'));
petModel.savePet = async pet => { const saved = { ...pet, id: 20 }; pets.push(saved); return saved; };
petModel.updatePet = async pet => { const saved = pets.find(item => String(item.id) === String(pet.id)); Object.assign(saved, pet); return saved; };
petModel.deletePet = async id => { pets = pets.filter(pet => String(pet.id) !== String(id)); };
listingModel.getListings = async () => listings;
listingModel.getListing = async id => listings.find(listing => String(listing.id) === String(id)) || Promise.reject(new Error('Error 404: Listing not found'));
listingModel.saveListing = async listing => { const saved = { ...listing, id: 30 }; listings.push(saved); return saved; };
listingModel.updateListing = async listing => { const saved = listings.find(item => String(item.id) === String(listing.id)); Object.assign(saved, listing); return saved; };
listingModel.deleteListing = async id => { listings = listings.filter(listing => String(listing.id) !== String(id)); };
const app = express();
app.use(express.json(), cookieParser());
app.use('/api/pets', require('../routes/pets'));
app.use('/api/listings', require('../routes/listings'));
app.use((err, req, res, next) => res.status(500).json({ error: 'Test save failure' }));
let server, base;
const cookie = 'accessToken=' + jwt.sign({ id: 42 }, process.env.ACCESS_TOKEN_SECRET);
const post = (path, body = {}, loggedIn = true) => fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(loggedIn ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) });
before(async () => {
    server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
    base = `http://127.0.0.1:${server.address().port}/api`;
});
after(() => new Promise(resolve => server.close(resolve)));
beforeEach(() => {
    pets = [{ id: 7, user_id: 42, name: 'Poppy', about: 'Likes walks.', pet_picture: 'https://example.test/poppy.jpg' }, { id: 8, user_id: 99, name: 'Other pet' }];
    listings = [{ id: 9, user_id: 42, pet_id: 7, pet_name: 'Poppy' }, { id: 10, user_id: 99, pet_id: 8, pet_name: 'Other pet' }];
});

test('creating pets and listings requires login', async () => {
    assert.equal((await post('/pets/add', {}, false)).status, 401);
    assert.equal((await post('/listings/add', {}, false)).status, 401);
});

test('pet creation retains the photo and description and uses the session owner', async () => {
    const response = await post('/pets/add', { name: 'Poppy Rose', animal: 'Dog', about: 'Loves walks.', pet_picture: 'https://example.test/photo.jpg', user_id: 99 });
    assert.equal(response.status, 200);
    const { pet } = await response.json();
    assert.equal(pet.user_id, 42);
    assert.equal(pet.animal, 'dog');
    assert.equal(pet.about, 'Loves walks.');
    assert.equal(pet.pet_picture, 'https://example.test/photo.jpg');
    assert.equal((await post('/pets/add', { name: '', animal: 'dog' })).status, 400);
});

test('a listing links to the selected owned pet and supports a standalone listing', async () => {
    const linked = await post('/listings/add', { pet_id: 7, pet_name: 'Poppy', animal: 'Dog', listing_type: 'playdate', user_id: 99 });
    assert.equal(linked.status, 200);
    assert.equal((await linked.json()).listing.user_id, 42);
    assert.equal(listings.at(-1).pet_id, 7);
    const standalone = await post('/listings/add', { pet_name: 'Another pet', animal: 'cat', listing_type: 'adoption' });
    assert.equal(standalone.status, 200);
    assert.equal((await standalone.json()).listing.pet_id, null);
});

test('a listing cannot link to another owner’s pet or a missing pet', async () => {
    const values = { pet_name: 'Poppy', animal: 'dog', listing_type: 'playdate' };
    assert.equal((await post('/listings/add', { ...values, pet_id: 8 })).status, 403);
    assert.equal((await post('/listings/add', { ...values, pet_id: 999 })).status, 404);
    assert.equal((await post('/listings/add', { ...values, pet_id: 'bad' })).status, 400);
});

test('updates use the route ID and preserve ownership and the listing relationship', async () => {
    assert.equal((await post('/pets/7', { name: 'Poppy Rose', id: 8, user_id: 99 })).status, 200);
    assert.equal(pets[0].name, 'Poppy Rose');
    assert.equal(String(pets[0].id), '7');
    assert.equal(pets[0].user_id, 42);
    assert.equal((await post('/listings/9', { pet_name: 'Poppy Rose', pet_id: 8, id: 10, user_id: 99 })).status, 200);
    assert.equal(listings[0].pet_name, 'Poppy Rose');
    assert.equal(listings[0].pet_id, 7);
    assert.equal(listings[0].user_id, 42);
});

test('editing and deleting another account’s pets or listings is rejected', async () => {
    assert.equal((await post('/pets/8', { name: 'Changed' })).status, 403);
    assert.equal((await post('/pets/8/delete')).status, 403);
    assert.equal((await post('/listings/10', { pet_name: 'Changed' })).status, 403);
    assert.equal((await post('/listings/10/delete')).status, 403);
    assert.equal(pets[1].name, 'Other pet');
});

test('own pets can be deleted and account pet lists exclude other owners', async () => {
    const response = await fetch(base + '/pets', { headers: { Cookie: cookie } });
    assert.deepEqual((await response.json()).map(pet => pet.id), [7]);
    assert.equal((await post('/pets/7/delete')).status, 200);
    assert.equal(pets.some(pet => pet.id === 7), false);
});
