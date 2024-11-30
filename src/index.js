import { configDotenv } from "dotenv";
import { connectDB } from "./db/index.js";

//dotenv configuration
configDotenv();
const port = process.env.PORT;
//database connection
connectDB();

//server connection
import app from "./app.js";

//localport connection
app.listen(3000, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
