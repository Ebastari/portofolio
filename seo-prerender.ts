import type { Plugin } from "vite";
import { LEVELS } from "./src/levels";

// ─────────────────────────────────────────────────────────────────────────────
// SEO pre-render — injects the narrative content of src/levels.ts into
// index.html as real, semantic, in-flow HTML so crawlers (and no-JS visitors)
// get the full story without executing the app.
//
// The block sits in normal flow after #root, styled to match the site theme
// (see .seo-static in src/index.css). While the DroneIntro curtain is up it is
// covered by the fixed overlay; when the visitor presses "Explore", App.tsx
// removes it so it can never interfere with ScrollSmoother's layout metrics.
// Crawlers never press Explore, so for them it stays part of the rendered DOM.
// No display:none / visibility tricks are used (cloaking-safe).
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = "https://www.montanawana.org/";
const CV_PATH = "./cv/CV-Agung-Laksono-Reklamasi-Revegetasi.pdf";

// Scene 1 narrations (00–11) ride frames 1..152; pick the frame active at each
// stop. Scene 2 narrations (12–17) already carry a real representative frame in
// their `src` (the level-XX.png names of Scene 1 are legacy and don't exist).
const SCENE1_NARR = 12;
const SCENE1_FRAMES = 152;

function frameSrc(index: number): string {
  if (index >= SCENE1_NARR) return "." + LEVELS[index].src;
  const n = Math.min(SCENE1_FRAMES, Math.round((index * SCENE1_FRAMES) / SCENE1_NARR) + 1);
  return `./levels/frame-${String(n).padStart(3, "0")}.jpg`;
}

// Descriptive Indonesian alt text per narration, matching each level's context.
const IMG_ALTS: string[] = [
  "Bibit sengon untuk revegetasi lahan reklamasi pascatambang — pembuka flythrough sinematik portofolio Agung Laksono",
  "Agung Laksono, S.Hut — Section Head Revegetasi PT Energi Batubara Lestari (Hasnur Group), Kalimantan Selatan",
  "Penataan lahan reklamasi pascatambang di Kalimantan Selatan: penebaran topsoil, teras bund, dan sistem drainase sesuai Permen ESDM No. 10/2023",
  "Pengurusan IPPKH, cruising tegakan, dan verifikasi PNBP PKH — kepatuhan regulasi kehutanan yang dijalankan langsung",
  "Potting Method — inovasi pembibitan dalam media tanam terkontrol untuk lahan reklamasi dengan topsoil terbatas",
  "Manajemen persemaian (nursery) skala produksi dengan aplikasi Smart Nursery berbasis PWA offline-first",
  "Eksekusi penanaman revegetasi lahan pascatambang bersama tim Group Leader Penataan Lahan dan Nursery",
  "Kanopi vegetasi menutup dan lereng stabil — hasil reklamasi terverifikasi dengan ArcGIS Pro dan Google Earth Engine",
  "Silvopastura — integrasi reklamasi pascatambang dengan peternakan pada lahan marginal, QCC Juara 3 (2024)",
  "Montana Camera AI — sistem geotagging real-time dengan analisis NDVI, estimasi biomassa, dan cadangan karbon",
  "Analisis GIS dan remote sensing dengan ArcGIS Pro, Google Earth Engine, dan citra Sentinel-2 untuk pemantauan tutupan lahan reklamasi",
  "Reklamasi terukur dan estimasi karbon terverifikasi — pelatihan Stok Karbon FOLU Net Sink IPB",
  "Riset terpublikasi: estimasi volume tegakan reklamasi berbasis citra Sentinel-2 dan Google Earth Engine (DOI Zenodo)",
  "Akar bibit sengon — fondasi akademik Sarjana Kehutanan konsentrasi Konservasi dan Rehabilitasi Hutan, INSTIPER Yogyakarta",
  "Pemetaan geospasial dan ortofoto drone di PT Taiyoung Engreen — fondasi karier GIS sebelum reklamasi",
  "PT Montana Wana Teknologi — perusahaan teknologi lingkungan yang menaungi ekosistem Montana AI",
  "Ekosistem Montana AI: Smart Nursery, My Montana AI, dan Dashboard Reklamasi dalam satu rantai data",
  "Audit trail geospasial: watermark GPS, timestamp, dan ekspor KMZ untuk pelaporan reklamasi tergeoreferensi",
];

const esc = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const oneLine = (s: string) => s.split("\n").join(" ");
const paragraphs = (s: string) =>
  s.split("\n").map((line) => `      <p>${esc(line)}</p>`).join("\n");

function buildStaticHtml(): string {
  const sections = LEVELS.map((lvl, k) => {
    // Level 00's headline continues the welcome sub-line shown in the app.
    const h2 = k === 0 ? `Membangun Lanskap Berkelanjutan ${oneLine(lvl.headline)}` : oneLine(lvl.headline);
    return `    <section>
      <p class="seo-kicker">${esc(lvl.eyebrow)}</p>
      <h2>${esc(h2)}</h2>
      <img src="${frameSrc(k)}" alt="${esc(IMG_ALTS[k] ?? lvl.eyebrow)}" loading="lazy" decoding="async" />
${paragraphs(lvl.body)}
    </section>`;
  }).join("\n");

  return `
  <main id="seo-static" class="seo-static">
    <article>
      <header>
        <h1>${esc(LEVELS[0].eyebrow)}</h1>
        <p class="seo-lead">Portofolio profesional reklamasi &amp; revegetasi pascatambang dari Banjarbaru, Kalimantan Selatan — memadukan otoritas regulasi kehutanan, inovasi lapangan terbukti, dan teknologi monitoring berbasis geospasial &amp; AI.</p>
      </header>
${sections}
      <section>
        <h2>Kontak &amp; Tautan</h2>
        <p>Banjarbaru, Kalimantan Selatan, Indonesia · <a href="mailto:Agunglaksono4308@gmail.com">Agunglaksono4308@gmail.com</a></p>
        <ul>
          <li><a href="https://linkedin.com/in/agung-laksono-250524211" rel="me">Profil LinkedIn Agung Laksono</a></li>
          <li><a href="https://github.com/Ebastari" rel="me">GitHub Ebastari — 770+ kontribusi</a></li>
          <li><a href="https://camera.montana-tech.info/">Montana Camera AI — aplikasi monitoring reklamasi berbasis AI</a></li>
          <li><a href="${CV_PATH}">Unduh CV Agung Laksono — Spesialis Reklamasi &amp; Revegetasi (PDF)</a></li>
          <li><a href="${SITE_URL}">Beranda portofolio</a></li>
        </ul>
      </section>
    </article>
  </main>`;
}

export default function seoPrerender(): Plugin {
  return {
    name: "seo-prerender",
    transformIndexHtml(html) {
      return html.replace('<div id="root"></div>', `<div id="root"></div>${buildStaticHtml()}`);
    },
  };
}
