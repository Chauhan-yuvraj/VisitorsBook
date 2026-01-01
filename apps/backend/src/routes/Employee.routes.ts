import { Router } from "express";
import {
  GetEmployees,
  PostEmployee,
  GetEmployee,
  DeleteEmployee,
  UpdateEmployee,
  GetMe,
  UpdateMe,
  GetActiveHostList,
  BulkImportEmployees,
  ToggleEmployeeStatus,
} from "../controllers/Employee.controller";
import { checkPermission, protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.get("/me", protect, GetMe);
router.patch("/me", protect, upload.single("profileImg"), UpdateMe);

// 2. For lightweight Kiosk Dropdown (Name, Avatar, ID only)
router.get(
  "/active-list",
  protect,
  checkPermission("manage_employees"),
  GetActiveHostList
);

// 3. For onboarding (CSV Import)
router.post(
  "/import",
  protect,
  checkPermission("manage_employees"),
  BulkImportEmployees
);

router
  .route("/")

  .get(
    protect,
    checkPermission("manage_employees", "view_employee"),
    GetEmployees
  )

  .post(
    protect,
    checkPermission("manage_employees"),
    upload.single("profileImg"),
    PostEmployee
  );

router
  .route("/:id")
  .get(protect, checkPermission("manage_employees"), GetEmployee)

  .patch(
    protect,
    checkPermission("manage_employees"),
    upload.single("profileImg"),
    UpdateEmployee
  ) // Update employee

  .delete(protect, checkPermission("manage_employees"), DeleteEmployee); // Delete employee

router.patch(
  "/:id/toggle-status",
  protect,
  checkPermission("manage_employees"),
  ToggleEmployeeStatus
);

export default router;
