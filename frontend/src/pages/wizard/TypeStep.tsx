import { useNavigate } from "react-router-dom";
import { useWizard } from "../../state/WizardContext";
import type { Meta, SystemType } from "../../types";

export default function TypeStep({ meta }: { meta: Meta }) {
  const { systemType, setSystemType } = useWizard();
  const navigate = useNavigate();

  return (
    <section>
      <h1>What kind of agroforestry are you designing?</h1>
      <p className="step-lede">Pick the agroforestry approach that matches your land and goals.</p>

      <div className="option-grid two">
        {meta.system_types.map((opt) => (
          <button
            key={opt.id}
            className={"option-card" + (systemType === opt.id ? " selected" : "")}
            onClick={() => setSystemType(opt.id as SystemType)}
          >
            <h3>{opt.label}</h3>
            <p>{opt.blurb}</p>
          </button>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn" disabled={!systemType} onClick={() => navigate("/wizard/configure")}>
          Continue
        </button>
      </div>
    </section>
  );
}
