(function renderSectionIndex() {
  const root = document.querySelector("#section-root");
  const page = document.body.dataset.page;
  const catalog = window.SITE_CATALOG;
  if (!root || !catalog) return;

  if (page === "doctrines") root.innerHTML = doctrineMarkup(catalog.periods);
  if (page === "miracles") root.innerHTML = miracleMarkup(catalog.miracles);
  if (page === "questions") root.innerHTML = questionMarkup(catalog.questions);
})();

function doctrineMarkup(periods) {
  return `<nav class="period-jump" aria-label="Historical periods">${periods.map((period) => `<a href="#${period.id}"><span>${period.numeral}</span>${period.title}</a>`).join("")}</nav>
    ${periods.map((period) => `<section class="period-section" id="${period.id}">
      <header class="period-heading"><span>${period.numeral}</span><div><p>${period.dates}</p><h2>${period.title}</h2><small>${period.introduction}</small></div></header>
      <div class="catalog-grid">${period.articles.map((article) => cardMarkup(article)).join("")}</div>
    </section>`).join("")}`;
}

function miracleMarkup(miracles) {
  return `<div class="catalog-grid miracle-grid">${miracles.map((article) => cardMarkup(article)).join("")}</div>
    <aside class="credit-banner"><p class="eyebrow">Source credit</p><h2>These first three cases follow Ethan Muse’s research.</h2><p>Each article is a brief, credited presentation of Muse’s argument and links to his full treatment. The summaries distinguish his inference from the underlying evidence and do not replace the source notes.</p></aside>`;
}

function questionMarkup(questions) {
  return `<div class="question-index">${questions.map((question, index) => `<a href="./${question.slug}/"><span>${String(index + 1).padStart(2, "0")}</span><div><h2>${question.title}</h2><p>${question.summary}</p></div><b aria-hidden="true">→</b></a>`).join("")}</div>`;
}

function cardMarkup(article) {
  return `<article class="catalog-card${article.featured ? " featured" : ""}">
    <div class="card-meta"><span>${article.date}</span><span>${article.category}</span></div>
    <p class="card-kicker">${article.question}</p>
    <h3>${article.title}</h3>
    <p>${article.summary}</p>
    ${article.author ? `<small class="card-credit">${article.author}</small>` : ""}
    <a class="card-link" href="./${article.slug}/">Read the article <span aria-hidden="true">→</span></a>
  </article>`;
}
