import mongoose from "mongoose";
const Schema = mongoose.Schema;
//--------------------------------------------------------------
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    min:3,
    max:25,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max50,
    min:3,
  },
  password: {
    type: String,
    required: true,
    min:6
  },
  pathAvatar: {
    type: String,
    default:""
  },
  followers:{
    type:Array,
    default:[],
  },
  followings:{
    type:Array,
    default:[],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});
//--------------------------------------------------------------
export default mongoose.model("users", UserSchema);
