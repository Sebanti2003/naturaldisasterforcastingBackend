import jwt from "jsonwebtoken";

export const cookieprotected = (req, res, next) => {
  try {
    const token = req.cookies.cookietoken;
    if (!token) {
      return res.status(403).json({
        message: "Token is missing!",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Token verification failed",
      success: false,
      error: error.message,
    });
  }
};
