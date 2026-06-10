import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Operation, SystemType } from "../types";

export interface WizardState {
  systemType: SystemType | null;
  tree: string | null; // selected tree species
  partner: string | null; // selected crop (silvoarable) or livestock (silvopastoral)
  operation: Operation | null;
}

interface WizardApi extends WizardState {
  setSystemType: (v: SystemType) => void;
  setTree: (name: string | null) => void;
  setPartner: (name: string | null) => void;
  setOperation: (v: Operation) => void;
  reset: () => void;
}

const empty: WizardState = { systemType: null, tree: null, partner: null, operation: null };

const Ctx = createContext<WizardApi | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(empty);

  const api = useMemo<WizardApi>(
    () => ({
      ...state,
      setSystemType: (v) =>
        setState((s) => (s.systemType === v ? s : { ...s, systemType: v, partner: null })),
      setTree: (name) => setState((s) => ({ ...s, tree: name })),
      setPartner: (name) => setState((s) => ({ ...s, partner: name })),
      setOperation: (v) => setState((s) => ({ ...s, operation: v })),
      reset: () => setState(empty),
    }),
    [state]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useWizard(): WizardApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}
