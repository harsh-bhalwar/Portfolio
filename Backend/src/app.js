import cors from "cors";
import express from "express";
import profileRoutes from "./routes/profile.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import projectRoutes from "./routes/project.routes.js";
import linkRoutes from "./routes/link.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.ORIGIN || "http://localhost:5173",
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        limit: "16kb",
    })
);

// Profile Routes
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/skills", skillsRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/links", linkRoutes);
app.use("/api/v1/health", healthRoutes);

export { app };
