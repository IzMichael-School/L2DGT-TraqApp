import { expect, test } from '@playwright/test';
import { login } from './library.ts';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.afterEach(async ({ page }) => {
    await page.close();
});

test('Users can log in', async ({ page }) => {
    await login(page);
});

test('Tasks Page loads in under 2 seconds', async ({ page }) => {
    await login(page);

    const start = new Date().getTime();
    await page.locator('#sidebar button:nth-child(2)').click();
    await expect(page.getByText('My Tasks')).toBeVisible();
    const end = new Date().getTime();
    expect(end - start).toBeLessThan(2000);
});

test('Habits Page loads in under 2 seconds', async ({ page }) => {
    await login(page);

    const start = new Date().getTime();
    await page.locator('#sidebar button:nth-child(3)').click();
    await expect(page.getByText('My Habits')).toBeVisible();
    const end = new Date().getTime();
    expect(end - start).toBeLessThan(2000);
});
