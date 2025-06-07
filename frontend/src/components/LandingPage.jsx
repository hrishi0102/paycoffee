import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Coffee, CreditCard, Code, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">PayCoffee</span>
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Accept payments with <span className="text-blue-600">Payman</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create embeddable payment widgets for your website. Let supporters tip
          you directly using their Payman wallets.
        </p>
        <div className="space-x-4">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Accepting Payments
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CreditCard className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Easy Payments</CardTitle>
              <CardDescription>
                Direct wallet-to-wallet payments powered by Payman
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Simple Integration</CardTitle>
              <CardDescription>
                Copy-paste embed code to add payment buttons to any website
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Instant Setup</CardTitle>
              <CardDescription>
                Get started in minutes with just your Payman paytag
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
