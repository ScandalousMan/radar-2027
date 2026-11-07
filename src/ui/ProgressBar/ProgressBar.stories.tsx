import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  args: { value: 7, total: 25, label: 'Question 7 sur 25' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 25, step: 1 } },
    total: { control: { type: 'number', min: 1 } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  args: { value: 0, label: 'Question 0 sur 25' },
};

export const Intermediaire: Story = {
  name: 'Intermédiaire',
};

export const Complet: Story = {
  args: { value: 25, label: 'Question 25 sur 25' },
};
