import UserModel from "../models/UserModel.js";

export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    if (searchTerm === undefined || searchTerm === null) {
      return res.json({ success: false, message: "SearchTerm required!" });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await UserModel.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
        },
      ],
    });

    return res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.log("error", error.message);
    return res.json({ success: false, message: "Internal Server Error!" });
  }
};
