// Résultats, partage et liens (spec 005, quickstart § 2) contre l'export statique, avec la banque
// fictive à deux versions servie par interception de route (R11). Les liens sont fabriqués par le
// codec du cœur et les chiffres attendus calculés par le cœur avec la seule version du lien.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { decodeFragment } from '../src/core/codec/decode';
import { decodeBase64Url, encodeBase64Url } from '../src/core/codec/base64url';
import { answerToCode } from '../src/core/codec/bits';
import { buildPayload } from '../src/core/codec/payload';
import type { Answer, Mode, ResultState } from '../src/core/types';
import { ADDED_IN_V2, bankOf, expectedBoard, linkFor, msg, servePublished, stateFor, WITHDRAWN_IN_V2 } from './fixtures/published';

const KEY = 'radar-questionnaire';
const FOUR = ['t01', 't04', 't07', 't10'];
const THREE = ['t02', 't05', 't08'];
const FIVE = ['t00', 't03', 't06', 't09', 't12'];

const cycle = (i: number): Exclude<Answer, 'unanswered'> => ([-2, -1, 0, 1, 2] as const)[i % 5]!;
const withSkips = (i: number): Exclude<Answer, 'unanswered'> => (i % 7 === 3 ? 'skipped' : cycle(i));

const LIKERT: Record<Exclude<Answer, 'unanswered'>, string> = {
  [-2]: msg('ui.likert.stronglyDisagree'),
  [-1]: msg('ui.likert.disagree'),
  0: msg('ui.likert.neutral'),
  1: msg('ui.likert.agree'),
  2: msg('ui.likert.stronglyAgree'),
  skipped: msg('ui.likert.skip'),
};
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const option = (page: Page, answer: Exclude<Answer, 'unanswered'>) => page.locator('label').filter({ hasText: new RegExp(`^${escape(LIKERT[answer])}$`) });
const progress = (page: Page, n: number, total: number) => page.getByText(msg('questionnaire.questions.progress', { n, total }), { exact: true }).first();

const main = (page: Page) => page.getByRole('main');
const rankingList = (page: Page) => page.getByRole('list', { name: msg('ui.rankingList.label') });
const rankingItems = (page: Page) => rankingList(page).locator(':scope > li');
const insufficientSection = (page: Page) => page.getByRole('region', { name: msg('results.insufficient.title') });
const resultsHeading = (page: Page) => page.getByRole('heading', { level: 1, name: msg('results.title') });

/** Attend la fin du chargement : le titre « Vos résultats » s'affiche aussi pendant le calcul. */
async function resultsShown(page: Page) {
  await expect(resultsHeading(page)).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: msg('results.ranking.title') })).toBeVisible();
}

async function openResults(page: Page, state: ResultState) {
  await page.goto(linkFor(state));
  await resultsShown(page);
}

/** Classement affiché : identifiant, rang, ex æquo, pourcentage, bande, mention de retrait. */
async function displayedRanking(page: Page) {
  const items = await rankingItems(page).all();
  return Promise.all(
    items.map(async (li) => ({
      id: await li.getAttribute('data-candidate'),
      text: (await li.innerText()).replace(/\s+/g, ' '),
      percent: Number(await li.getByRole('meter').getAttribute('aria-valuenow')),
    })),
  );
}

async function displayedInsufficient(page: Page) {
  if ((await insufficientSection(page).count()) === 0) return [];
  return insufficientSection(page)
    .locator('li[data-candidate]')
    .evaluateAll((lis) => lis.map((li) => ({ id: li.getAttribute('data-candidate'), text: (li as HTMLElement).innerText.replace(/\s+/g, ' ') })));
}

/** Le classement affiché correspond exactement à celui du cœur (SC-001, FR-002 à FR-004). */
async function expectBoard(page: Page, state: ResultState, current = state.bankVersion) {
  const board = expectedBoard(state, current);
  const shown = await displayedRanking(page);
  expect(shown.map((r) => r.id)).toEqual(board.ranked.map((s) => s.candidate.id));
  board.ranked.forEach((s, i) => {
    const row = shown[i]!;
    expect(row.percent).toBe(s.global!.percent);
    expect(row.text).toContain(`Rang ${s.rank}`);
    expect(row.text).toContain(msg(`results.band.${s.band}`));
    const tied = board.ranked.some((o) => o !== s && o.rank === s.rank);
    expect(row.text.includes(msg('ui.rankingList.tied')), `${s.candidate.id} ex æquo`).toBe(tied);
  });
  const insufficient = await displayedInsufficient(page);
  expect(insufficient.map((r) => r.id)).toEqual(board.insufficient.map((s) => s.candidate.id));
  return board;
}

