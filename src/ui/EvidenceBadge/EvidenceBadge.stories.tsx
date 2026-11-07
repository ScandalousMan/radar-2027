import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EvidenceBadge } from './EvidenceBadge';

const meta = {
  title: 'UI/EvidenceBadge',
  component: EvidenceBadge,
  args: { level: 'programme' },
  argTypes: {
    level: { control: 'inline-radio', options: ['programme', 'livre_plateforme', 'declaration_vote'] },
  },
} satisfies Meta<typeof EvidenceBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgrammeOfficiel: Story = { name: 'Programme officiel' };

export const LivreOuPlateforme: Story = {
  name: 'Livre ou plateforme écrite',
  args: { level: 'livre_plateforme' },
};

export const DeclarationOuVote: Story = {
  name: 'Déclaration publique ou vote',
  args: { level: 'declaration_vote' },
};

export const LesTroisNiveaux: Story = {
  name: 'Les trois niveaux',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <EvidenceBadge level="programme" />
      <EvidenceBadge level="livre_plateforme" />
      <EvidenceBadge level="declaration_vote" />
    </div>
  ),
};
