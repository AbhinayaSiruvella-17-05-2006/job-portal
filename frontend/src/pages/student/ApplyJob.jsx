import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

/* ================= HELPER COMPONENT ================= */
// This displays a label and value; shows "Not Specified" if empty
const ReviewItem = ({ label, value }) => (
  <div style={styles.reviewItemRow}>
    <span style={styles.reviewLabel}>{label}:</span>
    <span style={styles.reviewValue}>{value || "Not Specified"}</span>
  </div>
);

function ApplyJob() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [job, setJob] = useState(null);

  /* ================= STATES ================= */
  const [resumeFile, setResumeFile] = useState(null);

  const [personal, setPersonal] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
  });

  const [education, setEducation] = useState([
    { school: "", from: "", to: "", country: "", state: "", city: "" },
  ]);

  const [experience, setExperience] = useState([
    {
      company: "",
      role: "",
      mode: "",
      from: "",
      to: "",
      country: "",
      state: "",
      city: "",
      description: "",
    },
  ]);

  const [additional, setAdditional] = useState({
    gender: "",
    eligibleToWork: "",
    hearAboutUs: "",
  });

  const [answers, setAnswers] = useState({});

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    axios
      .get(`https://job-portal-backend.onrender.com/api/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => {
        console.error("❌ Failed to load job:", err);
        alert("Failed to load job details");
      });
  }, [id]);

  if (!job) return <div style={styles.loader}>Loading...</div>;

  /* ================= NAVIGATION ================= */
  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  /* ================= DYNAMIC FIELD HELPERS ================= */
  const addEducation = () =>
    setEducation([...education, { school: "", from: "", to: "", country: "", state: "", city: "" }]);
  
  const removeEducation = (i) => setEducation(education.filter((_, index) => index !== i));
  
  const updateEducation = (i, key, val) => {
    const copy = [...education];
    copy[i][key] = val;
    setEducation(copy);
  };

  const addExperience = () =>
    setExperience([...experience, { company: "", role: "", mode: "", from: "", to: "", country: "", state: "", city: "", description: "" }]);

  const removeExperience = (i) => setExperience(experience.filter((_, index) => index !== i));

  const updateExperience = (i, key, val) => {
    const copy = [...experience];
    copy[i][key] = val;
    setExperience(copy);
  };

  /* ================= FINAL SUBMISSION ================= */
  const submit = async () => {
    try {
      const fd = new FormData();
      fd.append("jobId", id);
      fd.append("studentEmail", user?.email || personal.email);
      if (resumeFile) fd.append("resume", resumeFile);

      fd.append(
        "application",
        JSON.stringify({
          personal,
          education,
          experience,
          additional,
          recruiterQuestions: answers,
        })
      );

      await axios.post("https://job-portal-backend.onrender.com/api/apply", fd);
      alert("✅ Application submitted successfully");
      navigate("/student/jobs");
    } catch (err) {
      console.error("Submit Error:", err);
      alert("❌ Failed to submit application");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.jobTitle}>Apply for {job.title}</h2>
          <p style={styles.companyName}>{job.company}</p>
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: `${(step / 5) * 100}%` }} />
          </div>
          <p style={styles.stepText}>Step {step} of 5</p>
        </div>

        <div style={styles.content}>
          {/* STEP 1: PERSONAL */}
          {step === 1 && (
            <div style={styles.stepWrapper}>
              <h3 style={styles.sectionTitle}>Personal Details</h3>
              <div style={styles.grid}>
                <input style={styles.input} placeholder="First Name" onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })} value={personal.firstName} />
                <input style={styles.input} placeholder="Middle Name (Optional)" onChange={(e) => setPersonal({ ...personal, middleName: e.target.value })} value={personal.middleName} />
                <input style={styles.input} placeholder="Last Name" onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })} value={personal.lastName} />
                <input style={styles.input} placeholder="Email" onChange={(e) => setPersonal({ ...personal, email: e.target.value })} value={personal.email} />
                <input style={styles.input} placeholder="Phone" onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} value={personal.phone} />
                <input style={styles.input} placeholder="Country" onChange={(e) => setPersonal({ ...personal, country: e.target.value })} value={personal.country} />
                <input style={styles.input} placeholder="State" onChange={(e) => setPersonal({ ...personal, state: e.target.value })} value={personal.state} />
                <input style={styles.input} placeholder="City" onChange={(e) => setPersonal({ ...personal, city: e.target.value })} value={personal.city} />
              </div>
              <h4 style={styles.subHeading}>Upload Resume</h4>
              <div style={styles.fileBox}>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
                {resumeFile && <p style={{fontSize: '12px', marginTop: '5px', color: '#00b894'}}>Selected: {resumeFile.name}</p>}
              </div>
              <div style={styles.footerBtns}>
                <button style={styles.primaryBtn} onClick={next}>Next Step</button>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION */}
          {step === 2 && (
            <div style={styles.stepWrapper}>
              <h3 style={styles.sectionTitle}>Education</h3>
              {education.map((e, i) => (
                <div key={i} style={styles.repeaterCard}>
                  <input style={styles.input} placeholder="School / College" onChange={(ev) => updateEducation(i, "school", ev.target.value)} value={e.school} />
                  <div style={styles.grid}>
                    <div style={styles.inputGroup}><label style={styles.label}>From</label><input style={styles.input} type="date" onChange={(ev) => updateEducation(i, "from", ev.target.value)} value={e.from} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>To</label><input style={styles.input} type="date" onChange={(ev) => updateEducation(i, "to", ev.target.value)} value={e.to} /></div>
                  </div>
                  {education.length > 1 && <button style={styles.removeBtn} onClick={() => removeEducation(i)}>Remove</button>}
                </div>
              ))}
              <button style={styles.addBtn} onClick={addEducation}>+ Add Education</button>
              <div style={styles.footerBtns}>
                <button style={styles.secondaryBtn} onClick={prev}>Back</button>
                <button style={styles.primaryBtn} onClick={next}>Next Step</button>
              </div>
            </div>
          )}

          {/* STEP 3: EXPERIENCE */}
          {step === 3 && (
            <div style={styles.stepWrapper}>
              <h3 style={styles.sectionTitle}>Experience</h3>
              {experience.map((ex, i) => (
                <div key={i} style={styles.repeaterCard}>
                  <input style={styles.input} placeholder="Company" onChange={(e) => updateExperience(i, "company", e.target.value)} value={ex.company} />
                  <input style={styles.input} placeholder="Role" onChange={(e) => updateExperience(i, "role", e.target.value)} value={ex.role} />
                  <textarea style={styles.textarea} placeholder="Description" onChange={(e) => updateExperience(i, "description", e.target.value)} value={ex.description} />
                  {experience.length > 1 && <button style={styles.removeBtn} onClick={() => removeExperience(i)}>Remove</button>}
                </div>
              ))}
              <button style={styles.addBtn} onClick={addExperience}>+ Add Experience</button>
              <div style={styles.footerBtns}>
                <button style={styles.secondaryBtn} onClick={prev}>Back</button>
                <button style={styles.primaryBtn} onClick={next}>Next Step</button>
              </div>
            </div>
          )}

          {/* STEP 4: ADDITIONAL */}
         {/* STEP 4: ADDITIONAL INFORMATION & ASSESSMENT */}
{step === 4 && (
  <div style={styles.stepWrapper}>
    <h3 style={styles.sectionTitle}>Additional Information</h3>
    <div style={styles.grid}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Gender</label>
        <select 
          style={styles.select} 
          value={additional.gender} 
          onChange={(e) => setAdditional({ ...additional, gender: e.target.value })}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Eligible to work:</label>
        <select 
          style={styles.select} 
          value={additional.eligibleToWork} 
          onChange={(e) => setAdditional({ ...additional, eligibleToWork: e.target.value })}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>

    <hr style={styles.hr} />

    {/* DYNAMIC RECRUITER QUESTIONS */}
    {job.questions && job.questions.length > 0 && (
      <>
        <h4 style={styles.subHeading}>Assessment Questions</h4>
        {job.questions.map((q, i) => (
          <div key={i} style={styles.questionBox}>
            <p style={styles.questionText}><b>Q:</b> {q.questionText}</p>
            
            {/* 1. TEXT / INPUT FORMAT */}
            {(q.answerType === "text" || q.answerType === "Input") && (
              <input 
                style={styles.input} 
                type="text" 
                placeholder="Type your answer..." 
                value={answers[q.questionText] || ""} 
                onChange={(e) => setAnswers({ ...answers, [q.questionText]: e.target.value })} 
              />
            )}

            {/* 2. DROPDOWN / SELECT FORMAT */}
            {(q.answerType === "dropdown" || q.answerType === "Dropdown") && (
              <select 
                style={styles.select}
                value={answers[q.questionText] || ""}
                onChange={(e) => setAnswers({ ...answers, [q.questionText]: e.target.value })}
              >
                <option value="">Select an option</option>
                {q.options?.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {/* 3. RADIO BUTTON FORMAT */}
            {(q.answerType === "radio" || q.answerType === "Radio") && (
              <div style={styles.radioGroup}>
                {q.options?.map((opt, idx) => (
                  <label key={idx} style={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name={`question-${i}`} 
                      value={opt} 
                      checked={answers[q.questionText] === opt}
                      onChange={(e) => setAnswers({ ...answers, [q.questionText]: e.target.value })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </>
    )}

    <div style={styles.footerBtns}>
      <button style={styles.secondaryBtn} onClick={prev}>Back</button>
      <button style={styles.primaryBtn} onClick={next}>Review Application</button>
    </div>
  </div>
)}

          {/* STEP 5: FINAL REVIEW (Everything Displayed Here) */}
          {step === 5 && (
            <div style={styles.stepWrapper}>
              <h3 style={styles.sectionTitle}>Final Review</h3>
              <p style={styles.stepSub}>Check your details before confirming submission.</p>

              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHeader}>Personal Information</h4>
                <div style={styles.grid}>
                  <ReviewItem label="Name" value={`${personal.firstName} ${personal.lastName}`} />
                  <ReviewItem label="Email" value={personal.email} />
                  <ReviewItem label="Phone" value={personal.phone} />
                  <ReviewItem label="Location" value={`${personal.city}, ${personal.state}`} />
                </div>
              </div>

              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHeader}>Education</h4>
                {education.map((edu, i) => (
                  <div key={i} style={styles.reviewEntry}>
                    <ReviewItem label="Institution" value={edu.school} />
                    <ReviewItem label="Duration" value={`${edu.from} to ${edu.to}`} />
                  </div>
                ))}
              </div>

              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHeader}>Work Experience</h4>
                {experience.map((exp, i) => (
                  <div key={i} style={styles.reviewEntry}>
                    <ReviewItem label="Company" value={exp.company} />
                    <ReviewItem label="Role" value={exp.role} />
                  </div>
                ))}
              </div>

              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHeader}>Assessment & Others</h4>
                <div style={styles.grid}>
                  <ReviewItem label="Gender" value={additional.gender} />
                  <ReviewItem label="Eligible" value={additional.eligibleToWork} />
                </div>
                {Object.entries(answers).length > 0 && (
                  <div style={{marginTop: '15px'}}>
                    {Object.entries(answers).map(([q, a], i) => (
                      <div key={i} style={styles.reviewQuestionBox}>
                        <p style={styles.reviewQ}><b>Q:</b> {q}</p>
                        <p style={styles.reviewA}><b>A:</b> {a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHeader}>Attachments</h4>
                <ReviewItem label="Resume" value={resumeFile ? resumeFile.name : "None"} />
              </div>

              <div style={styles.footerBtns}>
                <button style={styles.secondaryBtn} onClick={prev}>Back to Edit</button>
                <button style={styles.submitBtn} onClick={submit}>Confirm & Submit</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: { backgroundColor: "#f4f7f6", minHeight: "100vh", padding: "40px 20px", display: "flex", justifyContent: "center" },
  card: { backgroundColor: "#fff", width: "100%", maxWidth: "700px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", padding: "40px" },
  header: { marginBottom: "30px", textAlign: "center" },
  jobTitle: { fontSize: "24px", fontWeight: "700", color: "#2d3436", margin: "0 0 5px 0" },
  companyName: { fontSize: "16px", color: "#636e72", marginBottom: "20px" },
  progressContainer: { height: "8px", backgroundColor: "#dfe6e9", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" },
  progressBar: { height: "100%", backgroundColor: "#00b894", transition: "width 0.4s ease" },
  stepText: { fontSize: "13px", color: "#b2bec3", fontWeight: "600" },
  sectionTitle: { fontSize: "20px", color: "#2d3436", marginBottom: "20px", borderLeft: "4px solid #00b894", paddingLeft: "15px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" },
  textarea: { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", fontSize: "14px", outline: "none", width: "100%", minHeight: "80px", gridColumn: "span 2" },
  select: { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", fontSize: "14px", width: "100%", backgroundColor: "#fff" },
  inputGroup: { marginBottom: "15px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#636e72", marginBottom: "5px" },
  repeaterCard: { padding: "20px", border: "1px solid #f1f2f6", borderRadius: "10px", marginBottom: "15px", backgroundColor: "#fafafa" },
  addBtn: { background: "none", border: "1px dashed #00b894", color: "#00b894", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  removeBtn: { background: "none", border: "none", color: "#ff7675", cursor: "pointer", fontSize: "12px", marginTop: "10px", padding: 0 },
  footerBtns: { marginTop: "30px", display: "flex", justifyContent: "space-between" },
  primaryBtn: { backgroundColor: "#00b894", color: "#fff", border: "none", padding: "12px 30px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginLeft: "auto" },
  secondaryBtn: { backgroundColor: "#f1f2f6", color: "#636e72", border: "none", padding: "12px 30px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  submitBtn: { backgroundColor: "#2d3436", color: "#fff", border: "none", padding: "12px 30px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginLeft: "auto" },
  fileBox: { padding: "20px", border: "2px dashed #dfe6e9", borderRadius: "10px", textAlign: "center" },
  stepSub: { fontSize: "14px", color: "#636e72", marginBottom: "20px" },
  reviewSection: { marginBottom: "25px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #eee" },
  reviewHeader: { fontSize: "16px", color: "#00b894", marginBottom: "12px", fontWeight: "700" },
  reviewItemRow: { display: "flex", flexDirection: "column", marginBottom: "10px" },
  reviewLabel: { fontSize: "11px", color: "#b2bec3", fontWeight: "700", textTransform: "uppercase" },
  reviewValue: { fontSize: "14px", color: "#2d3436", fontWeight: "600" },
  reviewEntry: { padding: "10px", backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "8px", marginBottom: "10px" },
  reviewQuestionBox: { backgroundColor: "#fff", padding: "10px", borderRadius: "6px", borderLeft: "4px solid #00b894", marginBottom: "10px" },
  reviewQ: { margin: "0", fontSize: "13px", color: "#636e72" },
  reviewA: { margin: "5px 0 0 0", fontSize: "14px", color: "#2d3436", fontWeight: "600" },
  subHeading: { fontSize: "16px", color: "#2d3436", margin: "20px 0 10px 0" },
  questionBox: { marginBottom: "20px" },
  questionText: { fontSize: "14px", color: "#2d3436", marginBottom: "8px" },
  loader: { textAlign: "center", padding: "50px", fontSize: "18px", color: "#636e72" }
};

export default ApplyJob;