async function noHorizontalScroll(page: Page) {
  const { scroll, width } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: window.innerWidth }));
  expect(scroll).toBeLessThanOrEqual(width);
}

test.beforeEach(async ({ page }) => {
  await servePublished(page);
});

test.describe('US1 — consulter mon classement', () => {
  test('4 sujets, mode court : sujets rappelés, ordre, pourcentages, bandes et ex æquo du cœur', async ({ page }) => {
    const state = stateFor('short', FOUR, cycle);
    await openResults(page, state);
    await expect(page.getByRole('list', { name: msg('ui.resultsHeader.priorities') }).getByRole('listitem')).toHaveText(FOUR);
    await expect(main(page)).toContainText('Mode court · 25 réponses sur 25 questions');
    await expectBoard(page, state);
  });

  test('ex æquo : rang partagé et mention en texte', async ({ page }) => {
    // Toutes les réponses neutres : de nombreux candidats partagent le même pourcentage tronqué.
    const state = stateFor('short', THREE, () => 0);
    const board = expectedBoard(state);
    expect(board.ranked.some((s, i) => board.ranked.some((o, j) => j !== i && o.rank === s.rank)), 'la fixture produit des ex æquo').toBe(true);
    await openResults(page, state);
    await expectBoard(page, state);
    await expect(rankingList(page).getByText(msg('ui.rankingList.tied')).first()).toBeVisible();
  });

  test('données insuffisantes : section distincte, mention « N positions inconnues sur M »', async ({ page }) => {
    await page.unrouteAll();
    await servePublished(page, { current: 2 });
    const state = stateFor('short', FOUR, cycle, 2);
    await openResults(page, state);
    const board = await expectBoard(page, state);
    const added = board.insufficient.find((s) => s.candidate.id === ADDED_IN_V2)!;
    expect(added, 'c22 est en données insuffisantes').toBeTruthy();
    const unknown = board.answeredCount - (added.coverage?.known ?? 0);
    const item = insufficientSection(page).locator(`li[data-candidate="${ADDED_IN_V2}"]`);
    await expect(item).toContainText(msg('ui.insufficientList.status'));
    await expect(item).toContainText(`${unknown} positions inconnues sur ${board.answeredCount} questions répondues`);
    await expect(item).not.toContainText('%');
  });

  test('aucun classable : message explicite et « Répondre à davantage de questions »', async ({ page }) => {
    const state = stateFor('short', FOUR, (i) => (i < 3 ? 1 : 'unanswered'));
    expect(expectedBoard(state).ranked).toHaveLength(0);
    await page.goto(linkFor(state));
    await expect(main(page).getByText(msg('results.ranking.noneTitle'))).toBeVisible();
    await expect(rankingList(page)).toHaveCount(0);
    await expect(main(page).getByRole('button', { name: msg('results.ranking.answerMore') })).toBeVisible();
    await expect(insufficientSection(page).locator('li[data-candidate]')).toHaveCount(22);
    await expect(insufficientSection(page).locator('li[data-candidate]').first()).toContainText('sur 3 questions répondues');
  });

  test('phrase de plafonnement et lien Méthodologie', async ({ page }) => {
    await openResults(page, stateFor('short', FOUR, cycle));
    await expect(main(page)).toContainText(msg('results.header.cap'));
    await expect(main(page).getByRole('link', { name: msg('results.header.methodology') }).first()).toHaveAttribute('href', '/methodologie');
  });

  test('HTML statique sans résultat : titre générique et chargement', async ({ request }) => {
    const html = await (await request.get('/resultats')).text();
    expect(html).toContain(msg('results.loading'));
    expect(html).not.toMatch(/\d+\s?%/);
    expect(html).toContain(`<meta property="og:title" content="${msg('results.meta.title')}"`);
  });

  test('320 px : aucun défilement horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await openResults(page, stateFor('short', FIVE, withSkips));
    await noHorizontalScroll(page);
  });
});

