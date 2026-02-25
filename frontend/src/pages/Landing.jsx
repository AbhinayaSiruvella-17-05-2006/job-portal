import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Landing() {
  const navigate = useNavigate();

  /* THEME */
  const [theme, setTheme] = useState("dark");
  const isDark = theme === "dark";

  /* SENTENCES */
  const sentences = [
    "Opportunities that move with you",
    "Careers built for the future",
    "Where talent meets opportunity",
    "Connecting ambition with growth",
    "Your journey starts here",
  ];

  const [index, setIndex] = useState(0);

  /* CHANGE SENTENCE AFTER EACH ROTATION */
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sentences.length);
    }, 6000); // SAME AS ROTATION DURATION

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(120deg, #020617, #030a2a, #020617)"
          : "linear-gradient(120deg, #ffffff, #e5e7eb, #ffffff)",
        backgroundSize: "200% 200%",
        animation: "bgShift 14s ease infinite",
        color: isDark ? "white" : "#020617",
        padding: "40px 70px",
        overflow: "hidden",
        transition: "0.4s ease",
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "70px",
        }}
      >
        <h3 style={{ letterSpacing: "1px" }}>JOB PORTAL</h3>

        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="nav-btn"
            title="Toggle Theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <button className="nav-btn">Login</button>
          <button className="nav-btn primary">Sign Up</button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          alignItems: "center",
          gap: "50px",
        }}
      >
        {/* LEFT SIDE */}
        {/* LEFT SIDE */}
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  }}
  whileHover="hover"
  style={{
    position: "relative",
    padding: "20px",
    borderRadius: "16px",
    overflow: "hidden",
  }}
>
  {/* REFLECTION LAYER */}
  <motion.div
    variants={{
      hover: { x: "120%" },
    }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    style={{
      position: "absolute",
      top: 0,
      left: "-120%",
      width: "120%",
      height: "100%",
      background:
        "linear-gradient(120deg, transparent, rgba(255,255,255,0.15), transparent)",
      pointerEvents: "none",
    }}
  />

  {/* HEADING */}
  <motion.h1
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.8 }}
    style={{
      fontSize: "54px",
      lineHeight: "1.15",
      marginBottom: "22px",
    }}
  >
    Shape Your Future <br /> With the Right Career
  </motion.h1>

  {/* PARAGRAPH */}
  <motion.p
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.7 }}
    style={{
      color: isDark ? "#c7d2fe" : "#334155",
      maxWidth: "520px",
      marginBottom: "36px",
      lineHeight: "1.6",
    }}
  >
    A next-generation job portal connecting students and recruiters.
    Discover opportunities and build meaningful careers.
  </motion.p>

  {/* BUTTON */}
  <motion.button
    variants={{
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    }}
    transition={{ duration: 0.6 }}
    whileHover={{
      scale: 1.12,
      boxShadow: "0 0 40px rgba(99,102,241,0.9)",
    }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate("/role-select")}
    style={{
      padding: "18px 46px",
      background:
        "linear-gradient(135deg, #6366f1, #a855f7)",
      border: "none",
      borderRadius: "16px",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      position: "relative",
      zIndex: 1,
    }}
  >
    Get Started
  </motion.button>
</motion.div>

        {/* RIGHT SIDE */}
        <div style={{ position: "relative", height: "460px" }}>
          {/* WAVE */}
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "conic-gradient(from 0deg, #6366f1, #22d3ee, #a855f7, #6366f1)",
              filter: "blur(50px)",
              opacity: 0.6,
            }}
          />

          {/* CIRCLE BORDER */}
          <div
            style={{
              position: "absolute",
              inset: "80px",
              borderRadius: "50%",
              border: "2px solid #6366f1",
            }}
          />

          {/* BALL ROTATION (PURE VISUAL) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 6,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{
              position: "absolute",
              inset: "80px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "12px",
                height: "12px",
                background: "#ffffff",
                borderRadius: "50%",
                boxShadow: "0 0 12px rgba(255,255,255,0.8)",
              }}
            />
          </motion.div>

          {/* CENTER TEXT (CHANGES PROPERLY NOW) */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              inset: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "500",
              padding: "40px",
              color: isDark ? "white" : "#020617",
            }}
          >
            {sentences[index]}
          </motion.div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .nav-btn {
          background: transparent;
          border: 1px solid ${isDark ? "#64748b" : "#94a3b8"};
          padding: 7px 18px;
          border-radius: 22px;
          color: inherit;
          cursor: pointer;
        }

        .nav-btn.primary {
          background: ${isDark ? "white" : "#020617"};
          color: ${isDark ? "#020617" : "white"};
          border: none;
        }
      `}</style>
    </div>
  );
}

export default Landing;
