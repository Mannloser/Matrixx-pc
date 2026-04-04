import { Link } from "react-router-dom";
import "./css/about.css";

const FEATURES = [
  {
    num: "01",
    icon: "⚡",
    title: "Custom PC Builder",
    desc: "Pick your CPU, GPU, RAM, storage, motherboard and PSU — compatibility checked in real time as you build.",
  },
  {
    num: "02",
    icon: "🖥️",
    title: "Pre-built Templates",
    desc: "Hand-picked builds across gaming, workstation, streaming and budget categories — ready to go.",
  },
  {
    num: "03",
    icon: "📖",
    title: "Build Guides",
    desc: "Expert-written guides for every budget — from entry-level 1080p rigs to no-compromise 4K setups.",
  },
  {
    num: "04",
    icon: "🧩",
    title: "Component Catalog",
    desc: "Hundreds of CPUs, GPUs, motherboards and more — all with full specs, pricing and compatibility data.",
  },
];

const PROBLEMS = [
  {
    icon: "😵",
    problem: "PC building feels overwhelming",
    solution: "Matrixx breaks it down step by step — pick parts, see compatibility, done.",
  },
  {
    icon: "⚠️",
    problem: "Compatibility issues waste money",
    solution: "Our checker flags socket mismatches, RAM conflicts and PSU issues before you buy.",
  },
  {
    icon: "💸",
    problem: "Hard to stay on budget",
    solution: "Every build shows a running total so you always know exactly where you stand.",
  },
];

const STATS = [
  { val: "8",    label: "Component Categories" },
  { val: "340+", label: "Parts in Catalog"      },
  { val: "3",    label: "Build Guides"           },
  { val: "100%", label: "Free to Use"            },
];

const BENEFITS = [
  { icon: "⚡", text: "Easy, intuitive builder interface" },
  { icon: "🔧", text: "Real-time compatibility checking"  },
  { icon: "💰", text: "Budget-friendly build suggestions" },
  { icon: "📚", text: "Guides for every skill level"      },
  { icon: "🖥️", text: "Clean, distraction-free UX"       },
  { icon: "🔍", text: "Detailed specs for every part"     },
];

const CREATOR_TAGS = [
  { label: "MERN Stack", emoji: "🛠️" },
  { label: "React",      emoji: "⚛️" },
  { label: "Node.js",    emoji: "🟢" },
  { label: "MongoDB",    emoji: "🍃" },
  { label: "UI / UX",    emoji: "🎨" },
  { label: "AMV Editor", emoji: "🎌" },
  { label: "Thumbnails", emoji: "🖼️" },
];

