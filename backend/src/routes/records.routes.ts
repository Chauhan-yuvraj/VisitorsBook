import { Router } from "express";
import { deleteRecord, getRecords, postRecord } from "../controllers/Record.controller";




const router = Router();
// Example route
router.get("/", getRecords);
router.post("/", postRecord);
router.delete("/:id", deleteRecord);

export default router;