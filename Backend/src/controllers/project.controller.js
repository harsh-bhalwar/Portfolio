import { Portfolio } from "../models/portfolio.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET /projects → list all projects
export const getAllProjects = async (req, res, next) => {
    try {
        const portfolios = await Portfolio.find().select("projects");
        
        // Extract all projects from portfolios into a single array
        let allProjects = [];
        portfolios.forEach((portfolio) => {
            if (portfolio.projects && portfolio.projects.length > 0) {
                allProjects.push(...portfolio.projects);
            }
        });

        // Return response in the format frontend expects: { success: true, projects: [...] }
        return res.status(200).json(new ApiResponse(200, "Projects retrieved successfully", { projects: allProjects }));
    } catch (error) {
        next(new ApiError(500, "Error retrieving projects", error.stack));
    }
};

export const getProjectBySkill = async (req, res, next) => {
    try {
        const { skill } = req.query;

        let filter = {};

        if(!skill) {
            return res.status(400).json(new ApiError(400, "Skill is required"));
        }

        // Filter by skill if provided
        if (skill) {
            filter = {
                projects: {
                    $elemMatch: {
                        skillsUsed: { $regex: skill, $options: "i" },
                    },
                },
            };
        }

        const portfolios = await Portfolio.find(filter).select("projects");

        // Extract all projects from portfolios
        let allProjects = [];
        portfolios.forEach((portfolio) => {
            if (portfolio.projects && portfolio.projects.length > 0) {
                allProjects.push(...portfolio.projects);
            }
        });

        // If filtering by skill, only return projects that contain that skill
        if (skill) {
            allProjects = allProjects.filter((project) =>
                project.skillsUsed.some((skillItem) =>
                    skillItem.toLowerCase().includes(skill.toLowerCase())
                )
            );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Projects retrieved successfully",
                    allProjects
                )
            );
    } catch (error) {
        next(new ApiError(500, "Error retrieving projects", error.stack));
    }
};

// POST /projects → add a project
export const addProject = async (req, res, next) => {
    try {
        const portfolioId = req.params.userId;
        const { title, description, skillsUsed } = req.body;

        if (!portfolioId) {
            throw new ApiError(
                400,
                "Portfolio ID and project data are required"
            );
        }

        const portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) {
            throw new ApiError(404, "Portfolio not found");
        }

        // Validate project data
        if (
            !title ||
            !description ||
            !skillsUsed
        ) {
            throw new ApiError(
                400,
                "Title, description, and skills are required"
            );
        }

        // Add project to portfolio
        const projectData = {title, description, skillsUsed}
        portfolio.projects.push(projectData);
        await portfolio.save();

        const addedProject = portfolio.projects[portfolio.projects.length - 1];

        return res
            .status(201)
            .json(
                new ApiResponse(201, "Project added successfully", addedProject)
            );
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, "Error adding project", error.stack));
        }
    }
};

// GET /projects/:id → get a single project by ID
export const getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, "Project ID is required");
        }

        // Find portfolio containing the project
        const portfolio = await Portfolio.findOne({
            "projects._id": id,
        });

        if (!portfolio) {
            throw new ApiError(404, "Project not found");
        }

        // Find the specific project
        const project = portfolio.projects.id(id);

        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, "Project retrieved successfully", project)
            );
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, "Error retrieving project", error.stack));
        }
    }
};

// PUT /projects/:id → update a project
export const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            throw new ApiError(400, "Project ID is required");
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            throw new ApiError(400, "Update data is required");
        }

        // Find portfolio containing the project
        const portfolio = await Portfolio.findOne({
            "projects._id": id,
        });

        if (!portfolio) {
            throw new ApiError(404, "Project not found");
        }

        // Find and update the specific project
        const project = portfolio.projects.id(id);

        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        // Update project fields
        Object.keys(updateData).forEach((key) => {
            if (key === "skillsUsed" && Array.isArray(updateData[key])) {
                project[key] = updateData[key];
            } else if (key !== "_id" && key !== "__v") {
                project[key] = updateData[key];
            }
        });

        await portfolio.save();

        return res
            .status(200)
            .json(
                new ApiResponse(200, "Project updated successfully", project)
            );
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, "Error updating project", error.stack));
        }
    }
};

// DELETE /projects/:id → remove a project
export const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, "Project ID is required");
        }

        // Find portfolio containing the project
        const portfolio = await Portfolio.findOne({
            "projects._id": id,
        });

        if (!portfolio) {
            throw new ApiError(404, "Project not found");
        }

        // Remove the project
        portfolio.projects.pull(id);
        await portfolio.save();

        return res
            .status(200)
            .json(new ApiResponse(200, "Project deleted successfully", null));
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, "Error deleting project", error.stack));
        }
    }
};
