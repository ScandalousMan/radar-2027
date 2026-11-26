import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { GlossaryProvider } from '@/lib/glossary/GlossaryProvider';
import { QuestionCard, type QuestionCardProps } from './QuestionCard';

function Controlled(props: QuestionCardProps) {
  const [value, setValue] = useState(props.value);
  return (
    <QuestionCard
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

const meta = {
  title: 'UI/QuestionCard',
  component: QuestionCard,
  render: (args) => <Controlled {...args} />,
  args: {
    position: 0,
    total: 25,
    statement: 'L’État doit construire davantage de logements sociaux, y compris dans les communes qui n’en veulent pas.',
    themes: [{ id: 'logement', label: 'Logement', priority: false }],
    value: null,
    disabled: false,
    onChange: fn(),
    onCommit: fn(),
  },
} satisfies Meta<typeof QuestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SansReponse: Story = { name: 'Sans réponse' };
export const MoinsDeux: Story = { name: 'Réponse −2', args: { value: -2 } };
export const MoinsUn: Story = { name: 'Réponse −1', args: { value: -1 } };
export const Zero: Story = { name: 'Réponse 0', args: { value: 0 } };
export const PlusUn: Story = { name: 'Réponse +1', args: { value: 1 } };
export const PlusDeux: Story = { name: 'Réponse +2', args: { value: 2 } };
export const Passee: Story = { name: 'Passée', args: { value: 'skipped' } };
export const DeuxThemesDontUnCle: Story = {
  name: 'Deux thèmes dont un clé',
  args: {
    themes: [
      { id: 'sante', label: 'Santé', priority: true },
      { id: 'logement', label: 'Logement', priority: false },
    ],
  },
};
export const AvecAide: Story = {
  name: 'Avec aide',
  args: { hint: '« Neutre / sans avis » compte comme une réponse au milieu de l’échelle ; « Passer » retire la question du calcul.' },
};
export const Desactivee: Story = { name: 'Désactivée', args: { value: 1, disabled: true } };
export const Etroit320: Story = {
  name: 'Étroit 320 px',
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  args: {
    value: 'skipped',
    themes: [
      { id: 'ecologie', label: 'Transition écologique et énergie', priority: true },
      { id: 'economie', label: 'Économie et emploi', priority: false },
    ],
  },
};

const GLOSSARY = {
  updatedAt: '2026-11-22',
  terms: [
    {
      id: 'aide-medicale-etat',
      label: "aide médicale de l'État",
      forms: ["aide médicale de l'État", 'AME'],
      definition:
        'Dispositif qui prend en charge les frais de santé des étrangers en situation irrégulière résidant en France depuis plus de trois mois, sous conditions de ressources.',
      sources: [{ url: 'https://www.service-public.fr/particuliers/vosdroits/F3079', title: 'Aide médicale de l’État (AME)', publisher: 'Service-Public.fr' }],
    },
  ],
};

const withGlossary: Decorator = (Story) => (
  <GlossaryProvider glossary={GLOSSARY}>
    <Story />
  </GlossaryProvider>
);

const openTerm: Story['play'] = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: 'aide médicale de l’État' }));
  await expect(within(canvasElement.ownerDocument.body).getByRole('dialog')).toBeVisible();
};

const termStatement = 'Il faut supprimer l’aide médicale de l’État et la remplacer par une aide limitée aux soins urgents.';

export const AvecTermeDefini: Story = { name: 'Avec terme défini', decorators: [withGlossary], args: { statement: termStatement } };
export const AvecTermeDefiniOuvert: Story = {
  name: 'Avec terme défini, bulle ouverte',
  decorators: [withGlossary],
  args: { statement: termStatement },
  play: openTerm,
};
export const AvecTermeDefiniEtroit: Story = {
  name: 'Avec terme défini, 320 px',
  decorators: [withGlossary],
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  args: { statement: termStatement },
  play: openTerm,
};
