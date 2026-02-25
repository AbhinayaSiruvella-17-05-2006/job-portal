import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function BrowseJobs() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Your exact backend logic preserved
    if (user?.email) {
      axios
        .get(`https://job-portal-backend.onrender.com/api/jobs/available/${user.email}`)
        .then((res) => setJobs(res.data))
        .catch((err) => console.error(err));
    }
  }, [user?.email]);

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <header style={styles.topNav}>
        <div style={styles.headerTitle}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Available Jobs</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Find your next opportunity</p>
        </div>
        <button style={styles.dashboardBtn} onClick={() => navigate("/student/dashboard")}>
          Dashboard
        </button>
      </header>

      <main style={styles.contentArea}>
        {/* JOB GRID */}
        <div style={styles.jobGrid}>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} style={styles.jobCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.companyIcon}>
                    {job.company?.charAt(0) || "J"}
                  </div>
                  <div>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <p style={styles.companyName}>@ {job.company}</p>
                  </div>
                </div>

                <div style={styles.infoTags}>
                  <span style={styles.tag}>{job.eligibility?.mode || "Remote"}</span>
                  <span style={styles.tag}>{job.eligibility?.paidType || "Internship"}</span>
                </div>

                <div style={styles.locationInfo}>
                  📍 {job.eligibility?.location?.city || "Anywhere"}
                </div>

                <button 
                  style={styles.viewBtn} 
                  onClick={() => navigate(`/student/job/${job._id}`)}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#888' }}>No jobs available at the moment.</p>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#F0F4F4", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" },
  topNav: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "20px 60px", 
    backgroundColor: "#fff", 
    borderBottom: "1px solid #eee" 
  },
  dashboardBtn: { 
    backgroundColor: "#2BB673", 
    color: "white", 
    border: "none", 
    padding: "10px 25px", 
    borderRadius: "20px", 
    cursor: "pointer",
    fontWeight: "600"
  },
  contentArea: { padding: "40px 60px" },
  jobGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
    gap: "25px" 
  },
  jobCard: { 
    backgroundColor: "#fff", 
    borderRadius: "16px", 
    padding: "24px", 
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease'
  },
  cardHeader: { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' },
  companyIcon: { 
    width: '45px', 
    height: '45px', 
    backgroundColor: '#F0FDF4', 
    color: '#2BB673', 
    borderRadius: '10px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: 'bold',
    fontSize: '20px',
    border: '1px solid #DCFCE7'
  },
  jobTitle: { fontSize: '16px', fontWeight: '700', color: '#333', margin: 0 },
  companyName: { fontSize: '13px', color: '#666', margin: 0 },
  infoTags: { display: 'flex', gap: '8px', marginBottom: '15px' },
  tag: { 
    backgroundColor: '#F3F4F6', 
    color: '#4B5563', 
    padding: '4px 10px', 
    borderRadius: '6px', 
    fontSize: '11px',
    fontWeight: '600'
  },
  locationInfo: { fontSize: '13px', color: '#888', marginBottom: '20px' },
  viewBtn: { 
    marginTop: 'auto',
    backgroundColor: "#2BB673", 
    color: "white", 
    border: "none", 
    padding: "12px", 
    borderRadius: "10px", 
    cursor: "pointer",
    fontWeight: '600',
    textAlign: 'center'
  }
};

export default BrowseJobs;