// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";

export default function Home() {

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
      <Container data-testid="home" className="homepage">
      <div className="home d-flex flex-column align-items-center justify-content-center flex-wrap text-center">
        <h1 className="home-title">Your Daily Health & Fitness Tracker</h1>
        <p className="home-text">
          Cardio? Resistance? Or both? Track your daily exercises and stay fit
          with us.
        </p>
        {currentUser ?
          (
            <>
             <button className="home-btn" onClick={() => navigate("/fitness")}>Add Fitness Event</button>
             <button className="home-btn" onClick={() => navigate("/fitness/history")}>Show Fitness History</button>
             <button className="home-btn" onClick={() => navigate("/friends")}>View Friends</button>
            </>
        ) :
          (<button className="home-btn" onClick={() => navigate("/signup")}>Get Started</button>)}
      </div>
    </Container>
  );
}
