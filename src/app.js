import cors from "cors";
import express from "express";
import testrouter from "./routes/test.route.js";
import authrouter from "./routes/auth.route.js";
import userrouter from "./routes/user.route.js";
import adminrouter from "./routes/admin.route.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { adminonly } from "./middlewares/adminonly.middleware.js";
import { sessionProtected } from "./middlewares/cookieprotected.middleware.js";
import { configDotenv } from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
configDotenv();

const app = express();

const allowedOrigins = [
  "https://forecast-frontend-iwid.vercel.app",
  "http://localhost:3000", // for local development
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "a57cb2f7c4a1ef3a8a3c6a5bf213d998812de8fc7bb47da8b7347a92f9ec48d9",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "none",
    },
  })
);

//route imports
app.use("/api/v1/admin", sessionProtected, adminonly, adminrouter);
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
