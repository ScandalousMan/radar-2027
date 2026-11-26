// Termes définis (spec 009, contrat defined-term-ui.md § e2e) contre l'export statique, avec la
// banque fictive et un glossaire fictif servis par interception de route. Le terme « énoncé »
// figure dans chaque question de la banque fictive. L'accessibilité automatique (scénario 7) est
// couverte par les stories DefinedTerm et QuestionCard (addon a11y).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import type { Answer, Mode } from '../src/core/types';
import { expectedBoard, GLOSSARY, linkFor, msg, serveGlossary, servePublished, stateFor } from './fixtures/published';

const KEY = 'radar-questionnaire';
const THREE = ['t02', 't05', 't08'];
const TERM = GLOSSARY.terms[0]!;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const option = (page: Page, answer: Exclude<Answer, 'unanswered'>) => {
  const labels: Record<string, string> = { '1': msg('ui.likert.agree'), skipped: msg('ui.likert.skip') };
  return page.locator('label').filter({ hasText: new RegExp(`^${escape(labels[String(answer)]!)}$`) });
};
const progress = (page: Page, n: number) => page.getByText(new RegExp(`^${escape(msg('questionnaire.questions.progress', { n: 999, total: 888 })).replace('999', String(n)).replace('888', '\\d+')}$`)).first();
const term = (page: Page) => page.getByRole('heading', { level: 2 }).getByRole('button', { name: 'Énoncé' });
const bubble = (page: Page) => page.getByRole('dialog', { name: TERM.label });

async function startQuestionnaire(page: Page, mode: Mode = 'short') {
  await page.goto('/questionnaire');
  await expect(page.getByRole('heading', { level: 1, name: msg('questionnaire.themes.title') })).toBeVisible();
  for (const id of THREE) await page.getByRole('button', { name: id, exact: true }).click();
  await page.getByRole('button', { name: msg('questionnaire.themes.continue') }).click();
  await expect(page).toHaveURL(/\/questionnaire\/mode$/);
  await page.getByText(msg(`ui.modeChoice.${mode}.title`), { exact: true }).click();
  await page.getByRole('button', { name: msg('questionnaire.mode.continue') }).click();
  await expect(page).toHaveURL(/\/questionnaire\/questions$/);
  await expect(progress(page, 1)).toBeVisible();
  await expect(term(page)).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await servePublished(page);
  await serveGlossary(page);
});

