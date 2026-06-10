import { Link, Outlet } from "react-router-dom";
import { useWizard } from "../state/WizardContext";
import StepRail from "./StepRail";

export default function WizardLayout() {
  const { reset } = useWizard();
  return (
    <div className="wizard-shell">
      <header className="topbar">
        <Link to="/" className="wordmark">Agroforestry</Link>
        <Link to="/wizard/type" onClick={reset} className="link-quiet">Restart</Link>
      </header>
      <div className="wizard-body">
        <StepRail />
        <main className="wizard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