test.describe('US2 — partager et rouvrir', () => {
  test('copie : lien exact dans le presse-papiers, sans query string, annonce « Lien copié »', async ({ page, context, baseURL }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const state = stateFor('full', FOUR, withSkips);
    await page.goto(`${linkFor(state).replace('#', '?x=1#')}`);
    await expect(resultsHeading(page)).toBeVisible();
    await page.getByRole('button', { name: msg('ui.sharePanel.copy') }).click();
    await expect(main(page).getByText(msg('ui.sharePanel.copied'))).toBeVisible();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(`${baseURL}${linkFor(state)}`);
    expect(copied).not.toContain('?');
    expect(copied.split('#')[1]!.length).toBeLessThanOrEqual(64);
  });

  test('longueur du fragment : ≤ 64 en complet, ≤ 32 en court (SC-004)', () => {
    for (const priorities of [THREE, FOUR, FIVE]) {
      expect(linkFor(stateFor('full', priorities, withSkips)).split('#')[1]!.length).toBeLessThanOrEqual(64);
      expect(linkFor(stateFor('short', priorities, withSkips)).split('#')[1]!.length).toBeLessThanOrEqual(32);
    }
  });

  for (const mode of ['short', 'full'] as Mode[]) {
    for (const priorities of [THREE, FOUR, FIVE]) {
      test(`réouverture dans un navigateur vierge : ${mode}, ${priorities.length} sujets (SC-002)`, async ({ page, browser }) => {
        const state = stateFor(mode, priorities, withSkips);
        await openResults(page, state);
        const first = { ranking: await displayedRanking(page), insufficient: await displayedInsufficient(page), header: await page.locator('header').first().innerText() };
        const fresh = await browser.newContext();
        const other = await fresh.newPage();
        await servePublished(other);
        await openResults(other, state);
        expect(await displayedRanking(other)).toEqual(first.ranking);
        expect(await displayedInsufficient(other)).toEqual(first.insufficient);
        expect(await other.locator('header').first().innerText()).toBe(first.header);
        await fresh.close();
      });
    }
  }

  test('presse-papiers refusé : champ en lecture seule sélectionné avec le lien', async ({ page, baseURL }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new DOMException('refusé', 'NotAllowedError')) }, configurable: true });
    });
    const state = stateFor('short', FOUR, cycle);
    await openResults(page, state);
    await page.getByRole('button', { name: msg('ui.sharePanel.copy') }).click();
    const field = page.getByRole('textbox', { name: msg('ui.sharePanel.manualLabel') });
    await expect(field).toHaveValue(`${baseURL}${linkFor(state)}`);
    await expect(field).toHaveAttribute('readonly', '');
    await expect(field).toBeFocused();
    await expect(main(page)).toContainText(msg('ui.sharePanel.manualHint'));
  });

  test('aperçu générique identique pour deux liens différents (FR-029)', async ({ page }) => {
    const metas = [];
    for (const state of [stateFor('short', FOUR, cycle), stateFor('full', THREE, () => 2)]) {
      await openResults(page, state);
      metas.push(
        await page.evaluate(() => ({
          title: document.title,
          og: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
          description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        })),
      );
      await expect(main(page)).toContainText(msg('results.meta.description'));
    }
    expect(metas[0]).toEqual(metas[1]);
    expect(metas[0]!.og).toBe(msg('results.meta.title'));
    expect(JSON.stringify(metas[0])).not.toMatch(/c\d\d|t\d\d|%/);
  });

  test('modifier mes réponses sans brouillon : questionnaire pré-rempli, nouveau lien, l’ancien inchangé (SC-011)', async ({ page }) => {
    test.setTimeout(90_000);
    const state = stateFor('short', FOUR, cycle);
    await openResults(page, state);
    const before = await displayedRanking(page);
    await main(page).getByRole('button', { name: msg('results.modify.action') }).click();
    await expect(page).toHaveURL(/\/questionnaire\/questions$/);
    await expect(progress(page, 1, 25)).toBeVisible();
    await expect(page.getByRole('radio', { name: LIKERT[cycle(0)], exact: true })).toBeChecked();
    // Chaque réponse est remplacée par la valeur suivante du cycle (clic ⇒ enregistrement et avance).
    for (let i = 0; i < 25; i++) {
      await expect(progress(page, i + 1, 25)).toBeVisible();
      await option(page, cycle(i + 1)).click();
    }
    await expect(page.getByRole('heading', { level: 1, name: msg('questionnaire.end.title') })).toBeVisible();
    const href = await page.getByRole('link', { name: msg('questionnaire.end.results') }).getAttribute('href');
    expect(href).not.toBe(linkFor(state));
    const decoded = decodeFragment(href!.split('#')[1]!, bankOf(1));
    expect(decoded.ok && decoded.value.answers).toEqual(Array.from({ length: 25 }, (_, i) => cycle(i + 1)));
    await page.getByRole('link', { name: msg('questionnaire.end.results') }).click();
    await resultsShown(page);
    await expectBoard(page, { ...state, answers: Array.from({ length: 25 }, (_, i) => cycle(i + 1)) });
    await openResults(page, state);
    expect(await displayedRanking(page)).toEqual(before);
  });

  test('modifier sans stockage disponible : questionnaire pré-rempli, avertissement de la 004', async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException('refusé', 'QuotaExceededError');
      };
    });
    await openResults(page, stateFor('short', FOUR, cycle));
    await main(page).getByRole('button', { name: msg('results.modify.action') }).click();
    await expect(page).toHaveURL(/\/questionnaire\/questions$/);
    await expect(progress(page, 1, 25)).toBeVisible();
    await expect(page.getByRole('radio', { name: LIKERT[cycle(0)], exact: true })).toBeChecked();
    await option(page, 2).click();
    await expect(page.getByText(msg('questionnaire.questions.storageUnavailable'))).toBeVisible();
  });

  test('modifier avec un autre brouillon : confirmation, refus ⇒ brouillon intact et résultats affichés', async ({ page }) => {
    const other = { format: 1, bankVersion: 1, mode: 'short', priorities: THREE, answers: Array.from({ length: 25 }, (_, i) => (i < 4 ? 2 : 'unanswered')), position: 4, updatedAt: '2026-11-08T17:42:10.000Z' };
    await page.goto('/');
    await page.evaluate(([key, value]) => window.localStorage.setItem(key!, value!), [KEY, JSON.stringify(other)]);
    await openResults(page, stateFor('short', FOUR, cycle));
    await main(page).getByRole('button', { name: msg('results.modify.action') }).click();
    const dialog = page.getByRole('dialog', { name: msg('results.modify.confirm.title') });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: msg('results.modify.confirm.cancel') }).click();
    await expect(dialog).toBeHidden();
    await expect(resultsHeading(page)).toBeVisible();
    expect(JSON.parse((await page.evaluate((key) => window.localStorage.getItem(key), KEY))!)).toEqual(other);
    // Accepter remplace le brouillon et ouvre le questionnaire.
    await main(page).getByRole('button', { name: msg('results.modify.action') }).click();
    await page.getByRole('dialog').getByRole('button', { name: msg('results.modify.confirm.confirm') }).click();
    await expect(page).toHaveURL(/\/questionnaire\/questions$/);
    const stored = JSON.parse((await page.evaluate((key) => window.localStorage.getItem(key), KEY))!);
    expect(stored.priorities).toEqual(FOUR);
  });
});

