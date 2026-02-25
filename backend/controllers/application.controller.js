import Application from "../models/Application.model.js";

export const applyJob = async (req, res) => {
  const application = new Application(req.body);
  await application.save();
  res.json(application);
};

export const updateStatus = async (req, res) => {
  const { id, status, message } = req.body;

  const app = await Application.findByIdAndUpdate(
    id,
    { status, message },
    { new: true }
  );

  res.json(app);
};

export const getApplications = async (req, res) => {
  const apps = await Application.find();
  res.json(apps);
};
