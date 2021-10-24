import mongoose from "mongoose";
//--------------------------------------------------------------
const Schema = mongoose.Schema;
//--------------------------------------------------------------
const PostSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  pathImage: {
    type: String,
    default:"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  },
  likes: {
    type: Array,
    default:[],
  },
  dislikes: {
    type: Array,
    default:[],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//--------------------------------------------------------------
export default mongoose.model("posts", PostSchema);
