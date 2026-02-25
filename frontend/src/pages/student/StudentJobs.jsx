import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function StudentJobs() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get(`https://job-portal-backend.onrender.com/api/jobs/available/${email}`)
      .then(res => setJobs(res.data))
      .catch(() => setJobs([]));
  }, [email]);

  const filteredJobs = jobs.filter(job => 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", backgroundColor: "#F0F4F4", minHeight: "100vh" }}>
      <button onClick={() => navigate(`/student/dashboard/${email}`)} style={btnStyle}>← Back to Dashboard</button>
      
      <div style={{ margin: "20px 0" }}>
        <input 
          style={searchStyle} 
          placeholder="Search by Company Name..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <h2 style={{ marginBottom: "20px" }}>Available Jobs</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job._id} style={jobCardStyle} onClick={() => navigate(`/student/job/${job._id}`)}>
              <h3>{job.title}</h3>
              <p style={{ color: "#2BB673", fontWeight: "bold" }}>{job.company}</p>
              <p style={{ fontSize: "12px" }}>{job.description.substring(0, 100)}...</p>
              <button style={applyBtn}>View & Apply</button>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1/4", textAlign: "center", padding: "50px", backgroundColor: "#fff", borderRadius: "10px" }}>
             <h3>No jobs found matching your search.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle = { border: "none", background: "none", color: "#2BB673", cursor: "pointer", fontWeight: "bold" };
const searchStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" };
const jobCardStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" };
const applyBtn = { marginTop: "10px", backgroundColor: "#2BB673", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" };

export default StudentJobs;