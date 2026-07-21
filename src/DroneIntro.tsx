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
      if (e.data && e.data.type === "drone:explore") {
        // MorphScroll isn't mounted until onEnter fires at the END of the 0.65s
        // fade, so for that whole fade the only thing behind the thinning curtain
        // is the prerendered crawler block — it would visibly bleed through. Drop
        // it as the fade starts; App.tsx removes it again on enter as a fallback
        // (and stays the guarantee that it is gone before ScrollSmoother measures).
        document.getElementById("seo-static")?.remove();
        setLeaving(true);
      }
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