test.describe('US3 — liens invalides, anciens ou absents', () => {
  const valid = () => linkFor(stateFor('short', FOUR, cycle));

  const corrupted: Array<[string, () => string]> = [
    ['caractère supprimé', () => valid().slice(0, -1)],
    ['caractère altéré', () => {
      // Caractère au milieu des réponses (l'en-tête reste valide) : la somme de contrôle échoue.
      const href = valid();
      const i = href.length - 6;
      return `${href.slice(0, i)}${href[i] === 'A' ? 'B' : 'A'}${href.slice(i + 1)}`;
    }],
    [
      'CRC faux',
      () => {
        const href = valid();
        const bytes = decodeBase64Url(href.split('#1.')[1]!)!;
        bytes[bytes.length - 1] = bytes[bytes.length - 1]! ^ 0xff;
        return `/resultats#1.${encodeBase64Url(bytes)}`;
      },
    ],
    ['2 sujets', () => `/resultats#1.${encodeBase64Url(buildPayload(1, 'short', [1, 4], Array.from({ length: 25 }, () => answerToCode(1))))}`],
    ['10 000 caractères', () => `/resultats#1.${'A'.repeat(10_000)}`],
  ];

  for (const [name, href] of corrupted) {
    test(`lien invalide (${name}) : message en alerte, aucun chiffre ni nom`, async ({ page }) => {
      await page.goto(href());
      const alert = main(page).getByRole('alert');
      await expect(alert).toContainText(msg('results.invalid.title'));
      await expect(alert).toContainText(msg('results.invalid.body'));
      await expect(main(page)).not.toContainText('%');
      await expect(main(page)).not.toContainText(/c\d\d/);
      await expect(main(page).getByRole('link', { name: msg('results.invalid.start') })).toHaveAttribute('href', '/questionnaire');
    });
  }

  test('lien v1 alors que v2 est courante : avertissement daté, chiffres de v1, « ne se présente plus »', async ({ page }) => {
    await page.unrouteAll();
    await servePublished(page, { current: 2 });
    const state = stateFor('short', FOUR, cycle, 1);
    await openResults(page, state);
    const notice = main(page).getByRole('status').filter({ hasText: msg('results.prior.title') });
    await expect(notice).toContainText(msg('results.prior.warning', { date: '08/11/2026' }));
    await expect(notice).toContainText('1 candidat de ces résultats ne se présente plus');
    await expect(notice.getByRole('button', { name: msg('results.prior.redo') })).toBeVisible();
    await expect(notice.getByRole('link', { name: msg('results.prior.methodology') })).toHaveAttribute('href', '/methodologie');
    await expectBoard(page, state, 2);
    const withdrawn = main(page).locator(`li[data-candidate="${WITHDRAWN_IN_V2}"]`);
    await expect(withdrawn).toContainText(msg('results.withdrawn'));
    await expect(main(page).locator(`li[data-candidate="${ADDED_IN_V2}"]`)).toHaveCount(0);
  });

  test('« Refaire avec les données actuelles » : questionnaire v2, réponses reportées par identifiant', async ({ page }) => {
    await page.unrouteAll();
    await servePublished(page, { current: 2 });
    const state = stateFor('short', FOUR, cycle, 1);
    await openResults(page, state);
    await main(page).getByRole('button', { name: msg('results.prior.redo') }).click();
    await expect(page).toHaveURL(/\/questionnaire\/questions$/);
    const stored = JSON.parse((await page.evaluate((key) => window.localStorage.getItem(key), KEY))!);
    expect(stored.bankVersion).toBe(2);
    expect(stored.priorities).toEqual(FOUR);
    expect(stored.answers.filter((a: Answer) => a !== 'unanswered').length).toBeGreaterThan(0);
  });

  test('lien d’une version inconnue : invitation à recharger, fragment conservé', async ({ page }) => {
    const href = linkFor(stateFor('short', FOUR, cycle, 3));
    await page.goto(href);
    await expect(main(page)).toContainText(msg('results.unknownVersion.title'));
    await expect(main(page).getByRole('button', { name: msg('results.unknownVersion.reload') })).toBeVisible();
    await expect(main(page)).not.toContainText('%');
    expect(new URL(page.url()).hash).toBe(`#${href.split('#')[1]}`);
  });

  test('sans fragment : invitation à commencer ; carte de reprise s’il existe un brouillon', async ({ page }) => {
    await page.goto('/resultats');
    await expect(page.getByRole('heading', { level: 1, name: msg('results.empty.title') })).toBeVisible();
    await expect(main(page).getByRole('link', { name: msg('results.empty.start') })).toHaveAttribute('href', '/questionnaire');
    const draft = { format: 1, bankVersion: 1, mode: 'short', priorities: FOUR, answers: Array.from({ length: 25 }, (_, i) => (i < 3 ? 1 : 'unanswered')), position: 3, updatedAt: '2026-11-08T17:42:10.000Z' };
    await page.evaluate(([key, value]) => window.localStorage.setItem(key!, value!), [KEY, JSON.stringify(draft)]);
    await page.reload();
    await expect(main(page).getByText(msg('ui.resumeCard.title'))).toBeVisible();
    await expect(main(page).getByRole('button', { name: msg('ui.resumeCard.resume') })).toBeVisible();
  });
});

