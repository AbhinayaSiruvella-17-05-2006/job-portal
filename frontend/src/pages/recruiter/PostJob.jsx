import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function PostJob() {
  const { user } = useContext(AuthContext);
  const [jobType, setJobType] = useState("pdf");
  const [pdf, setPdf] = useState(null);

  const [basic, setBasic] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
  });

  const [eligibility, setEligibility] = useState({
    skills: "",
    yearOfStudy: "",
    mode: "",
    country: "",
    state: "",
    city: "",
    paidType: "",
    stipendAmount: "",
    duration: "",
  });

  const [questions, setQuestions] = useState([]);

  /* ---------------- QUESTIONS LOGIC ---------------- */
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", answerType: "text", options: [""] }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (i, key, value) => {
    const updated = [...questions];
    updated[i][key] = value;
    setQuestions(updated);
  };

  const addOption = (i) => {
    const updated = [...questions];
    updated[i].options.push("");
    setQuestions(updated);
  };

  const updateOption = (qi, oi, value) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = async () => {
    if (!basic.companyName || !basic.jobTitle) {
      alert("Please fill in basic job details");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("recruiterEmail", user.email);
      fd.append("company", basic.companyName);
      fd.append("title", basic.jobTitle);
      fd.append("description", basic.jobDescription);
      fd.append("jobType", jobType);

      if (jobType === "pdf" && pdf) {
        fd.append("pdf", pdf);
      }

      const eligibilityData = {
        skills: eligibility.skills.split(",").map(s => s.trim()),
        yearOfStudy: eligibility.yearOfStudy,
        mode: eligibility.mode,
        duration: eligibility.duration,
        paidType: eligibility.paidType,
        stipendAmount: eligibility.stipendAmount,
        location: {
          country: eligibility.country,
          state: eligibility.state,
          city: eligibility.city,
        }
      };
      
      fd.append("eligibility", JSON.stringify(eligibilityData));
      fd.append("questions", JSON.stringify(questions));

      await axios.post("https://job-portal-xwkz.onrender.com/api/recruiter/post-job", fd);

      alert("✅ Job Posted Successfully");
      // Optional: Reset form or navigate
    } catch (err) {
      console.error(err);
      alert("❌ Failed to post job");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.mainTitle}>Post New Opportunity</h2>
          <p style={styles.subtitle}>Fill in the details to reach potential candidates</p>
        </div>
        
        {/* BASIC INFO */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>Basic Information</h3>
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
               <label style={styles.label}>Company Name</label>
               <input style={styles.input} placeholder="e.g. Google" onChange={(e) => setBasic({ ...basic, companyName: e.target.value })} />
            </div>
            <div style={styles.inputGroup}>
               <label style={styles.label}>Job Title</label>
               <input style={styles.input} placeholder="e.g. Software Engineer Intern" onChange={(e) => setBasic({ ...basic, jobTitle: e.target.value })} />
            </div>
            <div style={{gridColumn: "span 2"}}>
               <label style={styles.label}>Description</label>
               <textarea style={styles.textarea} placeholder="Describe the role and responsibilities..." onChange={(e) => setBasic({ ...basic, jobDescription: e.target.value })} />
            </div>
          </div>
        </section>

        {/* APPLICATION TYPE */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>Application Method</h3>
          <select style={styles.select} value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="pdf">PDF Based (Upload JD)</option>
            <option value="questions">Question Based (Digital Form)</option>
          </select>
          
          {jobType === "pdf" && (
            <div style={styles.fileBox}>
              <input type="file" accept=".pdf" onChange={(e) => setPdf(e.target.files[0])} />
              <p style={{fontSize: '12px', color: '#636e72', marginTop: '10px'}}>Only PDF files are supported</p>
            </div>
          )}
        </section>

        {/* ELIGIBILITY - ONLY IF QUESTIONS MODE */}
        {jobType === "questions" && (
          <section style={styles.section}>
            <h3 style={styles.sectionLabel}>Eligibility & Requirements</h3>
            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Required Skills</label>
                <input style={styles.input} placeholder="React, Node, Python..." onChange={(e) => setEligibility({ ...eligibility, skills: e.target.value })} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Target Year</label>
                <select style={styles.select} onChange={(e) => setEligibility({ ...eligibility, yearOfStudy: e.target.value })}>
                  <option value="">Select Year</option>
                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>Final Year</option><option>Passed Out</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Work Mode</label>
                <select style={styles.select} onChange={(e) => setEligibility({ ...eligibility, mode: e.target.value })}>
                  <option value="">Select Mode</option>
                  <option>Online</option><option>Offline</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Duration</label>
                <input style={styles.input} placeholder="e.g. 6 Months" onChange={(e) => setEligibility({ ...eligibility, duration: e.target.value })} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Compensation</label>
                <select style={styles.select} onChange={(e) => setEligibility({ ...eligibility, paidType: e.target.value })}>
                  <option value="">Select Type</option>
                  <option value="Free">Unpaid</option>
                  <option value="Stipend">Paid / Stipend</option>
                </select>
              </div>
              {eligibility.paidType === "Stipend" && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Amount (₹)</label>
                  <input style={styles.input} type="number" placeholder="Enter amount" onChange={(e) => setEligibility({ ...eligibility, stipendAmount: e.target.value })} />
                </div>
              )}
            </div>

            {eligibility.mode === "Offline" && (
              <div style={{...styles.grid, marginTop: '15px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px'}}>
                <input style={styles.input} placeholder="Country" onChange={(e) => setEligibility({ ...eligibility, country: e.target.value })} />
                <input style={styles.input} placeholder="State" onChange={(e) => setEligibility({ ...eligibility, state: e.target.value })} />
                <input style={styles.input} placeholder="City" onChange={(e) => setEligibility({ ...eligibility, city: e.target.value })} />
              </div>
            )}
          </section>
        )}

        {/* QUESTIONS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>Custom Assessment</h3>
          {questions.map((q, i) => (
            <div key={i} style={styles.questionCard}>
              <div style={styles.grid}>
                <input style={styles.input} placeholder="Question Text" onChange={(e) => updateQuestion(i, "questionText", e.target.value)} />
                <select style={styles.select} onChange={(e) => updateQuestion(i, "answerType", e.target.value)}>
                  <option value="text">Text Input</option>
                  <option value="radio">Single Choice (Radio)</option>
                  <option value="dropdown">Dropdown List</option>
                </select>
              </div>

              {q.answerType !== "text" && (
                <div style={{marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px'}}>
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{display: 'flex', gap: '10px', marginBottom: '8px'}}>
                      <input style={styles.input} placeholder={`Option ${oi + 1}`} onChange={(e) => updateOption(i, oi, e.target.value)} />
                    </div>
                  ))}
                  <button style={styles.addOptionBtn} onClick={() => addOption(i)}>+ Add Option</button>
                </div>
              )}
              <button style={styles.removeBtn} onClick={() => removeQuestion(i)}>Delete Question</button>
            </div>
          ))}
          <button style={styles.addBtn} onClick={addQuestion}>+ Add Assessment Question</button>
        </section>

        <div style={styles.footer}>
          <button style={styles.submitBtn} onClick={submit}>Publish Opportunity</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#f4f7f6", minHeight: "100vh", padding: "40px 20px", display: "flex", justifyContent: "center" },
  card: { backgroundColor: "#fff", width: "100%", maxWidth: "800px", borderRadius: "16px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  header: { marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "20px" },
  mainTitle: { fontSize: "24px", color: "#2d3436", margin: 0, fontWeight: "800" },
  subtitle: { color: "#636e72", fontSize: "14px", marginTop: "5px" },
  section: { marginBottom: "40px" },
  sectionLabel: { fontSize: "14px", color: "#00b894", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", display: "block" },
  inputGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#2d3436" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" },
  textarea: { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", width: "100%", minHeight: "120px", fontSize: "14px", outline: "none", resize: "none" },
  select: { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", width: "100%", backgroundColor: "#fff", cursor: "pointer", fontSize: "14px" },
  fileBox: { padding: "30px", border: "2px dashed #00b894", borderRadius: "12px", textAlign: "center", backgroundColor: "#f9fffb", marginTop: "15px" },
  questionCard: { padding: "20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" },
  addBtn: { backgroundColor: "transparent", color: "#00b894", border: "1px dashed #00b894", padding: "12px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", width: "100%" },
  addOptionBtn: { backgroundColor: "#e6fffb", color: "#00b894", border: "none", padding: "6px 15px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  removeBtn: { color: "#ff7675", background: "none", border: "none", fontSize: "12px", cursor: "pointer", marginTop: "15px", fontWeight: "700" },
  footer: { textAlign: "right", marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "30px" },
  submitBtn: { backgroundColor: "#00b894", color: "#fff", border: "none", padding: "15px 40px", borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(0, 184, 148, 0.3)" }
};

export default PostJob;