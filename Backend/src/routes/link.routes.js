import { Router } from "express";
import basicAuth from "../auth/basicAuth.js";
import { getAllLinks, getLinkByTitle, addLink, updateLink, getHealth } from "../controllers/linkAndHealth.controller.js";

const router = Router();

router.route("/getAllLinks").get(getAllLinks);
router.route("/getLinkByTitle/:title").get(getLinkByTitle);
router.route("/health").get(getHealth);

// Protected routes
router.route("/addLink").post(basicAuth, addLink);
router.route("/updateLink").put(basicAuth, updateLink);

export default router;