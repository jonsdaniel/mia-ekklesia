"use client";

import { useMemo, useState } from "react";

type EvidenceCard = {
  id: string;
  date: string;
  title: string;
  category: string;
  question: string;
  summary: string;
  witnesses: string[];
  quote?: string;
  citation?: string;
  status?: "drafted" | "outline";
};

type Era = {
  id: string;
  number: string;
  dates: string;
  title: string;
  introduction: string;
  note: string;
  cards: EvidenceCard[];
};

const eras: Era[] = [
  {
    id: "apostolic",
    number: "I",
    dates: "A.D. 30–100",
    title: "The Apostolic Age",
    introduction: "The first question is not which later denomination reads the Bible best. It is what Christ and the Apostles established while the New Testament was still being written.",
    note: "The Church precedes the completed New Testament canon.",
    cards: [
      { id: "visible-church", date: "c. 30", title: "Christ establishes a visible Church", category: "Ecclesiology", question: "What did Christ leave behind?", summary: "Christ commissions identifiable teachers, gives them authority to bind and loose, and sends them to teach and baptize the nations.", witnesses: ["Matthew 16 and 18", "Matthew 28:18–20", "Acts 1–2"], status: "outline" },
      { id: "jerusalem", date: "c. 49", title: "The Church judges at Jerusalem", category: "Authority", question: "How is a doctrinal dispute settled?", summary: "Acts records an ecclesial judgment made by apostles and presbyters, promulgated to local churches as binding: ‘It has seemed good to the Holy Spirit and to us.’", witnesses: ["Acts 15", "Acts 16:4"], quote: "It has seemed good to the Holy Spirit and to us…", citation: "Acts 15:28", status: "outline" },
      { id: "eucharist-scripture", date: "c. 50–100", title: "The Eucharist in the apostolic witness", category: "Sacraments", question: "Symbol alone, or communion in Christ?", summary: "The institution narratives, John 6, and Paul’s warning to Corinth supply the biblical foundation for the Church’s later Eucharistic language.", witnesses: ["John 6", "1 Corinthians 10–11", "Synoptic Gospels"], status: "outline" },
      { id: "succession", date: "c. 96", title: "Clement and apostolic succession", category: "Authority", question: "Who succeeds the Apostles?", summary: "Writing from Rome to Corinth, Clement describes the Apostles appointing ministers and providing for approved men to succeed them.", witnesses: ["1 Clement 42–44", "Titus 1", "2 Timothy 2:2"], quote: "Our apostles knew through our Lord Jesus Christ that there would be strife over the bishop’s office.", citation: "1 Clement 44", status: "outline" },
    ],
  },
  {
    id: "post-apostolic",
    number: "II",
    dates: "A.D. 100–313",
    title: "The Post-Apostolic Church",
    introduction: "These Christians lived before Constantine, before Nicaea, and within living memory of the Apostles. Their testimony cannot be explained as a medieval corruption.",
    note: "The Church is persecuted, public, episcopal, sacramental—and called Catholic.",
    cards: [
      { id: "catholic-name", date: "c. 107", title: "The Church is called Catholic", category: "Identity", question: "Can the Church be found by name?", summary: "The earliest surviving post-apostolic use of the Church’s enduring name begins a historical trail through Ignatius, Cyril, Augustine, and Francis de Sales.", witnesses: ["Ignatius of Antioch", "Cyril of Jerusalem", "Augustine of Hippo", "Francis de Sales"], status: "drafted" },
      { id: "bishop-unity", date: "c. 107", title: "The bishop and the unity of the Church", category: "Authority", question: "What did local Church order look like?", summary: "Ignatius treats communion with the bishop, presbyters, and deacons as the ordinary visible structure of the Church—not as a late administrative convenience.", witnesses: ["Ignatius to the Smyrnaeans", "Ignatius to the Magnesians", "Ignatius to the Trallians"], status: "outline" },
      { id: "real-presence", date: "c. 107–155", title: "The Eucharist is Christ’s flesh", category: "Sacraments", question: "What did the earliest Fathers believe?", summary: "Ignatius uses denial of the Eucharist as a mark of heresy; Justin later describes the consecrated food as the flesh and blood of the incarnate Jesus.", witnesses: ["Ignatius, Smyrnaeans 7", "Justin Martyr, First Apology 66"], quote: "They do not confess the Eucharist to be the flesh of our Savior Jesus Christ.", citation: "Ignatius, Smyrnaeans 7", status: "outline" },
      { id: "sunday-liturgy", date: "c. 155", title: "Justin describes the Sunday liturgy", category: "Worship", question: "What happened when Christians gathered?", summary: "Readings, a homily, common prayers, the kiss of peace, Eucharistic thanksgiving, Communion, and a collection for the needy already form a recognizable order.", witnesses: ["Justin Martyr, First Apology 65–67"], status: "outline" },
      { id: "tradition-heresy", date: "c. 180", title: "Irenaeus appeals to succession and Tradition", category: "Authority", question: "How were private interpretations answered?", summary: "Against Gnostic claims of secret knowledge, Irenaeus points to the public apostolic tradition preserved in churches through their succession of bishops.", witnesses: ["Against Heresies III.3–4"], status: "outline" },
      { id: "baptism-regeneration", date: "c. 150–250", title: "Baptism and regeneration", category: "Sacraments", question: "What did Christians believe baptism accomplished?", summary: "Early Christian writers ordinarily speak of baptism as the washing of regeneration, remission of sins, and entrance into the Church.", witnesses: ["Justin, First Apology 61", "Irenaeus, Demonstration 3", "Tertullian, On Baptism"], status: "outline" },
    ],
  },
  {
    id: "councils",
    number: "III",
    dates: "A.D. 313–787",
    title: "The Imperial and Conciliar Age",
    introduction: "Legal toleration did not create the Church. It allowed her bishops to meet openly, condemn heresy, and state more precisely the faith already received.",
    note: "Here the creed, canon, Christology, and sacred images are tested in public controversy.",
    cards: [
      { id: "nicaea", date: "325", title: "Nicaea and the divinity of the Son", category: "Creed", question: "Is the Son truly God?", summary: "The first ecumenical council rejects Arius and confesses the Son as begotten, not made, and consubstantial with the Father.", witnesses: ["Nicene Creed", "Athanasius", "Council of Nicaea I"], quote: "God from God, Light from Light, true God from true God…", citation: "Nicene Creed", status: "outline" },
      { id: "constantinople", date: "381", title: "The divinity of the Holy Spirit", category: "Creed", question: "Who is the Holy Spirit?", summary: "Constantinople completes the creed’s trinitarian confession and condemns those who reduce the Holy Spirit to a creature.", witnesses: ["Niceno-Constantinopolitan Creed", "Basil, On the Holy Spirit"], status: "outline" },
      { id: "canon", date: "c. 170–397", title: "The canon comes into view", category: "Scripture", question: "Which books belong to the Bible?", summary: "The evidence is cumulative and regional. Hebrews, James, Revelation, and other books remain disputed in places before late-fourth-century lists become substantially settled.", witnesses: ["Muratorian Fragment", "Eusebius, Church History III.25", "Athanasius, Festal Letter 39", "Hippo and Carthage"], status: "outline" },
      { id: "theotokos", date: "431", title: "Ephesus and Mary as Theotokos", category: "Christology", question: "Why call Mary ‘Mother of God’?", summary: "The title protects the unity of Christ’s person: the one born of Mary is not a separate human subject joined later to the divine Word.", witnesses: ["Council of Ephesus", "Cyril of Alexandria", "Second Letter to Nestorius"], status: "outline" },
      { id: "chalcedon-peter", date: "451", title: "Chalcedon, Leo, and the Petrine claim", category: "Papacy", question: "How was Rome’s authority understood?", summary: "The council’s reception of Leo’s Tome is important evidence, but it must be read with the acts, the bishops’ acclamations, and the disputed twenty-eighth canon.", witnesses: ["Tome of Leo", "Acts of Chalcedon", "Canon 28"], status: "outline" },
      { id: "images", date: "787", title: "Nicaea II and sacred images", category: "Worship", question: "Is veneration idolatry?", summary: "The council distinguishes the honor shown to an image from the worship owed to God, grounding Christian images in the reality of the Incarnation.", witnesses: ["John of Damascus", "Council of Nicaea II"], status: "outline" },
    ],
  },
  {
    id: "medieval",
    number: "IV",
    dates: "A.D. 787–1517",
    title: "Schism and the Medieval Church",
    introduction: "The record becomes more difficult: East and West separate, political conflict enters theological disputes, and reform is repeatedly demanded within the Church.",
    note: "The presence of scandal does not answer the prior question of authority.",
    cards: [
      { id: "filioque", date: "589–1014", title: "The Filioque enters the Western creed", category: "East and West", question: "Why was the creed changed?", summary: "The clause develops in the Latin West before Rome adopts it liturgically. Its theology and its insertion into the creed are related but distinct questions.", witnesses: ["Toledo III", "Augustine, On the Trinity", "Roman adoption in 1014"], status: "outline" },
      { id: "schism", date: "1054–1204", title: "The long estrangement of East and West", category: "East and West", question: "When did communion actually break?", summary: "The events of 1054 matter, but the schism was neither created nor completed in a single day. Jurisdiction, language, politics, and later violence all belong to the account.", witnesses: ["Humbert and Cerularius", "Crusader sack of 1204", "Later reunion councils"], status: "outline" },
      { id: "confession", date: "c. 1000–1215", title: "Confession and the Lateran discipline", category: "Sacraments", question: "Did Lateran IV invent confession?", summary: "The council requires annual confession; it does not claim to create the sacrament. Earlier penitential practice supplies the relevant historical context.", witnesses: ["John 20:21–23", "Early penitentials", "Lateran IV, Canon 21"], status: "outline" },
      { id: "transubstantiation", date: "1215", title: "Transubstantiation is defined", category: "Sacraments", question: "Did the Eucharistic belief begin in 1215?", summary: "Lateran IV gives a technical name to the change. The doctrine must be compared with the much earlier Eucharistic testimony already encountered.", witnesses: ["Lateran IV", "Paschasius Radbertus", "Aquinas, Summa Theologiae III"], status: "outline" },
      { id: "reform-before", date: "910–1517", title: "Reform before the Reformation", category: "Reform", question: "Did Catholics ignore corruption?", summary: "Monastic reform, papal reform, preaching orders, councils, and saints repeatedly condemn abuses while remaining within the Church’s sacramental and hierarchical constitution.", witnesses: ["Cluniac reform", "Gregory VII", "Francis and Dominic", "Lateran V"], status: "outline" },
    ],
  },
  {
    id: "reformation",
    number: "V",
    dates: "A.D. 1517–1563",
    title: "The Protestant Reformation",
    introduction: "Western Christians now dispute principles that earlier controversies largely assumed: the rule of faith, the number of sacraments, the nature of the Mass, and the authority of the visible Church.",
    note: "Trent answers the Reformers by defining disputed points and legislating reform.",
    cards: [
      { id: "sola-scriptura", date: "1517–1546", title: "Scripture, Tradition, and the rule of faith", category: "Authority", question: "Is Scripture the sole infallible rule?", summary: "The dispute concerns not the authority of Scripture, which both sides affirm, but whether apostolic revelation is transmitted only in Scripture and who may judge its meaning.", witnesses: ["2 Thessalonians 2:15", "Irenaeus", "Luther at Worms", "Council of Trent, Session IV"], status: "outline" },
      { id: "justification", date: "1517–1547", title: "Justification, faith, and grace", category: "Salvation", question: "How is a sinner made righteous?", summary: "Competing definitions of faith, merit, grace, and justification must be stated carefully before the apparent contradiction between Paul and James can be assessed.", witnesses: ["Romans and Galatians", "James 2", "Augustine", "Trent, Session VI"], status: "outline" },
      { id: "canon-trent", date: "1546", title: "Trent and the biblical canon", category: "Scripture", question: "Did Trent add books to the Bible?", summary: "Trent’s decree responds to Reformation disputes. Its list should be compared with earlier Latin usage and the regional councils of Hippo and Carthage.", witnesses: ["Hippo 393", "Carthage 397 and 419", "Florence 1442", "Trent, Session IV"], status: "outline" },
      { id: "mass-sacrifice", date: "1545–1563", title: "The Mass as sacrifice", category: "Worship", question: "Does the Mass repeat Calvary?", summary: "Catholic teaching distinguishes the once-for-all sacrifice of Christ from its sacramental representation. The question is whether that distinction is biblical and ancient.", witnesses: ["Malachi 1:11", "Hebrews 7–10", "Didache 14", "Trent, Session XXII"], status: "outline" },
      { id: "seven-sacraments", date: "1547", title: "The seven sacraments", category: "Sacraments", question: "Why seven?", summary: "Trent’s enumeration is late as a formal list. Each sacrament’s apostolic and patristic evidence must therefore be examined separately rather than assumed from the number alone.", witnesses: ["New Testament rites", "Augustine", "Florence", "Trent, Session VII"], status: "outline" },
    ],
  },
];

