import { readFile, mkdir, copyFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const sourceRoot = new URL("../site/", import.meta.url);
const catalogSource = await readFile(new URL("assets/catalog.js", sourceRoot), "utf8");
const context = { window: {} };
vm.runInNewContext(catalogSource, context);

const catalog = context.window.SITE_CATALOG;
const routes = [
  ...catalog.periods.flatMap((period) => period.articles.map((article) => ["doctrines", article])),
  ...catalog.miracles.map((article) => ["miracles", article]),
  ...catalog.questions.map((article) => ["questions", article]),
];
const articleTemplate = await readFile(new URL("_article.html", sourceRoot), "utf8");

for (const [section, article] of routes) {
  const destination = new URL(`${section}/${article.slug}/`, sourceRoot);
  await mkdir(destination, { recursive: true });
  const html = articleTemplate
    .replaceAll("%%TITLE%%", escapeHtml(article.title))
    .replaceAll("%%DESCRIPTION%%", escapeHtml(article.summary));
  await writeFile(new URL("index.html", destination), html);
}

await copyFile(new URL("../public/favicon.svg", import.meta.url), new URL("favicon.svg", sourceRoot));
await mkdir(new URL(".openai/", sourceRoot), { recursive: true });
await copyFile(new URL("../.openai/hosting.json", import.meta.url), new URL(".openai/hosting.json", sourceRoot));
console.log(`Generated ${routes.length} static article routes.`);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
