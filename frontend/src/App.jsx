import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MainAnalis from "./components/MainAnalis.jsx";
import Login from "./components/Login.jsx";


function App() {
    return (
        <Router>

                <Routes>

                    {<Route path="/" element={<MainAnalis />} />}
                    {<Route path="/login/" element={<Login />} />}

                </Routes>

        </Router>
    );
}

export default App;