import { Router } from "express";
import basicAuth from "../auth/basicAuth.js";
import {
    getProjectBySkill,
    addProject,
    getProjectById,
    updateProject,
    deleteProject,
    getAllProjects
} from "../controllers/project.controller.js";

const router = Router();

// GET /projects → list all projects (with optional skill filtering)
router.route("/getAllProjects").get(getAllProjects);
router.route("/getProjectBySkill").get(getProjectBySkill);
router.route("/getProject/:id").get(getProjectById);

// POST /projects → add a project
router.route("/addProject/:userId").post(basicAuth, addProject);


// GET /projects/:id → get a single project by ID

// PUT /projects/:id → update a project
router.route("/updateProject/:id").put(basicAuth, updateProject);

// DELETE /projects/:id → remove a project
router.route("/deleteProject/:id").delete(basicAuth, deleteProject);

export default router;
