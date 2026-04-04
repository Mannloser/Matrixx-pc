import { useEffect } from "react";

export default function SessionExpiredModal({ open }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleLogin = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <style>{`
        @keyframes se-fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes se-slideUp { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .se-btn:hover  { background: #dc2626 !important; }
        .se-btn:active { transform: scale(0.97); }
      `}</style>

      {/* Backdrop */}
      <div style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        zIndex:         99999,
        animation:      "se-fadeIn 0.2s ease",
      }}>

        {/* Card */}
        <div style={{
          background:   "#0f0f0f",
          border:       "1px solid #2a2a2a",
          borderRadius: "18px",
          padding:      "44px 40px",
          maxWidth:     "420px",
          width:        "90%",
          textAlign:    "center",
          boxShadow:    "0 32px 80px rgba(0,0,0,0.7)",
          animation:    "se-slideUp 0.25s ease",
        }}>

          {/* Icon circle */}
          <div style={{
            width:          "68px",
            height:         "68px",
            borderRadius:   "50%",
            background:     "rgba(239,68,68,0.12)",
            border:         "1.5px solid rgba(239,68,68,0.35)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            margin:         "0 auto 22px",
            fontSize:       "30px",
          }}>⏰</div>

          {/* Title */}
          <h2 style={{
            color:         "#ffffff",
            fontSize:      "22px",
            fontWeight:    "700",
            marginBottom:  "10px",
            letterSpacing: "-0.3px",
            fontFamily:    "inherit",
          }}>
            Session Expired
          </h2>

          {/* Message */}
          <p style={{
            color:        "#888888",
            fontSize:     "14px",
            lineHeight:   "1.65",
            marginBottom: "30px",
            fontFamily:   "inherit",
          }}>
            Sorry, your session has expired.<br />
            Please log in again to continue browsing the site.
          </p>

          {/* Button */}
          <button
            className="se-btn"
            onClick={handleLogin}
            style={{
              width:        "100%",
              padding:      "13px",
              background:   "#ef4444",
              color:        "#ffffff",
              border:       "none",
              borderRadius: "10px",
              fontSize:     "15px",
              fontWeight:   "600",
              cursor:       "pointer",
              transition:   "background 0.18s, transform 0.1s",
              fontFamily:   "inherit",
            }}
          >
            Log In Again
          </button>

        </div>
      </div>
    </>
  );
}
