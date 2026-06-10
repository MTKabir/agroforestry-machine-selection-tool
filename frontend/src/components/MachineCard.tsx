import { API_BASE } from "../api";
import type { Machine } from "../types";

export const CT_LABEL: Record<number, string> = {
  1: "Type 1 · Full info",
  2: "Type 2 · Price on request",
  3: "Type 3 · Tailor-made",
};

function Placeholder() {
  return (
    <svg viewBox="0 0 400 260" className="machine-img" aria-hidden="true">
      <rect width="400" height="260" fill="#e3e8dd" />
      <circle cx="200" cy="112" r="40" fill="#cbd5c0" />
      <rect x="120" y="170" width="160" height="14" rx="7" fill="#cbd5c0" />
      <text x="200" y="222" textAnchor="middle" fill="#73806d" fontSize="15" fontFamily="sans-serif">
        no photo available
      </text>
    </svg>
  );
}

function priceLabel(p: string | null): string {
  if (!p) return "No price data";
  if (p.toLowerCase().startsWith("price on request")) return "Price on request";
  return p;
}

export default function MachineCard({ machine, onDetails }: { machine: Machine; onDetails: () => void }) {
  return (
    <article className="machine-card">
      {machine.image_url ? (
        <img
          className="machine-img"
          src={API_BASE + machine.image_url}
          alt={machine.name}
          loading="lazy"
        />
      ) : (
        <Placeholder />
      )}
      <div className="machine-body">
        <div className="chip-row">
          <span className={"tag op-" + machine.operation}>{machine.operation}</span>
        </div>
        <p className="field-label">
          Machine name :         {machine.name}
        </p>
        <p className="field-label">Manufacturer :  
          { machine.company.name} · { machine.company.country}
        </p>
        <p className="field-label">Description : { machine.description}</p>

        <footer className="machine-foot">
          <div>
            <p className="field-label">Price</p>
            <span className="price" title={machine.price_indication ?? undefined}>
              {priceLabel(machine.price_indication)}
            </span>
          </div>
          <button className="btn btn-small" onClick={onDetails}>
            View details →
          </button>
        </footer>
      </div>
    </article>
  );
}