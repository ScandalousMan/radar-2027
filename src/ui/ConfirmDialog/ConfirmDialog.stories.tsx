import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, within } from 'storybook/test';
import { Button } from '@/ui/Button';
import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';

function Controlled(props: ConfirmDialogProps) {
  const [open, setOpen] = useState(props.open);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Ouvrir la confirmation
      </Button>
      <ConfirmDialog
        {...props}
        open={open}
        onConfirm={() => {
          props.onConfirm();
          setOpen(false);
        }}
        onCancel={() => {
          props.onCancel();
          setOpen(false);
        }}
      />
    </>
  );
}

const meta = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  render: (args) => <Controlled {...args} />,
  args: {
    open: false,
    title: 'Modifier vos choix ?',
    description: 'La liste des questions dépend de vos sujets clés et du mode : vos réponses en cours seront perdues.',
    confirmLabel: 'Modifier et recommencer',
    cancelLabel: 'Annuler',
    destructive: false,
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ferme: Story = { name: 'Fermé' };

export const Ouvert: Story = {
  args: { open: true },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByRole('button', { name: 'Annuler' })).toHaveFocus();
  },
};

export const Destructif: Story = {
  args: { open: true, destructive: true, title: 'Effacer le questionnaire ?', description: 'Toutes les données du questionnaire seront supprimées de cet appareil.', confirmLabel: 'Effacer' },
};

export const Etroit320: Story = {
  name: 'Étroit 320 px',
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  args: { open: true },
};
