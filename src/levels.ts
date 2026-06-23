export interface Level {
  src: string;
  eyebrow: string;
  headline: string;
  body: string;
  variant?: "default" | "innovation" | "data";
}

export const LEVELS: Level[] = [
  // 00 — Hero
  {
    src: "/levels/level-00.png",
    eyebrow: "Agung Laksono, S.Hut — Section Head Revegetasi",
    headline: "melalui Kehutanan,\nReklamasi, dan Teknologi",
    body: "Pemulihan lahan pascatambang bukan sekadar menanam. Di balik setiap lereng yang kembali hijau ada perencanaan teknis yang ketat, regulasi yang saya jalankan langsung di lapangan, dan pemantauan berbasis data yang membuktikannya. Saya tidak hanya melaporkan keberhasilan reklamasi — saya membangun sendiri alat yang membuktikannya secara terverifikasi dan audit-ready.",
    variant: "default",
  },

  // 01 — Profil
  {
    src: "/levels/level-01.png",
    eyebrow: "01 — Tentang Saya",
    headline: "Lima Tahun\nDi Garis Depan",
    body: "Section Head Revegetasi · PT Energi Batubara Lestari (Hasnur Group) — sekaligus CEO & Founder PT Montana Wana Teknologi.\nLima tahun memimpin reklamasi pascatambang, dari konstruksi teras dan drainase hingga pelaporan resmi ke ESDM & KLHK. S.Hut INSTIPER Yogyakarta (IPK 3,45 · lulus 3,5 tahun), bersertifikat BNSP Perencanaan Hutan (2024), menguasai GIS/remote sensing, dan membangun sendiri sistem monitoring AI yang kini berstatus HKI terdaftar.",
    variant: "default",
  },

  // 02 — Penataan Lahan
  {
    src: "/levels/level-02.png",
    eyebrow: "02 — Penataan Lahan",
    headline: "Saya Memimpin\nSeluruh Fase Lapangan",
    body: "Sebelum bibit pertama ditanam, saya memastikan lahannya siap: pembersihan area, pengelolaan & penebaran topsoil, konstruksi teras bund, sistem drainase, dan pengendalian erosi aktif.\nSetiap fase — P0, P1, P2 — dijalankan sesuai Permen ESDM No. 10/2023, lengkap dengan penilaian Kriteria Kerusakan Lahan (KKL) dan dokumen teknis reklamasi yang saya susun sendiri.",
    variant: "default",
  },

  // 03 — Regulasi & Perizinan
  {
    src: "/levels/level-03.png",
    eyebrow: "03 — Perizinan & Regulasi",
    headline: "Regulasi Kehutanan\nSaya Jalankan Langsung",
    body: "Saya mengelola siklus penuh tanpa perantara konsultan: pengurusan IPPKH, cruising tegakan sebagai dasar verifikasi PNBP PKH, penyusunan AMDAL & RKL-RPL, serta pelaporan berkala ke ESDM & KLHK.\nKredensial aktif: Ganis CANHUT · Ganis NENHUT · BNSP Perencanaan Hutan (2024) · PROPER Biru (2023–2024) · Operator SIMPEL · Sinergi KLHK · Sicerdas.",
    variant: "default",
  },

  // 04 — Potting Method
  {
    src: "/levels/level-04.png",
    eyebrow: "04 — Inovasi Lapangan",
    headline: "Potting Method —\nSolusi Topsoil Terbatas",
    body: "Lahan pascatambang hampir selalu kekurangan topsoil berkualitas. Saya merancang Potting Method: bibit ditumbuhkan dalam media tanam terkontrol (polybag/pot) sehingga berkembang optimal sebelum dipindah ke lapangan — memutus ketergantungan pada tanah pucuk yang terbatas.\nLahir dari masalah nyata di lapangan, bukan teori — dan terbukti meningkatkan survival rate di PT Energi Batubara Lestari.",
    variant: "innovation",
  },

  // 05 — Nursery
  {
    src: "/levels/level-05.png",
    eyebrow: "05 — Manajemen Persemaian",
    headline: "Nursery Skala Produksi\nDi Bawah Kendali Saya",
    body: "Dari pengadaan benih hingga bibit siap tanam: saya kendalikan penyemaian, penyapihan, seleksi kualitas, dan distribusi ke lapangan.\nUntuk efisiensi data, saya membangun Smart Nursery — aplikasi PWA offline-first dengan Chatbot AI berbasis DeepSeek (Google Apps Script) — yang mengotomatisasi pencatatan produksi nursery, memotong waktu pengolahan data dan menekan error input secara signifikan.",
    variant: "default",
  },

  // 06 — Penanaman
  {
    src: "/levels/level-06.png",
    eyebrow: "06 — Eksekusi Penanaman",
    headline: "Target Tanam\nSaya Pastikan Tercapai",
    body: "Saya memimpin langsung dua Group Leader — GL Penataan Lahan dan GL Nursery — beserta seluruh tim lapangan di bawahnya.\nPerencanaan harian, mingguan, dan bulanan saya susun sendiri; survival rate dievaluasi berkala; kapasitas teknis SDM dibina berkelanjutan — memastikan angka tanam dan kualitas reklamasi tercapai, kuantitas maupun kualitas.",
    variant: "default",
  },

  // 07 — Vegetasi Tumbuh
  {
    src: "/levels/level-07.png",
    eyebrow: "07 — Hasil yang Terverifikasi",
    headline: "Kanopi Menutup.\nLereng Stabil.",
    body: "Ini bukan sekadar penghijauan — ini ekosistem yang dipulihkan secara terukur. Survival rate terpantau dan terdokumentasi; tutupan lahan diverifikasi dengan ArcGIS Pro & Google Earth Engine; kemajuan reklamasi dilaporkan resmi — triwulanan & tahunan — ke ESDM dan KLHK. Terukur, terverifikasi, audit-ready.",
    variant: "default",
  },

  // 08 — Silvopastura
  {
    src: "/levels/level-08.png",
    eyebrow: "08 — Inovasi Sistem",
    headline: "Silvopastura —\nReklamasi Produktif",
    body: "Saya merancang model Silvopastura — penerapan Integrated Farming yang mengintegrasikan reklamasi dengan peternakan, sehingga lahan yang dipulihkan sekaligus menghasilkan nilai ekonomi produktif tanpa mengorbankan kewajiban revegetasi.\nSebagai 'Integrated Farming di Lahan Marginal', inovasi ini meraih QCC Juara 3 Tingkat Perusahaan (2024) — bagian dari inovasi yang diakui tiga tahun berturut-turut (2023–2025).",
    variant: "innovation",
  },

  // 09 — Montana Camera AI
  {
    src: "/levels/level-09.png",
    eyebrow: "09 — Inovasi Teknologi",
    headline: "Montana Camera AI —\nMonitoring Berbasis Data",
    body: "Saya bangun dan deploy sendiri: sistem geotagging real-time berbasis AI yang mengintegrasikan analisis NDVI, estimasi biomassa & cadangan karbon, serta deteksi kesehatan vegetasi (HSV) — dengan watermark GPS & timestamp yang traceable dan audit-ready.\nInti dari ekosistem Montana AI (Smart Nursery · My Montana AI · Dashboard Reklamasi). HKI No. 001165981 — perlindungan 50 tahun (2026) · PWA offline-first · live di camera.montana-tech.info · 770+ kontribusi GitHub.",
    variant: "innovation",
  },

  // 10 — GIS & Remote Sensing
  {
    src: "/levels/level-10.png",
    eyebrow: "10 — Keahlian Spasial",
    headline: "Lapangan & Data —\nSaya Kuasai Keduanya",
    body: "Saya bukan hanya praktisi lapangan. ArcGIS Pro, ArcMap 10.4, Global Mapper, Google Earth Engine, dan citra Sentinel-2 saya gunakan untuk analisis tutupan lahan, penafsiran stok karbon, dan pemetaan drone — langsung menghasilkan data yang masuk ke laporan resmi.\nSebelumnya: Kepala Staf GIS &  Sub Bagian Kelola Lingkungan · PT Taiyoung Engreen (2021–2023).",
    variant: "data",
  },

  // 11 — Karbon & CTA
  {
    src: "/levels/level-11.png",
    eyebrow: "11 — Nilai yang Saya Bawa",
    headline: "Reklamasi Terukur.\nKarbon Terverifikasi.",
    body: "Pelatihan Stok Karbon FOLU Net Sink · IPB (2022) · S.Hut INSTIPER Yogyakarta · IPK 3,45 · TOEFL ITP 500.\nSatu profil yang menyatukan otoritas regulasi, inovasi lapangan terbukti, dan teknologi yang saya bangun sendiri — siap untuk kolaborasi reklamasi, proyek karbon terverifikasi, atau pengembangan sistem monitoring berbasis AI.",
    variant: "data",
  },

  // ─── Scene 2 narrations (root-dive footage) ─────────────────────────────────
  // Ride the second flythrough scene (frames 153–304, the seedling lifted from
  // its polybag → camera diving into the root system). Theme: the deeper
  // foundations & verifiable proof beneath the surface. All facts sourced from
  // the professional-portfolio PDF and not present elsewhere on the site.
  // (src is legacy/unused — set to a representative Scene-2 frame for clarity.)

  // 12 — Riset & Publikasi
  {
    src: "/levels/frame-153.jpg",
    eyebrow: "12 — Riset Terpublikasi",
    headline: "Data Lapangan,\nKarya Ilmiah Terbuka",
    body: "Reklamasi yang saya kelola tidak berhenti di laporan internal — saya terbitkan sebagai riset terbuka yang dapat diaudit: “Estimasi Volume Tegakan dan Valuasi Ekonomi Kayu Reklamasi Berbasis Citra Sentinel-2 dan Google Earth Engine di PT Energi Batubara Lestari”.\nDipublikasikan via Zenodo (DOI 10.5281/zenodo.18908912) — terbuka untuk ditelusuri, diuji ulang, dan dipertanggungjawabkan.",
    variant: "data",
  },

  // 13 — Fondasi Akademik
  {
    src: "/levels/frame-170.jpg",
    eyebrow: "13 — Akar Akademik",
    headline: "Berakar pada Konservasi\n& Rehabilitasi Hutan",
    body: "Sarjana Kehutanan (S.Hut) konsentrasi Konservasi & Rehabilitasi Hutan — INSTIPER Yogyakarta, 2017–2021, IPK 3,45 (Sangat Memuaskan), lulus 3,5 tahun.\nFokus studi yang kini saya jalankan langsung di lapangan: restorasi ekosistem pascatambang dan kebakaran lahan, silvika, inventarisasi hutan, serta pengelolaan DAS.",
    variant: "default",
  },

  // 14 — Fondasi Geospasial (Taiyoung Engreen)
  {
    src: "/levels/frame-187.jpg",
    eyebrow: "14 — Fondasi Geospasial",
    headline: "Sebelum Reklamasi,\nSaya Membaca Lanskap",
    body: "Kepala Staf GIS & Sub Bagian Kelola Lingkungan di PT Taiyoung Engreen (2021–2023): peta RKT, perencanaan jalan sarad, blok tebangan, penafsiran potensi stok karbon, hingga ortofoto drone.\nSekaligus menjaga kawasan: pemantauan erosi, revegetasi kawasan lindung, dan pemantauan satwa liar — fondasi yang kini menyatu dengan reklamasi dan Montana AI.",
    variant: "data",
  },

  // 15 — PT Montana Wana Teknologi
  {
    src: "/levels/frame-221.jpg",
    eyebrow: "15 — Dari Inovasi ke Badan Usaha",
    headline: "Inovasi Lapangan\nMenjadi Perusahaan",
    body: "Yang lahir dari kebutuhan lapangan kini berdiri sebagai badan usaha: PT Montana Wana Teknologi — perusahaan teknologi lingkungan yang saya dirikan dan pimpin sebagai CEO & Founder.\nMenaungi ekosistem Montana AI dan menghubungkan kehutanan, reklamasi, UMKM, dan kecerdasan buatan dalam satu jaringan solusi berkelanjutan — montanawana.org.",
    variant: "innovation",
  },

  // 16 — Ekosistem Montana AI
  {
    src: "/levels/frame-255.jpg",
    eyebrow: "16 — Satu Ekosistem Terhubung",
    headline: "Dari Bibit, ke Karbon,\nke Keputusan",
    body: "Bukan satu aplikasi, melainkan jaringan yang saling terhubung: Smart Nursery (PWA pembibitan offline-first dengan chatbot DeepSeek), My Montana AI (revegetasi & monitoring karbon terintegrasi), dan Dashboard Reklamasi untuk alur kerja lapangan, operasi nursery, dan pelaporan lingkungan.\nSatu rantai data — dari semai hingga laporan.",
    variant: "innovation",
  },

  // 17 — Audit Trail Geospasial
  {
    src: "/levels/frame-290.jpg",
    eyebrow: "17 — Terverifikasi & Tertelusur",
    headline: "GPS, Timestamp, KMZ —\nSetiap Titik Terbukti",
    body: "Setiap data lahir audit-ready: akuisisi lapangan ber-watermark koordinat GPS dan timestamp otomatis, integrasi geospasial dengan visualisasi koordinat dan ekspor KMZ untuk pelaporan tergeoreferensi.\nDari satu pohon di lapangan hingga peta yang dapat diaudit — rantai bukti yang utuh dan dapat ditelusuri.",
    variant: "data",
  },
];

