import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Friends from "./pages/Friends";
import User from "./pages/UserProfile";
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/userprofile' element={<User />} />
        <Route path='/friends' element={<Friends />} />
      </Routes>
    </BrowserRouter>
  );
}
