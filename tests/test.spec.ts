import { expect, test, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.afterEach(async ({ page }) => {
    await page.close();
});

test('Users can log in', async ({ page }) => {
    await login(page);
});

test('Task Page loads in under 3 seconds', async ({ page }) => {
    await login(page);

    await page.goto('/app');
    expect(await page.textContent('h1')).toBe('Traq App');
    const start = new Date().getTime();
    await page.locator('#sidebar button:nth-child(2)').click();
    await expect(page.getByText('My Tasks')).toBeVisible();
    const end = new Date().getTime();
    expect(end - start).toBeLessThan(3000);
});

test('Tasks are ordered from least to most progress', async ({ page }) => {
    await login(page);

    await page.goto('/app');
    expect(await page.textContent('h1')).toBe('Traq App');
    await page.locator('#sidebar button:nth-child(2)').click();
    await expect(page.getByText('My Tasks')).toBeVisible();

    await expect(page.locator('#tasks > div:nth-child(1) > button:nth-child(2) > h4:nth-child(1)')).toHaveText(
        'Vacuum Living Room'
    );
    await expect(page.locator('#tasks > div:nth-child(2) > button:nth-child(2) > h4:nth-child(1)')).toHaveText(
        'Book new recycling collection day'
    );
    await expect(page.locator('#tasks > div:nth-child(3) > button:nth-child(2) > h4:nth-child(1)')).toHaveText(
        'Buy new coffee table'
    );
});

async function login(page: Page) {
    await page.goto('/login');
    await page.getByPlaceholder('johndoe@email.tld').fill('testing@izmichael.com');
    await page.getByPlaceholder('********').fill('playwright1');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL('/app');
}
