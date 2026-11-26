'use client';

import { createContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

export type DefinedTermGroupValue = {
  /** Instance de `DefinedTerm` dont la bulle est ouverte, `null` si aucune. */
  openKey: string | null;
  setOpenKey: Dispatch<SetStateAction<string | null>>;
};

export const DefinedTermGroupContext = createContext<DefinedTermGroupValue | null>(null);

/** Une seule bulle de définition ouverte à la fois parmi les termes du groupe (FR-019). */
export function DefinedTermGroup({ children }: { children: ReactNode }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const value = useMemo(() => ({ openKey, setOpenKey }), [openKey]);
  return <DefinedTermGroupContext.Provider value={value}>{children}</DefinedTermGroupContext.Provider>;
}
