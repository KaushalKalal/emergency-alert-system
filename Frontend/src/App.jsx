
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SendAlert from "./pages/SendAlert";
import Chatbot from "./pages/Chatbot";

const App = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Dashboard</Link>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link to="/send-alert">Send Alert</Link>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link to="/chatbot">Chatbot</Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/send-alert" element={<SendAlert />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
