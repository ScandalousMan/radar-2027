import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SharePanel } from './SharePanel';

const meta = {
  title: 'UI/SharePanel',
  component: SharePanel,
  args: {
    url: 'https://radar-2027.exemple/resultats#1.AAEkAgAbcDeFgHiJkLmNoPqRsTuVwXyZ0123456789-_AbCdEfGh',
    preview: {
      title: 'Mes affinités avec les candidats à la présidentielle 2027',
      description: 'Comparez vos réponses aux positions des candidats, en donnant plus de poids aux sujets qui comptent pour vous.',
    },
    onCopy: fn(async (): Promise<'copied' | 'manual'> => 'copied'),
  },
} satisfies Meta<typeof SharePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {};
export const Copie: Story = {
  name: 'Lien copié',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copier le lien' }));
    await expect(canvas.getByText('Lien copié dans le presse-papiers.')).toBeInTheDocument();
  },
};
export const Manuel: Story = {
  name: 'Copie manuelle',
  args: { onCopy: fn(async (): Promise<'copied' | 'manual'> => 'manual') },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copier le lien' }));
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};
export const Natif: Story = { name: 'Avec partage natif', args: { nativeShare: fn(async () => 'shared' as const) } };
export const Etroit320: Story = { name: 'Étroit 320 px', args: { onCopy: fn(async (): Promise<'copied' | 'manual'> => 'manual'), nativeShare: fn(async () => 'shared' as const) }, globals: { viewport: { value: 'mobile320', isRotated: false } } };
