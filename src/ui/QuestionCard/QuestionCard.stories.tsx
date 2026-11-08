import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
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
