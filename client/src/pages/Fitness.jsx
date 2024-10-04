// eslint-disable-next-line no-unused-vars
import React from "react";

import { useNavigate } from "react-router-dom";
import cardioIcon from "../assets/cardio-workout.png";
import resistanceIcon from "../assets/resistance-bands.png";

export default function Fitness() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="exercise d-flex flex-column align-items-center">
        <h2 className="title">Add Fitness Event</h2>
        <div>
          <button
            className="cardio-btn d-flex flex-column  align-items-center justify-content-center"
            onClick={() => navigate("/fitness/cardio")}
          >
            <img alt="cardio" src={cardioIcon} className="exercise-icon" />
            Cardio
          </button>
        </div>
        <div>
          <button
            className="resistance-btn d-flex flex-column  align-items-center justify-content-center"
            onClick={() => navigate("/fitness/resistance")}
          >
            <img
              alt="resistance"
              src={resistanceIcon}
              className="exercise-icon"
            />
            Resistance
          </button>
        </div>
      </div>
    </div>
  );
}
