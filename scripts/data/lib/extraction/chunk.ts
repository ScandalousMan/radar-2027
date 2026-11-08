// Découpage du texte normalisé en tranches (R7) : ~12 000 caractères, chevauchement de 500,
// coupure de préférence après une fin de phrase.
export type Chunk = { text: string; offset: number };

export function chunkText(text: string, { size = 12_000, overlap = 500 }: { size?: number; overlap?: number } = {}): Chunk[] {
  if (text.length === 0) return [];
  if (overlap >= size) throw new Error('le chevauchement doit être inférieur à la taille des tranches');
  const chunks: Chunk[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(text.length, start + size);
    if (end < text.length) {
      const window = text.slice(start + Math.floor(size / 2), end);
      const cut = Math.max(window.lastIndexOf('. '), window.lastIndexOf('? '), window.lastIndexOf('! '));
      if (cut >= 0) end = start + Math.floor(size / 2) + cut + 2;
    }
    chunks.push({ text: text.slice(start, end), offset: start });
    if (end >= text.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks;
}
