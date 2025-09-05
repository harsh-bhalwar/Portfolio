import { Portfolio } from "../models/portfolio.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getSkills = async (req, res) => {
    try {
        const profile = await Portfolio.findById(req.params.userId);
        const skills = profile.skills;

        return res
            .status(200)
            .json(new ApiResponse(200, "Successfully fetched skills.", skills));
    } catch (error) {
        return new ApiError(500, "Error in retrieving skills from MongoDB");
    }
};

const addSkills = async (req, res) => {
    try {
        const { userId } = req.params;
        const { category, skills } = req.body;
        // skills should be an array of strings

        if (!category || !Array.isArray(skills) || skills.length === 0) {
            return res
                .status(400)
                .json({ error: "Category and skills array are required." });
        }

        const update = {};
        update[`skills.${category}`] = { $each: skills };

        const updatedPortfolio = await Portfolio.findByIdAndUpdate(
            userId,
            { $addToSet: update }, // prevents duplicates
            { new: true, upsert: true }
        );

        if (!updatedPortfolio) {
            return res
                .status(404)
                .json(new ApiError(404, "Portfolio not found"));
        }

        res.status(200).json(
            new ApiResponse(200, "Successfully added skills.", updatedPortfolio)
        );
    } catch (err) {
        res.status(500).json({ error });
    }
};

const getTopSkills = async (req, res) => {
    try {
        const { userId } = req.params;

        const profile = await Portfolio.findById(userId);

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const { skills } = profile;

        // Flatten all skills into one array (ignoring coursework/soft skills if needed)
        const allSkills = [
            ...skills.languages,
            ...skills.frontend,
            ...skills.backend,
            ...skills.databases,
            ...skills.tools,
        ];

        // Pick only top N skills (you can adjust to 6, 8, 10 etc.)
        const topSkills = allSkills.slice(0, 8);

        return res.status(200).json(new ApiResponse(200, "Successfully fetched top skills.", topSkills));
    } catch (error) {
        return new ApiError(500, "Error in retrieving top skills from MongoDB");
    }
};

export { getSkills, addSkills, getTopSkills };
