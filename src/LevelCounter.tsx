import "./LevelCounter.css";

interface Props {
  current: number;
  total: number;
}

export default function LevelCounter({ current, total }: Props) {
  const pct = (current / (total - 1)) * 100;

  return (
    <div className="lc-root" aria-hidden="true">
      <div className="lc-track">
        <div className="lc-fill" style={{ height: `${pct}%` }} />
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`lc-tick ${i <= current ? "lc-tick--active" : ""}`}
            style={{ top: `${(i / (total - 1)) * 100}%` }}
          />
        ))}
      </div>
      <span className="lc-label">
        {String(current).padStart(2, "0")}
        <span className="lc-sep"> / </span>
        {String(total - 1).padStart(2, "0")}
      </span>
    </div>
  );
}
