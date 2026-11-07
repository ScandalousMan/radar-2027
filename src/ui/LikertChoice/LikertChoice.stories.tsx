import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { LikertChoice, type LikertChoiceProps } from './LikertChoice';

function Controlled(props: LikertChoiceProps) {
  const [value, setValue] = useState(props.value);
  return (
    <LikertChoice
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

const meta = {
  title: 'UI/LikertChoice',
  component: LikertChoice,
  render: (args) => <Controlled {...args} />,
  args: {
    name: 'q1',
    value: null,
    legend: 'L’État doit construire davantage de logements sociaux.',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    value: { control: 'select', options: [null, -2, -1, 0, 1, 2, 'skipped'] },
  },
} satisfies Meta<typeof LikertChoice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SansReponse: Story = { name: 'Sans réponse' };

export const PasDuToutDaccord: Story = { name: 'Pas du tout d’accord (−2)', args: { value: -2 } };
export const PlutotPasDaccord: Story = { name: 'Plutôt pas d’accord (−1)', args: { value: -1 } };
export const Neutre: Story = { name: 'Neutre (0)', args: { value: 0 } };
export const PlutotDaccord: Story = { name: 'Plutôt d’accord (+1)', args: { value: 1 } };
export const ToutAFaitDaccord: Story = { name: 'Tout à fait d’accord (+2)', args: { value: 2 } };

export const Passee: Story = { name: 'Passée', args: { value: 'skipped' } };

export const Desactive: Story = { name: 'Désactivé', args: { value: 1, disabled: true } };
