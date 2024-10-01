import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Friends from "./pages/Friends";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Cardio from "./components/Cardio";
import Fitness from "./pages/Fitness";
import Resistance from "./components/Resistence";
import SingleExercise from "./components/SingleExercise";
import FitnessHistory from "./pages/FitnessHistory";
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route data-testid="home" path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/friends' element={<Friends />} />
          <Route path="/fitness" element={<Fitness />}/>
          <Route path="/fitness/history" element={<FitnessHistory />}/>
          <Route path="/fitness/cardio" element={<Cardio />}/>
          <Route path="/fitness/resistance" element={<Resistance />}/>
          <Route path="/fitness/:type/:id" element={<SingleExercise />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
