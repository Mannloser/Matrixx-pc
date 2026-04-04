import { useState } from "react";

const jobs = [
  {
    id: 1,
    emoji: "🧠",
    title: "Chief RGB Alignment Officer",
    type: "Full-time • On-site",
    department: "Aesthetics Division",
    salary: "Exposure + Snacks",
    requirements: [
      "5+ years of staring at other people's RGB setups and judging them",
      "Must be able to differentiate between 16.7 million colors (we will test this)",
      "Experience arguing on Reddit why your color scheme is objectively better",
      "Ability to spend 3 hours cable managing for a build no one will ever open again",
      "Strong opinion on whether white builds are cringe or based",
    ],
    bonus: "Will consider applicants who have cried over a bent CPU pin",
  },
  {
    id: 2,
    emoji: "💸",
    title: "Budget Optimization Specialist",
    type: "Contract • Remote",
    department: "Financial Damage Control",
    salary: "₹0 – ₹0 (negotiable downward)",
    requirements: [
      "Proven track record of convincing yourself that a ₹40,000 GPU is 'basically free'",
      "Expert-level skill in hiding Amazon boxes from family members",
      "Must know at least 6 ways to justify a purchase to yourself at 2am",
      "Experience with the phrase 'it's an investment, not an expense'",
      "Portfolio of builds that were 'supposed to be budget' and weren't",
    ],
    bonus: "Bonus points if you've ever bought a CPU cooler that costs more than the CPU",
  },
  {
    id: 3,
    emoji: "🔧",
    title: "Senior Thermal Paste Applier",
    type: "Part-time • Hybrid",
    department: "Cooling & Existential Dread",
    salary: "One tube of Arctic MX-6",
    requirements: [
      "Mastery of the pea method, the X method, AND the spread method (pick a lane!)",
      "Ability to confidently apply thermal paste while absolutely unsure what you're doing",
      "Must have applied too much at least once and lived with the shame",
      "3 years experience Googling 'how much thermal paste is too much thermal paste'",
      "Can name at least 4 thermal pastes and rank them in a heated (pun intended) debate",
    ],
    bonus: "We don't actually know the right method either. No one does.",
  },
  {
    id: 4,
    emoji: "📦",
    title: "Cardboard Box Preservation Engineer",
    type: "Full-time • On-site",
    department: "Hoarder Relations",
    salary: "The satisfaction of knowing the boxes are safe",
    requirements: [
      "Passionate about keeping every GPU box 'just in case'",
      "Zero shame about having a closet that is 70% PC component boxes",
      "Experience stacking boxes in a structurally unsound but aesthetically pleasing tower",
      "Must deeply believe that throwing away the original box voids the soul",
      "Familiarity with the phrase 'I might need that someday'",
    ],
    bonus: "We still have the box for a GTX 970. We are not proud. We are not sorry.",
  },
  {
    id: 5,
    emoji: "🎮",
    title: "Benchmark Runner & Professional Sufferer",
    type: "Full-time • Remote (duh)",
    department: "Performance Anxiety",
    salary: "The dopamine hit of a good score",
    requirements: [
      "Can run Cinebench R23 and feel emotions about the results",
      "Experience explaining why your FPS matters even in games you play at 60fps",
      "Must have at least once undervolted a GPU and immediately broke everything",
      "Able to identify bottleneck culprits within 30 seconds of any complaint",
      "Strong knowledge of which games 'don't count' when the GPU underperforms",
    ],
    bonus: "Will fast-track applicants who have BSOD'd a machine during a benchmark stream",
  },
];

