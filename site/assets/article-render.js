(function renderArticle() {
  const root = document.querySelector("#article-root");
  const parts = window.location.pathname.split("/").filter(Boolean);
  const kind = parts.at(-2);
  const slug = parts.at(-1);
  const catalog = window.SITE_CATALOG;
  const articles = window.SITE_ARTICLES;

  const allDoctrines = catalog.periods.flatMap((period) => period.articles.map((article) => ({ ...article, period })));
  const record = kind === "doctrines"
    ? allDoctrines.find((article) => article.slug === slug)
    : kind === "miracles"
      ? catalog.miracles.find((article) => article.slug === slug)
      : kind === "questions"
        ? catalog.questions.find((article) => article.slug === slug)
        : null;

  if (!record) {
    root.innerHTML = `${headerMarkup("")}<main class="not-found"><p class="eyebrow">Page not found</p><h1>This article could not be located.</h1><a class="button button-primary" href="/">Return home</a></main>${footerMarkup()}`;
    return;
  }

  const detail = articles[kind]?.[slug] || defaultDetail(record, kind);
  document.title = `${record.title} — Mia Ekklesia`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", record.summary);

  if (kind === "questions") {
    root.innerHTML = renderQuestion(record, detail);
    return;
  }

  const contextLabel = kind === "miracles" ? "Vindicatory miracles" : record.period.title;
  const indexHref = kind === "miracles" ? "/miracles/" : `/doctrines/#${record.period.id}`;
  const sourceCredit = detail.credit || detail.authorNote;
  const articleSections = detail.sections.map((section, index) => sectionMarkup(section, index)).join("");
  const primarySources = record.sources || [];
  const pager = kind === "doctrines" ? pagerMarkup(allDoctrines, slug, kind) : pagerMarkup(catalog.miracles, slug, kind);

  root.innerHTML = `
    ${headerMarkup(kind)}
    <main>
      <article class="article-page">
        <header class="article-hero">
          <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="${indexHref}">${contextLabel}</a></nav>
          <div class="article-meta"><span>${record.date}</span><span>${record.category}</span></div>
          <h1>${record.title}</h1>
          <p class="article-question">${record.question}</p>
          <p class="article-thesis">${detail.thesis}</p>
          ${sourceCredit ? `<div class="credit-note"><b>Editorial note</b><p>${sourceCredit}</p>${detail.sourceUrl ? `<a href="${detail.sourceUrl}" target="_blank" rel="noreferrer">Read the source article ↗</a>` : ""}</div>` : ""}
        </header>

        <div class="article-layout">
          <aside class="article-contents">
            <p>In this article</p>
            ${detail.sections.map((section, index) => `<a href="#section-${index + 1}"><span>${String(index + 1).padStart(2, "0")}</span>${section.heading}</a>`).join("")}
            ${primarySources.length ? `<div class="source-register"><b>Principal sources</b>${primarySources.map((source) => `<span>${source}</span>`).join("")}</div>` : ""}
          </aside>
          <div class="article-copy">
            ${articleSections}
            <section class="reading-note">
              <p class="eyebrow">A note on confidence</p>
              <h2>Read the source before the conclusion.</h2>
              <p>Historical claims differ in weight. Contemporary testimony, later recollection, conciliar definition, and modern interpretation are identified separately wherever the distinction matters.</p>
            </section>
          </div>
        </div>
        ${pager}
      </article>
    </main>
    ${footerMarkup()}`;
})();

function defaultDetail(record, kind) {
  return {
    thesis: record.summary,
    sections: [
      { heading: "The question", text: [record.question, record.summary] },
      { heading: "The evidence to be examined", text: [kind === "doctrines" ? "This dossier is presently an editorial outline. Its final form will place the primary texts first, then establish date, context, and the exact conclusion each source can bear." : "This question is answered briefly here and linked to the longer historical dossiers where the evidence is developed."], evidence: record.sources || [] },
      { heading: "What must be settled", text: ["The conclusion should be no broader than the evidence. The completed article will distinguish an early witness from a later definition and a doctrine’s substance from the vocabulary eventually used to express it."] }
    ]
  };
}

function renderQuestion(record) {
  const supporting = questionSupport(record.slug);
  return `
    ${headerMarkup("questions")}
    <main>
      <article class="question-page">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/questions/">Questions</a></nav>
        <p class="eyebrow">A brief answer</p>
        <h1>${record.title}</h1>
        <p class="answer-lead">${record.summary}</p>
        ${supporting.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        <div class="answer-links"><b>Continue in the historical case</b>${supporting.links.map((link) => `<a href="${link.href}">${link.label}<span aria-hidden="true">→</span></a>`).join("")}</div>
        <a class="back-link" href="/questions/">← All questions</a>
      </article>
    </main>
    ${footerMarkup()}`;
}

