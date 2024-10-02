import React, { useState, useEffect } from "react";
import "../styles/Health.css";  // Ensure the path is correct to health.css
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
  const [csrfToken, setCsrfToken] = useState(''); // CSRF token state

  // Fetch CSRF token
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await fetch("/api/csrf-token", {
          method: "GET",
          credentials: "include", // Include credentials for CSRF protection
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    getCsrfToken();
  }, []);

  // Function to validate inputs for weight and height
  const validateInputs = () => {
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

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
    if (!validateInputs()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    if (weightValue && heightValue) {
      const bmiValue = (weightValue / (heightValue * heightValue)).toFixed(2);
      setBmi(bmiValue);
      setMessage(`BMI successfully calculated! Your BMI is ${bmiValue}.`);
      updateMilestones(bmiValue);
      saveBmiToBackend(bmiValue);  // Save BMI to backend after calculation
    } else {
      setMessage("Invalid weight or height.");
    }

    setIsLoading(false);
  };

  // Function to update milestones including the date formatted next to the checkmark
  const updateMilestones = (bmiValue) => {
    const currentDate = new Date().toLocaleDateString(); // Get the current date
    let updates = [];

    if (bmiValue < 18.5) {
      updates.push(`✅ ${currentDate} - BMI is below the healthy range. Consider gaining weight.`);
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      if (bmiValue <= targetBmi) {
        updates.push(`✅ ${currentDate} - Achieved target BMI of ${targetBmi}.`);
      } else {
        updates.push(`✅ ${currentDate} - Reached a healthy BMI range (18.5 - 24.9).`);
      }
    } else if (bmiValue > 24.9) {
      updates.push(`✅ ${currentDate} - BMI is above the healthy range. Consider losing weight.`);
    }

    setMilestones(updates);  // Directly replace the milestones with the updated list
  };

  // Function to save BMI data to the backend
  const saveBmiToBackend = async (bmiValue) => {
    try {
      const response = await fetch("/api/bmi/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,  // Include CSRF token in headers
        },
        body: JSON.stringify({
          userId: "66fb72d6c25179876114da63",  // Replace with the logged-in user's ID
          bmi: bmiValue,
          note: "Auto-generated BMI entry"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("BMI entry successfully saved:", data);
      } else {
        console.log("Failed to save BMI:", data.message);
      }
    } catch (error) {
      console.error("Error saving BMI:", error);
    }
  };

  // Calculate progress toward the target BMI and round to 2 decimal places
  const calculateBmiProgress = (bmiValue) => {
    if (bmiValue && targetBmi) {
      return Math.min((bmiValue / targetBmi) * 100, 100).toFixed(2);
    }
    return 0;
  };

  return (
    <div className="mainWrapper">
      <div className="container1">
        <div className="titleContainer">BMI Input</div>
        <input
          type="text"
          placeholder="Enter your weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Enter your height (m)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="form-input"
        />
        <div className="buttonContainer">
          <button className="submit-btn" onClick={calculateBmi} disabled={isLoading}>
            {isLoading ? "Calculating..." : "Calculate BMI"}
          </button>
        </div>
        {message && (
          <p className={`feedbackMessage ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <ul className="resultList">
          <li>{bmi ? `Your BMI: ${bmi}` : 'Enter weight and height and click "Calculate BMI"'}</li>
        </ul>
      </div>
      <div className="container2">
        <div className="titleContainer">BMI Progress</div>
        <div className="circularProgressContainer">
          <CircularProgressbar
            value={calculateBmiProgress(bmi)}
            text={`${calculateBmiProgress(bmi)}%`}
            className="circularProgressBar"
          />
        </div>
        <div className="titleContainer">Milestones</div>
        <ul className="resultList milestone-list">
          {milestones.map((milestone, index) => (
            <li key={index} className="milestone-item">{milestone}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
