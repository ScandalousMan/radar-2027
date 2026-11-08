// Parcours questionnaire de bout en bout (spec 004, quickstart § 3) contre l'export statique,
// avec la banque fictive servie par interception de route (R6).
import { expect, test, type Page } from '@playwright/test';
import { decodeFragment } from '../src/core/codec/decode';
import type { Answer, Mode } from '../src/core/types';
import { bankOf, expectedSelection, msg, servePublished } from './fixtures/published';

const KEY = 'radar-questionnaire';
const FOUR = ['t01', 't04', 't07', 't10'];
const THREE = ['t02', 't05', 't08'];

const LIKERT: Record<Exclude<Answer, 'unanswered'>, string> = {
  [-2]: msg('ui.likert.stronglyDisagree'),
  [-1]: msg('ui.likert.disagree'),
  0: msg('ui.likert.neutral'),
  1: msg('ui.likert.agree'),
  2: msg('ui.likert.stronglyAgree'),
  skipped: msg('ui.likert.skip'),
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Option de réponse (le libellé visible porte le clic). */
const option = (page: Page, answer: Exclude<Answer, 'unanswered'>) => page.locator('label').filter({ hasText: new RegExp(`^${escape(LIKERT[answer])}$`) });
const radio = (page: Page, answer: Exclude<Answer, 'unanswered'>) => page.getByRole('radio', { name: LIKERT[answer], exact: true });
const progress = (page: Page, n: number, total: number) => page.getByText(msg('questionnaire.questions.progress', { n, total }), { exact: true }).first();
const storedDraft = (page: Page) => page.evaluate((key) => window.localStorage.getItem(key), KEY);

async function chooseThemes(page: Page, ids: readonly string[]) {
  await page.goto('/questionnaire');
  await expect(page.getByRole('heading', { level: 1, name: msg('questionnaire.themes.title') })).toBeVisible();
  for (const id of ids) await page.getByRole('button', { name: id, exact: true }).click();
}

async function startQuestionnaire(page: Page, mode: Mode, ids: readonly string[]) {
  await chooseThemes(page, ids);
  await page.getByRole('button', { name: msg('questionnaire.themes.continue') }).click();
  await expect(page).toHaveURL(/\/questionnaire\/mode$/);
  await page.getByText(msg(`ui.modeChoice.${mode}.title`), { exact: true }).click();
  await page.getByRole('button', { name: msg('questionnaire.mode.continue') }).click();
  await expect(page).toHaveURL(/\/questionnaire\/questions$/);
}

/** Répond à la question n (1-based) par un clic, qui enregistre et avance (R7). */
async function answer(page: Page, n: number, total: number, value: Exclude<Answer, 'unanswered'>) {
  await expect(progress(page, n, total)).toBeVisible();
  await option(page, value).click();
  if (n < total) await expect(progress(page, n + 1, total)).toBeVisible();
}

async function answerAll(page: Page, total: number, valueAt: (i: number) => Exclude<Answer, 'unanswered'>) {
  for (let i = 0; i < total; i++) await answer(page, i + 1, total, valueAt(i));
  await expect(page.getByRole('heading', { level: 1, name: msg('questionnaire.end.title') })).toBeVisible();
}

async function decodedResults(page: Page) {
  const href = await page.getByRole('link', { name: msg('questionnaire.end.results') }).getAttribute('href');
  expect(href).toMatch(/^\/resultats#1\./);
  const decoded = decodeFragment(href!.split('#')[1]!, bankOf(1));
  if (!decoded.ok) throw new Error(`fragment refusé : ${decoded.reason}`);
  return decoded.value;
}

const cycle = (i: number): Exclude<Answer, 'unanswered'> => ([-2, -1, 0, 1, 2] as const)[i % 5]!;

test.beforeEach(async ({ page }) => {
  await servePublished(page);
});

test.describe('US1 — répondre de bout en bout', () => {
  test('accueil → fin, mode court : 25 questions, lien de résultats décodable', async ({ page }) => {
    await startQuestionnaire(page, 'short', FOUR);
    await expect(progress(page, 1, 25)).toBeVisible();
    await answerAll(page, 25, cycle);
    await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
    const state = await decodedResults(page);
    expect(state.mode).toBe('short');
    expect(state.priorities).toEqual(FOUR);
    expect(state.answers).toEqual(Array.from({ length: 25 }, (_, i) => cycle(i)));
    await page.getByRole('link', { name: msg('questionnaire.end.results') }).click();
    await expect(page.getByRole('heading', { level: 1, name: msg('results.title') })).toBeVisible();
    expect(await storedDraft(page), 'le brouillon est conservé (FR-026)').not.toBeNull();
  });

  test('mode complet : 3 sujets, 100 questions', async ({ page }) => {
    test.setTimeout(120_000);
    await startQuestionnaire(page, 'full', THREE);
    await expect(progress(page, 1, 100)).toBeVisible();
    await answerAll(page, 100, (i) => cycle(i + 2));
    const state = await decodedResults(page);
    expect(state.mode).toBe('full');
    expect(state.priorities).toEqual(THREE);
    expect(state.answers).toHaveLength(100);
    expect(state.answers).toEqual(Array.from({ length: 100 }, (_, i) => cycle(i + 2)));
  });

  test('déterminisme : deux contextes voient les mêmes énoncés dans le même ordre', async ({ browser }) => {
    test.setTimeout(120_000);
    const statements: string[][] = [];
    for (let k = 0; k < 2; k++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await servePublished(page);
      await startQuestionnaire(page, 'full', THREE);
      const seen: string[] = [];
      for (let i = 0; i < 100; i++) {
        await expect(progress(page, i + 1, 100)).toBeVisible();
        seen.push((await page.getByRole('heading', { level: 2 }).textContent())!);
        await option(page, 'skipped').click();
      }
      statements.push(seen);
      await context.close();
    }
    expect(statements[0]).toEqual(statements[1]);
    expect(statements[0]).toEqual(expectedSelection('full', THREE).items.map((item) => item.question.text));
  });

  test('sélection bornée : 2 sujets refusés, sixième refusé', async ({ page }) => {
    await chooseThemes(page, ['t01', 't02']);
    await expect(page.getByRole('button', { name: msg('questionnaire.themes.continue') })).toBeDisabled();
    await expect(page.getByText('Choisissez encore 1 sujet (minimum 3).')).toBeVisible();
    for (const id of ['t03', 't04', 't05']) await page.getByRole('button', { name: id, exact: true }).click();
    await expect(page.getByText(msg('ui.themePicker.maxReached', { max: 5 }))).toBeVisible();
    const sixth = page.getByRole('button', { name: 't06', exact: true });
    await expect(sixth).toHaveAttribute('aria-disabled', 'true');
    await sixth.click({ force: true });
    await expect(sixth).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: msg('questionnaire.themes.continue') })).toBeEnabled();
  });

  test('accès direct à une question sans choix : retour silencieux aux sujets', async ({ page }) => {
    await page.goto('/questionnaire/questions');
    await expect(page).toHaveURL(/\/questionnaire$/);
    await expect(page.getByRole('heading', { level: 1, name: msg('questionnaire.themes.title') })).toBeVisible();
    await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
  });

  test('trafic : seules des requêtes locales, sans donnée du répondant (SC-008)', async ({ page }) => {
    const requests: { url: URL; method: string; body: string | null }[] = [];
    page.on('request', (request) => requests.push({ url: new URL(request.url()), method: request.method(), body: request.postData() }));
    await startQuestionnaire(page, 'short', FOUR);
    await answerAll(page, 25, cycle);
    expect(requests.length).toBeGreaterThan(0);
    for (const { url, method, body } of requests) {
      expect(['localhost', '127.0.0.1'], url.href).toContain(url.hostname);
      expect(['GET', 'HEAD'], url.href).toContain(method);
      expect(body, url.href).toBeNull();
      // Seul paramètre admis : l'identifiant de cache des navigations du routeur Next.
      expect([...url.searchParams.keys()].filter((k) => k !== '_rsc'), url.href).toEqual([]);
      expect(url.hash).toBe('');
      const path = url.pathname;
      expect(/^\/(_next\/|__next\.|data\/|questionnaire(\/|\.|$)|resultats|methodologie|a-propos|favicon|$)/.test(path), path).toBe(true);
      for (const id of FOUR) expect(path, path).not.toContain(id);
      expect(path).not.toMatch(/short|full/);
    }
    expect(requests.some(({ url }) => url.pathname === '/data/versions/1/main.json')).toBe(true);
  });
});

