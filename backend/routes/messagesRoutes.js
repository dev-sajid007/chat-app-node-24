import express from "express";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from "multer";

const messageRouter = express.Router();

const upload = multer({ dest: "uploads/files" });

messageRouter.post("/get-messages", verifyToken, getMessages);
messageRouter.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile
);

export default messageRouter;
