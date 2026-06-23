import { useEffect, useState } from "react";
import "./DroneIntro.css";

/**
 * Full-screen landing "curtain" that makes the drone_nursery 3D scene the first
 * thing every visitor sees. It is the standalone, dependency-free HTML in
 * /public (model-viewer + an inlined GLB), embedded here as an iframe so the
 * heavy 19 MB asset stays isolated from the React/GSAP bundle.
 *
 * The hero's "Explore" button posts a `drone:explore` message up to this parent;
 * we fade the curtain out and, once the transition ends, call `onEnter()` so the
 * app can mount the main scroll experience underneath.
 */
export default function DroneIntro({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data && e.data.type === "drone:explore") setLeaving(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div
      className={`drone-intro${leaving ? " is-leaving" : ""}`}
      aria-hidden={leaving}
      onTransitionEnd={(e) => {
        if (leaving && e.propertyName === "opacity") onEnter();
      }}
    >
      <iframe
        className="drone-intro-frame"
        src="./drone_nursery.html"
        title="Agung Laksono — Forester Engineer, Reclamation Practitioner, AI Enthusiast"
        loading="eager"
      />
    </div>
  );
}
