// À usage unique (spec 007, T017) : insère `subject:` après le bloc `themes:` de chaque question
// de `data/corpus/questions/*.yaml`, par transformation textuelle (commentaires et mise en forme
// intacts, leçon de la PR #20). Une question qui ne partage son enjeu avec aucune autre prend
// son propre identifiant comme enjeu. Idempotent : une question déjà étiquetée est laissée.
// Usage : pnpm tsx scripts/data/oneoff/2026-11-21-subjects.ts
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'data/corpus/questions');

/** Enjeux partagés par au moins deux questions (007 FR-002) ; les cas limites laissés séparés figurent dans le dossier de relecture. */
export const SHARED: Readonly<Record<string, readonly string[]>> = {
  'defense-budget-armees': ['defense-budget-armees-3-pib', 'defense-reduire-budget-armees'],
  'defense-presence-militaire-etranger': ['defense-reduire-presence-etranger', 'defense-fermer-bases-afrique'],
  'defense-exportations-armes': ['defense-controle-exportations-armes', 'defense-cesser-ventes-armes-conflits'],
  'referendum-declenchement-national': ['democratie-referendum-initiative-citoyenne', 'democratie-seuil-rip-maintenu-v2', 'democratie-referendum-reserve-elus-v2'],
  'revision-constitution-procedure': ['democratie-revision-par-congres', 'institutions-referendum-revision-constitution'],
  'assemblees-citoyennes-tirage-au-sort': ['democratie-conventions-citoyennes', 'democratie-assemblees-tirees-consultatives-v2'],
  'participations-etat': ['economie-participations-etat-industrie', 'economie-vendre-participations-etat'],
  'ecole-privee-financement-public': ['education-financement-suit-choix-familles', 'education-prive-financement-mixite'],
  'enseignants-remuneration': ['education-salaires-enseignants-15-pourcent', 'education-revalorisation-identique-pour-tous'],
  'frais-inscription-etudiants-etrangers': ['education-frais-inscription-etudiants-etrangers', 'immigration-frais-etudiants-etrangers'],
  'uniforme-ecole': ['education-uniforme-obligatoire', 'societe-uniforme-ecole-publique'],
  'eolien-implantation': ['energie-accelerer-eolien-terrestre', 'energie-suspendre-nouvelles-eoliennes'],
  'centres-donnees-implantation': ['energie-centres-donnees-electricite-renouvelable', 'numerique-faciliter-centres-donnees'],
  'impot-fortune': ['fiscalite-impot-fortune-retabli', 'fiscalite-supprimer-ifi'],
  'impot-revenu-bareme': ['fiscalite-tranche-hauts-revenus', 'fiscalite-baisse-ir-tranches-intermediaires'],
  'regularisation-sans-papiers': ['immigration-regularisation-metiers-tension', 'immigration-regularisation-cinq-ans'],
  'peines-alternatives-prison': ['justice-courtes-peines-alternatives', 'justice-tig-delits-sans-violence'],
  'arret-maladie-indemnisation': ['sante-reduire-indemnites-arret-maladie', 'travail-augmenter-jours-carence'],
  'police-usage-arme': ['securite-presomption-legitime-defense', 'securite-restreindre-tirs-refus-obtemperer'],
  'signes-religieux-interdiction': ['societe-signes-religieux-sorties-scolaires', 'societe-signes-religieux-universite'],
  'retraite-age-legal': ['travail-retraite-62-ans', 'travail-retraite-au-dela-64-ans'],
  'duree-legale-travail': ['travail-semaine-32-heures', 'travail-duree-travail-accord-entreprise'],
};

const subjectOf = new Map<string, string>();
for (const [subject, ids] of Object.entries(SHARED)) for (const id of ids) subjectOf.set(id, subject);

let labelled = 0;
const seen = new Set<string>();
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.yaml')).sort()) {
  const lines = readFileSync(path.join(DIR, file), 'utf8').split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]!);
    const m = /^- id: (\S+)$/.exec(lines[i]!);
    if (!m) continue;
    const id = m[1]!;
    seen.add(id);
    // Fin de l'entrée : prochaine ligne « - id: » ou fin de fichier.
    let end = i + 1;
    while (end < lines.length && !/^- id: /.test(lines[end]!) && !/^# /.test(lines[end]!)) end++;
    const entry = lines.slice(i + 1, end);
    if (entry.some((l) => /^ {2}subject:/.test(l))) continue;
    // Bloc `themes:` : `  themes: [a, b]` en ligne, ou `  themes:` suivi de `    - x`.
    const t = entry.findIndex((l) => /^ {2}themes:/.test(l));
    if (t < 0) throw new Error(`${id} : pas de bloc themes`);
    let last = t;
    if (/^ {2}themes:\s*$/.test(entry[t]!)) while (/^ {4}- /.test(entry[last + 1] ?? '')) last++;
    for (let k = i + 1; k <= i + 1 + last; k++) out.push(lines[k]!);
    out.push(`  subject: ${subjectOf.get(id) ?? id}`);
    i += 1 + last;
    labelled++;
  }
  writeFileSync(path.join(DIR, file), out.join('\n'));
}
for (const id of subjectOf.keys()) if (!seen.has(id)) throw new Error(`enjeu partagé : question inconnue ${id}`);
console.log(`${labelled} questions étiquetées`);
