import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PositionCard } from './PositionCard';

const sources = [
  { url: 'https://exemple.fr/programme-2027', title: 'Programme présidentiel 2027', publishedAt: { date: '2026-10', precision: 'month' as const }, accessedAt: '2026-11-07' },
  { url: 'https://exemple.fr/entretien', title: 'Entretien à la radio', publishedAt: { date: '2026-09-12', precision: 'day' as const }, accessedAt: '2026-11-07' },
  { url: 'https://exemple.fr/livre', title: 'Livre-programme', publishedAt: { date: '2025', precision: 'year' as const }, accessedAt: '2026-11-07' },
];

const meta = {
  title: 'UI/PositionCard',
  component: PositionCard,
  args: {
    question: 'Le SMIC doit être augmenté au-delà de l’inflation.',
    value: 1,
    level: 'programme',
    quote: 'Nous revaloriserons le SMIC de 10 % dès l’été 2027.',
    justification: 'Hausse chiffrée mais ponctuelle, sans indexation au-delà de l’inflation : plutôt d’accord.',
    sources: [sources[0]!],
    reportHref: 'https://github.com/ScandalousMan/radar-2027/issues/new?title=dupont%2Ftravail-smic',
  },
  argTypes: {
    value: { control: 'inline-radio', options: [-2, -1, 0, 1, 2] },
    level: { control: 'inline-radio', options: ['programme', 'livre_plateforme', 'declaration_vote'] },
  },
} satisfies Meta<typeof PositionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlutotDAccord: Story = { name: 'Plutôt d’accord (+1)' };
export const PasDuToutDAccord: Story = { name: 'Pas du tout d’accord (−2)', args: { value: -2, level: 'declaration_vote' } };
export const PlutotPasDAccord: Story = { name: 'Plutôt pas d’accord (−1)', args: { value: -1, level: 'livre_plateforme' } };
export const Neutre: Story = { name: 'Neutre (0)', args: { value: 0 } };
export const ToutAFaitDAccord: Story = { name: 'Tout à fait d’accord (+2)', args: { value: 2 } };
export const Ancienne: Story = {
  name: 'Position ancienne',
  args: { old: true, sources: [{ ...sources[1]!, publishedAt: { date: '2019-04-02', precision: 'day' } }], level: 'declaration_vote' },
};
export const TroisSources: Story = { name: 'Trois sources de précisions différentes', args: { sources } };
export const SansSignalement: Story = { name: 'Sans lien de signalement', args: { reportHref: undefined } };
