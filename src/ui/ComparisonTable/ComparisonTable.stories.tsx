import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ComparisonTable } from './ComparisonTable';

const col = (i: number, slot: 1 | 2 | 3, global: number | null) => ({ id: `c${i}`, name: `Candidate ou candidat ${i}`, slot, global });
const themes = (n: number, values: (i: number) => (number | null)[]) => Array.from({ length: n }, (_, i) => ({ key: `t${i}`, label: `Thème ${i + 1}`, priority: i < 3, values: values(i) }));

const meta = {
  title: 'UI/ComparisonTable',
  component: ComparisonTable,
  args: { columns: [col(1, 1, 74), col(2, 2, 51)], rows: themes(6, (i) => [40 + i * 9, 80 - i * 7]), onRemove: fn() },
} satisfies Meta<typeof ComparisonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Deux: Story = { name: 'Deux candidats' };
export const Trois: Story = { name: 'Trois candidats', args: { columns: [col(1, 1, 74), col(2, 2, 51), col(3, 3, 33)], rows: themes(6, (i) => [40 + i * 9, 80 - i * 7, i % 2 ? null : 50]) } };
export const AvecInsuffisant: Story = { name: 'Avec données insuffisantes', args: { columns: [col(1, 1, 74), col(2, 2, null)] } };
export const Court: Story = { name: 'Mode court', args: { rows: [...themes(3, (i) => [60 + i, 40 + i]), { key: 'others', label: '', priority: false, values: [58, null] }] } };
export const Etroit320: Story = { name: 'Étroit 320 px', args: { columns: [col(1, 1, 74), col(2, 2, 51), col(3, 3, null)] }, globals: { viewport: { value: 'mobile320', isRotated: false } } };
