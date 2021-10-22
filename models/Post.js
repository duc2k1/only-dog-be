import mongoose from "mongoose";
const Schema = mongoose.Schema;
//--------------------------------------------------------------
const PostSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  pathImage: {
    type: String,
    required: true,
  },
  numberOfLike: {
    type: Number,
    required: true,
  },
  numberOfDislike: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//--------------------------------------------------------------
export default mongoose.model("posts", PostSchema);
