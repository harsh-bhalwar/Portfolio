import { Schema, model } from "mongoose";

const portfolioSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        education: [
            {
                school: {
                    type: String,
                    required: true,
                },
                marks: {
                    type: String,
                    required: true,
                },
                domain: {
                    type: String,
                    required: true,
                },
                duration: {
                    type: String,
                },
            },
        ],
        skills: {
            languages: [String],
            frontend: [String],
            backend: [String],
            databases: [String],
            tools: [String],
            coursework: [String],
            soft_skills: [String],
        },
        projects: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true, // Removes extra spaces
                },
                description: {
                    type: String,
                    required: true,
                    trim: true, // Removes extra spaces
                },
                skillsUsed: [
                    {
                        type: String,
                        required: true,
                    },
                ],
                github_repository: {
                    type: String,
                    trim: true, // Removes extra spaces
                    validate: {
                        validator: function (value) {
                            return /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(
                                value
                            );
                        },
                        message: "Invalid GitHub repository URL.",
                    },
                },
            },
        ],
        links: [
            {
                title: {
                    type: String,
                    required: true,
                },
                link: {
                    type: String,
                    required: true,
                    validate: {
                        validator: function (v) {
                            return /^(https?:\/\/)/.test(v);
                        },
                        message: "Invalid URL format.",
                    },
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Portfolio = model("Portfolio", portfolioSchema);
