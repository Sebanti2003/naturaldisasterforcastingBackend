import { User } from "../models/user.model.js";

export const getuserinfo = async (req, res) => {
  try {
    const user = req.user;
    const userinfo = await User.findById(user.id).select("username email _id isVerified role");
    if (!userinfo) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res
      .status(200)
      .json({ success: true, message: "User Found", userinfo });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