function JobCard({ job, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="job-card"
      style={{
        animationDelay: `${index * 0.1 + 0.3}s`,
      }}
    >
      <div className="job-card-header" onClick={() => setOpen(!open)}>
        <div className="job-left">
          <span className="job-emoji">{job.emoji}</span>
          <div>
            <h3 className="job-title">{job.title}</h3>
            <div className="job-meta-row">
              <span className="job-tag">{job.type}</span>
              <span className="job-tag dept">{job.department}</span>
            </div>
          </div>
        </div>
        <div className="job-right">
          <span className="job-salary">{job.salary}</span>
          <button className="job-toggle" aria-label="expand">
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {open && (
        <div className="job-body">
          <p className="job-req-label">Requirements (extremely serious, please read carefully)</p>
          <ul className="job-req-list">
            {job.requirements.map((r, i) => (
              <li key={i} className="job-req-item">
                <span className="req-dot">→</span>
                {r}
              </li>
            ))}
          </ul>
          <div className="job-bonus">
            <span className="bonus-label">✨ Hiring Manager Note:</span> {job.bonus}
          </div>
          <button className="apply-btn" onClick={() => alert("lol nice try 😭 we literally have 0 budget and 0 employees. but we respect the hustle!")}>
            Apply Now
          </button>
        </div>
      )}
    </div>
  );
}

