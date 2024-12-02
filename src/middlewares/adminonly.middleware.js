import { User } from "../models/user.model.js";

export const adminonly = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(req.user);
    const usernow = await User.findById(user.id);

    if (usernow.role !== "admin") {
      return res.status(403).json({ message: "Access Denied", user });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error and you are not authorized as admin",
    });
  }
};
