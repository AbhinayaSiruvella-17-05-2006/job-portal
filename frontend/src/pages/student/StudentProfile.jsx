import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function StudentProfile() {
  const { email } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // This line catches the 'editMode' from the Dashboard button click
  const [isEditing, setIsEditing] = useState(location.state?.editMode || false);
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    // Fetch user details from MongoDB using the email from URL
    axios.get(`https://job-portal-xwkz.onrender.com/api/student/profile/${email}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error("Failed to fetch profile", err));
  }, [email]);

  const handleUpdate = () => {
    axios.put(`https://job-portal-xwkz.onrender.com/api/student/profile/update`, { 
        email: email, 
        name: profile.name, 
        password: profile.password 
    })
      .then(() => {
        alert("Success: Profile Updated!");
        setIsEditing(false); // Go back to view-only mode after saving
      })
      .catch(() => alert("Update failed"));
  };

  const handleDeleteAccount = () => {
    if (window.confirm("WARNING: This will delete your account permanently. Continue?")) {
      axios.delete(`https://job-portal-xwkz.onrender.com/api/student/account/${email}`)
        .then(() => {
          alert("Account Deleted.");
          navigate("/"); // Go back to Login
        })
        .catch(() => alert("Delete failed"));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        
        <h2 style={styles.header}>{isEditing ? "Edit Account" : "Profile Details"}</h2>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input 
            style={isEditing ? styles.editInput : styles.viewInput} 
            disabled={!isEditing} 
            value={profile.name} 
            onChange={(e) => setProfile({...profile, name: e.target.value})}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email (Permanent)</label>
          <input style={styles.viewInput} disabled value={profile.email} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input 
            type={isEditing ? "text" : "password"} // Show text when editing, dots when viewing
            style={isEditing ? styles.editInput : styles.viewInput} 
            disabled={!isEditing} 
            value={profile.password} 
            onChange={(e) => setProfile({...profile, password: e.target.value})}
          />
        </div>

        <div style={styles.footer}>
          {isEditing ? (
            <>
              <button onClick={handleUpdate} style={styles.saveBtn}>Save Changes</button>
              <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} style={styles.editBtn}>Edit Profile</button>
          )}
          
          <div style={styles.divider}></div>
          <button onClick={handleDeleteAccount} style={styles.deleteBtn}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "50px", backgroundColor: "#F0F4F4", minHeight: "100vh", fontFamily: "sans-serif" },
  card: { maxWidth: "400px", margin: "0 auto", backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  backBtn: { background: "none", border: "none", color: "#2BB673", cursor: "pointer", fontWeight: "bold", marginBottom: "10px" },
  header: { textAlign: "center", marginBottom: "25px", color: "#333" },
  inputGroup: { marginBottom: "15px" },
  label: { display: "block", fontSize: "12px", color: "#2BB673", fontWeight: "bold", marginBottom: "5px" },
  viewInput: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #eee", backgroundColor: "#f9f9f9", boxSizing: "border-box" },
  editInput: { width: "100%", padding: "10px", borderRadius: "6px", border: "2px solid #2BB673", outline: "none", boxSizing: "border-box" },
  footer: { marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  editBtn: { backgroundColor: "#2BB673", color: "#fff", border: "none", padding: "12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  saveBtn: { backgroundColor: "#333", color: "#fff", border: "none", padding: "12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  cancelBtn: { backgroundColor: "#ccc", color: "#fff", border: "none", padding: "12px", borderRadius: "6px", cursor: "pointer" },
  divider: { height: "1px", backgroundColor: "#eee", margin: "10px 0" },
  deleteBtn: { backgroundColor: "transparent", color: "#ff4d4d", border: "1px solid #ff4d4d", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }
};

export default StudentProfile;