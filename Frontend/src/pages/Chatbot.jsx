import { useState } from "react";
import { sendMessage } from "../api/chatApi";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I am HelpBot. Ask me any safety related questions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(input);

      if (!data || !data.reply) {
        throw new Error("No response");
      }

      const botMessage = { role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      let errorMessage =
        "External API limit is reached. Please try again later.";

      if (
        err.response?.status === 429 ||
        err.message?.toLowerCase().includes("limit")
      ) {
        errorMessage = "External API limit is reached. Please try again later.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setMessages((prev) => [...prev, { role: "bot", text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="card shadow p-3">
      <h4 className="mb-3">HelpBot</h4>

      <div
        className="border rounded p-3 mb-3"
        style={{ height: "300px", overflowY: "auto" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.role === "user" ? "text-end" : "text-start"
            }`}
          >
            <span
              className={`badge ${
                msg.role === "user" ? "bg-primary" : "bg-secondary"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p>Typing...</p>}
      </div>

      <div className="input-group">
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask something..."
        />
        <button className="btn btn-dark" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
