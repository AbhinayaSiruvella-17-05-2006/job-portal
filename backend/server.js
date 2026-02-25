require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const PDFDocument = require("pdfkit");

const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Notification = require("./models/Notification");
const Message = require("./models/Message");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= MONGODB ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(console.error);
/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ================= HELPER ================= */
const isFilled = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
};

/* ================= AUTH ================= */
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    res.json({
      message: "Signup successful",
      role: newUser.role,
      email: newUser.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as ${user.role}. Please login using correct option.`,
      });
    }

    res.json({
      message: "Login successful",
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= RECRUITER ================= */

app.post("/api/recruiter/post-job", upload.single("pdf"), async (req, res) => {
  console.log("FULL BODY RECEIVED:", req.body);
  try {
    // 1. Parse the eligibility string sent from the frontend into a real object
    let eligibilityData = {};
    if (req.body.eligibility) {
      try {
        eligibilityData = JSON.parse(req.body.eligibility);
      } catch (pErr) {
        console.error("Parsing eligibility failed:", pErr);
      }
    }

    const jobData = {
      recruiterEmail: req.body.recruiterEmail,
      company: req.body.company,
      title: req.body.title,
      description: req.body.description,
      jobType: req.body.jobType,
      pdfPath: "",
      // 2. USE the parsed data here instead of {}
      eligibility: eligibilityData, 
      questions: JSON.parse(req.body.questions || "[]"),
    };

    if (req.body.jobType === "pdf" && req.file) {
      jobData.pdfPath = `uploads/${req.file.filename}`;
    }

    const job = await Job.create(jobData);
    console.log("SAVED JOB:", job); // Check your console to see the nested data

    res.json({ message: "Job posted successfully", job });
  } catch (err) {
    console.error("POST JOB ERROR:", err);
    res.status(500).json({ message: "Failed to post job" });
  }
});

app.get("/api/jobs", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});
/* ================= RECRUITER MY JOBS ================= */
app.get("/api/recruiter/my-jobs/:email", async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiterEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recruiter jobs" });
  }
});
app.get("/api/jobs/:id", async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.json(job);
});

/* ================= APPLY JOB ================= */
app.post("/api/apply", upload.single("resume"), async (req, res) => {
  try {
    const data = JSON.parse(req.body.application || "{}");

    const job = await Job.findById(req.body.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = await Application.create({
      jobId: job._id,
      studentEmail: req.body.studentEmail,
      studentName: `${data.personal?.firstName || ""} ${data.personal?.lastName || ""}`,
      phone: data.personal?.phone || "",
      personal: data.personal || {},
      education: data.education || [],
      experience: data.experience || [],
      additional: data.additional || {},
      recruiterQuestions: data.recruiterQuestions || {},
      resume: req.file ? req.file.path : "",
      status: "pending",
    });

    await Notification.create({
      recipientEmail: job.recruiterEmail,
      senderEmail: req.body.studentEmail,
      type: "application",
      message: "A student applied to your job.",
    });

    res.json({ message: "Applied successfully", application });
  } catch (err) {
    res.status(500).json({ message: "Failed to apply" });
  }
});

/* ================= SEND OFFER ================= */
app.post(
  "/api/recruiter/application/:id/send-offer",
  upload.single("offerPdf"),
  async (req, res) => {
    try {
      const appData = await Application.findById(req.params.id).populate("jobId");
      if (!appData) {
        return res.status(404).json({ message: "Application not found" });
      }

      appData.status = "accepted";
      appData.offerLetter = req.body.message;
      appData.offerPdf = req.file ? req.file.path : "";
      appData.acceptedAt = new Date();
      await appData.save();

      await Notification.create({
        recipientEmail: appData.studentEmail,
        senderEmail: appData.jobId.recruiterEmail,
        type: "accepted",
        message: "Your application has been accepted.",
      });

      res.json({ message: "Offer letter sent successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to send offer" });
    }
  }
);

/* ================= SEND REJECTION ================= */
app.post("/api/recruiter/application/:id/send-rejection", async (req, res) => {
  try {
    const appData = await Application.findById(req.params.id).populate("jobId");
    if (!appData) {
      return res.status(404).json({ message: "Application not found" });
    }

    appData.status = "rejected";
    appData.rejectionMessage = req.body.message;
    appData.rejectedAt = new Date();
    await appData.save();

    await Notification.create({
      recipientEmail: appData.studentEmail,
      senderEmail: appData.jobId.recruiterEmail,
      type: "rejected",
      message: "Your application has been rejected.",
    });

    res.json({ message: "Rejection message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send rejection" });
  }
});

/* ================= STUDENT RESPOND ================= */
app.post("/api/student/respond/:id", async (req, res) => {
  try {
    const appData = await Application.findById(req.params.id).populate("jobId");

    if (!appData) {
      return res.status(404).json({ message: "Application not found" });
    }

    const decision = req.body.decision;

    // Update application status
    appData.status =
      decision === "accept" ? "offer_accepted" : "offer_rejected";

    await appData.save();

    // Send notification to recruiter
    await Notification.create({
      recipientEmail: appData.jobId.recruiterEmail,
      senderEmail: appData.studentEmail,
      type: decision,
      message:
        decision === "accept"
          ? `${appData.studentEmail} has accepted your offer.`
          : `${appData.studentEmail} has rejected your offer.`,
    });

    res.json({ message: "Student response saved and recruiter notified." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error responding to offer" });
  }
});
/* ================= APPLICATIONS ================= */
app.get("/api/applications/:studentEmail", async (req, res) => {
  const apps = await Application.find({
    studentEmail: req.params.studentEmail,
  }).populate("jobId");
  res.json(apps);
});

app.get("/api/recruiter/applications/:jobId", async (req, res) => {
  const apps = await Application.find({
    jobId: req.params.jobId,
  });
  res.json(apps);
});

/* ================= NOTIFICATIONS ================= */

/* ================= MESSAGES ================= */
/* ================= MESSAGES ================= */

// Change "/api/messages" to "/api/messages/send" to match your frontend
/* ================= MESSAGES ================= */
// ADD '/send' TO THE END OF THE ROUTE
/* ================= MESSAGES ================= */

// This route MUST match exactly what axios calls in the frontend
/* ================= MESSAGES ================= */
app.post("/api/messages/send", async (req, res) => {
  try {
    console.log("Incoming message:", req.body);

    const { senderEmail, receiverEmail, message } = req.body;

    const newMessage = await Message.create({
      senderEmail,
      receiverEmail,
      message,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("MESSAGE ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
});
app.get("/api/messages/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const messages = await Message.find({
      $or: [
        { senderEmail: email },
        { receiverEmail: email }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});



app.get("/api/recruiter/application/:id/pdf", async (req, res) => {
  try {
    const appData = await Application.findById(req.params.id);
    if (!appData) return res.status(404).send("Not found");

    console.log("Application Data:", JSON.stringify(appData, null, 2));

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=application.pdf");
    doc.pipe(res);

    /* ========= TITLE ========= */
    doc.fontSize(22).text("Application Details", { underline: true, align: "center" });
    doc.moveDown();
    doc.fontSize(12).text("Applicant: " + appData.studentName, { align: "center" });
    doc.text("Email: " + appData.studentEmail, { align: "center" });
    doc.text("Status: " + appData.status, { align: "center" });
    doc.moveDown(2);

    /* ========= PERSONAL DETAILS ========= */
    doc.fontSize(14).text("PERSONAL DETAILS", { underline: true });
    doc.moveDown();
    
    const p = appData.personal || {};
    if (isFilled(p.firstName)) doc.fontSize(11).text("First Name: " + p.firstName);
    if (isFilled(p.middleName)) doc.text("Middle Name: " + p.middleName);
    if (isFilled(p.lastName)) doc.text("Last Name: " + p.lastName);
    if (isFilled(p.email)) doc.text("Email: " + p.email);
    if (isFilled(p.phone)) doc.text("Phone: " + p.phone);
    if (isFilled(p.country)) doc.text("Country: " + p.country);
    if (isFilled(p.state)) doc.text("State: " + p.state);
    if (isFilled(p.city)) doc.text("City: " + p.city);
    doc.moveDown();

    /* ========= EDUCATION ========= */
    if ((appData.education || []).length > 0) {
      const hasEducation = (appData.education || []).some(e => 
        isFilled(e.school) || isFilled(e.from) || isFilled(e.to)
      );
      
      if (hasEducation) {
        doc.fontSize(14).text("EDUCATION", { underline: true });
        doc.moveDown();
        
        (appData.education || []).forEach((e, i) => {
          if (isFilled(e.school) || isFilled(e.from) || isFilled(e.to)) {
            doc.fontSize(11);
            if (isFilled(e.school)) doc.text("School/College: " + e.school);
            if (isFilled(e.from)) doc.text("From: " + e.from);
            if (isFilled(e.to)) doc.text("To: " + e.to);
            if (isFilled(e.country)) doc.text("Country: " + e.country);
            if (isFilled(e.state)) doc.text("State: " + e.state);
            if (isFilled(e.city)) doc.text("City: " + e.city);
            doc.moveDown();
          }
        });
      }
    }

    /* ========= EXPERIENCE ========= */
    if ((appData.experience || []).length > 0) {
      const hasExperience = (appData.experience || []).some(ex => 
        isFilled(ex.company) || isFilled(ex.role) || isFilled(ex.description)
      );
      
      if (hasExperience) {
        doc.fontSize(14).text("EXPERIENCE", { underline: true });
        doc.moveDown();
        
        (appData.experience || []).forEach((ex, i) => {
          if (isFilled(ex.company) || isFilled(ex.role) || isFilled(ex.description)) {
            doc.fontSize(11);
            if (isFilled(ex.company)) doc.text("Company: " + ex.company);
            if (isFilled(ex.role)) doc.text("Role: " + ex.role);
            if (isFilled(ex.mode)) doc.text("Mode: " + ex.mode);
            if (isFilled(ex.from)) doc.text("From: " + ex.from);
            if (isFilled(ex.to)) doc.text("To: " + ex.to);
            if (isFilled(ex.country)) doc.text("Country: " + ex.country);
            if (isFilled(ex.state)) doc.text("State: " + ex.state);
            if (isFilled(ex.city)) doc.text("City: " + ex.city);
            if (isFilled(ex.description)) doc.text("Description: " + ex.description);
            doc.moveDown();
          }
        });
      }
    }

    /* ========= ADDITIONAL QUESTIONS ========= */
    const additionalData = appData.additional || {};
    const hasAdditional = Object.keys(additionalData).some(k => isFilled(additionalData[k]));
    
    if (hasAdditional) {
      doc.fontSize(14).text("ADDITIONAL QUESTIONS", { underline: true });
      doc.moveDown();
      doc.fontSize(11);
      
      if (isFilled(additionalData.gender)) doc.text("Gender: " + additionalData.gender);
      if (isFilled(additionalData.eligibleToWork)) doc.text("Eligible to work: " + additionalData.eligibleToWork);
      if (isFilled(additionalData.hearAboutUs)) doc.text("Hear about us from: " + additionalData.hearAboutUs);
      
      doc.moveDown();
    }

    /* ========= JOB SPECIFIC QUESTIONS ========= */
    const recruiterQuestions = appData.recruiterQuestions || {};
    console.log("Recruiter Questions:", recruiterQuestions);
    
    if (Object.keys(recruiterQuestions).length > 0) {
      doc.fontSize(14).text("JOB SPECIFIC QUESTIONS", { underline: true });
      doc.moveDown();
      doc.fontSize(11);
      let questionCount = 1;
      for (const [questionText, answer] of Object.entries(recruiterQuestions)) {
        if (isFilled(answer)) {
          doc.text("Q" + questionCount + ": " + questionText);
          doc.text("Answer: " + answer);
          doc.moveDown();
          questionCount++;
        }
      }
      if (questionCount === 1) {
        doc.text("No answers provided");
      }
      doc.moveDown();
    } else {
      doc.fontSize(14).text("JOB SPECIFIC QUESTIONS", { underline: true });
      doc.moveDown();
      doc.fontSize(11).text("No job-specific questions for this application");
      doc.moveDown();
    }

    /* ========= RESUME LINK ========= */
    if (isFilled(appData.resume)) {
      doc.fontSize(14).text("RESUME", { underline: true });
      doc.moveDown();
      doc.fontSize(11).fillColor("blue").text(
        "Click here to view resume: " + appData.resume,
        { link: "http://localhost:5000/" + appData.resume, underline: true }
      );
      doc.fillColor("black");
    }

    doc.end();
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).send("PDF generation failed");
  }
});
/* ================= SERVER ================= */
/* ================= STUDENT PROFILE ================= */

// 1. Fetch Profile Details
app.get("/api/student/profile/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (user) res.json({ name: user.name, email: user.email, password: user.password });
  else res.status(404).send("User not found");
});

app.put("/api/student/profile/update", async (req, res) => {
  const { email, name, password } = req.body;
  await User.findOneAndUpdate({ email }, { name, password });
  res.json({ message: "Updated" });
});
// DELETE ACCOUNT
app.delete("/api/student/account/:email", async (req, res) => {
  try {
    const email = req.params.email;
    // 1. Remove User from Users Collection
    const userDeleted = await User.findOneAndDelete({ email: email });
    
    if (userDeleted) {
      // 2. Optionally: Remove their applications too if you want to clean up
      await Application.deleteMany({ studentEmail: email });
      res.json({ message: "Account and applications deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error during deletion");
  }
});
app.post("/api/student/upload-pic", upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { profilePic: req.file.path }, // This saves the path 'uploads/filename'
      { new: true }
    );
    res.json({ profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});
// 1. Define the Schema


// 2. Fetch Notifications Route
app.get("/api/notifications/:email", async (req, res) => {
  try {
    const notes = await Notification.find({ recipient: req.params.email }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 3. Mark as Read Route
app.put("/api/notifications/read/:id", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});
// PUT: Update Recruiter Profile
app.put("/api/recruiter/update/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { name, password } = req.body;
    
    let updateData = { name };
    
    // Only update password if a new one is provided
    if (password) {
      // Note: In a production app, you should hash the password here
      updateData.password = password; 
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: updateData },
      { new: true } // returns the modified document
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE: Delete Recruiter Account & Their Jobs
app.delete("/api/recruiter/delete/:email", async (req, res) => {
  try {
    const { email } = req.params;
    
    // 1. Delete the user
    await User.findOneAndDelete({ email: email });
    // 2. Delete all jobs posted by this recruiter
    await Job.deleteMany({ recruiterEmail: email });
    
    res.json({ message: "Account and jobs deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});