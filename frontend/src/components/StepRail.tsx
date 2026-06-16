import { Link, useLocation } from "react-router-dom";
import { useWizard } from "../state/WizardContext";
import Sapling from "./Sapling";

const STEPS = [
  { path: "/wizard/type", label: "Type" },
  { path: "/wizard/configure", label: "Species" },
  { path: "/wizard/operation", label: "Operation" },
  { path: "/wizard/machines", label: "Machines" },
  { path: "/wizard/company", label: "Manufacturer Segmentation" },
];

export default function StepRail() {
  const { pathname } = useLocation();
  const { systemType, tree, partner, operation } = useWizard();
  const current = Math.max(0, STEPS.findIndex((s) => pathname.startsWith(s.path)));

  // A step is reachable only once the selections it depends on exist.
  const hasSpecies = !!(tree && partner);
  const reachable = [
    true, // Type — always
    !!systemType, // Species
    !!systemType && hasSpecies, // Operation
    !!systemType && hasSpecies && !!operation, // Machines
    !!systemType && hasSpecies && !!operation, // Manufacturer Segmentation
  ];

  return (
    <aside className="step-rail">
      <ol>
        {STEPS.map((s, i) => {
          const cls = i < current ? "done" : i === current ? "current" : "";
          // Clickable when its prerequisites are met and it isn't the current step.
          const clickable = reachable[i] && i !== current;
          return (
            <li key={s.path} className={cls}>
              {clickable ? (
                <Link to={s.path}>
                  <span className="step-num">{i + 1}</span> {s.label}
                </Link>
              ) : (
                <span>
                  <span className="step-num">{i + 1}</span> {s.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <Sapling stage={current} />
    </aside>
  );
}
