import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

type Messages = {
  methodology: { title: string; rules: { title: string }; neutrality: { title: string }; inclusion: { title: string }; noVersion: string; report: { cta: string } };
};
type Main = { selectionRules?: number; minQuestionCoverage?: number; questions: unknown[]; themes: { label: string }[]; candidates: { id: string; name: string }[] };

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

  test('calcul des résultats : formules, bandes et exemples A et B du cœur (005)', async ({ page }) => {
    await page.goto('/methodologie#calcul');
    const section = page.locator('#calcul');
    await expect(section.getByRole('heading', { level: 2, name: 'Calcul des résultats' })).toBeVisible();
    await expect(section).toContainText('très aligné');
    await expect(section).toContainText(/Économie 62\s%.*score global 62\s%.*couverture 75\s%/);
    await expect(section).toContainText(/Score pondéré 70\s%, score sur les sujets clés 50\s%, score global 50\s%/);
  });

  test('couverture : questions renseignées en priorité, minimum k de la banque active (009)', async ({ page }) => {
    test.skip(main?.selectionRules !== 3, 'la version courante ne suit pas les règles de sélection 3');
    await page.goto('/methodologie');
    const section = page.locator('#couverture');
    await expect(section.getByRole('heading', { level: 2, name: 'Questions renseignées en priorité' })).toBeVisible();
    await expect(section.getByTestId('coverage-bank')).toContainText(`Cette version retient ${main!.questions.length} questions`);
    await expect(section.getByTestId('coverage-bank')).toContainText(`au moins ${main!.minQuestionCoverage} candidat`);
    await expect(section).toContainText('pistes de recherche');
    await expect(page.locator('#choix-questions')).toContainText('celles pour lesquelles la position du plus grand nombre de candidats est connue');
  });

  test('choix des questions : une question par enjeu, plancher par thème (007)', async ({ page }) => {
    test.skip(main?.selectionRules === undefined, 'la version courante suit les règles de sélection 1');
    await page.goto('/methodologie');
    const section = page.locator('#choix-questions');
    await expect(section.getByRole('heading', { level: 2, name: 'Choix des questions' })).toBeVisible();
    await expect(section).toContainText('jamais deux questions du même enjeu');
    await expect(section).toContainText('au moins 1 question en mode court et 3 questions en mode complet');
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
