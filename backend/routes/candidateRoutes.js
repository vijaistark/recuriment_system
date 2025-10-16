import express from "express";
import { registerCandidate, viewAssignment } from "../controllers/candidateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerCandidate);
router.get("/myAssignment", protect, viewAssignment);

export default router;
