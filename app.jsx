/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakSlider, TweakRadio, TweakColor, TweakToggle */
const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#D67A88",
  "deep": "#6E2A3A",
  "cream": "#F4EDE6",
  "ink": "#2A2422",
  "fontPairing": "frank",
  "intensity": 3,
  "darkMode": false
}/*EDITMODE-END*/;

const FONT_PAIRINGS = {
  frank: { display: '"Frank Ruhl Libre", serif', body: '"Heebo", sans-serif', label: "Frank Ruhl × Heebo" },
  noto:  { display: '"Noto Serif Hebrew", serif', body: '"Assistant", sans-serif', label: "Noto Serif × Assistant" },
  david: { display: '"David Libre", serif', body: '"Rubik", sans-serif', label: "David Libre × Rubik" },
};

// ---------- Cursor ----------
function Cursor({ accent }) {
  const dotRef = useRef(null);
  const haloRef = useRef(null);
  useEffect(() => {
    let x = -100, y = -100, hx = -100, hy = -100;
    const onMove = (e) => { x = e.clientX; y = e.clientY; };
    const tick = () => {
      hx += (x - hx) * 0.12;
      hy += (y - hy) * 0.12;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      if (haloRef.current) haloRef.current.style.transform = `translate(${hx}px, ${hy}px)`;
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);
  return (
    <>
      <div ref={haloRef} className="cursor-halo" style={{ background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)` }} />
      <div ref={dotRef} className="cursor-dot" style={{ background: accent }} />
    </>
  );
}

// ---------- Reveal hook ----------
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

// ---------- Top Nav ----------
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="brand-mark">T</span>
          <span className="brand-word">TOPA · טופה</span>
        </div>
        <ul className="nav-links">
          <li><a href="#hero">בית</a></li>
          <li><a href="#about">הסטודיו</a></li>
          <li><a href="#compare">השוואה</a></li>
          <li><a href="#reviews">בוגרות</a></li>
          <li><a href="#enroll">הרשמה</a></li>
        </ul>
        <a href="#enroll" className="nav-cta">
          <span>הצטרפי למחזור</span>
          <span className="nav-cta-arrow">←</span>
        </a>
      </div>
    </nav>
  );
}

// ---------- Hero ----------
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);
  return (
    <section id="hero" className="hero">
      <div className="hero-grain" />
      <div className="hero-marks">
        <span className="mark mark-tl">№ 04 · מחזור אביב 2026</span>
        <span className="mark mark-tr">תל אביב · ישראל</span>
        <span className="mark mark-bl">est. 2018</span>
        <span className="mark mark-br">קורס קעקועים בוטיק</span>
      </div>

      <div className="hero-inner">
        <div className={`hero-kicker ${mounted ? "in" : ""}`}>
          <span className="hairline" />
          <span>אקדמיית הקעקועים של טופה</span>
          <span className="hairline" />
        </div>

        <h1 className="hero-title">
          <span className={`line ${mounted ? "in" : ""}`} style={{ transitionDelay: "120ms" }}>קורס קעקועים</span>
          <span className={`line italic ${mounted ? "in" : ""}`} style={{ transitionDelay: "240ms" }}>
            <em>בוטיק</em>
            <svg className="title-flourish" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden>
              <path d="M2 28 C 40 8, 90 8, 130 22 S 190 32, 198 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </span>
          <span className={`line small ${mounted ? "in" : ""}`} style={{ transitionDelay: "360ms" }}>אחת על אחת. מהיסוד.</span>
        </h1>

        <p className={`hero-lede ${mounted ? "in" : ""}`} style={{ transitionDelay: "480ms" }}>
          ארבעה חודשים, שש תלמידות, סטודיו אחד.
          <br />
          אנחנו לומדות ביחד את האמנות, המלאכה והעסק שמאחורי קעקוע אמיתי —
          לא בקבוצה גדולה ולא דרך מסך, אלא יד ביד מול מראה.
        </p>

        <div className={`hero-ctas ${mounted ? "in" : ""}`} style={{ transitionDelay: "600ms" }}>
          <a href="#enroll" className="btn btn-primary">
            <span>בואי נדבר</span>
            <span className="btn-arrow">←</span>
          </a>
          <a href="#about" className="btn btn-ghost">
            <span>על הסטודיו</span>
          </a>
        </div>

        <div className={`hero-meta ${mounted ? "in" : ""}`} style={{ transitionDelay: "720ms" }}>
          <Stat n="06" label="תלמידות בלבד" />
          <Divider />
          <Stat n="16" label="שבועות לימוד" />
          <Divider />
          <Stat n="120+" label="בוגרות שעובדות" />
          <Divider />
          <Stat n="1×1" label="ליווי אישי" />
        </div>
      </div>

      <a href="#about" className="hero-scroll" aria-label="גלילה למטה">
        <span>גללי</span>
        <span className="hero-scroll-line" />
      </a>
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <div className="stat">
      <div className="stat-n">{n}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
function Divider() { return <span className="meta-divider" aria-hidden />; }

// ---------- Marquee ----------
function Marquee() {
  const items = [
    "Fine Line", "Black & Grey", "Botanical", "Ornamental", "Lettering",
    "Micro Realism", "Color Theory", "Skin Studies", "Studio Practice", "Business",
  ];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />
            <span>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------- About ----------
function About() {
  const [ref, visible] = useReveal();
  return (
    <section id="about" className="about" ref={ref}>
      <div className="about-grid">
        <aside className="about-side">
          <div className={`kicker ${visible ? "in" : ""}`}>
            <span className="kicker-dot" />
            <span>פרק 01 — הסטודיו</span>
          </div>

          <div className={`portrait ${visible ? "in" : ""}`}>
            <div className="portrait-frame">
              <svg className="portrait-placeholder" viewBox="0 0 280 360" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <pattern id="stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.6" opacity="0.35"/>
                  </pattern>
                </defs>
                <rect width="280" height="360" fill="url(#stripes)"/>
                <text x="140" y="180" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontSize="11" letterSpacing="2" fill="currentColor" opacity="0.55">— PORTRAIT —</text>
                <text x="140" y="198" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontSize="9" letterSpacing="1" fill="currentColor" opacity="0.4">TOPA · 4×5</text>
              </svg>
              <div className="portrait-tag">טופה דניאל · מייסדת ומורה ראשית</div>
            </div>
          </div>
        </aside>

        <div className="about-main">
          <h2 className={`section-title ${visible ? "in" : ""}`}>
            לא קורס.<br />
            <em>סטודיו לומד.</em>
          </h2>

          <div className={`about-lede ${visible ? "in" : ""}`}>
            <p>
              לפני שמונה שנים פתחתי את טופה כי לא היה לי איפה ללמוד את זה כמו שצריך.
              לא רציתי לראות עוד מצגת, לא רציתי להעתיק שבלונה. רציתי לשבת מול בנאדם,
              להבין למה הוא בא, ולעקוב במחט שלי על העור שלו — לאט, ביחד, בכבוד.
            </p>
            <p>
              היום, אחרי שלוש מאות לקוחות וארבעה מחזורים, אני מלמדת את הקורס שאני
              עצמי הייתי רוצה לקחת. לא בקבוצה של עשרים, לא בזום, לא בקיצורי דרך.
              שש תלמידות, ארבעה חודשים, סטודיו פעיל — והרבה תה.
            </p>
          </div>

          <div className="about-pillars">
            <Pillar i="01" title="אינטימי" body="שש מקומות בלבד בכל מחזור. כי ככה לומדים." delay={0} visible={visible} />
            <Pillar i="02" title="מעשי" body="מהשבוע הראשון יד על מכונה. רוב השיעור — תרגול." delay={120} visible={visible} />
            <Pillar i="03" title="שלם" body="טכניקה, סגנון, היגיינה, ועסק. הכול במקום אחד." delay={240} visible={visible} />
          </div>

          <a href="#compare" className={`about-link ${visible ? "in" : ""}`}>
            <span>איך זה שונה מסטודיו אחר?</span>
            <span className="about-link-arrow">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Pillar({ i, title, body, delay, visible }) {
  return (
    <div className={`pillar ${visible ? "in" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="pillar-i">{i}</div>
      <div className="pillar-title">{title}</div>
      <div className="pillar-body">{body}</div>
    </div>
  );
}

// ---------- Compare ----------
const COMPARE_ROWS = [
  {
    label: "פורמט הלימוד",
    us: "אחת על אחת. שש בנות, מורה אחת, סטודיו אחד.",
    them: "כיתה של 20–30, לעיתים בזום או מוקלט מראש.",
  },
  {
    label: "סילבוס",
    us: "מותאם אישית. בודקות יחד מה את כבר יודעת ומאיפה מתחילות.",
    them: "סילבוס קבוע וצפוף. כולן עוברות את אותו דבר באותו קצב.",
  },
  {
    label: "ליווי בין השיעורים",
    us: "וואטסאפ פתוח, פידבק על כל שרטוט, סקייפ שבועי במידת הצורך.",
    them: "פגישה בכיתה, ולהתראות עד הפעם הבאה.",
  },
  {
    label: "תרגול על עור",
    us: "כבר מהשבוע הרביעי, בלייב, על מתנדבים אמיתיים בסטודיו.",
    them: "בעיקר על סיליקון. לעיתים פעם או פעמיים על עור עד הסוף.",
  },
  {
    label: "בנייה של תיק עבודות",
    us: "מלוות אותך בבחירת סגנון אישי, בצילום ובעריכה.",
    them: "תיק כללי. את לבד עם הסגנון שלך.",
  },
  {
    label: "אחרי הקורס",
    us: "המקום היחיד בארץ שמציע מקום בסטודיו לבוגרות מצטיינות.",
    them: "תעודה ביד, ובהצלחה.",
  },
];

function Compare() {
  const [ref, visible] = useReveal();
  return (
    <section id="compare" className="compare" ref={ref}>
      <div className="compare-head">
        <div className={`kicker center ${visible ? "in" : ""}`}>
          <span className="kicker-dot" />
          <span>פרק 02 — השוואה הוגנת</span>
        </div>
        <h2 className={`section-title center ${visible ? "in" : ""}`}>
          למה <em>טופה</em>,<br />
          ולא סטודיו אחר?
        </h2>
        <p className={`compare-lede ${visible ? "in" : ""}`}>
          חיפשנו את ההבדלים האמיתיים, לא את אלה שנשמעים יפה במודעה.
          הנה מה שאנחנו עושות אחרת — שורה אחר שורה.
        </p>
      </div>

      <div className={`compare-table ${visible ? "in" : ""}`}>
        <div className="compare-headrow">
          <div className="compare-col-label" />
          <div className="compare-col-us">
            <div className="col-tag col-tag-us">אנחנו</div>
            <div className="col-name"><em>סטודיו טופה</em></div>
            <div className="col-sub">בוטיק · 6 תלמידות</div>
          </div>
          <div className="compare-col-them">
            <div className="col-tag col-tag-them">אחרים</div>
            <div className="col-name">סטודיו רגיל</div>
            <div className="col-sub">קבוצה גדולה · סילבוס קבוע</div>
          </div>
        </div>

        {COMPARE_ROWS.map((r, i) => (
          <CompareRow key={i} row={r} idx={i} visible={visible} />
        ))}

        <div className="compare-foot">
          <a href="#enroll" className="btn btn-primary btn-lg">
            <span>אני רוצה להיפגש</span>
            <span className="btn-arrow">←</span>
          </a>
          <span className="compare-foot-note">פגישת היכרות, ללא התחייבות. תה על חשבוננו.</span>
        </div>
      </div>
    </section>
  );
}

function CompareRow({ row, idx, visible }) {
  return (
    <div className={`compare-row ${visible ? "in" : ""}`} style={{ transitionDelay: `${200 + idx * 90}ms` }}>
      <div className="compare-rowlabel">
        <span className="rowlabel-num">0{idx + 1}</span>
        <span className="rowlabel-text">{row.label}</span>
      </div>
      <div className="compare-cell compare-cell-us">
        <CheckMark />
        <p>{row.us}</p>
      </div>
      <div className="compare-cell compare-cell-them">
        <DashMark />
        <p>{row.them}</p>
      </div>
    </div>
  );
}

function CheckMark() {
  return (
    <svg className="mark-check" viewBox="0 0 28 28" aria-hidden>
      <circle cx="14" cy="14" r="12.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45"/>
      <path d="M8 14.5 L12.5 19 L20.5 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function DashMark() {
  return (
    <svg className="mark-dash" viewBox="0 0 28 28" aria-hidden>
      <circle cx="14" cy="14" r="12.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35"/>
      <path d="M8.5 14 L19.5 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

// ---------- Reviews ----------
const QUOTES = [
  {
    name: "מאיה לוי", role: "מחזור 03 · Fine Line", tone: "a",
    quote: "באתי בלי ניסיון, יצאתי עם תיק עבודות וסטודיו משלי בנווה צדק. טופה ראתה אותי לפני שאני ראיתי את עצמי.",
    media: { kind: "image", src: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80", caption: "עבודה אחרונה · מחזור 03" },
  },
  {
    name: "שירה ב.", role: "מחזור 02 · Botanical", tone: "b",
    quote: "הקבוצה הקטנה היא הכל. ארבעה חודשים שש בנות בחדר אחד — נהיינו משפחה, ואחת לא עזבה את השנייה מאז.",
    media: { kind: "video", poster: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?auto=format&fit=crop&w=800&q=80", src: "https://cdn.coverr.co/videos/coverr-a-tattoo-artist-at-work-9159/1080p.mp4", caption: "וידאו · מאחורי הקלעים" },
  },
  {
    name: "נועה כהן", role: "מחזור 04 · Black & Grey", tone: "c",
    quote: "ניסיתי קורסים אחרים. שום דבר לא משתווה לליווי האישי כאן. כל שרטוט שלי קיבל פידבק תוך שעה.",
    media: { kind: "image", src: "https://images.unsplash.com/photo-1590246814883-57c511e76523?auto=format&fit=crop&w=800&q=80", caption: "Black & Grey · אמצע מחזור" },
  },
  {
    name: "תמר אבן", role: "מחזור 01 · Lettering", tone: "d",
    quote: "אחרי הקורס נשארתי בסטודיו עוד חצי שנה. זה לא נגמר עם התעודה — זה רק מתחיל. אני עדיין שולחת לטופה כל שרטוט.",
    media: { kind: "image", src: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80", caption: "Lettering · פרויקט גמר" },
  },
  {
    name: "ליה מ.", role: "מחזור 03 · Micro Realism", tone: "a",
    quote: "הסטודיו מרגיש כמו בית. תה, מוזיקה, וטופה שמאמינה בך גם כשאת לא מאמינה בעצמך.",
    media: { kind: "image", src: "https://images.unsplash.com/photo-1598211686290-a8ef209d87c1?auto=format&fit=crop&w=800&q=80", caption: "Micro · שרטוט בעיפרון" },
  },
  {
    name: "רוני אדרי", role: "מחזור 02 · Botanical", tone: "b",
    quote: "באתי בלי לדעת לצייר עיגול. יצאתי עם סגנון אישי שלם וביטחון לפתוח אינסטגרם של אמנית קעקועים.",
    media: { kind: "video", poster: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80", src: "https://cdn.coverr.co/videos/coverr-tattoo-machine-at-work-3308/1080p.mp4", caption: "וידאו · רגע ראשון" },
  },
  {
    name: "דנה ש.", role: "מחזור 04 · Fine Line", tone: "c",
    quote: "הכי חשוב — לא לימדו אותי רק לקעקע. לימדו אותי איך לדבר עם לקוחה, איך לתמחר, איך לבנות עסק.",
    media: { kind: "image", src: "https://images.unsplash.com/photo-1521252659862-eec69941b071?auto=format&fit=crop&w=800&q=80", caption: "Fine Line · יום סטודיו" },
  },
  {
    name: "מיכל נ.", role: "מחזור 01 · Ornamental", tone: "d",
    quote: "הקורס הכי שווה שלקחתי בחיי. וגם הכי מפחיד. ושני הדברים האלה היו צריכים לקרות יחד.",
    media: { kind: "image", src: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80", caption: "Ornamental · עבודת גמר" },
  },
];

function ReviewMedia({ media }) {
  const vidRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  if (!media) return null;
  if (media.kind === "video") {
    const toggle = () => {
      const v = vidRef.current;
      if (!v) return;
      if (v.paused) { v.play(); setPlaying(true); }
      else { v.pause(); setPlaying(false); }
    };
    return (
      <button type="button" className="rv-q-media rv-q-media-video" onClick={toggle} aria-label="נגן וידאו">
        <video
          ref={vidRef}
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span className={`rv-q-play ${playing ? "playing" : ""}`} aria-hidden>
          {playing ? (
            <svg viewBox="0 0 24 24"><rect x="7" y="6" width="3.5" height="12" rx="0.5"/><rect x="13.5" y="6" width="3.5" height="12" rx="0.5"/></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M8 5 L19 12 L8 19 Z"/></svg>
          )}
        </span>
        <span className="rv-q-media-tag">VIDEO</span>
        {media.caption && <span className="rv-q-media-cap">{media.caption}</span>}
      </button>
    );
  }
  return (
    <figure className="rv-q-media rv-q-media-image">
      <img src={media.src} alt={media.caption || ""} loading="lazy" />
      {media.caption && <figcaption className="rv-q-media-cap">{media.caption}</figcaption>}
    </figure>
  );
}

function Reviews() {
  const [ref, visible] = useReveal();
  const trackRef = useRef(null);
  const scrollBy = (dir) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector(".rv-q");
    const w = card ? card.offsetWidth + 20 : 380;
    trackRef.current.scrollBy({ left: dir * w, behavior: "smooth" });
  };
  return (
    <section id="reviews" className="rv" ref={ref}>
      <div className="rv-head">
        <div className={`kicker center ${visible ? "in" : ""}`}>
          <span className="kicker-dot" />
          <span>פרק 03 — בוגרות מספרות</span>
        </div>
        <h2 className={`section-title center ${visible ? "in" : ""}`}>
          הקול<br />
          <em>של הבנות.</em>
        </h2>
        <p className={`rv-lede ${visible ? "in" : ""}`}>
          שמונה ציטוטים, שמונה בוגרות, סטודיו אחד שנשאר להן בלב.
          גללי ימינה ושמאלה — כל אחת מספרת אחרת.
        </p>
      </div>

      <div className="rv-stats">
        <div className={`rv-stat ${visible ? "in" : ""}`} style={{ transitionDelay: "100ms" }}>
          <span className="rv-stat-n">4.9</span>
          <span className="rv-stat-l">דירוג ממוצע</span>
        </div>
        <span className="rv-stat-rule" />
        <div className={`rv-stat ${visible ? "in" : ""}`} style={{ transitionDelay: "180ms" }}>
          <span className="rv-stat-n">№ 124</span>
          <span className="rv-stat-l">ביקורות</span>
        </div>
        <span className="rv-stat-rule" />
        <div className={`rv-stat ${visible ? "in" : ""}`} style={{ transitionDelay: "260ms" }}>
          <span className="rv-stat-n">98%</span>
          <span className="rv-stat-l">ממליצות</span>
        </div>
      </div>

      <div className={`rv-rail ${visible ? "in" : ""}`}>
        <button type="button" className="rv-arrow rv-arrow-prev" onClick={() => scrollBy(1)} aria-label="ביקורת קודמת">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M9 6 L15 12 L9 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div className="rv-track" ref={trackRef}>
          {QUOTES.map((q, i) => (
            <article
              key={i}
              className={`rv-q rv-tone-${q.tone} ${visible ? "in" : ""}`}
              style={{ transitionDelay: `${150 + i * 60}ms` }}
            >
              <ReviewMedia media={q.media} />
              <span className="rv-q-num">№ {String(i + 1).padStart(2, "0")}</span>
              <p className="rv-q-text">
                <span className="rv-q-mark">«</span>{q.quote}<span className="rv-q-mark close">»</span>
              </p>
              <footer className="rv-q-foot">
                <span className="rv-q-name">{q.name}</span>
                <span className="rv-q-role">{q.role}</span>
              </footer>
            </article>
          ))}
        </div>

        <button type="button" className="rv-arrow rv-arrow-next" onClick={() => scrollBy(-1)} aria-label="ביקורת הבאה">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M15 6 L9 12 L15 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className={`rv-hint ${visible ? "in" : ""}`}>
        <span className="hairline" />
        <span>גללי / החליקי</span>
        <span className="hairline" />
      </div>
    </section>
  );
}

function Stars() {
  return (
    <span className="rv-stars-line" aria-label="5 מתוך 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" aria-hidden>
          <path d="M6 1 L7.4 4.4 L11 4.7 L8.3 7.1 L9.1 10.7 L6 8.8 L2.9 10.7 L3.7 7.1 L1 4.7 L4.6 4.4 Z" fill="currentColor"/>
        </svg>
      ))}
    </span>
  );
}

// ---------- Enroll ----------
function Enroll() {
  const [ref, visible] = useReveal();
  const [form, setForm] = useState({ name: "", phone: "", track: "beginner", note: "" });
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState({});

  const errors = {
    name: form.name.trim().length < 2 ? "שם מלא, בבקשה" : null,
    phone: !/^[\d\-+\s()]{8,}$/.test(form.phone.trim()) ? "מספר טלפון לא תקין" : null,
  };
  const valid = !errors.name && !errors.phone;

  const submit = (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true });
    if (!valid) return;
    setSent(true);
  };

  return (
    <section id="enroll" className="enroll" ref={ref}>
      <div className="enroll-grid">
        <div className="enroll-copy">
          <div className={`kicker ${visible ? "in" : ""}`}>
            <span className="kicker-dot" />
            <span>פרק 04 — הצעד הראשון</span>
          </div>
          <h2 className={`section-title ${visible ? "in" : ""}`}>
            בואי נשתה<br />
            <em>תה ביחד.</em>
          </h2>
          <p className={`enroll-lede ${visible ? "in" : ""}`}>
            ההרשמה למחזור הקרוב נפתחת ב־1.6.26.
            לפני זה — אנחנו נפגשות לפגישת היכרות קצרה (חצי שעה, חינם, בלי הבטחות).
            מספרת לי על עצמך, רואה את הסטודיו, ומחליטה לבד.
          </p>

          <ul className={`enroll-list ${visible ? "in" : ""}`}>
            <li><span className="dot" /> מחזור אביב 2026 · התחלה 1.9.26</li>
            <li><span className="dot" /> 16 שבועות · יום בשבוע · סטודיו פלורנטין</li>
            <li><span className="dot" /> 6 מקומות. ארבעה כבר תפוסים.</li>
          </ul>
        </div>

        <form className={`enroll-form ${visible ? "in" : ""} ${sent ? "sent" : ""}`} onSubmit={submit} noValidate>
          {!sent ? (
            <>
              <div className="form-head">
                <div className="form-title">פגישת היכרות</div>
                <div className="form-num">№ 4 / 6 מקומות</div>
              </div>

              <Field
                label="שם מלא"
                placeholder="ככה אקרא לך"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                onBlur={() => setTouched({ ...touched, name: true })}
                error={touched.name && errors.name}
              />
              <Field
                label="טלפון"
                placeholder="לוואטסאפ קצר"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                onBlur={() => setTouched({ ...touched, phone: true })}
                error={touched.phone && errors.phone}
                dir="ltr"
              />

              <div className="field">
                <label className="field-label">רמת ניסיון</label>
                <div className="seg">
                  {[
                    { id: "beginner", label: "מתחילה" },
                    { id: "some",     label: "קצת ניסיון" },
                    { id: "pro",      label: "כבר עובדת" },
                  ].map((o) => (
                    <button
                      type="button"
                      key={o.id}
                      className={`seg-btn ${form.track === o.id ? "active" : ""}`}
                      onClick={() => setForm({ ...form, track: o.id })}
                    >{o.label}</button>
                  ))}
                </div>
              </div>

              <Field
                label="משהו שכדאי שאדע?"
                placeholder="אופציונלי"
                value={form.note}
                onChange={(v) => setForm({ ...form, note: v })}
                multi
              />

              <button type="submit" className="btn btn-primary btn-lg btn-full">
                <span>שולחת</span>
                <span className="btn-arrow">←</span>
              </button>

              <p className="form-fine">
                לוחצת ושולחת — אחזור אלייך תוך 24 שעות מהוואטסאפ של הסטודיו.
              </p>
            </>
          ) : (
            <div className="sent-card">
              <div className="sent-mark">
                <svg viewBox="0 0 56 56" aria-hidden>
                  <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <path d="M16 29 L25 38 L42 19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>תודה, {form.name.split(" ")[0] || "יפה"}.</h3>
              <p>קיבלתי את הפרטים. אחזור אלייך אישית בשעות הקרובות.<br />עד אז — קחי לך כוס תה. 🌹</p>
              <button type="button" className="btn btn-ghost" onClick={() => { setSent(false); setForm({ name: "", phone: "", track: "beginner", note: "" }); setTouched({}); }}>
                שליחה נוספת
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, placeholder, value, onChange, onBlur, error, multi, dir }) {
  const [focus, setFocus] = useState(false);
  return (
    <div className={`field ${error ? "err" : ""} ${focus ? "focus" : ""}`}>
      <label className="field-label">{label}</label>
      {multi ? (
        <textarea
          className="field-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={(e) => { setFocus(false); onBlur && onBlur(e); }}
          rows={3}
          dir={dir}
        />
      ) : (
        <input
          className="field-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={(e) => { setFocus(false); onBlur && onBlur(e); }}
          dir={dir}
        />
      )}
      <span className="field-line" />
      {error && <span className="field-err">{error}</span>}
    </div>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-rule" />
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">TOPA</div>
          <div className="footer-tag">אקדמיית הקעקועים · תל אביב · est. 2018</div>
        </div>
        <div className="footer-cols">
          <div>
            <div className="footer-h">סטודיו</div>
            <a>פלורנטין 14, ת״א</a>
            <a>א׳–ה׳ · 10:00–19:00</a>
          </div>
          <div>
            <div className="footer-h">קשר</div>
            <a>hello@topa.studio</a>
            <a dir="ltr">+972 54 818 1212</a>
          </div>
          <div>
            <div className="footer-h">עקבי</div>
            <a>Instagram</a>
            <a>TikTok</a>
          </div>
        </div>
      </div>
      <div className="footer-base">
        <span>© 2026 TOPA Tattoo Academy</span>
        <span className="footer-mono">№ 04 — אביב 2026</span>
      </div>
    </footer>
  );
}

// ---------- App ----------
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply CSS variables
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent", tweaks.accent);
    r.style.setProperty("--deep", tweaks.deep);
    r.style.setProperty("--cream", tweaks.darkMode ? "#1A1517" : tweaks.cream);
    r.style.setProperty("--ink", tweaks.darkMode ? "#F4EDE6" : tweaks.ink);
    r.style.setProperty("--paper", tweaks.darkMode ? "#221C1E" : "#FBF6F0");
    r.style.setProperty("--rule", tweaks.darkMode ? "#3a2f31" : "#D9CDC2");
    r.style.setProperty("--blush", tweaks.darkMode ? "#3a2228" : "#F2DCE0");
    const fonts = FONT_PAIRINGS[tweaks.fontPairing] || FONT_PAIRINGS.frank;
    r.style.setProperty("--display", fonts.display);
    r.style.setProperty("--body", fonts.body);
    r.style.setProperty("--intensity", String(tweaks.intensity));
  }, [tweaks]);

  return (
    <>
      <Cursor accent={tweaks.accent} />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Compare />
      <Reviews />
      <Enroll />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection title="צבע">
          <TweakColor label="ורוד ראשי" value={tweaks.accent} onChange={(v) => setTweak("accent", v)} />
          <TweakColor label="יין כהה" value={tweaks.deep} onChange={(v) => setTweak("deep", v)} />
          <TweakColor label="קרם רקע" value={tweaks.cream} onChange={(v) => setTweak("cream", v)} />
          <TweakColor label="דיו טקסט" value={tweaks.ink} onChange={(v) => setTweak("ink", v)} />
          <TweakToggle label="מצב כהה" value={tweaks.darkMode} onChange={(v) => setTweak("darkMode", v)} />
        </TweakSection>
        <TweakSection title="טיפוגרפיה">
          <TweakRadio
            label="זוג גופנים"
            value={tweaks.fontPairing}
            onChange={(v) => setTweak("fontPairing", v)}
            options={Object.entries(FONT_PAIRINGS).map(([id, f]) => ({ value: id, label: f.label }))}
          />
        </TweakSection>
        <TweakSection title="תנועה">
          <TweakSlider label="עוצמת אנימציה" min={0} max={10} step={1} value={tweaks.intensity} onChange={(v) => setTweak("intensity", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
