import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QuestionDetail } from './QuestionDetail';

const meta = {
  title: 'UI/QuestionDetail',
  component: QuestionDetail,
  args: {
    text: 'Il faut augmenter le salaire minimum de façon importante d’ici 2030.',
    themes: ['Économie', 'Travail'],
    answer: 2,
    position: 2,
    agreement: 'identical',
    evidence: 'programme',
    quote: 'Nous porterons le salaire minimum à un niveau nettement supérieur.',
    source: { title: 'Programme présidentiel 2027', date: '14 mars 2026', url: 'https://exemple.invalid/programme' },
    detailState: 'ready',
  },
} satisfies Meta<typeof QuestionDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Identique: Story = {};
export const Proche: Story = { args: { position: 1, agreement: 'close', evidence: 'livre_plateforme' } };
export const Intermediaire: Story = { name: 'Intermédiaire', args: { position: 0, agreement: 'intermediate', evidence: 'declaration_vote' } };
export const Eloigne: Story = { name: 'Éloigné', args: { position: -1, agreement: 'distant' } };
export const Oppose: Story = { name: 'Opposé', args: { position: -2, agreement: 'opposite' } };
export const Inconnue: Story = { name: 'Position inconnue', args: { position: null, agreement: null, evidence: null } };
export const Passee: Story = { name: 'Question passée', args: { answer: 'skipped', agreement: null } };
export const CitationAbsente: Story = { name: 'Citation absente', args: { quote: null } };
export const Chargement: Story = { name: 'Détail en chargement', args: { detailState: 'loading' } };
export const Erreur: Story = { name: 'Détail en erreur', args: { detailState: 'error' } };
export const Etroit320: Story = { name: 'Étroit 320 px', globals: { viewport: { value: 'mobile320', isRotated: false } } };
