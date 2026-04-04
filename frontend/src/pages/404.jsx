import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

        :root {
          --navy:  #2F4156;
          --teal:  #5D7C8D;
          --sky:   #C8D9E6;
          --beige: #F5EFEB;
          --white: #FFFFFF;
          --font-display: 'Syne', sans-serif;
          --font-body:    'DM Sans', sans-serif;
        }

        .nf-page {
          min-height: 100vh;
          background-color: var(--beige);
          background-image:
            linear-gradient(rgba(47,65,86,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(47,65,86,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          font-family: var(--font-body);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px;
        }

        .nf-inner {
          max-width: 600px; width: 100%;
          text-align: center;
        }

        /* ── BIG 404 ── */
        .nf-number-wrap {
          position: relative; display: inline-block;
          margin-bottom: 8px;
        }
        .nf-number {
          font-family: var(--font-display);
          font-size: clamp(7rem, 20vw, 12rem);
          font-weight: 800; color: var(--navy);
          letter-spacing: -8px; line-height: 1;
          position: relative; z-index: 1;
          user-select: none;
        }
        /* Ghost outline version behind */
        .nf-number-ghost {
          font-family: var(--font-display);
          font-size: clamp(7rem, 20vw, 12rem);
          font-weight: 800; letter-spacing: -8px; line-height: 1;
          position: absolute; inset: 0;
          -webkit-text-stroke: 2px var(--sky);
          color: transparent;
          transform: translate(6px, 6px);
          z-index: 0; user-select: none;
        }

        /* ── ICON CARD ── */
        .nf-icon-card {
          width: 72px; height: 72px; border-radius: 18px;
          background: var(--navy);
          border: 2px solid rgba(200,217,230,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; margin: 0 auto 28px;
          position: relative; overflow: hidden;
        }
        .nf-icon-card::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200,217,230,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,217,230,0.08) 1px, transparent 1px);
          background-size: 16px 16px;
        }
        .nf-icon-card-emoji { position: relative; z-index: 1; }

        .nf-title {
          font-family: var(--font-display);
          font-size: 1.8rem; font-weight: 800;
          color: var(--navy); letter-spacing: -0.5px;
          margin-bottom: 12px;
        }

        .nf-desc {
          font-size: 0.92rem; color: var(--teal);
          line-height: 1.7; margin-bottom: 36px;
          max-width: 420px; margin-left: auto; margin-right: auto;
        }

        /* ── ACTIONS ── */
        .nf-actions {
          display: flex; gap: 10px; justify-content: center;
          flex-wrap: wrap; margin-bottom: 48px;
        }

        .nf-btn-primary {
          font-family: var(--font-body); font-size: 0.875rem; font-weight: 700;
          background: var(--navy); color: var(--white);
          border: none; border-radius: 10px; padding: 13px 24px;
          cursor: pointer; transition: all 0.18s;
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
        }
        .nf-btn-primary:hover {
          background: var(--teal); transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(47,65,86,0.15);
        }

        .nf-btn-ghost {
          font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
          color: var(--navy); background: var(--white);
          border: 1.5px solid var(--sky); border-radius: 10px;
          padding: 12px 22px; cursor: pointer; transition: all 0.16s;
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
        }
        .nf-btn-ghost:hover { border-color: var(--teal); color: var(--teal); }

        /* ── QUICK LINKS ── */
        .nf-links-label {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--teal); margin-bottom: 14px;
        }

        .nf-quick-links {
          display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;
        }
        .nf-quick-link {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.78rem; font-weight: 500; color: var(--navy);
          background: var(--white); border: 1.5px solid var(--sky);
          border-radius: 9px; padding: 8px 14px;
          text-decoration: none; transition: all 0.15s;
        }
        .nf-quick-link:hover {
          border-color: var(--teal); background: var(--white);
          transform: translateY(-2px); box-shadow: 0 4px 12px rgba(47,65,86,0.08);
        }
      `}</style>

      <div className="nf-page">
        <div className="nf-inner">

          {/* Big 404 number */}
          <div className="nf-number-wrap">
            <div className="nf-number-ghost">404</div>
            <div className="nf-number">404</div>
          </div>

          {/* Icon */}
          <div className="nf-icon-card">
            <span className="nf-icon-card-emoji">🔍</span>
          </div>

          <h1 className="nf-title">Page not found</h1>
          <p className="nf-desc">
            Looks like this part isn't in our catalogue. The page you're looking for
            doesn't exist or may have been moved.
          </p>

          {/* Main actions */}
          <div className="nf-actions">
            <Link to="/" className="nf-btn-primary">
              🏠 Back to Home
            </Link>
            <button className="nf-btn-ghost" onClick={() => navigate(-1)}>
              ← Go Back
            </button>
          </div>

          {/* Quick links */}
          <div className="nf-links-label">Or jump to</div>
          <div className="nf-quick-links">
            {[
              ["⚡", "Builder",    "/builder"],
              ["📖", "Guides",     "/guides"],
              ["🖥️", "Pre-builds", "/prebuilds"],
              ["🧠", "CPUs",       "/products/cpu"],
              ["🎮", "GPUs",       "/products/gpu"],
            ].map(([icon, label, to]) => (
              <Link key={to} to={to} className="nf-quick-link">
                <span>{icon}</span> {label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
