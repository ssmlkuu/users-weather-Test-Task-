import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Saved from "./routes/Saved";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="mx-auto max-w-5xl p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
        </Routes>
      </main>
    </div>
  );
}
