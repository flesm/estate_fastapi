import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MainAnalis from "./components/MainAnalis.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import News from "./components/News.jsx";
import Profile from "./components/Profile.jsx";
import Specialists from "./components/Specialists.jsx";
import Admin from "./components/Admin.jsx";
import Analis from "./components/Analis.jsx";

function App() {
    return (
        <Router>
                <Routes>
                    {<Route path="/" element={<MainAnalis />} />}
                    {<Route path="/login/" element={<Login />} />}
                    {<Route path="/reg/" element={<Register />} />}
                    {<Route path="/news/" element={<News />} />}
                    {<Route path="/profile/" element={<Profile />} />}
                    {<Route path="/specialists/" element={<Specialists />} />}
                    {<Route path="/admin/" element={<Admin />} />}
                    {<Route path="/analis/" element={<Analis />} />}
                </Routes>
        </Router>
    );
}

export default App;