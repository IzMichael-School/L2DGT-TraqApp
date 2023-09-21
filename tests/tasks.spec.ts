import { expect, test } from '@playwright/test';
import { login } from './library.ts';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.afterEach(async ({ page }) => {
    await page.close();
});

test('Tasks are ordered from least to most progress', async ({ page }) => {
    await login(page);

    await page.locator('#sidebar button:nth-child(2)').click();
    await expect(page.getByText('My Tasks')).toBeVisible();

    await expect(
        page.locator(
            '#tasks-zLI4tfJMIQp0isY > div:nth-child(1) > div:first-child > button:nth-child(2) > h4:first-child'
        )
    ).toHaveText('Vacuum Living Room');
    await expect(
        page.locator(
            '#tasks-zLI4tfJMIQp0isY > div:nth-child(2) > div:first-child > button:nth-child(2) > h4:first-child'
        )
    ).toHaveText('Book new recycling collection day');
    await expect(
        page.locator(
            '#tasks-zLI4tfJMIQp0isY > div:nth-child(3) > div:first-child > button:nth-child(2) > h4:first-child'
        )
    ).toHaveText('Buy new coffee table');
});

test('Task progress is updated', async ({ page }) => {
    await login(page);

    await page.locator('#sidebar button:nth-child(2)').click();
    await expect(page.getByText('My Tasks')).toBeVisible();

    // Check if in first place
    await expect(
        page.locator(
            '#tasks-xDHyulmQ0FQprup > div:nth-child(1) > div:first-child > button:nth-child(2) > h4:first-child'
        )
    ).toHaveText('Review design for client #14');
    // Increment to in progress
    await page.locator('#taskitem-BW4yJP9uEuDaiHl > button:first-child').click();

    // Check if in second place
    await expect(
        page.locator(
            '#tasks-xDHyulmQ0FQprup > div:nth-child(2) > div:first-child > button:nth-child(2) > h4:first-child'
        )
    ).toHaveText('Review design for client #14');
    // Increment to fully completed
    await page.locator('#taskitem-BW4yJP9uEuDaiHl > button:first-child').click();

    // Check if in third place
    await expect(
        page.locator(
            '#tasks-xDHyulmQ0FQprup > div:nth-child(3) > div:first-child > button:nth-child(2) > h4:first-child'
        )
    ).toHaveText('Review design for client #14');

    // Reset task to not started
    await page.locator('#taskitem-BW4yJP9uEuDaiHl > button:first-child').click({
        button: 'right',
    });
    await page.locator('#taskitem-BW4yJP9uEuDaiHl > button:first-child').click({
        button: 'right',
    });
    // Check if in first place
    await expect(
        page.locator(
            '#tasks-xDHyulmQ0FQprup > div:nth-child(1) > div:first-child > button:nth-child(2) > h4:first-child'
        )
    ).toHaveText('Review design for client #14');
});
