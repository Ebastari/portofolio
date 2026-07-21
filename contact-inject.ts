import type { Plugin } from "vite";
import fs from "fs";
import path from "path";
import { gmailComposeUrl } from "./src/contact";

// ─────────────────────────────────────────────────────────────────────────────
// Injects the Gmail compose link from src/contact.ts into the standalone drone
// intro page, so its Email icon behaves exactly like the ones in the React app
// without the URL being copied by hand.
//
// public/ is served (dev) and copied (build) verbatim, and transformIndexHtml
// only ever sees index.html — so the substitution has to happen twice: once in a
// dev middleware, once on the emitted file. Both go through the same `inject()`
// so the two paths cannot drift.
// ─────────────────────────────────────────────────────────────────────────────

const PLACEHOLDER = "__GMAIL_COMPOSE_URL__";
const FILE = "drone_nursery.html";

// The URL lands in an HTML attribute and carries query separators, so the
// ampersands must be escaped or the markup is invalid.
const attrSafeUrl = gmailComposeUrl.replaceAll("&", "&amp;");

const inject = (html: string) => html.replaceAll(PLACEHOLDER, attrSafeUrl);

export default function contactInject(): Plugin {
  return {
    name: "contact-inject",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0];
        if (pathname !== `/${FILE}`) return next();

        const src = path.join(server.config.root, "public", FILE);
        if (!fs.existsSync(src)) return next();

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(inject(fs.readFileSync(src, "utf8")));
      });
    },

    closeBundle() {
      const out = path.resolve("dist", FILE);
      if (!fs.existsSync(out)) return;
      fs.writeFileSync(out, inject(fs.readFileSync(out, "utf8")), "utf8");
    },
  };
}
