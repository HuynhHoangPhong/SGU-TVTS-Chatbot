import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdmissionSupportPage from "./pages/AdmissionSupportPage";
import ScoreCalculatorPage from "./pages/ScoreCalculatorPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AdmissionSupportPage />} />
                <Route path="/admission-support" element={<AdmissionSupportPage />} />
                <Route path="/score-calculator" element={<ScoreCalculatorPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
