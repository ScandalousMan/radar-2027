import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Notice } from './Notice';

const meta = {
  title: 'UI/Notice',
  component: Notice,
  args: { tone: 'info', children: 'Votre navigateur ne permet pas de conserver votre progression.' },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Avertissement: Story = { args: { tone: 'warning', role: 'alert', children: 'Vous avez répondu à moins de 2 questions sur : Santé.' } };

export const AvecTitre: Story = {
  name: 'Avec titre',
  args: { tone: 'warning', title: 'Résultat peu fiable sur certains sujets', children: 'Vous pouvez revenir compléter vos réponses.' },
};

export const LongTexte320: Story = {
  name: 'Long texte à 320 px',
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  args: {
    tone: 'info',
    children:
      'Votre navigateur ne permet pas de conserver votre progression : si vous quittez cette page, vos réponses seront perdues. Anticonstitutionnellementtrèslongmotsansespace.',
  },
};
