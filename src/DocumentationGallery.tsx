import { useEffect, useRef, useState } from "react";
import { PUBLICATION } from "./dokumentasi";
import "./DocumentationGallery.css";

interface Props {
  onClose: () => void;
}

// Minimal typing for the Google Books Embedded Viewer JS API.
declare global {
  interface Window {
    google?: {
      books?: {
        load: () => void;
        setOnLoadCallback: (cb: () => void) => void;
        DefaultViewer: new (el: HTMLElement) => {
          load: (id: string, notFound?: () => void, success?: () => void) => void;
        };
      };
    };
  }
}

const GBOOKS_API = "https://www.google.com/books/jsapi.js";
const REST_TILT = "-17deg"; // book's resting yaw — gives 3D presence before any hover

export default function DocumentationGallery({ onClose }: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef   = useRef<HTMLDivElement>(null);
  const panelRef  = useRef<HTMLDivElement>(null);
  // null = still trying, true = embedded reader live, false = embed unavailable
  const [viewerOk, setViewerOk] = useState<boolean | null>(null);

  // Close on Escape, keep Tab inside the dialog, and hand focus back to whatever
  // opened it. Without the trap, tabbing walks out into the pinned stage behind
  // the backdrop with nothing visible to indicate where focus went.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>(".dg-close")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  // Cursor parallax on the faux-3D book (skipped when reduced-motion is on).
  const reduced = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const onBookMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const el = bookRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 12).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(-17 + px * 16).toFixed(2)}deg`);
  };
  const onBookLeave = () => {
    const el = bookRef.current; if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", REST_TILT);
  };

  // Load the Google Books Embedded Viewer and render the book inline. If the book
  // isn't embeddable (or the API can't load), fall back to the cover + read link.
  useEffect(() => {
    let cancelled = false;

    const initViewer = () => {
      if (cancelled || !viewerRef.current) return;
      const books = window.google?.books;
      if (!books) { setViewerOk(false); return; }
      try {
        const viewer = new books.DefaultViewer(viewerRef.current);
        viewer.load(
          PUBLICATION.bookId,
          () => { if (!cancelled) setViewerOk(false); },  // not found / not embeddable
          () => { if (!cancelled) setViewerOk(true); },   // success
        );
      } catch {
        setViewerOk(false);
      }
    };

    const start = () => {
      const books = window.google?.books;
      if (books) { books.load(); books.setOnLoadCallback(initViewer); }
      else setViewerOk(false);
    };

    if (window.google?.books) {
      start();
    } else {
      let script = document.getElementById("gbooks-jsapi") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "gbooks-jsapi";
        script.src = GBOOKS_API;
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener("load", start, { once: true });
      script.addEventListener("error", () => { if (!cancelled) setViewerOk(false); }, { once: true });
    }

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="dg-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="Publikasi">
      <div className="dg-panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <div className="dg-grain" aria-hidden="true" />

        {/* Header */}
        <div className="dg-header">
          <span className="dg-eyebrow">Publikasi · Buku</span>
          <h2 className="dg-title">Dokumentasi</h2>
          <button className="dg-close" onClick={onClose} aria-label="Tutup">✕</button>
        </div>

        {/* Body */}
        <div className="dg-pub">
          <div className="dg-pub-head">

            {/* Faux-3D book */}
            <div className="dg-book" onMouseMove={onBookMove} onMouseLeave={onBookLeave}>
              <div
                className="dg-book-3d"
                ref={bookRef}
                style={{ ["--ry" as string]: REST_TILT }}
              >
                <img className="dg-book-cover" src={PUBLICATION.cover}
                     alt={`Sampul: ${PUBLICATION.title}`} draggable={false} />
                <span className="dg-book-pages" aria-hidden="true" />
                <span className="dg-book-spine" aria-hidden="true" />
                <span className="dg-book-gloss" aria-hidden="true" />
              </div>
              <span className="dg-book-shadow" aria-hidden="true" />
            </div>

            {/* Editorial meta */}
            <div className="dg-pub-meta">
              <span className="dg-pub-kicker">Karya Tulis · {PUBLICATION.year}</span>
              <h3 className="dg-pub-booktitle">{PUBLICATION.title}</h3>
              <p className="dg-pub-by">oleh <strong>{PUBLICATION.author}</strong></p>

              <dl className="dg-pub-spec">
                <div><dt>Penerbit</dt><dd>{PUBLICATION.publisher}</dd></div>
                <div><dt>Terbit</dt><dd>{PUBLICATION.year}</dd></div>
                <div><dt>Sumber</dt><dd>Google Books · pratinjau</dd></div>
                <div><dt>Vol. ID</dt><dd>{PUBLICATION.bookId}</dd></div>
              </dl>

              <p className="dg-pub-desc">{PUBLICATION.description}</p>

              <a className="dg-pub-btn" href={PUBLICATION.previewLink}
                 target="_blank" rel="noopener noreferrer">
                Baca di Google Books <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Pull-quote band */}
          <blockquote className="dg-pub-quote">{PUBLICATION.quote}</blockquote>

          {/* Embedded reader, framed like an open book */}
          <div className="dg-viewer-wrap"
               data-state={viewerOk === null ? "loading" : viewerOk ? "ok" : "fail"}>
            <span className="dg-viewer-label">Pratinjau</span>
            <div ref={viewerRef} className="dg-viewer" aria-label="Pratinjau buku Google Books" />
            {viewerOk === null && <div className="dg-viewer-note">Memuat pratinjau buku…</div>}
            {viewerOk === false && (
              <div className="dg-viewer-note">
                Pratinjau tidak dapat ditampilkan di sini.{" "}
                <a href={PUBLICATION.previewLink} target="_blank" rel="noopener noreferrer">
                  Buka di Google Books ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
