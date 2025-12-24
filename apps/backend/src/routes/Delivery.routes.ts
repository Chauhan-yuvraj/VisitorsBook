import express from "express";
import {
  createDelivery,
  getDeliveries,
  updateDeliveryStatus,
  deleteDelivery,
} from "../controllers/Delivery.controller";
import { checkPermission, protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, checkPermission('manage_deliveries', 'manage_self_deliveries'), createDelivery);
router.get("/", protect, checkPermission('manage_deliveries', 'manage_self_deliveries'), getDeliveries);
router.patch("/:id/status", protect, checkPermission('manage_deliveries', 'manage_self_deliveries'), updateDeliveryStatus);
router.delete("/:id", protect, checkPermission('manage_deliveries', 'manage_self_deliveries'), deleteDelivery);

export default router;
