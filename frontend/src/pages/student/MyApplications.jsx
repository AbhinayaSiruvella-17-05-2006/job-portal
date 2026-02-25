import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

function MyApplications() {
  const { email } = useParams();
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOfferId, setOpenOfferId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `https://job-portal-xwkz.onrender.com/api/applications/${email}`
        );
        setApps(res.data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchApplications();
  }, [email]);

  const acceptOffer = async (id) => {
    try {
      await axios.post(`https://job-portal-xwkz.onrender.com/api/student/respond/${id}`, {
        decision: "accept",
      });
      alert("Offer accepted successfully");
      window.location.reload();
    } catch (err) {
      alert("Failed to accept offer");
    }
  };

  const rejectOffer = async (id) => {
    try {
      await axios.post(`https://job-portal-xwkz.onrender.com/api/student/respond/${id}`, {
        decision: "reject",
      });
      alert("Offer rejected");
      window.location.reload();
    } catch (err) {
      alert("Failed to reject offer");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.topNav}>
        <div style={styles.headerInfo}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>My Applications</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Track your status</p>
        </div>
        {/* FIXED: Dashboard button now includes the email param to prevent blank screen */}
        <button 
          style={styles.backBtn} 
          onClick={() => navigate(`/student/dashboard/${email}`)}
        >
          Dashboard
        </button>
      </header>

      <main style={styles.contentArea}>
        {loading && <p style={{textAlign: 'center'}}>Loading applications...</p>}
        {!loading && apps.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px'}}>
             <p style={{color: '#888'}}>No applications found.</p>
             <button 
               style={{...styles.greenBtn, marginTop: '10px'}} 
               onClick={() => navigate(`/student/jobs/${email}`)}
             >
               Find Jobs
             </button>
          </div>
        )}

        {!loading && apps.map((app) => (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.card}
          >
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.jobTitle}>{app.jobId?.title || app.jobTitle || "Job Position"}</h3>
                <p style={styles.companyName}>@ {app.jobId?.company || app.company || "Company"}</p>
              </div>
              <div style={{
                ...styles.statusBadge,
                backgroundColor: app.status === "accepted" || app.status === "offer_accepted" ? "#E8F5F0" : app.status === "rejected" ? "#FEE2E2" : "#FFFBEB",
                color: app.status === "accepted" || app.status === "offer_accepted" ? "#2BB673" : app.status === "rejected" ? "#EF4444" : "#F59E0B"
              }}>
                {app.status?.toUpperCase() || "PENDING"}
              </div>
            </div>

            {/* Offer Actions */}
            {(app.status === "accepted" || app.status === "offer_sent") && (
              <div style={styles.offerSection}>
                <p style={{fontSize: '14px', color: '#065F46', fontWeight: 'bold'}}>🎉 Congratulations! You have an offer.</p>
                <div style={styles.buttonGroup}>
                  {app.offerLetter && (
                    <button
                      onClick={() => {
                        const newTab = window.open("", "_blank");
                        newTab.document.write(`<html><body style="font-family: Arial; padding: 40px;"><h2>Offer Letter</h2><hr/><p>${app.offerLetter}</p></body></html>`);
                        newTab.document.close();
                      }}
                      style={styles.blueBtn}
                    >View Letter</button>
                  )}
                  {app.offerPdf && (
                    <a href={`https://job-portal-xwkz.onrender.com/${app.offerPdf}`} target="_blank" rel="noopener noreferrer">
                      <button style={styles.blueBtn}>Download PDF</button>
                    </a>
                  )}
                  <button onClick={() => acceptOffer(app._id)} style={styles.greenBtn}>Accept</button>
                  <button onClick={() => rejectOffer(app._id)} style={styles.redBtn}>Reject</button>
                </div>
              </div>
            )}

            {/* Rejection Message */}
            {app.status === "rejected" && app.rejectionMessage && (
              <div style={{ marginTop: "15px" }}>
                <button
                  onClick={() => setOpenOfferId(openOfferId === app._id ? null : app._id)}
                  style={styles.outlineBtn}
                >
                  {openOfferId === app._id ? "Hide Feedback" : "View Rejection Message"}
                </button>
                {openOfferId === app._id && (
                  <div style={styles.rejectionBox}>{app.rejectionMessage}</div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#F0F4F4", minHeight: "100vh", fontFamily: 'sans-serif' },
  topNav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", backgroundColor: "#fff", borderBottom: "1px solid #eee" },
  headerInfo: { display: 'flex', flexDirection: 'column' },
  backBtn: { backgroundColor: "#2BB673", color: "white", border: "none", padding: "10px 25px", borderRadius: "20px", cursor: "pointer", fontWeight: '600' },
  contentArea: { padding: "40px 60px", maxWidth: '900px', margin: '0 auto' },
  card: { backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", marginBottom: "20px" },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  jobTitle: { fontSize: "18px", fontWeight: "700", color: "#333", margin: 0 },
  companyName: { fontSize: "14px", color: "#666", margin: "5px 0 0 0" },
  statusBadge: { padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "800" },
  offerSection: { marginTop: '20px', padding: '15px', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #DCFCE7' },
  buttonGroup: { display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' },
  greenBtn: { backgroundColor: "#2BB673", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: '600' },
  blueBtn: { backgroundColor: "#3B82F6", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: '600' },
  redBtn: { backgroundColor: "#EF4444", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: '600' },
  outlineBtn: { backgroundColor: "transparent", color: "#EF4444", border: "1px solid #EF4444", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: '600' },
  rejectionBox: { marginTop: "10px", padding: "15px", backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: "8px", color: "#991B1B", fontSize: "14px" }
};

export default MyApplications;