test.describe('US4 — fiche d’un candidat', () => {
  test('fiche classée : thèmes, détail par question, sources, passées, non répondues ; détail chargé à l’ouverture', async ({ page }) => {
    const detailRequests: string[] = [];
    page.on('request', (r) => {
      if (r.url().includes('/candidates/')) detailRequests.push(new URL(r.url()).pathname);
    });
    const state = stateFor('full', FOUR, (i) => (i >= 95 ? 'unanswered' : withSkips(i)));
    await openResults(page, state);
    const url = page.url();
    expect(detailRequests).toEqual([]);
    const first = expectedBoard(state).ranked[0]!.candidate.id;
    await rankingItems(page).first().getByRole('button', { name: `${msg('ui.rankingList.open')} de ${first}` }).click();
    await expect(page.getByRole('heading', { level: 1, name: first })).toBeFocused();
    expect(page.url()).toBe(url);
    // Thèmes : sujets clés d'abord, distingués en texte.
    const themes = page.getByRole('list', { name: msg('results.candidate.themes') }).locator(':scope > li');
    await expect(themes).toHaveCount(16);
    for (let i = 0; i < 4; i++) await expect(themes.nth(i)).toContainText(`Sujet clé : ${FOUR[i]}`);
    await expect(themes.nth(4)).not.toContainText('Sujet clé');
    // Une ligne de question connue : réponse, position, palier, badge, citation et lien source.
    await expect(page.getByText(msg('results.candidate.detailLoading'))).toHaveCount(0);
    const known = page.locator('li[data-question]').filter({ has: page.getByRole('link') }).first();
    await expect(known).toContainText(msg('ui.questionDetail.yourAnswer'));
    await expect(known).toContainText(msg('ui.questionDetail.agreement'));
    await expect(known).toContainText(`Citation de ${first}`);
    const link = known.getByRole('link');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(link).toHaveAttribute('href', new RegExp(`^https://exemple\\.invalid/${first}/`));
    // Position inconnue : mention du calcul.
    await expect(page.getByText(msg('ui.questionDetail.unknownNote')).first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: msg('results.candidate.skipped') })).toBeVisible();
    await expect(main(page)).toContainText('5 questions non répondues');
    expect(detailRequests).toEqual([`/data/versions/1/candidates/${first}.json`]);
    // Retour : classement, focus sur l'entrée quittée, adresse inchangée.
    await page.goBack();
    await expect(resultsHeading(page)).toBeVisible();
    await expect(page.locator(`[data-open-candidate="${first}"]`)).toBeFocused();
    expect(page.url()).toBe(url);
  });

  test('mode court : ligne « Autres thèmes »', async ({ page }) => {
    const state = stateFor('short', FOUR, cycle);
    await openResults(page, state);
    await rankingItems(page).first().locator('[data-open-candidate]').click();
    const themes = page.getByRole('list', { name: msg('results.candidate.themes') }).locator(':scope > li');
    await expect(themes).toHaveCount(5);
    await expect(themes.last()).toContainText(msg('ui.themeScoreList.others'));
  });

  test('fiche d’un candidat en données insuffisantes : ni rang ni score global', async ({ page }) => {
    const state = stateFor('short', FOUR, (i) => (i < 3 ? 1 : 'unanswered'));
    await page.goto(linkFor(state));
    await insufficientSection(page).locator('[data-open-candidate]').first().click();
    await expect(main(page)).toContainText(msg('results.candidate.insufficient'));
    await expect(main(page)).not.toContainText('Rang ');
  });

  test('bouton « Retour au classement » de la fiche', async ({ page }) => {
    await openResults(page, stateFor('short', FOUR, cycle));
    await rankingItems(page).nth(2).locator('[data-open-candidate]').click();
    await page.getByRole('button', { name: msg('results.candidate.back') }).first().click();
    await expect(resultsHeading(page)).toBeVisible();
  });
});

