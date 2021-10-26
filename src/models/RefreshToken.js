import mongoose from "mongoose";
//--------------------------------------------------------------
const Schema = mongoose.Schema;
//--------------------------------------------------------------
const RefreshTokenSchema = new Schema({
  token: {
    type: Array,
    default: [],
  },
});
//--------------------------------------------------------------
export default mongoose.model("refreshToken", RefreshTokenSchema);
