import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";  // Default import of App
import Hospitalinfo from "./Components/Hospitalinfo";  // Import of Hospitalinfo
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/details" element={<Hospitalinfo />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
