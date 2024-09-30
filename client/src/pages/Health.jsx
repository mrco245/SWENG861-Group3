import React, { useState } from "react";
import "../styles/health.css";  // Ensure the path is correct to health.css
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Health() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [targetBmi, setTargetBmi] = useState(24.9);  // Default healthy BMI target
  const [milestones, setMilestones] = useState([]);
  const [message, setMessage] = useState('');  // For both error and success messages
  const [isLoading, setIsLoading] = useState(false);  // Loading state for feedback

  // Function to validate inputs for weight and height
  const validateInputs = () => {
    const weightValue = parseFloat(weight);  // Convert input to number
    const heightValue = parseFloat(height);  // Convert input to number

    if (!weightValue || !heightValue) {
      setMessage("Please enter both weight and height.");
      return false;
    }
    if (weightValue <= 0 || heightValue <= 0) {
      setMessage("Please enter valid positive numbers for weight and height.");
      return false;
    }
    setMessage('');  // Clear message if everything is valid
    return true;
  };

  // Function to calculate BMI based on weight and height when the button is clicked
  const calculateBmi = async () => {
    if (!validateInputs()) return;  // Validate inputs before calculation

    setIsLoading(true);  // Show loading state
    await new Promise(resolve => setTimeout(resolve, 500));  // Simulate loading time

    // Convert weight and height to numbers
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    if (weightValue && heightValue) {
      const bmiValue = (weightValue / (heightValue * heightValue)).toFixed(2);
      setBmi(bmiValue);
      setMessage(`BMI successfully calculated! Your BMI is ${bmiValue}.`);  // Success message
      checkBmiMilestones(bmiValue);  // Check milestones after calculating BMI
    } else {
      setMessage("Invalid weight or height.");  // Error message
    }

    setIsLoading(false);  // Hide loading state
  };

  // Function to check and update BMI-related milestones
  const checkBmiMilestones = (bmiValue) => {
    let newMilestones = [];

    // Underweight: BMI less than 18.5
    if (bmiValue < 18.5) {
      newMilestones.push("BMI is below the healthy range. Consider gaining weight.");
    }

    // Healthy range: BMI between 18.5 and 24.9
    if (bmiValue >= 18.5 && bmiValue < 25) {
      newMilestones.push("Reached a healthy BMI range (18.5 - 24.9)");
    }

    // Overweight: BMI greater than 24.9
    if (bmiValue > 24.9) {
      newMilestones.push("BMI is above the healthy range. Consider losing weight.");
    }

    // Achieved target BMI
    if (bmiValue <= targetBmi) {
      newMilestones.push(`Achieved target BMI of ${targetBmi}`);
    }

    setMilestones(newMilestones);  // Update the milestones state
  };

  // Calculate progress toward the target BMI and round to 2 decimal places
  const calculateBmiProgress = (bmiValue) => {
    if (bmiValue && targetBmi) {
      const progress = Math.min((bmiValue / targetBmi) * 100, 100);
      return progress.toFixed(2);  // Round to 2 decimal places
    }
    return 0;
  };

  return (
    <div className="mainWrapper">
      {/* Container for BMI Input */}
      <div className="container1">
        <div className="titleContainer">BMI Input</div>
        <input
          type="text"
          placeholder="Enter your weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your height (m)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <div className="buttonContainer">
          <button className="largeButton" onClick={calculateBmi} disabled={isLoading}>
            {isLoading ? "Calculating..." : "Calculate BMI"}
          </button>
        </div>

        {/* Conditionally styled feedback message */}
        {message && (
          <p className={`feedbackMessage ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        <ul className="resultList">
          <li>{bmi ? `Your BMI: ${bmi}` : 'Enter weight and height and click "Calculate BMI"'}</li>
        </ul>
      </div>

      {/* Display Circular Progress Bar for BMI Progress */}
      <div className="container2">
        <div className="titleContainer">BMI Progress</div>
        <div className="circularProgressContainer">
          <CircularProgressbar 
            value={calculateBmiProgress(bmi)} 
            text={`${calculateBmiProgress(bmi)}%`}
            className="circularProgressBar"
          />
        </div>

        {/* Display Milestone Progress */}
        <div className="titleContainer">Milestones</div>
        <ul className="resultList">
          {milestones.length > 0 ? (
            milestones.map((milestone, index) => (
              <li key={index}>
                <span className="milestoneAchieved">✅</span> {milestone}
              </li>
            ))
          ) : (
            <li className="emptyResults">No milestones yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}
