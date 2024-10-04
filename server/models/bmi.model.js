import mongoose from "mongoose";

// Define the BMI Schema
const BMISchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model
      required: true
    },
    bmi: {
      type: Number,
      required: true
    },
    note: {
      type: String,
      maxlength: 100,  
      default: ""
    },
    date: {
      type: Date,
      default: Date.now,  
      required: true
    }
  },
  { timestamps: true } 
);

// Create the BMI model
const BMI = mongoose.model("BMI", BMISchema, "bmi");

export default BMI;
