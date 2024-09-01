import MessageModel from "../models/MessageModel.js";
import { renameSync, mkdirSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.json({
        success: false,
        message: "Both user ID's are required!",
      });
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.log("error", error.message);
    return res.json({ success: false, message: "Internal Server Error!" });
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "File is required!" });
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(req.file.path, fileName);

    return res.json({
      success: true,
      filePath: fileName,
    });
  } catch (error) {
    console.log("error", error.message);
    return res.json({ success: false, message: "Internal Server Error!" });
  }
};
