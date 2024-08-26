import express from "express";
import { getUserInfo, login, signUp, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/user-info", verifyToken, getUserInfo);
authRouter.post("/update-profile", verifyToken, updateProfile);

export default authRouter;