test.describe('US2 — naviguer, passer, corriger', () => {
  test('passer, précédent, corriger, Suivant actif seulement avec une réponse', async ({ page }) => {
    await startQuestionnaire(page, 'short', FOUR);
    const next = page.getByRole('button', { name: msg('questionnaire.questions.next') });
    const previous = page.getByRole('button', { name: msg('questionnaire.questions.previous') });
    await expect(previous).toBeDisabled();
    await expect(next).toBeDisabled();
    await answer(page, 1, 25, 'skipped');
    await answer(page, 2, 25, 2);
    await expect(next).toBeDisabled();
    await previous.click();
    await expect(progress(page, 2, 25)).toBeVisible();
    await expect(radio(page, 2)).toBeChecked();
    await previous.click();
    await expect(progress(page, 1, 25)).toBeVisible();
    await expect(radio(page, 'skipped')).toBeChecked();
    await expect(next).toBeEnabled();
    await option(page, 1).click();
    await expect(progress(page, 2, 25)).toBeVisible();
    await expect(radio(page, 2)).toBeChecked();
    await next.click();
    await expect(progress(page, 3, 25)).toBeVisible();
    await expect(next).toBeDisabled();
    await previous.click();
    await previous.click();
    await expect(radio(page, 1)).toBeChecked();
  });

  test('avertissement de fin : un sujet clé entièrement passé, résultats toujours accessibles', async ({ page }) => {
    await startQuestionnaire(page, 'short', FOUR);
    const bank = bankOf(1);
    const t01 = bank.themeIndexById.get('t01')!;
    const items = expectedSelection('short', FOUR).items;
    await answerAll(page, 25, (i) => (items[i]!.question.themeIndices.includes(t01) ? 'skipped' : 1));
    const alert = page.getByRole('main').getByRole('alert');
    await expect(alert).toContainText(msg('questionnaire.end.warning.title'));
    await expect(alert).toContainText('t01');
    await expect(alert).not.toContainText('t04');
    await expect(page.getByRole('link', { name: msg('questionnaire.end.results') })).toBeVisible();
    await page.getByRole('button', { name: msg('questionnaire.end.back') }).click();
    await expect(page).toHaveURL(/\/questionnaire\/questions$/);
    await expect(progress(page, 25, 25)).toBeVisible();
    const lastExpected = items[24]!.question.themeIndices.includes(t01) ? 'skipped' : 1;
    await expect(radio(page, lastExpected)).toBeChecked();
  });

  test('toutes passées : avertissement pour chaque sujet clé', async ({ page }) => {
    await startQuestionnaire(page, 'short', FOUR);
    await answerAll(page, 25, () => 'skipped');
    const alert = page.getByRole('main').getByRole('alert');
    for (const id of FOUR) await expect(alert).toContainText(id);
    await expect(page.getByRole('link', { name: msg('questionnaire.end.results') })).toBeVisible();
    const state = await decodedResults(page);
    expect(state.answers.every((a) => a === 'skipped')).toBe(true);
  });

  test('bouton précédent du navigateur : question précédente, puis écran du mode', async ({ page }) => {
    await startQuestionnaire(page, 'short', FOUR);
    await answer(page, 1, 25, -1);
    await answer(page, 2, 25, 2);
    await expect(progress(page, 3, 25)).toBeVisible();
    await page.goBack();
    await expect(progress(page, 2, 25)).toBeVisible();
    await expect(radio(page, 2)).toBeChecked();
    await expect(page).toHaveURL(/\/questionnaire\/questions$/);
    await page.goBack();
    await expect(progress(page, 1, 25)).toBeVisible();
    await expect(radio(page, -1)).toBeChecked();
    await page.goBack();
    await expect(page).toHaveURL(/\/questionnaire\/mode$/);
  });
});

