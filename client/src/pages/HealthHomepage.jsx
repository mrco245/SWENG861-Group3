import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap"; // Import Bootstrap Container
import "../styles/Health.css";
import healthIcon from "../assets/health.png"; // Ensure the correct path to the image

export default function HealthHomepage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="d-flex flex-column align-items-center justify-content-center flex-wrap text-center">
        <h1 className="home-title">Your Health & BMI Tracker</h1>
        <img
          src={healthIcon}
          alt="Health Icon"
          className="health-icon"
        />
        <p className="home-text">
          Track your BMI and view your history to monitor your health progress.
        </p>
        <div className="button-container">
        <button
          className="home-btn"
          onClick={() => navigate("/health")}
        >
          Calculate BMI
        </button>
        <button
          className="home-btn"
          onClick={() => navigate("/bmihistory")}
        >
          View BMI History
        </button>
        </div>
      </div>
    </div>
  );
}
