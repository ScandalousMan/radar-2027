import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { DefinedTerm } from './DefinedTerm';
import { DefinedTermGroup } from './DefinedTermGroup';

const AME = {
  id: 'aide-medicale-etat',
  label: "aide médicale de l'État",
  definition: 'Dispositif de prise en charge des soins des étrangers en situation irrégulière, sous conditions.',
  sources: [{ url: 'https://www.service-public.fr/particuliers/vosdroits/F3079', title: 'Aide médicale de l’État', publisher: 'Service-Public.fr' }],
};
const SOL = {
  id: 'droit-du-sol',
  label: 'droit du sol',
  definition: 'Règle d’acquisition de la nationalité liée à la naissance sur le territoire.',
  sources: [{ url: 'https://www.vie-publique.fr/', title: 'Nationalité', publisher: 'Vie-publique.fr' }],
};

beforeAll(() => {
  // Tokens lus par le composant (tokens.css n'est pas chargé par jsdom).
  const style = document.createElement('style');
  style.textContent = ':root { --defined-term-open-delay: 300ms; --defined-term-close-delay: 200ms; --defined-term-gutter: 16px; --defined-term-max-width: 320px; --defined-term-offset: 4px; }';
  document.head.appendChild(style);
});

function renderTerm() {
  return renderWithIntl(
    <p>
      Faut-il supprimer l’
      <DefinedTerm term={AME} glossaryHref="/glossaire#aide-medicale-etat">
        AME
      </DefinedTerm>{' '}
      ? <button type="button">Ailleurs</button>
    </p>,
  );
}

const term = () => screen.getByRole('button', { name: 'AME' });
const bubble = () => screen.queryByRole('dialog');

describe('DefinedTerm — clic et clavier', () => {
  it('un clic ouvre puis referme la bulle', async () => {
    const user = userEvent.setup();
    renderTerm();
    expect(term()).toHaveAttribute('aria-expanded', 'false');
    await user.click(term());
    expect(bubble()).toBeInTheDocument();
    expect(term()).toHaveAttribute('aria-expanded', 'true');
    await user.click(term());
    expect(bubble()).not.toBeInTheDocument();
  });

  it.each(['{Enter}', ' '])('la touche %s ouvre la bulle', async (key) => {
    const user = userEvent.setup();
    renderTerm();
    term().focus();
    await user.keyboard(key);
    expect(bubble()).toBeInTheDocument();
  });

  it('Échap ferme et rend le focus au terme', async () => {
    const user = userEvent.setup();
    renderTerm();
    await user.click(term());
    await user.tab();
    expect(bubble()).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard('{Escape}');
    expect(bubble()).not.toBeInTheDocument();
    expect(term()).toHaveFocus();
  });

  it('le bouton Fermer ferme et rend le focus au terme', async () => {
    const user = userEvent.setup();
    renderTerm();
    await user.click(term());
    await user.click(screen.getByRole('button', { name: fr.glossary.close }));
    expect(bubble()).not.toBeInTheDocument();
    expect(term()).toHaveFocus();
  });

  it('un pointerdown extérieur ferme sans annuler le geste', async () => {
    const user = userEvent.setup();
    renderTerm();
    await user.click(term());
    const elsewhere = screen.getByRole('button', { name: 'Ailleurs' });
    const allowed = fireEvent.pointerDown(elsewhere);
    expect(allowed).toBe(true);
    expect(bubble()).not.toBeInTheDocument();
  });

  it('la sortie du focus ferme la bulle', async () => {
    const user = userEvent.setup();
    renderTerm();
    term().focus();
    await user.keyboard('{Enter}');
    expect(bubble()).toBeInTheDocument();
    act(() => screen.getByRole('button', { name: 'Ailleurs' }).focus());
    expect(bubble()).not.toBeInTheDocument();
  });

  it('un clic dans la bulle ne la ferme pas', async () => {
    const user = userEvent.setup();
    renderTerm();
    await user.click(term());
    await user.click(screen.getByText(AME.definition));
    expect(bubble()).toBeInTheDocument();
  });

  it('le démontage ferme la bulle', async () => {
    const user = userEvent.setup();
    const { unmount } = renderTerm();
    await user.click(term());
    unmount();
    expect(bubble()).not.toBeInTheDocument();
  });
});

