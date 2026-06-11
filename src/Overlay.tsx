import { useEffect, useRef } from "react";
import type { Level } from "./levels";
import "./Overlay.css";

interface Props {
  level: Level;
  index: number;
  total: number;
}

export default function Overlay({ level, index, total: _total }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, [index]);

  const isHero = index === 0;
  const isCTA = index === 11;

  return (
    <div ref={ref} className={`ov-root ov-variant--${level.variant ?? "default"} ${isHero ? "ov-hero" : ""}`}>
      {!isHero && <span className="ov-eyebrow">{level.eyebrow}</span>}

      <h2 className={`ov-headline ${isHero ? "ov-headline--hero" : ""}`}>
        {level.headline.split("\n").map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </h2>

      {level.body && (
        <p className="ov-body">
          {level.body.split("\n").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>
      )}

      {level.variant === "innovation" && (
        <span className="ov-badge">Inovasi</span>
      )}

      {isCTA && <CTABlock />}
    </div>
  );
}

function CTABlock() {
  return (
    <div className="ov-cta">
      <a
        href="mailto:Agunglaksono4308@gmail.com"
        className="ov-cta-btn ov-cta-btn--primary"
      >
        Email
      </a>
      <a
        href="https://linkedin.com/in/agung-laksono-250524211"
        target="_blank"
        rel="noopener noreferrer"
        className="ov-cta-btn"
      >
        LinkedIn
      </a>
      <a
        href="https://github.com/Ebastari"
        target="_blank"
        rel="noopener noreferrer"
        className="ov-cta-btn"
      >
        GitHub
      </a>
      <a
        href="https://camera.montana-tech.info/"
        target="_blank"
        rel="noopener noreferrer"
        className="ov-cta-btn ov-cta-btn--demo"
      >
        Live Demo ↗
      </a>
    </div>
  );
}
