import express from "express";
import { handleHighlight } from "../controllers/highlightController.js";

const router = express.Router();

router.post("/", handleHighlight);

export default router;
