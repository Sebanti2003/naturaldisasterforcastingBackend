import { configDotenv } from "dotenv";
import { User } from "../models/user.model.js";
import { validatetheformatepasssword } from "../utils/passwordformatchecking.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
// import { SassArgumentList } from "sass";
configDotenv();
export const signup = async (req, res, next) => {
  try {
    const { username, email, password, role = "user" } = req.body;
    if (!username) {
      return res.status(400).json({
        message: "username is required",
      });
    }
    if (!email) {
      return res.status(400).json({
        message: "email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "password is required",
      });
    }
    if (!email.includes("@") || !email.includes(".com")) {
      return res.status(400).json({
        message: "Invalid email It should of correct format",
      });
    }
    if (!validatetheformatepasssword(password)) {
      return res.status(400).json({
        message:
          "Password is not strong enough. It should contain at least one letter and one number",
      });
    }
    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        message: "Password should be between 8 to 20 characters long",
      });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashsalt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, hashsalt);

    console.log("this is the password", hashedPassword);
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
    });
    const result = await sendEmail({
      email,
      emailType: "VERIFY",
      userid: newUser._id,
    });
    console.log(result);

    res.status(200).json({
      message: "User registered successfully",
      success: true,
      usermessage: `Welcome to our app ${newUser.username}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "email is required",
        success: false,
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "password is required",
        success: false,
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email",
        success: false,
      });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Email is not verified",
        success: false,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid password",
        success: false,
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET_KEY
    );
    res.cookie("cookietoken", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error in login",
      success: false,
    });
  }
};

export const veerificationtokencheck = async (req, res, next) => {
  try {
    // Extract user ID and token
    const { userid } = req.params;
    const { token } = req.query;
    const encoded = encodeURIComponent(token);
    console.log("userid=", userid, "\n", "query token=", token);

    // Find user with matching ID, token, and valid expiry time
    const user = await User.findOne({
      _id: userid,
      verificationToken: encoded,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found, Try Again" });
    }

    if (user.verificationToken !== encoded) {
      return res.status(400).json({
        message: "Invalid verification token",
        success: false,
        user: user.verificationToken,
        encoded,
        token,
      });
    }

    // Update the user
    const usernew = await User.findByIdAndUpdate(
      userid,
      {
        $set: { isVerified: true },
        $unset: { verificationToken: "", verificationTokenExpires: "" },
      },
      { new: true }
    );

    // Respond with success
    return res
      .status(200)
      .json({ message: "Verification successful", usernew, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error in veerificationtokencheck",
      success: false,
    });
  }
};
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("cookietoken", {
      httpOnly: true,
      secure: true,
    }); // Clears the cookie
    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error in logout",
      success: false,
    });
  }
};
export const forgotpasswordemailsent = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    const result = await sendEmail({
      email,
      emailType: "RESETPASSWORD",
      userid: user._id,
    });
    return res.status(200).json({
      message: "Email sent successfully for password reset",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error in forgotpassword",
      success: false,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { userid } = req.params;
    const { token } = req.query;
    const { newPassword } = req.body;
    const encoded = encodeURIComponent(token);
    // Find user and validate token
    const user = await User.findOne({
      _id: userid,
      forgotPasswordToken: encoded,
      forgotPasswordTokenExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
        success: false,
      });
    }
    const hashsalt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, hashsalt);
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error in resetPassword",
      success: false,
    });
  }
};
