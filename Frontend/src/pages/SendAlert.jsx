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
    <div className="card p-4 shadow">
      <h3 className="mb-3">Send Emergency Alert</h3>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
        />

        <input
          className="form-control mb-3"
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone number"
        />

        <input
          className="form-control mb-3"
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
        />

        <textarea
          className="form-control mb-3"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Describe emergency..."
          rows={3}
        />

        <button className="btn btn-danger w-100" type="submit">
          {loading ? "Sending..." : "Send Alert"}
        </button>
      </form>

      {response && (
        <div className="alert alert-success mt-3">
          Alert Sent. ID: {response.data.alertId}
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3">{JSON.stringify(error)}</div>
      )}
    </div>
  );
};

export default SendAlert;
