import { app } from "./app.js";
import dotenv from "dotenv";
import dbConnect from "./database/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

dbConnect()
    .then(() => {
        app.on("Error: ", (error) => {
            console.log("Express is not able to connect to Database");
        });

        app.listen(process.env.PORT, "0.0.0.0" , () => {
            console.log("App is listening on PORT " + process.env.PORT);
        });
    })
    .catch((e) => {
        console.log("Database Connection Failed: " + e);
    });
