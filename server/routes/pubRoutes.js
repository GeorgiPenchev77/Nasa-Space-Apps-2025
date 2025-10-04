import express from "express";
import { getPMCXml } from "../controllers/pubController.js";
const router = express.Router();

router.get("/get-xml", getPMCXml);

export default router;
