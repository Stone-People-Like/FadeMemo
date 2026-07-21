import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import DownloadPage from "./components/DownloadPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/download/:platform" element={<DownloadPage />} />
      </Routes>
    </HashRouter>
  );
}