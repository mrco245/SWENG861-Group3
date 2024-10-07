// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { FaDumbbell, FaHeartbeat, FaUserFriends } from "react-icons/fa";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <Container data-testid="home" className="homepage">
      <div className="home d-flex flex-column align-items-center justify-content-center flex-wrap text-center">
        <h1 className="home-title">Your Daily Fitness & Health Tracker</h1>
        <span className="flex">
          <FaDumbbell  alt="Fitness Icon" className="home-icon" />
          <FaHeartbeat alt="Health Icon" className="home-icon" />
          <FaUserFriends alt="Friends Icon" className="home-icon"/>
        </span>
        {currentUser ? (
          <>
            <button
              className="home-btn"
              onClick={() => navigate("/fitness/home")}
            >
              Show Fitness Tracker
            </button>
            <button
              className="home-btn"
              onClick={() => navigate("/health/home")}
            >
              Show Health Tracker
            </button>
            <button className="home-btn" onClick={() => navigate("/friends")}>
              Show Friends
            </button>
          </>
        ) : (
          <button className="home-btn" onClick={() => navigate("/signup")}>
            Get Started
          </button>
        )}
      </div>
    </Container>
  );
}
