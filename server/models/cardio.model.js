import mongoose from "mongoose";

const CardioSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "cardio",
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 30
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }
);

const Cardio = mongoose.model("Cardio", CardioSchema, "cardio");

export default Cardio;