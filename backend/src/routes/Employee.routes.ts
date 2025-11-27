import { Router } from "express";
import {
  GetEmployees,
  PostEmployee,
  GetEmployee,
  DeleteEmployee,
  UpdateEmployee
} from "../controllers/Employee.controller";

const router = Router();

router
  .route("/")
  .get(GetEmployees)   // GET all employees
  .post(PostEmployee); // Create employee

router
  .route("/:id")
  .get(GetEmployee)     // GET one employee
  .patch(UpdateEmployee) // Update employee
  .delete(DeleteEmployee); // Delete employee

export default router;
