import { Router } from "express";
import basicAuth from "../auth/basicAuth.js";
import {
    getSkills, addSkills, getTopSkills
} from "../controllers/skills.controller.js";

const router = Router();

// Protected Routes
router.route("/addSkills/:userId").patch(basicAuth, addSkills);

// Open Routes
router.route("/getSkills/:userId").get(getSkills);
router.route("/getTopSkills/:userId").get(getTopSkills);

export default router;