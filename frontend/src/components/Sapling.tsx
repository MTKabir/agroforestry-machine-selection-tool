/** Signature element: a sapling that grows one tier per completed wizard step. */
export default function Sapling({ stage }: { stage: number }) {
  const tier = (n: number) => (stage >= n ? "sapling-tier on" : "sapling-tier");
  return (
    <svg viewBox="0 0 120 150" className="sapling" aria-hidden="true">
      <line x1="18" y1="138" x2="102" y2="138" stroke="var(--bark)" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 138 C 60 110, 58 90, 60 56" className={stage >= 1 ? "sapling-trunk on" : "sapling-trunk"} />
      <g className={tier(1)}>
        <path d="M60 120 C 50 114, 44 112, 36 112" />
        <circle cx="33" cy="112" r="7" />
      </g>
      <g className={tier(2)}>
        <path d="M60 104 C 70 98, 76 96, 84 96" />
        <circle cx="87" cy="96" r="8" />
      </g>
      <g className={tier(3)}>
        <path d="M60 86 C 50 80, 45 78, 38 76" />
        <circle cx="35" cy="75" r="9" />
      </g>
      <g className={tier(4)}>
        <path d="M60 68 C 68 60, 72 58, 78 56" />
        <circle cx="81" cy="54" r="10" />
        <circle cx="60" cy="44" r="11" />
      </g>
    </svg>
  );
}
