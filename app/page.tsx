"use client";

import { useMemo, useState } from "react";

type Era = {
  roman: string;
  range: string;
  label: string;
  title: string;
  thesis: string;
  scene: string;
  chapters: { date: string; title: string; topic: string; status?: string }[];
};

const eras: Era[] = [
  {
    roman: "I", range: "A.D. 30–100", label: "Apostolic", title: "The Apostolic Age",
    thesis: "Before there was a completed New Testament, there was a visible Church: teaching, baptizing, breaking bread, and appointing successors.",
    scene: "You gather on the Lord’s Day in a house church. An overseer presides; a letter from an Apostle may be read, but no universally settled New Testament table of contents exists.",
    chapters: [
      { date: "c. 30", title: "Pentecost & the visible Church", topic: "Authority" },
      { date: "c. 49", title: "The Council of Jerusalem", topic: "Councils" },
      { date: "50–70", title: "Worship before the canon", topic: "Liturgy" },
      { date: "c. 96", title: "Clement intervenes at Corinth", topic: "Succession", status: "Key hinge" },
    ],
  },
  {
    roman: "II", range: "A.D. 100–313", label: "Underground", title: "The Church Underground",
    thesis: "Close to the Apostles and far from imperial favor, Christians describe a sacramental, episcopal, and universal communion under persecution.",
    scene: "The Church has no state power and little safety. Your bishop may be arrested; the Eucharist is guarded from outsiders; martyrdom is a live possibility.",
    chapters: [
      { date: "c. 107", title: "Ignatius and the Catholic Church", topic: "Episcopacy", status: "Key hinge" },
      { date: "c. 155", title: "Justin describes Sunday worship", topic: "Liturgy" },
      { date: "c. 180", title: "Irenaeus answers the Gnostics", topic: "Tradition" },
      { date: "c. 250", title: "Cyprian on unity and the chair", topic: "Petrine office" },
    ],
  },
  {
    roman: "III", range: "A.D. 313–787", label: "Councils", title: "The Age of the Councils",
    thesis: "Free to gather openly, the Church answers heresy through the same visible, conciliar authority already present in seed from the beginning.",
    scene: "Bishops now cross the empire to deliberate together. Creeds become more exact as controversies force the Church to say clearly what she has received.",
    chapters: [
      { date: "325", title: "Nicaea I: the Son is consubstantial", topic: "Christology", status: "Ecumenical" },
      { date: "381", title: "Constantinople I: the Holy Spirit", topic: "Trinity", status: "Ecumenical" },
      { date: "393–397", title: "Hippo, Carthage & the canon", topic: "Scripture" },
      { date: "431–451", title: "Mary, Christ, and the Incarnation", topic: "Theotokos" },
      { date: "787", title: "Nicaea II and sacred images", topic: "Icons", status: "Ecumenical" },
    ],
  },
  {
    roman: "IV", range: "A.D. 787–1054", label: "Communion", title: "A Communion Under Strain",
    thesis: "East and West still share one sacramental world, even as language, politics, jurisdiction, and the Filioque place communion under mounting pressure.",
    scene: "The liturgy looks different in Rome and Constantinople, but both worlds venerate saints, celebrate the Eucharist sacrificially, and claim apostolic bishops.",
    chapters: [
      { date: "800", title: "Two empires, one contested inheritance", topic: "Politics" },
      { date: "863–867", title: "The Photian controversy", topic: "Jurisdiction" },
      { date: "1014", title: "The Filioque enters Rome’s creed", topic: "Trinity" },
      { date: "1054", title: "Anathemas and a wounded communion", topic: "Schism", status: "Turning point" },
    ],
  },
  {
    roman: "V", range: "A.D. 1054–1517", label: "Medieval", title: "The Medieval Church",
    thesis: "Reform, scholarship, sanctity, corruption, and conflict coexist as the Western Church develops institutions and theology under immense pressure.",
    scene: "Your year is marked by fasts and feasts. The parish, monastery, university, guild, and pilgrimage all shape a Christian imagination that is deeply sacramental.",
    chapters: [
      { date: "1075–1122", title: "The Investiture Contest", topic: "Church & state" },
      { date: "1215", title: "Lateran IV and sacramental clarity", topic: "Eucharist", status: "Ecumenical" },
      { date: "1274–1439", title: "Councils and attempted reunion", topic: "East & West" },
      { date: "1378–1417", title: "The Western Schism", topic: "Papacy" },
    ],
  },
  {
    roman: "VI", range: "A.D. 1517–1648", label: "Reformation", title: "The Reformation Divide",
    thesis: "Questions of authority, justification, sacraments, and reform fracture Western Christianity and make earlier assumptions newly contested.",
    scene: "Printing accelerates the argument. Scripture is everywhere, but its interpreter, its canon, and its relation to inherited worship become the central dispute.",
    chapters: [
      { date: "1517", title: "Luther and the indulgence controversy", topic: "Reform" },
      { date: "1521", title: "Worms: conscience and authority", topic: "Authority" },
      { date: "1530–1534", title: "Confessions and new communions", topic: "Division" },
      { date: "1545–1563", title: "Trent answers the Reformation", topic: "Doctrine", status: "Ecumenical" },
    ],
  },
];

