import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {renameSync,unlinkSync} from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export const signUp = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists!" });
    }

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password are required!",
      });
    }

    const user = await UserModel.create({ email, password });

    const token = createToken(email, user.id);

    res.cookie("jwt", token, {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Internal Server Error!" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password are required!",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ success: false, message: "Pssword is incorrect!" });
    }

    const token = createToken(email, user.id);
    res.cookie("jwt", token, {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log("error", error.message);
    res.json({ success: false, message: "Internal Server Error!" });
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await UserModel.findById(req.userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found!" });
    }
    res.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
        profileSetup: userData.profileSetup,
      },
    });
  } catch (error) {
    console.log("error", error.message);
    res.json({ success: false, message: "Internal Server Error!" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.json({
        success: false,
        message: "Firstname Lastname  is required!",
      });
    }

    const userData = await UserModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
        profileSetup: userData.profileSetup,
      },
    });
  } catch (error) {
    console.log("error", error.message);
    res.json({ success: false, message: "Internal Server Error!" });
  }
};


export const addProfileImage =  async (req, res, next) => {
  try {
    
    if (!req.file) {
      return res.json({success:false,message:"File is required!"});
    }

    const date = Date.now();
    let fileName = "uploads/profiles/"+date+req.file.originalname;
    renameSync(req.file.path,fileName);
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      {image:fileName},
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      image:updatedUser.image
    });
  } catch (error) {
    console.log("error", error.message);
    res.json({ success: false, message: "Internal Server Error!" });
  }
};


export const removeProfileImage =  async (req, res, next) => {
  try {
    
    const {userId} = req;
    const user = await UserModel.findById(userId);
    if(!user){
      res.json({ success: false, message: "User not found!" });
    }

    if(user.image){
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();

    return res.json({
      success: true,
      message:"Profile image remove successfully!"
    });
  } catch (error) {
    console.log("error", error.message);
    return res.json({ success: false, message: "Internal Server Error!" });
  }
};