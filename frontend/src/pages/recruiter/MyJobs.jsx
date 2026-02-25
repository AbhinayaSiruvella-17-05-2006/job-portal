import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/recruiter/my-jobs/${user.email}`)
      .then((res) => setJobs(res.data))
      .catch(() => alert("Failed to load jobs"));
  }, [user.email]);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.pageTitle}>My Posted Jobs</h2>
          <p style={styles.subtitle}>Manage your active listings and track applicants</p>
        </div>
        <button 
          style={styles.postBtn}
          onClick={() => navigate("/recruiter/post-job")}
        >
          + Post New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>You haven't posted any jobs yet.</p>
        </div>
      ) : (
        <div style={styles.jobGrid}>
          {jobs.map((job) => (
            <div key={job._id} style={styles.jobCard}>
              <div style={styles.cardTop}>
                <div style={styles.companyBadge}>
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={styles.jobTitleText}>{job.title}</h3>
                  <p style={styles.companyText}>{job.company}</p>
                </div>
              </div>

              <div style={styles.statsContainer}>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Status</span>
                  <span style={styles.activeStatus}>Active</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Posted On</span>
                  <span style={styles.statValue}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <button
                  style={styles.viewAppsBtn}
                  onClick={() => navigate(`/recruiter/applications/${job._id}`)}
                >
                  View Applications
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#f4f7f6", minHeight: "100vh", padding: "40px 8%" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" },
  pageTitle: { fontSize: "28px", fontWeight: "700", color: "#2d3436", margin: 0 },
  subtitle: { color: "#636e72", marginTop: "5px", fontSize: "14px" },
  postBtn: { backgroundColor: "#00b894", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
  jobGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" },
  jobCard: { backgroundColor: "#fff", padding: "25px", borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.04)", border: "1px solid #f1f2f6" },
  cardTop: { display: "flex", gap: "15px", alignItems: "center", marginBottom: "20px" },
  companyBadge: { width: "45px", height: "45px", backgroundColor: "#e6fffb", color: "#00b894", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", fontWeight: "700" },
  jobTitleText: { margin: 0, fontSize: "18px", color: "#2d3436" },
  companyText: { margin: 0, fontSize: "14px", color: "#636e72" },
  statsContainer: { display: "flex", gap: "20px", padding: "15px 0", borderTop: "1px solid #f1f2f6", borderBottom: "1px solid #f1f2f6", marginBottom: "20px" },
  statBox: { display: "flex", flexDirection: "column", gap: "4px" },
  statLabel: { fontSize: "11px", color: "#b2bec3", fontWeight: "700", textTransform: "uppercase" },
  statValue: { fontSize: "13px", color: "#2d3436" },
  activeStatus: { fontSize: "12px", color: "#00b894", fontWeight: "700", backgroundColor: "#e6fffb", padding: "2px 8px", borderRadius: "4px" },
  cardFooter: { display: "flex" },
  viewAppsBtn: { flex: 1, backgroundColor: "#2d3436", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  emptyContainer: { textAlign: "center", marginTop: "50px", color: "#636e72" }
};

export default MyJobs;