const doctrines = [
  { icon: "♙", title: "Apostolic succession", category: "Authority", date: "c. 96–180", source: "Clement · Ignatius · Irenaeus", summary: "Who can reliably transmit and judge the apostolic faith?" },
  { icon: "✣", title: "The Eucharist", category: "Sacraments", date: "c. 55–155", source: "Paul · Ignatius · Justin", summary: "What did the earliest Christians believe they received at the altar?" },
  { icon: "⌘", title: "Scripture & Tradition", category: "Authority", date: "c. 50–397", source: "Paul · Irenaeus · Carthage", summary: "How was revelation handed on before—and after—the canon?" },
  { icon: "Α", title: "The Trinity", category: "Creed", date: "c. 50–381", source: "Scripture · Nicaea · Constantinople", summary: "How the Church named the one God as Father, Son, and Spirit." },
  { icon: "M", title: "Mary & the saints", category: "Communion", date: "c. 100–787", source: "Catacombs · Ephrem · Ephesus", summary: "Intercession, Theotokos, and the communion of saints in history." },
  { icon: "Ⅱ", title: "The canon of Scripture", category: "Scripture", date: "c. 140–397", source: "Fragments · Fathers · Councils", summary: "Watch agreement emerge book by book rather than assuming a table of contents." },
  { icon: "P", title: "Peter & the papacy", category: "Authority", date: "c. 30–451", source: "Matthew · Clement · Leo", summary: "A claim tested through interventions, appeals, councils, and resistance." },
  { icon: "▧", title: "Icons & veneration", category: "Worship", date: "c. 200–787", source: "Dura-Europos · Basil · Nicaea II", summary: "Why incarnation changes the Christian use of matter and images." },
  { icon: "∞", title: "Justification & grace", category: "Salvation", date: "c. 50–529", source: "Paul · Augustine · Orange", summary: "Faith, works, grace, freedom, and the disputes that sharpened them." },
];

