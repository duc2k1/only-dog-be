import mongoose from "mongoose";
//-------------------------------------------------
export default async function connectToMongoDb() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB: ${process.env.DB_URL}`);
  } catch (error) {
    console.log(`❗️ MongoDB Error: ${error}`);
    process.exit(1);
  }
}
