import express from "express";
import { chat, simplify } from "../controllers/geminiController.js";
const router = express.Router();

router.post("/chat", chat);
router.post("/simplify", simplify);

export default router;
