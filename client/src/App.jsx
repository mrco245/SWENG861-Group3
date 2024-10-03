import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Friends from "./pages/Friends";
import Health from "./pages/Health";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HealthHomepage from "./pages/HealthHomepage";
import BMIHistory from "./pages/BMIHistory";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route data-testid="home" path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/friends' element={<Friends />} />
        <Route path='/health' element={<Health />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/healthhomepage' element={<HealthHomepage />} />
        <Route path='/bmihistory' element={<BMIHistory />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
