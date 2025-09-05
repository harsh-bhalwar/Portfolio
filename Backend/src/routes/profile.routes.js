import { Router } from "express";
import basicAuth from "../auth/basicAuth.js";
import {
    createProfile,
    getProfile,
    updateFullProfile,
    updateProfile,
    deleteProfile,
} from "../controllers/portfolio.controller.js";
const router = Router();

// Protected Routes
router.route("/create-profile").post(basicAuth, createProfile);

router.route("/updateFullProfile").put(basicAuth, updateFullProfile);

router.route("/updateProfile").patch(basicAuth, updateProfile);

router.route("/deleteProfile").delete(basicAuth, deleteProfile);

// Open Routes
router.route("/get-profile").get(getProfile);

export default router;
