import mongoose from "mongoose";
const Schema = mongoose.Schema;
//--------------------------------------------------------------
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pathAvatar: {
    type: String,
    default: "images/dog.jpg",
  },
  posts: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//--------------------------------------------------------------
export default mongoose.model("users", UserSchema);
