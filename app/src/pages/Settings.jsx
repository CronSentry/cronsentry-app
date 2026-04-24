import { useState } from "react";
import { useAuth } from "../store/authStore.jsx";
import Layout from "../components/Layout.jsx";
import { updateSettingsApi } from "../api/settingsApi.js";

function Settings() {
    const { auth, login } = useAuth();

    const [alertEmail, setAlertEmail] = useState(auth?.alertEmail || auth?.email || "");
    const [orgName, setOrgName] = useState(auth?.organizationName || "");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            await updateSettingsApi({
                organizationName: orgName,
                alertEmail,
            });

            // Update auth store with new org name
            login({
                ...auth,
                organizationName: orgName,
                alertEmail: alertEmail,
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-lg">

                <h1 className="text-lg font-medium text-gray-900 mb-6">Settings</h1>

                {/* Organization settings */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                    <h2 className="text-sm font-medium text-gray-700 mb-4">Organization</h2>

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                            Settings saved successfully.
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Org name */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1.5">
                                Organization name
                            </label>
                            <input
                                type="text"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white text-gray-900"
                            />
                        </div>

                        {/* Alert email */}
                        <div className="mb-5">
                            <label className="block text-sm text-gray-600 mb-1.5">
                                Alert email
                            </label>
                            <input
                                type="email"
                                value={alertEmail}
                                onChange={(e) => setAlertEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white text-gray-900"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                All down and recovery alerts go to this address.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Saving..." : "Save changes"}
                        </button>

                    </form>
                </div>

                {/* Plan card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                    <h2 className="text-sm font-medium text-gray-700 mb-4">Plan</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-900 capitalize">
                                {auth?.plan || "Free"} plan
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                                Up to 3 monitors included
                            </div>
                        </div>
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            Upgrade
                        </button>
                    </div>
                </div>

                {/* Account card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h2 className="text-sm font-medium text-gray-700 mb-4">Account</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-900">{auth?.email}</div>
                            <div className="text-xs text-gray-400 mt-0.5 capitalize">
                                {auth?.role} · {auth?.organizationName}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
}

export default Settings;