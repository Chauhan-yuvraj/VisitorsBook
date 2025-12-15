import { Router } from "express";
import { deleteRecord, getRecords, postRecord } from "../controllers/Record.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();
// Example route
router.get("/", getRecords);
router.post("/", upload.single('audio'), postRecord);
router.delete("/:id", deleteRecord);

export default router;