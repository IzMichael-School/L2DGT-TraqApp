import { expect, test } from '@playwright/test';
import { login } from './library.ts';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.afterEach(async ({ page }) => {
    await page.close();
});

test('Habits are ordered alphabetically', async ({ page }) => {
    await login(page);

    await page.locator('#sidebar button:nth-child(3)').click();
    await expect(page.getByText('My Habits')).toBeVisible();

    await expect(page.locator('#habits > div:nth-child(1) > button:first-child > h4:first-child')).toHaveText(
        'Exercise'
    );
    await expect(page.locator('#habits > div:nth-child(2) > button:first-child > h4:first-child')).toHaveText(
        'Medication (Evening)'
    );
    await expect(page.locator('#habits > div:nth-child(3) > button:first-child > h4:first-child')).toHaveText(
        'Medication (Morning)'
    );
    await expect(page.locator('#habits > div:nth-child(4) > button:first-child > h4:first-child')).toHaveText(
        'Wake at 7am'
    );
});

test('Habit progress is updated', async ({ page }) => {
    await login(page);

    await page.locator('#sidebar button:nth-child(3)').click();
    await expect(page.getByText('My Habits')).toBeVisible();

    // Increment to fully completed
    await page.locator('#habititem-EOSUt3G1onrnFRH > div:nth-child(2) > button.border-x-2.border-zinc-500').click();

    // Reset to not started
    await page.locator('#habititem-EOSUt3G1onrnFRH > div:nth-child(2) > button.border-x-2.border-zinc-500').click({
        button: 'right',
    });
});
