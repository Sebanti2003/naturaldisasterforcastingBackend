export const sessionProtected = (req, res, next) => {
  try {
    // Check if session user exists
    if (!req.session.user) {
      return res.status(403).json({
        message: "Session is missing! Please log in again.",
        success: false,
      });
    }

    // Pass the user to the next middleware/handler
    console.log(req.session.user);
    
    req.user = req.session.user;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Session verification failed",
      success: false,
      error: error.message,
    });
  }
};
