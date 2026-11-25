// Pre-renders the home page into dist/index.html so the shipped HTML carries the
// real content (for crawlers, link previews, and a fast first paint before JS runs).
// Runs after `vite build` (client) and `vite build --ssr` (server entry).
import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, renderTool } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const template = await readFile(path.join(dist, "index.html"), "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error(`prerender: could not find ${marker} in dist/index.html`);
}

const appHtml = render("/");
if (!appHtml.includes("<h1")) {
  throw new Error("prerender: rendered markup has no <h1>; refusing to ship an empty page");
}

const html = template.replace(marker, `<div id="root">${appHtml}</div>`);
await writeFile(path.join(dist, "index.html"), html);
// GitHub Pages serves 404.html for unknown paths; main.tsx re-renders the right route client-side.
await writeFile(path.join(dist, "404.html"), html);
// Intelligence on Tap gets its own pre-rendered page and meta, so shared links preview correctly
// and GitHub Pages serves it with a 200 instead of the 404 fallback.
const toolHtml = renderTool();
if (!toolHtml.includes("<h1")) {
  throw new Error("prerender: Intelligence on Tap rendered without an <h1>");
}
const toolTitle = "Your customers are asking how you use AI. Can your website answer? Intelligence on Tap";
const toolDesc =
  "Free: draft answers to the 20 AI questions your customers' security and procurement reviewers ask, written from your own website, ready to paste into your next questionnaire.";
const toolPage = template
  .replace(marker, `<div id="root">${toolHtml}</div>`)
  .replace(/<title>[^<]*<\/title>/, `<title>${toolTitle} | Conor Bliss</title>`)
  .replace(/(<meta name="description" content=")[^"]*(")/, `$1${toolDesc}$2`)
  .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${toolTitle}$2`)
  .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${toolDesc}$2`)
  .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${toolTitle}$2`)
  .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${toolDesc}$2`)
  .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1https://conorbliss.com/intelligence-on-tap/$2`)
  .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1https://conorbliss.com/og-intelligence-on-tap.png$2`)
  .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1https://conorbliss.com/og-intelligence-on-tap.png$2`)
  .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1https://conorbliss.com/intelligence-on-tap/$2`);
// Public since 19 Nov 2026 (was noindex during the private beta).
await mkdir(path.join(dist, "intelligence-on-tap"), { recursive: true });
await writeFile(path.join(dist, "intelligence-on-tap", "index.html"), toolPage);
console.log(`prerender: wrote dist/intelligence-on-tap/index.html (${(toolPage.length / 1024).toFixed(1)} kB)`);

await rm(ssrDir, { recursive: true, force: true });

console.log(`prerender: wrote dist/index.html (${(html.length / 1024).toFixed(1)} kB) and dist/404.html`);
