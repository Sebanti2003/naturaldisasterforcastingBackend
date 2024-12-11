import { configDotenv } from "dotenv";
import { connectDB } from "./db/index.js";
// import express from "express";
// import openai from "openai";
//dotenv configuration
import app from './app.js'
configDotenv();
const port = process.env.PORT;
//database connection
connectDB();

//localport connection
app.listen(3000, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
