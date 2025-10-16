import express from "express";
import { getAssignedCandidates, addGmeetLink } from "../controllers/recruiterController.js";
import { protect, recruiterOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/assigned", protect, recruiterOnly, getAssignedCandidates);
router.post("/addLink", protect, recruiterOnly, addGmeetLink);

export default router;
