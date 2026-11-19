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
const toolTitle = "Intelligence on Tap: which AI rules apply to your company?";
const toolDesc =
  "Free tool: a map of the EU and Nordic AI rules that apply to your company, with deadlines, sources and the questions customers will ask.";
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
  .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1https://conorbliss.com/intelligence-on-tap/$2`)
  // Private beta: reachable by link only. Remove this line when the tool goes public.
  .replace("</head>", `  <meta name="robots" content="noindex, nofollow" />\n  </head>`);
await mkdir(path.join(dist, "intelligence-on-tap"), { recursive: true });
await writeFile(path.join(dist, "intelligence-on-tap", "index.html"), toolPage);
console.log(`prerender: wrote dist/intelligence-on-tap/index.html (${(toolPage.length / 1024).toFixed(1)} kB)`);

await rm(ssrDir, { recursive: true, force: true });

console.log(`prerender: wrote dist/index.html (${(html.length / 1024).toFixed(1)} kB) and dist/404.html`);
