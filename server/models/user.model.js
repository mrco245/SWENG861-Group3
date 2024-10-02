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
    profilePicture: {
      type: String,
    },

     // Add this for BMI tracking
     bmi: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BMI"  // Reference the BMI model
      }
    ]

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
