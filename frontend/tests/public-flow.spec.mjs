import { test, expect } from '@playwright/test';

const pets = [
    { id: 1, user_id: 12, pet_name: 'Fee', animal: 'dog', breed: 'Labrador', age: '5 years', gender: 'Female', weight: '28 kg', color: 'Black', location: 'St. Pölten', listing_type: 'playdate', photo_url: '/images/demo-dog.jpg', about: 'A friendly walking companion.' },
    { id: 2, user_id: 13, pet_name: 'Milo', animal: 'cat', breed: 'Shorthair', age: '2 years', location: 'Vienna', listing_type: 'adoption', photo_url: '/images/demo-cat.jpg' },
];
const member = { id: 42, username: 'patpal', name: 'Pat Pal', email: 'pat@example.test', location: 'Vienna', about: 'A pet lover.', profile_picture: '/images/demo-cat.jpg' };

async function mockApi(page, { loggedIn = false, listings = pets, status = 200, sessionStatus, own = false } = {}) {
    const writes = [];
    let signedIn = loggedIn;
    let favorites = [];
    await page.route('**/api/**', async route => {
        const request = route.request();
        const path = new URL(request.url()).pathname.replace('/api', '');
        if (request.method() !== 'GET') writes.push({ path, method: request.method(), body: request.postData() });
        if (path === '/users/me') return route.fulfill({ status: sessionStatus || (signedIn ? 200 : 401), json: signedIn ? member : { error: 'Not signed in' } });
        if (path === '/login') { signedIn = true; return route.fulfill({ json: { Login: 'success' } }); }
        if (path === '/logout') { signedIn = false; return route.fulfill({ status: 204 }); }
        if (path === '/register') return route.fulfill({ json: { register: 'DONE' } });
        if (path === '/listings') return route.fulfill({ status, json: { listings } });
        if (path === '/listings/mine') return route.fulfill({ json: { listings: [] } });
        if (path === '/listings/1') return route.fulfill({ json: { listing: { ...pets[0], user_id: own ? 42 : 12 } } });
        if (path.startsWith('/listings/')) return route.fulfill({ status: 404, json: { error: 'Missing listing' } });
        if (path === '/favorites') return route.fulfill({ json: { favorites } });
        if (path.startsWith('/favorites/')) {
            favorites = request.method() === 'DELETE' ? [] : [pets[0]];
            return route.fulfill({ json: { success: true } });
        }
        if (path === '/pets') return route.fulfill({ json: [] });
        if (path === '/messages/recent') return route.fulfill({ json: { chats: [] } });
        if (path.startsWith('/messages/history/')) return route.fulfill({ json: { history: [] } });
        return route.fulfill({ status: 404, json: { error: 'Unexpected API request' } });
    });
    await page.route('**/socket.io/**', route => route.abort());
    return writes;
}

test('a visitor can browse and open details without an account', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Little paws. Big connections.' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Log in/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Profile', exact: true })).toHaveCount(0);
    await expect(page.locator('.listing-card')).toHaveCount(2);
    await page.locator('.listing-card').first().getByRole('link', { name: 'View details' }).click();
    await expect(page).toHaveURL(/\/listings\/1$/);
    await expect(page.getByRole('heading', { name: 'Meet Fee.' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log in to say hello' })).toBeVisible();
});

test('filters combine, stay in the URL, and preserve browsing position', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    await page.getByRole('link', { name: 'Meet the pets', exact: true }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(400);
    await page.getByRole('button', { name: /Dogs/ }).click();
    await expect(page.locator('.listing-card')).toHaveCount(1);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(400);
    await page.getByRole('searchbox').fill('St. Pölten');
    await page.getByLabel('Listing type', { exact: true }).selectOption('playdate');
    await page.reload();
    await expect(page.locator('.listing-card')).toHaveCount(1);
    await page.locator('.listing-card').getByRole('link', { name: 'View details' }).click();
    await page.getByRole('link', { name: 'Back to the pets' }).click();
    await expect(page.getByRole('searchbox')).toHaveValue('St. Pölten');
    await expect(page.getByLabel('Listing type', { exact: true })).toHaveValue('playdate');
    await page.getByRole('searchbox').fill('no such pet');
    await expect(page.getByRole('heading', { name: 'No paws found just yet.' })).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.locator('.listing-card')).toHaveCount(2);
});

test('contact resumes the chosen conversation after login', async ({ page }) => {
    await mockApi(page);
    await page.goto('/listings/1');
    await page.getByRole('link', { name: 'Log in to say hello' }).click();
    await expect(page).toHaveURL(/\/login\?/);
    expect(new URL(page.url()).searchParams.get('next')).toBe('/messages?user=12');
    await page.getByLabel('Username', { exact: true }).fill('patpal');
    await page.getByLabel('Password', { exact: true }).fill('test-password');
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page).toHaveURL(/\/messages\?user=12$/);
    await expect(page.locator('.messages-header')).toHaveText('User 12');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeDisabled();
});

