import { Link } from "react-router-dom";
import FieldPlan from "../components/FieldPlan";

const STEPS = [
  ["Choose system", "Silvoarable or silvopastoral"],
  ["Species combination", "Trees + crops or livestock"],
  ["Pick operation", "Planting, pruning, harvesting"],
  ["Browse machines", "Cards with full specs"],
  ["See manufacturers", "Grouped by data transparency"],
];

export default function Landing() {
  return (
    <div className="landing">
      <header className="topbar">
        <span className="wordmark">Agroforestry</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">For modern farmers</p>
          <h1>
            Design your agroforestry,
            <br />
            find the right machine.
          </h1>
          <p className="lede">
            A guided 5-step planner that pairs your land — silvoarable or silvopastoral — with
            curated planting, pruning and harvesting equipment.
          </p>
          <div className="hero-actions">
            <Link to="/wizard/type" className="btn">Start the design tool</Link>
            <a href="#how" className="btn btn-ghost">How it works</a>
          </div>
          <ul className="hero-points">
            <li>Real machinery from real manufacturers</li>
            <li>Design in 5 steps</li>
          </ul>
        </div>
        <div className="hero-art">
          <FieldPlan />
          <p className="hero-caption">75+ machines · Planting · Pruning · Harvesting</p>
        </div>
      </section>

      <section id="how" className="how">
        <h2>How it works</h2>
        <ol className="how-steps">
          {STEPS.map(([title, blurb], i) => (
            <li key={title}>
              <span className="step-num big">{i + 1}</span>
              <h3>{title}</h3>
              <p>{blurb}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="footer">Built with care for agroforestry farmers.</footer>
    </div>
  );
}
