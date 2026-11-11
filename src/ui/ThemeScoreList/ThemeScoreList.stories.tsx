import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ThemeScoreList } from './ThemeScoreList';

const theme = (i: number, priority: boolean, percent: number | null, known = 5, answered = 6) => ({ key: `t${i}`, label: `Thème ${i}`, priority, percent, known, answered });

const meta = {
  title: 'UI/ThemeScoreList',
  component: ThemeScoreList,
  args: {
    label: 'Scores par thème',
    rows: [theme(1, true, 81), theme(2, true, 44), theme(3, true, 62), ...Array.from({ length: 5 }, (_, i) => theme(i + 4, false, 30 + i * 12))],
  },
} satisfies Meta<typeof ThemeScoreList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complet: Story = { name: 'Mode complet' };
export const Court: Story = { name: 'Mode court (autres thèmes)', args: { rows: [theme(1, true, 75, 4, 4), theme(2, true, 50, 3, 4), theme(3, true, 100, 4, 4), { key: 'others', label: '', priority: false, percent: 58, known: 11, answered: 13 }] } };
export const Indefinis: Story = { name: 'Scores indéfinis', args: { rows: [theme(1, true, null, 1, 1), theme(2, false, null, 0, 2), theme(3, false, 50, 2, 2)] } };
export const Etroit320: Story = { name: 'Étroit 320 px', globals: { viewport: { value: 'mobile320', isRotated: false } } };
