import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { LEVELS, LEVEL_FRAMES, FRAME_COUNT } from "./levels";
import DocumentationGallery from "./DocumentationGallery";
import VariableProximity from "./VariableProximity";
import "./MorphScroll.css";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ─── Data ─────────────────────────────────────────────────────────────────────

const CV_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1wbaGj4mWzRKdny1uOP8u_iUTGlTON3fc";

const CERT_DATA = [
  {
    eyebrow: "01 — Pendidikan Formal",
    title: "Ijazah S.Hut &\nTranskrip Akademik",
    meta: "INSTIPER Yogyakarta · IPK 3,45 · Lulus 2021 (3,5 tahun)",
  },
  {
    eyebrow: "02 — Pelatihan & Penghargaan",
    title: "Sertifikat Pelatihan\n& Kompetensi",
    meta: "Reklamasi Pascatambang (KLHK) · QCC Juara 3 (2024) · TOEFL ITP 500",
  },
  {
    eyebrow: "03 — Sertifikasi Profesional",
    title: "Sertifikat Kompetensi BNSP\nGANISPH Perencanaan Hutan",
    meta: "LSP Hutan Indonesia / BNSP · Palangka Raya · 2024 (berlaku 5 thn)",
  },
  {
    eyebrow: "04 — Inovasi & Teknologi",
    title: "HKI Montana Camera AI\n& GitHub Contributions",
    meta: "No. 001165981 · Perlindungan 50 tahun (2026) · 770+ kontribusi GitHub",
  },
];

// ─── Scroll choreography ──────────────────────────────────────────────────────
// The experience is one continuous, scroll-scrubbed timeline (NO snap). Each
// integer "stop" is ~1 page of scroll; the 304-frame Sengon flythrough occupies a
// long middle span that is drawn frame-by-frame onto a single <canvas> — like a
// paused video the user scrubs. ScrollSmoother adds the inertia/damping so motion
// has weight instead of rigidly tracking the wheel.
const FLY_START    = 2;                              // first flythrough stop (after 2 banners)
// The flythrough stitches two scenes (304 frames) over a fixed 24 stops, which
// keeps the original per-frame scrub pace (≈12.7 frames/stop). The first 12 stops
// (2..14) are Scene 1, the next 12 (14..26) are Scene 2. The 18 narrations are
// split to match: the first SCENE1_NARR ride Scene 1 one-per-stop, the rest are
// spaced every 2 stops across Scene 2 (so the root-dive footage gets room to
// breathe between captions).
const SCENE1_NARR  = 12;                             // narrations that ride Scene 1 (frames 1..152)
const FLY_STOPS    = 24;                             // scroll units for the whole flythrough
const CERT_START   = FLY_START + FLY_STOPS;          // 26 — certs begin after the flythrough
const CONTACT_STOP = CERT_START + CERT_DATA.length;  // 30
const TOTAL_STOPS  = CONTACT_STOP + 1;               // 31
const SCROLL_VH    = TOTAL_STOPS * 100;              // total scroll height

// ─── Main component ───────────────────────────────────────────────────────────

