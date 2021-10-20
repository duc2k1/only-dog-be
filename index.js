import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
const app = express();
const PORT = process.env.PORT || 5500;

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/myapp`, {
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

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
