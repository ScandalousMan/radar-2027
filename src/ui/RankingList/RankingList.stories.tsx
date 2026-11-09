import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { RankingList, type RankingRowView } from './RankingList';

const row = (i: number, rank: number, percent: number, band: RankingRowView['band'], extra: Partial<RankingRowView> = {}): RankingRowView => ({ id: `c${i}`, name: `Candidate ou candidat ${i}`, rank, tied: false, percent, band, withdrawn: false, ...extra });

const meta = {
  title: 'UI/RankingList',
  component: RankingList,
  args: {
    rows: [row(1, 1, 84, 'very-aligned'), row(2, 2, 66, 'rather-aligned'), row(3, 3, 47, 'mixed'), row(4, 4, 21, 'distant')],
    selected: [],
    onOpen: fn(),
    onToggleCompare: fn(),
  },
} satisfies Meta<typeof RankingList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Classement: Story = {};
export const UnSeul: Story = { name: 'Un seul classé', args: { rows: [row(1, 1, 62, 'rather-aligned')] } };
export const ExAequo: Story = { name: 'Ex æquo (1, 1, 3)', args: { rows: [row(1, 1, 70, 'rather-aligned', { tied: true }), row(2, 1, 70, 'rather-aligned', { tied: true }), row(3, 3, 52, 'mixed')] } };
export const TousExAequo: Story = { name: 'Tous ex æquo', args: { rows: [1, 2, 3].map((i) => row(i, 1, 55, 'mixed', { tied: true })) } };
export const TroisSelectionnes: Story = { name: 'Trois sélectionnés', args: { selected: ['c1', 'c2', 'c3'] } };
export const Retire: Story = { name: 'Ne se présente plus', args: { rows: [row(1, 1, 74, 'rather-aligned', { withdrawn: true }), row(2, 2, 40, 'mixed')] } };
export const Etroit320: Story = { name: 'Étroit 320 px', args: { selected: ['c2'] }, globals: { viewport: { value: 'mobile320', isRotated: false } } };
