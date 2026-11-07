import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Commencer',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    href: { control: 'text' },
    onClick: { action: 'clic' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Repos: Story = {};

export const Survol: Story = {
  parameters: { pseudo: { hover: true } },
  args: { children: 'Survolé' },
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
  args: { autoFocus: true, children: 'Avec le focus' },
};

export const Actif: Story = {
  parameters: { pseudo: { active: true } },
  args: { children: 'Enfoncé' },
};

export const Desactive: Story = {
  name: 'Désactivé',
  args: { disabled: true },
};

export const Chargement: Story = {
  args: { loading: true },
};

export const EnLien: Story = {
  name: 'En lien',
  args: { href: '/methodologie', children: 'Lire la méthodologie' },
};

export const Secondaire: Story = {
  args: { variant: 'secondary', children: 'Revenir' },
};

export const Discret: Story = {
  name: 'Discrète',
  args: { variant: 'ghost', children: 'Passer' },
};

export const Compact: Story = {
  name: 'Compacte',
  args: { size: 'sm', children: 'Détails' },
};

export const ToutesLesVariantes: Story = {
  name: 'Toutes les variantes',
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          <Button {...args} variant={variant} />
          <Button {...args} variant={variant} size="sm" />
          <Button {...args} variant={variant} disabled />
          <Button {...args} variant={variant} loading />
        </div>
      ))}
    </div>
  ),
};

export const Etroit320: Story = {
  name: 'Étroit 320 px',
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  args: { children: 'Commencer le questionnaire complet', className: 'w-full whitespace-normal' },
};
