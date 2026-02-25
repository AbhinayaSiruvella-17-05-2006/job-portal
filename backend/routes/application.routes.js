import express from "express";
import {
  applyJob,
  updateStatus,
  getApplications
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/apply", applyJob);
router.post("/update", updateStatus);
router.get("/", getApplications);

export default router;
