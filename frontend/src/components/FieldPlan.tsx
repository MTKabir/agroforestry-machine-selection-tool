/** Landing illustration: a top-down alley-cropping field plan. */
export default function FieldPlan() {
  const treeRows = [40, 150, 260];
  const trees = [30, 90, 150, 210, 270];
  return (
    <svg viewBox="0 0 300 300" className="field-plan" role="img" aria-label="Schematic alley cropping field plan">
      <rect x="4" y="4" width="292" height="292" rx="14" fill="var(--card)" stroke="var(--line)" />
      {[78, 95, 112, 188, 205, 222].map((y) => (
        <line key={y} x1="22" y1={y} x2="278" y2={y} stroke="var(--canopy)" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 9" />
      ))}
      {treeRows.map((y) =>
        trees.map((x) => (
          <g key={x + "-" + y}>
            <circle cx={x} cy={y} r="13" fill="var(--canopy)" fillOpacity="0.9" />
            <circle cx={x - 4} cy={y - 4} r="4" fill="var(--pollen)" fillOpacity="0.85" />
          </g>
        ))
      )}
    </svg>
  );
}
