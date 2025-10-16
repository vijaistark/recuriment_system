import express from "express";
import { addRecruiter, getAllData } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addRecruiter", protect, adminOnly, addRecruiter);
router.get("/allData", protect, adminOnly, getAllData);

export default router;
