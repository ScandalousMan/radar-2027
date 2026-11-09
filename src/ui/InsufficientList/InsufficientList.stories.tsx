import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { InsufficientList } from './InsufficientList';

const row = (i: number, unknown: number, answered: number, withdrawn = false) => ({ id: `c${i}`, name: `Candidate ou candidat ${i}`, unknown, answered, withdrawn });

const meta = {
  title: 'UI/InsufficientList',
  component: InsufficientList,
  args: { rows: [row(1, 9, 21), row(2, 1, 3, true)], selected: [], onOpen: fn(), onToggleCompare: fn() },
} satisfies Meta<typeof InsufficientList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plusieurs: Story = {};
export const Tous: Story = { name: 'Tous en données insuffisantes', args: { rows: Array.from({ length: 6 }, (_, i) => row(i + 1, 3 - (i % 3), 3)) } };
export const Vide: Story = { name: 'Vide (non rendu)', args: { rows: [] } };
export const Etroit320: Story = { name: 'Étroit 320 px', globals: { viewport: { value: 'mobile320', isRotated: false } } };
