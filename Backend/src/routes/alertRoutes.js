import express from "express";
import {
  sendAlert,
  getAlerts,
  getAlertById,
  resolveAlert,
} from "../controllers/alertController.js";

const router = express.Router();

router.post("/send", sendAlert);
router.get("/", getAlerts);
router.get("/:id", getAlertById);
router.patch("/:id/resolve", resolveAlert);

export default router;