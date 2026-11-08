import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

type Messages = {
  methodology: { title: string; rules: { title: string }; neutrality: { title: string }; inclusion: { title: string }; noVersion: string; report: { cta: string } };
};
type Main = { themes: { label: string }[]; candidates: { id: string; name: string }[] };

const fr = JSON.parse(readFileSync(join(__dirname, '../src/i18n/messages/fr.json'), 'utf8')) as Messages;
const registry = JSON.parse(readFileSync(join(__dirname, '../public/data/versions.json'), 'utf8')) as { current: number };
const main: Main | null =
  registry.current > 0 ? (JSON.parse(readFileSync(join(__dirname, `../public/data/versions/${registry.current}/main.json`), 'utf8')) as Main) : null;

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

test.describe('page Méthodologie (FR-042 à FR-045, SC-007)', () => {
  test('répond, porte les règles, sans requête tierce ni cookie', async ({ page, context }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      if (!LOCAL_HOSTS.has(new URL(request.url()).hostname)) external.push(request.url());
    });
    const response = await page.goto('/methodologie');
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(fr.methodology.title);
    await expect(page.getByRole('heading', { level: 2, name: fr.methodology.rules.title })).toBeVisible();
    if (main) {
      await expect(page.getByRole('heading', { level: 2, name: fr.methodology.neutrality.title })).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: fr.methodology.inclusion.title })).toBeVisible();
      await expect(page.getByRole('link', { name: fr.methodology.report.cta })).toHaveAttribute('href', /^https:\/\/github\.com\/.+\/issues\/new/);
    } else {
      await expect(page.getByText(fr.methodology.noVersion)).toBeVisible();
    }
    expect(external, 'aucune requête hors localhost').toEqual([]);
    expect(await context.cookies(), 'aucun cookie').toEqual([]);
  });

  test('accessible depuis le pied de page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Méthodologie' }).click();
    await expect(page).toHaveURL(/\/methodologie$/);
  });

  test('thèmes dans l’ordre canonique et parcours en deux actions vers une source', async ({ page }) => {
    test.skip(!main, 'aucune version publiée');
    await page.goto('/methodologie');
    const themes = page.locator('section[aria-labelledby="themes"] ol > li div.font-medium');
    await expect(themes).toHaveText(main!.themes.map((t) => t.label));
    const first = main!.candidates[0]!;
    await page.getByRole('link', { name: new RegExp(first.name) }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(first.name);
    const source = page.locator('ul li a[target="_blank"][href^="http"]').first();
    await expect(source).toBeVisible();
  });
});
