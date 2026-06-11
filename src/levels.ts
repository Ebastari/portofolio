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
    eyebrow: "Agung Laksono, S.Hut — Kalimantan Selatan",
    headline: "FROM DISTURBED LAND\nTO INTELLIGENT RESTORATION",
    body: "Ini adalah pekerjaan saya.",
    variant: "default",
  },

  // 01 — Profil
  {
    src: "/levels/level-01.png",
    eyebrow: "01 — Tentang Saya",
    headline: "Agung Laksono, S.Hut",
    body: "Section Head Revegetasi · PT Energi Batubara Lestari · Hasnur Group\n±5 tahun memimpin reklamasi pascatambang dari lapangan hingga regulasi — dengan keahlian langka yang menggabungkan teknis revegetasi, perizinan kehutanan, GIS/remote sensing, dan pengembangan AI.",
    variant: "default",
  },

  // 02 — Penataan Lahan
  {
    src: "/levels/level-02.png",
    eyebrow: "02 — Penataan Lahan",
    headline: "Saya Memimpin\nSeluruh Fase Lapangan",
    body: "Saya mengawasi langsung setiap tahapan: pembersihan lahan, pengelolaan & penebaran topsoil, konstruksi teras, sistem drainase, dan pengendalian erosi — sebelum bibit pertama ditanam.\nFase P0 · P1 · P2 sesuai Permen ESDM No. 10/2023.",
    variant: "default",
  },

  // 03 — Regulasi & Perizinan
  {
    src: "/levels/level-03.png",
    eyebrow: "03 — Perizinan & Regulasi",
    headline: "Saya Navigasi\nRegulasi Kehutanan",
    body: "Saya mengelola siklus penuh IPPKH, verifikasi PNBP PKH, AMDAL, RKL-RPL, dan pelaporan ke ESDM & KLHK — langsung, bukan melalui konsultan.\nGanis CANHUT · Ganis NENHUT · BNSP Perencanaan Hutan (2024) · PROPER Biru (2023–2024) · Operator SIMPEL · Sinergi KLHK · Sicerdas.",
    variant: "default",
  },

  // 04 — Potting Method
  {
    src: "/levels/level-04.png",
    eyebrow: "04 — Inovasi Saya",
    headline: "Potting Method",
    body: "Lahan pascatambang sering kekurangan topsoil. Saya menciptakan Potting Method: bibit ditanam pada media terkontrol (polybag/pot) sehingga tumbuh optimal tanpa bergantung pada tanah pucuk yang tersedia.\nDiterapkan & terbukti berhasil di lapangan PT Energi Batubara Lestari · Hasnur Group.",
    variant: "innovation",
  },

  // 05 — Nursery
  {
    src: "/levels/level-05.png",
    eyebrow: "05 — Manajemen Nursery",
    headline: "Saya Kelola\nPersemaian Skala Produksi",
    body: "Dari pengadaan benih hingga bibit siap tanam — saya mengendalikan seluruh rantai: penyemaian, penyapihan, seleksi, dan distribusi ke lapangan.\nSaya juga membangun Chatbot AI berbasis DeepSeek (Google Apps Script) untuk otomatisasi data pembibitan — mempercepat pengolahan data produksi nursery.",
    variant: "default",
  },

  // 06 — Penanaman
  {
    src: "/levels/level-06.png",
    eyebrow: "06 — Eksekusi Penanaman",
    headline: "Target Tanam\nSaya Pastikan Tercapai",
    body: "Saya memimpin langsung dua Group Leader: GL Penataan Lahan dan GL Nursery — beserta seluruh tim lapangan di bawahnya.\nPerencanaan harian, mingguan, bulanan; evaluasi survival rate; pembinaan kapasitas teknis SDM lapangan — semua di bawah tanggung jawab saya.",
    variant: "default",
  },

  // 07 — Vegetasi Tumbuh
  {
    src: "/levels/level-07.png",
    eyebrow: "07 — Hasil Kerja Saya",
    headline: "Kanopi Menutup.\nLereng Stabil.",
    body: "Ini bukan sekadar penghijauan — ini ekosistem yang dipulihkan. Survival rate terpantau, tutupan lahan terverifikasi via ArcGIS Pro & Google Earth Engine, dan kemajuan reklamasi terdokumentasi dalam laporan resmi triwulanan & tahunan ke ESDM & KLHK.",
    variant: "default",
  },

  // 08 — Silvopastura
  {
    src: "/levels/level-08.png",
    eyebrow: "08 — Inovasi Saya",
    headline: "Silvopastura",
    body: "Saya merancang model Silvopastura: reklamasi lahan diintegrasikan dengan kegiatan peternakan — kewajiban revegetasi sekaligus menghasilkan nilai ekonomi produktif dari lahan yang sedang dipulihkan.\nQCC Juara 3 Tingkat Perusahaan (2024) · PT Energi Batubara Lestari · Hasnur Group.",
    variant: "innovation",
  },

  // 09 — Montana Camera AI
  {
    src: "/levels/level-09.png",
    eyebrow: "09 — Inovasi Saya",
    headline: "Montana Camera AI",
    body: "Saya membangun & mendeploy sendiri: sistem monitoring geotagging real-time berbasis AI yang mengintegrasikan analisis NDVI, estimasi biomassa & cadangan karbon, serta deteksi kesehatan vegetasi (HSV).\nHKI Terdaftar No. 001165981 (2026) · PWA offline-first · Live: camera.montana-tech.info · 723 kontribusi GitHub.",
    variant: "innovation",
  },

  // 10 — GIS & Remote Sensing
  {
    src: "/levels/level-10.png",
    eyebrow: "10 — Keahlian Spasial",
    headline: "Lapangan & Data —\nSaya Kuasai Keduanya",
    body: "Saya bukan hanya praktisi lapangan. Saya mengoperasikan ArcGIS Pro, ArcMap 10.4, Global Mapper, dan Google Earth Engine untuk analisis tutupan lahan, penafsiran stok karbon, dan pemetaan drone.\nSebelumnya: Kepala Staf GIS & Kepala Sub Bagian Kelola Lingkungan · PT Taiyoung Engreen (2021–2023).",
    variant: "data",
  },

  // 11 — Karbon & CTA
  {
    src: "/levels/level-11.png",
    eyebrow: "11 — Nilai yang Saya Bawa",
    headline: "Reklamasi Terukur.\nKarbon Terverifikasi.",
    body: "Pelatihan Stok Karbon Folu Net Sink · IPB (2022) · S.Hut Instiper Yogyakarta · IPK 3.45 · TOEFL ITP 500\nMy Montana AI — Platform Revegetasi & Monitoring Karbon Terintegrasi\nHubungi saya untuk kolaborasi reklamasi, proyek karbon, atau pengembangan sistem monitoring.",
    variant: "data",
  },
];
