import { useEffect } from "react";
import { API_BASE } from "../api";
import type { Machine } from "../types";
import { CT_LABEL } from "./MachineCard";

export default function MachineDetail({ machine, onClose }: { machine: Machine; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={machine.name}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        {machine.image_url && (
          <img className="modal-img" src={API_BASE + machine.image_url} alt={machine.name} />
        )}
        <div className="modal-body">
          <div className="chip-row">
            <span className={"tag op-" + machine.operation}>{machine.operation}</span>
            <span className={"tag ct-" + machine.company_type}>{CT_LABEL[machine.company_type]}</span>
            <span className={"tag method-" + machine.method.replace("-assisted", "")}>{machine.method}</span>
          </div>
          <h2>{machine.name}</h2>
          <p className="machine-company">
            {machine.company.name} · {machine.company.country}
            {machine.company.website && (
              <>
                {" · "}
                <a href={machine.company.website} target="_blank" rel="noreferrer">
                  company website 
                </a>
              </>
            )}
          </p>
          <p>{machine.description}</p>
          <h3 className="modal-h3">Specifications</h3>
          <dl className="machine-specs">
            {Object.entries(machine.specs).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{String(v)}</dd>
              </div>
            ))}
          </dl>
          <p className="modal-meta">
            <strong>Suitable for:</strong> {machine.species.join(", ")}
          </p>
          <div className="modal-actions">
            <span className="price big">{machine.price_indication ?? "Price unknown"}</span>
            {machine.product_url && (
              <a className="btn" href={machine.product_url} target="_blank" rel="noreferrer">
                View product page ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
