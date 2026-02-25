import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => alert("Failed to load job"));
  }, [id]);

  useEffect(() => {
    if (user?.email && id) {
      axios
        .get(`http://localhost:5000/api/check-application/${id}/${user.email}`)
        .then((res) => {
          if (res.data.applied) {
            setHasApplied(true);
            setApplicationStatus(res.data.status);
          } else {
            setHasApplied(false);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user?.email, id]);

  if (!job) return <div style={styles.loader}>Loading job details...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Link to="/student/jobs" style={styles.backLink}>← Back to Jobs</Link>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.logoPlaceholder}>{job.company?.charAt(0).toUpperCase()}</div>
          <div>
            <h1 style={styles.title}>{job.title}</h1>
            <p style={styles.companyName}>{job.company}</p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div style={styles.section}>
          <h3 style={styles.sectionLabel}>Job Description</h3>
          <p style={styles.descriptionText}>{job.description}</p>
        </div>

        <hr style={styles.hr} />

        {/* ELIGIBILITY DETAILS GRID */}
        <div style={styles.detailsGrid}>
          <div style={styles.detailBox}>
            <span style={styles.label}>SKILLS REQUIRED:</span>
            <span style={styles.value}>
              {job.eligibility?.skills?.length > 0 ? job.eligibility.skills.join(", ") : "Not Specified"}
            </span>
          </div>

          <div style={styles.detailBox}>
            <span style={styles.label}>YEAR OF STUDY:</span>
            <span style={styles.value}>{job.eligibility?.yearOfStudy || "Not Specified"}</span>
          </div>

          <div style={styles.detailBox}>
            <span style={styles.label}>WORK MODE:</span>
            <span style={styles.value}>{job.eligibility?.mode || "Not Specified"}</span>
          </div>

          <div style={styles.detailBox}>
            <span style={styles.label}>STIPEND:</span>
            <span style={styles.value}>
              {/* FIXED LOGIC: Checking for "Stipend" to match your DB */}
              {job.eligibility?.paidType === "Stipend" 
                ? `₹${job.eligibility.stipendAmount}` 
                : "Unpaid / Free"}
            </span>
          </div>

          <div style={styles.detailBox}>
            <span style={styles.label}>DURATION:</span>
            <span style={styles.value}>{job.eligibility?.duration || "Not Specified"}</span>
          </div>

          {/* ADDED: Location details from your database */}
          {job.eligibility?.location?.city && (
            <div style={styles.detailBox}>
              <span style={styles.label}>LOCATION:</span>
              <span style={styles.value}>
                {job.eligibility.location.city}, {job.eligibility.location.state}
              </span>
            </div>
          )}
        </div>

        {/* ASSESSMENT QUESTIONS SECTION */}
       

        {/* APPLY ACTION */}
        <div style={styles.footer}>
          {hasApplied ? (
            <div style={styles.statusBanner}>
              <p style={styles.statusTitle}>✅ Application Submitted</p>
              <p style={styles.statusSub}>Status: <span style={styles.statusBadge}>{applicationStatus}</span></p>
            </div>
          ) : (
            <button style={styles.applyBtn} onClick={() => navigate(`/student/apply/${job._id}`)}>
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#f0f4f4", minHeight: "100vh", padding: "40px 20px", display: "flex", justifyContent: "center" },
  card: { backgroundColor: "#fff", width: "100%", maxWidth: "850px", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
  backLink: { color: "#2bb673", textDecoration: "none", fontWeight: "600", fontSize: "14px", marginBottom: "30px", display: "inline-block" },
  header: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" },
  logoPlaceholder: { width: "60px", height: "60px", backgroundColor: "#e8f5f0", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "24px", color: "#2bb673", fontWeight: "bold" },
  title: { fontSize: "28px", margin: 0, color: "#333", fontWeight: "700" },
  companyName: { fontSize: "16px", color: "#666", margin: "5px 0 0 0" },
  sectionLabel: { fontSize: "18px", color: "#333", marginBottom: "12px", fontWeight: "700" },
  descriptionText: { color: "#555", lineHeight: "1.6", fontSize: "15px" },
  hr: { border: "none", borderTop: "1px solid #eee", margin: "30px 0" },
  detailsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", backgroundColor: "#f9fbfb", padding: "25px", borderRadius: "12px", marginBottom: "30px" },
  detailBox: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "11px", color: "#888", fontWeight: "700", letterSpacing: "0.5px" },
  value: { fontSize: "15px", color: "#333", fontWeight: "500" },
  questionSection: { marginBottom: "30px" },
  infoNote: { fontSize: "13px", color: "#888", marginBottom: "10px", fontStyle: "italic" },
  questionPreview: { backgroundColor: "#fff", border: "1px solid #eee", padding: "14px", borderRadius: "8px", marginBottom: "10px", color: "#444", fontSize: "14px" },
  typeBadge: { fontSize: "11px", color: "#2bb673", marginLeft: "5px", textTransform: "uppercase" },
  footer: { display: "flex", justifyContent: "center", marginTop: "20px" },
  applyBtn: { backgroundColor: "#2bb673", color: "#fff", border: "none", padding: "16px 80px", borderRadius: "30px", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "0.3s" },
  statusBanner: { backgroundColor: "#fffbeb", border: "1px solid #fef3c7", padding: "20px", borderRadius: "12px", textAlign: "center", width: "100%" },
  statusTitle: { margin: 0, color: "#92400e", fontWeight: "700" },
  statusSub: { margin: "5px 0 0 0", color: "#b45309", fontSize: "14px" },
  statusBadge: { fontWeight: "800", textTransform: "uppercase" },
  loader: { textAlign: "center", marginTop: "100px", color: "#666" }
};

export default JobDetails;