// Extraction du texte d'une source téléchargée (research.md R6) : HTML via Readability sur un
// DOM linkedom (repli sur le texte du body), PDF via unpdf, texte brut tel quel. Le résultat
// n'est pas normalisé ici : l'appelant applique `normalize` avant d'empreinter.
import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';

export function textFromHtml(html: string, url: string): string {
  const { document } = parseHTML(html);
  try {
    // Readability modifie le document : on lui passe un clone.
    const article = new Readability(document.cloneNode(true) as unknown as ConstructorParameters<typeof Readability>[0], { charThreshold: 200 }).parse();
    const text = article?.textContent?.trim();
    if (text) return text;
  } catch {
    // repli ci-dessous
  }
  void url;
  for (const el of document.querySelectorAll('script, style, noscript, template')) el.remove();
  return (document.body?.textContent ?? document.documentElement?.textContent ?? '').trim();
}

export async function textFromPdf(bytes: Uint8Array): Promise<string> {
  const { extractText } = await import('unpdf');
  const { text } = await extractText(new Uint8Array(bytes), { mergePages: true });
  return text;
}

export type SourceKindOfContent = 'html' | 'pdf' | 'text';

/** Aiguillage par type de contenu, extension de l'URL puis signature des octets. */
export function detectContent(bytes: Uint8Array, contentType: string | null, url: string): SourceKindOfContent {
  const ct = (contentType ?? '').toLowerCase();
  if (ct.includes('pdf')) return 'pdf';
  if (ct.includes('html') || ct.includes('xml')) return 'html';
  if (/\.pdf($|[?#])/i.test(url)) return 'pdf';
  if (bytes.length >= 5 && String.fromCharCode(...bytes.subarray(0, 5)) === '%PDF-') return 'pdf';
  if (/\.html?($|[?#])/i.test(url)) return 'html';
  const head = new TextDecoder().decode(bytes.subarray(0, 512)).trimStart().toLowerCase();
  if (head.startsWith('<!doctype html') || head.startsWith('<html')) return 'html';
  return 'text';
}

export async function textFromBuffer(bytes: Uint8Array, contentType: string | null, url: string): Promise<string> {
  switch (detectContent(bytes, contentType, url)) {
    case 'pdf':
      return textFromPdf(bytes);
    case 'html':
      return textFromHtml(new TextDecoder().decode(bytes), url);
    default:
      return new TextDecoder().decode(bytes);
  }
}
