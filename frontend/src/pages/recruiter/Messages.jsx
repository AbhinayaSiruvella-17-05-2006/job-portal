import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function RecruiterMessages() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
  if (!user || !user.email) return;

  fetchMessages();
  const interval = setInterval(fetchMessages, 5000);

  return () => clearInterval(interval);
}, [user]);

  const fetchMessages = async () => {
  console.log("USER:", user);

  if (!user || !user.email) {
    console.log("User not ready yet");
    return;
  }

  try {
    const res = await axios.get(
      `https://job-portal-backend.onrender.com/api/messages/${user.email}`
    );
    console.log("MESSAGES RESPONSE:", res.data);
    setMessages(res.data);
  } catch (err) {
    console.error("Failed to fetch messages", err.response || err);
  }
};

  const sendMessage = async () => {
    if (!receiverEmail.trim() || !text.trim()) {
      alert("Please fill in both the student email and the message.");
      return;
    }

    try {
      await axios.post("https://job-portal-backend.onrender.com/api/messages/send", {
  senderEmail: user.email,
  receiverEmail,
  message: text,   // also fix this
});

      setText("");
      fetchMessages();
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Message Center</h2>
        <p style={styles.subtitle}>Communicate directly with your applicants</p>
      </div>

      <div style={styles.mainGrid}>
        {/* LEFT PANEL: COMPOSE */}
        <div style={styles.composeCard}>
          <h4 style={styles.sectionHeading}>New Message</h4>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Recipient Email</label>
            <input
              style={styles.input}
              placeholder="student@example.com"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Message</label>
            <textarea
              style={styles.textarea}
              placeholder="Type your message here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button style={styles.sendBtn} onClick={sendMessage}>
            Send Message
          </button>
        </div>

        {/* RIGHT PANEL: CONVERSATION */}
        <div style={styles.chatCard}>
          <h4 style={styles.sectionHeading}>Recent Conversations</h4>
          <div style={styles.messageList}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>No messages found.</div>
            ) : (
              messages.map((m, i) => {
                const isMine = m.senderEmail === user.email;
                return (
                  <div 
                    key={i} 
                    style={{
                      ...styles.messageBubble,
                      alignSelf: isMine ? "flex-end" : "flex-start",
                      backgroundColor: isMine ? "#00b894" : "#f1f2f6",
                      color: isMine ? "#fff" : "#2d3436",
                      borderRadius: isMine ? "15px 15px 2px 15px" : "15px 15px 15px 2px",
                    }}
                  >
                    {!isMine && <small style={styles.senderTag}>{m.senderEmail}</small>}
                    <p style={styles.messageText}>{m.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: { backgroundColor: "#f4f7f6", minHeight: "100vh", padding: "40px 8%" },
  header: { marginBottom: "30px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#2d3436", margin: 0 },
  subtitle: { color: "#636e72", marginTop: "5px" },
  mainGrid: { display: "grid", gridTemplateColumns: "350px 1fr", gap: "30px", alignItems: "start" },
  
  composeCard: { backgroundColor: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  chatCard: { 
    backgroundColor: "#fff", 
    padding: "25px", 
    borderRadius: "12px", 
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    height: "600px",
    display: "flex",
    flexDirection: "column"
  },
  
  sectionHeading: { fontSize: "16px", color: "#2d3436", marginBottom: "20px", borderBottom: "1px solid #f1f2f6", paddingBottom: "10px" },
  inputGroup: { marginBottom: "15px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#636e72", marginBottom: "8px" },
  input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", outline: "none", fontSize: "14px" },
  textarea: { width: "100%", height: "120px", padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", outline: "none", fontSize: "14px", resize: "none" },
  sendBtn: { width: "100%", backgroundColor: "#00b894", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", marginTop: "10px" },

  messageList: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px", paddingRight: "10px" },
  messageBubble: { maxWidth: "80%", padding: "12px 16px", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" },
  senderTag: { display: "block", fontSize: "10px", fontWeight: "700", marginBottom: "4px", opacity: 0.8, textTransform: "lowercase" },
  messageText: { margin: 0, fontSize: "14px", lineHeight: "1.4" },
  emptyState: { textAlign: "center", color: "#b2bec3", marginTop: "100px" }
};

export default RecruiterMessages;