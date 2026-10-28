
import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// Public authentication endpoints.
authRouter.post("/register", register);
authRouter.post("/login", login);

// Only authenticated users can retrieve their account.
authRouter.get("/me", authenticate, getCurrentUser);

export default authRouter;
