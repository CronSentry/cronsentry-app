import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/authStore.jsx";
import { loginApi } from "../api/authApi.js";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await loginApi(email, password);
            login(data);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-medium text-gray-900">CronSentry</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-8">

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white text-gray-900"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label className="block text-sm text-gray-600 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white text-gray-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        // Eye off icon
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        // Eye icon
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                    </form>
                </div>

                {/* Register link */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-gray-900 font-medium hover:underline">
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;