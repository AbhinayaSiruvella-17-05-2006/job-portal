import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function JobApplications() {
  const { jobId } = useParams();
  const { user } = useContext(AuthContext);

  const [apps, setApps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [message, setMessage] = useState("");
  const [actionType, setActionType] = useState(""); // "accept" or "reject"
  const [selectedFile, setSelectedFile] = useState(null);

  /* ================= FETCH APPLICATIONS ================= */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/recruiter/applications/${jobId}`)
      .then((res) => setApps(res.data))
      .catch(() => alert("Failed to load applications"));
  }, [jobId]);

  /* ================= MODAL HANDLERS ================= */
  const openModal = (app, type) => {
    setSelectedApp(app);
    setActionType(type);
    setMessage("");
    setSelectedFile(null);
    setShowModal(true);
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      const endpoint =
        actionType === "accept"
          ? `/api/recruiter/application/${selectedApp._id}/send-offer`
          : `/api/recruiter/application/${selectedApp._id}/send-rejection`;

      if (actionType === "accept") {
        const formData = new FormData();
        formData.append("message", message);
        if (selectedFile) formData.append("offerPdf", selectedFile);

        await axios.post(`http://localhost:5000${endpoint}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`http://localhost:5000${endpoint}`, { message });
      }

      alert(actionType === "accept" ? "Offer letter sent!" : "Rejection sent!");

      setApps(
        apps.map((app) =>
          app._id === selectedApp._id
            ? { ...app, status: actionType === "accept" ? "accepted" : "rejected" }
            : app
        )
      );

      setShowModal(false);
    } catch (err) {
      alert("Failed to send message");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h2 style={styles.pageTitle}>Job Applications</h2>
        <p style={styles.subtitle}>Review and manage candidates for this position</p>
      </div>

      {apps.length === 0 ? (
        <div style={styles.emptyState}>No applications received yet.</div>
      ) : (
        <div style={styles.listGrid}>
          {apps.map((app) => (
            <div key={app._id} style={{
              ...styles.appCard,
              borderLeftColor: app.status === "accepted" ? "#00b894" : app.status === "rejected" ? "#ff7675" : "#dfe6e9"
            }}>
              <div style={styles.cardInfo}>
                <h3 style={styles.studentName}>{app.studentName}</h3>
                <p style={styles.studentEmail}>{app.studentEmail}</p>
                
                <div style={styles.badgeRow}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: app.status === "accepted" ? "#e6fffb" : app.status === "rejected" ? "#fff1f0" : "#f5f5f5",
                    color: app.status === "accepted" ? "#00b894" : app.status === "rejected" ? "#ff7675" : "#636e72",
                  }}>
                    {app.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={styles.actionRow}>
                <button 
                  onClick={() => window.open(`http://localhost:5000/api/recruiter/application/${app._id}/pdf`)}
                  style={styles.detailsBtn}
                >
                  View Application
                </button>

                {app.status === "pending" && (
                  <div style={styles.decisionGroup}>
                    <button onClick={() => openModal(app, "accept")} style={styles.acceptBtn}>Accept</button>
                    <button onClick={() => openModal(app, "reject")} style={styles.rejectBtn}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= STYLED MODAL ================= */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>
              {actionType === "accept" ? "🎉 Finalize Selection" : "Record Rejection"}
            </h3>
            <p style={styles.modalSubtitle}>Sending update to: <b>{selectedApp?.studentEmail}</b></p>

            <textarea
              placeholder={actionType === "accept" ? "Congratulate the student..." : "Provide brief feedback..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.textarea}
            />

            {actionType === "accept" && (
              <div style={styles.fileUploadBox}>
                <p style={styles.uploadLabel}>Upload Offer Letter (PDF)</p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
            )}

            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={sendMessage}
                style={{
                  ...styles.submitBtn,
                  backgroundColor: actionType === "accept" ? "#00b894" : "#ff7675"
                }}
              >
                Send {actionType === "accept" ? "Offer" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#f4f7f6", minHeight: "100vh", padding: "40px 10%" },
  headerSection: { marginBottom: "30px" },
  pageTitle: { fontSize: "28px", fontWeight: "700", color: "#2d3436", margin: 0 },
  subtitle: { color: "#636e72", marginTop: "5px" },
  listGrid: { display: "flex", flexDirection: "column", gap: "15px" },
  appCard: { 
    backgroundColor: "#fff", 
    padding: "20px", 
    borderRadius: "12px", 
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: "6px solid #dfe6e9",
    transition: "transform 0.2s ease"
  },
  studentName: { fontSize: "18px", fontWeight: "600", color: "#2d3436", marginBottom: "4px" },
  studentEmail: { fontSize: "14px", color: "#636e72", marginBottom: "10px" },
  statusBadge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
  actionRow: { display: "flex", gap: "12px", alignItems: "center" },
  detailsBtn: { padding: "10px 18px", borderRadius: "8px", border: "1px solid #dfe6e9", backgroundColor: "#fff", cursor: "pointer", fontWeight: "600", color: "#2d3436" },
  decisionGroup: { display: "flex", gap: "8px" },
  acceptBtn: { backgroundColor: "#00b894", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  rejectBtn: { backgroundColor: "#fff1f0", color: "#ff7675", border: "1px solid #ff7675", padding: "10px 18px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  emptyState: { textAlign: "center", padding: "50px", color: "#b2bec3", fontSize: "18px" },
  
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(45, 52, 54, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalContent: { backgroundColor: "#fff", padding: "30px", borderRadius: "16px", width: "100%", maxWidth: "550px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" },
  modalTitle: { fontSize: "22px", color: "#2d3436", marginBottom: "10px" },
  modalSubtitle: { fontSize: "14px", color: "#636e72", marginBottom: "20px" },
  textarea: { width: "100%", height: "150px", padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", marginBottom: "20px", fontSize: "14px", outline: "none" },
  fileUploadBox: { padding: "15px", border: "2px dashed #dfe6e9", borderRadius: "8px", marginBottom: "20px" },
  uploadLabel: { fontSize: "13px", fontWeight: "600", color: "#2d3436", marginBottom: "8px" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "12px" },
  cancelBtn: { padding: "10px 20px", border: "none", background: "none", cursor: "pointer", color: "#636e72", fontWeight: "600" },
  submitBtn: { padding: "10px 25px", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "600" }
};

export default JobApplications;