import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const role = location.state?.role || "student";

  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // Defaulted to dark for the Black/Blue aesthetic

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (mode) => {
    try {
      const url = mode
        ? "https://job-portal-backend.onrender.com/api/login"
        : "https://job-portal-backend.onrender.com/api/signup";

      let payload;
      if (mode) {
        payload = { email: form.email, password: form.password, role: role };
      } else {
        payload = {
          name: role === "student" ? form.name : form.company,
          email: form.email,
          password: form.password,
          role: role,
        };
      }

      const res = await axios.post(url, payload);
      alert(res.data.message);

      login({ email: res.data.email, role: res.data.role });

      if (res.data.role === "student") {
        navigate(`/student/dashboard/${res.data.email}`);
      } else {
        navigate("/recruiter/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // Animation Variants for the Card
  const cardVariants = {
    login: { 
      rotateY: 0, 
      scale: 1,
      transition: { duration: 0.8, type: "spring", stiffness: 100 } 
    },
    signup: { 
      rotateY: 360, 
      scale: [1, 0.8, 1],
      transition: { duration: 0.8, type: "spring", stiffness: 100 } 
    },
  };

  return (
    <motion.div
      animate={{ backgroundColor: darkMode ? "#020617" : "#f8fafc" }}
      style={styles.container}
    >
      {/* ANIMATED BACKGROUND PARTICLES */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            ...styles.particle,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* THEME TOGGLE */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setDarkMode(!darkMode)}
        style={{
          ...styles.toggleBtn,
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          color: "#fff",
        }}
      >
        {darkMode ? "☀️" : "🌙"}
      </motion.button>

      <motion.div
        variants={cardVariants}
        animate={isLogin ? "login" : "signup"}
        style={{
          ...styles.mainCard,
          backgroundColor: darkMode ? "#0a0a0a" : "#ffffff",
          border: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0",
          boxShadow: darkMode 
            ? "0 0 50px -10px rgba(59, 130, 246, 0.3)" 
            : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* LEFT SIDE: BLUE/BLACK GRADIENT PANEL */}
        <div style={styles.leftSide}>
          <div style={styles.gradientOverlay} />
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <h1 style={styles.brandTitle}>Portal<span style={{color: '#3b82f6'}}>.</span>io</h1>
            <p style={styles.brandSub}>
              Future-proof your career with AI-driven matching.
            </p>
          </motion.div>
          
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={styles.visualContainer}
          >
             <div style={styles.cyberRing} />
             <div style={styles.glassInfo}>
                <div style={styles.activeLine} />
                <span style={{fontSize: '12px', letterSpacing: '1px'}}>ENCRYPTED SESSION</span>
             </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div style={styles.rightSide}>
          <div style={styles.formWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 style={{ ...styles.heading, color: darkMode ? "#fff" : "#0f172a" }}>
                  {isLogin ? "Authentication" : "Register"}
                </h2>
                <p style={{ ...styles.subHeading, color: "#64748b" }}>
                  Role: <span style={{color: '#3b82f6', fontWeight: 'bold'}}>{role.toUpperCase()}</span>
                </p>
              </motion.div>
            </AnimatePresence>

            <div style={styles.inputGroup}>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <input
                    type="text"
                    name={role === "student" ? "name" : "company"}
                    placeholder={role === "student" ? "User Full Name" : "Organization Name"}
                    value={role === "student" ? form.name : form.company}
                    onChange={handleChange}
                    style={{ ...styles.input, backgroundColor: darkMode ? "#171717" : "#f8fafc", color: darkMode ? "#fff" : "#000" }}
                  />
                </motion.div>
              )}

              <input
                type="email"
                name="email"
                placeholder="Network ID (Email)"
                value={form.email}
                onChange={handleChange}
                style={{ ...styles.input, backgroundColor: darkMode ? "#171717" : "#f8fafc", color: darkMode ? "#fff" : "#000" }}
              />
              <input
                type="password"
                name="password"
                placeholder="Access Key (Password)"
                value={form.password}
                onChange={handleChange}
                style={{ ...styles.input, backgroundColor: darkMode ? "#171717" : "#f8fafc", color: darkMode ? "#fff" : "#000" }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#2563eb" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => submit(isLogin)}
              style={styles.submitBtn}
            >
              {isLogin ? "INITIALIZE LOGIN" : "CREATE IDENTITY"}
            </motion.button>

            <p style={{ ...styles.toggleText, color: "#64748b" }}>
              {isLogin ? "No identity found? " : "Identity exists? "}
              <motion.span
                whileHover={{ color: "#3b82f6" }}
                onClick={() => setIsLogin(!isLogin)}
                style={styles.toggleLink}
              >
                {isLogin ? "Register Now" : "Login Here"}
              </motion.span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Auth;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Orbitron', sans-serif", // Optional: Add a tech font link in your HTML
    position: "relative",
    overflow: "hidden",
    perspective: "1200px",
  },
  particle: {
    position: "absolute",
    width: "4px",
    height: "4px",
    backgroundColor: "#3b82f6",
    borderRadius: "50%",
    filter: "blur(1px)",
  },
  toggleBtn: {
    position: "absolute",
    top: "30px",
    right: "30px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    zIndex: 100,
  },
  mainCard: {
    display: "flex",
    width: "100%",
    maxWidth: "1000px",
    minHeight: "620px",
    borderRadius: "20px",
    overflow: "hidden",
    zIndex: 5,
    transformStyle: "preserve-3d",
  },
  leftSide: {
    flex: 1,
    background: "#000",
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(circle at top left, rgba(59, 130, 246, 0.4), transparent)",
    zIndex: 1,
  },
  brandTitle: { fontSize: "32px", fontWeight: "800", position: 'relative', zIndex: 2 },
  brandSub: { fontSize: "16px", opacity: 0.6, marginTop: "10px", lineHeight: "1.6" },
  visualContainer: {
    position: "relative",
    height: "200px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cyberRing: {
    width: "140px",
    height: "140px",
    border: "1px dashed #3b82f6",
    borderRadius: "50%",
    position: 'absolute',
    opacity: 0.4
  },
  glassInfo: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    padding: "12px 20px",
    borderRadius: "4px",
    borderLeft: "4px solid #3b82f6",
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  activeLine: { width: "30px", height: "2px", background: "#3b82f6" },
  rightSide: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" },
  formWrapper: { width: "100%", maxWidth: "340px" },
  heading: { fontSize: "28px", fontWeight: "700", marginBottom: "8px", letterSpacing: "1px" },
  subHeading: { fontSize: "13px", marginBottom: "40px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "20px" },
  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #262626",
    fontSize: "14px",
    outline: "none",
    transition: "0.3s",
    boxSizing: "border-box"
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "30px",
    letterSpacing: "2px",
  },
  toggleText: { textAlign: "center", fontSize: "13px", marginTop: "25px" },
  toggleLink: { fontWeight: "700", cursor: "pointer", marginLeft: "5px", textDecoration: "underline" },
};