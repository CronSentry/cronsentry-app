import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore.jsx";
import { getAlertsApi, markNotificationsSeenApi } from "../api/alertApi.js";
import { formatRelativeTime } from "../utils/dateUtils.js";

function Layout({ children }) {
    const { auth, login, logout } = useAuth();
    const navigate = useNavigate();
    const [bellOpen, setBellOpen] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [alertsLoading, setAlertsLoading] = useState(false);
    const [lastSeen, setLastSeen] = useState(auth?.lastSeenNotificationsAt || null);
    const bellRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await getAlertsApi();
                setAlerts(data);
            } catch (err) {
                console.error("Failed to fetch alerts", err);
            }
        };
        fetchAlerts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setBellOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleBellClick = async () => {
    const opening = !bellOpen;
    setBellOpen(opening);

    if (opening) {
        // Fetch alerts if not yet fetched
        if (alerts.length === 0) {
            setAlertsLoading(true);
            try {
                const data = await getAlertsApi();
                setAlerts(data);
            } catch (err) {
                console.error("Failed to fetch alerts", err);
            } finally {
                setAlertsLoading(false);
            }
        }

        if (unreadCount > 0) {
            try {
                await markNotificationsSeenApi();
                const now = new Date().toISOString();
                setLastSeen(now);
                login({ ...auth, lastSeenNotificationsAt: now });
            } catch (err) {
                console.error("Failed to mark notifications as seen", err);
            }
        }
    }
};

    const unreadCount = alerts.filter(a => {
        if (!lastSeen) return true;
        return new Date(a.sentAt) > new Date(lastSeen);
    }).length;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* Sidebar */}
            <aside className="w-52 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
                <div className="px-4 py-5 border-b border-slate-800">
                    <div className="text-base font-medium text-white">CronSentry</div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                        {auth?.organizationName}
                    </div>
                </div>

                <nav className="flex-1 px-2 py-3">
                    <div className="text-xs font-medium text-slate-500 px-2 mb-2 uppercase tracking-wider">
                        Main
                    </div>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                                isActive
                                    ? "bg-violet-600 text-white font-medium"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                            }`
                        }
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        Dashboard
                    </NavLink>

                    <div className="text-xs font-medium text-slate-500 px-2 mb-2 mt-4 uppercase tracking-wider">
                        Account
                    </div>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                                isActive
                                    ? "bg-violet-600 text-white font-medium"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                            }`
                        }
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        Settings
                    </NavLink>
                </nav>

                <div className="px-3 py-3 border-t border-slate-800">
                    <div className="text-xs text-slate-400 truncate mb-2">{auth?.email}</div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-[55px] bg-white border-b border-gray-200 flex items-center justify-end px-6 flex-shrink-0">
                    <div className="flex items-center gap-3">

                        {/* Bell */}
                        <div className="relative" ref={bellRef}>
                            <button
                                onClick={handleBellClick}
                                className="relative w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-medium">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Bell dropdown */}
                            {bellOpen && (
                                <div className="absolute right-0 top-10 w-72 bg-white border border-gray-200 rounded-xl z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Recent notifications
                                        </p>
                                    </div>

                                    {alertsLoading ? (
                                        <div className="px-4 py-6 text-center text-sm text-gray-400">
                                            Loading...
                                        </div>
                                    ) : alerts.length === 0 ? (
                                        <div className="px-4 py-6 text-center text-sm text-gray-400">
                                            No notifications yet.
                                        </div>
                                    ) : (
                                        <div className="max-h-80 overflow-y-auto">
                                            {alerts.map((alert, index) => {
                                                const isUnread = !lastSeen || new Date(alert.sentAt) > new Date(lastSeen);
                                                return (
                                                    <div
                                                        key={alert.id}
                                                        className={`px-4 py-3 ${
                                                            index !== alerts.length - 1 ? "border-b border-gray-100" : ""
                                                        } ${isUnread ? "bg-gray-50" : ""}`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                {isUnread && (
                                                                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 mb-0.5 align-middle" />
                                                                )}
                                                                <p className={`text-sm font-medium truncate inline ${
                                                                    alert.alertType === "Down"
                                                                        ? "text-red-600"
                                                                        : "text-green-700"
                                                                }`}>
                                                                    {alert.monitorName} is {alert.alertType === "Down" ? "down" : "recovered"}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-0.5">
                                                                    {formatRelativeTime(alert.sentAt)}
                                                                </p>
                                                            </div>
                                                            <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                                                                alert.alertType === "Down"
                                                                    ? "bg-red-50 text-red-700"
                                                                    : "bg-green-50 text-green-700"
                                                            }`}>
                                                                {alert.alertType}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                            {auth?.email?.charAt(0).toUpperCase()}
                        </div>

                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;