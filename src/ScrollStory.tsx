import { useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LEVELS } from "./levels";
import Overlay from "./Overlay";
import LevelCounter from "./LevelCounter";
import "./ScrollStory.css";

gsap.registerPlugin(ScrollTrigger);

// Preload images sequentially to prevent flash-of-white during fast scrub
function preloadSequential(srcs: string[]) {
  let i = 0;
  function next() {
    if (i >= srcs.length) return;
    const img = new Image();
    img.onload = img.onerror = next;
    img.src = srcs[i++];
  }
  // Kick off first 3 in parallel, rest sequential
  next(); next(); next();
}

export default function ScrollStory() {
  const root = useRef<HTMLDivElement>(null);
  const [activeLevel, setActiveLevel] = useState(0);
  const activeLevelRef = useRef(0);

  const handleProgress = useCallback((progress: number) => {
    const n = LEVELS.length;
    const idx = Math.min(n - 1, Math.floor(progress * n));
    if (idx !== activeLevelRef.current) {
      activeLevelRef.current = idx;
      setActiveLevel(idx);
    }
  }, []);

  useLayoutEffect(() => {
    preloadSequential(LEVELS.map((l) => l.src));

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>(".ss-layer");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".ss-scroll-space",
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReduced ? false : 1.2,
          pin: ".ss-stage",
          onUpdate: (self) => handleProgress(self.progress),
          anticipatePin: 1,
        },
      });

      layers.forEach((layer, i) => {
        if (i === 0) return;
        const prev = layers[i - 1];
        // Levels 9→10 and 10→11 get a data-domain filter transition
        const isDataTransition = i === 10 || i === 11;

        if (prefersReduced) {
          tl.fromTo(layer, { opacity: 0 }, { opacity: 1, ease: "none", duration: 1 }, i - 1);
          tl.to(prev, { opacity: 0, ease: "none", duration: 1 }, i - 1);
        } else if (isDataTransition) {
          // Data-domain transition (field→NDVI, NDVI→carbon): subtle hue+saturation shift
          tl.fromTo(
            layer,
            { opacity: 0, scale: 1.12, filter: "saturate(0.4) hue-rotate(15deg)" },
            { opacity: 1, scale: 1, filter: "saturate(1) hue-rotate(0deg)", ease: "none", duration: 1 },
            i - 1
          );
          tl.to(prev, { scale: 1.12, filter: "saturate(0.4) hue-rotate(-15deg)", ease: "none", duration: 1 }, i - 1);
        } else {
          // Normal morph zoom: scale + crossfade only, no filter touch
          tl.fromTo(
            layer,
            { opacity: 0, scale: 1.12 },
            { opacity: 1, scale: 1, ease: "none", duration: 1 },
            i - 1
          );
          // Previous layer zooms in as new one arrives (morph zoom illusion)
          tl.to(prev, { scale: 1.12, ease: "none", duration: 1 }, i - 1);
        }
      });
    }, root);

    return () => ctx.revert();
  }, [handleProgress]);

  return (
    <div ref={root}>
      <div className="ss-scroll-space" style={{ height: `${LEVELS.length * 100}vh` }}>
        <div className="ss-stage">
          {LEVELS.map((lvl, i) => (
            <img
              key={i}
              className="ss-layer"
              src={lvl.src}
              alt={i === 0 ? "Lanskap reklamasi pascatambang Indonesia dilihat dari ketinggian" : ""}
              decoding="async"
              fetchPriority={i < 2 ? "high" : "low"}
              style={{ opacity: i === 0 ? 1 : 0, zIndex: i }}
            />
          ))}

          <Overlay level={LEVELS[activeLevel]} index={activeLevel} total={LEVELS.length} />
          <LevelCounter current={activeLevel} total={LEVELS.length} />
          <ScrollIndicator visible={activeLevel === 0} />
        </div>
      </div>
    </div>
  );
}

function ScrollIndicator({ visible }: { visible: boolean }) {
  return (
    <div className={`ss-scroll-indicator ${visible ? "ss-scroll-indicator--visible" : ""}`}>
      <span>Scroll</span>
      <div className="ss-scroll-arrow" />
    </div>
  );
}
