// ─────────────────────────────────────────────────────────────────
//  PUBLIKASI / DOKUMENTASI
//  Tombol "Dokumentasi" menampilkan buku ini (reader Google Books ter-embed).
//  Cara ganti buku:
//   1. Ambil ID dari URL Google Books — bagian `books?id=<INI>`
//   2. Ganti `bookId` + judul/penulis/deskripsi di bawah
//   3. Ganti sampul di: portfolio-site/public/dokumentasi/book-cover.jpg
// ─────────────────────────────────────────────────────────────────

export interface Publication {
  bookId: string;       // Google Books volume id (URL: ...books?id=<INI>)
  title: string;
  author: string;
  publisher: string;
  year: string;
  description: string;
  quote: string;        // kutipan sorotan dari buku (pull-quote)
  cover: string;        // sampul lokal di /public
  previewLink: string;  // tautan baca penuh di Google Books
}

export const PUBLICATION: Publication = {
  bookId: "aKTVEQAAQBAJ",
  title:
    "Montana Camera AI: Inovasi Sistem Pemantauan Geotagging Real-Time untuk Verifikasi Lahan Reklamasi Berkelanjutan",
  author: "Agung Laksono, S.Hut",
  publisher: "Agung Laksono",
  year: "2026",
  description:
    "Buku ini memperkenalkan sistem pemantauan berbasis AI yang menggabungkan kamera cerdas, geotagging real-time, dan kecerdasan buatan untuk menyegel foto lapangan dengan koordinat GPS terverifikasi, timestamp, identifikasi tanaman, serta tanda tangan digital yang tak dapat dipalsukan.",
  quote:
    "Pemulihan lahan pascatambang menuntut data berbasis bukti — bukan dokumentasi yang sekadar tampak memenuhi kewajiban regulasi.",
  cover: "/dokumentasi/book-cover.jpg",
  previewLink: "https://books.google.co.id/books?id=aKTVEQAAQBAJ",
};
