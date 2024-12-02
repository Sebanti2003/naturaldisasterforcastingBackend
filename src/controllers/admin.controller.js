import { User } from "../models/user.model.js";

export const getallusers = async (req, res) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json({ success: true, message: "Users Found", users });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
export const deletalleuser = async (req, res) => {
  try {
    const user = await User.deleteMany();
    return res
      .status(200)
      .json({
        success: true,
        message: "User Deleted Successfully",
        user,
        userlength: user.length,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
