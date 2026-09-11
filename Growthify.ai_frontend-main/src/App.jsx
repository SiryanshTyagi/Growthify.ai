import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Context } from "./context/AuthContext.jsx";
import "./App.css";

const LoadingScreen = () => (
  <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0d1117", color: "#E6F4F3" }}>
    Loading...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useContext(Context);

  if (isAuthLoading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useContext(Context);

  if (isAuthLoading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={(
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/login"
          element={(
            <AuthRoute>
              <Login />
            </AuthRoute>
          )}
        />
        <Route
          path="/register"
          element={(
            <AuthRoute>
              <Register />
            </AuthRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
