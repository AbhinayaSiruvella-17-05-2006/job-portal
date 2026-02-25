import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function StudentNotifications() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [email]);

  const fetchNotifications = () => {
    axios.get(`https://job-portal-backend.onrender.com/api/notifications/${email}`)
      .then(res => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const markAsRead = (id) => {
    axios.put(`https://job-portal-backend.onrender.com/api/notifications/read/${id}`)
      .then(() => fetchNotifications());
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate(`/student/dashboard/${email}`)} style={styles.backBtn}>← Dashboard</button>
        <h2 style={styles.title}>Notifications</h2>
      </header>

      <main style={styles.list}>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length > 0 ? (
          notifications.map((note) => (
            <div key={note._id} style={{...styles.card, opacity: note.isRead ? 0.6 : 1}}>
              <div style={styles.icon}>{note.type === 'offer' ? '🎉' : '🔔'}</div>
              <div style={styles.textContainer}>
                <p style={styles.message}>{note.message}</p>
                <small style={styles.date}>{new Date(note.createdAt).toLocaleString()}</small>
              </div>
              {!note.isRead && (
                <button onClick={() => markAsRead(note._id)} style={styles.readBtn}>Mark as read</button>
              )}
            </div>
          ))
        ) : (
          <div style={styles.empty}>
            <p>No notifications yet!</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { padding: "40px 60px", backgroundColor: "#F0F4F4", minHeight: "100vh", fontFamily: "sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  backBtn: { background: "none", border: "none", color: "#2BB673", fontWeight: "bold", cursor: "pointer" },
  title: { margin: 0, color: "#333" },
  list: { maxWidth: "700px", margin: "0 auto" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", display: "flex", alignItems: "center", marginBottom: "15px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  icon: { fontSize: "24px", marginRight: "20px" },
  textContainer: { flex: 1 },
  message: { margin: "0 0 5px 0", color: "#444", fontWeight: "500" },
  date: { color: "#888", fontSize: "12px" },
  readBtn: { backgroundColor: "#eee", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "11px" },
  empty: { textAlign: "center", marginTop: "100px", color: "#999" }
};

export default StudentNotifications;