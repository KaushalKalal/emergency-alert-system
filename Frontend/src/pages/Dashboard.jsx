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
      <h2 className="mb-4">Emergency Alerts Dashboard</h2>

      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.urgency}
            onChange={(e) =>
              setFilters({ ...filters, urgency: e.target.value })
            }
          >
            <option value="">All Urgency</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchAlerts}>
            Refresh
          </button>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading alerts...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && alerts.length === 0 && (
        <div className="alert alert-warning">No alerts found</div>
      )}

      {!loading && alerts.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Message</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Created</th>
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
                  <td>
                    <span
                      className={`badge bg-${
                        alert.urgency === "HIGH"
                          ? "danger"
                          : alert.urgency === "MEDIUM"
                            ? "warning"
                            : "success"
                      }`}
                    >
                      {alert.urgency}
                    </span>
                  </td>
                  <td>{alert.status}</td>
                  <td>{new Date(alert.createdAt).toLocaleString()}</td>
                  <td>
                    {alert.status === "active" ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleResolve(alert._id)}
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-success">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
