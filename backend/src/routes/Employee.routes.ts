import { Router } from "express";
import {
  GetEmployees,
  PostEmployee,
  GetEmployee,
  DeleteEmployee,
  UpdateEmployee,
  GetMe,
  GetActiveHostList,
  BulkImportEmployees
} from "../controllers/Employee.controller";
import { authorize, protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.get("/me", protect, GetMe)

// 2. For lightweight Kiosk Dropdown (Name, Avatar, ID only)
router.get("/active-list", protect, authorize('hr', 'admin', 'executive'), GetActiveHostList);

// 3. For onboarding (CSV Import)
router.post("/import", protect, authorize('hr', 'admin', 'executive'), BulkImportEmployees);

router
  .route("/")
  .get(protect, authorize('hr', 'admin', 'executive'), GetEmployees)   // GET all employees
  // .get(GetEmployees)   // GET all employees
  .post(protect, authorize('hr', 'admin', 'executive'), upload.single('profileImg'), PostEmployee); // Create employee
// .post(PostEmployee); // Create employee

router
  .route("/:id")
  .get(protect, authorize('hr', 'admin', 'executive'), GetEmployee)     // GET one employee
  .patch(protect, authorize('hr', 'admin', 'executive'), upload.single('profileImg'), UpdateEmployee) // Update employee
  .delete(protect, authorize('hr', 'admin', 'executive'), DeleteEmployee); // Delete employee

export default router;
