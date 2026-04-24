import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store/authStore.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MonitorDetail from "./pages/MonitorDetail.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  const { auth } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={auth ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        <Route
          path="/register"
          element={auth ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitors/:monitorId"
          element={
            <ProtectedRoute>
              <MonitorDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={auth ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
