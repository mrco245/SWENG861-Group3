import { createResistance, getResistanceById, deleteResistance } from "../controllers/resistence.controller.js";
import { createCardio, getCardioById, deleteCardio } from "../controllers/cardio.controller.js";
import { verifyToken } from "../utils/verifyUser.js"
import express from "express";

const router = express.Router();

// /api/fitness/cardio
router.post("/cardio", verifyToken, createCardio);

// /api/fitness/cardio/:id
router.get("/cardio/:id" , verifyToken, getCardioById)
router.delete("/cardio/:id" , verifyToken, deleteCardio);

// /api/fitness/resistance
router.post("/resistance", verifyToken, createResistance);

// /api/fitness/resistance/:id
router.get("/resistance/:id", verifyToken, getResistanceById)
router.delete("/resistance/:id", verifyToken, deleteResistance);

export default router;