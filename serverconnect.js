import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
const PORT = process.env.PORT || 5500;
dotenv.config();
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
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
