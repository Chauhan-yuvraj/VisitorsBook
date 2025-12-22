import { Router } from "express";
import { Login, RefreshAccessToken, Logout } from "../controllers/Auth.controller";

const router = Router();

router.post('/login', Login);

router.post("/logout", Logout); // Logout route

router.post("/refresh", RefreshAccessToken);

export default router;
