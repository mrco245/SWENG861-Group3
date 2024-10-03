import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
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
    friends: {
        type: Array,
    },
    friendRequests: {
        type: Array,
    },
    sentFriendRequests: {
        type: Array,
    },
    cardio: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cardio"
    }],
    resistance: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resistance"
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");

export default User;