test.describe('US5 — comparer deux ou trois candidats', () => {
  async function toggle(page: Page, id: string) {
    await main(page).locator(`[data-compare-candidate="${id}"]`).click();
  }

  test('2 (dont un insuffisant) puis 3, 4e refusé et annoncé, retrait, retour arrière, lien inchangé', async ({ page }) => {
    await page.unrouteAll();
    await servePublished(page, { current: 2 });
    const state = stateFor('short', FOUR, cycle, 2);
    await openResults(page, state);
    const url = page.url();
    const ranked = expectedBoard(state).ranked.map((s) => s.candidate.id);
    await toggle(page, ranked[0]!);
    await toggle(page, ADDED_IN_V2);
    await expect(main(page)).toContainText(msg('results.compare.added', { name: ADDED_IN_V2 }));
    await page.getByRole('button', { name: msg('results.compare.action', { count: 2 }) }).click();
    await expect(page.getByRole('heading', { level: 1, name: msg('results.compare.title') })).toBeFocused();
    const table = page.getByRole('table');
    await expect(table.getByRole('columnheader')).toHaveText([msg('ui.comparisonTable.theme'), ranked[0]!, ADDED_IN_V2]);
    const globalRow = table.getByRole('row').filter({ has: page.getByRole('rowheader', { name: msg('ui.comparisonTable.global') }) });
    await expect(globalRow).toContainText(msg('ui.comparisonTable.insufficient'));
    await expect(table.getByRole('rowheader').nth(1)).toContainText(`Sujet clé : ${FOUR[0]}`);
    expect(page.url()).toBe(url);
    // Retour, 3e ajouté, 4e refusé.
    await page.goBack();
    await expect(resultsHeading(page)).toBeVisible();
    await toggle(page, ranked[1]!);
    const fourth = main(page).locator(`[data-compare-candidate="${ranked[2]}"]`);
    await expect(fourth).toHaveAttribute('aria-disabled', 'true');
    // aria-disabled : focalisable mais inactif ; le clic forcé ne change rien et la limite est écrite.
    await fourth.click({ force: true });
    await expect(fourth).toHaveAttribute('aria-pressed', 'false');
    await expect(main(page).getByText(msg('results.compare.limit')).first()).toBeVisible();
    await page.getByRole('button', { name: msg('results.compare.action', { count: 3 }) }).click();
    await expect(page.getByRole('table').getByRole('columnheader')).toHaveCount(4);
    // Retrait : reste ouverte à 2, retour au classement à 1.
    await page.getByRole('button', { name: msg('ui.comparisonTable.remove', { name: ADDED_IN_V2 }) }).click();
    await expect(page.getByRole('table').getByRole('columnheader')).toHaveCount(3);
    await page.getByRole('button', { name: msg('ui.comparisonTable.remove', { name: ranked[1]! }) }).click();
    await expect(resultsHeading(page)).toBeVisible();
    await expect(main(page).locator(`[data-compare-candidate="${ranked[0]}"]`)).toHaveAttribute('aria-pressed', 'true');
    expect(page.url()).toBe(url);
  });

  test('« Comparer » depuis la fiche', async ({ page }) => {
    const state = stateFor('short', FOUR, cycle);
    await openResults(page, state);
    const ranked = expectedBoard(state).ranked.map((s) => s.candidate.id);
    await toggle(page, ranked[1]!);
    await rankingItems(page).first().locator('[data-open-candidate]').click();
    await page.getByRole('button', { name: msg('results.candidate.compare') }).click();
    await page.getByRole('button', { name: msg('results.compare.action', { count: 2 }) }).click();
    await expect(page.getByRole('heading', { level: 1, name: msg('results.compare.title') })).toBeVisible();
  });

  test('320 px : comparaison en blocs, aucun défilement horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    const state = stateFor('short', FIVE, cycle);
    await openResults(page, state);
    const ranked = expectedBoard(state).ranked.map((s) => s.candidate.id);
    for (const id of ranked.slice(0, 3)) await toggle(page, id);
    await page.getByRole('button', { name: msg('results.compare.action', { count: 3 }) }).click();
    await expect(page.locator('[data-layout="blocks"]')).toBeVisible();
    await expect(page.getByRole('table')).toBeHidden();
    await noHorizontalScroll(page);
  });
});

