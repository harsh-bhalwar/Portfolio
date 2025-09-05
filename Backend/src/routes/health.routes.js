import { Router } from "express";
import { getHealth } from "../controllers/linkAndHealth.controller.js";

const router = Router();

router.route("/").get(getHealth);

export default router;


