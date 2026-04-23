import { useState } from "react";
import { createMonitorApi } from "../api/monitorApi.js";

function CreateMonitorModal({ onClose, onCreated }) {
    const [name, setName] = useState("");
    const [intervalMinutes, setIntervalMinutes] = useState(60);
    const [graceMinutes, setGraceMinutes] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [createdMonitor, setCreatedMonitor] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await createMonitorApi({
                name,
                intervalMinutes: Number(intervalMinutes),
                graceMinutes: Number(graceMinutes),
            });
            setCreatedMonitor(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create monitor.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(createdMonitor.pingUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDone = () => {
        onCreated();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30"
                onClick={!createdMonitor ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-md mx-4 p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-medium text-gray-900">
                        {createdMonitor ? "Monitor created" : "New monitor"}
                    </h2>
                    {!createdMonitor && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Step 1 — Form */}
                {!createdMonitor && (
                    <form onSubmit={handleSubmit}>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1.5">
                                Monitor name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Daily Invoice Sender"
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white text-gray-900"
                            />
                        </div>

                        {/* Interval + Grace */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1.5">
                                    Runs every (min)
                                </label>
                                <input
                                    type="number"
                                    value={intervalMinutes}
                                    onChange={(e) => setIntervalMinutes(e.target.value)}
                                    min={1}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1.5">
                                    Grace period (min)
                                </label>
                                <input
                                    type="number"
                                    value={graceMinutes}
                                    onChange={(e) => setGraceMinutes(e.target.value)}
                                    min={1}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                            >
                                {loading ? "Creating..." : "Create monitor"}
                            </button>
                        </div>

                    </form>
                )}

                {/* Step 2 — Ping URL revealed */}
                {createdMonitor && (
                    <div>
                        {/* Success message */}
                        <div className="flex items-center gap-2 mb-5 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 flex-shrink-0">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <p className="text-sm text-green-700">
                                Monitor created successfully.
                            </p>
                        </div>

                        {/* Warning */}
                        <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 flex-shrink-0 mt-0.5">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                <line x1="12" y1="9" x2="12" y2="13"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                            <p className="text-xs text-amber-700">
                                Copy your ping URL now. The key will never be shown again. If you lose it, regenerate from the monitor detail page.
                            </p>
                        </div>

                        {/* Ping URL */}
                        <div className="mb-5">
                            <label className="block text-sm text-gray-600 mb-1.5">
                                Your ping URL
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-700 break-all">
                                    {createdMonitor.pingUrl}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="flex-shrink-0 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
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

                        {/* How to use */}
                        <div className="mb-5">
                            <label className="block text-sm text-gray-600 mb-1.5">
                                Add to your cron job
                            </label>
                            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-700">
                                curl "{createdMonitor.pingUrl}"
                            </div>
                        </div>

                        {/* Done */}
                        <button
                            onClick={handleDone}
                            className="w-full py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateMonitorModal;