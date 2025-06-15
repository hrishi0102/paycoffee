import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Coffee, ArrowLeft, Loader2 } from "lucide-react";

export default function PaymentPage() {
  const { widgetId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [widget, setWidget] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(
    searchParams.get("amount") || ""
  );
  const [customAmount, setCustomAmount] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymanToken, setPaymanToken] = useState(null);

  // OAuth configuration - matching your working example exactly
  const CLIENT_ID = "pm-test-pz5Fd5x6AfdmJuvX_vlZ6pzJ";
  const SCOPES =
    "read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet";
  const REDIRECT_URI = "http://localhost:5173"; // Base domain only, like your example

  useEffect(() => {
    fetchWidget();
    setupPaymanOAuth();
  }, [widgetId]);

  const fetchWidget = async () => {
    try {
      const response = await fetch(`/api/widgets/${widgetId}/public`);
      const data = await response.json();

      if (data.success) {
        setWidget(data.widget);
        const urlAmount = searchParams.get("amount");
        if (
          urlAmount &&
          data.widget.default_amounts.includes(parseFloat(urlAmount))
        ) {
          setSelectedAmount(urlAmount);
        }
      } else {
        setError("Widget not found");
      }
    } catch (error) {
      setError("Failed to load widget");
    } finally {
      setIsLoading(false);
    }
  };

  const setupPaymanOAuth = () => {
    // Listen for OAuth messages - matching your example
    const handleMessage = (event) => {
      console.log("Received message:", event.data);

      if (event.data.type === "payman-oauth-redirect") {
        const url = new URL(event.data.redirectUri);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        console.log("OAuth code:", code);
        console.log("OAuth error:", error);

        if (code) {
          handleOAuthCallback(code);
        } else if (error) {
          console.error("OAuth error:", error);
          setError("OAuth authorization failed: " + error);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  };

  const handleOAuthCallback = async (code) => {
    try {
      console.log("🔄 Exchanging code for token...");

      const response = await fetch("/api/auth/payman/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      console.log("Token exchange response:", data);

      if (data.success) {
        console.log("✅ Token exchange successful!");
        setPaymanToken(data.accessToken);
        setError("");
      } else {
        setError("Authentication failed: " + data.error);
      }
    } catch (error) {
      console.error("Token exchange error:", error);
      setError("Authentication failed");
    }
  };

  const initiatePaymanAuth = () => {
    // Store current widget ID in sessionStorage so we can return to this page
    sessionStorage.setItem("payman_payment_widget_id", widgetId);
    sessionStorage.setItem(
      "payman_payment_amount",
      selectedAmount === "custom" ? customAmount : selectedAmount
    );
    sessionStorage.setItem("payman_payment_supporter", supporterName);
    sessionStorage.setItem("payman_payment_message", message);

    // Load Payman script dynamically - matching your example approach
    const existingScript = document.getElementById("payman-script");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = "payman-script";
    script.src = "https://app.paymanai.com/js/pm.js";
    script.setAttribute("data-client-id", CLIENT_ID);
    script.setAttribute("data-scopes", SCOPES);
    script.setAttribute("data-redirect-uri", REDIRECT_URI); // Base domain only
    script.setAttribute("data-target", "#payman-connect-hidden");
    script.setAttribute("data-dark-mode", "false");
    script.setAttribute("strategy", "popup");
    script.setAttribute(
      "data-styles",
      JSON.stringify({
        borderRadius: "8px",
        fontSize: "16px",
        padding: "12px 24px",
      })
    );

    // Add hidden div for Payman button
    let hiddenDiv = document.getElementById("payman-connect-hidden");
    if (!hiddenDiv) {
      hiddenDiv = document.createElement("div");
      hiddenDiv.id = "payman-connect-hidden";
      hiddenDiv.style.display = "none";
      document.body.appendChild(hiddenDiv);
    }

    document.body.appendChild(script);

    // Trigger the OAuth after script loads
    setTimeout(() => {
      const paymanButton = hiddenDiv.querySelector("button");
      if (paymanButton) {
        paymanButton.click();
      } else {
        console.error("Payman button not found");
        setError("Failed to initialize Payman OAuth");
      }
    }, 1000);
  };

  const handlePayment = async () => {
    const amount = selectedAmount === "custom" ? customAmount : selectedAmount;

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please select or enter a valid amount");
      return;
    }

    if (!paymanToken) {
      setError("");
      initiatePaymanAuth();
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      console.log("🔄 Processing payment...");
      const response = await fetch(`/api/payments/${widgetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          supporterToken: paymanToken,
          supporterName: supporterName || "Anonymous",
          message,
        }),
      });

      const data = await response.json();
      console.log("Payment response:", data);

      if (data.success) {
        console.log("✅ Payment successful!");
        // Clear session storage
        sessionStorage.removeItem("payman_payment_widget_id");
        sessionStorage.removeItem("payman_payment_amount");
        sessionStorage.removeItem("payman_payment_supporter");
        sessionStorage.removeItem("payman_payment_message");

        const originalSite = searchParams.get("return_url");
        if (originalSite) {
          window.location.href = `${originalSite}?payment=success`;
        } else {
          navigate(`/payment-success/${widgetId}?amount=${amount}`);
        }
      } else {
        setError(data.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if we're returning from OAuth and have session data
  useEffect(() => {
    const storedWidgetId = sessionStorage.getItem("payman_payment_widget_id");
    const storedAmount = sessionStorage.getItem("payman_payment_amount");
    const storedSupporter = sessionStorage.getItem("payman_payment_supporter");
    const storedMessage = sessionStorage.getItem("payman_payment_message");

    if (storedWidgetId === widgetId && storedAmount) {
      setSelectedAmount(storedAmount);
      setSupporterName(storedSupporter || "");
      setMessage(storedMessage || "");
    }
  }, [widgetId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error && !widget) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center py-8">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Payment Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Coffee className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">{widget.title}</CardTitle>
            {widget.description && (
              <CardDescription className="text-base">
                {widget.description}
              </CardDescription>
            )}
            <div className="text-sm text-gray-600 mt-2">
              Supporting: {widget.owner.display_name}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Choose Amount</Label>

              {/* Preset Amounts */}
              <div className="grid grid-cols-3 gap-2">
                {widget.default_amounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={
                      selectedAmount === amount.toString()
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setSelectedAmount(amount.toString())}
                    className="h-12"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              {/* Custom Amount */}
              {widget.allow_custom_amount && (
                <div className="space-y-2">
                  <Button
                    variant={
                      selectedAmount === "custom" ? "default" : "outline"
                    }
                    onClick={() => setSelectedAmount("custom")}
                    className="w-full"
                  >
                    Custom Amount
                  </Button>

                  {selectedAmount === "custom" && (
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Supporter Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supporterName">Your Name (Optional)</Label>
                <Input
                  id="supporterName"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  placeholder="Anonymous"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Say something nice..."
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            {/* Success State */}
            {paymanToken && !isProcessing && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded">
                ✅ Connected to Payman! Ready to send payment.
              </div>
            )}

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isProcessing || (!selectedAmount && !customAmount)}
              className="w-full h-12 text-lg"
              style={{ backgroundColor: widget.primary_color }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : !paymanToken ? (
                <>Connect Payman & Pay</>
              ) : (
                <>
                  {widget.button_text} ($
                  {selectedAmount === "custom"
                    ? customAmount || "0"
                    : selectedAmount || "0"}
                  )
                </>
              )}
            </Button>

            {/* Payment Info */}
            <div className="text-center text-xs text-gray-500">
              <p>Powered by Payman • Secure payments</p>
              {!paymanToken && (
                <p className="mt-1">
                  You'll authorize the payment with your Payman account
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
