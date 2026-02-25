import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function StudentDashboard() {
  const navigate = useNavigate();
  const { email } = useParams();
  
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [stats, setStats] = useState({ applied: 0, offer: 0, rejected: 0 });
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (email) {
      // 1. Fetch User Data (for Profile Pic)
      axios.get(`https://job-portal-xwkz.onrender.com/api/student/profile/${email}`)
        .then(res => setProfilePic(res.data.profilePic))
        .catch(err => console.log("Profile pic error"));

      // 2. Fetch Available Jobs
      axios.get(`https://job-portal-xwkz.onrender.com/api/jobs/available/${email}`)
        .then((res) => setRecommendedJobs(res.data.slice(0, 3)))
        .catch(() => setRecommendedJobs([]));

      // 3. Fetch Job Stats
      axios.get(`https://job-portal-xwkz.onrender.com/api/jobs`)
        .then((res) => setTotalJobsCount(res.data.length));

      axios.get(`https://job-portal-xwkz.onrender.com/api/applications/${email}`)
        .then((res) => {
          const apps = res.data;
          setStats({
            applied: apps.length,
            offer: apps.filter(app => app.status === "accepted" || app.status === "offer_accepted").length,
            rejected: apps.filter(app => app.status === "rejected").length
          });
        });
    }
  }, [email]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("email", email);

    axios.post("https://job-portal-xwkz.onrender.com/api/student/upload-pic", formData)
      .then(res => {
        setProfilePic(res.data.profilePic);
        alert("Profile picture updated!");
      });
  };

  const progressPercentage = totalJobsCount > 0 ? (stats.applied / totalJobsCount) * 100 : 0;

  return (
    <div style={styles.container}>
      <header style={styles.topNav}>
        <div style={styles.userInfoTop}>
          {/* IMAGE UPLOAD CLICKABLE AREA */}
          <div style={styles.profileCircle} onClick={() => document.getElementById("picInput").click()}>
            {profilePic ? (
              <img src={`https://job-portal-xwkz.onrender.com/${profilePic}`} alt="Profile" style={styles.imageStyle} />
            ) : "👤"}
            <input type="file" id="picInput" hidden onChange={handleImageUpload} />
          </div>
          <div>
            <div style={styles.welcomeText}>Welcome, {email?.split('@')[0]}</div>
            <div style={styles.subText}>{email}</div>
          </div>
        </div>
        
        <nav style={styles.navLinks}>
          <span style={styles.activeNavLink}>Home</span>
          <span style={styles.navLink} onClick={() => navigate(`/student/jobs/${email}`)}>Jobs</span>
          <span style={styles.navLink} onClick={() => navigate(`/student/applications/${email}`)}>Applications</span>
          <span style={styles.navLink} onClick={() => navigate(`/student/profile/${email}`, { state: { editMode: false } })}>Profile</span>
          <button style={styles.searchButton} onClick={() => navigate(`/student/jobs/${email}`)}>Search</button>
          <button style={styles.logoutBtn} onClick={() => navigate("/")}>Logout</button>
        </nav>
      </header>

      <main style={styles.contentArea}>
        <div style={styles.mainGrid}>
          <div style={styles.leftCol}>
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>Application Status</h2>
              <div style={styles.statusHeader}>
                <div style={styles.statusInfo}>● Active Progress</div>
                <div style={styles.totalCount}>{stats.applied} / {totalJobsCount} Jobs Applied</div>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${progressPercentage}%` }}></div>
              </div>
              <div style={styles.metricsGrid}>
                <div style={styles.metricItem}><div style={styles.metricLabel}>Applied</div><div style={styles.metricValue}>{stats.applied}</div></div>
                <div style={styles.metricItem}><div style={styles.metricLabel}>Offer</div><div style={styles.metricValue}>{stats.offer}</div></div>
                <div style={styles.metricItem}><div style={styles.metricLabel}>Rejected</div><div style={styles.metricValue}>{stats.rejected}</div></div>
              </div>
            </section>

            <section style={{...styles.card, marginTop: '20px'}}>
              <h2 style={styles.cardTitle}>Quick Links</h2>
              <div style={styles.quickLinksGrid}>
                <div style={styles.quickLinkItem} onClick={() => navigate(`/student/profile/${email}`, { state: { editMode: true } })}>
                  <div style={styles.iconCircle}>📄</div><span>Edit Profile</span>
                </div>
               
                <div style={styles.quickLinkItem} onClick={() => navigate(`/student/messages/${email}`)}>
                  <div style={styles.iconCircle}>💬</div><span>Messages</span>
                </div>
              </div>
            </section>
          </div>

          <div style={styles.rightCol}>
            <h2 style={styles.cardTitle}>Recommended Jobs</h2>
            {recommendedJobs.length > 0 ? (
              recommendedJobs.map((job) => (
                <div key={job._id} style={styles.jobCard} onClick={() => navigate(`/student/job/${job._id}`)}>
                  <div style={styles.jobImagePlace}>💼</div>
                  <div style={styles.jobInfo}>
                    <div style={styles.jobTitle}>{job.title}</div>
                    <div style={styles.jobCompany}>@ {job.company}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.nothingBox}>No new jobs available right now</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#F0F4F4", minHeight: "100vh", fontFamily: "sans-serif" },
  topNav: { display: "flex", justifyContent: "space-between", padding: "15px 60px", backgroundColor: "#fff", alignItems: "center", borderBottom: "1px solid #eee" },
  userInfoTop: { display: "flex", alignItems: "center", gap: "10px" },
  profileCircle: { width: "50px", height: "50px", backgroundColor: "#2BB673", borderRadius: "50%", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", overflow: "hidden" },
  imageStyle: { width: "100%", height: "100%", objectFit: "cover" },
  welcomeText: { fontWeight: "bold", color: "#333" },
  subText: { fontSize: "12px", color: "#888" },
  navLinks: { display: "flex", gap: "15px", alignItems: "center" },
  navLink: { cursor: "pointer", color: "#666", fontSize: "14px" },
  activeNavLink: { color: "#2BB673", fontWeight: "bold" },
  searchButton: { backgroundColor: "#2BB673", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "20px", cursor: "pointer" },
  logoutBtn: { backgroundColor: "#ff4d4d", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" },
  contentArea: { padding: "30px 60px" },
  mainGrid: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "25px" },
  card: { backgroundColor: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  cardTitle: { fontSize: "18px", fontWeight: "bold", marginBottom: "20px" },
  statusHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  statusInfo: { color: "#2BB673", fontWeight: "bold" },
  totalCount: { fontSize: "12px", fontWeight: "bold" },
  progressBarBg: { height: "10px", backgroundColor: "#E8F5F0", borderRadius: "5px", marginBottom: "25px" },
  progressBarFill: { height: "100%", backgroundColor: "#2BB673", borderRadius: "5px", transition: "width 0.5s ease" },
  metricsGrid: { display: "flex", justifyContent: "space-around" },
  metricLabel: { color: "#888", fontSize: "12px" },
  metricValue: { fontWeight: "bold", textAlign: "center" },
  quickLinksGrid: { display: "flex", gap: "40px" },
  quickLinkItem: { textAlign: "center", cursor: "pointer", fontSize: "12px", color: "#555" },
  iconCircle: { width: "50px", height: "50px", border: "1px solid #2BB673", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "8px", fontSize: "20px" },
  rightCol: { backgroundColor: "#fff", padding: "24px", borderRadius: "12px" },
  jobCard: { display: "flex", gap: "12px", padding: "15px", border: "1px solid #f5f5f5", borderRadius: "8px", marginBottom: "12px", cursor: "pointer" },
  jobImagePlace: { width: "40px", height: "40px", backgroundColor: "#F9FAFB", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "4px" },
  jobInfo: { flex: 1 },
  jobTitle: { fontWeight: "bold", fontSize: "14px" },
  jobCompany: { color: "#666", fontSize: "12px" },
  nothingBox: { textAlign: "center", padding: "40px", color: "#999", border: "1px dashed #ddd", borderRadius: "8px" }
};

export default StudentDashboard;