describe('DefinedTerm — survol à la souris', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  // React dérive onPointerEnter/Leave de pointerover/pointerout ; userEvent attend des timers réels.
  const hover = (el: Element) => fireEvent.pointerOver(el, { pointerType: 'mouse' });
  const unhover = (el: Element, to?: Element) => fireEvent.pointerOut(el, { pointerType: 'mouse', relatedTarget: to ?? document.body });

  it('ouvre après 300 ms, ferme 200 ms après la sortie', () => {
    renderTerm();
    hover(term());
    act(() => void vi.advanceTimersByTime(299));
    expect(bubble()).not.toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(1));
    expect(bubble()).toBeInTheDocument();
    // Le pointeur passe sur la bulle : elle reste ouverte.
    unhover(term(), bubble()!);
    hover(bubble()!);
    act(() => void vi.advanceTimersByTime(500));
    expect(bubble()).toBeInTheDocument();
    unhover(bubble()!);
    act(() => void vi.advanceTimersByTime(199));
    expect(bubble()).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(1));
    expect(bubble()).not.toBeInTheDocument();
  });

  it('un clic sur une bulle ouverte par survol la fixe, un second clic la ferme', () => {
    renderTerm();
    hover(term());
    act(() => void vi.advanceTimersByTime(300));
    fireEvent.click(term());
    expect(bubble()).toBeInTheDocument();
    unhover(term());
    act(() => void vi.advanceTimersByTime(1000));
    expect(bubble()).toBeInTheDocument();
    fireEvent.click(term());
    expect(bubble()).not.toBeInTheDocument();
  });

  it('le toucher n’ouvre pas au survol', () => {
    renderTerm();
    fireEvent.pointerOver(term(), { pointerType: 'touch' });
    act(() => void vi.advanceTimersByTime(1000));
    expect(bubble()).not.toBeInTheDocument();
  });
});

describe('DefinedTerm — groupe, attributs et contenu', () => {
  it('une seule bulle ouverte dans un groupe', async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <DefinedTermGroup>
        <p>
          <DefinedTerm term={AME} glossaryHref="/glossaire#aide-medicale-etat">
            AME
          </DefinedTerm>{' '}
          et{' '}
          <DefinedTerm term={SOL} glossaryHref="/glossaire#droit-du-sol">
            droit du sol
          </DefinedTerm>
        </p>
      </DefinedTermGroup>,
    );
    await user.click(screen.getByRole('button', { name: 'AME' }));
    // Le clic sur le second terme ferme la première bulle (geste extérieur) et ouvre la seconde.
    await user.click(screen.getByRole('button', { name: 'droit du sol' }));
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByRole('dialog', { name: SOL.label })).toBeInTheDocument();
  });

  it('expose les attributs ARIA du toggletip', async () => {
    const user = userEvent.setup();
    renderTerm();
    expect(term()).toHaveAccessibleDescription(fr.glossary.definedTerm);
    await user.click(term());
    const dialog = screen.getByRole('dialog', { name: AME.label });
    expect(term()).toHaveAttribute('aria-controls', dialog.id);
    expect(dialog).toHaveAttribute('popover', 'manual');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('affiche libellé, définition, source et lien vers le glossaire', async () => {
    const user = userEvent.setup();
    renderTerm();
    await user.click(term());
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent(AME.label);
    expect(dialog).toHaveTextContent(AME.definition);
    const source = screen.getByRole('link', { name: new RegExp(AME.sources[0]!.title) });
    expect(source).toHaveAttribute('href', AME.sources[0]!.url);
    expect(source).toHaveAttribute('target', '_blank');
    expect(source.getAttribute('rel')).toContain('noopener');
    expect(screen.getByRole('link', { name: fr.glossary.seeGlossary })).toHaveAttribute('href', '/glossaire#aide-medicale-etat');
  });
});
