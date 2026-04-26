import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore.jsx";
import { getMonitorsApi, deleteMonitorApi } from "../api/monitorApi.js";
import Layout from "../components/Layout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import CreateMonitorModal from "../components/CreateMonitorModal.jsx";
import { formatRelativeTime } from "../utils/dateUtils.js";

function Dashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Auto refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMonitors();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchMonitors = async (silent = false) => {
    try {
      setError(null);
      if (!silent) setLoading(true);
      const data = await getMonitorsApi();
      setMonitors(data);
    } catch (err) {
      setError("Failed to load monitors.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Fetch on mount — show loading
  useEffect(() => {
    fetchMonitors();
  }, []);

  // Auto refresh — silent, no loading spinner
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMonitors(true);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMonitorCreated = () => {
    setShowCreateModal(false);
    fetchMonitors();
  };

  const stats = {
    total: monitors.length,
    healthy: monitors.filter(m => m.status === "Healthy").length,
    down: monitors.filter(m => m.status === "Down").length,
    waiting: monitors.filter(m => m.status === "Waiting").length,
  };

  return (
    <Layout>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Total monitors</div>
          <div className="text-2xl font-medium text-gray-900">
            {stats.total}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Healthy</div>
          <div className="text-2xl font-medium text-green-700">
            {stats.healthy}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Down</div>
          <div className="text-2xl font-medium text-red-700">{stats.down}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Waiting</div>
          <div className="text-2xl font-medium text-gray-500">
            {stats.waiting}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-medium text-gray-900">Monitors</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New monitor
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-sm text-gray-400 py-12 text-center">
          Loading monitors...
        </div>
      ) : error ? (
        <div className="text-sm text-red-500 py-12 text-center">{error}</div>
      ) : monitors.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
          <p className="text-gray-400 text-sm mb-4">No monitors yet.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition-colors">
            Create your first monitor
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {monitors.map((monitor, index) => (
            <div
              key={monitor.id}
              onClick={() => navigate(`/monitors/${monitor.id}`)}
              className={`flex items-center px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                index !== monitors.length - 1 ? "border-b border-gray-100" : ""
              }`}>
              {/* Status dot */}
              <div
                className={`w-2 h-2 rounded-full mr-4 flex-shrink-0 ${
                  monitor.status === "Healthy"
                    ? "bg-green-500"
                    : monitor.status === "Down"
                      ? "bg-red-500"
                      : monitor.status === "Late"
                        ? "bg-amber-500"
                        : "bg-gray-300"
                }`}
              />

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {monitor.name}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  every {monitor.intervalMinutes} min · grace{" "}
                  {monitor.graceMinutes} min
                </div>
              </div>

              {/* Badge */}
              <StatusBadge status={monitor.status} />

              {/* Last ping */}
              <div className="text-xs text-gray-400 ml-4 min-w-16 text-right">
                {formatRelativeTime(monitor.lastPingedAt)}
              </div>

              {/* Arrow */}
              <svg
                className="ml-3 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Create Monitor Modal */}
      {showCreateModal && (
        <CreateMonitorModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleMonitorCreated}
        />
      )}
    </Layout>
  );
}

export default Dashboard;