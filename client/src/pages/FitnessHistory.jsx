// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import cardioIcon from "../assets/cardio-workout.png";
import resistanceIcon from "../assets/resistance-bands.png";

import { useSelector } from "react-redux";

export default function FitnessHistory() {
  const [userData, setUserData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [exerciseData, setExerciseData] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(6);
  const { currentUser } = useSelector((state) => state.user);

  let currentDate;

  const getCookie = async () => {
    const token = await fetch("/api/csrf-token");
    return token.json();
  };

  // everytime loggedIn/userdata changes, the getuserdata runs
  useEffect(() => {
    const getUserData = async () => {
      try {
        //get token
        const csrfToken = await getCookie();
        if (!csrfToken) return false;

        const response = await fetch(`/api/user/details/${currentUser._id}`, {
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

        const user = await response.json();

        // combine cardio and resistance data together
        if (user.cardio && user.resistance) {
          const cardio = user.cardio;
          const resistance = user.resistance;
          const exercise = cardio.concat(resistance);

          // sort exercise data by date
          exercise.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });

          //format date in exercise data
          exercise.forEach((item) => {
            item.date = formatDate(item.date);
          });

          setUserData(user);
          setExerciseData(exercise);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getUserData();
  }, [currentUser._id, userData]);

  function showMoreItems() {
    setDisplayedItems(displayedItems + 6);
  }

  return (
    <div className="history">
      <div className="d-flex flex-column align-items-center">
        <h2 className="title">Fitness History</h2>
        {exerciseData.length ? (
          <div className="history-data">
            {/* map the exercise data  */}
            {exerciseData.slice(0, displayedItems).map((exercise) => {
              let dateToDisplay;
              if (exercise.date !== currentDate) {
                currentDate = exercise.date;
                dateToDisplay = exercise.date;
              }
              return (
                <div className="history-div d-flex" key={exercise._id}>
                  <div className="date d-flex align-items-center">
                    {dateToDisplay}
                  </div>
                  <Link
                    className="text-decoration-none"
                    to={`/fitness/${exercise.type}/${exercise._id}`}
                  >
                    {exercise.type === "cardio" ? (
                      <div className="history-card cardio-title d-flex">
                        <div className="d-flex align-items-center">
                          <img
                            alt="cardio"
                            src={cardioIcon}
                            className="history-icon"
                          />
                        </div>
                        <div>
                          <p className="history-name">{exercise.name}</p>
                          <p className="history-index">
                            {exercise.distance} miles{" "}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="history-card resistance-title d-flex">
                        <div className="d-flex align-items-center">
                          <img
                            alt="resistance"
                            src={resistanceIcon}
                            className="history-icon"
                          />
                        </div>
                        <div>
                          <p className="history-name">{exercise.name}</p>
                          <p className="history-index">
                            {exercise.weight} pounds{" "}
                          </p>
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
            {/* show more items  */}
            {exerciseData.length > displayedItems ? (
              <div className="d-flex justify-content-center">
                <button className="show-btn" onClick={showMoreItems}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Show More
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <h3 className="history-text">No exercise data yet...</h3>
            <Link to="/fitness">
              <button className="home-btn">Add Exercise</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
