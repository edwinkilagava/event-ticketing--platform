
import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

import {
  getDashboardStatsController,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

// Every route in this router requires an authenticated admin.
adminRouter.use(authenticate, authorize("admin"));

adminRouter.get(
  "/dashboard/stats",
  getDashboardStatsController,
);

export default adminRouter;
