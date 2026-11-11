import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ResumeCard } from './ResumeCard';

const meta = {
  title: 'UI/ResumeCard',
  component: ResumeCard,
  args: {
    mode: 'short',
    done: 10,
    total: 25,
    updatedAt: '8 novembre 2026 à 17:42',
    status: 'resumable',
    onResume: fn(),
    onRestart: fn(),
    onClear: fn(),
  },
} satisfies Meta<typeof ResumeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reprenable: Story = {};
export const VersionChangee: Story = { name: 'Version changée', args: { status: 'version-changed', mode: 'full', done: 42, total: 100 } };
export const Termine: Story = { name: 'Terminé', args: { status: 'complete', done: 25, onViewResults: fn() } };
export const TermineVersionChangee: Story = { name: 'Terminé, version changée', args: { status: 'complete', mode: 'full', done: 100, total: 100, versionChanged: true, onViewResults: fn() } };
export const Etroit320: Story = { name: 'Étroit 320 px', globals: { viewport: { value: 'mobile320', isRotated: false } } };
