// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { formatDate } from "../utils/formatDate";
import cardioIcon from "../assets/cardio-workout.png";
import resistanceIcon from "../assets/resistance-bands.png";

export default function SingleExercise() {
  const { id, type } = useParams();
  const [cardioData, setCardioData] = useState({});
  const [resistanceData, setResistanceData] = useState({});

  const navigate = useNavigate();

  const getCookie = async () => {
    const token = await fetch("/api/csrf-token");
    return token.json();
  };

  useEffect(() => {
    const displayExercise = async (exerciseId) => {
      //get token
      const csrfToken = await getCookie();
      if (!csrfToken) return false;

      // fetch cardio data by id
      if (type === "cardio") {
        try {
          const response = await fetch("/api/fitness/cardio/" + exerciseId, {
            method: "GET",
            credentials: "include",
            headers: {
              "x-csrf-token": csrfToken.csrfToken,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("something went wrong!");
          }

          const cardio = await response.json();
          cardio.date = formatDate(cardio.date);
          setCardioData(cardio);
        } catch (err) {
          console.error(err);
        }
      }

      // fetch resistance data by id
      else if (type === "resistance") {
        try {
          const response = await fetch(
            "/api/fitness/resistance/" + exerciseId,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "x-csrf-token": csrfToken.csrfToken,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("something went wrong!");
          }

          const resistance = await response.json();
          resistance.date = formatDate(resistance.date);
          setResistanceData(resistance);
        } catch (err) {
          console.error(err);
        }
      }
    };
    displayExercise(id);
  }, [id, type]);

  const handleDeleteExercise = async (exerciseId) => {
    const csrfToken = await getCookie();
    if (!csrfToken) return false;

    confirmAlert({
      title: "Delete Exercise",
      message: "Are you sure you want to delete this exercise?",
      buttons: [
        {
          label: "Cancel",
        },
        {
          label: "Delete",
          onClick: async () => {
            // delete cardio data
            if (type === "cardio") {
              try {
                const response = await fetch(
                  "/api/fitness/cardio/" + exerciseId,
                  {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                      "x-csrf-token": csrfToken.csrfToken,
                      "Content-Type": "application/json",
                    },
                  }
                );
                if (!response.ok) {
                  throw new Error("something went wrong!");
                }
              } catch (err) {
                console.error(err);
              }
            }

            // delete resistance data
            else if (type === "resistance") {
              try {
                const response = await fetch(
                  "/api/fitness/resistance/" + exerciseId,
                  {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                      "x-csrf-token": csrfToken.csrfToken,
                      "Content-Type": "application/json",
                    },
                  }
                );
                if (!response.ok) {
                  throw new Error("something went wrong!");
                }
              } catch (err) {
                console.error(err);
              }
            }

            // go back to fitness
            navigate("/fitness");
          },
        },
      ],
    });
  };

  return (
    <div className={type === "cardio" ? "single-cardio" : "single-resistance"}>
      <h2 className="title text-center">Fitness History Details</h2>
      <div className="single-exercise d-flex flex-column align-items-center text-center">
        {type === "cardio" && (
          <div className="cardio-div ">
            <div className="d-flex justify-content-center">
              <img
                alt="cardio"
                src={cardioIcon}
                className="exercise-form-icon"
              />
            </div>
            <p>
              <span>Date: </span> {cardioData.date}
            </p>
            <p>
              <span>Name: </span> {cardioData.name}
            </p>
            <p>
              <span>Distance: </span> {cardioData.distance} miles
            </p>
            <p>
              <span>Duration: </span> {cardioData.duration} minutes
            </p>
            <button
              className="delete-btn"
              onClick={() => handleDeleteExercise(id)}
            >
              Delete Exercise
            </button>
          </div>
        )}
        {type === "resistance" && (
          <div className="resistance-div">
            <div className="d-flex justify-content-center">
              <img
                alt="resistance"
                src={resistanceIcon}
                className="exercise-form-icon"
              />
            </div>
            <p>
              <span>Date: </span> {resistanceData.date}
            </p>
            <p>
              <span>Name: </span> {resistanceData.name}
            </p>
            <p>
              <span>Weight: </span> {resistanceData.weight} lbs
            </p>
            <p>
              <span>Sets: </span> {resistanceData.sets}
            </p>
            <p>
              <span>Reps: </span> {resistanceData.reps}
            </p>
            <button
              className="delete-btn"
              onClick={() => handleDeleteExercise(id)}
            >
              Delete Exercise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
