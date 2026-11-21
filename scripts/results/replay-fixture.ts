// Génère `src/lib/results/replay-v<n>.fixture.json` (T040 de 006, généralisé par T001 de 007) :
// 20 fragments de partage v<n> encodés avec le codec sur la banque `public/data/versions/<n>`,
// chacun avec son résultat attendu calculé par le chemin de résultats réel (`loadResults`).
// À lancer AVANT toute publication de version suivante ; refuse de tourner si la version
// courante n'est pas n. Chaque version a sa graine (v1 : 20271116, inchangée).
// Usage : pnpm tsx scripts/results/replay-fixture.ts --version <n>
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { bankFromDataset, encodeFragment, selectQuestions, type Answer, type MainDataset, type Mode, type ResultState } from '@/core';
import { loadResults } from '@/lib/results/load';
import { diskFetcher, snapshotBoard } from '@/lib/results/replay-snapshot';

const ROOT = process.cwd();
const ORIGIN = 'https://radar.exemple';

// Générateur pseudo-aléatoire déterministe (mulberry32) : fixture reproductible.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES: readonly (readonly Answer[])[] = [
  [-2, -1, 0, 1, 2], // uniforme
  [-2, -1, 0, 1, 2, 'skipped'], // avec « sans avis »
  [2, 2, 1, 0, 'skipped'], // plutôt d'accord
  [-2, -2, -1, 0, 'skipped', 'skipped'], // plutôt contre, beaucoup de « sans avis »
];

function versionArg(): number {
  const i = process.argv.indexOf('--version');
  const n = i >= 0 ? Number(process.argv[i + 1]) : NaN;
  if (!Number.isInteger(n) || n < 1) throw new Error('usage : replay-fixture.ts --version <n>');
  return n;
}

// Graine propre à chaque version ; v1 garde la graine historique pour une régénération identique.
const seedFor = (version: number) => (version === 1 ? 2027_1116 : 2027_1100 + version);

async function main() {
  const version = versionArg();
  const OUT = path.join(ROOT, `src/lib/results/replay-v${version}.fixture.json`);
  const registry = JSON.parse(await readFile(path.join(ROOT, 'public/data/versions.json'), 'utf8')) as { current: number };
  if (registry.current !== version) throw new Error(`version courante ${registry.current} : la fixture v${version} doit être produite avant la publication de la version ${version + 1}`);
  const dataset = JSON.parse(await readFile(path.join(ROOT, `public/data/versions/${version}/main.json`), 'utf8')) as MainDataset;
  const bank = bankFromDataset(dataset);
  const ids = bank.themes.map((t) => t.id);
  const next = rng(seedFor(version));
  const fetcher = diskFetcher(ROOT);

  const cases = [];
  for (let i = 0; i < 20; i++) {
    const mode: Mode = i % 2 === 0 ? 'full' : 'short';
    const count = 3 + (i % 3);
    const pool = [...ids];
    const priorities: string[] = [];
    while (priorities.length < count) priorities.push(pool.splice(Math.floor(next() * pool.length), 1)[0]!);
    priorities.sort();
    const palette = PALETTES[i % PALETTES.length]!;
    const n = selectQuestions(bank, mode, priorities).items.length;
    const answers = Array.from({ length: n }, () => palette[Math.floor(next() * palette.length)]!);
    // Cas 19 : uniquement « sans avis » (aucune réponse numérique).
    const state: ResultState = { bankVersion: version, mode, priorities, answers: i === 19 ? answers.map(() => 'skipped' as const) : answers };
    const fragment = encodeFragment(state, bank);
    const page = await loadResults(fragment, ORIGIN, fetcher);
    if (page.status !== 'ready') throw new Error(`cas ${i} : ${page.status}`);
    cases.push({
      id: `v${version}-${String(i + 1).padStart(2, '0')}`,
      fragment,
      mode,
      priorities,
      questionCount: n,
      skipped: state.answers.filter((a) => a === 'skipped').length,
      expected: snapshotBoard(page.data.board),
    });
  }

  const fixture = {
    generatedAt: new Date().toISOString().slice(0, 10),
    method:
      `scripts/results/replay-fixture.ts --version ${version}, avant toute publication de la version ${version + 1} (versions.json : current = ${version}). États tirés par un générateur déterministe (mulberry32, graine ${seedFor(version)}) : modes alternés complet/court, 3 à 5 sujets prioritaires distincts, réponses −2…2 et « sans avis » selon quatre palettes, un cas entièrement « sans avis ». Fragments produits par encodeFragment (codec 003) sur la banque public/data/versions/${version} ; résultats attendus produits par loadResults (src/lib/results/load.ts) lisant public/data sur le disque, réduits par snapshotBoard (rationnels exacts num/den).`,
    bankVersion: version,
    bankMainHash: (JSON.parse(await readFile(path.join(ROOT, 'public/data/versions.json'), 'utf8')) as { versions: { number: number; mainHash: string }[] }).versions.find((v) => v.number === version)!.mainHash,
    cases,
  };
  await writeFile(OUT, `${JSON.stringify(fixture, null, 2)}\n`);
  console.log(`${cases.length} liens v${version} écrits dans ${path.relative(ROOT, OUT)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
