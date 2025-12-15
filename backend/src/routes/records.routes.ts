import { Router } from "express";
import { deleteRecord, getRecords, postRecord } from "../controllers/Record.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();
// Example route
router.get("/", getRecords);
router.post("/", upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1 }]), postRecord);
router.delete("/:id", deleteRecord);

export default router;