import express from "express";
import {
  createDelivery,
  getDeliveries,
  updateDeliveryStatus,
  deleteDelivery,
} from "../controllers/Delivery.controller";

const router = express.Router();

router.post("/", createDelivery);
router.get("/", getDeliveries);
router.patch("/:id/status", updateDeliveryStatus);
router.delete("/:id", deleteDelivery);

export default router;
