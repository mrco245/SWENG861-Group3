// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaDumbbell } from "react-icons/fa";

export default function FitnessHomepage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="d-flex flex-column align-items-center justify-content-center flex-wrap text-center">
        <h1 className="home-title">Fitness Tracker</h1>
        <FaDumbbell
          alt="Health Icon"
          className="health-icon"
        />
        <p className="home-text">
          Track your workouts or view your history to monitor your fitness progress.
        </p>
        <div className="button-container">
        <button
          className="home-btn"
          onClick={() => navigate("/fitness")}
        >
          Add A Workout
        </button>
        <button
          className="home-btn"
          onClick={() => navigate("/fitness/history")}
        >
          View Fitness History
        </button>
        </div>
      </div>
    </div>
  );
}
