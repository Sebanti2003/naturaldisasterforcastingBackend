import cors from "cors";
import express from "express";
import testrouter from "./routes/test.route.js";
import authrouter from "./routes/auth.route.js";
import userrouter from "./routes/user.route.js";
import adminrouter from "./routes/admin.route.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { adminonly } from "./middlewares/adminonly.middleware.js";
import { cookieprotected } from "./middlewares/cookieprotected.middleware.js";


const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//route imports
app.use("/api/v1/admin", cookieprotected, adminonly, adminrouter);
app.use("/api/v1/user/test", testrouter);
app.use("/api/v1/user/auth", authrouter);
app.use("/api/v1/user", userrouter);
app.use("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Natural Disaster Forecasting Backend",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
