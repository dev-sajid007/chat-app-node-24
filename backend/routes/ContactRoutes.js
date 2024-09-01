import express from "express";
import { getContactForDmList, searchContacts } from "../controllers/ContactController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const contactRouter = express.Router();

contactRouter.post("/search", verifyToken, searchContacts);
contactRouter.get("/get-contacts-for-dm", verifyToken, getContactForDmList);

export default contactRouter;
