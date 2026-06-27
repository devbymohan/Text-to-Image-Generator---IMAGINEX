// backend/routes/imageRoutes.js
import express from "express";
import { generateImage, getUserImages } from "../controllers/imagecontroller.js";
import userAuth from "../middlewares/auth.js"; // Keep your middleware import

const imageRouter = express.Router();

// Route to generate an image
imageRouter.post("/generate-image", userAuth, generateImage);

// Route to get all images of the logged-in user
imageRouter.get("/my-images", userAuth, getUserImages);

export default imageRouter;