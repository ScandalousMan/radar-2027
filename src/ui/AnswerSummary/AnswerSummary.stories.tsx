import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AnswerSummary } from './AnswerSummary';

const item = (id: string, label: string, answered: number, skipped: number) => ({ id, label, answered, skipped, unanswered: 0, reliable: answered >= 2 });

const meta = {
  title: 'UI/AnswerSummary',
  component: AnswerSummary,
  args: {
    minReliable: 2,
    items: [item('sante', 'Santé', 4, 0), item('logement', 'Logement', 3, 1), item('ecologie', 'Transition écologique et énergie', 5, 0)],
  },
} satisfies Meta<typeof AnswerSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TousFiables: Story = { name: 'Tous fiables' };
export const UnNonFiable: Story = {
  name: 'Un non fiable',
  args: { items: [item('sante', 'Santé', 4, 0), item('logement', 'Logement', 1, 3), item('ecologie', 'Transition écologique et énergie', 5, 0)] },
};
export const ToutPasse: Story = {
  name: 'Tous non fiables (tout passé)',
  args: { items: [item('sante', 'Santé', 0, 4), item('logement', 'Logement', 0, 4), item('ecologie', 'Transition écologique et énergie', 0, 5)] },
};
export const Etroit320: Story = { name: 'Étroit 320 px', globals: { viewport: { value: 'mobile320', isRotated: false } } };
