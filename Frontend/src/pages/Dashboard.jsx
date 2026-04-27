import { useState, useEffect } from "react";
import { getAlerts, resolveAlert } from "../api/alertApi";
import socket from "../socket/socket";

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    urgency: "",
    status: "",
  });

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = {};
      if (filters.urgency) activeFilters.urgency = filters.urgency;
      if (filters.status) activeFilters.status = filters.status;

      const data = await getAlerts(activeFilters);
      setAlerts(data.data);
    } catch (err) {
      setError("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);
      fetchAlerts();
    } catch (err) {
      alert("Failed to resolve alert");
    }
  };

  useEffect(() => {
    socket.on("newAlert", (data) => {
      alert(`New ${data.urgency} Alert from ${data.name}: ${data.message}`);
      fetchAlerts();
    });

    socket.on("alertResolved", (data) => {
      alert(`Alert from ${data.name} has been resolved`);
      fetchAlerts();
    });

    return () => {
      socket.off("newAlert");
      socket.off("alertResolved");
    };
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [filters]);

  return (
    <div>
      <h2>Emergency Alerts Dashboard</h2>

      <div>
        <label>Filter by Urgency: </label>
        <select
          value={filters.urgency}
          onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
        >
          <option value="">All</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        &nbsp;&nbsp;
        <label>Filter by Status: </label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
        &nbsp;&nbsp;
        <button onClick={fetchAlerts}>Refresh</button>
      </div>

      <br />

      {loading && <p>Loading alerts...</p>}

      {error && <p>{error}</p>}

      {!loading && <p>Total Alerts: {alerts.length}</p>}

      {!loading && alerts.length === 0 && <p>No alerts found</p>}

      {!loading && alerts.length > 0 && (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Message</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert._id}>
                <td>{alert.name}</td>
                <td>{alert.phone}</td>
                <td>{alert.location}</td>
                <td>{alert.message}</td>
                <td>{alert.urgency}</td>
                <td>{alert.classifiedBy}</td>
                <td>{alert.status}</td>
                <td>{new Date(alert.createdAt).toLocaleString()}</td>
                <td>
                  {alert.status === "active" ? (
                    <button onClick={() => handleResolve(alert._id)}>
                      Resolve
                    </button>
                  ) : (
                    "Resolved"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
