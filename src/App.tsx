import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Swap } from "./pages/Swap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