const questions = [
  { q: "Didn’t Constantine invent the Catholic Church?", a: "The documentary record predates Constantine by centuries. Long before 313, Christians already describe bishops in apostolic succession, call the Eucharist Christ’s flesh, use the name ‘Catholic Church,’ and appeal to Rome. Constantine changed the Church’s legal situation—not her basic structure or sacramental life.", jump: "Go to the Church Underground" },
  { q: "Isn’t Scripture the only infallible authority?", a: "That question cannot be separated from how the scriptural canon was recognized. The journey first establishes apostolic authority, then follows the Church’s use and discernment of disputed books, and only then asks what authority Scripture claims in relation to the Church and apostolic tradition.", jump: "Follow the canon in motion" },
  { q: "Do Catholic doctrines appear too late?", a: "A later definition is not automatically a later invention. The site distinguishes early witness, widespread practice, theological development, and formal definition—then lets you inspect the sources at each stage.", jump: "Explore doctrine development" },
  { q: "What about the Orthodox claim to be the original Church?", a: "Catholics and Orthodox share most of the pre-schism record. The decisive questions concern Petrine authority, the scope of ecumenical councils, and what happened as communion fractured. Those claims deserve treatment from both Eastern and Western primary sources.", jump: "Go to the road to 1054" },
  { q: "Was the medieval Church hopelessly corrupt?", a: "There was real corruption, repeatedly condemned by Catholic reformers and councils. The historical question is whether moral failure disproves the Church’s doctrinal claims—or confirms the perennial need for reform without reinvention.", jump: "Enter the Medieval Church" },
];