export default function MorphScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const aboutRef   = useRef<HTMLImageElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const certRefs   = useRef<(HTMLImageElement | null)[]>([]);

  const smootherRef = useRef<ScrollSmoother | null>(null);
  const activeRef   = useRef(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const [activeStop, setActiveStop]   = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [assetsReady, setAssetsReady]   = useState(false);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Canvas frame-sequence renderer ──────────────────────────────────────
    const canvas = canvasRef.current!;
    const ctx2d  = canvas.getContext("2d", { alpha: false })!;
    const dpr    = Math.min(window.devicePixelRatio || 1, 2);

    const frames: HTMLImageElement[] = LEVEL_FRAMES.map((src) => {
      const im = new Image();
      im.decoding = "async";
      im.src = src;
      return im;
    });

    const imgReady = (im?: HTMLImageElement) => !!im && im.complete && im.naturalWidth > 0;

    // Vignette gradient is size-dependent → rebuilt on resize.
    let vignette: CanvasGradient | null = null;
    const buildGrade = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h * 0.5, r = Math.max(w, h) * 0.72;
      const g = ctx2d.createRadialGradient(cx, cy, Math.min(w, h) * 0.22, cx, cy, r);
      g.addColorStop(0,    "rgba(0,0,0,0)");
      g.addColorStop(0.62, "rgba(0,0,0,0)");
      g.addColorStop(1,    "rgba(8,10,12,0.34)");
      vignette = g;
    };

    const sizeCanvas = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width  = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      // Resizing the canvas resets all 2D context state → re-assert high-quality
      // resampling so the 1920px source upscales smoothly instead of blocky.
      ctx2d.imageSmoothingEnabled = true;
      ctx2d.imageSmoothingQuality = "high";
      buildGrade();
    };

    // A tiny monochrome noise tile, drawn faintly over every frame. The flat grade
    // fills (multiply + wash + vignette) band on an 8-bit canvas where the studio
    // background is smooth; this dither breaks the banding up so it reads clean.
    const noiseTile = document.createElement("canvas");
    noiseTile.width = noiseTile.height = 128;
    const nctx = noiseTile.getContext("2d")!;
    const nimg = nctx.createImageData(128, 128);
    for (let i = 0; i < nimg.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      nimg.data[i] = nimg.data[i + 1] = nimg.data[i + 2] = v;
      nimg.data[i + 3] = 255;
    }
    nctx.putImageData(nimg, 0, 0);
    const dither = ctx2d.createPattern(noiseTile, "repeat");

    const coverDraw = (img: HTMLImageElement) => {
      const cw = canvas.width, ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      ctx2d.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    let lastF = -1;
    // Draw a (possibly fractional) frame position with adjacent-frame blending so
    // motion reads as continuous video. The studio plate is kept true to the source
    // (no green crush/wash) with only a soft neutral vignette for framing.
    const drawAt = (f: number) => {
      const i0 = Math.floor(f);
      const i1 = Math.min(FRAME_COUNT - 1, i0 + 1);
      const frac = f - i0;
      const a = frames[i0], b = frames[i1];

      ctx2d.globalCompositeOperation = "source-over";
      ctx2d.globalAlpha = 1;
      if (imgReady(a)) coverDraw(a);
      else if (imgReady(b)) coverDraw(b);
      else return;
      if (frac > 0.01 && b !== a && imgReady(b)) {
        ctx2d.globalAlpha = frac;
        coverDraw(b);
        ctx2d.globalAlpha = 1;
      }

      const w = canvas.width, h = canvas.height;
      ctx2d.globalCompositeOperation = "source-over";
      if (vignette) { ctx2d.fillStyle = vignette; ctx2d.fillRect(0, 0, w, h); }  // soft neutral framing only
      if (dither) {                                  // break 8-bit banding from the flat grade fills
        ctx2d.globalCompositeOperation = "overlay";
        ctx2d.globalAlpha = 0.03;
        ctx2d.fillStyle = dither;
        ctx2d.fillRect(0, 0, w, h);
        ctx2d.globalAlpha = 1;
        ctx2d.globalCompositeOperation = "source-over";
      }

      lastF = f;
    };

    // Proxy whose `.f` is scrubbed 0 → last frame by the timeline.
    const frameProxy = { f: 0 };
    const renderProxy = () => {
      const f = Math.max(0, Math.min(FRAME_COUNT - 1, frameProxy.f));
      if (Math.abs(f - lastF) > 0.004) drawAt(f);
    };

    sizeCanvas();

    // Preload frames; reveal once enough early frames are ready (don't trap the
    // visitor behind all ~70 MB), then keep loading the rest in the background.
    const REVEAL_AT = Math.min(FRAME_COUNT, 36);
    let revealed = false;
    const reveal = () => { if (!revealed) { revealed = true; setAssetsReady(true); } };
    let loadedCount = 0;
    const bump = () => {
      loadedCount++;
      setLoadProgress(Math.min(1, loadedCount / REVEAL_AT));
      if (lastF < 0 && imgReady(frames[0])) drawAt(0);
      if (loadedCount >= REVEAL_AT) reveal();
    };
    frames.forEach((im) => {
      if (imgReady(im)) bump();
      else {
        im.addEventListener("load", bump, { once: true });
        im.addEventListener("error", bump, { once: true });
      }
    });
    const revealTimer = window.setTimeout(reveal, 9000); // safety net — never get stuck

    const onResize = () => { sizeCanvas(); lastF = -1; renderProxy(); };
    window.addEventListener("resize", onResize);

    // ── Inertial smooth scrolling (momentum / damping) ──────────────────────
    if (!prefersReduced && wrapperRef.current && contentRef.current) {
      ScrollSmoother.get()?.kill();
      smootherRef.current = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 1.1,          // seconds of "catch-up" — the weight/inertia
        effects: false,
        normalizeScroll: true,
      });
    }

    // ── Master timeline ─────────────────────────────────────────────────────
    let tl: gsap.core.Timeline | null = null;

    const gctx = gsap.context(() => {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".ms-scroll-space",
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReduced ? false : 0.4,   // tight tracking; smoothness comes from ScrollSmoother
          pin: ".ms-stage",
          anticipatePin: 1,
        },
      });

      // Crossfade helper centred on an integer stop boundary.
      const CF = 0.7;
      const xfade = (from: Element | null, to: Element | null, at: number) => {
        if (to)   tl!.fromTo(to, { opacity: 0 }, { opacity: 1, ease: "none", duration: CF }, at - CF / 2);
        if (from) tl!.to(from, { opacity: 0, ease: "none", duration: CF }, at - CF / 2);
      };

      // Banners → canvas → certs → contact (single canvas covers the whole flythrough).
      xfade(welcomeRef.current, aboutRef.current, 1);
      xfade(aboutRef.current,   canvasRef.current, FLY_START);
      xfade(canvasRef.current,  certRefs.current[0], CERT_START);
      for (let i = 0; i < CERT_DATA.length - 1; i++) {
        xfade(certRefs.current[i], certRefs.current[i + 1], CERT_START + 1 + i);
      }
      xfade(certRefs.current[CERT_DATA.length - 1], contactRef.current, CONTACT_STOP);

      // The flythrough itself: scrub all frames across the canvas's visible span.
      tl.to(frameProxy, {
        f: FRAME_COUNT - 1,
        ease: "none",
        duration: CERT_START - FLY_START,   // flythrough span: all frames over this scroll range
        onUpdate: renderProxy,
      }, FLY_START);

      // Narration captions ride the SAME scrubbed timeline as the video, so the
      // text moves with the footage: enter (rise + line-wipe) → hold (slow drift,
      // readable) → exit (rise out + wipe). Scrolling back reverses it all.
      const narrBlocks = gsap.utils.toArray<HTMLElement>(".ms-narr");
      narrBlocks.forEach((block, k) => {
        // Scene 1 captions sit one-per-stop (2..13); Scene 2 captions are spaced
        // every 2 stops (14,16,18,20,22,24) so the root-dive footage shows between.
        const P = k < SCENE1_NARR
          ? FLY_START + k                                       // Scene 1 — [P, P+1]
          : FLY_START + SCENE1_NARR + 2 * (k - SCENE1_NARR);    // Scene 2 — every 2 stops
        const lines = gsap.utils.toArray<HTMLElement>(block.querySelectorAll(".ms-line-inner"));

        if (prefersReduced) {
          gsap.set(block, { opacity: 0 });
          tl!.to(block, { opacity: 1, ease: "none", duration: 0.3 }, P);
          tl!.to(block, { opacity: 0, ease: "none", duration: 0.3 }, P + 0.72);
          return;
        }

        gsap.set(block, { opacity: 0, y: 28 });
        gsap.set(lines, { yPercent: 118 });

        // ENTER — caption rises in, headline lines wipe up (slightly overlaps prev exit)
        tl!.to(block, { opacity: 1, y: 0, ease: "power2.out", duration: 0.32 }, P - 0.05);
        tl!.to(lines, { yPercent: 0, ease: "power3.out", duration: 0.34, stagger: 0.05 }, P - 0.03);
        // HOLD — slow parallax drift keeps it alive but comfortably readable
        tl!.to(block, { y: -8, ease: "none", duration: 0.47 }, P + 0.27);
        // EXIT — rises out + lines wipe away as the next chapter arrives
        tl!.to(block, { opacity: 0, y: -32, ease: "power2.in", duration: 0.31 }, P + 0.74);
        tl!.to(lines, { yPercent: -50, ease: "power2.in", duration: 0.31 }, P + 0.74);
      });
    });

    // Drive overlay text + progress bar from the timeline's real (post-scrub) progress.
    const dur = tl!.duration();
    let lastP = -1;
    const tickerFn = () => {
      if (!tl) return;
      const p = tl.progress();
      if (p !== lastP) {
        lastP = p;
        if (progressRef.current) progressRef.current.style.transform = `scaleY(${p})`;
      }
      const stop = Math.max(0, Math.min(CONTACT_STOP, Math.floor(p * dur)));
      if (stop !== activeRef.current) {
        activeRef.current = stop;
        setActiveStop(stop);
      }
    };
    gsap.ticker.add(tickerFn);

    ScrollTrigger.refresh();
    // Web fonts load async and can shift layout after init, leaving the pin
    // measured short (a gap under the stage) — recompute once they're ready.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tickerFn);
      window.removeEventListener("resize", onResize);
      clearTimeout(revealTimer);
      gctx.revert();
      smootherRef.current?.kill();
      smootherRef.current = null;
      tl = null;
    };
  }, []);

  // ── Derived UI state ───────────────────────────────────────────────────────
  const isCert    = activeStop >= CERT_START && activeStop < CONTACT_STOP;
  const certIdx   = isCert ? activeStop - CERT_START : -1;
  const showCTA   = activeStop >= FLY_START;

  return (
    <>
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef}>
          <div className="ms-scroll-space" style={{ height: `${SCROLL_VH}vh` }}>
            <div className="ms-stage">

              {/* Visual layers — only one is opaque at a time */}
              {/* Slide 0 — interactive mining→reclamation split-reveal hero (mouse-driven) */}
              <div ref={welcomeRef} className="ms-layer ms-hero-layer" style={{ opacity: 1, zIndex: 1 }}>
                <HeroSplit active={activeStop === 0} />
              </div>
              <img ref={aboutRef} className="ms-layer ms-layer--cover" src="/hero/About.png"
                   alt="Tentang Saya — Agung Laksono S.Hut, Profesional Kehutanan dan Pengembang Montana Camera AI"
                   decoding="async" style={{ opacity: 0, zIndex: 2 }} />

              <canvas ref={canvasRef} className="ms-layer ms-canvas"
                      aria-label="Flythrough 3D revegetasi Sengon di lahan reklamasi pascatambang"
                      style={{ opacity: 0, zIndex: 3 }} />

              {CERT_DATA.map((c, i) => (
                <img
                  key={i}
                  ref={(el) => { certRefs.current[i] = el; }}
                  className="ms-layer ms-layer--contain"
                  src={`/certs-gallery/cert-g${i + 1}.png`}
                  alt={c.title.replace("\n", " ")}
                  decoding="async"
                  style={{ opacity: 0, zIndex: 4 + i }}
                />
              ))}

              {/* Closing screen — 1 : 3 split: quote band over a looping autoplay video */}
              <div ref={contactRef} className="ms-layer ms-contact-stage"
                   style={{ opacity: 0, zIndex: 4 + CERT_DATA.length }}>
                <div className="ms-contact-quote">
                  <span className="ms-contact-quote-mark" aria-hidden="true">&ldquo;</span>
                  <p>Siap berkolaborasi, berinovasi, dan tumbuh bersama perusahaan yang visioner.</p>
                </div>
                <video
                  className="ms-contact-video"
                  src="/hero/Last.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  ref={(el) => { if (el) el.muted = true; }}
                />
              </div>

              {/* Overlays */}
              {activeStop === 0 && <WelcomeOverlay />}
              {activeStop === 1 && <AboutOverlay />}

              {/* Persistent flythrough captions — moved by the scrubbed timeline */}
              {LEVELS.map((lvl, k) => (
                <NarrationBlock key={k} level={lvl} index={k} />
              ))}

              {isCert && certIdx >= 0 && (
                <CertOverlay key={certIdx} cert={CERT_DATA[certIdx]} index={certIdx} total={CERT_DATA.length} />
              )}

              {showCTA && <PersistentCTA onDocsClick={() => setGalleryOpen(true)} />}

              {activeStop === 0 && <WelcomeActions />}
              {activeStop === 0 && <ScrollHint />}
            </div>
          </div>
        </div>
      </div>

      <div className="ms-progress" aria-hidden="true">
        <div ref={progressRef} className="ms-progress-fill" />
      </div>

      {galleryOpen && (
        <DocumentationGallery onClose={() => setGalleryOpen(false)} />
      )}

      <IntroLoader progress={loadProgress} done={assetsReady} />
    </>
  );
}

