import { Router } from "express";
import express from "express";

import { postVisitor } from "../controllers/Visitor.controller";
import { getRecords } from "../controllers/Record.controller";

const app = express();


const router = Router();
// Example route
router.get("/", getRecords);

// router.post("/", postVisitor);

export default router;