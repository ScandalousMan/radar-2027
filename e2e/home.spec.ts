import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

type Messages = { common: { siteName: string; skipToContent: string; appearance: { toggle: string } }; home: { title: string } };

const fr = JSON.parse(readFileSync(join(__dirname, '../src/i18n/messages/fr.json'), 'utf8')) as Messages;

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

test.describe('page d’accueil (export statique)', () => {
  test('s’affiche en français, titre issu de fr.json, sans requête tierce ni cookie', async ({ page, context }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      const { hostname } = new URL(request.url());
      if (!LOCAL_HOSTS.has(hostname)) external.push(request.url());
    });

    const response = await page.goto('/');
    expect(response?.ok()).toBe(true);

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(fr.home.title);
    await expect(page).toHaveTitle(fr.common.siteName);

    expect(external, 'aucune requête hors localhost').toEqual([]);
    expect(await context.cookies(), 'aucun cookie').toEqual([]);
  });

  test('le lien « aller au contenu » est le premier élément focalisable', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: fr.common.skipToContent })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#contenu')).toBeFocused();
  });

  test('la bascule d’apparence s’applique sans clignotement et se mémorise localement', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.getByRole('button', { name: fr.common.appearance.toggle }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(await page.evaluate(() => window.localStorage.getItem('radar-appearance'))).toBe('light');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
