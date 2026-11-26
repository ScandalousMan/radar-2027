// Repérage des termes définis dans un énoncé (spec 009, R10, contrat defined-term-ui.md § Repérage).
// Fonction pure, hors du cœur métier : elle ne touche ni la sélection, ni le score, ni le lien (FR-021).
//
// Règles :
// - comparaison après normalisation : apostrophe typographique ’ → ', espaces insécables → espace,
//   formes en NFC ; insensible à la casse sur la première lettre seulement (« Droit du sol » = « droit
//   du sol », mais « AME » ≠ « âme ») ;
// - une forme n'est retenue que bordée par un caractère qui n'est ni lettre, ni chiffre, ni marque
//   combinante (ou par le début / la fin du texte) ;
// - parcours de gauche à droite, forme la plus longue d'abord ; le texte couvert est consommé ;
//   un terme déjà signalé dans l'énoncé ne l'est plus (son texte reste du texte brut) ;
// - les segments conservent le texte original : leur concaténation redonne exactement l'énoncé.

export type GlossaryTermForms = { readonly id: string; readonly forms: readonly string[] };

export type Segment = { readonly kind: 'text'; readonly text: string } | { readonly kind: 'term'; readonly text: string; readonly termId: string };

type Entry = { readonly form: string; readonly termId: string };

/** Index compilé une fois par glossaire : formes normalisées groupées par initiale (minuscule). */
export type GlossaryIndex = { readonly byInitial: ReadonlyMap<string, readonly Entry[]>; readonly size: number };

const WORD_CHAR = /[\p{L}\p{N}\p{M}]/u;

/** Normalisation d'un caractère, qui préserve la longueur (une unité de code → une unité de code). */
function mapChar(c: string): string {
  if (c === '’' || c === 'ʼ') return "'";
  if (c === ' ' || c === ' ' || c === ' ') return ' ';
  return c;
}

function mapString(s: string): string {
  let out = '';
  for (const c of s) out += c.length === 1 ? mapChar(c) : c;
  return out;
}

function lowerFirst(s: string): string {
  const first = String.fromCodePoint(s.codePointAt(0)!);
  return first.toLocaleLowerCase('fr') + s.slice(first.length);
}

/**
 * Clé de comparaison d'une forme : NFC, apostrophes et espaces ramenés, espaces de bord retirés,
 * première lettre en minuscule. Deux formes de même clé sont en conflit (règle GLOSS).
 */
export function normalizeForm(form: string): string {
  const mapped = mapString(form.normalize('NFC')).trim();
  return mapped === '' ? '' : lowerFirst(mapped);
}

export function compileGlossary(terms: readonly GlossaryTermForms[]): GlossaryIndex {
  const byInitial = new Map<string, Entry[]>();
  let size = 0;
  for (const term of terms) {
    for (const raw of term.forms) {
      const form = normalizeForm(raw);
      if (form === '') continue;
      const initial = String.fromCodePoint(form.codePointAt(0)!);
      const list = byInitial.get(initial) ?? [];
      list.push({ form, termId: term.id });
      byInitial.set(initial, list);
      size += 1;
    }
  }
  // Forme la plus longue d'abord ; à longueur égale, ordre stable par forme puis identifiant.
  for (const list of byInitial.values()) list.sort((a, b) => b.form.length - a.form.length || (a.form < b.form ? -1 : a.form > b.form ? 1 : a.termId < b.termId ? -1 : 1));
  return { byInitial, size };
}

function isWordCharBefore(text: string, pos: number): boolean {
  if (pos <= 0) return false;
  let start = pos - 1;
  const code = text.charCodeAt(start);
  if (code >= 0xdc00 && code <= 0xdfff && start > 0) start -= 1;
  return WORD_CHAR.test(String.fromCodePoint(text.codePointAt(start)!));
}

function isWordCharAt(text: string, pos: number): boolean {
  if (pos >= text.length) return false;
  return WORD_CHAR.test(String.fromCodePoint(text.codePointAt(pos)!));
}

/** La forme normalisée `form` correspond-elle au texte à partir de `pos` (bornes comprises) ? */
function matchesAt(text: string, pos: number, form: string): boolean {
  if (pos + form.length > text.length) return false;
  const first = String.fromCodePoint(form.codePointAt(0)!);
  const head = text.slice(pos, pos + first.length);
  if (mapString(head).toLocaleLowerCase('fr') !== first) return false;
  for (let k = first.length; k < form.length; k++) {
    if (mapChar(text[pos + k]!) !== form[k]) return false;
  }
  return !isWordCharAt(text, pos + form.length);
}

export function annotate(text: string, index: GlossaryIndex): readonly Segment[] {
  if (index.size === 0 || text === '') return [{ kind: 'text', text }];
  const segments: Segment[] = [];
  const used = new Set<string>();
  let buffer = '';
  let i = 0;
  while (i < text.length) {
    const cp = text.codePointAt(i)!;
    const char = String.fromCodePoint(cp);
    if (!isWordCharBefore(text, i)) {
      const candidates = index.byInitial.get(mapString(char).toLocaleLowerCase('fr'));
      const match = candidates?.find((entry) => matchesAt(text, i, entry.form));
      if (match) {
        const covered = text.slice(i, i + match.form.length);
        if (used.has(match.termId)) {
          buffer += covered;
        } else {
          if (buffer) segments.push({ kind: 'text', text: buffer });
          buffer = '';
          segments.push({ kind: 'term', text: covered, termId: match.termId });
          used.add(match.termId);
        }
        i += match.form.length;
        continue;
      }
    }
    buffer += char;
    i += char.length;
  }
  if (buffer || segments.length === 0) segments.push({ kind: 'text', text: buffer });
  return segments;
}