test.describe('Transversal', () => {
  test('trafic : liste blanche d’URL, aucune ne porte la charge du fragment (SC-003)', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const urls: string[] = [];
    page.on('request', (r) => {
      urls.push(r.url());
      expect(['GET', 'HEAD'], r.url()).toContain(r.method());
      expect(r.postData(), r.url()).toBeNull();
    });
    const state = stateFor('full', FIVE, withSkips);
    const href = linkFor(state);
    const payload = href.split('#1.')[1]!;
    await openResults(page, state);
    await page.getByRole('button', { name: msg('ui.sharePanel.copy') }).click();
    await rankingItems(page).first().locator('[data-open-candidate]').click();
    await expect(page.getByRole('list', { name: msg('results.candidate.themes') })).toBeVisible();
    await page.goBack();
    const ids = expectedBoard(state).ranked.map((s) => s.candidate.id);
    await main(page).locator(`[data-compare-candidate="${ids[0]}"]`).click();
    await main(page).locator(`[data-compare-candidate="${ids[1]}"]`).click();
    await page.getByRole('button', { name: msg('results.compare.action', { count: 2 }) }).click();
    await expect(page.getByRole('heading', { level: 1, name: msg('results.compare.title') })).toBeVisible();
    expect(urls.length).toBeGreaterThan(0);
    for (const raw of urls) {
      const url = new URL(raw);
      expect(url.origin, raw).toBe('http://localhost:3000');
      // Seul paramètre admis : l'identifiant de cache des navigations du routeur Next ; aucun sur les données.
      expect([...url.searchParams.keys()].filter((k) => k !== '_rsc'), raw).toEqual([]);
      if (url.pathname.startsWith('/data/')) expect(url.search, raw).toBe('');
      expect(raw.includes(payload.slice(0, 12)), raw).toBe(false);
      expect(/^\/(_next\/|__next\.|data\/versions\.json$|data\/versions\/\d+\/main\.json$|data\/versions\/\d+\/candidates\/[a-z0-9-]+\.json$|resultats(\/|\.|$)|methodologie|questionnaire|a-propos|favicon|$)/.test(url.pathname), url.pathname).toBe(true);
    }
  });

  test('clavier seul : classement → fiche → retour → comparaison → partage, focus visible (SC-008)', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const state = stateFor('short', FOUR, cycle);
    await openResults(page, state);
    const ids = expectedBoard(state).ranked.map((s) => s.candidate.id);
    const focusOn = async (locator: Locator) => {
      for (let i = 0; i < 200; i++) {
        if (await locator.evaluate((el) => el === document.activeElement)) return;
        await page.keyboard.press('Tab');
      }
      throw new Error('élément jamais atteint au clavier');
    };
    const expectFocusVisible = async () => {
      const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
      expect(outline).not.toBe('none');
    };
    await focusOn(page.locator(`[data-open-candidate="${ids[0]}"]`));
    await expectFocusVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { level: 1, name: ids[0] })).toBeFocused();
    await focusOn(page.getByRole('button', { name: msg('results.candidate.back') }).first());
    await page.keyboard.press('Enter');
    await expect(page.locator(`[data-open-candidate="${ids[0]}"]`)).toBeFocused();
    for (const id of ids.slice(0, 2)) {
      await focusOn(page.locator(`[data-compare-candidate="${id}"]`));
      await expectFocusVisible();
      await page.keyboard.press('Space');
    }
    await focusOn(page.getByRole('button', { name: msg('results.compare.action', { count: 2 }) }));
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { level: 1, name: msg('results.compare.title') })).toBeFocused();
    await focusOn(page.getByRole('button', { name: msg('ui.sharePanel.copy') }));
    await expectFocusVisible();
    await page.keyboard.press('Enter');
    await expect(main(page).getByText(msg('ui.sharePanel.copied'))).toBeVisible();
  });

  test('contraste élevé (forced-colors) : ex æquo, sujets clés et données insuffisantes restent écrits', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.unrouteAll();
    await servePublished(page, { current: 2 });
    const state = stateFor('short', THREE, () => 0, 2);
    await openResults(page, state);
    await expect(rankingList(page).getByText(msg('ui.rankingList.tied')).first()).toBeVisible();
    await expect(insufficientSection(page).getByText(msg('ui.insufficientList.status')).first()).toBeVisible();
    await rankingItems(page).first().locator('[data-open-candidate]').click();
    await expect(page.getByRole('list', { name: msg('results.candidate.themes') }).getByText(/sujet clé/).first()).toBeVisible();
  });
});