// ─── Intro loader ─────────────────────────────────────────────────────────────

function IntroLoader({ progress, done }: { progress: number; done: boolean }) {
  const pct = Math.round(progress * 100);
  return (
    <div className={`ms-loader ${done ? "ms-loader--done" : ""}`} aria-hidden={done}>
      <span className="ms-loader-brand">Agung Laksono · Portofolio</span>
      <div className="ms-loader-track">
        <div className="ms-loader-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="ms-loader-pct">Memuat pengalaman sinematik… {pct}%</span>
    </div>
  );
}

// ─── Slide-0 interactive hero ───────────────────────────────────────────────
// One panoramic plate (mine on the left, reclaimed forest on the right, the
// engineer bridging both) shown three times: a neutral graded BASE, plus a
// brighter+sharper MINE grade masked to the left half and a brighter, lusher
// FOREST grade masked to the right half. The cursor's horizontal position is
// smoothed with a rAF lerp (no GSAP here — this island owns its own loop) into a
// value n ∈ [-1,1]; moving left fades the mine grade up (industrial clarity —
// benches & haul roads read sharper), moving right fades the forest grade up
// (warm, lush) plus a soft golden sun bloom. The brighter copies crossfade over
// a held-back base so the swing stays a controlled, premium lift.
function HeroSplit({ active }: { active: boolean }) {
  const rootRef  = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current, media = mediaRef.current;
    if (!root || !media) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Inactive / touch / reduced-motion → calm neutral plate, no listeners.
    if (!active || !fine || reduced) {
      root.style.setProperty("--mine", "0");
      root.style.setProperty("--forest", "0");
      root.style.setProperty("--sun", "0");
      media.style.transform = "scale(1.045)";
      return;
    }

    let cur = 0, target = 0, raf = 0, running = false;
    const EASE = 0.09;                 // catch-up factor → smooth, weighted follow

    const frame = () => {
      cur += (target - cur) * EASE;
      if (Math.abs(target - cur) < 0.0006) cur = target;

      const mine   = cur < 0 ? -cur : 0;   // cursor left  → brighten + sharpen mining
      const forest = cur > 0 ?  cur : 0;    // cursor right → brighten forest
      root.style.setProperty("--mine", mine.toFixed(4));
      root.style.setProperty("--forest", forest.toFixed(4));
      root.style.setProperty("--sun", (forest * 0.92).toFixed(4));

      media.style.transform = `translate3d(${(cur * 7).toFixed(2)}px,0,0) scale(1.045)`;

      if (cur !== target) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      target = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      kick();
    };
    const onLeave = () => { target = 0; kick(); };

    media.style.transform = "scale(1.045)";
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <div ref={rootRef} className="ms-hero-split">
      <div ref={mediaRef} className="ms-hero-media">
        <img className="ms-hero-img ms-hero-img--base" src="/hero/Welcome.png"
             alt="Membangun Lanskap Berkelanjutan melalui Kehutanan, Reklamasi, dan Teknologi — Agung Laksono S.Hut"
             fetchPriority="high" decoding="async" />
        <img className="ms-hero-img ms-hero-img--mine" src="/hero/Welcome.png"
             alt="" aria-hidden="true" decoding="async" />
        <img className="ms-hero-img ms-hero-img--forest" src="/hero/Welcome.png"
             alt="" aria-hidden="true" decoding="async" />
        <div className="ms-hero-sun" aria-hidden="true" />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// All captions live in the DOM at once; the scrubbed master timeline animates
// them (opacity / y / per-line mask) so the text moves in lock-step with the
// video. Each headline line is wrapped in a mask (.ms-line) for the wipe reveal.
function NarrationBlock({ level, index }: { level: typeof LEVELS[0]; index: number }) {
  return (
    <div className={`ms-overlay ms-narr ms-overlay--${level.variant ?? "default"}`}>
      <span className="ms-eyebrow">{level.eyebrow}</span>

      <h2 className="ms-headline">
        {level.headline.split("\n").map((line, i) => (
          <span className="ms-line" key={i}>
            <span className="ms-line-inner">{line}</span>
          </span>
        ))}
      </h2>

      {level.body && (
        <p className="ms-body">
          {level.body.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}
        </p>
      )}

      {index === 0 && (
        <div className="ms-hero-scroll" aria-hidden="true">
          <div className="ms-hero-scroll-line" />
        </div>
      )}
    </div>
  );
}

function CertOverlay({
  cert, index, total,
}: { cert: typeof CERT_DATA[0]; index: number; total: number }) {
  return (
    <div className="ms-cert-overlay">
      <div className="ms-cert-tag">Sertifikasi &amp; Lisensi Profesional</div>
      <div className="ms-cert-meta">
        <span className="ms-cert-eyebrow">{cert.eyebrow}</span>
        <h3 className="ms-cert-title">
          {cert.title.split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </h3>
        <p className="ms-cert-info">{cert.meta}</p>
      </div>
      <div className="ms-cert-counter">
        <span className="ms-cert-num">{String(index + 1).padStart(2, "0")}</span>
        <div className="ms-cert-track">
          <div className="ms-cert-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
        <span className="ms-cert-total">{String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

function PersistentCTA({ onDocsClick }: { onDocsClick: () => void }) {
  return (
    <div className="ms-persistent-cta">
      <a href="mailto:Agunglaksono4308@gmail.com" className="ms-cta-btn ms-cta-btn--primary">
        Email
      </a>
      <a
        href="https://linkedin.com/in/agung-laksono-250524211"
        target="_blank" rel="noopener noreferrer"
        className="ms-cta-btn"
      >
        LinkedIn
      </a>
      <a
        href="https://github.com/Ebastari"
        target="_blank" rel="noopener noreferrer"
        className="ms-cta-btn"
      >
        GitHub
      </a>
      <button className="ms-cta-btn ms-cta-btn--docs" onClick={onDocsClick}>
        Dokumentasi
      </button>
      <a
        href={CV_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="ms-cta-btn ms-cta-btn--cv"
        aria-label="Download Curriculum Vitae"
      >
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>CV</span>
      </a>
    </div>
  );
}

function WelcomeActions() {
  return (
    <div className="ms-welcome-actions">
      <a
        href="./"
        className="ms-action-btn ms-action-btn--home"
        aria-label="Kembali ke halaman awal"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>
        </svg>
        <span>Beranda</span>
      </a>
      <a
        href={CV_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="ms-action-btn ms-action-btn--cv"
        aria-label="Download Curriculum Vitae"
      >
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>Download CV</span>
      </a>

      <span className="ms-welcome-divider" aria-hidden="true" />

      <div className="ms-welcome-social">
        <a className="ms-social-icon ms-social-icon--wa" href="https://wa.me/6281122220044" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.885 3.488"/></svg>
        </a>
        <a className="ms-social-icon" href="mailto:Agunglaksono4308@gmail.com" aria-label="Email" title="Email">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
        </a>
        <a className="ms-social-icon" href="tel:+6281122220044" aria-label="Telepon" title="0811-2222-0044">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </a>
        <a className="ms-social-icon ms-social-icon--in" href="https://linkedin.com/in/agung-laksono-250524211" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a className="ms-social-icon ms-social-icon--gh" href="https://github.com/Ebastari" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </a>
      </div>
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="ms-scroll-hint">
      <span className="ms-scroll-label">Scroll</span>
      <div className="ms-scroll-line" />
    </div>
  );
}

const WELCOME_HEADING_LINES = ["melalui Kehutanan,", "Reklamasi, dan", "Teknologi"];

function WelcomeOverlay() {
  // Container the proximity effect measures the cursor against (the whole overlay
  // box), so the headline letters bloom in weight as the cursor nears them.
  const headingRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={headingRef} className="ms-welcome-overlay">
      <span className="ms-welcome-sub">Membangun Lanskap Berkelanjutan</span>
      <h1 className="ms-welcome-heading">
        {WELCOME_HEADING_LINES.map((line, i) => (
          <VariableProximity
            key={i}
            label={line}
            className="ms-welcome-heading-line"
            fromFontVariationSettings="'wght' 600, 'opsz' 144"
            toFontVariationSettings="'wght' 1000, 'opsz' 144"
            containerRef={headingRef}
            radius={140}
            falloff="gaussian"
            style={{ display: "block" }}
          />
        ))}
      </h1>
      <p className="ms-welcome-greeting">Selamat datang di portofolio saya.</p>
      <p className="ms-welcome-desc">
        Di sini saya membagikan pengalaman, proyek, dan inovasi dalam revegetasi
        dan reklamasi pascatambang — menyatukan otoritas regulasi kehutanan,
        inovasi lapangan yang terbukti, dan teknologi monitoring berbasis
        geospasial dan AI yang saya bangun sendiri.
      </p>
    </div>
  );
}

function AboutOverlay() {
  return (
    <div className="ms-about-overlay">
      <p className="ms-about-bio">
        Agung Laksono adalah praktisi kehutanan, peneliti lingkungan, dan
        pengembang teknologi yang berfokus pada revegetasi, reklamasi
        pascatambang, serta monitoring lingkungan berbasis geospasial. Ia
        merupakan CEO & Founder PT Montana Wana Teknologi dan penggagas Montana AI,
        platform digital untuk pemantauan pembibitan, reklamasi, inventarisasi
        vegetasi, estimasi karbon, dan analisis lingkungan berbasis data — kini
        terlindungi Hak Kekayaan Intelektual resmi.
      </p>
      <p className="ms-about-bio">
        Selain berpengalaman dalam operasional reklamasi dan revegetasi, ia
        aktif mengembangkan solusi yang mengintegrasikan GPS, drone, citra
        satelit, dan kecerdasan buatan untuk mendukung monitoring lingkungan dan
        pengambilan keputusan yang lebih akurat. Minat risetnya meliputi
        reklamasi lahan pascatambang, kehutanan, valuasi sumber daya alam,
        serta teknologi geospasial untuk pengelolaan lingkungan berkelanjutan.
      </p>
      <p className="ms-about-note">
        Catatan: Informasi ini disusun berdasarkan data yang tersedia secara
        publik — termasuk profil profesional, sertifikasi kompetensi, dan
        dokumentasi lapangan yang terverifikasi.
      </p>
    </div>
  );
}

// (Footer removed — contact lives on the welcome screen as icon links.)
