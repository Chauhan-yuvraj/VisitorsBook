import express from "express";
import { protect, checkPermission } from "../middleware/auth.middleware";
import { 
    createDepartment, 
    getAllDepartments, 
    updateDepartment, 
    deleteDepartment 
} from "../controllers/department.controller";

const router = express.Router();

// Public (Authenticated) - Read Departments
router.get("/", protect, getAllDepartments);

// Protected (Admin, HR, Executive) - Manage Departments
router.post("/", protect, checkPermission('manage_departments'), createDepartment);
router.put("/:id", protect, checkPermission('manage_departments'), updateDepartment);
router.delete("/:id", protect, checkPermission('manage_departments'), deleteDepartment);

export default router;