// ─── Cinematic frame sequence (Sengon 3D flythrough) ──────────────────────────
// The rendered frames in /public/levels play as one continuous, scroll-driven
// flythrough stitched from two scenes:
//   • Scene 1 — frame-001 … frame-152: the sengon grow-out (studio plate).
//   • Scene 2 — frame-153 … frame-304: the seedling lifted from its polybag and
//     the camera diving into the exposed root system (added before the certs).
// Narrations 00–11 ride Scene 1; narrations 12–17 (the "deeper foundations &
// proof" set, sourced from the portfolio PDF) ride Scene 2. (Originals archived
// in /frames-original — outside the served bundle.)

export const FRAME_COUNT = 304;

// Optimised flythrough frames: "frame-001.jpg" … "frame-152.jpg" (1-indexed).
// Source renders were downscaled + JPEG-compressed (≈70 MB → ≈5 MB); the high-res
// PNG originals are archived in /frames-original (outside the served bundle).
export const LEVEL_FRAMES: string[] = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/levels/frame-${String(i + 1).padStart(3, "0")}.jpg`
);

// Which narration (index into LEVELS) is shown while a given frame is active.
export function textIndexForFrame(frame: number): number {
  return Math.min(LEVELS.length - 1, Math.floor((frame * LEVELS.length) / FRAME_COUNT));
}
