import { Link, useLocation } from "react-router-dom";
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
  const current = Math.max(0, STEPS.findIndex((s) => pathname.startsWith(s.path)));

  return (
    <aside className="step-rail">
      <ol>
        {STEPS.map((s, i) => {
          const cls = i < current ? "done" : i === current ? "current" : "";
          return (
            <li key={s.path} className={cls}>
              {i < current ? (
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
