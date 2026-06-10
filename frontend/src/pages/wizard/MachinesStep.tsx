import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchMachines } from "../../api";
import MachineCard from "../../components/MachineCard";
import MachineDetail from "../../components/MachineDetail";
import { useWizard } from "../../state/WizardContext";
import type { Machine } from "../../types";

export default function MachinesStep() {
  const { systemType, tree, partner, operation } = useWizard();
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<Machine | null>(null);

  const ready = systemType && operation;

  useEffect(() => {
    if (!ready) return;
    setMachines(null);
    setError(null);
    fetchMachines({
      operation: operation!,
      systemType: systemType!,
      species: [tree, partner].filter(Boolean) as string[],
    })
      .then(setMachines)
      .catch(() => setError("Could not load machines. Is the API running on port 8000?"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemType, operation, tree, partner]);

  if (!ready) return <Navigate to="/wizard/type" replace />;

  return (
    <section>
      <h1>
        Machines for {operation}
        {tree ? ` · ${tree}` : ""}
      </h1>
      <p className="step-lede">
        All the machines for the selected operation of the selected species.
      </p>

      {error && <p className="error-note">{error}</p>}
      {!error && machines === null && <p className="loading-note">Loading machines…</p>}
      {machines && machines.length > 0 && tree && !machines.some((m) => m.species.includes(tree)) && (
        <p className="empty-note">
          None of these machines are for {tree} — the research documents have no {tree} machinery
          yet, so only machines for {partner ?? "your other selection"} are shown.
        </p>
      )}
    
      {machines && machines.length === 0 && (
        <p className="empty-note">
          {tree === "Poplar" ? " — poplar has no machines yet" : ""}.
        </p>
      )}

      <div className="machine-grid">
        {machines?.map((m) => (
          <MachineCard key={m.id} machine={m} onDetails={() => setDetail(m)} />
        ))}
      </div>

      {machines && machines.length > 0 && (
        <div className="step-actions">
          <button className="btn" onClick={() => navigate("/wizard/company")}>
            Continue to companies
          </button>
        </div>
      )}

      {detail && <MachineDetail machine={detail} onClose={() => setDetail(null)} />}
    </section>
  );
}
