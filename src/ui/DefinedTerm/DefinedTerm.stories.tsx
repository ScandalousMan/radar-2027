import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DefinedTerm } from './DefinedTerm';
import { DefinedTermGroup } from './DefinedTermGroup';

const AME = {
  id: 'aide-medicale-etat',
  label: "aide médicale de l'État",
  definition: 'Dispositif qui prend en charge les frais de santé des étrangers en situation irrégulière résidant en France depuis plus de trois mois, sous conditions de ressources.',
  sources: [{ url: 'https://www.service-public.fr/particuliers/vosdroits/F3079', title: 'Aide médicale de l’État (AME)', publisher: 'Service-Public.fr' }],
};

const LONG = {
  ...AME,
  definition: `${AME.definition} ${AME.definition} Elle est distincte de la protection universelle maladie, qui concerne les personnes en situation régulière.`.slice(0, 280),
  sources: [...AME.sources, { url: 'https://www.ameli.fr/assure/droits-demarches/situations-particulieres/situation-irreguliere-ame', title: 'Situation irrégulière : l’AME', publisher: 'ameli.fr' }],
};

const SOL = {
  id: 'droit-du-sol',
  label: 'droit du sol',
  definition: 'Principe selon lequel la naissance sur le territoire d’un État ouvre droit à sa nationalité, à des conditions fixées par la loi.',
  sources: [{ url: 'https://www.vie-publique.fr/', title: 'Nationalité française', publisher: 'Vie-publique.fr' }],
};

const meta = {
  title: 'UI/DefinedTerm',
  component: DefinedTerm,
  args: { term: AME, glossaryHref: '/glossaire#aide-medicale-etat', children: 'AME' },
  render: (args) => (
    <h2 className="text-2xl font-semibold tracking-tight break-words">
      Faut-il supprimer l’<DefinedTerm {...args} /> et la remplacer par une aide d’urgence ?
    </h2>
  ),
} satisfies Meta<typeof DefinedTerm>;

export default meta;
type Story = StoryObj<typeof meta>;

const openBubble: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'AME' }));
  const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog');
  await expect(dialog).toBeVisible();
};

export const Ferme: Story = { name: 'Fermé' };

export const Ouvert: Story = { name: 'Ouvert', play: openBubble };

export const DefinitionLongue: Story = { name: 'Définition longue', args: { term: LONG }, play: openBubble };

export const Etroit320: Story = {
  name: 'Étroit 320 px',
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  play: openBubble,
};

export const Sombre: Story = { name: 'Thème sombre', globals: { theme: 'sombre' }, play: openBubble };

export const DeuxTermes: Story = {
  name: 'Deux termes dans une phrase',
  render: () => (
    <DefinedTermGroup>
      <p className="text-lg">
        Faut-il supprimer l’
        <DefinedTerm term={AME} glossaryHref="/glossaire#aide-medicale-etat">
          AME
        </DefinedTerm>{' '}
        et restreindre le{' '}
        <DefinedTerm term={SOL} glossaryHref="/glossaire#droit-du-sol">
          droit du sol
        </DefinedTerm>{' '}
        ?
      </p>
    </DefinedTermGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'AME' }));
    await userEvent.click(canvas.getByRole('button', { name: 'droit du sol' }));
    const dialogs = within(canvasElement.ownerDocument.body).getAllByRole('dialog');
    await expect(dialogs).toHaveLength(1);
  },
};
