import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

// jsdom masque `[popover]` (feuille de style de l'agent) sans implémenter l'API Popover :
// substitut minimal pour les tests de la bulle de définition (009). Les navigateurs, Storybook et
// Playwright utilisent l'API native.
if (typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover !== 'function') {
  HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement) {
    this.style.display = 'block';
  };
  HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
    this.style.removeProperty('display');
  };
}