test.describe('US3 — reprendre un questionnaire interrompu', () => {
  test('reprise : 10 réponses, rechargement, carte « 10 / 25 », question 11', async ({ page }) => {
    await startQuestionnaire(page, 'short', FOUR);
    for (let i = 0; i < 10; i++) await answer(page, i + 1, 25, cycle(i));
    await page.reload();
    await page.goto('/');
    const card = page.locator('section').filter({ hasText: msg('ui.resumeCard.title') });
    await expect(card).toContainText('10 / 25');
    await expect(card).toContainText(msg('ui.modeChoice.short.title'));
    await card.getByRole('button', { name: msg('ui.resumeCard.resume') }).click();
    await expect(progress(page, 11, 25)).toBeVisible();
    const items = expectedSelection('short', FOUR).items;
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(items[10]!.question.text);
    const previous = page.getByRole('button', { name: msg('questionnaire.questions.previous') });
    for (let i = 9; i >= 0; i--) {
      await previous.click();
      await expect(progress(page, i + 1, 25)).toBeVisible();
      await expect(page.getByRole('heading', { level: 2 })).toHaveText(items[i]!.question.text);
      await expect(radio(page, cycle(i))).toBeChecked();
    }
  });

  test('effacer : confirmation puis clé absente et accueil sans carte', async ({ page }) => {
    await startQuestionnaire(page, 'short', FOUR);
    await answer(page, 1, 25, 1);
    await page.goto('/');
    await page.getByRole('button', { name: msg('ui.resumeCard.clear') }).click();
    const dialog = page.getByRole('dialog', { name: msg('questionnaire.confirm.clear.title') });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: msg('questionnaire.confirm.clear.confirm'), exact: true }).click();
    await expect(page.getByText(msg('ui.resumeCard.title'))).toHaveCount(0);
    expect(await storedDraft(page)).toBeNull();
  });

  test('recommencer : confirmation puis écran des sujets, clé absente', async ({ page }) => {
    await startQuestionnaire(page, 'short', FOUR);
    await answer(page, 1, 25, 1);
    await page.goto('/');
    await page.getByRole('button', { name: msg('ui.resumeCard.restart') }).click();
    await page.getByRole('dialog').getByRole('button', { name: msg('questionnaire.confirm.restart.confirm'), exact: true }).click();
    await expect(page).toHaveURL(/\/questionnaire$/);
    expect(await storedDraft(page)).toBeNull();
  });

  test('version changée : carte sans Reprendre, rien d’effacé sans confirmation', async ({ page }) => {
    await page.unrouteAll();
    await servePublished(page, { current: 2 });
    await page.goto('/');
    const draft = { format: 1, bankVersion: 1, mode: 'short', priorities: FOUR, answers: Array.from({ length: 25 }, (_, i) => (i < 3 ? 1 : 'unanswered')), position: 3, updatedAt: '2026-11-08T17:42:10.000Z' };
    await page.evaluate(([key, value]) => window.localStorage.setItem(key!, value!), [KEY, JSON.stringify(draft)]);
    await page.reload();
    await expect(page.getByText(msg('ui.resumeCard.versionChanged'))).toBeVisible();
    await expect(page.getByRole('button', { name: msg('ui.resumeCard.resume') })).toHaveCount(0);
    await page.getByRole('button', { name: msg('ui.resumeCard.restart') }).click();
    await page.getByRole('dialog').getByRole('button', { name: msg('questionnaire.confirm.cancel') }).click();
    expect(JSON.parse((await storedDraft(page))!)).toEqual(draft);
  });

  test('stockage indisponible : avertissement et parcours complet possible', async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException('refusé', 'QuotaExceededError');
      };
    });
    await startQuestionnaire(page, 'short', FOUR);
    await expect(page.getByText(msg('questionnaire.questions.storageUnavailable'))).toBeVisible();
    await answer(page, 1, 25, 1);
    await expect(page.getByText(msg('questionnaire.questions.storageUnavailable'))).toBeVisible();
    for (let i = 1; i < 25; i++) await answer(page, i + 1, 25, 0);
    await expect(page.getByRole('heading', { level: 1, name: msg('questionnaire.end.title') })).toBeVisible();
  });

  test('fermeture avant la première question : rien n’est écrit', async ({ page }) => {
    await chooseThemes(page, FOUR);
    await page.getByRole('button', { name: msg('questionnaire.themes.continue') }).click();
    await page.getByText(msg('ui.modeChoice.short.title'), { exact: true }).click();
    expect(await storedDraft(page)).toBeNull();
  });
});

