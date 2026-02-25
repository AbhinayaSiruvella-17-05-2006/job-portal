import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RecruiterProfile() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "", 
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/recruiter/update/${user.email}`, formData);
      // Update local storage and context so the UI reflects the new name
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Update failed.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("WARNING: This will permanently delete your account and all posted jobs. Continue?")) {
      try {
        await axios.delete(`http://localhost:5000/api/recruiter/delete/${user.email}`);
        handleLogout();
      } catch (err) {
        alert("❌ Error deleting account.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatarLarge}>
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={styles.title}>Account Settings</h2>
          <p style={styles.subtitle}>Update your personal details and security</p>
        </div>
        
        <div style={styles.formSection}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input 
              style={isEditing ? styles.inputActive : styles.inputDisabled}
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email (Permanent)</label>
            <input 
              style={styles.inputDisabled}
              disabled={true}
              value={formData.email}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Change Password</label>
            <input 
              type="password"
              placeholder={isEditing ? "Enter new password" : "••••••••"}
              style={isEditing ? styles.inputActive : styles.inputDisabled}
              disabled={!isEditing}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>

        <div style={styles.actionRow}>
          {!isEditing ? (
            <button style={styles.editBtn} onClick={() => setIsEditing(true)}>Edit Profile</button>
          ) : (
            <>
              <button style={styles.saveBtn} onClick={handleUpdate}>Save Changes</button>
              <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          )}
        </div>

        <div style={styles.dangerZone}>
          <button style={styles.deleteBtn} onClick={handleDelete}>Delete Account</button>
          <button style={styles.backBtn} onClick={() => navigate("/recruiter-dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#f4f7f6", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" },
  card: { backgroundColor: "#fff", width: "100%", maxWidth: "450px", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" },
  header: { textAlign: "center", marginBottom: "30px" },
  avatarLarge: { width: "80px", height: "80px", backgroundColor: "#00b894", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold", margin: "0 auto 15px" },
  title: { fontSize: "24px", color: "#2d3436", margin: 0 },
  subtitle: { color: "#636e72", fontSize: "14px" },
  formSection: { display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "13px", fontWeight: "700", color: "#2d3436" },
  inputDisabled: { padding: "12px", borderRadius: "10px", border: "1px solid #dfe6e9", backgroundColor: "#f9fafb", color: "#b2bec3" },
  inputActive: { padding: "12px", borderRadius: "10px", border: "2px solid #00b894", outline: "none" },
  actionRow: { display: "flex", gap: "10px", marginTop: "30px" },
  editBtn: { flex: 1, backgroundColor: "#2d3436", color: "#fff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
  saveBtn: { flex: 2, backgroundColor: "#00b894", color: "#fff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
  cancelBtn: { flex: 1, backgroundColor: "#dfe6e9", color: "#2d3436", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
  dangerZone: { marginTop: "40px", display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid #eee", paddingTop: "20px" },
  deleteBtn: { background: "none", border: "none", color: "#ff7675", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  backBtn: { background: "none", border: "none", color: "#636e72", cursor: "pointer", fontSize: "13px" }
};

export default RecruiterProfile;