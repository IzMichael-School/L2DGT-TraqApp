import { expect, test, type Page } from '@playwright/test';

test('Task Page loads in under 3 seconds', async ({ page }) => {
    await login(page);

    await page.goto('/app');
    expect(await page.textContent('h1')).toBe('Traq App');
    const start = new Date().getTime();
    await page.locator('#sidebar button:nth-child(2)').click();
    await expect(page.getByText('My Tasks')).toBeVisible();
    const end = new Date().getTime();
    expect(end - start).toBeLessThan(1000);
    await page.close();
});

async function login(page: Page) {
    await page.goto('/login');
    await page.getByPlaceholder('johndoe@email.tld').fill('testing@izmichael.com');
    await page.getByPlaceholder('********').fill('playwright1');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL('/app');
}
