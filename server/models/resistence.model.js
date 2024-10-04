import mongoose from "mongoose";

const ResistanceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "resistance",
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 30
    },
    weight: {
      type: Number,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
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

const Resistance = mongoose.model("Resistance", ResistanceSchema, "resistance");

export default Resistance;