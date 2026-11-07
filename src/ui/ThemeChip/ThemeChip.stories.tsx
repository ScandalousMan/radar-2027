import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ThemeChip } from './ThemeChip';

const meta = {
  title: 'UI/ThemeChip',
  component: ThemeChip,
  args: { id: 'logement', label: 'Logement', selected: false, disabled: false, onToggle: fn() },
} satisfies Meta<typeof ThemeChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NonSelectionne: Story = { name: 'Non sélectionné' };

export const Selectionne: Story = {
  name: 'Sélectionné',
  args: { selected: true },
};

export const Desactive: Story = {
  name: 'Désactivé (maximum atteint)',
  args: { disabled: true },
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
  args: { autoFocus: true },
};

export const LibelleLong: Story = {
  name: 'Libellé long',
  args: {
    id: 'transition',
    label: 'Transition écologique, énergie et adaptation au changement climatique',
    selected: true,
  },
  render: (args) => (
    <div className="w-64">
      <ThemeChip {...args} />
    </div>
  ),
};

export const Etroit320: Story = {
  name: 'Étroit 320 px',
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  args: { id: 'transition', label: 'Transition écologique, énergie et adaptation au changement climatique', selected: true },
};
