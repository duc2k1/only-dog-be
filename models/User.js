import mongoose from "mongoose";
//--------------------------------------------------------------
const Schema = mongoose.Schema;
const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
//--------------------------------------------------------------
const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    validate: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
    min: 3,
    max: 25,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    max: 50,
    min: 3,
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
