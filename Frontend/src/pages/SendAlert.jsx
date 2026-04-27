import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendAlert } from "../api/alertApi";

const SendAlert = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    message: "",
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await sendAlert(form);
      setResponse(data);
      setForm({ name: "", phone: "", location: "", message: "" });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Send Emergency Alert</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>
        <br />

        <div>
          <label>Phone</label>
          <br />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10 digit phone number"
          />
        </div>
        <br />

        <div>
          <label>Location</label>
          <br />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Your location"
          />
        </div>
        <br />

        <div>
          <label>Emergency Message</label>
          <br />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Describe your emergency..."
            rows={4}
            cols={40}
          />
        </div>
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Alert"}
        </button>
      </form>

      {response && (
        <div>
          <h4>Alert Sent Successfully!</h4>
          <p>Alert ID: {response.data.alertId}</p>
          <p>Urgency: {response.data.urgency}</p>
          <p>Redirecting to dashboard...</p>
        </div>
      )}

      {error && (
        <div>
          <h4>Error:</h4>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SendAlert;
