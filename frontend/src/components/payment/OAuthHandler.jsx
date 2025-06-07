import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    const storedWidgetId = sessionStorage.getItem("payman_payment_widget_id");

    if (code && storedWidgetId) {
      // Redirect back to payment page with the code
      navigate(`/pay/${storedWidgetId}?code=${code}`);
    } else if (error) {
      console.error("OAuth error:", error);
      if (storedWidgetId) {
        navigate(`/pay/${storedWidgetId}?error=${error}`);
      } else {
        navigate("/");
      }
    } else {
      // No stored widget ID, go to home
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Completing authentication...</div>
    </div>
  );
}
