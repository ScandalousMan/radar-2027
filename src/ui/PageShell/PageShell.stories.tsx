import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageShell } from './PageShell';

const meta = {
  title: 'UI/PageShell',
  component: PageShell,
  parameters: { layout: 'fullscreen' },
  args: {
    children: (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Quels candidats sont proches de vous ?</h1>
        <p className="text-fg-muted">Contenu principal de la page, rendu dans la zone « contenu ».</p>
      </div>
    ),
  },
} satisfies Meta<typeof PageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ParDefaut: Story = { name: 'Par défaut' };

export const ApparenceSombre: Story = {
  name: 'Apparence sombre',
  globals: { theme: 'sombre' },
};

export const Largeur320: Story = {
  name: 'Largeur 320 px',
  globals: { viewport: { value: 'mobile320', isRotated: false } },
};
