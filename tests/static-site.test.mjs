import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import vm from "node:vm";

const projectRoot = new URL("../", import.meta.url);
const siteRoot = new URL("site/", projectRoot);
const catalogSource = await readFile(new URL("assets/catalog.js", siteRoot), "utf8");
const context = { window: {} };
vm.runInNewContext(catalogSource, context);
const catalog = context.window.SITE_CATALOG;

test("every catalog card has an independent static page", async () => {
  const routes = [
    ...catalog.periods.flatMap((period) => period.articles.map((article) => ["doctrines", article.slug])),
    ...catalog.miracles.map((article) => ["miracles", article.slug]),
    ...catalog.questions.map((article) => ["questions", article.slug]),
  ];

  for (const [section, slug] of routes) {
    await access(new URL(`${section}/${slug}/index.html`, siteRoot));
  }
});

test("the main categories are separate pages with readable navigation", async () => {
  for (const section of ["doctrines", "miracles", "questions", "method"]) {
    const html = await readFile(new URL(`${section}/index.html`, siteRoot), "utf8");
    assert.match(html, /href="\/doctrines\/"/);
    assert.match(html, /href="\/miracles\/"/);
    assert.match(html, /href="\/questions\/"/);
    assert.match(html, /href="\/method\/"/);
  }

  const css = await readFile(new URL("assets/styles.css", siteRoot), "utf8");
  assert.match(css, /font-size:\s*17px/);
  assert.match(css, /color-scheme:\s*dark/);
});

test("requested titles and source credits are present", async () => {
  assert.deepEqual(Array.from(catalog.periods, (period) => period.title), [
    "The Apostolic Age",
    "The Ante-Nicene Church",
    "The Imperial Church",
    "The Great Schism and the Medieval Church",
    "The Protestant Reformation",
  ]);

  for (const miracle of catalog.miracles) {
    assert.match(miracle.author, /Ethan Muse/);
    assert.match(miracle.sourceUrl, /^https:\/\/motivacredibilitatis\.substack\.com\//);
  }
});

test("the deployment output contains the worker and all static routes", async () => {
  await access(new URL("dist/server/index.js", projectRoot));
  await access(new URL("dist/.openai/hosting.json", projectRoot));
  await access(new URL("dist/client/doctrines/catholic-name/index.html", projectRoot));
  await access(new URL("dist/client/miracles/fatima/index.html", projectRoot));
  await access(new URL("dist/client/questions/constantine/index.html", projectRoot));
});

test("representative detail pages have route-specific social metadata", async () => {
  const doctrine = await readFile(new URL("doctrines/catholic-name/index.html", siteRoot), "utf8");
  const miracle = await readFile(new URL("miracles/fatima/index.html", siteRoot), "utf8");
  assert.match(doctrine, /<title>The Church is called Catholic — Μία Ἐκκλησία<\/title>/);
  assert.match(doctrine, /property="og:title" content="The Church is called Catholic"/);
  assert.match(miracle, /name="twitter:title" content="Our Lady of Fatima"/);
  assert.doesNotMatch(doctrine, /og:image/);
});
