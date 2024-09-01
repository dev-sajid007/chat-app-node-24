import express from "express";
import { getMessages } from "../controllers/MessagesController.js";
import {verifyToken} from "../middleware/AuthMiddleware.js";

const messageRouter = express.Router();

messageRouter.post("/get-messages",verifyToken,getMessages);

export default messageRouter;