test.describe('US4 — bulle de définition au questionnaire', () => {
  test('1. clic : libellé, définition et source ; Échap ferme et rend le focus au terme', async ({ page }) => {
    await startQuestionnaire(page);
    await expect(term(page)).toHaveAttribute('aria-expanded', 'false');
    await term(page).click();
    await expect(bubble(page)).toBeVisible();
    await expect(bubble(page)).toContainText(TERM.definition);
    await expect(bubble(page).getByRole('link', { name: new RegExp(TERM.sources[0]!.title) })).toHaveAttribute('href', TERM.sources[0]!.url);
    await expect(term(page)).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(bubble(page)).toHaveCount(0);
    await expect(term(page)).toBeFocused();
  });

  test('2. clavier seul : Tab jusqu’au terme, Entrée, Tab dans la bulle, Fermer, focus revenu', async ({ page }) => {
    await startQuestionnaire(page);
    await expect(page.getByRole('heading', { level: 2 })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(term(page)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(bubble(page)).toBeVisible();
    const close = bubble(page).getByRole('button', { name: msg('glossary.close') });
    for (let i = 0; i < 5 && !(await close.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await expect(bubble(page)).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(bubble(page)).toHaveCount(0);
    await expect(term(page)).toBeFocused();
  });

  test('4. ouvrir puis fermer : aucune réponse, URL et stockage local inchangés', async ({ page }) => {
    await startQuestionnaire(page);
    const url = page.url();
    const stored = await page.evaluate((key) => window.localStorage.getItem(key), KEY);
    await term(page).click();
    await expect(bubble(page)).toBeVisible();
    await bubble(page).getByRole('button', { name: msg('glossary.close') }).click();
    await expect(bubble(page)).toHaveCount(0);
    await term(page).click();
    await page.getByRole('progressbar').first().click();
    await expect(bubble(page)).toHaveCount(0);
    expect(page.url()).toBe(url);
    expect(await page.evaluate((key) => window.localStorage.getItem(key), KEY)).toBe(stored);
    for (const r of await page.getByRole('radio').all()) await expect(r).not.toBeChecked();
    await expect(progress(page, 1)).toBeVisible();
  });

  test('5. passage à la question suivante, bulle ouverte : aucune bulle visible', async ({ page }) => {
    await startQuestionnaire(page);
    await term(page).click();
    await expect(bubble(page)).toBeVisible();
    await option(page, 1).click();
    await expect(progress(page, 2)).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(term(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test('glossaire indisponible : énoncé sans repère', async ({ page }) => {
    await page.unroute('**/data/glossary.json');
    await serveGlossary(page, null);
    await page.goto('/questionnaire');
    for (const id of THREE) await page.getByRole('button', { name: id, exact: true }).click();
    await page.getByRole('button', { name: msg('questionnaire.themes.continue') }).click();
    await page.getByText(msg('ui.modeChoice.short.title'), { exact: true }).click();
    await page.getByRole('button', { name: msg('questionnaire.mode.continue') }).click();
    await expect(progress(page, 1)).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toContainText('Énoncé');
    await expect(page.getByRole('heading', { level: 2 }).getByRole('button')).toHaveCount(0);
  });
});

test.describe('US4 — toucher sur mobile', () => {
  test.use({ hasTouch: true, isMobile: true });

  for (const width of [375, 320]) {
    test(`3. ${width} px : bulle entière dans l’écran, aucun défilement horizontal, fermée par un toucher extérieur`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await startQuestionnaire(page);
      await term(page).tap();
      await expect(bubble(page)).toBeVisible();
      const box = (await bubble(page).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(812);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      await page.getByRole('progressbar').first().tap();
      await expect(bubble(page)).toHaveCount(0);
      for (const r of await page.getByRole('radio').all()) await expect(r).not.toBeChecked();
    });
  }
});

test.describe('US4 — résultats', () => {
  test('8. lien d’une version antérieure : terme signalé dans le détail, classement identique avec et sans glossaire', async ({ page }) => {
    await page.unroute('**/data/versions.json');
    await servePublished(page, { current: 2 });
    const state = stateFor('full', THREE, (i) => ([-2, -1, 0, 1, 2] as const)[i % 5]!, 1);
    const board = expectedBoard(state, 2);
    const rankingIds = async () => page.getByRole('list', { name: msg('ui.rankingList.label') }).locator(':scope > li').evaluateAll((lis) => lis.map((li) => li.getAttribute('data-candidate')));

    await page.goto(linkFor(state));
    await expect(page.getByRole('heading', { level: 2, name: msg('results.ranking.title') })).toBeVisible();
    const withGlossary = await rankingIds();
    expect(withGlossary).toEqual(board.ranked.map((s) => s.candidate.id));
    const first = board.ranked[0]!.candidate.id;
    await page.getByRole('button', { name: `${msg('ui.rankingList.open')} de ${first}` }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: first })).toBeFocused();
    const detailTerm = page.getByRole('heading', { level: 4 }).first().getByRole('button', { name: 'Énoncé' });
    await expect(detailTerm).toBeVisible();
    await detailTerm.click();
    await expect(bubble(page)).toBeVisible();

    await page.unroute('**/data/glossary.json');
    await serveGlossary(page, null);
    await page.goto('about:blank');
    await page.goto(linkFor(state));
    await expect(page.getByRole('heading', { level: 2, name: msg('results.ranking.title') })).toBeVisible();
    expect(await rankingIds()).toEqual(withGlossary);
  });
});

test.describe('US5 — page Glossaire', () => {
  test('6. termes publiés triés avec ancre ; lien « Voir le glossaire » depuis la bulle', async ({ page }) => {
    // La page est rendue au build depuis public/data/glossary.json : on la compare au fichier.
    const file = join(__dirname, '..', 'public', 'data', 'glossary.json');
    const published = existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as typeof GLOSSARY) : null;
    await page.goto('/glossaire');
    await expect(page.getByRole('heading', { level: 1, name: msg('glossary.page.title') })).toBeVisible();
    if (!published || published.terms.length === 0) {
      await expect(page.getByText(msg('glossary.page.empty'))).toBeVisible();
    } else {
      const labels = await page.locator('dl > div > dt').allInnerTexts();
      expect(labels).toEqual(published.terms.map((t) => t.label));
      expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })));
      for (const t of published.terms) await expect(page.locator(`[id="${t.id}"]`)).toContainText(t.definition);
      const anchor = published.terms[0]!;
      await page.goto(`/glossaire#${anchor.id}`);
      await expect(page.locator(`[id="${anchor.id}"]`)).toBeInViewport();
    }

    // Depuis la bulle du questionnaire, le lien mène à l'ancre du terme sur /glossaire.
    await startQuestionnaire(page);
    await term(page).click();
    await bubble(page).getByRole('link', { name: msg('glossary.seeGlossary') }).click();
    await expect(page).toHaveURL(new RegExp(`/glossaire#${TERM.id}$`));
    await expect(page.getByRole('heading', { level: 1, name: msg('glossary.page.title') })).toBeVisible();
  });
});
