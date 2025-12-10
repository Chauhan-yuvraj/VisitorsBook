import express from "express";
import {
  createDelivery,
  getDeliveries,
  updateDeliveryStatus,
} from "../controllers/Delivery.controller";

const router = express.Router();

router.post("/", createDelivery);
router.get("/", getDeliveries);
router.put("/:id/status", updateDeliveryStatus);

export default router;
