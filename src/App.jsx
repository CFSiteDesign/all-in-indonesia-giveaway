import { BrowserRouter, Routes, Route } from "react-router-dom";
import Giveaway from "./pages/Giveaway.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Giveaway />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
