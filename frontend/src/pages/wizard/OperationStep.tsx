import { Navigate, useNavigate } from "react-router-dom";
import { useWizard } from "../../state/WizardContext";
import type { Meta, Operation } from "../../types";

export default function OperationStep({ meta }: { meta: Meta }) {
  const { systemType, operation, setOperation } = useWizard();
  const navigate = useNavigate();

  if (!systemType) return <Navigate to="/wizard/type" replace />;

  return (
    <section>
      <h1>Which operation do you need equipment for?</h1>
      <p className="step-lede">Each operation has its own set of machines.</p>

      <div className="option-grid three">
        {meta.operations.map((opt) => (
          <button
            key={opt.id}
            className={"option-card" + (operation === opt.id ? " selected" : "")}
            onClick={() => setOperation(opt.id as Operation)}
          >
            <h3>{opt.label}</h3>
            <p>{opt.blurb}</p>
          </button>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn" disabled={!operation} onClick={() => navigate("/wizard/machines")}>
          Continue
        </button>
      </div>
    </section>
  );
}