test('save requires login and returning does not silently save a pet', async ({ page }) => {
    const writes = await mockApi(page);
    await page.goto('/?animal=dog#browse');
    await page.getByRole('button', { name: 'Save Fee to favorites' }).click();
    await expect(page.getByText('Log in to keep your favorite companions close.')).toBeVisible();
    await page.getByLabel('Username', { exact: true }).fill('patpal');
    await page.getByLabel('Password', { exact: true }).fill('test-password');
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page).toHaveURL(/animal=dog#browse$/);
    expect(writes.filter(write => write.path.startsWith('/favorites/'))).toHaveLength(0);
    await page.getByRole('button', { name: 'Save Fee to favorites' }).click();
    await expect(page.getByRole('button', { name: 'Remove Fee from favorites' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Remove Fee from favorites' }).click();
    await expect(page.getByRole('button', { name: 'Save Fee to favorites' })).toHaveAttribute('aria-pressed', 'false');
});

test('registration keeps the destination and asks for login when the account is ready', async ({ page }) => {
    const writes = await mockApi(page);
    await page.goto('/login?next=%2Fmessages%3Fuser%3D12');
    await page.getByRole('link', { name: 'Create an account' }).click();
    await page.getByLabel('Name', { exact: true }).fill('Pat Pal');
    await page.getByLabel('Username', { exact: true }).fill('patpal');
    await page.getByLabel('Email', { exact: true }).fill('pat@example.test');
    await page.getByLabel('Password', { exact: true }).fill('test-password');
    await page.getByRole('button', { name: 'Create an account', exact: true }).click();
    await expect(page.getByText('Your account is ready. Log in to get started.')).toBeVisible();
    expect(new URL(page.url()).searchParams.get('next')).toBe('/messages?user=12');
    expect(writes.find(write => write.path === '/register')).toBeTruthy();
    await expect(page.getByRole('link', { name: 'Profile', exact: true })).toHaveCount(0);
});

test('logout ends the session and private routes return to login', async ({ page }) => {
    const writes = await mockApi(page, { loggedIn: true });
    await page.goto('/');
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page.getByRole('link', { name: /Log in/ })).toBeVisible();
    expect(writes).toContainEqual({ path: '/logout', method: 'POST', body: null });
    await page.goto('/favorites');
    await expect(page).toHaveURL(/\/login\?/);
});

test('own listing offers editing instead of a conversation with yourself', async ({ page }) => {
    await mockApi(page, { loggedIn: true, own: true });
    await page.goto('/listings/1');
    await expect(page.getByRole('link', { name: 'Edit listing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact owner' })).toHaveCount(0);
});

test('failed listings do not masquerade as an empty community or example pets', async ({ page }) => {
    await mockApi(page, { status: 503 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'The pets are taking a little break.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Little paws. Big connections.' })).toBeVisible();
    await expect(page.locator('.listing-card')).toHaveCount(0);
    await expect(page.getByText('Example pets to help you explore PatPat.')).toHaveCount(0);
});

test('empty data and missing details give a way forward', async ({ page }) => {
    await mockApi(page, { listings: [] });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Create the first listing' })).toBeVisible();
    await page.goto('/listings/missing');
    await expect(page.getByRole('heading', { name: 'This listing is no longer here.' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore other pets' })).toBeVisible();
});

test('session outage keeps public pages usable and offers retry on private pages', async ({ page }) => {
    await mockApi(page, { sessionStatus: 503 });
    await page.goto('/');
    await expect(page.locator('.listing-card')).toHaveCount(2);
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Let’s try that again' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Keep browsing' })).toBeVisible();
});

test('an external return URL cannot redirect a signed-in visitor', async ({ page }) => {
    await mockApi(page, { loggedIn: true });
    await page.goto('/login?next=https%3A%2F%2Fexample.com');
    await expect(page).toHaveURL('http://127.0.0.1:5173/');
});

test('image failure shows a useful placeholder', async ({ page }) => {
    await mockApi(page, { listings: [{ ...pets[0], photo_url: '/missing-pet-photo.jpg' }] });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Photo not available for Fee' })).toBeVisible();
});

test('mobile navigation opens and closes when a destination is chosen', async ({ page }) => {
    await mockApi(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Open menu' });
    await menu.click();
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('navigation').getByRole('link', { name: 'How it works' }).click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page).toHaveURL(/#how-it-works$/);
});

test('public and existing account screens fit a phone without horizontal scrolling', async ({ page }) => {
    await mockApi(page, { loggedIn: true });
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ['/', '/listings/1', '/profile', '/listings', '/favorites', '/add-pet', '/add-listing', '/messages']) {
        await page.goto(path);
        await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
        const ready = { '/': '.listing-card', '/listings/1': '.public-detail-card', '/profile': '.profile-header-card', '/listings': '.h1-mylistings', '/favorites': '.state-panel', '/add-pet': 'form', '/add-listing': '.card', '/messages': '.messages-container' };
        await page.locator(ready[path]).first().waitFor();
        const widths = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
        expect(widths.content, path).toBeLessThanOrEqual(widths.viewport);
    }
});

test('presentation mode has example pets and cannot write to the real API', async ({ page }) => {
    const requests = [];
    page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api')) requests.push(request.url()); });
    await page.goto('http://127.0.0.1:5174');
    await expect(page.locator('.listing-card')).toHaveCount(4);
    await expect(page.getByText('Example pets to help you explore PatPat.')).toBeVisible();
    await page.goto('http://127.0.0.1:5174/login');
    await page.getByLabel('Username', { exact: true }).fill('preview');
    await page.getByLabel('Password', { exact: true }).fill('preview-password');
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('Accounts aren’t available in this preview.');
    expect(requests).toHaveLength(0);
});

test('login and optional registration details fit a small phone', async ({ page }) => {
    await mockApi(page);
    await page.setViewportSize({ width: 320, height: 640 });
    for (const path of ['/', '/login', '/signup']) {
        await page.goto(path);
        if (path === '/') await expect(page.locator('.listing-card')).toHaveCount(2);
        else await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
        if (path === '/signup') await page.locator('summary').click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    }
});
