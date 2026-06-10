import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { fetchMeta } from "./api";
import WizardLayout from "./components/WizardLayout";
import Landing from "./pages/Landing";
import CompanyStep from "./pages/wizard/CompanyStep";
import ConfigureStep from "./pages/wizard/ConfigureStep";
import MachinesStep from "./pages/wizard/MachinesStep";
import OperationStep from "./pages/wizard/OperationStep";
import TypeStep from "./pages/wizard/TypeStep";
import { WizardProvider } from "./state/WizardContext";
import type { Meta } from "./types";

export default function App() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeta()
      .then(setMeta)
      .catch(() => setError("Could not reach the Agroforestry API on http://localhost:8000."));
  }, []);

  return (
    <WizardProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wizard" element={<WizardLayout />}>
          {error && <Route path="*" element={<p className="error-note pad">{error}</p>} />}
          {!error && meta === null && (
            <Route path="*" element={<p className="loading-note pad">Loading…</p>} />
          )}
          {meta && (
            <>
              <Route path="type" element={<TypeStep meta={meta} />} />
              <Route path="configure" element={<ConfigureStep meta={meta} />} />
              <Route path="operation" element={<OperationStep meta={meta} />} />
              <Route path="company" element={<CompanyStep meta={meta} />} />
              <Route path="machines" element={<MachinesStep />} />
            </>
          )}
        </Route>
      </Routes>
    </WizardProvider>
  );
}
