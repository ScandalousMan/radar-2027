import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ResultsHeader } from './ResultsHeader';

const meta = {
  title: 'UI/ResultsHeader',
  component: ResultsHeader,
  args: { priorities: ['Économie et emploi', 'Santé', 'Sécurité', 'Éducation'], mode: 'short', answered: 21, total: 25, methodologyHref: '/methodologie' },
} satisfies Meta<typeof ResultsHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuatreSujetsCourt: Story = { name: '4 sujets, mode court' };
export const TroisSujets: Story = { name: '3 sujets, mode complet', args: { priorities: ['Économie et emploi', 'Santé', 'Sécurité'], mode: 'full', answered: 93, total: 100 } };
export const CinqSujets: Story = { name: '5 sujets', args: { priorities: ['Économie et emploi', 'Santé', 'Sécurité', 'Éducation', 'Institutions et démocratie'] } };
export const Etroit320: Story = { name: 'Étroit 320 px', args: { priorities: ['Économie et emploi', 'Santé', 'Sécurité', 'Éducation', 'Institutions et démocratie'] }, globals: { viewport: { value: 'mobile320', isRotated: false } } };
