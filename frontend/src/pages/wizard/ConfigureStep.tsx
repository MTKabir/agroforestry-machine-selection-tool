import { Navigate, useNavigate } from "react-router-dom";
import { useWizard } from "../../state/WizardContext";
import type { Meta, SpeciesItem } from "../../types";

function options(list: SpeciesItem[]) {
  return list.map((s) => (
    <option key={s.id} value={s.name}>
      {s.name}
    </option>
  ));
}

export default function ConfigureStep({ meta }: { meta: Meta }) {
  const { systemType, tree, partner, setTree, setPartner } = useWizard();
  const navigate = useNavigate();

  if (!systemType) return <Navigate to="/wizard/type" replace />;

  const arable = systemType === "silvoarable";
  const partnerList = arable ? meta.species.crop : meta.species.livestock;
  const partnerLabel = arable ? "Companion crop" : "Livestock";

  return (
    <section>
      <h1>Select your species combination</h1>
      <p className="step-lede">
        {arable
          ? "Pick the tree species for your rows and the crop in between tree rows."
          : "Pick the tree species for your pasture and the livestock that will graze it."}
      </p>

      <div className="select-row">
        <label className="field">
          <span className="field-label">Tree species</span>
          <select value={tree ?? ""} onChange={(e) => setTree(e.target.value || null)}>
            <option value="">Select…</option>
            {options(meta.species.tree)}
          </select>
        </label>

        <label className="field">
          <span className="field-label">{partnerLabel}</span>
          <select value={partner ?? ""} onChange={(e) => setPartner(e.target.value || null)}>
            <option value="">Select…</option>
            {options(partnerList)}
          </select>
        </label>
      </div>

      <div className="step-actions">
        <button className="btn" disabled={!tree || !partner} onClick={() => navigate("/wizard/operation")}>
          Continue
        </button>
      </div>
    </section>
  );
}
