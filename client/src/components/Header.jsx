// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/signin";
  const isSignupPage = location.pathname === "/signup";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      variant="dark"
      bg={currentUser ? "dark" : null}
    >
      {currentUser ? (
        <>
          <Navbar.Brand
            as={Link}
            to="/"
            className="brand brand-logged d-flex align-items-center"
          >
            HealthFitness
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              {/* use eventKey to show navbar style from react bootstrap */}
              <Nav.Link as={Link} to="/fitness" eventKey="1">
                Fitness
              </Nav.Link>
              <Nav.Link as={Link} to="/fitness/history" eventKey="2">
                Fitness History
              </Nav.Link>
              <Nav.Link as={Link} to="/healthhomepage" eventKey="4">
                Health Tracker
              </Nav.Link>
              <Nav.Link as={Link} to="/friends" eventKey="5">
                Friends
              </Nav.Link>              <Nav.Link as={Link} to="/profile" eventKey="4">
                Profile
              </Nav.Link>
              <Nav.Link onClick={handleSignOut}>Logout </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </>
      ) : (
        <Navbar.Brand
          as={Link}
          to="/"
          className={`brand brand-new mx-auto d-flex align-items-center
        ${isLoginPage || isSignupPage ? "brand-text" : null}`}
        >
          HealthFitness
        </Navbar.Brand>
      )}
    </Navbar>
  );
}
