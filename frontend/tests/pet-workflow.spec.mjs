import { test, expect } from '@playwright/test';

const account = { id: 42, username: 'patpal', name: 'Pat Pal', location: 'Vienna', profile_picture: '/images/demo-cat.jpg' };
const originalPet = { id: 7, user_id: 42, name: 'Poppy', animal: 'dog', pet_type: 'playdate', breed: 'Labrador', age: 2, gender: 'Female', weight: 12.5, color: 'Black', location: 'Vienna', about: 'Loves a long walk.', pet_picture: 'http://127.0.0.1:5173/images/demo-dog.jpg' };
const originalListing = { id: 9, user_id: 42, pet_id: 7, pet_name: 'Poppy', animal: 'dog', listing_type: 'playdate', breed: 'Labrador', age: 2, gender: 'Female', weight: 12.5, color: 'Black', location: 'Vienna', about: 'Loves a long walk.', photo_url: originalPet.pet_picture };

async function setup(page, { initialPets = [], initialListings = [], failCreate = false } = {}) {
    const data = { pets: structuredClone(initialPets), listings: structuredClone(initialListings), writes: [], failCreate };
    await page.route('**/api/**', async route => {
        const req = route.request();
        const path = new URL(req.url()).pathname.replace('/api', '');
        if (req.method() !== 'GET') data.writes.push({ path, body: req.postDataJSON() });
        const reply = json => route.fulfill({ json });
        if (path === '/users/me') return reply(account);
        if (path === '/pets' && req.method() === 'GET') return reply(data.pets);
        if (path === '/listings' || path === '/listings/mine') return reply({ listings: data.listings });
        if (path === '/favorites') return reply({ favorites: [] });
        for (const [collection, values] of [['pets', data.pets], ['listings', data.listings]]) {
            if (path === `/${collection}/add`) {
                if (data.failCreate) return route.fulfill({ status: 503, json: { error: 'Temporary test failure' } });
                const item = { ...req.postDataJSON(), id: values.length + 20 };
                values.push(item);
                return reply({ register: 'DONE' });
            }
            const match = path.match(new RegExp(`^/${collection}/(\\d+)(/delete)?$`));
            if (match) {
                const item = values.find(item => String(item.id) === match[1]);
                if (!item) return route.fulfill({ status: 404, json: { error: 'Missing' } });
                if (req.method() === 'POST') {
                    if (match[2]) values.splice(values.indexOf(item), 1);
                    else Object.assign(item, req.postDataJSON());
                }
                return reply(collection === 'pets' ? item : { listing: item });
            }
        }
        return route.fulfill({ status: 404, json: { error: 'Unexpected test request' } });
    });
    return data;
}

async function fillPet(page) {
    await page.getByLabel('Name:', { exact: true }).fill('Poppy');
    await page.getByLabel('Pet Type:', { exact: true }).selectOption('playdate');
    await page.getByLabel('Animal:', { exact: true }).selectOption('dog');
    for (const [label, value] of [['Breed:', 'Labrador'], ['Age:', '2'], ['Gender:', 'Female'], ['Weight (kg):', '12.5'], ['Color:', 'Black'], ['Location:', 'Vienna'], ['Image URL:', originalPet.pet_picture], ['Description:', 'Loves a long walk.']]) {
        await page.getByLabel(label, { exact: true }).fill(value);
    }
}

test('creating a pet preserves its description and photo, then creates a linked listing', async ({ page }) => {
    const data = await setup(page);
    await page.goto('/add-pet');
    await fillPet(page);
    await page.getByRole('button', { name: 'Add Pet', exact: true }).click();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole('heading', { name: 'Poppy', exact: true })).toBeVisible();
    expect(data.pets[0]).toMatchObject({ about: 'Loves a long walk.', pet_picture: originalPet.pet_picture, user_id: 42 });
    expect(data.pets[0]).not.toHaveProperty('description');
    expect(data.pets[0]).not.toHaveProperty('image_url');

    await page.goto('/add-listing');
    await page.getByRole('button', { name: 'Use Poppy for this listing' }).click();
    await expect(page.getByLabel('About:', { exact: true })).toHaveValue('Loves a long walk.');
    await expect(page.getByLabel('Photo URL:', { exact: true })).toHaveValue(originalPet.pet_picture);
    await page.getByRole('button', { name: 'Create Listing', exact: true }).click();
    await expect(page).toHaveURL(/\/listings$/);
    expect(data.listings[0].pet_id).toBe(data.pets[0].id);
    await page.goto(`/listings/${data.listings[0].id}`);
    await expect(page.getByRole('heading', { name: 'Meet Poppy.' })).toBeVisible();
    await expect(page.getByText('Loves a long walk.', { exact: true })).toBeVisible();
});

