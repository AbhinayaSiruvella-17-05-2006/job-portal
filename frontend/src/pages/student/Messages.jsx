import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function StudentMessages() {
  const { email } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = () => {
    // URL must include http://:5000 to reach your backend
    axios
      .get(`https://job-portal-xwkz.onrender.com/api/messages/${email}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    if (email) fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Auto-refresh
    return () => clearInterval(interval);
  }, [email]);

  const sendMessage = async () => {
    if (!receiverEmail || !newMessage) return alert("Please fill all fields");

    setLoading(true);
    try {
      const payload = {
        senderEmail: email,
        receiverEmail: receiverEmail,
        message: newMessage, // Matches 'message' in your schema
      };

      await axios.post("https://job-portal-xwkz.onrender.com/api/messages/send", payload);
      setNewMessage(""); 
      fetchMessages(); 
    } catch (err) {
      alert("Failed to send message. Is your backend server running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.topNav}>
        <h2>Messages</h2>
        <button style={styles.backBtn} onClick={() => navigate("/student/dashboard")}>Dashboard</button>
      </header>

      <main style={styles.contentArea}>
        <div style={styles.chatGrid}>
          {/* SEND SECTION */}
          <section style={styles.card}>
            <h3>New Message</h3>
            <input style={styles.input} placeholder="Recruiter Email" value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)} />
            <textarea style={styles.textarea} placeholder="Type hello hi..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button style={styles.sendBtn} onClick={sendMessage} disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
          </section>

          {/* CHAT DISPLAY SECTION */}
          <section style={styles.card}>
            <h3>Recent Conversations</h3>
            <div style={styles.messageList}>
              {messages.map((m) => {
                const isMe = m.senderEmail === email;
                return (
                  <div key={m._id} style={{
                    ...styles.messageItem,
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    backgroundColor: isMe ? "#D1FAE5" : "#F3F4F6",
                  }}>
                    <small style={{ fontWeight: "bold" }}>{isMe ? "You" : m.senderEmail}</small>
                    {/* FIXED: Shows the 'message' text instead of just email */}
                    <p style={styles.msgText}>{m.message}</p>
                    <div style={{ fontSize: "10px", color: "#999" }}>{new Date(m.createdAt).toLocaleTimeString()}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#F9FAFB", minHeight: "100vh", padding: "20px" },
  topNav: { display: "flex", justifyContent: "space-between", padding: "10px 40px", backgroundColor: "#fff" },
  backBtn: { backgroundColor: "#10B981", color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", cursor: "pointer" },
  contentArea: { padding: "20px" },
  chatGrid: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "20px" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  input: { width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px", minHeight: "80px", marginBottom: "10px", boxSizing: "border-box" },
  sendBtn: { width: "100%", backgroundColor: "#10B981", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" },
  messageList: { display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" },
  messageItem: { padding: "10px", borderRadius: "8px", maxWidth: "80%" },
  msgText: { fontSize: "14px", margin: "5px 0" }
};

export default StudentMessages;