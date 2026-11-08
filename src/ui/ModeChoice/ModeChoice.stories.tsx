import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { ModeChoice, type ModeChoiceProps } from './ModeChoice';

function Controlled(props: ModeChoiceProps) {
  const [value, setValue] = useState(props.value);
  return (
    <ModeChoice
      {...props}
      value={value}
      onChange={(m) => {
        setValue(m);
        props.onChange(m);
      }}
    />
  );
}

const meta = {
  title: 'UI/ModeChoice',
  component: ModeChoice,
  render: (args) => <Controlled {...args} />,
  args: {
    options: [
      { mode: 'short', questionCount: 25 },
      { mode: 'full', questionCount: 100 },
    ],
    value: null,
    legend: 'Mode du questionnaire',
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof ModeChoice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AucunChoisi: Story = { name: 'Aucun choisi' };
export const Court: Story = { args: { value: 'short' } };
export const Complet: Story = { args: { value: 'full' } };
export const Desactive: Story = { name: 'Désactivé', args: { value: 'short', disabled: true } };
export const Etroit320: Story = {
  name: 'Étroit 320 px',
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  args: { value: 'full' },
};
