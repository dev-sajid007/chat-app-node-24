import express from "express";
import { searchContacts } from "../controllers/ContactController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const contactRouter = express.Router();

contactRouter.post("/search", verifyToken, searchContacts);

export default contactRouter;
