import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import RoleSelect from "./pages/RoleSelect";
import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseJobs from "./pages/student/BrowseJobs";
import JobDetails from "./pages/student/JobDetails";
import ApplyJob from "./pages/student/ApplyJob";
import MyApplications from "./pages/student/MyApplications";
import StudentNotifications from "./pages/student/StudentNotifications";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostJob from "./pages/recruiter/PostJob";
import MyJobs from "./pages/recruiter/MyJobs";
import JobApplications from "./pages/recruiter/JobApplications";
import StudentMessages from "./pages/student/Messages";
import RecruiterMessages from "./pages/recruiter/Messages";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import StudentProfile from "./pages/student/StudentProfile";
import StudentJobs from "./pages/student/StudentJobs";
function App() {
  return(
   <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/role-select" element={<RoleSelect />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/student/dashboard/:email" element={<StudentDashboard />} />
          <Route path="/student/jobs" element={<BrowseJobs />} />
          <Route path="/student/job/:id" element={<JobDetails />} />
          <Route path="/student/apply/:id" element={<ApplyJob />} />
          <Route
  path="/student/applications/:email"
  element={<MyApplications />}
/>
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />
          <Route path="/recruiter/my-jobs" element={<MyJobs />} />
          <Route path="/recruiter/applications/:jobId" element={<JobApplications />} />
          <Route path="/student/messages/:email" element={<StudentMessages />} />
          <Route path="/recruiter/messages/:email" element={<RecruiterMessages />} />
          <Route path="/student/profile/:email" element={<StudentProfile />} />
          <Route path="/student/jobs/:email" element={<StudentJobs />} />
          <Route path="/recruiter/profile" element={<RecruiterProfile />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
  )
}

export default App;