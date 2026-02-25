import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const { email } = useParams();

  return (
    <div style={styles.container}>
      {/* TOP NAVIGATION BAR */}
      <header style={styles.topNav}>
        <div style={styles.userInfoTop}>
          <div style={styles.profileCircle}>
            <img 
              src="https://via.placeholder.com/40" 
              alt="profile" 
              style={{ borderRadius: "50%" }} 
            />
          </div>
          <div>
            <div style={styles.welcomeText}>Welcome, {email?.split('@')[0] || "Aisha Rahman"}</div>
            <div style={styles.subText}>Student Dashboard</div>
          </div>
        </div>
        
        <nav style={styles.navLinks}>
          <span style={styles.activeNavLink}>Home</span>
          <span style={styles.navLink} onClick={() => navigate("/student/jobs")}>Jobs</span>
          <span style={styles.navLink} onClick={() => navigate("/student/applications")}>Applications</span>
          <span style={styles.navLink} onClick={() => navigate("/student/profile")}>Messages</span>
          <span style={styles.navLink}>Profile</span>
          <button style={styles.searchButton}>Search</button>
        </nav>
      </header>

      <main style={styles.contentArea}>
        {/* TAB SUB-NAV */}
        <div style={styles.tabNav}>
          <span style={styles.activeTab}>Home</span>
          <span style={styles.inactiveTab}>Jobs</span>
          <span style={styles.inactiveTab}>Applications</span>
          <span style={styles.inactiveTab}>Profile</span>
        </div>

        <div style={styles.mainGrid}>
          {/* LEFT COLUMN */}
          <div style={styles.leftCol}>
            {/* APPLICATION STATUS CARD */}
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>Application Status</h2>
              <div style={styles.statusHeader}>
                <div style={styles.statusInfo}><span style={styles.dot}>●</span> Active Applications</div>
                <div style={styles.totalCount}>12 Total</div>
              </div>
              
              {/* Progress Bar */}
              <div style={styles.progressBarBg}>
                <div style={styles.progressBarFill}></div>
              </div>

              {/* Status Metrics */}
              <div style={styles.metricsGrid}>
                <div style={styles.metricItem}>
                  <div style={styles.metricLabel}>Applied</div>
                  <div style={styles.metricValue}>7</div>
                </div>
                <div style={styles.metricItem}>
                  <div style={styles.metricLabel}>Depositing</div>
                  <div style={styles.metricValue}>0</div>
                </div>
                <div style={styles.metricItem}>
                  <div style={styles.metricLabel}>Interviewing</div>
                  <div style={styles.metricValue}>3</div>
                </div>
                <div style={styles.metricItem}>
                  <div style={styles.metricLabel}>Offer</div>
                  <div style={styles.metricValue}>1</div>
                </div>
                <div style={styles.metricItem}>
                  <div style={styles.metricLabel}>Rejected</div>
                  <div style={styles.metricValue}>1</div>
                </div>
              </div>
            </section>

            {/* QUICK LINKS SECTION */}
            <section style={{...styles.card, marginTop: '20px'}}>
              <h2 style={styles.cardTitle}>Quick Links</h2>
              <div style={styles.quickLinksGrid}>
                <div style={styles.quickLinkItem}>
                  <div style={styles.iconCircle}>📄</div>
                  <span>Edit Profile</span>
                </div>
                <div style={styles.quickLinkItem}>
                  <div style={styles.iconCircle}>🏢</div>
                  <span>Saved Companies</span>
                </div>
                <div style={styles.quickLinkItem}>
                  <div style={styles.iconCircle}>📚</div>
                  <span>Career Resources</span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - RECOMMENDED JOBS */}
          <div style={styles.rightCol}>
            <h2 style={styles.cardTitle}>Recommended Jobs</h2>
            
            {[
              { title: "Software Engineering Intern", co: "Google", img: "💻" },
              { title: "UX/UI Design Intern", co: "Apple", img: "🎨" }
            ].map((job, idx) => (
              <div key={idx} style={styles.jobCard}>
                <div style={styles.jobImagePlace}>{job.img}</div>
                <div style={styles.jobInfo}>
                  <div style={styles.jobTitle}>{job.title}</div>
                  <div style={styles.jobCompany}>@ {job.co}</div>
                  <div style={styles.jobMeta}>IBM • Remote • Apply</div>
                </div>
                <div style={styles.jobAction}>⌵</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#F0F4F4",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  topNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 60px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eee",
  },
  userInfoTop: { display: "flex", alignItems: "center", gap: "12px" },
  profileCircle: { width: "40px", height: "40px", backgroundColor: "#ddd", borderRadius: "50%" },
  welcomeText: { fontWeight: "600", fontSize: "15px", color: "#333" },
  subText: { fontSize: "12px", color: "#888" },
  navLinks: { display: "flex", gap: "25px", alignItems: "center" },
  navLink: { fontSize: "14px", color: "#666", cursor: "pointer" },
  activeNavLink: { fontSize: "14px", color: "#333", fontWeight: "600" },
  searchButton: {
    backgroundColor: "#2BB673",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "20px",
    cursor: "pointer",
  },
  contentArea: { padding: "20px 60px" },
  tabNav: { display: "flex", gap: "30px", marginBottom: "25px", borderBottom: "1px solid #ddd" },
  activeTab: { color: "#2BB673", borderBottom: "3px solid #2BB673", paddingBottom: "10px", fontWeight: "600" },
  inactiveTab: { color: "#888", paddingBottom: "10px", cursor: "pointer" },
  mainGrid: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "30px" },
  card: { backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  cardTitle: { fontSize: "18px", fontWeight: "700", color: "#333", marginBottom: "20px" },
  statusHeader: { display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "14px" },
  statusInfo: { color: "#2BB673", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" },
  dot: { fontSize: "10px" },
  totalCount: { fontWeight: "700", color: "#333" },
  progressBarBg: { height: "8px", backgroundColor: "#E8F5F0", borderRadius: "10px", marginBottom: "25px" },
  progressBarFill: { width: "60%", height: "100%", backgroundColor: "#2BB673", borderRadius: "10px" },
  metricsGrid: { display: "flex", justifyContent: "space-between", textAlign: "center" },
  metricLabel: { fontSize: "11px", color: "#888", marginBottom: "8px" },
  metricValue: { fontSize: "16px", fontWeight: "600" },
  quickLinksGrid: { display: "flex", gap: "40px" },
  quickLinkItem: { textAlign: "center", fontSize: "11px", color: "#666" },
  iconCircle: { 
    width: "45px", height: "45px", borderRadius: "50%", border: "1px solid #2BB673", 
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "8px" 
  },
  rightCol: { backgroundColor: "#fff", borderRadius: "12px", padding: "24px" },
  jobCard: { 
    display: "flex", gap: "15px", padding: "15px", border: "1px solid #f0f0f0", 
    borderRadius: "8px", marginBottom: "15px", alignItems: "center" 
  },
  jobImagePlace: { width: "80px", height: "50px", backgroundColor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: "14px", fontWeight: "600", color: "#333" },
  jobCompany: { fontSize: "13px", color: "#666" },
  jobMeta: { fontSize: "11px", color: "#999", marginTop: "4px" },
  jobAction: { color: "#ccc", cursor: "pointer" }
};

export default StudentDashboard;