test('renaming a pet updates only listings linked by its ID', async ({ page }) => {
    const unrelated = { ...originalListing, id: 10, pet_id: 88 };
    const data = await setup(page, { initialPets: [originalPet], initialListings: [originalListing, unrelated] });
    await page.goto('/edit-pet/7');
    await expect(page.getByLabel('Description:', { exact: true })).toHaveValue(originalPet.about);
    await page.getByLabel('Name:', { exact: true }).fill('Poppy Rose');
    await page.getByLabel('Description:', { exact: true }).fill('A new description.');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page).toHaveURL(/\/pets\/7$/);
    expect(data.pets[0].name).toBe('Poppy Rose');
    expect(data.listings[0]).toMatchObject({ pet_name: 'Poppy Rose', about: 'A new description.', pet_id: 7 });
    expect(data.listings[1].pet_name).toBe('Poppy');
    expect(data.writes.map(write => write.path)).toEqual(['/pets/7', '/listings/9']);
});

test('editing a listing updates the correct pet, including the photo and description', async ({ page }) => {
    const data = await setup(page, { initialPets: [{ ...originalPet, id: 8 }, originalPet], initialListings: [originalListing] });
    await page.goto('/listings/9/edit');
    await page.getByLabel('Pet Name:', { exact: true }).fill('Poppy Rose');
    await page.getByLabel('About:', { exact: true }).fill('Ready for a playdate.');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page).toHaveURL(/\/listings\/9$/);
    expect(data.pets.find(pet => pet.id === 7)).toMatchObject({ name: 'Poppy Rose', about: 'Ready for a playdate.', pet_picture: originalPet.pet_picture });
    expect(data.pets.find(pet => pet.id === 8).name).toBe('Poppy');
    expect(data.writes.map(write => write.path)).toEqual(['/listings/9', '/pets/7']);
});

test('a standalone listing does not alter a similar pet', async ({ page }) => {
    const data = await setup(page, { initialPets: [originalPet], initialListings: [{ ...originalListing, pet_id: null }] });
    await page.goto('/listings/9/edit');
    await page.getByLabel('Pet Name:', { exact: true }).fill('Another pet');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page).toHaveURL(/\/listings\/9$/);
    expect(data.pets[0].name).toBe('Poppy');
    expect(data.writes.map(write => write.path)).toEqual(['/listings/9']);
});

test('failed pet creation keeps entered values and allows a retry', async ({ page }) => {
    const data = await setup(page, { failCreate: true });
    await page.goto('/add-pet');
    await fillPet(page);
    await page.getByRole('button', { name: 'Add Pet', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('Failed to add pet');
    await expect(page.getByLabel('Description:', { exact: true })).toHaveValue('Loves a long walk.');
    expect(data.pets).toHaveLength(0);
    data.failCreate = false;
    await page.getByRole('button', { name: 'Add Pet', exact: true }).click();
    await expect(page).toHaveURL(/\/profile$/);
    expect(data.pets).toHaveLength(1);
});

test('failed listing creation preserves the form and selected pet for a retry', async ({ page }) => {
    const data = await setup(page, { initialPets: [originalPet], failCreate: true });
    await page.goto('/add-listing');
    await page.getByRole('button', { name: 'Use Poppy for this listing' }).click();
    await page.getByRole('button', { name: 'Create Listing', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('Your details are still here');
    await expect(page.getByLabel('Pet Name:', { exact: true })).toHaveValue('Poppy');
    data.failCreate = false;
    await page.getByRole('button', { name: 'Create Listing', exact: true }).click();
    await expect(page).toHaveURL(/\/listings$/);
    expect(data.listings[0].pet_id).toBe(7);
});

test('pet deletion requires confirmation and removes the pet from the profile', async ({ page }) => {
    const data = await setup(page, { initialPets: [originalPet] });
    await page.goto('/pets/7');
    page.once('dialog', dialog => dialog.dismiss());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    expect(data.pets).toHaveLength(1);
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page).toHaveURL(/\/profile$/);
    expect(data.pets).toHaveLength(0);
});
