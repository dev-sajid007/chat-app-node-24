import express from "express";
import { getUserInfo, login, signUp, updateProfile, addProfileImage, removeProfileImage, logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from "multer";
const authRouter = express.Router();
const upload = multer({dest:"uploads/profiles/"});

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/user-info", verifyToken, getUserInfo);
authRouter.post("/update-profile", verifyToken, updateProfile);
authRouter.post("/add-profile-image", verifyToken,upload.single("profile-image") ,addProfileImage);
authRouter.delete("/remove-profile-image",verifyToken,removeProfileImage);
authRouter.post("/logout",logout);
export default authRouter;
