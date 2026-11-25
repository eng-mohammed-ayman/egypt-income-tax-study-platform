import React from "react";
import { createPortal } from "react-dom";
import {
  Callout,
  Closing,
  FileCard,
  Group,
  Table,
  Text,
  Heading,
  Paragraph,
  Bullets,
  Rule,
  Link,
  NavLink,
  Route,
  Routes,
  Photos,
} from "@instinct/files";
import { data } from "./data";
import { POSTERS, Poster } from "./posters";
import { MOLAKHAS } from "./molakhas";

const TONES: [string, string, string][] = [
  ["#6d28d9", "#a78bfa", "#f3edff"],
  ["#e11d48", "#fb7185", "#fff1f3"],
  ["#ea580c", "#fb923c", "#fff4ec"],
  ["#0d9488", "#2dd4bf", "#e9fbf8"],
  ["#2563eb", "#60a5fa", "#edf4ff"],
  ["#c026d3", "#e879f9", "#fcefff"],
  ["#65a30d", "#a3e635", "#f5fce6"],
  ["#d97706", "#fbbf24", "#fff8e6"],
  ["#0891b2", "#22d3ee", "#e8fafd"],
  ["#4f46e5", "#818cf8", "#eef0ff"],
  ["#059669", "#34d399", "#e9fbf2"],
  ["#0284c7", "#38bdf8", "#eaf7ff"],
  ["#db2777", "#f472b6", "#ffeff7"],
  ["#9333ea", "#c084fc", "#f8f0ff"],
];

import coverPhoto from "./photos/cover.png";
import heroImg from "./photos/hero.jpg";

type Seg = { k: string; s: string };
type Block =
  | { k: "h2" | "h3" | "p" | "note"; segs: Seg[] }
  | { k: "ul"; items: Seg[][] }
  | {
      k: "table";
      caption: string;
      options: { number: number; name: string }[];
      rows: { label: string; values: string[] }[];
    };

function Tx({ segs }: { segs: Seg[] }) {
  return (
    <>
      {segs.map((s, i) =>
        s.k === "b" ? (
          <strong key={i}>{s.s}</strong>
        ) : s.k === "num" ? (
          <bdi key={i}>{s.s}</bdi>
        ) : (
          <React.Fragment key={i}>{s.s}</React.Fragment>
        ),
      )}
    </>
  );
}

const isEx = (b: Block) =>
  (b.k === "h2" || b.k === "h3") &&
  /^(مثال|أمثلة)/.test(
    b.segs
      .map((s) => s.s)
      .join("")
      .trim(),
  );
const isQ = (b: Block) =>
  b.k === "h2" &&
  /^أسئلة/.test(
    b.segs
      .map((s) => s.s)
      .join("")
      .trim(),
  );

