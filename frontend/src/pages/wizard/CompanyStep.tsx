import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchMachines } from "../../api";
import { useWizard } from "../../state/WizardContext";
import type { Machine, Meta } from "../../types";

export default function CompanyStep({ meta }: { meta: Meta }) {
  const { systemType, tree, partner, operation } = useWizard();
  const [machines, setMachines] = useState<Machine[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ready = systemType && operation;

  useEffect(() => {
    if (!ready) return;
    fetchMachines({
      operation: operation!,
      systemType: systemType!,
      species: [tree, partner].filter(Boolean) as string[],
    })
      .then(setMachines)
      .catch(() => setError("Could not load companies. Is the API running on port 8000?"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemType, operation, tree, partner]);

  if (!ready) return <Navigate to="/wizard/type" replace />;

  return (
    <section>
      <h1>The companies behind your machines</h1>
      <p className="step-lede">
        We segmented manufacturers by how much information they publish about their machines: full
        information including price, full information without price, or tailor-made solutions
        defined in consultation.
      </p>

      {error && <p className="error-note">{error}</p>}
      {!error && machines === null && <p className="loading-note">Loading companies…</p>}

      {machines &&
        meta.company_types.map((ct) => {
          const group = machines.filter((m) => String(m.company_type) === ct.id);
          if (group.length === 0) return null;
          const byCompany = new Map<string, Machine[]>();
          group.forEach((m) => {
            const list = byCompany.get(m.company.name) ?? [];
            list.push(m);
            byCompany.set(m.company.name, list);
          });
          return (
            <div className="ct-group" key={ct.id}>
              <h2 className={"ct-heading ct-text-" + ct.id}>{ct.label}</h2>
              <p className="ct-blurb">{ct.blurb}</p>
              <div className="company-grid">
                {[...byCompany.entries()].map(([name, ms]) => (
                  <article className="company-card" key={name}>
                    <h3>{name}</h3>
                    <p className="machine-company">
                      {ms[0].company.country}
                      {ms[0].company.website ? (
                        <>
                          {" · "}
                          <a href={ms[0].company.website} target="_blank" rel="noreferrer">
                            website ↗
                          </a>
                        </>
                      ) : (
                        <span className="muted"> · no official site — see product link</span>
                      )}
                    </p>
                    <ul className="company-machines">
                      {ms.map((m) => (
                        <li key={m.id}>
                          <span>{m.name}</span>
                          <span className="price">{m.price_indication ?? "—"}</span>
                          {m.product_url && (
                            <a href={m.product_url} target="_blank" rel="noreferrer">
                              product ↗
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
    </section>
  );
}
