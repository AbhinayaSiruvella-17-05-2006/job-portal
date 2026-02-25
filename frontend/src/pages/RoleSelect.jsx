import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RoleSelect() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState("dark");
  const isDark = theme === "dark";

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        background: isDark
          ? "linear-gradient(120deg, #020617, #081a3a, #020617)"
          : "linear-gradient(120deg, #f8fafc, #e5e7eb, #f8fafc)",
        backgroundSize: "300% 300%",
        animation: "gradientMove 18s ease infinite",
        color: isDark ? "white" : "#020617",
        overflow: "hidden",
        padding: "40px",
        transition: "0.4s ease",
      }}
    >
      {/* BACKGROUND BLOBS */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <motion.div
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "15%",
            left: "10%",
            width: "380px",
            height: "380px",
            background: "radial-gradient(circle, #6366f1, transparent 70%)",
            opacity: 0.25,
            filter: "blur(90px)",
          }}
        />
        <motion.div
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "15%",
            width: "420px",
            height: "420px",
            background: "radial-gradient(circle, #22d3ee, transparent 70%)",
            opacity: 0.2,
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
            alignItems: "center",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: "28px" }}
          >
            Choose your role
          </motion.h2>

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{
              background: "transparent",
              border: `1px solid ${isDark ? "#64748b" : "#94a3b8"}`,
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              color: "inherit",
              fontSize: "14px",
            }}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* ROLE CARDS */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            maxWidth: "900px",
            margin: "40px auto 0",
          }}
        >
          {/* STUDENT CARD */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
            style={{
              position: "relative",
              background: isDark ? "#020617" : "#ffffff",
              borderRadius: "20px",
              padding: "40px",
              border: `1px solid ${isDark ? "#1e293b" : "#cbd5e1"}`,
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={() => navigate("/auth", { state: { role: "student" } })}

          >
            {/* SPOTLIGHT */}
            <motion.div
              variants={{ hover: { opacity: 1 } }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at top left, rgba(99,102,241,0.25), transparent 60%)",
                pointerEvents: "none",
              }}
            />

            <motion.div
              variants={{ hover: { y: -6 } }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                🎓 Student
              </h2>

              <p
                style={{
                  color: isDark ? "#c7d2fe" : "#475569",
                  marginBottom: "18px",
                }}
              >
                Explore jobs and apply
              </p>

              {/* PROCESS TEXT – HOVER ONLY */}
              <motion.p
                variants={{
                  hover: { opacity: 1, y: 0 },
                }}
                initial={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontSize: "14px",
                  color: "#6366f1",
                }}
              >
                Browse jobs → Apply → Track applications
              </motion.p>
            </motion.div>
          </motion.div>

          {/* RECRUITER CARD */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
            style={{
              position: "relative",
              background: isDark ? "#020617" : "#ffffff",
              borderRadius: "20px",
              padding: "40px",
              border: `1px solid ${isDark ? "#1e293b" : "#cbd5e1"}`,
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={() => navigate("/auth", { state: { role: "recruiter" } })}

          >
            {/* SPOTLIGHT */}
            <motion.div
              variants={{ hover: { opacity: 1 } }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at top right, rgba(168,85,247,0.25), transparent 60%)",
                pointerEvents: "none",
              }}
            />

            <motion.div
              variants={{ hover: { y: -6 } }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                🧑‍💼 Recruiter
              </h2>

              <p
                style={{
                  color: isDark ? "#c7d2fe" : "#475569",
                  marginBottom: "18px",
                }}
              >
                Post jobs and hire
              </p>

              {/* PROCESS TEXT – HOVER ONLY */}
              <motion.p
                variants={{
                  hover: { opacity: 1, y: 0 },
                }}
                initial={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontSize: "14px",
                  color: "#a855f7",
                }}
              >
                Post jobs → Review applicants → Send offers
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* BACKGROUND ANIMATION */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default RoleSelect;
