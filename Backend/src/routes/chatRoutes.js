
import express from "express";
const router = express.Router();

import { chatWithBot } from "../controllers/chatController.js";

router.post("/", chatWithBot);

export default router;