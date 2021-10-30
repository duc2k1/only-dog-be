import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./src/routes/auth.js";
import postRouter from "./src/routes/post.js";
import userRouter from "./src/routes/user.js";
import path from "path";
//--------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5500;
require("dotenv").config();
const __dirname = path.resolve();
//--------------------------------------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();
//--------------------------------------------------------------
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/images", express.static(__dirname + "/src/images"));
//--------------------------------------------------------------
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
