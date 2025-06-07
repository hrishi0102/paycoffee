import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import Dashboard from "./components/dashboard/Dashboard";
import CreateWidget from "./components/dashboard/CreateWidget";
import PaymentPage from "./components/payment/PaymentPage";
import PaymentSuccess from "./components/payment/PaymentSuccess";
import OAuthHandler from "./components/payment/OAuthHandler";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignupPage />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/create-widget"
          element={
            isAuthenticated ? (
              <CreateWidget />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public payment routes */}
        <Route path="/pay/:widgetId" element={<PaymentPage />} />
        <Route path="/payment-success/:widgetId" element={<PaymentSuccess />} />

        {/* OAuth callback handler */}
        <Route path="/oauth/callback" element={<OAuthHandler />} />
      </Routes>
    </Router>
  );
}

export default App;