function BlockView({ b, caption }: { b: Block; caption: string }) {
  switch (b.k) {
    case "h2":
      return (
        <h3 className="tx-h2">
          <Tx segs={b.segs} />
        </h3>
      );
    case "h3":
      return (
        <h4 className="tx-h3">
          <Tx segs={b.segs} />
        </h4>
      );
    case "p":
      return (
        <p className="tx-p">
          <Tx segs={b.segs} />
        </p>
      );
    case "note":
      return (
        <aside className="tx-note">
          <div className="tx-note-t">ملاحظة</div>
          <div>
            <Tx segs={b.segs} />
          </div>
        </aside>
      );
    case "ul":
      return (
        <ul className="tx-ul">
          {b.items.map((it, i) => (
            <li key={i}>
              <Tx segs={it} />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="tx-table-wrap" dir="rtl">
          <table className="tx-table">
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th></th>
                {b.options.map((o) => (
                  <th key={o.number}>
                    <span className="tx-badge">{o.number}</span> {o.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  <th scope="row">{r.label}</th>
                  {r.values.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function Blocks({ blocks, caption }: { blocks: Block[]; caption: string }) {
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (isEx(b) || isQ(b)) {
      const kind = isQ(b) ? "q" : "ex";
      const group: React.ReactNode[] = [
        <BlockView key={i} b={b} caption={caption} />,
      ];
      let j = i + 1;
      while (
        j < blocks.length &&
        !(blocks[j].k === "h2") &&
        !(blocks[j].k === "h3" && !isEx(blocks[j]))
      ) {
        group.push(<BlockView key={j} b={blocks[j]} caption={caption} />);
        j++;
      }
      out.push(
        <div key={"g" + i} className={"tx-box tx-" + kind}>
          {group}
        </div>,
      );
      i = j;
    } else {
      out.push(<BlockView key={i} b={b} caption={caption} />);
      i++;
    }
  }
  return <>{out}</>;
}

function PosterView({
  p,
  tone,
}: {
  p: Poster;
  tone: [string, string, string];
}) {
  return (
    <div
      className="poster"
      dir="rtl"
      style={{
        ["--c" as string]: tone[0],
        ["--c2" as string]: tone[1],
        ["--cs" as string]: tone[2],
      }}
    >
      <div className="poster-head">
        <span className="poster-tag">{p.tag}</span>
        <h3 className="poster-title">{p.title}</h3>
        {p.sub && <p className="poster-sub">{p.sub}</p>}
      </div>
      {p.chips && p.chips.length > 0 && (
        <div className="poster-chips">
          {p.chips.map((c, i) => (
            <div key={i} className="poster-chip">
              <span className="poster-chip-big">{c.big}</span>
              <span className="poster-chip-small">{c.small}</span>
            </div>
          ))}
        </div>
      )}
      <div className="poster-body">
        {p.blocks.map((b, i) => (
          <div
            key={i}
            className={
              b.kind === "steps"
                ? "poster-block poster-block-steps"
                : "poster-block"
            }
          >
            <div className="poster-block-head">
              <span className="poster-block-n">{i + 1}</span>
              <span>{b.head}</span>
            </div>
            {b.kind === "steps" ? (
              <ol className="poster-steps">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            ) : (
              <ul className="poster-list">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {p.refs && <div className="poster-refs">{p.refs}</div>}
    </div>
  );
}

const COLORS: [string, string, string][] = [
  ["#6d28d9", "#a78bfa", "#f3edff"],
  ["#e11d48", "#fb7185", "#fff1f3"],
  ["#ea580c", "#fb923c", "#fff4ec"],
  ["#0d9488", "#2dd4bf", "#e9fbf8"],
  ["#2563eb", "#60a5fa", "#edf4ff"],
  ["#c026d3", "#e879f9", "#fcefff"],
  ["#65a30d", "#a3e635", "#f5fce6"],
  ["#d97706", "#fbbf24", "#fff8e6"],
  ["#0891b2", "#22d3ee", "#e8fafd"],
];

const BOOKS: { path: string; name: string }[] = [
  { path: "/intro", name: "المقدمة" },
  { path: "/bab1", name: "الباب الأول: مواد الإصدار والأحكام العامة" },
  { path: "/bab2", name: "الباب الثاني: المرتبات" },
  { path: "/bab3", name: "الباب الثالث: النشاط التجاري والصناعي" },
  { path: "/bab4", name: "الباب الرابع: المهن غير التجارية" },
  { path: "/bab5", name: "الباب الخامس: الثروة العقارية" },
  { path: "/bab6", name: "الباب السادس: توزيعات الأرباح" },
  { path: "/bab7", name: "الباب السابع: أرباح بيع الحصص والأوراق المالية" },
  { path: "/bab8", name: "الباب الثامن: التزامات الممولين" },
];

function sectionsFor(bookIndex: number) {
  return data.sections.filter(
    (s) => (s as { book: number }).book === bookIndex,
  );
}

function goTo(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function MolakhasView({ items }: { items: string[] }) {
  return (
    <div className="mk">
      <div className="mk-glow" />
      <div className="mk-head">
        <span className="mk-pill">الخلاصة الكبرى</span>
        <h3 className="mk-title">ملخص الملخص</h3>
        <p className="mk-sub">
          الباب كله في أقل من دقيقتين — مع البوسترات يكفيان للمراجعة السريعة
        </p>
      </div>
      <ul className="mk-list">
        {items.map((it, i) => (
          <li key={i}>
            <span className="mk-n">{i + 1}</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BookPage({ bookIndex }: { bookIndex: number }) {
  const sections = sectionsFor(bookIndex);
  const mk = MOLAKHAS.find((m) => m.book === bookIndex);
  const bookPosters = POSTERS.filter((p) => p.book === bookIndex);
  const mkSec = bookPosters.length
    ? Math.min(...bookPosters.map((p) => p.secIndex))
    : 0;
  return (
    <div
      className="tx-book"
      style={{
        ["--c" as string]: COLORS[bookIndex][0],
        ["--c2" as string]: COLORS[bookIndex][1],
        ["--cs" as string]: COLORS[bookIndex][2],
      }}
    >
      <div className="tx-banner">
        <span className="tx-banner-n">{bookIndex === 0 ? "٠" : bookIndex}</span>
        <span>{BOOKS[bookIndex].name}</span>
      </div>
      {sections.length > 1 && (
        <div className="tx-mini">
          {sections.map((s, i) => (
            <button
              type="button"
              key={i}
              onClick={() => goTo(`sec-${bookIndex}-${i}`)}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}
      {sections.map((s, i) => (
        <section key={i} id={`sec-${bookIndex}-${i}`} className="tx-sec">
          <div className="tx-sec-label">{`قسم ${i + 1} من ${sections.length}`}</div>
          <h2 className="tx-sec-title">{s.title}</h2>
          {POSTERS.filter((p) => p.book === bookIndex && p.secIndex === i).map(
            (p, k) => (
              <PosterView
                key={k}
                p={p}
                tone={
                  TONES[
                    (bookIndex +
                      POSTERS.filter(
                        (q) => q.book === bookIndex && q.secIndex < i,
                      ).length) %
                      TONES.length
                  ]
                }
              />
            ),
          )}
          {i === mkSec && mk ? <MolakhasView items={mk.items} /> : null}
          <Blocks blocks={s.blocks as Block[]} caption={s.title} />
        </section>
      ))}
      <div className="tx-pager">
        {bookIndex > 0 ? (
          <Link to={BOOKS[bookIndex - 1].path}>
            → {BOOKS[bookIndex - 1].name.split(":")[0]}
          </Link>
        ) : (
          <Link to="/">→ الرئيسية</Link>
        )}
        {bookIndex < BOOKS.length - 1 ? (
          <Link to={BOOKS[bookIndex + 1].path}>
            {BOOKS[bookIndex + 1].name.split(":")[0]} ←
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

function useActiveBook() {
  const [activeBook, setActiveBook] = React.useState(0);
  React.useEffect(() => {
    const t = window.setInterval(() => {
      const links = Array.from(document.querySelectorAll("nav.tx-nav a"));
      const i = links.findIndex(
        (el) => el.getAttribute("aria-current") === "page",
      );
      if (i >= 0) setActiveBook((p) => (p === i ? p : i));
    }, 500);
    return () => window.clearInterval(t);
  }, []);
  return activeBook;
}

function jumpTo(id: string) {
  let tries = 0;
  const tick = () => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (tries++ < 90) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function NavTree({
  activeBook,
  activeSec,
  onClose,
}: {
  activeBook: number;
  activeSec: string;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = React.useState(activeBook);
  React.useEffect(() => {
    setExpanded(activeBook);
  }, [activeBook]);
  function jump(id: string) {
    onClose();
    window.setTimeout(() => jumpTo(id), 90);
  }
  return (
    <div className="sn-tree">
      {BOOKS.map((b, i) => {
        const secs = sectionsFor(i);
        const isOn = i === activeBook;
        const isOpen = expanded === i;
        return (
          <div
            key={b.path}
            className={"sn-book" + (isOn ? " sn-on" : "")}
            style={{
              ["--c" as string]: COLORS[i][0],
              ["--c2" as string]: COLORS[i][1],
              ["--cs" as string]: COLORS[i][2],
            }}
          >
            <div className="sn-book-row">
              <Link
                to={b.path}
                className="sn-book-link"
                onClick={() => {
                  setExpanded(i);
                  onClose();
                }}
              >
                <span className="sn-dot" />
                <span>{b.name.split(":")[0]}</span>
              </Link>
              {secs.length > 1 && (
                <button
                  type="button"
                  className="sn-exp"
                  aria-expanded={isOpen}
                  aria-label="أقسام الباب"
                  onClick={() => setExpanded(isOpen ? -1 : i)}
                >
                  {isOpen ? "−" : "+"}
                </button>
              )}
            </div>
            {isOpen && (
              <div className="sn-secs">
                {secs.map((s, j) => (
                  <Link
                    key={j}
                    to={b.path}
                    className={
                      "sn-sec" +
                      (activeSec === "sec-" + i + "-" + j ? " sn-sec-on" : "")
                    }
                    onClick={() => jump("sec-" + i + "-" + j)}
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SideNav() {
  const [open, setOpen] = React.useState(false);
  const [activeSec, setActiveSec] = React.useState("");
  const activeBook = useActiveBook();

  React.useEffect(() => {
    const secs = Array.from(document.querySelectorAll('[id^="sec-"]'));
    if (!secs.length) return;
    const obs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) setActiveSec((e.target as HTMLElement).id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    secs.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [activeBook]);

  return (
    <div className="sn-inline">
      <button
        type="button"
        className={"sn-open-btn" + (open ? " sn-btn-on" : "")}
        aria-expanded={open}
        aria-label={open ? "إغلاق الفهرس" : "فتح الفهرس"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sn-open-ico">☰</span>
        <span className="sn-open-txt">
          <b>{open ? "إغلاق الفهرس" : "الفهرس: تنقّل سريع"}</b>
          <small>المقدمة والأبواب الثمانية وأجزاء كل باب</small>
        </span>
        <span className="sn-open-chev">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="sn-panel" role="region" aria-label="التنقل السريع">
          <NavTree
            activeBook={activeBook}
            activeSec={activeSec}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function LIcon({ d, extra }: { d: string; extra?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
      {extra ? <path d={extra} /> : null}
    </svg>
  );
}

const LAND_ICONS = [
  <LIcon
    key="0"
    d="M12 6c-2-1.6-4.5-2-7-2v14c2.5 0 5 .4 7 2 2-1.6 4.5-2 7-2V4c-2.5 0-5 .4-7 2z"
    extra="M12 6v14"
  />,
  <LIcon
    key="1"
    d="M7 3h10a2 2 0 0 1 2 2v16H9a2 2 0 0 1-2-2V3z"
    extra="M10 8h5M10 12h5M10 16h3"
  />,
  <LIcon
    key="2"
    d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"
    extra="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8"
  />,
  <LIcon key="3" d="M4 9l1.6-5h12.8L20 9v11H4V9z" extra="M9 20v-6h6v6" />,
  <LIcon
    key="4"
    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
    extra="M5 21c1.2-4 4-6 7-6s5.8 2 7 6"
  />,
  <LIcon key="5" d="M4 11l8-7 8 7" extra="M6 9.5V20h12V9.5M10 20v-5h4v5" />,
  <LIcon
    key="6"
    d="M12 3a9 9 0 1 0 9 9h-9V3z"
    extra="M15 2.5A9 9 0 0 1 21.5 9H15V2.5z"
  />,
  <LIcon key="7" d="M4 17l5-6 4 3 7-8" extra="M16 6h4v4" />,
  <LIcon
    key="8"
    d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21V3z"
    extra="M9 8h6M9 12h6"
  />,
];

/* صفحة الهبوط: هيرو بنفس تصميم صورة العميل + مربعات التنقل البيضاء */
function Landing({ onToc }: { onToc: () => void }) {
  return (
    <div className="land">
      <section className="land-hero">
        <div className="land-hero-txt">
          <p className="land-script">رحلتك نحو التفوق تبدأ من هنا ..</p>
          <svg className="land-swash" viewBox="0 0 220 14" aria-hidden="true">
            <path
              d="M4 9 C 60 2, 160 2, 216 8"
              fill="none"
              stroke="#c9a227"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
          <h2 className="land-title">
            ملخص الضرائب الشامل<em>للفرقة الثالثة</em>
          </h2>
          <p className="land-sub">ذاكر بذكاء .. وحقق أعلى الدرجات</p>
          <p className="land-desc">
            محتوى متكامل لكتاب الضرائب: كل باب بملخص مبسط وبوسترات ودياجرامز
            للأرقام والنسب، وملخص الملخص للمراجعة السريعة قبل الامتحان.
          </p>
          <div className="land-cta">
            <Link to="/intro" className="land-btn-main">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 6c-2-1.6-4.5-2-7-2v14c2.5 0 5 .4 7 2 2-1.6 4.5-2 7-2V4c-2.5 0-5 .4-7 2z" />
                <path d="M12 6v14" />
              </svg>{" "}
              ابدأ المذاكرة الآن
            </Link>
            <button type="button" className="land-btn-ghost" onClick={onToc}>
              <span className="land-play">▶</span> شاهد الفهرس
            </button>
          </div>
        </div>
        <div className="land-hero-img">
          <img src={heroImg} alt="كتاب ملخص الضرائب على مكتب في المكتبة" />
        </div>
      </section>
      <div className="land-grid">
        <button
          type="button"
          className="land-card land-card-index"
          onClick={onToc}
        >
          <span className="land-ico">
            <LIcon
              d="M9 6h12M9 12h12M9 18h12"
              extra="M4 5.5v1M4 11.5v1M4 17.5v1"
            />
          </span>
          <span className="land-name">الفهرس</span>
          <span className="land-sub2">تنقّل سريع بين الأبواب والأقسام</span>
        </button>
        {BOOKS.map((b, i) => {
          const parts = b.name.split(":");
          return (
            <Link
              key={b.path}
              to={b.path}
              className="land-card"
              style={{ ["--c" as string]: COLORS[i][0] }}
            >
              <span className="land-ico">{LAND_ICONS[i]}</span>
              <span className="land-name">{parts[0]}</span>
              <span className="land-sub2">
                {parts[1] ? parts[1].trim() : "ابدأ من هنا"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* زرار ☰ طايف مع السكرول: عارض الملفات بيمدد الإطار بطول المحتوى كله، فبنستخدم
   IntersectionObserver (اللي بيقصّ لحد الشاشة الحقيقية حتى جوّه إطار cross-origin)
   مع شُرط خفيفة كل 100px عشان نعرف الجزء الظاهر من الصفحة ونحرك الزرار معاه. */
function FloatNav() {
  const [open, setOpen] = React.useState(false);
  const [activeSec, setActiveSec] = React.useState("");
  const activeBook = useActiveBook();
  const chipRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const backRef = React.useRef<HTMLDivElement | null>(null);
  const bandRef = React.useRef({ top: 100, bottom: 900 });
  const posRef = React.useRef<() => void>(() => {});
  const openRef = React.useRef(open);
  openRef.current = open;

  React.useEffect(() => {
    const cont = document.createElement("div");
    cont.className = "fn-sentinels";
    document.body.appendChild(cont);
    const vis = new Set<number>();
    let io: IntersectionObserver | null = null;

    const position = () => {
      const b = bandRef.current;
      const H = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const mid = (b.top + b.bottom) / 2;
      const chipY = Math.max(6, Math.min(H - 70, mid - 29));
      if (chipRef.current) {
        chipRef.current.style.transform = `translate3d(0px, ${chipY}px, 0px)`;
        const nearBigBtn = b.top < 650 || b.bottom > H - 450;
        chipRef.current.classList.toggle("fn-chip-hide", nearBigBtn);
      }
      if (openRef.current) {
        const pH = Math.min(560, Math.max(260, b.bottom - b.top - 16));
        const pTop = Math.max(6, Math.min(H - pH - 6, b.top + 8));
        if (panelRef.current) {
          panelRef.current.style.top = pTop + "px";
          panelRef.current.style.maxHeight = pH + "px";
        }
        if (backRef.current) {
          backRef.current.style.top = Math.max(0, b.top - 90) + "px";
          backRef.current.style.height = b.bottom - b.top + 180 + "px";
        }
      }
      const secs = Array.from(
        document.querySelectorAll('[id^="sec-"]'),
      ) as HTMLElement[];
      let cur = "";
      for (const s of secs) {
        if (s.getBoundingClientRect().top <= mid) cur = s.id;
        else break;
      }
      setActiveSec((p) => (p === cur ? p : cur));
    };
    posRef.current = position;

    const build = () => {
      cont.innerHTML = "";
      vis.clear();
      const H = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const frag = document.createDocumentFragment();
      for (let y = 100; y < H - 4; y += 100) {
        const s = document.createElement("div");
        s.style.top = y + "px";
        s.setAttribute("data-y", String(y));
        frag.appendChild(s);
      }
      cont.appendChild(frag);
      if (io) io.disconnect();
      io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            const y = Number((e.target as HTMLElement).getAttribute("data-y"));
            if (e.isIntersecting) vis.add(y);
            else vis.delete(y);
          });
          if (vis.size) {
            let mn = Infinity,
              mx = -Infinity;
            vis.forEach((v) => {
              if (v < mn) mn = v;
              if (v > mx) mx = v;
            });
            bandRef.current = { top: mn, bottom: mx + 2 };
          }
          position();
        },
        { threshold: [0] },
      );
      Array.from(cont.children).forEach((c) => io!.observe(c));
      position();
    };

    build();
    let lastH = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );
    const ro = new ResizeObserver(() => {
      const H = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      if (Math.abs(H - lastH) > 60) {
        lastH = H;
        build();
      }
    });
    ro.observe(document.body);
    return () => {
      if (io) io.disconnect();
      ro.disconnect();
      cont.remove();
    };
  }, []);

  React.useEffect(() => {
    if (open) posRef.current();
  }, [open]);

  return createPortal(
    <>
      <button
        type="button"
        ref={chipRef}
        className={"fn-chip" + (open ? " fn-chip-off" : "")}
        aria-label={open ? "إغلاق الفهرس" : "فتح الفهرس"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="fn-chip-ico">☰</span>
        <span className="fn-chip-txt">الفهرس</span>
      </button>
      {open && (
        <>
          <div
            ref={backRef}
            className="fn-backdrop"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="fn-panel"
            dir="rtl"
            role="dialog"
            aria-label="الفهرس"
          >
            <div className="fn-panel-head">
              <span className="fn-panel-title">☰ الفهرس</span>
              <button
                type="button"
                className="fn-close"
                aria-label="إغلاق الفهرس"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="fn-panel-body">
              <NavTree
                activeBook={activeBook}
                activeSec={activeSec}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </>,
    document.body,
  );
}

export function App() {
  const [tocOpen, setTocOpen] = React.useState(false);
  function toggleToc() {
    const opening = !tocOpen;
    setTocOpen(opening);
    if (opening) requestAnimationFrame(() => goTo("tx-toc"));
  }
  return (
    <FileCard lang="ar" dir="rtl">
      <Routes>
        <Route path="/" element={<Landing onToc={toggleToc} />} />
      </Routes>
      <SideNav />
      <Photos
        label="غلاف الكتاب"
        items={[
          { src: coverPhoto, alt: "غلاف كتاب الضرائب - الفرقة الثالثة 2026" },
        ]}
      />
      <nav className="tx-nav" aria-label="الفهرس وأبواب الكتاب">
        <button
          className="tx-nav-index"
          type="button"
          aria-expanded={tocOpen}
          aria-controls="tx-toc"
          style={{
            ["--c" as string]: COLORS[0][0],
            ["--cs" as string]: COLORS[0][2],
          }}
          onClick={toggleToc}
        >
          {tocOpen ? "إخفاء الفهرس" : "فهرس"}
        </button>
        {BOOKS.map((b, i) => (
          <NavLink
            key={b.path}
            to={b.path}
            onClick={() => setTocOpen(false)}
            style={{
              ["--c" as string]: COLORS[i][0],
              ["--cs" as string]: COLORS[i][2],
            }}
          >
            {b.name.split(":")[0]}
          </NavLink>
        ))}
      </nav>
      {tocOpen && (
        <div id="tx-toc" className="tx-toc-target">
          <Group label="الفهرس" heading="محتويات الملخص">
            <div className="tx-toc">
              {BOOKS.map((b, i) => {
                const secs = sectionsFor(i);
                return (
                  <div
                    key={i}
                    className="tx-toc-book"
                    style={{
                      ["--c" as string]: COLORS[i][0],
                      ["--cs" as string]: COLORS[i][2],
                    }}
                  >
                    <Link
                      className="tx-toc-book-link"
                      to={b.path}
                      onClick={() => setTocOpen(false)}
                    >
                      {b.name}
                    </Link>
                    <div className="tx-toc-secs">
                      {secs.map((s, j) => (
                        <Link
                          key={j}
                          className="tx-toc-link"
                          to={b.path}
                          onClick={() => setTocOpen(false)}
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Group>
        </div>
      )}
      <Rule />
      <Routes>
        {BOOKS.map((b, i) => (
          <Route
            key={b.path}
            path={b.path}
            element={<BookPage bookIndex={i} />}
          />
        ))}
      </Routes>
      <SideNav />
      <FloatNav />
      <Closing>
        أُعد هذا الملخص من كتاب الفرقة الثالثة (2026)، وروجعت أرقامه وأمثلته
        المحلولة ومواده وأسعاره مقابل صور صفحات الكتاب كلها (الصفحات 1-271). قد
        تبقى فيه أخطاء طفيفة، فارجع إلى الكتاب عند أي شك.
      </Closing>
    </FileCard>
  );
    }
