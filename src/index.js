import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
configDotenv();
const app = express();




const port =process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.get("/", (req, res) => {
  res.status(200).json({
      message: "Your server is running perfectly!!!"
  });
});

app.listen(3000, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
