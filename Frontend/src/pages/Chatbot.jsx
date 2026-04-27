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
      const botMessage = { role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div>
      <h2>HelpBot — Safety Assistant</h2>

      <div
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <b>{msg.role === "user" ? "You" : "HelpBot"}:</b> {msg.text}
            <br />
            <br />
          </div>
        ))}
        {loading && <p>HelpBot is typing...</p>}
      </div>

      <br />

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask a safety question..."
      />
      <button onClick={handleSend} disabled={loading}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;
