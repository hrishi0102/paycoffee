import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Coffee } from "lucide-react";

export default function PaymentSuccess() {
  const { widgetId } = useParams();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-lg">Thank you for your support!</p>
            {amount && (
              <p className="text-gray-600">
                Your payment of <strong>${amount}</strong> has been sent
                successfully.
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button
              onClick={() => window.close() || window.history.back()}
              className="w-full"
            >
              Close
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <p>Powered by PayCoffee • Built with Payman</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