function questionSupport(slug) {
  const answers = {
    constantine: {
      paragraphs: ["Long before Constantine’s conversion, Ignatius names the Catholic Church, describes the bishop-presbyter-deacon order, and identifies the Eucharist with Christ’s flesh. Justin records Sunday worship and baptismal discipline; Irenaeus appeals to public apostolic succession.", "Constantine’s reign altered Christianity’s legal and political circumstances. It did not create the doctrines and structures already visible in sources written under persecution."],
      links: [{ href: "/doctrines/catholic-name/", label: "The Church is called Catholic" }, { href: "/doctrines/real-presence/", label: "The Eucharist is Christ’s flesh" }]
    },
    "late-definition": {
      paragraphs: ["A controversy often forces the Church to define more precisely what had previously been confessed less technically. Nicaea’s homoousios is fourth-century vocabulary used to protect an earlier belief about Christ, not evidence that Christians first imagined his divinity in 325.", "The correct test is historical continuity: can the substance of the later definition be found in earlier worship, teaching, and controversy?"],
      links: [{ href: "/doctrines/nicaea/", label: "Nicaea and the divinity of the Son" }, { href: "/doctrines/transubstantiation/", label: "Transubstantiation is defined" }]
    },
    "name-alone": {
      paragraphs: ["The Catholic name is an identifying sign, not a substitute for the rest of the case. Cyril and Augustine treat it as meaningful because it publicly distinguishes the Church from sects; neither suggests that a label excuses examination of doctrine or succession.", "Its force is cumulative. The communion bearing the ancient name must also be tested for apostolic order, sacramental continuity, catholicity, and fidelity to the deposit of faith."],
      links: [{ href: "/doctrines/catholic-name/", label: "Read the Catholic-name dossier" }, { href: "/doctrines/apostolic-succession/", label: "Clement and apostolic succession" }]
    },
    orthodox: {
      paragraphs: ["The Orthodox Churches preserve apostolic succession, valid sacraments, ancient liturgy, and much of the same patristic inheritance. Their claim cannot be answered responsibly by a handful of isolated quotations.", "The central disagreement concerns the shape and extent of Roman primacy, together with later disputes such as the Filioque. This site marks the relevant evidence but treats the Protestant question first."],
      links: [{ href: "/doctrines/papacy/", label: "Rome, Peter, and the universal Church" }, { href: "/doctrines/great-schism/", label: "The long estrangement of East and West" }]
    },
    corruption: {
      paragraphs: ["A holy Church can contain sinful members, ministers, and even scandalous leaders. The New Testament itself records grave failures without treating them as proof that Christ’s covenant or sacraments have ceased.", "Corruption can discredit a witness and demand reform. It does not answer the prior questions of authority, doctrinal continuity, or sacramental validity."],
      links: [{ href: "/doctrines/reform-before-reformation/", label: "Reform before the Reformation" }, { href: "/doctrines/visible-church/", label: "Christ establishes a visible Church" }]
    },
    biblical: {
      paragraphs: ["Catholic doctrine claims biblical grounding, but it does not accept the premise that every binding apostolic teaching must be stated explicitly in one verse. Scripture itself speaks of traditions delivered orally and shows the Church judging disputes.", "The historical method asks how those nearest the Apostles read Scripture and practiced the faith, especially where modern interpretations conflict."],
      links: [{ href: "/doctrines/sola-scriptura/", label: "Scripture, Tradition, and the rule of faith" }, { href: "/doctrines/canon/", label: "The canon comes into view" }]
    }
  };
  return answers[slug];
}

function sectionMarkup(section, index) {
  return `<section class="article-section" id="section-${index + 1}">
    <div class="section-heading"><span>${String(index + 1).padStart(2, "0")}</span><h2>${section.heading}</h2></div>
    ${section.quote ? `<blockquote class="source-quote"><p>“${section.quote.text}”</p><cite>${section.quote.cite}</cite></blockquote>` : ""}
    ${section.text.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    ${section.evidence ? `<ul class="evidence-list">${section.evidence.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
  </section>`;
}

function pagerMarkup(records, slug, kind) {
  const index = records.findIndex((record) => record.slug === slug);
  const previous = records[index - 1];
  const next = records[index + 1];
  const prefix = kind === "miracles" ? "/miracles" : "/doctrines";
  return `<nav class="article-pager" aria-label="Article navigation">
    ${previous ? `<a href="${prefix}/${previous.slug}/"><small>Previous</small><b>${previous.title}</b></a>` : `<span></span>`}
    ${next ? `<a class="next" href="${prefix}/${next.slug}/"><small>Next</small><b>${next.title}</b></a>` : ""}
  </nav>`;
}

function headerMarkup(active) {
  const link = (href, label, key) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="site-header">
    <a class="brand" href="/" aria-label="Mia Ekklesia, home"><span class="brand-mark" aria-hidden="true"><img src="/assets/jerusalem-cross.png" alt=""></span><span><b>Mia Ekklesia</b><small>One Church</small></span></a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">${link("/doctrines/", "Doctrines", "doctrines")}${link("/miracles/", "Miracles", "miracles")}${link("/questions/", "Questions", "questions")}${link("/method/", "Method &amp; Sources", "method")}</nav>
  </header>`;
}

function footerMarkup() {
  return `<footer class="site-footer"><div class="footer-brand"><img class="footer-cross" src="/assets/jerusalem-cross.png" alt=""><div><b>Mia Ekklesia</b><small>One Church</small></div></div><nav aria-label="Footer navigation"><a href="/doctrines/">Doctrines</a><a href="/miracles/">Miracles</a><a href="/questions/">Questions</a><a href="/method/">Method &amp; Sources</a></nav><p>Ad fontes: to Scripture, the Fathers, the councils, and the historical record.</p></footer>`;
}
