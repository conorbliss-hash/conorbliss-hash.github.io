// Pre-renders the home page into dist/index.html so the shipped HTML carries the
// real content (for crawlers, link previews, and a fast first paint before JS runs).
// Runs after `vite build` (client) and `vite build --ssr` (server entry).
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

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
await rm(ssrDir, { recursive: true, force: true });

console.log(`prerender: wrote dist/index.html (${(html.length / 1024).toFixed(1)} kB) and dist/404.html`);