export default function AboutPage() {
  return (
    <div className="ap">

      {/* ─── 1. HERO ─── */}
      <section className="ap-hero">
        <div className="ap-hero-bg-text">MATRIXX</div>
        <div className="ap-hero-inner">
          <div className="ap-eyebrow">
            <span className="ap-eyebrow-dash" />
            About Matrixx
          </div>
          <h1 className="ap-hero-title">
            Build your dream PC<br />
            with <em>confidence.</em>
          </h1>
          <p className="ap-hero-sub">
            Matrixx is a platform built for gamers, creators, and PC enthusiasts.
            Pick compatible components, explore pre-built systems, and learn through
            detailed build guides — all in one place.
          </p>
          <div className="ap-hero-ctas">
            <Link to="/builder"      className="ap-btn-primary">⚡ Start Building</Link>
            <Link to="/products/cpu" className="ap-btn-ghost">🧩 Explore Parts</Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="ap-stats-bar">
          {STATS.map((s, i) => (
            <div key={s.label} className="ap-stat">
              {i > 0 && <div className="ap-stat-sep" />}
              <div className="ap-stat-val">{s.val}</div>
              <div className="ap-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 2. STORY ─── */}
      <section className="ap-section ap-story">
        <div className="ap-story-left">
          <div className="ap-eyebrow">
            <span className="ap-eyebrow-dash" />
            Our Story
          </div>
          <h2 className="ap-h2">Why we built <em>Matrixx</em></h2>
          <p className="ap-body">
            PC building should be exciting — not overwhelming. Too many people give up
            before they even start because they don't know which parts work together,
            what their budget should be, or where to even begin.
          </p>
          <p className="ap-body" style={{ marginTop: 14 }}>
            Matrixx was built to change that. Whether you're a complete beginner or a
            seasoned builder, our tools give you everything you need to design the
            perfect system — with confidence.
          </p>

          <div className="ap-problems">
            {PROBLEMS.map((p) => (
              <div key={p.problem} className="ap-problem">
                <span className="ap-problem-icon">{p.icon}</span>
                <div>
                  <div className="ap-problem-title">{p.problem}</div>
                  <div className="ap-problem-sol">{p.solution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ap-story-right">
          <div className="ap-quote-card">
            <div className="ap-quote-mark">"</div>
            <blockquote className="ap-quote">
              Anyone should be able to build a{" "}
              <em>great PC</em> — regardless of experience.
            </blockquote>
            <p className="ap-quote-sub">
              That's the belief behind every decision we made building Matrixx.
              From the compatibility checker to the build guides, everything is
              designed to make you feel like an expert — even if it's your first build.
            </p>
            <div className="ap-quote-line" />
            <div className="ap-quote-attribution">The Matrixx team</div>
          </div>
        </div>
      </section>

      {/* ─── 3. FEATURES ─── */}
      <section className="ap-features-wrap">
        <div className="ap-section">
          <div className="ap-features-head">
            <div>
              <div className="ap-eyebrow">
                <span className="ap-eyebrow-dash" />
                What We Offer
              </div>
              <h2 className="ap-h2">Everything you need to <em>build smarter</em></h2>
            </div>
            <p className="ap-body ap-features-sub">
              Four core tools designed to take you from "no idea where to start"
              to "ready to order" — step by step.
            </p>
          </div>

          <div className="ap-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="ap-feature">
                <div className="ap-feature-top">
                  <span className="ap-feature-num">{f.num}</span>
                  <span className="ap-feature-icon">{f.icon}</span>
                </div>
                <div className="ap-feature-title">{f.title}</div>
                <div className="ap-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. WHY MATRIXX ─── */}
      <section className="ap-section ap-why">
        <div className="ap-why-left">
          <div className="ap-eyebrow">
            <span className="ap-eyebrow-dash" />
            Why Matrixx
          </div>
          <h2 className="ap-h2">Built for builders,<br /><em>by a builder</em></h2>
          <p className="ap-body">
            Every feature on Matrixx exists because a real builder needed it.
            No bloat, no noise — just the tools that actually matter when you're
            putting together your dream machine.
          </p>
        </div>
        <div className="ap-why-right">
          {BENEFITS.map((b) => (
            <div key={b.text} className="ap-benefit">
              <span className="ap-benefit-icon">{b.icon}</span>
              <span className="ap-benefit-text">{b.text}</span>
              <span className="ap-benefit-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. MISSION & VISION ─── */}
      <section className="ap-mv-wrap">
        <div className="ap-section">
          <div className="ap-mv-head">
            <div className="ap-eyebrow" style={{ justifyContent: "center" }}>
              <span className="ap-eyebrow-dash" />
              What Drives Us
            </div>
            <h2 className="ap-h2 ap-center">Mission &amp; <em>Vision</em></h2>
          </div>
          <div className="ap-mv-grid">
            <div className="ap-mv-card ap-mv-dark">
              <div className="ap-mv-label">🎯 Our Mission</div>
              <div className="ap-mv-title">Make PC building simple for everyone</div>
              <p className="ap-mv-text">
                Our mission is to make PC building simple, accessible, and enjoyable —
                for everyone. Whether you're building your first 1080p gaming rig on a
                tight budget or upgrading a professional workstation, Matrixx gives you
                the tools and knowledge to do it right.
              </p>
            </div>
            <div className="ap-mv-card ap-mv-light">
              <div className="ap-mv-label">🔭 Our Vision</div>
              <div className="ap-mv-title">A trusted platform for PC enthusiasts worldwide</div>
              <p className="ap-mv-text">
                We aim to become the go-to resource for PC builders at every level — a
                trusted platform where beginners feel guided and experts feel at home.
                Expand the catalog, deepen the compatibility engine, build a community
                around the love of custom PCs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. CREATOR ─── */}
      <section className="ap-section ap-creator-section">
        <div className="ap-eyebrow">
          <span className="ap-eyebrow-dash" />
          The Team
        </div>
        <h2 className="ap-h2">Meet the <em>Creator</em></h2>

        <div className="ap-creator">
          {/* Left col */}
          <div className="ap-creator-left">
            <div className="ap-creator-avatar">M</div>
            <div className="ap-creator-socials">
              <a href="https://instagram.com/mannloser" target="_blank" rel="noreferrer" className="ap-creator-social">📸 Instagram</a>
              <a href="https://youtube.com/@6ryukkk" target="_blank" rel="noreferrer" className="ap-creator-social ap-yt">▶ YouTube</a>
              <a href="https://sites.google.com/view/mannloser" target="_blank" rel="noreferrer" className="ap-creator-social">🌐 Portfolio</a>
            </div>
          </div>

          {/* Right col */}
          <div className="ap-creator-right">
            <div className="ap-creator-name-row">
              <h3 className="ap-creator-name">Mann Zalavadiya</h3>
              <span className="ap-creator-badge">Open to collabs 🤝</span>
            </div>
            <div className="ap-creator-role">Computer Science & Engineering Student · Marwadi University</div>

            <p className="ap-creator-bio">
              Developer of the Matrixx PC Builder platform. Built as a 4<sup>th</sup> semester
              project with the goal of making PC building accessible to everyone — from complete
              beginners to enthusiasts who just want a faster way to plan their next build.
            </p>
            
            <div className="ap-creator-divider" />

            <div className="ap-creator-fun-row">
              <span className="ap-creator-fun-label">Outside the code</span>
              <p className="ap-creator-fun-text">
                I design gaming thumbnails for creators — Valorant, Minecraft, livestream setups.
                Also deep into Blender, VFX experiments, and making anime AMV edits on YouTube
                because the passion never really stops. 🎌
              </p>
            </div>

            <div className="ap-creator-tags">
              {CREATOR_TAGS.map((t) => (
                <span key={t.label} className="ap-creator-tag">
                  {t.emoji} {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FEEDBACK ─── */}
      <section className="ap-feedback-wrap">
        <div className="ap-section ap-feedback-inner">
          <div className="ap-feedback-left">
            <div className="ap-eyebrow">
              <span className="ap-eyebrow-dash" />
              Get In Touch
            </div>
            <h2 className="ap-h2">Have feedback or <em>suggestions?</em></h2>
            <p className="ap-body">
              Matrixx is always improving. If you have ideas, found a bug, or just want
              to say hi — reach out. Every message helps make the platform better.
            </p>
            <div className="ap-feedback-links">
              <a href="mailto:patelman542@gmail.com" className="ap-flink">📧 Email</a>
              <a href="https://github.com/mannloser" target="_blank" rel="noreferrer" className="ap-flink">🐙 GitHub</a>
              <a href="https://youtube.com/@6ryukkk" target="_blank" rel="noreferrer" className="ap-flink">📺 YouTube</a>
            </div>
          </div>
          <Link to="/builder" className="ap-btn-primary ap-feedback-cta">
            ⚡ Start Building
          </Link>
        </div>
      </section>

      {/* ─── 8. BOTTOM CTA ─── */}
      <section className="ap-cta">
        <div className="ap-cta-bg-text">BUILD</div>
        <div className="ap-cta-inner">
          <h2 className="ap-cta-title">
            Ready to build your<br /><em>dream PC?</em>
          </h2>
          <p className="ap-cta-sub">
            Jump into the builder, browse the component catalog, or check out a
            build guide — everything is free, no account required.
          </p>
          <div className="ap-cta-btns">
            <Link to="/builder"      className="ap-btn-white">⚡ Start Building</Link>
            <Link to="/products/cpu" className="ap-btn-ghost-light">🧩 Browse Components</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
