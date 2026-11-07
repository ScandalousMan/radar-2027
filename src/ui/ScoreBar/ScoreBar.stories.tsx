import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScoreBar } from './ScoreBar';

const meta = {
  title: 'UI/ScoreBar',
  component: ScoreBar,
  args: { value: 72, label: 'Candidate A', compact: false },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof ScoreBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defini: Story = { name: 'Défini' };

export const ScoreIndefini: Story = {
  name: 'Score indéfini',
  args: { value: undefined },
};

export const Compacte: Story = {
  args: { compact: true },
};

export const Liste: Story = {
  name: 'Liste compacte',
  render: (args) => (
    <div className="flex max-w-content flex-col gap-2">
      <ScoreBar {...args} compact value={88} label="Candidate A" />
      <ScoreBar {...args} compact value={61} label="Candidat B" />
      <ScoreBar {...args} compact value={undefined} label="Candidate C (positions insuffisantes)" />
      <ScoreBar {...args} compact value={14} label="Candidat D" />
    </div>
  ),
};
