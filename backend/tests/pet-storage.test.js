const { test } = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql2');
let sql, fail = false;
const databasePath = require.resolve('../services/database');
require.cache[databasePath] = { id: databasePath, filename: databasePath, loaded: true, exports: { config: {
    escape: mysql.escape,
    query(statement, callback) { sql = statement; callback(fail ? new Error('Unavailable') : null, fail ? undefined : { insertId: 20, affectedRows: 1 }); },
} } };
const petModel = require('../models/petModel');
const listingModel = require('../models/listingModel');

test('pet writes include the description and photo in the actual SQL column contract', async () => {
    const pet = { id: 7, user_id: 42, name: 'Poppy', animal: 'dog', about: "Poppy's favorite walk", pet_picture: 'https://example.test/poppy.jpg' };
    const created = await petModel.savePet(pet);
    assert.equal(created.id, 20);
    assert.ok(sql.includes('about, pet_picture'));
    assert.ok(sql.includes(mysql.escape(pet.about)));
    assert.ok(sql.includes(mysql.escape(pet.pet_picture)));
    await petModel.updatePet(pet);
    assert.ok(sql.includes('about = ' + mysql.escape(pet.about)));
    assert.ok(sql.includes('pet_picture = ' + mysql.escape(pet.pet_picture)));
});

test('listing SQL includes the stable pet ID', async () => {
    const listing = { pet_id: 7, pet_name: 'Poppy', about: 'A walking buddy.', photo_url: 'https://example.test/poppy.jpg' };
    await listingModel.saveListing(listing);
    assert.ok(sql.includes('user_id, pet_id, pet_name'));
    assert.ok(sql.includes("NULL,7,'Poppy'"));
});

test('failed pet updates reject cleanly instead of accessing a missing database result', async () => {
    fail = true;
    await assert.rejects(petModel.updatePet({ id: 7 }), /Unavailable/);
    fail = false;
});