export default function CareersPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        :root {
          --navy: #2F4156;
          --teal: #5D7C8D;
          --sky: #C8D9E6;
          --beige: #F5EFEB;
          --white: #FFFFFF;
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: var(--font-body);
          background: var(--beige);
          color: var(--navy);
          overflow-x: hidden;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(93,124,141,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(93,124,141,0); }
        }

        /* ── PAGE LAYOUT ── */
        .careers-page {
          min-height: 100vh;
          background: var(--beige);
          position: relative;
          overflow-x: hidden;
        }

        /* dot grid */
        .careers-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(rgba(47,65,86,0.1) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── HERO ── */
        .careers-hero {
          position: relative;
          z-index: 1;
          padding: 100px 48px 80px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--navy);
          color: var(--sky);
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 7px 18px;
          border-radius: 100px;
          margin-bottom: 40px;
          animation: fadeUp 0.5s ease both 0.1s;
          opacity: 0;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
          animation: blink 1.5s infinite;
        }

        .careers-headline {
          font-family: var(--font-display);
          font-size: clamp(3.2rem, 6vw, 5.8rem);
          font-weight: 800;
          line-height: 1.0;
          color: var(--navy);
          letter-spacing: -2.5px;
          margin-bottom: 24px;
          animation: fadeUp 0.6s ease both 0.2s;
          opacity: 0;
        }

        .careers-headline .accent {
          color: var(--teal);
          font-style: italic;
        }

        .careers-sub {
          font-size: 1.1rem;
          font-weight: 300;
          color: var(--teal);
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto 48px;
          animation: fadeUp 0.6s ease both 0.3s;
          opacity: 0;
        }

        .hero-emoji-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 2.6rem;
          margin-bottom: 0;
          animation: fadeUp 0.6s ease both 0.4s;
          opacity: 0;
        }

        .floating-emoji {
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }
        .floating-emoji:nth-child(2) { animation-delay: 0.5s; animation-direction: alternate-reverse; }
        .floating-emoji:nth-child(3) { animation-delay: 1s; }
        .floating-emoji:nth-child(4) { animation-delay: 1.5s; animation-direction: alternate-reverse; }
        .floating-emoji:nth-child(5) { animation-delay: 0.25s; }

        /* ── DIVIDER ── */
        .section-divider {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(47,65,86,0.15);
        }

        .divider-label {
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--teal);
          white-space: nowrap;
        }

        /* ── JOBS SECTION ── */
        .jobs-section {
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 48px 0;
          position: relative;
          z-index: 1;
        }

        .jobs-intro {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeUp 0.6s ease both 0.15s;
          opacity: 0;
        }

        .jobs-intro-text {
          font-size: 0.9rem;
          color: var(--teal);
          font-weight: 400;
          font-style: italic;
        }

        /* ── JOB CARD ── */
        .job-card {
          background: var(--white);
          border: 1.5px solid rgba(47,65,86,0.12);
          border-radius: 20px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.25s ease;
          animation: fadeUp 0.55s ease both;
          opacity: 0;
        }

        .job-card:hover {
          border-color: var(--teal);
          box-shadow: 0 12px 36px rgba(47,65,86,0.12);
          transform: translateY(-2px);
        }

        .job-card-header {
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          gap: 16px;
        }

        .job-left {
          display: flex;
          align-items: center;
          gap: 18px;
          flex: 1;
          min-width: 0;
        }

        .job-emoji {
          font-size: 2.2rem;
          flex-shrink: 0;
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .job-card:hover .job-emoji {
          animation: wiggle 0.4s ease;
        }

        .job-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }

        .job-meta-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .job-tag {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(47,65,86,0.07);
          color: var(--teal);
          border: 1px solid rgba(47,65,86,0.1);
        }

        .job-tag.dept {
          background: rgba(93,124,141,0.1);
          color: var(--navy);
        }

        .job-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .job-salary {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--navy);
          text-align: right;
          max-width: 160px;
          line-height: 1.3;
          display: none;
        }

        @media (min-width: 640px) {
          .job-salary { display: block; }
        }

        .job-toggle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(47,65,86,0.06);
          border: 1.5px solid rgba(47,65,86,0.1);
          color: var(--teal);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .job-toggle:hover {
          background: var(--navy);
          color: var(--white);
        }

        /* ── JOB BODY ── */
        .job-body {
          padding: 0 28px 28px;
          border-top: 1px solid rgba(47,65,86,0.08);
          margin-top: 0;
          padding-top: 24px;
        }

        .job-req-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 16px;
        }

        .job-req-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .job-req-item {
          font-size: 0.88rem;
          font-weight: 300;
          color: var(--navy);
          line-height: 1.55;
          display: flex;
          gap: 10px;
        }

        .req-dot {
          color: var(--teal);
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .job-bonus {
          background: rgba(200,217,230,0.25);
          border: 1.5px dashed rgba(93,124,141,0.3);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 0.85rem;
          color: var(--navy);
          line-height: 1.55;
          font-weight: 300;
          margin-bottom: 20px;
        }

        .bonus-label {
          font-weight: 600;
          color: var(--teal);
          margin-right: 4px;
        }

        .apply-btn {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 12px 28px;
          background: var(--navy);
          color: var(--white);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.2px;
        }

        .apply-btn:hover {
          background: var(--teal);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(47,65,86,0.22);
        }

        /* ── BOTTOM PANEL ── */
        .bottom-panel {
          background: var(--navy);
          position: relative;
          z-index: 1;
          margin-top: 72px;
          padding: 80px 48px;
          text-align: center;
          overflow: hidden;
        }

        .bottom-panel::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(93,124,141,0.3) 0%, transparent 65%);
          top: -250px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .bottom-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(200,217,230,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        .bottom-big-emoji {
          font-size: 5rem;
          display: block;
          margin: 0 auto 28px;
          filter: drop-shadow(0 0 32px rgba(200,217,230,0.4));
          position: relative;
          z-index: 2;
          animation: float 4s ease-in-out infinite;
        }

        .bottom-headline {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 800;
          color: var(--white);
          letter-spacing: -1.5px;
          margin-bottom: 16px;
          position: relative;
          z-index: 2;
        }

        .bottom-headline .sky { color: var(--sky); }

        .bottom-sub {
          font-size: 1rem;
          font-weight: 300;
          color: rgba(200,217,230,0.7);
          max-width: 480px;
          margin: 0 auto 36px;
          line-height: 1.7;
          position: relative;
          z-index: 2;
        }

        .bottom-cta-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          position: relative;
          z-index: 2;
        }

        .btn-ghost {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 13px 28px;
          background: transparent;
          color: var(--sky);
          border: 1.5px solid rgba(200,217,230,0.3);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.2px;
        }

        .btn-ghost:hover {
          background: rgba(200,217,230,0.1);
          border-color: var(--sky);
        }

        .btn-light {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 13px 28px;
          background: var(--sky);
          color: var(--navy);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.2px;
        }

        .btn-light:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.25);
        }

        /* ── STATS ROW ── */
        .stats-row {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 48px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 56px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.6s ease both 0.5s;
          opacity: 0;
        }

        .stat-card {
          background: var(--white);
          border: 1.5px solid rgba(47,65,86,0.1);
          border-radius: 18px;
          padding: 28px 24px;
          text-align: center;
          transition: all 0.25s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          border-color: var(--teal);
          box-shadow: 0 10px 30px rgba(47,65,86,0.1);
        }

        .stat-emoji { font-size: 2rem; display: block; margin-bottom: 12px; }

        .stat-num {
          font-family: var(--font-display);
          font-size: 2.4rem;
          font-weight: 800;
          color: var(--navy);
          letter-spacing: -1.5px;
          display: block;
        }

        .stat-label {
          font-size: 0.78rem;
          color: var(--teal);
          font-weight: 400;
          margin-top: 4px;
          line-height: 1.4;
        }

        @media (max-width: 700px) {
          .careers-hero { padding: 80px 24px 60px; }
          .jobs-section { padding: 40px 20px 0; }
          .job-card-header { padding: 20px; }
          .job-body { padding: 0 20px 20px; padding-top: 20px; }
          .stats-row { grid-template-columns: 1fr; padding: 0 20px; }
          .section-divider { padding: 0 20px; }
          .bottom-panel { padding: 60px 24px; }
          .hero-emoji-row { font-size: 2rem; gap: 10px; }
        }
      `}</style>

      <div className="careers-page">

        {/* ── HERO ── */}
        <div className="careers-hero">
          <div className="hero-status-badge">
            <span className="status-dot"></span>
            Hiring Status: Off. Very Off.
          </div>

          <h1 className="careers-headline">
            We're <span className="accent">not hiring.</span><br />
            But here we are.
          </h1>

          <p className="careers-sub">
            We're a PC part picker site built by one person, fueled by chai, and funded by
            absolutely nobody. But hey — every tech company needs a careers page, right? So
            here's ours. Please enjoy it ironically. 🥹
          </p>

          <div className="hero-emoji-row">
            <span className="floating-emoji">💻</span>
            <span className="floating-emoji">🖥️</span>
            <span className="floating-emoji">😭</span>
            <span className="floating-emoji">🔧</span>
            <span className="floating-emoji">💸</span>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-emoji">👤</span>
            <span className="stat-num">1</span>
            <p className="stat-label">Total employees<br />(just vibes, really)</p>
          </div>
          <div className="stat-card">
            <span className="stat-emoji">💰</span>
            <span className="stat-num">₹0</span>
            <p className="stat-label">Hiring budget<br />(and that's generous)</p>
          </div>
          <div className="stat-card">
            <span className="stat-emoji">🏢</span>
            <span className="stat-num">∞</span>
            <p className="stat-label">Imaginary office<br />locations worldwide</p>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="section-divider" style={{ marginTop: "64px", marginBottom: "0" }}>
          <div className="divider-line"></div>
          <span className="divider-label">Open Positions (they are not open)</span>
          <div className="divider-line"></div>
        </div>

        {/* ── JOBS ── */}
        <div className="jobs-section">
          <div className="jobs-intro">
            <p className="jobs-intro-text">
              All positions are completely imaginary. Salary ranges are a social construct. Apply at your own comedic risk.
            </p>
          </div>

          {jobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>

        {/* ── BOTTOM PANEL ── */}
        <div className="bottom-panel">
          <span className="bottom-big-emoji">😭</span>
          <h2 className="bottom-headline">
            Not hiring. <span className="sky">For real.</span>
          </h2>
          <p className="bottom-sub">
            But honestly, if you've read this far, you're already overqualified. We appreciate
            your time, your enthusiasm, and your ability to scroll. Truly remarkable.
          </p>
          <div className="bottom-cta-row">
            <button className="btn-ghost" onClick={() => window.history.back()}>
              ← Go Back (wisely)
            </button>
            <button className="btn-light" onClick={() => alert("a PC build?? now THAT we can do! 🔥")}>
              Build a PC Instead 🔧
            </button>
          </div>
        </div>

      </div>
    </>
  );
}