const objections = [
  ["Did Constantine invent Catholicism?", "No. The second-century evidence already shows a Church that is called Catholic, governed by bishops, and centered on sacramental worship. Constantine changed its legal status, not its identity."],
  ["Does a late definition prove a late invention?", "Not by itself. The relevant test is whether the definition explains an earlier belief and practice or introduces something materially new. Each dossier will separate first witness, development, controversy, and definition."],
  ["Is the Catholic name alone sufficient proof?", "No. A name is a means of identification, not the whole case. Its force is cumulative: the same communion that retains the ancient name must also be tested for apostolic doctrine, succession, sacramental life, and unity."],
  ["What about the Orthodox Church?", "The Orthodox claim requires a more extended treatment than a collection of proof texts. The site marks points relevant to East–West disputes, but its first developed path is aimed chiefly at Protestant objections."],
  ["What about corruption in the Church?", "Corruption is evidence of sin and failed discipline. It does not by itself decide whether the Church retains the authority, doctrine, and sacraments received from the Apostles."],
];

const categories = ["All", "Authority", "Sacraments", "Scripture", "Worship", "Creed", "Papacy"];

function TopicCard({ card }: { card: EvidenceCard }) {
  return (
    <article className="topicCard" id={card.id}>
      <div className="cardHeading">
        <p><span>{card.date}</span> {card.category}</p>
        <span className={`cardStatus ${card.status}`}>{card.status === "drafted" ? "Dossier available" : "Outline"}</span>
      </div>
      <h3>{card.title}</h3>
      <p className="cardQuestion">{card.question}</p>
      {card.quote && <blockquote className="smallQuote">“{card.quote}”<cite>{card.citation}</cite></blockquote>}
      <p className="cardSummary">{card.summary}</p>
      <div className="witnessLine"><b>Principal witnesses</b><p>{card.witnesses.join(" · ")}</p></div>
      <a href={card.id === "catholic-name" ? "#catholic-name-dossier" : `#${card.id}`}>{card.id === "catholic-name" ? "Read the dossier" : "Dossier forthcoming"} <span>›</span></a>
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleEras = useMemo(() => eras.map((era) => ({
    ...era,
    cards: era.cards.filter((card) => {
      const categoryMatch = category === "All" || card.category === category;
      const queryMatch = !normalizedQuery || `${card.title} ${card.question} ${card.summary} ${card.witnesses.join(" ")}`.toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    }),
  })).filter((era) => era.cards.length), [category, normalizedQuery]);

  return (
    <main id="top">
      <header className="siteHeader">
        <a className="seal" href="#top" aria-label="Upon this Rock, home"><span>✠</span><div><b>Upon this Rock</b><small>A historical case for the Catholic Church</small></div></a>
        <nav className={menuOpen ? "open" : ""} aria-label="Primary navigation">
          <a className="active" href="#history" onClick={() => setMenuOpen(false)}>Historical Case</a>
          <a href="#miracles" onClick={() => setMenuOpen(false)}>Miracles</a>
          <a href="#questions" onClick={() => setMenuOpen(false)}>Questions</a>
          <a href="#method" onClick={() => setMenuOpen(false)}>Method & Sources</a>
        </nav>
        <a className="beginLink" href="#history">Begin at Pentecost</a>
        <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Open navigation">{menuOpen ? "Close" : "Menu"}</button>
      </header>

      <section className="masthead">
        <p className="mastheadLatin">Tu es Petrus, et super hanc petram ædificabo Ecclesiam meam.</p>
        <div className="mastheadRule"><span>✠</span></div>
        <h1>The case for the<br /><em>Catholic Church</em></h1>
        <p className="mastheadDeck">A chronological reading of Scripture, the Fathers, councils, creeds, and Christian practice—from Pentecost to the Protestant Reformation.</p>
        <a className="solidButton" href="#history">Read from the beginning</a>
        <div className="editorialNote"><b>Editorial principle</b><span>Primary texts are presented first. Commentary exists to establish date, authorship, controversy, and consequence.</span></div>
      </section>

      <section className="historyIntro" id="history">
        <div><p className="rubric">The historical case</p><h2>Doctrine in historical order</h2></div>
        <p>Each article belongs to the period in which its evidence first appears or its controversy becomes decisive. Read consecutively, or narrow the chronology by subject.</p>
      </section>

      <div className="historyTools">
        <label className="historySearch"><span>Search the historical case</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Eucharist, canon, Irenaeus" /></label>
        <div className="categoryFilters" aria-label="Filter by subject">{categories.map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </div>

      <div className="historyLayout">
        <aside className="eraIndex" aria-label="Historical periods"><p>Periods</p>{eras.map((era) => <a key={era.id} href={`#${era.id}`}><span>{era.number}</span><div><b>{era.title}</b><small>{era.dates}</small></div></a>)}</aside>
        <div className="eraContent">
          {visibleEras.map((era) => (
            <section className="eraSection" id={era.id} key={era.id}>
              <header className="eraHeader"><div className="eraNumeral">{era.number}</div><div><p>{era.dates}</p><h2>{era.title}</h2><span>{era.note}</span></div></header>
              <p className="eraIntroduction">{era.introduction}</p>
              <div className="topicGrid">{era.cards.map((card) => <TopicCard card={card} key={card.id} />)}</div>
            </section>
          ))}
          {visibleEras.length === 0 && <p className="noResults">No articles match this search.</p>}
        </div>
      </div>

      <article className="dossier" id="catholic-name-dossier">
        <header className="dossierHeader">
          <p className="rubric light">First completed dossier · Post-Apostolic Church · c. 107 onward</p>
          <h2>The Church is Called Catholic</h2>
          <p>On the Church’s proper and peculiar name</p>
          <div className="dossierByline"><span>Adapted from an essay by Jonathan Daniel</span><a href="https://jonsdaniel.substack.com/p/the-church-is-called-catholic" target="_blank" rel="noreferrer">Read the full essay ↗</a></div>
        </header>

        <div className="dossierBody">
          <aside className="dossierContents"><p>In this dossier</p><a href="#name-thesis">1. The argument</a><a href="#name-ignatius">2. Ignatius</a><a href="#name-cyril">3. Cyril of Jerusalem</a><a href="#name-augustine">4. Augustine</a><a href="#name-francis">5. Francis de Sales</a><a href="#name-conclusion">6. What follows</a></aside>
          <div className="dossierText">
            <section id="name-thesis">
              <p className="sectionNumber">I · The argument</p>
              <h3>A name identifies.</h3>
              <p>The name of a person or institution is not incidental to the act of finding it. Christians need not first master every controversy in theology and history before they can ask which visible communion has continuously borne the Church’s ancient public name.</p>
              <blockquote className="authorThesis">“The name itself is not an exhaustive proof, but it still remains a rational means of identifying the Church Christ built.”<cite>Jonathan Daniel, “The Church is Called Catholic”</cite></blockquote>
              <p>The argument is cumulative, not magical. It does not say that attaching <em>Catholic</em> to an institution proves every claim that institution makes. It asks why the name by which ordinary Christians located the Church in antiquity still identifies one continuous historical communion.</p>
            </section>

            <section id="name-ignatius" className="evidencePassage">
              <div className="passageHeading"><span>Primary text 1</span><time>c. A.D. 107</time></div>
              <h3>St. Ignatius of Antioch</h3>
              <blockquote>“Wherever Jesus Christ is, there is the Catholic Church.”<cite>Letter to the Smyrnaeans 8.2</cite></blockquote>
              <p>Ignatius is the earliest surviving writer to join <em>Catholic</em> directly to <em>Church</em>. He does not stop to introduce the word. He uses it while distinguishing the bishop-centered Church from separatist assemblies, suggesting a term his readers could already understand.</p>
              <div className="implication"><b>What the text establishes</b><p>Within years of the death of St. John, the whole Church can already be designated “the Catholic Church.”</p></div>
              <a href="https://www.newadvent.org/fathers/0109.htm" target="_blank" rel="noreferrer">Read the primary text ↗</a>
            </section>

            <section id="name-cyril" className="evidencePassage">
              <div className="passageHeading"><span>Primary text 2</span><time>c. A.D. 350</time></div>
              <h3>St. Cyril of Jerusalem</h3>
              <blockquote>“Inquire not simply where the Lord’s House is … but where is the Catholic Church.”<cite>Catechetical Lecture 18.26</cite></blockquote>
              <p>Cyril gives catechumens a practical instruction for travel. Because sects also call their buildings churches and houses of the Lord, the Christian should ask for the Catholic Church. Here <em>Catholic</em> functions not only as an abstract mark, but as a public means of locating the correct communion.</p>
              <div className="implication"><b>What the text establishes</b><p>In the fourth century an ordinary traveler could identify the Church by asking for her peculiar name.</p></div>
              <a href="https://www.newadvent.org/fathers/310118.htm" target="_blank" rel="noreferrer">Read the primary text ↗</a>
            </section>

            <section id="name-augustine" className="evidencePassage">
              <div className="passageHeading"><span>Primary text 3</span><time>A.D. 397</time></div>
              <h3>St. Augustine of Hippo</h3>
              <blockquote>“When a stranger asks where the Catholic Church meets, no heretic will venture to point to his own chapel or house.”<cite>Against the Fundamental Epistle of Manichaeus 4.5</cite></blockquote>
              <p>Augustine lists the Catholic name among several reasons that hold him in the Church: the consent of peoples, authority, miracles, apostolic succession, and the name retained amid many heresies. The name is not everything, but it is not nothing.</p>
              <div className="implication"><b>What the text establishes</b><p>Even groups that desired the Catholic name could not ordinarily direct a stranger to themselves as the Catholic Church.</p></div>
              <a href="https://www.newadvent.org/fathers/1405.htm" target="_blank" rel="noreferrer">Read the primary text ↗</a>
            </section>

            <section id="name-francis" className="evidencePassage">
              <div className="passageHeading"><span>Primary text 4</span><time>A.D. 1596</time></div>
              <h3>St. Francis de Sales</h3>
              <blockquote>“The rest of the world call us Catholic.”<cite>The Catholic Controversy, chapter XI</cite></blockquote>
              <p>Writing against the Reformers, Francis argues that their new communions received new and particular names—Lutheran, Calvinist, Huguenot, Reformed—while the ancient Church remained publicly known as Catholic. <em>Roman</em> indicates the see with which this Catholic communion is united; it does not replace the inherited name.</p>
              <div className="implication"><b>What the text establishes</b><p>The Reformation did not produce competing bodies equally known to the world as the Catholic Church.</p></div>
              <a href="https://archive.org/details/catholiccontrove00sain/page/n4/mode/1up" target="_blank" rel="noreferrer">Read the primary text ↗</a>
            </section>

            <section id="name-conclusion" className="dossierConclusion">
              <p className="sectionNumber">VI · Conclusion</p>
              <h3>The question retains its force.</h3>
              <p>Christ founded one visible Church. The earliest post-apostolic generation calls the whole Church Catholic. Later Fathers use that name to distinguish and locate her among rival sects. The same public designation survives the Reformation and remains attached to one worldwide communion.</p>
              <p>This does not settle every doctrine. It does place a burden on any account of Church history which says that the true Church ceased to be the body publicly called Catholic. If the name once followed Christ’s Church, when did it cease to do so—and why?</p>
              <div className="closingQuestion">If you want to find the Catholic Church, which Church is actually called the Catholic Church?</div>
            </section>
          </div>
        </div>
      </article>

      <section className="methodSection" id="method">
        <div><p className="rubric">Method and sources</p><h2>What each dossier must show</h2><p>The site distinguishes evidence from conclusion. Every completed article will state what a text proves, what it does not prove, and which historical questions remain open.</p></div>
        <ol><li><span>1</span><b>Text</b><p>Quote the relevant passage in sufficient context.</p></li><li><span>2</span><b>Date and authorship</b><p>Explain when, where, and by whom it was written.</p></li><li><span>3</span><b>Controversy</b><p>Identify the belief or error the author addresses.</p></li><li><span>4</span><b>Consequence</b><p>State the limited conclusion the evidence supports.</p></li></ol>
      </section>

      <section className="miraclesSection" id="miracles">
        <header><p className="rubric">Vindicatory miracles</p><h2>A separate evidential record</h2><p>These cases will be treated on their own terms: contemporary testimony, documentary provenance, medical evidence where applicable, and serious alternative explanations.</p></header>
        <div className="plainCards"><article><p>Portugal · 1917</p><h3>Fátima and the Miracle of the Sun</h3><span>Witness testimony · contemporary press · prediction</span><a href="#miracles">Case file forthcoming</a></article><article><p>France · 1858–present</p><h3>The medical cases of Lourdes</h3><span>Clinical records · review process · recognized cures</span><a href="#miracles">Case file forthcoming</a></article><article><p>Mexico · 1531</p><h3>Our Lady of Guadalupe</h3><span>Documentary history · image provenance · tradition</span><a href="#miracles">Case file forthcoming</a></article></div>
      </section>

      <section className="questionsSection" id="questions">
        <header><p className="rubric light">Questions and objections</p><h2>Direct answers,<br />with the evidence nearby</h2><p>These summaries orient the reader. The historical dossiers carry the argument.</p></header>
        <div className="objections">{objections.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span><b>{question}</b><i>+</i></summary><p>{answer}</p></details>)}</div>
      </section>

      <footer><div className="footerSeal">✠</div><div><b>Upon this Rock</b><p>A historical case for the Catholic Church</p></div><nav><a href="#history">Historical Case</a><a href="#miracles">Miracles</a><a href="#questions">Questions</a></nav><small>Scripture · Fathers · Councils · Creeds · History</small></footer>
    </main>
  );
}
