import { createBmi, getBmiById, deleteBmi, getAllBmiEntries } from "../controllers/bmi.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

const router = express.Router();

// /api/bmi - Create a new BMI entry
router.post("/",  createBmi);

// /api/bmi/:id - Get BMI entry by ID
router.get("/:id", verifyToken, getBmiById);

// /api/bmi/:id - Delete BMI entry by ID
router.delete("/:id", verifyToken, deleteBmi);

// /api/bmi/user/:userId - Get all BMI entries for a user
router.get("/user/:userId", verifyToken, getAllBmiEntries);

export default router;
