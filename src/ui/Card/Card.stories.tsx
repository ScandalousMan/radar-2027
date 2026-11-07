import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  args: {
    children: 'Le score global ne dépasse jamais l’accord sur vos sujets clés.',
    interactive: false,
  },
  argTypes: {
    header: { control: 'text' },
    footer: { control: 'text' },
    href: { control: 'text' },
    onClick: { action: 'activation' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Repos: Story = {};

export const AvecEnTete: Story = {
  name: 'Avec en-tête',
  args: { header: 'Méthode de calcul' },
};

export const AvecPied: Story = {
  name: 'Avec pied',
  args: { footer: 'Source : programme officiel, consulté le 6 novembre 2026' },
};

export const Complete: Story = {
  name: 'En-tête, corps et pied',
  args: { header: 'Méthode de calcul', footer: 'Mise à jour : novembre 2026' },
};

export const InteractiveRepos: Story = {
  name: 'Interactive (repos)',
  args: { interactive: true, header: 'Voir le détail' },
};

export const InteractiveSurvol: Story = {
  name: 'Interactive (survol)',
  parameters: { pseudo: { hover: true } },
  args: { interactive: true, header: 'Voir le détail' },
};

export const InteractiveFocus: Story = {
  name: 'Interactive (focus)',
  parameters: { pseudo: { focusVisible: true } },
  args: { interactive: true, header: 'Voir le détail', autoFocus: true },
};

export const InteractiveLien: Story = {
  name: 'Interactive (lien)',
  args: { interactive: true, href: '/methodologie', header: 'Lire la méthodologie' },
};
