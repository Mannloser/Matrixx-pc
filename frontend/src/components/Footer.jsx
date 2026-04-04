import { Link } from "react-router-dom";
import "./css/footer.css";

const Footer = () => {
  return (
    <>
      {/* ── CTA BAND ── */}
      {/* <section className="cta-band">
        <div className="cta-band-left">
          <div className="cta-band-title">Ready to build something legendary?</div>
          <div className="cta-band-sub">
            Start for free. No account needed. Just pick your parts.
          </div>
        </div>
        <div className="cta-band-right">
          <Link to="/builder" className="btn-cta-white">
            Start Building Now
          </Link>
        </div>
      </section> */}

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-grid">

          {/* Brand column */}
          <div>
            <Link to="/" className="footer-brand-logo">
              Matri<span>xx</span>
            </Link>
            <p className="footer-brand-desc">
              The smartest way to build your PC. Real-time compatibility checks,
              price comparisons across 30+ retailers, and a community of builders.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Twitter/X">𝕏</a>
              <a href="#" className="social-btn" aria-label="Discord">💬</a>
              <a href="#" className="social-btn" aria-label="Reddit">🔴</a>
              <a href="#" className="social-btn" aria-label="YouTube">▶</a>
            </div>
          </div>

          {/* Build column */}
          <div>
            <div className="footer-col-title">Build</div>
            <ul className="footer-links">
              <li><Link to="/builder">PC Builder</Link></li>
              <li><Link to="/prebuilds">Pre-built Systems</Link></li>
              <li><Link to="/builds/community">Community Builds</Link></li>
              <li><Link to="/guides">Build Guides</Link></li>
              <li><Link to="/compatibility">Compatibility Checker</Link></li>
            </ul>
          </div>

          {/* Products column */}
          <div>
            <div className="footer-col-title">Products</div>
            <ul className="footer-links">
              <li><Link to="/products/cpu">CPUs</Link></li>
              <li><Link to="/products/gpu">GPUs</Link></li>
              <li><Link to="/products/motherboard">Motherboards</Link></li>
              <li><Link to="/products/ram">RAM</Link></li>
              <li><Link to="/products/storage">Storage</Link></li>
              <li><Link to="/products/psu">Power Supplies</Link></li>
              <li><Link to="/products/cooling">Cooling</Link></li>
              <li><Link to="/products/case">Cases</Link></li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} <span className="footer-brand-name">Matrixx</span>. All rights reserved.
          </span>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
