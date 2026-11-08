import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { ThemePicker, type ThemePickerProps } from './ThemePicker';

const OPTIONS = [
  { id: 'logement', label: 'Logement' },
  { id: 'sante', label: 'Santé' },
  { id: 'education', label: 'Éducation' },
  { id: 'ecologie', label: 'Transition écologique et énergie' },
  { id: 'securite', label: 'Sécurité et justice' },
  { id: 'economie', label: 'Économie et emploi' },
  { id: 'europe', label: 'Europe et international' },
  { id: 'institutions', label: 'Institutions et démocratie' },
];

function Controlled(props: ThemePickerProps) {
  const [value, setValue] = useState(props.value);
  return (
    <ThemePicker
      {...props}
      value={value}
      onChange={(next, meta) => {
        setValue(next);
        props.onChange(next, meta);
      }}
    />
  );
}

const meta = {
  title: 'UI/ThemePicker',
  component: ThemePicker,
  render: (args) => <Controlled {...args} />,
  args: {
    options: OPTIONS,
    value: [],
    min: 3,
    max: 5,
    legend: 'Quels sujets comptent le plus pour vous ? (3 à 5)',
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof ThemePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vide: Story = {};

export const PartielInvalide: Story = {
  name: 'Partiel invalide (2 sujets)',
  args: { value: ['logement', 'sante'] },
};

export const Valide: Story = {
  args: { value: ['logement', 'sante', 'education'] },
};

export const MaximumAtteint: Story = {
  name: 'Maximum atteint (5 sujets)',
  args: { value: ['logement', 'sante', 'education', 'ecologie', 'securite'] },
};

export const Desactive: Story = {
  name: 'Désactivé',
  args: { value: ['logement', 'sante', 'education'], disabled: true },
};

export const Etroit320: Story = {
  name: 'Étroit 320 px',
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  args: { value: ['logement', 'ecologie'] },
};

export const AvecDescriptions: Story = {
  name: 'Avec descriptions',
  args: {
    value: ['logement'],
    options: [
      { id: 'logement', label: 'Logement', description: 'Accès au logement, loyers, construction et logement social.' },
      { id: 'sante', label: 'Santé', description: 'Hôpital, médecine de ville, accès aux soins et prévention.' },
      { id: 'ecologie', label: 'Transition écologique et énergie', description: 'Climat, énergie, biodiversité et transports.' },
      { id: 'securite', label: 'Sécurité et justice', description: 'Police, justice, prisons et prévention de la délinquance.' },
    ],
  },
};