test.describe('US4 — changer de sujets ou de mode', () => {
  async function fiveAnswers(page: Page) {
    await startQuestionnaire(page, 'short', FOUR);
    for (let i = 0; i < 5; i++) await answer(page, i + 1, 25, cycle(i));
    await expect(progress(page, 6, 25)).toBeVisible();
  }

  /** Bouton précédent du navigateur depuis la question 6 jusqu'à l'écran du mode. */
  async function backToMode(page: Page) {
    for (let n = 5; n >= 1; n--) {
      await page.goBack();
      await expect(progress(page, n, 25)).toBeVisible();
    }
    await page.goBack();
    await expect(page).toHaveURL(/\/questionnaire\/mode$/);
  }

  test('changer de sujets : annuler ne change rien ; confirmer repart de la présélection', async ({ page }) => {
    await fiveAnswers(page);
    await page.getByRole('button', { name: msg('questionnaire.questions.changeThemes') }).click();
    await page.getByRole('dialog').getByRole('button', { name: msg('questionnaire.confirm.cancel') }).click();
    await expect(progress(page, 6, 25)).toBeVisible();
    await page.getByRole('button', { name: msg('questionnaire.questions.previous') }).click();
    await expect(radio(page, cycle(4))).toBeChecked();
    await page.getByRole('button', { name: msg('questionnaire.questions.changeThemes') }).click();
    await page.getByRole('dialog').getByRole('button', { name: msg('questionnaire.confirm.change.confirm') }).click();
    await expect(page).toHaveURL(/\/questionnaire$/);
    for (const id of FOUR) await expect(page.getByRole('button', { name: id, exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(await storedDraft(page)).toBeNull();
    await page.getByRole('button', { name: 't10', exact: true }).click();
    await page.getByRole('button', { name: 't13', exact: true }).click();
    await page.getByRole('button', { name: msg('questionnaire.themes.continue') }).click();
    await expect(page.getByRole('radio', { name: msg('ui.modeChoice.short.title') })).toBeChecked();
    await page.getByRole('button', { name: msg('questionnaire.mode.continue') }).click();
    await expect(progress(page, 1, 25)).toBeVisible();
    for (const value of [-2, -1, 0, 1, 2, 'skipped'] as const) await expect(radio(page, value)).not.toBeChecked();
    expect(JSON.parse((await storedDraft(page))!).priorities).toEqual(['t01', 't04', 't07', 't13']);
  });

  test('changer de mode : écran du mode présélectionné', async ({ page }) => {
    await fiveAnswers(page);
    await page.getByRole('button', { name: msg('questionnaire.questions.changeMode') }).click();
    await page.getByRole('dialog').getByRole('button', { name: msg('questionnaire.confirm.change.confirm') }).click();
    await expect(page).toHaveURL(/\/questionnaire\/mode$/);
    await expect(page.getByRole('radio', { name: msg('ui.modeChoice.short.title') })).toBeChecked();
    await page.getByText(msg('ui.modeChoice.full.title'), { exact: true }).click();
    await page.getByRole('button', { name: msg('questionnaire.mode.continue') }).click();
    await expect(progress(page, 1, 100)).toBeVisible();
  });

  test('revalidation identique : reprise à la question 6 sans confirmation', async ({ page }) => {
    await fiveAnswers(page);
    await backToMode(page);
    await page.goBack();
    await expect(page).toHaveURL(/\/questionnaire$/);
    await page.getByRole('button', { name: msg('questionnaire.themes.continue') }).click();
    await page.getByRole('button', { name: msg('questionnaire.mode.continue') }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(progress(page, 6, 25)).toBeVisible();
    await page.getByRole('button', { name: msg('questionnaire.questions.previous') }).click();
    await expect(radio(page, cycle(4))).toBeChecked();
  });

  test('triplet différent avec un brouillon : confirmation, annuler conserve le brouillon', async ({ page }) => {
    await fiveAnswers(page);
    const before = await storedDraft(page);
    await backToMode(page);
    await page.getByText(msg('ui.modeChoice.full.title'), { exact: true }).click();
    await page.getByRole('button', { name: msg('questionnaire.mode.continue') }).click();
    const dialog = page.getByRole('dialog', { name: msg('questionnaire.confirm.change.title') });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: msg('questionnaire.confirm.cancel') }).click();
    await expect(page).toHaveURL(/\/questionnaire\/mode$/);
    // L'historique a ramené le curseur en arrière ; mode, sujets et réponses sont intacts.
    const after = JSON.parse((await storedDraft(page))!);
    const initial = JSON.parse(before!);
    expect({ ...after, position: 0, updatedAt: '' }).toEqual({ ...initial, position: 0, updatedAt: '' });
  });
});

test.describe('accessibilité', () => {
  test('clavier seul : parcours court complet, focus jamais perdu (SC-005)', async ({ page }) => {
    test.setTimeout(90_000);
    const focusedIsBody = () => page.evaluate(() => document.activeElement === document.body || document.activeElement === null);
    async function tabTo(predicate: () => Promise<boolean>, max = 40) {
      for (let i = 0; i < max; i++) {
        await page.keyboard.press('Tab');
        if (await predicate()) return;
      }
      throw new Error('élément jamais atteint au clavier');
    }
    const focusedName = () => page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');

    await page.goto('/questionnaire');
    await expect(page.getByRole('heading', { level: 1, name: msg('questionnaire.themes.title') })).toBeVisible();
    for (const id of ['t00', 't01', 't02']) {
      await tabTo(async () => (await focusedName()) === id);
      await page.keyboard.press('Space');
    }
    await tabTo(async () => (await focusedName()) === msg('questionnaire.themes.continue'));
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/questionnaire\/mode$/);
    await tabTo(() => page.getByRole('radio', { name: msg('ui.modeChoice.short.title') }).evaluate((el) => el === document.activeElement));
    await page.keyboard.press('Space');
    await tabTo(async () => (await focusedName()) === msg('questionnaire.mode.continue'));
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/questionnaire\/questions$/);

    for (let n = 1; n <= 25; n++) {
      await expect(page.getByRole('heading', { level: 2 })).toBeFocused();
      await expect(page.locator('[aria-live="polite"]').filter({ hasText: msg('questionnaire.questions.progress', { n, total: 25 }) })).toHaveCount(1);
      await page.keyboard.press('Tab');
      await expect(radio(page, -2)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(radio(page, -1)).toBeChecked();
      expect(await focusedIsBody()).toBe(false);
      await page.keyboard.press('Enter');
    }
    await expect(page.getByRole('heading', { level: 1, name: msg('questionnaire.end.title') })).toBeVisible();
    const state = await decodedResults(page);
    expect(state.answers).toEqual(Array.from({ length: 25 }, () => -1));
  });

  test('320 px : aucun défilement horizontal, cibles ≥ 44 px (SC-004)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    const noHorizontalScroll = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    const minTarget = async (locator: ReturnType<Page['locator']>) => {
      const box = await locator.boundingBox();
      expect(box, 'boîte visible').not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    };
    await chooseThemes(page, FOUR);
    await noHorizontalScroll();
    await page.getByRole('button', { name: msg('questionnaire.themes.continue') }).click();
    await expect(page).toHaveURL(/\/mode$/);
    await noHorizontalScroll();
    await page.getByText(msg('ui.modeChoice.short.title'), { exact: true }).click();
    await page.getByRole('button', { name: msg('questionnaire.mode.continue') }).click();
    await expect(progress(page, 1, 25)).toBeVisible();
    await noHorizontalScroll();
    for (const value of [-2, -1, 0, 1, 2, 'skipped'] as const) await minTarget(option(page, value));
    await minTarget(page.getByRole('button', { name: msg('questionnaire.questions.previous') }));
    await minTarget(page.getByRole('button', { name: msg('questionnaire.questions.next') }));
    await answerAll(page, 25, () => 'skipped');
    await noHorizontalScroll();
  });

  // SC-006 : `@axe-core/playwright` n'est pas une dépendance du projet (aucun ajout sans l'accord
  // du propriétaire, T059). La vérification automatisée est couverte par les stories de chaque
  // composant du parcours, exécutées avec l'addon a11y bloquant dans les projets Vitest
  // `storybook` et `storybook-sombre` (ConfirmDialog ouvert, QuestionCard, ModeChoice, …).
});
