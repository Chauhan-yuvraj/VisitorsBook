import { Router } from "express";
import {
  GetVisitors,
  PostVisitor,
  GetVisitor,
  DeleteVisitor,
  UpdateVisitor
} from "../controllers/Visitor.controller";
import { authorize, protect } from "../middleware/auth.middleware";

const router = Router();

router
  .route("/")
  .get(protect, authorize('hr', 'admin', 'executive'), GetVisitors)
  .post(protect, authorize('hr', 'admin', 'executive'), PostVisitor);

router
  .route("/:id")
  .get(protect, authorize('hr', 'admin', 'executive'), GetVisitor)
  .patch(protect, authorize('hr', 'admin', 'executive'), UpdateVisitor)
  .delete(protect, authorize('hr', 'admin', 'executive'), DeleteVisitor);

export default router;
