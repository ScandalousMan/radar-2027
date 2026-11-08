import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CoverageList } from './CoverageList';

const item = (i: number, coverage: number) => ({ id: `candidat-${i}`, name: `Candidate ou candidat ${i}`, party: i % 3 === 0 ? 'Sans étiquette' : `Parti ${i}`, coverage, href: `/methodologie/candidats/candidat-${i}` });

const meta = {
  title: 'UI/CoverageList',
  component: CoverageList,
  args: { items: [item(1, 0), item(2, 0.6), item(3, 1)] },
} satisfies Meta<typeof CoverageList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TroisCouvertures: Story = { name: '0 %, 60 % et 100 %' };
export const ListeVide: Story = { name: 'Liste vide', args: { items: [] } };
export const VingtDeuxCandidats: Story = { name: '22 candidats', args: { items: Array.from({ length: 22 }, (_, i) => item(i + 1, ((i * 37) % 101) / 100)) } };
