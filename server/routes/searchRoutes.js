import express from "express";
import { searchLinks } from "../controllers/searchController.js";
const router = express.Router();

router.get("/links", searchLinks);

export default router;
