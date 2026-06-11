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
    eyebrow: "00 — Kalimantan Selatan, Indonesia",
    headline: "FROM DISTURBED LAND\nTO INTELLIGENT RESTORATION",
    body: "",
    variant: "default",
  },

  // 01 — Profil
  {
    src: "/levels/level-01.png",
    eyebrow: "01 — Section Head Revegetasi",
    headline: "Agung Laksono, S.Hut",
    body: "Environmental & Reclamation Specialist · ±5 Tahun Pengalaman\nPT Energi Batubara Lestari · Hasnur Group · Maret 2023 – Sekarang\nBanjarbaru, Kalimantan Selatan",
    variant: "default",
  },

  // 02 — Penataan Lahan
  {
    src: "/levels/level-02.png",
    eyebrow: "02 — Penataan Lahan Pascatambang",
    headline: "Dari Tambang\nke Tapak Tanam",
    body: "Pembersihan lahan · Pengelolaan & penebaran topsoil\nPembuatan teras · Drainase · Pengendalian erosi\nFase P0 — Persiapan Lahan · Permen ESDM No. 10/2023",
    variant: "default",
  },

  // 03 — Standar & Regulasi
  {
    src: "/levels/level-03.png",
    eyebrow: "03 — Perizinan & Kepatuhan",
    headline: "Reklamasi\nBerbasis Regulasi",
    body: "IPPKH · PNBP PKH · AMDAL · RKL-RPL · PROPER Biru (2023–2024)\nGanis CANHUT · Ganis NENHUT · BNSP GANISPH Perencanaan Hutan (2024)\nKoordinasi ESDM · KLHK · Dinas Lingkungan Hidup",
    variant: "default",
  },

  // 04 — Potting Method
  {
    src: "/levels/level-04.png",
    eyebrow: "04 — Inovasi Lapangan",
    headline: "Potting Method",
    body: "Solusi revegetasi pada lahan defisit topsoil — bibit ditanam pada media terkontrol (polybag/pot) sehingga pertumbuhan optimal tanpa bergantung pada ketersediaan tanah pucuk.\nDiciptakan & diterapkan di PT Energi Batubara Lestari · Hasnur Group",
    variant: "innovation",
  },

  // 05 — Nursery
  {
    src: "/levels/level-05.png",
    eyebrow: "05 — Manajemen Nursery",
    headline: "Persemaian\nSkala Produksi",
    body: "Pengadaan benih · Penyemaian · Penyapihan · Seleksi & distribusi bibit siap tanam\nChatbot AI berbasis DeepSeek (Google Apps Script) untuk otomatisasi data pembibitan\nPT Taiyoung Engreen 2021–2023 · PT Energi Batubara Lestari 2023–Sekarang",
    variant: "default",
  },

  // 06 — Penanaman
  {
    src: "/levels/level-06.png",
    eyebrow: "06 — Eksekusi Penanaman",
    headline: "Target Tanam\nTerkendali",
    body: "Fase P1 · Kualitas & kuantitas terjaga · Survival rate termonitor\nMemimpin GL Penataan Lahan & GL Nursery · Koordinasi tim lapangan multi-unit\nEvaluasi kinerja periodik & pembinaan SDM lapangan",
    variant: "default",
  },

  // 07 — Vegetasi Tumbuh
  {
    src: "/levels/level-07.png",
    eyebrow: "07 — Revegetasi Berhasil",
    headline: "Kanopi Menutup,\nEkosistem Pulih",
    body: "Fase P2 · Pemeliharaan & evaluasi berkala\nPemantauan tutupan lahan via ArcGIS Pro & Google Earth Engine\nPelaporan kemajuan reklamasi triwulanan & tahunan ke ESDM & KLHK",
    variant: "default",
  },

  // 08 — Silvopastura
  {
    src: "/levels/level-08.png",
    eyebrow: "08 — Inovasi Lapangan",
    headline: "Silvopastura",
    body: "Integrasi reklamasi + peternakan — kewajiban revegetasi sekaligus nilai ekonomi produktif dari lahan yang sedang dipulihkan.\nQCC Juara 3 Tingkat Perusahaan (2024) · Peningkatan Nilai Ekonomi di Lahan Marginal\nPT Energi Batubara Lestari · Hasnur Group",
    variant: "innovation",
  },

  // 09 — Montana Camera AI
  {
    src: "/levels/level-09.png",
    eyebrow: "09 — Inovasi Digital",
    headline: "Montana Camera AI",
    body: "Sistem geotagging real-time berbasis AI · Analisis NDVI · Estimasi biomassa & cadangan karbon · Deteksi kesehatan vegetasi (HSV) · PWA offline-first\nHKI No. 001165981 (2026) · Inventor: Agung Laksono, S.Hut\nLive: camera.montana-tech.info · GitHub 723 kontribusi",
    variant: "innovation",
  },

  // 10 — GIS & Remote Sensing
  {
    src: "/levels/level-10.png",
    eyebrow: "10 — Geospasial & Remote Sensing",
    headline: "Analisis Spasial\nEkosistem",
    body: "ArcGIS Pro · ArcMap 10.4 · Global Mapper · Google Earth Engine\nAnalisis NDVI · Penafsiran stok karbon · Pemetaan drone & ortofoto\nKepala Staf GIS · PT Taiyoung Engreen 2021–2023",
    variant: "data",
  },

  // 11 — Karbon & Penutup
  {
    src: "/levels/level-11.png",
    eyebrow: "11 — Karbon & Biomassa",
    headline: "Restorasi yang Terukur\ndan Dapat Diverifikasi",
    body: "Estimasi biomassa & cadangan karbon · Pelatihan Stok Karbon Folu Net Sink IPB (2022)\nMy Montana AI — Platform Revegetasi & Monitoring Karbon Terintegrasi\nS.Hut Instiper Yogyakarta · IPK 3.45 · TOEFL ITP 500",
    variant: "data",
  },
];
