import express from "express";
import { generateTags, getTagMap, refreshTagCache } from "../controllers/articleController.js";

const router = express.Router();

router.post("/rebuild-tags", refreshTagCache);
router.post("/generate-tags", generateTags);

router.get("/tags", getTagMap)

export default router;
