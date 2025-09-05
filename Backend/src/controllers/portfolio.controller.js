import { Portfolio } from "../models/portfolio.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProfile = async (req, res) => {
    const { fullName, email, education, skills, projects, links } = req.body;

    if (!(fullName && email && education && skills && projects && links)) {
        return new ApiError(400, "All credentials are required");
    }

    const profile = await Portfolio.create({
        fullName: fullName,
        email: email,
        education: education,
        skills: skills,
        projects: projects,
        links: links,
    });

    if (!profile) {
        throw new ApiError(401, "Error in creating profile");
    }
    console.log(profile);

    return res
        .status(200)
        .json(new ApiResponse(200, "Profile Successfully Created", profile));
};

const getProfile = async (req, res) => {
    try {
        // Get the first available profile or find by a specific identifier
        const profile = await Portfolio.findOne({}) || await Portfolio.findOne({
            fullName: "Harsh Bhalwar",
        });

        if (!profile) {
            return res.status(404).json(new ApiError(404, "No profile found in the database"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Successfully fetched profile.", profile));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in retrieving profile from MongoDB"));
    }
};

const updateFullProfile = async (req, res) => {
    const { fullName, email, education, skills, projects, links } = req.body;

    if (!(fullName && email && education && skills && projects && links)) {
        return new ApiError(400, "All credentials are required");
    }

    const update = {
        fullName,
        email,
        education,
        skills,
        projects,
        links,
    };

    const profile = await Portfolio.findOneAndUpdate(
        {
            fullName: "Harsh Bhalwar",
        },
        update,
        {
            new: true,
        }
    );

    if (!profile) {
        throw new ApiError(401, "Error in creating profile");
    }
    console.log(profile);

    return res
        .status(200)
        .json(new ApiResponse(200, "Profile Successfully Modified", profile));
};

const updateProfile = async (req, res) => {
    const { education, skills, projects, links } = req.body;

    const updates = {};

    if (education) updates.education = education;
    if (skills) updates.skills = skills;
    if (projects) updates.projects = projects;
    if (links) updates.links = links;

    try {
        const updatedProfile = await Portfolio.findOneAndUpdate(
            {
                fullName: "Harsh Bhalwar",
            },
            {
                $set: updates,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Profile Successfully Updated",
                    updatedProfile
                )
            );
    } catch (error) {
        return new ApiError(500, "Error encountered while updating profile");
    }
};

const deleteProfile = async (req, res) => {
    try {
        const deletedProfile = await Portfolio.findOneAndDelete({
            fullName: "Harsh Bhalwar",
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Profile Successfully Deletd",
                    deletedProfile
                )
            );
    } catch (error) {
        return new ApiError(500, "Error encountered while deleting profile");
    }
};

export {
    createProfile,
    getProfile,
    updateFullProfile,
    updateProfile,
    deleteProfile,
};
