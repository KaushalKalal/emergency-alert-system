import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SendAlert from "./pages/SendAlert";
import Chatbot from "./pages/Chatbot";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid px-4">
          <NavLink className="navbar-brand fw-bold" to="/">
            Alert System
          </NavLink>

          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav ms-auto gap-3">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `nav-link px-3 ${
                      isActive ? "active-link" : "text-light"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/send-alert"
                  className={({ isActive }) =>
                    `nav-link px-3 ${
                      isActive ? "active-link" : "text-light"
                    }`
                  }
                >
                  Send Alert
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/chatbot"
                  className={({ isActive }) =>
                    `nav-link px-3 ${
                      isActive ? "active-link" : "text-light"
                    }`
                  }
                >
                  Chatbot
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/send-alert" element={<SendAlert />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;