export default function Home() {
  const [eraIndex, setEraIndex] = useState(0);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const activeEra = eras[eraIndex];
  const categories = ["All", "Authority", "Sacraments", "Scripture", "Creed", "Worship", "Salvation"];
  const filteredDoctrines = useMemo(() => doctrines.filter((item) => {
    const matchesFilter = filter === "All" || item.category === filter;
    const matchesQuery = `${item.title} ${item.category} ${item.source}`.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  }), [filter, query]);

  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Upon this Rock, home"><span className="brandMark">✦</span><span>Upon this Rock</span></a>
        <div className={`navLinks ${menuOpen ? "open" : ""}`}>
          <a className="active" href="#journey" onClick={() => setMenuOpen(false)}>The Journey</a>
          <a href="#doctrines" onClick={() => setMenuOpen(false)}>Doctrines</a>
          <a href="#miracles" onClick={() => setMenuOpen(false)}>Miracles</a>
          <a href="#questions" onClick={() => setMenuOpen(false)}>Questions</a>
        </div>
        <a className="continueButton" href="#journey">Begin the journey <span>→</span></a>
        <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>{menuOpen ? "×" : "☰"}</button>
      </nav>

      <section className="hero" id="top">
        <div className="heroOrnament" aria-hidden="true">A.D.</div>
        <p className="eyebrow"><span /> The case, in history <span /></p>
        <h1>Walk through the story<br />of the <em>Church.</em></h1>
        <p className="heroCopy">Not a wall of arguments. A guided journey through the witnesses, councils, controversies, and convictions of the first fifteen centuries.</p>
        <div className="heroActions"><a className="primaryCta" href="#journey">Start at Pentecost <span>→</span></a><a className="textCta" href="#timeline">Explore the timeline <span>↓</span></a></div>
        <div className="proofRow" aria-label="Site principles"><span><b>01</b> Primary sources</span><span><b>02</b> Chronological</span><span><b>03</b> Context first</span></div>
      </section>

      <section className="journeyIntro" id="journey">
        <p className="sectionKicker">The historical journey</p><h2>See the faith take shape<br />in <em>real time.</em></h2><p>Move in order, so each question rests on what has already been established—or open any era directly.</p>
      </section>

      <section className="timeline" id="timeline">
        <div className="eraRail" role="tablist" aria-label="Select a historical era">
          {eras.map((era, index) => <button key={era.range} role="tab" aria-selected={index === eraIndex} className={index === eraIndex ? "selected" : ""} onClick={() => setEraIndex(index)}><b>{era.roman}</b><span>{era.range}</span><small>{era.label}</small></button>)}
        </div>
        <div className="eraDetail">
          <div className="eraStory">
            <p className="overline">Era {activeEra.roman} <span>•</span> {activeEra.range}</p>
            <h2>{activeEra.title}</h2>
            <p className="thesis">{activeEra.thesis}</p>
            <div className="youAreThere"><span className="compass">✦</span><div><b>If you were there</b><p>{activeEra.scene}</p></div></div>
            <a className="eraCta" href="#reading">Begin this era <span>→</span></a>
          </div>
          <div className="chapterList">
            <p className="listLabel">Chapters in this era</p>
            {activeEra.chapters.map((chapter, index) => <a href="#reading" className="chapter" key={chapter.title}><span className="chapterIndex">{String(index + 1).padStart(2, "0")}</span><span className="chapterCopy"><small>{chapter.date} · {chapter.topic}</small><b>{chapter.title}</b></span>{chapter.status && <span className="status">{chapter.status}</span>}<span className="arrow">↗</span></a>)}
          </div>
        </div>
        <div className="eraProgress"><span style={{ width: `${((eraIndex + 1) / eras.length) * 100}%` }} /><p>{eraIndex + 1} of {eras.length} eras</p></div>
      </section>

      <section className="hingeSection" id="reading">
        <div className="hingeHeading"><p className="sectionKicker">The first hinge</p><h2>Before we move on,<br /><em>who carries the faith?</em></h2><p>Later evidence only matters if we can establish a trustworthy line of transmission from the Apostles. So the journey settles authority first.</p></div>
        <div className="sourceCard">
          <div className="sourceMeta"><span>Primary source</span><span>c. A.D. 180</span></div>
          <blockquote>“It is possible, then, for everyone in every church, who may wish to know the truth, to contemplate the tradition of the apostles…”</blockquote>
          <div className="sourceFooter"><div><b>Irenaeus of Lyons</b><span>Against Heresies, III.3.1</span></div><a href="https://www.newadvent.org/fathers/0103303.htm" target="_blank" rel="noreferrer">Read the text ↗</a></div>
        </div>
        <div className="hingeSteps">
          <article><span>1</span><b>Apostles appoint leaders</b><p>Authority is entrusted, not self-declared.</p></article>
          <article><span>2</span><b>Successors guard the deposit</b><p>Public continuity answers secret innovation.</p></article>
          <article><span>3</span><b>The universal Church can judge</b><p>Doctrine, canon, and councils become intelligible.</p></article>
        </div>
      </section>

      <section className="doctrineSection" id="doctrines">
        <div className="sectionHeader split"><div><p className="sectionKicker">Trace a belief</p><h2>A doctrine is a <em>story,</em><br />not just a conclusion.</h2></div><p>Follow each teaching from biblical seed, to early witness, to controversy, and—where applicable—formal definition.</p></div>
        <div className="doctrineTools"><div className="filterRow" aria-label="Filter doctrines">{categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={filter === category ? "selected" : ""}>{category}</button>)}</div><label className="searchBox"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search topics or sources" aria-label="Search doctrines" /></label></div>
        <div className="doctrineGrid">
          {filteredDoctrines.map((item) => <article className="doctrineCard" key={item.title}><div className="doctrineTop"><span className="doctrineIcon">{item.icon}</span><span className="doctrineCategory">{item.category}</span></div><p className="doctrineDate">{item.date}</p><h3>{item.title}</h3><p>{item.summary}</p><div className="sourceLine"><span>Earliest trail</span><b>{item.source}</b></div><a href="#timeline" onClick={() => setEraIndex(0)}>Trace through history <span>→</span></a></article>)}
          {filteredDoctrines.length === 0 && <p className="emptyState">No topics match that search yet.</p>}
        </div>
      </section>

      <section className="canonSection">
        <div className="canonCopy"><p className="sectionKicker light">A thread through the whole journey</p><h2>The canon,<br /><em>still in motion.</em></h2><p>The site never treats the Bible’s table of contents as though it fell from the sky. At every era, you see which books were received, disputed, quoted, or rejected—until regional councils give the first complete lists matching the Catholic canon.</p><a href="#doctrines" className="goldLink">Follow the canon thread <span>→</span></a></div>
        <div className="canonPanel">
          <div className="canonPanelHead"><span>What your local church may be reading</span><b>c. A.D. 250</b></div>
          <div className="canonColumns"><div><p className="columnLabel accepted">Widely received</p>{["Four Gospels", "Acts", "Pauline letters", "1 Peter · 1 John"].map(x => <span key={x}>{x}<b>✓</b></span>)}</div><div><p className="columnLabel disputed">Still disputed</p>{["Hebrews", "James", "2 Peter", "Revelation"].map(x => <span key={x}>{x}<b>?</b></span>)}</div></div>
          <p className="canonNote"><span>i</span> Status varied by region. “Disputed” did not always mean “rejected.” The site will show the specific witness behind each placement.</p>
        </div>
      </section>

      <section className="miraclesSection" id="miracles">
        <div className="sectionHeader centered"><p className="sectionKicker">A separate line of evidence</p><h2>Claims that ask to be<br /><em>investigated.</em></h2><p>Miracle claims should not be a credulous list. Each case file separates testimony, physical evidence, medical judgment, alternative explanations, and the strength of the documentation.</p></div>
        <div className="miracleGrid">
          <article className="miracleLead"><div className="caseLabel"><span>Case file 01</span><b>Featured</b></div><div className="miracleSymbol">☀</div><p className="miracleDate">Fátima, Portugal · 1917</p><h3>The Miracle of the Sun</h3><p>A public event reported by believers, skeptics, and journalists—best approached by distinguishing prediction, eyewitness testimony, and competing natural accounts.</p><div className="evidenceScore"><span>Evidence dossier</span><div><i /><i /><i /><i /><i className="off" /></div></div><a href="#">Open the case file <span>→</span></a></article>
          <div className="miracleList">
            <article><span className="caseNum">02</span><div><small>Mexico City · 1531</small><h3>Our Lady of Guadalupe</h3><p>Image, documentary history, and questions of provenance.</p></div><a href="#">↗</a></article>
            <article><span className="caseNum">03</span><div><small>Lourdes, France · 1858–present</small><h3>The Lourdes medical cases</h3><p>A formal medical review process and a small set of recognized cures.</p></div><a href="#">↗</a></article>
            <article><span className="caseNum">04</span><div><small>Various · ongoing</small><h3>Eucharistic miracle claims</h3><p>What can—and cannot—be established from the available evidence.</p></div><a href="#">↗</a></article>
          </div>
        </div>
        <p className="miracleDisclaimer">Case files are an evidence framework for later research. Final claims and strength ratings require complete sourcing and review.</p>
      </section>

      <section className="questionsSection" id="questions">
        <div className="questionIntro"><p className="sectionKicker light">Questions & objections</p><h2>Ask the<br /><em>hard question.</em></h2><p>Short answers orient you. Every answer points back into the historical record so the evidence remains primary.</p><a href="mailto:?subject=A question for Upon this Rock" className="outlineButton">Suggest a question <span>↗</span></a></div>
        <div className="faqList">{questions.map((item, index) => <details key={item.q} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span><b>{item.q}</b><i>+</i></summary><div className="faqAnswer"><p>{item.a}</p><a href="#timeline">{item.jump} <span>→</span></a></div></details>)}</div>
      </section>

      <section className="closingSection"><span className="closingMark">✦</span><p className="sectionKicker">Begin at the beginning</p><h2>History deserves to be<br /><em>heard in its own voice.</em></h2><p>Start with Pentecost. Meet each witness in time. Decide only after you have seen the whole.</p><a href="#timeline" className="primaryCta" onClick={() => setEraIndex(0)}>Begin the journey <span>→</span></a></section>

      <footer><a className="brand" href="#top"><span className="brandMark">✦</span><span>Upon this Rock</span></a><p>A guided historical case for the Catholic Church.</p><div><a href="#journey">Journey</a><a href="#doctrines">Doctrines</a><a href="#miracles">Miracles</a><a href="#questions">Questions</a></div><small>Primary sources first · Context always · Conclusions in view</small></footer>
    </main>
  );
}
