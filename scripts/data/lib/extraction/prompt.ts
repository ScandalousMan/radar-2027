// Consignes versionnées de l'extraction (FR-025) : nom de fichier + empreinte du contenu.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { allQuestions } from '../corpus';
import type { Corpus } from '../schema';
import { sha256 } from '../text';

export type Prompt = { name: string; hash: string; text: string };

export const PROMPT_NAME = 'extraction.v1';

export function loadPrompt(dir: string = join(process.cwd(), 'scripts', 'data', 'prompts'), name: string = PROMPT_NAME): Prompt {
  const text = readFileSync(join(dir, `${name}.md`), 'utf8');
  return { name, hash: sha256(text), text };
}

/** Questions actives triées par identifiant (la banque soumise au modèle). */
export function activeQuestions(corpus: Corpus) {
  return allQuestions(corpus)
    .map(({ question }) => question)
    .filter((q) => q.status === 'active')
    .sort((a, b) => (a.id < b.id ? -1 : 1));
}

/** Consignes complétées : thèmes, banque active, grille de neutralité. */
export function renderSystem(prompt: Prompt, corpus: Corpus): string {
  const themes = [...corpus.themes]
    .filter((t) => t.status === 'active')
    .sort((a, b) => a.order - b.order)
    .map((t) => `- ${t.id} : ${t.label}. ${t.description} Axe : « ${t.axis.negative} » (négatif) ⟷ « ${t.axis.positive} » (positif).`)
    .join('\n');
  const questions = activeQuestions(corpus)
    .map((q) => `- ${q.id} [${q.themes.join(', ')}] (polarité ${q.polarity}) : ${q.text}`)
    .join('\n');
  const checklist = (corpus.governance?.neutralityChecklist ?? []).map((c) => `- ${c.text}`).join('\n');
  return prompt.text.replace('{{themes}}', themes).replace('{{questions}}', questions).replace('{{neutralityChecklist}}', checklist);
}
