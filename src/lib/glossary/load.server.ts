// Lecture du glossaire au build (009, R11), pour la page `/glossaire` seulement.
// Seul module du glossaire à importer `node:fs`.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { GlossarySchema, type Glossary } from '@/core/dataset';

export const GLOSSARY_FILE = join(process.cwd(), 'public', 'data', 'glossary.json');

/** Glossaire publié et valide, `null` si le fichier est absent ou invalide. */
export function readGlossaryAtBuild(file: string = GLOSSARY_FILE): Glossary | null {
  if (!existsSync(file)) return null;
  try {
    const parsed = GlossarySchema.safeParse(JSON.parse(readFileSync(file, 'utf8')));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
