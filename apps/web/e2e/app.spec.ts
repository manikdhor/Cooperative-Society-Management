import { test, expect } from '@playwright/test';

test.describe('Cooperative Society Management App', () => {
  test('should display the application title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Cooperative Society Management');
  });

  test('should display welcome message', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h2')).toHaveText('Welcome');
    await expect(page.getByText('Manage your cooperative society efficiently')).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('page should be accessible', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toBe('Cooperative Society Management');
  });
});
