import { Portfolio } from "../models/portfolio.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllLinks = async (req, res, next) => {
    try {
        const links = await Portfolio.find().select("links");
        return res
            .status(200)
            .json(new ApiResponse(200, "Links retrieved successfully", links));
    } catch (error) {
        next(new ApiError(500, "Error retrieving links", error.stack));
    }
};

const getLinkByTitle = async (req, res, next) => {
    try {
        const { title } = req.params;

        // Case-insensitive regex search
        const portfolio = await Portfolio.findOne({
            "links.title": { $regex: new RegExp(`^${title}$`, "i") },
        }).select("links");

        if (!portfolio) {
            return res.status(404).json(new ApiResponse(404, "Link not found"));
        }

        // Extract the specific link (case-insensitive match)
        const linkObj = portfolio.links.find(
            (l) => l.title.toLowerCase() === title.toLowerCase()
        );

        return res
            .status(200)
            .json(new ApiResponse(200, "Link retrieved successfully", linkObj));
    } catch (error) {
        next(new ApiError(500, "Error retrieving link", error.stack));
    }
};

const addLink = async (req, res) => {
    const { linkData } = req.body;
    const portfolioId = req.params.userId;
    if (!linkData || !portfolioId) {
        return res
            .status(400)
            .json(new ApiError(400, "Link data and portfolio ID are required"));
    }
    const links = await Portfolio.findById(portfolioId).select("links");
    if (!links) {
        return res.status(404).json(new ApiError(404, "Link not found"));
    }
    links.push(linkData);
    await links.save();
    return res
        .status(200)
        .json(new ApiResponse(200, "Link added successfully", links));
};

const updateLink = async (req, res, next) => {
    try {
        const { title, linkData } = req.body;

        const updatedPortfolio = await Portfolio.findOneAndUpdate(
            { "links.title": title }, // find portfolio with that link title
            { $set: { "links.$.link": linkData } }, // update only the matched link
            { new: true } // return updated document
        );

        if (!updatedPortfolio) {
            return res.status(404).json(new ApiResponse(404, "Link not found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Link updated successfully",
                    updatedPortfolio
                )
            );
    } catch (error) {
        next(error);
    }
};

const getHealth = (req, res) => {
    return res.status(200).json(new ApiResponse(200, "Everything is OK"));
};

export { getAllLinks, getLinkByTitle, addLink, updateLink, getHealth };
