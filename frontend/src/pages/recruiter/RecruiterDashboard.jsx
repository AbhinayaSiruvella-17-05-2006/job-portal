import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const actions = [
    {
      title: "Post Opportunity",
      desc: "Create a new job or internship listing for students.",
      icon: "📝",
      path: "/recruiter/post-job",
      btnText: "Post Job",
    },
    {
      title: "My Listings",
      desc: "Track status and manage your existing job posts.",
      icon: "💼",
      path: "/recruiter/my-jobs",
      btnText: "View Jobs",
    },
    {
      title: "Inbox",
      desc: "Chat with applicants and send offer details.",
      icon: "💬",
      path: `/recruiter/messages/${user?.email}`,
      btnText: "Messages",
    },
  ];

  return (
    <div style={styles.container}>
      {/* --- PROFILE SECTION (Clean Version) --- */}
      <div style={styles.profileCard}>
        <div style={styles.profileLeft}>
          <div style={styles.largeAvatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "R"}
          </div>
          <div style={styles.profileDetails}>
            <h2 style={styles.userName}>{user?.name || "Recruiter Name"}</h2>
            <p style={styles.userEmail}>{user?.email}</p>
            <div style={styles.badgeRow}>
              <span style={styles.roleBadge}>Recruiter Account</span>
              <button 
                onClick={() => navigate("/recruiter/profile")} 
                style={styles.profileLinkBtn}
              >
                View Profile & Settings
              </button>
            </div>
          </div>
        </div>
        {/* Logout button removed for a cleaner look */}
      </div>

      <div style={styles.divider} />

      {/* --- QUICK ACTIONS SECTION --- */}
      <h3 style={styles.sectionTitle}>Management Command Center</h3>
      
      <div style={styles.actionGrid}>
        {actions.map((action, i) => (
          <div key={i} style={styles.actionCard}>
            <div style={styles.iconCircle}>{action.icon}</div>
            <h4 style={styles.actionTitle}>{action.title}</h4>
            <p style={styles.actionDesc}>{action.desc}</p>
            <button 
              onClick={() => navigate(action.path)} 
              style={styles.actionBtn}
            >
              {action.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: { 
    backgroundColor: "#f4f7f6", 
    minHeight: "100vh", 
    padding: "40px 8%" 
  },
  profileCard: { 
    backgroundColor: "#fff", 
    padding: "30px", 
    borderRadius: "24px", 
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)", 
    display: "flex", 
    justifyContent: "flex-start", 
    alignItems: "center",
    marginBottom: "40px",
    border: "1px solid #f1f2f6"
  },
  profileLeft: { display: "flex", alignItems: "center", gap: "25px" },
  largeAvatar: { 
    width: "75px", 
    height: "75px", 
    backgroundColor: "#00b894", 
    color: "#fff", 
    borderRadius: "20px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: "32px", 
    fontWeight: "800" 
  },
  profileDetails: { display: "flex", flexDirection: "column", gap: "5px" },
  userName: { margin: 0, fontSize: "26px", color: "#2d3436", fontWeight: "800" },
  userEmail: { margin: 0, color: "#636e72", fontSize: "15px" },
  badgeRow: { display: "flex", alignItems: "center", gap: "15px", marginTop: "5px" },
  roleBadge: { 
    backgroundColor: "#e6fffb", 
    color: "#00b894", 
    fontSize: "12px", 
    fontWeight: "700", 
    padding: "4px 12px", 
    borderRadius: "20px"
  },
  profileLinkBtn: {
    background: "none",
    border: "none",
    color: "#0984e3",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "underline",
    cursor: "pointer",
    padding: 0
  },
  divider: { height: "1px", backgroundColor: "#dfe6e9", marginBottom: "40px" },
  sectionTitle: { fontSize: "18px", fontWeight: "700", color: "#2d3436", marginBottom: "25px", letterSpacing: "0.5px" },
  actionGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
    gap: "25px" 
  },
  actionCard: { 
    backgroundColor: "#fff", 
    padding: "35px 25px", 
    borderRadius: "22px", 
    boxShadow: "0 4px 15px rgba(0,0,0,0.02)", 
    textAlign: "center", 
    border: "1px solid #f1f2f6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  iconCircle: { 
    width: "60px", 
    height: "60px", 
    backgroundColor: "#f8f9fa", 
    borderRadius: "18px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: "28px", 
    marginBottom: "20px" 
  },
  actionTitle: { fontSize: "20px", fontWeight: "700", color: "#2d3436", margin: "0 0 10px 0" },
  actionDesc: { fontSize: "14px", color: "#636e72", marginBottom: "30px", lineHeight: "1.6", flexGrow: 1 },
  actionBtn: { 
    backgroundColor: "#00b894", 
    color: "#fff", 
    border: "none", 
    padding: "14px", 
    borderRadius: "12px", 
    fontWeight: "700", 
    cursor: "pointer", 
    width: "100%",
    boxShadow: "0 4px 12px rgba(0, 184, 148, 0.2)"
  }
};

export default RecruiterDashboard;