import { expect, type Page } from '@playwright/test';

export async function login(page: Page) {
    await page.goto('/login');
    await page.getByPlaceholder('johndoe@email.tld').fill('testing@izmichael.com');
    await page.getByPlaceholder('********').fill('playwright1');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL('/app');

    await page.goto('/app');
    expect(await page.textContent('h1')).toBe('Welcome Back, Playwright');
    await expect(page.getByText('Workspace Statistics')).toBeVisible();

    return true;
}
