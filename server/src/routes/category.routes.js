
import { Router } from "express";
import { listCategories } from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.get("/", listCategories);

export default categoryRouter;
