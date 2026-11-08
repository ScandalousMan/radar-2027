// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { detectContent, textFromBuffer, textFromHtml } from './extract-text';

const enc = (s: string) => new TextEncoder().encode(s);

const article = `<!doctype html><html><head><title>Programme</title><script>var x = 1;</script></head>
<body><nav>Menu Accueil Contact</nav><main><article><h1>Notre programme</h1>
<p>${'Nous revaloriserons le SMIC de 10 % dès l’été 2027. '.repeat(8)}</p>
<p>${'La santé sera une priorité nationale pour tous les territoires. '.repeat(8)}</p>
</article></main><footer>Mentions légales</footer></body></html>`;

describe('extraction de texte (R6)', () => {
  it('HTML : garde le contenu de l’article, sans script', () => {
    const text = textFromHtml(article, 'https://exemple.fr/programme');
    expect(text).toContain('Nous revaloriserons le SMIC');
    expect(text).not.toContain('var x');
  });

  it('HTML minimal : repli sur le texte du body', () => {
    expect(textFromHtml('<html><body><p>Court.</p><script>x()</script></body></html>', 'https://e.fr')).toBe('Court.');
  });

  it('aiguillage par type de contenu, extension et signature', () => {
    expect(detectContent(enc('x'), 'application/pdf', 'https://e.fr/a')).toBe('pdf');
    expect(detectContent(enc('x'), null, 'https://e.fr/a.pdf')).toBe('pdf');
    expect(detectContent(enc('%PDF-1.7'), null, 'https://e.fr/a')).toBe('pdf');
    expect(detectContent(enc('<html></html>'), 'text/html; charset=utf-8', 'https://e.fr/a')).toBe('html');
    expect(detectContent(enc('<!DOCTYPE html><html>'), null, 'https://e.fr/a')).toBe('html');
    expect(detectContent(enc('Texte brut'), 'text/plain', 'https://e.fr/a.txt')).toBe('text');
  });

  it('texte brut tel quel', async () => {
    expect(await textFromBuffer(enc('Bonjour.'), 'text/plain', 'https://e.fr/a.txt')).toBe('Bonjour.');
  });
});
