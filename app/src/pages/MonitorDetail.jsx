import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMonitorByIdApi, deleteMonitorApi, regenerateKeyApi, updateMonitorApi } from "../api/monitorApi.js";
import Layout from "../components/Layout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

function MonitorDetail() {
    const { monitorId } = useParams();
    const navigate = useNavigate();

    const [monitor, setMonitor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [newPingUrl, setNewPingUrl] = useState(null);
    const [copied, setCopied] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editInterval, setEditInterval] = useState("");
    const [editGrace, setEditGrace] = useState("");
    const [updating, setUpdating] = useState(false);

    const fetchMonitor = async () => {
        try {
            setError(null);
            const data = await getMonitorByIdApi(monitorId);
            setMonitor(data);
        } catch (err) {
            setError("Monitor not found.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonitor();
    }, [monitorId]);

    const handleEditStart = () => {
        setEditName(monitor.name);
        setEditInterval(monitor.intervalMinutes);
        setEditGrace(monitor.graceMinutes);
        setEditing(true);
    };

    const handleEditCancel = () => {
        setEditing(false);
    };

    const handleEditSave = async () => {
        setUpdating(true);
        try {
            await updateMonitorApi(monitorId, {
                name: editName,
                intervalMinutes: Number(editInterval),
                graceMinutes: Number(editGrace),
            });
            setEditing(false);
            fetchMonitor();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update monitor.");
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            return;
        }
        setDeleting(true);
        try {
            await deleteMonitorApi(monitorId);
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to delete monitor.");
            setDeleting(false);
        }
    };

    const handleRegenerateKey = async () => {
        setRegenerating(true);
        try {
            const newUrl = await regenerateKeyApi(monitorId);
            setNewPingUrl(newUrl);
        } catch (err) {
            setError("Failed to regenerate key.");
        } finally {
            setRegenerating(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "Never";
        return new Date(dateStr).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-sm text-gray-400 py-12 text-center">Loading...</div>
            </Layout>
        );
    }

    if (error && !monitor) {
        return (
            <Layout>
                <div className="text-sm text-red-500 py-12 text-center">{error}</div>
            </Layout>
        );
    }

    return (
        <Layout>

            {/* Back button */}
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back to dashboard
            </button>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1 mr-4">
                    {editing ? (
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-lg font-medium text-gray-900 border border-gray-300 rounded-lg px-3 py-1 outline-none focus:border-gray-400 w-full mb-2"
                        />
                    ) : (
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-lg font-medium text-gray-900">{monitor.name}</h1>
                            <StatusBadge status={monitor.status} />
                        </div>
                    )}

                    {editing ? (
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-500">Every</label>
                                <input
                                    type="number"
                                    value={editInterval}
                                    onChange={(e) => setEditInterval(e.target.value)}
                                    min={1}
                                    className="w-20 text-sm border border-gray-300 rounded-lg px-2 py-1 outline-none focus:border-gray-400"
                                />
                                <label className="text-xs text-gray-500">min</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-500">Grace</label>
                                <input
                                    type="number"
                                    value={editGrace}
                                    onChange={(e) => setEditGrace(e.target.value)}
                                    min={1}
                                    className="w-20 text-sm border border-gray-300 rounded-lg px-2 py-1 outline-none focus:border-gray-400"
                                />
                                <label className="text-xs text-gray-500">min</label>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">
                            Every {monitor.intervalMinutes} min · Grace {monitor.graceMinutes} min · Last ping {formatDate(monitor.lastPingedAt)}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {editing ? (
                        <>
                            <button
                                onClick={handleEditCancel}
                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                disabled={updating}
                                className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                            >
                                {updating ? "Saving..." : "Save changes"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleEditStart}
                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleRegenerateKey}
                                disabled={regenerating}
                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                {regenerating ? "Regenerating..." : "Regenerate key"}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors disabled:opacity-50 ${
                                    deleteConfirm
                                        ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                                        : "border-gray-200 text-red-500 hover:bg-red-50"
                                }`}
                            >
                                {deleting ? "Deleting..." : deleteConfirm ? "Confirm delete" : "Delete"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* New ping URL after regenerate */}
            {newPingUrl && (
                <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-medium text-amber-700 mb-2">
                        New ping URL — copy it now, it won't be shown again
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-lg font-mono text-xs text-gray-700 break-all">
                            {newPingUrl}
                        </div>
                        <button
                            onClick={() => handleCopy(newPingUrl)}
                            className="flex-shrink-0 px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white hover:bg-amber-50 transition-colors"
                        >
                            {copied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Two column layout */}
            <div className="grid grid-cols-3 gap-5">

                {/* Ping history — 2/3 width */}
                <div className="col-span-2">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100">
                            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Recent pings
                            </h2>
                        </div>
                        {monitor.recentPings && monitor.recentPings.length > 0 ? (
                            monitor.recentPings.map((ping, index) => (
                                <div
                                    key={ping.id}
                                    className={`flex items-center justify-between px-5 py-3 text-sm ${
                                        index !== monitor.recentPings.length - 1
                                            ? "border-b border-gray-100"
                                            : ""
                                    }`}
                                >
                                    <span className="text-gray-700">{formatDate(ping.pingedAt)}</span>
                                    <span className="text-xs text-gray-400 font-mono">{ping.sourceIp}</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-sm text-gray-400">
                                No pings yet. Add the ping URL to your cron job.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column — 1/3 width */}
                <div className="col-span-1 flex flex-col gap-5">

                    {/* Monitor info */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100">
                            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Monitor info
                            </h2>
                        </div>
                        <div className="px-5 py-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                                <span className="text-gray-400">Interval</span>
                                <span className="text-gray-900">{monitor.intervalMinutes} min</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                                <span className="text-gray-400">Grace period</span>
                                <span className="text-gray-900">{monitor.graceMinutes} min</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                                <span className="text-gray-400">Status</span>
                                <StatusBadge status={monitor.status} />
                            </div>
                            <div className="flex justify-between items-center py-2 text-sm">
                                <span className="text-gray-400">Created</span>
                                <span className="text-gray-900">{formatDate(monitor.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Alert history */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100">
                            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Alert history
                            </h2>
                        </div>
                        {monitor.recentAlerts && monitor.recentAlerts.length > 0 ? (
                            monitor.recentAlerts.map((alert, index) => (
                                <div
                                    key={alert.id}
                                    className={`flex items-center justify-between px-5 py-3 ${
                                        index !== monitor.recentAlerts.length - 1
                                            ? "border-b border-gray-100"
                                            : ""
                                    }`}
                                >
                                    <div>
                                        <div className={`text-xs font-medium ${
                                            alert.alertType === "Down" ? "text-red-600" : "text-green-700"
                                        }`}>
                                            {alert.alertType}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            {formatDate(alert.sentAt)}
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        alert.alertType === "Down"
                                            ? "bg-red-50 text-red-700"
                                            : "bg-green-50 text-green-700"
                                    }`}>
                                        {alert.alertType}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-6 text-center text-sm text-gray-400">
                                No alerts yet.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default MonitorDetail;